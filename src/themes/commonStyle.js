import {StyleSheet} from 'react-native';
import {getHeight, moderateScale} from '../common/constants';
import {colors, commonColor} from './colors';
import flex from './flex';
import margin from './margin';
import padding from './padding';

export default StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.backgroundColor,
    ...flex.flex,
  },
  innerContainer: {
    paddingHorizontal: moderateScale(20),
    ...margin.mt20,
  },
  generalTitleText: {
    fontSize: moderateScale(24),
  },
  underLineText: {
    textDecorationLine: 'underline',
  },
  horizontalLine: {
    height: getHeight(10),
    width: '100%',
  },
  shadowStyle: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 3,
    elevation: 5,
  },
  capitalizeTextStyle: {
    textTransform: 'capitalize',
  },
  actionSheetIndicator: {
    width: moderateScale(60),
    ...margin.mt10,
  },
  textInputStyle: {
    fontFamily: 'Urbanist-Bold',
    fontSize: moderateScale(24),
  },
  textInputContainerStyle: {
    borderWidth: 0,
    borderBottomWidth: moderateScale(2),
    borderBottomColor: commonColor.primary,
  },
  bottomButton: {
    ...margin.mb15,
    ...margin.mh20,
  },
  rootContainer: {
    ...padding.ph20,
    ...padding.pv10,
  },
  flexRootContainer: {
    ...flex.flex,
    ...padding.ph20,
    ...padding.pv10,
  },
});
