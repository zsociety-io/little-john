import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {SelectCountry} from 'react-native-element-dropdown';

// Local import
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import strings from '../../../i18n/strings';
import {styles} from '../../../themes';
import {moderateScale} from '../../../common/constants';
import CText from '../../../components/common/CText';
import {listedStockData} from '../../../api/constant';
import KeyBoardAvoidWrapper from '../../../components/common/KeyBoardAvoidWrapper';
import CDivider from '../../../components/common/CDivider';
import {ExchangeStockIcon} from '../../../assets/svgs';
import CButton from '../../../components/common/CButton';
import {StackNav} from '../../../navigation/NavigationKeys';

const DropDownStock = props => {
  const {focused, onFocus, onBlur, data, value, onChange, colors} = props;
  return (
    <View
      style={[
        localStyles.outerContainer,
        {
          borderColor: focused ? colors.primary : colors.bColor,
          backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1,
        },
      ]}>
      <View style={localStyles.rowStyle}>
        <CText type={'b24'} color={colors.textColor} style={styles.ml15}>
          {'$'}
        </CText>
        <TextInput
          placeholder={'0.00'}
          keyboardType={'number-pad'}
          placeholderTextColor={colors.textColor}
          style={[localStyles.inputBoxStyle, {color: colors.textColor}]}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </View>
      <SelectCountry
        maxHeight={moderateScale(200)}
        value={value}
        data={data}
        valueField="value"
        labelField="lable"
        imageField="image"
        placeholder="Select Stock"
        onChange={onChange}
        style={localStyles.dropdown}
        selectedTextStyle={[
          localStyles.selectedTextStyle,
          {color: colors.textColor},
        ]}
        activeColor={colors.dark ? colors.grayScale7 : colors.grayScale1}
        placeholderStyle={[
          localStyles.placeholderStyle,
          {color: colors.textColor},
        ]}
        imageStyle={localStyles.imageStyle}
        iconStyle={localStyles.iconStyle}
        itemContainerStyle={[
          localStyles.itemContainerStyle,
          {backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1},
        ]}
        itemTextStyle={[
          localStyles.itemTextStyle,
          {
            backgroundColor: colors.dark3,
            color: colors.textColor,
          },
        ]}
      />
    </View>
  );
};

export default function ExchangeStock({navigation}) {
  const colors = useSelector(state => state.theme.theme);
  const [stock1, setStock1] = useState('');
  const [stock2, setStock2] = useState('');
  const [stock1Focus, setStock1Focus] = useState(false);
  const [stock2Focus, setStock2Focus] = useState(false);

  const onChangeStock1 = e => setStock1(e.value);
  const onFocusStock1 = () => setStock1Focus(true);
  const onBlurStock1 = () => setStock1Focus(false);

  const onChangeStock2 = e => setStock2(e.value);
  const onFocusStock2 = () => setStock2Focus(true);
  const onBlurStock2 = () => setStock2Focus(false);

  const onPressContinue = () => navigation.navigate(StackNav.PreviewExchange);

  const RightIcon = () => {
    return (
      <TouchableOpacity style={styles.pr10}>
        <Ionicons
          name="ellipsis-horizontal-circle"
          size={moderateScale(26)}
          color={colors.textColor}
        />
      </TouchableOpacity>
    );
  };

  return (
    <CSafeAreaView>
      <CHeader title={strings.exchangeStock} rightIcon={<RightIcon />} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <DropDownStock
          focused={stock1Focus}
          onFocus={onFocusStock1}
          onBlur={onBlurStock1}
          data={listedStockData}
          value={stock1}
          onChange={onChangeStock1}
          colors={colors}
        />
        <View style={localStyles.swipeContainer}>
          <CDivider style={localStyles.dividerStyle} />
          <ExchangeStockIcon
            height={moderateScale(60)}
            width={moderateScale(60)}
          />
          <CDivider style={localStyles.dividerStyle} />
        </View>
        <DropDownStock
          focused={stock2Focus}
          onFocus={onFocusStock2}
          onBlur={onBlurStock2}
          data={listedStockData}
          value={stock2}
          onChange={onChangeStock2}
          colors={colors}
        />
        <CDivider style={styles.mt30} />
        <CText
          type={'m16'}
          align={'center'}
          color={colors.primary4}
          style={styles.mv10}>
          {'Balance stock available in SPOT : $22,935.46'}
        </CText>
      </KeyBoardAvoidWrapper>
      <CButton
        title={strings.continue}
        containerStyle={styles.bottomButton}
        onPress={onPressContinue}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  outerContainer: {
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(6),
    ...styles.rowSpaceBetween,
    ...styles.mt5,
    width: '100%',
    borderRadius: moderateScale(20),
    height: moderateScale(68),
  },
  inputBoxStyle: {
    fontSize: moderateScale(24),
    fontFamily: 'Urbanist-Bold',
    ...styles.flex,
    paddingLeft: moderateScale(10),
    ...styles.mv10,
  },
  rightContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
    ...styles.ph10,
  },
  logoImageStyle: {
    height: moderateScale(30),
    width: moderateScale(30),
    resizeMode: 'contain',
  },
  dropdown: {
    ...styles.mh15,
    height: moderateScale(68),
    width: moderateScale(150),
  },
  imageStyle: {
    width: moderateScale(32),
    height: moderateScale(32),
  },
  placeholderStyle: {
    fontSize: moderateScale(16),
    fontFamily: 'Urbanist-Bold',
  },
  selectedTextStyle: {
    fontSize: moderateScale(16),
    fontFamily: 'Urbanist-SemiBold',
    ...styles.ml10,
  },
  iconStyle: {
    width: moderateScale(26),
    height: moderateScale(26),
  },
  itemTextStyle: {
    fontFamily: 'Urbanist-Regular',
    fontSize: moderateScale(18),
  },
  itemContainerStyle: {
    ...styles.ph10,
  },
  rowStyle: {
    ...styles.flex,
    ...styles.flexRow,
    ...styles.itemsCenter,
  },
  dividerStyle: {
    width: '37%',
  },
  swipeContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mv15,
  },
});
