#!/bin/bash

DEBUG=nightmare xvfb-run --server-args="-screen 0 1024x768x24" node index.js
cd PogoPlayer
xvfb-run --server-args="-screen 0 1024x768x24" node pogo.js
echo "Find the generated accounts in PogoPlayer/accounts.csv"
