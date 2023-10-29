export class DateParser{
    static monthsMap = {
        'jan': 0,
        'feb': 1,
        'mar': 2,
        'apr': 3,
        'may': 4,
        'jun': 5,
        'jul': 6,
        'aug': 7,
        'sep': 8,
        'oct': 9,
        'nov': 10,
        'dec': 11
    };
    static ESNMonthMap = {
        "January": 0,
        "February": 1,
        "March": 2,
        "April": 3,
        "May": 4,
        "June": 5,
        "July": 6,
        "August": 7,
        "September": 8,
        "October": 9,
        "November": 10,
        "December": 11
    };
    

    static parseEventDate(inputDate, provider) {
        const monthMap = {
          Jan: 0,
          Feb: 1,
          Mar: 2,
          Apr: 3,
          May: 4,
          Jun: 5,
          Jul: 6,
          Aug: 7,
          Sep: 8,
          Oct: 9,
          Nov: 10,
          Dec: 11,
        };
    
    
        const parts = inputDate.split(' ');
    
        if (
          parts.includes('Multiple') &&
          parts.includes('dates') &&
          parts.includes('times')
        ) {
          return null;
        }
    
        if (provider === 'MAD PRG') {
          const day = parseInt(parts[2], 10);
          const month = monthMap[parts[1]];
          const year = new Date().getFullYear();
          const isNextYear = month < new Date().getMonth();
    
          if (isNextYear) {
            year++;
          }
          return new Date(year, month, day);
        } else if (provider == "Duplex"){
          const monthMap = {
            JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUN: 6,
            JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12
          };
          
          const [monthAbbreviation, day] = parts.map(part => part.toUpperCase());
          const currentYear = new Date().getFullYear();
          const currentDate = new Date();
          
          let eventDate = new Date(currentYear, monthMap[monthAbbreviation] - 1, parseInt(day, 10));
          if (currentDate > eventDate + 1) {
            // If the date has passed, set it for the next year
            eventDate = new Date(currentYear + 1, monthMap[monthAbbreviation] - 1, parseInt(day, 10));
          }
          
          return eventDate;
        }else{
          const day = parseInt(parts[1], 10);
          const month = monthMap[parts[2]];
          const isNextYear = month < new Date().getMonth();
          const currentYear = new Date().getFullYear();
          const year = isNextYear ? currentYear + 1 : currentYear;
          return new Date(year, month, day);
    
    
        }
    }
}