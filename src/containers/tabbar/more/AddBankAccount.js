import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { FlashList } from '@shopify/flash-list';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local import
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CText from '../../../components/common/CText';
import { styles } from '../../../themes';
import { moderateScale } from '../../../common/constants';
import { addBankAccountData } from '../../../api/constant';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import CDivider from '../../../components/common/CDivider';
import { StackNav } from '../../../navigation/NavigationKeys';

export default function AddBankAccount({ navigation }) {
  const colors = useSelector(state => state.theme.theme);

  const onPressItem = val =>
    navigation.navigate(StackNav.BankAccountDetail, {
      bank: val,
    });

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => onPressItem(item)}
        style={localStyles.settingsContainer}>
        <View style={localStyles.leftContainer}>
          <Image source={item.image} style={localStyles.imageStyle} />
          <CText type="b18" style={styles.flex}>
            {item.title}
          </CText>
        </View>
        <Ionicons
          name={'chevron-forward-outline'}
          size={moderateScale(24)}
          color={colors.primary}
        />
      </TouchableOpacity>
    );
  };

  const RenderHeader = () => {
    return (
      <CText type="b20" style={styles.mv10}>
        {'Which bank should we send your withdrawals to? 🏦'}
      </CText>
    );
  };

  const separatorComponent = () => <CDivider />;

  return (
    <CSafeAreaView>
      <CHeader title={strings.addBankAccount} />
      <FlashList
        removeClippedSubviews={false}
        data={addBankAccountData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={10}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={RenderHeader}
        contentContainerStyle={styles.ph20}
        ItemSeparatorComponent={separatorComponent}
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
