// Library import
import {
  Image,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
  FlatList,
  Clipboard,
  Alert,
} from 'react-native';
import React, { createRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Local import
import strings from '../../../i18n/strings';
import { AppLogoLight, EditDark } from '../../../assets/svgs';
import { colors, styles } from '../../../themes';
import { ACCESS_TOKEN, moderateScale, THEME } from '../../../common/constants';
import images from '../../../assets/images';
import { ProfileSetting } from '../../../api/constant';
import { changeThemeAction } from '../../../redux/action/themeAction';
import { setAsyncStorageData } from '../../../utils/helpers';
import { StackNav } from '../../../navigation/NavigationKeys';
import CSafeAreaView from '../../../components/common/CSafeAreaView';
import CHeader from '../../../components/common/CHeader';
import CText from '../../../components/common/CText';
import CDivider from '../../../components/common/CDivider';

import LogOut from '../../../components/models/LogOut';

import { useAccount } from '../../../providers/AccountProvider';


export default AccountTab = ({ navigation }) => {
  const color = useSelector(state => state.theme.theme);
  const language = useSelector(state => state.profile.language);
  const LogOutSheetRef = createRef();
  const dispatch = useDispatch();
  const { currentAccount } = useAccount();
  const pubkey = currentAccount?.pubkey;

  const { disconnect } = useAccount();

  const [isEnabled, setIsEnabled] = useState(!!color.dark);

  const onPressLightTheme = () => {
    setAsyncStorageData(THEME, 'light');
    dispatch(changeThemeAction(colors.light));
  };

  const onPressDarkTheme = () => {
    setAsyncStorageData(THEME, 'dark');
    dispatch(changeThemeAction(colors.dark));
  };

  const toggleSwitch = val => {
    if (val) {
      onPressDarkTheme();
    } else {
      onPressLightTheme();
    }
    setIsEnabled(previousState => !previousState);
  };

  const onPressPremium = () => {
    navigation.navigate(StackNav.Quest);
  };

  const onPressEditProfile = () => { };
  // navigation.navigate(StackNav.SetUpProfile, {title: strings.editProfile});

  const onPressItem = item => {
    if (item?.isLogout) {
      LogOutSheetRef?.current?.show();
    } else if (item?.route) {
      navigation.navigate(item?.route);
    }
  };

  const onPressYesLogOut = async () => {
    try {
      await disconnect();
      LogOutSheetRef?.current?.hide();
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: StackNav.onBoarding }],
        });
      }, 500);
      return true;
    } catch (exception) {
      return false;
    }
  };

  const onPressCancel = () => LogOutSheetRef?.current?.hide();

  const onPressCopyWallet = () => {
    if (pubkey) {
      Clipboard.setString(pubkey.toString());
    }
  };

  const LeftIcon = () => {
    return (
      <View style={styles.pr10}>
        <AppLogoLight height={moderateScale(30)} width={moderateScale(30)} />
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        disabled={item.title === strings.darkMode}
        onPress={() => onPressItem(item)}
        key={index}
        activeOpacity={item.rightIcon ? 1 : 0.5}
        style={[localStyles.settingsContainer, styles.mt20]}>
        {item.icon}
        <CText
          type="s18"
          color={item.isRightIcon ? color.alertColor : color.textColor}
          style={styles.ml15}>
          {item.title}
        </CText>
        <View style={localStyles.rightContainer}>
          {!!item.value && (
            <CText type="s18" style={styles.mr10}>
              {language}
            </CText>
          )}
          {!!item.rightIcon ? (
            <Switch
              trackColor={{
                false: color.grayScale3,
                true: color.primary,
              }}
              thumbColor={color.whiteColor}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          ) : !item.isRightIcon ? (
            <Ionicons
              name="chevron-forward-outline"
              size={moderateScale(20)}
              color={color.textColor}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeaderComponent = () => {
    return (
      <View style={styles.mt10}>
        <View style={localStyles.userContentContainer}>
          <View style={[styles.rowCenter, styles.flex]}>
            <TouchableOpacity onPress={onPressEditProfile}>
              <Image
                source={color.dark ? images.userDark : images.userLight}
                style={localStyles.userImage}
              />
            </TouchableOpacity>
            <View style={[styles.mh10, styles.flex]}>
              <CText type="b20">{'Solana Mainnet'}</CText>
              <View style={[styles.rowCenter, styles.mt5]}>
                <CText type="m14" style={styles.flex}>
                  {pubkey && pubkey.toString()}
                </CText>
                <TouchableOpacity onPress={onPressCopyWallet} style={styles.ml10}>
                  <Ionicons
                    name="copy-outline"
                    size={moderateScale(20)}
                    color={color.textColor}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={onPressPremium}
          style={[
            localStyles.premiumContainer,
            {
              borderColor: color.dark ? color.dark3 : color.grayScale2,
              backgroundColor: color.dark ? color.dark2 : color.grayScale1,
            },
          ]}>
          <Image
            source={images.freeStock}
            style={localStyles.image}
            resizeMode="contain"
          />
          <View style={localStyles.imageInnerContainer}>
            <CText type="b20" color={color.whiteColor}>
              {strings.getFreeStock}
            </CText>
            <CText type="r14" color={color.whiteColor} style={styles.mv5}>
              {strings.farmDesc}
            </CText>
          </View>
        </TouchableOpacity>
        <CDivider style={styles.mt20} />
      </View>
    );
  };

  return (
    <CSafeAreaView>
      <CHeader
        isHideBack={true}
        title={strings.account}
        isLeftIcon={<LeftIcon />}
      />
      <FlatList
        removeClippedSubviews={false}
        data={ProfileSetting}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={localStyles.root}
        ListHeaderComponent={renderHeaderComponent}
      />
      <LogOut
        SheetRef={LogOutSheetRef}
        onPressLogOut={onPressYesLogOut}
        onPressCancel={onPressCancel}
      />
    </CSafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  root: {
    ...styles.ph20,
    ...styles.pb20,
  },
  image: {
    height: moderateScale(100),
    width: moderateScale(100),
  },
  userImage: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
  },
  userContentContainer: {
    ...styles.rowSpaceBetween,
    ...styles.mv10,
    ...styles.mb20,
  },
  premiumContainer: {
    ...styles.mv10,
    ...styles.ph15,
    ...styles.pv5,
    ...styles.itemsCenter,
    ...styles.flexRow,
    ...styles.flex,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(24),
  },
  imageInnerContainer: {
    ...styles.ml10,
    ...styles.flex,
  },
  settingsContainer: {
    ...styles.mt10,
    ...styles.flexRow,
    ...styles.itemsCenter,
  },
  rightContainer: {
    ...styles.flex,
    ...styles.rowEnd,
  },
});
