import { Image, ScrollView, StyleSheet, Pressable, Text, View } from 'react-native'
import React from 'react'
import CapsuleNav from '../components/CapsuleComponents/CapsuleNav'
import { Height, Width } from '../utils'
import { moderateScale } from 'react-native-size-matters'

const OpenedCapsule = () => {
  return (
    <View style={styles.Container}>
      <CapsuleNav NavTitle={'To My Once'} NavIcon={require('../assets/Icons/CronoLocCapsuleIcon.png')} />
      <ScrollView style={styles.ScrollViewContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.FromView}>
          <Text style={styles.SectionTitle}>From</Text>
          <View style={styles.FromMainView}>
            <Image source={require('../assets/Images/peterparker.jpg')} style={styles.FromImage} />
            <View style={styles.FromInfoView}>
              <Text style={styles.FromName}>Peter Parker</Text>
              <Text style={styles.FromTime}>Created For You to Open At 30 April 2024 07:43 AM</Text>
              <Text style={styles.FromLocation}>Latitude: 40.7128° N, Longitude: -74.0060° W</Text>
            </View>
          </View>
        </View>
        <View style={styles.NameView}>
          <Text style={styles.SectionTitle}>Name</Text>
          <Text style={styles.nameText}>Created For You to Open At 30 April 2024 07:43 AM</Text>
        </View>
        <View style={styles.MediaView}>
          <Text style={styles.SectionTitle}>Media</Text>
          <View style={styles.AddMediaContentContainer}>
            <View style={styles.MediaList}>
              <Pressable style={styles.MediaButton}>
                <Image source={require('../assets/Images/user3.jpg')} style={styles.MediaImage} />
              </Pressable>
            </View>
          </View>
        </View>
        <View style={styles.MessagesView}>
          <Text style={styles.SectionTitle}>Messages</Text>
          <ScrollView style={styles.MainMessagesContainer}>

          </ScrollView>
        </View>
      </ScrollView>
    </View>
  )
}

export default OpenedCapsule

const styles = StyleSheet.create({
  Container: {
    backgroundColor: '#fff',
    height: '100%',
  },
  ScrollViewContainer: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(10),
  },
  FromMainView: {
    marginTop: moderateScale(3),
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(6),
  },
  FromImage: {
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(8),
  },
  FromName: {
    fontSize: Height * 0.016,
    color: '#49505B',
    fontWeight: '900',
  },
  FromTime: {
    fontSize: Height * 0.016,
    color: '#49505B',
  },
  FromLocation: {
    fontSize: Height * 0.016,
    color: '#49505B',
  },
  NameView: {
    marginTop: moderateScale(24),
  },
  nameText: {
    fontSize: Height * 0.017,
    color: '#49505B',
  },
  SectionTitle: {
    fontSize: Height * 0.016,
    color: '#49505B',
    fontWeight: '900',
  },
  MediaView: {
    marginTop: moderateScale(24),
  },
  MediaList: {
    gap: moderateScale(8),
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(8),
  },
  AddMediaContentContainer: {
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(1),
    borderColor: '#E9E9E9',
    marginTop: moderateScale(4),
    paddingVertical: moderateScale(8),
    gap: moderateScale(12),
  },
  MediaImage: {
    height: moderateScale(75),
    width: moderateScale(75),
    borderRadius: moderateScale(12),
  },
  SendToRecipientDeleteView: {
    position: 'absolute',
    top: '60%',
    left: '60%',
    backgroundColor: '#fff',
    height: moderateScale(24),
    width: moderateScale(24),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(100),
  },
  SendToRecipientDeleteIcon: {
    height: moderateScale(18),
    width: moderateScale(18),
  },
  MessagesView: {
    marginTop: moderateScale(24),
    marginBottom: moderateScale(40),
  },
  MainMessagesContainer: {
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(1),
    borderColor: '#E9E9E9',
    marginTop: moderateScale(4),
    paddingVertical: moderateScale(8),
    gap: moderateScale(12),
    height: Height * 0.5,
  },
});