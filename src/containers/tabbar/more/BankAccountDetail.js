import {StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {Dropdown} from 'react-native-element-dropdown';

// Local Imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import KeyBoardAvoidWrapper from '../../../components/common/KeyBoardAvoidWrapper';
import {commonColor, styles} from '../../../themes';
import CInput from '../../../components/common/CInput';
import CText from '../../../components/common/CText';
import strings from '../../../i18n/strings';
import {StackNav} from '../../../navigation/NavigationKeys';
import CButton from '../../../components/common/CButton';
import {moderateScale} from '../../../common/constants';
import {accountTypeData} from '../../../api/constant';
import CHeader from '../../../components/common/CHeader';

export default function BankAccountDetail({route, navigation}) {
  const {bank} = route.params;
  const colors = useSelector(state => state.theme.theme);
  const [city, setCity] = useState('');
  const [accountType, setAccountType] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const onChangeCity = val => setCity(val);
  const onChangeAccountType = val => setAccountType(val.value);
  const onChangeAccountNumber = val => setAccountNumber(val);
  const onChangeAccountName = val => setAccountName(val);

  const onPressContinue = () =>
    navigation.navigate(StackNav.ConfirmBankAccountDetail, {
      bank: bank,
    });

  return (
    <CSafeAreaView>
      <CHeader />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <CText type={'B30'}>
          {'Enter your '}
          <CText type={'B30'} color={colors.primary}>
            {bank.title}
          </CText>
          <CText type={'B30'}>{' bank account 🏦'}</CText>
        </CText>
        <CInput
          label={strings.bankAccountNumber}
          placeholder={strings.enterYourBankAccountNumber}
          onChangeText={onChangeAccountNumber}
          _value={accountNumber}
          containerStyle={styles.mt20}
          inputContainerStyle={styles.textInputContainerStyle}
          inputBoxStyle={styles.textInputStyle}
        />
        <CInput
          label={strings.bankAccountName}
          placeholder={strings.enterYourBankAccountName}
          onChangeText={onChangeAccountName}
          _value={accountName}
          containerStyle={styles.mt20}
          inputContainerStyle={styles.textInputContainerStyle}
          inputBoxStyle={styles.textInputStyle}
        />
        <CInput
          label={strings.city}
          placeholder={strings.enterYourCity}
          onChangeText={onChangeCity}
          _value={city}
          containerStyle={styles.mt20}
          inputContainerStyle={styles.textInputContainerStyle}
          inputBoxStyle={styles.textInputStyle}
        />
        <CText type={'B16'} style={localStyles.labelContainer}>
          {strings.accountType}
        </CText>
        <Dropdown
          placeholder={strings.selectYourAccountType}
          data={accountTypeData}
          valueField={'value'}
          labelField={'label'}
          onChange={onChangeAccountType}
          value={accountType}
          fontFamily={'Urbanist-Bold'}
          placeholderTextColor={commonColor.primary}
          placeholderStyle={localStyles.dropdownPlaceholderStyle}
          iconColor={commonColor.primary}
          iconStyle={localStyles.dropdownIcon}
          style={localStyles.dropdownStyle}
          selectedTextStyle={[styles.textInputStyle, {color: colors.textColor}]}
          itemTextStyle={[localStyles.itemTextStyle, {color: colors.textColor}]}
          itemContainerStyle={{backgroundColor: colors.dark3}}
          containerStyle={localStyles.dropdownContainer}
        />
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
  labelContainer: {
    ...styles.mt15,
  },
  dropdownContainer: {
    ...styles.textInputContainerStyle,
    ...styles.mt20,
  },
  dropdownStyle: {
    ...styles.textInputContainerStyle,
    ...styles.mt20,
    ...styles.pb10,
  },
  dropdownIcon: {
    height: moderateScale(34),
    width: moderateScale(34),
  },
  dropdownPlaceholderStyle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: moderateScale(24),
    color: commonColor.placeHolderColor,
  },
  itemTextStyle: {
    fontFamily: 'Urbanist-Regular',
    fontSize: moderateScale(18),
  },
});
