import { useState } from 'react';
import PostDetail from './components/PostDetail';
import MainLayout from './components/MainLayout';
import CreatePost from './components/CreatePost';
import IPHub from './components/IPHub';
import CreatorHub from './components/CreatorHub';

export type ViewState = 'home' | 'post_detail' | 'create_post' | 'profile' | 'ip_hub' | 'creator_center';

// 本地存储hook
const usePersistentState = <T,>(key: string, defaultValue: T) => {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setPersistentState = (newValue: T | ((prev: T) => T)) => {
    setState(prev => {
      const value = typeof newValue === 'function' ? (newValue as (prev: T) => T)(prev) : newValue;
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }
      return value;
    });
  };

  return [state, setPersistentState] as const;
};

const HINT_ITEMS = [
  { num: '1', label: '情绪社交的产生', desc: '主页 → 任意帖子 → 切换至评论旁的「世界」模式\n（注：两种模式的数据互通）' },
  { num: '2', label: '情绪社交的沉淀', desc: '我 → 我的IP（个人IP名片）' },
  { num: '3', label: '情绪社交的管理与提炼', desc: '我 → 左上角三条横线 → 创作者中心' },
];

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [hintDismissed, setHintDismissed] = useState(false);
  const [refreshGifsCount] = useState(0);
  const [refreshClustersCount] = useState(0);
  const [customInteractionGifs] = usePersistentState<Record<string, string>>('customInteractionGifs', {});
  const [customInteractionEffects] = usePersistentState<Record<string, string>>('customInteractionEffects', {});
  const [clusterAuraEnabled] = usePersistentState<boolean>('clusterAuraEnabled', true);
  const [clusterParticlesEnabled] = usePersistentState<boolean>('clusterParticlesEnabled', true);
  const [clusterLocalAssetsEnabled] = usePersistentState<boolean>('clusterLocalAssetsEnabled', true);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans relative gap-8">
      {/* Hint card — outside the phone frame */}
      {!hintDismissed && (
        <div className="absolute top-8 left-8 w-[240px] bg-white rounded-2xl shadow-lg border border-gray-100 p-4 z-50">
          <button
            onClick={() => setHintDismissed(true)}
            className="absolute top-2.5 right-3 text-gray-300 hover:text-gray-500 text-lg leading-none"
          >×</button>
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-sm">💡</span>
            <span className="text-[12px] font-bold text-[#333]">使用指南</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {HINT_ITEMS.map(item => (
              <div key={item.num} className="flex gap-2 items-start">
                <span className="w-4 h-4 rounded-full bg-[#ff2442] text-white text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">{item.num}</span>
                <div>
                  <div className="text-[11px] font-semibold text-[#333]">{item.label}</div>
                  <div className="text-[10px] text-[#888] mt-0.5 whitespace-pre-line leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div id="app-container" className="w-full max-w-[400px] h-[800px] bg-white rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col border-[8px] border-gray-900">
        {currentView === 'home' && <MainLayout currentTab="home" onNavigate={setCurrentView} />}
        {currentView === 'profile' && <MainLayout currentTab="profile" onNavigate={setCurrentView} />}
        {currentView === 'post_detail' && <PostDetail onBack={() => setCurrentView('home')} refreshGifs={refreshGifsCount} refreshClusters={refreshClustersCount} clusterAuraEnabled={clusterAuraEnabled} clusterParticlesEnabled={clusterParticlesEnabled} clusterLocalAssetsEnabled={clusterLocalAssetsEnabled} customInteractionEffects={customInteractionEffects} customInteractionGifs={customInteractionGifs} />}
        {currentView === 'create_post' && <CreatePost onBack={() => setCurrentView('home')} />}
        {currentView === 'ip_hub' && <IPHub onBack={() => setCurrentView('profile')} />}
        {currentView === 'creator_center' && <CreatorHub onBack={() => setCurrentView('profile')} />}
      </div>
    </div>
  );
}
