import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Area, Chart, Line, Tooltip } from 'react-native-responsive-linechart';
import { FlashList } from '@shopify/flash-list';
import { VictoryCandlestick } from 'victory-native';

// Local Imports
import {
  AvgCostIcon,
  CandleGraphIcon,
  ChartGraphIcon,
  DownIcon,
  EquityIcon,
  EstReturnsIcon,
  LikeIcon,
  MessageIcon,
  SharesIcon,
  TargetPriceIcon,
  TotalReturnsIcon,
  UpIcon,
} from '../../../assets/svgs';
import { deviceWidth, getHeight, moderateScale } from '../../../common/constants';
import { commonColor, styles } from '../../../themes';
import CHeader from '../../../components/common/CHeader';
import images from '../../../assets/images';
import CText from '../../../components/common/CText';
import {
  characteristicsData,
  mainChartData,
  newsData,
  peopleAlsoBoughtData,
  sampleDataDates,
  spotMarketStats,
  stockTimeData,
} from '../../../api/constant';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CDivider from '../../../components/common/CDivider';
import CButton from '../../../components/common/CButton';
import strings from '../../../i18n/strings';
import SpotMarketComponent from '../../../components/SpotMarketComponent';
import ChipsComponent from '../../../components/ChipsComponent';
import { StackNav } from '../../../navigation/NavigationKeys';
import NewsComponent from '../../../components/NewsComponent';

const RightIcon = memo(() => {
  return (
    <View style={styles.rowCenter}>
      <TouchableOpacity>
        <MessageIcon height={moderateScale(26)} width={moderateScale(26)} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.ph10}>
        <LikeIcon height={moderateScale(26)} width={moderateScale(26)} />
      </TouchableOpacity>
    </View>
  );
});

const LeftIcon = memo(({ colors, onPressBack }) => {
  return (
    <TouchableOpacity onPress={onPressBack}>
      <Ionicons
        name="arrow-back-outline"
        size={moderateScale(26)}
        color={colors.white}
      />
    </TouchableOpacity>
  );
});

const SubHeader = memo(({ title, style, isHide = false, colors, onPress }) => {
  return (
    <View style={[localStyles.myWishlistContainer, style]}>
      <CText type={'b20'}>{title}</CText>
      {isHide && (
        <TouchableOpacity onPress={onPress}>
          <Ionicons
            name="arrow-forward-outline"
            size={moderateScale(26)}
            color={colors.primary}
            style={styles.ml5}
          />
        </TouchableOpacity>
      )}
    </View>
  );
});

const PeopleAlsoBought = memo(({ item, colors, onPressStock }) => {
  return (
    <TouchableOpacity
      onPress={() => onPressStock(item)}
      style={localStyles.topStockContainer}>
      <Image
        source={item?.image}
        style={[
          localStyles.topStockImageStyle,
          { borderColor: item?.status ? colors.primary : colors.alertColor },
        ]}
      />
      <CText
        type={'b18'}
        numberOfLines={1}
        align={'center'}
        style={localStyles.stockTitleStyle}>
        {item?.stockName}
      </CText>
      <CText
        type={'b18'}
        color={item?.status ? colors.primary : colors.alertColor}
        align={'center'}
        numberOfLines={1}
        style={styles.flex}>
        {item.status ? '+ ' : '- '}
        {item?.percentage}
      </CText>
    </TouchableOpacity>
  );
});

const RenderStockTime = ({ item, selectedTime, colors, onPressTimeFunction }) => {
  return (
    <TouchableOpacity
      onPress={() => onPressTimeFunction(item)}
      style={[
        localStyles.timeContainer,
        selectedTime === item && {
          backgroundColor: colors.white,
          borderRadius: moderateScale(8),
        },
      ]}>
      <CText
        type="s14"
        color={selectedTime === item ? colors.primary : colors.white}>
        {item}
      </CText>
    </TouchableOpacity>
  );
};

const EPSComponent = memo(props => {
  const { value1, value2, status, position, colors, subTextColor } = props;
  return (
    <View>
      <View
        style={[localStyles.earningInnerContainer, { justifyContent: position }]}>
        <View style={localStyles.epsRowCenter}>
          <View
            style={[
              localStyles.statusContainer,
              {
                backgroundColor: status
                  ? colors.primary2
                  : colors.lightRedColor,
              },
            ]}
          />
          <CText type="s14">{value1}</CText>
        </View>
        <View style={localStyles.epsRowCenter}>
          <View
            style={[
              localStyles.statusContainer,
              { backgroundColor: status ? colors.primary : colors.alertColor },
            ]}
          />
          <CText type="s14">{value2}</CText>
        </View>
      </View>
      <CText type="b16" color={subTextColor}>
        {'Q3'}
      </CText>
      <CText type="b16" color={subTextColor} style={styles.mb15}>
        {'FY21'}
      </CText>
    </View>
  );
});

const SubCategory = props => {
  const {
    title1,
    value1,
    title2,
    value2,
    icon1,
    icon2,
    color = false,
    colors,
    subTextColor,
  } = props;
  return (
    <View style={localStyles.categoryContainer}>
      <View style={localStyles.categoryRow}>
        {icon1}
        <View style={localStyles.descStyle}>
          <CText type="s14" color={subTextColor}>
            {title1}
          </CText>
          <CText type="b18" style={styles.mt10}>
            {value1}
          </CText>
        </View>
      </View>
      <View style={localStyles.categoryRow}>
        {icon2}
        <View style={localStyles.descStyle}>
          <CText type="s14" numberOfLines={1} color={subTextColor}>
            {title2}
          </CText>
          <CText
            type="b18"
            color={color ? color : colors.primary}
            style={styles.mt10}>
            {value2}
          </CText>
        </View>
      </View>
    </View>
  );
};

const PredicationComponent = memo(props => {
  const { title, percentage, color, colors } = props;
  return (
    <View style={styles.rowStart}>
      <View
        style={[
          localStyles.outerProgress,
          {
            width: moderateScale(140),
            backgroundColor: colors.dark ? colors.dark3 : colors.grayScale2,
          },
        ]}>
        <View
          style={[
            localStyles.outerProgress,
            {
              width: percentage,
              backgroundColor: color,
            },
          ]}
        />
      </View>
      <View style={localStyles.predicationTextContainer}>
        <CText type="s14" color={color} style={styles.ph15}>
          {percentage}
        </CText>
        <CText type="s14" color={color}>
          {title}
        </CText>
      </View>
    </View>
  );
});

const HeaderComponent = memo(props => {
  const {
    item,
    onPressBack,
    colors,
    subTextColor,
    colorValue,
    renderStockTime,
    isCandle,
    extraData,
    onPressSPOTMarket,
    selectedTime,
  } = props;

  React.useEffect(() => {
    startChartAnimation();
  }, [extraData, isCandle]);

  const chartOpacity = new Animated.Value(0);

  const generateChartData = timeFrame => {
    switch (timeFrame) {
      case '1D':
        return {
          xMax: 4,
          data: mainChartData.slice(0, 7),
        };
      case '1W':
        return {
          xMax: 7,
          data: mainChartData.slice(0, 10),
        };
      case '1M':
        return {
          xMax: 14,
          data: mainChartData.slice(0, 20),
        };
      case '3M':
        return {
          xMax: 28,
          data: mainChartData.slice(0, 32),
        };
      case '6M':
        return {
          xMax: 40,
          data: mainChartData.slice(0, 42),
        };
      case '1Y':
        return {
          xMax: 46,
          data: mainChartData.slice(0, 52),
        };
      case '5Y':
        return {
          xMax: 55,
          data: mainChartData.slice(0, 60),
        };
      default:
        return {
          xMax: 1,
          data: mainChartData,
        };
    }
  };

  const data = generateChartData(selectedTime);

  const startChartAnimation = () => {
    Animated.timing(chartOpacity, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View>
      <ImageBackground
        source={images.homeBg}
        style={localStyles.bgImageStyle}
        resizeMode="cover">
        <CHeader
          isHideBack={true}
          isLeftIcon={
            <LeftIcon colors={colorValue} onPressBack={onPressBack} />
          }
          rightIcon={<RightIcon />}
        />
        <View style={localStyles.settingsContainer}>
          <View style={localStyles.leftContainer}>
            <Image source={item?.image} style={localStyles.imageStyle} />
            <View style={localStyles.stockNameContainer}>
              <CText type="b18" color={colors.white} numberOfLines={1}>
                {item?.companyName}
              </CText>
              <CText
                type="m14"
                numberOfLines={1}
                color={colors.grayScale}
                style={styles.mt10}>
                {item?.stockName}
              </CText>
            </View>
          </View>
          <View style={styles.itemsEnd}>
            <CText type="s14" color={colors.grayScale}>
              {strings.lastClose}
            </CText>
            <CText type="b18" color={colors.white} style={styles.mt10}>
              {item?.currentValue}
            </CText>
          </View>
        </View>
        {!isCandle ? (
          <Animated.View
            style={{
              width: deviceWidth,
              opacity: chartOpacity,
            }}>
            <Chart
              style={localStyles.chartStyle}
              data={data?.data}
              padding={styles.p5}
              xDomain={{ min: 0, max: data?.xMax }}
              yDomain={{ min: 0, max: 20 }}>
              <Area
                smoothing="cubic-spline"
                theme={{
                  gradient: {
                    from: { color: colors.white },
                    to: {
                      color: colors.white,
                      opacity: 0.01,
                    },
                  },
                }}
              />
              <Line
                tension={50}
                smoothing="cubic-spline"
                theme={{
                  stroke: {
                    color: colors.white,
                    width: moderateScale(4),
                  },
                }}
                tooltipComponent={
                  <Tooltip theme={{ formatter: ({ y }) => y.toFixed(2) }} />
                }
              />
            </Chart>
          </Animated.View>
        ) : (
          <Animated.View
            style={[localStyles.chartStyle, { opacity: chartOpacity }]}>
            <VictoryCandlestick
              style={{
                height: getHeight(270),
                width: deviceWidth,
              }}
              maxDomain={{ y: 100, x: 25 }}
              minDomain={{ y: 10, x: 0 }}
              candleRatio={1}
              candleColors={{ positive: '#000', negative: '#c43a31' }}
              data={sampleDataDates}
            />
          </Animated.View>
        )}

        <View style={localStyles.timeMainContainer}>
          <FlashList
            data={stockTimeData}
            extraData={extraData}
            renderItem={renderStockTime}
            keyExtractor={(item, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            scrollEnabled={false}
            estimatedItemSize={7}
            removeClippedSubviews={false}
          />
          <TouchableOpacity>
            {isCandle ? <CandleGraphIcon /> : <ChartGraphIcon />}
          </TouchableOpacity>
        </View>
      </ImageBackground>
      <View
        style={[
          localStyles.priceContainer,
          {
            backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1,
            borderColor: colors.dark ? colors.dark3 : colors.grayScale2,
          },
        ]}>
        <CText type="b40" style={localStyles.padding20}>
          {item?.currentValue}
        </CText>
        <View style={localStyles.priceInnerContainer}>
          {item?.status ? <UpIcon /> : <DownIcon />}
          <CText
            type="s14"
            color={!item?.status ? colors.downColor1 : colors.upColor1}>
            {'  $5.96' + '  (' + item?.percentage + ')'}
          </CText>
          <CText
            type="s14"
            color={colors.dark ? colors.grayScale3 : colors.grayScale5}
            style={styles.mh10}>
            {strings.lastClose}
          </CText>
        </View>
      </View>
      <SubHeader
        title={'My SPOT Position'}
        style={styles.mb25}
        colors={colorValue}
      />
      <SubCategory
        title1={'Shares'}
        value1={'0.17469'}
        title2={'Avg. Cost'}
        value2={'$73.86'}
        icon1={<SharesIcon />}
        icon2={<AvgCostIcon />}
        colors={colorValue}
        subTextColor={subTextColor}
      />
      <SubCategory
        title1={'Equity'}
        value1={'$22,935.46'}
        title2={'Total Returns'}
        value2={'$1,946.75'}
        icon1={<EquityIcon />}
        icon2={<TotalReturnsIcon />}
        colors={colorValue}
        subTextColor={subTextColor}
      />
      <SubHeader
        title={strings.spotMarketStats}
        isHide={true}
        style={styles.mb10}
        colors={colorValue}
        onPress={onPressSPOTMarket}
      />
    </View>
  );
});

const FooterComponent = memo(props => {
  const {
    colors,
    subTextColor,
    colorValue,
    renderPeopleAlsoBought,
    renderNewsComponent,
    renderSeparator,
    onPressNews,
    onPressSPOTMarket,
  } = props;
  return (
    <View>
      <CDivider style={styles.mh20} />

      <CText
        type="s16"
        align={'center'}
        color={colors.primary}
        onPress={onPressSPOTMarket}
        style={styles.pv10}>
        {strings.showMore}
      </CText>
      <SubHeader
        title={'What the Experts Say'}
        style={styles.mb10}
        colors={colorValue}
      />
      <CText type="r18" color={subTextColor} style={localStyles.padding20}>
        {'16 Wall Street Analyst Ratings'}
      </CText>
      <View style={localStyles.timeMainContainer}>
        <View style={localStyles.buyContainer}>
          <CText type="b24" color={colors.white} style={localStyles.padding20}>
            {'BUY'}
          </CText>
        </View>
        <View style={localStyles.progressContainer}>
          <PredicationComponent
            title={'Buy'}
            percentage={'70%'}
            color={colors.primary}
            colors={colorValue}
          />
          <PredicationComponent
            title={'Hold'}
            percentage={'40%'}
            color={colors.yellow}
            colors={colorValue}
          />
          <PredicationComponent
            title={'Sell'}
            percentage={'10%'}
            color={colors.alertColor}
            colors={colorValue}
          />
        </View>
      </View>
      <CDivider style={[styles.mb30, styles.mh20]} />
      <SubCategory
        title1={strings.targetPrice}
        value1={'$117.25'}
        title2={'Est Return'}
        value2={'+ 65.20%'}
        icon1={<TargetPriceIcon />}
        icon2={<EstReturnsIcon />}
        color={true}
        colors={colorValue}
        subTextColor={subTextColor}
      />
      <SubHeader title={'Risk'} style={styles.mb10} colors={colorValue} />
      <CText type="r18" color={subTextColor} style={styles.ph20}>
        {'Spot has'}
        <CText type="r18" color={colors.alertColor}>
          {' 27% '}
        </CText>
        <CText type="r18" color={subTextColor}>
          {'more risk than the market as a whole.'}
        </CText>
      </CText>



      <SubHeader
        title={strings.earningsShare}
        style={styles.mb10}
        colors={colorValue}
      />
      <View style={localStyles.timeMainContainer}>
        <EPSComponent
          value1={'- $0.22'}
          value2={'- $0.48'}
          status={false}
          position={'center'}
          colors={colorValue}
          subTextColor={subTextColor}
        />
        <EPSComponent
          value1={'+ $0.24'}
          value2={'+ $0.40'}
          status={true}
          position={'center'}
          colors={colorValue}
          subTextColor={subTextColor}
        />
        <EPSComponent
          value1={'+ $0.24'}
          value2={'- $0.20'}
          status={true}
          position={'flex-start'}
          colors={colorValue}
          subTextColor={subTextColor}
        />
        <EPSComponent
          value1={'- $0.65'}
          value2={'- $0.90'}
          status={false}
          position={'flex-end'}
          colors={colorValue}
          subTextColor={subTextColor}
        />
      </View>
      <CDivider style={styles.mh20} />
      <CText type="r18" color={subTextColor} style={localStyles.textStyle}>
        {
          'The company reported results on Dec 25, 2022 and missed market expectations.'
        }
      </CText>

      <SubHeader
        title={strings.news}
        style={styles.mb5}
        isHide
        colors={colorValue}
        onPress={onPressNews}
      />
      <FlashList
        data={newsData.slice(0, 3)}
        renderItem={renderNewsComponent}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={renderSeparator}
        estimatedItemSize={3}
        removeClippedSubviews={false}
      />
      <CText
        type="s16"
        align={'center'}
        style={styles.pb5}
        color={colors.primary}
        onPress={onPressNews}>
        {strings.showMore}
      </CText>
      <SubHeader
        title={strings.characteristics}
        style={styles.mb5}
        colors={colorValue}
      />
      <View style={styles.ph20}>
        <ChipsComponent data={characteristicsData} />
      </View>


      <SubHeader
        title={strings.peopleAlsoBought}
        style={styles.mt25}
        colors={colorValue}
      />
      <FlashList
        data={peopleAlsoBoughtData}
        renderItem={renderPeopleAlsoBought}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        estimatedItemSize={6}
        removeClippedSubviews={false}
        contentContainerStyle={styles.ph20}
      />
      <SubHeader
        title={strings.theStoryFar}
        style={styles.mt25}
        colors={colorValue}
      />
      <CText type="r18" color={subTextColor} style={localStyles.textStyle}>
        {strings.theStoryFarDesc}
      </CText>
      <SubHeader
        title={strings.disclosures}
        style={styles.mt25}
        colors={colorValue}
      />
      <CText type="r18" color={subTextColor} style={localStyles.textStyle}>
        {strings.disclosuresDesc}
      </CText>
    </View>
  );
});

export default function StockDetailScreen({ navigation, route }) {
  const { item } = route.params;
  const colors = useSelector(state => state.theme.theme);
  const [selectedTime, setSelectedTime] = useState('1D');
  const [isCandle, setIsCandle] = useState(false);
  const [extraData, setExtraData] = useState(false);

  useEffect(() => {
    setExtraData(!extraData);
  }, [selectedTime]);

  const onPressCandle = () => setIsCandle(!isCandle);

  const selectedTimeValue = useMemo(() => {
    return selectedTime;
  }, [selectedTime]);

  const subTextColor = useMemo(() => {
    return colors.dark ? colors.grayScale3 : colors.grayScale6;
  }, [colors]);

  const colorValue = useMemo(() => {
    return colors;
  }, [colors]);

  const onPressStock = useCallback(item => {
    return navigation.replace(StackNav.StockDetailScreen, { item });
  }, []);

  const onPressTimeFunction = useCallback(
    itm => {
      return setSelectedTime(itm);
    },
    [selectedTime],
  );

  const onPressBack = useCallback(() => {
    return navigation.goBack();
  }, []);

  const onPressSPOTMarket = useCallback(() => {
    return navigation.navigate(StackNav.SPOTMarketStats);
  }, []);

  const onPressNews = useCallback(() => {
    return navigation.navigate(StackNav.NewsScreen);
  }, []);

  const onPressBuy = () =>
    navigation.navigate(StackNav.BuySell, { item: { ...item, isBuy: true } });

  const onPressSell = () =>
    navigation.navigate(StackNav.BuySell, { item: { ...item, isBuy: false } });

  const renderStockTime = ({ item, index }) => {
    return (
      <RenderStockTime
        item={item}
        selectedTime={selectedTimeValue}
        colors={colorValue}
        onPressTimeFunction={onPressTimeFunction}
      />
    );
  };

  const renderPeopleAlsoBought = ({ item }) => {
    return (
      <PeopleAlsoBought
        item={item}
        colors={colorValue}
        onPressStock={onPressStock}
      />
    );
  };

  const renderNewsComponent = ({ item, index }) => {
    return <NewsComponent item={item} />;
  };

  const renderSpotMarketStats = ({ item, index }) => {
    return <SpotMarketComponent item={item} />;
  };

  const renderSeparator = () => <CDivider style={styles.mh20} />;

  return (
    <CSafeAreaView>
      <FlashList
        data={spotMarketStats.slice(0, 3)}
        renderItem={renderSpotMarketStats}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        ListHeaderComponent={
          <HeaderComponent
            item={item}
            onPressBack={onPressBack}
            colors={colorValue}
            subTextColor={subTextColor}
            colorValue={colorValue}
            renderStockTime={renderStockTime}
            onPressCandle={onPressCandle}
            isCandle={isCandle}
            extraData={extraData}
            onPressSPOTMarket={onPressSPOTMarket}
            selectedTime={selectedTimeValue}
          />
        }
        ListFooterComponent={
          <FooterComponent
            colors={colorValue}
            subTextColor={subTextColor}
            colorValue={colorValue}
            renderPeopleAlsoBought={renderPeopleAlsoBought}
            renderNewsComponent={renderNewsComponent}
            renderSeparator={renderSeparator}
            onPressNews={onPressNews}
            onPressSPOTMarket={onPressSPOTMarket}
          />
        }
        ItemSeparatorComponent={renderSeparator}
        estimatedItemSize={3}
      />
      <View style={localStyles.btnContainer}>
        <CButton
          type={'S16'}
          title={strings.sell}
          bgColor={colors.dark3}
          color={colors.primary}
          style={styles.ml10}
          containerStyle={localStyles.changeBtn}
          onPress={onPressSell}
        />
        <CButton
          title={strings.buy}
          containerStyle={localStyles.changeBtn}
          onPress={onPressBuy}
        />
      </View>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  bgImageStyle: {
    ...styles.pb30,
    width: '100%',
  },
  btnContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mv10,
    ...styles.mh20,
  },
  changeBtn: {
    width: '45%',
  },
  myWishlistContainer: {
    ...styles.rowSpaceBetween,
    ...styles.ph20,
    ...styles.mv20,
  },
  imageStyle: {
    height: getHeight(60),
    width: moderateScale(60),
    resizeMode: 'contain',
  },
  settingsContainer: {
    ...styles.rowSpaceBetween,
    ...styles.pv15,
    ...styles.ph20,
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
  timeContainer: {
    padding: moderateScale(8),
    ...styles.mr10,
  },
  timeMainContainer: {
    ...styles.rowSpaceBetween,
    ...styles.ph20,
  },
  priceContainer: {
    ...styles.itemsCenter,
    ...styles.p20,
    ...styles.mh20,
    ...styles.mt30,
    ...styles.mb10,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(20),
  },
  priceInnerContainer: {
    ...styles.rowCenter,
    ...styles.mt10,
  },
  categoryContainer: {
    ...styles.rowSpaceBetween,
    ...styles.flex,
    ...styles.ph20,
    ...styles.mb20,
  },
  categoryRow: {
    ...styles.rowCenter,
    ...styles.flex,
  },
  descStyle: {
    ...styles.ml10,
    ...styles.flex,
  },
  spotMarketStatsContainer: {
    ...styles.rowSpaceBetween,
    ...styles.ph20,
    ...styles.pv10,
  },
  buyContainer: {
    ...styles.center,
    height: moderateScale(90),
    width: moderateScale(90),
    borderRadius: moderateScale(45),
    backgroundColor: commonColor.primary,
    ...styles.mt20,
    ...styles.mb15,
  },
  progressContainer: {
    gap: moderateScale(10),
    ...styles.mt20,
    ...styles.mb15,
  },
  outerProgress: {
    height: moderateScale(8),
    borderRadius: moderateScale(4),
  },
  predicationTextContainer: {
    ...styles.rowEnd,
  },
  padding20: {
    ...styles.ph20,
  },
  statusContainer: {
    height: moderateScale(20),
    width: moderateScale(20),
    borderRadius: moderateScale(10),
    ...styles.mr5,
  },
  earningInnerContainer: {
    ...styles.mv10,
    ...styles.justifyStart,
    gap: moderateScale(8),
    height: moderateScale(140),
    width: 'auto',
  },
  epsRowCenter: {
    ...styles.flexRow,
    ...styles.itemsCenter,
  },
  topStockImageStyle: {
    height: moderateScale(80),
    width: moderateScale(80),
    borderRadius: moderateScale(40),
    borderWidth: moderateScale(4),
    resizeMode: 'contain',
  },
  topStockContainer: {
    ...styles.flex,
    ...styles.itemsCenter,
    ...styles.ph10,
    ...styles.pb10,
  },
  stockTitleStyle: {
    width: moderateScale(80),
    ...styles.mv10,
    ...styles.flex,
  },
  textStyle: {
    ...styles.ph20,
  },
  chartStyle: {
    height: getHeight(290),
    ...styles.mv15,
    width: deviceWidth,
  },
});
