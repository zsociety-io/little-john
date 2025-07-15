import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Area, Chart, Line} from 'react-native-responsive-linechart';
import {useSelector} from 'react-redux';

// Local Imports
import React from 'react';
import CText from './common/CText';
import {styles} from '../themes';
import {getHeight, moderateScale} from '../common/constants';
import {useNavigation} from '@react-navigation/native';
import {StackNav} from '../navigation/NavigationKeys';

export default function StockDetailComponent({isMyWhishList = false, item}) {
  const colors = useSelector(state => state.theme.theme);
  const navigation = useNavigation();

  const onPressItem = () =>
    navigation.navigate(StackNav.StockDetailScreen, {item});

  return (
    <TouchableOpacity
      onPress={onPressItem}
      style={[
        localStyles.stockCardContainer,
        {
          borderColor: colors.bColor,
          backgroundColor: colors.btnColor3,
          width: isMyWhishList ? moderateScale(150) : moderateScale(120),
        },
      ]}>
      <View style={localStyles.stockImgContainer}>
        {isMyWhishList && (
          <Image source={item?.image} style={localStyles.stockImgStyle} />
        )}
        <View style={styles.ph10}>
          <CText numberOfLines={1} style={styles.pt10} type={'b16'}>
            {item?.stockName}
          </CText>
          <CText
            numberOfLines={1}
            color={item?.status ? colors.upColor1 : colors.downColor1}
            style={styles.pt5}
            type={'b16'}>
            {item?.status ? '+ ' : '- '}
            {item?.percentage}
          </CText>
        </View>
      </View>
      <Chart
        style={[
          localStyles.chartStyle,
          {
            width: isMyWhishList ? moderateScale(150) : moderateScale(120),
          },
        ]}
        data={item?.data}
        xDomain={{min: -2, max: 10}}
        yDomain={{min: 0, max: 20}}>
        <Area
          theme={{
            gradient: {
              from: {
                color: item?.status ? colors.upColor1 : colors.downColor1,
              },
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
              width: moderateScale(2),
              borderRadius: moderateScale(20),
            },
          }}
        />
      </Chart>
    </TouchableOpacity>
  );
}

const localStyles = StyleSheet.create({
  stockCardContainer: {
    height: getHeight(150),
    borderWidth: moderateScale(1),
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    ...styles.ml20,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  chartStyle: {
    height: getHeight(76),
    ...styles.itemsEnd,
    ...styles.justifyEnd,
    ...styles.selfEnd,
    ...styles.mt5,
  },
  stockImgContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.mt10,
  },
  stockImgStyle: {
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(20),
    ...styles.ml10,
    resizeMode: 'cover',
  },
});
