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

export default CompanyNameScreen = ({navigation}) => {
  const [companyName, setCompanyName] = useState('');

  const onChangeText = val => setCompanyName(val);

  const onPressContinue = () =>
    navigation.navigate(StackNav.OccupationScreen, {companyName});

  return (
    <CSafeAreaView>
      <SubHeader status={9} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <CText type={'B30'}>{strings.question9}</CText>
        <CText style={styles.mt15} type={'r18'}>
          {strings.question9Desc}
        </CText>
        <CInput
          label={strings.companyName}
          placeholder={strings.enterYourCompanyName}
          onChangeText={onChangeText}
          _value={companyName}
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
