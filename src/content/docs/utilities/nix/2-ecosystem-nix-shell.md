---
title: 2. エコシステムの全体像と Nix Shell
---

## Nix エコシステムの全体像

多分分かるので、そのうち書く。

## Nix Shell

Nix CLI を使い、Nix Shell を作成してみましょう。

```sh
nix-shell -p lolcat cowsay
```

`lolcat` と `cowsay` が利用できるシェルが作成され、そのシェルに入ります。

```sh
which cowsay
# -> /nix/store/ixskg19qvf8gfwbdlajc4498c1km1jyf-cowsay-3.8.4/bin/cowsay
which lolcat
# -> /nix/store/9qirzkmk1vlj7klw0mjwjkaxpqgh8jdy-lolcat-100.0.1/bin/lolcat
```

ここで大事なのは、

- 実行可能ファイルのダウンロードはされている
- グローバルの環境にインストールされているわけではない
- `/nix/store` の中にパッケージのそのバージョン専用のディレクトリが作成されている
  - `/nix/store` のことを `Nix Store` と呼ぶことがあります

`lolcat` と `cowsay` を使ってみましょう。

```sh
ls | cowsay
ls | lolcat
```

終わったら、Nix シェルを退出します。

```sh
exit

which lolcat
# -> which: no lolcat in (path)
which cowsay
# -> which: no cowsay in (path)
```

## パッケージキャッシュ

Nix Store にパッケージのキャッシュが残っているので、次同じパッケージを使って `nix-shell` をすると、ダウンロードが発生しないのが確認できます。

このキャッシュを消去するには、

```sh
nix-collect-garbage
```

を実行します。
