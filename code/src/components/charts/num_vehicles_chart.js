import React, {Component} from 'react';
import {scaleLinear} from 'd3-scale';
import {XYPlot, XAxis, YAxis, HeatmapSeries, LabelSeries, Hint} from "react-vis";
import Moment from 'moment';

import heatmap_data from './data_charts/num_vehicles_chart.json';

const daysWeek = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
//const hours = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'];  
const hours = ['24','23','22','21','20','19','18','17','16','15','14','13','12','11','10','09','08','07','06','05','04','03','02','01','00'];  

function filterDataFromDates(startDate, endDate) {
  let dictData= {};
  daysWeek.map(day => {
    dictData[day] = {};
    hours.map(hour => dictData[day][hour] = 0);
  });
  const startDateString = Moment(startDate).format('YYYY/MM/DD');
  const endDateString = Moment(endDate).format('YYYY/MM/DD');
  heatmap_data.map(element => {
    if ((element["date"] >= startDateString) && (element["date"] <= endDateString)) {
      if (dictData[element.x] == undefined)
      {
        dictData[element.x] = {};
      }
      if (dictData[element.x][element.y] == undefined) {
        dictData[element.x][element.y] = parseInt(element.num_vehs);
      }
      else {
        dictData[element.x][element.y] += parseInt(element.num_vehs);
      }
      //console.log(dictData[element.x][element.y]);
    }
  });

  let myData = [];
  Object.keys(dictData).map((x, index1) => ( 
    Object.keys(dictData[x]).map((y, index2) => (
      myData.push({x: x, y: y, num_vehs: dictData[x][y]})))));

  //console.log(dictData);
  //console.log(myData);
  return myData;
}

export default class NumVehiclesChart extends Component {
  state = {
    value: false,
    data: null,
    min: 0,
    max: 0,
    old_calendar_ranges: {
      startDate: new Date(),
      endDate: new Date()}
};

  render () {
    const cur_calendar_ranges = this.props.calendar_ranges;
    const old_calendar_ranges = this.state.old_calendar_ranges;
    if (this.state.data === null ||
        old_calendar_ranges.startDate.getTime() !== cur_calendar_ranges.startDate.getTime() ||
        old_calendar_ranges.endDate.getTime() !== cur_calendar_ranges.endDate.getTime()) {
      this.state.old_calendar_ranges = cur_calendar_ranges;
      this.state.data = filterDataFromDates(this.props.calendar_ranges.startDate, this.props.calendar_ranges.endDate);
      //console.log(cur_calendar_ranges);
      //console.log(old_calendar_ranges);
      //console.log(this.state.data);
      const {min, max} = this.state.data.reduce(
        (acc, row) => ({
          min: Math.min(acc.min, row.num_vehs),
          max: Math.max(acc.max, row.num_vehs)
        }),
        {min: Infinity, max: -Infinity}
      );
      this.state.min = min;
      this.state.max = max;
    }
    
    const {value, data} = this.state;
    const exampleColorScale = scaleLinear()
    .domain([this.state.min, (this.state.min + this.state.max) / 2, this.state.max])
    .range(['orange', 'white', 'cyan']);

    return (
      <XYPlot
        xType="ordinal"
        xDomain={daysWeek}
        yType="ordinal"
        yDomain={hours}
        margin={50}
        width={500}
        height={700}
        >
      <XAxis orientation="top" />
      <YAxis />
      <HeatmapSeries
        colorType="literal"
        getColor={d => exampleColorScale(d.num_vehs)}
        style={{
          stroke: 'white',
          strokeWidth: '2px',
          rectStyle: {
            rx: 10,
            ry: 10
          }
        }}
        className="heatmap-series-example"
        data={data}
        onValueMouseOver={v => this.setState({value: v})}
        onSeriesMouseOut={v => this.setState({value: false})}
        />
      <LabelSeries
        style={{pointerEvents: 'none'}}
        data={data}
        labelAnchorX="middle"
        labelAnchorY="baseline"
        getLabel={d => `${d.num_vehs}`}
        />
      {value !== false && <Hint value={value} />}
      </XYPlot>
    );
  }
}