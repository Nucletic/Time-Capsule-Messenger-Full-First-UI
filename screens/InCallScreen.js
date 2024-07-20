import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { Height, Width } from '../utils';
import { moderateScale } from 'react-native-size-matters';
import { ScreenCapturePickerView, RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, RTCView, MediaStream, MediaStreamTrack, mediaDevices, registerGlobals } from 'react-native-webrtc';
import { setDoc, collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { FIREBASE_DB, FIREBASE_AUTH } from '../firebaseConfig';
import { encryptData, decryptData } from '../EncryptData'
import AsyncStorage from '@react-native-async-storage/async-storage';
import ws from './WebSocketConn';
import { peerConnection } from '../CallingUtils';


import Constants from 'expo-constants';
const SECRET_KEY = Constants.expoConfig.extra.SECRET_KEY;

const peerConstraints = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

const InCallScreen = ({ navigation, route }) => {

  const [localMediaStream, setLocalMediaStream] = useState(null);
  const { offer, DocId } = route.params;

  useEffect(() => {
    getMediaStream();

    return () => {
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

  const AccpetCall = async () => {
    try {
      const idToken = await FIREBASE_AUTH.currentUser.getIdToken();
      const encryptedIdToken = encryptData(idToken, SECRET_KEY);
      // const response = await fetch(`http://10.0.2.2:5000/users/UpdateCallStatus`, {
      const response = await fetch(`http://192.168.29.8:5000/users/UpdateCallStatus`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer ' + encryptedIdToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ DocId: DocId, status: 'Accepted' })
      })
      const data = await response.json();
      if (response.status == 200) {
        createAnswer()
      }
    } catch (error) {
      console.error('error, updating call status, and creating answer:', error)
    }
  }

  const createAnswer = async () => {
    try {
      if (!peerConnection) {
        console.error('Peer connection is not initialized');
        return;
      }

      localMediaStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localMediaStream);
      });

      // Set remote description from the offer
      const offerDescription = new RTCSessionDescription(offer.offerDescription);
      await peerConnection.setRemoteDescription(offerDescription);

      // Create answer and set it as local description
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      // Get CustomUUID
      const CustomUUID = await AsyncStorage.getItem('CustomUUID');

      // Get idToken and encrypt it
      const idToken = await FIREBASE_AUTH.currentUser.getIdToken();
      const encryptedIdToken = encryptData(idToken, SECRET_KEY);

      ws.onmessage = async (event) => {
        console.log('FDFDGAFGAFDFDGFGAFDGFGDFDGFSDGFSDG');
        const message = JSON.parse(event.data);
        if (message.type === 'candidate') {
          try {
            const candidate = new RTCIceCandidate(message.candidate);
            await peerConnection.addIceCandidate(candidate);
          } catch (error) {
            console.error('Error handling ICE candidate:', error);
          }
        }
      };

      console.log(offer.senderId);
      // Send ICE candidates to the offering peer
      peerConnection.onicecandidate = async (event) => {
        console.log('SENDING CANDIDATE BY', offer.senderId, 'TO', CustomUUID);
        if (event.candidate) {
          const candidateMessage = {
            type: 'candidate',
            userId: offer.senderId,
            recipientId: CustomUUID,
            idToken: encryptedIdToken,
            candidate: event.candidate
          };
          const candidateMessageString = JSON.stringify(candidateMessage);
          ws.send(candidateMessageString);
        }
      };

      // Send the answer message to the offering peer
      const answerMessage = {
        type: 'answer',
        userId: CustomUUID,
        recipientId: offer.senderId,
        idToken: encryptedIdToken,
        answer: answer
      };
      const answerMessageString = JSON.stringify(answerMessage);
      ws.send(answerMessageString);

      // Navigate to the CallingScreen with offer and DocId
      navigation.navigate('CallingScreen', { answer: answer, DocId: DocId });
    } catch (error) {
      console.error('Error creating answer and sending it back:', error);
    }
  }

  const RejectCall = async () => {
    try {
      const idToken = await FIREBASE_AUTH.currentUser.getIdToken();
      const encryptedIdToken = encryptData(idToken, SECRET_KEY);
      // const response = await fetch(`http://10.0.2.2:5000/users/UpdateCallStatus`, {
      const response = await fetch(`http://192.168.29.8:5000/users/UpdateCallStatus`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer ' + encryptedIdToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ DocId: DocId, status: 'Rejected' })
      })
      const data = await response.json();
      if (response.status == 200) {
        navigation.goBack();
      }
    } catch (error) {
      console.error('error, updating call status:', error)
    }
  }


  return (
    <View style={styles.Container}>
      {localMediaStream ? <RTCView mirror={true} objectFit={'cover'} streamURL={localMediaStream.toURL()} zOrder={0} style={styles.CallerImage} />
        : <Image source={require('../assets/Images/call1.jpg')} style={styles.CallerImage} />}
      {/* <Image source={require('../assets/Icons/IncomingCallShadowCover.png')} style={styles.backgroundShadowCover} /> */}
      <View style={styles.backgroundShadowCover} />
      <View style={styles.ContentContainer}>
        <View style={styles.CallerInfo}>
          <Text style={styles.CallTypeText}>Incoming Call</Text>
          <Text style={styles.CallerName}>Mei-Ling</Text>
        </View>
        <View style={styles.CallOptions}>
          <Pressable style={styles.RejectCallButton}>
            <Image onPress={RejectCall} source={require('../assets/Icons/CallHangUpIcon.png')} style={styles.RejectCallButtonImage} />
          </Pressable>
          <Pressable onPress={AccpetCall} style={styles.AcceptCallButton}>
            <Image source={require('../assets/Icons/CallHangUpIcon.png')} style={styles.AcceptCallButtonImage} />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default InCallScreen

const styles = StyleSheet.create({
  Container: {
    backgroundColor: '#fff',
    height: Height,
    width: Width,
  },
  CallerImage: {
    height: '100%',
    width: '100%',
  },
  backgroundShadowCover: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: '#000000b3'
  },
  ContentContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: moderateScale(100),
    paddingBottom: moderateScale(80),
  },
  CallerInfo: {
    gap: moderateScale(6),
  },
  CallTypeText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '400',
  },
  CallerName: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: Height * 0.032,
  },
  CallOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(140),
  },
  RejectCallButton: {
    backgroundColor: '#F7706E',
    height: moderateScale(64),
    width: moderateScale(64),
    borderRadius: moderateScale(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  RejectCallButtonImage: {
    marginTop: moderateScale(2),
    height: moderateScale(44),
    width: moderateScale(44),
  },
  AcceptCallButton: {
    backgroundColor: '#00CC00',
    height: moderateScale(64),
    width: moderateScale(64),
    borderRadius: moderateScale(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  AcceptCallButtonImage: {
    height: moderateScale(44),
    width: moderateScale(44),
    transform: [{ rotate: '-125deg' }]
  },
});