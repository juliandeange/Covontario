import React, { useState, useEffect } from 'react'
import './App.css'
import GraphCases from './GraphCases'
import GraphHospitalization from './GraphHospitalizations'

import AppBadge from 'react-app-badge'
import isBrowser from 'react-device-detect'
import dateFormat from 'dateformat'
import { Button, CircularProgress, Grid, IconButton, Tab, Tabs, Tooltip } from '@material-ui/core'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import { Coronavirus, Feedback, Home, LocalHospital, Timeline, Today, Twitter, Vaccines } from '@mui/icons-material'
import { MobileDatePicker } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import TextField from '@mui/material/TextField'

// DEPLOY: firebase deploy --only hosting:<YOUR-TARGET-NAME>

const { GoogleSpreadsheet } = require('google-spreadsheet')
const OffWhite = '#e0e0e0'

function App() {

    const [vaccinationDialogOpen, setVaccinationDialogOpen] = useState(false)
    const [hospitalDialogOpen, setHospitalDialogOpen] = useState(false)
    const [data, setData] = useState([])
    const [date, setDate] = useState(Date)
    const [dateIndex, setDateIndex] = useState(0)
    const [dateDialogOpen, setDateDialogOpen] = useState(false)
    const [activeCaseDifference, setActiveCaseDifference] = useState({})
    const [tab, setTab] = useState(0)
    const [graphTab, setGraphTab] = useState(0)
    const [hospDiff, setHospDiff] = useState('')
    const [icuDiff, setIcuDiff] = useState('')
    const [ventDiff, setVentDiff] = useState('')

    useEffect(() => {

        const setup = async () => {
            
            const creds = require('./covontario_read_only.json');
            const doc = new GoogleSpreadsheet(creds.spreadsheet_url);
    
            await doc.useServiceAccountAuth({
                client_email: creds.client_email,
                private_key: creds.private_key,
            });
        
            await doc.loadInfo()
            const rows = await doc.sheetsByIndex[0].getRows()
    
            var dateString = dateFormat(new Date(), "mmmm dd yyyy")
    
            var hosp = rows[rows.length - 1]['Hospitalizations'] - rows[rows.length - 2]['Hospitalizations']
            var icu = rows[rows.length - 1]['ICU'] - rows[rows.length - 2]['ICU']
            var vent = rows[rows.length - 1]['ICU_Ventilated'] - rows[rows.length - 2]['ICU_Ventilated']
    
            if (hosp >= 0)
                hosp = '+' + hosp
            if (icu >= 0)
                icu = '+' + icu
            if (vent >= 0)
                vent = '+' + vent
    
            if (dateString !== rows[rows.length - 1]['Date'])
                dateString = rows[rows.length - 1]['Date']

            setDate(dateString)
            setData(rows)
            setActiveCaseDifference(rows[rows.length - 1]["Active Case Difference"])
            setDateIndex(rows.length - 1)
            setHospDiff(hosp)
            setIcuDiff(icu)
            setVentDiff(vent)

        }

        setup()

    }, []);

    const handleTabChange = (event, value) => {

        // 0 = Information / Dashboard
        // 1 = Graph
        if (value !== undefined)
            setTab(value)

    }

    const handleGraphTabChange = (event, value) => {

        setGraphTab(value)

    }

    const handleVaccinationDialog = () => {

        if (vaccinationDialogOpen === true)
            setVaccinationDialogOpen(false)
        else if (vaccinationDialogOpen === false)
            setVaccinationDialogOpen(true)

    }
    
    const handleHospitalDialog = () => {

        if (hospitalDialogOpen === true)
            setHospitalDialogOpen(false)
        else if (hospitalDialogOpen === false)
            setHospitalDialogOpen(true)

    }
    
    const handleDateChange = (date) => {

        var dateString = dateFormat(date, "mmmm dd yyyy")
        var dataIndex = data.findIndex(i => i.Date === dateString)

        if (data.length > 0) {

            var hosp = 0
            var icu = 0
            var vent = 0

            if (dataIndex >= 0 && dataIndex <= data.length - 1) {

                hosp = data[dataIndex]['Hospitalizations'] - data[dataIndex - 1]['Hospitalizations']
                icu = data[dataIndex]['ICU'] - data[dataIndex - 1]['ICU']
                vent = data[dataIndex]['ICU_Ventilated'] - data[dataIndex - 1]['ICU_Ventilated']

                if (hosp >= 0)
                    hosp = '+' + hosp
                if (icu >= 0)
                    icu = '+' + icu
                if (vent >= 0)
                    vent = '+' + vent

            }
        }

        setDate(dateString)
        setDateIndex(dataIndex)
        setHospDiff(hosp)
        setIcuDiff(icu)
        setVentDiff(vent)

    }

    const googlePlayLink = "https://play.google.com/store/apps/details?id=ca.gc.hcsc.canada.stopcovid&hl=en_CA"
    const iosStoreLink= "https://apps.apple.com/ca/app/covid-alert/id1520284227"

    return (
        
        <div style={{height: !isBrowser ? "calc(100vh)" : "90vh"}}>     

            <Tabs
                value={tab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                centered>
                <Tab style={{color: OffWhite}} label={<Home />}/>
                <Tab style={{color: OffWhite}} label={<Timeline />} />
                {tab === 1 ? 
                    <div>
                        <Tabs
                            value={graphTab}
                            onChange={handleGraphTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            centered>
                            <Tab style={{color: OffWhite, fontSize: 10, fontWeight: "bold" /*, minWidth: "110px" , width: "110px"*/ }} label={<Coronavirus />} />
                            <Tab style={{color: OffWhite, fontSize: 10, fontWeight: "bold" /*, minWidth: "110px" , width: "110px"*/ }} label={<LocalHospital />} />
                        </Tabs>
                    </div>
                : 
                    null
                }
                
            </Tabs>

            {tab === 0 ? data.length > 0 ? 
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
                            COVID-19 statistics for Ontario
                            
                        </h5>
                        
                        <h2 style={{textAlign: "center", color: OffWhite, textDecoration: "underline"}}>

                            {date}

                            <Tooltip title="Change Date">
                                <IconButton style={{height: 24, width: 24, marginTop: -3, marginLeft: 10}} onClick={() => setDateDialogOpen(true)}>
                                    <Today style={{color: "white", maxHeight: 24}} />
                                </IconButton>
                            </Tooltip>

                            <div style={{ visibility: "hidden", position: "absolute", top: "-9999px" }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileDatePicker
                                        label="Date"
                                        value={date}
                                        open={dateDialogOpen}
                                        onChange={() => null}
                                        onAccept={handleDateChange}
                                        onClose={() => setDateDialogOpen(false)}
                                        inputFormat="MMMM dd yyyy"
                                        renderInput={(params) => <TextField InputLabelProps={{ shrink: true }} {...params} /> }                                            
                                    />
                                </LocalizationProvider >
                            </div>
                        </h2>
                        <div style={{color: OffWhite, fontWeight: "bold", textAlign: "center"}}>
                            <div style={{margin: "2px"}}>
                                Cases: {dateIndex !== -1 ? data[dateIndex]["New Cases"] : "n/a"}
                                <Tooltip title="Vaccination Breakdown">
                                    <IconButton style={{height: 12, width: 12, marginTop: -6, marginLeft: 10}} onClick={handleVaccinationDialog}>
                                        <Vaccines style={{color: "white", maxHeight: 20}} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Hospitalization Data">
                                        <IconButton style={{height: 12, width: 12, marginTop: -6, marginLeft: 10}} onClick={handleHospitalDialog}>
                                            <LocalHospital style={{color: "white", maxHeight: 20}} />
                                        </IconButton>
                                </Tooltip>
                            </div>
                            <div style={{margin: "2px"}}>
                                Recoveries: {dateIndex !== -1 ? data[dateIndex]["New Recoveries"] : "n/a"}
                            </div>
                            <div style={{margin: "2px"}}>
                                Deaths: {dateIndex !== -1 ? data[dateIndex]["New Deaths"] : "n/a"}
                            </div>
                            <div style={{margin: "2px"}}>
                                Tests: {dateIndex !== -1 ? data[dateIndex]["New Tests"] ? data[dateIndex]["New Tests"] : "n/a" : "n/a"}
                            </div>
                            <div style={{margin: "2px"}}>
                                Active Cases: {dateIndex !== -1 ? 
                                activeCaseDifference > 0 ? data[dateIndex]["Active Cases"] + " (+" + activeCaseDifference + ")" :
                                data[dateIndex]["Active Cases"] + " (" + activeCaseDifference + ")" : 
                                "n/a"}
                            </div>
                        </div>

                        <h2 style={{textAlign: "center", color: OffWhite, textDecoration: "underline"}}>

                            Cumulative Data

                        </h2>
                        <div style={{color: OffWhite, fontWeight: "bold", textAlign: "center"}}>
                            <div style={{margin: "2px"}}>
                                Cases: {dateIndex !== -1 ? data[dateIndex]["Total Cases"] : "n/a"}
                            </div>
                            <div style={{margin: "2px"}}>
                                Recoveries: {dateIndex !== -1 ? data[dateIndex]["Resolved Cases"] : "n/a"}
                            </div>
                            <div style={{margin: "2px"}}>
                                Deaths: {dateIndex !== -1 ? data[dateIndex]["Deceased Cases"] : "n/a"}
                            </div>
                            <div style={{margin: "2px"}}>
                                Tests: {dateIndex !== -1 ? data[0]["Total Tests"] : "n/a"}
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
                        open={vaccinationDialogOpen}
                        onClose={handleVaccinationDialog}
                        aria-labelledby="max-width-dialog-title">
                        <DialogTitle style={{textAlign: "center", fontWeight: "bold"}}>Case Breakdown by Vaccination Status</DialogTitle>
                        <DialogContent>
                            <DialogContentText style={{fontWeight: "bold", textAlign: "center"}}>
                                <div>Not Fully Vaccinated: <span style={{fontWeight: "normal"}}>{dateIndex !== -1 ? data[dateIndex]["Cases_NotFullyVaccinated"] ? data[dateIndex]["Cases_NotFullyVaccinated"] : "n/a" : "n/a"}</span></div>
                                <div>Fully Vaccinated: <span style={{fontWeight: "normal"}}>{dateIndex !== -1 ? data[dateIndex]["Cases_Vax"] ? data[dateIndex]["Cases_Vax"] : "n/a" : "n/a"}</span></div>
                                <div>Received a Booster: <span style={{fontWeight: "normal"}}>{dateIndex !== -1 ? data[dateIndex]["Cases_Boosted"] ? data[dateIndex]["Cases_Boosted"] : "n/a" : "n/a"}</span></div>
                                <div>Status Unknown: <span style={{fontWeight: "normal"}}>{dateIndex !== -1 ? data[dateIndex]["Cases_Unknown"] ? data[dateIndex]["Cases_Unknown"] : "n/a" : "n/a"}</span></div>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleVaccinationDialog} color="primary">
                            Close
                        </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        fullWidth={true}
                        maxWidth="xs"
                        open={hospitalDialogOpen}
                        onClose={handleHospitalDialog}
                        aria-labelledby="max-width-dialog-title">
                        <DialogTitle style={{textAlign: "center", fontWeight: "bold"}}>Current Hospitalization Data</DialogTitle>
                        <DialogContent>
                            <DialogContentText style={{fontWeight: "bold", textAlign: "center"}}>
                                <div>Hospitalizations: <span style={{fontWeight: "normal"}}>{dateIndex !== -1 ? data[dateIndex]["Hospitalizations"] ? data[dateIndex]["Hospitalizations"] + " (" + hospDiff + ")" : "n/a" : "n/a"}</span></div>
                                <div>ICU Occupancy: <span style={{fontWeight: "normal"}}>{dateIndex !== -1 ? data[dateIndex]["ICU"] ? data[dateIndex]["ICU"] + " (" + icuDiff + ")" : "n/a" : "n/a"}</span></div>
                                <div>ICU (Ventilated): <span style={{fontWeight: "normal"}}>{dateIndex !== -1 ? data[dateIndex]["ICU_Ventilated"] ? data[dateIndex]["ICU_Ventilated"] + " (" + ventDiff + ")" : "n/a" : "n/a"}</span></div>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={handleHospitalDialog} color="primary">
                            Close
                        </Button>
                        </DialogActions>
                    </Dialog>
                </div>

            : null : tab === 1 && graphTab === 0 ?

                // Cases tab
                <div> 
                    <GraphCases data={data}/> 
                </div>

            : tab === 1 && graphTab === 1 ?

                // Hospitalizations tab
                <div>
                    <GraphHospitalization data={data} />
                </div>
            : 
                <div style={{position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
                    <CircularProgress color="secondary"/> 
                </div> 
            }
        </div>
    )
}

export default App
