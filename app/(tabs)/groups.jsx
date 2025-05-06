import { Animated } from 'react-native'; // nằm ở đầu file
import { useRef, useEffect } from 'react';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';

import { icons } from '../../constants';
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from '../../components/SearchInput';
import ButtonExtend from '../../components/ButtonExtend';

// Danh sách ảnh có sẵn
const sampleImages = [
  'https://storage.googleapis.com/a1aa/image/c13b8244-4ab3-44f4-e05a-05c228f54e41.jpg',
  'https://storage.googleapis.com/a1aa/image/e4fefacc-efaa-4e86-1878-4e312bd58406.jpg',
  'https://storage.googleapis.com/a1aa/image/5d720d04-93c8-4d08-af7e-c51ccc873841.jpg',
  'https://storage.googleapis.com/a1aa/image/sample4.jpg',
  'https://storage.googleapis.com/a1aa/image/sample5.jpg',
]; 

// const groups = [
//   {
//     id: 1,
//     name: 'Trao Đổi Học Tập',
//     status: '12 members, Online',
//     image: 'https://storage.googleapis.com/a1aa/image/c13b8244-4ab3-44f4-e05a-05c228f54e41.jpg',
//   },
//   {
//     id: 2,
//     name: 'Lập Trình Mạng',
//     status: '8 members, Offline',
//     image: 'https://storage.googleapis.com/a1aa/image/e4fefacc-efaa-4e86-1878-4e312bd58406.jpg',
//   },
//   {
//     id: 3,
//     name: 'Nhóm 7',
//     status: '15 members, Online',
//     image: 'https://storage.googleapis.com/a1aa/image/5d720d04-93c8-4d08-af7e-c51ccc873841.jpg',
//   },
// ];

const GroupsApp = () => {
  // Hiệu ứng nút
  const widthAnim = useRef(new Animated.Value(44)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    if (!expanded) {
      Animated.parallel([
        Animated.timing(widthAnim, {
          toValue: 140,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => setExpanded(true));
    } else {
      setModalVisible(true);
    }
  };

  const collapseButton = () => {
    Animated.parallel([
      Animated.timing(widthAnim, {
        toValue: 44, // Kích thước ban đầu
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => setExpanded(false));
  };
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: 'Trao Đổi Học Tập',
      status: '12 members, Online',
      image: sampleImages[0],
    },
    {
      id: 2,
      name: 'Lập Trình Mạng',
      status: '8 members, Offline',
      image: sampleImages[1],
    },
    {
      id: 3,
      name: 'Nhóm 7',
      status: '15 members, Online',
      image: sampleImages[2],
    },
  ]);

  const handleCreateGroup = () => {
    if (!newGroupName || !selectedImage) return;
    const newGroup = {
      id: groups.length + 1,
      name: newGroupName,
      status: '0 members, Online',
      image: selectedImage,
    };
    setGroups([newGroup, ...groups]);
    setModalVisible(false);
    setNewGroupName('');
    setSelectedImage(null);
    collapseButton(); // Thu nút lại
  };
  return (
    <SafeAreaView className="bg-white h-full">
        {/* Header */}
        <View className="flex-row justify-between items-center mx-3">
          <Text className="font-semibold text-base flex-1 text-center ml-4">Danh Sách Nhóm</Text>
          <ButtonExtend/>
        </View>

        {/* Search */}
        <View className="relative mx-3">
          <SearchInput/>
        </View>
        {/* Nút Tạo Nhóm */}
        <View className="mx-3 mb-3 flex flex-row justify-between">
          {/* Title */}
          <Text className="font-semibold text-base text-black mt-7 mb-4">Study Groups</Text>
          <Animated.View style={{ width: widthAnim }}>
            <TouchableOpacity
              onPress={handleExpand}
              className="bg-indigo-600 flex-row items-center py-1 rounded-full mt-5"
            >
              <Image source={icons.plus} className="w-6 h-6 ml-3" resizeMode="contain" />
              <Animated.Text
                style={{ opacity: opacityAnim }}
                className="text-white ml-2 font-semibold text-sm"
              >
                Tạo Nhóm
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        {/* Danh sách nhóm */}
      <ScrollView className="space-y-4 mx-3 mt-2">
        {groups.map((group) => (
          <View
            key={group.id}
            className="flex-row justify-between items-center border border-gray-200 rounded-lg p-3 mb-4"
          >
            <View className="flex-col gap-1 max-w-[60%]">
              <Text className="font-semibold text-sm text-black">{group.name}</Text>
              <Text className="text-xs text-gray-400">{group.status}</Text>
              <View className="flex flex-row gap-4 justify-center items-center">
                <TouchableOpacity className="mt-1 w-14 border-2 border-indigo-300 rounded-md py-1 px-2 active:bg-orange-500">
                  <Text className="text-indigo-600 text-xs font-medium text-center">Join</Text>
                </TouchableOpacity>
                <TouchableOpacity className="mt-1 w-14 border-2 border-blue-300 rounded-md py-1 px-2  active:bg-orange-500">
                  <Text className="text-black-600 text-xs font-medium text-center">Mời</Text>
                </TouchableOpacity>
                <TouchableOpacity className="mt-1 w-14 py-1 px-2">
                 <Image source={icons.del} className="w-5 h-5 mx-auto" resizeMode="contain" />
                </TouchableOpacity>
              </View>
            </View>
            <Image
              source={{ uri: group.image }}
              className="w-20 h-14 rounded-md"
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>

      {/* Modal Tạo Nhóm */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-center bg-opacity-40 px-6">
          <View className="bg-white rounded-lg p-4 border-2">
            <Text className="text-lg font-semibold mb-3 text-center">Tạo Nhóm Mới</Text>

            <TextInput
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholder="Nhập tên nhóm"
              className="border border-gray-300 rounded-md px-3 py-2 mb-3"
            />

            <Text className="text-sm font-medium mb-2">Chọn ảnh nhóm:</Text>
            <FlatList
              data={sampleImages}
              horizontal
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setSelectedImage(item)} className="mr-3">
                  <Image
                    source={{ uri: item }}
                    className={`w-16 h-16 rounded-md border-2 ${
                      selectedImage === item ? 'border-indigo-500' : 'border-transparent'
                    }`}
                  />
                </TouchableOpacity>
              )}
            />

            <View className="flex-row justify-end mt-4 space-x-3">
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  collapseButton(); // Thu nút lại
                }}                
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateGroup}
                className="px-4 py-2 bg-indigo-600 rounded-md ml-5"
              >
                <Text className="text-white font-medium">Tạo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
export default GroupsApp;
