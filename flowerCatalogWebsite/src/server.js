let fs = require('fs');
const handleRequests = require('./serverLib.js').handleRequests;
const timeStamp = require('./time.js').timeStamp;
const http = require('http');
const WebApp = require('./webapp');
let registered_users = [{userName:'dev',name:'sridevs'},{userName:'harshab',name:'Harsha Vardhana'}];
let toS = o=>JSON.stringify(o,null,2);

let logRequest = (req,res)=>{
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`,''].join('\n');
  fs.appendFile('request.log',text,()=>{});

  console.log(`${req.method} ${req.url}`);
}
let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u=>u.sessionid==sessionid);
  if(sessionid && user){
    req.user = user;
  }
};
let loadHomePage = (req,res)=>{
  if(req.urlIsOneOf(['/'])) res.redirect('/home.html');
}
let redirectLoggedInUserToHome = (req,res)=>{
  if(req.urlIsOneOf(['/','/login']) && req.user) res.redirect('guestPage.html');
}
let redirectLoggedOutUserToLogin = (req,res)=>{
  if(req.urlIsOneOf(['/home','/logout']) && !req.user) res.redirect('/login');
}

let app = WebApp.create();
app.use(loadHomePage);
app.use(logRequest);
app.use(loadUser);
app.use(redirectLoggedInUserToHome);
app.use(redirectLoggedOutUserToLogin);

app.get('/login',(req,res)=>{
  res.setHeader('Content-type','text/html');
  if(req.cookies.logInFailed) res.write('<p>logIn Failed</p>');
  res.write('<form method="POST"> <input name="userName"><input name="place"> <input type="submit"></form>');
  res.end();
});
app.post('/login',(req,res)=>{
  let user = registered_users.find(u=>u.userName==req.body.userName);
  if(!user) {
    res.setHeader('Set-Cookie',`logInFailed=true`);
    res.redirect('/login');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/guestPage.html');
});
app.post('/comments',handleRequests);
app.post('/public/comments',handleRequests);
app.get('/home',(req,res)=>{
  res.setHeader('Content-type','text/html');
  res.write(`<p>Hello ${req.user.name}</p>`);
  res.end();
});
app.get('/logout',(req,res)=>{
  res.setHeader('Set-Cookie',[`loginFailed=false,Expires=${new Date(1).toUTCString()}`,`sessionid=0,Expires=${new Date(1).toUTCString()}`]);
  delete req.user.sessionid;
  res.redirect('/login');
});
app.get('/home.html',handleRequests);
app.get('/css/style.css',handleRequests);
app.get('/images/freshorigins.jpg',handleRequests);
app.get('/js/flowerWebsite.js',handleRequests);
app.get('/images/animated-flower-image-0021.gif',handleRequests);
app.get('/images/pbase-Abeliophyllum.jpg',handleRequests);
app.get('/images/pbase-Agerantum.jpg',handleRequests);
app.get('/guestPage.html',handleRequests);
app.get('/Abeliophyllum.html',handleRequests);
app.get('/Ageratum.html',handleRequests);
app.get('/pdf/Abeliophyllum.pdf',handleRequests);
app.get('/pdf/Ageratum.pdf',handleRequests);
app.get('/data/comments.txt',handleRequests);

const PORT = 5000;
let server = http.createServer(app);
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
