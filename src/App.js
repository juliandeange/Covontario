import React from 'react';
import './App.css';
import Chart from 'chart.js'
import { Component } from 'react';
import Tabletop from 'tabletop';
import {isBrowser} from "react-device-detect";
// import CanvasJSReact from './canvasjs.react';
//var CanvasJSReact = require('./canvasjs.react');
// var CanvasJS = CanvasJSReact.CanvasJS;
// var CanvasJSChart = CanvasJSReact.CanvasJSChart;


class App extends Component {

    chartRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            records: [],
            dictionary: {},
            sheetData: []
        }
    }

    componentDidMount(){
            
        this.ParseRecords()

    }

    componentDidUpdate(props, state) {

        // console.log("update")

    }

    ParseRecords(){

        // this.setState({dictionary: cases})
        const myChartRef = this.chartRef.current.getContext("2d");
    
        const options = {
            legend: {
                labels: {
                    fontColor: "white",
                    fontSize: 14,
                    fontStyle: "bold"
                }
            },
            scales:{
                xAxes:[{
                    id: "A",
                    scaleLabel: {
                        display: true,
                        fontColor: "white",
                        fontSize: 14,
                        fontStyle: "bold",
                        labelString: "Day"
                    },
                    type: "time",
                    time:{
                        tooltipFormat: "MMM DD"
                    },
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 50
                    }
                }],
                yAxes:[{
                    type: "linear",
                    gridLines:{
                        // display: false
                    },
                    scaleLabel: {
                        display: true,
                        fontColor: "white",
                        fontSize: 14,
                        fontStyle: "bold",
                        labelString: "# of Active Cases"
                    },
                }]
            },
            tooltips:{
                callbacks:{
                    label: function(tooltipItem, data){
                        return tooltipItem.yLabel;
                    }
                }
            },
            pan: {
                enabled: true,
                mode: 'x',
            },
            zoom: {
                enabled: true,                      
                mode: 'x',
            }
        }

        Tabletop.init({
            key: '1hHv7MeOpp9G2obU_7iqxh8U0RRvcRSZVTp8VEfn1h8o',
            callback: googleData => {
              console.log('google sheet data --->', googleData)
                

              new Chart(myChartRef, {
                type: "line",
                data: {
                    // labels: sortedCases.map((key, index) => { return sortedCases[index][0] }),
                    labels: googleData.map((key, index) => { return googleData[index]["Date"]}),
                    datasets: [
                        {
                            borderColor: "Red",
                            fill: false,
                            label: "Active Cases of COVID in Ontario",
                            
                            // data: sortedCases.map((key, index) => { return sortedCases[index][1] })
                            data: googleData.map((key, index) => { return googleData[index]["Active Cases"]})
                        }
                    ]
                },
                options: options
            });


            },
            simpleSheet: true
          })
    
        // console.log("done parse")

    }

    render() {
        return (

            // {isBrowser ? <div></div> : }

            <div 
            style={{
                background: "radial-gradient(circle, rgba(83,51,87,1) 0%, rgba(0,0,0,1) 100%)",
                height: isBrowser ? "100vh" : "120vh"
            }}>

                {/* <div style={{color: "white", style: "bold"}}>
                    Total Cases: {}
                </div> */}

                

                <canvas
                    id="myChart"
                    ref={this.chartRef}
                    // style={{width: 800, height: 300}}
                />

                

                {/* <CanvasJSChart options={options}/> */}
                
                

            </div>
            
        )

    }

}

export default App;
