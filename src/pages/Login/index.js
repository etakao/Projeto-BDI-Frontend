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
    const [isLoading, setIsLoading] = useState(false);
    const [isLoginCorrect, setIsLoginCorrect] = useState(true);

    const handleSubmit = async event => {
        setIsLoading(true);
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
            setIsLoading(false);
            history.push("/forms");

        } catch (error) {
            setIsLoading(false);
            setIsLoginCorrect(false);
            console.log(error);
        }
    }

    return (
        <>
            {isAuthenticated() ? (
                <Redirect to="/forms" />
            ) : (
                <section className="login">
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
                                required={true}
                            />
                        </div>

                        <div className="section-form">
                            <label> Senha </label>
                            <input type="password"
                                name='password'
                                onChange={e => setPassword(e.target.value)}
                                required={true}
                            />
                        </div>

                        <div className="section-form">
                            <button type="submit">Entrar</button>
                        </div>
                    </form>
                    {isLoading && (
                        <div className="loading-section">
                            <div className="lds-roller">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    )}
                    {!isLoginCorrect && (
                        <span>Email ou senha incorretos!</span>
                    )}
                </section>
            )}
        </>
    )
}
