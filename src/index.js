import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
// Buffer and process polyfills
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import process from 'process';
global.process = process;
import { TextEncoder, TextDecoder } from 'text-encoding';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;


import { StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import AppNavigator from './navigation';
import { styles } from './themes';
import CSafeAreaView from './components/common/CSafeAreaView';
import { AccountProvider } from './providers/AccountProvider';

import { enableScreens } from 'react-native-screens';

enableScreens(true); // This improves performance and stability

import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

console.disableYellowBox = true;


const App = () => {
  const colors = useSelector(state => state.theme.theme);

  return (
    <AccountProvider>
      <CSafeAreaView style={styles.flex}>
        <StatusBar
          barStyle={colors.dark == 'dark' ? 'light-content' : 'dark-content'}
        />
        <AppNavigator />
      </CSafeAreaView>
    </AccountProvider>
  );
};

export default App;
