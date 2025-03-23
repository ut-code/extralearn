fetch("https://www.google.com")
  .then((res) => {
    console.log("got status", res.status);
    return res.json();
  })
  .then((json) => {
    console.log("got json", json);
  })
  .catch((err) => {
    console.log("got error", err);
  });
