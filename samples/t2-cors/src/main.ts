import { mount } from "svelte";
import App from "./App.svelte";

const root = document.getElementById("root");
if (!root) throw new Error("root element is not found");
const app = mount(App, {
  target: root,
});

export default app;
