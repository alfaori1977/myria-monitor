from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # allow CORS for all routes

# Dictionary to store the status of each node
node_status = {}

@app.route('/status', methods=['POST'])
def update_status():
    # Get the node ID and status from the request JSON data
    data = request.get_json()
    node_id = data['id']
    if node_id == "":  
        return ({'message': 'Empty node_id'},400)
    status = data['status']    
    hostname = data.get('hostname', '')
    ip = data.get('ip', '')
    apiKey = data.get('apiKey', '')    
    uptime = data.get('uptime', '')
    
    name = data.get('name', '')    
    customer = data.get('customer', '')
    # Update the status in the node_status dictionary
    node_status[node_id] = status
        # Update the node state
    node_status[node_id] = {
        'hostname': hostname,
        'ip': ip,
        'name': name,
        'customer': customer,
        'status': status,
        'apiKey' : apiKey,        
        'uptime' : uptime,
        'lastUpdate': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    # Return a success response
    return jsonify({'message': 'Status for node {} updated to {}'.format(node_id, status)})

@app.route('/status', methods=['GET'])
def get_status():
    # Return the current status of all nodes
    return jsonify(node_status)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
