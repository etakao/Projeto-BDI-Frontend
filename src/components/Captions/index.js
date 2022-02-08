import React from 'react';
import './styles.scss';

export function CreateCaption() {
 
        return(
            <div id= "caption">
          
            <h2> LEGENDA </h2>
              <div className="section-caption">
                <div id="low-risk" className="color-risk"></div>
                  <p> Pouco risco </p>
              </div>
              <div className="section-caption">
              <div id="medium-low-risk" className="color-risk"></div>
                  <p> Médio baixo risco </p>
              </div>
              <div className="section-caption">
              <div id="medium-risk" className="color-risk"></div>
                  <p> Médio risco </p>
              </div>
              <div className="section-caption">
              <div id="medium-high-risk" className="color-risk"></div>
                  <p> Médio alto risco </p>
              </div>  
              <div className="section-caption">
              <div id="high-risk" className="color-risk"></div>
                  <p> Alto risco </p>
              </div>
          </div>
        )
    
}
   
