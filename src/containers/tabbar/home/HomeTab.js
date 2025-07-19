import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';
import { FlashList } from '@shopify/flash-list';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local Imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import images from '../../../assets/images';
import {
  LikeIcon,
  NotificationHomeIcon,
  WhiteAppLogo,
} from '../../../assets/svgs';
import { getHeight, moderateScale } from '../../../common/constants';
import { styles } from '../../../themes';
import CText from '../../../components/common/CText';
import strings from '../../../i18n/strings';
import StockDetailComponent from '../../../components/StockDetailComponent';
import {
  myStockData,
  myWishlistStockData,
  topStockData,
  discoverListedStock, 
} from '../../../api/constant';
import DiscoverStockComponent from '../../../components/DiscoverStockComponent';
import { StackNav } from '../../../navigation/NavigationKeys';

const renderFirstItem = ({ item, index }) => <StockDetailComponent item={item} />;

const renderWishlistItem = ({ item, index }) => (
  <StockDetailComponent item={item} isMyWhishList={true} />
);

const renderListedStock = ({ item, index }) => (
  <DiscoverStockComponent item={item} />
);

export default HomeTab = ({ navigation }) => {
  const colors = useSelector(state => state.theme.theme);

  {/*const onPressWishList = () => navigation.navigate(StackNav.MyWishlist);*/}
  const onPressNotification = () => navigation.navigate(StackNav.Notification);

  {/* const onPressMyWishlist = () => navigation.navigate(StackNav.MyWishlist);*/}
  const onPressMyStocks = () => navigation.navigate(StackNav.MyStocks);
  const onPressAllStocks = () => navigation.navigate(StackNav.AllStocks);  // Navigation vers tous les stocks

  const LeftIcon = () => {
    return (
      <View style={styles.pr10}>
        <WhiteAppLogo height={moderateScale(30)} width={moderateScale(30)} />
      </View>
    );
  };

  const RightIcon = () => {
    return (
      <View style={styles.rowCenter}>
        {/* BOUTON COEUR WISHLIST COMMENTÉ */}
        {/*
        <TouchableOpacity style={styles.ph10} onPress={onPressWishList}>
          <LikeIcon height={moderateScale(26)} width={moderateScale(26)} />
        </TouchableOpacity>
        */}
        <TouchableOpacity onPress={onPressNotification}>
          <NotificationHomeIcon
            height={moderateScale(26)}
            width={moderateScale(26)}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const SubHeader = ({ title, style, onPress }) => {
    return (
      <View style={[localStyles.myWishlistContainer, style]}>
        <CText type={'b20'}>{title}</CText>
        <TouchableOpacity onPress={onPress}>
          <Ionicons
            name="arrow-forward-outline"
            size={moderateScale(26)}
            color={colors.primary}
            style={styles.ml5}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const RenderHeaderComponent = () => {
    return (
      <View>
        <ImageBackground
          source={images.homeBg}
          style={localStyles.imageStyle}
          resizeMode="cover">
          <View style={localStyles.container}>
            <View style={[styles.rowStart, styles.flex]}>
              <LeftIcon />
              <CText
                numberOfLines={1}
                color={colors.white}
                style={[styles.pr10, styles.mr10]}
                type={'B22'}>
                {strings.home}
              </CText>
            </View>
            <RightIcon />
          </View>
          <CText
            numberOfLines={1}
            color={colors.white}
            align={'center'}
            style={[styles.ph10, styles.mt10]}
            type={'B48'}>
            {'$229,375.25'}
          </CText>
          <CText
            numberOfLines={1}
            color={colors.white}
            align={'center'}
            style={styles.mv10}
            type={'m14'}>
            {'Balance Available'}
          </CText>
        </ImageBackground>

        {/* FLASHLIST COMMENTÉE POUR ÉVITER L'ERREUR D'IMBRICATION */}
        <View style={[localStyles.marketContainer]}>
          <CText type={'b20'}>{"Market Data"}</CText>
        </View>
        <FlashList
          removeClippedSubviews={false}
          data={topStockData}
          renderItem={renderFirstItem}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          estimatedItemSize={1}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pt5}
        />

        {/* COMMENTAIRE POUR CACHER LA WISHLIST */}
        {/*
        <SubHeader title={'My Wishlist'} onPress={onPressMyWishlist} />
        <FlashList
        removeClippedSubviews={false}
          data={myWishlistStockData}
          renderItem={renderWishlistItem}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          estimatedItemSize={1}
          showsHorizontalScrollIndicator={false}
        />
*/}

        <SubHeader
          title={'All Stocks'}
          style={styles.mb5}
          onPress={onPressAllStocks}
        />
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <FlashList
        removeClippedSubviews={false}
        data={discoverListedStock}
        renderItem={renderListedStock}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={10}
        ListHeaderComponent={RenderHeaderComponent}
      />
    </CSafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    ...styles.rowSpaceBetween,
    ...styles.ph20,
    ...styles.pv15,
    ...styles.center,
  },
  imageStyle: {
    height: getHeight(210),
    width: '100%',
    resizeMode: 'cover',
  },
  myWishlistContainer: {
    ...styles.rowSpaceBetween,
    ...styles.ph20,
    ...styles.mv20,
  },
  marketContainer: {
    ...styles.ph20,
    ...styles.mv20,
    ...styles.pt5,
  },
});
