import "../../../node_modules/react-vis/dist/style.css";
import './charts.css'
import {
  XYPlot,
  LineSeries,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalBarSeriesCanvas,
  LabelSeries
} from "react-vis";
import DistanceChart from './distance_chart'
import DrivingTimeChart from './driving_time_chart'
import NumVehiclesChart from './num_vehicles_chart'
import ExceptionsChart from "./exceptions_chart"
import FuelChart from './fuel_chart'


const Chart = (params) => {
  
  return (
    <div class="wrapper">
      <div class="box a">
        <h3 className="titulo_charts">Distancia recorrida (km)</h3>
        <DistanceChart calendar_ranges={params.calendar_ranges}/>
      </div>
      <div class="box b">
        <h3 className="titulo_charts">Combustible consumido (l/100km)</h3>
        <FuelChart calendar_ranges={params.calendar_ranges}/>
      </div>
      <div class="box c"> 
        <h3 className="titulo_charts">Tipos de infracción</h3>
        <ExceptionsChart calendar_ranges={params.calendar_ranges}/>
      </div>
      <div class="box d">
        <h3 className="titulo_charts">Vehículos según la hora y el día</h3>
        <NumVehiclesChart calendar_ranges={params.calendar_ranges}/>
      </div>
      <div class="box e">
        <h3 className="titulo_charts">Tiempo en conducción</h3>
        <DrivingTimeChart calendar_ranges={params.calendar_ranges}/>
      </div>
    </div>
  );
};

export default Chart;