import React from 'react'
import './App.css'
import { Component } from 'react'
import GraphCases from './GraphCases'
import GraphHospitalization from './GraphHospitalizations'

import AppBadge from 'react-app-badge'
import isBrowser from 'react-device-detect'
import dateFormat, { masks } from 'dateformat'
import { Button, CircularProgress, Grid, IconButton, Tab, Tabs, Tooltip } from '@material-ui/core'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import { Feedback, Home, LocalHospital, Timeline, Today, Twitter, Vaccines } from '@mui/icons-material'
import { MobileDatePicker } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import TextField from '@mui/material/TextField'

// DEPLOY: firebase deploy --only hosting:<YOUR-TARGET-NAME>

const { GoogleSpreadsheet } = require('google-spreadsheet');
const OffWhite = '#e0e0e0'

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            vaccinationDialogOpen: false,
            hospitalDialogOpen: false,
            data: [],
            date: new Date(),
            dateIndex: 0,
            dateDialogOpen: false,
            activeCaseDifference: {},
            tab: 0,
            graphTab: 0
        }

        this.handleVaccinationDialog = this.handleVaccinationDialog.bind(this)
        this.handleHospitalDialog = this.handleHospitalDialog.bind(this)

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

        this.handleDateChange(new Date())

        this.setState({ 
            data: rows,
            activeCaseDifference: rows[rows.length - 1]["Active Case Difference"],
            dateIndex: rows.length - 1
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

    handleVaccinationDialog() {

        if (this.state.vaccinationDialogOpen === true)
            this.setState({ vaccinationDialogOpen: false })
        else if (this.state.vaccinationDialogOpen === false)
            this.setState({ vaccinationDialogOpen: true })

    }
    
    handleHospitalDialog() {

        if (this.state.hospitalDialogOpen === true)
            this.setState({ hospitalDialogOpen: false })
        else if (this.state.hospitalDialogOpen === false)
            this.setState({ hospitalDialogOpen: true })

    }

    handleDateChange(date) {

        // var dateString = date.toLocaleDateString('default', {month: 'long', day: 'numeric', year: 'numeric'}).replace(',', '')
        var dateString = dateFormat(date, "mmmm dd yyyy")
        var dataIndex = this.state.data.findIndex(i => i.Date === dateString)

        this.setState({ 
            date: dateString,
            dateIndex: dataIndex
        })

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
                    <Tab style={{color: OffWhite}} label={<Home />}/>
                    <Tab style={{color: OffWhite}} label={<Timeline />} />
                    {this.state.tab === 1 ? 
                        <div>
                            <Tabs
                                value={this.state.graphTab}
                                onChange={this.handleGraphTabChange}
                                indicatorColor="primary"
                                textColor="primary"
                                centered>
                                <Tab style={{color: OffWhite, fontSize: 10, fontWeight: "bold", minWidth: "110px", width: "110px"}} label="Cases" />
                                <Tab style={{color: OffWhite, fontSize: 10, fontWeight: "bold", minWidth: "110px", width: "110px"}} label="Hospitalizations" />
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

                            <h5 style={{textAlign: "center", color: OffWhite, fontWeight: "bold"}}>
                                <b>Covontario <br /></b>
                                Daily COVID-19 statistics for Ontario
                                
                            </h5>
                            
                            <h2 style={{textAlign: "center", color: OffWhite, textDecoration: "underline"}}>

                                {this.state.date}

                                <Tooltip title="Change Date">
                                    <IconButton style={{height: 24, width: 24, marginTop: -3, marginLeft: 10}} onClick={() => this.setState({ dateDialogOpen: true })}>
                                        <Today style={{color: "white", maxHeight: 24}} />
                                    </IconButton>
                                </Tooltip>

                                <div style={{ visibility: "hidden", position: "absolute", top: "-9999px" }}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <MobileDatePicker
                                            label="Date"
                                            value={this.state.date}
                                            open={this.state.dateDialogOpen}
                                            onChange={() => null}
                                            onAccept={this.handleDateChange.bind(this)}
                                            onClose={() => this.setState({ dateDialogOpen: false })}
                                            inputFormat="MMMM dd yyyy"
                                            renderInput={(params) => <TextField InputLabelProps={{ shrink: true }} {...params} /> }                                            
                                        />
                                    </LocalizationProvider >
                                </div>
                            </h2>
                            <div style={{color: OffWhite, fontWeight: "bold", textAlign: "center"}}>
                                <div style={{margin: "2px"}}>
                                    Cases: {this.state.data.length > 0 ? this.state.data[this.state.dateIndex]["New Cases"] : ""}
                                    <Tooltip title="Vaccination Breakdown">
                                        <IconButton style={{height: 12, width: 12, marginTop: -6, marginLeft: 10}} onClick={this.handleVaccinationDialog}>
                                            <Vaccines style={{color: "white", maxHeight: 20}} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Hospitalization Data">
                                            <IconButton style={{height: 12, width: 12, marginTop: -6, marginLeft: 10}} onClick={this.handleHospitalDialog}>
                                                <LocalHospital style={{color: "white", maxHeight: 20}} />
                                            </IconButton>
                                    </Tooltip>
                                </div>
                                <div style={{margin: "2px"}}>
                                    Recoveries: {this.state.data.length > 0 ? this.state.data[this.state.dateIndex]["New Recoveries"] : ""}
                                </div>
                                <div style={{margin: "2px"}}>
                                    Deaths: {this.state.data.length > 0 ? this.state.data[this.state.dateIndex]["New Deaths"] : ""}
                                </div>
                                <div style={{margin: "2px"}}>
                                    Tests: {this.state.data.length > 0 ? this.state.data[this.state.dateIndex]["New Tests"] ? this.state.data[this.state.dateIndex]["New Tests"] : "n/a" : "n/a"}
                                </div>
                                <div style={{margin: "2px"}}>
                                    Active Cases: {this.state.data.length > 0 ? 
                                    // this.state.data[this.state.dateIndex]["Active Cases"] 
                                    this.state.activeCaseDifference > 0 ? this.state.data[this.state.dateIndex]["Active Cases"] + " (+" + this.state.activeCaseDifference + ")" :
                                    this.state.data[this.state.dateIndex]["Active Cases"] + " (" + this.state.activeCaseDifference + ")" : 
                                    ""}
                                </div>
                            </div>

                            <h2 style={{textAlign: "center", color: OffWhite, textDecoration: "underline"}}>

                                Cumulative Data

                            </h2>
                            <div style={{color: OffWhite, fontWeight: "bold", textAlign: "center"}}>
                                <div style={{margin: "2px"}}>
                                    Cases: {this.state.data.length > 0 ? this.state.data[this.state.dateIndex]["Total Cases"] : ""}
                                </div>
                                <div style={{margin: "2px"}}>
                                    Recoveries: {this.state.data.length > 0 ? this.state.data[this.state.dateIndex]["Resolved Cases"] : ""}
                                </div>
                                <div style={{margin: "2px"}}>
                                    Deaths: {this.state.data.length > 0 ? this.state.data[this.state.dateIndex]["Deceased Cases"] : ""}
                                </div>
                                <div style={{margin: "2px"}}>
                                    Tests: {this.state.data.length > 0 ? this.state.data[0]["Total Tests"] : ""}
                                </div>
                            </div>

                            <h5 style={{textAlign: "center", color: OffWhite, fontWeight: "bold"}}>

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
                        <div style={{width: "100vh", textAlign: "center", fontSize: 10, position: "fixed", top: "99%", left: "50%", transform: "translate(-50%, -99%)", color: OffWhite}}>
                        
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
                            open={this.state.vaccinationDialogOpen}
                            onClose={this.handleVaccinationDialog}
                            aria-labelledby="max-width-dialog-title">
                            <DialogTitle style={{textAlign: "center", fontWeight: "bold"}}>Case Breakdown by Vaccination Status</DialogTitle>
                            <DialogContent>
                                <DialogContentText style={{fontWeight: "bold", textAlign: "center"}}>
                                    <div>Vaccinated: <span style={{fontWeight: "normal"}}>{this.state.data.length > 0 ? this.state.data[this.state.dateIndex]["Cases_Vax"] ? this.state.data[this.state.dateIndex]["Cases_Vax"] : "n/a" : "n/a"}</span></div>
                                    <div>Unvaccinated: <span style={{fontWeight: "normal"}}>{this.state.data.length > 0 ? this.state.data[this.state.dateIndex]["Cases_Unvax"] ? this.state.data[this.state.dateIndex]["Cases_Unvax"] : "n/a" : "n/a"}</span></div>
                                    <div>Partially Vaccinated: <span style={{fontWeight: "normal"}}>{this.state.data.length > 0 ? this.state.data[this.state.dateIndex]["Cases_Partial"] ? this.state.data[this.state.dateIndex]["Cases_Partial"] : "n/a" : "n/a"}</span></div>
                                    <div>Status Unknown: <span style={{fontWeight: "normal"}}>{this.state.data.length > 0 ? this.state.data[this.state.dateIndex]["Cases_Unknown"] ? this.state.data[this.state.dateIndex]["Cases_Unknown"] : "n/a" : "n/a"}</span></div>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={this.handleVaccinationDialog} color="primary">
                                Close
                            </Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog
                            fullWidth={true}
                            maxWidth="xs"
                            open={this.state.hospitalDialogOpen}
                            onClose={this.handleHospitalDialog}
                            aria-labelledby="max-width-dialog-title">
                            <DialogTitle style={{textAlign: "center", fontWeight: "bold"}}>Current Hospitalization Data</DialogTitle>
                            <DialogContent>
                                <DialogContentText style={{fontWeight: "bold", textAlign: "center"}}>
                                    <div>Hospitalizations: <span style={{fontWeight: "normal"}}>{this.state.data.length > 0 ? this.state.data[this.state.dateIndex]["Hospitalizations"] ? this.state.data[this.state.dateIndex]["Hospitalizations"] : "n/a" : "n/a"}</span></div>
                                    <div>ICU Occupancy: <span style={{fontWeight: "normal"}}>{this.state.data.length > 0 ? this.state.data[this.state.dateIndex]["ICU"] ? this.state.data[this.state.dateIndex]["ICU"] : "n/a" : "n/a"}</span></div>
                                    <div>ICU (Ventilated): <span style={{fontWeight: "normal"}}>{this.state.data.length > 0 ? this.state.data[this.state.dateIndex]["ICU_Ventilated"] ? this.state.data[this.state.dateIndex]["ICU_Ventilated"] : "n/a" : "n/a"}</span></div>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={this.handleHospitalDialog} color="primary">
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
