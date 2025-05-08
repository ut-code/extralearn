---
title: メタ情報を指定する
---

HTML の &lt;head&gt; 内に記述するメタタグや、ドメインのルートに設置する特殊なファイルによって、Google などでの検索結果の表示を改善したり、Slack・Discord や X 等にウェブサイトを共有した際の見た目を変えることができます。

## title

改めて説明する必要はないと思いますがページのタイトルです。
ブラウザーで表示した際のタイトルや、検索エンジンでの検索結果の表示に使われます。

```html title="index.html"
<title>ut.code();</title>
```

:::caution
* `<` などの記号をタイトルに含めたい場合は `&lt;` などのようにエスケープしましょう。
* ユーザーが入力したデータなどによってタイトルを動的に生成する場合は、適切にエスケープしないと XSS に利用されてしまいます。
    * 例: ユーザー名が `</title><script>alert("hello");</script>` の人がいたら
    ```html
    <title></title><script>alert("hello");</script> さんのユーザーページ</title>
    ```
* これ以降紹介する meta タグの content についても同様です。(ダブルクォーテーションの内側でもエスケープ方法は `\"` ではなく HTML のエスケープです)
:::

## description

ページの説明文を短く書くことで、検索エンジンでの検索結果の表示に使われ... る場合も使われない場合もあります。

Google では SEO 効果はないらしいです。(つまり、これを書くことにより表示順位が変わることはないということです)

```html title="index.html"
<meta name="description" content="東京大学のソフトウェアエンジニアリングコミュニティ ut.code(); の公式学習資料です。誰でも自由に利用可能です。">
```

![utcode-learnのdescription](./t2-meta/description.png)

## icon

:::caution
TODO: Bing で検索結果にアイコンが表示される条件がわからない。
:::

### favicon.ico

```html title="index.html"
<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
```

:::tip
* `rel="icon"` と書くこともあります。
* `type` は省略可能です。
* ファイル名は favicon.ico で、ドメインの直下に置きましょう。
それ以外のパスやファイル名を指定しても一見正しく表示されますが、
html 以外のパスをブラウザーで開いた場合 (例えば画像を新しいタブで開くなどの場合) にはメタタグが存在しないのでブラウザーは /favicon.ico を探しに行きます。
/favicon.ico にすることで常時確実に表示されるのでおすすめです。
* アイコンはかなり長い間ブラウザーや検索エンジンにキャッシュされます。アイコンを変更してすぐに反映させたい場合は、 `/favicon.ico?v=1` などのようにファイル名はそのままでもクエリパラメータを追加することで URL を変更するのが有効です。
:::

### png 形式の指定
