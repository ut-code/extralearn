---
title: REST API
---

## Rest API とは

サーバーの API の設計思想のこと。

> RESTの4つの設計原則
> - セッションなどの状態管理を行わない。(やり取りされる情報はそれ自体で完結して解釈することができる)
> - 情報を操作する命令の体系が予め定義・共有されている。（HTTPのGETやPOSTメソッドなど）
> - すべての情報は汎用的な構文で一意に識別される。（URLやURIなど）
> - 情報の内部に、別の情報や(その情報の別の)状態へのリンクを含めることができる。
> 
> リソースに対してURLが対応づけられる。（そのため、URLが名詞的になることが多い）

とあるが、わかりにくいので具体的にどうなるかというと、

- URLがリソースを表す (名詞)
- メソッドがリソースに対する操作を表す (動詞)
- URL は階層構造になる (例: `/users/:user-id`)
- クエリパラメータは検索やフィルタといった条件になる (例: "?name=username", "?limit=10")

## メソッドの使い分け

ut.code(); Learn では GET メソッドと POST メソッドを扱ったが、 REST API では これらを含む、HTTP でサポートされている

- GET
- POST
- PUT
- PATCH
- DELETE

のメソッドを主に使う。
それぞれに、

- GET: リソースの取得
- POST: リソースの作成 (冪等でない)
- PUT: リソースの更新または作成 (冪等)
- PATCH: リソースの更新
- DELETE: リソースの削除

という意味をもたせる。 PUT と PATCH には、

- PUT: リソースの完全な表現を送信して更新
- PATCH: リソースへの部分的な変更

という違いをもたせる。
(もちろん、必ずしもすべてのメソッドを実装する必要はない)

また、

- 安全: サーバーの状態を変更しない
- べき等: サーバーが同じ状況にあるとき、特定のリクエストに対して何回でも続けて同じ効果が起こること

と定義すると、それぞれ

| メソッド | 安全性 | 冪等性 | 
| -------- | ------ | ------ |
| GET      | 必須   | 必須   |
| POST     |        |        |
| PUT      |        | 必須   |
| PATCH    |        |        |
| DELETE   |        | 必須   |

安全なメソッドはすべて冪等であるが、冪等なメソッドが必ずしも安全とは限らない。

参考:

[Patch - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Reference/Methods/PATCH)

[安全 (HTTP メソッド) | MDN](https://developer.mozilla.org/ja/docs/Glossary/Safe/HTTP)

[べき等 | MDN](https://developer.mozilla.org/ja/docs/Glossary/Idempotent)

## ステータスコード

REST API では、ステータスコードによってレスポンスの種類を分類している。

例えば、

- 200 番台は成功
- 300 番台はリダイレクトやキャッシュ
- 400 番台はクライアントの指定がおかしい
- 500 番台はサーバーの失敗

のようにグルーピングされており、それぞれの番号に意味がある。

例えば、

- 200 OK: 成功
- 201 Created: リソースを作成しました
- 202 Accepted: リクエストは受理されたが、まだ実行されていない

- 400 Bad Request: クライアントのエラーとみなされるもの
- 401 Unauthorized: 認証を受ける必要があります
- 403 Forbidden: 認証はありますが、認可がありません
- 404 Not Found: リソースが存在しません

など。

参考:

[HTTP レスポンスステータス | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/Reference/Status)

## 具体例

ある RESTful なサービスにユーザーを作成してから削除するまでの流れを具体例とする。
このサービスのユーザー型は、
```ts
type User = {
  id: string;
  name: string;
  introduction: string;
};
```
とする。

```sh
# == 作成
xh post :3000/users --raw '{"name": "aster-void", "introduction": "Hello, world!"}'
# {"id":"my-id","name":"aster-void","introduction":"Hello, world!"}

# == 取得
# 一覧取得
xh get :3000/users
# [
#   {"id":"my-id","name":"aster-void","introduction":"Hello, world!"}
#   {"id":"another-id","name":"another user","introduction":"hello there"}
# ]

# id を指定して取得
xh get :3000/users/my-id
# {"id":"my-id","name":"aster-void","introduction":"Hello, world!"}

# 名前を指定して取得
xh get :3000/users?name=aster-void
# [
#   {"id":"my-id","name":"aster-void","introduction":"Hello, world!"}
# ]

# == 変更
# 名前だけ変更
xh patch :3000/users/my-id` --raw '{"name": "new name"}'
# {"id":"my-id","name":"new name","introduction":"Hello, world!"}

# PUT で変更
xh put :3000/users/my-id` --raw '{"name": "new name", "introductin": "Hi!"}'
# {"id":"my-id","name":"new name","introduction":"Hi!"}

# == 削除
xh delete :3000/users/my-id
# {"id":"my-id","name":"new name","introduction":"Hi!"}
```
