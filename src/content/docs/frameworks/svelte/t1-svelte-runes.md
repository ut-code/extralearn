---
title: Svelte のルーン (Runes)
---

ここでは、ut.code(); Learn のプロジェクトである[ストップウォッチ](https://learn.utcode.net/docs/trial-session/project/)を Svelte で実装することを考えます。

## Step 0: 環境構築

CLI ツール `sv` を使って、環境構築していきます。
ここでは、パッケージマネージャーとして bun を用いますが、npm でも問題ありません。

```sh
bunx sv create
```

今回は、

- テンプレート: SvelteKit minimal
- 型チェック: TypeScript
- アドオン: None

を選択します。

```sh
bun install
bun dev
```

これで <http://localhost:5173> を開いて "Welcome to SvelteKit" と表示されれば成功です。

このリポジトリのサンプルでは、 [Pico CSS](https://picocss.com/) でスタイルを当てています。

## 1. `$state` ルーン - 簡単なストップウォッチ

まずは、ページを開いたと同時に時間が経過していく、簡単なストップウォッチを作ってみましょう。`src/routes/+page.svelte` を編集していきます。

`$state` ルーンは、 Svelte で**リアクティブな**状態を宣言できるルーンです。
リアクティブとは、値を変更するとその変更が UI に反映されることをいいます。

**もちろん**、参照が変わらなくても内部状態が変われば反映されます。

```svelte
<script lang="ts">
  let timer = $state(0);
  setInterval(() => {
    timer += 1;
  }, 1000);
</script>

<span>
  time: {timer}
</span>
```

## 2. `$derived` ルーン - 分と時間の表示

**1.** で作ったタイマーに、分と時間を表示してみましょう。

`$derived` ルーンを使うと、リアクティブな変数に依存する変数を作成することができます。

マークアップ部分では、 `$derived` ルーンを使わなくても自動でリアクティブになります。

```svelte {7..9} {17}
<script lang="ts">
  let timer = $state(0);
  setInterval(() => {
    timer += 1;
  }, 100); // 本来は 1000 にするべきだが、長過ぎるため 1/10 にしている

  const seconds = $derived(timer % 60);
  const minutes = $derived(Math.floor((timer / 60) % 60));
  const hours = $derived(Math.floor(minutes / 60));

  function show(n: number) {
    return n.toString().padStart(2, "0");
  }
</script>

<span>
  {show(hours)}:{show(minutes)}:{show(seconds)}
</span>
```

## 3. `$effect` ルーン - スタート/ストップボタンの実装

次に、 Start / Stop ボタンを作ってみましょう。

`$effect` ルーンは、コールバックで使用したリアクティブな変数を自動でトラックし、その変数が変更されるたびにコールバックを呼び出すルーンです。

`$effect` ルーンを使って、タイマーが ON のときのみ `setInterval` を動かしてみましょう。

`$effect` のコールバックの返り値はクリーンアップ関数といい、コールバックが再実行される直前やコンポネントがアンマウントされたときに実行されます。

```svelte title="src/routes/+page.svelte"
<script lang="ts">
  let timer = $state(0);
  let enabled = $state(false);
  $effect(() => {
    if (enabled) {
      const timerId = setInterval(() => {
        timer += 1;
      }, 1000);
      return () => clearTimeout(timerId);
    }
  });
</script>

<div>
  timer: {timer}
</div>
<button onclick={() => (enabled = true)} disabled={enabled}> Start </button>
<button onclick={() => (enabled = false)} disabled={!enabled}> Stop </button>
```

:::caution
`$effect` ルーンは非同期にアクセスされた変数をトラックすることができません。どうしてもトラックさせたい場合は、コールバックの最初に `variable;` のように書いて値にアクセスしてあげましょう。
:::

:::caution
`$effect` の中でリアクティブな状態に代入すると「状態が更新される→ `$effect` が発火する→状態が更新される」という無限ループになることがあります。
:::

## AbortController

入力された値に対して、JSON Placeholder の todos から検索するアプリケーションを考えてみましょう。

```svelte
<script lang="ts">
  type Todo = {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  };

  let length = $state<number | null>(null);
  let search = $state("");

  $effect(() => {
    fetchTodos(search).then((todos) => {
      length = todos.length;
    });
  });

  async function fetchTodos(search: string) {
    const resp = await fetch("https://jsonplaceholder.typicode.com/todos");
    const todos: Todo[] = await resp.json();
    return todos.filter((todo) => todo.title.includes(search));
  }
</script>

<div>found results: {length}</div>
<input bind:value={search} />
```

何が問題でしょうか？

リクエストの解決にかかる時間にはばらつきがあるため、最後にリクエストを発行したものがそれ以前に発行したリクエストよりも早く終わってしまうことがあります。

そのため、前に入力した状態のレスポンスが最終的に残ってしまう可能性があります。

これを解決するため、`search` を更新したときにリクエストをキャンセルしましょう。

`AbortController` という組み込みオブジェクトを使います。

```svelte {13,18,26}
<script lang="ts">
  type Todo = {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  };

  let length = $state<number | null>(null);
  let search = $state("");

  $effect(() => {
    const ctl = new AbortController();
    fetchTodos(search, { signal: ctl.signal })
      .then((todos) => {
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

<div>found results: {length}</div>
<input bind:value={search} />
```

:::tip

普通はこれに加え、リクエストのスパムを避けるため「デバウンス」という連続した値の変化を無視する処理を行います。

Svelte におけるデバウンス処理の例:

```svelte
<script lang="ts">
  let input = $state("");
  let debounced = $state("");

  $effect(() => {
    input; // input が変わるたび effect を実行させる
    const id = setTimeout(() => {
      debounced = input;
    }, 500);
    return () => clearTimeout(id);
  })
</script>

<span>debounced value: {debounced}</span>
<input bind:value={input} />
```

また、デバウンスや状態の永続化などのよくある処理をまとめて実装した [Runed](https://runed.dev/docs) のようなライブラリもあります。
:::
