import React, {useState, useRef, useCallback} from 'react';
import {StyleSheet, FlatList, Image, View} from 'react-native';
import {useSelector} from 'react-redux';

//Local Imports
import {deviceWidth, getHeight, moderateScale} from '../common/constants';
import CButton from '../components/common/CButton';
import CSafeAreaView from '../components/common/CSafeAreaView';
import strings from '../i18n/strings';
import {styles} from '../themes';
import CText from '../components/common/CText';
import images from '../assets/images';
import {Google_Icon} from '../assets/svgs';
import {StackNav} from '../navigation/NavigationKeys';

const OnBoarding = ({navigation}) => {
  const colors = useSelector(state => state.theme.theme);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef(null);

  const OnBoardingSlide = [
    {
      headerText: 'Welcome to Otrade 👋',
      text: 'The best app to invest in international stocks with as little as $1.00',
      img: images.onBording,
    },
    {
      headerText: 'Get Better Returns 🚀',
      text: 'Invest in the world’s top leading brands & unlock amazing returns of invesment.',
      img: colors.dark ? images.onBordingDark1 : images.onBordingLight1,
    },
    {
      headerText: 'Start with Just $1.00 💰',
      text: 'You don’t have to buy a whole share, you can buy a fraction.',
      img: colors.dark ? images.onBordingDark2 : images.onBordingLight2,
    },
    {
      headerText: 'Your Safety is First 🛡',
      text: 'Your brokerage account is maintained by Interactive Brokers LLC.',
      img: colors.dark ? images.onBordingDark3 : images.onBordingLight3,
    },
    {
      headerText: 'No Commissions ⚡️',
      text: 'No commissions ever, just invest for free and maximize your returns.',
      img: colors.dark ? images.onBordingDark4 : images.onBordingLight4,
    },
    {
      headerText: 'No Spreads 🥷🏻',
      text: 'No spreads, all your trades execute at the international best bid & offer.',
      img: colors.dark ? images.onBordingDark5 : images.onBordingLight5,
    },
    {
      headerText: 'Backed by Real Shares 🌏',
      text: 'All your trades are fully backed by real shares all the times.',
      img: colors.dark ? images.onBordingDark6 : images.onBordingLight6,
    },
  ];

  const onPressSignUp = () => {
    navigation.navigate(StackNav.Auth);
  };

  const onPressSignIn = () => {
    navigation.navigate(StackNav.EmailScreen);
  };

  const _onViewableItemsChanged = useCallback(({viewableItems}) => {
    setCurrentIndex(viewableItems[0]?.index);
  }, []);
  const _viewabilityConfig = {itemVisiblePercentThreshold: 50};

  const RenderOnboardingItem = useCallback(
    ({item, index}) => {
      return (
        <View key={index} style={localStyles.renderItemContainer}>
          <Image
            source={item.img}
            resizeMode="contain"
            style={localStyles.imageStyle}
          />
          <View style={{height: '25%', ...styles.center}}>
            <CText
              numberOfLines={1}
              style={styles.mv10}
              type={'B32'}
              align={'center'}>
              {item.headerText}
            </CText>
            <CText type={'m18'} align={'center'}>
              {item.text}
            </CText>
          </View>
        </View>
      );
    },
    [OnBoardingSlide],
  );

  return (
    <CSafeAreaView style={styles.flex}>
      <FlatList
        data={OnBoardingSlide}
        ref={slideRef}
        renderItem={({item, index}) => (
          <RenderOnboardingItem item={item} index={index} />
        )}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        horizontal
        onViewableItemsChanged={_onViewableItemsChanged}
        viewabilityConfig={_viewabilityConfig}
        pagingEnabled
      />
      <View style={styles.rowCenter}>
        {OnBoardingSlide.map((_, index) => (
          <View
            key={index}
            style={[
              localStyles.bottomIndicatorStyle,
              {
                width:
                  index !== currentIndex
                    ? moderateScale(10)
                    : moderateScale(30),
                backgroundColor:
                  index !== currentIndex ? colors.grayScale3 : colors.primary,
              },
            ]}
          />
        ))}
      </View>
      <CButton
        title={strings.continueWithGoogle}
        bgColor={colors.btnColor3}
        type={'S16'}
        color={colors.textColor}
        frontIcon={<Google_Icon />}
        style={styles.ml10}
        containerStyle={[
          localStyles.submitButton,
          {
            borderColor: colors.bColor,
            borderWidth: moderateScale(1),
          },
        ]}
      />
      <CButton
        title={strings.signUp}
        containerStyle={localStyles.submitButton}
        type={'S16'}
        onPress={onPressSignUp}
      />
      <CButton
        type={'S16'}
        title={strings.signIn}
        bgColor={colors.dark3}
        color={colors.primary}
        style={styles.ml10}
        containerStyle={localStyles.submitButton}
        onPress={onPressSignIn}
      />
    </CSafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  submitButton: {
    ...styles.mb15,
    ...styles.mh25,
  },
  renderItemContainer: {
    width: deviceWidth,
    ...styles.ph20,
    ...styles.center,
  },
  imageStyle: {
    height: '65%',
    width: moderateScale(367),
  },
  bottomIndicatorStyle: {
    height: getHeight(10),
    ...styles.mb30,
    ...styles.mt10,
    borderRadius: moderateScale(10),
    ...styles.mh5,
  },
});

export default OnBoarding;
