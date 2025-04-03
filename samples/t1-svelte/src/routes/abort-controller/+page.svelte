<script lang="ts">
  type Todo = {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  };

  let length = $state<number | null>(null);
  let search = $state("");
  let debouncedSearch = $state("");

  $effect(() => {
    search;
    const id = setTimeout(() => {
      debouncedSearch = search;
    }, 500);
    return () => clearTimeout(id);
  });

  $effect(() => {
    const ctl = new AbortController();
    fetchTodos(debouncedSearch, { signal: ctl.signal }).then((todos) => {
      length = todos.length;
    });
    return () => ctl.abort();
  });

  async function fetchTodos(
    search: string,
    options?: { signal?: AbortSignal },
  ) {
    const resp = await fetch("https://jsonplaceholder.typicode.com/todos", {
      signal: options?.signal,
    });
    const todos: Todo[] = await resp.json();
    return todos.filter((todo) => todo.title.includes(search));
  }
</script>

<div>length: {length}</div>
<input bind:value={search} />
