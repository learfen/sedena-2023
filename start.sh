#npx kill-port 443;cd /home/refam/app/services/refam2;node server.js &
#!/bin/bash 
#-qO- --no-check-certificate

Observer () {
    RESPONSE=$(wget -qO- --no-check-certificate https://10.10.1.103/status)
    SPECT="ok"
    sleep 2
    if [ $RESPONSE = $SPECT ]; then
        sleep 10
    else
        pkill node
        node server.js &
        sleep 30
    fi
    Observer
}

Observer