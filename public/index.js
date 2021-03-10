//=====================PIANO LOGIC+=====================================================
const WHITE_KEYS = ['z', 'x', 'c', 'v', 'b', 'n', 'm']
const BLACK_KEYS = ['s', 'd', 'g', 'h', 'j']

const keys = document.querySelectorAll('.key')
const whiteKeys = document.querySelectorAll('.key.white')
const blackKeys = document.querySelectorAll('.key.black')

keys.forEach(key => {
  key.addEventListener('click', () => playNote(key))
})
try{

document.addEventListener('keydown', e => {

  if (e.repeat) return
  const key = e.key
  const whiteKeyIndex = WHITE_KEYS.indexOf(key)
  const blackKeyIndex = BLACK_KEYS.indexOf(key)

  if (whiteKeyIndex > -1) playNote(whiteKeys[whiteKeyIndex])
  if (blackKeyIndex > -1) playNote(blackKeys[blackKeyIndex])
})

function playNote(key) {
console.log(key)
  const noteAudio = document.getElementById(key.dataset.note)
  const payLoad = {
      "method":"play",
      "clientId":clientId,
      "pianoId":pianoId,
      "key":key.dataset.note
  }
  ws.send(JSON.stringify(payLoad))
  noteAudio.currentTime = 0
  noteAudio.play()
  key.classList.add('active')
  noteAudio.addEventListener('ended', () => {
    key.classList.remove('active')
  })}
}
catch(err){
    console.log(err)
}
//========================WEBSOCKET logic=======================================================

//values taken
let clientId = null;
let pianoId = null;
let playerColor = null;
let ws = new WebSocket("wss:///glacial-shelf-48000.herokuapp.com:8080") //requests a connection (101)
ws.onmessage = message=>{
    const response = JSON.parse(message.data)
    console.log(response)
    
    if(response.method === "connect"){
        clientId = response.clientId
        console.log("client ID set Successfully "+ clientId)
    }
    if(response.method === "create"){
        pianoId = response.piano.id;
        console.log("game successfully created with the ID "+ pianoId)
    }
    if(response.method === "join"){
        const piano = response.piano;
        console.log("user has joined game")
    }
    if(response.method === "play"){
        if(clientId === response.clientId){
            console.log(response.key)
        } else{
            const noteAudio = document.getElementById(response.key)
            noteAudio.currentTime = 0
            noteAudio.play()
            console.log('audio has been played')
        }
    }
}



// ELements
const BtnCreate = document.getElementById("BtnCreate")
const BtnJoin = document.getElementById("BtnJoin")
const txtPianoId = document.getElementById("txtPianoId")

// Element wiring

//! "Hey server, I want to join the room that my friend made"
BtnJoin.addEventListener("click", e=>{
    if(pianoId === null){
        pianoId = txtPianoId.value;
    }
    const payLoad = {
        "method":"join",
        "clientId": clientId,
        "pianoId":pianoId
    }
    ws.send(JSON.stringify(payLoad))
})




// ! "Hey server, I want to create a piano room"
BtnCreate.addEventListener("click", e =>{
    const payLoad = {
        "method":"create",
        "clientId":clientId
    }
    ws.send(JSON.stringify(payLoad))
})