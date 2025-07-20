import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { Area, Chart, Line, Tooltip } from 'react-native-responsive-linechart';
import { FlashList } from '@shopify/flash-list';

// Local Imports
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CText from '../../../components/common/CText';
import { commonColor, styles } from '../../../themes';
import { deviceWidth, getHeight, moderateScale } from '../../../common/constants';
import DiscoverStockComponent from '../../../components/DiscoverStockComponent';
import {
  discoverListedStock,
  myStockData,
  portfolioData,
  stockTimeData,
} from '../../../api/constant';
import { StackNav } from '../../../navigation/NavigationKeys';
import images from '../../../assets/images';
import {
  AvgCostIcon,
  DownIcon,
  EquityIcon,
  SharesIcon,
  TotalReturnsIcon,
  UpIcon,
  WhiteAppLogo,
} from '../../../assets/svgs';
import strings from '../../../i18n/strings';

const renderListedStock = ({ item, index }) => (
  <DiscoverStockComponent item={item} />
);

const SubHeader = memo(({ title1, title2, style, isHide = false, colors }) => {
  return (
    <View style={[styles.rowSpaceBetween, styles.ph20, style]}>
      <CText type={'b18'}>{title1}</CText>
      {isHide && (
        <TouchableOpacity style={styles.rowCenter}>
          <CText type={'b18'} color={colors.primary}>
            {title2}
          </CText>
          <Ionicons
            name="swap-vertical"
            size={moderateScale(24)}
            color={colors.primary}
            style={styles.ml5}
          />
        </TouchableOpacity>
      )}
    </View>
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

const LeftIcon = () => {
  return (
    <View style={styles.pr10}>
      <WhiteAppLogo height={moderateScale(30)} width={moderateScale(30)} />
    </View>
  );
};

const RightIcon = () => {
  return (
    <TouchableOpacity>
      <Ionicons
        name="ellipsis-horizontal-circle"
        size={moderateScale(26)}
        color={commonColor.white}
      />
    </TouchableOpacity>
  );
};

const SubCategory = props => {
  const { title1, value1, title2, value2, icon1, icon2, subTextColor } = props;
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
          <CText type="b18" style={styles.mt10}>
            {value2}
          </CText>
        </View>
      </View>
    </View>
  );
};

const HeaderComponent = memo(props => {
  const { item, colors, subTextColor, colorValue, renderStockTime, extraData } =
    props;
  return (
    <View>
      <ImageBackground
        source={images.homeBg}
        style={localStyles.bgImageStyle}
        resizeMode="cover">
        <View style={localStyles.container}>
          <View style={[styles.rowStart, styles.flex]}>
            <LeftIcon />
            <CText
              numberOfLines={1}
              color={colors.white}
              style={[styles.pr10, styles.mr10]}
              type={'B22'}>
              {strings.myPortfolio}
            </CText>
          </View>
          <RightIcon />
        </View>
        <Chart
          style={{
            height: getHeight(270),
            width: deviceWidth,
          }}
          data={item?.data}
          padding={styles.p5}
          xDomain={{ min: -2, max: 10 }}
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
        <FlashList
          removeClippedSubviews={false}
          data={stockTimeData}
          extraData={extraData}
          renderItem={renderStockTime}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          scrollEnabled={false}
          estimatedItemSize={5}
          contentContainerStyle={styles.ph20}
        />
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
            {'  $66,378.49' + '  (' + item?.percentage + ')'}
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
        title1={'My Account'}
        style={styles.mv20}
        colors={colorValue}
      />
      <SubCategory
        title1={'Cash Available'}
        value1={'$23,087.39'}
        title2={'Staked Ratio'}
        value2={'73.4%'}
        icon1={<SharesIcon />}
        icon2={<AvgCostIcon />}
        subTextColor={subTextColor}
      />
      <SubCategory
        title1={'Equity'}
        value1={'$186,473.68'}
        title2={'Total Returns'}
        value2={'$66,378.49'}
        icon1={<EquityIcon />}
        icon2={<TotalReturnsIcon />}
        subTextColor={subTextColor}
      />
      <SubHeader
        title1={'My Positions'}
        isHide={true}
        style={[styles.mt10, styles.mb5]}
        title2={'Recently'}
        colors={colorValue}
      />
    </View>
  );
});

export default function PortfolioTab({ navigation }) {
  const colors = useSelector(state => state.theme.theme);
  const [selectedTime, setSelectedTime] = useState('1D');
  const [extraData, setExtraData] = useState(false);

  useEffect(() => {
    setExtraData(!extraData);
  }, [selectedTime]);

  const selectedTimeValue = useMemo(() => {
    return selectedTime;
  }, [selectedTime]);

  const subTextColor = useMemo(() => {
    return colors.dark ? colors.grayScale3 : colors.grayScale6;
  }, [colors]);

  const colorValue = useMemo(() => {
    return colors;
  }, [colors]);

  const onPressTimeFunction = useCallback(
    itm => {
      return setSelectedTime(itm);
    },
    [selectedTime],
  );

  const renderStockTime = ({ item, index }) => {
    return (
      <View style={styles.selfCenter}>
        <RenderStockTime
          item={item}
          selectedTime={selectedTimeValue}
          colors={colorValue}
          onPressTimeFunction={onPressTimeFunction}
        />
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <FlashList
        removeClippedSubviews={false}
        data={myStockData}
        renderItem={renderListedStock}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={10}
        ListHeaderComponent={
          <HeaderComponent
            item={portfolioData}
            colors={colorValue}
            subTextColor={subTextColor}
            colorValue={colorValue}
            renderStockTime={renderStockTime}
            extraData={extraData}
          />
        }
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    ...styles.rowSpaceBetween,
    ...styles.ph20,
    ...styles.pv15,
    ...styles.mb20,
    ...styles.center,
  },
  bgImageStyle: {
    ...styles.pb30,
    width: '100%',
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
    ...styles.center,
  },
  priceContainer: {
    ...styles.itemsCenter,
    ...styles.p20,
    ...styles.mh20,
    ...styles.mt30,
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
  padding20: {
    ...styles.ph20,
  },
});
