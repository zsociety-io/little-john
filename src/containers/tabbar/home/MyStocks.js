import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FlashList } from '@shopify/flash-list';

// Local Imports
import CText from '../../../components/common/CText';
import { styles } from '../../../themes';
import { moderateScale } from '../../../common/constants';
import DiscoverStockComponent from '../../../components/DiscoverStockComponent';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import { discoverListedStock } from '../../../api/constant';
import CHeader from '../../../components/common/CHeader';

export default function MyStocks() {
  const colors = useSelector(state => state.theme.theme);

  const renderHeaderComponent = () => {
    return (
      <View style={localStyles.headerContainer}>
        <CText type={'b18'}>{'24 Companies'}</CText>
        <TouchableOpacity style={styles.rowCenter}>
          <CText type={'b18'} color={colors.primary}>
            {'Recently'}
          </CText>
          <Ionicons
            name="swap-vertical"
            size={moderateScale(24)}
            color={colors.primary}
            style={styles.ml5}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderListedStock = ({ item, index }) => (
    <DiscoverStockComponent item={item} />
  );

  const RightIcon = () => {
    return (
      <TouchableOpacity>
        <Ionicons
          name="search-outline"
          size={moderateScale(26)}
          color={colors.textColor}
        />
      </TouchableOpacity>
    );
  };

  return (
    <CSafeAreaView>
      <CHeader title={'My Stocks'} rightIcon={<RightIcon />} />
      <FlashList
        removeClippedSubviews={false}
        data={discoverListedStock}
        renderItem={renderListedStock}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={10}
        removeClippedSubviews={false}
        contentContainerStyle={styles.flex}
        ListHeaderComponent={renderHeaderComponent}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  headerContainer: {
    ...styles.rowSpaceBetween,
    ...styles.ph20,
    ...styles.pv10,
  },
});
