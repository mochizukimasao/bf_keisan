import React from 'react';
import Calculator from './components/Calculator';
import Disclaimer from './components/Disclaimer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
            bitFlyer 手数料計算ツール
          </h1>
          <p className="text-gray-400 mt-2 max-w-md mx-auto">
            BTC数量と価格を入力するだけで、リアルタイムで日本円換算を表示。手数料差引後の受取金額とBTC量を自動計算し、コピーボタンで簡単にコピーできます。
          </p>
        </header>

        <main>
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