import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';

const friendsData = [
  { id: 1, name: 'Alice', online: true },
  { id: 2, name: 'Bob', online: false },
  { id: 3, name: 'Charlie', online: true },
  { id: 4, name: 'Diana', online: false },
];

const invitationsData = [{ id: 101, name: 'Eva' }];

const Calendar = () => {
  const [friends, setFriends] = useState(friendsData);
  const [invitations, setInvitations] = useState(invitationsData);
  const [modalVisible, setModalVisible] = useState(false);
  const [addSessionVisible, setAddSessionVisible] = useState(false);
  const [input, setInput] = useState('');
  const [sessions, setSessions] = useState([]);
  const [formData, setFormData] = useState({
    dateTime: '',
    title: '',
    linkOrFile: '',
  });

  const toggleStatus = (id) => {
    setFriends((prev) =>
      prev.map((f) => (f.id === id ? { ...f, online: !f.online } : f))
    );
  };

  const removeFriend = (id) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
  };

  const acceptInvite = (invite) => {
    setFriends((prev) => [...prev, { id: Date.now(), name: invite.name, online: false }]);
    setInvitations((prev) => prev.filter((i) => i.id !== invite.id));
  };

  const cancelInvite = (id) => {
    setInvitations((prev) => prev.filter((i) => i.id !== id));
  };

  const sendInvite = () => {
    if (!input.trim()) return;
    if (friends.some((f) => f.name.toLowerCase() === input.toLowerCase())) {
      alert('Already a friend');
      return;
    }
    if (invitations.some((i) => i.name.toLowerCase() === input.toLowerCase())) {
      alert('Already invited');
      return;
    }
    setInvitations((prev) => [...prev, { id: Date.now(), name: input }]);
    setInput('');
  };

  const addSession = () => {
    if (!formData.dateTime || !formData.title) return;
    const newSession = {
      id: Date.now(),
      date: formData.dateTime,
      title: formData.title,
      subject: formData.linkOrFile || 'No link/file',
    };
    setSessions((prev) => [...prev, newSession]);
    setFormData({ dateTime: '', title: '', linkOrFile: '' });
    setAddSessionVisible(false);
  };

  return (
    <ScrollView className="bg-white flex-1 p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg">←</Text>
        <Text className="text-base font-semibold">Calendar Learning</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text className="text-gray-400">📊</Text>
        </TouchableOpacity>
      </View>

      {/* Image */}
      <Image
        className="rounded-xl w-full h-60 mb-4"
        source={{ uri: 'https://storage.googleapis.com/a1aa/image/ce5a4446-bd92-418c-1995-91c56c27fa3e.jpg' }}
        resizeMode="cover"
      />

      {/* Upcoming Sessions */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-semibold">Upcoming Sessions</Text>
        <TouchableOpacity className="bg-indigo-600 px-3 py-2 rounded-md" onPress={() => setAddSessionVisible(true)}>
          <Text className="text-white text-sm font-semibold">+ Add Session</Text>
        </TouchableOpacity>
      </View>

      {/* Session List */}
      <View className="space-y-4">
        {sessions.map((item) => (
          <SessionItem key={item.id} date={item.date} title={item.title} subject={item.subject} />
        ))}
        <SessionItem date="Apr 6, 3:30 PM - 4:00 PM" title="Reading: Realism, Regionalism, and Naturalism" subject="English II: Pre-AP" />
        <SessionItem date="Apr 7, 2:00 PM - 2:30 PM" title="Review Video: Colonial and Early National Period" subject="English II: Pre-AP" />
        <SessionItem date="Apr 10, 1:15 PM - 1:45 PM" title="Performing the Work of Democracy" subject="U.S. History: Pre-AP" />
      </View>

      {/* Add Session Modal */}
      <Modal visible={addSessionVisible} transparent>
        <View className="flex-1 bg-black bg-opacity-40 justify-center items-center">
          <View className="bg-white rounded-xl w-11/12 max-h-[90%] p-6">
            <Text className="text-lg font-semibold mb-4 text-center">Add Session</Text>

            <View className="space-y-3">
              <View>
                <Text className="text-xs font-semibold mb-1">Ngày giờ</Text>
                <TextInput
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="YYYY-MM-DD HH:MM - HH:MM"
                  value={formData.dateTime}
                  onChangeText={(text) => setFormData({ ...formData, dateTime: text })}
                />
              </View>
              <View>
                <Text className="text-xs font-semibold mb-1">Tiêu đề</Text>
                <TextInput
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Nhập tiêu đề"
                  value={formData.title}
                  onChangeText={(text) => setFormData({ ...formData, title: text })}
                />
              </View>
              <View>
                <Text className="text-xs font-semibold mb-1">Link hoặc tải tệp lên</Text>
                <TextInput
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mb-2"
                  placeholder="Nhập link hoặc chọn tệp"
                  value={formData.linkOrFile}
                  onChangeText={(text) => setFormData({ ...formData, linkOrFile: text })}
                />
                <Text className="text-xs text-gray-600 italic">(Chức năng tải tệp cần tích hợp thêm)</Text>
              </View>
              <View className="flex items-end">
                <TouchableOpacity className="bg-indigo-600 px-4 py-2 rounded-md" onPress={addSession}>
                  <Text className="text-white text-sm font-semibold">Thêm</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Pressable
              className="absolute top-3 right-3"
              onPress={() => setAddSessionVisible(false)}
            >
              <Text className="text-gray-500 text-lg">×</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Friends Management Modal */}
      <Modal visible={modalVisible} transparent>
        <View className="flex-1 bg-black bg-opacity-40 justify-center items-center">
          <View className="bg-white rounded-xl w-11/12 max-h-[90%] p-6">
            <Text className="text-lg font-semibold mb-4 text-center">Friends Management</Text>

            {/* Add Friend */}
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
                <Text className="text-white text-sm font-semibold">Send</Text>
              </TouchableOpacity>
            </View>

            {/* Friends List */}
            <Text className="font-semibold text-sm mb-2">Friends List</Text>
            <View className="mb-4 space-y-2">
              {friends.length === 0 ? (
                <Text className="text-xs text-gray-500 italic">No friends added.</Text>
              ) : (
                friends.map((friend) => (
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
                        <Text className="text-red-500 text-xs font-semibold">Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>

            {/* Invitations List */}
            <Text className="font-semibold text-sm mb-2">Friend Invitations</Text>
            <View className="space-y-2">
              {invitations.length === 0 ? (
                <Text className="text-xs text-gray-500 italic">No friend invitations.</Text>
              ) : (
                invitations.map((inv) => (
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

            <Pressable
              className="absolute top-3 right-3"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-gray-500 text-lg">×</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const SessionItem = ({ date, title, subject }) => (
  <View>
    <Text className="text-gray-500 text-xs mb-1">{date}</Text>
    <Text className="font-normal text-sm mb-1">{title}</Text>
    <Text className="text-indigo-600 text-xs">{subject}</Text>
  </View>
);

export default Calendar;
