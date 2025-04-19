---
title: ReactのuseEffectについて
---

## 副作用(Side Effects)とは？
React のコンポーネントは、基本的に「入力(props, state)→ 出力(UI)」という流れで動作します。
しかし、コンポーネントのレンダリングとは直接関係のない処理(例: データの取得、購読の登録、DOM の操作など)が必要な場合があります。
これらの処理は「副作用(Side Effects)」と呼ばれます。そういった副作用を適切に管理するために、React では useEffect フックが用意されています。

## useEffectの使い方
実際にコードを書いて、useEffect の使い方を学んでいきましょう。
ここでは、ut.code(); Learn のプロジェクトである[ストップウォッチ](https://learn.utcode.net/docs/trial-session/project/)を React で実装することを考えます。

### Step 0: 環境構築
vite を使って、環境構築していきます。
ここでは、パッケージマネージャーとして bun を用いますが、npm でも問題ありません。
```sh
bun create vite@latest
```
プロジェクトの名前を foo にしたと仮定して、話を進めます。
```sh
cd foo
bun install
bun dev
```
これで http://localhost:5173 を開いて vite のデフォルトのページが表示されれば、環境構築は完了です。

### Step 1: 副作用の宣言
まずは、ページを開いたと同時に時間が経過していく、簡単なストップウォッチを作ってみましょう。src/App.tsx を編集していきます。
useEffect の第一引数には、副作用として実行したい関数を与えます。この場合、その関数はコンポーネントがレンダリングされた**後に**実行されます。
何秒たったかページに表示させるために、time という状態を定義します。
副作用として、1000ミリ秒ごとに time を 1 だけ増やすような関数を実行します。
setInterval 関数を使えば、n ミリ秒ごとにコールバック関数を実行できるというのは、ut.code(); Learn でも出てきましたね。
```js
// App.tsx
import { useEffect, useState } from "react";

export default function App() {
  const [time, setTime] = useState(0);
  useEffect(() => {
    setInterval(() => setTime(time + 1), 1000)
  })
  return <div>time: {time}</div>
}
```

ここで何が起きているか、確認しましょう。
1. ページが読み込まれ、time = 0 で コンポーネントがレンダリングされる。
2. useEffect 内の setInterval 関数が実行され、1000 ミリ秒後にtime が time + 1 に set される。
3. 状態が更新されたので、再度コンポーネントがレンダリングされる。
4. 繰り返し

### Step 2: クリーンアップ関数
Step 1 で作ったストップウォッチには一つ致命的な問題があります。それは、少し時間を経過させると分かります。
そう、加速するのです！！
これはどうしてでしょうか？
[ut.code(); Learn](https://learn.utcode.net/docs/advanced/react/) で説明されているように、React では状態が更新される度にレンダリングされるので、time が更新される度にタイマーが作られるのですね！これがストップウォッチが加速する理由になります。
ではどうやってこの問題を解決すればよいでしょうか？
コンポーネントがDOMから削除された（アンマウントされた）ときに、タイマーを削除すればいいですね。
useEffect では、コールバック関数の返り値として関数（クリーンアップ関数といいます）を指定することで、コンポーネントがアンマウントされたときや useEffect が再実行される直前にクリーンアップ関数が実行されます。
clearInterval を使ってタイマーを削除します。
```js {7..8}
// App.tsx
import { useEffect, useState } from "react";

export default function App() {
	const [time, setTime] = useState(0);
	useEffect(() => {
		const timerID = setInterval(() => setTime(time + 1), 1000);
		return () => clearInterval(timerID);
	});
	return <div>time: {time}</div>;
}

```

ここでも何が起きているのか確認しましょう。
1. ページが読み込まれ、time = 0 で コンポーネントがレンダリングされる。
2. useEffect 内の setInterval 関数が実行され、1000 ミリ秒後にtime が time + 1 = 1 に set される。
3. クリーンアップ関数が実行される。
4. 状態が更新されたので、再度コンポーネントがレンダリングされる。
5. 繰り返し

### Step 3: 依存配列
先ほど useEffect の第二引数には何も与えませんでしたが、配列を指定することもできます。その配列の要素の値に変化があったとき useEffect が発火します。
この場合は time が更新されたときのみ発火してほしいので、以下のようにすればいいですね。
```js "[time]"
// App.tsx
import { useEffect, useState } from "react";

export default function App() {
	const [time, setTime] = useState(0);

	useEffect(() => {
		const timerID = setInterval(() => setTime(time + 1), 1000);
		return () => clearInterval(timerID);
	}, [time]);

	return <div>time: {time}</div>;
}
```

:::tip
空の配列を渡せば、初回レンダリング時のみ発火させることができます。
:::

### Step 4: スタートボタンの実装
次に、スタートボタンを実装してみましょう。このままだと、ページが読み込まれたときに常にタイマーが作動してしまいます。
そこで、running という状態を定義して、running が true のときだけ、タイマーが作動するようにしましょう。useEffect の依存配列に running を追加するのを忘れると、スタートボタンを押して、running が true になっても useEffect が発火しません。
```js 
// App.tsx
import { useEffect, useState } from "react";

export default function App() {
	const [time, setTime] = useState(0);
	const [running, setRunning] = useState(false);
	useEffect(() => {
		if (running) {
			const timerID = setInterval(() => setTime(time + 1), 1000);
			return () => clearInterval(timerID);
		}
	}, [time, running]);
	return (
		<>
			<button onClick={() => setRunning(true)}>Start</button>
			<div>time: {time}</div>
		</>
	);
}
```

### Step 5: ストップボタンの実装
ストップボタンの実装について考えてみましょう。onClick 属性としてタイマーを削除するような関数を与えればよいのですが、今のままの実装だと timerID を button があるスコープから参照できないので、timerID という状態を定義しましょう。
```js
// App.tsx
import { useEffect, useState } from "react";

export default function App() {
	const [time, setTime] = useState(0);
	const [running, setRunning] = useState(false);
	const [timerID, setTimerID] = useState(0);
	useEffect(() => {
		if (running) {
			setTimerID(setInterval(() => setTime(time + 1), 1000));
			return () => clearInterval(timerID);
		}
	}, [time, running]);
	return (
		<>
			<button onClick={() => setRunning(true)}>Start</button>
			<button
				onClick={() => {
					setRunning(false);
					clearInterval(timerID);
				}}
			>
				Stop
			</button>
			<div>time: {time}</div>
		</>
	);
}

```
:::caution 
useEffect の中で useState を呼ぶと「状態が更新される→レンダリング→useEffect が発火する。→状態が更新される」という無限ループになることがあります。
値が更新されてもレンダリングされてほしくないときは、useState の代わりに useRef を使うとよいです。
:::

## 別の副作用の例
今度は、外部データを取得する方法について考えてみましょう。[async / await とプロミスオブジェクト](https://extra.utcode.net/js-ts/t1-promise/#%E6%BC%94%E7%BF%92)の演習でやったように JSONPlaceholder を使用します。
```js
import { useEffect, useState } from "react";

export default function App() {
	const [title, setTitle] = useState("");
	useEffect(() => {
		const fetchData = async () => {
			fetch("https://jsonplaceholder.typicode.com/todos/1")
				.then((response) => response.json())
				.then((json) => setTitle(json.title));
      console.log("json requested.");
		};
		fetchData();
	}, []);
	return <div>title: {title}</div>;
}

```

:::caution
useEffect フックは、同期的に実行される副作用を処理するために設計されています。非同期関数を直接 useEffect のコールバック内で使うと、useEffect の本来の挙動（同期的に処理を完了させること）を破ってしまう可能性があるため、async 関数を直接渡すことはできません。
:::

開発者ツールでコンソールを見てみましょう。開発者ツールについては、[ut.code(); Learn](https://learn.utcode.net/docs/browser-apps/inspector/)で説明があり、タブを切り替えることでコンソールを見ることができます。
同じ JSON が二回コンソールに出力されているのが分かりましたでしょうか？useEffect は二回実行されているのです！
React では、副作用は何回実行しても結果が変わらないという性質（べき等）であるべき思想があり、useEffect を動作確認のために二回実行しています。

### AbortController
では、二回目のリクエストをキャンセルする方法について学びましょう。
[公式チュートリアル](https://react.dev/learn/synchronizing-with-effects#fetching-data)では、二回目に fetch したデータを無視する簡単なロジックを実装していますが、ここでは [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) を使う方法を以下に示します。

```js {6, 9, 16}
import { useEffect, useState } from "react";

export default function App() {
	const [title, setTitle] = useState("");
	useEffect(() => {
		const controller = new AbortController();
		const fetchData = async () => {
			const response = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
				signal: controller.signal
			});
			const json = await response.json();
			setTitle(json.title);
			console.log("json requested");
		};
		fetchData();
		return () => controller.abort();
	}, []);
	return <div>title: {title}</div>;
}

```

このようにすることで、開発環境では二回リクエストが送られますが、本番環境では一度だけ送られるようになります。