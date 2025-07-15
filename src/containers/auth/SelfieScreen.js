import React from 'react';
import {View} from 'react-native';

//Local Imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import SubHeader from '../../components/SubHeader';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import CText from '../../components/common/CText';
import {styles} from '../../themes';
import CButton from '../../components/common/CButton';
import strings from '../../i18n/strings';
import {StackNav} from '../../navigation/NavigationKeys';
import {SelfieLight} from '../../assets/svgs';

export default SelfieScreen = ({navigation}) => {
  const onPressContinue = () => navigation.navigate(StackNav.SelfieImageScreen);

  return (
    <CSafeAreaView>
      <SubHeader status={14} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <CText type={'B30'}>{strings.question14}</CText>
        <CText style={styles.mv15} type={'r18'}>
          {strings.question14Desc}
        </CText>
        <View style={styles.selfCenter}>
          <SelfieLight style={styles.mt20} />
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
