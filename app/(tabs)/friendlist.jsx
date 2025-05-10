import { Alert, Animated } from 'react-native'; // nằm ở đầu file
import { useRef, useEffect } from 'react';
import { useRouter } from "expo-router";

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
} from 'react-native';

import { icons } from '../../constants';
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from '../../components/SearchInput';
import ButtonExtend from '../../components/ButtonExtend';
import AsyncStorage from '@react-native-async-storage/async-storage';

const icon = {
  defaultAvatar: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/hinh-anime-2.jpg',
  // Các icon khác nếu cần
};
const FriendList = () => {
  const router = useRouter();

  const [expanded, setExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [invitations, setInvitations] = useState([]);

  const widthAnim = useRef(new Animated.Value(44)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

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
        toValue: 44,
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

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('✅ Token từ AsyncStorage:', token);
    return token;
  } catch (e) {
    console.error('❌ Lỗi khi lấy token:', e);
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
    console.log('📥 Phản hồi từ API /friends:', data);

    if (res.ok) {
      const filteredFriends = (data.friends || []);

      console.log('✅ Danh sách bạn bè:', filteredFriends);

      setFriends(filteredFriends);
    } else {
      console.error('❌ Lỗi API:', data.message);
      Alert.alert('Lỗi', data.message || 'Không thể tải danh sách bạn bè.');
    }
  } catch (err) {
    console.error('❌ Lỗi khi fetch danh sách bạn bè:', err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchFriendsAndInvites();
  }, []);

const handleJoinFriend = async (friendId) => {
    console.log(' Đang join với ID:', friendId); // Log tại đây
    try {
      const token = await getToken();
      const res = await fetch(`http://192.168.0.105:8017/api/v1/chat/friend/${friendId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // body: JSON.stringify({}), // Hoặc { userId } nếu cần
      });
      const data = await res.json();
      console.log('Toàn bộ response từ backend:', data);
      if (res.ok) {
        // Alert.alert('Thông báo', 'Tham gia nhóm thành công!');
        router.push({
          pathname: "/(chat)/friend[id].jsx",
          // pathname: "/(chat)/demo.jsx",
          params: { groupId },
        });
      } else {
        Alert.alert('Lỗi', data.message || 'Không thể tham gia nhóm');
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <SafeAreaView className="bg-white h-full">
      {/* Header */}
      <View className="flex-row justify-between items-center">
        <Text className="font-semibold text-2xl flex-1 text-center ml-7 text-gray-200">Danh Sách Bạn Bè</Text>
        <ButtonExtend />
      </View>

      {/* Search */}
      <View className="relative mx-3">
        <SearchInput />
      </View>

      {/* Nút Tạo Nhóm */}
      <View className="mx-3 mb-3 flex flex-row justify-between">
        <Text className="font-semibold text-2xl text-black mt-7 mb-4">Friend List</Text>
        <Animated.View style={{ width: widthAnim }}>
          <TouchableOpacity
            onPress={handleExpand}
            className="bg-indigo-600 flex-row items-center py-1 rounded-full mt-5"
          >
            <Image source={icons.plus} className="w-6 h-6 ml-3" resizeMode="contain" />
            <Animated.Text
              style={{ opacity: opacityAnim }}
              className="text-white ml-2 font-semibold text-base"
            >
              Đang phát triển
            </Animated.Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Danh sách bạn bè */}
      <FlatList
        data={friends}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleJoinFriend()}>
            <View className="flex-row items-center space-x-4 mb-4 mx-3 border-2 border-gray-200 p-4 rounded-lg bg-blue-200">
              <Image
                source={{ uri: item.avatar ? item.avatar : icon.defaultAvatar}}
                className="w-14 h-14 rounded-full"
              />
              <Text className="ml-6 text-xl font-semibold text-gray-200">
                {item.username}
              </Text>
            </View>
        </TouchableOpacity>      
        )}
        contentContainerStyle={{ paddingTop: 8 }}
        ListEmptyComponent={
          !loading && (
            <Text className="text-center text-gray-500 mt-4 italic text-xl">
              Không có bạn bè nào.
            </Text>
          )
        }
      />


      {/* Modal phát triển */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/30 justify-center items-center"
          activeOpacity={1}
          onPress={() => {
            setModalVisible(false);
            collapseButton();
          }}
        >
          <View className="bg-white px-6 py-4 rounded-xl">
            <Text className="text-lg font-semibold">Tính năng đang phát triển</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default FriendList;
