import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

import { icons } from "../constants";

const FormField = ({
  title,
  icon,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  secureTextEntry,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      {/* <Text className="text-base text-gray-100 font-pmedium">{title}</Text> */}
      <View className="w-full h-16 px-4 bg-[#f7f9fffc] rounded-2xl border-[#f7f9fffc] focus:border-gray-200 flex flex-row items-center">
      {icon && (
        <Image
          source={icon}
          className="w-6 h-6 mr-4"
          resizeMode="contain"
        />
      )}
        <TextInput
          className="flex-1 text-base font-normal outline-none"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
