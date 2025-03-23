async function main() {
  try {
    const res = await fetch("https://www.google.com");
    console.log("got status", res.status);
    const json = await res.json();
    console.log("got json", json);
  } catch (err) {
    console.log("got error", err);
  }
}
main();
