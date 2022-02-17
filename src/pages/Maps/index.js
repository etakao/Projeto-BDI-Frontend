import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { FiExternalLink, FiMenu, FiAlertCircle } from "react-icons/fi";
import Geocode from "react-geocode";

import { Timeline } from "../../components/Timeline";
import { Legend } from "../../components/Legend";

import cidadeApi from '../../services/cidade';
import boletimApi from '../../services/boletim';

import "leaflet/dist/leaflet.css";
import "./styles.scss";

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_TOKEN);
Geocode.setLanguage("pt-br");
Geocode.setRegion("br");

export function Maps() {

  const [date, setDate] = useState(`2022-02-14`);

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isTimelineVisible, setIsTimelineVisible] = useState(false);

  const [selectedCity, setSelectedCity] = useState("");
  const [activeCep, setActiveCep] = useState("");
  const [activeCoord, setActiveCoord] = useState("");
  const [reportCard, setReportCard] = useState("");

  const [cities, setCities] = useState([]);
  const [citiesReport, setCitiesReport] = useState([]);
  const [cityReports, setCityReports] = useState([]);

  const [citiesCoord, setCitiesCoord] = useState([]);

  const [statusAllCities, setstatusAllCities] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false)

  const [timelineContent, setTimelineContent] = useState("");

  async function loadCities() {
    try {
      const cityResponse = await cidadeApi.readAll();
      if (cityResponse.status === 200) {
        setCities(cityResponse.data.cidade);
        StatusAllCities(cityResponse.data.cidade);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  async function loadBoletim(date) {
    try {
      const reportCardResponse = await boletimApi.readByDate(date);
      if (reportCardResponse.status === 200) {
        setCitiesReport(reportCardResponse.data.boletim)
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  async function loadCityBoletins(codigo_ibge) {
    try {
      const cityReportCardResponse = await boletimApi.readByIbge(codigo_ibge);
      if (cityReportCardResponse.status === 200) {
        setCityReports(cityReportCardResponse.data.boletim);
        console.log(cityReportCardResponse.data.boletim)
      }
    } catch (error) {
      console.log(error);
    }
  }

  function StatusAllCities(cities) {
    const statusAllCities = cities.reduce((statusAllCities, cityPos) => {
      statusAllCities.total_casos += cityPos.total_casos;
      statusAllCities.total_obitos += cityPos.total_obitos;
      statusAllCities.total_vacinados += cityPos.total_vacinados;
      statusAllCities.populacao_estimada += cityPos.populacao_estimada
      return (statusAllCities)
    }, {
      codigo_ibge: 0,
      cep: 0,
      data_boletim: date,
      total_casos: 0,
      total_obitos: 0,
      total_vacinados: 0,
      populacao_estimada: 0
    });
    setstatusAllCities(statusAllCities);
  }

  function defaultOption(citiesReport) {
    const auxReportCard = citiesReport.reduce((auxReportCard, citiesReportPos) => {
      auxReportCard.confirmados_diarios += citiesReportPos.confirmados_diarios;
      auxReportCard.obitos_diarios += citiesReportPos.obitos_diarios;
      auxReportCard.vacinados_diarios += citiesReportPos.vacinados_diarios;
      return (auxReportCard)
    }, {
      codigo_ibge: 0,
      cep: 0,
      data_boletim: date,
      confirmados_diarios: 0,
      obitos_diarios: 0,
      vacinados_diarios: 0,
      status_diario: 0
    });
    setReportCard(auxReportCard);
  }

  async function getCityCoord(cep) {
    if (cep !== "") {
      const response = await Geocode.fromAddress(cep);
      if (response.status === "OK") {
        return response.results[0].geometry.location;
      }
    }
  }

  useEffect(() => {
    if (!isReady) {
      loadCities();
      setIsReady(true);
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    loadBoletim(date);
  }, [date, isReady]);

  useEffect(() => {
    if (selectedCity) {
      loadCityBoletins(selectedCity.codigo_ibge);
    }
  }, [date, selectedCity]);

  useEffect(() => {
    if (isReady) {
      const promises = [];
      if (!selectedCity)
        defaultOption(citiesReport);

      for (const city of citiesReport) {
        promises.push(getCityCoord(`${city.cep}`));
      }

      Promise.all(promises).then(response => {
        setCitiesCoord(response);
        setIsLoading(false);
      });
    }
    // eslint-disable-next-line
  }, [citiesReport]);

  useEffect(() => {
    setSelectedCity(cities.find(city => city.cep === activeCep));
    Promise.resolve(getCityCoord(activeCep)).then(response => {
      setActiveCoord(response);
    });
    // eslint-disable-next-line
  }, [activeCep]);

  useEffect(() => {
    if (selectedCity) {
      setReportCard(citiesReport.find(city =>
        city.cep === selectedCity.cep
      ));
    }
  }, [selectedCity, citiesReport]);

  function handleRadiusStatus(status) {
    switch (status) {
      case 1:
        return 10;
      case 2:
        return 17;
      case 3:
        return 24;
      case 4:
        return 31;
      case 5:
        return 38;
      default:
        return 10;
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

  const putMapMark = () => {
    if (activeCoord && selectedCity) {
      return (
        <CircleMarker
          center={[activeCoord.lat, activeCoord.lng]}
          fillOpacity={"90%"}
          opacity={"80%"}
          pathOptions={{ color: selectedRisk(reportCard.status_diario) }}
          radius={handleRadiusStatus(reportCard.status_diario)}
        >
          <Popup>{selectedCity.nome}</Popup>
        </CircleMarker>
      );
    }
  }

  return (
    <div id="maps">
      <MapContainer
        center={[-22.1214431, -51.4135095]}
        zoom={12}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
        />

        {putMapMark()}

        {(!isLoading && (!activeCep)) &&
          citiesReport.map((city, index) => {
            const nameCity = cities.find(atualCity => atualCity.cep === city.cep)

            return (
              <CircleMarker
                key={city.codigo_ibge}
                center={[citiesCoord[index].lat, citiesCoord[index].lng]}
                radius={handleRadiusStatus(city.status_diario)}
                fillOpacity={"80%"}
                opacity={"70%"}
                pathOptions={{ color: selectedRisk(city.status_diario) }}
              >

                <Popup>{nameCity.nome}</Popup>
              </CircleMarker>
            );
          })
        }

      </MapContainer>
      {isReady &&
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
                onChange={e => setActiveCep(parseInt(e.target.value))}
              >
                <option key={'deafult'} value="" >Selecione uma cidade</option>
                {cities.map((city) => (
                  <option key={city.cep} value={city.cep}>{city.nome}</option>
                ))}
              </select>
            </div>

            <div className="city-info">

              <h2>{selectedCity ? "Dados Completos" : "Dados Gerais"}</h2>
              <hr />
              <div className="info-container">
                <p>Total de casos: {selectedCity ? selectedCity.total_casos : statusAllCities.total_casos}</p>
              </div>
              <div className="info-container">
                <p>Total de óbitos: {selectedCity ? selectedCity.total_obitos : statusAllCities.total_obitos}</p>
              </div>
              <div className="info-container">
                <p>Total de vacinados: {selectedCity ? selectedCity.total_vacinados : statusAllCities.total_vacinados}</p>
              </div>
              <div className="info-container">
                <p>População estimada: {selectedCity ? selectedCity.populacao_estimada : statusAllCities.populacao_estimada}</p>
              </div>
            </div>

            <div className="city-info">
              <h2>Boletim</h2>
              <hr />
              <div className="info-container">
                <p>Data:</p>
                <input type="date" key="date" onChange={e => setDate(e.target.value)} value={date} />
              </div>
              <div className="info-container">
                <p>Casos: {reportCard ? reportCard.confirmados_diarios : 0}</p>
              </div>
              <div className="info-container">
                <p>Óbitos: {reportCard ? reportCard.obitos_diarios : 0}</p>
              </div>
              <div className="info-container">
                <p>Vacinados: {reportCard ? reportCard.vacinados_diarios : 0}</p>
              </div>
              <a href="/forms" className="aside-link">Ver mais Informações <FiAlertCircle /></a>
            </div>

            <div className="city-info">
              <h2>Linha do tempo</h2>
              <hr />
              <div className="info-container">
                <input
                  type="radio"
                  name="timeline"
                  id="cases"
                  value="Casos"
                  onClick={e => setTimelineContent(e.target.value)}
                />
                <label htmlFor="cases">Casos</label>
              </div>
              <div className="info-container">
                <input
                  type="radio"
                  name="timeline"
                  id="deaths"
                  value="Óbitos"
                  onClick={e => setTimelineContent(e.target.value)}
                />
                <label htmlFor="deaths">Óbitos</label>
              </div>
              <div className="info-container">
                <input
                  type="radio"
                  name="timeline"
                  id="vaccinated"
                  value="Vacinados"
                  onClick={e => setTimelineContent(e.target.value)}
                />
                <label htmlFor="vaccinated">Vacinados</label></div>
            </div>

          </main>
          <footer>
            <a href="/forms" className="aside-link">Cadastrar novo caso <FiExternalLink /></a>
            <span>Direitos reservados</span>
          </footer>
        </aside>
      }

      <div className={isSidebarVisible ? "invisible-toggle" : "toggle-sidebar"} onClick={() => setIsSidebarVisible(true)}>
        <FiMenu />
      </div>

      <Legend />
      <Timeline
        isTimelineVisible={isTimelineVisible}
        setIsTimelineVisible={setIsTimelineVisible}
        reportType={timelineContent}
        reports={cityReports}
      />

      {(isLoading || !isReady) && (
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
    </div>
  );
}