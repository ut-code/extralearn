export function askName() {
  const name = prompt("what is your name?");
  if (name == null) console.error("name is not given");
  return name;
}
