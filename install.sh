#!/bin/bash
sudo apt-get install libnss3-dev
which git 2>&1 >/dev/null
if [ $? -ne 0 ] ; then
        echo git is not currently installed
        echo Please install git before proceeding
	else
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
		else
			sudo npm install
	fi
fi
