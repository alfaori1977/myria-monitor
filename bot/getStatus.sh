#!/bin/bash

LOG_DIR=${1:-logs}

LATEST_LOG_FILE=$(ls -1t $LOG_DIR/MYRIA.*.log | head -1 )

if [ -f $LATEST_LOG_FILE ]; then
    ls -l $LATEST_LOG_FILE
    awk '/Processing node/ {node=$5}
        /Current Cycle Uptime/ {uptime=$5}
        /Failed to get node information/ {status="FAILED"; printf "`%-20s %s (---)`\n",  node, status;next }	
	/Current Cycle Status/ {printf "`%-20s %s (%0.2fh)`\n",  node, $5,uptime/(60*60.0) } ' $LATEST_LOG_FILE
else
    echo "No log file found"
fi
