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
    url = 'https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=ed270bb8-340b-41f9-a7c6-e8ef587e6d11&limit=20&sort=Reported%20Date%20desc'
    uri = URI(url)
    response = Net::HTTP.get(uri)
    # puts response;

    json = JSON.parse(response)
    records = json['result']['records']
    total = json['result']['total']

    # records.reverse!

    # resolvedCases = 0
    # fatalCases = 0

    # records.each do |data|
    #     time = Time.new(data['Reported Date'])
    #     date = time.strftime('%B %d %Y')
        
    #     # if (date)
    #     # if child['Outcome1'] == 'Resolved'
    #     #     resolvedCases = resolvedCases + 1
    #     # elsif child['Outcome1'] == 'Fatal'
    #     #     fatalCases = fatalCases + 1
    #     # end
    # end



    # puts "Total Cases: #{total}"
    # puts "Resolved Cases: #{resolvedCases}"
    # puts "Fatal Cases: #{fatalCases}"
    # puts "Active Cases: #{total - resolvedCases - fatalCases}"
    # puts "----------"

    AccessSpreadsheet(records)

    puts 'done'
end


def AccessSpreadsheet(data)

    # puts data

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

    puts headerRow

    data.reverse!
    beginInsert = false

    data.each do |d|
        time = Time.new(d['Reported Date'])
        date = time.strftime('%B %d %Y')
        if rows[totalRows - 1][headerRow['Date']] == date
            beginInsert = true
            next
        elsif beginInsert == true
            obj = CreateCaseDataObject(d)
            WriteObjectToSpreadsheet(obj, worksheet)
        end

    end
    

    # # puts rows[totalRows - 1][headerRow["Total Cases"]]
    # today = Time.new().strftime('%B %d %Y')
    # yesterday = rows[totalRows - 1][headerRow["Date"]]

    # yesterdayTotalCases = rows[totalRows - 1][headerRow["Total Cases"]].to_i
    # yesterdayRecoveries = rows[totalRows - 1][headerRow["Resolved Cases"]].to_i
    # yesterdayFatal= rows[totalRows - 1][headerRow["Deceased Cases"]].to_i

    # if yesterday != today && yesterdayTotalCases != total && total >= yesterdayTotalCases
        
    #     activeCases = total - resolved - fatal
    #     newCases = total - yesterdayTotalCases
    #     newRecoveries = resolved - rows[totalRows - 1][headerRow["Resolved Cases"]].to_i
    #     newFatal = fatal - rows[totalRows - 1][headerRow["Deceased Cases"]].to_i
    #     activeCaseDifference = activeCases - rows[totalRows - 1][headerRow["Active Cases"]].to_i

    #     worksheet.insert_rows(totalRows + 1, [[today, total, newCases, "", resolved, newRecoveries, fatal, newFatal, activeCases, activeCaseDifference]])
    #     worksheet.save

    # end

end

def WriteObjectToSpreadsheet(data, sheet)

    rows = sheet.rows
    totalRows = sheet.rows.length

    # sheet.insert_rows(totalRows + 1, [[data.date, data.total, data.]])
    # sheet.save

end

def CreateCaseDataObject(data)

    date = Time.new(data['Reported Date']).strftime('%B %d %Y')
    total = data['Total Cases']
    resolved = data['Resolved']
    fatal = data['Deaths_New_Methodology']
    active = data['Confirmed Positive']
    newTests = data['Total tests completed in the last day']
    totalTests = data['Total patients approved for testing as of Reporting Date']

    return CaseData.new(date, total, resolved, fatal, active, newTests, totalTests)

end

def PrintCaseDataObject(data)

    puts data.inspect

end

GetData()
