export const FormatDate = (rawDate) => {
    const utcTimestamp = Date.parse(rawDate)
    const objectDate = new Date(utcTimestamp);
    let month = objectDate.getUTCMonth() + 1
    let day = objectDate.getUTCDate()
    const year = objectDate.getUTCFullYear()
    let hours = objectDate.getUTCHours()
    let mins = objectDate.getUTCMinutes()
    if (month < 10) {
        month = '0' + month.toString();
    }
    if (day < 10) {
        day = '0' + day.toString();
    }
    if (hours < 10) {
        hours = '0' + hours.toString();
    }
    if (mins < 10) {
        mins = '0' + mins.toString();
    }
    return (year + '-' + month + '-' + day + " " + hours + ":" + mins);
}