using System;
using System.Collections.Generic;
using System.Net;
using Newtonsoft.Json;
using System.Linq;
using System.IO;

namespace RequestorDB {
    class Program {
        static void Main(string[] args) {
            
            string url = "https://data.ontario.ca/api/3/action/datastore_search?resource_id=ed270bb8-340b-41f9-a7c6-e8ef587e6d11&limit=1000000";

            using (WebClient wc = new WebClient()) {

                string json = wc.DownloadString(url);

                //dynamic obj = JsonConvert.
                dynamic deserialized = JsonConvert.DeserializeObject(json);

                var data = deserialized["result"]["records"];
                //dynamic data = deserialized[2];

                //var dates = data.ToList();

                TextWriter tw = new StreamWriter(@"./SavedList.csv");

                foreach (var line in data)
                    tw.WriteLine(line["Reported Date"] + "," + line["Number of patients hospitalized with COVID-19"]
                                 + "," + line["Number of patients in ICU due to COVID-19"]
                                 + "," + line["Number of patients in ICU on a ventilator due to COVID-19"]

                        );

                tw.Close();

                //foreach (var r in data)
                //    Console.WriteLine(r["Reported Date"]);

                Console.WriteLine("");

            }

        }
    }
}
