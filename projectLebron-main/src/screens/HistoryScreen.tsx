import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, {useEffect,useState} from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { fetchJsonData, formatDate, formatTime, url } from './functions';

interface Data {
  ID: number;
  shotsTaken: number;
  shotsMade: number;
  shotsMissed: number;
  highestStreak: number;
  streak: number;
  date: string;
  timeOfSession: number;
  status: string;
}
const HistoryScreen = () => {
  const [historyData, setHistoryTotals] = useState<Data[]>([]);

  useEffect(() => {
    const fetchData = () => {
      fetchJsonData(url + "player-stats") // Ensure this URL is defined somewhere
        .then(data => {
          setHistoryTotals(data.reverse()); // Assuming data is an array of Data objects
        })
        .catch(error => console.error('Error in fetching data:', error));
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{flex:1, backgroundColor: '#0D1B2A'}}>
      
      <View style={styles.topContainer}>
        <Text style={styles.titleText}>My Progress</Text>
      </View>

      <ScrollView style={styles.container}>
        {historyData.map((item, index) => (
            <View style={styles.statsContainer}>
            <View style={[styles.cirlces]}>
              <Text style={styles.percentText}>{item.shotsTaken != 0 ? (Math.round((item.shotsMade/item.shotsTaken)*100)).toString() + "%" : "0%"}</Text>
            </View>
            <Text style={styles.dateText}>{formatDate(item.date)}</Text>
            <Text style={styles.timeTitleText}>Time</Text>
            <Text style={styles.timeText}>{formatTime(item.timeOfSession)}</Text>
            <Text style={styles.streakTitleText}>Best Streak</Text>
            <Text style={styles.streakText}>{item.highestStreak}</Text>
            <View style={styles.flame}>
              <Icon name="fire" size={28} color="orange"/>
            </View>
          </View>
        ))}


    
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#415A77',
    // alignItems: 'flex-start', // Align content to the left
    paddingTop: 20, // Padding from top
    paddingLeft: 20, // Padding from left
    paddingBottom: 100,
    borderRadius: 40,
    flex: 1,
  },

  titleText: {
    color:'white',
    fontSize: 28,
    marginTop: 20,
    fontWeight: '900',
  },

  topContainer: {
    width: '100%',
    height: 100,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D1B2A',
  },
  
  statsContainer: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 20,
    width: '100%', 
    height: 160, 
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: -10,
    flex: 0,
  },
  // Last box
  marginBottom: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 20,
    width: '100%', 
    height: 160, 
    marginTop: 10,
    marginBottom: 110,
    marginHorizontal: -10,
    flex: 0,
  },
  cirlces: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 150,
    backgroundColor: '#415A77',
  },
  dateText: {
    color:'#0D1B2A',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -75,
    marginLeft: 260,
  },
  percentText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  timeTitleText: {
    color:'#0D1B2A',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: -70,
    marginLeft: 175,
  },
  timeText: {
    color:'#0D1B2A',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 0,
    marginLeft: 150,
  },
  streakTitleText: {
    color:'#0D1B2A',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 150,
  },
  streakText: {
    color:'#0D1B2A',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 0,
    marginLeft: 165,
  },
  flame: {
    flexDirection: 'row',
    marginLeft: 205,
    marginTop: -30,
  },
})

export default HistoryScreen