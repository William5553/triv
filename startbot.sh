# /bin/sh
while true; do
    echo "Starting Bot ..."
    node -r dotenv/config index.js
    echo "Restarting in 5 seconds..."
    sleep 5
done