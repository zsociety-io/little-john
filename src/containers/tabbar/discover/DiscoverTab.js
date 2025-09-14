import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
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
import ListSkeleton from '../../../components/common/ListSkeleton';
import AutoRefreshSettings from '../../../components/AutoRefreshSettings';

import { getDiscoverStocks } from '../../../api/stocks';

import { SvgUri } from 'react-native-svg';


const DiscoverTab = ({ navigation }) => {
  const colors = useSelector(state => state.theme.theme);
  const [search, setSearch] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const [filterData, setFilterData] = useState(discoverListedStock);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [allStocks, setAllStocks] = useState([]);
  const [topMovers, setTopMovers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = React.useRef(null);
  
  // Auto-refresh state (daily refresh)
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(86400); // 24 hours in seconds
  const refreshTimerRef = React.useRef(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRefreshSettings, setShowRefreshSettings] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(null);

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

  // Remplacez les deux useEffect par celui-ci :
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setIsLoading(true);
        const [allStocks, topStocks] = await getDiscoverStocks();
        
        setAllStocks(allStocks);
        setFilterData(allStocks);
        setTopMovers(topStocks);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // En cas d'erreur, utilisez les données statiques
        setAllStocks(discoverListedStock);
        setFilterData(discoverListedStock);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAllData();
  }, []);

  // Auto-refresh functionality (daily)
  useEffect(() => {
    if (!autoRefresh) return;

    const checkAndRefresh = async () => {
      const now = new Date();
      const lastRefresh = lastRefreshTime ? new Date(lastRefreshTime) : null;
      
      // Check if we need to refresh (24 hours have passed or first time)
      const shouldRefresh = !lastRefresh || 
        (now.getTime() - lastRefresh.getTime()) >= (24 * 60 * 60 * 1000);
      
      if (shouldRefresh) {
        try {
          setIsRefreshing(true);
          console.log('🔄 Daily auto-refresh: updating stock prices...');
          const [allStocks, topStocks] = await getDiscoverStocks();
          
          setAllStocks(allStocks);
          setTopMovers(topStocks);
          setLastRefreshTime(now.toISOString());
          
          // Re-apply current filters
          if (search.trim() || selectedFilters.length > 0) {
            filterDataList();
          } else {
            setFilterData(allStocks);
          }
          
          console.log('✅ Daily refresh completed successfully');
        } catch (error) {
          console.error('❌ Error during daily refresh:', error);
        } finally {
          setIsRefreshing(false);
        }
      }
    };

    // Check immediately on mount
    checkAndRefresh();

    // Set up daily check (every hour to be safe)
    refreshTimerRef.current = setInterval(checkAndRefresh, 60 * 60 * 1000); // Check every hour

    // Cleanup function
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [autoRefresh, search, selectedFilters, lastRefreshTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, []);

  // Fonction de filtrage optimisée
  const filterDataList = useCallback(() => {
    if (!allStocks.length) return;
    
    let filtered = allStocks;
    
    // Filtrer par recherche
    if (search.trim()) {
      filtered = filtered.filter(item =>
        item.companyName?.toLowerCase().includes(search.toLowerCase().trim()) ||
        item.stockName?.toLowerCase().includes(search.toLowerCase().trim())
      );
    }
    
    // Filtrer par catégories sélectionnées (utilise stockCategoryData)
    if (selectedFilters.length > 0) {
      const selectedCategories = selectedFilters.map(index => stockCategoryData[index]);
      filtered = filtered.filter(item =>
        item.categories?.some(category => selectedCategories.includes(category))
      );
    }
    
    setFilterData(filtered);
  }, [search, allStocks, selectedFilters]);

  // useEffect optimisé pour le filtrage
  useEffect(() => {
    if (!isLoading && allStocks.length > 0) {
      // Délai pour éviter trop d'appels
      const timeoutId = setTimeout(() => {
        filterDataList();
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [search, selectedFilters, allStocks, isLoading, filterDataList]);

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
        
        {/* Auto-refresh toggle button */}
        <TouchableOpacity 
          style={[styles.ph10, { opacity: autoRefresh ? 1 : 0.5 }]} 
          onPress={() => setAutoRefresh(!autoRefresh)}>
          <Ionicons
            name={autoRefresh ? "sync" : "sync-outline"}
            size={moderateScale(26)}
            color={autoRefresh ? colors.primary : colors.textColor}
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.ph10} 
          onPress={() => setShowRefreshSettings(true)}>
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
      <TouchableOpacity style={localStyles.topStockContainer} onPress={() => navigation.navigate(StackNav.StockDetailScreen, { item })}>
        <View style={[localStyles.roundLogoWrapper]}>
          {String(item?.image).endsWith("svg") && (<SvgUri uri={item?.image}
            width={localStyles.topStockImageStyle?.width}
            height={localStyles.topStockImageStyle?.height} />)}
          {!String(item?.image).endsWith("svg") && (<Image source={item?.image} style={localStyles.topStockImageStyle} />)}
        </View>

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

  const SubHeader = ({ title, onPress, hideForward }) => {
    return (
      <View style={localStyles.subHeaderStyle}>
        <CText type={'b20'}>{title}</CText>
        {!hideForward && (
          <TouchableOpacity onPress={onPress}>
            <Ionicons
              name="arrow-forward"
              size={moderateScale(26)}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}
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
      <View style={localStyles.headerContainer}>
        {/* SEARCH BAR WITH FILTER */}
        <View style={localStyles.searchContainer}>
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
          <View style={{ marginTop: moderateScale(15), marginBottom: moderateScale(15) }}>
            <SubHeader title="Trending flows" onPress={onPressSearch} hideForward />
            <FlashList
              removeClippedSubviews={false}
              data={topMovers}
              renderItem={renderTopMovers}
              keyExtractor={(item, index) => 'top_' + index.toString()}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              estimatedItemSize={5}
              contentContainerStyle={styles.ph20}
            />
          </View>
        )}

        {/* STOCKS SECTION HEADER */}
        <View style={{ marginTop: moderateScale(10) }}>
          <View style={[localStyles.subHeaderStyle, { alignItems: 'center' }]}>
            <View style={styles.flexRow}>
              <CText type={'b20'}>All Assets</CText>
              {/* Auto-refresh status indicator */}
              {autoRefresh && (
                <View style={[styles.flexRow, styles.itemsCenter, styles.ml10]}>
                  <View style={[
                    localStyles.refreshIndicator,
                    { backgroundColor: isRefreshing ? colors.primary : colors.primary + '40' }
                  ]} />
                  <CText 
                    type={'m12'} 
                    color={colors.grayScale6}
                    style={styles.ml5}>
                    {isRefreshing ? 'Refreshing...' : 'Daily refresh'}
                  </CText>
                </View>
              )}
            </View>
            <TouchableOpacity onPress={onPressAllStocks}>
              <Ionicons
                name="arrow-forward"
                size={moderateScale(26)}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
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
      <KeyBoardAvoidWrapper style={localStyles.listContainer}>
        {isLoading ? (
          <View>
            {renderHeaderComponent()}
            <ListSkeleton count={8} />
          </View>
        ) : (
          <FlashList
            removeClippedSubviews={false}
            data={filterData}
            renderItem={renderAllStockItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            showsVerticalScrollIndicator={false}
            estimatedItemSize={10}
            ListHeaderComponent={renderHeaderComponent}
            ListHeaderComponentStyle={localStyles.headerWrapper}
          />
        )}
      </KeyBoardAvoidWrapper>
      
      {/* Auto-refresh settings modal */}
      <AutoRefreshSettings
        visible={showRefreshSettings}
        onClose={() => setShowRefreshSettings(false)}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        refreshInterval={refreshInterval}
        setRefreshInterval={setRefreshInterval}
      />
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
    ...styles.ph20,
    ...styles.mb15,
    zIndex: 100, // Assure que la barre de recherche reste au-dessus
    backgroundColor: 'transparent', // Empêche la transparence
  },
  searchInputContainer: {
    ...styles.flex,
    ...styles.mr10,
    minHeight: moderateScale(45), // Hauteur minimale cohérente
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
    ...styles.ph20,
    ...styles.mb15,
    backgroundColor: 'transparent', // Empêche la transparence
    zIndex: 99, // Juste en dessous de la barre de recherche
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
  // Supprime l'espace blanc autour du header de liste
  headerWrapper: {
    paddingBottom: 0,
    marginBottom: 0,
    paddingTop: 0,
    marginTop: 0,
  },
  headerContainer: {
    backgroundColor: 'transparent',
    zIndex: 50,
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
    ...styles.ph20,
  },
  listContainer: {
    flex: 1,
    zIndex: 1, // Plus bas que les éléments de recherche
  },
  stockItemContainer: {
    marginHorizontal: -moderateScale(20),
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
  imageStyle: {
    height: moderateScale(50),
    width: moderateScale(50),
    borderRadius: moderateScale(25),
    borderWidth: moderateScale(2),
    resizeMode: 'contain',
  },
  roundLogoWrapper: {
    height: moderateScale(50),
    width: moderateScale(50),
    borderRadius: moderateScale(55) / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc', // placeholder background
    borderRadius: 50, // half of width/height
    overflow: 'hidden', // clips anything outside the round boundary
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee', // optional placeholder background
  },

  stockTitleStyle: {
    width: moderateScale(60),
    ...styles.mv5,
    ...styles.flex,
  },
  refreshIndicator: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: commonColor.primary,
  },
});
