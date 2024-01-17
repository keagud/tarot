#!/bin/sh
# entry point script to start the node server and nginx

node ./server/src/index.js &\
  nginx -g 'daemon off;' 


