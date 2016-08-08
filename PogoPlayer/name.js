const pogobuf = require("pogobuf");

const args = {
  "a": "ptc"
};
var a;
for (let i = 2; i < process.argv.length; i++) {
  let arg = process.argv[i];
  let m = arg.match(/-(a|u|p|l|n)/);
  if (m) {
    a = m[1];
  } else {
    args[a] = arg;
  }
}
args.l = args.l.split(",");
const login = args.a === "ptc"
  ? pogobuf.PTCLogin()
  : pogobuf.GoogleLogin();
const client = pogobuf.Client();
console.log(args)
login.login(args.u, args.p)
.then(token => {  
  client.setAuthInfo(args.a, token);
  client.setPosition(parseFloat(args.l[0]), parseFloat(args.l[1]));
  return client.init();
})
.then(() => {
  setTimeout(() => {
    new Promise(resolve=>{
      resolve(client.checkCodenameAvailable(args.n));
    })
    .then(data=>{
      if (data.is_assignable) {
        new Promise((resolve)=>{resolve(client.claimCodename(args.n));})
        .then((plr)=>{console.log("Username has been choosen!")});
      } else {
        console.log("Username is not available")
      }
    });
  }, 5000);
})
.catch(err => {
  console.error(err);
});