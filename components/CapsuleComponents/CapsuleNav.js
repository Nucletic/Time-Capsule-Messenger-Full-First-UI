import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { Height, Width } from '../../utils'
import { moderateScale } from 'react-native-size-matters'

const CapsuleNav = ({ onPress, NavTitle, NavIcon }) => {
  return (
    <View style={styles.Container}>
      <View style={styles.ContainerLeft}>
        <Pressable style={styles.BackButton}>
          <Image source={require('../../assets/Icons/BackButton.png')} style={styles.BackButtonImage} />
        </Pressable>
        <View style={styles.TitleView}>
          <Image source={NavIcon && NavIcon} style={styles.TitleIcon} />
          <Text style={styles.TitleText}>{NavTitle && NavTitle}</Text>
        </View>
      </View>
      {onPress &&
        <Pressable onPress={onPress} style={styles.CreateButton}>
          <Text style={styles.CreateButtonText}>Create</Text>
        </Pressable>}
    </View>
  )
}

export default CapsuleNav

const styles = StyleSheet.create({
  Container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(30),
    paddingBottom: moderateScale(10),
    borderBottomWidth: moderateScale(1),
    borderBottomColor: '#F8F9FA',
    backgroundColor: '#fff',
  },
  ContainerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
  },
  TitleView: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: moderateScale(6),
  },
  TitleIcon: {
    height: moderateScale(30),
    width: moderateScale(32),
  },
  TitleText: {
    fontSize: Height * 0.026,
    color: '#49505B',
    fontWeight: '900',
  },
  BackButton: {
    height: moderateScale(30),
    width: moderateScale(30),
  },
  BackButtonImage: {
    height: '100%',
    width: '100%'
  },
  CreateButtonText: {
    fontSize: Height * 0.018,
    fontWeight: '600',
    color: '#F7706E',
  },
});