#!/bin/bash
sudo apt-get update 2> /dev/null
sudo apt-get install -y npm nodejs xvfb
if [ $? -ne 0 ] ; then
        echo depenencies install failed. Please use the installer of your choice to grab them
        echo examples:
        echo apt-get install xvfb npm nodejs
        echo yum install xvfb xvfb npm nodejs
fi
sudo npm install
