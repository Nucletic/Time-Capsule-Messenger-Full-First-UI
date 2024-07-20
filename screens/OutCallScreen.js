import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { Height, Width } from '../utils';
import { moderateScale } from 'react-native-size-matters';
import { ScreenCapturePickerView, RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, RTCView, MediaStream, MediaStreamTrack, mediaDevices, registerGlobals } from 'react-native-webrtc';
import { setDoc, addDoc, collection, doc, getDocs, onSnapshot, Timestamp } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData, decryptData } from '../EncryptData'
import ws from './WebSocketConn';
import { peerConnection } from '../CallingUtils';

import Constants from 'expo-constants';
const SECRET_KEY = Constants.expoConfig.extra.SECRET_KEY;

const peerConstraints = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };


const OutCallScreen = ({ navigation, route }) => {

  const [localMediaStream, setLocalMediaStream] = useState(null);
  const [CustomUUID, setCustomUUID] = useState(null);
  const { chatId } = route.params;

  AsyncStorage.getItem('CustomUUID').then((CustomUUID) => {
    setCustomUUID(CustomUUID);
  });

  useEffect(() => {
    getMediaStream();

    return () => {
      if (peerConnection) {
        peerConnection.close();
      }
      if (localMediaStream) {
        localMediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const getMediaStream = async () => {
    const mediaConstraints = {
      audio: true,
      video: true,
    };
    try {
      const stream = await mediaDevices.getUserMedia(mediaConstraints);
      setLocalMediaStream(stream);
    } catch (error) {
      console.error('Error getting media stream:', error);
    }
  };

  const createOffer = async () => {
    try {
      localMediaStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localMediaStream);
      });

      const offerDescription = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offerDescription);

      const idToken = await FIREBASE_AUTH.currentUser.getIdToken();
      const encryptedIdToken = encryptData(idToken, SECRET_KEY);
      const offerStructure = {
        senderId: CustomUUID,
        recipientId: CustomUUID === chatId.split('_')[0] ? chatId.split('_')[1] : chatId.split('_')[0],
        status: 'pending',
        timestamp: Timestamp.now(),
        offerDescription: offerDescription,
      }
      const encryptedOfferStructure = encryptData(JSON.stringify(offerStructure), SECRET_KEY);

      ws.send(JSON.stringify({
        type: 'offer',
        userId: CustomUUID,
        idToken: encryptedIdToken,
        offer: encryptedOfferStructure
      }));

    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };


  useEffect(() => {
    if (chatId && CustomUUID && localMediaStream) {
      createOffer();
    }
    ws.onmessage = async (event) => {
      const parsedMessage = JSON.parse(event.data);
      if (parsedMessage.type === 'answer') {
        const answerDescription = new RTCSessionDescription(parsedMessage.answer);
        await peerConnection.setRemoteDescription(answerDescription);
        navigation.navigate('CallingScreen', { answer: parsedMessage.answer, recipientId: parsedMessage.userId });
      }
    }
  }, [chatId, CustomUUID, localMediaStream]);



  return (
    <View style={styles.Container}>
      {localMediaStream ? <RTCView mirror={true} objectFit={'cover'} streamURL={localMediaStream.toURL()} zOrder={0} style={styles.CallingTopImage} />
        : <Image source={require('../assets/Images/call1.jpg')} style={styles.CallingTopImage} />}
      <View style={styles.backgroundShadowCover}>
        <View style={styles.recipientInfo}>
          <Image source={require('../assets/Images/call1.jpg')} style={styles.recipientImage} />
          <Text style={styles.recipientName}>Mei Ling</Text>
          <Text style={styles.recipientCallTime}>Connecting</Text>
        </View>
        <View style={styles.CallingOptions}>
          <Pressable style={styles.VideoToggleButton}>
            <Image source={require('../assets/Icons/CallCameraOption.png')} style={styles.VideoToggleButtonImage} />
          </Pressable>
          <Pressable style={styles.hangUpButton}>
            <Image source={require('../assets/Icons/CallHangUpIcon.png')} style={styles.hangUpButtonImage} />
          </Pressable>
          <Pressable style={styles.MicToggleButton}>
            <Image source={require('../assets/Icons/CallMicIcon.png')} style={styles.MicToggleButtonImage} />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default OutCallScreen

const styles = StyleSheet.create({
  Container: {
    backgroundColor: '#fff',
    height: Height,
    width: Width,
  },
  CallingTopImage: {
    height: Height,
    width: Width,
  },
  backgroundShadowCover: {
    backgroundColor: '#00000099',
    position: 'absolute',
    height: Height,
    width: Width,
    justifyContent: 'space-between',
    paddingTop: moderateScale(90),
    paddingBottom: moderateScale(90),
  },
  recipientInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(6),
  },
  recipientImage: {
    height: moderateScale(100),
    width: moderateScale(100),
    borderRadius: moderateScale(200),
  },
  recipientName: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: Height * 0.022,
  },
  recipientCallTime: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '400',
  },
  CallingOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  hangUpButton: {
    backgroundColor: '#F7706E',
    height: moderateScale(55),
    width: moderateScale(55),
    borderRadius: moderateScale(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  hangUpButtonImage: {
    marginTop: moderateScale(2),
    height: moderateScale(40),
    width: moderateScale(40),
  },
  VideoToggleButton: {
    backgroundColor: '#00000099',
    height: moderateScale(55),
    width: moderateScale(55),
    borderRadius: moderateScale(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  VideoToggleButtonImage: {
    height: moderateScale(28),
    width: moderateScale(28),
  },
  MicToggleButton: {
    backgroundColor: '#00000099',
    height: moderateScale(55),
    width: moderateScale(55),
    borderRadius: moderateScale(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  MicToggleButtonImage: {
    height: moderateScale(28),
    width: moderateScale(28),
  },
});