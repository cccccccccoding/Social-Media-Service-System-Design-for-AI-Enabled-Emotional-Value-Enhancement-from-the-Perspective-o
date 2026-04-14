import React from 'react';
import { ArrowLeft, BarChart2, TrendingUp, Users, Settings } from 'lucide-react';

interface CreatorHubProps {
  onBack: () => void;
}

export default function CreatorHub({ onBack }: CreatorHubProps) {
  return (
    <div className="w-full h-full bg-[#f8f8f8] flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="p-2 -ml-2 text-[#666666] hover:bg-[#f5f5f5] rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-[#333333]">创作者中心</h1>
        <div className="w-8"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 pb-20">
        {/* User Info / IP Summary */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-[#e5e5e5] border-2 border-white shadow-sm bg-[url('https://via.placeholder.com/150/ff7f7f/ffffff?text=Avatar')] bg-cover"></div>
            <div>
              <h2 className="text-xl font-bold text-[#333333]">耘晨</h2>
              <p className="text-sm text-[#666666]">IP状态: 活跃 | 评级: A</p>
            </div>
            <button className="ml-auto bg-[#ff2442] text-white px-4 py-1.5 rounded-full text-sm font-medium">
              优化IP
            </button>
          </div>
          <div className="flex justify-between text-center pt-4 border-t border-[#f5f5f5]">
            <div>
              <div className="text-2xl font-bold text-[#333333]">12.5k</div>
              <div className="text-xs text-[#666666] mt-1">总粉丝数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#333333]">8.2k</div>
              <div className="text-xs text-[#666666] mt-1">本月新增</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#333333]">45%</div>
              <div className="text-xs text-[#666666] mt-1">互动率</div>
            </div>
          </div>
        </div>

        {/* B-End Analytics Dashboard */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#333333] flex items-center gap-2">
              <BarChart2 size={20} className="text-[#ff2442]" />
              数据看板
            </h3>
            <span className="text-xs text-[#999999]">近30天</span>
          </div>
          
          {/* Placeholder Chart */}
          <div className="w-full h-48 bg-[#fafafa] rounded-xl flex items-end justify-between p-4 mb-4 relative overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-4 px-2 pointer-events-none">
              <div className="border-b border-[#ebebeb] w-full"></div>
              <div className="border-b border-[#ebebeb] w-full"></div>
              <div className="border-b border-[#ebebeb] w-full"></div>
              <div className="border-b border-[#ebebeb] w-full"></div>
            </div>
            
            {/* Bars */}
            {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
              <div key={i} className="w-8 bg-gradient-to-t from-[#ff2442]/80 to-[#ff2442]/40 rounded-t-md relative z-10" style={{ height: `${height}%` }}></div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#fafafa] p-3 rounded-xl">
              <div className="text-xs text-[#666666] mb-1 flex items-center gap-1"><TrendingUp size={12} /> 曝光量</div>
              <div className="text-lg font-bold text-[#333333]">1.2M</div>
              <div className="text-[10px] text-green-500">+12% 较上月</div>
            </div>
            <div className="bg-[#fafafa] p-3 rounded-xl">
              <div className="text-xs text-[#666666] mb-1 flex items-center gap-1"><Users size={12} /> 转化率</div>
              <div className="text-lg font-bold text-[#333333]">3.8%</div>
              <div className="text-[10px] text-green-500">+0.5% 较上月</div>
            </div>
          </div>
        </div>

        {/* IP Management Tools */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-lg font-bold text-[#333333] mb-4 flex items-center gap-2">
            <Settings size={20} className="text-[#ff2442]" />
            IP中心 - 优化工具
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#fafafa] rounded-xl cursor-pointer hover:bg-[#f5f5f5] transition-colors">
              <div>
                <div className="font-bold text-[#333333] text-sm">内容风格分析</div>
                <div className="text-xs text-[#666666] mt-0.5">AI诊断当前笔记风格一致性</div>
              </div>
              <div className="text-[#ff2442] font-bold">→</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#fafafa] rounded-xl cursor-pointer hover:bg-[#f5f5f5] transition-colors">
              <div>
                <div className="font-bold text-[#333333] text-sm">受众画像洞察</div>
                <div className="text-xs text-[#666666] mt-0.5">深入了解粉丝兴趣偏好</div>
              </div>
              <div className="text-[#ff2442] font-bold">→</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#fafafa] rounded-xl cursor-pointer hover:bg-[#f5f5f5] transition-colors">
              <div>
                <div className="font-bold text-[#333333] text-sm">商业化潜力评估</div>
                <div className="text-xs text-[#666666] mt-0.5">发现变现新机会</div>
              </div>
              <div className="text-[#ff2442] font-bold">→</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
