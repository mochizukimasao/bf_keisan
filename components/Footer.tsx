import React, { useState } from 'react';

const Footer: React.FC = () => {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

  const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-6 text-sm text-gray-700 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <footer className="mt-12 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
          <button
            onClick={() => setShowManual(true)}
            className="hover:text-blue-600 transition-colors"
          >
            使い方
          </button>
          <button
            onClick={() => setShowFAQ(true)}
            className="hover:text-blue-600 transition-colors"
          >
            よくある質問
          </button>
          <button
            onClick={() => setShowPrivacy(true)}
            className="hover:text-blue-600 transition-colors"
          >
            プライバシーポリシー
          </button>
          <button
            onClick={() => setShowTerms(true)}
            className="hover:text-blue-600 transition-colors"
          >
            利用規約
          </button>
        </div>
        <div className="text-center mt-4 text-xs text-gray-400">
          © 2025 BF_Keisan by mochizuki masao. All rights reserved.
        </div>
      </footer>

      <Modal isOpen={showManual} onClose={() => setShowManual(false)} title="使い方">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">基本的な使い方</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>「金額（日本円）」欄に取引したい金額を入力してください（例：100,000円）</li>
            <li>「BTC数量」欄に取引したいBTCの数量を入力してください（例：0.01BTC）</li>
            <li>「手数料率」はデフォルトで0.15%に設定されています</li>
            <li>「計算する」ボタンをクリックすると、手数料を差し引いた実際の受取金額が表示されます</li>
          </ol>
          
          <h3 className="font-semibold text-gray-900 mt-6">便利な機能</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>リアルタイム価格表示：現在のBTC価格が自動で更新されます</li>
            <li>コピー機能：計算結果や価格をワンクリックでコピーできます</li>
            <li>クリップボード貼り付け：金額や数量を他のアプリからコピー＆ペーストできます</li>
          </ul>

          <h3 className="font-semibold text-gray-900 mt-6">計算式</h3>
          <p className="bg-gray-50 p-3 rounded-lg">
            総取引金額 = 金額 × BTC数量<br/>
            手数料 = 総取引金額 × 手数料率<br/>
            受取金額 = 総取引金額 - 手数料
          </p>
        </div>
      </Modal>

      <Modal isOpen={showFAQ} onClose={() => setShowFAQ(false)} title="よくある質問">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900">Q: 手数料率は変更できますか？</h3>
            <p className="mt-1">A: はい、「手数料率」欄で自由に変更できます。bitFlyerの現在の手数料率は0.15%です。</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">Q: リアルタイム価格が表示されません</h3>
            <p className="mt-1">A: WebSocket接続に失敗した場合、30秒間隔でAPIから価格を取得します。しばらくお待ちください。</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">Q: 計算結果は正確ですか？</h3>
            <p className="mt-1">A: このツールは参考用です。実際の取引では、スプレッドや市場の変動により結果が異なる場合があります。</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">Q: どの取引所に対応していますか？</h3>
            <p className="mt-1">A: bitFlyerの取引所（Lightning）での取引を想定しています。販売所のスプレッドには対応していません。</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">Q: データは保存されますか？</h3>
            <p className="mt-1">A: いいえ、入力したデータは保存されません。ブラウザを閉じると消去されます。</p>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} title="プライバシーポリシー">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">データの取り扱いについて</h3>
          <p>本ツールは、ユーザーの入力データを一切保存・収集しません。すべての計算はブラウザ内で行われ、外部サーバーにデータが送信されることはありません。</p>
          
          <h3 className="font-semibold text-gray-900">外部サービスとの連携</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>BitFlyer WebSocket API：リアルタイム価格取得のため</li>
            <li>BitFlyer REST API：価格データのフォールバック取得のため</li>
          </ul>
          
          <h3 className="font-semibold text-gray-900">Cookie</h3>
          <p>本ツールはCookieを使用しません。</p>
          
          <h3 className="font-semibold text-gray-900">お問い合わせ</h3>
          <p>プライバシーに関するお問い合わせは、開発者までご連絡ください。</p>
        </div>
      </Modal>

      <Modal isOpen={showTerms} onClose={() => setShowTerms(false)} title="利用規約">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">利用について</h3>
          <p>本ツールは無料でご利用いただけます。商用・非商用問わずご利用ください。</p>
          
          <h3 className="font-semibold text-gray-900">免責事項</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>本ツールの計算結果は参考用であり、正確性を保証しません</li>
            <li>実際の取引では、スプレッドや市場の変動により結果が異なる場合があります</li>
            <li>投資判断は必ずご自身の責任で行ってください</li>
            <li>本ツールを使用したことによる損害について、開発者は一切の責任を負いません</li>
          </ul>
          
          <h3 className="font-semibold text-gray-900">禁止事項</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>本ツールの悪用や不正利用</li>
            <li>他のユーザーへの迷惑行為</li>
            <li>システムへの攻撃や妨害行為</li>
          </ul>
          
          <h3 className="font-semibold text-gray-900">規約の変更</h3>
          <p>本規約は予告なく変更される場合があります。最新の規約をご確認ください。</p>
        </div>
      </Modal>
    </>
  );
};

export default Footer;
