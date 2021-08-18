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
            chart: {},
            value: 1
        }
    }
    
    setAxis(chart) {
        
        // chart.chart.options.scales.yAxes[0].ticks.max++
        // chart.chart.options.scales.yAxes[1].ticks.max++

        // Get date range shown
        var startEpoch = chart.chart.scales["A"]._ticks[0].value
        var endEpoch = chart.chart.scales["A"]._ticks[chart.chart.scales["A"]._ticks.length - 1].value

        var startDate = new Date(startEpoch)
        var endDate = new Date(endEpoch)

        var startDateString = startDate.toLocaleString('default', { month: 'long' }) + ' ' + (startDate.getDate() < 10 ? '0' + startDate.getDate() : startDate.getDate()) + ' ' + startDate.getFullYear()
        var endDateString = endDate.toLocaleString('default', { month: 'long' }) + ' ' + (endDate.getDate() < 10 ? '0' + endDate.getDate() : endDate.getDate()) + ' ' + endDate.getFullYear()

        var startIndex = this.state.data.findIndex(i => i.Date === startDateString)
        var endIndex = this.state.data.findIndex(i => i.Date === endDateString)

        // Get range of dates shown
        var range = this.state.data.slice(startIndex === -1 ? 0 : startIndex, endIndex === -1 ? this.state.data.length : endIndex)

        // Get max values for each axis
        var maxActive = Math.max(...range.map(i => i["Active Cases"]))
        var maxNew = Math.max(...range.map(i => i["New Recoveries"]))
        var maxRecovery = Math.max(...range.map(i => i["New Cases"]))

        var maxRightAxis = Math.max(maxNew, maxRecovery)

        var leftLimit = maxActive
        var rightLimit = maxRightAxis
        
        if (leftLimit < 100)
            leftLimit = Math.ceil(maxActive / 5) * 5
        else if (leftLimit < 1000)
            leftLimit = Math.ceil(maxActive / 50) * 50
        else if (leftLimit < 10000)
            leftLimit = Math.ceil(maxActive / 500) * 500
        else if (leftLimit < 100000)
            leftLimit = Math.ceil(maxActive / 5000) * 5000
        else if (leftLimit < 1000000)
            leftLimit = Math.ceil(maxActive / 50000) * 50000

        if (rightLimit < 100)
            rightLimit = Math.ceil(maxRightAxis / 5) * 5
        else if (rightLimit < 1000)
            rightLimit = Math.ceil(maxRightAxis / 50) * 50
        else if (rightLimit < 10000)
            rightLimit = Math.ceil(maxRightAxis / 500) * 500
        else if (rightLimit < 100000)
            rightLimit = Math.ceil(maxRightAxis / 5000) * 5000
        else if (rightLimit < 1000000)
            rightLimit = Math.ceil(maxRightAxis / 50000) * 50000

        // Set the new axis
        chart.chart.options.scales.yAxes[0].ticks.max = leftLimit
        chart.chart.options.scales.yAxes[1].ticks.max = rightLimit

        chart.chart.update()

        // console.log(maxDiff + " " + minDiff)


    }

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
                        tooltipFormat: "MMM DD YYYY",
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
                    //     max: this.state.value
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
                    //     max: this.state.value
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
                onPanComplete: this.setAxis.bind(this)
                // onPan: function(chart) {

                //     // chart.chart.update()

                // }
            },
            zoom: {
                enabled: true,                      
                mode: 'x',
                speed: 0.04 // 4%
            },
        }

        var chart = new Chart(myChartRef, {
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

        this.setState({
            data: this.props.data, 
            chart: myChartRef
        })

        // this.setAxis(chart)

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