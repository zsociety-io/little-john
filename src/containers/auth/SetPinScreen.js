import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';

//Local Imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import CText from '../../components/common/CText';
import {styles} from '../../themes';
import strings from '../../i18n/strings';
import {StackNav} from '../../navigation/NavigationKeys';
import {ACCESS_TOKEN, getHeight, moderateScale} from '../../common/constants';
import CHeader from '../../components/common/CHeader';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import SuccessModal from '../../components/models/SuccessModal';
import {setAsyncStorageData} from '../../utils/helpers';

export default SetPinScreen = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);
  const [pin, setPin] = useState('');
  const [visibleModal, setVisibleModal] = useState(false);

  const onPinChange = val => setPin(val);

  const onCodeFilled = async () => {
    setVisibleModal(true);
    await setAsyncStorageData(ACCESS_TOKEN, true);
    setTimeout(() => {
      setVisibleModal(false);
      navigation.reset({
        index: 0,
        routes: [{name: StackNav.TabBar}],
      });
    }, 1500);
  };

  return (
    <CSafeAreaView>
      <CHeader />
      <View style={styles.rootContainer}>
        <CText type={'B30'}>{strings.setYourPINCode}</CText>
        <CText style={styles.mv15} type={'r18'}>
          {strings.setPinDesc}
        </CText>
      </View>
      <KeyBoardAvoidWrapper contentContainerStyle={localStyles.rootContainer}>
        <OTPInputView
          pinCount={4}
          code={pin}
          onCodeChanged={onPinChange}
          autoFocusOnLoad={false}
          codeInputFieldStyle={[
            localStyles.pinInputStyle,
            {
              color: colors.textColor,
              backgroundColor: colors.inputBg,
              borderColor: colors.dark ? colors.dark3 : colors.grayScale2,
            },
          ]}
          codeInputHighlightStyle={{
            backgroundColor: colors.inputFocusColor,
            borderColor: colors.primary,
          }}
          style={localStyles.inputStyle}
          secureTextEntry={true}
          onCodeFilled={onCodeFilled}
        />
      </KeyBoardAvoidWrapper>
      <SuccessModal visible={visibleModal} />
    </CSafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  rootContainer: {
    ...styles.flex,
    ...styles.center,
    ...styles.ph20,
    ...styles.selfCenter,
  },
  pinInputStyle: {
    height: getHeight(60),
    width: moderateScale(65),
    fontSize: moderateScale(26),
    fontFamily: 'Ubuntu-Bold',
    borderRadius: moderateScale(15),
  },
  inputStyle: {
    height: getHeight(60),
    width: '100%',
    ...styles.ph20,
    ...styles.ml10,
  },
});
