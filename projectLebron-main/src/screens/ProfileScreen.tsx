import { StyleSheet, Text, Image, View, SafeAreaView, StatusBar, ImageBackground } from 'react-native'
import React from 'react'


const ProfileScreen = () => {

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'light-content'} />


      <SafeAreaView style={styles.topContainer}>
        <Text style={styles.topText}>Bronny James</Text>
        <Text style={[styles.topText, {fontSize: 20, fontWeight: '900'}]}>CO 2023</Text>
      </SafeAreaView>

      <View style={styles.circleContainer}>
        <Text style={[styles.topText, {fontSize: 20, color: '#415A77', marginTop: 20}]}>@bronnyjames</Text>
        <Image source={require("../assets/bronny.png")} style={styles.bigCircle}/>
      </View>

      <View style={[styles.container, {alignItems: 'center', marginTop: 20}]}>
        <View style={[styles.statsContainer]}>
          <View style={styles.columnContainer}>

            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>height</Text>
              <Text style={[styles.labelText, {marginTop: 16, fontSize: 22, color: '#D9D9D9'}]}>6'3"</Text>
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>weight</Text>
              <Text style={[styles.labelText, {marginTop: 16, fontSize: 22, color: '#D9D9D9'}]}>181 lbs</Text>
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>position</Text>
              <Text style={[styles.labelText, {marginTop: 16, fontSize: 22, color: '#D9D9D9'}]}>PG | SG</Text>
            </View>

          </View>

          <View style={[styles.columnContainer, {alignItems: 'flex-start'}]}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>school</Text>
              <Text style={[styles.labelText, {marginTop: 16, fontSize: 20, color: '#D9D9D9'}]}>Sierra Canyon</Text>
            </View>
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>state</Text>
              <Text style={[styles.labelText, {marginTop: 16, fontSize: 22, color: '#D9D9D9'}]}>CA</Text>
            </View>
          </View>
        </View>

        <View style={[styles.statsContainer, {marginTop: 40, width: '65%'}]}>

          <View style={styles.columnContainer}>
            <View style={[styles.labelContainer, {marginTop: 0}]}>
                <Text style={[styles.labelText, {fontSize: 24, color: '#D9D9D9'}]}>Lifetime Stats</Text>
            </View>
          </View>

          <View style={styles.columnContainer}>
            <View style={styles.labelContainer}>
                <Text style={[styles.labelText, {marginTop: 0}]}>made</Text>
                <Text style={[styles.labelText, {marginTop: 16, fontSize: 26, color: '#6AA760'}]}>243</Text>
              </View>
              <View style={styles.labelContainer}>
                <Text style={[styles.labelText, {marginTop: 0}]}>taken</Text>
                <Text style={[styles.labelText, {marginTop: 16, fontSize: 26, color: '#D9D9D9'}]}>857</Text>
              </View>
            </View>
        </View>
      </View>
      

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B263B',
  },

  topContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },

  topText: {
    color:'white',
    marginRight: 15,
    marginLeft: 15,
    marginTop: 20,
    fontSize: 30,
    fontWeight: '900',
  },

  circleContainer: {
    alignItems: 'center',
  },

  columnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    marginTop: 25,
  },

  labelContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  labelText: {
    fontWeight: '900',
    fontSize: 18,
    color: '#415A77',
    marginLeft: 20,
    marginRight: 20,
  },

  bigCircle: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 20,
    borderRadius: 150,
    backgroundColor: '#DCDCDC',
    borderColor: "#415A77",
    borderWidth: 7,
  },
  header: {
    alignItems: 'flex-start',
    marginLeft: 20,
  },
  statsContainer: {
    backgroundColor: '#0D1B2A',
    borderRadius: 25,
    padding: 0,
    width: '85%', 
    height: 200, 
    marginTop: 0,
  },
})

export default ProfileScreen