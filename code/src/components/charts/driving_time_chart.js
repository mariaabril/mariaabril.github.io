import React from 'react';
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries,
  VerticalBarSeriesCanvas,
  LabelSeries,
  DiscreteColorLegend
} from "react-vis";
import Moment from 'moment';

import myData from './data_charts/driving_time_chart.json';


function filterDataFromDates(startDate, endDate) {
  const startDateString = Moment(startDate).format('YYYY/MM/DD');
  const endDateString = Moment(endDate).format('YYYY/MM/DD');
  var filteredData = myData.filter(data => {
      return data.x >= startDateString && data.x <= endDateString
    });

  console.log(filteredData);
  return filteredData;
}

export default class DrivingTimeChart extends React.Component {
  state = {
    useCanvas: false,
    data: null,
    min: 0,
    max: 0,
    old_calendar_ranges: {
      startDate: new Date(),
      endDate: new Date()}
  };

  render() {
    const cur_calendar_ranges = this.props.calendar_ranges;
    const old_calendar_ranges = this.state.old_calendar_ranges;
    if (this.state.data === null ||
        old_calendar_ranges.startDate.getTime() !== cur_calendar_ranges.startDate.getTime() ||
        old_calendar_ranges.endDate.getTime() !== cur_calendar_ranges.endDate.getTime()) {
      let newState = this.state;
      newState.old_calendar_ranges = cur_calendar_ranges;
      newState.data = filterDataFromDates(this.props.calendar_ranges.startDate, this.props.calendar_ranges.endDate);
      const {min, max} = newState.data.reduce(
        (acc, row) => ({
          min: Math.min(acc.min, row.y),
          max: Math.max(acc.max, row.y)
        }),
        {min: Infinity, max: -Infinity}
      );
      newState.min = min;
      newState.max = max;
      console.log(min + '  ' + max);
      this.state = newState;
    }

    const {useCanvas, data} = this.state;
    const BarSeries = useCanvas ? VerticalBarSeriesCanvas : VerticalBarSeries;
    return (
      <div>
        <XYPlot xType="ordinal" width={300} height={300} xDistance={100}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis tickLabelAngle={-45} />
          <YAxis />
          <BarSeries className="vertical-bar-series-example" data={data} />
        </XYPlot>
      </div>
    );
  }
}