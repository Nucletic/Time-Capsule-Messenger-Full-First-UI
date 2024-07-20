import { Image, StyleSheet, Text, View, Animated, Pressable, Easing } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { moderateScale } from 'react-native-size-matters';
import { getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/native';
import { Height, Width } from '../utils';
import Capsule from '../screens/Capsule';
import { AccountStack, CapsuleStack, ChatsStack, NotificationStack, SearchStack } from './StackNavigation';


const Tab = createBottomTabNavigator();

const getRouteName = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  if (routeName?.includes('RegistrationStack') || routeName?.includes('Tale') || routeName?.includes('AddTale') || routeName?.includes('ChatBox')
    || routeName?.includes('EditProfile') || routeName?.includes('SettingsPrivacy') || routeName?.includes('PersonalInformation') ||
    routeName?.includes('AccountPrivacy') || routeName?.includes('BlockedAccounts') || routeName?.includes('ChatInfo')
    || routeName?.includes('CallingScreen') || routeName?.includes('TimeCapsule') || routeName?.includes('LocationCapsule')
    || routeName?.includes('OutCallScreen') || routeName?.includes('InCallScreen') || routeName?.includes('ImageShow')) {
    return 'none';
  }
  return 'block';
}


const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    backgroundColor: '#fff',
    height: moderateScale(54),
    borderTopColor: '#f0f0f1',
    alignItems: 'center',
    justifyContent: 'center',
  }
}

const TabNavigation = () => {

  const navigation = useNavigation();
  const capsuleButtonAnimation = useRef(new Animated.Value(0)).current;
  const capsuleButtonCoverAnimation = useRef(new Animated.Value(0)).current;

  const capsulePromptOpacityAnimation = useRef(new Animated.Value(0)).current;
  const capsulePromptAnimation = useRef(new Animated.Value(0)).current;


  const [optionShown, setOptionShown] = useState(false);

  handleCapsuleClick = () => {
    if (!optionShown) {
      showOption();
      setOptionShown(true);
    } else {
      hideOption();
      setOptionShown(false);
    }
  }

  const showOption = () => {
    Animated.spring(capsuleButtonAnimation, {
      toValue: 1,
      duration: 160,
      useNativeDriver: true,
    }).start();
    Animated.timing(capsuleButtonCoverAnimation, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
    Animated.timing(capsulePromptOpacityAnimation, {
      toValue: 1,
      duration: 160,
      useNativeDriver: true,
    }).start();
    Animated.timing(capsulePromptAnimation, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

  }
  const hideOption = () => {
    Animated.spring(capsuleButtonAnimation, {
      toValue: 0,
      duration: 160,
      useNativeDriver: true,
    }).start();
    Animated.timing(capsuleButtonCoverAnimation, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
    Animated.timing(capsulePromptOpacityAnimation, {
      toValue: 0,
      duration: 160,
      useNativeDriver: true,
    }).start();
    Animated.timing(capsulePromptAnimation, {
      toValue: 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }

  const capsuleButtonAnimationInterpolate = capsuleButtonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  })
  const capsuleButtonCoverAnimationInterpolate = capsuleButtonCoverAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.75],
  })
  const capsulePromptOpacityAnimationInterpolate = capsulePromptOpacityAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1],
  })
  const capsulePromptAnimationInterpolate = capsulePromptAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [moderateScale(100), -moderateScale(140)],
  })

  return (
    <Tab.Navigator initialRouteName={'ChatsStack'} screenOptions={screenOptions}>
      <Tab.Screen name='ChatsStack' component={ChatsStack} options={({ route }) => ({
        tabBarStyle: { display: getRouteName(route) },
        tabBarIcon: ({ focused }) => {
          return (
            <View style={styles.tabIconContainer}>
              <View style={styles.tabIconButton}>
                <Image source={focused ? require('../assets/Icons/ChatsTabButton.png') : require('../assets/Icons/ChatsTabButtonDark.png')} style={styles.tabIcon} />
              </View>
            </View>
          )
        }
      })} />
      <Tab.Screen name='SearchStack' component={SearchStack} options={({ route }) => ({
        tabBarStyle: { display: getRouteName(route) },
        tabBarIcon: ({ focused }) => {
          return (
            <View style={styles.tabIconContainer}>
              <View style={styles.tabIconButton}>
                <Image source={focused ? require('../assets/Icons/SearchTabButton.png') : require('../assets/Icons/SearchTabButtonDark.png')} style={styles.tabIcon} />
              </View>
            </View>
          )
        }
      })} />
      <Tab.Screen name='Capsule' component={Capsule} options={({ route }) => ({
        tabBarStyle: { display: getRouteName(route) },
        tabBarIcon: ({ focused }) => {
          return (
            <>
              <Animated.View style={{
                position: 'absolute',
                top: -Height + moderateScale(4),
                height: Height,
                width: Width,
                backgroundColor: '#000',
                pointerEvents: 'none',
                opacity: capsuleButtonCoverAnimationInterpolate
              }} />

              <Animated.View style={{
                backgroundColor: '#fff', width: moderateScale(220), position: 'absolute', borderRadius: moderateScale(15),
                opacity: capsulePromptOpacityAnimationInterpolate, transform: [{ translateY: capsulePromptAnimationInterpolate }]
              }}>
                <Pressable onPress={() => { handleCapsuleClick(); navigation.navigate('TimeCapsule') }} style={{ alignItems: 'center', gap: moderateScale(12), flexDirection: 'row', padding: moderateScale(12) }}>
                  <Image source={require('../assets/Icons/TimeCapsuleIcon.png')} style={{ height: moderateScale(32), width: moderateScale(32) }} />
                  <Text style={{ fontSize: Height * 0.022, fontWeight: '600', color: '#49505B' }}>Time Capsule</Text>
                </Pressable>
                <View style={{ height: moderateScale(1), width: '100%', backgroundColor: '#E9E9E9' }} />
                <Pressable onPress={() => { handleCapsuleClick(); navigation.navigate('OpenedCapsule') }} style={{ alignItems: 'center', gap: moderateScale(12), flexDirection: 'row', padding: moderateScale(12) }}>
                  <Image source={require('../assets/Icons/LocationCapsuleIcon.png')} style={{ height: moderateScale(32), width: moderateScale(32) }} />
                  <Text style={{ fontSize: Height * 0.022, fontWeight: '600', color: '#49505B' }}>Location Capsule</Text>
                </Pressable>
                <View style={{ height: moderateScale(1), width: '100%', backgroundColor: '#E9E9E9' }} />
                <Pressable onPress={() => { handleCapsuleClick(); navigation.navigate('ChronoLocCapsule') }} style={{ alignItems: 'center', gap: moderateScale(12), flexDirection: 'row', padding: moderateScale(12) }}>
                  <Image source={require('../assets/Icons/CronoLocCapsuleIcon.png')} style={{ height: moderateScale(32), width: moderateScale(32) }} />
                  <Text style={{ fontSize: Height * 0.022, fontWeight: '600', color: '#49505B' }}>CronoLoc Capsule</Text>
                </Pressable>
              </Animated.View>
              <Animated.View style={[styles.tabIconContainer, { top: -moderateScale(20), transform: [{ rotate: capsuleButtonAnimationInterpolate }] }]}>
                <View style={styles.tabIconButton}>
                  <Image source={require('../assets/Icons/CreateNewCapsuleButton.png')} style={styles.capsuleTabIcon} />
                </View>
              </Animated.View>
            </>
          )
        }
      })} listeners={({ navigation, route }) => ({
        tabPress: e => {
          e.preventDefault();
          handleCapsuleClick();
        }
      })} />
      < Tab.Screen name='NotificationStack' component={NotificationStack} options={({ route }) => ({
        tabBarStyle: { display: getRouteName(route) },
        tabBarIcon: ({ focused }) => {
          return (
            <View style={styles.tabIconContainer}>
              <View style={styles.tabIconButton}>
                <Image source={focused ? require('../assets/Icons/NotificationTabButton.png') : require('../assets/Icons/NotificationTabButtonDark.png')} style={styles.tabIcon} />
              </View>
            </View>
          )
        }
      })} />
      < Tab.Screen name='AccountStack' component={AccountStack} options={({ route }) => ({
        tabBarStyle: { display: getRouteName(route) },
        tabBarIcon: ({ focused }) => {
          return (
            <View style={styles.tabIconContainer}>
              <View style={styles.tabIconButton}>
                <Image source={focused ? require('../assets/Icons/AccountTabButton.png') : require('../assets/Icons/AccountTabButtonDark.png')} style={styles.tabIcon} />
              </View>
            </View>
          )
        }
      })} />
    </Tab.Navigator>
  )
}

export default TabNavigation;


const styles = StyleSheet.create({
  tabIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabIconButton: {
    height: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabIcon: {
    width: moderateScale(28),
    height: moderateScale(28),
  },

  capsuleTabIcon: {
    width: moderateScale(55),
    height: moderateScale(55),
  }
});