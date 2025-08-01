import { Image, StyleSheet, ActivityIndicator, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// Local import
import CDivider from '../../../components/common/CDivider';
import { UnlockOffer } from '../../../assets/svgs';
import CText from '../../../components/common/CText';
import { styles } from '../../../themes';
import CButton from '../../../components/common/CButton';
import strings from '../../../i18n/strings';
import { moderateScale } from '../../../common/constants';
import KeyBoardAvoidWrapper from '../../../components/common/KeyBoardAvoidWrapper';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import { StackNav } from '../../../navigation/NavigationKeys';
import SwapService from '../../../services/SwapService';
import { useAccount } from '../../../providers/AccountProvider';

export default function BuySellSuccessful({ navigation, route }) {
  const { item, amount, swapData, quoteData } = route?.params;
  const colors = useSelector(state => state.theme.theme);
  const { currentAccount, signAndSendTransactions } = useAccount();
  const [executing, setExecuting] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [txSignature, setTxSignature] = useState(null);

  const onPressContinue = () => navigation.navigate(StackNav.TabBar);

  const onPressStock = () =>
    navigation.navigate(StackNav.StockDetailScreen, { item });

  useEffect(() => {
    executeSwap();
  }, []);

  const executeSwap = async () => {
    try {
      if (!currentAccount) {
        throw new Error('No wallet connected');
      }

      if (!swapData?.swapTransaction) {
        throw new Error('No swap transaction data');
      }

      // Execute the swap using mobile wallet adapter
      const result = await SwapService.signAndSendSwapTransaction(
        swapData.swapTransaction,
        signAndSendTransactions
      );

      setSuccess(true);
      setTxSignature(result.signature);
    } catch (err) {
      console.error('Swap execution error:', err);
      setError(err.message || 'Transaction failed');
    } finally {
      setExecuting(false);
    }
  };

  return (
    <CSafeAreaView>
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <Image source={item?.image} style={localStyles.imageStyle} />
        <CText type={'b32'} align={'center'} style={styles.mt10}>
          {item?.companyName}
        </CText>
        <CText
          type={'s18'}
          align={'center'}
          color={colors.dark ? colors.grayScale3 : colors.grayScale6}
          style={styles.mt5}>
          {item?.stockName}
        </CText>
        <CDivider style={styles.mv30} />

        {executing ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} style={styles.mv20} />
            <CText type={'B20'} align={'center'} style={styles.mv10}>
              {'Processing Transaction...'}
            </CText>
            <CText
              type={'m16'}
              align={'center'}
              color={colors.dark ? colors.grayScale3 : colors.grayScale6}>
              {'Please wait while we execute your swap'}
            </CText>
          </View>
        ) : error ? (
          <View style={styles.center}>
            <CText type={'B20'} align={'center'} color={colors.error || colors.red} style={styles.mv10}>
              {'Transaction Failed'}
            </CText>
            <CText
              type={'m16'}
              align={'center'}
              color={colors.dark ? colors.grayScale3 : colors.grayScale6}
              style={styles.ph20}>
              {error}
            </CText>
          </View>
        ) : (
          <>
            <UnlockOffer style={styles.mv20} />
            <CText
              type={'B46'}
              align={'center'}
              color={colors.primary}
              style={styles.mv20}>
              {`$${amount}`}
            </CText>
            <CText type={'B20'} align={'center'} style={styles.mv10}>
              {'Swap Successful!'}
            </CText>
            <CText
              type={'m18'}
              align={'center'}
              color={colors.dark ? colors.grayScale3 : colors.grayScale6}
              style={styles.mb30}>
              {'Your swap has been executed successfully'}
            </CText>
            {txSignature && (
              <View style={styles.mt20}>
                <CText
                  type={'m14'}
                  align={'center'}
                  color={colors.dark ? colors.grayScale3 : colors.grayScale6}>
                  {'Transaction ID:'}
                </CText>
                <CText
                  type={'m12'}
                  align={'center'}
                  color={colors.primary}
                  style={styles.mt5}
                  numberOfLines={1}>
                  {txSignature.slice(0, 20)}...{txSignature.slice(-20)}
                </CText>
              </View>
            )}
          </>
        )}
      </KeyBoardAvoidWrapper>
      <CButton
        title={strings.viewMyPortfolio}
        containerStyle={styles.bottomButton}
        onPress={onPressContinue}
      />
      <CButton
        type={'S16'}
        title={'Back to ' + item?.companyName + ' Stock'}
        bgColor={colors.dark3}
        color={colors.primaryLightBtn}
        style={styles.ml10}
        containerStyle={styles.bottomButton}
        onPress={onPressStock}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  outerContainer: {
    ...styles.rowSpaceAround,
    ...styles.mt20,
  },
  innerContainer: {
    ...styles.center,
  },
  imageStyle: {
    height: moderateScale(100),
    width: moderateScale(100),
    resizeMode: 'contain',
    borderRadius: moderateScale(50),
    ...styles.selfCenter,
    ...styles.mt15,
  },
});
