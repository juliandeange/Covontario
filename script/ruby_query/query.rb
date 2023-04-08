#!/usr/bin/env ruby

require 'net/http'
require 'json'
require 'uri'
require 'bundler'
require 'date'

require './CaseData.rb'
Bundler.require

def GetData
    # url = 'https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=455fd63b-603d-4608-8216-7d8647f43350&fields=Outcome1&limit=100'
    # url = 'https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=455fd63b-603d-4608-8216-7d8647f43350&fields=Outcome1&limit=10000000'
    url = 'https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=ed270bb8-340b-41f9-a7c6-e8ef587e6d11&limit=14&sort=Reported%20Date%20desc'
    uri = URI(url)
    response = Net::HTTP.get(uri)

    json = JSON.parse(response)
    records = json['result']['records']

    return records

    puts 'done'
end


def AccessSpreadsheet(data)

    dataQueue = Queue.new

    # Create google sheet context
    session = GoogleDrive::Session.from_service_account_key("../client_secret.json")
    spreadsheet = session.spreadsheet_by_title("Ontario COVID-19")
    worksheet = spreadsheet.worksheets.first
    rows = worksheet.rows
    totalRows = worksheet.rows.length

    # Create hash that maps each column name to an integer
    # Used because this sheet API doesnt allow accessing rows by key name, only by index
    count = 0
    headerRow = {}
    rows[0].each do |e|
        headerRow[e] = count
        count = count + 1
    end

    # puts headerRow

    data.reverse!
    beginInsert = false

    data.each do |d|

        year = d['Reported Date'][0,4].to_i
        month = d['Reported Date'][5,6].to_i
        day = d['Reported Date'][8,9].to_i

        parsed = Date.new(year, month, day)
        date = parsed.strftime('%B %d %Y')

        if rows[totalRows - 1][headerRow['Date']] == date
            beginInsert = true
            next
        elsif beginInsert == true
            obj = CreateCaseDataObject(d, date)
            WriteObjectToSpreadsheet(obj, worksheet, headerRow)
            PrintCaseDataObject(obj)
            dataQueue.enq(obj)
        end

    end
    
    worksheet.save
    return dataQueue

end

def WriteObjectToSpreadsheet(data, sheet, headerRow)

    rows = sheet.rows
    totalRows = sheet.rows.length

    newCases = data.total - rows[totalRows - 1][headerRow['Total Cases']].to_i
    newRecoveries = data.resolved - rows[totalRows - 1][headerRow['Resolved Cases']].to_i
    newFatalities = data.fatal - rows[totalRows - 1][headerRow['Deceased Cases']].to_i
    activeCaseDifference = data.active - rows[totalRows - 1][headerRow["Active Cases"]].to_i

    data.newCases = newCases
    data.newRecoveries = newRecoveries
    data.newFatalities = newFatalities
    data.activeCaseDifference = activeCaseDifference

    # Date
    # Total Cases  
    # New Cases
    # 7 Day Average	
    # Resolved Cases	
    # New Recoveries	
    # Deceased Cases	
    # New Deaths	
    # Active Cases	
    # Active Case Difference	
    # New Tests
    # % Positive	
    # Total Tests		
    # *** SPARE ***
    # Cases_NotFullyVaccinated	
    # Cases_Vax	
    # Cases_Boosted	
    # Cases_Unknown	
    # Hospitalizations	
    # ICU	ICU_Ventilated	
    # Cases_Unvax
    # Cases_Partial										

    sheet.insert_rows(totalRows + 1, [[
        data.date,
        data.total,
        data.newCases,
        '',
        data.resolved,
        data.newRecoveries,
        data.fatal,
        data.newFatalities,
        data.active,
        data.activeCaseDifference,
        data.newTests,
        '',
        data.totalTests,
        '', # SPARE
        '',
        '',
        '',
        '',
        data.hospital,
        data.icu,
        data.icuVented
    ]])
end

def CreateCaseDataObject(data, date)

    date = date
    total = data['Total Cases']
    resolved = data['Resolved']
    fatal = data['Deaths_New_Methodology']
    active = data['Confirmed Positive']
    newTests = data['Total tests completed in the last day']
    totalTests = data['Total patients approved for testing as of Reporting Date']
    hospitalizations = data['Number of patients hospitalized with COVID-19']
    icu = data['Number of patients in ICU due to COVID-19']
    icuVented = data['Number of patients in ICU on a ventilator due to COVID-19']

    caseData = CaseData.new(date, total, resolved, fatal, active, newTests, totalTests, hospitalizations, icu, icuVented)
    return caseData

end

def PrintCaseDataObject(data)

    puts data.inspect

end

def TweetDataQueue(client, dataQueue)

    while dataQueue.length > 0
        data = dataQueue.deq()
        Tweet(client, data)
    end

end

def Tweet(client, data)

    client.update(
        "Ontario COVID-19 case data for " + data.date + ": \n" +
        "Cases: " + data.newCases.to_s + "\n" +
        "Deaths: " + data.newFatalities.to_s + "\n" +
        "Recoveries: " + data.newRecoveries.to_s + "\n" +
        "Active Cases: " + data.active.to_s + " (" + (data.activeCaseDifference >= 0 ? '+' : '') + data.activeCaseDifference.to_s + ") \n\n" +

        "Visit https://covontario.ca to view additional data \n\n" +

        "#COVID19Ontario #COVID19 #COVID #Ontario #Covontario"
    )

end

def GetTwitterClient

    creds = File.read('../TwitterAPIKeys_Ruby.json')
    credHash = JSON.parse(creds)
    
    client = Twitter::REST::Client.new do |config|
        config.consumer_key        = credHash['consumer_key']
        config.consumer_secret     = credHash['consumer_secret']
        config.access_token        = credHash['access_token_key']
        config.access_token_secret = credHash['access_token_secret']
    end

    return client

end

data = GetData()
client = GetTwitterClient()
dataQueue = AccessSpreadsheet(data)
TweetDataQueue(client, dataQueue)
