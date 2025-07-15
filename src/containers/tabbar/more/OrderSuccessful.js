import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local import
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CText from '../../../components/common/CText';
import images from '../../../assets/images';
import {styles} from '../../../themes';
import CDivider from '../../../components/common/CDivider';
import {moderateScale} from '../../../common/constants';
import KeyBoardAvoidWrapper from '../../../components/common/KeyBoardAvoidWrapper';
import CButton from '../../../components/common/CButton';
import {UnlockOffer} from '../../../assets/svgs';
import strings from '../../../i18n/strings';
import {StackNav} from '../../../navigation/NavigationKeys';

export default function OrderSuccessful({navigation}) {
  const colors = useSelector(state => state.theme.theme);

  const onPressContinue = () => navigation.navigate(StackNav.TabBar);

  const onPressMenu = () => navigation.navigate(StackNav.TabBar);

  const RenderStockIcon = ({icon, title, desc}) => {
    return (
      <View style={localStyles.innerContainer}>
        <Image source={icon} style={localStyles.imageStyle} />
        <CText type={'b22'} align={'center'} style={styles.mt10}>
          {title}
        </CText>
        <CText
          type={'s18'}
          align={'center'}
          color={colors.dark ? colors.grayScale3 : colors.grayScale6}
          style={styles.mt5}>
          {desc}
        </CText>
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <KeyBoardAvoidWrapper contentContainerStyle={styles.rootContainer}>
        <View style={localStyles.outerContainer}>
          <RenderStockIcon
            icon={images.spotifyIcon}
            title={'Spotify'}
            desc={'SPOT'}
          />
          <Ionicons
            name="arrow-forward-sharp"
            size={moderateScale(28)}
            color={colors.textColor}
          />
          <RenderStockIcon
            icon={images.teslaIcon}
            title={'Tesla'}
            desc={'TSLA'}
          />
        </View>
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
        <CButton
          title={strings.viewMyPortfolio}
          containerStyle={styles.mb15}
          onPress={onPressContinue}
        />
        <CButton
          type={'S16'}
          title={strings.backToMenu}
          bgColor={colors.dark3}
          color={colors.primaryLightBtn}
          style={styles.ml10}
          containerStyle={styles.mb15}
          onPress={onPressMenu}
        />
      </KeyBoardAvoidWrapper>
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  outerContainer: {
    ...styles.rowSpaceAround,
    ...styles.mt20,
  },
  imageStyle: {
    height: moderateScale(80),
    width: moderateScale(80),
  },
  innerContainer: {
    ...styles.center,
  },
});
