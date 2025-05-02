import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Image,
  ScrollView,
} from 'react-native';

const Profile = () => {
  const [name, setName] = useState('John K.');
  const [email, setEmail] = useState('johnk@gmail.com');
  const [emailNotify, setEmailNotify] = useState(true);
  const [appNotify, setAppNotify] = useState(false);

  return (
    <View className="bg-white flex-1">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
        <Text className="text-black text-lg">←</Text>
        <Text className="font-semibold text-base text-black">Settings</Text>
        <Text className="text-gray-400 text-lg">📊</Text>
      </View>

      {/* Profile Section */}
      <View className="flex-row items-center gap-4 px-4 py-6">
        <Image
          source={{ uri: 'https://storage.googleapis.com/a1aa/image/fd246e16-3759-479b-e456-89525bfd2a09.jpg' }}
          className="w-12 h-12 rounded-full"
        />
        <View className="flex-1">
          <Text className="font-semibold text-base text-black">{name}</Text>
          <Text className="text-sm text-gray-500">{email}</Text>
        </View>
        <Text className="text-black text-lg">✏️</Text>
      </View>

      {/* Inputs */}
      <View className="px-4 space-y-4">
        <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2">
          <Text className="mr-2 text-gray-400">✏️</Text>
          <TextInput
            className="flex-1 text-sm text-black"
            placeholder="John K."
            value={name}
            onChangeText={setName}
          />
        </View>
        <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2">
          <Text className="mr-2 text-gray-400">✏️</Text>
          <TextInput
            className="flex-1 text-sm text-black"
            placeholder="johnk@gmail.com"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Toggles */}
        <View className="flex-row justify-between items-center">
          <Text className="text-black text-sm">Email thông báo</Text>
          <Switch
            value={emailNotify}
            onValueChange={setEmailNotify}
            trackColor={{ true: '#4f46e5', false: '#d1d5db' }}
            thumbColor={'white'}
          />
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-black text-sm">Thông báo APP</Text>
          <Switch
            value={appNotify}
            onValueChange={setAppNotify}
            trackColor={{ true: '#4f46e5', false: '#d1d5db' }}
            thumbColor={'white'}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity className="mt-8 bg-black py-3 rounded-md">
          <Text className="text-white text-center font-semibold text-base">Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
