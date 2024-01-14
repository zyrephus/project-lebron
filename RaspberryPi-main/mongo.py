from pymongo.mongo_client import MongoClient
import pymongo
from gpiozero import DistanceSensor
from gpiozero import MotionSensor
from time import sleep
import time
from datetime import datetime

# GLOBAL CONSTANT VARIABLES

trigPin = 23
echoPin = 24
# Avg distance (m)
DISTANCE=.5
SLEEP=2

# INITIALIZATIONS
distance_sensor = DistanceSensor(echoPin, trigPin)
vibration_sensor = MotionSensor(16,threshold=0.01) 

uri = "mongodb+srv://lebron:Nh5JGdICwa4hib6S@project-lebron-database.ppmmons.mongodb.net/?retryWrites=true&w=majority"
# Create a new client and connect to the server
client = MongoClient(uri, tls=True, tlsAllowInvalidCertificates=True)

# Connect to cluster
cluster = client['player_data']
# Connect to db
stats_db = cluster['stats']

start=True

if start:
    missed=0
    lastMiss=0
    # Add ID unique to each new stat object that increments by 1. 
    latestStat = stats_db.find_one(sort=[('ID', pymongo.DESCENDING)])
    print(latestStat['ID'])
    if latestStat:
        latestId = latestStat['ID']
    else:
        latestId = 0
    
    # Initialize and push
    start_time = time.time()
    stat = {
        "ID": latestId + 1,
        "shotsTaken": 0,
        "shotsMade":0,
        "shotsMissed":0,
        "highestStreak": 0,
        "streak": 0,
        "date": time.ctime(),
        "timeOfSession":0,
        "status": "acitve",
    }

    filter = { 'ID': stat['ID'] }
    
    # push to database
    stats_db.insert_one(stat)

    # Run sensors / use code from other file
    try:
        last_distance_time=-1
        last_vibration_time=-1
        
        while True:
            if last_distance_time<0 or (time.time()-last_distance_time)>SLEEP:
                last_distance_time=-1
                if distance_sensor.distance < DISTANCE/2:
                    last_distance_time=time.time()
                    stat['shotsMade'] += 1
                    stat['streak'] += 1
                    print('Successful shot taken')
            if last_vibration_time<0 or (time.time()-last_vibration_time)>SLEEP:
                last_vibration_time=-1
                if vibration_sensor.motion_detected:
                    last_vibration_time=time.time()
                    stat['shotsTaken'] += 1
                    print('Unsuccessful shot taken')
            
            stat['timeOfSession'] = time.time()-start_time
            stat['shotsMissed'] = stat['shotsTaken'] - stat['shotsMade']
            newvalues = { "$set": { "shotsTaken": stat['shotsTaken'],
                                    "shotsMade": stat['shotsMade'],
                                    "shotsMissed": stat['shotsMissed'],
                                    "streak": stat['streak'],
                                    "highestStreak": stat['highestStreak'],
                                    "timeOfSession": stat['timeOfSession']} }
            missed = stat['shotsMissed']
            if stat['highestStreak'] < stat['streak']:
                stat['highestStreak'] = stat['streak']
            if missed > lastMiss:
                stat['streak'] = 0
                lastMiss = missed
                
            stats_db.update_one(filter, newvalues)

            #if stats_db.findOne()['status'] == "complete":
                #print("stop")
                
            # GET LATEST AND CHECK IF PUSHED
            # IF user stops 
            sleep(0.1)
    except KeyboardInterrupt:
        print('GPIO cleaned up')
    # Read vibration = 

    #end_time = time.time()
    #stat['timeOfSession'] = (end_time-start_time)
    #dateToday = datetime.now()
    #stat['date'] = dateToday.strftime("%Y-%m-%d")

    
#updating object in database