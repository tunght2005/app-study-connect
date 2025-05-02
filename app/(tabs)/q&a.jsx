import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Pressable,
} from 'react-native';

const defaultQuestions = [
  {
    id: 1,
    title: 'Best coding tools',
    description: 'Explore popular IDEs and tools.',
    responses: 82,
    image: 'https://storage.googleapis.com/a1aa/image/e69e8cf3-e4f2-4570-00ba-b6dcff15daf1.jpg',
    answerTrue: 'Đúng',
    answerFalse: 'Sai',
  },
  {
    id: 2,
    title: 'AI career tips',
    description: 'Insights into AI job roles.',
    responses: 45,
    image: 'https://storage.googleapis.com/a1aa/image/cb0f587f-c0f0-4420-a7cc-1338205b4611.jpg',
    answerTrue: 'Đúng',
    answerFalse: 'Sai',
  },
  {
    id: 3,
    title: 'Web dev trends',
    description: 'Latest frameworks to watch.',
    responses: 67,
    image: 'https://storage.googleapis.com/a1aa/image/70c34ec6-2630-4018-9e48-438949258334.jpg',
    answerTrue: 'Đúng',
    answerFalse: 'Sai',
  },
  {
    id: 4,
    title: 'Cloud storage pros',
    description: 'Debate on best platforms.',
    responses: 30,
    image: 'https://storage.googleapis.com/a1aa/image/35d3c626-ad58-439f-4aab-83db42ec693f.jpg',
    answerTrue: 'Đúng',
    answerFalse: 'Sai',
  },
];

const QuestA = () => {
  const [questions, setQuestions] = useState(defaultQuestions);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    image: '',
    title: '',
    description: '',
    answerTrue: '',
    answerFalse: '',
    responses: '',
  });

  const addQuestion = () => {
    if (!form.image || !form.title || !form.description || !form.answerTrue || !form.answerFalse || !form.responses) return;
    const newQuestion = {
      ...form,
      id: Date.now(),
      responses: parseInt(form.responses),
    };
    setQuestions((prev) => [...prev, newQuestion]);
    setForm({ image: '', title: '', description: '', answerTrue: '', answerFalse: '', responses: '' });
    setModalVisible(false);
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="max-w-md mx-auto px-4 pt-5 space-y-4">
        <View className="flex-row justify-between items-center border-b border-gray-200 pb-3">
          <Text className="text-lg">←</Text>
          <Text className="font-semibold text-base text-center flex-grow">Q&A Section</Text>
          <Text className="text-gray-400">📊</Text>
        </View>

        {questions.map((q) => (
          <View key={q.id} className="flex-row justify-between border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <View className="w-[65%]">
              <Text className="font-semibold text-sm mb-1">{q.title}</Text>
              <Text className="text-xs text-gray-400 mb-1">{q.description}</Text>
              <Text className="text-xs text-gray-400 mb-3">Responses: {q.responses}</Text>
              <View className="flex-row space-x-3">
                <TouchableOpacity className="border border-indigo-600 rounded px-3 py-1">
                  <Text className="text-indigo-600 text-xs font-medium">{q.answerTrue}</Text>
                </TouchableOpacity>
                <TouchableOpacity className="border border-indigo-600 rounded px-3 py-1">
                  <Text className="text-indigo-600 text-xs font-medium">{q.answerFalse}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Image
              source={{ uri: q.image }}
              className="w-20 h-20 rounded-md"
              resizeMode="cover"
            />
          </View>
        ))}

        <View className="items-center my-6">
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="bg-indigo-600 px-6 py-2 rounded-md flex-row items-center space-x-2"
          >
            <Text className="text-white font-semibold">➕ Ask a Question</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black bg-opacity-40 justify-center items-center">
          <View className="bg-white w-11/12 max-h-[90%] rounded-lg p-6">
            <Text className="text-lg font-semibold text-center mb-4">Add a New Question</Text>
            <ScrollView className="space-y-3">
              {['image', 'title', 'description', 'answerTrue', 'answerFalse', 'responses'].map((key) => (
                <View key={key}>
                  <Text className="text-xs font-semibold mb-1 capitalize">{key}</Text>
                  <TextInput
                    value={form[key]}
                    onChangeText={(text) => setForm((prev) => ({ ...prev, [key]: text }))}
                    placeholder={`Enter ${key}`}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                    keyboardType={key === 'responses' ? 'numeric' : 'default'}
                  />
                </View>
              ))}
              <View className="flex-row justify-end space-x-3 mt-4">
                <TouchableOpacity
                  className="px-4 py-2 border border-gray-300 rounded"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-gray-700">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="px-4 py-2 bg-indigo-600 rounded"
                  onPress={addQuestion}
                >
                  <Text className="text-white">Add Question</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default QuestA;
