import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';

// Local Imports
import {TabRoute} from '../NavigationRoutes';
import {TabNav} from '../NavigationKeys';
import {styles} from '../../themes';
import {getHeight, moderateScale} from '../../common/constants';
import strings from '../../i18n/strings';
import CText from '../../components/common/CText';
import {
  Discover_Active_Icon,
  Discover_InActive_Icon,
  Home_Active_Icon,
  Home_InActive_Icon,
  More_Active_Icon,
  More_InActive_Icon,
  Portfolio_Active_Icon,
  Portfolio_InActive_Icon,
  Profile_Active_Icon,
  Profile_Inactive_Icon,
} from '../../assets/svgs';

export default function TabBarNavigation() {
  const colors = useSelector(state => state.theme.theme);
  const Tab = createBottomTabNavigator();

  const TabText = memo(({IconType, label, focused}) => (
    <View style={localStyle.tabViewContainer}>
      {IconType}
      <CText
        style={styles.mt5}
        numberOfLines={1}
        color={focused ? colors.primary : colors.grayScale5}
        type={'R14'}>
        {label}
      </CText>
    </View>
  ));

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: [
          localStyle.tabBarStyle,
          {backgroundColor: colors.backgroundColor},
        ],
        tabBarShowLabel: false,
      }}
      initialRouteName={TabNav.HomeTab}>
      <Tab.Screen
        name={TabNav.HomeTab}
        component={TabRoute.HomeTab}
        options={{
          tabBarIcon: ({focused}) => (
            <TabText
              IconType={focused ? <Home_Active_Icon /> : <Home_InActive_Icon />}
              focused={focused}
              label={strings.home}
            />
          ),
        }}
      />
      <Tab.Screen
        name={TabNav.PortfolioTab}
        component={TabRoute.PortfolioTab}
        options={{
          tabBarIcon: ({focused}) => (
            <TabText
              IconType={
                focused ? (
                  <Portfolio_Active_Icon />
                ) : (
                  <Portfolio_InActive_Icon />
                )
              }
              focused={focused}
              label={strings.portfolio}
            />
          ),
        }}
      />
      <Tab.Screen
        name={TabNav.DiscoverTab}
        component={TabRoute.DiscoverTab}
        options={{
          tabBarIcon: ({focused}) => (
            <TabText
              IconType={
                focused ? <Discover_Active_Icon /> : <Discover_InActive_Icon />
              }
              focused={focused}
              label={strings.discover}
            />
          ),
        }}
      />
      <Tab.Screen
        name={TabNav.MoreTab}
        component={TabRoute.MoreTab}
        options={{
          tabBarIcon: ({focused}) => (
            <TabText
              IconType={focused ? <More_Active_Icon /> : <More_InActive_Icon />}
              focused={focused}
              label={strings.more}
            />
          ),
        }}
      />
      <Tab.Screen
        name={TabNav.AccountTab}
        component={TabRoute.AccountTab}
        options={{
          tabBarIcon: ({focused}) => (
            <TabText
              IconType={
                focused ? <Profile_Active_Icon /> : <Profile_Inactive_Icon />
              }
              focused={focused}
              label={strings.account}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const localStyle = StyleSheet.create({
  tabBarStyle: {
    height: getHeight(60),
    ...styles.ph20,
    borderTopWidth: 0,
    paddingTop: moderateScale(10),
  },
  tabViewContainer: {
    ...styles.center,
    width: moderateScale(100),
  },
});
