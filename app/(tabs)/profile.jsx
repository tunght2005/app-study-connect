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
import { icons } from '../../constants';
import ButtonExtend from '../../components/ButtonExtend';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { Alert } from 'react-native';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailNotify, setEmailNotify] = useState(true);
  const [appNotify, setAppNotify] = useState(false);
  // Fetch thông tin user khi mở profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://192.168.0.105:8017/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Lỗi khi lấy dữ liệu');

        setName(data.username || '');
        setEmail(data.email || '');
      } catch (err) {
        Alert.alert('Lỗi', err.message);
      }
    };

    fetchProfile();
  }, []);
  return (
    <SafeAreaView className="bg-white h-full">
      <View className="space-y-4 mx-3 mt-2">
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <Text className="font-semibold text-base flex-1 text-center ml-4">Settings</Text>
          <ButtonExtend/>
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
          <Image source={icons.pen} className="max-w-[20px] max-h-[25px] mr-2" resizeMode="contain"/>
        </View>

        {/* Inputs */}
        <View className="px-4 space-y-4">
          <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2">
            <Image source={icons.pen} className="max-w-[20px] max-h-[25px] mr-2" resizeMode="contain"/> 
            <TextInput
              className="flex-1 text-sm text-black"
              placeholder="John K."
              value={name}
              onChangeText={setName}
            />
          </View>
          <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2">
            <Image source={icons.pen} className="max-w-[20px] max-h-[25px] mr-2" resizeMode="contain"/>
            <TextInput
              className="flex-1 text-sm text-black"
              placeholder="johnk@gmail.com"
              value={email}
              onChangeText={setEmail}
            />
          </View>
           {/* Lưu thông tin */}
           <TouchableOpacity
              onPress={async () => {
                try {
                  const token = await AsyncStorage.getItem('token');
                  const response = await fetch('http://192.168.0.105:8017/api/auth/me', {
                    method: 'PUT',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      username: name,
                      email: email,
                    }),
                  });

                  const data = await response.json();
                  if (!response.ok) throw new Error(data.message || 'Cập nhật thất bại');

                  Alert.alert('Thành công', 'Cập nhật thông tin thành công');
                } catch (err) {
                  Alert.alert('Lỗi', err.message);
                }
              }}
              className="mt-4 bg-blue-600 py-3 rounded-md w-[130px]"
            >
              <Text className="text-white text-center font-semibold text-base ">Lưu Thông Tin</Text>
          </TouchableOpacity>
          {/* Toggles */}
          <View className="flex-row justify-between items-center">
            <Text className="text-black text-sm">Email thông báo <Text className="text-red-500 italic">(đang phát triển)</Text></Text>
            <Switch
              value={emailNotify}
              onValueChange={setEmailNotify}
              trackColor={{ true: '#4f46e5', false: '#d1d5db' }}
              thumbColor={'white'}
            />
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-black text-sm">Thông báo APP <Text className="text-red-500 italic">(đang phát triển)</Text></Text>
            <Switch
              value={appNotify}
              onValueChange={setAppNotify}
              trackColor={{ true: '#4f46e5', false: '#d1d5db' }}
              thumbColor={'white'}
            />
          </View>
          {/* Logout */}
          <TouchableOpacity
              onPress={async () => {
                try {
                  await AsyncStorage.removeItem('token');
                  router.replace('/sign-in');
                } catch (err) {
                  Alert.alert('Lỗi', 'Không thể đăng xuất');
                }
              }}
              className="mt-8 bg-black py-3 rounded-md"
            >
              <Text className="text-white text-center font-semibold text-base">Đăng Xuất</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
