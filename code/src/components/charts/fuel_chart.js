import React from 'react';
import Moment from 'moment';

import fuel_data from './data_charts/fuel_chart.json';

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries,
  LineSeries,
  Hint
} from 'react-vis';

function filterDataFromDates(startDate, endDate) {
  console.log(fuel_data)
  const startDateString = Moment(startDate).format('YYYY/MM/DD');
  const endDateString = Moment(endDate).format('YYYY/MM/DD');
  let myData = fuel_data.filter(data => {
    return data.x >= startDateString && data.x <= endDateString
  });
  console.log(myData)

  return myData;
}
    
export default class FuelChart extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
          value: null,
        };
        this.internaldata = {
            data: null,
            old_calendar_ranges: {
              startDate: new Date(),
              endDate: new Date()}
          };
      }

    _forgetValue = () => {
        this.setState({
        value: null
        });
    };

    _rememberValue = value => {
        this.setState({value});
    };

    render() {
        const cur_calendar_ranges = this.props.calendar_ranges;
        const old_calendar_ranges = this.internaldata.old_calendar_ranges;
        if (this.internaldata.data === null ||
            old_calendar_ranges.startDate.getTime() !== cur_calendar_ranges.startDate.getTime() ||
            old_calendar_ranges.endDate.getTime() !== cur_calendar_ranges.endDate.getTime()) {
          this.internaldata.old_calendar_ranges = cur_calendar_ranges;
          this.internaldata.data = filterDataFromDates(this.props.calendar_ranges.startDate, this.props.calendar_ranges.endDate);
          console.log(cur_calendar_ranges);
          console.log(old_calendar_ranges);
          console.log(this.internaldata.data);
        }

        const {value} = this.state;
        
        if (cur_calendar_ranges.startDate === cur_calendar_ranges.endDate){
          return (
            <div style={{ marginTop: "15px" }}>
              <XYPlot xType="ordinal" width={300} height={300}>
                  <VerticalGridLines />
                  <HorizontalGridLines />
                  <XAxis tickLabelAngle={-45} />
                  <YAxis />
                  <MarkSeries
                  onValueMouseOver={this._rememberValue}
                  onValueMouseOut={this._forgetValue}
                  data={this.internaldata.data}
                  />
                  {value ? <Hint value={value} /> : null}
              </XYPlot>
            </div>
            );
        } else {
          return (
            <div style={{ marginTop: "15px" }}>
              <XYPlot xType="ordinal" height={300} width={300}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis tickLabelAngle={-45} />
                <YAxis />
                <LineSeries data={this.internaldata.data} color="yellow" />
              </XYPlot>
            </div>
          );
        }
        
    }
}