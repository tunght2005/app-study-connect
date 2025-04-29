import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import '../global.css'
export default function App() {
  return (
    <View className="flex-1 items-center justity-center bg-gray-200 ">
      <Image className="w-24 h-24 m-auto mb-0 "
        source={require('../assets/images/logo_app.svg')} 
        
      />
      <Text className="mb-auto text-5xl text-white font-pbold py-10" >
        StudyConnect
      </Text>
      <Text className="text-base text-white text-center mb-20 mr-10 ml-10 mt-[-155]">
        Bắt đầu kết nốt tăng cường kĩ năng học tập của bạn đến với mọi người!
      </Text>
      <StatusBar style="auto" />
      <TouchableOpacity className="bg-white py-2 px-5 rounded-2xl mb-auto active:bg-indigo-400 border-2 border-solid ">
        <Link href="/profile" className="text-lg font-bold active:text-white text-gray-200">BẮT ĐẦU</Link>
      </TouchableOpacity>
    </View>
  );
}

