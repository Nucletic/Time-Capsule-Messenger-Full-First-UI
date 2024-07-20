import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ws from './screens/WebSocketConn'
import { FIREBASE_AUTH } from './firebaseConfig'
import { encryptData, decryptData } from './EncryptData'
import { useNavigation } from '@react-navigation/native'


import Constants from 'expo-constants';
const SECRET_KEY = Constants.expoConfig.extra.SECRET_KEY;

const CallNotificationListener = () => {

  const [offer, setOffer] = useState(null);
  const [DocId, setDocId] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    ws.onmessage = async (event) => {
      setDocId(JSON.parse(event.data).docId);
      // const decryptedOffer = decryptData(JSON.parse(event.data).offer, SECRET_KEY);
      // setOffer(decryptedOffer);
      await getOffer(JSON.parse(event.data).docId);
    }
  }, [])


  useEffect(() => {
    if (offer && DocId) {
      navigation.navigate('InCallScreen', { offer: offer, DocId: DocId });
    }
  }, [offer, DocId])

  
  const getOffer = async (id) => {
    try {
      const idToken = await FIREBASE_AUTH.currentUser.getIdToken();
      const encryptedIdToken = encryptData(idToken, SECRET_KEY);
      // const response = await fetch(`http://10.0.2.2:5000/users/getCallOffer/${id}`, {
      const response = await fetch(`http://192.168.29.8:5000/users/getCallOffer/${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer ' + encryptedIdToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.status == 200) {
        setOffer(data.offer);
      }
    } catch (error) {
      console.error('Error getting Call Offer:', error);
    }
  }


  return <View style={{ display: 'none' }} />;
}

export default CallNotificationListener

const styles = StyleSheet.create({});