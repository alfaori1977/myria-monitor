#!/bin/bash

LOG_DIR=${1:-logs}
LATEST_LOG_FILE=$(ls -1t $LOG_DIR/MYRIA.*.log | head -1 )

if [ -f $LATEST_LOG_FILE ]; then
    ls -l $LATEST_LOG_FILE
    RUNNING=$(grep 'Current Cycle Status' $LATEST_LOG_FILE | grep 'running' | wc -l)
    TOTAL=$(grep 'Processing node' $LATEST_LOG_FILE | wc -l)
    echo "Running: $RUNNING / $TOTAL"
else
    echo "No log file found"
fi
