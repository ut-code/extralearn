---
title: 5. Nix Channel と Flake
---

# Nix のバージョン固定方法

Nix の参照方法は大きく「Channels (旧来)」と「Flakes (現行)」の二系統があります。新規プロジェクトは Flakes を推奨します。

## Nix Channels (レガシー)

`nix-env`/`nix-shell` のような古い CLI で解決に使われる旧来の参照方式です。マシン単位で管理・更新します。

```sh
nix-channel --list # 一覧
nix-channel --update # アップデート
```

## Nix Flakes (推奨)

Flake とは、 `flake.nix` と `flake.lock` を含む **Git リポジトリ** のことを指します。リポジトリに `flake.nix` (定義) と `flake.lock` (入力を固定) を置いて再現性を担保します。

`flake.nix` は、少なくとも以下のプロパティを持つ必要があります:

- `inputs`: Flake の依存する「可変入力」を表す attrset。 `nixpkgs` やサードパーティ Flake が該当する。
- `outputs`: Flake の表現するもの。任意の値を持つことができるが、とくに `devShells` は `nix develop` 用のもので、 ``

作成:
```sh
nix flake init
nix flake init -t <テンプレート>
```

最小の `devShell` 例:
```nix
{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixpkgs-unstable";
  };

  outputs = { self, nixpkgs }: let
    system = "x86_64-linux"; # 端末のシステムに合わせる
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    devShells.${system}.default = pkgs.mkShell {
      packages = with pkgs; [ hello cowsay lolcat ];
    };
  };
}
```

使い方:

```sh
nix develop .#default  # devShells.${system}.defaultに入る
nix run .#hello        # apps.${system}.hello / packages.${system}.hello を実行する
```

### Flake のバージョン管理

- 依存を一括更新: `nix flake update`
- 特定入力だけ更新: `nix flake lock --update-input nixpkgs`

### Flakes の特徴

メリット
- 依存をロックし、複数人・複数端末で同一環境を再現できる。
- 更新は明示的に行い、変更点をレビュー可能。
- `inputs` に外部 Flake を指定して容易に拡張可能。

注意点
- ロック単位で依存が増えるため、Flake 数が多いとストア使用量が増える。
- ロック更新を継続的に行わないと古くなる。

### 演習

