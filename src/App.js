import React from 'react'
import './App.css'
import Chart from 'chart.js'
import { Component } from 'react'
import Tabletop from 'tabletop'
import {isBrowser} from "react-device-detect"
import AppBadge from 'react-app-badge'

// eslint-disable-next-line
import Zoom from 'chartjs-plugin-zoom'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Tabs, Tab } from '@material-ui/core'
import ChartTab from './ChartTab'


class App extends Component {

    chartRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dialogOpen: false,
            activeCasesChange: "",
            newCasesChange: "",
            resolvedCasesChange: "",
            value: 0,
            refCurrent: {}
        }
    }

    componentDidMount(){

        this.ParseRecords()

    }

    componentDidUpdate(props, state) {

    }

    ParseRecords() {

        // const myChartRef = this.chartRef.current.getContext("2d");

        // var currentDate = new Date();
        // var daysBack = new Date(currentDate);
        // daysBack.setDate(daysBack.getDate() - 90);

        // const options = {
        //     maintainAspectRatio: false,
        //     responsive: false,
        //     legend: {
        //         position: "bottom",
        //         labels: {
        //             fontColor: "white",
        //             fontSize: 14,
        //             fontStyle: "bold"
        //         }
        //     },
        //     scales:{
        //         xAxes:[{
        //             id: "A",
        //             scaleLabel: {
        //                 display: true,
        //                 fontColor: "white",
        //                 fontSize: 14,
        //                 fontStyle: "bold",
        //                 labelString: "Day"
        //             },
        //             type: "time",
        //             time:{
        //                 tooltipFormat: "MMM DD YYYY"
        //             },
        //             gridLines: {
        //                 display: false
        //             },
        //             ticks: {
        //                 min: daysBack.toDateString(),
        //                 autoSkip: true,
        //                 maxTicksLimit: isBrowser ? 50 : 15
        //             }
        //         }],
        //         yAxes:[{
        //             id: "ActiveCases",
        //             type: "linear",
        //             gridLines:{
        //                 // display: false
        //             },
        //             scaleLabel: {
        //                 display: true,
        //                 fontColor: "white",
        //                 fontSize: 14,
        //                 fontStyle: "bold",
        //                 labelString: "Active Cases"
        //             },
        //         },
        //         {
        //             id: "OtherCases",
        //             type: "linear",
        //             position: "right",
        //             gridLines:{
        //                 display: false
        //             },
        //             scaleLabel: {
        //                 display: true,
        //                 fontColor: "white",
        //                 fontSize: 14,
        //                 fontStyle: "bold",
        //                 labelString: "New Cases / Recoveries"
        //             },
        //         }
        //     ]
        //     },
        //     tooltips:{
        //         callbacks:{
        //             label: function(tooltipItem, data){
        //                 return tooltipItem.yLabel;
        //             }
        //         }
        //     },
        //     pan: {
        //         enabled: true,
        //         mode: 'x',
        //     },
        //     zoom: {
        //         enabled: true,                      
        //         mode: 'x',
        //         speed: 0.04 // as a percent
        //     }
        // }

        Tabletop.init({
            key: '1hHv7MeOpp9G2obU_7iqxh8U0RRvcRSZVTp8VEfn1h8o',
            callback: googleData => {
            //   new Chart(myChartRef, {
            //     type: "line",
            //     data: {
            //         labels: googleData.map((key, index) => { return googleData[index]["Date"]}),
            //         datasets: [
            //             {
            //                 borderColor: "Red",
            //                 fill: false,
            //                 label: "Active Cases",
            //                 yAxisId: "ActiveCases",
            //                 data: googleData.map((key, index) => { return googleData[index]["Active Cases"]}),
            //                 pointRadius: 5
            //             },
            //             {
            //                 borderColor: "Blue",
            //                 fill: false,
            //                 label: "New Cases",
            //                 yAxisID: "OtherCases",
            //                 data: googleData.map((key, index) => { return googleData[index]["New Cases"]}),
            //                 pointRadius: 5
            //             },
            //             {
            //                 borderColor: "Green",
            //                 fill: false,
            //                 label: "New Recoveries",
            //                 yAxisID: "OtherCases",
            //                 data: googleData.map((key, index) => {return googleData[index]["New Recoveries"]}),
            //                 hidden: true,
            //                 pointRadius: 5
            //             }

            //         ]
            //     },
            //     options: options
                
            // });


            this.setState({data: googleData, refCurrent: this.chartRef.current })

            var active = (googleData[this.state.data.length - 1]["Active Cases"] - googleData[this.state.data.length - 2]["Active Cases"])
            var newCases = (googleData[this.state.data.length - 1]["New Cases"] - googleData[this.state.data.length - 2]["New Cases"])
            var resolved = (googleData[this.state.data.length - 1]["New Recoveries"] - googleData[this.state.data.length - 2]["New Recoveries"])

            if (active > 0)
                active = "+" + active

            if (newCases > 0)
                newCases = "+" + newCases

            if (resolved > 0)
                resolved = "+" + resolved
            
            this.setState({
                activeCasesChange: active,
                newCasesChange: newCases,
                resolvedCasesChange: resolved
            })

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

    handleTabChange = (event, value) => {

        this.setState({ value });

      }

    render() {

        // const [value, setValue] = React.useState(0);

        // const handleChange = (event, newValue) => {
        //   setValue(newValue);
        // };

        const googlePlayLink = "https://play.google.com/store/apps/details?id=ca.gc.hcsc.canada.stopcovid&hl=en_CA"
        const iosStoreLink= "https://apps.apple.com/ca/app/covid-alert/id1520284227"

        return (
            
            <div style={{height: "100vh"}}/*style={{background: "radial-gradient(circle, rgba(83,51,87,1) 0%, rgba(0,0,0,1) 100%)" }}*/ >     

                <Tabs
                    value={this.state.value}
                    onChange={this.handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered>
                    <Tab style={{color: "white", fontSize: 14, fontWeight: "bold"}} label="Information" />
                    <Tab style={{color: "white", fontSize: 14, fontWeight: "bold"}} label="Graph" />
                </Tabs>

                {this.state.value == 0 ? 

                <Grid container spacing={2} style={{height: "10vh"}}>
                    <Grid item xs={1}>
                        <IconButton style={{color: "red"}} onClick={this.handleOpen.bind(this)} size="medium">
                            <HelpOutlineIcon />
                        </IconButton>
                    </Grid>

                    <Grid item xs={11} style={{color: "white", fontSize: 14, fontWeight: "bold", paddingTop: 10, paddingLeft: !isBrowser ? 20 : "", paddingBottom: !isBrowser ? 10 : ""}}>
                        Active Cases: <span> 
                            {this.state.data.length > 0 ? 
                                <span style={{color: "red"}}> 
                                    { this.state.data[this.state.data.length - 1]["Active Cases"] } 
                                    <span> {" "}
                                        (
                                            {this.state.activeCasesChange}
                                        )
                                    </span> 
                                </span>
                            : ""}  
                        </span> 
                        

                        <br />

                        New Cases: <span style={{color: "blue"}}> 
                        {this.state.data.length > 0 ? 
                                <span style={{color: "blue"}}> 
                                    { this.state.data[this.state.data.length - 1]["New Cases"] } 
                                    <span> {" "}
                                        (
                                            {this.state.newCasesChange}
                                        )
                                    </span> 
                                </span>
                            : ""}  
                        </span>
                        
                        <br />

                        New Recoveries: <span style={{color: "green"}}> 
                        {this.state.data.length > 0 ? 
                                <span style={{color: "green"}}> 
                                    { this.state.data[this.state.data.length - 1]["New Recoveries"] } 
                                    <span> {" "}
                                        (
                                            {this.state.resolvedCasesChange}
                                        )
                                    </span> 
                                </span>
                            : ""}  
                        </span>
                    </Grid>
                </Grid>

                : <div> <ChartTab /> </div> }
                
                {/* <Grid item xs={12} style={{height: !isBrowser ? "calc(90vh - 10vh)" : "90vh"}}> */}

                    {/* <canvas
                        id="myChart"
                        ref={this.chartRef}
                        style={{height: !isBrowser ? "95%" : "100%", width: "100%"}}/>
                         */}

                         

                {/* </Grid> */}

                       
    

                <Dialog
                    open={this.state.dialogOpen}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    // fullWidth={true}
                    // maxWidth={"sm"}
                    >
                    <DialogTitle id="alert-dialog-title">{"Addition Ontario COVID-19 data"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description" style={{marginBottom: "-30px"}}>
                                New Tests: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["New Tests"] : ""}
                                <br />
                                Total Tests: {this.state.data.length > 0 ? this.state.data[0]["Total Tests"] : ""}
                                <br />
                                Total Cases: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["Total Cases"] : ""}
                                <br />
                                Resolved Cases: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["Resolved Cases"] : ""}
                                <br />
                                New Deaths: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["New Deaths"] : ""}
                                <br />
                                Total Deaths: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["Deceased Cases"] : ""}
                                <br />
                                <br />
                                <div style={{paddingBottom: "5px"}}>
                                    <b>Get the COVID-19 Alert App</b>
                                </div>
                                <AppBadge version="google" url={googlePlayLink} />
                                <AppBadge version="ios" url={iosStoreLink} />

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
