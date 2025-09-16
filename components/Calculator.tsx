import React, { useState, useMemo } from 'react';
import { CalculationResult } from '../types';
import ResultDisplay from './ResultDisplay';


const PasteIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
);

const PasteSuccessIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);


const Calculator: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [btcPrice, setBtcPrice] = useState<string>('');
  const [feeRate, setFeeRate] = useState<string>('0.15');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pastedField, setPastedField] = useState<string | null>(null);

  const formatIntegerWithCommas = (value: string): string => {
    if (!value) return '';
    const num = parseInt(value, 10);
    if (isNaN(num)) return '';
    return num.toLocaleString('ja-JP');
  };

  const handleIntegerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const { value } = e.target;
    const numericValue = value.replace(/,/g, '');
    if (/^\d*$/.test(numericValue)) {
      setter(numericValue);
    }
  };

  const handleDecimalInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const { value } = e.target;
    if (/^\d*\.?\d{0,8}$/.test(value)) {
      setter(value);
    }
  };

  const handlePaste = async (
    fieldName: 'amount' | 'btcPrice',
    setter: React.Dispatch<React.SetStateAction<string>>,
    isInteger: boolean
  ) => {
    try {
      const text = await navigator.clipboard.readText();
      const cleanedText = text.replace(/,/g, '').trim();
      
      if (isInteger) {
          if (/^\d+$/.test(cleanedText)) {
              setter(cleanedText);
          }
      } else {
          if (/^\d*\.?\d*$/.test(cleanedText)) {
              const parts = cleanedText.split('.');
              if (parts.length > 1 && parts[1].length > 8) {
                  setter(parseFloat(cleanedText).toFixed(8));
              } else {
                  setter(cleanedText);
              }
          }
      }

      setPastedField(fieldName);
      setTimeout(() => setPastedField(null), 2000);
    // Fix: Added curly braces to the catch block to fix a syntax error that caused cascading compilation errors.
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      setError('クリップボードの読み取りに失敗しました。');
    }
  };


  const handleCalculate = () => {
    setResult(null);
    setError(null);

    const numAmount = parseFloat(amount);
    const numBtcPrice = parseFloat(btcPrice.replace(/,/g, ''));
    const numFeeRate = parseFloat(feeRate);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('有効な数量または金額を入力してください。');
      return;
    }
    if (isNaN(numFeeRate) || numFeeRate < 0) {
      setError('有効な手数料率を入力してください。');
      return;
    }
    if (isNaN(numBtcPrice) || numBtcPrice <= 0) {
      setError('有効なBTC価格を入力してください。');
      return;
    }

    try {
        // BTC数量で計算
        const grossJPY = numAmount * numBtcPrice;
        const feeAmount = grossJPY * (numFeeRate / 100);
        const netJPY = grossJPY - feeAmount;
        const netBTC = netJPY / numBtcPrice;
        
        const newResult: CalculationResult = {
            orderAmount: `${numAmount.toFixed(8)} BTC`,
            orderAmountSubtext: `約 ${grossJPY.toLocaleString('ja-JP', { maximumFractionDigits: 0 })} 円`,
            feeAmount: `${feeAmount.toLocaleString('ja-JP', { maximumFractionDigits: 0 })} 円`,
            feeRate: `${numFeeRate}%`,
            netAmount: `${netJPY.toLocaleString('ja-JP', { maximumFractionDigits: 0 })} 円`,
            netBTCAmount: `${netBTC.toFixed(8)} BTC`,
            copyableValues: {
                orderAmount: numAmount.toFixed(8),
                feeAmount: feeAmount.toFixed(0),
                netAmount: netJPY.toFixed(0),
                netBTCAmount: netBTC.toFixed(8),
            },
        };

        setResult(newResult);
    } catch (e) {
        setError('計算中にエラーが発生しました。入力値を確認してください。');
        console.error(e);
    }
  };


  // リアルタイムでBTC数量を日本円に変換
  const realtimeJPY = useMemo(() => {
    const numAmount = parseFloat(amount);
    const numBtcPrice = parseFloat(btcPrice.replace(/,/g, ''));
    
    if (!isNaN(numAmount) && !isNaN(numBtcPrice) && numAmount > 0 && numBtcPrice > 0) {
      const jpyValue = numAmount * numBtcPrice;
      return jpyValue.toLocaleString('ja-JP', { maximumFractionDigits: 0 });
    }
    return '';
  }, [amount, btcPrice]);


  return (
    <div className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl border border-gray-700">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="btcPrice" className="block text-sm font-medium text-gray-300 mb-2">BTC価格</label>
             <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                id="btcPrice"
                value={formatIntegerWithCommas(btcPrice)}
                onChange={(e) => handleIntegerInputChange(e, setBtcPrice)}
                placeholder="例: 7,000,000"
                className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 pl-3 pr-24 text-white focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-400 mr-2">円/BTC</span>
                 <button
                  onClick={() => handlePaste('btcPrice', setBtcPrice, true)}
                  className="p-1.5 bg-gray-700/50 rounded-md text-gray-400 hover:text-white hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
                  aria-label="クリップボードから貼り付け"
                >
                  {pastedField === 'btcPrice' ? <PasteSuccessIcon /> : <PasteIcon />}
                </button>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">BTC数量</label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                id="amount"
                value={amount}
                onChange={(e) => handleDecimalInputChange(e, setAmount)}
                placeholder="例: 0.01"
                className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 pl-3 pr-24 text-white focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-400 mr-2">BTC</span>
                <button
                  onClick={() => handlePaste('amount', setAmount, false)}
                  className="p-1.5 bg-gray-700/50 rounded-md text-gray-400 hover:text-white hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500"
                  aria-label="クリップボードから貼り付け"
                >
                  {pastedField === 'amount' ? <PasteSuccessIcon /> : <PasteIcon />}
                </button>
              </div>
            </div>
            {realtimeJPY && (
              <p className="text-xs text-blue-400 mt-1">約 {realtimeJPY} 円</p>
            )}
          </div>
        </div>

        <div>
            <label htmlFor="feeRate" className="block text-sm font-medium text-gray-300 mb-2">手数料率</label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                id="feeRate"
                value={feeRate}
                onChange={(e) => handleDecimalInputChange(e, setFeeRate)}
                className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 pl-3 pr-12 text-white focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-400">%</span>
              </div>
            </div>
        </div>

        <div>
          <button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-4 rounded-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
          >
            計算する
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 text-center p-3 bg-red-900/50 text-red-300 border border-red-500/50 rounded-md">
          {error}
        </div>
      )}

      {result && <ResultDisplay result={result} />}
    </div>
  );
};

export default Calculator;