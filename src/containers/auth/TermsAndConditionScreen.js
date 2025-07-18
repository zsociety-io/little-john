import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

//Local Imports
import CSafeAreaView from '../../components/common/CSafeAreaView';
import SubHeader from '../../components/SubHeader';
import CText from '../../components/common/CText';
import { styles } from '../../themes';
import CButton from '../../components/common/CButton';
import strings from '../../i18n/strings';
import { StackNav } from '../../navigation/NavigationKeys';
import { moderateScale } from '../../common/constants';
import { termsAndConditionData } from '../../api/constant';

export default TermsAndConditionScreen = ({ navigation }) => {
  const colors = useSelector(state => state.theme.theme);
  const [isSelected, setIsSelected] = useState([]);

  const onPressItem = val => {
    if (isSelected.includes(val)) {
      setIsSelected(isSelected.filter(item => item !== val));
    } else {
      setIsSelected([...isSelected, val]);
    }
  };

  const onPressContinue = () => navigation.navigate(StackNav.SignatureScreen);

  const RenderData = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => onPressItem(item)}
        style={[
          localStyles.settingsContainer,
          { borderBottomColor: colors.dark ? colors.dark3 : colors.grayScale2 },
        ]}>
        <Ionicons
          name={!isSelected.includes(item) ? 'square-outline' : 'checkbox'}
          size={moderateScale(24)}
          color={colors.primary}
          style={styles.mr10}
        />
        <CText type="s18" style={styles.flex}>
          {item}
        </CText>
      </TouchableOpacity>
    );
  };

  const RenderHeaderComponent = () => (
    <CText type={'B30'}>{strings.question18}</CText>
  );

  return (
    <CSafeAreaView>
      <SubHeader status={18} />
      <View style={localStyles.rootContainer}>
        <FlatList
          removeClippedSubviews={false} data={termsAndConditionData}
          renderItem={({ item }) => <RenderData item={item} />}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          bounces={false}
          ListHeaderComponent={<RenderHeaderComponent />}
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
