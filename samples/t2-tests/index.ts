export function operate(operator: "add", operand: number[]) {
  switch (operator) {
    case "add":
      return operand.reduce((a, b) => a + b, 0);
    default:
      return operator satisfies never;
  }
}
