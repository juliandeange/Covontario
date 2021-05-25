import React from 'react'
import './App.css'
import Chart from 'chart.js'
import { Component } from 'react'
import Tabletop from 'tabletop'
import {isBrowser} from "react-device-detect"

// eslint-disable-next-line
import Zoom from 'chartjs-plugin-zoom'

class ChartTab extends Component { 


    chartRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
    }


    componentDidMount(){

        const myChartRef = this.chartRef.current.getContext("2d");

        var currentDate = new Date();
        var daysBack = new Date(currentDate);
        daysBack.setDate(daysBack.getDate() - 90);

        const options = {
            maintainAspectRatio: false,
            responsive: false,
            legend: {
                position: "bottom",
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
                        tooltipFormat: "MMM DD YYYY"
                    },
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        min: daysBack.toDateString(),
                        autoSkip: true,
                        maxTicksLimit: isBrowser ? 50 : 15
                    }
                }],
                yAxes:[{
                    id: "ActiveCases",
                    type: "linear",
                    gridLines:{
                        // display: false
                    },
                    scaleLabel: {
                        display: true,
                        fontColor: "white",
                        fontSize: 14,
                        fontStyle: "bold",
                        labelString: "Active Cases"
                    },
                },
                {
                    id: "OtherCases",
                    type: "linear",
                    position: "right",
                    gridLines:{
                        display: false
                    },
                    scaleLabel: {
                        display: true,
                        fontColor: "white",
                        fontSize: 14,
                        fontStyle: "bold",
                        labelString: "New Cases / Recoveries"
                    },
                }
            ]
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
                speed: 0.04 // as a percent
            }
        }

        Tabletop.init({
            key: '1hHv7MeOpp9G2obU_7iqxh8U0RRvcRSZVTp8VEfn1h8o',
            callback: googleData => {
              new Chart(myChartRef, {
                type: "line",
                data: {
                    labels: googleData.map((key, index) => { return googleData[index]["Date"]}),
                    datasets: [
                        {
                            borderColor: "Red",
                            fill: false,
                            label: "Active Cases",
                            yAxisId: "ActiveCases",
                            data: googleData.map((key, index) => { return googleData[index]["Active Cases"]}),
                            pointRadius: 5
                        },
                        {
                            borderColor: "Blue",
                            fill: false,
                            label: "New Cases",
                            yAxisID: "OtherCases",
                            data: googleData.map((key, index) => { return googleData[index]["New Cases"]}),
                            pointRadius: 5
                        },
                        {
                            borderColor: "Green",
                            fill: false,
                            label: "New Recoveries",
                            yAxisID: "OtherCases",
                            data: googleData.map((key, index) => {return googleData[index]["New Recoveries"]}),
                            hidden: true,
                            pointRadius: 5
                        }

                    ]
                },
                options: options
                
            });

            this.setState({data: googleData, refCurrent: this.chartRef.current })

            },
            simpleSheet: true
          })

    }

    render() {

        return(

            <div style={{height: !isBrowser ? "calc(90vh - 10vh)" : "90vh"}}>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                    style={{height: !isBrowser ? "95%" : "100%", width: "100%"}}/>
                    {/* // style={{height: "100vh", width: "100%"}}/> */}
                        
            </div>

        )

    }


}

export default ChartTab