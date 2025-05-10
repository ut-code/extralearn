---
title: 1. Nix の目的と環境構築
---

## そもそも Nix とは？

Nix は、一言でいうと、**ソフトウェアのパッケージ方法を定義する可搬な記述式**です。

## Nix で何ができる？

Nix (+ flakes) を使うと、以下のようなことの組み合わせが簡単に達成できます。

(定義部分)

- [nixpkgs](https://search.nixos.org) で定義されている大量のパッケージを利用する
- ソフトウェアのビルド式を定義し、**誰でもビルドできる**ようにする
  - 依存関係の明示化も Nix に強制されるので、必要な依存が見つからない！が起こり得ない
- 任意の GitHub リポジトリの任意の ref を、 Flake が定義されている限り **手動でクローンせずに** 実行する。
- 上のすべてを、**コミットハッシュ単位で**バージョンを固定して行う
  - かつ、 1 コマンドでアップデート可能

(利用部分)

↑で定義したすべてのソフトウェアを使って、

- 開発用シェルの定義を記述し、開発者の間で共有する (`shell.nix`, `devShell`)
- ユーザースペースの定義、その方法の共有 (Home Manager, modules)
  - ファイル (`.bashrc`など) や、ソフトウェアのインストールなど
- OS の設定の一元的管理 (NixOS)
  - ソフトウェアのインストールなど

## 環境構築

### 1. Nix のインストール

公式のインストーラー <https://nixos.org/download/>

または、 Determinate Systems のインストーラー <https://github.com/DeterminateSystems/nix-installer>
を利用してください。

Determinate Systems のインストーラーは、デフォルトで後述 (2.) の設定が ON になっていたり、アンインストーラーが付属したりしています。

チャンネル (後述) を聞かれた場合は、 `nixpkgs-unstable` を選択してください。

### 2. Nix CLI の設定 (公式のインストーラー利用時)

次のコマンドを実行 (するか、同等のことを) してください。
```sh
mkdir -p ~/.config/nix
echo 'experimental-features = nix-command flake' > ~/.config/nix/nix.conf
```

### 3. 確認

次のコマンドを実行して、 `Hello, Nix!` と表示されたら成功です。
```sh
nix run nixpkgs#hello -- --greeting 'Hello, Nix!'
```

