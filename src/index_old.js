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
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AppNavigator from './navigation';
import { styles } from './themes';
import CSafeAreaView from './components/common/CSafeAreaView';
import { AccountProvider, AccountContext } from './providers/AccountProvider';
import { 
  loadLeaderboardFromStorage, 
  fetchAndSaveLeaderboard,
  fetchAndSaveUserScore 
} from './redux/action/leaderboardAction';

import { enableScreens } from 'react-native-screens';

enableScreens(true); // This improves performance and stability

import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

console.disableYellowBox = true;


const App = () => {
  const dispatch = useDispatch();
  const colors = useSelector(state => state.theme.theme);
  const leaderboardIntervalRef = useRef(null);

  useEffect(() => {
    console.log('🚀 App démarré - Initialisation du leaderboard...');
    
    // 1. Charger les données en cache immédiatement
    dispatch(loadLeaderboardFromStorage());
    
    // 2. Faire le premier call API après 1 seconde (pour ne pas bloquer le démarrage)
    const initialTimeout = setTimeout(() => {
      console.log('� Premier chargement API du leaderboard');
      dispatch(fetchAndSaveLeaderboard(10));
    }, 1000);
    
    // 3. Configurer le refresh automatique toutes les 10 minutes
    leaderboardIntervalRef.current = setInterval(() => {
      console.log('⏰ Auto-refresh du leaderboard (10 min)');
      dispatch(fetchAndSaveLeaderboard(10));
    }, 600000); // 10 minutes = 600000ms

    // Nettoyage à la destruction
    return () => {
      clearTimeout(initialTimeout);
      if (leaderboardIntervalRef.current) {
        clearInterval(leaderboardIntervalRef.current);
        console.log('🧹 Leaderboard interval nettoyé');
      }
    };
  }, [dispatch]);

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
