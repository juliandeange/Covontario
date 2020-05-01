import React from 'react';
import './App.css';
import Chart from 'chart.js'
import { Component } from 'react';
// import CanvasJSReact from './canvasjs.react';
import Tabletop from 'tabletop';
//var CanvasJSReact = require('./canvasjs.react');
// var CanvasJS = CanvasJSReact.CanvasJS;
// var CanvasJSChart = CanvasJSReact.CanvasJSChart;


class App extends Component {

    chartRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            records: [],
            dictionary: {},
            sheetData: []
        }
    }

    componentDidMount(){

    //     // https://docs.google.com/spreadsheets/d/e/2PACX-1vROHlPiz9H7qy9JHQM2BfvTtvXeQFMq7EvUafNlN4T4S-R4KhBX2tYHWFTNY41Q9ALtlehgXS0e6kK8/pubhtml


    //     var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
    //     targetUrl = 'https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=455fd63b-603d-4608-8216-7d8647f43350&limit=100'
    //     fetch(proxyUrl + targetUrl)
    //     .then(blob => blob.json())
    //     .then(data => {
    //         console.log(data);
    //         // document.querySelector("pre").innerHTML = JSON.stringify(data, null, 2);
    //         this.setState({records : data.result.records})
            
            this.ParseRecords()

    //         return data;
        
    //   })
    //   .catch(e => {
    //       console.log(e);
    //       return e;
    //   });


    }

    componentDidUpdate(props, state) {

        console.log("update")

    }

    ParseRecords(){

        // var cases = {}

        // for (var index in this.state.records) {

        //     var found = cases[this.state.records[index].Accurate_Episode_Date]
        //     if (found === undefined) {
        //         cases[this.state.records[index].Accurate_Episode_Date] = 1
        //     }
        //     else {
        //         cases[this.state.records[index].Accurate_Episode_Date]++
        //     }
        // }

        // this.setState({dictionary: cases})
        const myChartRef = this.chartRef.current.getContext("2d");
    
        const options = {
            scales:{
                xAxes:[{
                    id: "A",
                    scaleLabel: {
                        display: true,
                        fontStyle: "bold",
                        fontColor: "black",
                        labelString: "Day"
                    },
                    type: "time",
                    time:{
                        tooltipFormat: "MMM/DD/YYYY"
                    }
                }],
                yAxes:[{
                    type: "linear",
                    gridLines:{
                        // display: false
                    },
                    scaleLabel: {
                        display: true,
                        fontStyle: "bold",
                        fontColor: "black",
                        labelString: "# of Active Cases"
                    },
                    // ticks: {
                    //     steps: 20,
                    //     stepValue: 500,
                    //     max: 20000,
                    //     callback: function(value, index, values) {//needed to change the scientific notation results from using logarithmic scale
                    //         return Number(value.toString());//pass tick values as a string into Number function
                    //     }
                    // },
                }]
                // yAxes:[{
                //     id: "B",
                //     scaleLabel: {
                //         display: true,
                //         fontStyle: "bold",
                //         fontColor: "black",
                //         labelString: "# of Active Cases"
                //     },
                //     ticks: {
                //         fontStyle: "bold",
                //         max: 100000
                //         // suggestedMin: -2,
                //     }
                // }]
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

        // const sortedCases = Object.entries(this.state.dictionary).sort()
        // var totalCases = 0

        // for (var caseIndex in sortedCases) {

        //     // sortedCases[index][0] = date
        //     // sortedCases[index][1] = new cases
        //     totalCases = totalCases + sortedCases[caseIndex][1]
        //     sortedCases[caseIndex][1] = totalCases
            

        // }

        Tabletop.init({
            key: '1hHv7MeOpp9G2obU_7iqxh8U0RRvcRSZVTp8VEfn1h8o',
            callback: googleData => {
              console.log('google sheet data --->', googleData)
                

              new Chart(myChartRef, {
                type: "line",
                data: {
                    // labels: sortedCases.map((key, index) => { return sortedCases[index][0] }),
                    labels: googleData.map((key, index) => { return googleData[index]["Date"]}),
                    datasets: [
                        {
                            borderColor: "Red",
                            fill: false,
                            label: "Active Cases of COVID in Ontario",
                            // data: sortedCases.map((key, index) => { return sortedCases[index][1] })
                            data: googleData.map((key, index) => { return googleData[index]["Active Cases"]})
                        }
                    ]
                },
                options: options
            });


            },
            simpleSheet: true
          })
    
        

        console.log("done parse")

    }

    render() {
        return (
            <div>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                    // style={{width: 800, height: 300}}
                />

                

                {/* <CanvasJSChart options={options}/> */}
                
            </div>
            
        )

    }

}

export default App;
