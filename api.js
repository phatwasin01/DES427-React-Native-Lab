var rootURL =
  "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=";
var api_key = "CNF6AT3UAE2VRCQU";

var rootURLWeekly =
  "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=";
export default function (code, isWeekly) {
  var url = `${isWeekly ? rootURLWeekly : rootURL}${code}&apikey=${api_key}`;
  return fetch(url)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      // console.log(text);
      let json = JSON.parse(text);
      // console.log(json);
      return json;
    });
}
