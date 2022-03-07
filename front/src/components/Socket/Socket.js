
import socketIOClient from "socket.io-client";

//const ENDPOINT = "127.0.0.1:8000/";
const ENDPOINT = "https://farita-back.herokuapp.com/";

export default function getSocket(idFarita,userName){

    
    let path = ENDPOINT + idFarita;

    let socket = socketIOClient(path, {
        path: "/" + idFarita,
        query: { username: userName, roomId: "home", options: "{}" },
      });
    return socket
}