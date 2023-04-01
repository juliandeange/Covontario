# This class contains attributes to hold:
#   - total cases
#   - total resolved cases
#   - total fatalities
#   - current active case count
class CaseData
    attr_reader :date, :total, :resolved, :fatal, :active
    def initialize(date, total, res, fatal, active)
        @date = date
        @total = total
        @resolved = res
        @fatal = fatal
        @active = active
    end
end