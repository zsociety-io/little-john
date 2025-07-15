import React, {useState} from 'react';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import CountDown from 'react-native-countdown-component';

//Local Imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import CText from '../../components/common/CText';
import {styles} from '../../themes';
import CButton from '../../components/common/CButton';
import strings from '../../i18n/strings';
import {StackNav} from '../../navigation/NavigationKeys';
import CHeader from '../../components/common/CHeader';
import {ACCESS_TOKEN, getHeight, moderateScale} from '../../common/constants';
import {setAsyncStorageData} from '../../utils/helpers';

export default EmailVerifyScreen = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);
  const [pin, setPin] = useState('');
  const [counterId, setCounterId] = useState('1');
  const [isTimeOver, setIsTimeOver] = useState(false);

  const onFinishTimer = () => setIsTimeOver(true);

  const onPressResend = () => {
    setCounterId(counterId + '1');
    setIsTimeOver(false);
    setPin('');
  };

  const onPinChange = val => setPin(val);

  const onPressContinue = async () => {
    await setAsyncStorageData(ACCESS_TOKEN, true);
    navigation.reset({
      index: 0,
      routes: [{name: StackNav.TabBar}],
    });
  };

  return (
    <CSafeAreaView>
      <CHeader />
      <View style={styles.rootContainer}>
        <CText type={'B30'}>{strings.YouGotMail}</CText>
        <CText style={styles.mv15} type={'r18'}>
          {strings.emailDesc}
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
        />
        <View style={localStyles.resendContainer}>
          {isTimeOver ? (
            <TouchableOpacity
              onPress={onPressResend}
              disabled={isTimeOver ? false : true}
              style={styles.p5}>
              <CText type={'m18'} color={colors.primary} align={'center'}>
                {strings.resendCode}
              </CText>
            </TouchableOpacity>
          ) : (
            <View>
              <CText type={'m18'} align={'center'}>
                {strings.didReceiveEmail}
              </CText>
              <View style={styles.rowCenter}>
                <CText type={'m18'} align={'center'}>
                  {strings.resendCodeIn}
                </CText>
                <CountDown
                  id={counterId}
                  until={60}
                  onFinish={onFinishTimer}
                  digitStyle={{backgroundColor: colors.backgroundColor}}
                  digitTxtStyle={[
                    localStyles.digitStyle,
                    {color: colors.primary},
                  ]}
                  timeToShow={['S']}
                  timeLabels={{m: null, s: null}}
                />
                <CText type={'m18'} align={'center'}>
                  {strings.second}
                </CText>
              </View>
            </View>
          )}
        </View>
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
  digitStyle: {
    fontSize: moderateScale(18),
    fontFamily: 'Ubuntu-Regular',
  },
  resendContainer: {
    ...styles.rowCenter,
    ...styles.mt20,
  },
});
