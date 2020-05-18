const functions = require('firebase-functions');
var jsonQuery = require('json-query')
const fetch = require("node-fetch");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {

        var json;
        fetch('https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=455fd63b-603d-4608-8216-7d8647f43350&limit=100000')
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

                response.send("done")
            })

            

    // response.send("data");
});


