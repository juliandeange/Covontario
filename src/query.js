const fetch = require('node-fetch');
const https = require('https') 

const { google } = require('googleapis'); 
const { GoogleSpreadsheet } = require('google-spreadsheet');

const jsonQuery = require('json-query') 
var dateFormat = require('dateformat');
     
const httpsOptions = {
    agent: new https.Agent({
      rejectUnauthorized: false
    })
  };


  (async () => {

    await fetch('https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=455fd63b-603d-4608-8216-7d8647f43350&fields=Outcome1&limit=1000000', httpsOptions)
    // await fetch('https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=455fd63b-603d-4608-8216-7d8647f43350&fields=Outcome1&limit=10', httpsOptions)
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

        AccessSpreadsheet(data.result.total, resolved.value.length, fatal.value.length)

    })
    .catch(err => {
        console.log(err)
    })

})()

async function AccessSpreadsheet(todayTotalCases, todayTotalResolved, todayTotalFatal) {

    const creds = require('./client_secret.json');
    const doc = new GoogleSpreadsheet(creds.spreadsheet_url);

    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
    });

    await doc.loadInfo()

    const rows = await doc.sheetsByIndex[0].getRows()

    var today = dateFormat(new Date(), "mmmm dd yyyy")
    var yesterday = rows[rows.length - 1]["Date"]
    var yesterdayTotalCases = rows[rows.length - 1]["Total Cases"]

    if (yesterday != today && yesterdayTotalCases != todayTotalCases) {

        var activeCases = todayTotalCases - todayTotalResolved - todayTotalFatal
        var newCases = todayTotalCases - yesterdayTotalCases
        var newRecoveries = todayTotalResolved - rows[rows.length - 1]["Resolved Cases"]
        var newDeaths = todayTotalFatal - rows[rows.length - 1]["Deceased Cases"]
        var activeCaseDifference = activeCases - rows[rows.length - 1]["Active Cases"]

        doc.sheetsByIndex[0].addRow({

            "Date": today,
            "Total Cases": todayTotalCases,
            "New Cases": newCases,
            // 7 Day Avg
            "Resolved Cases": todayTotalResolved,
            "New Recoveries": newRecoveries,
            "Deceased Cases": todayTotalFatal,
            "New Deaths": newDeaths,
            "Active Cases": activeCases,
            "Active Case Difference": activeCaseDifference

        })

        doc.sheetsByIndex[0].saveUpdatedCells()

    }

    // Date
    // Total Cases
    // New Cases
    // 7 Day Average
    // Resolved Cases
    // New Recoveries
    // Deceased Cases
    // New Deaths
    // Active Cases
    // Active Case Difference
    // New Tests
    // % Positive
    // Total Tests

}


    
