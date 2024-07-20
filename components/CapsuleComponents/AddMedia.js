import { StyleSheet, Text, View, Image, Pressable, FlatList } from 'react-native'
import React, { useState } from 'react'
import { Height, Width } from '../../utils'
import { moderateScale } from 'react-native-size-matters'
import * as ImagePicker from 'expo-image-picker';

const AddMedia = ({ media, setMedia }) => {

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setMedia([...media, result.assets[0].uri]);
      }
    }
  }

  const removeImage = (index) => {
    const updatedMedia = [...media];
    updatedMedia.splice(index, 1);
    setMedia(updatedMedia);
  }


  return (
    <View style={styles.Container}>
      <Text style={styles.Title}>Add Media</Text>
      <View style={styles.AddMediaContentContainer}>
        {media.length > 0 &&
          (<FlatList horizontal showsHorizontalScrollIndicator={false} data={media} contentContainerStyle={styles.MediaList}
            renderItem={(({ item, index }) => {
              return (
                <Pressable key={index} onPress={() => { removeImage(index) }} style={styles.MediaButton}>
                  <Image source={{ uri: item }} style={styles.MediaImage} />
                  <View style={styles.SendToRecipientDeleteView}>
                    <Image source={require('../../assets/Icons/DeleteAudio.png')} style={styles.SendToRecipientDeleteIcon} />
                  </View>
                </Pressable>
              )
            })} />)}
        <Pressable onPress={pickImage} style={styles.AddMediaButton}>
          <Image source={require('../../assets/Icons/SendToAddIcon.png')} style={styles.AddMediaButtonIcon} />
        </Pressable>
      </View>
    </View>
  )
}

export default AddMedia

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
  AddMediaContentContainer: {
    borderRadius: moderateScale(20),
    borderWidth: moderateScale(1),
    borderColor: '#E9E9E9',
    marginTop: moderateScale(4),
    paddingVertical: moderateScale(12),
    gap: moderateScale(12),
  },
  AddMediaButton: {
    height: moderateScale(45),
    width: moderateScale(45),
    backgroundColor: '#EFEFEF',
    borderRadius: moderateScale(100),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: moderateScale(12),
  },
  AddMediaButtonIcon: {
    height: moderateScale(24),
    width: moderateScale(24),
  },
  MediaImage: {
    height: moderateScale(80),
    width: moderateScale(80),
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
  MediaList: {
    gap: moderateScale(8),
    borderRadius: moderateScale(20),
    paddingHorizontal: moderateScale(12),
  }
});