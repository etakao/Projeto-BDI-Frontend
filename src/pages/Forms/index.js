import React, { useState } from "react";

import "./styles.scss";

export function Forms() {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [cep, setCep] = useState("");
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
  const [infectionPeriod, setInfectionPeriod] = useState({
    from: "",
    to: ""
  });
  const [death, setDeath] = useState("");


  function handleDoses(index, date) {
    const newDosesDate = [...dosesDate];
    newDosesDate[index].date = date;
    setDosesDate(newDosesDate);
  }

  function handlePeriod(flag, date) {
    setInfectionPeriod({ ...infectionPeriod, [flag]: date });
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log(name, cpf, birthDate, cep, doses, dosesDate, infectionPeriod, death);
  }

  return (
    <div className="container">
      <div id="header">
        <h2>Cadastro de morador | Covid em Foco</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Nome</label>
        <input
          type="text"
          id="name"
          onChange={e => setName(e.target.value)}
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
              onChange={e => setBirthDate(e.target.value)}
            />
          </div>
        </div>

        <label htmlFor="cep">CEP</label>
        <input
          type="text"
          id="cep"
          onChange={e => setCep(e.target.value)}
        />

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

        <label htmlFor="time">Período de infecção</label>
        <div className="period-section">
          <span>De</span>
          <input type="date" onChange={e => handlePeriod("from", e.target.value)} />
          <span>à</span>
          <input type="date" onChange={e => handlePeriod("to", e.target.value)} />
        </div>

        <label htmlFor="death">Óbito</label>
        <div className="death-section">
          <div>
            <input
              type="radio"
              id="opt1"
              name="obito"
              value={1}
              onChange={e => setDeath(e.target.value)}
            />
            <label htmlFor="opt1">Sim</label>
            <input
              type="radio"
              id="opt2"
              name="obito"
              value={0}
              onChange={e => setDeath(e.target.value)}
            />
            <label htmlFor="opt2">Não</label>
          </div>
          {death === "1" ? (
            <div>
              <label htmlFor="death-date">Data:</label>
              <input type="date" />
            </div>
          ) : ""}
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