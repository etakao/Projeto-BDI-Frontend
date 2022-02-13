import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { FiExternalLink, FiMenu, FiAlertCircle } from 'react-icons/fi';
import Geocode from 'react-geocode';

import { Timeline } from '../../components/Timeline';
import { Legend } from '../../components/Legend';

import { cities } from '../../database 13-01';
import { boletim } from '../../boletim';

import 'leaflet/dist/leaflet.css';
import './styles.scss';

export function Maps() {
  /*const atualDate = new Date()
  const day = String(atualDate.getDate()).padStart(2,'0')
  const month = String(atualDate.getMonth()+ 1).padStart(2,'0')
  const year = atualDate.getFullYear()*/

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isTimelineVisible, setIsTimelineVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [activeCep, setActiveCep] = useState("");
  const [activeCoord, setActiveCoord] = useState("");
  const [reportCard, setReportCard] = useState("");
  //const [date, setDate]= useState(`${year}-${month}-${day}`)
  const [date, setDate] = useState('2022-01-24');

  const [citiesCoord, setCitiesCoord] = useState([]);
  const [citiesReport, setCitiesReport] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  Geocode.setApiKey(process.env.REACT_APP_GOOGLE_TOKEN);
  Geocode.setLanguage("pt-br");
  Geocode.setRegion("br");

  function handleRadiusStatus(status) {
    switch (status) {
      case 1:
        return 10;
      case 2:
        return 14;
      case 3:
        return 18;
      case 4:
        return 22;
      case 5:
        return 26;
      default:
        return 5;
    }
  }

  function selectedRisk(status) {
    switch (status) {
      case 1:
        return ("#78D1E1")
      case 2:
        return ("#67E480")
      case 3:
        return ("#E7DE79")
      case 4:
        return ("#E89E64")
      case 5:
        return ("#E96379")
      default:
        return ("#78D1E1")
    }
  }

  function defaultOption(date) {
    const auxReportCard = boletim.reduce((auxReportCard, RCpos) => {
      if (RCpos.data === date) {
        auxReportCard.confirmados = auxReportCard.confirmados + RCpos.confirmados;
        auxReportCard.total_confirmados = auxReportCard.total_confirmados + RCpos.total_confirmados;
        auxReportCard.total_obtios = auxReportCard.total_obtios + RCpos.total_obtios;
        auxReportCard.total_vacinados = auxReportCard.total_vacinados + RCpos.total_vacinados;
      }
      return (auxReportCard)
    }, {
      id: 0,
      codigo_ibge: '',
      data: date,
      confirmados: 0,
      total_confirmados: 0,
      total_obtios: 0,
      total_vacinados: 0,
      status: 0
    });
    setReportCard(auxReportCard);
  }

  function changeSelectedCity(cep) {
    setSelectedCity(citiesReport.find(city => city.cep === cep))
  };

  async function getCityCoord(cep) {
    if (cep !== "") {
      const response = await Geocode.fromAddress(cep);
      if (response.status === "OK") {
        return response.results[0].geometry.location;
      }
    }
  }

  useEffect(() => {
    const promises = [];

    defaultOption(date);

    const filteredCities = boletim.filter(city =>
      city.data === date
    );
    setCitiesReport(filteredCities);

    for (const city of filteredCities) {
      promises.push(getCityCoord(city.cep));
    }

    Promise.all(promises).then(response => {
      setCitiesCoord(response);
      setIsLoading(false);
    });

    // eslint-disable-next-line
  }, [date]);

  useEffect(() => {
    changeSelectedCity(activeCep);
    Promise.resolve(getCityCoord(activeCep)).then(response => {
      setActiveCoord(response);
    });

    // eslint-disable-next-line
  }, [activeCep]);

  useEffect(() => {
    if (selectedCity) {
      setReportCard(citiesReport.find(city =>
        city.codigo_ibge === selectedCity.codigo_ibge
      ));
    }

    // eslint-disable-next-line
  }, [selectedCity, date]);

  const putMapMark = () => {
    if (activeCoord && selectedCity) {
      return (
        <CircleMarker
          center={[activeCoord.lat, activeCoord.lng]}
          fillOpacity={"80%"}
          opacity={"60%"}
          pathOptions={{ color: selectedRisk(reportCard.status) }}
          radius={handleRadiusStatus(reportCard.status)}
        >
          <Popup>{selectedCity.name}</Popup>
        </CircleMarker>
      );
    }
  }

  return (
    <div id="maps">
      <MapContainer
        center={[-22.1214431, -51.4135095]}
        zoom={12}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
        />

        {putMapMark()}

        {(!isLoading && (activeCep === "")) &&
          citiesReport.map((city, index) => {
            return (
              <CircleMarker
                key={city.codigo_ibge}
                center={[citiesCoord[index].lat, citiesCoord[index].lng]}
                radius={handleRadiusStatus(city.status)}
                fillOpacity={"80%"}
                opacity={"60%"}
                pathOptions={{ color: selectedRisk(city.status) }}
              >
                <Popup>{city.name}</Popup>
              </CircleMarker>
            );
          })
        }

      </MapContainer>
      <aside className={isSidebarVisible ? "" : "invisible-sidebar"}>
        <header>
          <FiMenu onClick={() => setIsSidebarVisible(false)} />
          <h1>Covid em Foco</h1>
        </header>
        <main>
          <div className="city-selection">
            <label htmlFor="select-city">Cidade</label>
            <select
              id="select-city"
              value={activeCep}
              onChange={e => setActiveCep(e.target.value)}
            >
              <option key={'deafult'} value="" >Selecione uma cidade</option>
              {cities.map(city => (
                <option key={city.cep} value={city.cep}>{city.name}</option>
              ))}
            </select>
          </div>

          <div className="city-info">
            <h2>{activeCep ? "Dados Completos" : "Dados Gerais"}</h2>
            <hr />
            <div className="info-container">
              <p>Total de casos: {reportCard ? reportCard.total_confirmados : 0}</p>
            </div>
            <div className="info-container">
              <p>Total de óbitos: {reportCard ? reportCard.total_obtios : 0}</p>
            </div>
            <div className="info-container">
              <p>Total de vacinados: {reportCard ? reportCard.total_vacinados : 0}</p>
            </div>
            <div className="info-container">
              <p>População estimada: {selectedCity ? selectedCity.populacao_estimada : 0}</p>
            </div>
          </div>

          <div className="city-info">
            <h2>Boletim</h2>
            <hr />
            <div className="info-container">
              <p>Data:</p>
              <input type='date' key="date" onChange={e => setDate(e.target.value)} value={date} />
            </div>
            <div className="info-container">
              <p>Casos: {reportCard ? reportCard.confirmados_diario : 0}</p>
            </div>
            <div className="info-container">
              <p>Óbitos: {reportCard ? reportCard.obitos_diarios : 0}</p>
            </div>
            <div className="info-container">
              <p>Vacinados: {reportCard ? reportCard.vacinados_diarios : 0}</p>
            </div>
            <a href="/forms" className='aside-link'>Ver mais Informações <FiAlertCircle /></a>
          </div>

          <div className="city-info">
            <h2>Linha do tempo</h2>
            <hr />
            <p><input type='checkbox' name="cases" /> Casos</p>
            <p><input type='checkbox' name="deaths" /> Óbitos</p>
            <p><input type='checkbox' name="vaccinated" /> Vacinados</p>
          </div>

        </main>
        <footer>
          <a href="/forms" className='aside-link'>Cadastrar novo caso <FiExternalLink /></a>
          <span>Direitos reservados</span>
        </footer>
      </aside>

      <div className={isSidebarVisible ? "invisible-toggle" : "toggle-sidebar"} onClick={() => setIsSidebarVisible(true)}>
        <FiMenu />
      </div>

      <Legend />
      <Timeline isTimelineVisible={isTimelineVisible} setIsTimelineVisible={setIsTimelineVisible} />
    </div>
  );
}
