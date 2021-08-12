import React from 'react'
import './App.css'
import Chart from 'chart.js'
import { Component } from 'react'
import {isBrowser} from "react-device-detect"
import CircularProgress from '@material-ui/core/CircularProgress';

// eslint-disable-next-line
import Zoom from 'chartjs-plugin-zoom'

class ChartTab extends Component { 


    chartRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            color: "Red",
            chart: {}
        }
    }

    // panningNow({ chart }) {

    //     let x = chart.scales["x-axis-0"];
    //     // document.getElementById("vv").innerText = JSON.stringify(chart.data.datasets[0].data.slice(x.minIndex, x.maxIndex + 1));
    //     console.log(x)

    //   }

    // test(chart) {

        // let x = chart.scales["x-axis-0"];
        // console.log(chart)
        // this.setState({ color: "White" })
        // this.state.chart.reset()

    // }

    async componentDidMount() {

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
                    // ticks: {
                    //     max: value
                    // }
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
                    // ticks: {
                    //     max: value
                    // }
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
                onPan: function(chart) {

                }
            },
            zoom: {
                enabled: true,                      
                mode: 'x',
                speed: 0.04 // 4%
            },
        }

        new Chart(myChartRef, {
            type: "line",
                data: {
                    labels: this.props.data.map((key, index) => { return this.props.data[index]["Date"]}),
                    datasets: [
                        {
                            borderColor: this.state.color,
                            fill: false,
                            label: "Active Cases",
                            yAxisId: "ActiveCases",
                            data: this.props.data.map((key, index) => { return this.props.data[index]["Active Cases"]}),
                            pointRadius: 5
                        },
                        {
                            borderColor: "Blue",
                            fill: false,
                            label: "New Cases",
                            yAxisID: "OtherCases",
                            data: this.props.data.map((key, index) => { return this.props.data[index]["New Cases"]}),
                            pointRadius: 5
                        },
                        {
                            borderColor: "Green",
                            fill: false,
                            label: "New Recoveries",
                            yAxisID: "OtherCases",
                            data: this.props.data.map((key, index) => {return this.props.data[index]["New Recoveries"]}),
                            hidden: true,
                            pointRadius: 5
                        }

                    ]
                },
            options: options
        
        });

        this.setState({data: this.props.data, chart: myChartRef })

    }

    render() {

        return(

            <div>
                {this.state.data.length <= 0 ? 
                    <div style={{position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
                        <CircularProgress color="secondary"/> 
                    </div> : 
                    null
                }
                    <div style={{height: !isBrowser ? "calc(90vh - 10vh)" : "90vh"}}>
                        <canvas
                            id="myChart"
                            ref={this.chartRef}
                            style={{height: !isBrowser ? "95%" : "100%", width: "100%"}}/>
                    </div>         
            </div>

        )

    }


}

export default ChartTab