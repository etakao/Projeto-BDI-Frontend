import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { FiExternalLink, FiMenu } from 'react-icons/fi';
import Geocode from 'react-geocode';

import { CreateCaption } from './captions.js';
import { Timeline } from './timeline';

import { cities } from '../../database';

import 'leaflet/dist/leaflet.css';
import './styles.scss';

export function Maps() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isTimelineVisible, setIsTimelineVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [activeCep, setActiveCep] = useState("");
  const [activeCoord, setActiveCoord] = useState("");

  Geocode.setApiKey(process.env.REACT_APP_GOOGLE_TOKEN);
  Geocode.setLanguage("pt-br");
  Geocode.setRegion("br");

  async function convertCepToCoord(cep) {
    if (cep !== "") {
      const response = await Geocode.fromAddress(cep);
      if (response.status === "OK") {
        setActiveCoord(response.results[0].geometry.location);
      }
    }
  };

  function changeSelectedCity(cep) {
    setSelectedCity(cities.find(city => city.cep === cep));
  };

  useEffect(() => {
    changeSelectedCity(activeCep);
    convertCepToCoord(activeCep);
  }, [activeCep]);

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

        {/* {cities.map(city => {
          return (
            <Marker
              icon={mapIcon}
              position={[city.lat, city.lon]}
              key={city.cep}
            >
              <Circle closeButton={false} minWidth={240} maxWidth={240}  >
                {city.name}
              </Circle>
            </Marker>
          );
        })} */}

        {activeCoord &&
          <CircleMarker
            center={[activeCoord.lat, activeCoord.lng]}
            radius={20}
          >
            <Popup>{selectedCity.name}</Popup>
          </CircleMarker>}
      </MapContainer>

      <aside className={isSidebarVisible ? "" : "invisible-sidebar"}>
        <header>
          <FiMenu onClick={() => setIsSidebarVisible(false)} />
          <h1>Covid em foco</h1>
        </header>

        <main>
          <div className="city-selection">
            <label htmlFor="select-city">Cidade</label>
            <select
              id="select-city"
              value={activeCep}
              onChange={e => setActiveCep(e.target.value)}
            >
              <option value="" disabled selected>Selecione uma cidade</option>
              {cities.map(city => (
                <option key={city.cep} value={city.cep}>{city.name}</option>
              ))}
            </select>
          </div>

          <div className="city-info">
            <h2>{activeCep ? selectedCity.name : "Cidade"}</h2>

            <hr />

            <h3>Dados gerais</h3>
            <p>Casos:</p>
            <p>Óbitos:</p>
            <p>Data do primeiro caso:</p>
            <p>População estimada:</p>

            <hr />

            <h3>Boletim</h3>
            <p>Data:</p>
            <p>Confirmados:</p>
            <p>Óbitos:</p>
          </div>
        </main>

        <footer>
          <a href="/forms">Cadastrar novo caso <FiExternalLink /></a>
          <span>Direitos reservados</span>
        </footer>
      </aside>

      <div className={isSidebarVisible ? "invisible-toggle" : "toggle-sidebar"} onClick={() => setIsSidebarVisible(true)}>
        <FiMenu />
      </div>

      <CreateCaption />
      <Timeline isTimelineVisible={isTimelineVisible} setIsTimelineVisible={setIsTimelineVisible} />
    </div>
  );
}
