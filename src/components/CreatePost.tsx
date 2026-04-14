import React, { useState, useRef } from 'react';
import { usePersistentState } from '../hooks/usePersistentState';
import { Plus } from 'lucide-react';

export default function CreatePost({ onBack }: { onBack: () => void }) {
  const [screen, setScreen] = useState<'write' | 'select' | 'edit' | 'publish'>('write');
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('基础');
  const [isOptimizeOpen, setIsOptimizeOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetImage, setTargetImage] = usePersistentState<string | null>('targetImage', null);

  const handleNextFromWrite = () => {
    if (!text.trim()) {
      setText('你好');
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setScreen('select');
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTargetImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-[#dcfce7] via-[#f0fdf4] to-white relative flex flex-col overflow-hidden">
      {/* Hidden file input for image upload */}
      <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />

      {/* Screen: Write */}
      {screen === 'write' && (
        <div className="flex flex-col h-full p-5 animate-[slideIn_0.3s_ease-out]">
          <div className="flex justify-between items-center mb-5 mt-7 shrink-0">
            <span className="text-xl cursor-pointer p-1" onClick={onBack}>✕</span>
            <button className="bg-[#ff2442] text-white px-4 py-2 rounded-full font-medium" onClick={handleNextFromWrite}>下一步</button>
          </div>
          <div className="bg-white rounded-2xl p-5 flex-1 mb-5 shadow-sm relative flex flex-col">
            <div className="text-4xl text-[#e5e5e5] font-bold leading-none mb-2">“</div>
            <textarea 
              className="w-full border-none outline-none resize-none text-xl flex-1" 
              placeholder="说点什么或提个问题..." 
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <div className="absolute bottom-5 right-5 bg-[#fff5f7] border border-dashed border-[#ffb3c1] rounded-xl p-2.5 flex gap-2 items-center">
              {['🐻', '🐼', '🐣', '🪨'].map((emoji, i) => (
                <div key={i} className="relative w-10 h-10 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-full h-full rounded-full border-2 border-white shadow-sm flex justify-center items-center text-xl bg-[#f0f0f0] overflow-hidden">
                    {emoji}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white/90 rounded-full border border-dashed border-gray-300 flex justify-center items-center z-10 pointer-events-none">
                    <span className="text-[10px] text-[#999999]">↻</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl flex justify-between items-center mb-5 shadow-sm">
            <div>
              <div className="font-bold mb-1">写长文</div>
              <div className="text-xs text-[#999999]">支持万字，全屏阅读体验</div>
            </div>
            <span className="text-[#cccccc]">{'>'}</span>
          </div>
        </div>
      )}

      {/* Loading Modal */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex justify-center items-center z-[100] backdrop-blur-sm animate-[fadeIn_0.2s]">
          <div className="bg-gray-700 rounded-2xl p-5 w-[200px] text-center text-white">
            <div className="flex justify-center mb-2">
              <div className="w-6 h-6 rounded-full border border-white flex justify-center items-center text-xs bg-gray-600 z-30">🐻</div>
              <div className="w-6 h-6 rounded-full border border-white flex justify-center items-center text-xs bg-gray-600 -ml-2 z-20">🐼</div>
              <div className="w-6 h-6 rounded-full border border-white flex justify-center items-center text-xs bg-gray-600 -ml-2 z-10">🪨</div>
            </div>
            <div className="h-1 bg-white/30 rounded-full my-4 overflow-hidden">
              <div className="w-[80%] h-full bg-white rounded-full"></div>
            </div>
            <div className="text-xs mb-2">图片生成中 80%</div>
            <button className="bg-white/20 border-none text-white px-4 py-1.5 rounded-full text-xs mt-2" onClick={() => setIsLoading(false)}>取消</button>
          </div>
        </div>
      )}

      {/* Screen: Select */}
      {screen === 'select' && (
        <div className="flex flex-col h-full p-5 animate-[slideIn_0.3s_ease-out]">
          <div className="flex justify-between items-center mb-5 mt-7 shrink-0">
            <span className="text-2xl cursor-pointer p-1" onClick={() => setScreen('write')}>‹</span>
            <span className="font-semibold">选择配图</span>
            <span className="w-5"></span>
          </div>
          
          <div className="bg-[#dcfce7] rounded-2xl h-[350px] flex flex-col p-5 relative mb-5 bg-cover bg-center" style={{ backgroundImage: targetImage ? `url(${targetImage})` : 'none' }} onClick={() => fileInputRef.current?.click()}>
            <div className="w-12 h-12 rounded-full border-2 border-white shadow-md absolute z-10 flex justify-center items-center text-2xl bg-white top-5 left-5">🐻</div>
            <div className="w-12 h-12 rounded-full border-2 border-white shadow-md absolute z-10 flex justify-center items-center text-2xl bg-white bottom-5 right-20">🐼</div>
            <div className="w-12 h-12 rounded-full border-2 border-white shadow-md absolute z-10 flex justify-center items-center text-2xl bg-white top-[100px] left-[150px]">🪨</div>
            
            <div className="text-4xl text-black/10 font-bold leading-none">“</div>
            <div className="text-5xl font-bold text-[#333333] m-auto relative z-10">{text || '你好'}</div>
            
            <div className="absolute bottom-4 right-4 w-10 h-10 bg-[#fff5f7] border border-dashed border-[#ffb3c1] rounded-full flex justify-center items-center text-2xl z-20 cursor-pointer" onClick={(e) => { e.stopPropagation(); setScreen('edit'); }}>
              <span>👯</span>
              <span className="text-[10px] text-[#ff2442] ml-0.5">编辑</span>
            </div>
          </div>
          
          <div className="flex gap-2.5 overflow-x-auto pb-5 no-scrollbar shrink-0">
            {['基础', '涂写', '弥散', '手写', '边框'].map(style => (
              <div 
                key={style}
                className={`min-w-[70px] h-[90px] rounded-lg flex flex-col justify-end items-center pb-2 text-xs border-2 cursor-pointer ${selectedStyle === style ? 'border-[#ff2442] bg-[#6a8c71] text-white' : 'border-transparent bg-white text-[#333333]'}`}
                onClick={() => setSelectedStyle(style)}
              >
                {style}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-auto mb-5 shrink-0">
            <span className="text-sm text-[#999999]">选一个喜欢的卡片</span>
            <button className="bg-[#ff2442] text-white px-8 py-3 rounded-full font-medium" onClick={() => setScreen('publish')}>下一步</button>
          </div>
        </div>
      )}

      {/* Screen: Edit */}
      {screen === 'edit' && (
        <div className="flex flex-col h-full p-5 overflow-y-auto animate-[slideIn_0.3s_ease-out]">
          <div className="flex justify-between items-center mb-5 mt-7 shrink-0">
            <span className="text-2xl cursor-pointer p-1" onClick={() => setScreen('select')}>‹</span>
            <span className="font-semibold">编辑图片</span>
            <span className="w-5"></span>
          </div>
          
          <div className="bg-[#dcfce7] rounded-2xl h-[180px] flex flex-col p-5 relative mb-5 shrink-0 bg-cover bg-center" style={{ backgroundImage: targetImage ? `url(${targetImage})` : 'none' }} onClick={() => fileInputRef.current?.click()}>
            <div className="text-4xl text-black/10 font-bold leading-none">“</div>
            <div className="text-3xl font-bold text-[#333333] m-auto relative z-10">{text || '你好'}</div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 min-h-max">
            <div className="flex items-center mb-4 mt-2">
              <span className="w-16 text-[13px] text-[#999999]">IP选择</span>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full border border-[#ff2442] flex justify-center items-center text-xs bg-white">🐻</div>
                <div className="w-6 h-6 rounded-full border border-white flex justify-center items-center text-xs bg-white shadow-sm">🐼</div>
                <div className="w-6 h-6 rounded-full border border-white flex justify-center items-center text-xs bg-white shadow-sm">🐣</div>
                <div className="w-6 h-6 rounded-full border border-[#ff2442] flex justify-center items-center text-xs bg-white">🪨</div>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <span className="w-16 text-[13px] text-[#999999]">风格</span>
              <div className="flex gap-2 flex-wrap flex-1">
                {['手绘', '油画', '写实', '3D建模'].map(tag => (
                  <span key={tag} className="bg-[#f5f5f5] px-3 py-1.5 rounded-full text-xs text-[#666666] border border-transparent cursor-pointer hover:bg-[#fff5f7] hover:text-[#ff2442] hover:border-[#ff2442]">{tag}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center mb-4">
              <span className="w-16 text-[13px] text-[#999999]">场景</span>
              <div className="flex gap-2 flex-wrap flex-1">
                <span className="bg-[#fff5f7] px-3 py-1.5 rounded-full text-xs text-[#ff2442] border border-[#ff2442] cursor-pointer">甜品屋</span>
                <span className="bg-[#f5f5f5] px-3 py-1.5 rounded-full text-xs text-[#666666] border border-transparent cursor-pointer">操场</span>
                <span className="bg-[#f5f5f5] px-3 py-1.5 rounded-full text-xs text-[#666666] border border-transparent cursor-pointer">早八地铁</span>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <span className="w-16 text-[13px] text-[#999999]">动作</span>
              <div className="flex gap-2 flex-wrap flex-1">
                <span className="bg-[#fff5f7] px-3 py-1.5 rounded-full text-xs text-[#ff2442] border border-[#ff2442] cursor-pointer">比耶</span>
                <span className="bg-[#f5f5f5] px-3 py-1.5 rounded-full text-xs text-[#666666] border border-transparent cursor-pointer">吵架</span>
                <span className="bg-[#f5f5f5] px-3 py-1.5 rounded-full text-xs text-[#666666] border border-transparent cursor-pointer">梳妆</span>
              </div>
            </div>
            <div className="flex items-start mb-4">
              <span className="w-16 text-[13px] text-[#999999] mt-2.5">描述</span>
              <div className="flex-1">
                <textarea className="w-full bg-[#f9f9f9] border border-[#ebebeb] rounded-lg p-2.5 h-[60px] text-xs mt-2.5 outline-none resize-none"></textarea>
                <div className="text-[11px] text-[#999999] bg-[#f0f0f0] px-2.5 py-1 rounded-lg inline-block mt-2 cursor-pointer">牵着手拖着行李箱快乐旅行打卡</div>
                <div className="text-[11px] text-[#999999] bg-[#f0f0f0] px-2.5 py-1 rounded-lg inline-block mt-2 cursor-pointer">麻将桌的一角以夸张透视作为前景</div>
              </div>
            </div>
            <button className="w-full bg-[#ff2442] text-white py-3.5 rounded-full text-base font-medium mt-4 mb-5" onClick={() => setScreen('select')}>更新图片</button>
          </div>
        </div>
      )}

      {/* Screen: Publish */}
      {screen === 'publish' && (
        <div className="flex flex-col h-full p-5 animate-[slideIn_0.3s_ease-out]">
          <div className="flex justify-between items-center mb-5 mt-7 shrink-0">
            <span className="text-2xl cursor-pointer p-1" onClick={() => setScreen('select')}>‹</span>
            <span className="font-semibold ml-auto">预览</span>
          </div>
          <div className="flex gap-2.5 mb-5">
            <div className="w-20 h-20 bg-[#dcfce7] rounded-lg flex justify-center items-center font-bold overflow-hidden bg-cover bg-center" style={{ backgroundImage: targetImage ? `url(${targetImage})` : 'none' }} onClick={() => fileInputRef.current?.click()}>
              <span className="text-xs z-10">{text || '你好'}</span>
            </div>
            <div className="w-20 h-20 bg-[#f5f5f5] rounded-lg flex justify-center items-center text-[#cccccc] border border-dashed border-gray-300 cursor-pointer"><Plus size={24} /></div>
          </div>
          <input type="text" className="text-lg font-bold border-none outline-none mb-5 w-full bg-transparent" value={text || '你好'} onChange={(e) => setText(e.target.value)} />
          
          <div className="flex gap-2.5 mb-7">
            <span className="px-3 py-1.5 bg-[#f5f5f5] rounded-full text-[13px] font-medium cursor-pointer"># 话题</span>
            <span className="px-3 py-1.5 bg-[#f5f5f5] rounded-full text-[13px] font-medium cursor-pointer">@用户</span>
            <span className="px-3 py-1.5 bg-[#f5f5f5] rounded-full text-[13px] font-medium cursor-pointer">💬 投票</span>
            <span className="px-3 py-1.5 bg-[#f5f5f5] rounded-full text-[13px] font-medium cursor-pointer ml-auto">⛶ 长文</span>
          </div>

          <div className="flex justify-between py-4 border-b border-[#f5f5f5] text-sm text-[#333333] cursor-pointer"><span>⚲ 标记地点</span><span className="text-[#999999] text-xs">选择合适的话题让更多人看到 {'>'}</span></div>
          <div className="flex justify-between py-4 border-b border-[#f5f5f5] text-sm text-[#333333] cursor-pointer"><span>🔓 公开可见</span> <span className="text-[#cccccc]">{'>'}</span></div>
          <div className="flex justify-between py-4 border-b border-[#f5f5f5] text-sm text-[#333333] cursor-pointer"><span>⊞ 添加组件</span> <span className="text-[#cccccc]">{'>'}</span></div>

          <div className="absolute right-5 bottom-[120px] w-[50px] h-[50px] bg-[#fff5f7] border border-dashed border-[#ffb3c1] rounded-full flex justify-center items-center text-2xl shadow-[0_4px_10px_rgba(255,36,66,0.2)] cursor-pointer z-10" onClick={() => setIsOptimizeOpen(true)}>
            <span>👯</span>
          </div>

          <div className="flex gap-4 mt-auto mb-5 items-center">
            <div className="flex flex-col items-center text-[10px] text-[#666666] gap-1 cursor-pointer"><span className="text-2xl">⚙️</span>设置</div>
            <div className="flex flex-col items-center text-[10px] text-[#666666] gap-1 cursor-pointer"><span className="text-2xl">📥</span>存草稿</div>
            <button className="flex-1 bg-[#ff2442] text-white py-3.5 rounded-full text-base font-medium" onClick={onBack}>发布笔记</button>
          </div>
        </div>
      )}

      {/* Optimize Modal */}
      {isOptimizeOpen && (
        <div className="absolute inset-0 bg-white/80 flex justify-center items-center z-[100] backdrop-blur-sm animate-[fadeIn_0.2s]">
          <div className="bg-white rounded-3xl p-5 w-[300px] text-center relative shadow-lg">
            <div className="text-2xl mb-2.5">👯</div>
            <div className="font-bold mb-1.5">选择要优化的图片</div>
            <div className="absolute top-4 right-4 text-base text-[#999999] cursor-pointer" onClick={() => setIsOptimizeOpen(false)}>✕</div>
            
            <div className="flex gap-2.5 my-5 justify-center">
              <div className="w-[60px] h-[60px] bg-[#dcfce7] rounded-lg relative border border-[#ff2442] cursor-pointer flex justify-center items-center overflow-hidden bg-cover bg-center">
                <span className="text-[10px] z-10">{text || '你好'}</span>
                <div className="absolute -top-1.5 -right-1.5 bg-[#ff2442] text-white w-4 h-4 text-[10px] rounded-full flex justify-center items-center z-20">✓</div>
              </div>
              <div className="w-[60px] h-[60px] bg-[#dcfce7] rounded-lg relative border border-transparent cursor-pointer flex justify-center items-center overflow-hidden bg-cover bg-center">
                <span className="text-[10px] z-10">{text || '你好'}</span>
              </div>
              <div className="w-[60px] h-[60px] bg-[#dcfce7] rounded-lg relative border border-[#ff2442] cursor-pointer flex justify-center items-center overflow-hidden bg-cover bg-center">
                <span className="text-[10px] z-10">{text || '你好'}</span>
                <div className="absolute -top-1.5 -right-1.5 bg-[#ff2442] text-white w-4 h-4 text-[10px] rounded-full flex justify-center items-center z-20">✓</div>
              </div>
              <div className="w-[60px] h-[60px] bg-[#f5f5f5] rounded-lg flex justify-center items-center text-[#cccccc] border border-dashed border-gray-300 cursor-pointer"><Plus size={24} /></div>
            </div>

            <div className="flex justify-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-full border border-white shadow-sm flex justify-center items-center text-xs bg-[#f5f5f5]">🐻</div>
              <div className="w-6 h-6 rounded-full border border-white shadow-sm flex justify-center items-center text-xs bg-[#f5f5f5]">🐼</div>
              <div className="w-6 h-6 rounded-full border border-white shadow-sm flex justify-center items-center text-xs bg-[#f5f5f5]">🐣</div>
              <div className="w-6 h-6 rounded-full border border-white shadow-sm flex justify-center items-center text-xs bg-[#f5f5f5]">🪨</div>
            </div>

            <button className="w-full bg-[#ff2442] text-white py-2.5 rounded-full text-base font-medium" onClick={() => { setIsOptimizeOpen(false); setScreen('select'); }}>下一步</button>
          </div>
        </div>
      )}
    </div>
  );
}
