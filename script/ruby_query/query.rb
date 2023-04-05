#!/usr/bin/env ruby

require 'net/http'
require 'json'
require 'uri'
require 'bundler'

require './CaseData.rb'
Bundler.require

def GetData
    # url = 'https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=455fd63b-603d-4608-8216-7d8647f43350&fields=Outcome1&limit=100'
    # url = 'https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=455fd63b-603d-4608-8216-7d8647f43350&fields=Outcome1&limit=10000000'
    url = 'https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=ed270bb8-340b-41f9-a7c6-e8ef587e6d11&limit=14&sort=Reported%20Date%20desc'
    uri = URI(url)
    response = Net::HTTP.get(uri)
    # puts response;

    json = JSON.parse(response)
    records = json['result']['records']
    total = json['result']['total']

    AccessSpreadsheet(records)

    puts 'done'
end


def AccessSpreadsheet(data)

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
        time = Time.new(d['Reported Date'])
        date = time.strftime('%B %d %Y')
        if rows[totalRows - 1][headerRow['Date']] == date
            beginInsert = true
            next
        elsif beginInsert == true
            # puts d
            obj = CreateCaseDataObject(d)
            WriteObjectToSpreadsheet(obj, worksheet, headerRow)
            Tweet(obj)
        end

    end

    worksheet.save

    # Tweet(data)
    

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

def CreateCaseDataObject(data)

    date = Time.new(data['Reported Date']).strftime('%B %d %Y')
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

def Tweet(data)

    creds = File.read('../TwitterAPIKeys_Ruby.json')
    credHash = JSON.parse(creds)
    
    client = Twitter::REST::Client.new do |config|
        config.consumer_key        = credHash['consumer_key']
        config.consumer_secret     = credHash['consumer_secret']
        config.access_token        = credHash['access_token_key']
        config.access_token_secret = credHash['access_token_secret']
    end

    # client.update(
    #     "Ontario COVID-19 case data for " + data.date + ": \n" +
    #     data. + " new cases \n" +
    #     newRecoveries + " recoveries \n" +
    #     newDeaths + " deaths \n" +
    #     activeCases + " active cases (" + (activeCaseDifference >= 0 ? "+" : "") + activeCaseDifference + ") \n\n" +

    #     "Visit https://covontario.ca to view additional data \n\n" +

    #     "#COVID19Ontario #COVID19 #COVID #Ontario #Covontario"
    # )

    # client.update("Ruby test \n  test")
    # puts 'done'

end

GetData()
