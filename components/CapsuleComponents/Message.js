import { Pressable, StyleSheet, Text, View, Image, TextInput, ScrollView, Animated } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { moderateScale } from 'react-native-size-matters'
import { Height, Width } from '../../utils'
import { Audio } from 'expo-av'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Timestamp } from 'firebase/firestore'



const Message = ({ messages, setMessages }) => {

  const [messageText, setMessageText] = useState('');
  const [CustomUUID, setCustomUUID] = useState(null);

  AsyncStorage.getItem('CustomUUID').then((CustomUUID) => {
    setCustomUUID(CustomUUID);
  });


  const SaveMessages = async () => {

    let attachments = [];

    const newMessage = {
      content: messageText,
      senderId: CustomUUID,
      timestamp: Timestamp.now(),
      soundLevels: [],
      audioDuration: '00:00',
      readStatus: 'unread',
      messageType: 'text',
      metadata: {
        attachments: attachments,
        reactions: [],
      }
    };
    setMessages([...messages, newMessage]);
    setMessageText('');
  }



  return (
    <View style={styles.Container}>
      <Text style={styles.Title}>Messages</Text>
      <View style={styles.AddMediaContentContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.messagesScrollView}>
          {messages?.map((message, i) => {
            if (message.senderId === CustomUUID) {
              return (
                <React.Fragment key={i}>
                  {(message.content.length > 0) &&
                    (
                      <View style={[styles.ReciverContent, messages[i - 1]?.senderId !== CustomUUID && { marginTop: moderateScale(8) }]}>
                        <View style={styles.ReciverMessage}>
                          <Text style={styles.ReciverMessageText}>
                            {message.content}
                          </Text>
                        </View>
                      </View>
                    )}
                </React.Fragment>
              )
            } else {
              return (
                <React.Fragment key={i}>
                  {(message.content.length > 0) &&
                    (<View style={[styles.SenderContent, messages[i - 1]?.senderId === CustomUUID && { marginTop: moderateScale(8) }]}>
                      <View style={styles.SenderView}>
                        {messages[i - 1]?.senderId !== CustomUUID ? <View style={styles.SenderProfileImage} />
                          : <Image source={{ uri: profileImage }} style={styles.SenderProfileImage} />}
                        <View style={styles.SenderMessage}>
                          <Text style={styles.SenderMessageText}>
                            {message.content}
                          </Text>
                        </View>
                      </View>
                    </View>)}

                </React.Fragment>
              )
            }
          })}
        </ScrollView>
        <View style={styles.ChatBoxInputView}>
          <View style={styles.ChatBoxBottomOptions}>
            <View style={styles.MessageInputView}>
              <TextInput placeholder='Message...' value={messageText} onChangeText={setMessageText} placeholderTextColor={'#C3C3C3'} style={styles.MessageInput} />
            </View>
            <Pressable onPress={() => { SaveMessages() }} style={styles.SendMessageButton}>
              <Image source={require('../../assets/Icons/SendMessage.png')} style={styles.SendMessageButtonImage} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Message

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
  ChatBoxBottomOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(10),
  },
  MessageBoxButton: {
    height: moderateScale(20),
    width: moderateScale(20),
  },
  MessageBoxButtonImage: {
    height: '100%',
    width: '100%',
  },
  MessageInputView: {
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: moderateScale(35),
    borderRadius: moderateScale(6),
    paddingHorizontal: moderateScale(12),
    width: '82%',
  },
  MessageInput: {
    fontSize: Height * 0.018,
    width: '90%',
    color: '#49505B',
  },
  SendMessageButton: {
    height: moderateScale(24),
    width: moderateScale(24),
  },
  SendMessageButtonImage: {
    height: '100%',
    width: '100%',
  },
  ChatBoxRecordingOptions: {
    backgroundColor: '#3797F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(2),
    position: 'absolute',
    width: Width - moderateScale(56),
    height: moderateScale(35),
    left: moderateScale(10),
    borderRadius: moderateScale(50),
  },
  RecordingDeleteButton: {
    height: moderateScale(30),
    width: moderateScale(30),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(50),
    backgroundColor: '#fff',
  },
  RecordingDeleteButtonImage: {
    height: moderateScale(20),
    width: moderateScale(20),
  },
  RecordingDurationText: {
    fontSize: Height * 0.016,
    color: '#fff',
    fontWeight: '600',
    left: moderateScale(-10),
  },
  AttachmentContainer: {
    backgroundColor: '#fff',
    height: moderateScale(80),
    marginBottom: moderateScale(16),
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(12),
  },
  DeleteImageButton: {
    height: moderateScale(80),
    width: moderateScale(80),
  },
  AttachmentImage: {
    height: '100%',
    width: '100%',
    borderRadius: moderateScale(10),
  },
  DeleteImageButtonImage: {
    height: moderateScale(14),
    width: moderateScale(14),
  },
  DeleteImageButtonMain: {
    height: moderateScale(22),
    width: moderateScale(22),
    borderRadius: moderateScale(100),
    backgroundColor: '#fff',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: '64%',
    top: '64%',
  },
  AttachMoreImagesButton: {
    height: moderateScale(45),
    width: moderateScale(45),
    borderRadius: moderateScale(100),
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  AttachMoreImagesButtonIcon: {
    height: moderateScale(26),
    width: moderateScale(26),
  },
  SoundBarsView: {
    width: moderateScale(250),
    height: moderateScale(35),
    gap: moderateScale(2),
    marginHorizontal: moderateScale(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    backgroundColor: '#fff',
    width: moderateScale(4),
    borderRadius: moderateScale(4),
  },
  ChatBoxInputView: {
    alignItems: 'center',
  },
  messagesScrollView: {
    height: Height / 2,
    paddingHorizontal: moderateScale(12),
  },
  SenderContent: {
    marginVertical: moderateScale(1),
    gap: moderateScale(1.2),
  },
  SenderView: {
    maxWidth: '50%',
    flexDirection: 'row',
    gap: moderateScale(6),
  },
  SenderMessage: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(10),
  },
  SenderMessageText: {
    color: '#49505B',
    fontWeight: '500',
    fontSize: Height * 0.016,
    lineHeight: moderateScale(Height * 0.019),
  },
  SenderProfileImage: {
    height: moderateScale(25),
    width: moderateScale(25),
    borderRadius: moderateScale(50),
  },













  SenderAudioView: {
    height: moderateScale(40),
    maxWidth: Width * 0.48,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: moderateScale(8),
  },
  senderAudioPlayImage: {
    height: moderateScale(20),
    width: moderateScale(20),
  },
  SenderAudioLevelsView: {
    maxWidth: Width * 0.30,
    // flexDirection: 'row',
    height: moderateScale(30),
    gap: moderateScale(3),
  },
  SenderAudioTimingText: {
    fontWeight: '600',
    fontSize: Height * 0.016,
  },
  ReciverContent: {
    marginVertical: moderateScale(1),
    maxWidth: '55%',
    alignSelf: 'flex-end',
    gap: moderateScale(1.2),
  },
  ChatImageButton: {
    width: '100%',
    height: moderateScale(200),
  },
  ChatImage: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(10),
  },
  ReciverMessage: {
    backgroundColor: '#3797F0',
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(10),
  },
  ReciverMessageText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: Height * 0.016,
    lineHeight: moderateScale(Height * 0.019),
  },
});