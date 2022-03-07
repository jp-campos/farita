import React, { useEffect, useState } from "react";
import Vikingos from "../components/vikingos/Vikingos";
import {useParams} from "react-router-dom"

const VikingosPage = () => {
  const [user, setUser] = useState("");
  const {username,farita}=useParams();
  useEffect(()=>{
    setUser(username)
  },[username])
  return(
    <Vikingos username={user} faritaId={farita}/>
    );
};
export default VikingosPage;
