#!/bin/sh
# entry point script to start the node server and nginx
nginx -g 'daemon off;' &\
 node ./server/src/index.js;
fg %


