/*
  Automatically click all "Verify your email" links in the welcome e-mail from
  Nintendo Pokémon Trainer Club's signup e-mails.
  
  Original code by Seb <3
  
  All verified e-mails will be moved to trash unless you set "moveToTrash" to false.
  
  How to use:
   1. Login to Gmail
   2. Go to https://script.google.com/
   3. Enter the code, save, run.
   4. Wait until fully completed, DO NOT LEAVE THE PAGE! (When finished, the text "running..." at the top will disappear.)
   5. Click View > Logs. At the bottom you'll see the total accounts verified.
   6. Enjoy
*/

function myFunction() {
  var verified = 0;
  var moveToTrash = true;
  
  var threads = GmailApp.search('in:inbox subject:"Pokémon Trainer Club Activation"');
  Logger.log("Found " + threads.length + " threads.");
 
  threads.forEach(function(thread) {
    var messages = thread.getMessages();
    Logger.log("Found " + messages.length + " messages.");
    
    messages.forEach(function(msg) {
      var value = msg.getBody()
                     .match(/Verify your email/m);
      
      if(msg.isInInbox() && value) {
        var link = msg.getBody().match(/<a href="https:\/\/club.pokemon.com\/us\/pokemon-trainer-club\/activated\/([\w\d]+)"/);
        
        if(link) {
          var url = 'https://club.pokemon.com/us/pokemon-trainer-club/activated/' + link[1];
          var options = {
            "muteHttpExceptions": true
          };
          
          var status = UrlFetchApp.fetch(url, options).getResponseCode();
          Logger.log("[#] Verified (" + status + "): " + url);
          
          if(status == 200) {
            verified++;
            msg.markRead();
            
            if(moveToTrash) { msg.moveToTrash(); }
          }
        }
      }
    });
  });
  
  Logger.log("Completed " + verified + " verifications.");
}
