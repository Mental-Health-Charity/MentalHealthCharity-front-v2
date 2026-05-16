import { formatInTimeZone } from "date-fns-tz";
import { APP_TIME_ZONE, parseApiDate } from "./dateTime";

const formatDate = (date: string | Date, dateFormat: string = "dd/MM/yyyy HH:mm", timeZone: string = APP_TIME_ZONE) => {
    const parsedDate = parseApiDate(date);

    return formatInTimeZone(parsedDate, timeZone, dateFormat);
};

export default formatDate;
