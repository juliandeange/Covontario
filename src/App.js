import React from 'react';
import './App.css';
import { Component } from 'react';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            records: []
        }
    }

    componentDidMount(){

        // var fetchString = "https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=455fd63b-603d-4608-8216-7d8647f43350"
 
        // fetch(fetchString)
        // .then(response => response.json())
        // .then(data => this.setState({ data }))

        var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
        targetUrl = 'https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=455fd63b-603d-4608-8216-7d8647f43350&limit=100'
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

        console.log("parse")

    }

    render() {

        return (

        <div>{this.state.records.length > 0 ? this.state.records[0].Row_ID : "TEST"}</div>
            
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
