import React, { useEffect, useState } from "react";
import { FiLogOut } from 'react-icons/fi';

import { useUser } from '../../contexts/user';
import { logout } from "../../services/auth";
import moradorApi from "../../services/morador";
import cidadeApi from "../../services/cidade";
// import vacinaApi from "../../services/vacina";

import "./styles.scss";

export function Forms() {
  const { user, removeUser } = useUser();
  const [isSuccessful, setIsSuccessful] = useState("");

  const [cities, setCities] = useState([]);
  const [admCity, setAdmCity] = useState("");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [doses, setDoses] = useState(0);
  const [dataDoses, setDataDoses] = useState([
    {
      description: "1ª dose:",
      date: ""
    },
    {
      description: "2ª dose:",
      date: ""
    },
    {
      description: "3ª dose:",
      date: ""
    },
  ]);
  const [isObito, setIsObito] = useState("");

  async function loadCities() {
    try {
      const cityResponse = await cidadeApi.readAll();
      if (cityResponse.status === 200) {
        setCities(cityResponse.data.cidade);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  function reloadPage() {
    setTimeout(() => {
      document.location.reload();
    }, 3000);
  }

  useEffect(() => {
    loadCities();
  }, []);

  useEffect(() => {
    const { adm } = user;
    setAdmCity(cities.find(city => city.codigo_ibge === adm.codigo_ibge));

    // eslint-disable-next-line
  }, [cities]);

  function handleDoses(index, date) {
    const newdataDoses = [...dataDoses];
    newdataDoses[index].date = date;
    setDataDoses(newdataDoses);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await moradorApi.create({
        cpf,
        nome,
        codigo_ibge: admCity.codigo_ibge,
        data_nascimento: dataNascimento,
        is_obito: parseInt(isObito)
      });

      if (response.status === 200) {
        setIsSuccessful(true);
        reloadPage();
        // try {
        //   const vacinaResponse = await vacinaApi.create({
        //     cpf,
        //     is_vacinado: (doses > 0) ? 1 : 0,
        //     numero_vacinas: parseInt(doses),
        //     primeira_dose: dataDoses[0].date,
        //     segunda_dose: dataDoses[1].date,
        //     terceira_dose: dataDoses[2].date
        //   });
        //   if (vacinaResponse.status === 200) {
        //   }
        // } catch (error) {
        //   console.log("Vacina error:", error);
        //   setIsSuccessful(false);
        // }
      }
    } catch (error) {
      console.log("Morador error:", error);
      setIsSuccessful(false);
    }
  }

  function logoutUser() {
    logout();
    removeUser();
  }

  return (
    <div className="container">
      <div id="header">
        <h2>Cadastro de morador infectado | Covid em Foco</h2>
        {admCity && (
          <h3>{admCity.nome}</h3>
        )}
        <a onClick={logoutUser} href="/login">
          Sair <FiLogOut />
        </a>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nome</label>
        <input
          type="text"
          id="name"
          onChange={e => setNome(e.target.value)}
          required
        />

        <div className="double-column">
          <div className="column">
            <label htmlFor="cpf">CPF</label>
            <input
              type="text"
              id="cpf"
              onChange={e => setCpf(e.target.value)}
              required
            />
          </div>

          <div className="column">
            <label htmlFor="birth-date">Data de nascimento</label>
            <input
              type="date"
              id="birth-date"
              onChange={e => setDataNascimento(e.target.value)}
              required
            />
          </div>
        </div>

        <label htmlFor="doses">N° de doses</label>
        <div className="doses-section">
          <select id="doses" onChange={e => setDoses(e.target.value)}>
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
          <div className="doses-date">
            {dataDoses.slice(0, doses).map((dose, index) => (
              <div key={index} className="choose-date">
                <label htmlFor={dose.description}>{dose.description}</label>
                <input
                  type="date"
                  id={dose.description}
                  onChange={e => handleDoses(index, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
        </div>

        <label htmlFor="death">Óbito</label>
        <div className="death-section">
          <div>
            <input
              type="radio"
              id="opt1"
              name="obito"
              value={1}
              onChange={e => setIsObito(e.target.value)}
              required
            />
            <label htmlFor="opt1">Sim</label>
            <input
              type="radio"
              id="opt2"
              name="obito"
              value={0}
              onChange={e => setIsObito(e.target.value)}
            />
            <label htmlFor="opt2">Não</label>
          </div>
        </div>

        <div className="checkboxClass">
          <input type="checkbox" required />
          <span>Compreendo e aceito com os </span><b>Termos e Condições do site</b>
        </div>
        <button type="submit">Cadastrar</button>
      </form>
      {isSuccessful && (
        <div className="success-message">
          <span>Morador cadastrado com sucesso!</span>
          <p>Redirecionando em 3 segundos...</p>
        </div>
      )}
    </div>
  );
}