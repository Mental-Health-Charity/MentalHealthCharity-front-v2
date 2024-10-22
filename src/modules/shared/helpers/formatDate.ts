import { format } from "date-fns";

const formatDate = (date: string | Date, dateFormat: string = "dd/MM/yyyy") => {
  return format(new Date(date), dateFormat);
};

export default formatDate;
