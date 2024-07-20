import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CapsuleNav from '../components/CapsuleComponents/CapsuleNav'
import SendTo from '../components/CapsuleComponents/SendTo'
import CapsuleName from '../components/CapsuleComponents/CapsuleName'
import SelectTime from '../components/CapsuleComponents/SelectTime'
import AddMedia from '../components/CapsuleComponents/AddMedia'
import SelectLocation from '../components/CapsuleComponents/SelectLocation'

const LocationCapsule = () => {
  return (
    <View style={styles.Container}>
      <CapsuleNav NavIcon={require('../assets/Icons/LocationCapsuleIcon.png')} NavTitle={'Location Capsule'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.SendToView}>
          <SendTo />
        </View>
        <CapsuleName />
        {/* <SelectTime /> */}
        <SelectLocation />
        <AddMedia />
      </ScrollView>
    </View>
  )
}

export default LocationCapsule

const styles = StyleSheet.create({
  Container: {
    backgroundColor: '#fff',
    height: '100%',
  },
  SendToView: {
    zIndex: 1,
  },
});