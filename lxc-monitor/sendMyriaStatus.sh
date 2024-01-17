#!/usr/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

API_URL=${1:-"http://185.252.235.73:5000"}
STATUS_FILE=${2:-$SCRIPT_DIR/status.txt}
NODE_NAME=$3
API_KEY=$4
CUSTOMER=$5

CURRENT_CYCLE_STATUS=$(cat $STATUS_FILE | grep "Current Cycle Status" | awk '{print $NF}')   
CURRENT_CYCLE_UPTIME=$(cat $STATUS_FILE | grep "Current Cycle Uptime" | awk '{print $NF}')
CURRENT_NODE_ID=$(cat $STATUS_FILE | grep "Node ID" | awk '{print $NF}')
IP=$(ip addr show eth0 | grep -w inet | awk  '{print $2}' | awk -F'/' '{print $1}' | head -1)

echo "CURRENT_CYCLE_UPTIME: $CURRENT_CYCLE_UPTIME"
echo "CURRENT_CYCLE_STATUS: $CURRENT_CYCLE_STATUS"
echo "CURRENT_NODE_ID: $CURRENT_NODE_ID"

source $SCRIPT_DIR/nodeInfo.txt 2>/dev/null

cat << EOF > $SCRIPT_DIR/status.json
{
    "ip": "$IP",
    "uptime": "$CURRENT_CYCLE_UPTIME",
    "status": "$CURRENT_CYCLE_STATUS",
    "id": "$CURRENT_NODE_ID",
    "apiKey": "$API_KEY",
    "name" : "$NODE_NAME",
    "customer": "$CUSTOMER"
}
EOF

cat $SCRIPT_DIR/status.json

curl --header "Content-Type: application/json" \
    --request POST   --data @$SCRIPT_DIR/status.json \
     $API_URL/status
