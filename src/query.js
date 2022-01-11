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

    await fetch('https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=455fd63b-603d-4608-8216-7d8647f43350&fields=Outcome1&limit=10000000', httpsOptions)
    // await fetch('https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=455fd63b-603d-4608-8216-7d8647f43350&fields=Outcome1&limit=10', httpsOptions)
    // await fetch('https://data.ontario.ca/api/3/action/datastore_search?resource_id=ed270bb8-340b-41f9-a7c6-e8ef587e6d11&limit=1000000', httpsOptions)
    .then(response => response.json())
    .then(data => {

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

            "Ontario COVID-19 data for today (" + dateFormat(new Date(), "mmmm dd yyyy") + "): \n" +
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

        var latestRow = rows[rows.length - 1]
        var firstRow = rows[0]

        if (!latestRow['New Tests'] ||
            !latestRow['Hospitalizations'] ||
            !latestRow['ICU'] ||
            !latestRow['ICU_Ventilated']) {
        
            await fetch('https://data.ontario.ca/api/3/action/datastore_search?resource_id=ed270bb8-340b-41f9-a7c6-e8ef587e6d11&limit=1&sort=%22Reported%20Date%22%20desc', httpsOptions)
            .then(response => response.json())
            .then(data => { 

                var latestData = data.result.records[data.result.records.length - 1]
                var newTests = latestData['Total tests completed in the last day']
                var totalTests = latestData['Total patients approved for testing as of Reporting Date']
                var hospitalizations = latestData['Number of patients hospitalized with COVID-19']
                var icu = latestData['Number of patients in ICU due to COVID-19']
                var icuVented = latestData['Number of patients in ICU on a ventilator due to COVID-19']

                var dateFromAPI = new Date(data.result.records[0]['Reported Date'])
                var today = new Date()

                var dateStringAPI = dateFromAPI.getDate() + '/' + dateFromAPI.getMonth() + '/' + dateFromAPI.getFullYear()
                var dateStringToday = today.getDate() + '/' + today.getMonth() + '/' + today.getFullYear()

                if (dateStringAPI === dateStringToday) {

                    latestRow['New Tests'] = newTests
                    firstRow['Total Tests'] = totalTests

                    latestRow['Hospitalizations'] = hospitalizations
                    latestRow['ICU'] = icu
                    latestRow['ICU_Ventilated'] = icuVented

                    latestRow.save()
                    firstRow.save()

                }
            })
        }

        if (!latestRow['Cases_Vax'] ||
            !latestRow['Cases_Unvax']  ||
            !latestRow['Cases_Partial'] ||
            !latestRow['Cases_Unknown']) {

            await fetch('https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=eed63cf2-83dd-4598-b337-b288c0a89a16&limit=1&sort=Date%20desc', httpsOptions)
            .then(response => response.json())
            .then(data => {

                var vax = data.result.records[0]['covid19_cases_full_vac']
                var unvax = data.result.records[0]['covid19_cases_unvac']
                var partial = data.result.records[0]['covid19_cases_partial_vac']
                var unknown = data.result.records[0]['covid19_cases_vac_unknown']

                var dateFromAPI = new Date(data.result.records[0]['Date'])
                var today = new Date()

                var stringAPI = dateFromAPI.getDate() + '/' + dateFromAPI.getMonth() + '/' + dateFromAPI.getFullYear()
                var stringToday = today.getDate() + '/' + today.getMonth() + '/' + today.getFullYear()

                if (stringAPI === stringToday) {

                    latestRow['Cases_Vax'] = vax
                    latestRow['Cases_Unvax'] = unvax
                    latestRow['Cases_Partial'] = partial
                    latestRow['Cases_Unknown'] = unknown

                    latestRow.save()

                }
            })
        }
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


    
