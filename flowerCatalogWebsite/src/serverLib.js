let fs = require('fs');
let prependFile = require('prepend-file');

let setContentType = function (fileName) {
  let headers = {
    js: {'Content-Type': 'text/javascript'},
    html: {'Content-Type': 'text/html'},
    css: {'Content-Type': 'text/css'},
    jpg: {'Content-Type': 'img/jpg'},
    pdf: {'Content-Type': 'application/pdf'},
    gif: {'Content-Type': 'image/gif'},
    ico: {'Content-Type': 'image/ico'},
    txt: {'Content-Type': 'text/plain'},
    undefined: {'Content-Type': 'text/plain'}
  }

  let fileType = fileName.split('.')[2];
  console.log('Content-Type has been set as', headers[fileType]);
  return headers[fileType];
};

let getFileName = function (request) {
  let fileName = request.url.substr(1)
  if ( fileName === 'data/comments.txt') {
    return fileName;
  }
  return './public/' + (fileName || 'home.html');
};

let isItComments = function (fileName,request) {
  return fileName === './public/comments' && request.method === 'POST';
};

let replaceEqualsWithColon = function (string) {
  return string.replace('=',':');
};

let joinStrings = function (strg1,strg2) {
  return strg1 + " " + strg2;
};

let getTime = function () {
  let date = new Date;
  let humanReadableDate = date.toDateString();
  let humanReadableTime = date.toLocaleTimeString();
  return joinStrings(humanReadableDate,humanReadableTime);
};

let refineComments = function (comments) {
  comments = comments.replace(/\+/g,' ');
  comments = decodeURIComponent(comments);
  comments = comments.split('&');
  let mappedComments = comments.map(replaceEqualsWithColon);
  let refinedComments = mappedComments.join(" ");
  return refinedComments;
};

let recordComments = function (data) {
  let comments = '';
  comments += data;
  let refinedComments = refineComments(comments);
  let time = getTime();
  let commentsToRecord = joinStrings(time,refinedComments) + '\n';
  prependFile('./data/comments.txt',commentsToRecord);
};

let handleComments = function (fileName,request,response) {
  request.on('data', recordComments);

  request.on('end', function () {
    console.log('response has ended');
  });

  response.writeHead('302',{'location': 'guestPage.html'});

  response.end();
};

let handleRequests = function (request, response) {
  // Read the requested file content from file system
  let fileName = getFileName(request);

  // Print the name of the file for which request is made.
  console.log("Request for " + fileName + " received.");

  fs.readFile(fileName, function (err, data) {
    if (isItComments(fileName,request)) {
      handleComments(fileName,request,response);
      return ;
    }

    if (err) {
      console.log(err);
      // page not found
      // HTTP Status: 404 : NOT FOUND
      response.writeHead(404,setContentType(fileName));
    }else {
      //Page found
      // HTTP Status: 200 : OK
      response.writeHead(200,setContentType(fileName));
      // Write the content of the file to response body
      response.write(data);
      // response.write(data);

    }
    // Send the response body
    response.end();
  });
}

exports.handleRequests = handleRequests;
