---
title: 6. Home Manager を使う
---

参照: [Home Manager Manual](https://nix-community.github.io/home-manager/)

## セットアップ (単独利用)

リリースブランチを指定して初期化します (例: 24.11)。
```sh
nix run home-manager/release-24.11 -- init --switch
```

`~/.config/home-manager` に設定が生成されます。

## パッケージをインストールする

`~/.config/home-manager/home.nix` に追加します。

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

反映:
```sh
home-manager switch
```

Home Manager のビルド後、Nix 経由で Bun が利用可能になります。

```sh
which bun
# -> /nix/store/wkwajx0s3yhbfw6hsgpjcg9d8nvqdk66-bun-1.2.11/bin/bun
```

## モジュールを分割する

設定が大きくなったらファイルを分割して `imports` します。

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

`imports` にインポートしたいモジュールを列挙します。

フレーク管理に移行する場合は、`~/.config/home-manager/flake.nix` を作成し、`homeConfigurations.${username}` を定義して `home-manager switch` を実行します。
