import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import ButtonExtend from '../../components/ButtonExtend';
import { icons } from '../../constants';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Alert, Animated } from 'react-native'; // nằm ở đầu file
// import socket from '../../utils/socket.js';
import AntDesign from '@expo/vector-icons/AntDesign';



// 👉 Hàm lấy JWT token từ AsyncStorage
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token;
  } catch (e) {
    console.error('Lỗi khi lấy token:', e);
    return null;
  }
};
const Calendar = () => {
  // Hiệu ứng nút
  const widthAnim = useRef(new Animated.Value(44)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [addSessionVisible, setAddSessionVisible] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [formData, setFormData] = useState({
    dateTime: null,
    title: '',
    linkOrFile: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);


  // useEffect(() => {
  //   socket.connect();
  
  //   return () => {
  //     socket.disconnect(); // cleanup
  //   };
  // }, []);

  const fetchSchedule = async () => {
    try {
      const token = await getToken();
      console.log('📌 Token lấy được:', token);
      if (!token) return;
  
      const res = await fetch('http://192.168.0.105:8017/api/v1/schedule', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const data = await res.json();
      if (res.ok) {
        setSessions(
          data.map((item) => ({
            id: item._id,
            date: new Date(item.datetime).toLocaleString(),
            title: item.title,
            subject: item.description,
          }))
        );
      } else {
        console.warn('API lỗi:', data);
      }
    } catch (err) {
      console.error('Lỗi khi lấy lịch:', err);
    }
  };
  

  useFocusEffect(
    useCallback(() => {
      fetchSchedule(); // ✅ Không cần truyền token nữa
    }, [])
  );
  

  const addSession = async () => {
    if (!formData.dateTime || !formData.title) return;

    try {
      const token = await getToken(); // Hàm này bạn dùng ở nơi khác rồi
        console.log('📌 Token lấy được:', token);
      if (!token) return;
      
      const res = await fetch('http://192.168.0.105:8017/api/v1/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.linkOrFile,
          datetime: new Date(formData.dateTime),
        }),
      });
      const newSession = await res.json();
      if (!res.ok) throw new Error(newSession.message || 'Thêm thất bại');

      setSessions((prev) => [
        ...prev,
        {
          id: newSession._id,
          date: new Date(newSession.datetime).toLocaleString(),
          title: newSession.title,
          subject: newSession.description,
        },
      ]);

      setFormData({ dateTime: null, title: '', linkOrFile: '' });
      setAddSessionVisible(false);
      collapseButton();
    } catch (err) {
      console.error('Lỗi khi thêm lịch:', err);
    }
  };
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
        setAddSessionVisible(true);
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
  return (
    <SafeAreaView className="bg-white h-full">
      <View className="space-y-4 mx-3">
        <View className="flex-row justify-between items-center">
          <Text className="font-semibold text-2xl flex-1 text-center ml-7 text-gray-200">Calendar Learning</Text>
          <ButtonExtend />
        </View>
        <Image
          className="rounded-xl w-full h-60 mb-4 mt-4"
          source={{ uri: 'https://storage.googleapis.com/a1aa/image/ce5a4446-bd92-418c-1995-91c56c27fa3e.jpg' }}
          resizeMode="cover"
        />
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-semibold text-red-500">Lịch Sắp Tới</Text>
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
                    Thêm Lịch
                  </Animated.Text>
              </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
      <ScrollView className="bg-white flex-1 p-4">
        <View className="space-y-4 mb-4 p-4">
          {sessions.map((item) => (
            <SessionItem key={item.id} date={item.date} title={item.title} subject={item.subject} />
          ))}
        </View>
        <Modal visible={addSessionVisible} transparent animationType="fade">
          <View className="flex-1 bg-opacity-40 justify-center items-center">
            <View className="bg-white rounded-xl w-11/12 max-h-[90%] p-6 border-2 border-gray-200">
              <Text className="text-xl font-semibold mb-4 text-center">Thêm Lịch</Text>
              <View className="space-y-3">
                <View>
                  <Text className="text-base font-semibold mb-1">Ngày giờ</Text>
                  <TouchableOpacity
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    onPress={() => {
                      if (Platform.OS === 'ios') {
                        setShowDatePicker(true);
                      } else {
                        setShowDatePicker(true);
                      }
                    }}
                  >
                    <Text className="text-base text-gray-800">
                      {formData.dateTime
                        ? new Date(formData.dateTime).toLocaleString()
                        : 'Chọn ngày và giờ'}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={formData.dateTime ? new Date(formData.dateTime) : new Date()}
                      mode={Platform.OS === 'ios' ? 'datetime' : 'date'}
                      display={Platform.OS === 'ios' ? 'inline' : 'default'}
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (event.type === 'set' && selectedDate) {
                          if (Platform.OS === 'ios') {
                            setFormData((prev) => ({ ...prev, dateTime: selectedDate }));
                          } else {
                            setFormData((prev) => ({ ...prev, dateTime: selectedDate }));
                            setShowTimePicker(true);
                          }
                        }
                      }}
                    />
                  )}
                  {showTimePicker && (
                    <DateTimePicker
                      value={formData.dateTime ? new Date(formData.dateTime) : new Date()}
                      mode="time"
                      display="default"
                      onChange={(event, selectedTime) => {
                        setShowTimePicker(false);
                        if (event.type === 'set' && selectedTime) {
                          const current = new Date(formData.dateTime);
                          current.setHours(selectedTime.getHours());
                          current.setMinutes(selectedTime.getMinutes());
                          setFormData((prev) => ({ ...prev, dateTime: current }));
                        }
                      }}
                    />
                  )}
                </View>
                <View>
                  <Text className="text-base font-semibold mb-1 mt-2">Tiêu đề</Text>
                  <TextInput
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-base"
                    placeholder="Nhập tiêu đề"
                    value={formData.title}
                    onChangeText={(text) => setFormData({ ...formData, title: text })}
                  />
                </View>
                <View>
                  <Text className="text-base font-semibold mb-1 mt-2">Link hoặc mô tả</Text>
                  <TextInput
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-base"
                    placeholder="Nhập link Zoom hoặc mô tả"
                    value={formData.linkOrFile}
                    onChangeText={(text) => setFormData({ ...formData, linkOrFile: text })}
                    keyboardType="url"
                    autoCapitalize="none"
                  />
                </View>
                <View className="flex items-center mt-3">
                  <TouchableOpacity className="bg-indigo-600 px-4 py-2 rounded-md" onPress={addSession}>
                    <Text className="text-white text-base font-semibold">Thêm</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Pressable className="absolute top-3 right-3" onPress={() => {
                  setAddSessionVisible(false);
                  collapseButton(); // Thu nút lại
                }} >
                <AntDesign name="closecircleo" size={24} color="black" />
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const SessionItem = ({ date, title, subject }) => (
  <View className="border-2 mb-2 p-3 rounded-lg border-gray-200">
    <Text className="text-gray-500 text-xl mb-1 text-center">{date}</Text>
    <Text className="font-normal text-2xl mb-1 text-center">{title}</Text>
    <Text className="text-indigo-600 text-xl text-center">{subject}</Text>
  </View>
);

export default Calendar;

