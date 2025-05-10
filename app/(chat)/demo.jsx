import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { icons } from '../../constants';
const ChatScreen = () => {
  const { groupId } = useLocalSearchParams(); // Lấy groupId từ URL
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Hàm lấy tin nhắn từ API
  const fetchMessages = async () => {
    if (!groupId) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Lỗi', 'Không tìm thấy token. Vui lòng đăng nhập lại.');
        return;
      }

      const response = await fetch(
        `http://192.168.0.105:8017/api/v1/chat/group/conversation/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessages(data);
      } else {
        Alert.alert('Lỗi', data.message || 'Không thể tải tin nhắn.');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Lỗi', 'Không thể kết nối đến server.');
    } finally {
      setLoading(false);
    }
  };

  // Gửi tin nhắn
// const handleSend = async () => {
//   console.log('handleSend được gọi');
//   if (!input.trim()) {
//     console.log('Dữ liệu không hợp lệ:', { input});
//     return;
//   }

//   try {
//     const token = await AsyncStorage.getItem('token');
//     if (!token) {
//       Alert.alert('Lỗi', 'Không tìm thấy token. Vui lòng đăng nhập lại.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('groupId', groupId);
//     formData.append('content', input);

//     // 📌 Nếu sau này có gửi file:
//     // formData.append('file', {
//     //   uri: fileUri,
//     //   name: 'example.jpg',
//     //   type: 'image/jpeg',
//     // });

//     // 👇 Log từng phần tử FormData (debug đúng cách)
//     for (let pair of formData.entries()) {
//       console.log(`${pair[0]}:`, pair[1]);
//     }

//     const response = await fetch(
//       'http://192.168.0.105:8017/api/v1/chat/group/send',
//       {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           // ❌ KHÔNG thêm 'Content-Type', để RN tự set multipart boundary
//         },
//         body: formData,
//       }
//     );

//     console.log('Response status:', response.status);
//     const data = await response.json();
//     console.log('Response data:', data);

//     if (response.ok) {
//       setMessages((prev) => [...prev, data]);
//       setInput('');
//     } else {
//       Alert.alert('Lỗi', data.message || 'Không thể gửi tin nhắn.');
//     }
//   } catch (error) {
//     console.error('Error sending message:', error);
//     Alert.alert('Lỗi', 'Không thể kết nối đến server.');
//   }
// };


  // Lấy tin nhắn khi component được mount
  useEffect(() => {
    fetchMessages();
  }, [groupId]);

  return (
    <SafeAreaView className="bg-white h-full">
      {/* Header */}
      <View className="flex-row justify-between items-center mx-3 mt-2">
        <Text className="font-semibold text-base flex-1 text-center ml-4">
          Chat
        </Text>
      </View>

      {/* Messages */}
      <ScrollView
        className="flex-1 px-4 space-y-6"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {loading ? (
          <Text className="text-center text-gray-500">Đang tải...</Text>
        ) : messages.length === 0 ? (
          <Text className="text-center text-gray-500">Không có tin nhắn.</Text>
        ) : (
          messages.map((msg) => (
            <View
              key={msg._id}
              className={`flex flex-row space-x-3 ${
                msg.sender._id ? 'justify-end' : ''
              }`}
            >
              {msg.sender._id && (
                <Image
                  source={{ uri: msg.sender.avatar || icons.defaultAvatar }}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <View
                className={`flex-col ${
                  msg.sender._id  ? 'items-end' : ''
                } max-w-xs`}
              >
                <Text
                  className={`text-xs ${
                    msg.sender._id 
                      ? 'text-right text-gray-500'
                      : 'text-gray-900'
                  }`}
                >
                  {msg.content}
                </Text>
                {msg.fileUrl && (
                  <Text className="text-indigo-600 text-xs mt-1">
                    📄 {msg.fileName}
                  </Text>
                )}
              </View>
              {msg.sender._id && (
                <Image
                  source={{ uri: msg.sender.avatar || icons.defaultAvatar }}
                  className="w-10 h-10 rounded-full"
                />
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Message Input */}
      <View className="px-4 py-3 border-t border-gray-200">
        <View className="flex flex-col space-y-2">
          <View className="flex-row items-center border border-gray-300 rounded-md overflow-hidden">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Tin nhắn"
              placeholderTextColor="#9CA3AF"
              className="flex-1 px-2 py-2 text-sm text-gray-700"
            />
            <TouchableOpacity
              // onPress={handleSend}
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
