/*jshint sub:true*/
// Requires
var Nightmare = require('nightmare');
var nicknames = require('./nicknames.json');
var fs = require('fs');
var request = require('request');

// Settings
var debug = false;
var showWindow = true;

// Start Config File Imports
var configFile = require('./config');
var start = configFile.startNum;
var end = configFile.endNum;
var useNicknamesFile = configFile.nicknameFile;
var useRandomPassword = configFile.randomPassword;
var screenshotResult = configFile.screenshotResult;
var screenshotFail = configFile.screenshotOnFailure;
var username = configFile.username;
var password = configFile.password;
var email_user = configFile.emailUser;
var email_domain = configFile.emailDomain;
var lat = configFile.latitude;
var lon = configFile.longitude;
var country = configFile.country;
var useAutoCatcha = configFile.useAutoCatcha;
var captchaApiKey = configFile.captchaApiKey;
// End Config File Imports

if(useAutoCatcha)
	showWindow = false;

// argv parse
var argv = require('minimist')(process.argv.slice(2));
if (argv['h']) { 
	console.log("usage: index.js [-h] [-u USERNAME] [-s START] [-e END]");
	console.log("");
	console.log("An automation script based on Nightmare.js.");
	console.log("Can create any number of Nintendo Pokémon Trainer Club accounts,");
       	console.log("with a single e-mail address.");	
	console.log("");
	console.log("optional arguments:");
	console.log("	-u	The usernane used.");
	console.log("	-s	Starting number.");
	console.log("	-e	Ending number.");
	process.exit();
}
if (argv['u']) { username=argv['a']; }
if (argv['s']) { start=argv['s']; }
if (argv['e']) { end=argv['e']; }

var outputFile = "PogoPlayer/accounts.csv"; // File which will contain the generated "username password" combinations.
var outputFormat = "ptc,%NICK%,%PASS%,%LAT%,%LON%,%UN%\r\n"; // Format used to save the account data in outputFile. Supports %NICK%, %PASS%.
var screenshotFolder = "output/screenshots/";

// App data
var url_ptc = "https://club.pokemon.com/us/pokemon-trainer-club/sign-up/";
var useragent = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36";
var nightmare_opts = {
    show: showWindow,
    waitTimeout: 10000,
    gotoTimeout: 5000,
    loadTimeout: 5000
};
// Prints nice little message
console.log("ptc-acc-gen v2.8.0 by Sébastien Vercammen and Frost The Fox (and Github contribs)");


// Settings check
if (!useNicknamesFile && (username + end).length > 16) {
    console.log("Error: length of username + number can't be longer than 16 characters.");
    console.log("Please use a shorter nickname.");
    process.exit();
}

if ((email_user + '+' + username + end + '@' + email_domain).length > 75) {
    console.log("Error: length of e-mail address including the + trick can't be longer than 75 characters.");
    console.log("Please use a shorter e-mail address and/or nickname.");
    process.exit();
}

if (!useRandomPassword && password.length > 15) {
    console.log("Error: length of password can't be longer than 15 characters.");
    console.log("Please use a shorter password.");
    process.exit();
}

// LETSAHGO
var nightmare = Nightmare(nightmare_opts);
nightmare.useragent(useragent);

createAccount(start);

// Helpers

function handleError(err) {
    if(debug) {
        console.log("[DEBUG] Error:" + JSON.stringify(err));
    }
    
    return err;
}

function randomPassword() {
    return Math.random().toString(36).substr(2, 8);
}

function prepareNightmare(nightmare) {
    nightmare.useragent(useragent);
}

function randomPassword() {
    return Math.random().toString(36).substr(2, 8);
}

// Pages
function createAccount(ctr) {
    console.log("Creating account " + ctr + " of " + end);
    
    // Launch instance
    handleFirstPage(ctr);
}

// First page
function handleFirstPage(ctr) {
    if(debug) {
        console.log("[DEBUG] Handle first page #" + ctr);
    }
    
    nightmare.goto(url_ptc)
        .evaluate(evaluateDobPage)
        .then(function(validated)  {
            if(!validated) {
                // Missing form data, loop over itself
                console.log("[" + ctr + "] Servers are acting up... Trying again.");
                return function() { nightmare.wait(500).refresh().wait(); handleFirstPage(ctr); };
            } else {
                return function() { fillFirstPage(ctr); };
            }
        })
        .then(function(next) {
            // Handle next step: either a loop to first page in case of error, or form fill on success
            return next();
        })
        .catch(handleError)
        .then(function(err) {
            if (typeof err !== "undefined") {
                return handleFirstPage(ctr);
            }
        });
}

function fillFirstPage(ctr) {
    if(debug) {
        console.log("[DEBUG] Fill first page #" + ctr);
    }
    
    nightmare.evaluate(function(data) {
            var dob = new Date((new Date()).getTime() - (Math.random() * (new Date()).getTime()) - 18*365*24*60*60*1000 );
            document.getElementById("id_dob").value = dob.getFullYear() + "-" + (dob.getMonth()+1) + "-" + dob.getDate();

            var els = document.getElementsByName("country");
            for(var i = 0; i < els.length; i++) {
                els[i].value = data.country;
            }
            
            return document.getElementById("id_dob").value;
        }, { country: country })
        .click("form[name='verify-age'] [type=submit]")
        .wait("#id_username")
        .then(function() {
            handleSignupPage(ctr);
        })
        .catch(handleError)
        .then(function(err) {
            if (typeof err !== "undefined") {
                return handleFirstPage(ctr);
            }
        });
}

// Signup page
function handleSignupPage(ctr) {
    if(debug) {
        console.log("[DEBUG] Handle second page #" + ctr);
    }
    
    nightmare.evaluate(evaluateSignupPage)
        .then(function(validated) {
            if(!validated) {
                // Missing form data, loop over itself
                console.log("[" + ctr + "] Servers are acting up... Trying again.");
                return function() { nightmare.wait(500).refresh().wait(); handleFirstPage(ctr); };
            } else {
                return function() { fillSignupPage(ctr); };
            }
        }).then(function(next) {
            // Handle next step: either a loop to first page in case of error, or form fill on success
            return next();
        })
        .catch(handleError)
        .then(function(err) {
            if (typeof err !== "undefined") {
                return handleSignupPage(ctr);
            }
        });
}

function fillSignupPage(ctr) {
    if(debug) {
        console.log("[DEBUG] Fill signup page #" + ctr);
    }
    
    var _pass = password;
    var _nick = username + ctr;
    
    if(useRandomPassword) {
        _pass = randomPassword();
    }
    
    // Use nicknames list, or (username + number) combo?
    if(useNicknamesFile) {
        // Make sure we have a nickname left
        if(nicknames.length < 1) {
            throw Error("We're out of nicknames to use!");
        }
        
        // Get the first nickname off the list & use it
        _nick = nicknames.shift();
    }
    
    // Fill it all in
	if(useAutoCatcha)
	{
		nightmare.evaluate(function(data) {
				document.getElementById("id_password").value = data.pass;
				document.getElementById("id_confirm_password").value = data.pass;
				document.getElementById("id_email").value = data.email_user === "" ? data.nick + "@" + data.email_domain : data.email_user + "+" + data.nick + "@" + data.email_domain;
				document.getElementById("id_confirm_email").value = data.email_user === "" ? data.nick + "@" + data.email_domain : data.email_user + "+" + data.nick + "@" + data.email_domain;
				document.getElementById("id_screen_name").value = data.nick;
				document.getElementById("id_username").value = data.nick;
			window.scrollTo(0,document.body.scrollHeight);
			}, { "pass": _pass, "nick": _nick, "email_user": email_user, "email_domain": email_domain })
			.check("#id_terms");
			
			
			nightmare.evaluate(function(){
				return document.getElementsByClassName("g-recaptcha")[0].getAttribute('data-sitekey');
			}).then(function(result)
			{
				console.log("Start recaptcha solving");
				request('http://2captcha.com/in.php?key=' + captchaApiKey + '&method=userrecaptcha&googlekey=' + result + '&pageurl=club.pokemon.com', function (error, response, body)
				{
					var checkCaptcha = function()
					{
						request('http://2captcha.com/res.php?key=' + captchaApiKey + '&action=get&id=' + body.substring(3), function (error, response, body)
						{
							if(body.substring(0, 2) == "OK")
							{
								var captchaValidation = body.substring(3);
								nightmare.evaluate(function(data) {
									document.getElementById("g-recaptcha-response").value = data.captchaValidation;
								}, { captchaValidation: captchaValidation })
								.click('.button-green[value=" Continue"]')
								.then(function()
								{
									 nightmare.wait(function() {
											return (document.getElementById("signup-signin") !== null || document.getElementById("btn-reset") !== null || document.body.textContent.indexOf("That username already exists") > -1);
										})
										.evaluate(function() {
											return (document.body.textContent.indexOf("Hello! Thank you for creating an account!") > -1);
										})
										.then(function(success) {
											if(success) {
												// Log it in the file of used nicknames
												var content = outputFormat.replace('%NICK%', _nick).replace('%PASS%', _pass).replace('%LAT%', lat).replace('%LON%', lon).replace('%UN%', _nick);
												fs.appendFile(outputFile, content, function(err) {
													//
												});
											}
											
											if((success && screenshotResult) || screenshotFail) {
												// Screenshot
												nightmare.screenshot(screenshotFolder + _nick + ".png");
											}
											
											// Next one, or stop
											if(ctr < end) {
												return function() { createAccount(ctr + 1); };
											} else {
												return nightmare.end();
											}
										}).then(function(next) {
											return next();
										}).catch(handleError)
										.then(function(err) {
											if (typeof err !== "undefined") {
												return handleSignupPage(ctr);
											}
										});
								});
							}
							else
							{
								// Not ready yet...
								setTimeout(checkCaptcha, 2000);
							}
						});
					};
					setTimeout(checkCaptcha, 2000);
				});
			});
	}
	else
	{
		nightmare.evaluate(function(data) {
				document.getElementById("id_password").value = data.pass;
				document.getElementById("id_confirm_password").value = data.pass;
				document.getElementById("id_email").value = data.email_user === "" ? data.nick + "@" + data.email_domain : data.email_user + "+" + data.nick + "@" + data.email_domain;
				document.getElementById("id_confirm_email").value = data.email_user === "" ? data.nick + "@" + data.email_domain : data.email_user + "+" + data.nick + "@" + data.email_domain;
				document.getElementById("id_screen_name").value = data.nick;
				document.getElementById("id_username").value = data.nick;
			window.scrollTo(0,document.body.scrollHeight);
			}, { "pass": _pass, "nick": _nick, "email_user": email_user, "email_domain": email_domain })
			.check("#id_terms")
			.wait(function() {
				return (document.getElementById("signup-signin") !== null || document.getElementById("btn-reset") !== null || document.body.textContent.indexOf("That username already exists") > -1);
			})
			.evaluate(function() {
				return (document.body.textContent.indexOf("Hello! Thank you for creating an account!") > -1);
			})
			.then(function(success) {
				if(success) {
					// Log it in the file of used nicknames
					var content = outputFormat.replace('%NICK%', _nick).replace('%PASS%', _pass).replace('%LAT%', lat).replace('%LON%', lon).replace('%UN%', _nick);
					fs.appendFile(outputFile, content, function(err) {
						//
					});
				}
				
				if((success && screenshotResult) || screenshotFail) {
					// Screenshot
					nightmare.screenshot(screenshotFolder + _nick + ".png");
				}
				
				// Next one, or stop
				if(ctr < end) {
					return function() { createAccount(ctr + 1); };
				} else {
					return nightmare.end();
				}
			}).then(function(next) {
				return next();
			}).catch(handleError)
			.then(function(err) {
				if (typeof err !== "undefined") {
					return handleSignupPage(ctr);
				}
		});
	}
}

// Evaluations
function evaluateDobPage() {
    var dob_value = document.getElementById("id_dob");
    return ((document.title === "The Official Pokémon Website | Pokemon.com") && (dob_value !== null));
}

function evaluateSignupPage() {
    var username_field = document.getElementById("id_username");
    return ((document.title === "The Official Pokémon Website | Pokemon.com") && (username_field !== null));
}
