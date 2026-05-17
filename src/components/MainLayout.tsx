import React, { useState } from 'react';
import { ViewState } from '../App';
import { Menu, Search, Plus, Share } from 'lucide-react';

interface MainLayoutProps {
  currentTab: 'home' | 'profile';
  onNavigate: (view: ViewState) => void;
}

export default function MainLayout({ currentTab, onNavigate }: MainLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="w-full h-full bg-[#f8f8f8] relative flex flex-col overflow-hidden">
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative">
        {currentTab === 'home' && (
          <div className="w-full min-h-full">
            <div className="flex justify-between items-center p-4 bg-white sticky top-0 z-10">
              <div className="text-[#333333] cursor-pointer"><Menu size={24} strokeWidth={2} /></div>
              <div className="flex gap-5 text-[15px] text-[#999999]">
                <span>关注</span>
                <span className="text-[#333333] font-bold relative after:content-[''] after:absolute after:-bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-5 after:h-[3px] after:bg-[#ff2442] after:rounded-sm">发现</span>
                <span>上海</span>
              </div>
              <div className="text-[#333333] cursor-pointer"><Search size={24} strokeWidth={2} /></div>
            </div>
            <div className="flex p-1.5 gap-1.5 bg-[#f8f8f8] pb-28">
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer" onClick={() => onNavigate('post_detail')}>
                  <div className="w-full h-[180px] bg-gradient-to-br from-[#fdfbfb] to-[#ebedee]"></div>
                  <div className="p-2.5">
                    <div className="text-sm mb-2 line-clamp-2 leading-snug text-[#333333]">MCP、Skill，卷到最后，竟然回归了CLI？</div>
                    <div className="flex justify-between text-xs text-[#999999] items-center"><span>👤 403-error</span><span>♡ 655</span></div>
                  </div>
                </div>
                <div className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer" onClick={() => onNavigate('post_detail')}>
                  <div className="w-full h-[220px] bg-gradient-to-t from-[#accbee] to-[#e7f0fd]"></div>
                  <div className="p-2.5">
                    <div className="text-sm mb-2 line-clamp-2 leading-snug text-[#333333]">春天的奶昔白包包呀👜 超级百搭的日常好物推荐</div>
                    <div className="flex justify-between text-xs text-[#999999] items-center"><span>👤 大肥甄选</span><span>♡ 3</span></div>
                  </div>
                </div>
                <div className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer" onClick={() => onNavigate('post_detail')}>
                  <div className="w-full h-[190px] bg-gradient-to-r from-[#ffecd2] to-[#fcb69f]"></div>
                  <div className="p-2.5">
                    <div className="text-sm mb-2 line-clamp-2 leading-snug text-[#333333]">周末看展指南 | 上海近期最值得打卡的设计艺术展</div>
                    <div className="flex justify-between text-xs text-[#999999] items-center"><span>👤 魔都看展君</span><span>♡ 2.1k</span></div>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer" onClick={() => onNavigate('post_detail')}>
                  <div className="w-full h-[150px] bg-gradient-to-t from-[#fff1eb] to-[#ace0f9]"></div>
                  <div className="p-2.5">
                    <div className="text-sm mb-2 line-clamp-2 leading-snug text-[#333333]">大家会喜欢华住旗下的哪家酒店？</div>
                    <div className="flex justify-between text-xs text-[#999999] items-center"><span>👤 飞猪带你玩</span><span>♡ 31</span></div>
                  </div>
                </div>
                <div className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer" onClick={() => onNavigate('post_detail')}>
                  <div className="w-full h-[160px] bg-gradient-to-r from-[#fa709a] to-[#fee140]"></div>
                  <div className="p-2.5">
                    <div className="text-sm mb-2 line-clamp-2 leading-snug text-[#333333]">在涅槃时我探寻真我 | 飞鸟集新款磁吸手机壳开箱</div>
                    <div className="flex justify-between text-xs text-[#999999] items-center"><span>👤 愚鱼 Yuyu</span><span>♡ 14</span></div>
                  </div>
                </div>
                <div className="bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer" onClick={() => onNavigate('post_detail')}>
                  <div className="w-full h-[230px] bg-gradient-to-t from-[#d4fc79] to-[#96e6a1]"></div>
                  <div className="p-2.5">
                    <div className="text-sm mb-2 line-clamp-2 leading-snug text-[#333333]">梧桐区CityWalk路线 | 感受老上海独有的浪漫街区</div>
                    <div className="flex justify-between text-xs text-[#999999] items-center"><span>👤 城市漫游者</span><span>♡ 4.5k</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === 'profile' && (
          <div className="w-full min-h-full bg-[#f8f8f8]">
            <div className="bg-gradient-to-b from-[#5a2e2e] to-[#8b3a3a] text-white p-4 pb-16 relative">
              <div className="flex justify-between mb-5 cursor-pointer">
                <div onClick={() => setIsDrawerOpen(true)}><Menu size={24} strokeWidth={2} /></div> 
                <Share size={24} strokeWidth={2} />
              </div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-[75px] h-[75px] rounded-full bg-[#cccccc] border-2 border-white/80 bg-[url('https://via.placeholder.com/150/ff7f7f/ffffff?text=Avatar')] bg-cover"></div>
                <div>
                  <div className="text-xl font-bold mb-1">耘晨 ⌄</div>
                  <div className="text-xs text-white/80">小红书号: 6772211231 㗊<br/>IP属地: 上海 ⓘ</div>
                </div>
              </div>
              <div className="flex gap-5 text-sm text-center mb-5 text-white/90">
                <span><b className="block text-base mb-0.5 text-white">297</b>关注</span>
                <span><b className="block text-base mb-0.5 text-white">72</b>粉丝</span>
                <span><b className="block text-base mb-0.5 text-white">151</b>获赞与收藏</span>
                <span className="ml-auto border border-white/50 px-4 py-1 rounded-full text-sm flex items-center justify-center">编辑资料</span>
              </div>
              
              <div className="mx-[-15px] px-[15px] overflow-x-auto no-scrollbar mb-2">
                <div className="flex gap-2.5 w-max pr-[15px]">
                  <div className="bg-white/15 p-2.5 rounded-lg flex items-center gap-2 shrink-0 min-w-[120px]">
                    <div className="text-xl">💡</div>
                    <div><b className="text-[13px] text-white block mb-0.5">创作灵感</b><span className="text-[11px] text-white/70">学创作找灵感</span></div>
                  </div>
                  <div className="bg-white/15 p-2.5 rounded-lg flex items-center gap-2 shrink-0 min-w-[120px] cursor-pointer" onClick={() => onNavigate('ip_hub')}>
                    <div className="text-xl">🐰</div>
                    <div><b className="text-[13px] text-white block mb-0.5">我的IP</b><span className="text-[11px] text-white/70">星黛露专属</span></div>
                  </div>
                  <div className="bg-white/15 p-2.5 rounded-lg flex items-center gap-2 shrink-0 min-w-[120px]">
                    <div className="text-xl">🕒</div>
                    <div><b className="text-[13px] text-white block mb-0.5">浏览记录</b><span className="text-[11px] text-white/70">看过的笔记</span></div>
                  </div>
                  <div className="bg-white/15 p-2.5 rounded-lg flex items-center gap-2 shrink-0 min-w-[120px]">
                    <div className="text-xl">🐱</div>
                    <div><b className="text-[13px] text-white block mb-0.5">宠物小伙伴</b><span className="text-[11px] text-white/70">回家看看</span></div>
                  </div>
                </div>
              </div>

              <div className="flex bg-[#f8f8f8] rounded-t-2xl p-4 justify-around absolute bottom-0 left-0 w-full text-[15px] text-[#666666]">
                <span className="text-[#333333] font-bold relative after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:-translate-x-1/2 after:w-5 after:h-[3px] after:bg-[#ff2442] after:rounded-sm">笔记</span>
                <span>🔒 评论</span>
                <span>收藏</span>
                <span>🔒 赞过</span>
              </div>
            </div>
            
            <div className="bg-[#f8f8f8] min-h-[400px] p-1.5 pb-28">
              <div className="flex gap-1.5">
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <div className="h-[200px] bg-[#4a5d23]"></div>
                    <div className="p-2.5"><div className="text-sm text-[#333333]">一人一句正能量语录<br/><span className="text-[#999999] text-[11px]">官方喊你来参与热门话题</span></div></div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                    <div className="h-[150px] bg-white border border-[#f5f5f5] flex items-center justify-center text-[#666666] text-center p-5">
                      Google AI models<br/>⬇<br/>❄ Let it snow
                    </div>
                    <div className="p-2.5"><div className="text-sm text-[#333333]">发现一个有趣的AI彩蛋</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 w-full bg-white border-t border-[#ebebeb] flex justify-around items-center z-50 px-6 pb-6 pt-3">
        <div className={`text-[15px] cursor-pointer flex items-center ${currentTab === 'home' ? 'text-[#333333] font-bold' : 'text-[#999999]'}`} onClick={() => onNavigate('home')}>首页</div>
        <div className="text-[15px] text-[#999999] cursor-pointer flex items-center">市集</div>
        <div className="w-12 h-9 bg-[#ff2442] text-white rounded-xl flex justify-center items-center cursor-default opacity-60">
          <Plus size={24} strokeWidth={2.5} />
        </div>
        <div className="text-[15px] text-[#999999] cursor-pointer flex items-center">消息</div>
        <div className={`text-[15px] cursor-pointer flex items-center ${currentTab === 'profile' ? 'text-[#333333] font-bold' : 'text-[#999999]'}`} onClick={() => onNavigate('profile')}>我</div>
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="absolute inset-0 bg-black/50 z-[200] transition-opacity duration-300" onClick={() => setIsDrawerOpen(false)}></div>
      )}
      <div className={`absolute top-0 w-[75%] h-full bg-[#f8f8f8] z-[201] transition-all duration-300 flex flex-col ${isDrawerOpen ? 'left-0' : '-left-[75%]'}`}>
        <div className="flex-1 overflow-y-auto bg-white rounded-tr-2xl rounded-br-2xl">
          <div className="border-b-[8px] border-[#f8f8f8] py-1">
            <div className="p-4 flex items-center gap-4 text-[15px] cursor-pointer text-[#333333] hover:bg-[#fafafa]">👤 添加好友</div>
            <div className="p-4 flex items-center gap-4 text-[15px] cursor-pointer text-[#333333] hover:bg-[#fafafa]" onClick={() => onNavigate('creator_center')}>⚡ 创作者中心</div> 
            <div className="p-4 flex items-center gap-4 text-[15px] cursor-pointer text-[#333333] hover:bg-[#fafafa]">🛡 升级为专业号</div>
          </div>
          <div className="border-b-[8px] border-[#f8f8f8] py-1">
            <div className="p-4 flex items-center gap-4 text-[15px] cursor-pointer text-[#333333] hover:bg-[#fafafa]">🗂 我的草稿</div>
            <div className="p-4 flex items-center gap-4 text-[15px] cursor-pointer text-[#333333] hover:bg-[#fafafa]">⏱ 浏览记录</div>
            <div className="p-4 flex items-center gap-4 text-[15px] cursor-pointer text-[#333333] hover:bg-[#fafafa]">⬇ 我的下载</div>
          </div>
          <div className="border-b-[8px] border-[#f8f8f8] py-1">
            <div className="p-4 flex items-center gap-4 text-[15px] cursor-pointer text-[#333333] hover:bg-[#fafafa]">📋 订单</div>
            <div className="p-4 flex items-center gap-4 text-[15px] cursor-pointer text-[#333333] hover:bg-[#fafafa]">🛒 购物车 <span className="text-red-500 ml-auto text-xs">●</span></div>
            <div className="p-4 flex items-center gap-4 text-[15px] cursor-pointer text-[#333333] hover:bg-[#fafafa]">👛 钱包</div>
            <div className="p-4 flex items-center gap-4 text-[15px] cursor-pointer text-[#333333] hover:bg-[#fafafa]">🔗 小程序</div>
            <div className="p-4 flex items-center gap-4 text-[15px] cursor-pointer text-[#333333] hover:bg-[#fafafa]">🌱 社区公约</div>
          </div>
        </div>
        <div className="flex justify-around p-4 bg-white text-xs text-[#666666]">
          <div className="text-center cursor-pointer">[-] <br/> 扫一扫</div>
          <div className="text-center cursor-pointer">🎧 <br/> 帮助与客服</div>
          <div className="text-center cursor-pointer" onClick={() => onNavigate('creator_center')}>⚙ <br/> 设置</div>
        </div>
      </div>
    </div>
  );
}
