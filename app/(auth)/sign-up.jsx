import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import { useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from "../../components/CustomButton"
import FormField  from "../../components/FormField";
import { Link, router } from "expo-router";
import { icons } from "../../constants";

const SignUp = () => {
const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
});
const [showPassword, setShowPassword] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const submit = async () => {
  if (!form.username || !form.email || !form.password) {
    return Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
  }

  try {
    setIsSubmitting(true);

    const response = await fetch('http://192.168.0.105:8017/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Đăng ký thất bại');
    }

    Alert.alert("Thành công", "Đăng ký thành công. Mời bạn đăng nhập.");
    router.push('/sign-in');

  } catch (err) {
    Alert.alert("Lỗi", err.message);
  } finally {
    setIsSubmitting(false);
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
          <Text>StudyConnect</Text> 
            <Text className="text-sm mt-3 mb-10">
                Nhập thông tin vào để đăng ký
            </Text>
          </View>
        
          <FormField
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
            placeholder="Nhập tên của bạn"
            icon={icons.profile}
          />

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
            title="Đăng Ký"
            handlePress={submit}
            containerStyles="w-[350] mt-7 mr-auto ml-auto border bg-gray-200"
            textStyles="text-white"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg font-pregular font-light">
              Đã có tài khoản trở lại?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-normal text-gray-200"
            >
              <Text>Đăng Nhập</Text> 
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp