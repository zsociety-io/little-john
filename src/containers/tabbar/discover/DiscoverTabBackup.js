import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';

// Local import
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import { commonColor, styles } from '../../../themes';
import { deviceWidth, moderateScale } from '../../../common/constants';
import { AppLogoLight } from '../../../assets/svgs';
import CInput from '../../../components/common/CInput';
import {
  discoverStockData,
  stockCategoryData,
  topMoversData,
  discoverListedStock,
} from '../../../api/constant';
import CText from '../../../components/common/CText';
import KeyBoardAvoidWrapper from '../../../components/common/KeyBoardAvoidWrapper';
import images from '../../../assets/images';
import { StackNav } from '../../../navigation/NavigationKeys';
import ChipsComponent from '../../../components/ChipsComponent';
import DiscoverStockComponent from '../../../components/DiscoverStockComponent';

const DiscoverTab = ({ navigation }) => {
  const colors = useSelector(state => state.theme.theme);
  const [search, setSearch] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const onSearchInput = val => setSearch(val);
  const onSearchFocus = () => setSearchFocus(true);
  const onSearchBlur = () => setSearchFocus(false);

  const onPressSearch = () => navigation.navigate(StackNav.AllStocks);
  const onPressAllStocks = () => navigation.navigate(StackNav.AllStocks);
  const onToggleMoreFilters = () => setShowMoreFilters(!showMoreFilters);

  // Create worst movers data (opposite of top movers)
  const worstMoversData = topMoversData.map(item => ({
    ...item,
    percentage: '-' + item.percentage,
    status: false,
  }));

  const filterOptions = ['All', 'Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer'];
  const visibleFilters = showMoreFilters ? filterOptions : [filterOptions[0]];

  const LeftIcon = () => {
    return (
      <View style={styles.pr10}>
        <AppLogoLight height={moderateScale(30)} width={moderateScale(30)} />
      </View>
    );
  };

  const RightIcon = () => {
    return (
      <View style={styles.rowCenter}>
        <TouchableOpacity onPress={onPressSearch}>
          <Ionicons
            name="search-outline"
            size={moderateScale(26)}
            color={colors.textColor}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.ph10}>
          <Ionicons
            name="ellipsis-horizontal-circle"
            size={moderateScale(26)}
            color={colors.textColor}
          />
        </TouchableOpacity>
      </View>
    );
  };

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

  const renderTopMovers = ({ item, index }) => {
    return (
      <TouchableOpacity style={localStyles.topStockContainer}>
        <Image source={item?.image} style={localStyles.topStockImageStyle} />
        <CText
          type={'b18'}
          numberOfLines={1}
          align={'center'}
          style={localStyles.stockTitleStyle}>
          {item?.stockName}
        </CText>
        <CText
          type={'b18'}
          color={item.status ? colors.primary : colors.redColor}
          align={'center'}
          numberOfLines={1}
          style={styles.flex}>
          {item.status ? '+ ' : ''}{item?.percentage}
        </CText>
      </TouchableOpacity>
    );
  };

  const renderWorstMovers = ({ item, index }) => {
    return (
      <TouchableOpacity style={localStyles.topStockContainer}>
        <Image source={item?.image} style={localStyles.topStockImageStyle} />
        <CText
          type={'b18'}
          numberOfLines={1}
          align={'center'}
          style={localStyles.stockTitleStyle}>
          {item?.stockName}
        </CText>
        <CText
          type={'b18'}
          color={colors.redColor}
          align={'center'}
          numberOfLines={1}
          style={styles.flex}>
          {item?.percentage}
        </CText>
      </TouchableOpacity>
    );
  };

  const renderAllStockItem = ({ item, index }) => (
    <DiscoverStockComponent item={item} />
  );

  const SubHeader = ({ title, onPress }) => {
    return (
      <View style={localStyles.subHeaderStyle}>
        <CText type={'b20'}>{title}</CText>
        <TouchableOpacity onPress={onPress}>
          <Ionicons
            name="arrow-forward"
            size={moderateScale(26)}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const FilterSection = () => {
    return (
      <View style={localStyles.filterContainer}>
        <View style={localStyles.filterRow}>
          {visibleFilters.map((filter, index) => (
            <TouchableOpacity
              key={index}
              style={[
                localStyles.filterChip,
                selectedFilter === filter && localStyles.selectedFilterChip,
              ]}
              onPress={() => setSelectedFilter(filter)}>
              <CText
                type={'m14'}
                color={selectedFilter === filter ? colors.white : colors.textColor}>
                {filter}
              </CText>
            </TouchableOpacity>
          ))}
          {!showMoreFilters && (
            <TouchableOpacity
              style={localStyles.moreFiltersButton}
              onPress={onToggleMoreFilters}>
              <CText type={'m14'} color={colors.primary}>
                More Filters
              </CText>
              <Ionicons
                name="chevron-down"
                size={moderateScale(16)}
                color={colors.primary}
                style={styles.ml5}
              />
            </TouchableOpacity>
          )}
        </View>
        {showMoreFilters && (
          <TouchableOpacity
            style={localStyles.lessFiltersButton}
            onPress={onToggleMoreFilters}>
            <CText type={'m14'} color={colors.primary}>
              Less Filters
            </CText>
            <Ionicons
              name="chevron-up"
              size={moderateScale(16)}
              color={colors.primary}
              style={styles.ml5}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const RenderCategory = ({ item, index }) => {
    return (
      <ImageBackground
        source={item.image}
        imageStyle={{ borderRadius: moderateScale(24) }}
        style={[
          localStyles.imageBackgroundStyle,
          index % 2 === 0 ? styles.mr5 : styles.ml5,
        ]}>
        <View style={localStyles.innerContainer}>
          <CText type={'b20'} numberOfLines={1} color={colors.white}>
            {item.title}
          </CText>
          <CText type={'m12'} numberOfLines={1} color={colors.white}>
            {item.desc}
          </CText>
        </View>
      </ImageBackground>
    );
  };

  const renderHeaderComponent = () => {
    return (
      <View>
        {/* TOP MOVERS SECTION */}
        <SubHeader title={strings.topMovers} onPress={onPressSearch} />
        <FlashList
          removeClippedSubviews={false}
          data={topMoversData}
          renderItem={renderTopMovers}
          keyExtractor={(item, index) => 'top_' + index.toString()}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          estimatedItemSize={5}
        />

        {/* WORST MOVERS SECTION */}
        <SubHeader title="Worst Movers" onPress={onPressSearch} />
        <FlashList
          removeClippedSubviews={false}
          data={worstMoversData}
          renderItem={renderWorstMovers}
          keyExtractor={(item, index) => 'worst_' + index.toString()}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          estimatedItemSize={5}
        />

        {/* SEARCH BAR */}
        <View style={localStyles.searchContainer}>
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

        {/* FILTERS SECTION */}
        <FilterSection />

        {/* ALL STOCKS HEADER */}
        <SubHeader title="All Stocks" onPress={onPressAllStocks} />
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <CHeader
        isHideBack={true}
        title={strings.discover}
        isLeftIcon={<LeftIcon />}
        rightIcon={<RightIcon />}
      />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <FlashList
          removeClippedSubviews={false}
          data={discoverListedStock}
          renderItem={renderAllStockItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={10}
          ListHeaderComponent={renderHeaderComponent}
        />
      </KeyBoardAvoidWrapper>
    </CSafeAreaView>
  );
};

export default DiscoverTab;

const localStyles = StyleSheet.create({
  inputContainerStyle: {
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(1),
  },
  inputBoxStyle: {
    ...styles.ph15,
  },
  searchContainer: {
    ...styles.mt20,
    ...styles.mb10,
  },
  subHeaderStyle: {
    ...styles.rowSpaceBetween,
    ...styles.mt20,
    ...styles.mb10,
  },
  topStockImageStyle: {
    height: moderateScale(80),
    width: moderateScale(80),
    borderRadius: moderateScale(40),
    borderWidth: moderateScale(4),
    borderColor: commonColor.primary,
    resizeMode: 'contain',
  },
  topStockContainer: {
    ...styles.flex,
    ...styles.itemsCenter,
    ...styles.p10,
  },
  stockTitleStyle: {
    width: moderateScale(80),
    ...styles.mv10,
    ...styles.flex,
  },
  filterContainer: {
    ...styles.mt15,
    ...styles.mb20,
  },
  filterRow: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    flexWrap: 'wrap',
  },
  filterChip: {
    ...styles.ph15,
    ...styles.pv8,
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(1),
    borderColor: commonColor.grayScale3,
    ...styles.mr10,
    ...styles.mb10,
  },
  selectedFilterChip: {
    backgroundColor: commonColor.primary,
    borderColor: commonColor.primary,
  },
  moreFiltersButton: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.ph15,
    ...styles.pv8,
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(1),
    borderColor: commonColor.primary,
    ...styles.mr10,
    ...styles.mb10,
  },
  lessFiltersButton: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.ph15,
    ...styles.pv8,
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(1),
    borderColor: commonColor.primary,
    alignSelf: 'flex-start',
    ...styles.mt5,
  },
});
