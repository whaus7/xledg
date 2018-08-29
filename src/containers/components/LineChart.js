import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import CurrencyFormatter from 'currency-formatter';
import Numeral from 'numeral';
import 'react-vis/dist/style.css';
import {
   XYPlot,
   YAxis,
   LineSeries,
   VerticalBarSeries,
   HorizontalGridLines,
   Crosshair,
   MarkSeries
} from 'react-vis';
import COLORS from '../../services/colors';

export default class LineChart extends Component {
   constructor(props) {
      super(props);

      this.state = {
         width: 0,
         seriesData: [],
         volumeData: [],
         highestVolume: 0,
         highestPrice: 0,
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
      let volumeData = [];
      let highestVolume = 0;
      let highestPrice = 0;

      data.map((d, i) => {
         let volumeNum = parseFloat(d.counter_volume);
         let priceNum = parseFloat(d.close);

         seriesData.push({
            x: moment(d.close_time).unix() * 1000,
            y: priceNum.toFixed(4)
         });

         volumeData.push({
            x: moment(d.close_time).unix() * 1000,
            y: volumeNum.toFixed(2)
         });

         if (volumeNum > highestVolume) {
            highestVolume = volumeNum;
         }

         if (priceNum > highestPrice) {
            highestPrice = priceNum;
         }

         return true;
      });

      this.setState({
         seriesData: seriesData,
         volumeData: volumeData,
         highestVolume: highestVolume * 1.1,
         highestPrice: highestPrice * 1.1
      });
   }

   render() {
      return (
         <div
            style={{
               padding: '18px 10px 10px 10px'
            }}>
            {/*PRICE CHART*/}
            <div style={{ textAlign: 'center' }}>
               <h2 style={{ position: 'absolute', display: 'inline-flex', marginTop: -7, marginLeft: -23 }}>
                  <span style={{ opacity: 0.5, marginRight: 5 }}>PRICE</span>
                  <span style={{ color: COLORS.aqua }}>
                     {this.props.baseCurrency.value}/{this.props.counterCurrency.value}
                  </span>
               </h2>
            </div>
            <div id={'priceChart'}>
               <XYPlot
                  height={250}
                  width={this.state.width}
                  yDomain={[0, this.state.highestPrice]}
                  onMouseLeave={() => this.setState({ crosshairValues: [] })}>
                  <HorizontalGridLines style={{ opacity: 0.1 }} />
                  <YAxis />
                  <LineSeries
                     data={this.state.seriesData}
                     onNearestX={(value, { index }) => {
                        this.setState({
                           crosshairValues: [this.state.seriesData[index], this.state.volumeData[index]]
                        });
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
                        {/*DATE*/}
                        <div>
                           {this.state.crosshairValues.length > 0
                              ? moment(this.state.crosshairValues[0].x).format('MMM D YYYY')
                              : false}
                        </div>
                        {/*PRICE*/}
                        <div>
                           {this.state.crosshairValues.length > 0
                              ? `${
                                   CurrencyFormatter.findCurrency(this.props.counterCurrency.value).symbol
                                }${parseFloat(this.state.crosshairValues[0].y).toFixed(4)} ${
                                   this.props.counterCurrency.value
                                }`
                              : false}
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

            {/*VOLUME CHART*/}
            <div style={{ textAlign: 'center' }}>
               <h2 style={{ position: 'absolute', display: 'inline-flex', opacity: 0.5, marginTop: -7 }}>
                  VOLUME
               </h2>
            </div>
            <div id={'volumeChart'}>
               <XYPlot
                  height={150}
                  width={this.state.width}
                  yDomain={[0, this.state.highestVolume]}
                  onMouseLeave={() => this.setState({ crosshairValues: [] })}>
                  <HorizontalGridLines style={{ opacity: 0.1 }} />
                  <YAxis tickFormat={v => Numeral(v).format('0a')} />
                  <VerticalBarSeries
                     data={this.state.volumeData}
                     color={'#909090'}
                     onNearestX={(value, { index }) => {
                        this.setState({
                           crosshairValues: [this.state.seriesData[index], this.state.volumeData[index]]
                        });
                     }}
                  />

                  <Crosshair style={{ color: 'white' }} values={this.state.crosshairValues}>
                     <div
                        style={{
                           background: '#2c3e5o',
                           minWidth: 75,
                           padding: 5,
                           color: '#ffffff',
                           fontSize: 12
                        }}>
                        {/*DATE*/}
                        {/*<div>*/}
                        {/*{this.state.crosshairValues.length > 0*/}
                        {/*? moment(this.state.crosshairValues[0].x).format('MMM D YYYY')*/}
                        {/*: false}*/}
                        {/*</div>*/}
                        {/*VOLUME*/}
                        <div>
                           {this.state.crosshairValues.length > 0
                              ? `${
                                   CurrencyFormatter.findCurrency(this.props.counterCurrency.value).symbol
                                }${Numeral(this.state.crosshairValues[1].y).format('0a')} ${
                                   this.props.counterCurrency.value
                                }`
                              : false}
                        </div>
                     </div>
                  </Crosshair>
               </XYPlot>
            </div>
         </div>
      );
   }
}

LineChart.propTypes = {
   data: PropTypes.object,
   baseCurrency: PropTypes.object,
   counterCurrency: PropTypes.object
};
