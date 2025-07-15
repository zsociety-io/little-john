import React from 'react';

//Local Imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import SubHeader from '../../components/SubHeader';
import KeyBoardAvoidWrapper from '../../components/common/KeyBoardAvoidWrapper';
import CText from '../../components/common/CText';
import {styles} from '../../themes';
import CButton from '../../components/common/CButton';
import strings from '../../i18n/strings';
import {StackNav} from '../../navigation/NavigationKeys';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';

export default SelfieImageScreen = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);

  const onPressContinue = () =>
    navigation.navigate(StackNav.EmergencyContactScreen);

  return (
    <CSafeAreaView>
      <SubHeader status={15} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <CText type={'B30'} align={'center'}>
          {strings.question15}
        </CText>
        <CText style={styles.mv15} type={'r18'} align={'center'}>
          {strings.question15Desc}
        </CText>
      </KeyBoardAvoidWrapper>
      <View style={localStyles.btnContainer}>
        <CButton
          type={'S16'}
          title={strings.reTake}
          bgColor={colors.dark3}
          color={colors.primary}
          style={styles.ml10}
          containerStyle={localStyles.changeBtn}
        />
        <CButton
          title={strings.continue}
          containerStyle={localStyles.changeBtn}
          onPress={onPressContinue}
        />
      </View>
    </CSafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  btnContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mb10,
    ...styles.mh20,
  },
  changeBtn: {
    width: '45%',
  },
});
