---
title:  VSCode Neovim を使ってみよう！
---

## Neovim とは？
Neovim は、キーボード操作を中心にした効率的なテキスト編集ができるエディタです。マウスをほとんど使わず、ショートカットやコマンドで素早く編集作業ができます。

普段 VSCode しか使ったことがない方にとっては、最初は独特な操作感に戸惑うかもしれませんが、慣れると手をほとんどキーボードから離さずに編集できるため、作業効率が大きく向上します。

また、VSCode Neovim 使えば、普段の VSCode の環境のまま、簡単に Vim（Neovim）の操作感を試すことができます。

## 早速使ってみよう
### インストール
まず Neovim をインストールします。[GitHub](https://github.com/neovim/neovim/blob/master/INSTALL.md) を参照してください。ちなみに、筆者は WSL2 + Ubuntu 22.04 を使っているのですが、apt で配布されているバージョンが VSCode Neovim の要件に足りなかったので、AppImage からインストールしました。\
次に、VSCode Neovim を VSCode 上でインストールします。ボタン押すだけですね。インストールが終わったら、歯車マークから Settings に進みます。`which nvim` で neovim の実行ファイルのパスを取得して、Neovim Exectable Paths として指定します。また、
```sh
mkdir ~/.config/nvim
touch ~/.config/nvim/init.vim
```
で、空のファイルを作り、`~/.config/nvim/init.vim` を Neovim Init Vim Paths として指定します。WSL を使っている方は Use WSL にチェックを入れてください。これで完了です。

### 実際に使ってみよう
ここで 「Vim には色々なモードがあって、このモードでは...」のように Vim について説明してもいいのですが、それは多分 Zenn とか Qiita で探せば出てくるので、各自調べてみてください。その上で、Insert Mode から Normal Mode に切り替えるときに毎回 Esc を押すのは面倒なので、"jj" で切り替える方法だけ簡単に説明します。[公式ドキュメント](https://github.com/vscode-neovim/vscode-neovim?tab=readme-ov-file#installation) にも書いてあるのですが、まず Ctrl + Shift + P でコマンドパレットを開いて、そこから settings.json を開きます。そこに以下のように書けば、もう "jj" だけで Insert Mode を抜けることができます。
```json
{
    "vscode-neovim.compositeKeys": {
        "jj": {
            "command": "vscode-neovim.escape",
        },
    },
}
```
慣れないうちは、ストレスが溜まるかと思いますが、慣れればこれまで以上の開発スピードを手に入れることができます。それでは、快適な Vimmer ライフを！
