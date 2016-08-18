@echo off
git --version
if not "%errorlevel%" == "0" (
	echo git is currently not installed, or has not been added to your system PATH
	echo please install git, or if git is already installed, run:
	echo setx PATH "%PATH%,C:\Program Files\Git\mingw64\libexec\git-core"
	echo If using 32-bit or alternate install path, replace your git path in the above command
	pause
) else (
	git submodule init 2>&1 >NUL
	git submodule update 2>&1 >NUL
	if not "%errorlevel%" == "0" (
		echo submodule install failed.
		echo Maybe try cloning recursively?
		echo git clone --recursive https://github.com/FrostTheFox/ptc-acc-gen.git
	) else (	
		node --version 2>&1 >NUL
	)
	if not "%errorlevel%" == "0" (
		echo NodeJS is not currently installed correctly. Please install that, then run "npm install" from your PokemonGo-Map folder.
	) else (
		npm install
	)
	fi
exit
