import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useSelector} from 'react-redux';

//Local Imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import SubHeader from '../../components/SubHeader';
import CText from '../../components/common/CText';
import {commonColor, styles} from '../../themes';
import CButton from '../../components/common/CButton';
import strings from '../../i18n/strings';
import {StackNav} from '../../navigation/NavigationKeys';
import {moderateScale} from '../../common/constants';
import {DobIcon} from '../../assets/svgs';

export default BirthdayScreen = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);
  const [datePickerVisible, setDatePickerVisible] = React.useState(false);
  const [userDob, setUserDob] = useState('');

  const onPressCalender = () => setDatePickerVisible(true);

  const handleDateConfirm = date => {
    var expiryDate = date.toISOString().split('T')[0];
    const day = expiryDate.split('-')[2];
    const month = expiryDate.split('-')[1];
    const year = expiryDate.split('-')[0];
    setUserDob(`${day}/${month}/${year}`);
    setDatePickerVisible(false);
  };

  const hideDatePicker = () => setDatePickerVisible(false);

  const onPressContinue = () => navigation.navigate(StackNav.BirthPlaceScreen);

  return (
    <CSafeAreaView>
      <SubHeader status={3} />
      <View style={styles.flexRootContainer}>
        <CText type={'B30'}>{strings.question3}</CText>
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
      </View>
      <CButton
        title={strings.continue}
        containerStyle={styles.bottomButton}
        onPress={onPressContinue}
      />
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
};

const localStyles = StyleSheet.create({
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
});
