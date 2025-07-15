import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local import
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import {EditDark} from '../../../assets/svgs';
import CText from '../../../components/common/CText';
import {styles} from '../../../themes';
import {getHeight, moderateScale} from '../../../common/constants';
import KeyBoardAvoidWrapper from '../../../components/common/KeyBoardAvoidWrapper';
import CButton from '../../../components/common/CButton';
import CDivider from '../../../components/common/CDivider';
import typography from '../../../themes/typography';
import {StackNav} from '../../../navigation/NavigationKeys';

export default function DepositToOtradePayment({navigation, route}) {
  const {bank} = route.params;
  const colors = useSelector(state => state.theme.theme);
  const [amount, setAmount] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const onFocusTextInput = () => setIsFocused(true);
  const onBlurTextInput = () => setIsFocused(false);
  const onChangeText = text => setAmount(text);

  const onPressEditProfile = () => navigation.goBack();

  const onPressDeposit = () => {
    if (bank?.withdraw) {
      navigation.navigate(StackNav.PreviewWithdraw, {
        bank: bank,
      });
    } else {
      navigation.navigate(StackNav.DepositPaymentRecept, {
        bank: bank,
      });
    }
  };

  return (
    <CSafeAreaView>
      <CHeader
        title={
          bank?.withdraw ? strings.withdrawFromOtrade : strings.depositToOtrade
        }
      />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <View style={localStyles.userContentContainer}>
          <View style={[styles.rowCenter, styles.flex]}>
            <TouchableOpacity>
              <Image source={bank?.image} style={localStyles.userImage} />
            </TouchableOpacity>
            <View style={[styles.mh10, styles.flex]}>
              <CText type="b20">{bank?.title}</CText>
              <CText type="m14" style={styles.mt5}>
                {bank?.withdraw ? bank?.desc : '⚡️ Instant | Free'}
              </CText>
            </View>
          </View>
          <TouchableOpacity onPress={onPressEditProfile}>
            <EditDark />
          </TouchableOpacity>
        </View>
        <CDivider style={styles.mv20} />
        <TouchableOpacity
          style={[
            localStyles.currencyContainer,
            {
              borderColor: colors.primary,
            },
          ]}>
          <CText type="s16" color={colors.primary}>
            {bank?.withdraw
              ? '($) Withdraw in Dollars'
              : '($) Deposit in Dollars'}
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
        {amount.length > 0 && (
          <CText
            type="m14"
            color={colors.dark ? colors.grayScale3 : colors.grayScale7}
            align={'center'}
            style={styles.mt5}>
            {bank?.withdraw
              ? `You will receive USD $${amount} in your bank account.`
              : `You will get USD $${amount} instantly to your Otrade cash balance.`}
          </CText>
        )}
      </KeyBoardAvoidWrapper>
      <CButton
        title={bank?.withdraw ? strings.continue : strings.makeDeposit}
        containerStyle={styles.bottomButton}
        onPress={onPressDeposit}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  userContentContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mv10,
  },
  userImage: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
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
