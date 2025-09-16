import React, { useState } from 'react';
import { CalculationResult } from '../types';

interface ResultDisplayProps {
  result: CalculationResult;
}

const ResultCard: React.FC<{ 
    title: string; 
    value: string; 
    subtext?: string; 
    isPrimary?: boolean;
    copyableValue?: string;
    showCopyButton?: boolean;
}> = ({ title, value, subtext, isPrimary = false, copyableValue, showCopyButton = false }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        if (!copyableValue || !navigator.clipboard) return;
        try {
            await navigator.clipboard.writeText(copyableValue);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className={`relative bg-white/5 backdrop-blur-xl p-6 rounded-2xl border ${isPrimary ? 'bg-orange-500/10 border-orange-500/30' : 'border-white/10'}`}>
            <h3 className="text-sm font-medium text-gray-400">{title}</h3>
            <p className={`mt-2 text-2xl md:text-3xl font-light tracking-tight ${isPrimary ? 'text-orange-300' : 'text-white'}`}>{value}</p>
            {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
             {isPrimary && title === "手数料差引後の受取BTC量" && (
                <p className="text-xs text-orange-300 mt-3">
                    👆 この値をbitFlyerの注文画面にコピー＆ペーストしてください。
                </p>
            )}
            
            {(isPrimary || showCopyButton) && copyableValue && (
                <div className="absolute top-3 right-3 group">
                    <button
                        onClick={handleCopy}
                        className="p-2 bg-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/20 transition-all duration-200 active:scale-95 focus:outline-none"
                        aria-label="クリップボードにコピー"
                    >
                        {isCopied ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        )}
                    </button>
                    <div className={`absolute -top-10 right-1/2 translate-x-1/2 px-3 py-1.5 bg-slate-800/90 backdrop-blur-sm text-white text-xs rounded-lg pointer-events-none transition-opacity duration-200 ${isCopied ? 'opacity-100' : 'opacity-0'}`}>
                        コピーしました！
                        <div className="absolute top-full right-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800/90"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="mt-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700 animate-fade-in">
        <h2 className="text-lg font-semibold text-center mb-4 text-gray-200">手数料計算結果</h2>
        <div className="space-y-4">
            <ResultCard 
                title="手数料差引後の受取金額" 
                value={result.netAmount} 
                isPrimary={true}
                copyableValue={result.copyableValues.netAmount}
                showCopyButton={true}
            />
            {result.netBTCAmount && (
                <ResultCard 
                    title="手数料差引後の受取BTC量" 
                    value={result.netBTCAmount} 
                    isPrimary={true}
                    copyableValue={result.copyableValues.netBTCAmount}
                    showCopyButton={true}
                />
            )}
            
            <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="text-center p-3 bg-gray-900/30 rounded-lg border border-gray-600">
                    <p className="text-xs text-gray-400">注文金額/数量</p>
                    <p className="text-sm font-medium text-white">{result.orderAmount}</p>
                    {result.orderAmountSubtext && (
                        <p className="text-xs text-gray-500">{result.orderAmountSubtext}</p>
                    )}
                </div>
                <div className="text-center p-3 bg-gray-900/30 rounded-lg border border-gray-600">
                    <p className="text-xs text-gray-400">手数料</p>
                    <p className="text-sm font-medium text-white">{result.feeAmount}</p>
                </div>
                <div className="text-center p-3 bg-gray-900/30 rounded-lg border border-gray-600">
                    <p className="text-xs text-gray-400">手数料率</p>
                    <p className="text-sm font-medium text-white">{result.feeRate}</p>
                </div>
            </div>
        </div>
        <style>{`
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
                animation: fade-in 0.5s ease-out forwards;
            }
        `}</style>
    </div>
  );
};

export default ResultDisplay;
