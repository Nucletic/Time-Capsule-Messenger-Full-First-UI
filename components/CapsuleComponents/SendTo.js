import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Height, Width } from '../../utils'
import { moderateScale } from 'react-native-size-matters'
import { FIREBASE_DB } from '../../firebaseConfig'
import { getDocs, collection, query, where } from 'firebase/firestore';


const SendTo = ({ recipients, setRecipients }) => {
  const [showSearch, setShowSearch] = useState(false);
  const inputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);


  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef.current]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      const q = query(
        collection(FIREBASE_DB, 'users'),
        where('username', '>=', searchQuery),
        where('username', '<=', searchQuery + '\uf8ff')
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSearchResults(data);
    };

    if (searchQuery.trim() !== '') {
      fetchSearchResults();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);


  const saveUser = (result) => {
    setSearchQuery('');
    setShowSearch(false);
    setRecipients([...recipients, result]);
  }
  
  const removeUser = (index) => {
    const updatedUser = [...recipients];
    updatedUser.splice(index, 1);
    setRecipients(updatedUser);
  }






  return (
    <Pressable onPress={() => { setShowSearch(false) }} style={styles.SendTo}>
      <Text style={styles.SendToTitle}>Send To</Text>
      <View style={styles.SendToContainer}>
        {recipients.map((user, index) => {
          console.log(user)
          return (
            <Pressable key={index} style={styles.SendToRecipient}>
              <Image source={{ uri: user.profileImage }} style={styles.SendToRecipientImage} />
              <Pressable onPress={() => { removeUser(index) }} style={styles.SendToRecipientDeleteView}>
                <Image source={require('../../assets/Icons/DeleteAudio.png')} style={styles.SendToRecipientDeleteIcon} />
              </Pressable>
            </Pressable>
          )
        })}
        <Pressable onPress={() => { setShowSearch(!showSearch) }} style={styles.SendToButton}>
          <Image source={require('../../assets/Icons/SendToAddIcon.png')} style={styles.SendToButtonImage} />
        </Pressable>
      </View>
      {showSearch &&
        <View style={styles.SendToSearchRecipient}>
          <View style={styles.SendToSearchRecipientSearchContainer}>
            <Image source={require('../../assets/Icons/Search.png')} style={styles.SearchContainerIcon} />
            <TextInput ref={inputRef} style={styles.SearchContainerInput} value={searchQuery} onChangeText={setSearchQuery}
              placeholder='Search Recipient' placeholderTextColor={'#C3C3C3'} />
          </View>
          <ScrollView contentContainerStyle={styles.SearchContainerScrollView}>
            {searchResults.map((result, i) => {
              return (
                <SendToSearchCard key={i} onPress={() => { saveUser({ userId: result.userId, profileImage: result.profileImage, username: result.username }) }}
                  profileImage={result.profileImage} username={result.username} />
              )
            })}
          </ScrollView>
        </View>}
    </Pressable>
  )
}

const SendToSearchCard = ({ onPress, username, profileImage }) => {
  return (
    <Pressable onPress={onPress} style={styles.SendToSearchCard}>
      <Image source={{ uri: profileImage }} style={styles.SendToSearchCardImage} />
      <Text style={styles.SendToSearchCardText}>{username && username}</Text>
    </Pressable>
  )
}

export default SendTo

const styles = StyleSheet.create({
  SendTo: {
    marginHorizontal: moderateScale(16),
    marginTop: moderateScale(8),
    marginBottom: moderateScale(21),
  },
  SendToTitle: {
    fontSize: Height * 0.016,
    color: '#49505B',
    fontWeight: '900',
  },
  SendToContainer: {
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(1),
    borderColor: '#E9E9E9',
    marginTop: moderateScale(4),
    alignItems: 'center',
    flexDirection: 'row',
    padding: moderateScale(8),
    gap: moderateScale(6),
  },
  SendToButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFEFEF',
    borderRadius: moderateScale(100),
    height: moderateScale(28),
    width: moderateScale(28),
  },
  SendToButtonImage: {
    height: moderateScale(16),
    width: moderateScale(16),
  },
  SendToRecipient: {
    height: moderateScale(50),
    width: moderateScale(50),
  },
  SendToRecipientImage: {
    height: '100%',
    width: '100%',
    borderRadius: moderateScale(8),
  },
  SendToRecipientDeleteView: {
    position: 'absolute',
    top: '52%',
    left: '52%',
    backgroundColor: '#fff',
    height: moderateScale(20),
    width: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(100),
  },
  SendToRecipientDeleteIcon: {
    height: moderateScale(14),
    width: moderateScale(14),
  },
  SendToSearchRecipient: {
    position: 'absolute',
    top: '110%',
    backgroundColor: '#fff',
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    width: '100%',
    height: moderateScale(360),
    borderWidth: moderateScale(1),
    borderColor: '#E9E9E9',
    shadowColor: "#c9c9c9",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4
  },
  SendToSearchRecipientSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
    backgroundColor: '#F3F4F6',
    paddingHorizontal: moderateScale(6),
    borderRadius: moderateScale(6),
  },
  SearchContainerIcon: {
    height: moderateScale(18),
    width: moderateScale(18),
  },
  SearchContainerInput: {
    fontSize: Height * 0.016,
    color: '#49505B',
    width: '90%',
  },
  SearchContainerScrollView: {
    paddingVertical: moderateScale(16),
    gap: moderateScale(12),
  },
  SendToSearchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(12),
  },
  SendToSearchCardImage: {
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(100),
  },
  SendToSearchCardText: {
    color: '#2F3237',
    fontSize: Height * 0.018,
    fontWeight: '700',
  },
});