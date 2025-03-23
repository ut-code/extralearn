const promise = fetch("http://www.google.com");

promise.then((resp) => {
  console.log(resp);
});
