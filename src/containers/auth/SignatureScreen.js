import React, {useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
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
import {moderateScale} from '../../common/constants';

export default Signature = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);
  const [fullName, setFullName] = useState('');
  const [signature, setSignature] = useState('');

  const ref = useRef();

  const onChangeText = val => setFullName(val);

  const onPressContinue = () => navigation.navigate(StackNav.UnlockScreen);

  const handleOK = signature => {
    setSignature(signature);
  };

  const handleClear = () => {
    setSignature('');
    ref.current.clearSignature();
  };

  return (
    <CSafeAreaView>
      <SubHeader status={19} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <CText type={'B30'}>{strings.question19}</CText>
        <CInput
          label={strings.fullName}
          placeholder={strings.enterFullName}
          onChangeText={onChangeText}
          _value={fullName}
          containerStyle={styles.mt20}
          inputContainerStyle={styles.textInputContainerStyle}
          inputBoxStyle={styles.textInputStyle}
        />
        <View style={localStyles.signatureContainer}>
          <SignatureScreen
            ref={ref}
            onOK={handleOK}
            trimWhitespace={true}
            androidHardwareAccelerationDisabled={true}
            backgroundColor={colors.dark ? colors.dark2 : colors.grayScale1}
          />
          <TouchableOpacity
            onPress={handleClear}
            style={localStyles.clearStyle}>
            <CText type={'R12'} align={'right'} color={colors.primary}>
              {strings.clearSignature}
            </CText>
          </TouchableOpacity>
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
  clearStyle: {
    ...styles.p10,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  signatureContainer: {
    ...styles.mt15,
    ...styles.justifyCenter,
    borderRadius: moderateScale(2),
    borderWidth: moderateScale(1),
    height: moderateScale(250),
    borderColor: commonColor.primary,
  },
});
