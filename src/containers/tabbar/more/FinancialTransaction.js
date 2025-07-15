import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {FlashList} from '@shopify/flash-list';

// Custom Imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import {moderateScale} from '../../../common/constants';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import {styles} from '../../../themes';
import CText from '../../../components/common/CText';
import {financialTransactionData} from '../../../api/constant';
import CDivider from '../../../components/common/CDivider';

export default function FinancialTransaction() {
  const colors = useSelector(state => state.theme.theme);

  const RightIcon = () => {
    return (
      <TouchableOpacity style={styles.pr10}>
        <Ionicons
          name="search-outline"
          size={moderateScale(26)}
          color={colors.textColor}
        />
      </TouchableOpacity>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={localStyles.settingsContainer}>
        <View style={localStyles.leftContainer}>
          <Image source={item.image} style={localStyles.imageStyle} />
          <View style={[styles.ph10, styles.flex]}>
            <CText type="b18" numberOfLines={1} style={styles.flex}>
              {item.title}
            </CText>
            <CText
              type="m14"
              numberOfLines={1}
              style={[styles.mt5, styles.flex]}>
              {item.date}
            </CText>
          </View>
        </View>
        <View style={[styles.ph10, styles.itemsEnd]}>
          <CText type="b18" numberOfLines={1} style={styles.flex}>
            {item.amount}
          </CText>
          <CText type="m14" numberOfLines={1} style={[styles.mt5, styles.flex]}>
            {item.value}
          </CText>
        </View>
      </View>
    );
  };

  const separatorComponent = () => <CDivider />;

  return (
    <CSafeAreaView>
      <CHeader title={strings.financialTransaction} rightIcon={<RightIcon />} />
      <FlashList
        data={financialTransactionData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={10}
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
  },
  settingsContainer: {
    ...styles.rowSpaceBetween,
    ...styles.pv15,
  },
  leftContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.flex,
  },
});
