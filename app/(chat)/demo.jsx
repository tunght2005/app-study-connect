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

const API_BASE = 'http://192.168.0.105:8017/api/v1/chat';

const ChatScreen = () => {
  const { groupId } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        console.log('userId:', userId);
        const res = await fetch(`${API_BASE}/group/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          const formatted = data.messages
            .filter((msg) => msg.sender && msg.sender.username) // Skip messages with invalid sender
            .map((msg) => {
              const isCurrentUser = String(msg.sender._id) === String(userId);
              console.log(
                `Message ID: ${msg._id}, Sender: ${msg.sender._id}, Username: ${msg.sender.username}, isCurrentUser: ${isCurrentUser}`
              );
              return {
                id: msg._id,
                user: isCurrentUser ? 'Bạn' : msg.sender.username || 'Thành viên khác',
                avatar: isCurrentUser
                  ? 'https://storage.googleapis.com/a1aa/image/5f8435b9-10c5-4df1-d418-48aab78a9fc5.jpg'
                  : 'https://storage.googleapis.com/a1aa/image/965786fe-1586-40e3-2b4d-a49bdb7ea933.jpg',
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

    fetchMessages();
  }, [groupId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      const res = await fetch(`${API_BASE}/group`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender: userId,
          groupId,
          content: input,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const time = new Date(data.data.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        const newMsg = {
          id: data.data._id,
          user: 'Bạn',
          avatar: 'https://storage.googleapis.com/a1aa/image/5f8435b9-10c5-4df1-d418-48aab78a9fc5.jpg',
          time,
          text: input,
          right: true,
        };
        setMessages((prev) => [...prev, newMsg]);
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
          name: ` referencing previous discussions about StudyConnect and chat functionalityimage_${Date.now()}.jpg`,
        });

        const res = await fetch(`${API_BASE}/group/image`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await res.json();
        if (data.success) {
          const time = new Date(data.data.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          const imageMsg = {
            id: data.data._id,
            user: 'Bạn',
            avatar: 'https://storage.googleapis.com/a1aa/image/5f8435b9-10c5-4df1-d418-48aab78a9fc5.jpg',
            time,
            image: `${API_BASE}${data.data.imageUrl}`,
            right: true,
          };
          setMessages((prev) => [...prev, imageMsg]);
        } else {
          console.error('Lỗi từ server:', data.message);
        }
      } catch (error) {
        console.error('Lỗi gửi ảnh:', error);
      }
    }
  };

  const onlineUsers = [
    {
      id: 1,
      name: 'Alice',
      avatar: 'https://storage.googleapis.com/a1aa/image/d43a33a7-8e4a-4328-bc7e-4c145dc22eb6.jpg',
    },
    {
      id: 2,
      name: 'James',
      avatar: 'https://storage.googleapis.com/a1aa/image/6d689c86-5534-4923-d439-1c24c319a3c7.jpg',
    },
    {
      id: 3,
      name: 'Sophia',
      avatar: 'https://storage.googleapis.com/a1aa/image/965786fe-1586-40e3-2b4d-a49bdb7ea933.jpg',
    },
  ];

  return (
    <SafeAreaView className="bg-white h-full">
      {/* Header */}
      <View className="flex-row justify-between items-center mx-3 mt-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="font-semibold text-base flex-1 text-center ml-4">Chat Nhóm</Text>
        <ButtonExtend />
      </View>

      {/* Search */}
      <View className="relative mx-3">
        <SearchInput />
      </View>

      {/* Online Users */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="max-h-[60px] px-4 pb-2 mt-4 mb-4 border-b"
      >
        {onlineUsers.map((user) => (
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