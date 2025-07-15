import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {useSelector} from 'react-redux';

//Local Imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import SubHeader from '../../components/SubHeader';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import CText from '../../components/common/CText';
import {commonColor, styles} from '../../themes';
import CInput from '../../components/common/CInput';
import CButton from '../../components/common/CButton';
import strings from '../../i18n/strings';
import {StackNav} from '../../navigation/NavigationKeys';
import {countryData} from '../../api/constant';
import {moderateScale} from '../../common/constants';

export default IdAddressScreen = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  const onChangeText = val => setAddress(val);
  const onChangeCity = val => setCity(val);
  const onChangeCountry = val => setCountry(val.value);

  const onPressContinue = () => navigation.navigate(StackNav.HouseStatusScreen);

  return (
    <CSafeAreaView>
      <SubHeader status={12} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <CText type={'B30'}>{strings.question12}</CText>
        <CInput
          label={strings.streetAddress}
          placeholder={strings.enterYourStreetAddress}
          onChangeText={onChangeText}
          _value={address}
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
      <CButton
        title={strings.continue}
        containerStyle={styles.bottomButton}
        onPress={onPressContinue}
      />
    </CSafeAreaView>
  );
};

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
