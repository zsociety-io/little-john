import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
import {moderateScale} from '../../common/constants';

export default EmergencyContactScreen = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);
  const [address, setAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [relationShip, setRelationShip] = useState('');
  const [isCheck, setIsCheck] = useState(false);

  const onChangeAddress = val => setAddress(val);
  const onChangeName = val => setFullName(val);
  const onChangeRelation = val => setRelationShip(val);

  const onPressContinue = () =>
    navigation.navigate(StackNav.ContactDetailScreen);

  const onPressCheck = () => setIsCheck(!isCheck);

  return (
    <CSafeAreaView>
      <SubHeader status={16} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <CText type={'B30'}>{strings.question16}</CText>
        <CText style={styles.mv15} type={'r18'}>
          {strings.question16Desc}
        </CText>
        <CInput
          label={strings.fullName}
          placeholder={strings.enterFullName}
          onChangeText={onChangeName}
          _value={fullName}
          inputContainerStyle={styles.textInputContainerStyle}
          inputBoxStyle={styles.textInputStyle}
        />
        <CInput
          label={strings.relationShip}
          placeholder={strings.enterYourRelationShip}
          onChangeText={onChangeRelation}
          _value={relationShip}
          inputContainerStyle={styles.textInputContainerStyle}
          inputBoxStyle={styles.textInputStyle}
        />
        <CInput
          label={strings.address}
          placeholder={strings.enterAddress}
          onChangeText={onChangeAddress}
          _value={address}
          inputContainerStyle={styles.textInputContainerStyle}
          inputBoxStyle={styles.textInputStyle}
        />
        <View style={localStyles.checkContainer}>
          <Ionicons
            name={!isCheck ? 'square-outline' : 'checkbox'}
            size={moderateScale(24)}
            color={colors.primary}
            onPress={onPressCheck}
            style={styles.mr10}
          />
          <CText type={'s16'}>{strings.sameMyAddress}</CText>
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
  checkContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.mv10,
  },
});
