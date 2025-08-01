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

export default function BuySell({ navigation, route }) {
  const { item } = route?.params;
  const colors = useSelector(state => state.theme.theme);
  const [amount, setAmount] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quoteData, setQuoteData] = useState(null);
  const [error, setError] = useState(null);

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
      console.log({ amount })
      // For this example, we'll assume buying with USDC
      const inputMint = SwapService.getTokenMint('USDC');
      const outputMint = item?.tokenAddress;
      console.log({ outputMint })
      const amountInLamports = parseFloat(amount) * 1000000; // USDC has 6 decimals

      const quote = await SwapService.getQuote(
        inputMint,
        outputMint,
        amountInLamports,
        50 // 0.5% slippage
      );

      setQuoteData(quote);
      navigation.navigate(StackNav.BuySellPreview, {
        item,
        amount,
        quoteData: quote,
      });
    } catch (err) {
      console.error('Error getting quote:', err);
      setError('Failed to get quote. Please try again.');
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
          {'Balance equity/stock available: $22,935.46'}
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
