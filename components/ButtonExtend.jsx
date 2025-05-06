import React, { useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View, Pressable, Image } from 'react-native';
import { icons } from '../constants';

const ButtonExtend = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [input, setInput] = useState('');
  const [friends, setFriends] = useState([]);
  const [invitations, setInvitations] = useState([]);

  const sendInvite = () => {
    if (!input.trim()) return;
    setInvitations([...invitations, { id: Date.now(), name: input }]);
    setInput('');
  };

  const acceptInvite = (inv) => {
    setFriends([...friends, { id: inv.id, name: inv.name, online: false }]);
    setInvitations(invitations.filter(i => i.id !== inv.id));
  };

  const cancelInvite = (id) => {
    setInvitations(invitations.filter(i => i.id !== id));
  };

  const removeFriend = (id) => {
    setFriends(friends.filter(f => f.id !== id));
  };

  const toggleStatus = (id) => {
    setFriends(
      friends.map(friend =>
        friend.id === id ? { ...friend, online: !friend.online } : friend
      )
    );
  };

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
                placeholder="Enter name or email to invite"
                value={input}
                onChangeText={setInput}
              />
              <TouchableOpacity
                className="ml-2 bg-indigo-600 px-4 py-2 rounded-md"
                onPress={sendInvite}
              >
                <Text className="text-white text-sm font-semibold">Gửi</Text>
              </TouchableOpacity>
            </View>

            <Text className="font-semibold text-sm mb-2">Danh Sách Bạn Bè</Text>
            <View className="mb-4 space-y-2">
              {friends.length === 0 ? (
                <Text className="text-xs text-gray-500 italic">Không có bạn bè được thêm vào.</Text>
              ) : (
                friends.map(friend => (
                  <View key={friend.id} className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-2">
                      <View className={`w-3 h-3 rounded-full ${friend.online ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <Text className="text-sm font-medium">{friend.name}</Text>
                    </View>
                    <View className="flex-row gap-2 items-center">
                      <TouchableOpacity onPress={() => toggleStatus(friend.id)}>
                        <Text className={`text-xs px-2 py-1 rounded ${friend.online ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>{friend.online ? 'Online' : 'Offline'}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => removeFriend(friend.id)}>
                        <Text className="text-red-500 text-xs font-semibold">Xóa</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>

            <Text className="font-semibold text-sm mb-2">Lời Mời Bạn Bè</Text>
            <View className="space-y-2">
              {invitations.length === 0 ? (
                <Text className="text-xs text-gray-500 italic">Không có lời mời bạn bè.</Text>
              ) : (
                invitations.map(inv => (
                  <View key={inv.id} className="flex-row justify-between items-center">
                    <Text className="text-sm font-medium">{inv.name}</Text>
                    <View className="flex-row gap-2">
                      <TouchableOpacity onPress={() => acceptInvite(inv)}>
                        <Text className="text-green-600 text-xs font-semibold">Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => cancelInvite(inv.id)}>
                        <Text className="text-red-600 text-xs font-semibold">Cancel</Text>
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
