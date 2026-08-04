import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Server, CheckCircle2, AlertTriangle, Settings, RefreshCw, X } from 'lucide-react';
export const BackendStatusBanner = () => {
    const { backendUrl, isBackendConnected, checkBackendConnection, updateBackendUrl } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [inputUrl, setInputUrl] = useState(backendUrl);
    const [testing, setTesting] = useState(false);
    const [message, setMessage] = useState('');
    const [dismissed, setDismissed] = useState(false);
    const handleTest = async () => {
        setTesting(true);
        setMessage('');
        const success = await updateBackendUrl(inputUrl);
        setTesting(false);
        if (success) {
            setMessage('Connected successfully to Flask backend!');
            setTimeout(() => setShowModal(false), 1500);
        }
        else {
            setMessage(`Unable to connect to ${inputUrl}. Please ensure your Flask app is running.`);
        }
    };
    if (dismissed && isBackendConnected !== false)
        return null;
    return (<>
      {/* Top Warning Banner if Flask backend is not reachable */}
      {isBackendConnected === false && !dismissed && (<div className="bg-amber-950/80 border-b border-amber-500/30 text-amber-200 px-4 py-2.5 text-xs sm:text-sm flex flex-wrap items-center justify-between gap-2 z-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0"/>
            <span>
              <strong>Flask Backend Offline:</strong> Cannot reach backend at{' '}
              <code className="bg-black/40 px-1.5 py-0.5 rounded text-amber-300">{backendUrl}</code>. Make sure your Flask server is running on port 5000.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => {
                setInputUrl(backendUrl);
                setShowModal(true);
            }} className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded text-xs transition-colors flex items-center gap-1">
              <Settings className="w-3.5 h-3.5"/> Configure Server
            </button>
            <button onClick={() => setDismissed(true)} className="text-amber-400 hover:text-white p-0.5" title="Dismiss banner">
              <X className="w-4 h-4"/>
            </button>
          </div>
        </div>)}

      {/* Config Modal */}
      {showModal && (<div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181a24] border border-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Server className="w-5 h-5 text-red-500"/>
                <h3 className="text-lg font-bold text-white">Flask Backend Configuration</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5">
                <X className="w-5 h-5"/>
              </button>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed">
              CineAddict frontend consumes REST APIs from your existing Flask backend project.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Flask API Base URL
              </label>
              <input type="text" value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} placeholder="http://127.0.0.1:5000" className="w-full px-3.5 py-2.5 bg-[#0d0e12] border border-gray-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-red-500"/>
            </div>

            {message && (<p className={`text-xs px-3 py-2 rounded font-medium ${isBackendConnected ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' : 'bg-red-950/60 text-red-400 border border-red-800/40'}`}>
                {message}
              </p>)}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                Status:{' '}
                {isBackendConnected ? (<span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5"/> Online
                  </span>) : (<span className="text-amber-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5"/> Offline
                  </span>)}
              </div>

              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-gray-300 hover:bg-white/5">
                  Cancel
                </button>
                <button type="button" disabled={testing} onClick={handleTest} className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50">
                  {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin"/> : null}
                  Test & Save
                </button>
              </div>
            </div>
          </div>
        </div>)}
    </>);
};
export default BackendStatusBanner;
