import React from 'react';
import './captions.scss';

export function CreateCaption() {
 
        return(
            <div id= "caption">
          
            <h2> LEGENDA </h2>
              <div class="section-caption">
                <div id="low-risk" class="color-risk"></div>
                  <p> Pouco risco </p>
              </div>
              <div class="section-caption">
              <div id="medium-low-risk" class="color-risk"></div>
                  <p> Médio baixo risco </p>
              </div>
              <div class="section-caption">
              <div id="medium-risk" class="color-risk"></div>
                  <p> Médio risco </p>
              </div>
              <div class="section-caption">
              <div id="medium-high-risk" class="color-risk"></div>
                  <p> Médio alto risco </p>
              </div>  
              <div class="section-caption">
              <div id="high-risk" class="color-risk"></div>
                  <p> Alto risco </p>
              </div>
          </div>
        )
    
}
   
