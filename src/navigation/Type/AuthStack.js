import React from 'react';
import { StackNav } from '../NavigationKeys';
import { StackRoute } from '../NavigationRoutes';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={StackNav.WalletScreen}>
      <Stack.Screen
        name={StackNav.WalletScreen}
        component={StackRoute.WalletScreen}
      />
    </Stack.Navigator>
  );
}
