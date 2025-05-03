import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from '../../components/SearchInput';
import ButtonExtend from '../../components/ButtonExtend';

const groups = [
  {
    id: 1,
    name: 'Trao Đổi Học Tập',
    status: '12 members, Online',
    image: 'https://storage.googleapis.com/a1aa/image/c13b8244-4ab3-44f4-e05a-05c228f54e41.jpg',
  },
  {
    id: 2,
    name: 'Lập Trình Mạng',
    status: '8 members, Offline',
    image: 'https://storage.googleapis.com/a1aa/image/e4fefacc-efaa-4e86-1878-4e312bd58406.jpg',
  },
  {
    id: 3,
    name: 'Nhóm 7',
    status: '15 members, Online',
    image: 'https://storage.googleapis.com/a1aa/image/5d720d04-93c8-4d08-af7e-c51ccc873841.jpg',
  },
];

const GroupsApp = () => {
  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView className="space-y-4 mx-3 mt-2">
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <Text className="font-semibold text-base flex-1 text-center ml-4">Danh Sách Nhóm</Text>
          <ButtonExtend/>
        </View>

        {/* Search */}
        <View className="relative">
          <SearchInput/>
        </View>

        {/* Title */}
        <Text className="font-semibold text-base text-black mt-4 mb-3">Study Groups</Text>

        {/* Group list */}
        {groups.map((group) => (
          <View
            key={group.id}
            className="flex-row justify-between items-center border border-gray-200 rounded-lg p-3 mb-4"
          >
            <View className="flex-col gap-1 max-w-[60%]">
              <Text className="font-semibold text-sm text-black">{group.name}</Text>
              <Text className="text-xs text-gray-400">{group.status}</Text>
              <TouchableOpacity className="mt-1 w-14 border border-indigo-300 rounded-md py-1 px-2">
                <Text className="text-indigo-600 text-xs font-medium text-center">Join</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={{ uri: group.image }}
              className="w-20 h-14 rounded-md"
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
export default GroupsApp;
