import {
  Image,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';

// Local import
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import CText from '../../../components/common/CText';
import { styles } from '../../../themes';
import { getHeight, moderateScale } from '../../../common/constants';
import CButton from '../../../components/common/CButton';
import KeyBoardAvoidWrapper from '../../../components/common/KeyBoardAvoidWrapper';
import { StackNav } from '../../../navigation/NavigationKeys';

export default function StakeSuccessful({ navigation, route }) {
  const { item, amount, isStake, estimatedRewards } = route?.params;
  const colors = useSelector(state => state.theme.theme);

  const onPressViewPortfolio = () => {
    // Reset navigation stack and go to TabBar (Portfolio is the default tab)
    navigation.reset({
      index: 0,
      routes: [
        {
          name: StackNav.TabBar
        }
      ]
    });
  };

  const onPressBackToStock = () => {
    // Replace current screen with StockDetailScreen to avoid going back to staking process
    navigation.reset({
      index: 0,
      routes: [
        { name: StackNav.TabBar },
        { name: StackNav.StockDetailScreen, params: { item } }
      ]
    });
  };

  return (
    <CSafeAreaView>
      <CHeader title={strings.successful} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        {/* Success Icon/Image */}
        <View style={localStyles.successContainer}>
          <View style={localStyles.successIcon}>
            <CText type="b40" color={colors.white}>✓</CText>
          </View>

          <CText type="b24" style={styles.mt20} align="center">
            {isStake ? strings.stakingSuccessful : strings.unstakingSuccessful}
          </CText>
        </View>

        {/* Stock Information */}
        <View style={localStyles.stockContainer}>
          <Image source={item?.image} style={localStyles.imageStyle} />
          <View style={localStyles.stockInfo}>
            <CText type="b18" numberOfLines={1} align="center">
              {item?.companyName}
            </CText>
            <CText
              type="m14"
              numberOfLines={1}
              color={colors.dark ? colors.grayScale : colors.grayScale6}
              style={styles.mt5}
              align="center">
              {item?.stockName}
            </CText>
          </View>
        </View>

        {/* Transaction Summary */}
        <View style={localStyles.summaryContainer}>
          <View style={localStyles.summaryRow}>
            <CText type="s16" color={colors.dark ? colors.grayScale3 : colors.grayScale6}>
              {isStake ? strings.staked : strings.unstaked} Amount
            </CText>
            <CText type="b20" color={colors.primary}>
              ${amount}
            </CText>
          </View>

          {isStake && estimatedRewards && (
            <View style={localStyles.summaryRow}>
              <CText type="s16" color={colors.dark ? colors.grayScale3 : colors.grayScale6}>
                {strings.estimatedRewards}
              </CText>
              <CText type="b18" color={colors.primary}>
                ${estimatedRewards}
              </CText>
            </View>
          )}

          <View style={localStyles.summaryRow}>
            <CText type="s16" color={colors.dark ? colors.grayScale3 : colors.grayScale6}>
              {strings.annualYield}
            </CText>
            <CText type="b18" color={colors.primary}>
              {item?.staking?.apy}
            </CText>
          </View>

          {item?.staking?.lockPeriod && isStake && (
            <View style={localStyles.summaryRow}>
              <CText type="s16" color={colors.dark ? colors.grayScale3 : colors.grayScale6}>
                {strings.lockPeriod}
              </CText>
              <CText type="b18">
                {item?.staking?.lockPeriod}
              </CText>
            </View>
          )}
        </View>

        {/* Success Message */}
        <View style={localStyles.messageContainer}>
          <CText type="m14" color={colors.dark ? colors.grayScale3 : colors.grayScale7} align="center">
            {isStake
              ? `Your ${item?.stockName} has been successfully staked. You can view your staking balance in your portfolio.`
              : `Your ${item?.stockName} has been successfully unstaked. The funds will be available in your account shortly.`
            }
          </CText>
        </View>
      </KeyBoardAvoidWrapper>

      {/* Action Buttons */}
      <View style={localStyles.buttonContainer}>
        <CButton
          title={strings.viewMyPortfolio}
          containerStyle={[styles.bottomButton, localStyles.primaryButton]}
          onPress={onPressViewPortfolio}
        />
        <CButton
          title={`Back to ${item?.stockName}`}
          type={'S16'}
          bgColor={colors.dark ? colors.dark3 : colors.grayScale2}
          color={colors.primary}
          containerStyle={[styles.bottomButton, localStyles.secondaryButton]}
          onPress={onPressBackToStock}
        />
      </View>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  successContainer: {
    ...styles.itemsCenter,
    ...styles.mt30,
    ...styles.mb30,
  },
  successIcon: {
    height: moderateScale(80),
    width: moderateScale(80),
    borderRadius: moderateScale(40),
    backgroundColor: '#4CAF50',
    ...styles.center,
  },
  stockContainer: {
    ...styles.itemsCenter,
    ...styles.mv20,
  },
  imageStyle: {
    height: getHeight(60),
    width: moderateScale(60),
    resizeMode: 'contain',
  },
  stockInfo: {
    ...styles.mt10,
    ...styles.itemsCenter,
  },
  summaryContainer: {
    ...styles.ph20,
    ...styles.mv20,
  },
  summaryRow: {
    ...styles.rowSpaceBetween,
    ...styles.pv10,
  },
  messageContainer: {
    ...styles.ph20,
    ...styles.mt20,
    ...styles.p15,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: moderateScale(12),
    ...styles.mh20,
  },
  buttonContainer: {
    ...styles.ph20,
    ...styles.pb20,
    gap: moderateScale(10),
  },
  primaryButton: {
    marginBottom: 0,
  },
  secondaryButton: {
    marginBottom: 0,
  },
});