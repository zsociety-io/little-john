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

export default BirthPlaceScreen = ({navigation}) => {
  const [placeOfBirth, setPlaceOfBirth] = useState('');

  const onChangeText = val => setPlaceOfBirth(val);

  const onPressContinue = () => navigation.navigate(StackNav.InvestmentScreen);

  return (
    <CSafeAreaView>
      <SubHeader status={4} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <CText type={'B30'}>{strings.question4}</CText>
        <CInput
          label={strings.placeOfBirth}
          placeholder={strings.enterYourPlaceOfBirth}
          onChangeText={onChangeText}
          _value={placeOfBirth}
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
