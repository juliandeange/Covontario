import React from 'react'
import './App.css'
import Chart from 'chart.js'
import { Component } from 'react'
import { isBrowser } from "react-device-detect"
import CircularProgress from '@material-ui/core/CircularProgress'
import { LocalHospital } from '@mui/icons-material'
import Snackbar from '@mui/material/Snackbar'

// eslint-disable-next-line
import Zoom from 'chartjs-plugin-zoom'

class GraphHospitalizations extends Component { 

    constructor(props) {
        super(props)
        this.state = {

            snackOpen: false

        }

    }

    chartRef = React.createRef();

    filterUndefined(i) {

        return i !== undefined

    }
    
    setAxis(chart) {

        // Get date range shown
        var startEpoch = chart.chart.scales["X"]._ticks[0].value
        var endEpoch = chart.chart.scales["X"]._ticks[chart.chart.scales["X"]._ticks.length - 1].value

        var startDate = new Date(startEpoch)
        var endDate = new Date(endEpoch)

        var startDateString = startDate.toLocaleString('default', { month: 'long' }) + ' ' + (startDate.getDate() < 10 ? '0' + startDate.getDate() : startDate.getDate()) + ' ' + startDate.getFullYear()
        var endDateString = endDate.toLocaleString('default', { month: 'long' }) + ' ' + (endDate.getDate() < 10 ? '0' + endDate.getDate() : endDate.getDate()) + ' ' + endDate.getFullYear()

        var startIndex = this.props.data.findIndex(i => i.Date === startDateString)
        var endIndex = this.props.data.findIndex(i => i.Date === endDateString)

        // Get range of dates shown
        var range = this.props.data.slice(startIndex === -1 ? 0 : startIndex, endIndex === -1 ? this.props.data.length : endIndex + 1)

        // Get max values for each axis
        var maxHos = Math.max(...range.map(i => i["Hospitalizations"]).filter(this.filterUndefined))
        var maxICU = Math.max(...range.map(i => i["ICU"]).filter(this.filterUndefined))
        var maxICUVent = Math.max(...range.map(i => i["ICU_Ventilated"]).filter(this.filterUndefined))

        var maxAxis = Math.max(maxHos, maxICU, maxICUVent)

        var limit = maxAxis
        
        // Round the axis values
        if (limit < 100)
            limit = Math.ceil(maxAxis / 5) * 5
        else if (limit < 1000)
            limit = Math.ceil(maxAxis / 50) * 50
        else if (limit < 10000)
            limit = Math.ceil(maxAxis / 500) * 500
        else if (limit < 100000)
            limit = Math.ceil(maxAxis / 5000) * 5000
        else if (limit < 1000000)
            limit = Math.ceil(maxAxis / 50000) * 50000

        // Set the new axis
        chart.chart.options.scales.yAxes[0].ticks.max = limit
        chart.chart.update()

    }

    async componentDidMount() {

        const myChartRef = this.chartRef.current.getContext("2d");

        var currentDate = new Date();
        var daysBack = new Date(currentDate);

        if (isBrowser)
            daysBack.setDate(daysBack.getDate() - 90);
        else if (!isBrowser)
            daysBack.setDate(daysBack.getDate() - 60);

        const options = {
            maintainAspectRatio: false,
            responsive: false,
            legend: {
                position: "bottom",
                labels: {
                    usePointStyle: true,
                    fontColor: "white",
                    fontSize: 14,
                    fontStyle: "bold"
                }
            },
            scales:{
                xAxes:[{
                    id: "X",
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
                    id: "Hospitalizations",
                    type: "linear",
                    gridLines:{
                        // display: false
                    },
                    scaleLabel: {
                        display: true,
                        fontColor: "white",
                        fontSize: 14,
                        fontStyle: "bold",
                        labelString: "Hospitalizations / ICU"
                    },
                }
            ]},
            tooltips:{
                mode: "label",
                callbacks:{
                    label: function(tooltipItem, data){
                        return data.datasets[tooltipItem.datasetIndex].label + ": " + tooltipItem.yLabel;
                    }
                }
            },
            pan: {
                enabled: true,
                mode: 'x',
                onPanComplete: this.setAxis.bind(this)
            },
            zoom: {
                enabled: true,                      
                mode: 'x',
                speed: 0.04, // 4%
                onZoomComplete: this.setAxis.bind(this)
            },
        }

        var chart = new Chart(myChartRef, {
            type: "line",
                data: {
                    labels: this.props.data.map((key, index) => { return this.props.data[index]["Date"]}),
                    datasets: [
                        {
                            borderColor: "#ffff99",
                            fill: false,
                            label: "Hospitalizations",
                            yAxisId: "Hospitalizations",
                            data: this.props.data.map((key, index) => { return this.props.data[index]["Hospitalizations"]}),
                            pointRadius: 5
                        },
                        {
                            borderColor: "Orange",
                            fill: false,
                            label: "ICU",
                            yAxisID: "Hospitalizations",
                            data: this.props.data.map((key, index) => { return this.props.data[index]["ICU"]}),
                            pointRadius: 5
                        },
                        {
                            borderColor: "Red",
                            fill: false,
                            label: "ICU + Ventilated",
                            yAxisID: "Hospitalizations",
                            data: this.props.data.map((key, index) => {return this.props.data[index]["ICU_Ventilated"]}),
                            pointRadius: 5
                        }

                    ]
                },
            options: options
        
        });

        this.setAxis(chart)
        this.setState({ snackOpen: true })

    }

    handleSnackClose() {

        this.setState({ snackOpen: false })

    }

    render() {

        return(
            <div>
                {this.props.data.length <= 0 ? 
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
                <Snackbar
                    open={this.state.snackOpen}
                    autoHideDuration={3000}
                    onClose={this.handleSnackClose.bind(this)}
                    message={<span style={{fontWeight: 'bolder'}}><LocalHospital style={{marginBottom: -6, marginRight: 10}} />Hospitalizations</span>}
                />         
            </div>
        )
    }
}

export default GraphHospitalizations