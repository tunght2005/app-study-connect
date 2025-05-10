import { View, Text, Image } from 'react-native'
import { Tabs, Redirect } from 'expo-router'

import { icons } from "../../constants"; 

const TabIcon = ({ icon, color, name, focused }) => {
    return (
      <View className="flex items-center justify-center gap-1 mt-8">
        <Image
          source={icon}
          resizeMode="contain"
          tintColor={color}
          className="w-8 h-8"
        />
        <Text
          className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
          style={{ color: color }}
        >
          {name}
        </Text>
      </View>
    );
};

const TabsLayout = () => {
  return (
    <>
        <Tabs
        screenOptions={{
            tabBarActiveTintColor: "#636AE8FF",
            tabBarInactiveTintColor: "#CDCDE0",
            tabBarShowLabel: false,
            tabBarStyle: {
              backgroundColor: "#161622",
              borderTopWidth: 1,
              borderTopColor: "#232533",
              height: 84,
            },
          }}
        >
        <Tabs.Screen
          name="groups"
          options={{
            title: "Groups",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.groups}
                color={color}
                name=""
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="friendlist"
          options={{
            title: "FrientList",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.book}
                color={color}
                name=""
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="q&a"
          options={{
            title: "Q&A",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.qa}
                color={color}
                name=""
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: "Calendar",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.calendar}
                color={color}
                name=""
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name=""
                focused={focused}
              />
            ),
          }}
        />
        </Tabs>
    </>
  )
}

export default TabsLayout