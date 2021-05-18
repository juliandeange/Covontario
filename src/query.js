const fetch = require('node-fetch');
const jsonQuery = require('json-query')   
const { google } = require('googleapis'); 
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { promisify } = require('util')
const https = require('https')
     
const httpsOptions = {
    agent: new https.Agent({
      rejectUnauthorized: false
    })
  };

// fetch('https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=455fd63b-603d-4608-8216-7d8647f43350&fields=Outcome1&limit=1000000')
fetch('https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=455fd63b-603d-4608-8216-7d8647f43350&fields=Outcome1&limit=10', httpsOptions)
    .then(response => response.json())
    .then(data => {

        var resolved = jsonQuery('result.records[*Outcome1=Resolved]', {
            data: data
        })

        var fatal = jsonQuery('result.records[*Outcome1=Fatal', {
            data: data
        })

        console.log("Total Cases: " + data.result.total.toString());
        console.log("Resolved Cases: " + resolved.value.length.toString())
        console.log("Fatal Cases: " + fatal.value.length.toString())
        console.log("Active Cases: " + (data.result.total - resolved.value.length - fatal.value.length).toString())

    })
    .catch(err => {
        console.log(err)
    })

async function AccessSpreadsheet() {

    const creds = require('./client_secret.json');
    const doc = new GoogleSpreadsheet(creds.spreadsheet_url);

    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
    });

    await doc.loadInfo()

    console.log(doc.title)

}

AccessSpreadsheet()
    
