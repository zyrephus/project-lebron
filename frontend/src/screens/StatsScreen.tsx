import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native';
import React from 'react';

import TopNav from "../navigators/TopNav";

const StatsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.titleContainer}>
        <Text style={styles.titleScreen}>Stats</Text>
      </SafeAreaView>
      <TopNav/>
      <StatusBar barStyle={'light-content'} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
    justifyContent: 'center',
  },
  listTab: {
    flex: 1, 
    backgroundColor: '#fff',
    padding: 15
  },
  titleContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  titleScreen: {
    color:'white',
    fontFamily: 'Arial',
    fontSize: 32,
    fontWeight: 'bold',
  },
})

export default StatsScreen
