#!/bin/bash


SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
STATUS_REPORTER=$SCRIPT_DIR/sendMyriaStatus.sh


IFS='
'
NODES_CSV=$1
MODE=${2:-STATUS}
API_URL=${3:-"http://185.252.235.73:5001"}

mkdir -p $SCRIPT_DIR/status

# Loop to create and start each container
for node in $(cat $1); do
  NODE_NAME=$(echo $node | awk '{print $1}')
  API_KEY=$(echo $node | awk '{print $2}')
  NODE_ID=$(echo $node | awk '{print $3}')

  CONTAINER_NAME="CONT_$NODE_NAME"
  echo "[INFO] : Processing node $NODE_NAME at $CONTAINER_NAME [mode:$MODE]"

  if [ $MODE == "FULL" ]; then 
  # Create the container
  lxc-create -t download -n $CONTAINER_NAME -- -d ubuntu -r focal -a amd64
  #continue

  # Start the container
  sudo lxc-start -n $CONTAINER_NAME -d

  # Wait for the container to start up
  sleep 5

  # Install wget
  sudo lxc-attach -n $CONTAINER_NAME -- apt-get update
  sudo lxc-attach -n $CONTAINER_NAME -- apt-get install -y wget

  # Download the script and execute it
  sudo lxc-attach -n $CONTAINER_NAME -- wget https://downloads-builds.myria.com/node/install.sh -O install.sh

  sudo lxc-attach -n $CONTAINER_NAME -- bash install.sh 
  

  elif [ $MODE == "START" ]; then
	  echo "$API_KEY" | lxc-attach -n $CONTAINER_NAME -- myria-node --start
  elif [ $MODE == "STATUS" ]; then
	  lxc-attach -n $CONTAINER_NAME -- myria-node --status
  elif [ $MODE == "STOP" ]; then
	  echo "$API_KEY" | lxc-attach -n $CONTAINER_NAME -- myria-node --stop
  elif [ $MODE == "REPORT" ]; then
	  lxc-attach -n $CONTAINER_NAME -- /usr/local/bin/myria-node --status > $SCRIPT_DIR/status/status.txt
          $STATUS_REPORTER $API_URL $SCRIPT_DIR/status/status.txt $NODE_NAME $API_KEY 
          echo $STATUS_REPORTER $API_URL $SCRIPT_DIR/status/status.txt $NODE_NAME $API_KEY 
	  sleep 1
  fi

done

echo "All containers started."
