// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Image,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useLocalSearchParams, router } from 'expo-router';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { icons } from '../../constants';

// const API_BASE = 'http://192.168.0.105:8017/api/v1/chat';

// const ChatFriend = () => {
//   const { friendId } = useLocalSearchParams();
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [friendName, setFriendName] = useState('Bạn bè');

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         const userId = await AsyncStorage.getItem('userId');
//         if (!token || !userId) {
//           console.error('Không tìm thấy token hoặc userId');
//           return;
//         }

//         const res = await fetch(`${API_BASE}/friend/${friendId}?userId=${userId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await res.json();
//         if (data.success) {
//           const formatted = data.messages
//             .filter((msg) => msg.sender && msg.sender.username)
//             .map((msg) => {
//               const isCurrentUser = String(msg.sender._id) === String(userId);
//               if (!isCurrentUser && msg.sender.username) {
//                 setFriendName(msg.sender.username);
//               }
//               return {
//                 id: msg._id,
//                 user: isCurrentUser ? 'Bạn' : msg.sender.username || 'Người khác',
//                 avatar: isCurrentUser
//                   ? 'https://storage.googleapis.com/a1aa/image/5f8435b9-10c5-4df1-d418-48aab78a9fc5.jpg'
//                   : 'https://storage.googleapis.com/a1aa/image/965786fe-1586-40e3-2b4d-a49bdb7ea933.jpg',
//                 time: new Date(msg.timestamp).toLocaleTimeString([], {
//                   hour: '2-digit',
//                   minute: '2-digit',
//                 }),
//                 text: msg.content,
//                 image: msg.imageUrl ? `${API_BASE}${msg.imageUrl}` : null,
//                 right: isCurrentUser,
//               };
//             });
//           setMessages(formatted.reverse());
//         } else {
//           console.error('Lỗi API:', data.message);
//         }
//       } catch (error) {
//         console.error('Lỗi tải tin nhắn:', error);
//       }
//     };

//     fetchMessages();
//   }, [friendId]);

//   const handleSend = async () => {
//     if (!input.trim()) return;
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const userId = await AsyncStorage.getItem('userId');
//       if (!token || !userId) {
//         console.error('Không tìm thấy token hoặc userId');
//         return;
//       }

//       const res = await fetch(`${API_BASE}/friend`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           sender: userId,
//           recipient: friendId,
//           content: input,
//         }),
//       });

//       const data = await res.json();
//       if (data.success) {
//         const time = new Date(data.data.timestamp).toLocaleTimeString([], {
//           hour: '2-digit',
//           minute: '2-digit',
//         });
//         const newMsg = {
//           id: data.data._id,
//           user: 'Bạn',
//           avatar: 'https://storage.googleapis.com/a1aa/image/5f8435b9-10c5-4df1-d418-48aab78a9fc5.jpg',
//           time,
//           text: input,
//           right: true,
//         };
//         setMessages((prev) => [...prev, newMsg]);
//         setInput('');
//       } else {
//         console.error('Lỗi gửi tin nhắn:', data.message);
//       }
//     } catch (error) {
//       console.error('Lỗi gửi tin nhắn:', error);
//     }
//   };

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         const userId = await AsyncStorage.getItem('userId');
//         if (!token || !userId) {
//           console.error('Không tìm thấy token hoặc userId');
//           return;
//         }

//         const formData = new FormData();
//         formData.append('sender', userId);
//         formData.append('recipient', friendId);
//         formData.append('image', {
//           uri: result.assets[0].uri,
//           type: 'image/jpeg',
//           name: `image_${Date.now()}.jpg`,
//         });

//         const res = await fetch(`${API_BASE}/friend/image`, {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: formData,
//         });

//         const data = await res.json();
//         if (data.success) {
//           const time = new Date(data.data.timestamp).toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//           });
//           const imageMsg = {
//             id: data.data._id,
//             user: 'Bạn',
//             avatar: 'https://storage.googleapis.com/a1aa/image/5f8435b9-10c5-4df1-d418-48aab78a9fc5.jpg',
//             time,
//             image: `${API_BASE}${data.data.imageUrl}`,
//             right: true,
//           };
//           setMessages((prev) => [...prev, imageMsg]);
//         } else {
//           console.error('Lỗi từ server:', data.message);
//         }
//       } catch (error) {
//         console.error('Lỗi gửi ảnh:', error);
//       }
//     }
//   };

//   const handleDelete = async (messageId) => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const userId = await AsyncStorage.getItem('userId');
//       if (!token || !userId) {
//         console.error('Không tìm thấy token hoặc userId');
//         return;
//       }

//       const res = await fetch(`${API_BASE}/friend/${messageId}`, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       if (data.success) {
//         setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
//         console.log('Xóa tin nhắn thành công:', messageId);
//       } else {
//         console.error('Lỗi xóa tin nhắn:', data.message);
//       }
//     } catch (error) {
//       console.error('Lỗi xóa tin nhắn:', error);
//     }
//   };

//   return (
//     <SafeAreaView className="bg-white h-full">
//       {/* Header */}
//       <View className="flex-row justify-between items-center mx-3 mt-2">
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text className="font-semibold text-base flex-1 text-center ml-4">
//           Chat với {friendName}
//         </Text>
//         <TouchableOpacity>
//           <Ionicons name="ellipsis-horizontal" size={24} color="black" />
//         </TouchableOpacity>
//       </View>

//       {/* Messages */}
//       <ScrollView
//         className="flex-1 px-4 space-y-6"
//         contentContainerStyle={{ paddingBottom: 20 }}
//       >
//         {messages.map((msg) => (
//           <View
//             key={msg.id}
//             className={`flex-row items-start space-x-2 ${msg.right ? 'justify-end' : 'justify-start'}`}
//           >
//             {!msg.right && (
//               <Image source={{ uri: msg.avatar }} className="w-10 h-10 rounded-full mt-1" />
//             )}
//             <View className={`flex-col ${msg.right ? 'items-end' : 'items-start'} max-w-[70%]`}>
//               <View className="flex-row items-center w-full">
//                 {msg.right ? (
//                   <>
//                     <Text className="text-xs text-gray-500 mr-2">{msg.time}</Text>
//                     <Text className="font-semibold text-sm text-gray-900">{msg.user}</Text>
//                   </>
//                 ) : (
//                   <>
//                     <Text className="font-semibold text-sm text-gray-900">{msg.user}</Text>
//                     <Text className="text-xs text-gray-500 ml-2">{msg.time}</Text>
//                   </>
//                 )}
//               </View>
//               <View className="flex-row items-center">
//                 {msg.text && (
//                   <View
//                     className={`mt-1 p-2 rounded-lg ${
//                       msg.right ? 'bg-indigo-100 text-right' : 'bg-gray-100 text-left'
//                     }`}
//                   >
//                     <Text className="text-sm text-gray-800">{msg.text}</Text>
//                   </View>
//                 )}
//                 {msg.image && (
//                   <Image source={{ uri: msg.image }} className="w-40 h-40 mt-1 rounded-md" />
//                 )}
//                 {msg.right && (
//                   <TouchableOpacity
//                     onPress={() => handleDelete(msg.id)}
//                     className="ml-2 p-1"
//                   >
//                     <Ionicons name="trash-outline" size={20} color="red" />
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </View>
//             {msg.right && (
//               <Image source={{ uri: msg.avatar }} className="w-10 h-10 rounded-full mt-1" />
//             )}
//           </View>
//         ))}
//       </ScrollView>

//       {/* Message Input */}
//       <View className="px-4 py-3 border-t border-gray-200">
//         <View className="flex flex-col space-y-2">
//           <View className="flex-row items-center border border-gray-300 rounded-md overflow-hidden">
//             <TouchableOpacity onPress={pickImage} className="flex-row justify-center items-center">
//               <Image
//                 source={icons.upload}
//                 className="max-w-[30px] max-h-[30px] ml-0.75 border-r px-2"
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//             <TextInput
//               value={input}
//               onChangeText={setInput}
//               placeholder="Tin nhắn"
//               placeholderTextColor="#9CA3AF"
//               className="flex-1 px-2 py-2 text-sm text-gray-700"
//             />
//             <TouchableOpacity
//               onPress={handleSend}
//               className="bg-indigo-500 px-4 py-2 rounded-r-md"
//             >
//               <Text className="text-white text-sm font-semibold">Gửi</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default ChatFriend;
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   Alert,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useLocalSearchParams, router } from 'expo-router';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { icons } from '../../constants';

// const API_BASE = 'http://192.168.0.105:8017/api/v1/chat';

// const ChatFriend = () => {
//   const { friendId } = useLocalSearchParams();
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [friendName, setFriendName] = useState('Bạn bè');

//   const fetchMessages = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const userId = await AsyncStorage.getItem('userId');
//       console.log('Token:', token);
//       console.log('UserId:', userId);
//       if (!token || !userId) {
//         console.error('Không tìm thấy token hoặc userId');
//         return;
//       }

//       const res = await fetch(`${API_BASE}/friend/${friendId}?userId=${userId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       console.log('Phản hồi GET /friend:', data);
//       if (data.success) {
//         const formatted = data.messages
//           .filter((msg) => msg.sender && msg.sender._id)
//           .map((msg) => {
//             const isCurrentUser = String(msg.sender._id) === String(userId);
//             console.log(
//               `Message ID: ${msg._id}, Sender: ${msg.sender._id}, Username: ${msg.sender.username || 'Không có username'}, isCurrentUser: ${isCurrentUser}`
//             );
//             if (!isCurrentUser && msg.sender.username) {
//               setFriendName(msg.sender.username);
//             }
//             return {
//               id: msg._id,
//               user: isCurrentUser ? 'Bạn' : msg.sender.username || 'Người khác',
//               avatar: isCurrentUser
//                 ? 'https://storage.googleapis.com/a1aa/image/5f8435b9-10c5-4df1-d418-48aab78a9fc5.jpg'
//                 : 'https://storage.googleapis.com/a1aa/image/965786fe-1586-40e3-2b4d-a49bdb7ea933.jpg',
//               time: new Date(msg.timestamp).toLocaleTimeString([], {
//                 hour: '2-digit',
//                 minute: '2-digit',
//               }),
//               text: msg.content,
//               image: msg.imageUrl ? `${API_BASE}${msg.imageUrl}` : null,
//               right: isCurrentUser,
//             };
//           });
//         console.log('Danh sách tin nhắn đã định dạng:', formatted);
//         setMessages(formatted.reverse());
//       } else {
//         console.error('Lỗi API:', data.message);
//         Alert.alert('Lỗi', data.message || 'Không thể tải tin nhắn');
//       }
//     } catch (error) {
//       console.error('Lỗi tải tin nhắn:', error);
//       Alert.alert('Lỗi', 'Kết nối server thất bại');
//     }
//   };

//   useEffect(() => {
//     fetchMessages();
//   }, [friendId]);

//   const handleSend = async () => {
//     if (!input.trim()) return;
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const userId = await AsyncStorage.getItem('userId');
//       console.log('Gửi tin nhắn:', { sender: userId, recipient: friendId, content: input });
//       if (!token || !userId) {
//         console.error('Không tìm thấy token hoặc userId');
//         return;
//       }

//       const res = await fetch(`${API_BASE}/friend`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           sender: userId,
//           recipient: friendId,
//           content: input,
//         }),
//       });

//       const data = await res.json();
//       console.log('Phản hồi từ server:', { status: res.status, data });
//       if (data.success) {
//         setInput('');
//         await fetchMessages();
//       } else {
//         console.error('Lỗi gửi tin nhắn:', data.message);
//         Alert.alert('Lỗi', data.message || 'Không thể gửi tin nhắn');
//       }
//     } catch (error) {
//       console.error('Lỗi gửi tin nhắn:', error);
//       Alert.alert('Lỗi', 'Kết nối server thất bại');
//     }
//   };

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         const userId = await AsyncStorage.getItem('userId');
//         console.log('Gửi ảnh:', { sender: userId, recipient: friendId });
//         if (!token || !userId) {
//           console.error('Không tìm thấy token hoặc userId');
//           return;
//         }

//         const formData = new FormData();
//         formData.append('sender', userId);
//         formData.append('recipient', friendId);
//         formData.append('image', {
//           uri: result.assets[0].uri,
//           type: 'image/jpeg',
//           name: `image_${Date.now()}.jpg`,
//         });

//         const res = await fetch(`${API_BASE}/friend/image`, {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: formData,
//         });

//         const data = await res.json();
//         console.log('Phản hồi gửi ảnh:', { status: res.status, data });
//         if (data.success) {
//           await fetchMessages();
//         } else {
//           console.error('Lỗi gửi ảnh:', data.message);
//           Alert.alert('Lỗi', data.message || 'Không thể gửi ảnh');
//         }
//       } catch (error) {
//         console.error('Lỗi gửi ảnh:', error);
//         Alert.alert('Lỗi', 'Kết nối server thất bại');
//       }
//     }
//   };

//   const handleDelete = async (messageId) => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const userId = await AsyncStorage.getItem('userId');
//       if (!token || !userId) {
//         console.error('Không tìm thấy token hoặc userId');
//         return;
//       }

//       const res = await fetch(`${API_BASE}/friend/${messageId}`, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       console.log('Phản hồi xóa tin nhắn:', { status: res.status, data });
//       if (data.success) {
//         setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
//       } else {
//         console.error('Lỗi xóa tin nhắn:', data.message);
//         Alert.alert('Lỗi', data.message || 'Không thể xóa tin nhắn');
//       }
//     } catch (error) {
//       console.error('Lỗi xóa tin nhắn:', error);
//       Alert.alert('Lỗi', 'Kết nối server thất bại');
//     }
//   };

//   return (
//     <SafeAreaView className="bg-white h-full">
//       <View className="flex-row justify-between items-center mx-3 mt-2 mb-4">
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={24} color="black" />
//         </TouchableOpacity>
//         <Text className="font-bold text-xl flex-1 text-center ml-4">
//           Chat với {friendName}
//         </Text>
//       </View>

//       <ScrollView
//         className="flex-1 px-4 space-y-6"
//         contentContainerStyle={{ paddingBottom: 20 }}
//       >
//         {messages.map((msg) => (
//           <View
//             key={msg.id}
//             className={`flex-row items-start space-x-2 ${msg.right ? 'justify-end' : 'justify-start'}`}
//           >
//             {!msg.right && (
//               <Image source={{ uri: msg.avatar }} className="w-10 h-10 rounded-full mt-1" />
//             )}
//             <View className={`flex-col ${msg.right ? 'items-end' : 'items-start'} max-w-[70%]`}>
//               <View className="flex-row items-center w-full">
//                 {msg.right ? (
//                   <>
//                     <Text className="text-xs text-gray-500 mr-2">{msg.time}</Text>
//                     <Text className="font-semibold text-sm text-gray-900">{msg.user}</Text>
//                   </>
//                 ) : (
//                   <>
//                     <Text className="font-semibold text-sm text-gray-900">{msg.user}</Text>
//                     <Text className="text-xs text-gray-500 ml-2">{msg.time}</Text>
//                   </>
//                 )}
//               </View>
//               <View className="flex-row items-center">
//                 {msg.text && (
//                   <View
//                     className={`mt-1 p-2 rounded-lg ${
//                       msg.right ? 'bg-indigo-100 text-right' : 'bg-gray-100 text-left'
//                     }`}
//                   >
//                     <Text className="text-sm text-gray-800">{msg.text}</Text>
//                   </View>
//                 )}
//                 {msg.image && (
//                   <Image source={{ uri: msg.image }} className="w-40 h-40 mt-1 rounded-md" />
//                 )}
//                 {msg.right && (
//                   <TouchableOpacity
//                     onPress={() => handleDelete(msg.id)}
//                     className="ml-2 p-1"
//                   >
//                     <Ionicons name="trash-outline" size={20} color="red" />
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </View>
//             {msg.right && (
//               <Image source={{ uri: msg.avatar }} className="w-10 h-10 rounded-full mt-1" />
//             )}
//           </View>
//         ))}
//       </ScrollView>

//       <View className="px-4 py-3 border-t border-gray-200">
//         <View className="flex flex-col space-y-2">
//           <View className="flex-row items-center border border-gray-300 rounded-md overflow-hidden">
//             <TouchableOpacity onPress={pickImage} className="flex-row justify-center items-center">
//               <Image
//                 source={icons.upload}
//                 className="max-w-[30px] max-h-[30px] ml-0.75 border-r px-2"
//                 resizeMode="contain"
//               />
//             </TouchableOpacity>
//             <TextInput
//               value={input}
//               onChangeText={setInput}
//               placeholder="Tin nhắn"
//               placeholderTextColor="#9CA3AF"
//               className="flex-1 px-2 py-2 text-sm text-gray-700"
//             />
//             <TouchableOpacity
//               onPress={handleSend}
//               className="bg-indigo-500 px-4 py-2 rounded-r-md"
//             >
//               <Text className="text-white text-sm font-semibold">Gửi</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default ChatFriend;
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { icons } from '../../constants';
import io from 'socket.io-client';

const API_BASE = 'http://192.168.0.105:8017';
const SOCKET_URL = 'http://192.168.0.105:8017';

const ChatFriend = () => {
  const { friendId } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [friendName, setFriendName] = useState('Bạn bè');
  const socketRef = useRef(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        if (!token || !userId) {
          console.error('Không tìm thấy token hoặc userId');
          return;
        }

        socketRef.current = io(SOCKET_URL, {
          auth: { token: `Bearer ${token}` },
          query: { userId, friendId },
        });

        socketRef.current.on('connect', () => {
          console.log('Kết nối Socket.IO thành công:', socketRef.current.id);
          socketRef.current.emit('joinPrivateChat', { friendId });
        });

        socketRef.current.on('newMessage', (newMessage) => {
          console.log('Tin nhắn mới nhận được:', newMessage);
          const isCurrentUser = String(newMessage.sender._id) === String(userId);
          if (!isCurrentUser && newMessage.sender.username) {
            setFriendName(newMessage.sender.username);
          }
          const formattedMessage = {
            id: newMessage._id,
            user: isCurrentUser ? 'Bạn' : newMessage.sender.username || 'Người khác',
            avatar: isCurrentUser
              ? 'https://storage.googleapis.com/a1aa/image/5f8435b9-10c5-4df1-d418-48aab78a9fc5.jpg'
              : 'https://storage.googleapis.com/a1aa/image/965786fe-1586-40e3-2b4d-a49bdb7ea933.jpg',
            time: new Date(newMessage.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            text: newMessage.content,
            image: newMessage.imageUrl ? `${API_BASE}${newMessage.imageUrl}` : null,
            right: isCurrentUser,
          };

          setMessages((prev) => [...prev, formattedMessage]);
          scrollViewRef.current?.scrollToEnd({ animated: true });
        });

        socketRef.current.on('messageDeleted', (messageId) => {
          console.log('Tin nhắn đã xóa:', messageId);
          setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        });

        socketRef.current.on('connect_error', (error) => {
          console.error('Lỗi kết nối Socket.IO:', error.message);
          Alert.alert('Lỗi', 'Không thể kết nối với server thời gian thực');
        });

        return () => {
          socketRef.current.disconnect();
          console.log('Ngắt kết nối Socket.IO');
        };
      } catch (error) {
        console.error('Lỗi khởi tạo Socket.IO:', error);
      }
    };

    initializeSocket();
  }, [friendId]);

  const fetchMessages = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      if (!token || !userId) {
        console.error('Không tìm thấy token hoặc userId');
        return;
      }

      const res = await fetch(`${API_BASE}/api/v1/chat/friend/${friendId}?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        const formatted = data.messages
          .filter((msg) => msg.sender && msg.sender._id)
          .map((msg) => {
            const isCurrentUser = String(msg.sender._id) === String(userId);
            if (!isCurrentUser && msg.sender.username) {
              setFriendName(msg.sender.username);
            }
            return {
              id: msg._id,
              user: isCurrentUser ? 'Bạn' : msg.sender.username || 'Người khác',
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
      } else {
        console.error('Lỗi API:', data.message);
        Alert.alert('Lỗi', data.message || 'Không thể tải tin nhắn');
      }
    } catch (error) {
      console.error('Lỗi tải tin nhắn:', error);
      Alert.alert('Lỗi', 'Kết nối server thất bại');
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [friendId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      if (!token || !userId) {
        console.error('Không tìm thấy token hoặc userId');
        return;
      }

      // Emit socket event for real-time message
      socketRef.current.emit('sendPrivateMessage', {
        recipientId: friendId,
        senderId: userId,
        content: input,
      });

      const res = await fetch(`${API_BASE}/api/v1/chat/friend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender: userId,
          recipient: friendId,
          content: input,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setInput('');
      } else {
        console.error('Lỗi gửi tin nhắn:', data.message);
        Alert.alert('Lỗi', data.message || 'Không thể gửi tin nhắn');
      }
    } catch (error) {
      console.error('Lỗi gửi tin nhắn:', error);
      Alert.alert('Lỗi', 'Kết nối server thất bại');
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
        if (!token || !userId) {
          console.error('Không tìm thấy token hoặc userId');
          return;
        }

        const formData = new FormData();
        formData.append('sender', userId);
        formData.append('recipient', friendId);
        formData.append('image', {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: `image_${Date.now()}.jpg`,
        });

        const res = await fetch(`${API_BASE}/api/v1/chat/friend/image`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const data = await res.json();
        if (data.success) {
          // Socket.IO will handle the new message update
        } else {
          console.error('Lỗi gửi ảnh:', data.message);
          Alert.alert('Lỗi', data.message || 'Không thể gửi ảnh');
        }
      } catch (error) {
        console.error('Lỗi gửi ảnh:', error);
        Alert.alert('Lỗi', 'Kết nối server thất bại');
      }
    }
  };

  const handleDelete = async (messageId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = await AsyncStorage.getItem('userId');
      if (!token || !userId) {
        console.error('Không tìm thấy token hoặc userId');
        return;
      }

      // Emit socket event for message deletion
      socketRef.current.emit('deletePrivateMessage', {
        messageId,
        senderId: userId,
        recipientId: friendId,
      });

      const res = await fetch(`${API_BASE}/api/v1/chat/friend/${messageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!data.success) {
        console.error('Lỗi xóa tin nhắn:', data.message);
        Alert.alert('Lỗi', data.message || 'Không thể xóa tin nhắn');
      }
    } catch (error) {
      console.error('Lỗi xóa tin nhắn:', error);
      Alert.alert('Lỗi', 'Kết nối server thất bại');
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="flex-row justify-between items-center mx-3 mt-2 mb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="font-bold text-xl flex-1 text-center ml-4">
          Chat với {friendName}
        </Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
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
              <View className="flex-row items-center">
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
                {msg.right && (
                  <TouchableOpacity
                    onPress={() => handleDelete(msg.id)}
                    className="ml-2 p-1"
                  >
                    <Ionicons name="trash-outline" size={20} color="red" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {msg.right && (
              <Image source={{ uri: msg.avatar }} className="w-10 h-10 rounded-full mt-1" />
            )}
          </View>
        ))}
      </ScrollView>

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

export default ChatFriend;