import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Area, Chart, Line } from 'react-native-responsive-linechart';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { SvgUri } from 'react-native-svg';


// Custom Imports
import CText from './common/CText';
import { moderateScale } from '../common/constants';
import { styles } from '../themes';
import { StackNav } from '../navigation/NavigationKeys';

export default function DiscoverStockComponent({ item }) {
  const colors = useSelector(state => state.theme.theme);
  const navigation = useNavigation();

  const onPressItem = () =>
    navigation.navigate(StackNav.StockDetailScreen, { item });

  return (
    <TouchableOpacity
      onPress={onPressItem}
      style={localStyles.settingsContainer}>
      <View style={localStyles.leftContainer}>
        <View style={[localStyles.roundLogoWrapper]}>
          {String(item?.image).endsWith("svg") && (<SvgUri uri={item?.image}
            width={localStyles.imageStyle?.width}
            height={localStyles.imageStyle?.height} />)}
          {!String(item?.image).endsWith("svg") && (<Image source={item?.image} style={localStyles.imageStyle} />)}
        </View>
        <View style={localStyles.stockNameContainer}>
          <CText type="b18" numberOfLines={1}>
            {item?.companyName}
          </CText>
          <CText
            type="m14"
            numberOfLines={1}
            color={colors.dark ? colors.grayScale3 : colors.grayScale6}
            style={styles.mt10}>
            {item?.stockName}
          </CText>
        </View>
      </View>
      <Chart
        style={{
          height: moderateScale(30),
          width: moderateScale(60),
        }}
        data={item?.data}
        padding={styles.p5}
        xDomain={{ min: -2, max: 10 }}
        yDomain={{ min: 0, max: 20 }}>
        <Area
          smoothing="cubic-spline"
          theme={{
            gradient: {
              from: { color: item?.status ? colors.upColor1 : colors.downColor1 },
              to: {
                color: item?.status ? colors.upColor2 : colors.downColor2,
                opacity: 0.01,
              },
            },
          }}
        />
        <Line
          smoothing="cubic-spline"
          theme={{
            stroke: {
              color: item?.status ? colors.upColor1 : colors.downColor1,
              width: 2,
            },
          }}
        />
      </Chart>
      <View style={styles.itemsEnd}>
        <CText type="b18">{item?.currentValue}</CText>
        <CText
          type="s14"
          color={item?.status ? colors.primary : colors.redColor}
          style={styles.mt10}>
          {item?.status ? '+ ' : '- '} {item?.percentage}
        </CText>
      </View>
    </TouchableOpacity>
  );
}

const localStyles = StyleSheet.create({
  imageStyle: {
    height: moderateScale(55),
    width: moderateScale(55),
    resizeMode: 'contain',
  },
  roundLogoWrapper: {
    width: moderateScale(55),
    height: moderateScale(55),
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
});
