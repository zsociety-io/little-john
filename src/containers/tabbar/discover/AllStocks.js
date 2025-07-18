import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local Imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import { styles } from '../../../themes';
import CInput from '../../../components/common/CInput';
import { discoverListedStock } from '../../../api/constant';
import { moderateScale } from '../../../common/constants';
import DiscoverStockComponent from '../../../components/DiscoverStockComponent';
import CText from '../../../components/common/CText';

const renderListedStock = ({ item, index }) => (
  <DiscoverStockComponent item={item} />
);

export default function AllStocks() {
  const colors = useSelector(state => state.theme.theme);
  const [search, setSearch] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const [filterData, setFilterData] = useState(discoverListedStock);

  useEffect(() => {
    filterDataList();
  }, [search]);

  const filterDataList = () => {
    if (!!search) {
      const filteredData = discoverListedStock.filter(item =>
        item.companyName.toLowerCase().includes(search.toLowerCase()),
      );
      setFilterData(filteredData);
    } else {
      setFilterData(discoverListedStock);
    }
  };

  const onSearchInput = val => setSearch(val);
  const onSearchFocus = () => setSearchFocus(true);
  const onSearchBlur = () => setSearchFocus(false);

  const Search_Icon = () => (
    <Ionicons
      name={'search-outline'}
      size={moderateScale(20)}
      color={
        searchFocus
          ? colors.primary
          : colors.dark
            ? colors.grayScale7
            : colors.grayScale4
      }
    />
  );

  const renderHeaderComponent = () => {
    return (
      <View style={[styles.rowSpaceBetween, styles.ph20]}>
        <CText type={'b18'}>{'500 Companies'}</CText>
        <TouchableOpacity style={styles.rowCenter}>
          <CText type={'b18'} color={colors.primary}>
            {'A to Z'}
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

  return (
    <CSafeAreaView>
      <CHeader title={'✅ All Stocks'} />
      <View style={styles.ph20}>
        <CInput
          placeHolder={strings.searchStockCompany}
          _value={search}
          keyBoardType={'default'}
          autoCapitalize={'none'}
          insideLeftIcon={Search_Icon}
          toGetTextFieldValue={onSearchInput}
          inputContainerStyle={[
            { backgroundColor: colors.inputBg },
            searchFocus && { borderColor: colors.primary },
            localStyles.inputContainerStyle,
          ]}
          inputBoxStyle={localStyles.inputBoxStyle}
          _onFocus={onSearchFocus}
          _onBlur={onSearchBlur}
        />
      </View>
      <FlashList
        removeClippedSubviews={false}
        data={filterData}
        renderItem={renderListedStock}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={10}
        contentContainerStyle={styles.flex}
        ListHeaderComponent={renderHeaderComponent}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  inputContainerStyle: {
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
  },
  inputBoxStyle: {
    ...styles.ph15,
  },
});
