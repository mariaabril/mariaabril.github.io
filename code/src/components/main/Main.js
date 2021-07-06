import "./Main.css";
import Map from "../map/Map";

import React, { useState } from 'react';
//import 'react-calendar/dist/Calendar.css';
//import CollapsableCalendar from '../calendar/calendar';
import LayerSelector from "../layers/layers";
import {layerOptions} from "../layers/layers";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import Moment from 'moment';

import GetNumIds from "../kpis/kpi_numvehicles"
import GetMeanSpeed from "../kpis/kpi_meanspeed"
import GetMeanDistance from "../kpis/kpi_meandistance"
import GetFuelGastado from  "../kpis/kpi_consumedfuel"


function GetNumExcep({exceptions}) {
  if (exceptions.length === 0) {
    return '-';
  } else {
    return exceptions.length;
  }
}

function makeCancelablePromise(promise) {
  let isCanceled = false;
  const wrappedPromise =
    new Promise((resolve, reject) => {
    // Suppress resolution and rejection if canceled
    promise
        .then((val) => (!isCanceled && resolve(val)))
        .catch((error) => (!isCanceled && reject(error)));
    });
  return {
    promise: wrappedPromise,
    cancel() {
      isCanceled = true;
    },
  };
}

const Main = (params) => {
  const [last_date_range, setDateRange] = useState (
    {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
    }
  );
  const [filtered_vehicles, filterVehicles] = useState (
    {
      type: 'FeatureCollection',
      features: []
    }
  );
  const [filtered_exceptions, filterExceptions] = useState (
    {
      features: []
    }
  );
  const [filtered_fuel, filterFuel] = useState([]);
  const [filterLayers, setFilterLayers] = useState(
    {
      initial: 1 // need to mark it for initial update
    }
  );
  const [fetch_promises, setPromises] = useState(
    {
      fetchVehicles: null,
      fetchExceptions: null,
      fetchFuel: null
    }
  );

  const handleLayerSelectOption = (options) => {
    var newLayers = []

    options.map((option) => newLayers.push(option.value));
    setFilterLayers(newLayers);
    //console.log(newLayers);
  }

  // initial update
  if(filterLayers.initial === 1) {
    handleLayerSelectOption(layerOptions);
  }

  if (last_date_range.startDate.getTime() !== params.calendar_ranges.startDate.getTime() ||
      last_date_range.endDate.getTime() !== params.calendar_ranges.endDate.getTime())
  {
    //console.log(last_date_range)
    //console.log(params.calendar_ranges)
    setDateRange(params.calendar_ranges);
  
    if (fetch_promises.fetchVehicles !== null) {
      fetch_promises.fetchVehicles.cancel();
    }
    if (fetch_promises.fetchExceptions !== null) {
      fetch_promises.fetchExceptions.cancel();
    }
    if (fetch_promises.fetchFuel !== null) {
      fetch_promises.fetchFuel.cancel();
    }
    // create an array with filenames to fetch
    var vehicles_files = []
    var exceptions_files = []
    var fuel_files = []

    var iterateDate = new Date(params.calendar_ranges.startDate)
    while(iterateDate <= params.calendar_ranges.endDate) {
      const datestring = Moment(iterateDate).format('YYYYMMDD');
      iterateDate.setDate(iterateDate.getDate() + 1);
      //console.log(datestring);
      // ** exceptions ** 
      const exceptions_filename = '/data/all_exceptions/exceptions_' + datestring + '.json';
      exceptions_files.push(exceptions_filename);
      const vehicles_filename = '/data/all_vehicles/vehicles_' + datestring + '.json';
      vehicles_files.push(vehicles_filename)
      const fuel_filename = '/data/all_fuel/fuel_' + datestring + '.json';
      fuel_files.push(fuel_filename)
    } 
    //console.log(exceptions_files);

    // fetch all needed vehicles files and set filtered_vehicles
    let fetchVehiclesPromise = makeCancelablePromise(Promise.all(
      vehicles_files.map(filename => 
        fetch(filename)
          .then(res => res.text())
          .then(text => {
            try {
              const json = JSON.parse(text);
              return json.features;
            } catch(err) {
              //console.log(text);
              //console.log(filename + ':\n' + err)
              return [];
            }
          })
        ) 
      ).then(new_vehicles => {
          const all_vehicles = [].concat.apply([], new_vehicles);
          //console.log(all_vehicles);
          filterVehicles({
            type: 'FeatureCollection',
            features: all_vehicles
          });
          return all_vehicles;
          //console.log(filtered_vehicles);
      })
    );

    // fetch all needed exception files and set filtered_exceptions
    let fetchExceptionsPromise = makeCancelablePromise(Promise.all(
      exceptions_files.map(filename => 
        fetch(filename)
          .then(res => res.text())
          .then(text => {
            try {
              const json = JSON.parse(text);
              return json.features;
            } catch(err) {
              //console.log(filename + ':\n' + err)
              return [];
            }
          })
        ) 
      ).then(new_exceptions => {
        const all_exceptions = [].concat.apply([], new_exceptions);
        console.log(all_exceptions);
        filterExceptions({
            features: all_exceptions
        });
        //console.log(all_exceptions);
      })
    );

    // fetch all needed fuel files and set filtered_fuel
    let fetchFuelPromise = makeCancelablePromise(Promise.all(
        fuel_files.map(filename => 
          fetch(filename)
            .then(res => res.text())
            .then(text => {
              try {
                //console.log('hola')
                const json = JSON.parse(text);
                //console.log(json)
                return json.features;
              } catch(err) {
                console.log(filename + ':\n' + err)
                //console.log(text)
                return [];
              }
            })
        ) 
      ).then(new_fuel => {
          const all_fuel = [].concat.apply([], new_fuel);
          //console.log(all_fuel);
          filterFuel(all_fuel.slice(0));
          //console.log('filtered_fuel');
          //console.log(filtered_fuel);
      })
    );

    setPromises(
      {
        fetchVehicles : fetchVehiclesPromise,
        fetchExceptions : fetchExceptionsPromise,
        fetchFuel : fetchFuelPromise
      }
    );
  }

  return (
    <main> 
      <div className="main__container">
        {/* <!-- CHARTS STARTS HERE --> */}
        <div className="charts">
          <div className="charts__left">
            
              <Map data_veh={filtered_vehicles} data_excep={filtered_exceptions.features} filter_layers={filterLayers} width="50vw" height="100%" />
            </div>

          <div className="charts__right__cards">            
          
              <div className="ExceptionButtons">
                <p className="capas">CAPAS</p>
                <LayerSelector onChange_layer_selection={handleLayerSelectOption}/>
              </div>
          <div>
            <div id="cards" className="card1">
              <h2>
                Número de vehículos: <br/>
                <GetNumIds vehicles={filtered_vehicles} />
              </h2>
            </div>

            <div id="cards" className="card2">
              <h2>
                Distancia media recorrida <br/>
                <GetMeanDistance vehicles={filtered_vehicles}/> 
              </h2>
            </div>

            <div id="cards" className="card3">
              <h2>
                Velocidad media <br/>
                <GetMeanSpeed vehicles={filtered_vehicles}/>
              </h2>
            </div>

            <div id="cards" className="card4">
              <h2>
                Total infracciones: <br/>
                <GetNumExcep exceptions={filtered_exceptions.features} />
              </h2>
            </div>

            <div id="cards" className="card5">
              <h2>
                Promedio de combustible gastado: <br/>
                <GetFuelGastado fuels={filtered_fuel} />
                </h2>
            </div>
          </div>
        
          </div>
      </div>
        {/* <!-- CHARTS ENDS HERE --> */}
      </div>
    </main>
  );
};

export default Main;
