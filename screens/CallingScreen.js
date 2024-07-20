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

const CallingScreen = ({ navigation, route }) => {
  const [localMediaStream, setLocalMediaStream] = useState(null);
  const [remoteMediaStream, setRemoteMediaStream] = useState(null);
  const [isVoiceOnly, setIsVoiceOnly] = useState(false);
  const { DocId, answer, recipientId } = route.params;


  useEffect(() => {
    getMediaStream();
    let localDescriptionSet = false;
  }, []);

  useEffect(() => {
    console.log('remoteMediaStream', remoteMediaStream);
  }, [remoteMediaStream])


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

  const hangup = async () => {
    try {
      if (peerConnection) {
        peerConnection.close();
      }
      if (localMediaStream) {
        localMediaStream.getTracks().forEach(track => track.stop());
      }
    } catch (error) {
      console.error('Error hanging up:', error);
    } finally {
      setLocalMediaStream(null);
      setRemoteMediaStream(null);
    }
  };

  const handleIceCandidates = async () => {
    try {

      localMediaStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localMediaStream);
      });

      peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
          const idToken = await FIREBASE_AUTH.currentUser.getIdToken();
          const encryptedIdToken = encryptData(idToken, SECRET_KEY);
          const CustomUUID = await AsyncStorage.getItem('CustomUUID');
          console.log('MY ID IS', CustomUUID, 'AND I AM SENDING CANDIDATE TO', recipientId);
          const candidateMessage = {
            type: 'candidate',
            userId: CustomUUID,
            recipientId: recipientId,
            idToken: encryptedIdToken,
            candidate: event.candidate
          };
          const candidateMessageString = JSON.stringify(candidateMessage);
          ws.send(candidateMessageString);
        }
      };

      ws.onmessage = async (event) => {
        console.log('CANDIDATE, BEING SET IN CallingScreen');
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

      peerConnection.ontrack = (event) => {
        const remoteStream = event.streams[0];
        setRemoteMediaStream(remoteStream);
      };

    } catch (error) {
      console.error('Error handling incoming answer:', error);
    }
  }


  useEffect(() => {
    if (answer && recipientId && localMediaStream) {
      handleIceCandidates();
    }
  }, [answer])



  return (
    <View style={styles.Container}>
      <View style={styles.CallingTop}>

        {localMediaStream ? <RTCView mirror={true} objectFit={'cover'} streamURL={localMediaStream.toURL()} zOrder={0} style={styles.CallingTopImage} />
          : <Image source={require('../assets/Images/call1.jpg')} style={styles.CallingTopImage} />}

        <View style={styles.CallingTopNameView}>
          <Image source={require('../assets/Images/CallingNameShadow.png')} style={styles.CallingTopNameShadowImage} />
          <View style={styles.CallerDetails}>
            <Image source={require('../assets/Images/call1.jpg')} style={styles.CallerDetailsImage} />
            <Text style={styles.CallerDetailsName}>Yung-Chen</Text>
          </View>
        </View>
      </View>
      <View style={styles.CallingBottom}>

        {remoteMediaStream ? <RTCView mirror={true} objectFit={'cover'} streamURL={remoteMediaStream.toURL()} zOrder={0} style={styles.CallingBottomImage} />
          : <Image source={require('../assets/Images/call2.jpg')} style={styles.CallingBottomImage} />}

        <View style={styles.CallingBottomCallOptions}>
          <Pressable style={styles.CallOptionsButton}>
            <Image source={require('../assets/Icons/CallMuteIcon.png')} style={styles.CallOptionsButtonImage} />
          </Pressable>
          <Pressable style={styles.CallOptionsButton}>
            <Image source={require('../assets/Icons/CallMicIcon.png')} style={styles.CallOptionsButtonImage} />
          </Pressable>
          <Pressable style={styles.CallOptionsButton}>
            <Image source={require('../assets/Icons/CallCameraOption.png')} style={styles.CallOptionsButtonImage} />
          </Pressable>
          <Pressable onPress={() => { hangup() }} style={styles.CallHangUpOptionsButton}>
            <Image source={require('../assets/Icons/CallHangUpIcon.png')} style={styles.CallHangUpOptionsButtonImage} />
          </Pressable>
        </View>
      </View>
    </View>
  )
}

export default CallingScreen

const styles = StyleSheet.create({
  Container: {
    height: '100%',
  },
  CallingTop: {
    width: '100%',
    height: '50%',
  },
  CallingTopImage: {
    height: '100%',
    width: '100%',
  },
  CallingBottom: {
    width: '100%',
    height: '50%',
  },
  CallingBottomImage: {
    height: '100%',
    width: '100%',
  },
  CallingTopNameView: {
    position: 'absolute',
    height: moderateScale(70),
    width: '100%',
    top: '83%',
    left: 0,
  },
  CallingTopNameShadowImage: {
    height: '100%',
    width: '100%',
  },
  CallerDetails: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: moderateScale(16),
    gap: moderateScale(10),
  },
  CallerDetailsImage: {
    height: moderateScale(30),
    width: moderateScale(30),
    borderRadius: moderateScale(100),
  },
  CallerDetailsName: {
    fontSize: Height * 0.018,
    fontWeight: '600',
    color: '#fff',
  },
  CallingBottomCallOptions: {
    backgroundColor: '#00000099',
    height: moderateScale(100),
    width: '100%',
    position: 'absolute',
    top: '75%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: moderateScale(40),
  },
  CallOptionsButton: {
    height: moderateScale(55),
    width: moderateScale(55),
    borderRadius: moderateScale(100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1E1E',
  },
  CallOptionsButtonImage: {
    height: moderateScale(24),
    width: moderateScale(24),
  },
  CallHangUpOptionsButton: {
    height: moderateScale(55),
    width: moderateScale(55),
    borderRadius: moderateScale(100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F23051',
  },
  CallHangUpOptionsButtonImage: {
    height: moderateScale(28),
    width: moderateScale(28),
  },
});