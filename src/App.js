import React from 'react'
import './App.css'
import { Component } from 'react'
import Tabletop from 'tabletop'
import AppBadge from 'react-app-badge'

import isBrowser from 'react-device-detect'
import { Tabs, Tab } from '@material-ui/core'
import ChartTab from './ChartTab'


class App extends Component {

    chartRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            value: 0,
        }
    }

    componentDidMount(){

        Tabletop.init({
            key: '1hHv7MeOpp9G2obU_7iqxh8U0RRvcRSZVTp8VEfn1h8o',
            callback: googleData => {

                this.setState({data: googleData })

            },
            simpleSheet: true
          })

    }

    handleTabChange = (event, value) => {

        this.setState({ value });

      }

    render() {

        const googlePlayLink = "https://play.google.com/store/apps/details?id=ca.gc.hcsc.canada.stopcovid&hl=en_CA"
        const iosStoreLink= "https://apps.apple.com/ca/app/covid-alert/id1520284227"

        return (
            
            <div style={{height: !isBrowser ? "calc(100vh)" : "90vh"}}>     

                <Tabs
                    value={this.state.value}
                    onChange={this.handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered>
                    <Tab style={{color: "white", fontSize: 14, fontWeight: "bold"}} label="Information" />
                    <Tab style={{color: "white", fontSize: 14, fontWeight: "bold"}} label="Graph" />
                </Tabs>

                {this.state.value === 0 ? this.state.data.length > 0 ? 
                    <div>
                        <div style={{position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>

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

                            <h2 style={{textAlign: "center", color: "white", fontWeight: "bold"}}>

                                {this.state.data[this.state.data.length - 1]["Date"]}

                            </h2>
                            <div style={{color: "white"}}>
                                <div style={{textAlign: "center", margin: "2px"}}>
                                    Cases: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["New Cases"] : ""}
                                </div>
                                <div style={{textAlign: "center", margin: "2px"}}>
                                    Recoveries: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["New Recoveries"] : ""}
                                </div>
                                <div style={{textAlign: "center", margin: "2px"}}>
                                    Deaths: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["New Deaths"] : ""}
                                </div>
                                <div style={{textAlign: "center", margin: "2px"}}>
                                    Tests: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["New Tests"] : ""}
                                </div>
                                <div style={{textAlign: "center", margin: "2px"}}>
                                    Active Cases: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["Active Cases"] : ""}
                                </div>
                            </div>

                            <h2 style={{textAlign: "center", color: "white", fontWeight: "bold"}}>

                                Cumulative Data

                            </h2>
                            <div style={{color: "white"}}>
                                <div style={{textAlign: "center", margin: "2px"}}>
                                    Cases: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["Total Cases"] : ""}
                                </div>
                                <div style={{textAlign: "center", margin: "2px"}}>
                                    Recoveries: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["Resolved Cases"] : ""}
                                </div>
                                <div style={{textAlign: "center", margin: "2px"}}>
                                    Deaths: {this.state.data.length > 0 ? this.state.data[this.state.data.length - 1]["Deceased Cases"] : ""}
                                </div>
                                <div style={{textAlign: "center", margin: "2px"}}>
                                    Tests: {this.state.data.length > 0 ? this.state.data[0]["Total Tests"] : ""}
                                </div>
                            </div>

                            <h2 style={{textAlign: "center", color: "white", fontWeight: "bold"}}>

                                Get the COVID-19 Alert App

                            </h2>
                            <div style={{textAlign: "center"}}>
                                <AppBadge version="google" url={googlePlayLink} />
                                <AppBadge version="ios" url={iosStoreLink} />
                            </div>
                        </div>
                        <div style={{fontSize: 10, position: "fixed", top: "99%", left: "50%", transform: "translate(-50%, -99%)", color: "white"}}>

                            Source: https://covid-19.ontario.ca/

                        </div>
                    </div>
                
                : null : 
                    <div> 
                        <ChartTab /> 
                    </div> 
                }
            </div>
        )
    }
}

export default App;
