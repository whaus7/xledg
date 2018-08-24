import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'react-vis/dist/style.css';
import {
   XYPlot,
   XAxis,
   YAxis,
   LineSeries,
   VerticalGridLines,
   HorizontalGridLines,
   Crosshair,
   MarkSeries
} from 'react-vis';

export default class LineChart extends Component {
   constructor(props) {
      super(props);

      this.state = {
         width: 0,
         seriesData: [],
         crosshairValues: [],
         currIndex: null
      };

      // Need to manually set the width for react-vis charts
      window.onload = function() {
         this.setState({
            width: document.getElementById('centerCol').clientWidth
         });
      }.bind(this);

      window.addEventListener(
         'resize',
         function() {
            this.setState({
               width: document.getElementById('centerCol').clientWidth
            });
         }.bind(this)
      );
   }

   componentWillReceiveProps(nextProps) {
      if (nextProps.data !== null) {
         this.getSeriesData(nextProps.data.exchanges);
      }
   }

   getSeriesData(data) {
      let seriesData = [];
      data.map((d, i) => {
         seriesData.push({ x: moment(d.close_time).unix() * 1000, y: parseFloat(d.close).toFixed(4) });
      });

      // console.log('series data');
      // console.log(seriesData);

      this.setState({
         seriesData: seriesData
      });
   }

   render() {
      return (
         <div
            style={{
               display: 'flex',
               padding: 10
            }}>
            <XYPlot
               height={250}
               width={this.state.width}
               onMouseLeave={() => this.setState({ crosshairValues: [] })}>
               <HorizontalGridLines style={{ opacity: 0.1 }} />
               <YAxis />
               <LineSeries
                  data={this.state.seriesData}
                  onNearestX={(value, { index }) => {
                     this.setState({ crosshairValues: [this.state.seriesData[index]] });
                  }}
                  color="#21c2f8"
                  style={{ strokeWidth: 1 }}
               />
               <Crosshair style={{ color: 'white' }} values={this.state.crosshairValues}>
                  <div
                     style={{
                        background: '#2c3e5o',
                        minWidth: 85,
                        padding: 5,
                        color: '#ffffff',
                        fontSize: 12
                     }}>
                     <div>
                        {this.state.crosshairValues.length > 0
                           ? moment(this.state.crosshairValues[0].x).format('MMM D YYYY')
                           : false}
                     </div>
                     <div>
                        Price:{' '}
                        {this.state.crosshairValues.length > 0 ? this.state.crosshairValues[0].y : false}
                     </div>
                  </div>
               </Crosshair>
               {this.state.crosshairValues.length > 0 ? (
                  <MarkSeries
                     color={'#21c2f8'}
                     data={[
                        {
                           x: this.state.crosshairValues[0].x,
                           y: this.state.crosshairValues[0].y
                           //size: 1
                        }
                     ]}
                  />
               ) : (
                  false
               )}
            </XYPlot>
         </div>
      );
   }
}

LineChart.propTypes = {
   data: PropTypes.object
};
