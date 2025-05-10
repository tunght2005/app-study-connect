import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '../../components/SearchInput';
import ButtonExtend from '../../components/ButtonExtend';
import { icons } from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { router } from "expo-router";


const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    const newMessage = {
      id: Date.now(),
      user: 'Emily Davis',
      avatar: 'https://storage.googleapis.com/a1aa/image/5f8435b9-10c5-4df1-d418-48aab78a9fc5.jpg',
      time,
      text: input,
      right: true,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
      const imageMsg = {
        id: Date.now(),
        user: 'Emily Davis',
        avatar: 'https://storage.googleapis.com/a1aa/image/5f8435b9-10c5-4df1-d418-48aab78a9fc5.jpg',
        time,
        image: result.assets[0].uri,
        right: true,
      };
      setMessages((prev) => [...prev, imageMsg]);
    }
  };

  const onlineUsers = [
    { id: 1, name: 'Alice', avatar: 'https://storage.googleapis.com/a1aa/image/d43a33a7-8e4a-4328-bc7e-4c145dc22eb6.jpg' },
    { id: 2, name: 'James', avatar: 'https://storage.googleapis.com/a1aa/image/6d689c86-5534-4923-d439-1c24c319a3c7.jpg' },
    { id: 3, name: 'Sophia', avatar: 'https://storage.googleapis.com/a1aa/image/965786fe-1586-40e3-2b4d-a49bdb7ea933.jpg' },
  ];

  return (
     <SafeAreaView className="bg-white h-full">
      {/* Header */}
      <View className="flex-row justify-between items-center mx-3 mt-2">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="font-semibold text-base flex-1 text-center ml-4">Chat</Text>
        <ButtonExtend/>
      </View>

      {/* Search */}
      <View className="relative mx-3">
        <SearchInput/>
      </View>

      {/* Online Users */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="max-h-[60px] px-4 pb-2 mt-4 mb-4 border-b">
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
      <ScrollView className="flex-1 px-4 space-y-6" contentContainerStyle={{ paddingBottom: 20 }}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            className={`flex flex-row space-x-3 ${msg.right ? 'justify-end' : ''}`}
          >
            {!msg.right && (
              <Image source={{ uri: msg.avatar }} className="w-10 h-10 rounded-full" />
            )}
            <View className={`flex-col ${msg.right ? 'items-end' : ''} max-w-xs`}>
              <View className="flex-row justify-between items-center w-full">
                {msg.right ? (
                  <>
                    <Text className="text-xs text-gray-500 mr-2">{msg.time}</Text>
                    <Text className="font-semibold text-sm text-gray-900">{msg.user}</Text>
                  </>
                ) : (
                  <>
                    <Text className="font-semibold text-sm text-gray-900">{msg.user}</Text>
                    <Text className="text-xs text-gray-500 mr-2">{msg.time}</Text>
                  </>
                )}
              </View>
              {msg.text && <Text className={`text-xs text-gray-600 ${msg.right ? 'text-right' : ''}`}>{msg.text}</Text>}
              {msg.image && <Image source={{ uri: msg.image }} className="w-40 h-40 mt-1 rounded-md" />}
              {msg.file && <Text className="text-indigo-600 text-xs mt-1">📄 {msg.file}</Text>}
            </View>
            {msg.right && (
              <Image source={{ uri: msg.avatar }} className="w-10 h-10 rounded-full" />
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
            <TouchableOpacity onPress={handleSend} className="bg-indigo-500 px-4 py-2 rounded-r-md">
              <Text className="text-white text-sm font-semibold">Gửi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;