import React from 'react';
import './App.css';
import Chart from 'chart.js'
import { Component } from 'react';
import Tabletop from 'tabletop';
import {isBrowser} from "react-device-detect";

import IconButton from '@material-ui/core/IconButton';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// import CanvasJSReact from './canvasjs.react';
//var CanvasJSReact = require('./canvasjs.react');
// var CanvasJS = CanvasJSReact.CanvasJS;
// var CanvasJSChart = CanvasJSReact.CanvasJSChart;


class App extends Component {

    chartRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dialogOpen: false
        }
    }

    componentDidMount(){
            
        // this.timer = setInterval(()=> this.getMovies(), 1000)
        this.ParseRecords()

    }

    // async getMovies(){

    //     console.log("fetch!")


    // }

    componentDidUpdate(props, state) {

        // console.log("update")

    }

    ParseRecords(){

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
                        maxTicksLimit: isBrowser ? 50 : 15
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
            //   console.log('google sheet data --->', googleData)
                

              new Chart(myChartRef, {
                type: "line",
                data: {
                    // labels: sortedCases.map((key, index) => { return sortedCases[index][0] }),
                    labels: googleData.map((key, index) => { return googleData[index]["Date"]}),
                    datasets: [
                        {
                            borderColor: "Red",
                            fill: false,
                            label: "Active Cases of COVID-19 in Ontario",
                            
                            // data: sortedCases.map((key, index) => { return sortedCases[index][1] })
                            data: googleData.map((key, index) => { return googleData[index]["Active Cases"]})
                        }
                    ]
                },
                options: options
                
            });


            this.setState({data: googleData})

            },
            simpleSheet: true
          })

    }

    handleClose() {

        this.setState({ dialogOpen: false })

    }

    handleOpen() {

        this.setState({ dialogOpen: true })

    }

    render() {

        return (

            <div 
                style={{background: "radial-gradient(circle, rgba(83,51,87,1) 0%, rgba(0,0,0,1) 100%)", 
                // height: isBrowser ? "101vh" : "135vh"
            }}>     

                <IconButton style={{color: "red"}} onClick={this.handleOpen.bind(this)} size="medium">
                    <HelpOutlineIcon />
                </IconButton>

                <canvas
                    id="myChart"
                    ref={this.chartRef}
                    style={{width: "100%", height: isBrowser ? "calc(100vh) - 50px" : "calc(94vh)"}}
                />

                {/* <div style={{color: "white", fontWeight: "bold", paddingLeft: 50}}>
                    Total Cases: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["Total Cases"] : ""}
                </div> */}

                
                <Dialog
                    open={this.state.dialogOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">{"Addition Ontario COVID-19 data"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Total Cases: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["Total Cases"] : ""}
                                <br />
                                Tests Completed: {this.state.data.length > 0 ? this.state.data[0]["Total Tests"] : ""}
                                <br />
                                Resolved Cases: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["Resolved Cases"] : ""}
                                <br />
                                Deaths: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["Deceased Cases"] : ""}
                            </DialogContentText>
                        </DialogContent>
                    <DialogActions>
                    <Button onClick={this.handleClose.bind(this)} color="primary">
                        Close
                    </Button>
                    </DialogActions>
                </Dialog>

                
                

            </div>
            
        )

    }

}

export default App;
