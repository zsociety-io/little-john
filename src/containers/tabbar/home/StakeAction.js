import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

export default function StakeAction({ navigation, route }) {
  const { item, isStake } = route?.params;
  const colors = useSelector(state => state.theme.theme);
  const [amount, setAmount] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [validationError, setValidationError] = useState('');

  const onFocusTextInput = () => setIsFocused(true);
  const onBlurTextInput = () => setIsFocused(false);

  const validateAmount = (value) => {
    const numValue = parseFloat(value);
    
    if (!value || numValue <= 0) {
      return strings.invalidAmount;
    }

    if (isStake) {
      // Pour le staking: minimum $1, maximum = montant unstaked disponible
      const unstakedAmount = parseFloat(item?.staking?.unstaked?.replace('$', '') || '0');
      
      if (numValue < 1) {
        return strings.belowMinimum;
      }
      if (numValue > unstakedAmount) {
        return strings.insufficientBalance;
      }
    } else {
      // Pour l'unstaking: maximum = montant actuellement staké
      const stakedAmount = parseFloat(item?.staking?.staked?.replace('$', '') || '0');
      
      if (numValue > stakedAmount) {
        return strings.exceedsStakedAmount;
      }
    }

    return '';
  };

  const onChangeText = text => {
    setAmount(text);
    const error = validateAmount(text);
    setValidationError(error);
  };

  const onPressContinue = () => {
    if (!validationError && amount && parseFloat(amount) > 0) {
      navigation.navigate(StackNav.StakePreview, {
        item,
        amount,
        isStake,
      });
    }
  };

  const onPressActionSelector = () => {
    // Navigate to action selector if needed
  };

  return (
    <CSafeAreaView>
      <CHeader title={isStake ? `${strings.stake} ${item?.stockName}` : `${strings.unstake} ${item?.stockName}`} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        {/* Stock Information Section */}
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

        {/* Staking Information Section */}
        <View style={localStyles.stakingInfoContainer}>
          <View style={localStyles.stakingInfoRow}>
            <CText type="s14" color={colors.dark ? colors.grayScale3 : colors.grayScale6}>
              {isStake ? strings.availableToStake : strings.currentlyStaked}
            </CText>
            <CText type="b16">
              {isStake ? item?.staking?.unstaked : item?.staking?.staked}
            </CText>
          </View>
          <View style={localStyles.stakingInfoRow}>
            <CText type="s14" color={colors.dark ? colors.grayScale3 : colors.grayScale6}>
              {strings.annualYield}
            </CText>
            <CText type="b16" color={colors.primary}>
              {item?.staking?.apy}
            </CText>
          </View>
          {item?.staking?.lockPeriod && (
            <View style={localStyles.stakingInfoRow}>
              <CText type="s14" color={colors.dark ? colors.grayScale3 : colors.grayScale6}>
                {strings.lockPeriod}
              </CText>
              <CText type="b16">
                {item?.staking?.lockPeriod}
              </CText>
            </View>
          )}
        </View>

        <CDivider style={styles.mv20} />

        {/* Action Selector */}
        <TouchableOpacity
          onPress={onPressActionSelector}
          style={[
            localStyles.currencyContainer,
            {
              borderColor: colors.primary,
            },
          ]}>
          <CText type="s16" color={colors.primary}>
            {isStake ? `($) ${strings.stake} in Dollars` : `($) ${strings.unstake} in Dollars`}
          </CText>
          <Ionicons
            name={'caret-down-outline'}
            size={moderateScale(20)}
            color={colors.primary}
            style={styles.ml5}
          />
        </TouchableOpacity>

        {/* Amount Input */}
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

        {/* Balance Display */}
        <CText
          type="m14"
          color={colors.dark ? colors.grayScale3 : colors.grayScale7}
          align={'center'}
          style={styles.mt5}>
          {isStake
            ? `${strings.availableToStake}: ${item?.staking?.unstaked}`
            : `${strings.currentlyStaked}: ${item?.staking?.staked}`
          }
        </CText>

        {/* Validation Error */}
        {validationError ? (
          <CText
            type="m14"
            color={colors.alertColor}
            align={'center'}
            style={styles.mt10}>
            {validationError}
          </CText>
        ) : null}

        {/* Estimated Rewards */}
        {amount && parseFloat(amount) > 0 && !validationError && (
          <CText
            type="m14"
            color={colors.primary}
            align={'center'}
            style={styles.mt10}>
            {strings.estimatedRewards}: ${(parseFloat(amount) * parseFloat(item?.staking?.apy?.replace('%', '')) / 100).toFixed(2)}
          </CText>
        )}
      </KeyBoardAvoidWrapper>

      <CButton
        title={strings.continue}
        containerStyle={styles.bottomButton}
        onPress={onPressContinue}
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
  stakingInfoContainer: {
    ...styles.ph20,
    gap: moderateScale(10),
  },
  stakingInfoRow: {
    ...styles.rowSpaceBetween,
    ...styles.pv5,
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