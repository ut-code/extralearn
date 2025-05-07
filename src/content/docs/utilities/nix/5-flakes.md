---
title: 5. Nix Channel と Flake
---

# Nix のバージョン固定方法

Nix には、バージョン解決のシステムが *Nix Channel* (古い) と *Nix Flake* (新しい) の２つあります。

## Nix Channel

Nix Channel は、コンピュータごとに管理される、バージョン解決システムです。

```sh
nix-channel --list
# -> nixpkgs https://nixos.org/channels/nixpkgs-unstable
```

Nix をインストールしたときは、デフォルトで Nix Channel を使っているはずです (要検証)。

Nix Channel には `nixpkgs-unstable`, `nixos-unstable`, `nixos-24.11` などと名前がおり、それぞれが Nixpkgs のリポジトリの特定の条件を満たした (特定の CI が通るなど) コミットのうち最新のものを指しています。

### Nix Channel のアップデート

チャンネルの保存するコミットは明示的に更新しない限りアップデートされません。

最新のものにアップデートするには、次のコマンドを実行してください。

```sh
nix-channel --update
```

(TODO: チャンネルはどう使われる？推測するに、 NIX_PATH の解決時に使われるただのキャッシュなのではないか。)

## Nix Flake

Nix Flake は、新しい Nix のバージョン管理の方法です。

リポジトリに `flake.nix` という Flake の定義ファイルと、 `flake.lock` というバージョン固定ファイルを置いてバージョンを管理します。
### Flake を使ってみる

(todo: flake.nix でシェルを定義して、`.envrc` も書く)

### Flake のバージョンアップ

(todo: 適当なこと書く)

```sh
nix flake update
```

### Nix Flake のメリット・デメリット

Flake は、ユーザーごとのバージョン解決方法ではなくロックファイルからバージョンを解決するので、以下のようなメリット・デメリットがあります。

メリット

- 複数人や複数のマシンで使うとき、正確な依存関係を共有できる
- そのディレクトリで明示的に更新しないと更新されないため、バージョンアップ時の動作確認が容易

デメリット

- ロックファイルで指定されたバージョンをそれぞれインストールする、ディスクの容量を食う
- 定期的にロックファイルをアップデートしないとパッケージが古くなってしまう
