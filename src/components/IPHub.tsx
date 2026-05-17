import React, { useState, useMemo } from 'react';

const GIF_POOL = [
  '/gifs/image%20254.png',
  '/gifs/image%20274.png',
  '/gifs/image%20276.png',
  '/gifs/image%20277.png',
  '/gifs/image%20278.png',
  '/gifs/image%20280.png',
  '/gifs/image%20281.png',
  '/gifs/image%20372.png',
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function RadarChart({ data, labels }: { data: number[]; labels: string[] }) {
  const cx = 100, cy = 100, maxR = 68;
  const n = data.length;
  const angle = (i: number) => (i * 2 * Math.PI / n) - Math.PI / 2;
  const pt = (i: number, val: number) => ({
    x: cx + (val / 100) * maxR * Math.cos(angle(i)),
    y: cy + (val / 100) * maxR * Math.sin(angle(i)),
  });
  const dpts = data.map((v, i) => pt(i, v));
  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {[25, 50, 75, 100].map(lv => (
        <polygon key={lv} points={labels.map((_, i) => { const p = pt(i, lv); return `${p.x},${p.y}`; }).join(' ')}
          fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
      ))}
      {labels.map((_, i) => { const p = pt(i, 100); return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(0,0,0,0.06)" strokeWidth="1" />; })}
      <path d={toPath(dpts)} fill="rgba(212,112,138,0.15)" stroke="rgba(212,112,138,0.9)" strokeWidth="1.5" />
      {dpts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#D4708A" />)}
      {labels.map((label, i) => { const p = pt(i, 128); return <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#8C8C8C">{label}</text>; })}
    </svg>
  );
}

const IP_META = [
  {
    name: '幻夜游兔',
    border: '#C4A8D8',
    size: 56, top: '22%', left: '62%', anim: 'float 4s ease-in-out infinite',
    badges: [{ label: '🔮 灵魂羁绊', cls: 'bg-gradient-to-br from-[#C4A8D8] to-[#9B6FCA] text-white border border-white/40 shadow-[0_2px_4px_rgba(155,111,202,0.3)]' }],
    tag: '我的考研战友',
    lastDate: '今天 01:23', lastRef: '评论于 @熬夜日记',
    lastText: '肝图中，感觉设计创意学院的灯永远不会灭...',
    radarData: [80, 95, 40, 60, 30],
    comments: [
      { date: '3月18日', ref: '评论于 #期末破防', text: '看到大家都这么惨我就放心了...' },
      { date: '3月15日', ref: '评论于 @设计狗日常', text: '这简直就是在演我本人的真实状态啊。' },
    ],
  },
  {
    name: '暴躁小莓',
    border: '#FFB6C1',
    size: 48, top: '66%', left: '22%', anim: 'float 5s ease-in-out infinite alternate',
    badges: [
      { label: '💖 亲密无间', cls: 'bg-gradient-to-br from-[#FFB6C1] to-[#FF69B4] text-white border border-white/40 shadow-[0_2px_4px_rgba(255,105,180,0.3)]' },
      { label: '🔥 圈内顶流', cls: 'bg-[#FFF0F5] text-[#FF6B8B] border border-[#FFD1DC]' },
    ],
    tag: '我的互联网嘴替',
    lastDate: '昨天 08:30', lastRef: '评论于 #早八人签到',
    lastText: '周一早八，我的怨气比鬼还重！',
    radarData: [60, 70, 90, 80, 50],
    comments: [
      { date: '3月18日', ref: '评论于 #期末破防', text: '看到大家都这么惨我就放心了...' },
      { date: '3月15日', ref: '评论于 @设计狗日常', text: '这简直就是在演我本人的真实状态啊。' },
    ],
  },
  {
    name: '摸鱼水豚',
    border: '#A7C7E7',
    size: 40, top: '76%', left: '72%', anim: 'float 6s ease-in-out infinite',
    badges: [{ label: '🌊 默默关注', cls: 'bg-gradient-to-br from-[#A7C7E7] to-[#5DADE2] text-white border border-white/40 shadow-[0_2px_4px_rgba(93,173,226,0.3)]' }],
    tag: '摸鱼同好',
    lastDate: '周五 17:00', lastRef: '评论于 #周五综合症',
    lastText: '终于到周五了，可以正大光明摸鱼了！',
    radarData: [40, 50, 30, 20, 80],
    comments: [
      { date: '周五 17:00', ref: '评论于 #周五综合症', text: '终于到周五了，可以正大光明摸鱼了！' },
    ],
  },
];

// Orbital positions for the fullscreen universe card
const ORBIT_POSITIONS = [
  { top: '18%', left: '62%', size: 64, anim: 'float 4s ease-in-out infinite', label: '幻夜游兔' },
  { top: '62%', left: '18%', size: 56, anim: 'float 5s ease-in-out infinite alternate', label: '暴躁小莓' },
  { top: '72%', left: '70%', size: 48, anim: 'float 6s ease-in-out infinite', label: '摸鱼水豚' },
  { top: '28%', left: '12%', size: 36, anim: 'float 5.5s ease-in-out infinite alternate', label: '' },
  { top: '48%', left: '82%', size: 32, anim: 'float 4.5s ease-in-out infinite', label: '' },
];

export default function IPHub({ onBack }: { onBack: () => void }) {
  const [page, setPage] = useState<'home' | 'detail'>('home');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedName, setSelectedName] = useState('幻夜游兔');
  const [detailTab, setDetailTab] = useState<'comments' | 'posts'>('comments');

  // Assign gifs once on mount
  const assignedGifs = useMemo(() => shuffle(GIF_POOL), []);
  const getGif = (i: number) => assignedGifs[i % assignedGifs.length];

  const currentIp = IP_META.find(ip => ip.name === selectedName) || IP_META[0];
  const openDetail = (name: string) => { setSelectedName(name); setPage('detail'); };

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#FDFBF7] text-[#4A4A4A]">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>

      {/* ===== Fullscreen IP Universe Card ===== */}
      <div className={`absolute inset-0 z-50 flex flex-col transition-all duration-500 ${isFullscreen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'linear-gradient(135deg, #FFD4DA 0%, #FFF0F2 35%, #FFFFFF 60%, #D4E8F8 100%)' }}>

        {/* Close */}
        <button onClick={() => setIsFullscreen(false)}
          className="absolute top-10 right-5 z-10 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center text-[#4A4A4A] text-lg font-light">
          ×
        </button>

        {/* Universe area */}
        <div className="relative flex-1">
          {/* Subtle orbital rings */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.12 }}>
            <ellipse cx="50%" cy="42%" rx="38%" ry="25%" fill="none" stroke="#E8829A" strokeWidth="1" strokeDasharray="4 4" />
            <ellipse cx="50%" cy="42%" rx="26%" ry="17%" fill="none" stroke="#A8C8E8" strokeWidth="1" strokeDasharray="3 6" />
          </svg>

          {/* Center avatar */}
          <div className="absolute" style={{ top: '38%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
            <div className="rounded-full bg-white border-4 border-white shadow-lg overflow-hidden" style={{ width: 88, height: 88 }}>
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Hamster" className="w-full h-full object-cover" alt="me" />
            </div>
            <div className="mt-2 text-center text-xs font-bold text-[#4A4A4A]">耘晨</div>
          </div>

          {/* Orbiting IPs */}
          {ORBIT_POSITIONS.map((pos, i) => (
            <div key={i} className="absolute" style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)', zIndex: 5 }}>
              <div className="flex flex-col items-center gap-1">
                <div className="rounded-full bg-white shadow-md overflow-hidden border-2 border-white"
                  style={{ width: pos.size, height: pos.size, animation: pos.anim }}>
                  <img src={getGif(i)} className="w-full h-full object-cover" alt="" />
                </div>
                {pos.label && <span className="text-[9px] text-[#4A4A4A] font-medium bg-white/80 px-1.5 py-0.5 rounded-full shadow-sm">{pos.label}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Name card info */}
        <div className="shrink-0 px-6 pb-10 pt-4">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-sm border border-[#D4708A]/10">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h1 className="text-2xl font-bold text-[#4A4A4A] mb-1">椰蓉耶_</h1>
                <p className="text-xs text-[#8C8C8C]">Life is all about experience. ✨</p>
              </div>
              <span className="bg-[#E07A8F] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">ENFP</span>
            </div>
            <div className="h-px bg-[rgba(0,0,0,0.06)] my-3" />
            <div className="flex justify-around text-center">
              <div>
                <div className="text-lg font-bold text-[#4A4A4A]">3</div>
                <div className="text-[10px] text-[#8C8C8C] mt-0.5">活跃IP</div>
              </div>
              <div className="w-px bg-[rgba(0,0,0,0.06)]" />
              <div>
                <div className="text-lg font-bold text-[#4A4A4A]">68%</div>
                <div className="text-[10px] text-[#8C8C8C] mt-0.5">互动率</div>
              </div>
              <div className="w-px bg-[rgba(0,0,0,0.06)]" />
              <div>
                <div className="text-lg font-bold text-[#4A4A4A]">12.5k</div>
                <div className="text-[10px] text-[#8C8C8C] mt-0.5">共鸣次数</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Home page ===== */}
      <div className={`absolute inset-0 flex flex-col transition-transform duration-300 ${page === 'home' ? 'translate-x-0 z-10' : '-translate-x-full z-0'}`}>
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

          {/* Universe canvas */}
          <div className="relative shrink-0" style={{ height: 300, background: 'linear-gradient(135deg, #FFD4DA 0%, #FFF0F2 35%, #FFFFFF 65%, #D4E8F8 100%)' }}>
            <button onClick={onBack}
              className="absolute top-12 left-5 z-20 w-9 h-9 rounded-full bg-white/70 backdrop-blur-md shadow-sm flex items-center justify-center text-[#4A4A4A] text-lg">←</button>
            <button onClick={() => setIsFullscreen(true)}
              className="absolute top-12 right-5 z-20 w-9 h-9 rounded-full bg-white/70 backdrop-blur-md shadow-sm flex items-center justify-center text-[#4A4A4A] text-base">⤢</button>

            {/* Center me */}
            <div className="absolute z-10" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <div className="rounded-full bg-white border-[3px] border-white shadow-md overflow-hidden" style={{ width: 72, height: 72 }}>
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Hamster" className="w-full h-full object-cover" alt="我" />
              </div>
            </div>

            {/* IP nodes */}
            {IP_META.map((ip, i) => (
              <div key={ip.name} className="absolute cursor-pointer"
                style={{ top: ip.top, left: ip.left, transform: 'translate(-50%, -50%)' }}
                onClick={() => openDetail(ip.name)}>
                <div className="rounded-full bg-white shadow-sm overflow-hidden"
                  style={{ width: ip.size, height: ip.size, border: `2px solid ${ip.border}`, animation: ip.anim }}>
                  <img src={getGif(i)} className="w-full h-full object-cover" alt={ip.name} />
                </div>
              </div>
            ))}

            {/* Ghost node */}
            <div className="absolute opacity-60" style={{ top: '26%', left: '16%', transform: 'translate(-50%, -50%)' }}>
              <div className="rounded-full bg-white shadow-sm overflow-hidden border-2 border-transparent"
                style={{ width: 36, height: 36, animation: 'float 5.5s ease-in-out infinite alternate' }}>
                <img src={getGif(3)} className="w-full h-full object-cover" alt="" />
              </div>
            </div>
          </div>

          {/* Profile summary */}
          <div className="mx-5 flex justify-between items-start" style={{ marginTop: -24, position: 'relative', zIndex: 2, marginBottom: 16 }}>
            <div>
              <h1 className="text-[22px] font-bold text-[#4A4A4A] mb-2">椰蓉耶_</h1>
              <div className="flex gap-2 items-center">
                <span className="bg-[rgba(224,122,143,0.12)] text-[#E07A8F] text-[11px] px-2.5 py-1 rounded-full font-semibold">ENFP</span>
                <span className="text-xs text-[#8C8C8C]">Life is all about experience. ✨</span>
              </div>
            </div>
            <button className="bg-white w-9 h-9 flex items-center justify-center rounded-full shadow-sm text-[#D4708A] shrink-0 mt-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 15h4M7 9h.01M17 15h.01" />
              </svg>
            </button>
          </div>

          {/* IP list */}
          <div className="bg-white rounded-t-3xl pt-2 min-h-[400px]">
            <div className="flex justify-between items-center mx-5 my-4">
              <span className="text-base font-semibold text-[#4A4A4A]">我的 IP</span>
              <button className="flex items-center justify-center bg-gray-100 w-7 h-7 rounded-full text-[#8C8C8C]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
              </button>
            </div>

            {IP_META.map((ip, i) => (
              <div key={ip.name} className="flex p-4 border-b border-black/5 cursor-pointer active:bg-gray-50"
                onClick={() => openDetail(ip.name)}>
                <div className="mr-3.5 shrink-0">
                  <div className="rounded-full overflow-hidden border border-black/5" style={{ width: 44, height: 44 }}>
                    <img src={getGif(i)} className="w-full h-full object-cover" alt={ip.name} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[15px] font-semibold text-[#4A4A4A]">{ip.name}</span>
                    <div className="flex gap-1.5 items-center shrink-0 ml-2">
                      {ip.badges.map(b => (
                        <span key={b.label} className={`inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded-lg ${b.cls}`}>{b.label}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-2.5">
                    <span className="text-[10px] text-[#D4708A] bg-[rgba(212,112,138,0.1)] px-2 py-0.5 rounded-md border border-dashed border-[rgba(212,112,138,0.25)]">{ip.tag}</span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl">
                    <div className="text-[11px] text-[#8C8C8C] mb-1 flex justify-between items-center">
                      <span>最新：{ip.lastDate}</span>
                      <span className="text-[11px] text-[#D4708A] font-medium">{ip.lastRef} ›</span>
                    </div>
                    <div className="text-[13px] text-[#4A4A4A] line-clamp-1">{ip.lastText}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Detail page ===== */}
      <div className={`absolute inset-0 bg-[#FDFBF7] flex flex-col transition-transform duration-300 ${page === 'detail' ? 'translate-x-0 z-20' : 'translate-x-full z-0'}`}>
        <div className="shrink-0 bg-[#FDFBF7]/90 backdrop-blur-md pt-12 pb-4 px-5 flex items-center border-b border-black/5">
          <button className="text-xl mr-4 w-8 h-8 flex items-center text-[#4A4A4A]" onClick={() => setPage('home')}>←</button>
          <div className="flex items-center gap-2.5">
            <div className="rounded-full overflow-hidden border border-black/5" style={{ width: 32, height: 32 }}>
              <img src={getGif(IP_META.findIndex(ip => ip.name === selectedName))} className="w-full h-full object-cover" alt={currentIp.name} />
            </div>
            <h2 className="text-base font-bold text-[#4A4A4A]">{currentIp.name}</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-24" style={{ scrollbarWidth: 'none' }}>
          {/* 情绪港湾 */}
          <div className="bg-white p-5 mb-2 shadow-sm border-b border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[15px] font-semibold text-[#4A4A4A]">情绪港湾</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[#D4708A] bg-[rgba(212,112,138,0.1)] px-2 py-0.5 rounded-md border border-dashed border-[rgba(212,112,138,0.25)]">{currentIp.tag}</span>
                <svg className="text-[#8C8C8C]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
            </div>
            <div className="flex justify-center" style={{ height: 200 }}>
              <RadarChart data={currentIp.radarData} labels={['治愈', '陪伴', '发疯', '吐槽', '吃瓜']} />
            </div>
          </div>

          {/* 我们的印记 */}
          <div className="bg-white px-5 pt-5 pb-2.5 mb-2 shadow-sm border-b border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[15px] font-semibold text-[#4A4A4A]">我们的印记</span>
              <div className="flex items-center gap-2.5">
                <div className="flex bg-gray-100 p-[3px] rounded-xl">
                  {(['comments', 'posts'] as const).map((tab, i) => (
                    <span key={tab} onClick={() => setDetailTab(tab)}
                      className={`text-[11px] px-2.5 py-1 rounded-[10px] cursor-pointer transition-all ${detailTab === tab ? 'bg-white text-[#4A4A4A] shadow-sm font-semibold' : 'text-[#8C8C8C]'}`}>
                      {['评论', '帖子'][i]}
                    </span>
                  ))}
                </div>
                <div className="flex items-center bg-gray-100 py-1.5 px-2.5 rounded-xl w-[60px]">
                  <span className="text-[11px] opacity-60">🔍</span>
                  <input type="text" placeholder="搜索" className="border-none bg-transparent w-full outline-none text-[11px] ml-1 placeholder-gray-400" />
                </div>
              </div>
            </div>
            <div className="py-2">
              {detailTab === 'comments' && currentIp.comments.map((item, i, arr) => (
                <div key={i} className="relative pl-3.5 pb-6 flex gap-3 items-start">
                  {i < arr.length - 1 && <div className="absolute left-[5px] top-2.5 bottom-0 w-px bg-gray-200" />}
                  <div className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border-2 border-[#D4708A] bg-white z-10 shadow-[0_0_0_3px_rgba(212,112,138,0.1)]" />
                  <div className="w-9 h-9 rounded-lg bg-gray-100 shrink-0 -mt-1 border border-black/5 overflow-hidden" style={{ minWidth: 36 }}>
                    <img src={getGif((i + 4) % GIF_POOL.length)} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl flex-1">
                    <div className="text-[11px] text-[#8C8C8C] mb-1.5 flex justify-between">
                      <span>{item.date}</span>
                      <span className="text-[#D4708A] font-medium">{item.ref} ›</span>
                    </div>
                    <div className="text-[13px] text-[#4A4A4A] leading-relaxed">{item.text}</div>
                  </div>
                </div>
              ))}
              {detailTab === 'posts' && (
                <div className="relative pl-3.5 pb-6 flex gap-3 items-start">
                  <div className="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full border-2 border-[#D4708A] bg-white z-10 shadow-[0_0_0_3px_rgba(212,112,138,0.1)]" />
                  <div className="w-9 h-9 rounded-lg bg-gray-100 shrink-0 -mt-1 overflow-hidden" style={{ minWidth: 36 }}>
                    <img src={getGif(6)} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl flex-1">
                    <div className="text-[11px] text-[#8C8C8C] mb-1.5 flex justify-between">
                      <span>3月10日</span>
                      <span className="text-[#D4708A] font-medium">创作了帖子 ›</span>
                    </div>
                    <div className="text-[13px] text-[#4A4A4A] leading-relaxed">带着它去喝了春天的第一杯咖啡☕️</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 大家在和... */}
          <div className="bg-white p-5 mb-2 shadow-sm border-b border-gray-100">
            <div className="text-[15px] font-semibold text-[#4A4A4A] mb-4">大家在和{currentIp.name}...</div>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {[
                { icon: '🔥', type: '热门话题', name: '#熬夜图鉴', sub: '1.2w 人参与' },
                { icon: '💬', type: '同频群聊', name: '干饭互助群', sub: '正在热聊中' },
                { icon: '📝', type: '爆款帖子', name: '一秒画完图', sub: '疲惫/吐槽' },
              ].map(c => (
                <div key={c.name} className="min-w-[110px] p-3 bg-gray-50 rounded-xl border border-gray-100 shrink-0">
                  <div className="text-[10px] text-[#8C8C8C] mb-2">{c.icon} {c.type}</div>
                  <div className="text-[13px] font-medium text-[#4A4A4A] mb-1">{c.name}</div>
                  <div className="text-[11px] text-[#D4708A]">{c.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 一起共创 */}
          <div className="bg-white p-5 mb-2 shadow-sm">
            <div className="text-[15px] font-semibold text-[#4A4A4A] mb-4">和{currentIp.name}一起共创</div>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {[
                { bg: 'linear-gradient(135deg,#FFE0B2 0%,#FFCCBC 100%)', emoji: '📷', name: '拍立得拍拍', sub: '随手记录生活' },
                { bg: 'linear-gradient(135deg,#F8BBD9 0%,#E1BEE7 100%)', emoji: '📒', name: '情绪手账本', sub: '写下今天心情' },
                { bg: 'linear-gradient(135deg,#B3D9F8 0%,#C5CAE9 100%)', emoji: '🖥️', name: '办公桌合影', sub: '一起打工人' },
              ].map(c => (
                <div key={c.name} className="min-w-[100px] h-[130px] rounded-xl relative overflow-hidden shrink-0 flex flex-col items-center justify-center gap-1.5" style={{ background: c.bg }}>
                  <span className="text-3xl">{c.emoji}</span>
                  <span className="text-[11px] font-semibold text-[#4A4A4A]">{c.name}</span>
                  <span className="text-[9px] text-[#8C8C8C]">{c.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom buttons */}
        <div className="shrink-0 px-5 py-3 pb-6 bg-white/95 backdrop-blur-md flex gap-3 border-t border-gray-100">
          <button className="flex-1 py-3.5 rounded-full text-[15px] font-semibold border border-gray-200 bg-gray-50 text-[#4A4A4A]">一起去逛逛</button>
          <button className="flex-1 py-3.5 rounded-full text-[15px] font-semibold bg-[#D4708A] text-white shadow-sm">带TA去发帖</button>
        </div>
      </div>
    </div>
  );
}
