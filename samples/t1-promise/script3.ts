const promise = fetch("https://not-exists.google.com");

promise.catch((err) => {
  console.log(err);
});
