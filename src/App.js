import React from 'react';
import './App.css';
import Chart from 'chart.js'
import { Component } from 'react';

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
                        labelString: "# of Active Cases"
                    },
                    type: "time",
                    time:{
                        tooltipFormat: "MMM/DD/YYYY"
                    }
                }
                ],
                yAxes:[{
                    id: "B",
                    scaleLabel: {
                        display: true,
                        fontStyle: "bold",
                        fontColor: "black",
                        labelString: "# of Active Cases"
                    },
                    ticks: {
                        suggestedMin: -2,
                    }
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

        const sortedCases = Object.entries(this.state.dictionary).sort()
        var totalCases = 0

        for (var index in sortedCases) {

            // sortedCases[index][0] = date
            // sortedCases[index][1] = new cases

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

        return (
            <div>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                    // style={{width: 800, height: 300}}
                />
            </div>
            
        )

    }

}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
