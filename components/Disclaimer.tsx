import React from 'react';

const Disclaimer: React.FC = () => {
  return (
    <div className="text-xs text-gray-400 text-left bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
      <h4 className="font-semibold text-gray-300 mb-3">手数料の仕組み</h4>
      <div className="mb-4">
        <p className="mb-2">手数料は約定金額から差し引かれます。例：0.01BTC × 7,000,000円 = 70,000円の取引で、手数料105円（0.15%）が差し引かれ、受取金額は69,895円になります。</p>
      </div>
      
      <h4 className="font-semibold text-gray-300 mb-3">免責事項</h4>
      <ul className="list-disc list-inside space-y-1">
        <li>
          本ツールはbitFlyerの取引所（Lightning）での取引を想定しています。スプレッドが実質的な手数料となる販売所には対応しておりません。
        </li>
        <li>本ツールの計算は参考用であり、正確性を保証しません。</li>
        <li>
          実際の取引価格、スプレッド、手数量の変更等により結果は異なる場合があります。
        </li>
        <li>
          実際の取引は必ずbitFlyer公式画面でご確認の上、ご自身の判断で行ってください。
        </li>
        <li>本ツールは金融商品取引法に基づく投資助言ではありません。</li>
      </ul>
    </div>
  );
};

export default Disclaimer;
