import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

const groups = [
  {
    id: 1,
    name: 'Math Wizards',
    status: '12 members, Online',
    image: 'https://storage.googleapis.com/a1aa/image/c13b8244-4ab3-44f4-e05a-05c228f54e41.jpg',
  },
  {
    id: 2,
    name: 'Chem Chats',
    status: '8 members, Offline',
    image: 'https://storage.googleapis.com/a1aa/image/e4fefacc-efaa-4e86-1878-4e312bd58406.jpg',
  },
  {
    id: 3,
    name: 'Lit Lovers',
    status: '15 members, Online',
    image: 'https://storage.googleapis.com/a1aa/image/5d720d04-93c8-4d08-af7e-c51ccc873841.jpg',
  },
  {
    id: 4,
    name: 'History Buffs',
    status: '10 members, Offline',
    image: 'https://storage.googleapis.com/a1aa/image/365ecf07-f36e-4e6e-1158-4f07a45a0dde.jpg',
  },
  {
    id: 5,
    name: 'Code Masters',
    status: '20 members, Online',
    image: 'https://storage.googleapis.com/a1aa/image/72bcddff-c2b4-40ad-c11f-73755ea5ec65.jpg',
  },
];

const GroupsApp = () => {
  return (
      <ScrollView className="space-y-4">
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <Text className="text-lg">←</Text>
          <Text className="font-semibold text-base flex-1 text-center">Danh Sách Nhóm</Text>
          <Text className="text-gray-400 text-lg">📊</Text>
        </View>

        {/* Search */}
        <View className="relative">
          <TextInput
            placeholder="Search"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm"
            placeholderTextColor="#9CA3AF"
          />
          <Text className="absolute left-3 top-2 text-gray-400">🔍</Text>
        </View>

        {/* Title */}
        <Text className="font-semibold text-base text-black">Study Groups Overview</Text>

        {/* Group list */}
        {groups.map((group) => (
          <View
            key={group.id}
            className="flex-row justify-between items-center border border-gray-200 rounded-lg p-3"
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

  );
};
export default GroupsApp;
