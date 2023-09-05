

const express = require('express')
const { WebSocketServer } = require('ws')
// const sockserver = new WebSocketServer({ port: 9999 })
  
const app = express();
  
app.get('/',(req,res)=>res.send('here'));
// app.use(express.static("public"));
  
app.listen(9999, function() {
    console.log("Server started on port 3000");
});

// sockserver.on('connection', (ws) => {
//     console.log("connected")
//     ws.send("connected to server")
//     console.log(sockserver.clients.size)
//     ws.on('message', function (data) { 
//         const str = JSON.parse(data)
//         console.log(str.message.toString())
//      })
// })

// const web = express().use((req,res)=>{
//     res.send({message:"hi as"})
// nmap -p 9999 103.80.118.54

// }).listen(5555,()=>console.log("asdfghjkl") );