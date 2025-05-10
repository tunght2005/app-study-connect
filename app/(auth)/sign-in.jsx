import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import { useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from "../../components/CustomButton"
import FormField  from "../../components/FormField";
import { Link, router } from "expo-router";
import { icons } from "../../constants";
import AsyncStorage from '@react-native-async-storage/async-storage'

const SignIn = () => {
const [form, setForm] = useState({
    email: "",
    password: "",
});
const [showPassword, setShowPassword] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const submit = async () => {
  if (!form.email || !form.password) {
    return Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu")
  }

  try {
    setIsSubmitting(true)

    const response = await fetch('http://192.168.0.105:8017/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Đăng nhập thất bại')
    }

    // Lưu token vào AsyncStorage
    await AsyncStorage.setItem('token', data.token)
    await AsyncStorage.setItem('userId', data.userId)
    console.log('>>',data)

    Alert.alert("Thành công", "Đăng nhập thành công")
    router.push('/groups') // hoặc bất kỳ trang chính nào
  } catch (err) {
    Alert.alert("Lỗi", err.message)
  } finally {
    setIsSubmitting(false)
  }
}
  return (
    <SafeAreaView className="bg-white h-full">
       <ScrollView>
        <View
          className="w-full flex justify-center px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <View className="text-3xl font-semibold text-black mt-[-40] font-psemibold justify-center items-center">
            <Text className="text-3xl font-pbold ">StudyConnect</Text> 
            <Text className="text-sm mt-3 mb-10">
                Nhập thông tin vào để đăng nhập
            </Text>
          </View>

          <FormField
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder="Nhập email của bạn"
            icon={icons.emailIcon}
          />

          <FormField
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            secureTextEntry={true}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            placeholder="Nhập mật khẩu của bạn"
            icon={icons.pwIcon}
          />

          <CustomButton
            title="Đăng Nhập"
            handlePress={submit}
            containerStyles="w-[350] mt-7 mr-auto ml-auto border bg-gray-200"
            textStyles="text-white"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg font-pregular font-light">
              Bạn chưa có tài khoản?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-normal text-gray-200"
            >
              <Text> Đăng Ký</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn