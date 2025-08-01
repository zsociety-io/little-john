import { Image, StyleSheet, View, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { SvgUri } from 'react-native-svg';

// Custom components
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import KeyBoardAvoidWrapper from '../../../components/common/KeyBoardAvoidWrapper';
import CText from '../../../components/common/CText';
import CDivider from '../../../components/common/CDivider';
import { styles } from '../../../themes';
import { getHeight, moderateScale } from '../../../common/constants';
import strings from '../../../i18n/strings';
import CButton from '../../../components/common/CButton';
import { StackNav } from '../../../navigation/NavigationKeys';
import SwapService from '../../../services/SwapService';
import { useAccount } from '../../../providers/AccountProvider';

export default function BuySellPreview({ navigation, route }) {
  const { item, amount, quoteData } = route?.params;
  const colors = useSelector(state => state.theme.theme);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { currentAccount } = useAccount();

  console.log("tok", item?.tokenAddress);

  const onPressBtn = async () => {
    setLoading(true);
    setError(null);

    try {
      // In a real app, you would get the user's public key from their wallet
      const userPublicKey = currentAccount?.pubkey; // This should come from wallet provider

      const swapData = await SwapService.getSwapTransaction(
        quoteData,
        userPublicKey,
        true,
        10000
      );

      const { swapTransaction } = swapData;

      navigation.navigate(StackNav.BuySellSuccessful, {
        item,
        amount,
        swapData,
        quoteData,
      });
    } catch (err) {
      console.error('Error preparing swap:', err);
      setError('Failed to prepare swap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const DescriptionLine = ({ title, desc, color = null }) => {
    return (
      <View style={styles.rowSpaceBetween}>
        <CText
          type={'m18'}
          color={colors.dark ? colors.grayScale3 : colors.grayScale7}>
          {title}
        </CText>
        <CText type={'b20'} color={color ? color : colors.textColor}>
          {desc}
        </CText>
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <CHeader title={item?.isBuy ? strings.previewBuy : strings.previewSell} />
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
          <CText
            type="s14"
            color={colors.dark ? colors.grayScale : colors.grayScale6}>
            {item?.isBuy ? strings.buy : strings.sell}
            {' in Dollars'}
          </CText>
        </View>
        <CDivider style={styles.mv20} />
        <View
          style={[
            localStyles.descContainer,
            {
              backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1,
              borderColor: colors.dark ? colors.dark3 : colors.grayScale2,
            },
          ]}>
          <DescriptionLine
            title={'Market Price'}
            desc={item?.currentValue}
          />
          <DescriptionLine
            title={'Output Amount'}
            desc={quoteData ? `${(parseFloat(quoteData.outAmount) / Math.pow(10, quoteData.decimals || 8)).toFixed(6)}` : '0'}
          />
          <CDivider />
          <DescriptionLine title={'Input Amount'} desc={`$${amount}`} />
          <DescriptionLine
            title={'Price Impact'}
            desc={quoteData ? `${parseFloat(quoteData.priceImpactPct || 0).toFixed(4)}%` : '0%'}
          />
          <CDivider />
          <DescriptionLine
            title={'Total'}
            desc={`$${amount}`}
            color={colors.primary}
          />
        </View>
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
        title={loading ? 'Processing...' : (item?.isBuy ? strings.buyNow : strings.sellNow)}
        containerStyle={[
          styles.bottomButton,
          { opacity: loading ? 0.5 : 1 },
        ]}
        onPress={onPressBtn}
        disabled={loading}
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
  descContainer: {
    ...styles.p15,
    ...styles.mt10,
    gap: moderateScale(15),
    borderRadius: moderateScale(24),
    borderWidth: moderateScale(1),
  },
});
