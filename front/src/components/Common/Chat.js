import React, { useEffect, useState } from "react";
import {
    makeStyles,
    withStyles,
    Grid,
    Button,
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography,
  } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import SendIcon from '@material-ui/icons/Send';
import { useParams } from "react-router-dom";
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import {  useIntl } from "react-intl";  
import './chatStyles.css'

import getSocket from '../Socket/Socket'
const useStyles = makeStyles( (theme) => ({
    root: {
        backgroundColor: "#363940",        
    }

    }))

const WhiteTypography = withStyles({
    root: {
        color: "#eff2f5",
        fontSize: "16px",
        display: "block"
    }
})(Typography);
const GrayTypography = withStyles({
    root: {
        fontSize: "14px",
        display: "inline"
    }
})(Typography);


let socket = undefined

export default function Chat(props){
  

    const [mensajes,setMensajes] = useState([])
    const [username, setUsername] = useState(useParams().username) 
    const [farita, setFarita] = useState(useParams().farita)
    const[messagesEnd, setMessagesEnd] = useState(undefined)
    const[msgOffline, setMsgOffline] = useState([])
    const intl = useIntl();


    function handleEnviarMsg(msgObj, resetForm) {
     
        resetForm({});
        let today = new Date()
        let minutero = today.getMinutes()<10? "0"+ today.getMinutes(): today.getMinutes()
        let obj = {usr:username, msg:msgObj.mensaje, mio:true,hora: today.getHours() + ":" + minutero } //TODO: Cambiar el usuario alguno de contexto o algo así
        if (socket){
            
            if(socket.connected)
            {
                let msgString = localStorage.getItem("mensajes")
                let msgOld = []
                if(msgString){
                    msgOld = JSON.parse(msgString)
                    socket.emit('mensajes', msgOld)
                }

                localStorage.clear()
                setMsgOffline([])
                socket.emit('mensaje', obj)
                const nuevosMensajes = mensajes.concat(msgOld).concat(obj);
                setMensajes(nuevosMensajes)
            }else{
                let msgString = localStorage.getItem("mensajes")
                let msgOld = []
                if(msgString){
                
                   msgOld = JSON.parse(msgString)
                }

                localStorage.clear()
                msgOld.push(obj)
                localStorage.setItem('mensajes', JSON.stringify(msgOld))

                setMsgOffline(msgOld)
            }
            
            
            
        }   

        updateScroll()
      }
   
    const validate = (values) => {
    const errors = {};

    if (values.mensaje === "") {
        errors.mensaje =  intl.formatMessage({ id: 'Common.Chat.write' });
    } 
    return errors;
    };
      


    useEffect(()=>{

        socket = getSocket(farita,username)
        let msgString = localStorage.getItem("mensajes")
        if(msgString){
            setMsgOffline(JSON.parse(msgString))
        }
        


        return () => {
            socket.disconnect();
        }
    },[])

    useEffect(()=>{

        socket.on(('mensaje'), async (mensaje) => {
            const nuevosMensajes = mensajes.concat(mensaje);
            
            setMensajes(nuevosMensajes)
            setTimeout(()=>updateScroll(),500)
            
        })

        socket.on('mensajes', (msg)=>{
            console.log("mensajes antes de map", msg)
            msg.map((elem)=>{
                if(elem.usr === username){
                    console.log("Entra a if", username)
                    elem.mio = true
                }
                return elem
            })
            console.log("Entra on mensajes", msg)
            const nuevosMensajes = mensajes.concat(msg);
            setMensajes(nuevosMensajes)
            
        })

    
    },[mensajes])


    function updateScroll(){
        if(messagesEnd){
            messagesEnd.scrollIntoView({ behavior: "smooth" });
        }
    }

    return(
        
        <main className="body-chat d-flex flex-column justify-content-between py-4 ">
            
            <div className="flex-grow fondo-chat" tabIndex="0">
            <div>
            {
                mensajes.map((elem,i)=>{
                    let flex = elem.mio ? 'flex-end' : 'flex-start'
                    let alignSelf = elem.mio ? 'align-self-end' : 'align-self-start'
                
                    return (
                        <div key={i}>
                        <div className="mb-1 p-4"  style={{display:'flex', justifyContent:flex}}>
                            <div className="d-flex flex-column">
                                <WhiteTypography>{elem.msg}</WhiteTypography>
                                <span className={alignSelf} >
                                    <span className="text-hora">{elem.mio?elem.hora:""} </span>
                                    <GrayTypography style={elem.mio? {color:"#54abff"}:{color:"#04fd9e"}} >
                                        {elem.mio? intl.formatMessage({ id: 'Common.Chat.you' }): elem.usr}
                                    </GrayTypography>
                                    <span className="text-hora"> {elem.mio?"":elem.hora} </span>
                                </span>
                            </div>
                            
                        </div>
                        </div>
                    )
                }) 
            }

            {
                msgOffline.map((elem,i)=>{
                    let flex = elem.mio ? 'flex-end' : 'flex-start'
                    let alignSelf = elem.mio ? 'align-self-end' : 'align-self-start'
                
                    return (
                        <div key={i}>
                        <div className="mb-1 p-4"  style={{display:'flex', justifyContent:flex}}>
                            <div className="d-flex flex-column">
                                <WhiteTypography>{elem.msg}</WhiteTypography>
                                <span className={alignSelf} >
                                    <span><ErrorOutlineIcon style={{color:"#dc3545"}}/></span><span className="text-danger"> No se pudo enviar </span>
                                    <GrayTypography style={elem.mio? {color:"#54abff"}:{color:"#04fd9e"}} >
                                        {elem.mio ? intl.formatMessage({ id: 'Common.Chat.you' }) : elem.usr}
                                    </GrayTypography>
                                    <span className="text-hora"> {elem.mio?"":elem.hora} </span>
                                </span>
                            </div>
                            
                        </div>
                        </div>
                    )
                }) 
            }

            <div style={{ float:"left", clear: "both" }} ref={(el) => {  setMessagesEnd(el) }}></div>
            </div>

            </div>
            
            <Formik
                validate={validate}
                initialValues={{ mensaje: "" }}
                onSubmit={(values, { resetForm }) => {
                  handleEnviarMsg(values, resetForm);
                }}
              >
                <Form>
                    <div className="d-flex justify-content-center w-100">
                    <Field
                      aria-label ="Que es esto"
                      autoComplete="off"
                      name="mensaje"
                      className="input-chat mr-3"
                      placeholder={intl.formatMessage({ id: 'Common.Chat.submit' })}
                      type="text"
                    ></Field>
                    <button aria-label={intl.formatMessage({ id: 'Common.Chat.send' })} type="submit" className="boton-enviar">
                      <SendIcon style={{fill:"#b5b7ba"}}></SendIcon>
                    </button>
                    </div>
                   
                </Form>
              </Formik>

            
        </main>
              


    )

}
