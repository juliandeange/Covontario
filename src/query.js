const fetch = require('node-fetch')
const https = require('https') 

const { google } = require('googleapis')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const Twitter = require('twitter')

const jsonQuery = require('json-query') 
var dateFormat = require('dateformat')
     
const httpsOptions = {
    agent: new https.Agent({
      rejectUnauthorized: false
    })
  };

(async () => {

    await fetch('https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=455fd63b-603d-4608-8216-7d8647f43350&fields=Outcome1&limit=1000000', httpsOptions)
    // await fetch('https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=455fd63b-603d-4608-8216-7d8647f43350&fields=Outcome1&limit=10', httpsOptions)
    // await fetch('https://data.ontario.ca/api/3/action/datastore_search?resource_id=ed270bb8-340b-41f9-a7c6-e8ef587e6d11&limit=1000000', httpsOptions)
    .then(response => response.json())
    .then(data => {

        // var latestRecord = data.result.records[data.result.records.length - 1]
        // console.log(latestRecord)

        var resolved = jsonQuery('result.records[*Outcome1=Resolved]', {
            data: data
        })

        var fatal = jsonQuery('result.records[*Outcome1=Fatal]', {
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

    if (yesterday != today && yesterdayTotalCases != todayTotalCases && todayTotalCases >= yesterdayTotalCases) {

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

        const config = require("./TwitterAPIKeys")
        const twitterClient = new Twitter(config)
        twitterClient.post('statuses/update', {status:

            "Ontario COVID-19 data for today (" + dateFormat(new Date(), "mmmm dd") + "): \n" +
            newCases + " new cases \n" +
            newRecoveries + " recoveries \n" +
            newDeaths + " deaths \n" +
            activeCases + " active cases (" + (activeCaseDifference >= 0 ? "+" : "") + activeCaseDifference + ") \n\n" +

            "Visit https://covontario.ca to view the graph \n\n" +

            "#COVID19Ontario #COVID19 #COVID #Ontario"

            }, function(error, tweet, response){
            if(!error){
                console.log(error);
            }
        })

    }
    else if (rows[rows.length - 1]["Date"] === today) {

        // console.log(rows[rows.length - 1][""])
        await fetch('https://data.ontario.ca/api/3/action/datastore_search?resource_id=ed270bb8-340b-41f9-a7c6-e8ef587e6d11&limit=1000000', httpsOptions)
        .then(response => response.json())
        .then(data => { 

            var latestData = data.result.records[data.result.records.length - 1]
            var newTests = latestData["Total tests completed in the last day"]
        })

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


    
