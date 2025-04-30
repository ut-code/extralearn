// @ts-check
const src = new EventSource("http://localhost:3000/sse");

src.addEventListener("ping", (ev) => {
  console.log(ev.data)
  document.body.textContent += `${ev.data} `
})
