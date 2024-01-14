from flask import Flask, jsonify
from pymongo.mongo_client import MongoClient
import pymongo
import json
from bson import ObjectId
from gpiozero import DistanceSensor
from gpiozero import MotionSensor
from time import sleep
import time
import RPi.GPIO as GPIO

# GLOBAL CONSTANT VARIABLES

trigPin = 23
echoPin = 24
uri = "mongodb+srv://lebron:Nh5JGdICwa4hib6S@project-lebron-database.ppmmons.mongodb.net/?retryWrites=true&w=majority"

# INITIALIZATIONS
app = Flask(__name__)

# Avg distance (m)
DISTANCE=.5
# Sleep b/w shots
SLEEP=2
# Know when end button pushed
COMPLETE=False

# Current ID
def get_last_stat():
    latestStat = stats_db.find_one(sort=[('ID', pymongo.DESCENDING)])
    return latestStat

# Custom JSON encoder to handle ObjectId
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)
    
# Create a new client and connect to the server
client = MongoClient(uri, tls=True, tlsAllowInvalidCertificates=True)

# Connect to cluster
cluster = client['player_data']
# Connect to db
stats_db = cluster['stats']

@app.route("/start", methods=["GET"])
def result():
    distance_sensor = DistanceSensor(echoPin, trigPin)
    vibration_sensor = MotionSensor(16,threshold=0.01) 

    latestStat = get_last_stat()
    latestId = latestStat['ID']

    # Initialize and push
    start_time = time.time()
    
    stat = {'ID': latestId+1, 
            'shotsTaken': 0, 
            'shotsMade': 0, 
            'shotsMissed': 0, 
            'highestStreak': 0, 
            'streak': 0, 
            'date': time.ctime(), 
            'timeOfSession': 0, 
            'status': 'active'}

    filter = { 'ID': stat['ID'] }
    
    # # push to database
    stats_db.insert_one(stat)

    # # Run sensors / use code from other file
    last_distance_time=-1
    last_vibration_time=-1
    
    while not COMPLETE:
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
        sleep(0.1)

    COMPLETE=False
    GPIO.cleanup()
        

@app.route('/player-stats', methods = ['GET'])
def mongo():
    data = stats_db.find() 
    data_list = []
    for document in data:
          data_list.append(document)
    json_string = json.dumps(data_list, cls=CustomJSONEncoder)
    return json_string

@app.route('/end', methods = ['GET'])
def exit():
    COMPLETE = True

    latestStat = get_last_stat()
    filter = { 'ID': latestStat['ID'] }
    newvalues = { "$set": { "status": "complete" } }

    stats_db.update_one(filter, newvalues)
    return jsonify({"Message":"Terminating, Function"})

GPIO.cleanup()

if __name__ == '__main__':
    app.run(debug=True)







