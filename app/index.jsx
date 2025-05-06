import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, ScrollView } from 'react-native';
import { Redirect, router } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';

import '../global.css'
export default function App() {
  return (
    <SafeAreaView className="flex-1 items-center justity-center bg-gray-200 h-full">
      <ScrollView contentContainerStyle={{ height: '100%'}}>
        <View className=" flex justify-center items-center" >
          <Image className="w-24 h-24 mx-auto mt-[200px]"
            source={require('../assets/images/logo_app.png')}  
          />
          <Text className="text-5xl text-white font-pbold py-10">StudyConnect</Text>
          <Text className="text-base text-white text-center mr-[30] ml-[30]">
            Bắt đầu kết nốt tăng cường kĩ năng học tập của bạn đến với mọi người!
          </Text>
        </View>
        <StatusBar backgroundColor="#161622" style="light" />
        <CustomButton
          title="BẮT ĐẦU"
          handlePress={() => router.push("/sign-in")}
          containerStyles="w-[150] mt-7 mr-auto ml-auto border bg-white"
          textStyles="text-gray-200"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

