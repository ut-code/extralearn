---
title: 5. Nix Channel と Flake
---

# Nix のバージョン固定方法

Nix には、バージョン固定システムが *Nix Channel* (古い) と *Nix Flake* (新しい) の２つあります。

## Nix Channel

Nix Channel は、コンピュータごとに管理される、バージョン固定システムです。

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

Nix Flake は、新しい Nix のバージョン管理の方法です。Git に依存します。

リポジトリに `flake.nix` という Flake の定義ファイルと、 `flake.lock` というバージョン固定ファイルを置いてバージョンを管理します。
### Flake を使ってみる

まずは、 Flake を作成します。

```sh
nix flake init
```

すると、次のような `flake.nix` と `flake.lock` が生成されます。 `flake.lock` の方は手動で編集することはありません。

```nix
{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }: {

    packages.x86_64-linux.hello = nixpkgs.legacyPackages.x86_64-linux.hello;

    packages.x86_64-linux.default = self.packages.x86_64-linux.hello;

  };
}
```

description は人間向けの Flake の説明です。

`inputs` は、Flake の「入力」を表します。Flake の時間依存性を示し、Flake はこれを特定の瞬間に固定することでバージョンを固定します。

`outputs` が Flake のメイン部分です。引数には上で定義した `inputs` と自分自身を表す `self` を合体した Attrset が渡され、返り値は自由な Attrset です。

`outputs` の返り値のキーは自由に指定でき、例えば `packages.${system}` を指定すると `nix run` コマンドで直接実行できるようになり、 `checks.${system}` を指定すると `nix check` でテストを実行できます ([参考](https://zenn.dev/ttak0422/articles/4ee6b3750a7b70))。

今回は、前の章で書いた `shell.nix` を Flake に変換してみましょう。

生成された `flake.nix` を以下のように書き換えます。

```nix

{
  description = "A very basic flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    devShells.${system}.default = pkgs.mkShell {
      packages = [pkgs.hello pkgs.cowsay pkgs.lolcat];
    };
  };
}
```

(todo: git add することを書く)
(todo: system はお使いの端末のシステムに揃えることを書く)
(todo: `${}` 構文の説明をする)
(todo: 各システム分書くのは面倒なので、ふつうは `flake-utils` や `flake-parts` などのライブラリを使うことを書く (手書きしてもいいが...))
(todo: pkgs.mkShell {} 以下が見慣れた shell.nix であることを書く)
(todo: legacyPackges がなぜ legacy なのか書く (そんな重要な意味はない))

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
- サードパーティーのライブラリを簡単にインストールできる

デメリット

- ロックファイルで指定されたバージョンをそれぞれインストールするため、あまりにも大量の Flake を使おうとするとディスクの容量を食う
- 定期的にロックファイルをアップデートしないとパッケージが古くなってしまう

### 演習

演習として、 [Bunnix](https;//github.com/aster-void/bunnix) という Nix で Bun をバージョン管理するためのライブラリを Flake にインストールしてみましょう。

シェルに入ったら、 Bun のバージョン 1.1.39 (最も偉大なバージョン) が使えるようにしてみましょう。
