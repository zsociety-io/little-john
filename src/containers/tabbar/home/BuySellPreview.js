import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

// Custom components
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import KeyBoardAvoidWrapper from '../../../components/common/KeyBoardAvoidWrapper';
import CText from '../../../components/common/CText';
import CDivider from '../../../components/common/CDivider';
import {styles} from '../../../themes';
import {getHeight, moderateScale} from '../../../common/constants';
import strings from '../../../i18n/strings';
import CButton from '../../../components/common/CButton';
import {StackNav} from '../../../navigation/NavigationKeys';

export default function BuySellPreview({navigation, route}) {
  const {item} = route?.params;
  const colors = useSelector(state => state.theme.theme);

  const onPressBtn = () =>
    navigation.navigate(StackNav.BuySellSuccessful, {item});

  const DescriptionLine = ({title, desc, color = null}) => {
    return (
      <View style={styles.rowSpaceBetween}>
        <CText
          type={'m18'}
          color={colors.dark ? colors.grayScale3 : colors.grayScale7}>
          {title}
        </CText>
        <CText type={'b20'} color={color ? color : colors.textColor}>
          {desc}
        </CText>
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <CHeader title={item?.isBuy ? strings.previewBuy : strings.previewSell} />
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <View style={localStyles.settingsContainer}>
          <View style={localStyles.leftContainer}>
            <Image source={item?.image} style={localStyles.imageStyle} />
            <View style={localStyles.stockNameContainer}>
              <CText type="b18" numberOfLines={1}>
                {item?.companyName}
              </CText>
              <CText
                type="m14"
                numberOfLines={1}
                color={colors.dark ? colors.grayScale : colors.grayScale6}
                style={styles.mt10}>
                {item?.stockName}
              </CText>
            </View>
          </View>
          <CText
            type="s14"
            color={colors.dark ? colors.grayScale : colors.grayScale6}>
            {item?.isBuy ? strings.buy : strings.sell}
            {' in Dollars'}
          </CText>
        </View>
        <CDivider style={styles.mv20} />
        <View
          style={[
            localStyles.descContainer,
            {
              backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1,
              borderColor: colors.dark ? colors.dark3 : colors.grayScale2,
            },
          ]}>
          <DescriptionLine
            title={'Market Price SPOT'}
            desc={item?.currentValue}
          />
          <DescriptionLine title={'Number of Shares'} desc={'0.026487494'} />
          <CDivider />
          <DescriptionLine title={'Amount'} desc={'$10,000.00'} />
          <DescriptionLine title={'Exchange Fee'} desc={'$25.00'} />
          <CDivider />
          <DescriptionLine
            title={'Total Proceeds'}
            desc={'$10,025.00'}
            color={colors.primary}
          />
        </View>
      </KeyBoardAvoidWrapper>
      <CButton
        title={item?.isBuy ? strings.buyNow : strings.sellNow}
        containerStyle={styles.bottomButton}
        onPress={onPressBtn}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  settingsContainer: {
    ...styles.rowSpaceBetween,
    ...styles.pv10,
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
  imageStyle: {
    height: getHeight(60),
    width: moderateScale(60),
    resizeMode: 'contain',
  },
  descContainer: {
    ...styles.p15,
    ...styles.mt10,
    gap: moderateScale(15),
    borderRadius: moderateScale(24),
    borderWidth: moderateScale(1),
  },
});
