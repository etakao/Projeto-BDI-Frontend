import React, { useState } from 'react';
import { Redirect, useHistory } from "react-router-dom";

import { login, isAuthenticated, authApi } from "../../services/auth";

import { useUser } from '../../contexts/user';

import './styles.scss';

export function Login() {
    const history = useHistory();
    const { setUser } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async event => {
        event.preventDefault();

        try {
            const response = await authApi.login({
                email,
                password
            });
            if (response.status === 200) {
                login(response.data.token);
                setUser(response.data);
            }
            history.push("/forms");

        } catch (err) {
            console.log(err);
        }
    }
    return (
        <>
            {isAuthenticated() ? (
                <Redirect to="/forms" />
            ) : (<section className="login">
                <div className='container'>
                    <div className="title-login">
                        <h1> Covid em foco</h1>
                        <div className="break" />
                        <h1> Login</h1>
                    </div>
                    <form className="form-login" onSubmit={handleSubmit}>
                        <div className="section-form">
                            <label>E-mail</label>
                            <input type="email"
                                name='email'
                                onChange={e => setEmail(e.target.value)}
                                required={true} />

                        </div>
                        <div className="section-form">
                            <label> Senha </label>
                            <input type="password"
                                name='password'
                                onChange={e => setPassword(e.target.value)}
                                required={true} />

                        </div>
                        <div className="section-form">
                            <button type="submit">Entrar</button>
                        </div>
                    </form>
                </div>
            </section>
            )}
        </>
    )
}
