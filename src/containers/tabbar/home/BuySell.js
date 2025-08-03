import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';


import { SvgUri } from 'react-native-svg';

// Local import
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import CText from '../../../components/common/CText';
import { styles } from '../../../themes';
import { getHeight, moderateScale } from '../../../common/constants';
import CDivider from '../../../components/common/CDivider';
import CButton from '../../../components/common/CButton';
import KeyBoardAvoidWrapper from '../../../components/common/KeyBoardAvoidWrapper';
import typography from '../../../themes/typography';
import { StackNav } from '../../../navigation/NavigationKeys';
import SwapService from '../../../services/SwapService';
import { useAccount } from '../../../providers/AccountProvider';

export default function BuySell({ navigation, route }) {
  const { item } = route?.params;
  const colors = useSelector(state => state.theme.theme);
  const { currentAccount } = useAccount();
  const [amount, setAmount] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quoteData, setQuoteData] = useState(null);
  const [error, setError] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);
  const [balanceUSD, setBalanceUSD] = useState(null);

  useEffect(() => {
    // Check token balance when in sell mode
    const checkBalance = async () => {
      if (!item?.isBuy && currentAccount?.pubkey && item?.tokenAddress) {
        try {
          const balance = await SwapService.checkTokenBalance(
            currentAccount.pubkey,
            item.tokenAddress
          );
          setTokenBalance(balance);
          console.log('Token balance:', balance);
          
          // Get USD value of the balance
          if (balance && balance.balance !== '0') {
            try {
              const quote = await SwapService.getQuote(
                item.tokenAddress,
                SwapService.getTokenMint('USDC'),
                balance.balance,
                50
              );
              const usdValue = parseFloat(quote.outAmount) / 1000000; // USDC has 6 decimals
              setBalanceUSD(usdValue);
            } catch (err) {
              console.log('Could not get USD value');
            }
          } else {
            setBalanceUSD(0);
          }
        } catch (err) {
          console.error('Error checking balance:', err);
          setTokenBalance({ balance: '0', decimals: 9, uiAmount: 0 });
          setBalanceUSD(0);
        }
      }
    };
    checkBalance();
  }, [item?.isBuy, currentAccount?.pubkey, item?.tokenAddress]);

  const onFocusTextInput = () => setIsFocused(true);
  const onBlurTextInput = () => setIsFocused(false);
  const onChangeText = text => {
    setAmount(text);
    setError(null);
  };

  const onPressDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log({ amount, item })

      // Validate token address
      if (!item?.tokenAddress) {
        throw new Error('Token address not found');
      }

      let inputMint, outputMint, amountInLamports;

      if (item?.isBuy) {
        // For buy: USDC -> Token
        inputMint = SwapService.getTokenMint('USDC');
        outputMint = item?.tokenAddress;
        amountInLamports = parseFloat(amount) * 1000000; // USDC has 6 decimals
      } else {
        // For sell: Token -> USDC
        inputMint = item?.tokenAddress;
        outputMint = SwapService.getTokenMint('USDC');

        // Check if user has any tokens
        if (!tokenBalance || tokenBalance.balance === '0' || tokenBalance.uiAmount === 0) {
          throw new Error(`You don't have any ${item?.stockName} tokens to sell`);
        }

        // For selling, we'll use a different approach
        // First, let's try to get a quote for a reasonable amount of tokens
        const decimals = tokenBalance?.decimals || 9;
        const testAmount = Math.pow(10, decimals); // 1 token
        
        try {
          const priceCheckQuote = await SwapService.getQuote(
            inputMint,
            outputMint,
            testAmount.toString(),
            50
          );
          
          // Calculate how many tokens we need to sell
          const usdcPerToken = parseFloat(priceCheckQuote.outAmount) / testAmount;
          const desiredUSDC = parseFloat(amount) * 1000000; // Convert dollars to USDC with 6 decimals
          const tokensToSell = desiredUSDC / usdcPerToken;
          
          // Round up to ensure we get at least the desired amount
          amountInLamports = Math.ceil(tokensToSell);
          
          // Check if user has enough tokens
          if (amountInLamports > parseFloat(tokenBalance.balance)) {
            const maxUSDC = (parseFloat(tokenBalance.balance) * usdcPerToken) / 1000000;
            throw new Error(`Insufficient balance. You can sell up to $${maxUSDC.toFixed(2)} worth of ${item?.stockName}`);
          }
          
          // Ensure we have a minimum amount
          if (amountInLamports < 1) {
            amountInLamports = 1;
          }
        } catch (priceError) {
          if (priceError.message && priceError.message.includes('Insufficient balance')) {
            throw priceError;
          }
          console.error('Error getting price quote:', priceError);
          throw new Error('Failed to get current price. Please try again.');
        }
      }

      console.log({ inputMint, outputMint, amountInLamports })

      const quote = await SwapService.getQuote(
        inputMint,
        outputMint,
        amountInLamports,
        50 // 0.5% slippage
      );

      // Get the decimals from the quote response
      const inputDecimals = item?.isBuy ? 6 : (quote.inputDecimals || 8); // USDC has 6, tokens usually 9
      const outputDecimals = item?.isBuy ? (quote.outputDecimals || 8) : 6;

      setQuoteData({
        ...quote,
        inputDecimals,
        outputDecimals,
      });

      navigation.navigate(StackNav.BuySellPreview, {
        item,
        amount,
        quoteData: {
          ...quote,
          inputDecimals,
          outputDecimals,
        },
      });
    } catch (err) {
      console.error('Error getting quote:', err);
      // Show the actual error message to the user
      setError(err.message || 'Failed to get quote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onPressCategory = () =>
    navigation.navigate(StackNav.BuySellOption, { item });

  return (
    <CSafeAreaView>
      <CHeader title={item?.isBuy ? strings.buy : strings.sell} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <View style={localStyles.settingsContainer}>
          <View style={localStyles.leftContainer}>

            <View style={[localStyles.roundLogoWrapper]}>
              {String(item?.image).endsWith("svg") && (<SvgUri uri={item?.image}
                width={localStyles.imageStyle?.width}
                height={localStyles.imageStyle?.height} />)}
              {!String(item?.image).endsWith("svg") && (<Image source={item?.image} style={localStyles.imageStyle} />)}
            </View>

            <View style={localStyles.stockNameContainer}>
              <CText type="b18" numberOfLines={1}>
                {item?.companyName}
              </CText>
              <CText
                type="m14"
                numberOfLines={1}
                color={colors.dark ? colors.grayScale : colors.grayScale6}
                style={styles.mt10}>
                {item?.stockName}
              </CText>
            </View>
          </View>
          <View style={styles.itemsEnd}>
            <CText
              type="s14"
              color={colors.dark ? colors.grayScale : colors.grayScale6}>
              {strings.marketPrice}
            </CText>
            <CText type="b18" style={styles.mt10}>
              {item?.currentValue}
            </CText>
          </View>
        </View>
        <CDivider style={styles.mv20} />
        <TouchableOpacity
          onPress={onPressCategory}
          style={[
            localStyles.currencyContainer,
            {
              borderColor: colors.primary,
            },
          ]}>
          <CText type="s16" color={colors.primary}>
            {item?.isBuy ? '($) Buy in Dollars' : '($) Sell in Dollars'}
          </CText>
          <Ionicons
            name={'caret-down-outline'}
            size={moderateScale(20)}
            color={colors.primary}
            style={styles.ml5}
          />
        </TouchableOpacity>
        <View
          style={[
            localStyles.inputContainer,
            {
              borderColor: isFocused
                ? colors.primary
                : colors.dark
                  ? colors.grayScale8
                  : colors.grayScale3,
              backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1,
            },
          ]}>
          <CText
            type="S46"
            color={
              amount.length > 0 ? colors.textColor : colors.placeHolderColor
            }>
            {'$'}
          </CText>
          <TextInput
            placeholder={'0'}
            value={amount}
            onChangeText={onChangeText}
            placeholderTextColor={colors.placeHolderColor}
            style={[
              localStyles.inputStyle,
              {
                color: colors.textColor,
                borderColor: colors.dark ? colors.bColor : colors.black,
              },
            ]}
            keyboardType={'number-pad'}
            onFocus={onFocusTextInput}
            onBlur={onBlurTextInput}
          />
        </View>
        <CText
          type="m14"
          color={colors.dark ? colors.grayScale3 : colors.grayScale7}
          align={'center'}
          style={styles.mt5}>
          {item?.isBuy
            ? 'Balance available: $22,935.46'
            : balanceUSD !== null 
              ? `${item?.stockName} balance: $${balanceUSD.toFixed(2)}`
              : 'Loading balance...'}
        </CText>
        {error && (
          <CText
            type="m14"
            color={colors.error || colors.red}
            align={'center'}
            style={styles.mt10}>
            {error}
          </CText>
        )}
      </KeyBoardAvoidWrapper>
      <CButton
        title={loading ? 'Loading...' : strings.continue}
        containerStyle={[
          styles.bottomButton,
          { opacity: loading || !amount ? 0.5 : 1 },
        ]}
        onPress={onPressDeposit}
        disabled={loading || !amount}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  settingsContainer: {
    ...styles.rowSpaceBetween,
    ...styles.pv10,
  },
  leftContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    width: '50%',
  },
  stockNameContainer: {
    ...styles.ph10,
    ...styles.flex,
    ...styles.itemsStart,
  },
  imageStyle: {
    height: moderateScale(55),
    width: moderateScale(55),
    resizeMode: 'contain',
  },
  roundLogoWrapper: {
    width: moderateScale(55),
    height: moderateScale(55),
    borderRadius: moderateScale(55) / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc', // placeholder background
    borderRadius: 50, // half of width/height
    overflow: 'hidden', // clips anything outside the round boundary
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee', // optional placeholder background
  },
  currencyContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.selfCenter,
    ...styles.p10,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(24),
  },
  inputStyle: {
    height: getHeight(160),
    ...typography.fontSizes.f46,
    ...typography.fontWeights.SemiBold,
  },

  inputContainer: {
    height: getHeight(160),
    width: '100%',
    borderWidth: moderateScale(2),
    borderRadius: moderateScale(32),
    textAlign: 'center',
    ...styles.ph10,
    ...styles.mv20,
    ...styles.rowCenter,
  },
});
