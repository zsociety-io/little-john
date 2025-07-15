import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Local import
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import images from '../../../assets/images';
import {moderateScale} from '../../../common/constants';
import {styles} from '../../../themes';
import CText from '../../../components/common/CText';
import KeyBoardAvoidWrapper from '../../../components/common/KeyBoardAvoidWrapper';
import CButton from '../../../components/common/CButton';
import CDivider from '../../../components/common/CDivider';
import {StackNav} from '../../../navigation/NavigationKeys';
import strings from '../../../i18n/strings';

export default function PreviewExchange({navigation}) {
  const colors = useSelector(state => state.theme.theme);

  const onPressContinue = () => navigation.navigate(StackNav.OrderSuccessful);

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

  const RenderStockIcon = ({icon, title, desc}) => {
    return (
      <View style={localStyles.innerContainer}>
        <Image source={icon} style={localStyles.imageStyle} />
        <View style={styles.ph10}>
          <CText type={'b18'}>{title}</CText>
          <CText
            type={'m14'}
            color={colors.dark ? colors.grayScale3 : colors.grayScale6}
            style={styles.mt5}>
            {desc}
          </CText>
        </View>
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <CHeader title={strings.exchangeStock} />
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
        <View
          style={[
            localStyles.descContainer,
            {
              backgroundColor: colors.dark ? colors.dark2 : colors.grayScale1,
              borderColor: colors.dark ? colors.dark3 : colors.grayScale2,
            },
          ]}>
          <DescriptionLine title={'Market Price SPOT'} desc={'$71.05'} />
          <DescriptionLine title={'Market Price TSLA'} desc={'$207.47'} />
          <DescriptionLine title={'Number of Shares'} desc={'0.017365862'} />
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
        title={strings.continue}
        containerStyle={styles.bottomButton}
        onPress={onPressContinue}
      />
    </CSafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  outerContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mt20,
  },
  imageStyle: {
    height: moderateScale(60),
    width: moderateScale(60),
  },
  innerContainer: {
    ...styles.flexRow,
    ...styles.itemsCenter,
  },
  descContainer: {
    ...styles.p15,
    gap: moderateScale(15),
    borderRadius: moderateScale(24),
    borderWidth: moderateScale(1),
  },
});
