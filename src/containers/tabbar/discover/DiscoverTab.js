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
  const [filterData, setFilterData] = useState(discoverListedStock);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const searchInputRef = React.useRef(null);

  const onSearchInput = val => setSearch(val);
  const onSearchFocus = () => setSearchFocus(true);
  const onSearchBlur = () => setSearchFocus(false);

  // Function to handle search container press and force focus
  const onPressSearchContainer = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const onPressSearch = () => navigation.navigate(StackNav.AllStocks);
  const onPressAllStocks = () => navigation.navigate(StackNav.AllStocks);

  const onToggleFilters = () => setShowFilters(!showFilters);

  const onFilterPress = (item, index) => {
    const isSelected = selectedFilters.includes(index);
    if (isSelected) {
      setSelectedFilters(selectedFilters.filter(id => id !== index));
    } else {
      setSelectedFilters([...selectedFilters, index]);
    }
  };

  // Filter data based on search input
  React.useEffect(() => {
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
          type={'m12'}
          numberOfLines={1}
          align={'center'}
          style={localStyles.stockTitleStyle}>
          {item?.stockName}
        </CText>
        <CText
          type={'m12'}
          color={colors.primary}
          align={'center'}
          numberOfLines={1}
          style={styles.flex}>
          {'+ ' + item?.percentage}
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

  const FilterDropdown = () => {
    return (
      <View style={localStyles.filterButtonContainer}>
        {stockCategoryData.map((item, index) => {
          const isSelected = selectedFilters.includes(index);
          return (
            <TouchableOpacity
              key={index}
              style={[
                localStyles.filterButton2,
                {
                  backgroundColor: isSelected ? colors.primary : 'transparent',
                  borderColor: colors.primary
                },
              ]}
              onPress={() => onFilterPress(item, index)}
              activeOpacity={0.7}>
              <CText
                type={'s16'}
                color={isSelected ? colors.white : colors.primary}
                align={'center'}>
                {item}
              </CText>
            </TouchableOpacity>
          );
        })}
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
        {/* SEARCH BAR WITH FILTER */}
        <View style={[localStyles.searchContainer, styles.ph20]}>
          <TouchableOpacity
            style={localStyles.searchInputContainer}
            onPress={onPressSearchContainer}
            activeOpacity={1}>
            <CInput
              fieldRef={searchInputRef}
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
          </TouchableOpacity>
          <TouchableOpacity
            style={[localStyles.filterButton, { backgroundColor: colors.inputBg }]}
            onPress={onToggleFilters}>
            <Ionicons
              name="funnel-outline"
              size={moderateScale(20)}
              color={colors.textColor}
            />
          </TouchableOpacity>
        </View>

        {/* FILTER BUTTONS */}
        {showFilters && <FilterDropdown />}

        {/* TRENDING FLOWS SECTION - Hidden when filters are shown, search is focused, or search has content */}
        {!showFilters && !searchFocus && !search && (
          <>
            <SubHeader title="Trending flows" onPress={onPressSearch} />
            <FlashList
              removeClippedSubviews={false}
              data={topMoversData}
              renderItem={renderTopMovers}
              keyExtractor={(item, index) => 'top_' + index.toString()}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              estimatedItemSize={5}
            />
          </>
        )}

        {/* STOCKS SECTION HEADER */}
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
          data={filterData}
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
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.mb15,
  },
  searchInputContainer: {
    ...styles.flex,
    ...styles.mr10,
  },
  filterButton: {
    ...styles.center,
    height: moderateScale(45),
    width: moderateScale(45),
    borderRadius: moderateScale(12),
    backgroundColor: commonColor.inputBg,
    borderWidth: moderateScale(1),
    borderColor: commonColor.grayScale3,
  },
  filterButtonContainer: {
    ...styles.flexRow,
    flexWrap: 'wrap',
    ...styles.mb15,
    paddingHorizontal: moderateScale(5),
  },
  filterButton2: {
    borderRadius: moderateScale(25),
    borderWidth: moderateScale(1),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(8),
    marginRight: moderateScale(8),
    marginBottom: moderateScale(8),
    minHeight: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterItem: {
    ...styles.ph12,
    ...styles.pv6,
    borderRadius: moderateScale(15),
    ...styles.mb5,
  },
  selectedFilterItem: {
    backgroundColor: commonColor.primary,
  },
  subHeaderStyle: {
    ...styles.rowSpaceBetween,
    ...styles.mt20,
    ...styles.mb10,
    ...styles.ph20,
  },
  topStockImageStyle: {
    height: moderateScale(50),
    width: moderateScale(50),
    borderRadius: moderateScale(25),
    borderWidth: moderateScale(2),
    borderColor: commonColor.primary,
    resizeMode: 'contain',
  },
  topStockContainer: {
    ...styles.flex,
    ...styles.itemsCenter,
    ...styles.p5,
  },
  stockTitleStyle: {
    width: moderateScale(60),
    ...styles.mv5,
    ...styles.flex,
  },
});
