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
