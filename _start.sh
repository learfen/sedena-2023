#!/bin/bash
#-qO- --no-check-certificate

Observer () {
    RESPONSE=$(wget -qO- --no-check-certificate https://refam.sedena.gob.mx/status)
    SPECT="ok"
    sleep 2
    if [ $RESPONSE = $SPECT ]; then
        sleep 5
    else
        sudo npx kill-port 3002
        sudo pkill node
        sudo node server.js &
        sleep 10
    fi
    Observer
}

Observer