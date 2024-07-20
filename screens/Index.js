import { PermissionsAndroid, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import MainNavigation from '../navigation/MainNavigation'
import Registration from './Registration'
import * as WebBrowser from "expo-web-browser";
import { FIREBASE_AUTH } from '../firebaseConfig';
import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData, decryptData } from '../EncryptData'
import ws from './WebSocketConn';

SplashScreen.preventAutoHideAsync();

import Constants from 'expo-constants';
const SECRET_KEY = Constants.expoConfig.extra.SECRET_KEY;

const Index = () => {

  const checkApplicationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      } catch (error) {

      }
    }
  }

  useEffect(() => {
    checkApplicationPermission();
  }, []);

  WebBrowser.maybeCompleteAuthSession();

  const [loading, setLoading] = useState(true);
  const [LoggedIn, setLoggedIn] = useState(null);


  const checkLogin = async () => {
    setLoading(true);
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          if (user.emailVerified) {
            const { CustomUUID, idToken } = await getUserId();
            await updateActivityStatus();
            ws.send(JSON.stringify({ userId: CustomUUID, idToken: idToken }));
            setLoggedIn(true);
            setLoading(false);
          } else {
            setLoggedIn(false);
            setLoading(false);
          }
        } else {
          setLoggedIn(false);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    });
    return () => unsubscribe();
  }

  const updateActivityStatus = async () => {
    try {
      const idToken = await FIREBASE_AUTH.currentUser.getIdToken();
      const CustomUUID = await AsyncStorage.getItem('CustomUUID');
      const encryptedIdToken = encryptData(idToken, SECRET_KEY);

      const activityStatus = {
        type: 'activityStatus',
        userId: CustomUUID,
        idToken: encryptedIdToken,
        activityStatus: 'active',
      };
      const activityStatusString = JSON.stringify(activityStatus);
      ws.send(activityStatusString);
    } catch (error) {
      console.error('Error during updating activity status:', error);
    }
  }

  const getUserId = async () => {
    try {
      const idToken = await FIREBASE_AUTH.currentUser.getIdToken();
      const encryptedIdToken = encryptData(idToken, SECRET_KEY);
      const UUID = await AsyncStorage.getItem('CustomUUID');
      return { CustomUUID: UUID, idToken: encryptedIdToken };
    } catch (error) {
      console.error(error);
    }
  }



  useEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);








  return (
    <>
      {LoggedIn ? <MainNavigation /> : <Registration setLoggedIn={setLoggedIn} />}
    </>
  );
}

export default Index;


// cd C:\Users\pc\AppData\Local\Android\Sdk\tools
// emulator -avd Pixel_4_XL_API_34 -feature -Vulkan
// emulator -avd Pixel_2_API_34 -feature -Vulkan

// for Cold Boot
// -no-snapshot-load