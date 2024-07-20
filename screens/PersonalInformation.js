import { Pressable, Image, StyleSheet, Text, View, ScrollView, TextInput, Animated, ToastAndroid, PermissionsAndroid } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Height, Width } from '../utils'
import { moderateScale } from 'react-native-size-matters'
import { encryptData, decryptData } from '../EncryptData'
import { FIREBASE_AUTH } from '../firebaseConfig'
import LoaderAnimation from '../components/SmallEssentials/LoaderAnimation'



import Constants from 'expo-constants';
const SECRET_KEY = Constants.expoConfig.extra.SECRET_KEY;




const PersonalInformation = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [oldEmail, setOldEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [locationEnabled, setLocationEnabled] = useState(null);
  const [loading, setLoading] = useState(true);

  const switchAnimation = useRef(new Animated.Value(0)).current;
  const colorAnimation = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    Animated.timing(switchAnimation, {
      toValue: 1,
      duration: 120,
      useNativeDriver: false,
    }).start();
    Animated.timing(colorAnimation, {
      toValue: 1,
      duration: 120,
      useNativeDriver: false,
    }).start();
  }
  const stopAnimation = () => {
    Animated.timing(switchAnimation, {
      toValue: 0,
      duration: 120,
      useNativeDriver: false,
    }).start();
    Animated.timing(colorAnimation, {
      toValue: 0,
      duration: 120,
      useNativeDriver: false,
    }).start();
  }

  const switchAnimationInterpolate = switchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '50%'],
  })
  const colorAnimationInterpolate = colorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#c3c3c3', '#2278FF'],
  })

  useEffect(() => {
    if (locationEnabled) {
      startAnimation()
    } else stopAnimation();
  }, [locationEnabled]);


  const checkLocationPermission = async () => {
    try {
      const idToken = await FIREBASE_AUTH.currentUser.getIdToken();
      const encryptedIdToken = encryptData(idToken, SECRET_KEY);
      // const response = await fetch(`http://10.0.2.2:5000/users/profile`, {
      const response = await fetch(`http://192.168.29.8:5000/users/profile`, {
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
        if (data.user.Location) {
          setLocationEnabled(true);
        } else setLocationEnabled(false);
      }
    } catch (error) {
      throw new Error(error);
    }
  }



  let pendingIdTokenRequest = null;
  const sendEmailChangeLink = async () => {
    try {
      if (oldEmail === email) {
        return;
      } else {
        if (FIREBASE_AUTH.currentUser) {
          if (pendingIdTokenRequest) {
            pendingIdTokenRequest.cancel();
          }

          pendingIdTokenRequest = new Promise((resolve, reject) => {
            FIREBASE_AUTH.onAuthStateChanged((user) => {
              if (user) {
                const idToken = user.getIdToken();
                resolve(idToken);
              } else {
                reject(new Error('User is not authenticated'));
              }
              pendingIdTokenRequest = null;
            });
          });

          try {
            const idToken = await pendingIdTokenRequest;
            const encryptedIdToken = encryptData(idToken, SECRET_KEY);
            const encryptedEmail = encryptData(email, SECRET_KEY);
            console.log('asdf')
            // const response = await fetch(`http://10.0.2.2:5000/users/requestEmailChange`, {
            const response = await fetch(`http://192.168.29.8:5000/users/requestEmailChange`, {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Authorization': 'Bearer ' + encryptedIdToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: encryptedEmail })
            })
            const data = await response.json();

            if (response.status === 200) {
              ToastAndroid.showWithGravity(
                `Confirmation email was just sent to ${email}`,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                50
              );
            }
          } catch (error) {
            pendingIdTokenRequest = null;
            throw error;
          }
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const enableLocation = async () => {
    try {
      const idToken = await FIREBASE_AUTH.currentUser.getIdToken();
      const encryptedIdToken = encryptData(idToken, SECRET_KEY);

      // const response = await fetch('http://10.0.2.2:5000/users/enableLocation', {
      const response = await fetch('http://192.168.29.8:5000/users/enableLocation', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer ' + encryptedIdToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json();
      if (response.status === 200) {
      }

    } catch (error) {
      throw new Error(error);
    }
  }

  const disableLocation = async () => {
    try {
      const idToken = await FIREBASE_AUTH.currentUser.getIdToken();
      const encryptedIdToken = encryptData(idToken, SECRET_KEY);

      // const response = await fetch('http://10.0.2.2:5000/users/disableLocation', {
      const response = await fetch('http://192.168.29.8:5000/users/disableLocation', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer ' + encryptedIdToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json();
      if (response.status === 200) {
      }

    } catch (error) {
      throw new Error(error);
    }
  }


  const getUserData = async () => {
    try {
      const idToken = await FIREBASE_AUTH.currentUser.getIdToken();
      const encryptedIdToken = encryptData(idToken, SECRET_KEY);
      // const response = await fetch(`http://10.0.2.2:5000/users/profile`, {
      const response = await fetch(`http://192.168.29.8:5000/users/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': 'Bearer ' + encryptedIdToken,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json();
      console.log(response.status);
      if (response.status == 200) {
        setOldEmail(decryptData(data.user.email, SECRET_KEY));
        setEmail(decryptData(data.user.email, SECRET_KEY));
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  useEffect(() => {
    getUserData();
  }, [])

  useEffect(() => {
    if (locationEnabled === true) {
      enableLocation();
    } else if (locationEnabled === false) {
      disableLocation();
    }
  }, [locationEnabled])

  useEffect(() => {
    checkLocationPermission();
  }, [])

  useEffect(() => {
    if (locationEnabled === null || email === null) {
      setLoading(true);
    } else setLoading(false);
  }, [locationEnabled, email])





  return (
    <View style={styles.Container}>
      <View style={styles.SettingsPrivacyNav}>
        <View style={styles.SettingsPrivacyNavLeft}>
          <Pressable onPress={() => { navigation.goBack() }} style={styles.BackButton}>
            <Image source={require('../assets/Icons/BackButton.png')} style={styles.BackButtonImage} />
          </Pressable>
          <Text style={styles.PageTitle}>Personal Information</Text>
        </View>
      </View>
      {loading ?
        (<View style={styles.LoadingContainer}>
          <LoaderAnimation size={40} color={'#49505B'} />
        </View>) :
        (<ScrollView contentContainerStyle={styles.MainContent}>
          <View style={styles.InformationInput}>
            <Text style={styles.InformationInputText}>Email</Text>
            <View style={styles.InformationInputContainer}>
              <TextInput value={email} onChangeText={setEmail} style={styles.InformationInputMain} />
              <Pressable onPress={sendEmailChangeLink} style={styles.InformationInputConfirmButton}>
                <Text style={styles.InformationInputConfirmButtonText}>Confirm</Text>
              </Pressable>
            </View>
            <Text style={styles.InputPrecautionText}></Text>
          </View>
          {/* <View style={styles.InformationInput}>
          <Text style={styles.InformationInputText}>Phone</Text>
          <View style={styles.InformationInputContainer}>
            <TextInput value={phone} onChangeText={setPhone} style={styles.InformationInputMain} />
            <Pressable style={styles.InformationInputConfirmButton}>
              <Text style={styles.InformationInputConfirmButtonText}>Confirm</Text>
            </Pressable>
          </View>
          <Text style={styles.InputPrecautionText}></Text>
        </View> */}
          <View style={styles.locationEnableSwitch}>
            <View style={styles.locationEnableTop}>
              <Text style={styles.LocationSwitchTitle}>Location</Text>
              <Pressable onPress={() => { setLocationEnabled(!locationEnabled) }} style={styles.LocationSwitchButton}>
                <Animated.View style={[styles.LocationSwitchOuter, { borderColor: colorAnimationInterpolate }]}>
                  <Animated.View style={[styles.LocationSwitchInner, { backgroundColor: colorAnimationInterpolate, left: switchAnimationInterpolate }]} />
                </Animated.View>
              </Pressable>
            </View>
            <Text style={styles.LocationPrecautionText}>
              Changing Location setting may effect your experience with location related features and functionalities
            </Text>
          </View>
        </ScrollView>)}
    </View>
  )
}

export default PersonalInformation;

const styles = StyleSheet.create({
  Container: {
    backgroundColor: '#fff',
    height: '100%',
  },
  SettingsPrivacyNav: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(30),
    paddingBottom: moderateScale(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: moderateScale(1),
    borderBottomColor: '#F8F9FA',
  },
  SettingsPrivacyNavLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(12),
  },
  BackButton: {
    height: moderateScale(30),
    width: moderateScale(30),
  },
  BackButtonImage: {
    height: '100%',
    width: '100%'
  },
  PageTitle: {
    fontSize: Height * 0.026,
    color: '#49505B',
    fontWeight: '900',
  },
  EditProfileSaveText: {
    fontSize: Height * 0.020,
    color: '#F7706E',
    fontWeight: '500',
  },
  MainContent: {
    width: '100%',
    paddingHorizontal: moderateScale(16),
  },
  InformationInput: {
    width: '100%',
    paddingTop: moderateScale(15),
  },
  InformationInputText: {
    color: '#C3C3C3',
    fontSize: Height * 0.016,
  },
  InformationInputContainer: {
    borderBottomWidth: moderateScale(1),
    borderBottomColor: '#C3C3C3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  InformationInputMain: {
    fontSize: Height * 0.018,
    color: '#49505B',
    fontWeight: '500',
    padding: 0,
    paddingHorizontal: moderateScale(5),
    width: '80%',
  },
  InformationInputConfirmButtonText: {
    fontSize: Height * 0.016,
    color: '#2278FF',
    fontWeight: '500',
  },
  locationEnableSwitch: {
    marginTop: moderateScale(10),
  },
  locationEnableTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  LocationSwitchTitle: {
    fontSize: Height * 0.020,
    color: '#49505B',
    fontWeight: '600',
  },
  LocationPrecautionText: {
    fontSize: Height * 0.014,
    color: '#C3C3C3',
    marginTop: moderateScale(8),
    lineHeight: Height * 0.019,
  },
  LocationSwitchOuter: {
    borderWidth: moderateScale(2),
    borderColor: '#c3c3c3',
    height: moderateScale(24),
    width: moderateScale(40),
    borderRadius: moderateScale(100),
    justifyContent: 'center',
    padding: 2,
  },
  LocationSwitchInner: {
    height: moderateScale(16),
    width: moderateScale(16),
    borderRadius: moderateScale(100),
    backgroundColor: '#c3c3c3',
  },
  LoadingContainer: {
    height: 0.82 * Height,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
