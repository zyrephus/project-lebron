import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, StatusBar, Touchable } from 'react-native'
import React, { useState, useEffect } from 'react';
import Stopwatch from '../components/Stopwatch';
import { useRoute } from '@react-navigation/native';
import { fetchJsonData, url } from './functions';


const WorkoutStart = ({ navigation }: {navigation: any}) => { //type check fix later
    const [playerData, setPlayerData] = useState({ shotsMade: 0, shotsTaken: 0, shotsMissed: 0 });

    useEffect(() => {
      // Function to fetch data
      const fetchData = () => {
        fetchJsonData(url + "player-stats")
          .then(data => {
            const latestData = data[data.length - 1];
            if (latestData.status === "active") {
              setPlayerData(latestData);
            }
          })
          .catch(error => console.error('Error in fetching data:', error));
      };
    
      // Initial fetch
      fetchData();
    
      // Set up polling
      const interval = setInterval(fetchData, 10000); // Polling every 10 seconds
    
      // Clear interval on component unmount
      return () => clearInterval(interval);
    }, []);

    const route = useRoute();
    const autoStart = (route as any).params?.autoStart || false; //there's a type checking error here, I got rid of it manually, but we should fix it properly later 
  
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={'light-content'} />
  
        {/* title text */}
        <Stopwatch autoStart={autoStart} />
  
        {/* big circle */}
        <SafeAreaView style={styles.bigCircle}>
          <Text style={styles.bigCircleTxt}>{playerData.shotsTaken != 0 ? (Math.round((playerData.shotsMade/playerData.shotsTaken)*100)).toString() + "%" : 0}</Text>
        </SafeAreaView>

  
        {/* text over small circles */}
        <SafeAreaView style={styles.tagsContainer}>
          <Text style={styles.tagsText}>Made</Text>
          <Text style={styles.tagsText}>Missed</Text>
        </SafeAreaView>
  
        {/* small circles */}
        <SafeAreaView style={styles.bottomCircles}>
          <SafeAreaView style={styles.smallCircles}>
            <Text style={styles.smallCircleMade}>{playerData.shotsMade}</Text>
          </SafeAreaView>
          <SafeAreaView style={styles.smallCircles}>
            <Text style={styles.smallCircleMissed}>{playerData.shotsMissed}</Text>
          </SafeAreaView>
        </SafeAreaView>
  
        {/* button */}
        <TouchableOpacity 
          style={styles.startButton} 
          onPress={() => {
            console.log('Pressed!')
            const request = new Request(url + "end");

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
            navigation.navigate('WorkoutEnd')
          }}>
          <Text style={styles.startButtonText}>End</Text>
        </TouchableOpacity>
        
        <SafeAreaView style={styles.tagsContainer}>
          <Text style={styles.bottomText}>Pause</Text>
          <Text style={styles.bottomText} onPress={() => {navigation.navigate('Home')
          }}>Cancel</Text>
        </SafeAreaView>
  
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
      marginBottom: 30,
      fontSize: 48,
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
      fontSize: 70,
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
    smallCircleMade: {
      color:'#497741',
      fontSize: 70,
      fontWeight: "900",
    },
    smallCircleMissed: {
        color:'#A05050',
        fontSize: 70,
        fontWeight: "900",
      },
    startButton: {
      width: 250,
      heigth: 50,
      borderRadius: 20,
      alignItems: 'center',
      backgroundColor: '#415A77',
      marginTop: 20,
      marginBottom: 30,
    },
    startButtonText: {
      color: '#DCDCDC',
      fontSize: 30,
      marginVertical: 15,
      fontWeight: '800',
    },
    bottomText: {
        color:'#fff',
        marginHorizontal: 50,
        fontSize: 24,
        fontWeight: "900",
    },
  })

export default WorkoutStart