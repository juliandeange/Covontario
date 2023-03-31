# This class contains attributes to hold:
#   - total cases
#   - total resolved cases
#   - total fatalities
#   - current active case count
class CaseData
    attr_reader :total, :resolved, :fatal, :active
    def initialize(total, res, fatal, active)
        @total = total
        @resolved = res
        @fatal = fatal
        @active = active
    end
end