import { useState } from "react";
import { router, usePathname } from "expo-router";
import { View, TouchableOpacity, Image, TextInput, Alert } from "react-native";

import { icons } from "../constants";

const SearchInput = ({ initialQuery }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View className="flex flex-row items-center space-x-7  h-10 mx-auto bg-[#F3F4F6FF] rounded-2xl border-2 border-[#efefff] mt-3">
      <Image source={icons.search} className="max-w-[25px] ml-2" resizeMode="contain" />
      <TextInput
        className="text-base  text-black flex-1 font-pregular outline-none ml-0"
        value={query}
        placeholder="Tìm kiếm nhóm"
        placeholderTextColor="#0a101"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (query === "")
            return Alert.alert(
              "Thiếu thông tin",
              "Yêu cầu nhập dữ liệu tìm kiếm!"
            );

          if (pathname.startsWith("/search")) router.setParams({ query });
          else router.push(`/search/${query}`);
        }}
      >
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
