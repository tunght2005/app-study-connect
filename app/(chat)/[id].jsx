import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '../../components/SearchInput';
import ButtonExtend from '../../components/ButtonExtend';
import { icons } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { io } from 'socket.io-client';

const API_BASE = 'http://192.168.0.105:8017';
const DEFAULT_AVATAR = 'https://storage.googleapis.com/a1aa/image/965786fe-1586-40e3-2b4d-a49bdb7ea933.jpg';

const ChatScreen = () => {
  const { groupId, groupName } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [groupMembers, setGroupMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize Socket.IO
    const newSocket = io(API_BASE, {
      transports: ['websocket'],
      auth: async (cb) => {
        const token = await AsyncStorage.getItem('token');
        cb({ token });
      },
    });
    setSocket(newSocket);

    // Handle connection
    newSocket.on('connect', async () => {
      const userId = await AsyncStorage.getItem('userId');
      newSocket.emit('joinGroup', { groupId, userId });
      newSocket.emit('requestGroupMembers', groupId);
    });

    // Listen for new messages
    newSocket.on('newGroupMessage', async (message) => {
      const userId = await AsyncStorage.getItem('userId');
      const isCurrentUser = String(message.sender._id) === String(userId);
      const formattedMessage = {
        id: message._id,
        user: isCurrentUser ? 'Bạn' : message.sender.username || 'Thành viên khác',
        avatar: isCurrentUser
          ? (currentUser?.avatar ? `${API_BASE}${currentUser.avatar}` : DEFAULT_AVATAR)
          : (message.sender.avatar ? `${API_BASE}${message.sender.avatar}` : DEFAULT_AVATAR),
        time: new Date(message.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        text: message.content,
        image: message.imageUrl ? `${API_BASE}${message.imageUrl}` : null,
        right: isCurrentUser,
      };
      setMessages((prev) => {
        if (!prev.some((msg) => msg.id === formattedMessage.id)) {
          return [...prev, formattedMessage];
        }
        return prev;
      });
    });

    newSocket.on('groupMembersUpdated', (members) => {
      const formattedMembers = members.map((member) => {
        console.log(`Member ID: ${member._id}, Username: ${member.username}, Avatar: ${member.avatar || 'none'}`);
        return {
          id: member._id,
          name: member.username,
          avatar: member.avatar ? `${API_BASE}${member.avatar}` : DEFAULT_AVATAR,
        };
      });
      setGroupMembers(formattedMembers);
    });

    // Cleanup
    return () => {
      newSocket.disconnect();
    };
  }, [groupId, currentUser]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        const res = await fetch(`${API_BASE}/api/v1/chat/user/me`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
        const data = await res.json();
        if (data.success) {
          console.log('Current User:', data.user);
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error('Lỗi tải thông tin người dùng:', error);
      }
    };

    const fetchMessages = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        console.log('userId:', userId);
        const res = await fetch(`${API_BASE}/api/v1/chat/group/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          const formatted = data.messages
            .filter((msg) => msg.sender && msg.sender.username)
            .map((msg) => {
              const isCurrentUser = String(msg.sender._id) === String(userId);
              console.log(
                `Message ID: ${msg._id}, Sender: ${msg.sender._id}, Username: ${msg.sender.username}, Avatar: ${msg.sender.avatar || 'none'}, isCurrentUser: ${isCurrentUser}`
              );
              return {
                id: msg._id,
                user: isCurrentUser ? 'Bạn' : msg.sender.username || 'Thành viên khác',
                avatar: isCurrentUser
                  ? (currentUser?.avatar ? `${API_BASE}${currentUser.avatar}` : DEFAULT_AVATAR)
                  : (msg.sender.avatar ? `${API_BASE}${msg.sender.avatar}` : DEFAULT_AVATAR),
                time: new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                text: msg.content,
                image: msg.imageUrl ? `${API_BASE}${msg.imageUrl}` : null,
                right: isCurrentUser,
              };
            });
          setMessages(formatted.reverse());
        }
      } catch (error) {
        console.error('Lỗi tải tin nhắn:', error);
      }
    };

    const fetchGroupMembers = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/v1/chat/group/${groupId}/members`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          const formattedMembers = data.members.map((member) => {
            console.log(`Member ID: ${member._id}, Username: ${member.username}, Avatar: ${member.avatar || 'none'}`);
            return {
              id: member._id,
              name: member.username,
              avatar: member.avatar ? `${API_BASE}${member.avatar}` : DEFAULT_AVATAR,
            };
          });
          setGroupMembers(formattedMembers);
        }
      } catch (error) {
        console.error('Lỗi tải thành viên nhóm:', error);
      }
    };

    fetchCurrentUser();
    fetchMessages();
    fetchGroupMembers();
  }, [groupId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const messageData = {
        sender: userId,
        groupId,
        content: input,
      };

      // Emit via Socket.IO
      socket.emit('sendGroupMessage', messageData);

      // Also send via HTTP for consistency
      const res = await fetch(`${API_BASE}/api/v1/chat/group`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messageData),
      });

      const data = await res.json();
      if (data.success) {
        setInput('');
      }
    } catch (error) {
      console.error('Lỗi gửi tin nhắn:', error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');

        const formData = new FormData();
        formData.append('sender', userId);
        formData.append('groupId', groupId);
        formData.append('image', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: `image_${Date.now()}.jpg`,
        });

        const res = await fetch(`${API_BASE}/api/v1/chat/group/image`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await res.json();
        if (data.success) {
          // Socket.IO will handle the update
        } else {
          console.error('Lỗi từ server:', data.message);
        }
      } catch (error) {
        console.error('Lỗi gửi ảnh:', error);
      }
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      {/* Header */}
      <View className="flex-row justify-between items-center mx-3 mt-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="font-semibold text-xl flex-1 text-center ml-4">{groupName || "Chat Nhóm"}</Text>
        <ButtonExtend />
      </View>

      {/* Search */}
      <View className="relative mx-3">
        <SearchInput />
      </View>

      {/* Group Members */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="max-h-[60px] px-4 pb-2 mt-4 mb-4 border-b"
      >
        {groupMembers.map((user) => (
          <View key={user.id} className="items-center mr-4">
            <View className="relative">
              <Image source={{ uri: user.avatar }} className="w-10 h-10 rounded-full" />
              <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white" />
            </View>
            <Text className="text-xs mt-1 text-gray-700">{user.name}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Messages */}
      <ScrollView
        className="flex-1 px-4 space-y-6"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            className={`flex-row items-start space-x-2 ${msg.right ? 'justify-end' : 'justify-start'}`}
          >
            {!msg.right && (
              <Image source={{ uri: msg.avatar }} className="w-10 h-10 rounded-full mt-1" />
            )}
            <View className={`flex-col ${msg.right ? 'items-end' : 'items-start'} max-w-[70%]`}>
              <View className="flex-row items-center w-full">
                {msg.right ? (
                  <>
                    <Text className="text-xs text-gray-500 mr-2">{msg.time}</Text>
                    <Text className="font-semibold text-sm text-gray-900">{msg.user}</Text>
                  </>
                ) : (
                  <>
                    <Text className="font-semibold text-sm text-gray-900">{msg.user}</Text>
                    <Text className="text-xs text-gray-500 ml-2">{msg.time}</Text>
                  </>
                )}
              </View>
              {msg.text && (
                <View
                  className={`mt-1 p-2 rounded-lg ${
                    msg.right ? 'bg-indigo-100 text-right' : 'bg-gray-100 text-left'
                  }`}
                >
                  <Text className="text-sm text-gray-800">{msg.text}</Text>
                </View>
              )}
              {msg.image && (
                <Image source={{ uri: msg.image }} className="w-40 h-40 mt-1 rounded-md" />
              )}
            </View>
            {msg.right && (
              <Image source={{ uri: msg.avatar }} className="w-10 h-10 rounded-full mt-1" />
            )}
          </View>
        ))}
      </ScrollView>

      {/* Message Input */}
      <View className="px-4 py-3 border-t border-gray-200">
        <View className="flex flex-col space-y-2">
          <View className="flex-row items-center border border-gray-300 rounded-md overflow-hidden">
            <TouchableOpacity onPress={pickImage} className="flex-row justify-center items-center">
              <Image
                source={icons.upload}
                className="max-w-[30px] max-h-[30px] ml-0.75 border-r px-2"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Tin nhắn"
              placeholderTextColor="#9CA3AF"
              className="flex-1 px-2 py-2 text-sm text-gray-700"
            />
            <TouchableOpacity
              onPress={handleSend}
              className="bg-indigo-500 px-4 py-2 rounded-r-md"
            >
              <Text className="text-white text-sm font-semibold">Gửi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;