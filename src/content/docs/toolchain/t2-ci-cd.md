---
title: GitHub Actions による CI/CD の必要性と使い方
---

## CI/CD とは？
CI とは Continuous Integration の略で、CD とは Continuous Delivery または Continuous Deploy の略です。
それらを組み合わせることによって、ビルドやテスト、デプロイなどを自動化することができます。
例えば CI を使えば、push する度に自動で[リンター](/toolchain/t1-formatter-and-linter/)を走らせることができます。
CI がないと動作確認するときに毎回手動でローカルにクローンしないといけないのですが、CI を使えばその必要もないですね！
正確な定義については、[GitHub の記事](https://github.com/resources/articles/devops/ci-cd)を参照してください。
:::tip
`npm ci` の ci は、clean install の略です。Continuous Integration と混同されることが多いです。
:::

## GitHub Actions を例に使ってみよう
GitHub Actions などのツールを用いれば、CI/CD を導入することができます。ただ、2025年4月7日現在、プライベートリポジトリの GitHub Actions には利用上限があるので、リポジトリをパブリックにするか利用上限を確認するようにしてください。
今回は push する度に Biome を走らせてみようと思います。
ワークフローの書き方の詳細については、[公式ドキュメント](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions)に譲ります。

### 環境構築
```sh
mkdir baz
cd baz
bun init -y
git init
git add -A
git commit -m "init"
```
次に GitHub を開いて、リポジトリを作成しましょう。
```sh
git remote add origin your_repository_ssh # 実際の SSH の URL に置き換えてください
git branch -M main
git push -u origin main
```
これで、ローカルリポジトリとリモートリポジトリを紐づけられたはずです。

### ワークフローの定義
```sh
mkdir .github/workflows
touch .github/workflows/run_biome.yml
```

```yml
# .github/workflows/run_biome.yml
name: Biome Check

on: [push]

jobs:
  eslint-prettier-check:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Biome
        uses: biomejs/setup-biome@v2
        with:
          version: latest

      - name: Run Biome
        run: biome ci .
```
フォーマットしてから、コミットを作成しましょう。
```sh
bunx @biomejs/biome format . --write
git add -A
git commit -m "setup: ci"
git push -u origin main
```
GitHub を確認してください。Actions タブからステータスなどの情報を確認できるはずです。

### 「CI が通らない」例
このレポジトリに不適切なコードを含んだプルリクエストを出してみましょう。
```sh
git checkout -b hoge
```
index.ts を以下のように編集してみましょう。
```ts
// index.ts
const hoge = 10;
```
`hoge` という変数は定義されているにも関わらず、使われていません。
push しましょう。
```sh
git add -A
git commit -m "define unused variable"
git push -u origin hoge
```
GitHub を開いて、プルリクエストを作成しましょう。
Biome が実行されたら、Some checks were not successful と表示されるはずです。