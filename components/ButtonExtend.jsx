// import React, { useState } from 'react';
// import { Modal, Text, TextInput, TouchableOpacity, View, Pressable, Image } from 'react-native';
// import { icons } from '../constants';

// const ButtonExtend = () => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [input, setInput] = useState('');
//   const [friends, setFriends] = useState([]);
//   const [invitations, setInvitations] = useState([]);

//   const sendInvite = () => {
//     if (!input.trim()) return;
//     setInvitations([...invitations, { id: Date.now(), name: input }]);
//     setInput('');
//   };

//   const acceptInvite = (inv) => {
//     setFriends([...friends, { id: inv.id, name: inv.name, online: false }]);
//     setInvitations(invitations.filter(i => i.id !== inv.id));
//   };

//   const cancelInvite = (id) => {
//     setInvitations(invitations.filter(i => i.id !== id));
//   };

//   const removeFriend = (id) => {
//     setFriends(friends.filter(f => f.id !== id));
//   };

//   const toggleStatus = (id) => {
//     setFriends(
//       friends.map(friend =>
//         friend.id === id ? { ...friend, online: !friend.online } : friend
//       )
//     );
//   };

//   return (
//     <>
//       <TouchableOpacity onPress={() => setModalVisible(true)}>
//         <Image source={icons.friend} className="w-6 h-6 ml-2" resizeMode="contain" />
//       </TouchableOpacity>

//       <Modal visible={modalVisible} transparent>
//         <View className="flex-1 justify-center items-center">
//           <View className="bg-white rounded-xl w-11/12 max-h-[90%] p-6 border-2 border-blue-500 shadow-sm">
//             <Text className="text-lg font-semibold mb-4 text-center">Quản Lý Bạn Bè</Text>

//             <View className="flex-row items-center mb-4">
//               <TextInput
//                 className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
//                 placeholder="Enter name or email to invite"
//                 value={input}
//                 onChangeText={setInput}
//               />
//               <TouchableOpacity
//                 className="ml-2 bg-indigo-600 px-4 py-2 rounded-md"
//                 onPress={sendInvite}
//               >
//                 <Text className="text-white text-sm font-semibold">Gửi</Text>
//               </TouchableOpacity>
//             </View>

//             <Text className="font-semibold text-sm mb-2">Danh Sách Bạn Bè</Text>
//             <View className="mb-4 space-y-2">
//               {friends.length === 0 ? (
//                 <Text className="text-xs text-gray-500 italic">Không có bạn bè được thêm vào.</Text>
//               ) : (
//                 friends.map(friend => (
//                   <View key={friend.id} className="flex-row justify-between items-center">
//                     <View className="flex-row items-center gap-2">
//                       <View className={`w-3 h-3 rounded-full ${friend.online ? 'bg-green-500' : 'bg-gray-400'}`} />
//                       <Text className="text-sm font-medium">{friend.name}</Text>
//                     </View>
//                     <View className="flex-row gap-2 items-center">
//                       <TouchableOpacity onPress={() => toggleStatus(friend.id)}>
//                         <Text className={`text-xs px-2 py-1 rounded ${friend.online ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>{friend.online ? 'Online' : 'Offline'}</Text>
//                       </TouchableOpacity>
//                       <TouchableOpacity onPress={() => removeFriend(friend.id)}>
//                         <Text className="text-red-500 text-xs font-semibold">Xóa</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 ))
//               )}
//             </View>

//             <Text className="font-semibold text-sm mb-2">Lời Mời Bạn Bè</Text>
//             <View className="space-y-2">
//               {invitations.length === 0 ? (
//                 <Text className="text-xs text-gray-500 italic">Không có lời mời bạn bè.</Text>
//               ) : (
//                 invitations.map(inv => (
//                   <View key={inv.id} className="flex-row justify-between items-center">
//                     <Text className="text-sm font-medium">{inv.name}</Text>
//                     <View className="flex-row gap-2">
//                       <TouchableOpacity onPress={() => acceptInvite(inv)}>
//                         <Text className="text-green-600 text-xs font-semibold">Accept</Text>
//                       </TouchableOpacity>
//                       <TouchableOpacity onPress={() => cancelInvite(inv.id)}>
//                         <Text className="text-red-600 text-xs font-semibold">Cancel</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 ))
//               )}
//             </View>

//             <Pressable className="absolute top-3 right-3" onPress={() => setModalVisible(false)}>
//               <Text className="text-gray-500 text-lg">×</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// };

// export default ButtonExtend;
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View, Pressable, Image, Alert } from 'react-native';
import { icons } from '../constants';

const ButtonExtend = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [input, setInput] = useState('');
  const [friends, setFriends] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [authToken, setAuthToken] = useState(null);

  // Lấy token khi mở modal
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setAuthToken(token);
      return token;
    } catch (e) {
      console.error('Lỗi khi lấy token:', e);
      return null;
    }
  };

  const fetchFriendsAndInvites = async () => {
    const token = await getToken();
    if (!token) return;
    try {
      const res = await fetch('http://192.168.0.105:8017/api/users/friends', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setFriends(data.friends || []);
        setInvitations(data.requests || []);
      } else {
        Alert.alert('Lỗi', data.message || 'Không thể tải danh sách bạn bè.');
      }
    } catch (err) {
      console.error('Fetch friends failed:', err);
    }
  };

  const sendInvite = async () => {
  if (!input.trim()) return;
  const token = await getToken();
  if (!token) return;

  try {
    const res = await fetch('http://192.168.0.105:8017/api/users/send-friend-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ keyword: input }), // 👈 SỬA ở đây
    });

    const data = await res.json();
    if (res.ok) {
      Alert.alert('Thành công', 'Lời mời đã được gửi.');
      setInput('');
      fetchFriendsAndInvites();
    } else {
      Alert.alert('Lỗi', data.message || 'Không gửi được lời mời.');
    }
  } catch (err) {
    console.error(err);
  }
};

const respondInvite = async (inv, status) => {
  const token = await getToken();
  if (!token) return;
  try {
    const res = await fetch('http://192.168.0.105:8017/api/users/respond-friend-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ requestId: inv._id, status }),
    });

    const data = await res.json();
    if (res.ok) {
      Alert.alert('Thành công', `Bạn đã ${status === 'accepted' ? 'chấp nhận' : 'từ chối'} lời mời.`);
      fetchFriendRequests(); // gọi lại danh sách
    } else {
      Alert.alert('Lỗi', data.message || 'Không xử lý được lời mời.');
    }
  } catch (err) {
    console.error(err);
    Alert.alert('Lỗi', 'Có lỗi xảy ra.');
  }
};
const fetchFriendRequests = async () => {
  const token = await getToken();
  if (!token) return;
  try {
    const res = await fetch('http://192.168.0.105:8017/api/users/friend-requests', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) {
      setInvitations(data.friendRequests || []);
    } else {
      Alert.alert('Lỗi', data.message || 'Không thể tải lời mời.');
    }
  } catch (err) {
    console.error(err);
  }
};

  const removeFriend = async (id) => {
    const token = await getToken();
    if (!token) return;
    try {
      const res = await fetch(`http://192.168.0.105:8017/api/users/remove-friend/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchFriendsAndInvites();
      } else {
        Alert.alert('Lỗi', 'Không thể xóa bạn bè.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (modalVisible) {
      fetchFriendRequests();
      fetchFriendsAndInvites();
    }
  }, [modalVisible]);
  

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image source={icons.friend} className="w-6 h-6 ml-2" resizeMode="contain" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent>
        <View className="flex-1 justify-center items-center">
          <View className="bg-white rounded-xl w-11/12 max-h-[90%] p-6 border-2 border-blue-500 shadow-sm">
            <Text className="text-lg font-semibold mb-4 text-center">Quản Lý Bạn Bè</Text>

            <View className="flex-row items-center mb-4">
              <TextInput
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="Nhập email để mời"
                value={input}
                onChangeText={setInput}
              />
              <TouchableOpacity className="ml-2 bg-indigo-600 px-4 py-2 rounded-md" onPress={sendInvite}>
                <Text className="text-white text-sm font-semibold">Gửi</Text>
              </TouchableOpacity>
            </View>

            {searchResults.length > 0 && (
              <View className="mb-2 bg-gray-50 p-2 rounded border border-gray-200">
                {searchResults.map((user) => (
                  <TouchableOpacity key={user._id} onPress={() => setInput(user.email)}>
                    <Text className="text-sm py-1 text-blue-700">{user.name || user.email}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text className="font-semibold text-sm mb-2">Danh Sách Bạn Bè</Text>
            <View className="mb-4 space-y-2">
              {friends.length === 0 ? (
                <Text className="text-xs text-gray-500 italic">Không có bạn bè.</Text>
              ) : (
                friends.map((friend) => (
                  <View key={friend._id} className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-2">
                      <View className="w-3 h-3 rounded-full bg-gray-400" />
                      <Text className="text-sm font-medium">{friend.email}</Text>
                    </View>
                    <TouchableOpacity onPress={() => removeFriend(friend._id)}>
                      <Text className="text-red-500 text-xs font-semibold">Xóa</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>

            <Text className="font-semibold text-sm mb-2">Lời Mời Bạn Bè</Text>
            <View className="space-y-2">
              {invitations.length === 0 ? (
                <Text className="text-xs text-gray-500 italic">Không có lời mời.</Text>
              ) : (
                invitations.map((inv) => (
                  <View key={inv._id} className="flex-row justify-between items-center">
                    <Text className="text-sm font-medium">{inv.sender.username || inv.sender.email}</Text>
                    <View className="flex-row gap-2">
                      <TouchableOpacity onPress={() => respondInvite(inv, 'accepted')}>
                        <Text className="text-green-600 text-xs font-semibold">Chấp nhận</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => respondInvite(inv, 'rejected')}>
                        <Text className="text-red-600 text-xs font-semibold">Từ chối</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>


            <Pressable className="absolute top-3 right-3" onPress={() => setModalVisible(false)}>
              <Text className="text-gray-500 text-lg">×</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ButtonExtend;

