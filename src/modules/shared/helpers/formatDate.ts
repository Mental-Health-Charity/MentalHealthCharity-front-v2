import { formatInTimeZone } from "date-fns-tz";

const formatDate = (
    date: string | Date,
    dateFormat: string = "dd/MM/yyyy HH:mm",
    timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone
) => {
    const parsedDate = new Date(date);

    // TODO: fix when backend will return correct date
    parsedDate.setHours(parsedDate.getHours() + 2);

    return formatInTimeZone(parsedDate, timeZone, dateFormat);
};

export default formatDate;
