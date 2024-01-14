import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HistoryScreen from '../screens/HistoryScreen';
import WeeklyScreen from '../screens/WeeklyScreen';
import MonthlyScreen from '../screens/MonthlyScreen';
import YearlyScreen from '../screens/YearlyScreen';

const Tab = createMaterialTopTabNavigator();

const TopNav = () => {
  return (
    <Tab.Navigator
        initialRouteName="StatsHome"
        screenOptions={{
            tabBarActiveTintColor: "#415A77",
            tabBarLabelStyle: { fontSize: 14, fontWeight: '800', color: "#fff"},
            tabBarStyle: { backgroundColor: '#415A77', height: 45, marginTop: 30, marginLeft: 17, marginRight: 17, borderRadius: 20, shadowColor: '#fff'},
            tabBarIndicatorStyle: { backgroundColor: '#919EAA', height: '100%', borderBottomStartRadius: 20, borderTopStartRadius: 20, borderTopEndRadius: 20, borderBottomEndRadius: 20},

        }}>
      <Tab.Screen name="History" component={HistoryScreen} options={{ tabBarLabel: "History"}}></Tab.Screen>
      <Tab.Screen name="Week" component={WeeklyScreen}></Tab.Screen>
      <Tab.Screen name="Month" component={MonthlyScreen}></Tab.Screen>
      <Tab.Screen name="Year" component={YearlyScreen}></Tab.Screen>
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({})

export default TopNav