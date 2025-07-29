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
import ListSkeleton from '../../../components/common/ListSkeleton';
import { getAllStocks } from '../../../api/stocks';


const renderListedStock = ({ item, index }) => (
  <DiscoverStockComponent item={item} />
);

export default function AllStocks() {
  const colors = useSelector(state => state.theme.theme);
  const [search, setSearch] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);
  const sortStocks = (data, asc) => {
    return [...data].sort((a, b) => {
      if (!a.companyName || !b.companyName) return 0;
      if (asc) {
        return a.companyName.localeCompare(b.companyName);
      } else {
        return b.companyName.localeCompare(a.companyName);
      }
    });
  };
  
  // Filtrer et trier
  // Removed duplicate filterDataList function


  const [allStocksData, setAllStocksData] = useState([]);

  useEffect(() => {
    const loadStocks = async () => {
      const [allStocks, allEtfs] = await getAllStocks(); //getDiscoverStocks
      const allAssets = [...allStocks, ...allEtfs]
      setAllStocksData(allAssets);
    };
    loadStocks();
  }, []);

  useEffect(() => {
    // Simuler un chargement de 2 secondes
    filterDataList();
    setLoading(false);
  }, [search, allStocksData, sortAsc]);

  const filterDataList = () => {
  let filteredData = allStocksData;
  if (!!search) {
    filteredData = filteredData.filter(item =>
      item.companyName.toLowerCase().includes(search.toLowerCase()),
    );
  }
  setFilterData(sortStocks(filteredData, sortAsc));
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
        <CText type={'b18'}>{'ETF and Stocks'}</CText>
        <TouchableOpacity style={styles.rowCenter}
        onPress={() => setSortAsc(prev => !prev)} // Inverse
        >
          <CText type={'b18'} color={colors.primary}>
            {sortAsc ? 'A to Z' : 'Z to A'}
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
      <CHeader title={'All Stocks'} />

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
      {loading ? (
        <ListSkeleton count={8} height={moderateScale(70)} />
      ) : (
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
      )}
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
