
let userName;
let socket = io();
do {
  userName = prompt("Enter your name");
} while (!userName);
const textArea = document.querySelector("#textarea");
const commentBox = document.querySelector(".comment_box");
const submitBtn = document.querySelector("#submitBtn");

submitBtn.addEventListener("click", (e) => {
  console.log("Hai");
  e.preventDefault();
  let comment = textArea.value;
  if (!comment) {
    return;
  }
  postComment(comment);
});
function postComment(comment) {
  console.log("Inside post comment");
  let data = {
    userName: userName,
    comment: comment,
  };
  //* 1)Append to Dom
  appendToDom(data);
  textArea.value = "";

  //* 2)Broadcast messages using websockets
  broadCastComment(data);

  // * 3)Sync with mongoDB
  syncWithDb(data);
}

function appendToDom(data) {
  console.log("inside appendToDom");
  let lTag = document.createElement("li");
  lTag.classList.add("comment", "mb-3");
  //adding two classes for li-tag

  let markup = ` <div class="card bg-light mb-3 mt-3">
            <div class="card-body">
                <h6 class="card-title ">${data.userName}</h6>
                <p class="card-text">${data.comment}</p>
            <div>
              <small class="card-text">${moment(data.time).format("LT")}</small>
        </div>`;
  lTag.innerHTML = markup;

  commentBox.prepend(lTag); //using prepend as we need the new comment at the top
}

function broadCastComment(data) {
  //  * now the data is sent from here from the UI ,need to receive it in the server (express)
  socket.emit("comment", data);
}

// * after server successfully receives it,it also again resends the data to all the browsers which are connected to it
socket.on("comment", (data) => {
  // * now we need to append it in the Dom of every browser (i.e need to display it in all browsers)
  appendToDom(data);
});

textArea.addEventListener("keyup", (e) => {
  socket.emit("typing", { userName });
});
const typingDiv = document.querySelector(".typing");
let timerId=null;
function deBounce(func,timer){
    if(timerId){
        clearTimeout(timerId)
    }
    timerId=setTimeout(()=>{
      func()
    },timer)
}
socket.on("typing", (data) => {
  let code = `<div class="alert alert-info">
<strong>${data.userName}</strong> is typing...
</div>`;
  typingDiv.innerHTML = code;
  deBounce(function () {
    typingDiv.innerHTML = "";
  }, 1000);
});
function syncWithDb(data){
const headers={
    'Content-Type':'application/json'
}
fetch('/comment/addComment',{method:'Post',body:JSON.stringify(data),headers})
.then(response=>
    response.json()).then(result=>{
        console.log(result)
    })
}

function fetchComments(){
    fetch('/comment/getAllComments').then(response=>response.json()).then(result=>{
        result.forEach(element => {
            element.time=element.createdAt
            appendToDom(element);
        });
    })
}

window.onload=fetchComments