import React from 'react';
import {StackNav} from '../NavigationKeys';
import {StackRoute} from '../NavigationRoutes';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={StackNav.NameScreen}>
      <Stack.Screen
        name={StackNav.NameScreen}
        component={StackRoute.NameScreen}
      />
      <Stack.Screen
        name={StackNav.GenderScreen}
        component={StackRoute.GenderScreen}
      />
      <Stack.Screen
        name={StackNav.BirthdayScreen}
        component={StackRoute.BirthdayScreen}
      />
      <Stack.Screen
        name={StackNav.BirthPlaceScreen}
        component={StackRoute.BirthPlaceScreen}
      />
      <Stack.Screen
        name={StackNav.InvestmentScreen}
        component={StackRoute.InvestmentScreen}
      />
      <Stack.Screen
        name={StackNav.ExperienceInvestmentScreen}
        component={StackRoute.ExperienceInvestmentScreen}
      />
      <Stack.Screen
        name={StackNav.SavingWithInvestingScreen}
        component={StackRoute.SavingWithInvestingScreen}
      />
      <Stack.Screen
        name={StackNav.WorkTypeScreen}
        component={StackRoute.WorkTypeScreen}
      />
      <Stack.Screen
        name={StackNav.CompanyNameScreen}
        component={StackRoute.CompanyNameScreen}
      />
      <Stack.Screen
        name={StackNav.OccupationScreen}
        component={StackRoute.OccupationScreen}
      />
      <Stack.Screen
        name={StackNav.UploadIDScreen}
        component={StackRoute.UploadIDScreen}
      />
      <Stack.Screen
        name={StackNav.IdAddressScreen}
        component={StackRoute.IdAddressScreen}
      />
      <Stack.Screen
        name={StackNav.HouseStatusScreen}
        component={StackRoute.HouseStatusScreen}
      />
      <Stack.Screen
        name={StackNav.SelfieScreen}
        component={StackRoute.SelfieScreen}
      />
      <Stack.Screen
        name={StackNav.SelfieImageScreen}
        component={StackRoute.SelfieImageScreen}
      />
      <Stack.Screen
        name={StackNav.EmergencyContactScreen}
        component={StackRoute.EmergencyContactScreen}
      />
      <Stack.Screen
        name={StackNav.ContactDetailScreen}
        component={StackRoute.ContactDetailScreen}
      />
      <Stack.Screen
        name={StackNav.TermsAndConditionScreen}
        component={StackRoute.TermsAndConditionScreen}
      />
      <Stack.Screen
        name={StackNav.SignatureScreen}
        component={StackRoute.Signature}
      />
      <Stack.Screen
        name={StackNav.UnlockScreen}
        component={StackRoute.UnlockScreen}
      />
      <Stack.Screen
        name={StackNav.SetPinScreen}
        component={StackRoute.SetPinScreen}
      />
    </Stack.Navigator>
  );
}
