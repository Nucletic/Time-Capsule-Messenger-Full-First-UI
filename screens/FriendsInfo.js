import { Image, Pressable, StyleSheet, Text, View, Animated, ScrollView, TextInput, FlatList } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { moderateScale } from 'react-native-size-matters';
import { Height, Width } from '../utils';
import FriendsInfoMateCard from '../components/AccountComponents/FriendsInfoMateCard';
import LoaderAnimation from '../components/SmallEssentials/LoaderAnimation'
import NoUserFoundAnimation from '../components/SmallEssentials/NoUserFoundAnimation';
import { FIREBASE_AUTH } from '../firebaseConfig'
import { encryptData, decryptData } from '../EncryptData'
import AsyncStorage from '@react-native-async-storage/async-storage'

import Constants from 'expo-constants';
const SECRET_KEY = Constants.expoConfig.extra.SECRET_KEY;


const FriendsInfo = ({ navigation, route }) => {

  const { userId, mutualFriends, username, profileImage } = route.params;

  const [chatmates, setChatmates] = useState([]);
  const [loading, setLoading] = useState(true);

  const FriendsInfoTabs = [<MainContentOne chatmates={chatmates} />, <MainContentTwo chatmates={mutualFriends} />];
  const scrollX = useRef(new Animated.Value(0)).current;

  const indicatorPosition = scrollX.interpolate({
    inputRange: [0, Width],
    outputRange: [0, Width / 2],
    extrapolate: 'clamp',
  });
  const flatListRef = useRef(null);

  const handleTabPress = (index) => {
    Animated.timing(scrollX, {
      toValue: index,
      duration: 300,
      useNativeDriver: false,
    }).start();
    flatListRef.current.scrollToIndex({ index });
  };


  const fetchChatmates = async () => {
    try {
      setLoading(true);
      const idToken = await FIREBASE_AUTH.currentUser.getIdToken();
      const encryptedIdToken = encryptData(idToken, SECRET_KEY);
      const response = await fetch(`http://192.168.29.8:5000/users/getChatmates/${userId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer ' + encryptedIdToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json();
      if (response.status === 200) {
        setChatmates(data.chatmates);
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw new Error(error);
    }
  }

  useEffect(() => {
    fetchChatmates();
  }, [])


  return (
    <View style={styles.Container}>
      <View style={styles.FriendsInfoNav}>
        <Pressable onPress={() => { navigation.goBack(); }} style={styles.BackButton}>
          <Image source={require('../assets/Icons/BackButton.png')} style={styles.BackButtonImage} />
        </Pressable>
        <View style={styles.FriendsNavDetails}>
          <Image source={{ uri: profileImage }} style={styles.FriendsNavDetailsImage} />
          <Text style={styles.FriendsNavDetailsName}>{username && username}</Text>
        </View>
        <View style={styles.MockElementOne} />
      </View>
      {(loading) ?
        (<View style={styles.LoadingContainer}>
          <LoaderAnimation size={40} color={'#49505B'} />
        </View>) :
        (<>
          <View style={styles.FriendsInfoNavigation}>
            <Pressable onPress={() => handleTabPress(0)}>
              <View style={styles.FriendsInfoNavigationButton}>
                <Text style={styles.FriendsInfoNavigationButtonText}>{chatmates?.length} Chatmates</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => handleTabPress(1)}>
              <View style={styles.FriendsInfoNavigationButton}>
                <Text style={styles.FriendsInfoNavigationButtonText}>{mutualFriends?.length} Common Mates</Text>
              </View>
            </Pressable>
            <Animated.View style={[styles.FriendsInfoNavigationIndicator, { left: indicatorPosition }]} />
          </View>
          <Animated.FlatList horizontal pagingEnabled ref={flatListRef}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            bounces={false} showsHorizontalScrollIndicator={false}
            data={FriendsInfoTabs} contentContainerStyle={styles.MainContent} renderItem={(({ item }) => {
              return (
                item
              )
            })} />
        </>)}
    </View>
  )
}

const MainContentOne = ({ chatmates }) => {

  const inputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    setLoading(true);
    if (chatmates && chatmates.length > 0) {
      const filteredChatmates = chatmates.filter(chatmate => chatmate.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setSearchResults(filteredChatmates);
    }
    setLoading(false);
  }, [searchQuery, chatmates]);


  return (
    <View style={styles.MainContentOne}>
      <View style={styles.FriendsInfoSearch}>
        <View style={styles.FriendsInfoSearchView}>
          <Image source={require('../assets/Icons/Search.png')} style={styles.FriendsInfoSearchViewIcon} />
          <TextInput ref={inputRef} placeholder='Search Chatmates' value={searchQuery} onChangeText={setSearchQuery} placeholderTextColor={'#C3C3C3'} style={styles.FriendsInfoSearchInput} />
        </View>
      </View>
      {(loading) ?
        (<View style={styles.LoadingContainer}>
          <LoaderAnimation size={40} color={'#49505B'} />
        </View>) :
        (<View style={styles.MainContentCards}>
          {searchResults?.length > 0 ? (searchResults?.map((chatmate, index) => {
            return (
              <FriendsInfoMateCard key={index} username={chatmate.name} profileImage={chatmate.profileImage} userId={chatmate.userId} />
            )
          }))
            : (<NoUserFoundAnimation titleText={`No Chatmates found${searchQuery && ` with "${searchQuery}"`}`} />)}
        </View>)}
    </View>
  )
}
const MainContentTwo = ({ chatmates }) => {

  const inputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (chatmates && chatmates.length > 0) {
      const filteredChatmates = chatmates.filter(chatmate => chatmate.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setSearchResults(filteredChatmates);
    }
    setLoading(false);
  }, [searchQuery, chatmates]);




  return (
    <View style={styles.MainContentOne}>
      <View style={styles.FriendsInfoSearch}>
        <View style={styles.FriendsInfoSearchView}>
          <Image source={require('../assets/Icons/Search.png')} style={styles.FriendsInfoSearchViewIcon} />
          <TextInput ref={inputRef} placeholder='Search Mutual Chatmates' value={searchQuery} onChangeText={setSearchQuery} placeholderTextColor={'#C3C3C3'} style={styles.FriendsInfoSearchInput} />
        </View>
      </View>
      {(loading) ?
        (<View style={styles.LoadingContainer}>
          <LoaderAnimation size={40} color={'#49505B'} />
        </View>) :
        (<View style={styles.MainContentCards}>
          {searchResults?.length > 0 ? (searchResults?.map((chatmate, index) => {
            return (
              <FriendsInfoMateCard key={index} username={chatmate.name} profileImage={chatmate.profileImage} userId={chatmate.userId} />
            )
          }))
            : (<NoUserFoundAnimation titleText={`No Chatmates found${searchQuery && ` with "${searchQuery}"`}`} />)}
        </View>)}
    </View>
  )
}

export default FriendsInfo;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: '#fff',
    height: '100%',
  },
  FriendsInfoNav: {
    paddingTop: moderateScale(30),
    padding: moderateScale(16),
    backgroundColor: '#fff',
    borderBottomWidth: moderateScale(1),
    borderColor: '#F8F9FA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  BackButton: {
    height: moderateScale(30),
    width: moderateScale(30),
  },
  BackButtonImage: {
    height: '100%',
    width: '100%'
  },
  FriendsNavDetails: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: moderateScale(10),
  },
  FriendsNavDetailsImage: {
    height: moderateScale(30),
    width: moderateScale(30),
    borderRadius: moderateScale(100),
  },
  FriendsNavDetailsName: {
    fontSize: Height * 0.026,
    color: '#49505B',
    fontWeight: '900',
  },
  FriendsInfoNavigation: {
    height: moderateScale(55),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  FriendsInfoNavigationButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: Width / 2,
  },
  FriendsInfoNavigationButtonText: {
    fontSize: Height * 0.017,
    // fontWeight: '600',
    color: '#9095A0',
  },
  FriendsInfoNavigationIndicator: {
    position: 'absolute',
    top: '95%',
    left: '0%',
    backgroundColor: '#F7706E',
    width: Width / 2,
    height: moderateScale(3),
  },
  MainContent: {
    flexDirection: 'row',
  },
  FriendsInfoSearch: {
    backgroundColor: '#F8F9FA',
    padding: moderateScale(16),
  },
  FriendsInfoSearchView: {
    borderWidth: moderateScale(1),
    borderColor: '#49505B',
    borderRadius: moderateScale(6),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(5),
    gap: moderateScale(8),
  },
  FriendsInfoSearchViewIcon: {
    height: moderateScale(20),
    width: moderateScale(20),
  },
  FriendsInfoSearchInput: {
    fontSize: Height * 0.016,
    padding: 0,
    width: '90%',
    color: '#49505B',
  },
  MainContentOne: {
    width: Width,
  },
  MainContentCards: {
    padding: moderateScale(16),
    gap: moderateScale(21),
  },
  LoadingContainer: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});