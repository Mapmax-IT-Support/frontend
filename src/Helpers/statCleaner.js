export const ageToPercentages = dataSet => {
    let percentages = JSON.parse(JSON.stringify(dataSet))
    let total = 0
    Object.entries(percentages).forEach(([key, value],i) => {
       if (key.toUpperCase().search('MEDIAN') <= -1 && key.toUpperCase().search('TOTAL') <= -1)
        total += value
    });
}
