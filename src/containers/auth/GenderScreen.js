import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

//Local Imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import SubHeader from '../../components/SubHeader';
import CText from '../../components/common/CText';
import CButton from '../../components/common/CButton';
import strings from '../../i18n/strings';
import { StackNav } from '../../navigation/NavigationKeys';
import { GenderData } from '../../api/constant';
import { moderateScale } from '../../common/constants';
import { styles } from '../../themes';

export default GenderScreen = ({ navigation }) => {
  const colors = useSelector(state => state.theme.theme);
  const [isSelected, setIsSelected] = useState('');

  const onPressItem = val => setIsSelected(val);

  const onPressContinue = () => navigation.navigate(StackNav.BirthdayScreen);

  const RenderData = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => onPressItem(item.value)}
        style={[
          localStyles.settingsContainer,
          {
            borderBottomColor: colors.dark ? colors.dark3 : colors.grayScale2,
          },
        ]}>
        <Ionicons
          name={
            isSelected === item.value ? 'radio-button-on' : 'radio-button-off'
          }
          size={moderateScale(24)}
          color={colors.primary}
          style={styles.mr10}
        />
        <CText type="s18">{item.value}</CText>
      </TouchableOpacity>
    );
  };

  return (
    <CSafeAreaView>
      <SubHeader status={2} />
      <View style={localStyles.rootContainer}>
        <CText type={'B30'}>{strings.question2}</CText>
        <FlatList
          removeClippedSubviews={false} data={GenderData}
          renderItem={({ item }) => <RenderData item={item} />}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          bounces={false}
        />
      </View>
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
    ...styles.ph20,
    ...styles.pv10,
  },
  settingsContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.pv25,
    borderBottomWidth: moderateScale(1),
  },
});
