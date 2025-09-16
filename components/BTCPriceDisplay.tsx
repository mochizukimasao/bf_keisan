import { useState, useEffect } from 'react';

interface BTCPrice {
  ltp: number; // 最終取引価格
  timestamp: string;
}

export default function BTCPriceDisplay() {
  const [price, setPrice] = useState<BTCPrice | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const socket = new WebSocket('wss://ws.lightstream.bitflyer.com/json-rpc');

    socket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      setError(null);
      
      // BTC/JPYの価格データを購読
      const subscribeMessage = {
        method: 'subscribe',
        params: {
          channel: 'lightning_ticker_BTC_JPY'
        }
      };
      socket.send(JSON.stringify(subscribeMessage));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.params && data.params.message) {
          const ticker = data.params.message;
          setPrice({
            ltp: ticker.ltp,
            timestamp: new Date().toLocaleTimeString('ja-JP')
          });
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
        setError('データの解析に失敗しました');
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('接続エラーが発生しました');
      setIsConnected(false);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    // クリーンアップ
    return () => {
      socket.close();
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const copyPrice = async () => {
    if (price) {
      try {
        await navigator.clipboard.writeText(price.ltp.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy price:', err);
      }
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <h3 className="text-sm font-medium text-gray-300">リアルタイム価格</h3>
          </div>
          
          {price ? (
            <div className="flex items-center gap-3">
              <div className="text-3xl font-light text-white tracking-tight">
                {formatPrice(price.ltp)}
              </div>
              <button
                onClick={copyPrice}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 active:scale-95"
                title="価格をコピー"
              >
                {copied ? (
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          ) : (
            <div className="text-xl text-gray-400">
              {error ? (
                <span className="text-red-400">接続エラー</span>
              ) : isConnected ? (
                <span>データ取得中...</span>
              ) : (
                <span>接続中...</span>
              )}
            </div>
          )}
          
          {price && (
            <div className="mt-2 text-xs text-gray-400">
              最終更新: {price.timestamp}
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center gap-1">
          <div className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-emerald-400' : 'bg-red-400'
          }`}></div>
          <div className="text-xs text-gray-500">
            {isConnected ? 'LIVE' : 'OFF'}
          </div>
        </div>
      </div>
    </div>
  );
}
