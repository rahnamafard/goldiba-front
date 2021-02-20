var moment = require("jalali-moment");
moment.locale("fa", { useGregorianParser: true });

export default (context, inject) => {
  let jalaliDateTime = (datetime, format) => {
    let default_format = "D MMMM YYYYTHH:mm";
    let dateTime = moment(datetime).format(format ? format : default_format);
    let [date, time] = dateTime.split("T");
    return { date: date, time: time };
  };

  inject("jalaliDateTime", jalaliDateTime);
};
