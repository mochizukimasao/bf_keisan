import React from 'react';
import Calculator from './components/Calculator';
import Disclaimer from './components/Disclaimer';
import BTCPriceDisplay from './components/BTCPriceDisplay';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-white text-lg font-bold">₿</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light text-white tracking-tight">
              bitFlyer 手数料計算ツール
            </h1>
          </div>
          <p className="text-gray-400 mt-2 max-w-lg mx-auto text-sm leading-relaxed">
            BTC数量と価格を入力するだけで、リアルタイムで日本円換算を表示。手数料差引後の受取金額とBTC量を自動計算し、コピーボタンで簡単にコピーできます。
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