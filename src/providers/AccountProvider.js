

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

import { transact, Web3MobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import { Buffer } from "buffer";
import { toByteArray } from 'base64-js';

import AsyncStorage from '@react-native-async-storage/async-storage';


export const APP_IDENTITY = {
  name: 'Little John',
  uri: 'https://littlejohn.fi',
  icon: "favicon.ico",
};

const SIGN_IN_PAYLOAD = {
  domain: 'google.com',
  statement: 'Sign into Little John.',
  uri: 'https://google.com',
};


export const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);

  const connect = useCallback(async () => {
    const authorizationResult = await transact(async (wallet) => {
      const authorizationResult = await wallet.authorize({
        cluster: 'mainnet-beta',
        identity: APP_IDENTITY,
      });
      return authorizationResult;
    });

    try {
      console.log(authorizationResult);
      const { accounts, auth_token } = authorizationResult;
      const firstAccount = accounts[0];
      await AsyncStorage.setItem('authToken', auth_token);
      await AsyncStorage.setItem('base64Address', firstAccount.address);
      const pubkeyAsByteArray = toByteArray(firstAccount.address);
      const nextCurrentAccount = {
        authToken: auth_token,
        pubkey: new PublicKey(pubkeyAsByteArray),
      };
      setCurrentAccount(nextCurrentAccount);

      console.log("Connected with publicKey:", firstAccount.address); // used correct address
    } catch (e) {
      console.log("err: " + e);
    }
  }, [setCurrentAccount]);

  const disconnect = useCallback(async () => {
    await transact(async wallet => {
      if (currentAccount == null) {
        throw new Error('There is no current account to deauthorize');
      }
      await wallet.deauthorize({ auth_token: currentAccount.authToken });
      await AsyncStorage.clear(); // Note: `clear()` is async
      setCurrentAccount(null);
    });
  }, [currentAccount]);

  useEffect(() => {
    (async () => {
      const [cachedAuthToken, cachedBase64Address] = await Promise.all([
        AsyncStorage.getItem('authToken'),
        AsyncStorage.getItem('base64Address'),
      ]);
      if (cachedBase64Address && cachedAuthToken) {
        const pubkeyAsByteArray = toByteArray(cachedBase64Address);
        const cachedCurrentAccount = {
          authToken: cachedAuthToken,
          pubkey: new PublicKey(pubkeyAsByteArray),
        };
        setCurrentAccount(cachedCurrentAccount);
      }
    })();
  }, []);

  useEffect(() => {
    console.log("cur account:", currentAccount)
  }, [currentAccount]);

  return (
    <AccountContext.Provider value={{ currentAccount, connect, disconnect }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};
