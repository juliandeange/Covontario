import React from 'react';
import './App.css';
import Chart from 'chart.js'
import { Component } from 'react';
import Tabletop from 'tabletop';
import {isBrowser} from "react-device-detect";

// eslint-disable-next-line
import Zoom from 'chartjs-plugin-zoom'
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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

    componentDidUpdate(props, state) {

    }

    ParseRecords(){

        const myChartRef = this.chartRef.current.getContext("2d");
    
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
                            label: "Active Cases",
                            yAxisId: "ActiveCases",
                            // data: sortedCases.map((key, index) => { return sortedCases[index][1] })
                            data: googleData.map((key, index) => { return googleData[index]["Active Cases"]}),
                            pointRadius: 5
                        },
                        {
                            borderColor: "Blue",
                            fill: false,
                            label: "New Cases",
                            yAxisID: "OtherCases",
                            // data: sortedCases.map((key, index) => { return sortedCases[index][1] })
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

            <div style={{background: "radial-gradient(circle, rgba(83,51,87,1) 0%, rgba(0,0,0,1) 100%)" }}>     

                <Grid container spacing={2} style={{height: "10vh"}}>
                    <Grid item xs={1}>
                        <IconButton style={{color: "red"}} onClick={this.handleOpen.bind(this)} size="medium">
                            <HelpOutlineIcon />
                        </IconButton>
                    </Grid>

                    <Grid item xs={11} style={{color: "white", fontSize: 14, fontWeight: "bold", paddingTop: 10, paddingLeft: !isBrowser ? 20 : "", paddingBottom: !isBrowser ? 10 : ""}}>
                        Active Cases Today: <span style={{color: "red"}}> {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["Active Cases"] : ""} </span>
                        <br />
                        New Cases Today: <span style={{color: "blue"}}> {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["New Cases"] : ""} </span>
                        <br />
                        Recovered Cases Today: <span style={{color: "green"}}> {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["New Recoveries"] : ""} </span>
                    </Grid>
                </Grid>

                <Grid item xs={12} style={{height: !isBrowser ? "calc(90vh - 10vh)" : "90vh"}}>

                    <canvas
                        id="myChart"
                        ref={this.chartRef}
                        style={{height: !isBrowser ? "95%" : "100%", width: "100%"}}/>
                        
                </Grid>

                <Dialog
                    open={this.state.dialogOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    // fullWidth={true}
                    // maxWidth={"sm"}
                    >
                    <DialogTitle id="alert-dialog-title">{"Addition Ontario COVID-19 data"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">

                                New Tests: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["New Tests"] : ""}
                                <br />
                                Total Tests: {this.state.data.length > 0 ? this.state.data[0]["Total Tests"] : ""}
                                <br />
                                Total Cases: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["Total Cases"] : ""}
                                <br />
                                Resolved Cases: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["Resolved Cases"] : ""}
                                <br />
                                Deaths: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["Deceased Cases"] : ""}
                            </DialogContentText>
                        </DialogContent>
                    <DialogActions>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description" style={{fontSize: 10, marginLeft: -10}}>
                                Source: https://covid-19.ontario.ca/
                            </DialogContentText>
                        </DialogContent>
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
