import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useSelector} from 'react-redux';
import {Dropdown} from 'react-native-element-dropdown';

// Local Imports
import CHeader from '../../../components/common/CHeader';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import strings from '../../../i18n/strings';
import images from '../../../assets/images';
import {moderateScale} from '../../../common/constants';
import {commonColor, styles} from '../../../themes';
import CDivider from '../../../components/common/CDivider';
import CInput from '../../../components/common/CInput';
import KeyBoardAvoidWrapper from '../../../components/common/KeyBoardAvoidWrapper';
import CText from '../../../components/common/CText';
import {DobIcon} from '../../../assets/svgs';
import {countryData} from '../../../api/constant';

export default function PersonalInfo() {
  const colors = useSelector(state => state.theme.theme);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [userDob, setUserDob] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');

  const onChangeText = text => setName(text);
  const onChangePhoneNumber = text => setPhoneNumber(text);
  const onChangeEmail = text => setEmail(text);
  const onPressCalender = () => setDatePickerVisible(true);
  const onChangeCountry = val => setCountry(val.value);
  const onChangeAddress = val => setAddress(val);

  const handleDateConfirm = date => {
    var expiryDate = date.toISOString().split('T')[0];
    const day = expiryDate.split('-')[2];
    const month = expiryDate.split('-')[1];
    const year = expiryDate.split('-')[0];
    setUserDob(`${day}/${month}/${year}`);
    setDatePickerVisible(false);
  };

  const hideDatePicker = () => setDatePickerVisible(false);

  return (
    <CSafeAreaView>
      <CHeader title={strings.personalInfo} />
      <KeyBoardAvoidWrapper contentContainerStyle={localStyles.rootContainer}>
        <TouchableOpacity>
          <Image
            source={colors.dark ? images.userDark : images.userLight}
            style={localStyles.userImage}
          />
        </TouchableOpacity>
        <CDivider style={styles.mt20} />
        <CInput
          label={strings.fullName}
          placeholder={strings.enterYourName}
          onChangeText={onChangeText}
          _value={name}
          containerStyle={styles.mt20}
          inputContainerStyle={styles.textInputContainerStyle}
          inputBoxStyle={styles.textInputStyle}
        />
        <CInput
          label={strings.phoneNumber}
          placeholder={strings.enterYourPhoneNumber}
          onChangeText={onChangePhoneNumber}
          _value={phoneNumber}
          keyBoardType={'number-pad'}
          _maxLength={10}
          containerStyle={styles.mt20}
          inputContainerStyle={styles.textInputContainerStyle}
          inputBoxStyle={styles.textInputStyle}
        />
        <CInput
          label={strings.email}
          placeholder={strings.enterYourEmail}
          onChangeText={onChangeEmail}
          _value={email}
          containerStyle={styles.mt20}
          inputContainerStyle={styles.textInputContainerStyle}
          inputBoxStyle={styles.textInputStyle}
        />
        <View style={styles.mv10}>
          <CText type={'B16'} style={localStyles.labelContainer}>
            {strings.dob}
          </CText>
          <TouchableOpacity
            onPress={onPressCalender}
            style={localStyles.textInputContainerStyle}>
            <CText
              type={'s16'}
              color={userDob ? colors.textColor : colors.placeHolderColor}
              style={localStyles.textInputStyle}>
              {userDob ? userDob : strings.selectDateOfBirth}
            </CText>
            <DobIcon />
          </TouchableOpacity>
        </View>
        <CInput
          label={strings.streetAddress}
          placeholder={strings.enterYourStreetAddress}
          onChangeText={onChangeAddress}
          _value={address}
          containerStyle={styles.mt20}
          inputContainerStyle={styles.textInputContainerStyle}
          inputBoxStyle={styles.textInputStyle}
        />
        <CText type={'B16'} style={localStyles.dropLabelContainer}>
          {strings.country}
        </CText>
        <Dropdown
          label={strings.country}
          data={countryData}
          valueField={'value'}
          labelField={'label'}
          onChange={onChangeCountry}
          value={country}
          fontFamily={'Urbanist-Bold'}
          placeholder="Select Country"
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
      <DateTimePickerModal
        isVisible={datePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
        date={new Date()}
        maximumDate={new Date()}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  rootContainer: {
    ...styles.rootContainer,
    ...styles.pb50,
  },
  userImage: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    ...styles.selfCenter,
    ...styles.mv10,
  },
  labelContainer: {
    ...styles.mb5,
    ...styles.mt10,
  },
  textInputContainerStyle: {
    borderWidth: 0,
    borderBottomWidth: moderateScale(2),
    borderBottomColor: commonColor.primary,
    ...styles.pv10,
    ...styles.rowSpaceBetween,
  },
  textInputStyle: {
    ...styles.textInputStyle,
    ...styles.mt5,
  },
  dropLabelContainer: {
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
