# Nintendo PTC Account Generator [![Build Status](https://travis-ci.org/FrostTheFox/ptc-acc-gen.svg?branch=master)](https://travis-ci.org/FrostTheFox/ptc-acc-gen)

***Note: PTC making functions work fine, but ToS verification and catching starter is awaiting new API. Run manually using `node index.js` for now. When the API is solved, you can manually run the ToS and starter with `node pogo.js` in the PogoPlayer folder.***
***Supported once again! Please use the [PokemonGo-Map Discord](https://discord.gg/g6k7w83) for questions.***

**Please be sure to clone RECURSIVELY**
example: git clone --recursive https://github.com/FrostTheFox/ptc-acc-gen.git

An automation script based on Nightmare.js that can create any number of Nintendo Pokémon Trainer Club accounts with a single  e-mail address. This only works because Nintendo doesn't check for "email+1@domain.com" e-mail tricks, where the e-mail host completely ignores any part after (and including) the plus sign and sends it to "email@domain.com".

This project was started as a proof of concept: even multi-billion dollar companies that just released the single most popular mobile game (Pokémon Go) sometimes miss the details.

More about plus signs in e-mail addresses [on StackExchange](http://security.stackexchange.com/questions/65244/what-are-the-security-reasons-for-disallowing-the-plus-sign-in-email-addresses).

If you're using Gmail and want to automatically verify all accounts, use https://github.com/FrostTheFox/ptc-acc-gen/blob/master/gmailverify.js 
The instructions are at the top of the file.


The new version on Nightmare.js now:

* Checks for usernames/e-mails that are already taken
* Can screenshot the result page
* Handles server issues better
* Doesn't require PhantomJS/CasperJS or fiddling with the PATH environment variable

## Requirements
### Prerequisites
* [Node.js](https://nodejs.org/en/)

## Usage
Windows Instructions:

New beta install script! try running "install.bat" (and tell pyr0ball if something doesn't work)
  - If using the install script, you can simply run makeaccounts.bat afterwards.


1. Make sure you clone recursively (git clone --recursive [origin])
  - if you download the zip, make sure you also download the submodule PogoPlayer
  - or do it the easy way with `git submodule init && git submodule update`
  - if you cloned non-recursively, run install.bat.
2. Install requirements with `npm install`
3. Edit config.js if not using the install.bat or config.py.
4. Run using `makeaccounts.bat`.
5. Wait for the generator to fill in the second page, then accept the captcha and hit submit.
6. Repeat for all accounts
7. Find the generated accounts in PogoPlayer/accounts.csv.

There is a few command line arguments for index.js if you run manually. `node index.js -h` for more info. 

Some information about usernames: 6-10 is recommended, due to trainer name limit of 12, and the gen adding at least 1 number. You can use up to 15 chars (which means you can only gen a max of 9 accs, since beyond 10 it will be over the limit.) but PogoPlayer will not assign a trainer name properly.

Basically, you need to account for the gen adding the acc number after the username you pick.

Linux Instructions:  
***Headless systems will no longer be able to use the gen due to the captcha requirement, unless you use the autovalidation using 2captcha service (see below)***

1. Run `install.sh`
2. Run using `makeaccounts.sh`.
3. Wait for the generator to fill in the second page, then accept the captcha and hit submit.
4. Repeat for all accounts
5. Find the generated accounts in PogoPlayer/accounts.csv.

There is a few command line arguments for index.js if you run manually. `node index.js -h` for more info. 

***Note: Messages about trainer name usually are not a problem and you generally shouldn't be concerned by them.***

Auto-validation Instructions:

1. Create a 2Captcha account at http://2captcha.com/
2. Make a deposit or start working to have a positive balance
3. Navigate to "2Captcha API" page and copy the API KEY
4. Update config.js to enable autovalidation and paste your API KEY
5. That's it, run the script as usual. You will be switched back to headless mode automatically

## Configuration
### 1. Generate 10 accounts in the format USERx, where x is 0 to 9.
This example corresponds to the default settings. It will generate 10 accounts in the same format: user0, user1, ...

In [config.js](config.js):

// Starts gen from startNumber to endNumber, determining how many accounts are made
	startNum: 0,
	endNum: 10,
	
	// Creation Options
	nicknameFile: false, // Use nicknames file, or just append numbers to username?
	randomPassword: false, // If true generate a random password, If false set "password" field below
	screenshotResult: true, // Saves a screenshot per account creation when set to true
	screenshotOnFailure: true, // Saves a screenshot even if registration fails when set to true
	
	// Creation Requirements
	username: 'CHANGEME', // Keep the '', User- & display name. Make sure any "(username + number)@domain.com" is 100% unique, and is 6 characters minimum, but under 14 characters after the numbers are applied.
	password: 'CHANGEME', // If you set randomPassword to 'false' above change this to your chosen password (so you have same password for all accounts)
	emailUser: 'email', // Enter your email address name. If your address is email@domain.com you'd enter 'email'
	emailDomain: 'domain.com', // Domain of email address. If your address is email@domain.com  you'd enter 'domain.com'
	latitude: 'LATITUDE', // Location Latitude for initial login
	longitude: 'LONGITUDE' // Location Longitude for initial login

### 2. Generate random passwords per account.

 Set randomPassword: true, in [config.js](config.js).
 
 Password for accounts will be random, aftyer finished find usernames and passwords in /PogoPlayer/accounts.csv

### 3. Save screenshots (Default directory is /output/screenshots)

	screenshotResult: true, // Saves a screenshot per account creation when set to true
	screenshotOnFailure: true, // Saves a screenshot even if registration fails when set to true

### 4. Use a list of unique usernames instead of USERx combinations.

  To create a number of accounts with custom usernames instead of user + number combinations, change [index.js](index.js):

  Set nicknameFile: true, in [config.js](config.js).
 
  The list of unique usernames must be stored in [nicknames.json](nicknames.json). An example is available on the repo.
 
