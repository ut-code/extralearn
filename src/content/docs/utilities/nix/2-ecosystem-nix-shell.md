---
title: 2. エコシステム概要と Nix Shell 基本
---

## Nix エコシステムの全体像

- Nix: 純粋関数型のビルドシステム兼パッケージマネージャ
- Nixpkgs: 全パッケージ定義集 (公式リポジトリ)
  - NixOS: OS 設定を Nix で宣言的に管理する Linux ディストロ。 Nixpkgs に含まれる
- Home Manager: ユーザー環境の宣言的管理

### 用語説明
- Nix Store: `/nix/store` 下の内容アドレス可能なビルド成果物置き場。
- Channels: 旧来のパッケージ参照方式。
- Flakes: 入力をロックして再現性を高める新方式。

## Nix Shell

一時シェルを作ります。

```sh
nix-shell -p cowsay lolcat
```

`lolcat` と `cowsay` が利用できるシェルが作成され、そのシェルに入ります。

```sh
which cowsay
# -> /nix/store/ixskg19qvf8gfwbdlajc4498c1km1jyf-cowsay-3.8.4/bin/cowsay
which lolcat
# -> /nix/store/9qirzkmk1vlj7klw0mjwjkaxpqgh8jdy-lolcat-100.0.1/bin/lolcat
```

ポイント:

- プログラムはダウンロードされるが、グローバルには汚さない。
- `/nix/store` にハッシュ付きパスとして配置される (Nix Store)。

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

## キャッシュとクリーンアップ

Nix Store にキャッシュが残るため、同じパッケージは再ダウンロードされません。

キャッシュのクリーンアップは次のいずれかでできます。

```sh
nix store gc
nix-collect-garbage
```
