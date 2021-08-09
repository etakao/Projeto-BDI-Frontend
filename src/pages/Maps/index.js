import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

import { FiExternalLink, FiMenu } from 'react-icons/fi';

import 'leaflet/dist/leaflet.css';
import './styles.scss';
import './captions.js';
import { CreateCaption } from './captions.js';

export function Maps() {
  const [selectedCity, setSelectedCity] = useState('presidente-prudente');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

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
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
            >
              <option value="alvares-machado">Álvares Machado</option>
              <option value="presidente-prudente">Presidente Prudente</option>
            </select>
          </div>

          <div className="city-info">
            <h2>Presidente Prudente</h2>

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
    </div>
  );
}
