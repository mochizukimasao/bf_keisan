import React, { useState } from 'react';
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
  const [amount, setAmount] = useState<string>(''); // 日本円の金額
  const [btcQuantity, setBtcQuantity] = useState<string>(''); // BTC数量
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

  const handlePaste = async (fieldName: string, setter: React.Dispatch<React.SetStateAction<string>>, isInteger: boolean) => {
    try {
      const text = await navigator.clipboard.readText();
      const numericValue = text.replace(/[^\d.-]/g, '');
      
      if (numericValue) {
        if (isInteger) {
          const intValue = parseInt(numericValue, 10);
          if (!isNaN(intValue)) {
            setter(intValue.toString());
          }
        } else {
          if (/^\d*\.?\d{0,8}$/.test(numericValue)) {
            setter(numericValue);
          }
        }
      }

      setPastedField(fieldName);
      setTimeout(() => setPastedField(null), 2000);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      setError('クリップボードの読み取りに失敗しました。');
    }
  };

  const handleCalculate = () => {
    setResult(null);
    setError(null);

    const numAmount = parseFloat(amount.replace(/,/g, '')); // 日本円の金額
    const numBtcQuantity = parseFloat(btcQuantity); // BTC数量
    const numFeeRate = parseFloat(feeRate);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('有効な金額を入力してください。');
      return;
    }
    if (isNaN(numBtcQuantity) || numBtcQuantity <= 0) {
      setError('有効なBTC数量を入力してください。');
      return;
    }
    if (isNaN(numFeeRate) || numFeeRate < 0) {
      setError('有効な手数料率を入力してください。');
      return;
    }

    try {
      // 金額 × BTC数量 = 総取引金額
      const totalTradeValue = numAmount * numBtcQuantity;
      const feeAmount = totalTradeValue * (numFeeRate / 100);
      const netAmount = totalTradeValue - feeAmount;
      
      const newResult: CalculationResult = {
        orderAmount: `${numAmount.toLocaleString('ja-JP')} 円 × ${numBtcQuantity.toFixed(8)} BTC`,
        netAmount: `${netAmount.toLocaleString('ja-JP')} 円`,
        feeAmount: `${feeAmount.toLocaleString('ja-JP')} 円`,
        feeRate: `${numFeeRate}%`,
        formula: `${numAmount.toLocaleString('ja-JP')} × ${numBtcQuantity.toFixed(8)} × (1 - ${numFeeRate / 100})`,
        copyableValues: {
          orderAmount: totalTradeValue.toLocaleString('ja-JP'),
          feeAmount: feeAmount.toLocaleString('ja-JP'),
          netAmount: netAmount.toLocaleString('ja-JP'),
          netBTCAmount: numBtcQuantity.toFixed(8)
        }
      };
      
      setResult(newResult);
    } catch (e) {
      setError('計算中にエラーが発生しました。入力値を確認してください。');
      console.error(e);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
      <div className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">金額（日本円）</label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                id="amount"
                value={formatIntegerWithCommas(amount)}
                onChange={(e) => handleIntegerInputChange(e, setAmount)}
                placeholder="例: 100,000"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 pl-4 pr-24 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 mr-2">円</span>
                <button
                  onClick={() => handlePaste('amount', setAmount, true)}
                  className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-all duration-200 active:scale-95 focus:outline-none"
                  aria-label="クリップボードから貼り付け"
                >
                  {pastedField === 'amount' ? <PasteSuccessIcon /> : <PasteIcon />}
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="btcQuantity" className="block text-sm font-medium text-gray-700 mb-2">BTC数量</label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                id="btcQuantity"
                value={btcQuantity}
                onChange={(e) => handleDecimalInputChange(e, setBtcQuantity)}
                placeholder="例: 0.01"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 pl-4 pr-24 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 mr-2">BTC</span>
                <button
                  onClick={() => handlePaste('btcQuantity', setBtcQuantity, false)}
                  className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-all duration-200 active:scale-95 focus:outline-none"
                  aria-label="クリップボードから貼り付け"
                >
                  {pastedField === 'btcQuantity' ? <PasteSuccessIcon /> : <PasteIcon />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
            <label htmlFor="feeRate" className="block text-sm font-medium text-gray-700 mb-2">手数料率</label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                id="feeRate"
                value={feeRate}
                onChange={(e) => handleDecimalInputChange(e, setFeeRate)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 pl-4 pr-12 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500">%</span>
              </div>
            </div>
        </div>

        <div>
          <button
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium py-4 px-6 rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            計算する
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 text-center p-4 bg-red-500/10 text-red-300 border border-red-500/20 rounded-xl backdrop-blur-sm">
          {error}
        </div>
      )}

      {result && <ResultDisplay result={result} />}
    </div>
  );
};

export default Calculator;