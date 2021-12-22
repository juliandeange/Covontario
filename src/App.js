import React from 'react'
import './App.css'
import { Component } from 'react'
import GraphCases from './GraphCases'
import GraphHospitalization from './GraphHospitalizations'

import AppBadge from 'react-app-badge'
import CircularProgress from '@material-ui/core/CircularProgress'
import isBrowser from 'react-device-detect'
import { Tabs, Tab, Grid, Tooltip } from '@material-ui/core'
import { Feedback, Home, More, Timeline, Twitter } from '@material-ui/icons'
import { Button, IconButton } from '@material-ui/core'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'

// DEPLOY: firebase deploy --only hosting:<YOUR-TARGET-NAME>

const { GoogleSpreadsheet } = require('google-spreadsheet');

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dialogOpen: false,
            data: [],
            activeCaseDifference: {},
            tab: 0,
            graphTab: 0
        }

        this.handleDialogToggle = this.handleDialogToggle.bind(this)

    }

    async componentDidMount(){

        const creds = require('./covontario_read_only.json');
        const doc = new GoogleSpreadsheet(creds.spreadsheet_url);

        await doc.useServiceAccountAuth({
            client_email: creds.client_email,
            private_key: creds.private_key,
        });
    
        await doc.loadInfo()
        const rows = await doc.sheetsByIndex[0].getRows()

        this.setState({ 
            data: rows,
            activeCaseDifference: rows[rows.length - 1]["Active Case Difference"]
        })
    }

    handleTabChange = (event, value) => {

        // 0 = Information / Dashboard
        // 1 = Graph
        if (value !== undefined)
            this.setState({ tab: value });

    }

    handleGraphTabChange = (event, value) => {

        this.setState({ graphTab: value })

    }

    handleDialogToggle() {

        if (this.state.dialogOpen === true)
            this.setState({ dialogOpen: false })
        else if (this.state.dialogOpen === false)
            this.setState({ dialogOpen: true })

    }

    render() {

        const googlePlayLink = "https://play.google.com/store/apps/details?id=ca.gc.hcsc.canada.stopcovid&hl=en_CA"
        const iosStoreLink= "https://apps.apple.com/ca/app/covid-alert/id1520284227"

        return (
            
            <div style={{height: !isBrowser ? "calc(100vh)" : "90vh"}}>     

                <Tabs
                    value={this.state.tab}
                    onChange={this.handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered>
                    <Tab style={{color: "#e0e0e0"}} label={<Home />}/>
                    <Tab style={{color: "#e0e0e0"}} label={<Timeline />} />
                    {this.state.tab === 1 ? 
                        <div>
                            <Tabs
                                value={this.state.graphTab}
                                onChange={this.handleGraphTabChange}
                                indicatorColor="primary"
                                textColor="primary"
                                centered>
                                <Tab style={{color: "#e0e0e0", fontSize: 10, fontWeight: "bold", minWidth: "110px", width: "110px"}} label="Cases" />
                                <Tab style={{color: "#e0e0e0", fontSize: 10, fontWeight: "bold", minWidth: "110px", width: "110px"}} label="Hospitalizations" />
                            </Tabs>
                        </div>
                    : 
                        null
                    }
                    
                </Tabs>

                {this.state.tab === 0 ? this.state.data.length > 0 ? 
                    <div>

                        <div style={{position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100vh"}}>

                            {/* NEW
                            Cases
                            Recoveries
                            Deaths
                            Tests
                            Active Cases

                            TOTAL
                            Cases
                            Recoveries
                            Deaths
                            Tests */}

                            <h5 style={{textAlign: "center", color: "#e0e0e0", fontWeight: "bold"}}>

                                Daily COVID-19 statistics for Ontario
                                
                            </h5>
                            
                            <h2 style={{textAlign: "center", color: "#e0e0e0", fontWeight: "bold", textDecoration: "underline"}}>

                                {this.state.data[this.state.data.length - 1]["Date"]}

                            </h2>
                            <div style={{color: "#e0e0e0", fontWeight: "bold", textAlign: "center"}}>
                                <div style={{margin: "2px"}}>
                                    Cases: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["New Cases"] : ""}
                                    <IconButton style={{height: 12, width: 12, marginTop: -6, marginLeft: 10}} onClick={this.handleDialogToggle}>
                                        <More style={{color: "white", maxHeight: 20}}/>
                                    </IconButton>
                                </div>
                                <div style={{margin: "2px"}}>
                                    Recoveries: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["New Recoveries"] : ""}
                                </div>
                                <div style={{margin: "2px"}}>
                                    Deaths: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["New Deaths"] : ""}
                                </div>
                                <div style={{margin: "2px"}}>
                                    Tests: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["New Tests"] ? this.state.data[this.state.data.length - 1]["New Tests"] : "n/a" : "n/a"}
                                </div>
                                <div style={{margin: "2px"}}>
                                    Active Cases: {this.state.data.length > 0 ? 
                                    // this.state.data[this.state.data.length - 1]["Active Cases"] 
                                    this.state.activeCaseDifference > 0 ? this.state.data[this.state.data.length - 1]["Active Cases"] + " (+" + this.state.activeCaseDifference + ")" :
                                    this.state.data[this.state.data.length - 1]["Active Cases"] + " (" + this.state.activeCaseDifference + ")" : 
                                    ""}
                                </div>
                            </div>

                            <h2 style={{textAlign: "center", color: "#e0e0e0", textDecoration: "underline"}}>

                                Cumulative Data

                            </h2>
                            <div style={{color: "#e0e0e0", fontWeight: "bold", textAlign: "center"}}>
                                <div style={{margin: "2px"}}>
                                    Cases: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["Total Cases"] : ""}
                                </div>
                                <div style={{margin: "2px"}}>
                                    Recoveries: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["Resolved Cases"] : ""}
                                </div>
                                <div style={{margin: "2px"}}>
                                    Deaths: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["Deceased Cases"] : ""}
                                </div>
                                <div style={{margin: "2px"}}>
                                    Tests: {this.state.data.length > 0 ? this.state.data[0]["Total Tests"] : ""}
                                </div>
                            </div>

                            <h5 style={{textAlign: "center", color: "#e0e0e0", fontWeight: "bold"}}>

                                Download the COVID-19 Alert App

                            </h5>
                            <div style={{textAlign: "center"}}>
                                <Grid container spacing={1} justify="center">
                                    <Grid item>
                                        <AppBadge version="google" height="40" url={googlePlayLink} />
                                    </Grid>
                                    <Grid item>
                                        <AppBadge version="ios" height="40" url={iosStoreLink} />
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                        <div style={{width: "100vh", textAlign: "center", fontSize: 10, position: "fixed", top: "99%", left: "50%", transform: "translate(-50%, -99%)", color: "#e0e0e0"}}>
                        
                            Source: https://covid-19.ontario.ca/

                            <Tooltip title="Feedback">
                                <IconButton onClick={() => {window.open('mailto:covontario@gmail.com?subject=Covontario - Feedback')} }>
                                    <Feedback style={{fill: "white", height: 20}} />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Twitter">
                                <IconButton onClick={() => {window.open('https://twitter.com/covontario')} }>
                                    <Twitter style={{fill: "#00acee", height: 20}} />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <Dialog
                            fullWidth={true}
                            maxWidth="xs"
                            open={this.state.dialogOpen}
                            onClose={this.handleDialogToggle}
                            aria-labelledby="max-width-dialog-title">
                            <DialogTitle style={{textAlign: "center", fontWeight: "bold"}}>Case Breakdown by Vaccination Status</DialogTitle>
                            <DialogContent>
                                <DialogContentText style={{fontWeight: "bold", textAlign: "center"}}>
                                    <div>Vaccinated: <span style={{fontWeight: "normal"}}>{this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["Cases_Vax"] ? this.state.data[this.state.data.length - 1]["Cases_Vax"] : "n/a" : "n/a"}</span></div>
                                    <div>Unvaccinated: <span style={{fontWeight: "normal"}}>{this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["Cases_Unvax"] ? this.state.data[this.state.data.length - 1]["Cases_Unvax"] : "n/a" : "n/a"}</span></div>
                                    <div>Partially Vaccinated: <span style={{fontWeight: "normal"}}>{this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["Cases_Partial"] ? this.state.data[this.state.data.length - 1]["Cases_Partial"] : "n/a" : "n/a"}</span></div>
                                    <div>Status Unknown: <span style={{fontWeight: "normal"}}>{this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["Cases_Unknown"] ? this.state.data[this.state.data.length - 1]["Cases_Unknown"] : "n/a" : "n/a"}</span></div>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={this.handleDialogToggle} color="primary">
                                Close
                            </Button>
                            </DialogActions>
                        </Dialog>
                    </div>

                : null : this.state.tab === 1 && this.state.graphTab === 0 ?

                    // Cases tab
                    <div> 
                        <GraphCases data={this.state.data}/> 
                    </div>

                : this.state.tab === 1 && this.state.graphTab === 1 ?

                    // Hospitalizations tab
                    <div>
                        <GraphHospitalization data={this.state.data} />
                    </div>
                : 
                    <div style={{position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
                        <CircularProgress color="secondary"/> 
                    </div> 
                }
            </div>
        )
    }
}

export default App;
