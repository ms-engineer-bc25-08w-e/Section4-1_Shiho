
# Node.js 20 の軽量版（alpine）を使う
FROM node:20-alpine AS base

# コンテナ内の作業ディレクトリを /app に設定
WORKDIR /app

# 依存関係だけ先に入れてキャッシュを効かせる
# package.json と package-lock.json をコンテナにコピー
COPY package*.json ./

# 依存パッケージをインストール
RUN npm install

# ソース配置(ソースコード全部をコピー)
COPY . .

# ポートを公開
EXPOSE 4000 9229

# コンテナ起動時のコマンド
CMD ["npm", "run", "dev"]

