import React from 'react';
import Calculator from './components/Calculator';
import Disclaimer from './components/Disclaimer';
import BTCPriceDisplay from './components/BTCPriceDisplay';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white text-gray-900 font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white text-lg font-bold">₿</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
              bitFlyer 手数料計算ツール
            </h1>
          </div>
          <p className="text-gray-600 mt-2 max-w-lg mx-auto text-sm leading-relaxed">
            金額とBTC数量を入力するだけで、手数料を差し引いた実際の受取金額を計算します。リアルタイム価格も表示され、コピーボタンで簡単にコピーできます。
          </p>
        </header>

        <main>
          <BTCPriceDisplay />
          <Calculator />
        </main>

        <footer className="mt-8">
          <Disclaimer />
        </footer>
      </div>
    </div>
  );
};

export default App;