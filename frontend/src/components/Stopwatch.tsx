import React, { useState, useRef, useEffect } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity }  
    from 'react-native'; 

const Stopwatch = ({autoStart = false}) => {

    // State and refs to manage time and stopwatch status 
    const [time, setTime] = useState(0); 
    const [running, setRunning] = useState(false); 
    const intervalRef = useRef<NodeJS.Timeout | null>(null); 
    const startTimeRef = useRef<number>(0);
    interface WorkoutStartParams {
        autoStart?: boolean;
    }

    useEffect(() => {
        if (autoStart) {
            startStopwatch();
        }
    }, [autoStart]);

    // Function to start the stopwatch 
    const startStopwatch = (): void=> { 
        startTimeRef.current = Date.now() - time * 1000; 
        intervalRef.current = setInterval(() => { 
            setTime(Math.floor((Date.now() -  
            startTimeRef.current) / 1000)); 
        }, 1000); 
        setRunning(true); 
    };  
    // Function to pause the stopwatch 
    const pauseStopwatch = () => { 
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
        }
        setRunning(false); 
    }; 
    // Function to reset the stopwatch 
    const resetStopwatch = () => { 
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
        }
        setTime(0); 
        setRunning(false); 
    }; 
    // Function to resume the stopwatch 
    const resumeStopwatch = () => { 
        startTimeRef.current = Date.now() - time * 1000; 
        intervalRef.current = setInterval(() => { 
            setTime(Math.floor( 
                (Date.now() - startTimeRef.current) / 1000)); 
        }, 1000); 
        setRunning(true); 
    }; 

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  
    return ( 
        <View style={styles.container}> 
            <Text style={styles.timeText}>{formattedTime}</Text> 
            {/* <View style={styles.buttonContainer}> 
                {running ? ( 
                    <TouchableOpacity 
                        style={[styles.button, styles.pauseButton]} 
                        onPress={pauseStopwatch} 
                    > 
                        <Text style={styles.buttonText}>Pause</Text> 
                    </TouchableOpacity> 
                ) : ( 
                    <> 
                        <TouchableOpacity 
                            style={[styles.button, styles.startButton]} 
                            onPress={startStopwatch} 
                        > 
                            <Text style={styles.buttonText}>Start</Text> 
                        </TouchableOpacity> 
                        <TouchableOpacity 
                            style={[styles.button, styles.resetButton]} 
                            onPress={resetStopwatch} 
                        > 
                            <Text style={styles.buttonText}> 
                                Reset 
                            </Text> 
                        </TouchableOpacity> 
                    </> 
                )} 
                {!running && ( 
                    <TouchableOpacity 
                        style={[styles.button, styles.resumeButton]} 
                        onPress={resumeStopwatch} 
                    > 
                        <Text style={styles.buttonText}> 
                            Resume 
                        </Text> 
                    </TouchableOpacity> 
                )} 
            </View>  */}
        </View> 
    ); 
}

const styles = StyleSheet.create({ 
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
    }, 
    header: { 
        fontSize: 30, 
        color: "green", 
        marginBottom: 10, 
    }, 
    subHeader: { 
        fontSize: 18, 
        marginBottom: 10, 
        color: "blue", 
    }, 
    timeText: { 
        fontSize: 60,
        color: '#fff',
        fontFamily: 'Roboto',
        fontWeight: '800', 
    }, 
    buttonContainer: { 
        flexDirection: 'row', 
        marginTop: 20, 
    }, 
    button: { 
        paddingVertical: 10, 
        paddingHorizontal: 20, 
        borderRadius: 5, 
    }, 
    startButton: { 
        backgroundColor: '#2ecc71', 
        marginRight: 10, 
    }, 
    resetButton: { 
        backgroundColor: '#e74c3c', 
        marginRight: 10, 
    }, 
    pauseButton: { 
        backgroundColor: '#f39c12', 
    }, 
    resumeButton: { 
        backgroundColor: '#3498db', 
    }, 
    buttonText: { 
        color: 'white', 
        fontSize: 16, 
    }, 
}); 

export default Stopwatch