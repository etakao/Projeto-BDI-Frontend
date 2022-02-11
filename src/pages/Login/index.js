import React, { useState } from 'react';
import { Redirect, useHistory} from "react-router-dom";

//import { message } from 'antd';
//import api from "../../services/api";
//import { login, isAuthenticated} from "../../services/auth";

//import { useUser } from '../../contexts/User';

import './styles.scss';

export  function Login(){
   
    //const history = useHistory();
   // const {user, setUser}= useUser();
    const [user, setUser] = useState("");
    const [email, setEmail] = useState('');
    const [password,setPassword] = useState('');

    const handleSubmit = async event =>{
        event.preventDefault();
        if(email ==='admin@admin.com' && password === '123'){
            alert("bem vindo "+ user);
        }
        // message.loading({
        //     key: "logging",
        //     content: "Logando...",
        //     duration: 9999
        //   });

    //       try {
    //         const response = await api.post("/login", { email, password });
    //             login(response.data.token)
    //             const users = response.data;
                
    //             message.destroy("logging");
    //             console.log(user);
    //             history.push("/forms");
    //             message.success("Bem-vindo!");
               
    //       } catch (err) {
    //         console.log(err);
    //         message.destroy("logging");
    //         message.error("Erro ao efetuar login, tente novamete...");
    //       }
     }
     //{isAuthenticated() ? <Redirect to="/forms" /> : null}
    return(
        <>
 
        <section className="login">
            <div className='container'>
                <div className="title-login">
                <h1> Covid em foco</h1>
                <div className="break"/>
                    <h1> Login</h1>
                </div>
                <form className="form-login" onSubmit={handleSubmit}> 
                    <div className="section-form">
                        <label>E-mail</label>
                        <input type="email" 
                        name='email'  
                        onChange={e => setEmail(e.target.value)} 
                        required={true}/>
                        
                    </div>
                    <div className="section-form">
                        <label> Senha </label>
                        <input type="password" 
                        name='password'  
                        onChange={e => setPassword(e.target.value)} 
                        required={true}/>

                    </div>
                    <div className="section-form">
                        <button type="submit">Entrar</button>
                    </div>
                </form>
            </div>
        </section>
        </>
    )
}
