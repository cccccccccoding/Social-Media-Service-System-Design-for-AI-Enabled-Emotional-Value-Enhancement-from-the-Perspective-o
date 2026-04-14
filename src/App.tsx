import React, { useState, useEffect, useMemo, useRef } from 'react';
import PostDetail from './components/PostDetail';
import MainLayout from './components/MainLayout';
import CreatePost from './components/CreatePost';
import IPHub from './components/IPHub';
import CreatorHub from './components/CreatorHub';
import { RefreshCw, Sparkles, Play, RotateCw, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type ViewState = 'home' | 'post_detail' | 'create_post' | 'profile' | 'ip_hub' | 'creator_center';

// SafeIpImage组件
const SafeIpImage = ({ src, className, alt, style }: { src: string, className?: string, alt?: string, style?: React.CSSProperties }) => {
  const [error, setError] = useState(false);
  
  const fallbackSrc = '/gifs/兔-送蛋糕.gif';
  
  if (error || !src) {
    return (
      <img 
        src={fallbackSrc} 
        className={className} 
        alt={alt || 'IP'} 
        style={style}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <img 
      src={encodeURIComponent(src).replace(/%2F/g, '/')} 
      className={className} 
      alt={alt || 'IP'} 
      style={style}
      onError={() => setError(true)} 
      referrerPolicy="no-referrer"
    />
  );
};

// 真正的交互动画组件（从MicroTheater提取）
const InteractionTheater = ({ sourceIp, targetIp, action, animStyle, customEffect }: any) => {
  const [stage, setStage] = useState('enter');

  useEffect(() => {
    setStage('enter');
    const t1 = setTimeout(() => setStage('interact'), 300);
    const t2 = setTimeout(() => setStage('leave'), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [sourceIp, targetIp, customEffect]);

  // Generate particles based on style
  const particles = useMemo(() => {
    if (animStyle === 'firework') {
      return Array.from({ length: 15 }).map((_, i) => ({
        type: 'dot',
        angle: (i / 15) * Math.PI * 2,
        distance: 25 + Math.random() * 35,
        size: 3 + Math.random() * 4,
        delay: Math.random() * 0.2,
        duration: 0.8
      }));
    } else if (animStyle === 'droplets') {
      return Array.from({ length: 10 }).map((_, i) => ({
        type: 'drop',
        x: (Math.random() - 0.5) * 60,
        y: -15 - Math.random() * 25,
        size: 3 + Math.random() * 3,
        delay: Math.random() * 0.3,
        duration: 0.6
      }));
    } else if (animStyle === 'gentle') {
      return Array.from({ length: 8 }).map((_, i) => ({
        type: 'orb',
        x: (Math.random() - 0.5) * 50,
        y: -20 - Math.random() * 30,
        size: 6 + Math.random() * 8,
        delay: Math.random() * 0.5,
        duration: 1.5
      }));
    } else { // intense
      return Array.from({ length: 20 }).map((_, i) => ({
        type: 'spark',
        angle: (i / 20) * Math.PI * 2,
        distance: 50 + Math.random() * 25,
        size: 1.5 + Math.random() * 2,
        delay: 0,
        duration: 0.4
      }));
    }
  }, [animStyle]);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-transparent to-gray-100/30 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* 目标 IP */}
        <motion.div 
          className="absolute z-10 flex flex-col items-center"
          animate={{ 
            x: stage === 'interact' ? -18 : -50,
            y: stage === 'enter' ? 15 : (stage === 'interact' ? -3 : -22),
            scale: stage === 'interact' ? 1.1 : 0.8,
            opacity: stage === 'leave' ? 0 : (stage === 'enter' ? 0 : 1)
          }}
          initial={{ opacity: 0, y: 30, x: -50 }}
          transition={{ type: 'spring', stiffness: 120, damping: 15, duration: 0.5 }}
        >
          <SafeIpImage src={targetIp} className="w-10 h-10 object-contain drop-shadow-lg" alt="Target IP" />
        </motion.div>

        {/* 来源 IP */}
        <motion.div 
          className="absolute z-10 flex flex-col items-center"
          animate={{ 
            x: stage === 'interact' ? 18 : 50,
            y: stage === 'enter' ? 15 : (stage === 'interact' ? 3 : -15),
            scale: stage === 'interact' ? 1.1 : 0.8,
            opacity: stage === 'leave' ? 0 : (stage === 'enter' ? 0 : 1)
          }}
          initial={{ opacity: 0, y: 30, x: 50 }}
          transition={{ type: 'spring', stiffness: 120, damping: 15, duration: 0.5 }}
        >
          <SafeIpImage src={sourceIp} className="w-10 h-10 object-contain drop-shadow-lg" alt="Source IP" />
        </motion.div>

        {/* 特效 */}
        <AnimatePresence>
          {stage === 'interact' && (
            <motion.div
              className="absolute z-20 flex items-center justify-center"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {customEffect ? (
                <motion.img
                  src={customEffect}
                  alt="Custom Effect"
                  className="w-24 h-24 object-contain"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 0.5] }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              ) : (
                particles.map((p, i) => {
                  if (p.type === 'dot' || p.type === 'spark') {
                    return (
                      <motion.div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{ width: p.size, height: p.size, boxShadow: '0 0 10px rgba(255,255,255,0.8)' }}
                        initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                        animate={{ 
                          x: Math.cos(p.angle) * p.distance, 
                          y: Math.sin(p.angle) * p.distance,
                          scale: [0, 1, 0],
                          opacity: [1, 1, 0]
                        }}
                        transition={{ duration: p.duration, ease: "easeOut", delay: p.delay }}
                      />
                    );
                  } else if (p.type === 'drop') {
                    return (
                      <motion.div
                        key={i}
                        className="absolute bg-white"
                        style={{ 
                          width: p.size, 
                          height: p.size * 2, 
                          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                          boxShadow: '0 0 8px rgba(255,255,255,0.6)' 
                        }}
                        initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                        animate={{ 
                          x: p.x, 
                          y: [0, -40, p.y],
                          scale: [0, 1, 0],
                          opacity: [1, 1, 0]
                        }}
                        transition={{ duration: p.duration, ease: "easeInOut", delay: p.delay }}
                      />
                    );
                  } else if (p.type === 'orb') {
                    return (
                      <motion.div
                        key={i}
                        className="absolute rounded-full bg-white/60 blur-sm"
                        style={{ width: p.size, height: p.size }}
                        initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                        animate={{ 
                          x: p.x, 
                          y: p.y,
                          scale: [0, 1, 1.5, 0],
                          opacity: [0, 0.8, 0]
                        }}
                        transition={{ duration: p.duration, ease: "easeOut", delay: p.delay }}
                      />
                    );
                  }
                  return null;
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// 图片处理函数
const processImageFile = (file: File, maxWidth: number = 800): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      
      // 检查是否是GIF（通过文件类型或文件名后缀）
      const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');
      
      if (isGif) {
        if (result.length > 3 * 1024 * 1024) {
           console.warn('GIF is too large, saving first frame only to save space.');
        } else {
          resolve(result);
          return;
        }
      }
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/webp', 0.6));
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  });
};

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

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRefreshingClusters, setIsRefreshingClusters] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState('');
  const [refreshGifsCount, setRefreshGifsCount] = useState(0);
  const [refreshClustersCount, setRefreshClustersCount] = useState(0);
  const [gifsLoaded, setGifsLoaded] = useState(false);
  const [gifsConfig, setGifsConfig] = useState<string[]>([]);
  const [playingInteraction, setPlayingInteraction] = useState<string | null>(null);
  const [customInteractionGifs, setCustomInteractionGifs] = usePersistentState<Record<string, string>>('customInteractionGifs', {});
  const [customInteractionEffects, setCustomInteractionEffects] = usePersistentState<Record<string, string>>('customInteractionEffects', {});
  const [uploadingInteraction, setUploadingInteraction] = useState<string | null>(null);
  const [uploadingInteractionEffect, setUploadingInteractionEffect] = useState<string | null>(null);
  const [showClusterMenu, setShowClusterMenu] = useState(false);
  const [clusterAuraEnabled, setClusterAuraEnabled] = usePersistentState<boolean>('clusterAuraEnabled', true);
  const [clusterParticlesEnabled, setClusterParticlesEnabled] = usePersistentState<boolean>('clusterParticlesEnabled', true);
  const [clusterLocalAssetsEnabled, setClusterLocalAssetsEnabled] = usePersistentState<boolean>('clusterLocalAssetsEnabled', true);
  const actionInputRef = useRef<HTMLInputElement>(null);
  const effectInputRef = useRef<HTMLInputElement>(null);
  
  // 加载GIF配置
  useEffect(() => {
    const loadGifs = async () => {
      try {
        const response = await fetch('/gifs/config.json');
        const data = await response.json();
        setGifsConfig(data.gifs || []);
        setGifsLoaded(true);
      } catch (error) {
        console.error('Failed to load GIF config:', error);
        setGifsLoaded(true);
      }
    };
    loadGifs();
  }, [refreshGifsCount]);
  
  // 随机获取GIF
  const getRandomGif = () => {
    if (gifsConfig.length === 0) return '/gifs/兔-送蛋糕.gif';
    return gifsConfig[Math.floor(Math.random() * gifsConfig.length)];
  };
  
  // 获取特定的GIF作为备用
  const getFallbackGif = () => {
    return '/gifs/兔-送蛋糕.gif';
  };
  
  // 获取交互动效用的GIF（优先使用自定义的）
  const getInteractionGif = (key: string) => {
    if (customInteractionGifs[key]) {
      return customInteractionGifs[key];
    }
    return getRandomGif();
  };
  
  // 动画风格列表
  const animationStyles = ['firework', 'droplets', 'gentle', 'intense'];
  const animationStyleNames = {
    firework: '烟花',
    droplets: '水滴',
    gentle: '柔和',
    intense: '闪耀'
  };
  
  // IP交互动效列表
  const ipInteractions = [
    { 
      name: '抱抱', 
      description: '给对方一个温暖的拥抱', 
      key: 'hug',
      animStyle: 'firework'
    },
    { 
      name: '撒花', 
      description: '开心地撒花庆祝', 
      key: 'flower',
      animStyle: 'droplets'
    },
    { 
      name: '贴贴', 
      description: '贴贴安慰对方', 
      key: 'pat',
      animStyle: 'gentle'
    },
    { 
      name: '加油', 
      description: '为对方加油打气', 
      key: 'cheer',
      animStyle: 'intense'
    }
  ];

  const handleRefreshGifs = async () => {
    setIsRefreshing(true);
    setRefreshMessage('正在刷新动图...');
    
    setRefreshGifsCount(prev => prev + 1);
    
    setTimeout(() => {
      setRefreshMessage('动图已刷新！');
      setIsRefreshing(false);
      setTimeout(() => setRefreshMessage(''), 3000);
    }, 1000);
  };

  const handleRefreshClusters = async () => {
    setIsRefreshingClusters(true);
    setRefreshMessage('正在刷新小团组视觉...');
    
    // 增加计数器，触发组件重新加载配置
    setRefreshClustersCount(prev => prev + 1);
    
    setTimeout(() => {
      setRefreshMessage('小团组视觉已刷新！');
      setIsRefreshingClusters(false);
      setTimeout(() => setRefreshMessage(''), 3000);
    }, 1000);
  };

  const handleResetClusters = async () => {
    setIsRefreshingClusters(true);
    setRefreshMessage('正在重置为默认光晕...');
    
    // 增加计数器，触发组件重新加载配置
    setRefreshClustersCount(prev => prev + 1);
    
    setTimeout(() => {
      setRefreshMessage('已切换到默认光晕！');
      setIsRefreshingClusters(false);
      setTimeout(() => setRefreshMessage(''), 3000);
    }, 1000);
  };

  const handlePlayInteraction = (key: string) => {
    setPlayingInteraction(key);
    setTimeout(() => setPlayingInteraction(null), 2500);
  };

  const handleActionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingInteraction) {
      const compressed = await processImageFile(file, 150);
      setCustomInteractionGifs(prev => {
        const newGifs = { ...prev, [uploadingInteraction]: compressed };
        
        let stringified = JSON.stringify(newGifs);
        while (stringified.length > 2 * 1024 * 1024) {
          const keys = Object.keys(newGifs);
          if (keys.length <= 1) break;
          const keyToRemove = keys.find(k => k !== uploadingInteraction);
          if (keyToRemove) {
            delete newGifs[keyToRemove];
            stringified = JSON.stringify(newGifs);
          } else {
            break;
          }
        }
        
        return newGifs;
      });
    }
    setUploadingInteraction(null);
    e.target.value = '';
  };

  const handleActionContextMenu = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    setUploadingInteraction(key);
    actionInputRef.current?.click();
  };

  const resetActionGif = (key: string) => {
    setCustomInteractionGifs(prev => {
      const newGifs = { ...prev };
      delete newGifs[key];
      return newGifs;
    });
  };

  const handleEffectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingInteractionEffect) {
      const compressed = await processImageFile(file, 200);
      setCustomInteractionEffects(prev => {
        const newEffects = { ...prev, [uploadingInteractionEffect]: compressed };
        
        let stringified = JSON.stringify(newEffects);
        while (stringified.length > 3 * 1024 * 1024) {
          const keys = Object.keys(newEffects);
          if (keys.length <= 1) break;
          const keyToRemove = keys.find(k => k !== uploadingInteractionEffect);
          if (keyToRemove) {
            delete newEffects[keyToRemove];
            stringified = JSON.stringify(newEffects);
          } else {
            break;
          }
        }
        
        return newEffects;
      });
    }
    setUploadingInteractionEffect(null);
    e.target.value = '';
  };

  const handleEffectContextMenu = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    setUploadingInteractionEffect(key);
    effectInputRef.current?.click();
  };

  const resetActionEffect = (key: string) => {
    setCustomInteractionEffects(prev => {
      const newEffects = { ...prev };
      delete newEffects[key];
      return newEffects;
    });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans relative gap-8">
      {/* 隐藏的文件输入 */}
      <input
        ref={actionInputRef}
        type="file"
        accept="image/*,image/gif"
        className="hidden"
        onChange={handleActionUpload}
      />
      <input
        ref={effectInputRef}
        type="file"
        accept="image/*,image/gif"
        className="hidden"
        onChange={handleEffectUpload}
      />
      
      {/* IP交互动效展示区 */}
      <div className="fixed left-2 top-1/2 -translate-y-1/2 z-40 bg-white/80 backdrop-blur-xl rounded-xl shadow-xl p-3 w-64 border border-gray-200 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <h3 className="font-bold text-gray-800 text-sm">IP交互动效</h3>
        </div>
        
        <div className="text-xs text-gray-500 mb-2">
          右键点击左侧IP图可上传自定义IP；右键点击动效名可上传自定义特效
        </div>
        
        <div className="space-y-2">
          {ipInteractions.map((interaction) => (
            <div 
              key={interaction.key} 
              className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-2.5 border border-purple-100"
            >
              <div className="flex items-center justify-between mb-1">
                <div 
                  className="cursor-pointer"
                  onContextMenu={(e) => handleEffectContextMenu(e, interaction.key)}
                >
                  <div className="font-semibold text-gray-800 text-xs flex items-center gap-1">
                    {interaction.name}
                    {customInteractionEffects[interaction.key] && (
                      <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full" title="已设置自定义特效" />
                    )}
                  </div>
                  <div className="text-xs text-purple-600">
                    {animationStyleNames[interaction.animStyle as keyof typeof animationStyleNames]}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {customInteractionEffects[interaction.key] && (
                    <button
                      onClick={() => resetActionEffect(interaction.key)}
                      className="w-6 h-6 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center hover:bg-yellow-200 transition-colors text-xs"
                      title="重置特效为默认"
                    >
                      ✨
                    </button>
                  )}
                  {customInteractionGifs[interaction.key] && (
                    <button
                      onClick={() => resetActionGif(interaction.key)}
                      className="w-6 h-6 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors text-xs"
                      title="重置IP为默认"
                    >
                      ↺
                    </button>
                  )}
                  <button
                    onClick={() => handlePlayInteraction(interaction.key)}
                    onContextMenu={(e) => handleActionContextMenu(e, interaction.key)}
                    className="w-7 h-7 bg-purple-500 text-white rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors shadow"
                    title="播放动效 (右键上传IP)"
                  >
                    {playingInteraction === interaction.key ? (
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-600 mb-1">{interaction.description}</div>
              
              <AnimatePresence>
                {playingInteraction === interaction.key && (
                  <div className="h-32 overflow-hidden rounded-lg">
                    <InteractionTheater
                      key={interaction.key + Date.now()}
                      sourceIp={getInteractionGif(interaction.key)}
                      targetIp={getRandomGif()}
                      action={{}}
                      animStyle={interaction.animStyle}
                      customEffect={customInteractionEffects[interaction.key]}
                    />
                  </div>
                )}
              </AnimatePresence>
              
              {playingInteraction !== interaction.key && (
                <div className="flex items-center justify-center gap-1.5 py-1.5 bg-gray-100/50 rounded-md">
                  <div 
                    className="relative"
                    onContextMenu={(e) => handleActionContextMenu(e, interaction.key)}
                  >
                    <SafeIpImage 
                      src={getInteractionGif(interaction.key)} 
                      alt="" 
                      className="w-7 h-7 object-contain rounded-full border border-white shadow-sm cursor-pointer" 
                    />
                    {customInteractionGifs[interaction.key] && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white" />
                    )}
                  </div>
                  <div className="text-gray-400 text-sm">→</div>
                  <SafeIpImage 
                    src={getRandomGif()} 
                    alt="" 
                    className="w-7 h-7 object-contain rounded-full border border-white shadow-sm" 
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 刷新动图按钮 */}
      <button
        onClick={handleRefreshGifs}
        disabled={isRefreshing}
        className="fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
        title="扫描并刷新本地动图"
      >
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        刷新动图
      </button>

      {/* 小团组视觉控制 */}
      <div className="fixed top-16 right-4 z-50 relative">
        <button
          onClick={() => setShowClusterMenu(!showClusterMenu)}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          title="小团组视觉控制"
        >
          <Sparkles className="w-4 h-4" />
          小团组
        </button>
        {showClusterMenu && (
          <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl p-2 w-48 border border-gray-200">
            <button
              onClick={() => setClusterAuraEnabled(!clusterAuraEnabled)}
              className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors flex items-center justify-between ${clusterAuraEnabled ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
            >
              <span>白色光晕</span>
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${clusterAuraEnabled ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                {clusterAuraEnabled && <span className="w-3 h-3 bg-white rounded-full" />}
              </span>
            </button>
            <button
              onClick={() => setClusterParticlesEnabled(!clusterParticlesEnabled)}
              className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors flex items-center justify-between ${clusterParticlesEnabled ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
            >
              <span>光点</span>
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${clusterParticlesEnabled ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                {clusterParticlesEnabled && <span className="w-3 h-3 bg-white rounded-full" />}
              </span>
            </button>
            <button
              onClick={() => setClusterLocalAssetsEnabled(!clusterLocalAssetsEnabled)}
              className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors flex items-center justify-between ${clusterLocalAssetsEnabled ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
            >
              <span>本地资产</span>
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${clusterLocalAssetsEnabled ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                {clusterLocalAssetsEnabled && <span className="w-3 h-3 bg-white rounded-full" />}
              </span>
            </button>
            <button
              onClick={handleResetClusters}
              disabled={isRefreshingClusters}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors flex items-center gap-2 ${isRefreshingClusters ? 'text-gray-400' : 'text-gray-700'}"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshingClusters ? 'animate-spin' : ''}`} />
              重置为默认光晕
            </button>
            <button
              onClick={handleRefreshClusters}
              disabled={isRefreshingClusters}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors flex items-center gap-2 ${isRefreshingClusters ? 'text-gray-400' : 'text-gray-700'}"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshingClusters ? 'animate-spin' : ''}`} />
              刷新本地资产
            </button>
          </div>
        )}
      </div>

      {/* 刷新消息提示 */}
      {refreshMessage && (
        <div className="fixed top-28 right-4 z-50 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-lg shadow-lg text-sm max-w-xs">
          {refreshMessage}
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
