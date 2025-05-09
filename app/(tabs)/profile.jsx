import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
} from 'react-native';
import { icons } from '../../constants';
import ButtonExtend from '../../components/ButtonExtend';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('https://storage.googleapis.com/a1aa/image/fd246e16-3759-479b-e456-89525bfd2a09.jpg');
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
        if (data.avatar) setAvatar(data.avatar);
      } catch (err) {
        Alert.alert('Lỗi', err.message);
      }
    };

    fetchProfile();
  }, []);
  
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Lỗi', 'Bạn cần cho phép truy cập thư viện để chọn ảnh.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };
  return (
    <SafeAreaView className="bg-white h-full">
      <View className="space-y-4 mx-3 mt-2">
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <Text className="font-semibold text-2xl flex-1 text-center ml-7 text-gray-200">Settings</Text>
          <ButtonExtend/>
        </View>

        {/* Profile Section */}
        <View className="flex-row items-center gap-4 px-4 py-6">
        <TouchableOpacity onPress={pickImage}>
            <Image
              source={{ uri: avatar }}
              className="w-16 h-16 rounded-full border-2 border-gray-300"
            />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="font-semibold text-xl text-orange-500">{name}</Text>
            <Text className="text-lg text-gray-500">{email}</Text>
          </View>
          <Image source={icons.pen} className="max-w-[20px] max-h-[25px] mr-2" resizeMode="contain"/>
        </View>

        {/* Inputs */}
        <View className="px-4 space-y-4">
          <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 my-2 border-x-8">
            <Image source={icons.pen} className="max-w-[20px] max-h-[25px] mr-2" resizeMode="contain"/> 
            <TextInput
              className="flex-1 text-xl text-black border-l ml-2 pl-3"
              placeholder="John K."
              value={name}
              onChangeText={setName}
            />
          </View>
          <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 my-2 border-x-8">
            <Image source={icons.pen} className="max-w-[20px] max-h-[25px] mr-2" resizeMode="contain"/>
            <TextInput
              className="flex-1 text-xl text-black border-l ml-2 pl-3"
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
                      avatar: avatar, // gửi avatar nếu backend hỗ trợ
                    }),
                  });

                  const data = await response.json();
                  if (!response.ok) throw new Error(data.message || 'Cập nhật thất bại');

                  Alert.alert('Thành công', 'Cập nhật thông tin thành công');
                } catch (err) {
                  Alert.alert('Lỗi', err.message);
                }
              }}
              className="mt-4 bg-orange-600 py-3 rounded-lg w-[130px] active:bg-gray-500"
            >
              <Text className="text-black text-center font-semibold text-base ">Lưu Thông Tin</Text>
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
