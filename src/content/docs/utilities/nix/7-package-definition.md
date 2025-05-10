---
title: 7. Nix でパッケージを定義する
---

Nix のパッケージを表すものとして、derivation というものがあります。

(めんどくなったので、あとは勝手に調べてください。)

## パッケージを記述する

`stdenv.mkDerivation` というラッパーを使い、パッケージを記述しましょう。

```go title="main.go"
package main

import "fmt"

func main() {
  fmt.Println("Hello, Nix!")
}
```

```nix
{pkgs ? import <nixpkgs> {}}: let
  pname = "hello-nix";
in
  pkgs.stdenv.mkDerivation {
    inherit pname;
    version = "0.0.0";
    src = ./.;
    buildInputs = [pkgs.go];
    buildPhase = ''
      # キャッシュのディレクトリを設定する (気にしなくて良い)
      export GOCACHE=/tmp/gocache
      go build ./main.go
    '';
    installPhase = ''
      mkdir -p $out/bin
      mv ./main $out/bin/${pname}
    '';
  }
```

ビルドしてみましょう。

```sh
nix-build ./package.nix
```

`result` という symlink が生成されます。

```sh
./result/bin/hello-nix
# -> Hello, Nix!
```

## インストールしてみる

今回は Nix シェルにインストールしますが、Home Manager や NixOS にも同様の手順でインストールできます。
`pkgs.callPackage` は、他のファイルに記述した Nix 関数を呼び出すのに使えます。

```nix title="shell.nix"
{pkgs ? import <nixpkgs> {}}: let
  hello-nix = pkgs.callPackage ./package.nix {};
in
  pkgs.mkShell {
    packages = [
      hello-nix
    ];
  }
```

```sh
nix-shell

hello-nix # `$out/bin` の中に作成したバイナリのファイル名で呼べる
# -> Hello, Nix!
```

## Flake にする

このままだと、 `package.nix` とそのソースがローカルに存在しないと使えません。あまり便利ではないですね。
Flake にして、 GitHub で全世界に配布してみましょう。

```nix title="flake.nix"
{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in
      {
        packages.hello-nix = pkgs.callPackage ./package.nix {};
        packages.default = self.packages.${system}.hello-nix;
      });
}
```

これをコミットして、 リポジトリのルートにおいて GitHub の公開リポジトリにアップロードします。

すると、任意の場所 (あなたのパソコンである必要もありません) から Flake を呼び出せるようになります。

```sh
nix run github:$USER/$REPO # default を実行
nix run github:$USER/$REPO#hello-nix # hello-nix を実行
```

ちなみに、この教材のリポジトリにも `hello-nix` をおいてあるので、 `nix run github:ut-code/extralearn` で hello-nix が実行できます。

Cachix とかで、ビルド結果を共有キャッシュにすることもできるらしいです。(やったことない)
