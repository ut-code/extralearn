---
title: GitHub Actions による CI/CD の必要性と使い方
---

## CI/CD とは？
CI とは Continuous Integration の略で、CD とは Continuous Delivery または Continuous Deploy の略です。
それらを組み合わせることによって、ビルドやテスト、デプロイなどを自動化することができます。
例えば CI を使えば、push する度に自動で[リンター](https://extra.utcode.net/toolchain/t1-formatter-and-linter/)を走らせることができます。
正確な定義については、[GitHub の記事](https://github.com/resources/articles/devops/ci-cd)を参照してください。
:::tip
`npm ci` の ci は、clean install の略です。Continuous Integration と混同されることが多いです。
:::

## GitHub Actions を例に使ってみよう
GitHub Actions などのツールを用いれば、CI/CD を導入することができます。ただ、2025年4月7日現在、プライベートリポジトリの GitHub Actions には利用上限があるので、リポジトリをパブリックにするか利用上限を確認するようにしてください。
今回は push する度に Biome を走らせてみようと思います。
ワークフローの書き方の詳細については、[公式ドキュメント](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions)に譲ります。また、サポートされているリンターやフォーマッターについては、[公式ドキュメント](https://github.com/marketplace/actions/lint-action#supported-tools)を参照してください。

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
git remote add origin your_repository_ssh # 実際の SSH に置き換えてください
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
GitHub を確認してください。Actions タブから Action のステータスなどの情報を確認できるはずです。
