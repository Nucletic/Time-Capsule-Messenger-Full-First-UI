import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react';
import { Height, Width } from '../../utils';
import { moderateScale } from 'react-native-size-matters';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const SelectLocation = () => {

  const [location, setLocation] = useState(null);
  const [inputLatitude, setInputLatitude] = useState('');
  const [inputLongitude, setInputLongitude] = useState('');

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });
  };

  const handleMapPress = () => {
    const latitude = parseFloat(inputLatitude);
    const longitude = parseFloat(inputLongitude);

    if (!isNaN(latitude) && !isNaN(longitude)) {
      setLocation({ latitude, longitude });
    } else {
      alert('Invalid latitude or longitude');
    }
  };


  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    console.log(location);
  }, [location]);

  return (
    <View style={styles.Container}>
      <Text style={styles.Title}>Select Location</Text>
      <View style={styles.LocationContainer}>
        {location && (
          <MapView
            style={{ height: '100%', width: '100%', borderRadius: moderateScale(10), }}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onPress={handleMapPress}
          >
            <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
          </MapView>
        )}
      </View>
      <View style={styles.LocationInputContainer}>
        <Text style={styles.Title}>Select Location</Text>
        <View style={styles.LocationInputMainContainer}>
          <TextInput style={styles.LocationInput} placeholder="Latitude" placeholderTextColor="#9095A0"
            onChangeText={(text) => setInputLatitude(text)} keyboardType="numeric" />
          <TextInput style={styles.LocationInput} placeholder="Longitude" placeholderTextColor="#9095A0"
            onChangeText={(text) => setInputLongitude(text)} keyboardType="numeric" />
        </View>
        <Pressable onPress={handleMapPress} style={styles.ClearTimeButton}>
          <Text style={styles.ClearTimeButtonText}>Add</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default SelectLocation

const styles = StyleSheet.create({
  Container: {
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(8),
    marginBottom: moderateScale(21),
  },
  Title: {
    fontSize: Height * 0.016,
    color: '#49505B',
    fontWeight: '900',
  },
  LocationContainer: {
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(1),
    borderColor: '#E9E9E9',
    marginTop: moderateScale(4),
    padding: moderateScale(8),
    width: '100%',
    height: moderateScale(500),
  },
  LocationInputContainer: {
    marginTop: moderateScale(10),
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(1),
    borderColor: '#E9E9E9',
    padding: moderateScale(8),
  },
  LocationInputMainContainer: {
    gap: moderateScale(8),
    marginTop: moderateScale(6),
  },
  ClearTimeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: moderateScale(80),
    height: moderateScale(35),
    backgroundColor: '#EFEFEF',
    borderRadius: moderateScale(10),
    marginTop: moderateScale(12),
    alignSelf: 'flex-end',
  },
  ClearTimeButtonText: {
    fontSize: Height * 0.02,
    fontWeight: '700',
    color: '#49505B',
  },
  LocationInput: {
    fontWeight: '700',
    fontSize: Height * 0.018,
    color: '#49505B',
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(1),
    borderColor: '#E9E9E9',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(6),
  }
});