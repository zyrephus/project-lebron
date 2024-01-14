import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, StatusBar, Touchable } from 'react-native'
import { useEffect, useState } from 'react'
import {url} from './functions'
import React from 'react'

// https://stackoverflow.com/questions/63132548/react-navigation-5-error-binding-element-navigation-implicitly-has-an-any-ty
const HomeScreen = ({ navigation}: {navigation: any}) => {

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />

      {/* title text */}
      <Text style={styles.titleText}>Project Lebron </Text>

      {/* big circle */}
      <SafeAreaView style={styles.bigCircle}>
        <Text style={styles.bigCircleTxt}>0</Text>
      </SafeAreaView>

      {/* text over small circles */}
      <SafeAreaView style={styles.tagsContainer}>
        <Text style={styles.tagsText}>Made</Text>
        <Text style={styles.tagsText}>Missed</Text>
      </SafeAreaView>

      {/* small circles */}
      <SafeAreaView style={styles.bottomCircles}>
        <SafeAreaView style={styles.smallCircles}>
          <Text style={styles.smallCircleTxt}>0</Text>
        </SafeAreaView>
        <SafeAreaView style={styles.smallCircles}>
          <Text style={styles.smallCircleTxt}>0</Text>
        </SafeAreaView>
      </SafeAreaView>

      {/* button */}
      <TouchableOpacity 
        style={styles.startButton} 
        onPress={() => {
          console.log('Pressed!')
          const request = new Request(url + "start");

          fetch(request)
            .then((response) => {
              if (response.status === 200) {
                return response.json();
              } else {
                throw new Error("Something went wrong on API server!");
              }
            })
            .then((response) => {
              console.debug(response);
              // …
            })
            .catch((error) => {
              console.error(error);
            });
          
          navigation.navigate('WorkoutStart', { autoStart: true })
        }}>
        <Text style={styles.startButtonText}>Start</Text>
      </TouchableOpacity>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
    alignItems: 'center',
  },
  
  titleText: {
    color:'white',
    marginTop: 15,
    marginBottom: 50,
    fontSize: 32,
    fontWeight: "800",
  },

  bigCircle: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 150,
    backgroundColor: '#DCDCDC',
    borderColor: "#415A77",
    borderWidth: 10,
  },

  bigCircleTxt: {
    color:'#415A77',
    fontSize: 100,
    fontWeight: "900",
  },

  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  tagsText: {
    color:'#415A77',
    marginHorizontal: 50,
    fontSize: 25,
    fontWeight: "900",
  },

  bottomCircles: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  },

  smallCircles: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginTop: 20,
    margin: 15,
    backgroundColor: '#DCDCDC',
    borderColor: "#415A77",
    borderWidth: 7,
  },
  smallCircleTxt: {
    color:'#415A77',
    fontSize: 70,
    fontWeight: "900",
  },

  startButton: {
    width: 250,
    heigth: 50,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#415A77',
    marginTop: 40,
  },
  startButtonText: {
    color: '#DCDCDC',
    fontSize: 30,
    fontWeight: '800',
    marginVertical: 15,
  }
})

export default HomeScreen