import { useState } from 'react';
import { Mail, Sparkles, Check, Copy } from 'lucide-react';
import { rewriteEmail } from './services/emailRewriter';

type ToneType = 'formal' | 'friendly' | 'urgent';

function App() {
  const [inputEmail, setInputEmail] = useState('');
  const [outputEmail, setOutputEmail] = useState('');
  const [selectedTone, setSelectedTone] = useState<ToneType>('formal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRewrite = async () => {
    if (!inputEmail.trim()) return;

    setIsProcessing(true);
    try {
      const result = await rewriteEmail(inputEmail, selectedTone);
      setOutputEmail(result);
    } catch (error) {
      console.error('Error rewriting email:', error);
      setOutputEmail('Error processing email. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Mail className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            Email Tone Rewriter
          </h1>
          <p className="text-slate-600 text-lg">
            Transform your emails with perfect tone and grammar
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700 mb-2 block">
                  Original Email
                </span>
                <textarea
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="Paste your email here..."
                  className="w-full h-64 px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none text-slate-700"
                />
              </label>

              <div>
                <span className="text-sm font-semibold text-slate-700 mb-3 block">
                  Select Tone
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {(['formal', 'friendly', 'urgent'] as ToneType[]).map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setSelectedTone(tone)}
                      className={`px-4 py-3 rounded-lg font-medium transition-all ${
                        selectedTone === tone
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {tone.charAt(0).toUpperCase() + tone.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleRewrite}
                disabled={!inputEmail.trim() || isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Rewrite Email
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">
                  Rewritten Email
                </span>
                {outputEmail && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="w-full h-64 px-4 py-3 border-2 border-slate-200 rounded-lg bg-slate-50 overflow-y-auto">
                {outputEmail ? (
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {outputEmail}
                  </p>
                ) : (
                  <p className="text-slate-400 italic">
                    Your rewritten email will appear here...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-blue-600 mb-1">Formal</h3>
              <p className="text-sm text-slate-600">
                Professional and polished tone suitable for business communications
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600 mb-1">Friendly</h3>
              <p className="text-sm text-slate-600">
                Warm and approachable tone perfect for casual correspondence
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-600 mb-1">Urgent</h3>
              <p className="text-sm text-slate-600">
                Direct and action-oriented tone for time-sensitive matters
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
