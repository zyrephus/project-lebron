import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";
import StatsScreen from "../screens/StatsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ accessibilityState, onPress, iconName }) => {
  const isFocused = accessibilityState.selected;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tabBarButton}
    >
      <Ionicons
        name={iconName}
        size={50}
        color={isFocused ? "#88B3E6" : "#fff"} // Change icon color when pressed
        marginTop={20}
      />
    </TouchableOpacity>
  );
};

const BottomNav = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
      }}
      tabBarOptions={{
        style: styles.tabBarOptions,
      }}
    >
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} iconName="stats-chart" />
          ),
        }}
      />

      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} iconName="basketball" />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} iconName="person" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: 100,
    position: "absolute",
    backgroundColor: "#1B263B",
    borderTopWidth: 0,
    elevation: 0,
    borderTopColor: "transparent",
  },
  tabBarOptions: {
    display: 'flex',
    backgroundColor: "transparent",
  },
  tabBarButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BottomNav;