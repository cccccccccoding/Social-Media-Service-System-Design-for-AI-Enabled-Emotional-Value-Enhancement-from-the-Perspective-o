import React, { useState } from 'react';

type MainTab = 'insights' | 'assets' | 'business';
type AssetSubTab = 'world' | 'persona' | 'views' | 'other';
type BizSubTab = 'consume' | 'ipcollab' | 'brand' | 'merch';
type L3Tab = 'post' | 'effect' | 'emoji';

export default function CreatorHub({ onBack }: { onBack: () => void }) {
  const [mainTab, setMainTab] = useState<MainTab>('insights');
  const [assetSubTab, setAssetSubTab] = useState<AssetSubTab>('world');
  const [bizSubTab, setBizSubTab] = useState<BizSubTab>('consume');
  const [l3Tab, setL3Tab] = useState<L3Tab>('post');
  const [worldExpanded, setWorldExpanded] = useState(false);
  const [postToggle, setPostToggle] = useState(true);

  return (
    <div className="w-full h-full flex flex-col bg-[#FDFBF7] text-[#4A4A4A] font-sans overflow-hidden">
      {/* Header */}
      <div className="shrink-0 bg-[#FDFBF7] shadow-sm z-10">
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-[#4A4A4A] shrink-0 text-lg leading-none">‹</button>
            <div className="h-9 w-9 rounded-full bg-[#FFF9C4] overflow-hidden border border-gray-200 shrink-0" style={{ minWidth: 36, minHeight: 36 }}>
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Hamster" alt="avatar" style={{ width: 36, height: 36, objectFit: 'cover' }} />
            </div>
            <span className="text-sm font-bold">打工仓鼠 ∨</span>
          </div>
        </div>
        <div className="flex px-5 border-b border-gray-200">
          {(['insights', 'assets', 'business'] as MainTab[]).map((tab, i) => (
            <button key={tab} onClick={() => setMainTab(tab)}
              className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${mainTab === tab ? 'border-[#4A4A4A] text-[#4A4A4A]' : 'border-transparent text-gray-400'}`}>
              {['用户洞察', 'IP资产', '商业变现'][i]}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-10" style={{ scrollbarWidth: 'none' }}>

        {/* ===== 用户洞察 ===== */}
        {mainTab === 'insights' && (
          <div>
            {/* 经营诊断 */}
            <div className="mb-6">
              <h3 className="text-sm font-bold mb-3 pl-1">经营诊断</h3>
              <div className="rounded-3xl bg-white p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-gray-500">粉丝互动趋势 (近7日)</span>
                  <span className="text-[10px] text-green-500 font-bold">↑ 15%</span>
                </div>
                <div className="h-24 w-full mb-2">
                  <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="lg1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(178,223,219,0.5)" />
                        <stop offset="100%" stopColor="rgba(178,223,219,0)" />
                      </linearGradient>
                    </defs>
                    <path d="M0,30 L0,20 Q10,25 20,15 T40,10 T60,18 T80,5 L100,2 L100,30 Z" fill="url(#lg1)" />
                    <path d="M0,20 Q10,25 20,15 T40,10 T60,18 T80,5 L100,2" fill="none" stroke="#26A69A" strokeWidth="1" />
                    <circle cx="80" cy="5" r="1.5" fill="#26A69A" />
                    <circle cx="100" cy="2" r="1.5" fill="#26A69A" />
                  </svg>
                </div>
                <div className="flex justify-between text-[9px] text-gray-400 px-1">
                  <span>周一</span><span>周三</span><span>周五</span><span>今日</span>
                </div>
              </div>
            </div>

            {/* 场景分布 */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3 pl-1">
                <h3 className="text-sm font-bold">场景分布</h3>
                <button className="text-[10px] text-gray-400">更多 ›</button>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-sm border border-gray-100">
                <div className="flex flex-col gap-3 mb-5 pb-4 border-b border-gray-100">
                  {[
                    { label: '周一不想上班', pct: 80, color: '#FFD1DC' },
                    { label: '收到奇葩需求', pct: 60, color: '#E1BEE7' },
                    { label: '深夜爆肝放毒', pct: 45, color: '#B2DFDB' },
                  ].map(({ label, pct, color }) => (
                    <div key={label} className="flex items-center justify-between text-xs font-bold">
                      <span className="w-24 truncate">{label}</span>
                      <div className="flex-1 px-3">
                        <div className="h-2 w-full bg-gray-100 rounded-full">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                        </div>
                      </div>
                      <span className="w-8 text-right text-gray-400">{pct}%</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 mb-2 font-bold">🔍 明星资产表现下钻</p>
                <div className="flex overflow-x-auto gap-3 pb-1" style={{ scrollbarWidth: 'none' }}>
                  {[
                    { seed: 'Coffee', name: '灵魂抽干·喝咖啡', bars: [{ l: '早八通勤', p: 90, c: '#93C5FD', v: '9k+' }, { l: '深夜爆肝', p: 75, c: '#93C5FD', v: '7k+' }] },
                    { seed: 'Angry', name: '键盘杀手·暴走', bars: [{ l: '奇葩需求', p: 85, c: '#FCA5A5', v: '8.5k+' }, { l: '周一早会', p: 60, c: '#FCA5A5', v: '6k+' }] },
                  ].map(({ seed, name, bars }) => (
                    <div key={seed} className="w-56 shrink-0 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center shrink-0 shadow-sm" style={{ minWidth: 32, minHeight: 32 }}>
                          <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`} style={{ width: 24, height: 24 }} alt="" />
                        </div>
                        <span className="text-[11px] font-bold">{name}</span>
                      </div>
                      {bars.map(b => (
                        <div key={b.l} className="text-[9px] flex items-center justify-between mb-1">
                          <span className="w-12 text-gray-500">{b.l}</span>
                          <div className="flex-1 px-2"><div className="h-1 bg-gray-200 rounded-full"><div className="h-full rounded-full" style={{ width: `${b.p}%`, backgroundColor: b.c }} /></div></div>
                          <span className="text-gray-400">{b.v}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 灵感发现 */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3 pl-1">
                <h3 className="text-sm font-bold">灵感发现</h3>
                <button className="text-[10px] text-gray-400">更多 ›</button>
              </div>
              <div className="flex gap-2 mb-3">
                <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center text-xs text-gray-400 border border-gray-100 shadow-sm">🔍 搜索近期高频情绪/话题...</div>
                <button className="w-8 h-8 rounded-full bg-white text-gray-500 border border-gray-100 shadow-sm flex items-center justify-center shrink-0 text-[10px]">▼</button>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { title: '节后综合症', tag: '节日热点', tagCls: 'bg-yellow-50 text-gray-500', desc: '长假结束，相关疲惫情绪攀升 300%。' },
                  { title: '想离职的一天', tag: '粉丝高需', tagCls: 'bg-pink-50 text-red-400', desc: '昨日共 800+ 粉丝在评论区输入离职相关词汇。' },
                ].map(({ title, tag, tagCls, desc }) => (
                  <div key={title} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-sm font-bold">{title}</span>
                        <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${tagCls}`}>{tag}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 line-clamp-1">{desc}</p>
                    </div>
                    <button className="shrink-0 h-7 w-7 rounded-full bg-[#4A4A4A] text-white flex items-center justify-center text-[10px]">✏</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== IP资产 ===== */}
        {mainTab === 'assets' && (
          <div>
            {/* 基础资产 */}
            <div className="mb-6">
              <h3 className="text-sm font-bold mb-3 pl-1">基础资产</h3>
              <div className="rounded-3xl bg-white p-4 shadow-sm border border-gray-100 relative">
                <div className="flex gap-4 border-b border-gray-100 mb-3">
                  {(['world', 'persona', 'views', 'other'] as AssetSubTab[]).map((tab, i) => (
                    <button key={tab} onClick={() => setAssetSubTab(tab)}
                      className={`pb-2 text-[11px] font-bold border-b-2 transition-colors ${assetSubTab === tab ? 'border-[#4A4A4A] text-[#4A4A4A]' : 'border-transparent text-gray-400'}`}>
                      {['世界观', '人设', '三视图', '其他'][i]}
                    </button>
                  ))}
                </div>
                <button className="absolute bottom-4 right-4 w-7 h-7 rounded-full bg-gray-50 border border-gray-200 text-gray-400 flex items-center justify-center text-[10px]">✎</button>
                {assetSubTab === 'world' && (
                  <div className="pb-6">
                    <p className={`text-xs text-gray-500 leading-relaxed ${worldExpanded ? '' : 'line-clamp-3'}`}>
                      <strong>核心设定：</strong>一只因为在老家屯粮失败，背负着巨额橡果房贷，不得不每天挤着死亡三号线去陆家嘴CBD上班的底层仓鼠。<br />
                      <strong>世界法则：</strong>在这个世界里，人类物品被极度放大。键盘就像是一片巨大的广场，咖啡杯如同深不见底的湖泊。
                    </p>
                    <button onClick={() => setWorldExpanded(!worldExpanded)} className="text-[10px] text-blue-500 mt-1 font-bold">
                      {worldExpanded ? '收起全文 ↑' : '展开全部 ↓'}
                    </button>
                  </div>
                )}
                {assetSubTab === 'persona' && (
                  <div className="pb-6">
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      <strong>外貌特征：</strong>长期熬夜导致浓重的黑眼圈，永远穿着一件不太合身的皱巴巴白衬衫，口袋里常备速效救心丸。<br />
                      <strong>性格标签：</strong>#表面怂包 #内心弹幕极其丰富 #被迫卷王 #极易受到惊吓。
                    </p>
                    <button className="text-[10px] text-blue-500 mt-1 font-bold">展开全部 ↓</button>
                  </div>
                )}
                {assetSubTab === 'views' && (
                  <div className="flex gap-2 pb-6">
                    {['front', 'side', 'back'].map(s => (
                      <div key={s} className="flex-1 aspect-square bg-gray-50 rounded border border-gray-100 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${s}`} className="w-full h-full object-cover opacity-50" alt="" />
                      </div>
                    ))}
                  </div>
                )}
                {assetSubTab === 'other' && (
                  <div className="text-xs text-gray-400 text-center py-6">已上传：色卡规范.pdf / 骨骼绑定原文件.fbx</div>
                )}
              </div>
            </div>

            {/* 动作与表情 */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3 pl-1">
                <h3 className="text-sm font-bold">动作与表情</h3>
                <button className="text-[10px] text-gray-400">更多 ›</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { seed: 'Desk', name: '疯狂敲键盘', tag: '爆肝/焦虑', tagCls: 'text-red-500 bg-red-50' },
                  { seed: 'Cry', name: '眼泪汪汪', tag: '委屈/破防', tagCls: 'text-blue-500 bg-blue-50' },
                  { seed: 'Sleep', name: '工位瘫倒', tag: '疲惫/摸鱼', tagCls: 'text-gray-500 bg-gray-100' },
                ].map(({ seed, name, tag, tagCls }) => (
                  <div key={seed} className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex flex-col items-center">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg mb-1 flex items-center justify-center" style={{ minWidth: 40, minHeight: 40 }}>
                      <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`} style={{ width: 32, height: 32 }} alt="" />
                    </div>
                    <span className="text-[9px] font-bold truncate w-full text-center">{name}</span>
                    <span className={`text-[8px] px-1 rounded mt-0.5 ${tagCls}`}>{tag}</span>
                  </div>
                ))}
                <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-2 flex flex-col items-center justify-center cursor-pointer">
                  <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 mb-1 text-xs">+</div>
                  <span className="text-[8px] text-gray-400">新增表情</span>
                </div>
              </div>
            </div>

            {/* 交互特效 */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3 pl-1">
                <h3 className="text-sm font-bold">交互特效</h3>
                <button className="text-[10px] text-gray-400">管理 ›</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 pb-3 relative">
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1">
                    <span className="bg-white/90 text-gray-500 text-[8px] px-1.5 py-0.5 rounded border border-gray-200 shadow-sm">系统默认</span>
                    <button className="w-5 h-5 rounded-full bg-white text-[#4A4A4A] shadow-sm flex items-center justify-center border border-gray-200 text-[8px]">↑</button>
                  </div>
                  <div className="aspect-video bg-gray-800 rounded-xl mb-2 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-orange-400 opacity-40" />
                    <span className="text-white/80 text-lg relative z-10">▶</span>
                  </div>
                  <h4 className="text-xs font-bold text-center mb-1.5 mt-1 truncate">怒砸屏幕炸裂</h4>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-[8px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded">愤怒</span>
                    <span className="text-[8px] text-gray-400">→</span>
                    <span className="text-[8px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded">悲伤</span>
                  </div>
                </div>
                <div className="bg-orange-50/30 rounded-2xl shadow-sm border border-orange-200 p-2 pb-3 relative">
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-orange-500 text-white text-[8px] px-2 py-0.5 rounded font-bold">审核中</span>
                  </div>
                  <div className="aspect-video bg-gray-800 rounded-xl mb-2 flex items-center justify-center relative overflow-hidden opacity-80">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-500 opacity-40" />
                    <span className="text-white/80 text-lg relative z-10">▶</span>
                  </div>
                  <h4 className="text-xs font-bold text-center mb-1.5 mt-1 truncate">干杯洒出咖啡</h4>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-[8px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded">摸鱼</span>
                    <span className="text-[8px] text-gray-400">→</span>
                    <span className="text-[8px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded">摸鱼</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== 商业变现 ===== */}
        {mainTab === 'business' && (
          <div>
            {/* 全局收益看板 */}
            <div className="mb-5">
              <h3 className="text-sm font-bold mb-3 pl-1">全局收益看板</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                  <div className="text-[10px] text-gray-400 mb-1">近30日总计 (¥)</div>
                  <div className="text-xl font-bold">12,850.00</div>
                </div>
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                  <div className="text-[10px] text-gray-400 mb-1">近7日新增 (¥)</div>
                  <div className="text-xl font-bold">3,240.00</div>
                  <div className="text-[8px] text-green-500 mt-0.5">↑ 12% 环比</div>
                </div>
              </div>
            </div>

            {/* Biz Sub Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-200 mb-4 pb-1 gap-5" style={{ scrollbarWidth: 'none' }}>
              {(['consume', 'ipcollab', 'brand', 'merch'] as BizSubTab[]).map((tab, i) => (
                <button key={tab} onClick={() => setBizSubTab(tab)}
                  className={`pb-2 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${bizSubTab === tab ? 'border-[#4A4A4A] text-[#4A4A4A]' : 'border-transparent text-gray-400'}`}>
                  {['用户消费', 'IP联动', '品牌合作', '周边售卖'][i]}
                </button>
              ))}
            </div>

            {/* 用户消费 */}
            {bizSubTab === 'consume' && (
              <div>
                <div className="bg-gradient-to-br from-[#4A4A4A] to-gray-800 p-5 rounded-3xl mb-4 text-white relative overflow-hidden">
                  <div className="text-[10px] text-white/70 mb-1">本月 C端消费 总收益 (¥)</div>
                  <div className="text-2xl font-bold mb-2">4,580.00</div>
                  <div className="flex gap-4 text-[9px] text-white/80">
                    <div>发帖订阅 <span className="font-bold text-white ml-1">¥ 2,100</span></div>
                    <div>单次内购 <span className="font-bold text-white ml-1">¥ 2,480</span></div>
                  </div>
                </div>
                <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-xl">
                  {(['post', 'effect', 'emoji'] as L3Tab[]).map((tab, i) => (
                    <button key={tab} onClick={() => setL3Tab(tab)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${l3Tab === tab ? 'bg-white text-[#4A4A4A] shadow-sm' : 'text-gray-500'}`}>
                      {['发帖权限', '高级特效', '隐藏表情'][i]}
                    </button>
                  ))}
                </div>

                {l3Tab === 'post' && (
                  <div>
                    <div className="flex items-center gap-2 mb-3 pl-1">
                      <h4 className="text-sm font-bold">发帖权限管理</h4>
                      <span className="text-gray-400 text-xs">ⓘ</span>
                      <div className="ml-auto cursor-pointer" onClick={() => setPostToggle(!postToggle)}>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${postToggle ? 'bg-[#4A4A4A]' : 'bg-gray-300'}`}>
                          <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${postToggle ? 'left-[17px]' : 'left-0.5'}`} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                      <div className="text-xs text-gray-500 mb-4">订阅发帖收益趋势 (近30日)</div>
                      <div className="h-32 w-full">
                        <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="sg" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="rgba(74,74,74,0.2)" />
                              <stop offset="100%" stopColor="rgba(74,74,74,0)" />
                            </linearGradient>
                          </defs>
                          <path d="M0,40 L0,30 Q15,35 30,20 T60,25 T80,10 L100,5 L100,40 Z" fill="url(#sg)" />
                          <path d="M0,30 Q15,35 30,20 T60,25 T80,10 L100,5" fill="none" stroke="#4A4A4A" strokeWidth="2" strokeLinecap="round" />
                          <circle cx="100" cy="5" r="2" fill="#4A4A4A" />
                        </svg>
                      </div>
                      <div className="flex justify-between text-[9px] text-gray-400 mt-2 px-1">
                        <span>3.01</span><span>3.10</span><span>3.20</span><span>今日</span>
                      </div>
                    </div>
                  </div>
                )}

                {l3Tab === 'effect' && (
                  <div className="flex flex-col gap-3">
                    {[
                      { seed: 'magic', name: '特效：赛博朋克光晕', rev: '¥ 860.00' },
                      { seed: 'flower', name: '特效：粉色治愈泡泡', rev: '¥ 320.00' },
                      { seed: 'matrix', name: '特效：打工人发疯乱码', rev: '¥ 1,240.00' },
                      { seed: 'ghostly', name: '特效：早八灵魂出窍', rev: '¥ 510.00' },
                    ].map(({ seed, name, rev }) => (
                      <div key={seed} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                        <div className="w-24 h-24 shrink-0 bg-gray-800 rounded-xl relative overflow-hidden flex items-center justify-center" style={{ minWidth: 96, minHeight: 96 }}>
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 opacity-40" />
                          <span className="text-white/80 text-xl relative z-10">▶</span>
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <h4 className="text-xs font-bold mb-1 truncate">{name}</h4>
                            <div className="text-[10px] text-gray-400">近7日收益：<span className="text-green-500 font-bold ml-1">{rev}</span></div>
                          </div>
                          <div className="h-8 mt-2">
                            <svg viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
                              <path d="M0,15 Q20,5 40,10 T60,18 T80,5 L100,2" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {l3Tab === 'emoji' && (
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-end gap-3 text-[9px] text-gray-500 px-1">
                      <span className="flex items-center gap-1"><span className="inline-block w-4 border-t-2 border-green-500" /> 收益额</span>
                      <span className="flex items-center gap-1"><span className="inline-block w-4 border-t-2 border-blue-400 border-dashed" /> 使用频次</span>
                    </div>
                    {[
                      { seed: 'Crash', name: 'SSR：暴躁砸电脑', price: '¥1.99', freq: '1.2w次', rev: '¥ 384.00' },
                      { seed: 'Money', name: 'SR：撒钱拜财神', price: '¥0.99', freq: '8k次', rev: '¥ 125.00' },
                      { seed: 'Toilet', name: 'R：带薪如厕倒计时', price: '¥0.50', freq: '3.5w次', rev: '¥ 860.00' },
                      { seed: 'Run', name: 'R：周五下班冲刺', price: '¥0.50', freq: '1.8w次', rev: '¥ 420.00' },
                    ].map(({ seed, name, price, freq, rev }) => (
                      <div key={seed} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                        <div className="w-20 h-20 shrink-0 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center p-2" style={{ minWidth: 80, minHeight: 80 }}>
                          <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`} style={{ width: 64, height: 64 }} alt="" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-xs font-bold mb-0.5">{name}</div>
                              <div className="text-[9px] text-gray-400">单价 {price} | 频次 {freq}</div>
                            </div>
                            <div className="text-xs font-bold text-green-500">{rev}</div>
                          </div>
                          <div className="h-10 mt-1">
                            <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
                              <path d="M0,25 L20,20 L40,22 L60,10 L80,15 L100,5" fill="none" stroke="#10B981" strokeWidth="1.5" />
                              <path d="M0,28 L20,15 L40,18 L60,5 L80,8 L100,2" fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="2,2" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* IP联动 */}
            {bizSubTab === 'ipcollab' && (
              <div>
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-3 pl-1">
                    <h4 className="text-sm font-bold">进行中的联动：蓝小怪</h4>
                    <div className="text-[9px] text-gray-500">总曝光: <span className="font-bold text-[#4A4A4A]">120w</span> | 总分成: <span className="font-bold text-green-500">¥ 4,500</span></div>
                  </div>
                  <div className="flex overflow-x-auto gap-3 pb-2" style={{ scrollbarWidth: 'none' }}>
                    {[
                      { img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200&q=80', title: '【职场反击战】当仓鼠遇到蓝小怪的电脑...', heat: '1.2w', money: '¥ 860' },
                      { img: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=200&q=80', title: '超萌互动特效！打工人的双倍摸鱼快乐', heat: '3.5w', money: '¥ 2,100' },
                    ].map(({ img, title, heat, money }) => (
                      <div key={title} className="w-40 shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="h-24 bg-gray-200"><img src={img} className="w-full h-full object-cover" alt="" /></div>
                        <div className="p-2">
                          <div className="text-[10px] font-bold line-clamp-2 mb-1">{title}</div>
                          <div className="flex justify-between items-center pt-1 border-t border-gray-50">
                            <span className="text-[9px] text-red-500">🔥 {heat}</span>
                            <span className="text-[9px] font-bold text-green-500">{money}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="w-40 shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="h-24 bg-gray-100 flex items-center justify-center text-gray-400">+</div>
                      <div className="p-2 text-center text-[10px] text-gray-400">一键发布新联动贴</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-3 pl-1">联动推荐</h4>
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center text-xs text-gray-400 border border-gray-100 shadow-sm">🔍 搜索调性匹配的 IP...</div>
                    <button className="w-8 h-8 rounded-full bg-white text-gray-500 border border-gray-100 shadow-sm flex items-center justify-center shrink-0 text-[10px]">▼</button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {[
                      { seed: 'Ghost', name: '幽灵加班狗', match: '85%', matchCls: 'text-red-500 bg-red-50', tags: ['#互联网黑话', '#深夜放毒'], frames: ['G1', 'G2'] },
                      { seed: 'Fox', name: '摸鱼红狐狸', match: '78%', matchCls: 'text-orange-500 bg-orange-50', tags: ['#带薪如厕', '#吃瓜第一线'], frames: ['F1', 'F2'] },
                    ].map(({ seed, name, match, matchCls, tags, frames }) => (
                      <div key={seed} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex gap-2 items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 overflow-hidden" style={{ minWidth: 40, minHeight: 40 }}>
                              <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`} style={{ width: 40, height: 40 }} alt="" />
                            </div>
                            <div>
                              <div className="text-xs font-bold">{name} <span className={`text-[8px] ${matchCls} px-1 rounded ml-1 font-normal`}>重合度 {match}</span></div>
                              <div className="flex gap-1 mt-1">{tags.map(t => <span key={t} className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{t}</span>)}</div>
                            </div>
                          </div>
                          <button className="bg-[#4A4A4A] text-white text-[10px] px-3 py-1.5 rounded-lg font-bold shrink-0">发起邀请</button>
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-gray-50" style={{ scrollbarWidth: 'none' }}>
                          {frames.map(f => (
                            <div key={f} className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden" style={{ minWidth: 48, minHeight: 48 }}>
                              <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${f}`} style={{ width: 48, height: 48 }} alt="" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 品牌合作 */}
            {bizSubTab === 'brand' && (
              <div>
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-3 pl-1">
                    <h4 className="text-sm font-bold">执行中订单：Manner Coffee</h4>
                    <div className="text-[9px] text-gray-500">合同尾款: <span className="font-bold text-green-500">¥ 8,000</span> (待结)</div>
                  </div>
                  <div className="flex overflow-x-auto gap-3 pb-2" style={{ scrollbarWidth: 'none' }}>
                    <div className="w-40 shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="h-24 bg-gray-200"><img src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=200&q=80" className="w-full h-full object-cover opacity-90" alt="" /></div>
                      <div className="p-2">
                        <div className="text-[10px] font-bold line-clamp-2 mb-1">早八续命拿铁，仓鼠倾情推荐</div>
                        <div className="flex justify-between items-center pt-1 border-t border-gray-50">
                          <span className="text-[9px] text-red-500">🔥 5.2w</span>
                          <span className="text-[9px] font-bold text-gray-500">品牌方已审阅</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-40 shrink-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="h-24 bg-gray-100 flex items-center justify-center text-gray-400">+</div>
                      <div className="p-2 text-center text-[10px] text-gray-400">提交新商单素材贴</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold mb-3 pl-1">品牌合作推荐</h4>
                  <div className="flex gap-2 mb-4">
                    <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center text-xs text-gray-400 border border-gray-100 shadow-sm">🔍 搜索行业、预算或品牌名...</div>
                    <button className="w-8 h-8 rounded-full bg-white text-gray-500 border border-gray-100 shadow-sm flex items-center justify-center shrink-0 text-[10px]">▼</button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {[
                      { brand: '瑞幸', title: '寻找打工人嘴替 IP', match: '95%', budget: '¥ 1w - 3w', tag: '#早八干饭', refs: ['https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=100&q=80', 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=100&q=80'] },
                      { brand: '喜茶', title: '下午茶治愈系联动', match: '90%', budget: '¥ 2w - 4w', tag: '#摸鱼甜点', refs: [] },
                    ].map(({ brand, title, match, budget, tag, refs }) => (
                      <div key={brand} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex gap-2 items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center font-bold text-[11px] text-[#4A4A4A]" style={{ minWidth: 40 }}>{brand}</div>
                            <div>
                              <div className="text-xs font-bold">{title} <span className="text-[8px] bg-red-50 text-red-500 px-1 rounded ml-1 font-normal">契合度 {match}</span></div>
                              <div className="flex gap-1 mt-1 items-center">
                                <span className="text-[8px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">{budget}</span>
                                <span className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{tag}</span>
                              </div>
                            </div>
                          </div>
                          <button className="bg-white text-[#4A4A4A] border border-[#4A4A4A] text-[10px] px-3 py-1.5 rounded-lg font-bold shrink-0">投递方案</button>
                        </div>
                        {refs.length > 0 && (
                          <>
                            <div className="text-[9px] text-gray-400 mb-1 mt-2">品牌视觉参考 / 过往案例：</div>
                            <div className="flex gap-2">
                              {refs.map(r => <div key={r} className="w-20 h-12 bg-gray-100 rounded-lg overflow-hidden"><img src={r} className="w-full h-full object-cover opacity-80" alt="" /></div>)}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 周边售卖 */}
            {bizSubTab === 'merch' && (
              <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-300 p-8 flex flex-col items-center justify-center text-center mt-4">
                <div className="text-4xl mb-3">📦</div>
                <span className="text-sm font-bold text-gray-500">暂无上架实体周边</span>
                <span className="text-xs text-gray-400 mt-1">泡泡玛特盲盒正在打样审核中</span>
                <button className="mt-4 bg-white text-[#4A4A4A] border border-gray-200 text-xs px-4 py-2 rounded-xl shadow-sm font-bold">查看合作进度</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
