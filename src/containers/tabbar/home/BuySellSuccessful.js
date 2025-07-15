import {Image, StyleSheet} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

// Local import
import CDivider from '../../../components/common/CDivider';
import {UnlockOffer} from '../../../assets/svgs';
import CText from '../../../components/common/CText';
import {styles} from '../../../themes';
import CButton from '../../../components/common/CButton';
import strings from '../../../i18n/strings';
import {moderateScale} from '../../../common/constants';
import KeyBoardAvoidWrapper from '../../../components/common/KeyBoardAvoidWrapper';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import {StackNav} from '../../../navigation/NavigationKeys';

export default function BuySellSuccessful({navigation, route}) {
  const {item} = route?.params;
  const colors = useSelector(state => state.theme.theme);

  const onPressContinue = () => navigation.navigate(StackNav.TabBar);

  const onPressStock = () =>
    navigation.navigate(StackNav.StockDetailScreen, {item});

  return (
    <CSafeAreaView>
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <Image source={item?.image} style={localStyles.imageStyle} />
        <CText type={'b32'} align={'center'} style={styles.mt10}>
          {item?.companyName}
        </CText>
        <CText
          type={'s18'}
          align={'center'}
          color={colors.dark ? colors.grayScale3 : colors.grayScale6}
          style={styles.mt5}>
          {item?.stockName}
        </CText>
        <CDivider style={styles.mv30} />
        <UnlockOffer style={styles.mv20} />
        <CText
          type={'B46'}
          align={'center'}
          color={colors.primary}
          style={styles.mv20}>
          {'$10,000'}
        </CText>
        <CText type={'B20'} align={'center'} style={styles.mv10}>
          {'Exchange Order Received!'}
        </CText>
        <CText
          type={'m18'}
          align={'center'}
          color={colors.dark ? colors.grayScale3 : colors.grayScale6}
          style={styles.mb30}>
          {
            'Your order has been received and will be executed as soon as the market opens'
          }
        </CText>
      </KeyBoardAvoidWrapper>
      <CButton
        title={strings.viewMyPortfolio}
        containerStyle={styles.bottomButton}
        onPress={onPressContinue}
      />
      <CButton
        type={'S16'}
        title={'Back to ' + item?.companyName + ' Stock'}
        bgColor={colors.dark3}
        color={colors.primaryLightBtn}
        style={styles.ml10}
        containerStyle={styles.bottomButton}
        onPress={onPressStock}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  outerContainer: {
    ...styles.rowSpaceAround,
    ...styles.mt20,
  },
  innerContainer: {
    ...styles.center,
  },
  imageStyle: {
    height: moderateScale(100),
    width: moderateScale(100),
    resizeMode: 'contain',
    borderRadius: moderateScale(50),
    ...styles.selfCenter,
    ...styles.mt15,
  },
});
