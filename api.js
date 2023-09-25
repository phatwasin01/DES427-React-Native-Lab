let rootURL = "https://api.themoviedb.org/3/search/movie?api_key=";
let apikey = "5414cc54c271ef3fb52907ccf0959fe9";

export default function (title) {
  let url = `${rootURL}${apikey}&query=${title}`;
  return fetch(url)
    .then(function (response) {
      return response.text();
    })
    .then(function (text) {
      let json = JSON.parse(text);
      return json;
    });
}
