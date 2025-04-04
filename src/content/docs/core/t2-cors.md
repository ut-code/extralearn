---
title: CORS
---

# CORS (Cross-Origin Resource Sharing) とは？

CORS（クロスオリジンリソース共有）は、異なるオリジン（ドメイン、プロトコル、ポートが異なるリソース）間でのデータのやり取りを制御する仕組みです。

通常、**ブラウザは**セキュリティ上の理由から、スクリプトが異なるオリジンのリソースを読み取ることを制限します（同一オリジンポリシー = SOP と呼ばれます）。

CORS はこの制限を緩和するために利用されます。

## CORS の基本

CORS では、サーバーが `Access-Control-Allow-Origin` ヘッダーを使用して、どのオリジンからのリクエストを許可するかをブラウザに指示します。

### SOP によってブロックされるリソースの例

```typescript
const data = await fetch('https://example.com/api/data')
  .then(response => response.json());
```

このコードを `https://app.utcode.net` で実行すると、`https://example.com/api/data` へのリクエストが CORS ポリシーによりブロックさます。

## サーバー側の設定例

サーバー側で CORS を許可するには、適切なヘッダーを設定する必要があります。

### Node.js（Express）での設定

```javascript
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // すべてのオリジンを許可

app.get('/api/data', (req, res) => {
  res.json({ message: 'CORS 許可済み' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

この設定では、どのオリジンからでもリクエストを受け付けるようになります。

### 特定のオリジンのみ許可する

```javascript
app.use(cors({ origin: 'https://mywebsite.com' }));
```

これにより、`https://mywebsite.com` からのリクエストのみ許可されます。

## プリフライトリクエストとは？

特定の HTTP メソッド（例: `PUT`, `DELETE`）やカスタムヘッダーを含むリクエストでは、ブラウザが事前に `OPTIONS` リクエストを送信してサーバーに許可を確認します。

### `OPTIONS` リクエストを処理する例

```javascript
app.options('/api/data', cors());
```

または、手動でヘッダーを設定することもできます。

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://mywebsite.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```

## まとめ

- CORS は異なるオリジン間の通信を制御する仕組み。
- `Access-Control-Allow-Origin` ヘッダーで許可するオリジンを指定。
- `OPTIONS` リクエスト（プリフライト）が発生する場合もある。
- サーバー側で適切に設定すれば、CORS の問題を解決できる。

この基本を押さえれば、CORS エラーの原因を特定しやすくなります！


