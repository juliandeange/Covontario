import React from 'react';
import './App.css';
import Chart from 'chart.js'
import { Component } from 'react';
import CanvasJSReact from './canvasjs.react';
//var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class App extends Component {

    chartRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            records: [],
            dictionary: {}
        }
    }

    componentDidMount(){

        var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
        targetUrl = 'https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=455fd63b-603d-4608-8216-7d8647f43350&limit=100000'
        fetch(proxyUrl + targetUrl)
        .then(blob => blob.json())
        .then(data => {
            console.log(data);
            // document.querySelector("pre").innerHTML = JSON.stringify(data, null, 2);
            this.setState({records : data.result.records})
            
            this.ParseRecords()

            return data;
        
      })
      .catch(e => {
          console.log(e);
          return e;
      });


    }

    componentDidUpdate(props, state) {

        console.log("update")

    }

    ParseRecords(){

        var cases = {}

        for (var index in this.state.records) {

            var found = cases[this.state.records[index].Accurate_Episode_Date]
            if (found === undefined) {
                cases[this.state.records[index].Accurate_Episode_Date] = 1
            }
            else {
                cases[this.state.records[index].Accurate_Episode_Date]++
            }
        }

        this.setState({dictionary: cases})
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
                        labelString: "Total number of cases"
                    },
                    ticks: {
                        steps: 20,
                        stepValue: 750,
                        max: 15000,
                        callback: function(value, index, values) {//needed to change the scientific notation results from using logarithmic scale
                            return Number(value.toString());//pass tick values as a string into Number function
                        }
                    },
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

        const sortedCases = Object.entries(this.state.dictionary).sort()
        var totalCases = 0

        for (var index in sortedCases) {

            // sortedCases[index][0] = date
            // sortedCases[index][1] = new cases
            totalCases = totalCases + sortedCases[index][1]
            sortedCases[index][1] = totalCases
            

        }
    
        new Chart(myChartRef, {
            type: "line",
            data: {
                labels: sortedCases.map((key, index) => { return sortedCases[index][0] }),
                datasets: [
                    {
                        borderColor: "Red",
                        fill: false,
                        label: "Active Cases of COVID in Ontario",
                        data: sortedCases.map((key, index) => { return sortedCases[index][1] })
                    }
                ]
            },
            options: options
        });

        console.log("done parse")

    }

    render() {

        const options = {
			animationEnabled: true,
			theme: "light2",
			title: {
				text: "Growth of Photovoltaics"
			},
			axisY: {
				title: "Capacity (in MWp)",
				logarithmic: true,
				includeZero: false
			},
			data: [{
				type: "spline",
				showInLegend: true,
				legendText: "MWp = one megawatt peak",
				dataPoints: [
				  { x: new Date(2001, 0), y: 1615},
				  { x: new Date(2002, 0), y: 2069},
				  { x: new Date(2003, 0), y: 2635},
				  { x: new Date(2004, 0), y: 3723},
				  { x: new Date(2005, 0), y: 5112},
				  { x: new Date(2006, 0), y: 6660},
				  { x: new Date(2007, 0), y: 9183},
				  { x: new Date(2008, 0), y: 15844},
				  { x: new Date(2009, 0), y: 23185},
				  { x: new Date(2010, 0), y: 40336},
				  { x: new Date(2011, 0), y: 70469},
				  { x: new Date(2012, 0), y: 100504},
				  { x: new Date(2013, 0), y: 138856},
				  { x: new Date(2014, 0), y: 178391},
				  { x: new Date(2015, 0), y: 229300},
				  { x: new Date(2016, 0), y: 302300},
				  { x: new Date(2017, 0), y: 405000}   
				]
			}]
		}

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
