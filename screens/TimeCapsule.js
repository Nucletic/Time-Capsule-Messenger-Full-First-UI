import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CapsuleNav from '../components/CapsuleComponents/CapsuleNav'
import SendTo from '../components/CapsuleComponents/SendTo'
import CapsuleName from '../components/CapsuleComponents/CapsuleName'
import SelectTime from '../components/CapsuleComponents/SelectTime'
import AddMedia from '../components/CapsuleComponents/AddMedia'
import Message from '../components/CapsuleComponents/Message'

import { collection, doc, getDoc, onSnapshot, updateDoc, arrayUnion, Timestamp, getDocs, where, limit, query } from 'firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import { FIREBASE_DB, FIREBASE_STORAGE } from '../firebaseConfig'
import LoaderAnimation from '../components/SmallEssentials/LoaderAnimation'
import SavingProfileLoader from '../components/SmallEssentials/SavingProfileLoader'

const TimeCapsule = () => {

  const [recipients, setRecipients] = useState([]);
  const [name, setName] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [media, setMedia] = useState([]);
  const [messages, setMessages] = useState([]);
  const [imagesUploaded, setImagesUploaded] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);

  const createTimeCapsule = async () => {
    try {
      setLoading(true);
      const CustomUUID = await AsyncStorage.getItem('CustomUUID');
      const uploadTasks = [];

      if (media.length > 0) {
        for (let i = 0; i < media.length; i++) {
          const image = media[i];

          const response = await fetch(image);
          const blob = await response.blob();

          const storageRef = ref(FIREBASE_STORAGE, `TimeCapsules/${name + '_' + CustomUUID}/images/${Date.now()}_${i}`);
          const uploadTask = uploadBytesResumable(storageRef, blob);
          uploadTasks.push(uploadTask);

          uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
              case 'paused':
                break;
              case 'running':
                break;
            }
          }, (error) => { },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              setAttachments([...attachments, downloadURL]);
              if (media.length === i + 1) {
                setImagesUploaded(true);
                console.log('first')
                uploadTimeCapsule();
              }
            }
          );
        }
        await Promise.all(uploadTasks);
        await Promise.all(attachments);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }


  const uploadTimeCapsule = async () => {
    try {
      const capsule = {
        recipients: recipients,
        name: name,
        time: selectedTime,
        type: 'TimeCapsule',
        media: attachments,
        messages: messages,
      }

      const CustomUUID = await AsyncStorage.getItem('CustomUUID');

      const usersRef = collection(FIREBASE_DB, "users");
      const Que = query(usersRef, where("userId", "==", CustomUUID), limit(1));

      const querySnapshot = await getDocs(Que);

      if (querySnapshot.empty) {
        console.log('No document found with the provided userId.');
        return;
      }

      const docRef = querySnapshot.docs[0].ref;

      await updateDoc(docRef, {
        capsules: {
          TimeCapsules: arrayUnion(capsule),
          LocationCapsules: [],
        }
      });
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <View style={styles.Container}>

      <CapsuleNav onPress={createTimeCapsule} NavIcon={require('../assets/Icons/TimeCapsuleIcon.png')} NavTitle={'Time Capsule'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.SendToView}>
          <SendTo recipients={recipients} setRecipients={setRecipients} />
        </View>
        <CapsuleName name={name} setName={setName} />
        <SelectTime selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
        <AddMedia media={media} setMedia={setMedia} />
        <Message messages={messages} setMessages={setMessages} />
      </ScrollView>
      {loading && (<SavingProfileLoader />)}
    </View>
  )
}

export default TimeCapsule

const styles = StyleSheet.create({
  Container: {
    backgroundColor: '#fff',
    height: '100%',
  },
  SendToView: {
    zIndex: 1,
  },
  LoadingContainer: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});