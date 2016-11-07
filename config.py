#!/usr/bin/python
# Version 1

import os
import sys
import signal
import re
from os import fsync


def signal_handler(signal, frame):
        print('You pressed Ctrl+C!')
        sys.exit(0)

def printmenu():
    os.system('cls' if os.name == 'nt' else 'clear')
    #os.system('cls') # for Windows
    #os.system('clear')

    print (30 * '-')
    print ("PTC-ACC-GEN Config Builder")
    print ("Lets set you up!")
    print (30 * '-')
    print ("1. Build Your Config")
    print ("0. Quit")
    print (30 * '-')
    choice = raw_input('Enter your choice [0-1] : ')
    try:
        choice = int(choice)
    except:
        printmenu()
    print (30 * '-')

    if choice == 1:
        configBuilder()
    elif choice == 0:
        cleanExit("bye")
    else:
        printmenu()


def configBuilder():

    "Calculates the number of accounts needed for a specific step value to achiece a specific scan time"
    startNum = raw_input("Number for Accounts to Start at (recommend 0): ")
    endNum = raw_input("Number for Accounts to End at (recommend 10): ")
    nicknameFile = raw_input("Use Nickname File? (recommend: false): ")
    randomPassword = raw_input("Use Random Password? (recommend: true): ")
    screenshotResult = raw_input("Save Screenshot of each Success? (recommend: true): ")
    screenshotOnFailure = raw_input("Save Screenshot of each Failure? (recommend: true): ")
    username = raw_input("Choose User/Display name, at least 6 chars (recommended) and less than 15: ")
    if randomPassword.lower() in ("false"):
            password = raw_input("Choose Static Password for Accounts: ")
    else:
            password = "NOSTATIC"
    emailUser = raw_input("Email Address Name (whats before the @ in your email address? ex: yoloswag420): ")
    emailDomain = raw_input("Email Domain (whats after the @ in your email address? ex: gmail.com): ")
    latitude = raw_input("Latitude for Registration (example: 36.54596): ")
    longitude = raw_input("Longitude for Registration (example: -79.22247): ")
    country = raw_input("Country Code for Registration (example: US, BE, FR, CA): ")
    
    #Now lets check what people input vs what is valid
    flag = 1
    while flag == 1:
            try:
                int(startNum)
            except ValueError:
                try:
                    float(startNum)
                except ValueError:
                    print (30 * '-')
                    print "Your Number for Accounts to Start at is not a number"
                    print "Your Current Start Number: %s" %(startNum)
                    startNum = raw_input("Number for Accounts to Start at (recommend 0): ")
                    flag = 1
            try:
                int(endNum)
            except ValueError:
                try:
                    float(endNum)
                except ValueError:
                    print (30 * '-')
                    print "Your Number for Accounts to End at is not a number"
                    print "Your Current End Number: %s" %(endNum)
                    startNum = raw_input("Number for Accounts to End at (recommend 10): ")
                    flag = 1
            try:
                int(latitude)
            except ValueError:
                try:
                    float(latitude)
                except ValueError:
                    print (30 * '-')
                    print "Your Latitude is not a number"
                    print "Your Current Latitude: %s" %(latitude)
                    latitude = raw_input("Latitude for Registration (example: 36.54596): ")
                    flag = 1
            try:
                int(longitude)
            except ValueError:
                try:
                    float(longitude)
                except ValueError:
                    print (30 * '-')
                    print "Your Longitude is not a number"
                    print "Your Current Longitude: %s" %(longitude)
                    startNum = raw_input("Longitude for Registration (example: -79.22247): ")
                    flag = 1
                    
            if startNum > endNum:
                    print (30 * '-')
                    print "Your Number for Accounts to End at must be greater than Number for Accounts to Start at"
                    print "Your Current End Number: %s Your Current Start Number: %s" %(startNum, endNum)
                    startNum = raw_input("Number for Accounts to Start at (recommend 0): ")
                    endNum = raw_input("Number for Accounts to End at (recommend 10): ")
                    flag = 1
            else:
                    flag = 0
            if nicknameFile.lower() not in ("true", "false"):
                    print (30 * '-')
                    print "You didn't type 'true' or 'false' for Use Nickname File: %s" %(nicknameFile)
                    nicknameFile = raw_input("Use Nickname File? (recommend: false): ")
                    flag = 1
            else:
                    flag = 0                    
            if randomPassword.lower() not in ("true", "false"):
                    print (30 * '-')
                    print "You didn't type 'true' or 'false' for Use Random Password: %s" %(randomPassword)
                    randomPassword = raw_input("Use Random Password? (recommend: false): ")
                    flag = 1
            else:
                    flag = 0
            if screenshotResult.lower() not in ("true", "false"):
                    print (30 * '-')
                    print "You didn't type 'true' or 'false' for Save Screenshot of each Success: %s" %(screenshotResult)
                    screenshotResult = raw_input("Save Screenshot of each Success? (recommend: true): ")
                    flag = 1
            else:
                    flag = 0
            if screenshotOnFailure.lower() not in ("true", "false"):
                    print (30 * '-')
                    print "You didn't type 'true' or 'false' for Save Screenshot of each Failure: %s" %(screenshotOnFailure)
                    screenshotOnFailure = raw_input("Save Screenshot of each Failure? (recommend: true): ")
                    flag = 1
            else:
                    flag = 0
            if len(username) < 6:
                    print (30 * '-')
                    print "You chose a username that was less than 6 chars: %s" %(username)
                    username = raw_input("Choose User/Display name, at least 6 chars and less than 15: ")
                    flag = 1
            elif len(username) > 15:
                    print (30 * '-')
                    print "You chose a username that was more than 15 chars: %s" %(username)
                    username = raw_input("Choose User/Display name, at least 6 chars and less than 15: ")
                    flag = 1
            else:
                    flag = 0

    vars = ['startNum', 'endNum','nicknameFile','randomPassword','screenshotResult','screenshotOnFailure','username','password','emailUser','emailDomain','latitude','longitude','country']
    new_values = [startNum + ',',endNum + ',',nicknameFile + ',',randomPassword + ',',screenshotResult + ',',screenshotOnFailure + ',','"' + username + '",','"' + password + '",','"' + emailUser + '",','"' + emailDomain + '",','"' + latitude + '",','"' + longitude + '",','"' + country + '",','"']
    what_to_change = dict(zip(vars,new_values))

    updating('config.js',what_to_change)
    
    raw_input("Config Built Successfully! Press Enter")
    printmenu()

def updating(filename,dico):

    RE = '(('+'|'.join(dico.keys())+')\s*:)[^\r\n]*?(\r?\n|\r)'
    pat = re.compile(RE)

    def jojo(mat,dic = dico ):
        return dic[mat.group(2)].join(mat.group(1,3))

    with open(filename,'rb') as f:
        content = f.read() 

    with open(filename,'wb') as f:
        f.write(pat.sub(jojo,content))

def cleanExit(message):
    sys.exit(message)


signal.signal(signal.SIGINT, signal_handler)
printmenu()
