#!/usr/bin/env ruby

require 'net/http'
require 'json'
require 'uri'
require 'bundler'
Bundler.require

def GetData
    # url = 'https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=455fd63b-603d-4608-8216-7d8647f43350&fields=Outcome1&limit=100'
    url = 'https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=455fd63b-603d-4608-8216-7d8647f43350&fields=Outcome1&limit=10000000'
    uri = URI(url)
    response = Net::HTTP.get(uri)
    # puts response;

    json = JSON.parse(response)
    records = json['result']['records']
    total = json['result']['total']

    resolvedCases = 0
    fatalCases = 0

    records.each do |child|
        if child['Outcome1'] == 'Resolved'
            resolvedCases = resolvedCases + 1
        elsif child['Outcome1'] == 'Fatal'
            fatalCases = fatalCases + 1
        end
    end

    puts "Total Cases: #{total}"
    puts "Resolved Cases: #{resolvedCases}"
    puts "Fatal Cases: #{fatalCases}"
    puts "Active Cases: #{total - resolvedCases - fatalCases}"
    puts "----------"

    AccessSpreadsheet(total, resolvedCases, fatalCases)

    puts 'done'
end


def AccessSpreadsheet(total, resolved, fatal)

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

    # puts rows[totalRows - 1][headerRow["Total Cases"]]
    today = Time.new().strftime('%B %d %Y')
    yesterday = rows[totalRows - 1][headerRow["Date"]]

    yesterdayTotalCases = rows[totalRows - 1][headerRow["Total Cases"]].to_i
    yesterdayRecoveries = rows[totalRows - 1][headerRow["Resolved Cases"]].to_i
    yesterdayFatal= rows[totalRows - 1][headerRow["Deceased Cases"]].to_i

    if yesterday != today && yesterdayTotalCases != total && total >= yesterdayTotalCases
        
        activeCases = total - resolved - fatal
        newCases = total - yesterdayTotalCases
        newRecoveries = resolved - rows[totalRows - 1][headerRow["Resolved Cases"]].to_i
        newFatal = fatal - rows[totalRows - 1][headerRow["Deceased Cases"]].to_i
        activeCaseDifference = activeCases - rows[totalRows - 1][headerRow["Active Cases"]].to_i

        worksheet.insert_rows(totalRows + 1, [[today, total, newCases, "", resolved, newRecoveries, fatal, newFatal, activeCases, activeCaseDifference]])
        worksheet.save

    end



end

GetData()
