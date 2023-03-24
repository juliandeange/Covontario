#!/usr/bin/env ruby

require 'net/http'
# require 'rest_client'
require 'json'
require 'uri'

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

puts 'done'

