#!/usr/bin/env ruby

require 'net/http'

# name = ARGV[0]
# puts "Hello #{name}!"

uri = URI('https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=455fd63b-603d-4608-8216-7d8647f43350&fields=Outcome1&limit=100')
data = Net::HTTP.get(uri) # => String


