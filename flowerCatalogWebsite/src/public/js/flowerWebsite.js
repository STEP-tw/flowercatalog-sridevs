function show() {
  document.getElementById("image").style.visibility="visible";
}

function hide(){
  document.getElementById("image").style.visibility="hidden";
  setTimeout(show, 1000);
}

function padCommentWithName(comments,name,time) {
  return comments + " - " + name + ' ' + time;
}

function displayComments() {
  let comments = document.getElementById('comments').value;
  let name = document.getElementById('name').value || 'anonymous';
  let time = Date().slice(0,-15);
  let userComments = padCommentWithName(comments, name, time);
  let text = document.createTextNode(userComments);
  let gap = document.createElement('br');
  let newPara = document.createElement('div');
  let comment = document.createTextNode(userComments);
  newPara.appendChild(comment);
  document.getElementById('userComments').appendChild(newPara);
  document.body.appendChild(gap);
}
