import React, { useState } from "react";

import { cities } from '../../database 13-01';

import "./styles.scss";

export function Forms() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [data_nascimento, setData_nascimento] = useState("");
  const [codigo_ibge, setCodigo_ibge] = useState("");
  const [is_vacinado, setIs_vacinado] = useState("");
  const [doses, setDoses] = useState("");
  const [dosesDate, setDosesDate] = useState([
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
  const [death, setIs_obito] = useState("");

  function handleDoses(index, date) {
    const newDosesDate = [...dosesDate];
    newDosesDate[index].date = date;
    setDosesDate(newDosesDate);
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log(nome, cpf, data_nascimento, codigo_ibge, doses, dosesDate, death);
  }

  return (
    <div className="container">
      <div id="header">
        <h2>Cadastro de morador infectado | Covid em Foco</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nome</label>
        <input
          type="text"
          id="name"
          onChange={e => setNome(e.target.value)}
        />

        <div className="double-column">
          <div className="column">
            <label htmlFor="cpf">CPF</label>
            <input
              type="text"
              id="cpf"
              onChange={e => setCpf(e.target.value)}
            />
          </div>

          <div className="column">
            <label htmlFor="birth-date">Data de nascimento</label>
            <input
              type="date"
              id="birth-date"
              onChange={e => setData_nascimento(e.target.value)}
            />
          </div>
        </div>

        <label htmlFor="select-city">Cidade</label>
        <select
          id="select-city"
          value={codigo_ibge}
          onChange={e => setCodigo_ibge(e.target.value)}
        >
          <option key={'deafult'} value="" >Selecione uma cidade</option>
          {cities.map(city => (
            <option key={city.cep} value={city.cep}>{city.name}</option>
          ))}
        </select>

        <label htmlFor="doses">N° de doses</label>
        <div className="doses-section">
          <select id="doses" onChange={e => setDoses(e.target.value)}>
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
          <div className="doses-date">
            {dosesDate.slice(0, doses).map((dose, index) => (
              <div key={index} className="choose-date">
                <label htmlFor={dose.description}>{dose.description}</label>
                <input
                  type="date"
                  id={dose.description}
                  onChange={e => handleDoses(index, e.target.value)}
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
              onChange={e => setIs_obito(e.target.value)}
            />
            <label htmlFor="opt1">Sim</label>
            <input
              type="radio"
              id="opt2"
              name="obito"
              value={0}
              onChange={e => setIs_obito(e.target.value)}
            />
            <label htmlFor="opt2">Não</label>
          </div>
        </div>

        <div className="checkboxClass">
          <input type="checkbox" />
          <span>Compreendo e aceito com os </span><a href="/forms">Termos e Condições do site</a>
        </div>
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}