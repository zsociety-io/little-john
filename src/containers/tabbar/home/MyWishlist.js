import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {FlashList} from '@shopify/flash-list';

// Local Imports
import CText from '../../../components/common/CText';
import {styles} from '../../../themes';
import {moderateScale} from '../../../common/constants';
import DiscoverStockComponent from '../../../components/DiscoverStockComponent';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import {myWishlistStockData} from '../../../api/constant';
import CHeader from '../../../components/common/CHeader';

export default function MyWishlist() {
  const colors = useSelector(state => state.theme.theme);

  const renderHeaderComponent = () => {
    return (
      <View style={localStyles.headerContainer}>
        <CText type={'b18'}>{'18 Companies'}</CText>
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

  const renderListedStock = ({item, index}) => (
    <DiscoverStockComponent item={item} />
  );

  const RightIcon = () => {
    return (
      <View style={styles.rowCenter}>
        <TouchableOpacity style={styles.ph10}>
          <Ionicons
            name="search-outline"
            size={moderateScale(26)}
            color={colors.textColor}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name="add"
            size={moderateScale(26)}
            color={colors.textColor}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <CHeader title={'My Wishlist'} rightIcon={<RightIcon />} />
      <FlashList
        data={myWishlistStockData}
        renderItem={renderListedStock}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={8}
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
