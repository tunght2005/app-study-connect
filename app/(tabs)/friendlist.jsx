import { Alert, Animated } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, Image, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '../../components/SearchInput';
import ButtonExtend from '../../components/ButtonExtend';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { icons } from '../../constants';

const icon = {
  defaultAvatar: 'https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/Image%20FP_2024/hinh-anime-2.jpg',
};

const FriendList = () => {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const [isJoining, setIsJoining] = useState(false); // Ngăn request trùng lặp
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
    if (!token) {
      Alert.alert('Lỗi', 'Không tìm thấy token. Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://192.168.0.105:8017/api/users/friends', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Mã trạng thái (friends):', res.status);
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Phản hồi không phải JSON:', text);
        Alert.alert('Lỗi', 'Server trả về dữ liệu không hợp lệ.');
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log('📥 Phản hồi từ API /friends:', data);

      if (res.ok) {
        const filteredFriends = data.friends || [];
        console.log('✅ Danh sách bạn bè:', filteredFriends);
        setFriends(filteredFriends);
      } else {
        console.error('❌ Lỗi API:', data.message);
        Alert.alert('Lỗi', data.message || 'Không thể tải danh sách bạn bè.');
      }
    } catch (err) {
      console.error('❌ Lỗi khi fetch danh sách bạn bè:', err);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi tải danh sách bạn bè.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinFriend = async (friendId) => {
    if (isJoining) return; // Ngăn request trùng lặp
    setIsJoining(true);

    console.log('Đang join với ID:', friendId);
    if (!friendId) {
      Alert.alert('Lỗi', 'ID bạn bè không hợp lệ.');
      setIsJoining(false);
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        Alert.alert('Lỗi', 'Không tìm thấy token. Vui lòng đăng nhập lại.');
        setIsJoining(false);
        return;
      }

      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Lỗi', 'Không tìm thấy ID người dùng.');
        setIsJoining(false);
        return;
      }

      const res = await fetch(`http://192.168.0.105:8017/api/v1/chat/friend`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: userId,
          recipient: friendId,
          content: '',
        }),
      });

      console.log('Mã trạng thái (join):', res.status);
      console.log('Header:', res.headers);

      if (res.status === 404) {
        Alert.alert('Lỗi', 'API không tồn tại. Vui lòng kiểm tra server.');
        setIsJoining(false);
        return;
      }

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error('Phản hồi không phải JSON:', text);
        Alert.alert('Lỗi', `Server trả về dữ liệu không hợp lệ: ${text.slice(0, 200)}`);
        setIsJoining(false);
        return;
      }

      const data = await res.json();
      console.log('Phản hồi từ server:', data);

      if (res.ok) {
        router.push({
          pathname: '/(friend)/[id]',
          params: { friendId },
        });
      } else {
        Alert.alert('Lỗi', data.message || 'Không thể tham gia nhóm.');
      }
    } catch (e) {
      console.error('Lỗi trong handleJoinFriend:', e);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi tham gia nhóm.');
    } finally {
      setIsJoining(false);
    }
  };

  useEffect(() => {
    fetchFriendsAndInvites();
  }, []);

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="flex-row justify-between items-center">
        <Text className="font-semibold text-2xl flex-1 text-center ml-7 text-gray-200">Danh Sách Bạn Bè</Text>
        <ButtonExtend />
      </View>

      <View className="relative mx-3">
        <SearchInput />
      </View>

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

      <FlatList
        data={friends}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleJoinFriend(item._id)}
            disabled={isJoining} // Vô hiệu hóa khi đang gửi request
          >
            <View className="flex-row items-center space-x-4 mb-4 mx-3 border-2 border-gray-200 p-4 rounded-lg bg-blue-200">
              <Image
                source={{ uri: item.avatar || icon.defaultAvatar }}
                className="w-14 h-14 rounded-full"
              />
              <Text className="ml-6 text-xl font-semibold text-gray-200">
                {item.username}
              </Text>
              {isJoining && <Text className="ml-2 text-gray-500">Đang tải...</Text>}
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