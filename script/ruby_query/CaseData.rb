# This class contains attributes to hold:
#   - the date
#   - total cases
#   - total resolved cases
#   - total fatalities
#   - current active case count
#   - new tests completed
#   - total tests completed
#   - current hospitalizations
#   - current icu cases
#   - current icu + ventilated cases
class CaseData
    attr_reader :date, :total, :resolved, :fatal, :active, :newTests, :totalTests, :hospital, :icu, :icuVented
    def initialize(date, total, res, fatal, active, newTests, totalTests, hospital, icu, icuVented)
        @date = date
        @total = total
        @resolved = res
        @fatal = fatal
        @active = active
        @newTests = newTests
        @totalTests = totalTests
        @hospital = hospital
        @icu = icu
        @icuVented = icuVented
    end
end