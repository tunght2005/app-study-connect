import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonExtend from '../../components/ButtonExtend';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const API_BASE = 'http://192.168.0.105:8017/api/v1/qa';
const { height } = Dimensions.get('window');

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token;
  } catch (e) {
    console.error('Lỗi khi lấy token:', e);
    return null;
  }
};
const QuestA = () => {
  const [questions, setQuestions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAnswerOptionsVisible, setModalAnswerOptionsVisible] = useState(false);
  const [modalExplanationVisible, setModalExplanationVisible] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    explanation: '',
    correctAnswerIndex: '',
    answers: ['', '', '', ''],
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_BASE}/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.log('Lỗi khi tải câu hỏi:', error.message);
    }
  };

const addQuestion = async () => {
  if (!form.title || !form.description || form.answers.some((a) => a === '') || form.correctAnswerIndex === '') {
    Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin.');
    return;
  }

  const index = parseInt(form.correctAnswerIndex, 10);
  if (isNaN(index) || index < 0 || index > 3) {
    Alert.alert('Lỗi', 'Đáp án đúng phải là một số từ 0 đến 3.');
    return;
  }

  const token = await AsyncStorage.getItem('token');
  const userId = await AsyncStorage.getItem('userId'); // lấy userId đã lưu khi login
  if (!token || !userId) {
    Alert.alert('Lỗi', 'Không tìm thấy token hoặc userId. Vui lòng đăng nhập lại.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        explanation: form.explanation,
        correctAnswerIndex: index,
        answers: form.answers.map((text) => ({ text })),
        author: userId, 
      }),
    });
    console.log('userId', userId)

    const data = await res.json();
    console.log('Phản hồi từ server:', data);

    if (res.ok) {
      setQuestions((prev) => [...prev, data]);
      setForm({
        title: '',
        description: '',
        explanation: '',
        correctAnswerIndex: '',
        answers: ['', '', '', ''],
        author: userId
      });
      setModalVisible(false);
    } else {
      Alert.alert('Lỗi', data.message || 'Không thể thêm câu hỏi.');
    }
  } catch (err) {
    console.log('Lỗi khi thêm câu hỏi:', err.message);
  }
};

  const submitAnswer = async (questionId, idx) => {
    try {
      setSelectedAnswerIndex(idx);
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_BASE}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId,
          selectedAnswerIndex: idx,
        }),
      });

      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log('Lỗi khi gửi đáp án:', error.message);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="space-y-4 mx-3 mt-2">
        <View className="flex-row justify-between items-center">
          <Text className="font-semibold text-2xl flex-1 text-center ml-7 text-gray-200">Q&A Section</Text>
          <ButtonExtend />
        </View>
        <Text className="text-xl text-center italic text-red-600">Trả lời các câu hỏi dưới đây</Text>
        <ScrollView className="space-y-3" style={{ maxHeight: height * 0.7 }}>
          {questions.map((q, index) => (
            <View key={index} className="flex-row justify-between border-2 border-gray-200 rounded-lg p-4 bg-white shadow-sm mt-4">
              <View className="w-[65%]">
                <Text className="font-semibold text-xl mb-1 text-gray-200">{q.title}</Text>
                <Text className="text-xl text-gray-500 italic mb-2">{q.description}</Text>
                <View className="flex-row space-x-3 justify-between">
                  <TouchableOpacity
                    className="border-2 border-indigo-600 rounded px-3 py-1"
                    onPress={() => {
                      setSelectedQuestion(q);
                      setModalAnswerOptionsVisible(true);
                      setSelectedAnswerIndex(null);
                    }}
                  >
                    <AntDesign name="carryout" size={24} color="green" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="border-2 border-indigo-600 rounded px-3 py-1"
                    onPress={() => {
                      setSelectedQuestion(q);
                      setModalExplanationVisible(true);
                    }}
                  >
                    <MaterialIcons name="question-answer" size={24} color="orange" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
          <View className="items-center my-6">
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="bg-indigo-600 px-6 py-2 rounded-md flex-row items-center space-x-2"
            >
              <Text className="text-white font-semibold">Thêm câu hỏi</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Modal Thêm câu hỏi */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="bg-white bg-opacity-40 justify-center items-center border-2 rounded-lg">
          <View className="bg-white w-[300px] max-h-[80%] rounded-lg p-1">
            <Text className="text-2xl font-semibold text-center mb-4">Thêm Câu Hỏi Mới</Text>
            <ScrollView className="space-y-3">
              {['title', 'description', 'explanation', 'correctAnswerIndex'].map((key) => (
                <View key={key}>
                  <Text className="text-base font-semibold mb-1 capitalize">{key}</Text>
                  <TextInput
                    value={form[key]}
                    onChangeText={(text) => setForm((prev) => ({ ...prev, [key]: text }))}
                    placeholder={`Enter ${key}`}
                    className="border border-gray-300 rounded px-3 py-2 text-base"
                    keyboardType={key === 'correctAnswerIndex' ? 'numeric' : 'default'}
                  />
                </View>
              ))}
              {form.answers.map((ans, idx) => (
                <View key={idx}>
                  <Text className="text-base font-semibold mb-1">Đáp án {idx + 1}</Text>
                  <TextInput
                    value={ans}
                    onChangeText={(text) => {
                      const newAnswers = [...form.answers];
                      newAnswers[idx] = text;
                      setForm((prev) => ({ ...prev, answers: newAnswers }));
                    }}
                    placeholder={`Nhập đáp án ${idx + 1}`}
                    className="border border-gray-300 rounded px-3 py-2 text-base"
                  />
                </View>
              ))}
            </ScrollView>
            <View className="flex-row justify-between space-x-3 mt-4">
                <TouchableOpacity
                  className="px-4 py-2 border border-gray-300 rounded"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-gray-700">Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity className="px-4 py-2 bg-orange-600 rounded" onPress={addQuestion}>
                  <Text className="text-white">Thêm Câu Hỏi</Text>
                </TouchableOpacity>
              </View>
          </View>
        </View>
      </Modal>

      {/* Modal chọn đáp án */}
      <Modal visible={modalAnswerOptionsVisible} transparent animationType="fade">
        <View className="flex-1 bg-black bg-opacity-40 justify-center items-center">
          <View className="bg-white w-11/12 rounded-lg p-6">
            <Text className="text-lg font-semibold text-center mb-4">Chọn 1 Đáp Án</Text>
            {selectedQuestion?.answers?.map((a, idx) => {
              let bgColor = 'bg-gray-100';
              if (selectedAnswerIndex !== null) {
                if (idx === selectedQuestion.correctAnswerIndex) bgColor = 'bg-green-200';
                else if (idx === selectedAnswerIndex) bgColor = 'bg-red-200';
              }
              return (
                <TouchableOpacity
                  key={idx}
                  className={`p-3 rounded-lg mb-2 ${bgColor}`}
                  disabled={selectedAnswerIndex !== null}
                  onPress={() => submitAnswer(selectedQuestion.id, idx)}
                >
                  <Text className="text-sm">• {a.text}</Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              onPress={() => {
                setModalAnswerOptionsVisible(false);
                setSelectedAnswerIndex(null);
              }}
              className="mt-4 bg-indigo-600 px-4 py-2 rounded"
            >
              <Text className="text-white text-center">Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal giải thích */}
      <Modal visible={modalExplanationVisible} transparent animationType="fade">
        <View className="flex-1 bg-black bg-opacity-40 justify-center items-center">
          <View className="bg-white w-10/12 rounded-lg p-5">
            <Text className="text-base font-semibold mb-3">Đáp án đúng</Text>
            <Text className="text-sm text-green-600 mb-2">
              {selectedQuestion?.answers?.[selectedQuestion.correctAnswerIndex]?.text || 'Không rõ'}
            </Text>
            <Text className="text-base font-semibold mb-2">Giải thích</Text>
            <Text className="text-sm text-gray-700 mb-4">{selectedQuestion?.explanation}</Text>
            <TouchableOpacity
              onPress={() => setModalExplanationVisible(false)}
              className="bg-indigo-600 px-4 py-2 rounded"
            >
              <Text className="text-white text-center">Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default QuestA;
