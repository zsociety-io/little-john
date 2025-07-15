import React, {useState} from 'react';

//Local Imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import SubHeader from '../../components/SubHeader';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import CText from '../../components/common/CText';
import {styles} from '../../themes';
import CInput from '../../components/common/CInput';
import CButton from '../../components/common/CButton';
import strings from '../../i18n/strings';
import {StackNav} from '../../navigation/NavigationKeys';

export default ContactDetailScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const onChangeEmail = val => setEmail(val);
  const onChangePhoneNumber = val => setPhoneNumber(val);

  const onPressContinue = () =>
    navigation.navigate(StackNav.TermsAndConditionScreen);

  return (
    <CSafeAreaView>
      <SubHeader status={17} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <CText type={'B30'}>{strings.question17}</CText>
        <CText style={styles.mv15} type={'r18'}>
          {strings.question16Desc}
        </CText>
        <CInput
          label={strings.email}
          placeholder={strings.enterYourEmail}
          onChangeText={onChangeEmail}
          _value={email}
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
      </KeyBoardAvoidWrapper>
      <CButton
        title={strings.continue}
        containerStyle={styles.bottomButton}
        onPress={onPressContinue}
      />
    </CSafeAreaView>
  );
};
