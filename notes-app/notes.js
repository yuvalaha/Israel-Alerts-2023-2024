const chalk = require('chalk');
const fs = require('fs');
const plot = require('nodeplotlib');


// The function open the alerts.js file convert the information into array and return it
const loadNotes = () => {
    try{
        const dataBuffer = fs.readFileSync('alerts.json');
        const dataJson = dataBuffer.toString();
        return JSON.parse(dataJson); 
    }
    catch(error) {
        return [];
    }
}
const readNote = (city) => {

    const notes = loadNotes();
    let currentWar = 0, index, year;

    // Filter to get all notes where the 'cities' field matches the input
    const matchingNotes = notes.filter((note) => note.cities === city);

    let alertByMonth = initializeAlertsArray();

    if (matchingNotes.length === 0) {
        console.log(chalk.red("There is no alert with the given city."));
    } else {
        console.log(chalk.bgCyan(`Alerts for the City: ${city}`));
        matchingNotes.forEach((note) => {
            
            year = note.time.slice(0, 4);
            if (year >= 2023) {
                console.log(`Time: ${note.time}`);
                console.log(`Description: ${note.description}`);
                console.log(`Origin: ${note.origin}`);
                console.log('-------------------'); 
                index = note.time.slice(0, 7);
                alertByMonth[index] += 1;
                currentWar += 1;
                };
            }
            
            );
            console.log(`Total alerts since the war begin in ${city}: ${currentWar}`);
            alertsPlot(alertByMonth, city, currentWar);
    }
};

function initializeAlertsArray(){


    const months = [];
    const startYear = 2023;
    const startMonth = 10;
    const endYear = 2024;
    const endMonth = 10;

    // Loop through the months from October 2023 to October 2024
    for (let year = startYear; year <= endYear; year++) {
    for (let month = 1; month <= 12; month++) {
        // Skip months before October in the first year
        if (year === startYear && month < startMonth) continue;
        // Stop when reaching October in the last year
        if (year === endYear && month > endMonth) break;
        
        const monthKey = `${year}-${String(month).padStart(2, '0')}`;
        months[monthKey] = 0;
    }
    }

    return months;
}

const alertsPlot = (alertByMonth, city, currentWar) => {
    const month = Object.keys(alertByMonth);
    const alerts = Object.values(alertByMonth);
    const plotData = [{
        x: month,
        y: alerts,
        type: 'scatter',
    },
];
const layout = {
    title: {
        text: `${city}`,
        font: {
            size: 30,        
        }, 
    },    
    xaxis: {
        title: 'Month',
        range: ['2023-09', '2024-11'],                      
    },
    yaxis: {
        title: 'Alerts'                      
    },
    width: 1200, 
    height: 700,
    annotations: [{
        xref: 'paper',    // Reference relative to the plot area
        yref: 'paper',    // Reference relative to the plot area
        x: 0.75,           // 0.5 is the center on the x-axis
        y: 0.5,           // 0.5 is the center on the y-axis
        text: `Total Alerts: ${currentWar}`,  // The text to display
        showarrow: false,       // No arrow
        font: {
            size: 20,          // Font size for the text
            color: 'red'       // Font color
        }
    }]
};

plot.plot(plotData, layout);
}


// Export the addNote function so it can be used in other file
module.exports = {
    readNote: readNote,
    loadNotes: loadNotes,
}