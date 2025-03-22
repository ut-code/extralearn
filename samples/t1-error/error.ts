try {
  throw new Error("error!");
} catch (err) {
  console.log("caught", err);
}
