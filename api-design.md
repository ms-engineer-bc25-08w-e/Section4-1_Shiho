
# 家計簿アプリAPI設計書

## 1.リソース一覧

### 1-1 transactions
- **管理**: 入金・出金を記録
- **主キー**:id
- **キーと属性**:
  - id: string
  - date: string            // "2025-12-24" 形式を想定
  - type: income | expense  // income（収入） / expense（支出）/ 実際の収支区分
  - categoryId: string      // カテゴリID（c_food）
  - categoryName: string　　// カテゴリ名（食費、給与など）
  - title?: string          // メモ（任意の説明を想定）
  - amount: number          // 金額

### 1-2 categories
- **管理**: カテゴリを記録
- **主キー**:id
- **キーと属性**:
  - id: string
  - type: income | expense | both  //カテゴリが利用可能な収支区分
  - salary: 給与
  - food: 食費
  - transportation: 交通費
  - side_income: 副収入
  - entertainment: 娯楽
  - other: その他

### 1-3 関係性
transactions：categories　N:1


## 2. APIエンドポイント一覧

### 2-1 transactions
| メソッド | パス | 備考 |
|---|---|---|
| GET | /transactions | 取引一覧 |
| GET | /transactions/:id | 取引詳細 |

- GET /transactions  クエリ（検索条件）
  - month=YYYY-MM（例: month=2025-12）
  - type=income|expense
  - categoryId=string

### 2-2 categories
| メソッド | パス | 備考 |
|---|---|---|
| GET | /categories | カテゴリ一覧 |

### 2-3 reports
| メソッド | パス | 備考 |
|---|---|---|
| GET | /reports/monthly-summary | 月次集計（month指定） |


## 3. HTTPメソッド別の設計
- GET: 一覧/詳細/集計の取得のみを提供する（読み取り専用）
- POST（追加）/PATCH（編集）/DELETE（削除）は学習の次段階で追加予定


## 4. リクエスト/レスポンス形式

### 4-1 共通

#### 4-1-1 Content-Type（レスポンスの中身の形式）
- Response: `application/json; charset=utf-8`

#### 4-1-2 日付と金額のルール
- date:"YYYY-MM-DD"
- month:"YYYY-MM"
- amount: number

#### 4-1-3 エラーレスポンス形式
```
json

{
  "error":{
    "code": "INVALID_QUERY"
    "message": string
    "details"{
      "month": "2026-13"
      "response": "範囲外の月"
    }
  }
}
```
- error
  - 「これは正常レスポンスではなくエラーです」の意味。フロントサイドはerrorがあればエラー処理に入れる。

- code
  - INVALID_QUERY: month/date/categoryIdの形式不正
  - NOT_FOUND: 該当データが0件（設計次第）

- message
  - エラー全体の要約（このAPI呼び出し全体として何がダメか）

- response
  - エラー詳細（原因）


### 4-2 データモデル

#### 4-2-1 Transaction
```
json

{
  "id": "t_001",
  "date": "2025-12-24",
  "type": "expense",
  "categoryId": "c_food",
  "categoryName": "食費",
  "title": "スーパー",
  "amount": 3000
}
```
#### 4-2-2 Category
```
json

{
  "id": "c_food",
  "name": "食費",
  "type": "expense"
}
```
#### 4-2-3 MonthlySummary
```
json

{
  "month": "2025-12",
  "incomeTotal": 500000,
  "expenseTotal": 100000,
  "balance": 400000,
  "byCategory": [
    {
      categoryID: "c_food",
      categoryName: "食費",
      total: 30000
    }
  ]
}
```
- byCategory
  - フロントサイドの負荷を減らすためAPI側で集計結果をまとめる

### 4-3 リクエスト別レスポンス定義

#### 4-3-1 GET /transactions
- リクエスト （検索条件に最低限必要な項目）
  - month
  - type
  - categoryId

- 例
  - /transactions?month=202512&type=expense&categoryId=c_food

- レスポンス（200 OK）
```
json

{
  "items": [
    {
      "id": "t_001",
      "date": "2025-12-24",
      "type": "expense",
      "categoryId": "c_food",
      "categoryName": "食費",
      "title": "スーパー",
      "amount": 1000
    }
  ],
  "count": 1 //将来のページングまたは件数表示を想定して設定
}
```

- エラー（400 Bad Request）
  - Invalid parameter: 無効なパラメータ
  - date out of range: 日付が範囲外です
```
json

{
  "error":{
    "code": "INVALID_QUERY",
    "message": "Invalid parameter",
    "details": {
      "date": "2025-12-33"
      "response": "date out of range"
    }
  }
}
```


#### 4-3-2 GET /transactions/:id
- リクエスト （検索条件に最低限必要な項目）
  - id

- 例
  - /transactions/t_001

- レスポンス（200 OK）
```
{
  "id": "t_001",
  "date": "2025-12-24",
  "type": "expense",
  "categoryId": "c_food",
  "categoryName": "食費",
  "title": "スーパー",
  "amount": 1000
}
```

- エラー（404 Not Found）
  - transaction not found: 取引が見つかりません
  - The specified transaction does not exist: 指定された取引は存在しません
```
json

{
  "error":{
    "code": "NOT_FOUND",
    "message": "transaction not found",
    "details": {
      "id": "t_000",
      "response": "The specified transaction does not exist"
    }
  }
}
```

#### 4-3-3 GET /categories
- リクエスト （検索条件に最低限必要な項目）
  - （カテゴリの一覧取得用の為パラメータなし）

- 例
  - /categories

- レスポンス（200 OK）
```
[
  {"id": "c_salary",  "name": "給与",  "type": "income"},
  {"id": "c_food",  "name": "食費",  "type": "expense"},
  {"id": "c_transpo",  "name": "交通費",  "type": "expense"},
  {"id": "c_sideinc",  "name": "副収入",  "type": "income"},
  {"id": "c_entmt",  "name": "娯楽",  "type": "both"},
  {"id": "c_other",  "name": "その他",  "type": "both"}
]
```

- エラー（400 Bad Request）
  - Invalid parameter: 無効なパラメータ
  - This is an unexpected type: 想定外のtypeです
```
json

{
  "error":{
    "code": "INVALID_QUERY",
    "message": "Invalid queryparameter",
    "details": {
      "type": ""
      "response": "This is an unexpected type"
    }
  }
}
```

#### 4-3-4 GET /reports/monthly-summary
- リクエスト （検索条件に最低限必要な項目）
  - month

- 例
  - /reports/monthly-summary?month=2025-12

- レスポンス（200 OK）
```
json
{
  "month": "2025-12",
  "incomeTotal": 500000,
  "expenseTotal": 100000,
  "balance": 400000,
  "byCategory": [
    { categoryID: "c_salary", categoryName: "給与", total: 300000 },
    { categoryID: "c_food", categoryName: "食費", total: 30000 },
    { categoryID: "c_transpo", categoryName: "交通費", total: 10000 },
    { categoryID: "c_sideinc", categoryName: "副収入", total: 200000 },
    { categoryID: "c_entmt", categoryName: "娯楽", total: 20000 },
    { categoryID: "c_other", categoryName: "その他", total: 40000 },
  ]
}
```

- エラー（400 Bad Request）
  - Invalid parameter: 無効なパラメータ
  - Month out of range: 月が範囲外です
```
json

{
  "error":{
    "code": "INVALID_QUERY",
    "message": "Invalid parameter",
    "details": {
      "month": "2025-13"
      "response": "Month out of range"
    }
  }
}
```
