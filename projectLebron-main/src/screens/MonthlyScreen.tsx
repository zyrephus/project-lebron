import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchJsonData, convertToISO8601, formatTime, url } from './functions';
import {
  StackedBarChart,
  ContributionGraph
} from "react-native-chart-kit";
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
import Icon from 'react-native-vector-icons/FontAwesome';

const MonthlyScreen = () => {
  let month_totals = { shotsMade: 0, shotsTaken: 0, shotsMissed: 0, timeOfSession: 0, highestStreak: 0};

  let week_totals: any[] =  [];
  for (let i=0;i<4;i++) {
    week_totals.push({ shotsMade: 0, shotsTaken: 0, shotsMissed: 0, timeOfSession: 0, highestStreak: 0});
  }

  let commits_data: any[] = [];
  for (let i=0;i<30;i++) {
    commits_data.push({ date: "-1", count: 0 });
  }

  const [weekTotals, setWeekTotals] = useState(week_totals);
  const [monthData, setMonthData] = useState({ shotsMade: 0, shotsTaken: 0, shotsMissed: 0, timeOfSession: 0, highestStreak: 0});
  const [commitsData, setCommitsData] = useState(commits_data);

  function categorizeDateByWeeks(dateStr: string): number {
    // Assuming dateStr format is "Sat Nov 25 16:53:58 2023"

    const parts = dateStr.split(' ');
    const year = parseInt(parts[4]);
    const month = monthNames.indexOf(parts[1]);
    const day = parseInt(parts[2]);

    // Get current date values using Date object
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // Month is 0-indexed
    const currentDay = currentDate.getDate();

    // Calculate differences
    const yearDiff = currentYear - year;
    const monthDiff = currentMonth - month;
    const dayDiff = currentDay - day;

    // Calculate total difference in days (very approximate, ignores leap years and varying month lengths)
    const totalDaysDiff = yearDiff * 365 + monthDiff * 30 + dayDiff;

    if (totalDaysDiff < 7) {
        return 0; // within a week
    } else if (totalDaysDiff < 14) {
        return 1; // within two weeks
    } else if (totalDaysDiff < 21) {
        return 2; // within three weeks
    } else {
        return 3; // within four weeks
    } 
}

function getDayNumber(dateStr: string): number {
  // Assuming dateStr format is "Sat Nov 25 16:53:58 2023"
  
  const parts = dateStr.split(' ');
  const day = parseInt(parts[2]);

  return day;
}

  function isCurrentMonth(dateStr: string): boolean {
    const datePattern = /^.* (\w{3}) (\d{2}) (\d{2}:\d{2}:\d{2}) (\d{4})$/;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const match = dateStr.match(datePattern);
    if (!match) {
        return false; // Invalid format
    }

    const monthStr = match[1];
    const year = parseInt(match[4]);

    const monthIndex = monthNames.indexOf(monthStr);
    if (monthIndex === -1) {
        return false; // Invalid month
    }

    const currentDate = new Date();
    return year === currentDate.getFullYear() && monthIndex === currentDate.getMonth();
}

  useEffect(() => {
    // Function to fetch data
    const fetchData = () => {
      fetchJsonData(url + "player-stats")
        .then(data => {
          let month_totals = { shotsMade: 0, shotsTaken: 0, shotsMissed: 0, timeOfSession: 0, highestStreak: 0};

          let week_totals: any[] =  [];
          for (let i=0;i<4;i++) {
            week_totals.push({ shotsMade: 0, shotsTaken: 0, shotsMissed: 0, timeOfSession: 0, highestStreak: 0});
          }
        
          let commits_data: any[] = [];
          for (let i=0;i<30;i++) {
            commits_data.push({ date: "-1", count: 0 });
          }
          for (let i=0;i<data.length;i++) {
            const currentDate = new Date(new Date().toISOString().split('T')[0]);
          
            if (isCurrentMonth(data[i].date)) {
              commits_data[getDayNumber(data[i].date)-1].date = convertToISO8601(data[i].date);
              commits_data[getDayNumber(data[i].date)-1].count += 1;
              let index = categorizeDateByWeeks(data[i].date);
              try {
                week_totals[index].shotsMade += data[i].shotsMade;
                week_totals[index].shotsMissed += data[i].shotsMade;
              } catch (error) {
                console.log(error);
              }
              month_totals.shotsMade += data[i].shotsMade;
              month_totals.shotsMissed += data[i].shotsMissed;
              month_totals.shotsTaken += data[i].shotsTaken;
              month_totals.timeOfSession += data[i].timeOfSession;
              if (month_totals.highestStreak < data[i].highestStreak) {
                month_totals.highestStreak = data[i].highestStreak;
              }
            }
          }
          setMonthData(month_totals);
          setWeekTotals(week_totals);
          setCommitsData(commits_data);
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

  const data = {
    labels: ["week 1    ", "week 2   ", "week 3  ", "week 4"],
    legend: ["made", "missed"],
    data: [
      [weekTotals[3].shotsMade, weekTotals[3].shotsMissed],
      [weekTotals[2].shotsMade, weekTotals[2].shotsMissed],
      [weekTotals[1].shotsMade, weekTotals[1].shotsMissed],
      [weekTotals[0].shotsMade, weekTotals[0].shotsMissed],
    ],
    barColors: ["#58B449", "#B53E3E"]
  };

  return (

    <View style={{flex:1, backgroundColor: '#0D1B2A'}}>
      
      <View style={styles.topContainer}>
        <Text style={styles.dateText}>Monthly</Text>
      </View>


      <ScrollView style={styles.container}>
        
        {/* Weekly Totals */}
        <Text style={styles.weeklyTotals}>Weekly Totals</Text>
        <View style={styles.statsContainer}>
          
        <View style={styles.columnContainer}>
              <View style={[styles.labelContainer, {margin: 10 }]}>
                <Text style={[styles.boxText, { color: '#1B263B'}]}>Time</Text>      
                <Text style={[styles.boxText, {fontSize: 40, marginTop: 5}]}>{formatTime(monthData.timeOfSession)}</Text>        
              </View>
              <View style={[styles.labelContainer, {margin: 10, alignItems: 'flex-end'}]}>
                <View style={[styles.mediumCircles]}>
                <Text style={[styles.boxText, { fontSize: 20, marginTop: 5, color: 'white'}]}>{monthData.shotsTaken != 0 ? (Math.round((monthData.shotsMade/monthData.shotsTaken)*100)).toString() + "%" : "0%"}</Text>
                </View>      
              </View>
              <View style={[styles.labelContainer, {margin: 10, alignItems: 'flex-end'}]}>
                <View style={[styles.mediumCircles]}>
                <Text style={[styles.boxText, { fontSize: 20, marginTop: 5, color: 'white'}]}>{monthData.shotsMade} / {monthData.shotsTaken}</Text>
                </View>      
              </View>
            </View>
            <View style={styles.columnContainer}>
              <View style={[styles.labelContainer, {margin: 10 }]}>
                <Text style={[styles.boxText, { color: '#1B263B'}]}>Total</Text>      
                <Text style={[styles.boxText, { fontSize: 25, marginTop: 5 }]}>{monthData.shotsTaken}</Text>        
              </View>
              <View style={[styles.labelContainer, {margin: 10}]}>
                <Text style={[styles.boxText, { color: '#1B263B'}]}>Made</Text>      
                <Text style={[styles.boxText, { fontSize: 25, marginTop: 5 }]}>{monthData.shotsMade}</Text>      
              </View>
              <View style={[styles.labelContainer, {margin: 10}]}>    
                <Text style={[styles.boxText, { color: '#1B263B'}]}>Missed</Text>      
                <Text style={[styles.boxText, { fontSize: 25, marginTop: 5 }]}>{monthData.shotsMissed}</Text>                  
              </View>
              <View style={[styles.labelContainer, {margin: 10}]}>    
                <Text style={[styles.boxText, { color: '#1B263B'}]}>Best Streak</Text>      
                <Text style={[styles.boxText, { fontSize: 25, marginTop: 5, marginLeft: -35 }]}>{monthData.highestStreak}</Text>                  
                <View style={styles.flame}>
                  <Icon name="fire" size={28} color="orange"/>
                </View>       
              </View>
            </View>
        </View>

        {/* Daily Charts */}
        <Text style={[styles.dailyCharts, {marginBottom: 15}]}>Daily Charts</Text>
        <View style={styles.barChartContainer}>
          <StackedBarChart
            style={styles.barChart}
            data={data}
            width={400}
            height={200}
            hideLegend={true}
            withHorizontalLabels={false}
            chartConfig={{
              backgroundGradientFrom: "#415A77",
              backgroundGradientTo: "#415A77",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              propsForHorizontalLabels: {
                fontWeight: 'bold',
              },
              style: {
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                width: 900,
              },
            }}
          />
        </View>


        {/* Daily Charts */}
        <Text style={[styles.dailyCharts, {marginBottom: 15}]}>Activity</Text>
        <ContributionGraph
          values={commitsData}
          endDate={new Date(new Date().toISOString().split('T')[0])}
          numDays={30}
          width={400}
          height={350}
          style={styles.boxChart}
          horizontal={false}
          tooltipDataAttrs={false} 
          showMonthLabels={false}
          squareSize={40}
          gutterSize={4}
          chartConfig={{
            backgroundGradientFrom: "#415A77",
            backgroundGradientTo: "#415A77",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            propsForHorizontalLabels: {
              fontWeight: 'bold',
            },
            style: {
              borderRadius: 16,
              justifyContent: 'center',
              alignItems: 'center',
              width: 900,
            },
          }}
        />

    
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
    borderRadius: 40,
    flex: 1,
  },

  barChartContainer: {
    marginRight: 0,

  },

  barChart: {
    backgroundColor:'#415A77',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 75,
  },

  boxChart: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  dateText: {
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

  topPart: {
    width: '100%',
    backgroundColor: 'black',
  },
  
  statsContainer: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 20,
    width: '100%', 
    height: 205, 
    marginTop: 15,
    marginHorizontal: -10,
    flex: 0, // Prevent the container from growing
  },

  // Daily Charts
  dailyCharts: {
    color:'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 45,
  },

  chartsContainer: {
    backgroundColor: '#0D1B2A',
    borderRadius: 25,
    padding: 30,
    width: '100%',
    height: 205, 
    marginTop: 15,
    marginHorizontal: -10,
    flex: 0, // Prevent the container from growing
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  topStatsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: 20,
    alignItems: 'center',
  },
  topStats: {
    color:'#415A77',
    marginTop: 10,
    marginBottom: 30,
    marginRight: 7,
    marginLeft: 7,
    fontSize: 24,
    fontWeight: "800",
  },
  labelContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBoxContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
  },
  bottomBoxes: {
    width: 165,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 25,
    marginTop: 10,
    margin: 12,
    backgroundColor: '#415A77',
  },
  columnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 0,
  },
  bigBox: {
    width: 355,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 25,
    marginTop: 10,
    margin: 3,
    backgroundColor: '#415A77',
  },
  boxText: {
    color:'#1B263B',
    fontSize: 16,
    fontWeight: "800",
  },
  boxRowContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediumCircles: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 150,
    backgroundColor: '#415A77',
  },
  flame: {
    flexDirection: 'row',
    marginLeft: 40,
    marginTop: -30,
  },
})


export default MonthlyScreen