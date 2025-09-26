---
title: 7. Nix でパッケージを定義する
---

Nix ではビルド単位を derivation と呼びます。ここでは最小のパッケージ定義を作って動かします。

## パッケージを記述する

`stdenv.mkDerivation` を使って定義します。

```go title="main.go"
package main

import "fmt"

func main() {
  fmt.Println("Hello, Nix!")
}
```

```nix
{ pkgs ? import <nixpkgs> {} }:
let pname = "hello-nix";
in pkgs.stdenv.mkDerivation {
  inherit pname;
  version = "0.0.0";
  src = ./.;
  buildInputs = [ pkgs.go ];
  buildPhase = ''
    export GOCACHE=$TMPDIR/gocache
    go build -o ${pname} ./main.go
  '';
  installPhase = ''
    install -Dm755 ${pname} $out/bin/${pname}
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

今回は Nix シェルに取り込みます。`pkgs.callPackage` でローカル定義を呼び出せます。

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

Flake 化するとどこからでも参照できます。

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

コミット・公開後は次のように実行できます。
```sh
nix run github:$USER/$REPO           # default を実行
nix run github:$USER/$REPO#hello-nix # hello-nix を実行
```

共有キャッシュ (例: Cachix) を用意すればビルド時間を短縮できます。
