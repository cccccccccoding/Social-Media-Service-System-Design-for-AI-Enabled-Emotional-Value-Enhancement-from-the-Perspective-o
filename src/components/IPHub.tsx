import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function IPHub({ onBack }: { onBack: () => void }) {
  const [activePage, setActivePage] = useState<'home' | 'detail'>('home');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedIp, setSelectedIp] = useState<string>('幻夜游兔');
  const [activeTab, setActiveTab] = useState<'comments' | 'posts'>('comments');
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const openDetail = (ipName: string) => {
    setSelectedIp(ipName);
    setActivePage('detail');
  };

  useEffect(() => {
    if (activePage === 'detail' && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: ['治愈', '陪伴', '发疯', '吐槽', '吃瓜'],
            datasets: [{
              data: [80, 95, 40, 60, 30],
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              borderColor: 'rgba(139, 92, 246, 1)',
              pointBackgroundColor: 'rgba(139, 92, 246, 1)',
              borderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6
            }]
          },
          options: { 
            responsive: true,
            maintainAspectRatio: false,
            scales: { 
              r: { 
                min: 0, max: 100, 
                ticks: { display: false },
                grid: { color: 'rgba(0,0,0,0.05)' },
                angleLines: { color: 'rgba(0,0,0,0.05)' },
                pointLabels: { font: { size: 11 }, color: '#666' }
              } 
            },
            plugins: { 
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleFont: { size: 12 },
                bodyFont: { size: 13 },
                padding: 10,
                callbacks: {
                  title: function(context) { return `【${context[0].label}】情绪记忆`; },
                  label: function(context) {
                    const memoryMap: Record<string, string> = {
                      '陪伴': '“肝图中，感觉灯永远不会灭...”',
                      '治愈': '“出去散步遇到了好可爱的修勾！”',
                      '发疯': '“周一早八，我的怨气比鬼还重！”',
                      '吐槽': '“又是被甲方折磨的一天...”',
                      '吃瓜': '“前排出售瓜子矿泉水，坐等后续。”'
                    };
                    return memoryMap[context.label] || '暂无相关记忆';
                  }
                }
              }
            }
          }
        });
      }
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [activePage]);

  const avatarSrc = selectedIp === '暴躁小莓' ? 
    'https://images.unsplash.com/photo-1563396983906-b3795482a59a?auto=format&fit=crop&w=100&q=80' : 
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=100&q=80';

  return (
    <div className="w-full h-full bg-[#F8F9FA] relative flex flex-col overflow-hidden font-sans">
      
      {/* Page: Home */}
      <div className={`absolute inset-0 bg-[#F8F9FA] transition-transform duration-300 overflow-y-auto no-scrollbar pb-20 ${activePage === 'home' ? 'translate-x-0 z-10' : '-translate-x-full z-0'}`}>
        <div className={`relative transition-all duration-400 ease-in-out bg-gradient-to-b from-[#E2E8F0] to-[#F8F9FA] ${isFullscreen ? 'h-full absolute w-full z-50 bg-[#E2E8F0]' : 'h-[320px]'}`}>
          <div className="absolute top-[50px] right-5 z-10">
            <button className="w-9 h-9 rounded-full bg-white/70 backdrop-blur-md border-none text-base shadow-sm cursor-pointer flex justify-center items-center" onClick={() => setIsFullscreen(!isFullscreen)}>⤢</button>
          </div>
          
          {/* Nodes */}
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" className="absolute rounded-full flex items-center justify-center shadow-sm bg-white object-cover w-[72px] h-[72px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[3px] border-white z-10" alt="我" />
          <img src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=100&q=80" className="absolute rounded-full flex items-center justify-center shadow-sm bg-white object-cover cursor-pointer border-2 border-[#D8B4E2] w-14 h-14 top-[20%] left-[60%] animate-[float_4s_ease-in-out_infinite]" alt="幻夜游兔" onClick={() => openDetail('幻夜游兔')} />
          <img src="https://images.unsplash.com/photo-1563396983906-b3795482a59a?auto=format&fit=crop&w=100&q=80" className="absolute rounded-full flex items-center justify-center shadow-sm bg-white object-cover cursor-pointer border-2 border-[#FFB6C1] w-12 h-12 top-[65%] left-[20%] animate-[float_5s_ease-in-out_infinite_alternate]" alt="暴躁小莓" onClick={() => openDetail('暴躁小莓')} />
          <img src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?auto=format&fit=crop&w=100&q=80" className="absolute rounded-full flex items-center justify-center shadow-sm bg-white object-cover cursor-pointer border-2 border-[#A7C7E7] w-10 h-10 top-[75%] left-[70%] animate-[float_6s_ease-in-out_infinite]" alt="摸鱼水豚" />
          <img src="https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=100&q=80" className="absolute rounded-full flex items-center justify-center shadow-sm bg-white object-cover cursor-pointer border-2 border-transparent opacity-80 w-9 h-9 top-[25%] left-[15%] animate-[float_5.5s_ease-in-out_infinite_alternate]" alt="迷茫幽灵" />
        </div>

        <div className="-mt-[30px] mx-5 mb-5 relative z-10 flex justify-between items-start">
          <div>
            <h1 className="text-[22px] text-[#1D1D1F] mb-2 font-bold">椰蓉耶_</h1>
            <div className="flex gap-2 items-center">
              <span className="bg-[#EAEBEE] text-[#555] text-[11px] px-2.5 py-1 rounded-full font-medium">ENFP</span>
              <span className="text-xs text-[#86868B]">Life is all about experience. ✨</span>
            </div>
          </div>
          <div className="bg-white w-9 h-9 flex items-center justify-center rounded-full shadow-sm cursor-pointer text-[#8B5CF6]" title="导出名片">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect><path d="M7 15h4M7 9h.01M17 15h.01"></path></svg>
          </div>
        </div>

        <div className="pt-2.5 pb-5 bg-white rounded-t-3xl min-h-[50vh]">
          <div className="flex justify-between items-center mx-5 my-4">
            <span className="text-base font-semibold text-[#1D1D1F]">我的 IP</span>
            <div className="text-[#86868B] flex items-center justify-center bg-[#F3F4F6] w-7 h-7 rounded-full cursor-pointer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
            </div>
          </div>
          
          {/* List Items */}
          <div className="flex p-4 border-b border-black/5 cursor-pointer" onClick={() => openDetail('幻夜游兔')}>
            <div className="mr-3.5"><img src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=100&q=80" className="w-11 h-11 rounded-full object-cover border border-black/5" /></div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[15px] font-semibold text-[#1D1D1F]">幻夜游兔</span>
                <div className="flex gap-1.5 items-center">
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-lg bg-gradient-to-br from-[#E0B0FF] to-[#8A2BE2] text-white shadow-[0_2px_4px_rgba(138,43,226,0.3)] border border-white/40">🔮 灵魂羁绊</span>
                </div>
              </div>
              <div className="mb-2.5 flex items-center gap-1.5">
                <span className="text-[10px] text-[#8B5CF6] bg-[#F3E8FF] px-2 py-0.5 rounded-md border border-dashed border-[#8B5CF6]/30">我的考研战友</span>
              </div>
              <div className="bg-[#F8F9FA] p-2.5 rounded-xl">
                <div className="text-[11px] text-[#86868B] mb-1 flex justify-between items-center">
                  <span>最新：今天 01:23</span>
                  <div className="text-[11px] text-[#8B5CF6] font-medium flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>评论于 @熬夜日记 <span className="text-sm -mt-0.5">›</span></div>
                </div>
                <div className="text-[13px] text-[#1D1D1F] line-clamp-1 mb-1.5">肝图中，感觉设计创意学院的灯永远不会灭...</div>
              </div>
            </div>
          </div>

          <div className="flex p-4 border-b border-black/5 cursor-pointer" onClick={() => openDetail('暴躁小莓')}>
            <div className="mr-3.5"><img src="https://images.unsplash.com/photo-1563396983906-b3795482a59a?auto=format&fit=crop&w=100&q=80" className="w-11 h-11 rounded-full object-cover border border-black/5" /></div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[15px] font-semibold text-[#1D1D1F]">暴躁小莓</span>
                <div className="flex gap-1.5 items-center">
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-lg bg-gradient-to-br from-[#FFB6C1] to-[#FF69B4] text-white shadow-[0_2px_4px_rgba(255,105,180,0.3)] border border-white/40">💖 亲密无间</span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-lg bg-[#FFF0F5] text-[#FF6B8B] border border-[#FFD1DC]">🔥 圈内顶流</span>
                </div>
              </div>
              <div className="mb-2.5 flex items-center gap-1.5">
                <span className="text-[10px] text-[#8B5CF6] bg-[#F3E8FF] px-2 py-0.5 rounded-md border border-dashed border-[#8B5CF6]/30">我的互联网嘴替</span>
              </div>
              <div className="bg-[#F8F9FA] p-2.5 rounded-xl">
                <div className="text-[11px] text-[#86868B] mb-1 flex justify-between items-center">
                  <span>最新：昨天 08:30</span>
                  <div className="text-[11px] text-[#8B5CF6] font-medium flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>评论于 #早八人签到 <span className="text-sm -mt-0.5">›</span></div>
                </div>
                <div className="text-[13px] text-[#1D1D1F] line-clamp-1 mb-1.5">周一早八，我的怨气比鬼还重！</div>
              </div>
            </div>
          </div>

        </div>
        
        {/* Floating Back Button for Home */}
        <div className="absolute top-[50px] left-5 z-20">
          <button className="w-9 h-9 rounded-full bg-white/70 backdrop-blur-md border-none text-base shadow-sm cursor-pointer flex justify-center items-center" onClick={onBack}>←</button>
        </div>
      </div>

      {/* Page: Detail */}
      <div className={`absolute inset-0 bg-[#F8F9FA] transition-transform duration-300 overflow-y-auto no-scrollbar pb-20 ${activePage === 'detail' ? 'translate-x-0 z-20' : 'translate-x-full z-0'}`}>
        <div className="sticky top-0 bg-[#F8F9FA]/90 backdrop-blur-md z-20 pt-12 pb-4 px-5 flex items-center">
          <div className="text-xl cursor-pointer mr-4 w-8 h-8 flex items-center" onClick={() => setActivePage('home')}>←</div>
          <div className="flex items-center gap-2.5">
            <img src={avatarSrc} className="w-8 h-8 rounded-full object-cover" alt="IP" />
            <h2 className="text-base font-bold">{selectedIp}</h2>
          </div>
        </div>

        <div className="bg-white p-5 mb-2">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[15px] font-semibold text-[#1D1D1F] shrink-0">情绪港湾</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#8B5CF6] bg-[#F3E8FF] px-2 py-0.5 rounded-md border border-dashed border-[#8B5CF6]/30">我的考研战友</span>
              <svg className="text-[#86868B] cursor-pointer ml-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </div>
          </div>
          <div className="flex justify-center h-[200px]">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        <div className="bg-white px-5 pt-5 pb-2.5 mb-2">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[15px] font-semibold text-[#1D1D1F] shrink-0">我们的印记</span>
            <div className="flex items-center gap-2.5 flex-1 justify-end">
              <div className="flex bg-[#F3F4F6] p-[3px] rounded-xl">
                <span className={`text-[11px] px-2.5 py-1 rounded-[10px] cursor-pointer transition-all ${activeTab === 'comments' ? 'bg-white text-[#1D1D1F] shadow-[0_2px_4px_rgba(0,0,0,0.05)] font-semibold' : 'text-[#86868B]'}`} onClick={() => setActiveTab('comments')}>评论</span>
                <span className={`text-[11px] px-2.5 py-1 rounded-[10px] cursor-pointer transition-all ${activeTab === 'posts' ? 'bg-white text-[#1D1D1F] shadow-[0_2px_4px_rgba(0,0,0,0.05)] font-semibold' : 'text-[#86868B]'}`} onClick={() => setActiveTab('posts')}>帖子</span>
              </div>
              <div className="flex items-center bg-[#F3F4F6] py-1.5 px-2.5 rounded-xl w-[60px]">
                <span className="text-[11px] opacity-60">🔍</span>
                <input type="text" placeholder="搜索" className="border-none bg-transparent w-full outline-none text-[11px] text-[#1D1D1F] ml-1 placeholder:text-[#9CA3AF]" />
              </div>
            </div>
          </div>
          
          {activeTab === 'comments' && (
            <div className="py-2.5 relative">
              <div className="relative pl-3.5 pb-6 flex gap-3 items-start">
                <div className="absolute left-[5px] top-2.5 bottom-0 w-px bg-[#E5E7EB] z-0"></div>
                <div className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border-2 border-[#8B5CF6] bg-white z-10 shadow-[0_0_0_3px_rgba(139,92,246,0.1)]"></div>
                <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=100&q=80" className="w-9 h-9 rounded-lg object-cover bg-[#F3F4F6] shrink-0 -mt-1 border border-black/5" />
                <div className="bg-[#F8F9FA] p-3 rounded-xl flex-1">
                  <div className="text-[11px] text-[#86868B] mb-1.5 flex justify-between">
                    <span>3月18日</span>
                    <div className="text-[11px] text-[#8B5CF6] font-medium flex items-center gap-0.5">评论于 #期末破防 <span className="text-sm -mt-0.5">›</span></div>
                  </div>
                  <div className="text-[13px] text-[#1D1D1F] mb-2 leading-relaxed">看到大家都这么惨我就放心了...</div>
                </div>
              </div>
              <div className="relative pl-3.5 pb-6 flex gap-3 items-start">
                <div className="absolute left-[5px] top-2.5 bottom-0 w-px bg-[#E5E7EB] z-0 hidden"></div>
                <div className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border-2 border-[#8B5CF6] bg-white z-10 shadow-[0_0_0_3px_rgba(139,92,246,0.1)]"></div>
                <img src="https://images.unsplash.com/photo-1616010652065-2c22e19c72e9?auto=format&fit=crop&w=100&q=80" className="w-9 h-9 rounded-lg object-cover bg-[#F3F4F6] shrink-0 -mt-1 border border-black/5" />
                <div className="bg-[#F8F9FA] p-3 rounded-xl flex-1">
                  <div className="text-[11px] text-[#86868B] mb-1.5 flex justify-between">
                    <span>3月15日</span>
                    <div className="text-[11px] text-[#8B5CF6] font-medium flex items-center gap-0.5">评论于 @设计狗日常 <span className="text-sm -mt-0.5">›</span></div>
                  </div>
                  <div className="text-[13px] text-[#1D1D1F] mb-2 leading-relaxed">这简直就是在演我本人的真实状态啊。</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="py-2.5 relative">
              <div className="relative pl-3.5 pb-6 flex gap-3 items-start">
                <div className="absolute left-[5px] top-2.5 bottom-0 w-px bg-[#E5E7EB] z-0"></div>
                <div className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border-2 border-[#8B5CF6] bg-white z-10 shadow-[0_0_0_3px_rgba(139,92,246,0.1)]"></div>
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=100&q=80" className="w-9 h-9 rounded-lg object-cover bg-[#F3F4F6] shrink-0 -mt-1 border border-black/5" />
                <div className="bg-[#F8F9FA] p-3 rounded-xl flex-1">
                  <div className="text-[11px] text-[#86868B] mb-1.5 flex justify-between">
                    <span>3月10日</span>
                    <div className="text-[11px] text-[#8B5CF6] font-medium flex items-center gap-0.5">创作了帖子 <span className="text-sm -mt-0.5">›</span></div>
                  </div>
                  <div className="text-[13px] text-[#1D1D1F] mb-2 leading-relaxed">带着它去喝了春天的第一杯咖啡☕️</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-5 mb-2">
          <div className="text-[15px] font-semibold text-[#1D1D1F] shrink-0 mb-4">大家在和{selectedIp}...</div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            <div className="min-w-[110px] p-3 bg-[#F8F9FA] rounded-xl border border-black/5 shrink-0">
              <div className="text-[10px] text-[#86868B] mb-2">🔥 热门话题</div>
              <div className="text-[13px] font-medium text-[#1D1D1F] mb-1">#熬夜图鉴</div>
              <div className="text-[11px] text-[#FF6B8B]">1.2w 人参与</div>
            </div>
            <div className="min-w-[110px] p-3 bg-[#F8F9FA] rounded-xl border border-black/5 shrink-0">
              <div className="text-[10px] text-[#86868B] mb-2">💬 同频群聊</div>
              <div className="text-[13px] font-medium text-[#1D1D1F] mb-1">干饭互助群</div>
              <div className="text-[11px] text-[#FF6B8B]">正在热聊中</div>
            </div>
            <div className="min-w-[110px] p-3 bg-[#F8F9FA] rounded-xl border border-black/5 shrink-0">
              <div className="text-[10px] text-[#86868B] mb-2">📝 爆款帖子</div>
              <div className="text-[13px] font-medium text-[#1D1D1F] mb-1">一秒画完图</div>
              <div className="text-[11px] text-[#FF6B8B]">疲惫/吐槽</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 mb-0">
          <div className="text-[15px] font-semibold text-[#1D1D1F] shrink-0 mb-4">和{selectedIp}一起共创</div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            <div className="min-w-[100px] h-[130px] rounded-xl relative overflow-hidden bg-[#E2E8F0] shrink-0">
              <img src="https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 right-2 bg-black/50 backdrop-blur-sm color-white text-[10px] p-1 rounded-md text-center text-white">拍立得拍拍</div>
            </div>
            <div className="min-w-[100px] h-[130px] rounded-xl relative overflow-hidden bg-[#E2E8F0] shrink-0">
              <img src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 right-2 bg-black/50 backdrop-blur-sm color-white text-[10px] p-1 rounded-md text-center text-white">情绪手账本</div>
            </div>
            <div className="min-w-[100px] h-[130px] rounded-xl relative overflow-hidden bg-[#E2E8F0] shrink-0">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 right-2 bg-black/50 backdrop-blur-sm color-white text-[10px] p-1 rounded-md text-center text-white">办公桌合影</div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full px-5 py-3 pb-8 bg-white/95 backdrop-blur-md z-30 flex gap-3 border-t border-black/5">
          <button className="flex-1 py-3.5 rounded-full text-[15px] font-semibold text-center border-none cursor-pointer bg-[#F8F9FA] text-[#1D1D1F] border border-black/5 hover:bg-[#E5E7EB]">一起去逛逛</button>
          <button className="flex-1 py-3.5 rounded-full text-[15px] font-semibold text-center border-none cursor-pointer bg-[#F8F9FA] text-[#1D1D1F] border border-black/5 hover:bg-[#E5E7EB]">带TA去发帖</button>
        </div>
      </div>
    </div>
  );
}
