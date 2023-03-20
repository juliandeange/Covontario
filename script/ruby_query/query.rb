#!/usr/bin/env ruby

require 'net/http'
# require 'rest_client'
require 'json'
require 'uri'

url = 'https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=455fd63b-603d-4608-8216-7d8647f43350&fields=Outcome1&limit=100'
uri = URI(url)
response = Net::HTTP.get(uri)
json = JSON.parse(response)

data = json['result']['records']

puts data


