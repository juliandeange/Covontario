//npm install chart.js
//npm install chartjs-plugin-zoom


import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
// import Chart from './components/Chart'
import Chart from 'chart.js';
import Zoom from 'chartjs-plugin-zoom';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel'
import { TextField, Switch } from '@material-ui/core';

class App extends Component {


    constructor(props){
        super(props);

        // this.state = { dataSet : this.dataset1 }
        this.state = {
            set1 : [],
            set2 : [],
            buttonText : "reset zoom",
            switched : false
        }

    }

    componentDidMount() {
        
        const node = this.node;

        var dataset1 = {
            borderColor: 'Red',
            fill: false,
            steppedLine: true,
            label: "JTest",
            yAxisID: "A",
            data: [
                {y: -1, x: "2016-06-14 00:00:00.0000000"},
                {y: 0, x: "2017-02-02 00:00:00.0000000"},
                {y: 0.5, x: "2017-06-14 00:00:00.0000000"},
                {y: 1, x: "2017-09-30 00:00:00.0000000"},
                {y: 999999999, x: "2018-01-01 00:00:00.0000000"},
                {y: 2, x: "2018-09-10 00:00:00.0000000"},
                {y: 0, x: "2018-09-30 00:00:00.0000000"},
                {y: 4, x: "2018-10-01 00:00:00.0000000"},
                {y: 1, x: "2018-10-02 00:00:00.0000000"},
                {y: 4, x: "2018-10-03 00:00:00.0000000"},
                {y: 9, x: "2018-10-04 00:00:00.0000000"},
                {y: 8, x: "2018-10-05 00:00:00.0000000"},
                {y: 1, x: "2018-10-06 00:00:00.0000000"},
                {y: 1, x: "2018-10-07 00:00:00.0000000"},
                {y:-8, x: "2018-10-08 00:00:00.0000000"},
                {y:-11, x: "2018-10-09 00:00:00.0000000"},
                {y:-0, x: "2018-10-10 00:00:00.0000000"},
                {y:2, x: "2018-10-11 00:00:00.0000000"} 
            ]
        }

        const dataset2 = {
            borderColor: "Blue",
            fill: false,
            steppedLine: true,
            label: "JTest1",
            yAxisID: "B",
            data: [
                {y: 4, x: "2016-08-14 00:00:00.0000000"},
                {y: 0, x: "2017-09-14 00:00:00.0000000"},
                {y: 2, x: "2017-10-14 00:00:00.0000000"},
                {y: -3, x: "2017-11-14 00:00:00.0000000"},
                {y: 4, x: "2019-01-15 00:00:00.0000000"},
                {y: 4, x: "2019-02-02 00:00:00.0000000"},
                {y: 9, x: "2019-02-03 00:00:00.0000000"},
                {y: 20, x: "2019-02-04 00:00:00.0000000"},
                {y: 18, x: "2019-02-05 00:00:00.0000000"},
                {y: 15, x: "2019-02-06 00:00:00.0000000"},
                {y: 4, x: "2019-02-07 00:00:00.0000000"},
                {y: 0, x: "2019-02-08 00:00:00.0000000"},
                {y: -5, x: "2019-02-09 00:00:00.0000000"},
                {y: -6, x: "2019-02-10 00:00:00.0000000"}
            ]

        }

        const options = {
            scales:{
                xAxes:[{
                    type: "time",
                    time:{
                        tooltipFormat: "YYYY/DDD hh:mm:ss a"
                    },
                    scaleLabel: {
                        display: true,
                        fontStyle: "bold",
                        fontColor: "black",
                        labelString: "GMT"
                    }
                }],
                yAxes:[{
                    id: "A",
                    scaleLabel: {
                        display: true,
                        fontStyle: "bold",
                        fontColor: "black",
                        labelString: "BYTE"
                    },
                    ticks: {
                        suggestedMin: -10,
                        suggestedMax: 20
                    }
                }
                , {
                    id: "B",
                    scaleLabel: {
                        display: true,
                        fontStyle: "bold",
                        fontColor: "black",
                        labelString: "COUNTS"
                    },
                    ticks: {
                        suggestedMin: -15,
                        suggestedMax: 25
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

        var data = {
                datasets: [dataset1, dataset2]
        }


        for (var i = 0; i <= data.datasets.length - 1; i++) {

            var length = data.datasets[i].data.length;

            for (var j = 0; j <= length - 1; j++){
                if (data.datasets[i].data[j].y === 999999999){
                    var newPoint = {y: null , x: data.datasets[i].data[j].x.slice(0, -1) + "1"}
                    data.datasets[i].data[j].y = data.datasets[i].data[j - 1].y;
                    data.datasets[i].data.splice(j + 1, 0, newPoint);
                }

            }
        }

        this.setState({
            set1 : dataset1,
            set2 : dataset2
        })

        window.myChart = new Chart(node, {
            type: "line",
            data: data,
            options: options

        });
    }

    clicked() {
        window.myChart.resetZoom();
        if (this.state.buttonText === "reset zoom" && this.state.switched) {
            this.setState({ buttonText: "test"})
        }
        else if (this.state.buttonText === "test" && this.state.switched) {
            this.setState({ buttonText: "reset zoom"})
        }
    }

    handleChange = name => event => {
        this.setState({[name]: event.target.checked})
    }

    render() {

        // const {
        //     set1,
        //     set2
        // } = this.state;
        // const {set1} = this.state;

        var divStyle = {
            padding: "20px",
            margin: "20px"
        }

        var buttonStyle = {
            size: "medium",
            margin: "10px",
            height: "10px"
        }

        var val1;
        var val2;

        if (this.state.set1.data) {
            val1 = this.state.set1.data.length
        }
        else {
            val1 = "N/A"
        }

        if (this.state.set2.data) {
            val2 = this.state.set2.data.length
        }
        else {
            val2 = "N/A"
        }

        // console.log("borderColor: " + this.state.set1.borderColor)
        // const temp = this.state.dataSet;
        // const val2 = 5;

        return (

            <div style={divStyle}>
                <canvas
                    style={{width: 800, height: 300}}
                    ref={node => (this.node = node)} >
                </canvas>


                <Button variant="contained" color="secondary" style={buttonStyle} onClick={this.clicked.bind(this)}>
                {this.state.buttonText}
                </Button>
                <br />
                <FormLabel>JTest no. of points: {val1}</FormLabel>
                <br />
                <FormLabel>JTest1 no. of points: {val2}</FormLabel>

                <br />
                <br />

                <FormLabel>Toggle Button Text</FormLabel>
                <Switch id="switch"
                    checked={this.state.switched}
                    onChange={this.handleChange("switched")}
                    value="switched"
                    margin="normal"    
                />

            </div>
        );
    }
}

export default App;
