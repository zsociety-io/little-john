import React, {useState} from 'react';

//Local Imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import CText from '../../components/common/CText';
import {styles} from '../../themes';
import CInput from '../../components/common/CInput';
import CButton from '../../components/common/CButton';
import strings from '../../i18n/strings';
import {StackNav} from '../../navigation/NavigationKeys';
import CHeader from '../../components/common/CHeader';

export default EmailScreen = ({navigation}) => {
  const [email, setEmail] = useState('');

  const onChangeText = val => setEmail(val);

  const onPressContinue = () => navigation.navigate(StackNav.EmailVerifyScreen);

  return (
    <CSafeAreaView>
      <CHeader />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <CText type={'B30'}>{strings.helloThere}</CText>
        <CText style={styles.mv15} type={'r18'}>
          {strings.helloDesc}
        </CText>
        <CInput
          label={strings.email}
          placeholder={strings.enterYourEmail}
          onChangeText={onChangeText}
          _value={email}
          containerStyle={styles.mt20}
          inputContainerStyle={styles.textInputContainerStyle}
          inputBoxStyle={styles.textInputStyle}
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
