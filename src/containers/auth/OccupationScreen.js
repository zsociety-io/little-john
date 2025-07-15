import React, {useState} from 'react';

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

export default OccupationScreen = ({navigation, route}) => {
  const {companyName} = route.params?.companyName;
  const [name, setName] = useState('');

  const companyText = () => {
    if (!!companyName) {
      return companyName;
    } else return 'XYZ Company';
  };

  const onChangeText = val => setName(val);

  const onPressContinue = () => navigation.navigate(StackNav.UploadIDScreen);

  return (
    <CSafeAreaView>
      <SubHeader status={10} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <CText type={'B30'}>
          {strings.question10}
          <CText type={'B30'} color={commonColor.primary}>
            {companyText()}
          </CText>
          <CText type={'B30'}>{'? 💼'}</CText>
        </CText>
        <CInput
          label={strings.yourOccupation}
          placeholder={strings.enterYourOccupation}
          onChangeText={onChangeText}
          _value={name}
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
