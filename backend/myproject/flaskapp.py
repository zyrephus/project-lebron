from flask import Flask, jsonify
from pymongo.mongo_client import MongoClient
import pymongo
import json
from bson import ObjectId

app = Flask(__name__)

# Custom JSON encoder to handle ObjectId
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

uri = "mongodb+srv://lebron:Nh5JGdICwa4hib6S@project-lebron-database.ppmmons.mongodb.net/?retryWrites=true&w=majority"
# Create a new client and connect to the server
client = MongoClient(uri, tls=True, tlsAllowInvalidCertificates=True)

# Connect to cluster
cluster = client['player_data']
# Connect to db
stats_db = cluster['stats']

@app.route('/', methods = ['GET'])
def getarticles():
    pass

@app.route('/player-stats', methods = ['GET'])
def mongo():
    data = stats_db.find() 
    data_list = []
    for document in data:
          data_list.append(document)
    json_string = json.dumps(data_list, cls=CustomJSONEncoder)
    return json_string

if __name__ == "__main__":
    app.run(debug=True)