import {
  Image,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';

// Local import
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import CText from '../../../components/common/CText';
import {styles} from '../../../themes';
import {moderateScale} from '../../../common/constants';
import {WithdrawalOtradeData} from '../../../api/constant';
import {StackNav} from '../../../navigation/NavigationKeys';

export default function WithdrawalAccount({navigation}) {
  const colors = useSelector(state => state.theme.theme);

  const RenderHeader = val => {
    return (
      <CText type="b20" style={styles.mv10}>
        {val?.section?.title}
      </CText>
    );
  };

  const onPressItem = val =>
    navigation.navigate(StackNav.ConfirmBankAccountDetail, {
      bank: {
        title: val.desc,
        image: val.image,
        added: true,
      },
    });

  const onPressAddBankAccount = () =>
    navigation.navigate(StackNav.AddBankAccount);

  const RenderData = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => onPressItem(item)}
        style={localStyles.settingsContainer}>
        <View style={localStyles.leftContainer}>
          <Image source={item.image} style={localStyles.imageStyle} />
          <View style={styles.flex}>
            <CText type="b18">{item.title}</CText>
            {item.desc && (
              <CText
                type="m14"
                numberOfLines={1}
                style={[styles.mt5, styles.flex]}>
                {item.desc}
              </CText>
            )}
          </View>
        </View>
        <Ionicons
          name={'chevron-forward-outline'}
          size={moderateScale(24)}
          color={colors.primary}
        />
      </TouchableOpacity>
    );
  };

  const RightIcon = () => {
    return (
      <TouchableOpacity onPress={onPressAddBankAccount} style={styles.pr10}>
        <Ionicons
          name="add"
          size={moderateScale(26)}
          color={colors.textColor}
        />
      </TouchableOpacity>
    );
  };

  return (
    <CSafeAreaView>
      <CHeader title={strings.withdrawalAccount} rightIcon={<RightIcon />} />
      <SectionList
        sections={WithdrawalOtradeData}
        keyExtractor={(item, index) => item + index}
        renderItem={RenderData}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={RenderHeader}
        contentContainerStyle={styles.ph20}
        showsVerticalScrollIndicator={false}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  imageStyle: {
    height: moderateScale(60),
    width: moderateScale(60),
    resizeMode: 'contain',
    ...styles.mr10,
  },
  settingsContainer: {
    ...styles.rowSpaceBetween,
    ...styles.pv15,
    ...styles.flex,
  },
  leftContainer: {
    ...styles.flexRow,
    ...styles.flex,
    ...styles.itemsCenter,
  },
});
