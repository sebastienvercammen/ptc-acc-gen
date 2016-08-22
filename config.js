var config = {
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
};
module.exports = config;