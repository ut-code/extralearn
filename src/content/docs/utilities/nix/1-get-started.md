---
title: 1. Nix の目的と環境構築
---

## そもそも Nix とは？

Nix は、ソフトウェアのビルドと実行環境を宣言的に記述し、再現可能に提供するためのツールチェーンです。

## Nix で何ができる？

- Nixpkgs の大量のパッケージを再現可能に利用できる。
- 自作ソフトのビルド式を記述し、誰でも同じ方法でビルドできる。
- Flakes で依存をコミットハッシュにロックし、複数人・複数端末で同じ環境を共有できる。
- 開発用シェル (`devShell`)・ユーザー設定 (Home Manager)・OS 設定 (NixOS) を一貫した記述で管理できる。

## 環境構築

### 1. Nix のインストール

- 公式: https://nixos.org/download/
- Determinate Systems: https://github.com/DeterminateSystems/nix-installer

どちらも現在の Nix をインストールできます。Determinate 版はアンインストーラ付きで、`flakes`/`nix-command` をデフォルトで有効化します。

### 2. Nix CLI の設定 (必要な場合)

新 CLI と Flakes を使うために、未設定なら有効化します。
```sh
mkdir -p ~/.config/nix
echo 'experimental-features = nix-command flake' > ~/.config/nix/nix.conf
```

### 3. 確認

次のコマンドを実行し、 `Hello, Nix!` と表示されれば成功です。
```sh
nix run nixpkgs#hello -- --greeting 'Hello, Nix!'
```
