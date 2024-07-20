import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { Height, Width } from '../../utils'
import { moderateScale } from 'react-native-size-matters'

const CapsuleName = ({ name, setName }) => {

  return (
    <View style={styles.Container}>
      <Text style={styles.Title}>Capsule Name</Text>
      <TextInput style={styles.NameInput} value={name} onChangeText={setName} placeholder='example capsule' placeholderTextColor={'#9095A0'} />
    </View>
  )
}

export default CapsuleName

const styles = StyleSheet.create({
  Container: {
    marginHorizontal: moderateScale(16),
    marginBottom: moderateScale(21),
  },
  Title: {
    fontSize: Height * 0.016,
    color: '#49505B',
    fontWeight: '900',
  },
  NameInput: {
    fontSize: Height * 0.018,
    fontWeight: '700',
    color: '#49505B',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(1),
    borderColor: '#E9E9E9',
    marginTop: moderateScale(4),
  },
});