---
title: 9. Nix/NixOS でよくあるミス・引っかかりやすいところ
---

### Flake が認識されない / Flake で Nix ファイルが見つからないと出る

`git add` する。終わり。

詳しい説明は、以下の通り。

- Flake は、純粋性の確保のため、いったんリポジトリを Nix Store にコピーしてから評価するという挙動をとる。
- このとき、git を使ってコピーしてるっぽい？。 git に認知されているファイルはステージされていなくても問題なくコピーできるが、 git が認知していない (untracked) ファイルはコピーできない。
- コピーできないため、ファイルが見つからないと表示される。

### NixOS で NPM ライブラリ XXX が動かない

たいていの場合はそのライブラリがバイナリを引っ張ってくる野蛮なライブラリだから。 (ex. wrangler, sharp, prisma, ...)

nix-ld を入れればたいていは解決。

- Prisma の場合は、バイナリの引っ張り方が無駄に丁寧 (distribution で switch してる) ので、環境変数でバイナリを指定してやる。 [nix-prisma-utils](https://github.com/VanCoding/nix-prisma-utils) が便利。
- Wrangler の場合は、 nix-ld を入れてる自分の環境でも動かなそうなので、 Nixpkgs からインストールしよう。
- その他自分の把握してないライブラリは [ここ](https://zenn.dev/asa1984/scraps/17fe60c1b2ccc2) 参照。

### Flake で fetcher を使うとエラー

Flake の純粋性を保つため。

選択肢は２つあり、

- `inputs` を使う (おすすめ)
- fetcher にハッシュを渡す (どうしようもない時)
