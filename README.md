# Nintendo PTC Account Generator

***ToS accept script has been included. Read further for more information.***

An automation script based on Nightmare.js that can create any number of Nintendo Pokémon Trainer Club accounts with a single  e-mail address. This only works because Nintendo doesn't check for "email+1@domain.com" e-mail tricks, where the e-mail host completely ignores any part after (and including) the plus sign and sends it to "email@domain.com".

This project was started as a proof of concept: even multi-billion dollar companies that just released the single most popular mobile game (Pokémon Go) sometimes miss the details.

More about plus signs in e-mail addresses [on StackExchange](http://security.stackexchange.com/questions/65244/what-are-the-security-reasons-for-disallowing-the-plus-sign-in-email-addresses).

If you're using Gmail and want to automatically verify all accounts, use this gist: https://gist.github.com/sebastienvercammen/e7e0e9e57db246d7f941b789d8508186
or
https://github.com/FrostTheFox/ptc-acc-gen/blob/master/gmailverify.js


The new version on Nightmare.js now:

* Checks for usernames/e-mails that are already taken
* Can screenshot the result page
* Handles server issues better
* Doesn't require PhantomJS/CasperJS or fiddling with the PATH environment variable

## Requirements
### Prerequisites
* [Node.js](https://nodejs.org/en/)
* [Python](https://www.python.org/)

## Usage

1. Install requirements with `npm install`
2. Open [index.js](index.js) and edit the settings at the top of the file.
3. Run the script with Node.js:
    `node index.js`
4. Run the ToS script with Python:
    `python tos.py output/accounts.txt`

## Configuration
### 1. Generate 10 accounts in the format USERx, where x is 0 to 9.
This example corresponds to the default settings. It will generate 10 accounts in the same format: user0, user1, ...

In [index.js](index.js):

    var start = 0;                      // Start from x (NAMEx, EMAIL+x@domain.com)
    var end = 10;                       // Up to x, but not including (exclusive)

    var useNicknamesFile = false;           // Use nicknames file, or just append numbers to username?
    var outputFile = 'accounts.txt';        // File which will contain the generated "username password" combinations.
    var outputFormat = '%NICK% %PASS%\r\n'; // Format used to save the account data in outputFile. Supports %NICK%, %PASS%.
    
    var useNicknamesFile = false; // Use nicknames file, or just append numbers to username?
    var useRandomPassword = true; // Generate a random password?
    var screenshotResult = true; // Saves a screenshot per account creation if set to true
    var screenshotOnFailure = true; // Saves a screenshot even if registration failed

### 2. Generate random passwords per account.
* Set `var useRandomPassword = true;` in [index.js](index.js).

### 3. Save screenshots.

    var screenshotResult = true; // Saves a screenshot per account creation if set to true
    var screenshotOnFailure = true; // Saves a screenshot even if registration failed
    var screenshotFolder = "output/screenshots/";

### 4. Use a list of unique usernames instead of USERx combinations.
The list of unique usernames must be stored in [nicknames.json](nicknames.json). An example is available on the repo.

To create a number of accounts with custom usernames instead of user + number combinations, change [index.js](index.js):

    var useNicknamesFile = true;
