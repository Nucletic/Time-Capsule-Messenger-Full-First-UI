import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { moderateScale } from 'react-native-size-matters'
import { Height } from '../../utils'
import { CommonActions, useNavigation } from '@react-navigation/native'
import { FIREBASE_AUTH } from '../../firebaseConfig'
import { encryptData, decryptData } from '../../EncryptData'
import AsyncStorage from '@react-native-async-storage/async-storage'


import Constants from 'expo-constants';
const SECRET_KEY = Constants.expoConfig.extra.SECRET_KEY;

const FriendsInfoMateCard = ({ username, profileImage, userId }) => {

  const navigation = useNavigation();
  const [requested, setRequested] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const addChatmate = async () => {
    try {
      setRequested(true);
      const senderUUID = await AsyncStorage.getItem('CustomUUID');
      const idToken = await FIREBASE_AUTH.currentUser.getIdToken();
      const encryptedIdToken = encryptData(idToken, SECRET_KEY);
      const response = await fetch(`http://192.168.29.8:5000/users/${userId}/ChatmateRequest`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer ' + encryptedIdToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ senderUUID: senderUUID })
      })
      const data = await response.json();
      if (response.status === 200) {
        console.log('request success');
      } else {
        console.log('request failed');
        setRequested(false);
      }
    } catch (error) {
      setRequested(false);
      throw new Error(error);
    }
  }


  const CheckFollowing = async (Id) => {
    try {
      const userUUID = await AsyncStorage.getItem('CustomUUID');
      const idToken = await FIREBASE_AUTH.currentUser.getIdToken();
      const encryptedIdToken = encryptData(idToken, SECRET_KEY);
      const response = await fetch(`http://192.168.29.8:5000/users/checkFollowing`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer ' + encryptedIdToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userUUID: userUUID, otherUserUUID: Id })
      })
      const data = await response.json();
      if (response.status === 200) {
        setIsFollowing(data.isFollowing);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  useEffect(() => {
    if (userId) {
      CheckFollowing(userId);
    }
  }, []);


  const whatToDo = () => {
    if (requested) {
      return;
    } else if (isFollowing) {
      AddMessageContact();
    } else {
      addChatmate();
    }
  }





  const AddMessageContact = async () => {
    try {
      navigation.dispatch(CommonActions.navigate({ name: 'Chats', }));

      const userUUID = await AsyncStorage.getItem('CustomUUID');
      const idToken = await FIREBASE_AUTH.currentUser.getIdToken();
      const encryptedIdToken = encryptData(idToken, SECRET_KEY);
      const response = await fetch(`http://192.168.29.8:5000/users/AddChatContact`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer ' + encryptedIdToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userUUID: userUUID, otherUserUUID: userId })
      })
    } catch (error) {
      throw new Error(error);
    }
  }

  return (
    <Pressable onPress={() => { navigation.navigate('SearchStack', { screen: 'Account', params: { CustomUUID: userId } }) }} style={styles.FriendsInfoMateCard}>
      <View style={styles.FriendsInfoMateCardLeft}>
        {profileImage && <Image source={{ uri: profileImage }} style={styles.FriendsInfoMateCardImage} />}
        <Text style={styles.FriendsInfoMateCardText}>{username && username}</Text>
      </View>
      <View style={styles.FriendsInfoMateCardRight}>
        <Pressable onPress={() => { whatToDo() }} style={[styles.AddMateButton, (requested || isFollowing) && {
          backgroundColor: '#fff',
          borderWidth: moderateScale(2),
          borderColor: '#F7706E',
        }]}>
          {requested ? <Text style={[styles.AddMateButtonText, { color: '#F7706E' }]}>Requested</Text>
            : isFollowing ? <Text style={[styles.AddMateButtonText, { color: '#F7706E' }]}>Message</Text>
              : <Text style={styles.AddMateButtonText}>Add Chatmate</Text>}
        </Pressable>
      </View>
    </Pressable>
  )
}

export default FriendsInfoMateCard

const styles = StyleSheet.create({
  FriendsInfoMateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  FriendsInfoMateCardImage: {
    height: moderateScale(45),
    width: moderateScale(45),
    borderRadius: moderateScale(100),
  },
  FriendsInfoMateCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8),
  },
  FriendsInfoMateCardText: {
    fontSize: Height * 0.017,
    fontWeight: '900',
    color: '#2F3237',
  },
  AddMateButton: {
    backgroundColor: '#F7706E',
    width: moderateScale(100),
    height: moderateScale(32),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(8),
  },
  AddMateButtonText: {
    fontSize: Height * 0.015,
    fontWeight: '700',
    color: '#fff',
  },
});