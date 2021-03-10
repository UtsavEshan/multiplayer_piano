const http = require("http");

// ! express server to host the pages
const express = require("express")
const app = express();
const PORT = process.env.PORT || 9090;


app.use(express.static('public'))

// showing the page to the user
app.get("/",(req,res)=>{
  res.sendFile(__dirname+"/index.html")
})

app.get('/favicon.ico', (req, res) => res.status(204));
// This creates a websocket server so that the client and the user can exchane informatiom
const websocketServer = require("websocket").server;
const { connection } = require("websocket");

//http server
const httpServer =  http.createServer();

//store clients
const clients = {};
const pianos = {}

// mounting the websocket server on the http server so that the http server can be upgraded to a websocket server 
const Websocket_Server = new websocketServer({
  httpServer: httpServer
})

// When the server gets a request the arrow function will occur
Websocket_Server.on("request", (request)=>{
  // this is the information about the user
  const connection = request.accept(null, request.origin)
  //everything related to the websocket is done here as the location of the client is know here

  connection.on("open", ()=>{
    console.log("conneciton has been opened")
  })

  connection.on("close", () =>{
    console.log("connection has been closed")
  })

  // ! This where the id of the client is sent
  connection.on("message", message =>{
    // the client sends the message as a string, so to use it to find the method, we convert it into a json object
    const result = JSON.parse(message.utf8Data)
    console.log(result)
    //! Okay client, let me make you a piano id and send it to you
    if(result.method === "create"){
      // who just made that request
      const clientId = result.clientId;
      const pianoId = guid();
      pianos[pianoId]={
        "id":pianoId,
        "clients":[]
      }
      const payLoad = {
        "method":"create",
        "piano":pianos[pianoId]
      }
      const con = clients[clientId].connection
      con.send(JSON.stringify(payLoad))

    }

    if(result.method === "join"){
      const clientId = result.clientId;
      const pianoId = result.pianoId;
      const piano = pianos[pianoId]
      piano.clients.push({
        "clientId":clientId
      })
      const payLoad = {
        "method":"join",
        "piano":piano
      }
      piano.clients.forEach(c=>{
        clients[c.clientId].connection.send(JSON.stringify(payLoad))
      })

    }
    
    if(result.method === "play"){
      const clientId = result.clientId;
      const key = result.key;
      const pianoId = result.pianoId;
      const piano = pianos[pianoId]
      const payLoad = {
        "method":"play",
        "clientId":clientId,
        "key":key
      }
      //! have to send the payload to all the clients in the piano room
      if(piano === undefined){
        return;
      } else{
        piano.clients.forEach(c=>{
          clients[c.clientId].connection.send(JSON.stringify(payLoad))
        })
      }



    }

  })

//generates a clientId for each client
const clientId = guid();
clients[clientId]={
  "connection":connection
};
const payLoad = {

  "method":"connect",
  "clientId":clientId
}

connection.send(JSON.stringify(payLoad))

connection.send

})




function S4() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
}

// then to call it, plus stitch in '4' in the third group
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();



// ! HTTP server
httpServer.listen(8080, ()=>{
  console.log("listening on 8080")
})


//! Express server
app.listen(9090,()=>{
  console.log("listening on 9090")
})