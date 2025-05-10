---
title: 6. Home Manager を使う
---

参照: [Home Manager Manual](https://nix-community.github.io/home-manager/)

todo: 誰か動作確認して

## Home Manager をセットアップする

```sh
nix run home-manager/master -- init --switch
```

`~/.config/home-manager` に Home Manager のモジュールが生成されます。``

## パッケージをインストールする

`~/.config/home-manager/home.nix` に、以下の行を追加してください。

```nix
{
  # ...
  pkgs, # すでにない場合は、これを追加
  ...
}: {
  # ...
  home.packages = [
    pkgs.bun
  ];
  # ...
}
```

```sh
home-manager switch
```

Home Manager がビルドを実行したあと、Nix 経由で Bun がインストールされます。

```sh
which bun
# -> /nix/store/wkwajx0s3yhbfw6hsgpjcg9d8nvqdk66-bun-1.2.11/bin/bun
```

## モジュールを分割する

Home Manager の設定ファイルが成長してくると、 `home.nix` だけでは大きくなりすぎてしまいます。

複数ファイルに分割してみましょう。

```nix title="home.nix"
{
  # ...
}: {
  imports = [
    ./sub.nix
  ];
  # ...
}
```

```nix title="sub.nix"
{
  pkgs,
  ...
}: {
  home.packages = [
    pkgs.bun
  ];
}
```

`imports` にインポートしたいモジュールを指定すると、モジュールがインポートされます。``

## カスタムモジュールを定義する

HELP NEEDED: どうやってやるのこれ
