"use strict";

const pogobuf = require("pogobuf");
const fs = require("fs");

const acc = fs.readFileSync("./accounts.csv", "utf-8").split("\n").filter(x=>x!=="").map(x=>x.split(","));

for (let i = 0; i < acc.length; i++) {
  let a = acc[i];
  console.log(`Auth service: ${a[0]}, Username: ${a[1]}, Password: ${a[2]}, Location: ${a[3]},${a[4]}`);
  
  let login = a[0] === "ptc"
    ? pogobuf.PTCLogin()
    : pogobuf.GoogleLogin();
  let client = pogobuf.Client();
  login.login(a[1], a[2])
  .then(token => {
    client.setAuthInfo(a[0], token);
    client.setPosition(parseFloat(a[3]), parseFloat(a[4]));
    return client.init();
  })
  .then(() => {
    let timeOut = Math.random()*3000+5000|0;
    console.log(`Logged in. Doing stuff in ${timeOut/1000} seconds`);
    setTimeout(() => {
      new Promise((resolve) => {
        resolve(client.encounterTutorialComplete(1))
      })    
      .then(() => {
        new Promise((resolve) => {
          resolve(client.markTutorialComplete(0, false, false));
        })
        .then(()=>{
          if (a[5]) {pickTrainerName(client, a)}
        }).catch(err => {console.error("Failed to mark tutorial as complete... ERROR:", err);});
      }).catch(err => {console.error("Failed to complete the tutorial... ERROR:", err);});
    }, timeOut);
  })
  .catch(err => {
    console.error("Failed to initialize client... ERROR:", err);
  });
}

function pickTrainerName (client, a) {
  a[5] = a[5].replace(/\r/g, '');
  if (a[5].length > 12) {
    console.log(`Seems like ${a[5]} is too long name... (PROTIP: It can't exceed 12 characters!) Run this to try different name!:
node name.js -a ${a[0]} -u ${a[1]} -p ${a[2]} -l ${a[3]},${a[4]} -u TRAINER-NAME`); 
  }
  new Promise(resolve=>{
    resolve(client.checkCodenameAvailable(a[5]));
  })
  .then(data=>{
    if (data.is_assignable) {
      new Promise((resolve)=>{resolve(client.claimCodename(a[5]));})
      .then(() => {
        console.log(`Your trainer now is known as ${a[5]}!`);
      }).catch(err => {"Failed to set name... ERROR:", console.error(err);});
    } else {
      console.log(`Seems like there's already someone known as ${a[5]}... Run this to try different name!:
node name.js -a ${a[0]} -u ${a[1]} -p ${a[2]} -l ${a[3]},${a[4]} -u TRAINER-NAME`);
    }
  }).catch(err => {console.error("Failed to check for name... ERROR:", err);});
}