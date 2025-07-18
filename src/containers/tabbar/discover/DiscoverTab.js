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
} from '../../../api/constant';
import CText from '../../../components/common/CText';
import KeyBoardAvoidWrapper from '../../../components/common/KeyBoardAvoidWrapper';
import images from '../../../assets/images';
import { StackNav } from '../../../navigation/NavigationKeys';
import ChipsComponent from '../../../components/ChipsComponent';

const DiscoverTab = ({ navigation }) => {
  const colors = useSelector(state => state.theme.theme);
  const [search, setSearch] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);

  const onSearchInput = val => setSearch(val);
  const onSearchFocus = () => setSearchFocus(true);
  const onSearchBlur = () => setSearchFocus(false);

  const onPressSearch = () => navigation.navigate(StackNav.AllStocks);

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
          color={colors.primary}
          align={'center'}
          numberOfLines={1}
          style={styles.flex}>
          {'+ ' + item?.percentage}
        </CText>
      </TouchableOpacity>
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
        <ChipsComponent data={stockCategoryData} />
        <View style={localStyles.subHeaderStyle}>
          <CText type={'b20'}>{strings.topMovers}</CText>
          <TouchableOpacity onPress={onPressSearch}>
            <Ionicons
              name="arrow-forward"
              size={moderateScale(26)}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
        <FlashList
          removeClippedSubviews={false}
          data={topMoversData}
          renderItem={renderTopMovers}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          estimatedItemSize={5}
        />
        <ImageBackground
          source={images.discoverImage1}
          imageStyle={{ borderRadius: moderateScale(24) }}
          style={localStyles.discoverImageStyle}>
          <View style={localStyles.innerContainer}>
            <CText type={'b20'} color={colors.white}>
              {'🏆 Top 100 Companies'}
            </CText>
            <CText type={'m12'} numberOfLines={1} color={colors.white}>
              {'International big brands may you know and love'}
            </CText>
          </View>
        </ImageBackground>
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
        <FlashList
          removeClippedSubviews={false}
          data={discoverStockData}
          renderItem={RenderCategory}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          estimatedItemSize={10}
          scrollEnabled={false}
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
  chipsContainer: {
    ...styles.ph20,
    ...styles.pv5,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(25),
    ...styles.mt15,
    ...styles.mh5,
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
  discoverImageStyle: {
    width: '100%',
    height: moderateScale(170),
    borderRadius: moderateScale(24),
    ...styles.mt20,
    ...styles.justifyEnd,
    ...styles.itemsStart,
  },
  innerContainer: {
    ...styles.p20,
    shadowColor: commonColor.black,
    shadowOffset: { width: 20, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  imageBackgroundStyle: {
    width: (deviceWidth - moderateScale(50)) / 2,
    height: moderateScale(170),
    borderRadius: moderateScale(24),
    ...styles.mt15,
    ...styles.justifyEnd,
    ...styles.itemsStart,
  },
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
    width: '50%',
  },
  stockNameContainer: {
    ...styles.ph10,
    ...styles.flex,
    ...styles.itemsStart,
  },
});
