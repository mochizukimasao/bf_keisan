#!/bin/bash

# ポート3000を常時監視し、サーバーが停止したら自動再起動するスクリプト

echo "🚀 bitFlyer手数料計算ツール - 常時監視モード開始"
echo "📱 アクセスURL: http://localhost:3000"
echo "🔄 サーバーが停止した場合は自動で再起動します"
echo "⏹️  停止するには Ctrl+C を押してください"
echo ""

# 関数: サーバーを起動
start_server() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - サーバーを起動中..."
    npm run dev &
    SERVER_PID=$!
    echo "サーバーPID: $SERVER_PID"
}

# 関数: サーバーを停止
stop_server() {
    if [ ! -z "$SERVER_PID" ]; then
        echo "$(date '+%Y-%m-%d %H:%M:%S') - サーバーを停止中..."
        kill $SERVER_PID 2>/dev/null
        wait $SERVER_PID 2>/dev/null
    fi
}

# 関数: ポート3000をクリア
clear_port() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - ポート3000をクリア中..."
    npm run kill-port 2>/dev/null
    sleep 2
}

# シグナルハンドラー設定
trap 'stop_server; echo ""; echo "👋 サーバーを停止しました。お疲れさまでした！"; exit 0' INT TERM

# 初期起動
clear_port
start_server

# メインループ: サーバーの生存確認
while true; do
    sleep 10
    
    # サーバープロセスの生存確認
    if ! kill -0 $SERVER_PID 2>/dev/null; then
        echo "$(date '+%Y-%m-%d %H:%M:%S') - ⚠️  サーバーが停止しました。再起動します..."
        clear_port
        start_server
    fi
    
    # ポート3000の応答確認
    if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "$(date '+%Y-%m-%d %H:%M:%S') - ⚠️  ポート3000が応答しません。再起動します..."
        stop_server
        clear_port
        start_server
    fi
done
