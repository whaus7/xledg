import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-vis/dist/style.css';
import {
   XYPlot,
   XAxis,
   YAxis,
   LineSeries,
   VerticalGridLines,
   HorizontalGridLines,
   Crosshair
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
         seriesData.push({ x: i, y: d.close });
      });

      console.log('series data');
      console.log(seriesData);

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
               {/*<Crosshair values={this.state.crosshairValues} />*/}
               <Crosshair values={this.state.crosshairValues}>
                  <div style={{ background: 'black' }}>
                     <h3>Values of crosshair:</h3>
                     <p>
                        x: {this.state.crosshairValues.length > 0 ? this.state.crosshairValues[0].x : false}
                     </p>
                     <p>
                        y: {this.state.crosshairValues.length > 0 ? this.state.crosshairValues[0].y : false}
                     </p>
                     {/*<p>Series 2: {myValues[1].x}</p>*/}
                  </div>
               </Crosshair>
            </XYPlot>
         </div>
      );
   }
}

LineChart.propTypes = {
   data: PropTypes.object
};
