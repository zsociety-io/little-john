import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StackRoute} from '../NavigationRoutes';
import {StackNav} from '../NavigationKeys';
import AuthStack from './AuthStack';

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={StackNav.Splash}>
      <Stack.Screen name={StackNav.Splash} component={StackRoute.Splash} />
      <Stack.Screen
        name={StackNav.onBoarding}
        component={StackRoute.OnBoarding}
      />
      <Stack.Screen name={StackNav.Auth} component={AuthStack} />
      <Stack.Screen name={StackNav.TabBar} component={StackRoute.TabBar} />
      <Stack.Screen
        name={StackNav.EmailScreen}
        component={StackRoute.EmailScreen}
      />
      <Stack.Screen
        name={StackNav.EmailVerifyScreen}
        component={StackRoute.EmailVerifyScreen}
      />
      <Stack.Screen
        name={StackNav.InviteFriend}
        component={StackRoute.InviteFriend}
      />
      <Stack.Screen
        name={StackNav.MyRewards}
        component={StackRoute.MyRewards}
      />
      <Stack.Screen name={StackNav.Security} component={StackRoute.Security} />
      <Stack.Screen
        name={StackNav.HelpCenter}
        component={StackRoute.HelpCenter}
      />
      <Stack.Screen name={StackNav.Language} component={StackRoute.Language} />
      <Stack.Screen
        name={StackNav.NotificationSetting}
        component={StackRoute.NotificationSetting}
      />
      <Stack.Screen
        name={StackNav.PersonalInfo}
        component={StackRoute.PersonalInfo}
      />
      <Stack.Screen
        name={StackNav.AboutOtrade}
        component={StackRoute.AboutOtrade}
      />

      <Stack.Screen
        name={StackNav.DeveloperSettings}
        component={StackRoute.DeveloperSettings}
      />
      
      <Stack.Screen
        name={StackNav.ExchangeStock}
        component={StackRoute.ExchangeStock}
      />
      <Stack.Screen
        name={StackNav.PreviewExchange}
        component={StackRoute.PreviewExchange}
      />
      <Stack.Screen
        name={StackNav.OrderSuccessful}
        component={StackRoute.OrderSuccessful}
      />
      <Stack.Screen
        name={StackNav.DepositPaymentRecept}
        component={StackRoute.DepositPaymentRecept}
      />
      <Stack.Screen
        name={StackNav.DepositToOtrade}
        component={StackRoute.DepositToOtrade}
      />
      <Stack.Screen
        name={StackNav.DepositToOtradePayment}
        component={StackRoute.DepositToOtradePayment}
      />
      <Stack.Screen
        name={StackNav.WithdrawalAccount}
        component={StackRoute.WithdrawalAccount}
      />
      <Stack.Screen
        name={StackNav.AddBankAccount}
        component={StackRoute.AddBankAccount}
      />
      <Stack.Screen
        name={StackNav.BankAccountDetail}
        component={StackRoute.BankAccountDetail}
      />
      <Stack.Screen
        name={StackNav.ConfirmBankAccountDetail}
        component={StackRoute.ConfirmBankAccountDetail}
      />
      <Stack.Screen
        name={StackNav.PreviewWithdraw}
        component={StackRoute.PreviewWithdraw}
      />
      <Stack.Screen
        name={StackNav.WithdrawSuccess}
        component={StackRoute.WithdrawSuccess}
      />
      <Stack.Screen
        name={StackNav.FundingActivity}
        component={StackRoute.FundingActivity}
      />
      <Stack.Screen
        name={StackNav.PaymentMethods}
        component={StackRoute.PaymentMethods}
      />
      <Stack.Screen
        name={StackNav.FinancialTransaction}
        component={StackRoute.FinancialTransaction}
      />
      <Stack.Screen
        name={StackNav.AllStocks}
        component={StackRoute.AllStocks}
      />
      <Stack.Screen
        name={StackNav.MyWishlist}
        component={StackRoute.MyWishlist}
      />
      <Stack.Screen name={StackNav.MyStocks} component={StackRoute.MyStocks} />
      <Stack.Screen
        name={StackNav.Notification}
        component={StackRoute.Notification}
      />
      <Stack.Screen
        name={StackNav.StockDetailScreen}
        component={StackRoute.StockDetailScreen}
      />
      <Stack.Screen name={StackNav.BuySell} component={StackRoute.BuySell} />
      <Stack.Screen
        name={StackNav.BuySellOption}
        component={StackRoute.BuySellOption}
      />
      <Stack.Screen
        name={StackNav.BuySellPreview}
        component={StackRoute.BuySellPreview}
      />
      <Stack.Screen
        name={StackNav.BuySellSuccessful}
        component={StackRoute.BuySellSuccessful}
      />
      <Stack.Screen
        name={StackNav.NewsScreen}
        component={StackRoute.NewsScreen}
      />
      <Stack.Screen
        name={StackNav.SPOTMarketStats}
        component={StackRoute.SPOTMarketStats}
      />
    </Stack.Navigator>
  );
}
