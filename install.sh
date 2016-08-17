#!/bin/bash
git submodule init
git submodule update
if [ $? -ne 0 ] ; then
        echo submodule install failed.
        echo Maybe try cloning recursively?
        echo git clone --recursive https://github.com/FrostTheFox/ptc-acc-gen.git
fi
sudo apt-get update 2> /dev/null
sudo apt-get install -y npm nodejs 
if [ $? -ne 0 ] ; then
        echo depenencies install failed. Please use the installer of your choice to grab them
        echo examples:
        echo apt-get install npm nodejs
        echo yum install npm nodejs
fi
sudo npm install
