import { StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import AppNavigator from './navigation';
import { styles } from './themes';
import CSafeAreaView from './components/common/CSafeAreaView';
import { AccountProvider } from './providers/AccountProvider';

import { enableScreens } from 'react-native-screens';

enableScreens(true); // This improves performance and stability


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
