type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};
async function getTodos(titleLike: string): Promise<Todo[]> {
  const resp = await fetch("https://jsonplaceholder.typicode.com/todos");
  const todos: Todo[] = await resp.json();
  return todos.filter((todo) => todo.title.includes(titleLike));
}

console.log(await getTodos("fugiat"));

export {};

[
    userId: 3,
    id: 41,
    title: "aliquid amet impedit consequatur aspernatur placeat eaque fugiat suscipit",
    completed: false,
  }, {
    userId: 3,
    id: 47,
    title: "nam qui rerum fugiat accusamus",
    completed: false,
  }, {
    userId: 4,
    id: 65,
    title: "fugiat pariatur ratione ut asperiores necessitatibus magni",
    completed: false,
  }, {
    userId: 6,
    id: 118,
    title: "quia modi consequatur vero fugiat",
    completed: false,
  }, {
    userId: 9,
    id: 165,
    title: "fugiat perferendis sed aut quidem",
    completed: false,
  }, {
    userId: 9,
    id: 171,
    title: "fugiat aut voluptatibus corrupti deleniti velit iste odio",
    completed: true,
  }
]

