import {
  Image,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

// Local import
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import CText from '../../../components/common/CText';
import {styles} from '../../../themes';
import {getHeight, moderateScale} from '../../../common/constants';
import CDivider from '../../../components/common/CDivider';
import CButton from '../../../components/common/CButton';
import KeyBoardAvoidWrapper from '../../../components/common/KeyBoardAvoidWrapper';
import {StackNav} from '../../../navigation/NavigationKeys';

export default function StakePreview({navigation, route}) {
  const {item, amount, isStake} = route?.params;
  const colors = useSelector(state => state.theme.theme);

  const estimatedRewards = (parseFloat(amount) * parseFloat(item?.staking?.apy?.replace('%', '')) / 100).toFixed(2);
  const fees = item?.staking?.stakingFees || '$0.00';

  const onPressConfirm = () =>
    navigation.navigate(StackNav.StakeSuccessful, {
      item,
      amount,
      isStake,
      estimatedRewards,
    });

  return (
    <CSafeAreaView>
      <CHeader title={isStake ? strings.previewStake : strings.previewUnstake} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        {/* Stock Information */}
        <View style={localStyles.settingsContainer}>
          <View style={localStyles.leftContainer}>
            <Image source={item?.image} style={localStyles.imageStyle} />
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

        {/* Transaction Details */}
        <View style={localStyles.detailsContainer}>
          <CText type="b20" style={styles.mb20}>
            {isStake ? strings.staking : strings.unstaking} {strings.details}
          </CText>

          <View style={localStyles.detailRow}>
            <CText type="s16" color={colors.dark ? colors.grayScale3 : colors.grayScale6}>
              {isStake ? strings.stakeAmount : strings.unstakeAmount}
            </CText>
            <CText type="b18">${amount}</CText>
          </View>

          {isStake && (
            <>
              <View style={localStyles.detailRow}>
                <CText type="s16" color={colors.dark ? colors.grayScale3 : colors.grayScale6}>
                  {strings.annualYield}
                </CText>
                <CText type="b18" color={colors.primary}>
                  {item?.staking?.apy}
                </CText>
              </View>

              <View style={localStyles.detailRow}>
                <CText type="s16" color={colors.dark ? colors.grayScale3 : colors.grayScale6}>
                  {strings.estimatedRewards}
                </CText>
                <CText type="b18" color={colors.primary}>
                  ${estimatedRewards}
                </CText>
              </View>

              {item?.staking?.lockPeriod && (
                <View style={localStyles.detailRow}>
                  <CText type="s16" color={colors.dark ? colors.grayScale3 : colors.grayScale6}>
                    {strings.lockPeriod}
                  </CText>
                  <CText type="b18">
                    {item?.staking?.lockPeriod}
                  </CText>
                </View>
              )}
            </>
          )}

          <View style={localStyles.detailRow}>
            <CText type="s16" color={colors.dark ? colors.grayScale3 : colors.grayScale6}>
              {strings.stakingFees}
            </CText>
            <CText type="b18">{fees}</CText>
          </View>

          <CDivider style={styles.mv20} />

          <View style={localStyles.detailRow}>
            <CText type="b18">
              {isStake ? strings.totalStakeAmount : strings.totalUnstakeAmount}
            </CText>
            <CText type="b20" color={colors.primary}>
              ${(parseFloat(amount) + parseFloat(fees.replace('$', ''))).toFixed(2)}
            </CText>
          </View>
        </View>

        {/* Summary */}
        <View style={localStyles.summaryContainer}>
          <CText type="m14" color={colors.dark ? colors.grayScale3 : colors.grayScale7} align="center">
            {isStake 
              ? `You are about to stake $${amount} of ${item?.stockName} with an estimated annual return of $${estimatedRewards}.`
              : `You are about to unstake $${amount} of ${item?.stockName}.`
            }
          </CText>
        </View>
      </KeyBoardAvoidWrapper>

      <CButton
        title={isStake ? strings.stakeNow : strings.unstakeNow}
        containerStyle={styles.bottomButton}
        onPress={onPressConfirm}
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
    height: getHeight(60),
    width: moderateScale(60),
    resizeMode: 'contain',
  },
  detailsContainer: {
    ...styles.ph20,
  },
  detailRow: {
    ...styles.rowSpaceBetween,
    ...styles.pv10,
  },
  summaryContainer: {
    ...styles.ph20,
    ...styles.mt20,
    ...styles.p15,
    backgroundColor: 'rgba(0, 123, 255, 0.1)',
    borderRadius: moderateScale(12),
    ...styles.mh20,
  },
});