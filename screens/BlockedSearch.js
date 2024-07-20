import { StyleSheet, Text, View, Image, TextInput, Pressable, Keyboard, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { moderateScale } from 'react-native-size-matters'
import { Height, Width } from '../utils'
import BlockedAccountCard from '../components/BlockedAccountComponents/BlockedAccountCard'


const BlockedSearch = ({ navigation }) => {

  const inputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    inputRef.current.focus();
  }, [])

  return (
    <View style={styles.SearchAccount}>
      <View style={styles.SearchAccountNav}>
        <Pressable onPress={() => { navigation.goBack() }} style={styles.BackButton}>
          <Image source={require('../assets/Icons/BackButton.png')} style={styles.BackButtonImage} />
        </Pressable>
        <View style={styles.SearchContainer}>
          <Image source={require('../assets/Icons/Search.png')} style={styles.SearchIcon} />
          <TextInput ref={inputRef} style={styles.SearchInput} value={searchQuery} onChangeText={setSearchQuery} placeholder='Search Blocked Accounts' placeholderTextColor={'#C3C3C3'} />
        </View>
      </View>
      <Pressable onPress={Keyboard.dismiss} style={styles.SearchAccountMainContent}>
        <ScrollView contentContainerStyle={styles.SearchCardsContainer}>
          <BlockedAccountCard />
          <BlockedAccountCard />
          <BlockedAccountCard />
        </ScrollView>
      </Pressable>
    </View>
  )
}

export default BlockedSearch;

const styles = StyleSheet.create({
  SearchAccount: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(30),
    backgroundColor: '#fff',
    height: '100%',
  },
  SearchAccountNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
  },
  BackButton: {
    height: moderateScale(30),
    width: moderateScale(30)
  },
  BackButtonImage: {
    height: '100%',
    width: '100%'
  },
  SearchContainer: {
    paddingHorizontal: moderateScale(8),
    paddingVertical: moderateScale(3),
    gap: moderateScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: moderateScale(8),
    width: Width - moderateScale(32) - moderateScale(10) - moderateScale(30)
  },
  SearchIcon: {
    width: moderateScale(18),
    height: moderateScale(18),
  },
  SearchInput: {
    fontSize: Height * 0.019,
    width: '90%',
  },
  SearchAccountMainContent: {
    paddingTop: moderateScale(16),
  },
  SearchCardsContainer: {
    gap: moderateScale(16),
  },
});