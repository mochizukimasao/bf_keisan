import React, { useState, useMemo } from 'react';
import { CalculationType, CalculationResult } from '../types';
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
  const [calculationType, setCalculationType] = useState<CalculationType>(
    CalculationType.BuyJPY
  );
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

    const needsBtcPrice = ![CalculationType.BuyJPY].includes(calculationType);

    if (needsBtcPrice && (isNaN(numBtcPrice) || numBtcPrice <= 0)) {
      setError('有効なBTC価格を入力してください。');
      return;
    }

    const feeMultiplier = 1 - numFeeRate / 100;
    const feeAdder = 1 + numFeeRate / 100;
    let newResult: CalculationResult | null = null;

    try {
        switch (calculationType) {
            case CalculationType.BuyJPY: {
                const orderJPY = numAmount * feeAdder;
                 newResult = {
                    orderInput: `約 ${orderJPY.toLocaleString('ja-JP', { maximumFractionDigits: 0 })} 円`,
                    netAmount: `${numAmount.toLocaleString('ja-JP')} 円分のBTC`,
                    formula: `${numAmount.toLocaleString('ja-JP')} × (1 + ${numFeeRate / 100})`,
                    copyableValue: Math.round(orderJPY).toString(),
                };
                break;
            }
             case CalculationType.BuyWithBalance: {
                const netJPY = numAmount / feeAdder;
                const netBTC = netJPY / numBtcPrice;
                newResult = {
                    orderInput: `${numAmount.toLocaleString('ja-JP', { maximumFractionDigits: 0 })} 円`,
                    netAmount: `約 ${netBTC.toFixed(8)} BTC ( ${netJPY.toLocaleString('ja-JP', { maximumFractionDigits: 0 })} 円分 )`,
                    formula: `${numAmount.toLocaleString('ja-JP')} ÷ (1 + ${numFeeRate / 100})`,
                    copyableValue: numAmount.toString(),
                };
                break;
            }
            case CalculationType.BuyBTC: {
                const orderBTC = numAmount / feeMultiplier;
                const orderJPY = orderBTC * numBtcPrice;
                newResult = {
                    orderInput: `${orderBTC.toFixed(8)} BTC`,
                    orderInputSubtext: `(参考: 約 ${orderJPY.toLocaleString('ja-JP', { maximumFractionDigits: 0 })} 円)`,
                    netAmount: `${numAmount.toFixed(8)} BTC`,
                    formula: `${numAmount} ÷ (1 - ${numFeeRate / 100})`,
                    copyableValue: orderBTC.toFixed(8),
                };
                break;
            }
            case CalculationType.SellBTC: {
                const receivedJPY = numAmount * numBtcPrice * feeMultiplier;
                newResult = {
                    orderInput: `${numAmount.toFixed(8)} BTC`,
                    netAmount: `約 ${receivedJPY.toLocaleString('ja-JP', { maximumFractionDigits: 0 })} 円`,
                    formula: `${numAmount} × ${numBtcPrice.toLocaleString('ja-JP')} × (1 - ${numFeeRate / 100})`,
                    copyableValue: numAmount.toFixed(8),
                };
                break;
            }
            case CalculationType.ReceiveJPY: {
                const orderBTC = numAmount / (numBtcPrice * feeMultiplier);
                newResult = {
                    orderInput: `${orderBTC.toFixed(8)} BTC`,
                    netAmount: `約 ${numAmount.toLocaleString('ja-JP')} 円`,
                    formula: `${numAmount.toLocaleString('ja-JP')} ÷ (${numBtcPrice.toLocaleString('ja-JP')} × (1 - ${numFeeRate / 100}))`,
                    copyableValue: orderBTC.toFixed(8),
                };
                break;
            }
        }
        setResult(newResult);
    } catch (e) {
        setError('計算中にエラーが発生しました。入力値を確認してください。');
        console.error(e);
    }
  };

  const { label, placeholder } = useMemo(() => {
    switch (calculationType) {
      case CalculationType.BuyJPY:
        return { label: '欲しいBTCの金額', placeholder: '例: 10,000' };
      case CalculationType.BuyBTC:
        return { label: '取得したいBTC量', placeholder: '例: 0.01' };
       case CalculationType.BuyWithBalance:
        return { label: '支払う日本円の総額 (口座残高)', placeholder: '例: 10,000' };
      case CalculationType.SellBTC:
        return { label: '売却したいBTC量', placeholder: '例: 0.01' };
      case CalculationType.ReceiveJPY:
        return { label: '受け取りたい金額', placeholder: '例: 10,000' };
      default:
        return { label: '', placeholder: '' };
    }
  }, [calculationType]);

  const isJPYAmount = useMemo(() => {
      return [CalculationType.BuyJPY, CalculationType.ReceiveJPY, CalculationType.BuyWithBalance].includes(calculationType);
  }, [calculationType]);
  const unit = isJPYAmount ? '円' : 'BTC';


  return (
    <div className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-2xl border border-white/10">
      <div className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
            <div className="relative">
              <input
                type="text"
                inputMode={isJPYAmount ? 'numeric' : 'decimal'}
                id="amount"
                value={isJPYAmount ? formatIntegerWithCommas(amount) : amount}
                onChange={
                    isJPYAmount
                      ? (e) => handleIntegerInputChange(e, setAmount)
                      : (e) => handleDecimalInputChange(e, setAmount)
                }
                placeholder={placeholder}
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-4 pr-24 text-white placeholder-gray-400 focus:ring-2 focus:ring-white/20 focus:border-white/30 focus:bg-white/15 transition-all duration-200"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-400 mr-2">{unit}</span>
                <button
                  onClick={() => handlePaste('amount', setAmount, isJPYAmount)}
                  className="p-2 bg-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/20 transition-all duration-200 active:scale-95 focus:outline-none"
                  aria-label="クリップボードから貼り付け"
                >
                  {pastedField === 'amount' ? <PasteSuccessIcon /> : <PasteIcon />}
                </button>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="btcPrice" className="block text-sm font-medium text-gray-300 mb-2">現在のBTC価格</label>
             <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                id="btcPrice"
                value={formatIntegerWithCommas(btcPrice)}
                onChange={(e) => handleIntegerInputChange(e, setBtcPrice)}
                placeholder="例: 7,000,000"
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-4 pr-24 text-white placeholder-gray-400 focus:ring-2 focus:ring-white/20 focus:border-white/30 focus:bg-white/15 transition-all duration-200 disabled:bg-white/5 disabled:cursor-not-allowed"
                disabled={calculationType === CalculationType.BuyJPY}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-400 mr-2">円</span>
                 <button
                  onClick={() => handlePaste('btcPrice', setBtcPrice, true)}
                  className="p-2 bg-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/20 transition-all duration-200 active:scale-95 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="クリップボードから貼り付け"
                  disabled={calculationType === CalculationType.BuyJPY}
                >
                  {pastedField === 'btcPrice' ? <PasteSuccessIcon /> : <PasteIcon />}
                </button>
              </div>
            </div>
             {calculationType === CalculationType.BuyJPY && (
                <p className="text-xs text-gray-500 mt-1">このモードではBTC価格は不要です。</p>
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
                className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-4 pr-12 text-white placeholder-gray-400 focus:ring-2 focus:ring-white/20 focus:border-white/30 focus:bg-white/15 transition-all duration-200"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-400">%</span>
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