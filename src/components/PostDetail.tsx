import React, { useState, useEffect, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Share, ChevronLeft, Search, SmilePlus, X, Sparkles, PlayCircle, Download, Send, Star } from 'lucide-react';
import { usePersistentState } from '../hooks/usePersistentState';

// 动图列表 - 从配置文件加载
let cachedGifs: string[] = [];

// 存储每个ID对应的动图
let gifCache: Record<string, string> = {};

// 三级云朵资产：按文件名前缀分组
const TIER_ASSETS: Record<1 | 2 | 3, string[]> = {
  1: ['/cluster-assets/1-1.png', '/cluster-assets/1-2.png', '/cluster-assets/1-3.png', '/cluster-assets/1-4png.png', '/cluster-assets/1-5.png'],
  2: ['/cluster-assets/2.png'],
  3: ['/cluster-assets/3.png'],
};
const tierAssetCache: Record<string, string> = {};
const getClusterAssetForTier = (id: string, tier: 1 | 2 | 3): string => {
  const key = `${id}-${tier}`;
  if (!tierAssetCache[key]) {
    const list = TIER_ASSETS[tier];
    const h = id.split('').reduce((acc, c) => (acc << 5) - acc + c.charCodeAt(0), 0);
    tierAssetCache[key] = list[Math.abs(h) % list.length];
  }
  return tierAssetCache[key];
};

// 随机选择小团组视觉资产，根据ID保持一致

const loadGifsFromConfig = async () => {
  try {
    const response = await fetch('/gifs/config.json');
    const data = await response.json();
    cachedGifs = data.gifs || [];
    console.log(`✅ 加载了 ${cachedGifs.length} 个动图`);
    return cachedGifs;
  } catch (error) {
    console.error('❌ 加载动图配置失败:', error);
    return [];
  }
};

// 清除动图缓存，让下次随机选择
const clearGifCache = () => {
  gifCache = {};
};

// 随机选择动图的函数，根据ID保持一致
const getRandomGifForId = (id: string) => {
  if (!gifCache[id]) {
    if (cachedGifs.length > 0) {
      gifCache[id] = cachedGifs[Math.floor(Math.random() * cachedGifs.length)];
    } else {
      gifCache[id] = '/gifs/兔-送蛋糕.gif';
    }
  }
  return gifCache[id];
};

// 随机选择动图的函数（不使用缓存）
const getRandomGif = () => {
  if (cachedGifs.length > 0) {
    return cachedGifs[Math.floor(Math.random() * cachedGifs.length)];
  }
  return '/gifs/兔-送蛋糕.gif';
};

// 初始化加载动图
loadGifsFromConfig();

// 使用随机动图 - 延迟初始化
const IMAGES: Record<string, string> = {};

const initializeImages = () => {
  IMAGES.hug = getRandomGif();
  IMAGES.flower = getRandomGif();
  IMAGES.pat = getRandomGif();
  IMAGES.cry = getRandomGif();
  IMAGES.star = getRandomGif();
  IMAGES.plead = getRandomGif();
  IMAGES.sleep = getRandomGif();
  IMAGES.ghost = getRandomGif();
  IMAGES.water = getRandomGif();
  IMAGES.sparkle = getRandomGif();
  IMAGES.heart = getRandomGif();
  IMAGES.bulb = getRandomGif();
  IMAGES.clap = getRandomGif();
  IMAGES.smile = getRandomGif();
};

// 立即初始化
initializeImages();

const IMAGES_LIST = [
  '/gifs/兔-送蛋糕.gif',
  '/gifs/兔-雀跃.gif',
  '/gifs/兔子-躺平.gif',
  '/gifs/宝宝-睡觉.gif',
  '/gifs/宝宝-起床.gif',
  '/gifs/宝宝-骄傲.gif',
  '/gifs/小绿人-圣诞节.gif',
  '/gifs/小绿人-无语.gif',
  '/gifs/猪-打嗝.gif',
  '/gifs/虾-害羞.gif'
];

// PNG/GIF 配对：文件名相同、后缀不同即为一对
// 所有 PNG 均有对应 GIF，直接替换后缀即可
const toGifSrc = (src: string): string => src.replace(/\.png$/i, '.gif');
const isPng    = (src: string): boolean => /\.png$/i.test(src);

const URL_TO_EMOJI: Record<string, string> = {
  [IMAGES.hug]: '🤗',
  [IMAGES.flower]: '🎉',
  [IMAGES.pat]: '🥰',
  [IMAGES.cry]: '😭',
  [IMAGES.star]: '🤩',
  [IMAGES.plead]: '🥺',
  [IMAGES.sleep]: '😴',
  [IMAGES.ghost]: '👻',
  [IMAGES.water]: '💧',
  [IMAGES.sparkle]: '✨',
  [IMAGES.heart]: '💖',
  [IMAGES.bulb]: '💡',
  [IMAGES.clap]: '👏',
  [IMAGES.smile]: '😊',
};

const SafeIpImage = ({ src, className, alt, style }: { src: string, className?: string, alt?: string, style?: React.CSSProperties }) => {
  const [error, setError] = useState(false);
  
  if (error || !src) {
    const emoji = URL_TO_EMOJI[src] || '👤';
    return (
      <div className={`flex items-center justify-center bg-[#f5f5f5] rounded-full ${className}`} style={{ fontSize: '1.5em', ...style }}>
        {emoji}
      </div>
    );
  }

  return (
    <img 
      src={src}
      className={className} 
      alt={alt} 
      style={style}
      onError={() => setError(true)} 
      referrerPolicy="no-referrer"
    />
  );
};

const SafeAvatar = ({ src, className, alt }: { src: string, className?: string, alt?: string }) => {
  const [error, setError] = useState(false);
  
  if (error || !src) {
    return (
      <div className={`flex items-center justify-center bg-blue-100 text-blue-500 font-bold rounded-full ${className}`}>
        {alt ? alt.charAt(0).toUpperCase() : 'U'}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      className={className} 
      alt={alt} 
      onError={() => setError(true)} 
      referrerPolicy="no-referrer"
    />
  );
};

const POST_DATA = {
  id: 'post',
  author: '马达',
  avatar: 'https://picsum.photos/seed/author/100/100',
  title: '人生不过是几个瞬息',
  text: '她在小学五年级的那个暑假开始前，跟班上那个最聪明的女孩打赌，看谁能在暑假结束后写完自己的人生第一部小说。\n\n两个月结束了，她们自然地在班级里打了照面，谁都没有提这一茬。\n\n接着她就34岁了。',
  time: '昨天 12:13',
  ip: getRandomGif(), // 帖子的主情绪 IP
};

type Comment = {
  id: string; user: string; avatar: string; text: string; time: string;
  likes: number; ip: string; actionKey: string; isGroupReply?: boolean; isNew?: boolean;
  replies?: Omit<Comment, 'replies'>[];
};

const MOCK_COMMENTS: Comment[] = [
  {
    id: 'c1',
    user: '正在转行的码字达人',
    avatar: 'https://picsum.photos/seed/user1/100/100',
    text: '我朋友38岁那年说要写小说了，现在42岁，小说改成短剧了',
    time: '昨天 17:15',
    likes: 2904,
    ip: getRandomGif(),
    actionKey: 'flower',
    replies: [
      { id: 'r1', user: '马达', avatar: 'https://picsum.photos/seed/author/100/100', text: '吾辈楷模', time: '昨天 17:31', likes: 593, ip: getRandomGif(), actionKey: 'hug' },
      { id: 'r2', user: '正在转行的码字达人', avatar: 'https://picsum.photos/seed/user1/100/100', text: '她43了', time: '昨天 18:08', likes: 136, ip: getRandomGif(), actionKey: 'pat' },
      { id: 'r3', user: '橘平淳', avatar: 'https://picsum.photos/seed/user2/100/100', text: '不会是去年参加年会的吧', time: '昨天 19:12', likes: 2, ip: getRandomGif(), actionKey: 'hug' },
      { id: 'r4', user: '褒义词', avatar: 'https://picsum.photos/seed/user3/100/100', text: '天啊好鼓舞人心', time: '昨天 21:10', likes: 0, ip: getRandomGif(), actionKey: 'pat' },
      { id: 'r5', user: '🍓不🍌虑', avatar: 'https://picsum.photos/seed/user4/100/100', text: '人家应该只是英文不好', time: '昨天 21:12', likes: 5, ip: getRandomGif(), actionKey: 'hug' },
      { id: 'r6', user: 'Miya+', avatar: 'https://picsum.photos/seed/user5/100/100', text: '可以手写稿的呀', time: '昨天 21:22', likes: 0, ip: getRandomGif(), actionKey: 'pat' },
      { id: 'r7', user: 'foxxx', avatar: 'https://picsum.photos/seed/user6/100/100', text: '呀，天呐，我要收藏这段话', time: '昨天 22:21', likes: 4, ip: getRandomGif(), actionKey: 'hug' },
      { id: 'r8', user: '云吃吃', avatar: 'https://picsum.photos/seed/user7/100/100', text: '哇哦@云吃吃', time: '昨天 22:54', likes: 1, ip: getRandomGif(), actionKey: 'pat' }
    ]
  },
  {
    id: 'c2',
    user: 'sunday',
    avatar: 'https://picsum.photos/seed/user4/100/100',
    text: '那井底，有我掉下的一把剪刀。我为这件事苦恼了几十年',
    time: '昨天 22:50',
    likes: 745,
    ip: getRandomGif(),
    actionKey: 'pat',
    replies: [
      { id: 'r4', user: '小岛', avatar: 'https://picsum.photos/seed/user5/100/100', text: '只要想起一生中后悔的事', time: '昨天 22:59', likes: 249, ip: getRandomGif(), actionKey: 'hug' },
      { id: 'r5', user: '火山小猴', avatar: 'https://picsum.photos/seed/user6/100/100', text: '我的天🥹', time: '昨天 22:54', likes: 2, ip: getRandomGif(), actionKey: 'pat' },
      { id: 'r6', user: 'momo', avatar: 'https://picsum.photos/seed/user7/100/100', text: '请问下文章名或者书名', time: '昨天 23:03', likes: 0, ip: getRandomGif(), actionKey: 'hug' },
      { id: 'r7', user: '白鸟过河滩', avatar: 'https://picsum.photos/seed/user8/100/100', text: '可以问问文章名嘛', time: '昨天 23:05', likes: 0, ip: getRandomGif(), actionKey: 'pat' },
      { id: 'r8', user: '小葫芦呼呼呼', avatar: 'https://picsum.photos/seed/user9/100/100', text: '蹲个书名', time: '昨天 23:08', likes: 0, ip: getRandomGif(), actionKey: 'hug' },
      { id: 'r9', user: '尾巴博物馆', avatar: 'https://picsum.photos/seed/user10/100/100', text: '天啊，大晚上看不得这些', time: '46分钟前', likes: 1, ip: getRandomGif(), actionKey: 'pat' },
      { id: 'r10', user: '九分兔', avatar: 'https://picsum.photos/seed/user11/100/100', text: '好美', time: '43分钟前', likes: 0, ip: getRandomGif(), actionKey: 'hug' }
    ]
  },
  {
    id: 'c3',
    user: 'momo（德国求生版）',
    avatar: 'https://picsum.photos/seed/user7/100/100',
    text: '她和同门打赌发C刊，两个月后谁都没提',
    time: '昨天 21:21',
    likes: 1008,
    ip: getRandomGif(),
    actionKey: 'hug',
    replies: [
      { id: 'r6', user: '😘', avatar: 'https://picsum.photos/seed/user8/100/100', text: '德国', time: '昨天 21:23', likes: 255, ip: getRandomGif(), actionKey: 'pat' },
      { id: 'r7', user: '陈年', avatar: 'https://picsum.photos/seed/user9/100/100', text: '好油菜花你们都哈哈哈哈哈', time: '昨天 21:26', likes: 8, ip: getRandomGif(), actionKey: 'hug' },
      { id: 'r8', user: '渭北春天树', avatar: 'https://picsum.photos/seed/user10/100/100', text: '@wuhaha 笑死我了', time: '昨天 22:39', likes: 0, ip: getRandomGif(), actionKey: 'pat' },
      { id: 'r9', user: '圆二初三', avatar: 'https://picsum.photos/seed/user11/100/100', text: 'ip正确', time: '昨天 22:46', likes: 1, ip: getRandomGif(), actionKey: 'hug' },
      { id: 'r10', user: '我与狸花不出门', avatar: 'https://picsum.photos/seed/user12/100/100', text: '又哭又笑', time: '39分钟前', likes: 0, ip: getRandomGif(), actionKey: 'pat' }
    ]
  },
  {
    id: 'c4',
    user: '吃点绿豆冰',
    avatar: 'https://picsum.photos/seed/user10/100/100',
    text: '总想着等文笔成熟了再写，时间就在这些等一等里流掉了',
    time: '昨天 22:21',
    likes: 332,
    ip: getRandomGif(),
    actionKey: 'hug',
    replies: [
      { id: 'r8', user: '吃点绿豆冰', avatar: 'https://picsum.photos/seed/user10/100/100', text: '我13岁写第一个故事，23岁写第二个', time: '昨天 22:26', likes: 121, ip: getRandomGif(), actionKey: 'pat' },
      { id: 'r9', user: '威尔士第一羊毛厂', avatar: 'https://picsum.photos/seed/user11/100/100', text: '听懂的人都也不知道在等什么', time: '昨天 22:27', likes: 7, ip: getRandomGif(), actionKey: 'hug' },
      { id: 'r10', user: '平平淡淡才是真', avatar: 'https://picsum.photos/seed/user12/100/100', text: '小时候觉得自己写的东西不够好', time: '46分钟前', likes: 1, ip: getRandomGif(), actionKey: 'pat' }
    ]
  },
  {
    id: 'c5',
    user: '柳花明',
    avatar: 'https://picsum.photos/seed/user16/100/100',
    text: '我中学和朋友一起写小说，转眼34岁',
    time: '昨天 13:44',
    likes: 106,
    ip: getRandomGif(),
    actionKey: 'pat',
    replies: [
      { id: 'r14', user: '马达', avatar: 'https://picsum.photos/seed/author/100/100', text: '那时该是何等的愉快呀', time: '昨天 14:22', likes: 31, ip: getRandomGif(), actionKey: 'hug' },
      { id: 'r15', user: '冰镇啤酒', avatar: 'https://picsum.photos/seed/user17/100/100', text: '看这句话感慨万千', time: '昨天 17:58', likes: 1, ip: getRandomGif(), actionKey: 'pat' },
      { id: 'r16', user: '柳花明', avatar: 'https://picsum.photos/seed/user16/100/100', text: '是很快乐，不过也还没有放弃', time: '昨天 18:02', likes: 1, ip: getRandomGif(), actionKey: 'hug' }
    ]
  },
  {
    id: 'c6',
    user: '雷阵雨阁下',
    avatar: 'https://picsum.photos/seed/user17/100/100',
    text: '翻出十年前初二手写的小说',
    time: '昨天 20:47',
    likes: 13,
    ip: getRandomGif(),
    actionKey: 'flower',
    replies: [
      { id: 'r16', user: '马达', avatar: 'https://picsum.photos/seed/author/100/100', text: '要素齐全', time: '昨天 20:49', likes: 2, ip: getRandomGif(), actionKey: 'pat' },
      { id: 'r17', user: 'ᅠᅠ', avatar: 'https://picsum.photos/seed/user18/100/100', text: '这个封面！！好有时代感啊', time: '昨天 20:58', likes: 2, ip: getRandomGif(), actionKey: 'flower' }
    ]
  },
  {
    id: 'c7',
    user: '小红薯67CFDAD1',
    avatar: 'https://picsum.photos/seed/user13/100/100',
    text: '14岁开始写同人，24岁发现只会写同人',
    time: '48分钟前',
    likes: 20,
    ip: getRandomGif(),
    actionKey: 'hug',
    replies: [
      { id: 'r12', user: '人淡如菊雷霆佳佳', avatar: 'https://picsum.photos/seed/user14/100/100', text: '看你这句话我想哭', time: '44分钟前', likes: 1, ip: getRandomGif(), actionKey: 'hug' },
      { id: 'r13', user: '丹恒老师我是您的狗啊', avatar: 'https://picsum.photos/seed/user15/100/100', text: '们同人女就这样', time: '42分钟前', likes: 0, ip: getRandomGif(), actionKey: 'pat' }
    ]
  },
  {
    id: 'c8',
    user: '清凝',
    avatar: 'https://picsum.photos/seed/user19/100/100',
    text: '五年级是文学梦萌芽的时候',
    time: '昨天 22:11',
    likes: 1,
    ip: getRandomGif(),
    actionKey: 'hug',
    replies: [
      { id: 'r15', user: '白月光归国', avatar: 'https://picsum.photos/seed/user20/100/100', text: '我10岁写连载给同学看', time: '29分钟前', likes: 1, ip: getRandomGif(), actionKey: 'flower' }
    ]
  },
  {
    id: 'c9',
    user: '苏丽珂',
    avatar: 'https://picsum.photos/seed/user21/100/100',
    text: '小学想写小说，现在写了115万字',
    time: '昨天 21:46',
    likes: 9,
    ip: getRandomGif(),
    actionKey: 'flower',
    replies: []
  },
  {
    id: 'c10',
    user: 'loveakira',
    avatar: 'https://picsum.photos/seed/user22/100/100',
    text: '她在毕业纪念册写最想去希腊',
    time: '昨天 22:10',
    likes: 4,
    ip: getRandomGif(),
    actionKey: 'flower',
    replies: []
  },
  {
    id: 'c11',
    user: '小原的读书笔记',
    avatar: 'https://picsum.photos/seed/user24/100/100',
    text: '距离青春期过去17年了',
    time: '50分钟前',
    likes: 2,
    ip: getRandomGif(),
    actionKey: 'pat',
    replies: []
  },
  {
    id: 'c12',
    user: '深山中的肘子仙',
    avatar: 'https://picsum.photos/seed/user25/100/100',
    text: '我小学和同学打赌要当作家',
    time: '昨天 21:37',
    likes: 1,
    ip: getRandomGif(),
    actionKey: 'flower',
    replies: []
  },
  {
    id: 'c13',
    user: '阿娟尼特',
    avatar: 'https://picsum.photos/seed/user12/100/100',
    text: '好像张爱玲那个小文',
    time: '昨天 20:57',
    likes: 151,
    ip: getRandomGif(),
    actionKey: 'pat',
    replies: []
  }
];

const initialActions = {
  hug: { icon: getRandomGif(), text: '准备给个抱抱', complement: getRandomGif(), targetIp: getRandomGif(), label: '抱抱' },
  flower: { icon: getRandomGif(), text: '开心撒花', complement: getRandomGif(), targetIp: getRandomGif(), label: '撒花' },
  pat: { icon: getRandomGif(), text: '贴贴安慰', complement: getRandomGif(), targetIp: getRandomGif(), label: '贴贴' }
};

const getIpStateStyle = (count: number) => {
  if (count === 0) return { filter: 'none', scale: 1 };
  if (count <= 3) return { filter: 'none', scale: 1.05 };
  if (count <= 10) return { filter: 'drop-shadow(0 0 8px rgba(250,204,21,0.5))', scale: 1.1 };
  return { filter: 'drop-shadow(0 0 12px rgba(236,72,153,0.6))', scale: 1.15 };
};

// 将 ID 字符串确定性地映射到 [0, 1] 浮点数，用于给每个 IP 分配稳定的 jitter
const idToFloat = (id: string): number => {
  let h = 5381;
  for (let i = 0; i < id.length; i++) h = ((h << 5) + h + id.charCodeAt(i)) & 0xffffffff;
  return (h >>> 0) / 4294967295;
};

// IP 热度评分（不含 jitter，用于排名和 topThreeMinScore 计算）
const computeIpScore = (item: any, interactionCount: number): number =>
  (item.likes || 0) * 2 +
  (item.children?.length || item.replies?.length || 0) * 5 +
  interactionCount * 10;

// 三态可见性：分数决定「应在哪个缩放级别出现」，加 ±0.3 抖动让出现时机更分散。
// topThreeMinScore：保证得分前 3 名的 IP 在任何缩放下都是正常态。
const getIpVisibility = (
  item: any,
  interactionCount: number,
  currentScale: number,
  topThreeMinScore: number
): 'hidden' | 'small' | 'normal' => {
  const score = computeIpScore(item, interactionCount);

  // 前三名保底：始终正常态
  if (topThreeMinScore > 0 && score >= topThreeMinScore) return 'normal';

  const cappedScore = Math.min(score, 60);
  const MIN_SCALE = 0.88;
  const MAX_SCALE = 3.0;

  // 基础阈值：分高→阈值低（小缩放就出现），分低→阈值高（需放大才出现）
  let normalThreshold = MAX_SCALE - (cappedScore / 60) * (MAX_SCALE - MIN_SCALE);

  // 每个 IP 独立的 ±0.3 抖动，让出现时机分散而非成批
  const jitter = (idToFloat(item.id) - 0.5) * 0.6;
  normalThreshold = Math.max(MIN_SCALE, Math.min(MAX_SCALE, normalThreshold + jitter));

  const smallThreshold = normalThreshold * 0.65;

  if (currentScale >= normalThreshold) return 'normal';
  if (currentScale >= smallThreshold)  return 'small';
  return 'hidden';
};

const getMoodGif = (count: number, customMoods: any) => {
  if (count === 0) return null;
  if (count <= 2) return customMoods.stage1;
  if (count <= 5) return customMoods.stage2;
  return customMoods.stage3;
};

const CommentIp = ({ 
  id, ip, interactionCounts, lastInteractions, interactingIpId, activeIpMenuId, 
  handleCommentIpClick, triggerCommentIpInteraction, customUserIp, customMoods, customActions,
  customImages, handleImageContextMenu, handleActionContextMenu, isMe, onLongPress
}: any) => {
  const count = interactionCounts[id] || 0;
  const isInteracting = interactingIpId === id;
  const stateStyle = getIpStateStyle(count);
  const moodGif = getMoodGif(count, customMoods);
  
  // 随机选择一个动图，根据ID保持一致
  const randomGif = useMemo(() => {
    if (customImages?.[id]) return customImages[id];
    return getRandomGifForId(id);
  }, [id, customImages]);

  const timerRef = useRef<any>(null);
  const isLongPress = useRef(false);
  const ipRef = useRef<HTMLDivElement>(null);
  const [menuOffset, setMenuOffset] = useState(0);

  const hasInteracted = !!lastInteractions[id];

  useEffect(() => {
    if (activeIpMenuId === id && ipRef.current) {
      const ipRect = ipRef.current.getBoundingClientRect();
      const container = document.getElementById('app-container');
      if (container) {
        const containerRect = container.getBoundingClientRect();
        
        // The menu is centered on the IP icon.
        // Menu width is roughly: 3 buttons * 32px + 2 gaps * 6px + 2 padding * 6px = 96 + 12 + 12 = 120px.
        const menuWidth = 120;
        const expectedMenuLeft = ipRect.left + ipRect.width / 2 - menuWidth / 2;
        const expectedMenuRight = expectedMenuLeft + menuWidth;
        
        const overflowLeft = (containerRect.left + 16) - expectedMenuLeft;
        const overflowRight = expectedMenuRight - (containerRect.right - 16);
        
        if (overflowLeft > 0) {
          setMenuOffset(overflowLeft);
        } else if (overflowRight > 0) {
          setMenuOffset(-overflowRight);
        } else {
          setMenuOffset(0);
        }
      }
    } else {
      setMenuOffset(0);
    }
  }, [activeIpMenuId, id]);

  const onPointerDown = (e: any) => {
    if (isMe) return;
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      if (onLongPress) {
        onLongPress(id, randomGif);
      }
    }, 500);
  };

  const onPointerUp = (e: any) => {
    if (isMe) return;
    clearTimeout(timerRef.current);
  };

  const onContextMenu = (e: any) => {
    e.preventDefault();
    clearTimeout(timerRef.current);
    handleImageContextMenu(e, id);
  };

  return (
    <div 
      className={`relative flex flex-col items-center shrink-0 ${activeIpMenuId === id ? 'z-50' : 'z-10'}`}
      onMouseLeave={() => activeIpMenuId === id && handleCommentIpClick(null, id, null, 'menu')}
    >
      <motion.div 
        ref={ipRef}
        className="w-10 h-10 mt-0.5 cursor-pointer relative group"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={onContextMenu}
        onPointerLeave={() => clearTimeout(timerRef.current)}
        animate={{
          y: isInteracting ? [0, -10, 0] : 0,
          scale: isInteracting ? 1.2 : stateStyle.scale
        }}
        transition={{ duration: isInteracting ? 0.5 : 0.2 }}
        style={{ filter: stateStyle.filter }}
      >
        <SafeIpImage
          src={randomGif}
          className="w-full h-full object-contain drop-shadow-sm pointer-events-none" 
          alt="IP" 
        />
      </motion.div>
    </div>
  );
};

export default function PostDetail({ onBack, refreshGifs, refreshClusters, clusterAuraEnabled = true, clusterParticlesEnabled = true, clusterLocalAssetsEnabled = true, customInteractionEffects = {}, customInteractionGifs = {} }: { onBack: () => void; refreshGifs?: number; refreshClusters?: number; clusterAuraEnabled?: boolean; clusterParticlesEnabled?: boolean; clusterLocalAssetsEnabled?: boolean; customInteractionEffects?: Record<string, string>; customInteractionGifs?: Record<string, string> }) {
  const [viewMode, setViewMode] = useState<'list' | 'world'>('list');
  const [lastInteractions, setLastInteractions] = useState<Record<string, string>>({});
  
  // 重新加载动图配置
  useEffect(() => {
    const reloadConfigs = async () => {
      await loadGifsFromConfig();
      initializeImages();
    };
    reloadConfigs();
  }, []);
  
  // 刷新动图时清除缓存
  useEffect(() => {
    if (refreshGifs && refreshGifs > 0) {
      clearGifCache();
      console.log('🧹 动图缓存已清除');
    }
  }, [refreshGifs]);
  
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [inputText, setInputText] = useState('');
  const [worldTheaterActive, setWorldTheaterActive] = useState(false);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  
  const [theaterActive, setTheaterActive] = useState(false);
  const [replayData, setReplayData] = useState<{sourceIp: string, targetIp: string, action: any, actionKey?: string, customEffect?: string} | null>(null);
  const [groupReplayData, setGroupReplayData] = useState<{sourceIp: string, targetIps: string[], action: any} | null>(null);
  
  const [selectedAction, setSelectedAction] = useState('hug');
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [showTheaterDetails, setShowTheaterDetails] = useState(false);

  // 自定义 IP 上传
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customUserIp, setCustomUserIp] = usePersistentState<string | null>('customUserIp', null);
  const [playingArcGif, setPlayingArcGif] = useState<string | null>(null);
  const arcGifTimerRef = useRef<any>(null);

  // 自定义情绪状态上传
  const moodInputRef = useRef<HTMLInputElement>(null);
  const [customMoods, setCustomMoods] = usePersistentState('customMoods', {
    stage1: getRandomGif(),
    stage2: getRandomGif(),
    stage3: getRandomGif()
  });
  const [uploadingMood, setUploadingMood] = useState<'stage1' | 'stage2' | 'stage3' | null>(null);

  // 自定义动作状态上传
  const actionInputRef = useRef<HTMLInputElement>(null);
  const [customActions, setCustomActions] = usePersistentState('customActions', initialActions);

  // 任意 IP 替换
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [customImages, setCustomImages] = usePersistentState<Record<string, string>>('customImages', {});
  const [uploadingImageKey, setUploadingImageKey] = useState<string | null>(null);

  // 剧场模式专属视觉资产
  // 每个团组有独立的剧场动图，key 为 'theater_' + parentId

  // 小世界背景替换
  const bgInputRef = useRef<HTMLInputElement>(null);
  const [customBgImage, setCustomBgImage] = usePersistentState<string | null>('customBgImage', null);

  const handleBgContextMenu = (e?: React.MouseEvent) => {
    e?.preventDefault();
    bgInputRef.current?.click();
  };

  const handleResetBg = () => {
    setCustomBgImage(null);
  };

  const handleGifUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        
        // 如果有选中的 IP，就替换它；否则替换第一个底部 IP
        let targetId = activeIpMenuId;
        if (!targetId) {
          // 如果没有选中的 IP，创建一个新的上传 ID
          const newId = `uploaded_${Date.now()}`;
          setCustomImages(prev => ({
            ...prev,
            [newId]: result
          }));
          console.log('✅ GIF 上传成功:', newId);
          console.log('💡 提示：右键点击任意 IP 可以替换该 IP 的图片');
        } else {
          setCustomImages(prev => ({
            ...prev,
            [targetId]: result
          }));
          console.log('✅ GIF 上传成功并已替换 IP:', targetId);
        }
      };
      reader.readAsDataURL(file);
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const processImageFile = (file: File, maxWidth: number = 800): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        
        // If it's a GIF, check size. If it's > 1MB, we might still return it, but it could fail to save.
        if (file.type === 'image/gif') {
          // If the base64 string is larger than ~1MB, compress it to a static image
          if (result.length > 1.5 * 1024 * 1024) {
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
          // Use a lower quality for better compression
          resolve(canvas.toDataURL('image/webp', 0.6));
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await processImageFile(file, 800);
      setCustomBgImage(compressed);
    }
    e.target.value = '';
  };

  const [interactionCounts, setInteractionCounts] = useState<Record<string, number>>({});
  const [activeIpMenuId, setActiveIpMenuId] = useState<string | null>(null);
  const [interactingIpId, setInteractingIpId] = useState<string | null>(null);

  const handleCommentIpClick = (e: any, targetId: string, targetIp: string, actionType: 'menu' | 'replay' | 'repeat') => {
    if (actionType === 'menu') {
      setActiveIpMenuId(activeIpMenuId === targetId ? null : targetId);
    } else if (actionType === 'replay') {
      const lastActionKey = lastInteractions[targetId] || 'pat';
      const ipActions = ipCustomActions[targetId] || initialActions;
      const action = ipActions[lastActionKey as keyof typeof ipActions];
      handleReplay(customUserIp || action.icon, targetIp, action, lastActionKey);
    } else if (actionType === 'repeat') {
      const lastActionKey = lastInteractions[targetId] || 'pat';
      triggerCommentIpInteraction(e.clientX || (e.touches && e.touches[0].clientX), e.clientY || (e.touches && e.touches[0].clientY), targetId, targetIp, lastActionKey, false, true);
    }
  };

  const handleAddReplyFromAction = (targetId: string, actionKey: string, isGroup: boolean = false, text: string = '', customGif?: string) => {
    let targetIp = POST_DATA.ip;
    if (targetId !== 'post') {
      const comment = comments.find(c => c.id === targetId);
      if (comment) targetIp = comment.ip;
      else {
        const reply = comments.flatMap(c => c.replies || []).find(r => r.id === targetId);
        if (reply) targetIp = reply.ip;
      }
    }

    const ipActions = ipCustomActions[targetId] || initialActions;
    const newComment = {
      id: Date.now().toString(),
      user: '我',
      avatar: 'https://picsum.photos/seed/me/100/100',
      text: text,
      time: '刚刚',
      likes: 0,
      ip: customGif || ipActions[actionKey as keyof typeof ipActions].icon,
      actionKey: actionKey,
      isNew: true,
      isGroupReply: isGroup,
      replies: []
    };

    if (targetId === 'post') {
      setComments([newComment, ...comments]);
    } else {
      setComments(comments.map(c => {
        if (c.id === targetId || c.replies?.some(r => r.id === targetId)) {
          return { ...c, replies: [...(c.replies || []), newComment] };
        }
        return c;
      }));
    }
  };

  const triggerCommentIpInteraction = (clientX: number, clientY: number, targetId: string, targetIp: string, actionKey?: string, shouldAddReply: boolean = false, skipAnimation: boolean = false) => {
    setActiveIpMenuId(null);
    setInteractingIpId(targetId);
    
    const key = actionKey || 'pat';
    setLastInteractions(prev => ({ ...prev, [targetId]: key }));
    setInteractionCounts(prev => ({
      ...prev,
      [targetId]: (prev[targetId] || 0) + 1
    }));

    const ipActions = ipCustomActions[targetId] || initialActions;
    const action = ipActions[key as keyof typeof ipActions];
    
    if (!skipAnimation) {
      const customSourceIp = customInteractionGifs[key] || action.icon;
      const customEffect = customInteractionEffects[key];
      
      setReplayData({
        sourceIp: customSourceIp,
        targetIp: targetIp,
        action: action,
        actionKey: key,
        customEffect: customEffect
      });
      setTheaterActive(true);
      
      setTimeout(() => {
        setTheaterActive(false);
        setReplayData(null);
        if (shouldAddReply) {
          handleAddReplyFromAction(targetId, key);
        }
      }, 3000);
    } else {
      if (shouldAddReply) {
        handleAddReplyFromAction(targetId, key);
      }
    }

    setTimeout(() => {
      setInteractingIpId(null);
    }, 1500);
  };

  // AI 预先识别情绪 (在用户输入前) - 模拟动画
  useEffect(() => {
    if (replyingTo) {
      let targetText = '';
      if (replyingTo === 'post') {
        targetText = POST_DATA.text;
      } else {
        const comment = comments.find(c => c.id === replyingTo);
        if (comment) targetText = comment.text;
        else {
          const reply = comments.flatMap(c => c.replies || []).find(r => r.id === replyingTo);
          if (reply) targetText = reply.text;
        }
      }

      setIsAnalyzing(true);
      setShowRecommendations(true);
      
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
        if (targetText.includes('推荐') || targetText.includes('绝了')) {
          setSelectedAction('flower');
          setAiPrompt('AI 正在感受情绪...');
        } else if (targetText.includes('排版') || targetText.includes('教程')) {
          setSelectedAction('pat');
          setAiPrompt('AI 正在感受情绪...');
        } else {
          setSelectedAction('hug');
          setAiPrompt('AI 正在感受情绪...');
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setShowRecommendations(false);
      setAiPrompt('');
    }
  }, [replyingTo, comments]);

  // 监听滚动，检测标签栏是否触顶
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollTop = scrollContainerRef.current.scrollTop;
        setIsTabsSticky(scrollTop > 0);
      }
    };
    
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // 用户输入时，动态调整推荐 - 模拟动画
  useEffect(() => {
    if (inputText.trim().length > 0 && !isAnalyzing) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
        if (inputText.includes('开心') || inputText.includes('棒')) {
          setSelectedAction('flower');
          setAiPrompt('感受到你的快乐啦！撒花 🎉');
        } else if (inputText.includes('抱') || inputText.includes('难过')) {
          setSelectedAction('hug');
          setAiPrompt('一个温暖的抱抱 🧸');
        } else {
          setSelectedAction('pat');
          setAiPrompt('给个贴贴，分享这份心情 ✨');
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [inputText]);

  const [replyingToGroup, setReplyingToGroup] = useState<boolean>(false);
  const [collapsedComments, setCollapsedComments] = useState<Set<string>>(new Set());
  const [collapsedReplies, setCollapsedReplies] = useState<Set<string>>(new Set());

  const openWorldRef = useRef<any>(null);

  const isOnlyEmojiOrText = (text: string) => {
    const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}]/gu;
    const mentionRegex = /@[^\s]+/g;
    const cleanText = text.replace(mentionRegex, '').trim();
    if (cleanText.length === 0) return true;
    const emojis = cleanText.match(emojiRegex);
    const nonEmojiText = cleanText.replace(emojiRegex, '').trim();
    return nonEmojiText.length === 0 && emojis && emojis.length > 0;
  };

  const toggleCommentCollapse = (commentId: string) => {
    setCollapsedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const toggleRepliesCollapse = (commentId: string) => {
    setCollapsedReplies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const initialCollapsed = new Set<string>();
    const initialCollapsedComments = new Set<string>();
    comments.forEach(comment => {
      if (comment.replies && comment.replies.length > 2) {
        initialCollapsed.add(comment.id);
      }
      if (isOnlyEmojiOrText(comment.text)) {
        initialCollapsedComments.add(comment.id);
      }
    });
    setCollapsedReplies(initialCollapsed);
    setCollapsedComments(initialCollapsedComments);
  }, []);

  const handleReply = (targetId: string, isGroup: boolean = false, customGif?: string, focusInput: boolean = true) => {
    setReplyingTo(targetId);
    setReplyingToGroup(isGroup);
    if (focusInput) setInputFocused(true);
    if (customGif) setCustomUserIp(customGif);
  };

  const handleCommentIpLongPress = (targetId: string, customGif?: string) => {
    handleReply(targetId, false, customGif);
  };

  const handleSend = () => {
    if (!replyingTo) return;
    setInputFocused(false);
    
    let targetIp = POST_DATA.ip;
    if (replyingTo !== 'post') {
      const comment = comments.find(c => c.id === replyingTo);
      if (comment) targetIp = comment.ip;
      else {
        const reply = comments.flatMap(c => c.replies || []).find(r => r.id === replyingTo);
        if (reply) targetIp = reply.ip;
      }
    }

    if (replyingToGroup && viewMode === 'world') {
      if (openWorldRef.current) {
        openWorldRef.current.triggerGroupMessage(replyingTo, selectedAction, inputText, customUserIp || customActions[selectedAction as keyof typeof customActions].icon);
      }
      setReplyingTo(null);
      setReplyingToGroup(false);
      setInputText('');
      setShowRecommendations(false);
      return;
    }

    // 触发发送动画
    const customSourceIp = customInteractionGifs[selectedAction] || customUserIp || customActions[selectedAction as keyof typeof customActions].icon;
    const customEffect = customInteractionEffects[selectedAction];
    
    setReplayData({
      sourceIp: customSourceIp,
      targetIp: targetIp || getRandomGif(),
      action: customActions[selectedAction as keyof typeof customActions],
      actionKey: selectedAction,
      customEffect: customEffect
    });
    setTheaterActive(true);

    setTimeout(() => {
      setTheaterActive(false);
      setReplayData(null);
      
      // 将新评论加入列表
      const newComment = {
        id: Date.now().toString(),
        user: '我',
        avatar: 'https://picsum.photos/seed/me/100/100',
        text: inputText,
        time: '刚刚',
        likes: 0,
        ip: customUserIp || customActions[selectedAction as keyof typeof customActions].icon,
        actionKey: selectedAction,
        isNew: true,
        replies: []
      };

      if (replyingTo === 'post') {
        setComments([newComment, ...comments]);
      } else {
        setComments(comments.map(c => {
          if (c.id === replyingTo || c.replies?.some(r => r.id === replyingTo)) {
            return { ...c, replies: [...(c.replies || []), newComment] };
          }
          return c;
        }));
      }
      
      setReplyingTo(null);
      setReplyingToGroup(false);
      setInputText('');
      setShowRecommendations(false);
    }, 3000);
  };

  const handleReplay = (sourceIp: string, targetIp: string, action: any, actionKey?: string) => {
    // 回放该评论的互动动画
    const customSourceIp = actionKey ? (customInteractionGifs[actionKey] || sourceIp) : sourceIp;
    const customEffect = actionKey ? customInteractionEffects[actionKey] : undefined;
    
    setReplayData({
      sourceIp: customSourceIp,
      targetIp: targetIp,
      action: action,
      actionKey: actionKey,
      customEffect: customEffect
    });
    setTheaterActive(true);
    
    setTimeout(() => {
      setTheaterActive(false);
      setReplayData(null);
    }, 3000);
  };

  const handleGroupReplay = (sourceIp: string, targetIps: string[], action: any) => {
    setGroupReplayData({
      sourceIp,
      targetIps,
      action
    });
    setTheaterActive(true);
    
    setTimeout(() => {
      setTheaterActive(false);
      setGroupReplayData(null);
    }, 3000);
  };

  const handleBgClick = () => {
    if (inputFocused) {
      setInputFocused(false);
      setReplyingTo(null);
      setReplyingToGroup(false);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await processImageFile(file, 150);
      setCustomUserIp(compressed);
    }
    e.target.value = '';
  };

  const handleMoodContextMenu = (e: React.MouseEvent, stage: 'stage1' | 'stage2' | 'stage3') => {
    e.preventDefault();
    setUploadingMood(stage);
    moodInputRef.current?.click();
  };

  const handleMoodUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingMood) {
      const compressed = await processImageFile(file, 150);
      setCustomMoods(prev => ({ ...prev, [uploadingMood]: compressed }));
    }
    e.target.value = '';
  };

  const [ipCustomActions, setIpCustomActions] = usePersistentState<Record<string, Record<string, any>>>('ipCustomActions', {});
  const [uploadingAction, setUploadingAction] = useState<{id: string, key: string} | null>(null);

  const handleActionContextMenu = (e: React.MouseEvent, id: string, actionKey: string) => {
    e.preventDefault();
    setUploadingAction({id, key: actionKey});
    actionInputRef.current?.click();
  };

  const handleActionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingAction) {
      const compressed = await processImageFile(file, 150);
      setIpCustomActions(prev => {
        const ipActions = prev[uploadingAction.id] || { ...initialActions };
        const newActions = {
          ...prev,
          [uploadingAction.id]: {
            ...ipActions,
            [uploadingAction.key]: { ...ipActions[uploadingAction.key as keyof typeof ipActions], icon: compressed }
          }
        };
        
        // Prevent QuotaExceededError by keeping the size under ~1MB
        let stringified = JSON.stringify(newActions);
        while (stringified.length > 1 * 1024 * 1024) {
          const keys = Object.keys(newActions);
          if (keys.length <= 1) break;
          const keyToRemove = keys.find(k => k !== uploadingAction.id);
          if (keyToRemove) {
            delete newActions[keyToRemove];
            stringified = JSON.stringify(newActions);
          } else {
            break;
          }
        }
        
        return newActions;
      });
    }
    e.target.value = '';
  };

  const handleImageContextMenu = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    setUploadingImageKey(key);
    imageInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingImageKey) {
      const compressed = await processImageFile(file, 150);
      
      setCustomImages(prev => {
        const newImages = { ...prev, [uploadingImageKey]: compressed };
        let stringified = JSON.stringify(newImages);
        while (stringified.length > 4 * 1024 * 1024) {
          const keys = Object.keys(newImages);
          if (keys.length <= 1) break;
          const keyToRemove = keys.find(k => k !== uploadingImageKey);
          if (keyToRemove) { delete newImages[keyToRemove]; stringified = JSON.stringify(newImages); }
          else break;
        }
        return newImages;
      });
    }
    e.target.value = '';
  };

  return (
    <>
      <div className="w-full h-full bg-transparent overflow-hidden relative flex flex-col max-w-full">
        
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-white/20 shrink-0 bg-white/50 backdrop-blur-xl z-20">
          <ChevronLeft className="w-6 h-6 text-[#333333] cursor-pointer" onClick={onBack} />
          <div className="flex items-center gap-2">
            <SafeAvatar src={POST_DATA.avatar} className="w-8 h-8 rounded-full" alt="author" />
            <span className="font-medium text-sm">{POST_DATA.author}</span>
          </div>
          <div className="flex gap-3">
            <Search className="w-5 h-5 text-[#333333]" />
            <Share className="w-5 h-5 text-[#333333]" />
          </div>
        </div>

        {/* Scrollable Content */}
        <div ref={scrollContainerRef} className={`flex-1 flex flex-col ${viewMode === 'list' ? 'overflow-y-auto pb-32 bg-white' : 'overflow-hidden pb-0 bg-transparent'}`} onClick={viewMode === 'list' ? handleBgClick : undefined}>
          <div className={`p-4 border-b border-[#f5f5f5] shrink-0 bg-white ${viewMode === 'world' ? 'hidden' : ''}`}>
            <h1 className="text-xl font-bold mb-2">{POST_DATA.title}</h1>
            <p className="text-[#666666] text-sm leading-relaxed mb-4">
              {POST_DATA.text}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#999999]">{POST_DATA.time}</span>
              <div className="w-10 h-10 rounded-full border-2 border-blue-100 flex items-center justify-center relative">
                <CommentIp 
                  id={POST_DATA.id}
                  ip={POST_DATA.ip}
                  interactionCounts={interactionCounts}
                  lastInteractions={lastInteractions}
                  interactingIpId={interactingIpId}
                  activeIpMenuId={activeIpMenuId}
                  handleCommentIpClick={handleCommentIpClick}
                  triggerCommentIpInteraction={triggerCommentIpInteraction}
                  customUserIp={customUserIp}
                  customMoods={customMoods}
                  customActions={ipCustomActions[POST_DATA.id] || initialActions}
                  customImages={customImages}
                  handleImageContextMenu={handleImageContextMenu}
                  handleActionContextMenu={handleActionContextMenu}
                  onLongPress={(targetId: string, customGif?: string) => handleReply('post', false, customGif)}
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#f5f5f5] sticky top-0 bg-white z-20 shrink-0">
            <div className="flex gap-6">
              <button 
                onClick={() => setViewMode('list')} 
                className={`text-sm font-bold transition-colors relative ${viewMode === 'list' ? 'text-[#333333]' : 'text-[#999999]'}`}
              >
                评论
              </button>
              <button 
                onClick={() => setViewMode('world')} 
                className={`text-sm font-bold transition-colors relative flex items-center gap-1 ${viewMode === 'world' ? 'text-[#333333]' : 'text-[#999999]'}`}
              >
                世界 <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#666666]">共 {comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)} 条</span>
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className="p-4 bg-white flex-1">
              <div className="space-y-5">
                {comments.map(comment => (
                <div key={comment.id} className="flex flex-col gap-1.5">
                  {/* 主评论 */}
                  <div className="flex gap-3">
                    {/* 左侧：头像 */}
                    <div className="flex flex-col items-center shrink-0">
                      <SafeAvatar src={comment.avatar} className="w-8 h-8 rounded-full" alt={comment.user} />
                    </div>

                    {/* 右侧：评论内容 */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs text-[#666666] font-medium">{comment.user}</span>
                        <div className="flex items-center gap-2 text-[#999999]">
                          <div className="scale-[0.65] origin-right -my-3">
                            <CommentIp 
                              id={comment.id}
                              ip={comment.ip}
                              interactionCounts={interactionCounts}
                              lastInteractions={lastInteractions}
                              interactingIpId={interactingIpId}
                              activeIpMenuId={activeIpMenuId}
                              handleCommentIpClick={handleCommentIpClick}
                              triggerCommentIpInteraction={triggerCommentIpInteraction}
                              customUserIp={customUserIp}
                              customMoods={customMoods}
                              customActions={ipCustomActions[comment.id] || initialActions}
                              customImages={customImages}
                              handleImageContextMenu={handleImageContextMenu}
                              handleActionContextMenu={handleActionContextMenu}
                              onLongPress={handleCommentIpLongPress}
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            <span className="text-[10px]">{comment.likes}</span>
                          </div>
                        </div>
                      </div>
                      
                      {(comment.text || comment.isGroupReply) && (
                        <div className="relative inline-block">
                          {isOnlyEmojiOrText(comment.text) && collapsedComments.has(comment.id) ? (
                            <div className="flex items-center gap-2">
                              <p className="text-[#333333] text-sm leading-relaxed">
                                {comment.isGroupReply && <span className="text-blue-500 mr-1 font-medium">@大家</span>}
                                {comment.text}
                              </p>
                              <button
                                onClick={() => toggleCommentCollapse(comment.id)}
                                className="text-xs text-[#999999] hover:text-[#666666]"
                              >
                                展开
                              </button>
                            </div>
                          ) : isOnlyEmojiOrText(comment.text) && !collapsedComments.has(comment.id) ? (
                            <div className="flex items-center gap-2">
                              <p className="text-[#333333] text-sm leading-relaxed">
                                {comment.isGroupReply && <span className="text-blue-500 mr-1 font-medium">@大家</span>}
                                {comment.text}
                              </p>
                              <button
                                onClick={() => toggleCommentCollapse(comment.id)}
                                className="text-xs text-[#999999] hover:text-[#666666]"
                              >
                                折叠
                              </button>
                            </div>
                          ) : (
                            <div>
                              <p className="text-[#333333] text-sm leading-relaxed">
                                {comment.isGroupReply && <span className="text-blue-500 mr-1 font-medium">@大家</span>}
                                {comment.text}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-1 text-xs text-[#999999] flex items-center gap-3">
                        <span>{comment.time}</span>
                        <button 
                          className="font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReply(comment.id);
                          }}
                        >回复</button>
                      </div>
                    </div>
                  </div>

                  {/* 子评论 (嵌套) */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-11 space-y-2 pl-3">
                      {(comment.replies.length > 2 && collapsedReplies.has(comment.id) ? comment.replies.slice(0, 2) : comment.replies).map(reply => (
                        <div key={reply.id} className="flex gap-3">
                          {/* 左侧：头像 */}
                          <div className="flex flex-col items-center shrink-0">
                            <SafeAvatar src={reply.avatar} className="w-6 h-6 rounded-full" alt={reply.user} />
                          </div>

                          {/* 右侧：评论内容 */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-xs text-[#666666] font-medium">{reply.user}</span>
                              <div className="flex items-center gap-2 text-[#999999]">
                                <div className="scale-[0.6] origin-right -my-3">
                                  <CommentIp 
                                    id={reply.id}
                                    ip={reply.ip}
                                    interactionCounts={interactionCounts}
                                    lastInteractions={lastInteractions}
                                    interactingIpId={interactingIpId}
                                    activeIpMenuId={activeIpMenuId}
                                    handleCommentIpClick={handleCommentIpClick}
                                    triggerCommentIpInteraction={triggerCommentIpInteraction}
                                    customUserIp={customUserIp}
                                    customMoods={customMoods}
                                    customActions={ipCustomActions[reply.id] || initialActions}
                                    customImages={customImages}
                                    handleImageContextMenu={handleImageContextMenu}
                                    handleActionContextMenu={handleActionContextMenu}
                                    onLongPress={handleCommentIpLongPress}
                                  />
                                </div>
                                <div className="flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  <span className="text-[10px]">{reply.likes}</span>
                                </div>
                              </div>
                            </div>
                            
                            {(reply.text || reply.isGroupReply) && (
                              <div className="relative inline-block">
                                <p className="text-[#333333] text-xs leading-relaxed inline">
                                  {reply.isGroupReply && <span className="text-blue-500 mr-1 font-medium">@大家</span>}
                                  {reply.text}
                                </p>
                              </div>
                            )}

                            <div className="mt-1 text-[10px] text-[#999999] flex items-center gap-3">
                              <span>{reply.time}</span>
                              <button 
                                className="font-medium"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReply(reply.id);
                                }}
                              >回复</button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {comment.replies.length > 2 && (
                        <button
                          onClick={() => toggleRepliesCollapse(comment.id)}
                          className="text-xs text-[#999999] hover:text-[#666666] ml-1"
                        >
                          {collapsedReplies.has(comment.id) 
                            ? `展开${comment.replies.length - 2}条更多评论` 
                            : '收起'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          ) : (
            <div className="flex-1 relative overflow-hidden min-h-0">
            <OpenWorldView
              ref={openWorldRef}
              comments={comments} 
              customUserIp={customUserIp}
              interactionCounts={interactionCounts}
              setInteractionCounts={setInteractionCounts}
              lastInteractions={lastInteractions}
              setLastInteractions={setLastInteractions}
              handleReplay={handleReplay}
              handleGroupReplay={handleGroupReplay}
              handleReply={handleReply}
              customMoods={customMoods}
              ipCustomActions={ipCustomActions}
              initialActions={initialActions}
              customImages={customImages}
              handleImageContextMenu={handleImageContextMenu}
              customBgImage={customBgImage}
              handleBgContextMenu={handleBgContextMenu}
              handleResetBg={handleResetBg}
              handleActionContextMenu={handleActionContextMenu}
              handleAddReplyFromAction={handleAddReplyFromAction}
              isTabsSticky={isTabsSticky}
              inputFocused={inputFocused}
              clusterAuraEnabled={clusterAuraEnabled}
              clusterParticlesEnabled={false}
              clusterLocalAssetsEnabled={clusterLocalAssetsEnabled}
              customInteractionEffects={customInteractionEffects}
              customInteractionGifs={customInteractionGifs}
              setViewMode={setViewMode}
              inputText={inputText}
              setInputText={setInputText}
              setInputFocused={setInputFocused}
              refreshClusters={refreshClusters}
              onTheaterActiveChange={setWorldTheaterActive}
            />
            </div>
          )}
        </div>

        {/* Bottom Input Area */}
        <div className={`absolute bottom-0 left-0 w-full max-w-full z-[200] ${viewMode !== 'world' && !inputFocused ? 'bg-white border-t border-[#f5f5f5]' : ''}`}>
          
          {/* 弧形 IP 推荐：始终挂载，CSS 控制可见性，避免 DOM 变更导致移动端键盘闪退 */}
          <div
            className="absolute bottom-full left-0 w-full overflow-visible"
            style={{
              height: '150px',
              opacity: (inputFocused && !worldTheaterActive && viewMode !== 'world') ? 1 : 0,
              pointerEvents: (inputFocused && !worldTheaterActive && viewMode !== 'world') ? 'auto' : 'none',
              transition: 'opacity 0.2s ease-out',
            }}
          >
            {/* 弧形背景 */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2"
              style={{
                width: '120%', height: '110px',
                background: 'linear-gradient(180deg, #F3F3F1 0%, #FDF2E7 100%)',
                borderRadius: '50% 50% 0 0 / 70% 70% 0 0',
                boxShadow: '0 -8px 30px rgba(211,216,239,0.6)',
              }}
            />
            {/* IP 沿弧线排布 - 使用 /gifs/ 资产 */}
            <div className="absolute inset-0">
              {['/gifs/image 254.png','/gifs/image 274.png','/gifs/image 276.png','/gifs/image 277.png','/gifs/image 278.png','/gifs/image 280.png','/gifs/image 281.png','/gifs/image 372.png'].map((src, idx, arr) => {
                const n = arr.length;
                const xFrac = n === 1 ? 0.5 : 0.04 + (idx / (n - 1)) * 0.92;
                const norm = (xFrac - 0.5) / 0.5;
                const arcBottom = 55 * Math.sqrt(Math.max(0, 1 - norm * norm));
                const isSelected = customUserIp === src;
                const isPlaying = playingArcGif === src;
                return (
                  <button
                    key={idx}
                    className="absolute transition-transform"
                    style={{
                      left: `${xFrac * 100}%`,
                      bottom: `${arcBottom + 4}px`,
                      transform: `translateX(-50%) scale(${isSelected ? 1.25 : 1})`,
                    }}
                    onClick={() => {
                      setCustomUserIp(src);
                      setPlayingArcGif(src);
                      clearTimeout(arcGifTimerRef.current);
                      arcGifTimerRef.current = setTimeout(() => setPlayingArcGif(null), 2500);
                    }}
                  >
                    <SafeIpImage
                      src={isPlaying ? toGifSrc(src) : src}
                      style={isPlaying ? { width: 48, height: 48 } : { width: 36, height: 36 }}
                      className="object-contain transition-all duration-200"
                      alt=""
                    />
                  </button>
                );
              })}
            </div>
          </div>


          {/* 普通评论模式：未聚焦时显示的静态底栏 */}
          {viewMode !== 'world' && !inputFocused && (
            <div className="flex items-center gap-3 px-4 py-3">
              <div
                className="flex-1 bg-[#f5f5f5] rounded-full h-8 flex items-center px-3 gap-2 cursor-pointer"
                onClick={() => { if (!replyingTo) setReplyingTo('post'); setInputFocused(true); }}
              >
                <span className="text-xs text-[#999999]">{replyingTo ? "写下你的回复..." : "说点什么..."}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#333333]">
                <div className="flex items-center gap-0.5">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs font-normal">2144</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <Star className="w-4 h-4" />
                  <span className="text-xs font-normal">166</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs font-normal">2327</span>
                </div>
              </div>
            </div>
          )}

          {/* 模拟键盘：始终挂载，CSS 控制高度，避免 DOM 变更导致移动端键盘闪退 */}
          <div
            className="bg-[#d1d5db] w-full overflow-hidden flex flex-col"
            style={{
              height: inputFocused ? '260px' : '0px',
              transition: 'height 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              pointerEvents: inputFocused ? 'auto' : 'none',
            }}
          >
            <div className="flex-1 p-2 flex flex-col gap-2 pt-3">
              <div className="flex justify-center gap-1.5 px-1">
                {'QWERTYUIOP'.split('').map(k => <div key={k} onClick={() => setInputText(p => p + k)} className="flex-1 h-11 bg-white rounded-md shadow-sm flex items-center justify-center text-lg font-medium text-[#333333] cursor-pointer active:bg-[#f5f5f5]">{k}</div>)}
              </div>
              <div className="flex justify-center gap-1.5 px-4">
                {'ASDFGHJKL'.split('').map(k => <div key={k} onClick={() => setInputText(p => p + k)} className="flex-1 h-11 bg-white rounded-md shadow-sm flex items-center justify-center text-lg font-medium text-[#333333] cursor-pointer active:bg-[#f5f5f5]">{k}</div>)}
              </div>
              <div className="flex justify-center gap-1.5 px-1">
                <div className="w-11 h-11 bg-[#b3b8c2] rounded-md shadow-sm flex items-center justify-center text-white">⇧</div>
                {'ZXCVBNM'.split('').map(k => <div key={k} onClick={() => setInputText(p => p + k)} className="flex-1 h-11 bg-white rounded-md shadow-sm flex items-center justify-center text-lg font-medium text-[#333333] cursor-pointer active:bg-[#f5f5f5]">{k}</div>)}
                <div onClick={() => setInputText(p => p.slice(0, -1))} className="w-11 h-11 bg-[#b3b8c2] rounded-md shadow-sm flex items-center justify-center text-white cursor-pointer active:bg-gray-400">⌫</div>
              </div>
              <div className="flex justify-center gap-1.5 px-1">
                <div className="w-11 h-11 bg-[#b3b8c2] rounded-md shadow-sm flex items-center justify-center text-sm font-medium text-gray-700">123</div>
                <div className="w-11 h-11 bg-[#b3b8c2] rounded-md shadow-sm flex items-center justify-center text-sm">🌐</div>
                <div onClick={() => setInputText(p => p + ' ')} className="flex-[3] h-11 bg-white rounded-md shadow-sm flex items-center justify-center text-sm font-medium text-[#333333] cursor-pointer active:bg-[#f5f5f5]">空格</div>
                <div onClick={handleSend} className="w-20 h-11 bg-blue-500 text-white rounded-md shadow-sm flex items-center justify-center text-sm font-medium cursor-pointer hover:bg-blue-600 transition-colors">发送</div>
              </div>
            </div>
          </div>
        </div>

        {/* 普通模式浮动胶囊输入框：仅键盘唤起时显示 */}
        {viewMode !== 'world' && inputFocused && (
          <div
            className="absolute left-4 right-4 z-[250]"
            style={{
              bottom: '272px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xl rounded-full px-3 py-1.5 shadow-2xl border border-white/50">
              <div className="bg-gray-100 rounded-full h-7 flex items-center px-2.5 flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={replyingTo ? "写下你的回复..." : "说点什么..."}
                  className="bg-transparent w-full text-xs outline-none text-gray-700 placeholder-gray-400"
                  onFocus={() => { if (!replyingTo) setReplyingTo('post'); setInputFocused(true); }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              {inputFocused ? (
                <button
                  onClick={(e) => { e.stopPropagation(); handleSend(); }}
                  disabled={isAnalyzing}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${!isAnalyzing ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-50 text-gray-400 cursor-not-allowed'}`}
                >
                  <Send className="w-3.5 h-3.5 -rotate-45" />
                </button>
              ) : (
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="flex items-center gap-0.5">
                    <Heart className="w-3.5 h-3.5" />
                    <span className="text-[10px]">2144</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5" />
                    <span className="text-[10px]">166</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="text-[10px]">2327</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 隐藏的文件上传 input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload} 
          accept="image/gif, image/jpeg, image/png, video/mp4" 
          className="hidden" 
        />
        <input 
          type="file" 
          ref={moodInputRef} 
          onChange={handleMoodUpload} 
          accept="image/gif, image/jpeg, image/png, video/mp4" 
          className="hidden" 
        />
        <input 
          type="file" 
          ref={actionInputRef} 
          onChange={handleActionUpload} 
          accept="image/gif, image/jpeg, image/png, video/mp4" 
          className="hidden" 
        />
        <input 
          type="file" 
          ref={imageInputRef} 
          onChange={handleImageUpload} 
          accept="image/gif, image/jpeg, image/png, video/mp4" 
          className="hidden" 
        />
        <input 
          type="file" 
          ref={bgInputRef} 
          onChange={handleBgUpload} 
          accept="image/jpeg, image/png, image/webp" 
          className="hidden" 
        />

        {/* 阶段三：底部微剧场（悬浮在输入框上方，无背景卡片） */}
        <AnimatePresence>
          {theaterActive && replayData && (
            <MicroTheater 
              sourceIp={replayData.sourceIp}
              targetIp={replayData.targetIp}
              action={replayData.action} 
              customEffect={replayData.customEffect}
            />
          )}
          {theaterActive && groupReplayData && (
            <GroupMicroTheater 
              sourceIp={groupReplayData.sourceIp}
              targetIps={groupReplayData.targetIps}
              action={groupReplayData.action} 
            />
          )}
        </AnimatePresence>

        {/* 阶段四详情页：开放世界情绪剧场 */}
      </div>
    </>
  );
}

// 阶段三：无边框悬浮微剧场 (支持发送和回放)
const MicroTheater = ({ sourceIp, targetIp, action, customEffect }: { sourceIp: string, targetIp: string, action: any, customEffect?: string }) => {
  const [stage, setStage] = useState('enter');

  // Randomly select an animation style
  const animStyle = useMemo(() => {
    const styles = ['firework', 'droplets', 'gentle', 'intense'];
    return styles[Math.floor(Math.random() * styles.length)];
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setStage('interact'), 300);
    const t2 = setTimeout(() => setStage('leave'), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Generate random particles based on style
  const particles = useMemo(() => {
    if (animStyle === 'firework') {
      return Array.from({ length: 20 }).map((_, i) => ({
        type: 'dot',
        angle: (i / 20) * Math.PI * 2,
        distance: 40 + Math.random() * 60,
        size: 4 + Math.random() * 6,
        delay: Math.random() * 0.2,
        duration: 0.8
      }));
    } else if (animStyle === 'droplets') {
      return Array.from({ length: 15 }).map((_, i) => ({
        type: 'drop',
        x: (Math.random() - 0.5) * 100,
        y: -20 - Math.random() * 40,
        size: 4 + Math.random() * 4,
        delay: Math.random() * 0.3,
        duration: 0.6
      }));
    } else if (animStyle === 'gentle') {
      return Array.from({ length: 12 }).map((_, i) => ({
        type: 'orb',
        x: (Math.random() - 0.5) * 80,
        y: -30 - Math.random() * 50,
        size: 8 + Math.random() * 12,
        delay: Math.random() * 0.5,
        duration: 1.5
      }));
    } else { // intense
      return Array.from({ length: 30 }).map((_, i) => ({
        type: 'spark',
        angle: (i / 30) * Math.PI * 2,
        distance: 80 + Math.random() * 40,
        size: 2 + Math.random() * 3,
        delay: 0,
        duration: 0.4
      }));
    }
  }, [animStyle]);

  return (
    <div className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Dark Overlay - only covering bottom part */}
      <AnimatePresence>
        {(stage === 'enter' || stage === 'interact') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-black/50 to-transparent"
          />
        )}
      </AnimatePresence>

      <div className="absolute bottom-15 left-0 w-full h-40 flex items-center justify-center overflow-visible">
        {/* 目标 IP */}
        <motion.div 
          className="absolute z-10 flex flex-col items-center"
          animate={{ 
            x: stage === 'interact' ? -20 : -60,
            y: stage === 'enter' ? 20 : (stage === 'interact' ? -10 : -40),
            scale: stage === 'interact' ? 1.1 : 0.9,
            opacity: stage === 'leave' ? 0 : (stage === 'enter' ? 0 : 1)
          }}
          initial={{ opacity: 0, y: 40, x: -60 }}
          transition={{ type: 'spring', stiffness: 120, damping: 15, duration: 0.5 }}
        >
          <SafeIpImage src={targetIp} className="w-16 h-16 object-contain drop-shadow-lg" alt="Target IP" />
        </motion.div>

        {/* 来源 IP */}
        <motion.div 
          layoutId="user-ip"
          className="absolute z-10 flex flex-col items-center"
          animate={{ 
            x: stage === 'interact' ? 20 : 60,
            y: stage === 'enter' ? 20 : (stage === 'interact' ? 10 : -20),
            scale: stage === 'interact' ? 1.1 : 0.9,
            opacity: stage === 'leave' ? 0 : (stage === 'enter' ? 0 : 1)
          }}
          initial={{ opacity: 0, y: 40, x: 60 }}
          transition={{ type: 'spring', stiffness: 120, damping: 15, duration: 0.5 }}
        >
          <SafeIpImage src={sourceIp} className="w-16 h-16 object-contain drop-shadow-lg" alt="Source IP" />
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
                  className="w-32 h-32 object-contain"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.3, 1, 0.5] }}
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

const GroupMicroTheater = ({ sourceIp, targetIps, action }: { sourceIp: string, targetIps: string[], action: any }) => {
  const [stage, setStage] = useState('enter');

  const animStyle = useMemo(() => {
    const styles = ['firework', 'droplets', 'gentle', 'intense'];
    return styles[Math.floor(Math.random() * styles.length)];
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setStage('interact'), 300);
    const t2 = setTimeout(() => setStage('leave'), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Generate random particles based on style
  const particles = useMemo(() => {
    if (animStyle === 'firework') {
      return Array.from({ length: 30 }).map((_, i) => ({
        type: 'dot',
        angle: (i / 30) * Math.PI * 2,
        distance: 60 + Math.random() * 80,
        size: 4 + Math.random() * 8,
        delay: Math.random() * 0.2,
        duration: 1.0
      }));
    } else if (animStyle === 'droplets') {
      return Array.from({ length: 25 }).map((_, i) => ({
        type: 'drop',
        x: (Math.random() - 0.5) * 140,
        y: -30 - Math.random() * 60,
        size: 4 + Math.random() * 6,
        delay: Math.random() * 0.3,
        duration: 0.8
      }));
    } else if (animStyle === 'gentle') {
      return Array.from({ length: 18 }).map((_, i) => ({
        type: 'orb',
        x: (Math.random() - 0.5) * 120,
        y: -40 - Math.random() * 70,
        size: 10 + Math.random() * 16,
        delay: Math.random() * 0.5,
        duration: 1.8
      }));
    } else { // intense
      return Array.from({ length: 45 }).map((_, i) => ({
        type: 'spark',
        angle: (i / 45) * Math.PI * 2,
        distance: 100 + Math.random() * 60,
        size: 2 + Math.random() * 4,
        delay: 0,
        duration: 0.5
      }));
    }
  }, [animStyle]);

  return (
    <div className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Dark Overlay - only covering bottom part */}
      <AnimatePresence>
        {(stage === 'enter' || stage === 'interact') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 w-full h-80 bg-gradient-to-t from-black/50 to-transparent"
          />
        )}
      </AnimatePresence>

      <div className="absolute bottom-15 left-0 w-full h-40 flex items-center justify-center overflow-visible">
        {/* 目标 IPs (大家) */}
        <div className="absolute z-10 flex items-center justify-center">
          {targetIps.map((ip, idx) => {
            const angle = (idx / targetIps.length) * Math.PI * 2;
            const startRadius = 80;
            const endRadius = 40;
            return (
              <motion.div 
                key={idx}
                className="absolute flex flex-col items-center"
                initial={{ opacity: 0, x: Math.cos(angle) * startRadius, y: Math.sin(angle) * startRadius }}
                animate={{ 
                  x: stage === 'interact' ? Math.cos(angle) * endRadius : Math.cos(angle) * startRadius,
                  y: stage === 'interact' ? Math.sin(angle) * endRadius : Math.sin(angle) * startRadius,
                  scale: stage === 'interact' ? 1 : 0.8,
                  opacity: stage === 'leave' ? 0 : 1
                }}
                transition={{ type: 'spring', stiffness: 120, damping: 12, delay: Math.random() * 0.1 }}
                style={{ zIndex: 10 + idx }}
              >
                <SafeIpImage src={ip} className="w-10 h-10 object-contain drop-shadow-lg" alt="Target IP" />
              </motion.div>
            );
          })}
        </div>

        {/* 来源 IP (用户) */}
        <motion.div 
          layoutId="user-ip"
          className="absolute z-20 flex flex-col items-center"
          initial={{ opacity: 0, y: 60, scale: 0.5 }}
          animate={{ 
            x: 0,
            y: stage === 'interact' ? 0 : 20,
            scale: stage === 'interact' ? 1.3 : 1,
            opacity: stage === 'leave' ? 0 : 1
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 15 }}
        >
          <SafeIpImage src={sourceIp} className="w-14 h-14 object-contain drop-shadow-xl" alt="Source IP" />
        </motion.div>

        {/* 特效 */}
        <AnimatePresence>
          {stage === 'interact' && (
            <motion.div
              className="absolute z-30 flex items-center justify-center"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {particles.map((p, i) => {
                if (p.type === 'dot' || p.type === 'spark') {
                  return (
                    <motion.div
                      key={i}
                      className="absolute rounded-full bg-white"
                      style={{ width: p.size, height: p.size, boxShadow: '0 0 12px rgba(255,255,255,0.9)' }}
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
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// 阶段四：开放世界情绪剧场 (Open World EmoStage)
const OpenWorldView = forwardRef(({ comments, customUserIp, interactionCounts, setInteractionCounts, lastInteractions, setLastInteractions, handleReplay, handleGroupReplay, handleReply, customMoods, ipCustomActions, initialActions, customImages, handleImageContextMenu, customBgImage, handleBgContextMenu, handleResetBg, handleActionContextMenu, handleAddReplyFromAction, isTabsSticky, clusterAuraEnabled = true, clusterParticlesEnabled = true, clusterLocalAssetsEnabled = true, customInteractionEffects = {}, customInteractionGifs = {}, setViewMode, inputText, setInputText, inputFocused, setInputFocused, refreshClusters, onTheaterActiveChange }: any, ref: any) => {
  const positionsRef = useRef<Record<string, {x: number, y: number, size?: number}>>({});
  const [forceRefresh, setForceRefresh] = useState(0); // 强制刷新团组位置
  const [scale, setScale] = useState(1.5); // 默认缩放值 1.5，使屏幕内有约 3-4 个团组
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isWheeling, setIsWheeling] = useState(false);
  const wheelTimerRef = useRef<any>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 当刷新小团组视觉时，也刷新团组位置
  useEffect(() => {
    if (refreshClusters && refreshClusters > 0) {
      console.log('🔄 刷新团组位置');
      setForceRefresh(prev => prev + 1);
    }
  }, [refreshClusters]);

  const clusterParticles = useMemo(() => {
    const particlesMap: Record<string, any[]> = {};
    const postItem = { id: 'post', ip: POST_DATA.ip, user: POST_DATA.author, text: POST_DATA.title, isPost: true, actionKey: 'hug' };
    const parents = [postItem, ...comments];
    
    parents.forEach((parent: any) => {
      if (!parent.replies || parent.replies.length === 0) return;
      
      // Use a seeded random based on parent.id to keep it consistent but organic
      let hash = 0;
      for (let i = 0; i < parent.id.length; i++) {
        hash = parent.id.charCodeAt(i) + ((hash << 5) - hash);
      }
      
      const random = () => {
        const x = Math.sin(hash++) * 10000;
        return x - Math.floor(x);
      };

      particlesMap[parent.id] = Array.from({ length: 10 }).map((_, i) => {
        const angle = random() * Math.PI * 2;
        const radius = random() * 80 + 30;
        const duration = random() * 25 + 15;
        const delay = random() * -20;
        const size = random() * 5 + 2;
        const opacity = random() * 0.6 + 0.3;
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
        const color = colors[Math.floor(random() * colors.length)];
        
        return { angle, radius, duration, delay, size, opacity, color };
      });
    });
    return particlesMap;
  }, [comments]);

  // 基于字符串生成确定性哈希种子
  const hashStr = (s: string) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
    }
    return h;
  };

  // 确定性伪随机（LCG）
  const makeRng = (seed: number) => {
    let s = seed >>> 0;
    return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 0xffffffff; };
  };

  // 生成语义向量（无关键词时基于文本哈希，确保相同文本总得到相同向量）
  const generateSemanticVector = (text: string) => {
    const keywords: Record<string, number[]> = {
      '艺术': [0.9, 0.2, 0.1, 0.3], '美食': [0.1, 0.9, 0.2, 0.1],
      '设计': [0.3, 0.1, 0.9, 0.2], '情感': [0.2, 0.3, 0.1, 0.9],
      '旅游': [0.4, 0.2, 0.3, 0.6], '数码': [0.1, 0.2, 0.8, 0.3],
      '宠物': [0.2, 0.7, 0.1, 0.8], '生活': [0.5, 0.5, 0.3, 0.5],
      '时尚': [0.6, 0.3, 0.7, 0.2], '运动': [0.3, 0.4, 0.5, 0.3],
      '搞笑': [0.1, 0.5, 0.2, 0.8], '学习': [0.4, 0.1, 0.8, 0.3],
    };

    let vector = [0, 0, 0, 0];
    let totalWeight = 0;
    for (const [kw, weights] of Object.entries(keywords)) {
      if (text.includes(kw)) {
        vector = vector.map((v, i) => v + weights[i]);
        totalWeight += 1;
      }
    }

    if (totalWeight > 0) {
      vector = vector.map(v => v / totalWeight);
    } else {
      // 无关键词：用文本哈希生成确定性向量，相同文本永远得到相同位置
      const rng = makeRng(hashStr(text || 'default'));
      vector = vector.map(() => rng());
    }
    return vector;
  };

  // 真正的PCA降维：用幂迭代法求前两个主成分，投影到二维
  const pcaReduce = (vectors: number[][]) => {
    if (vectors.length <= 1) return vectors.map(v => [v[0] ?? 0, v[1] ?? 0]);
    const n = vectors.length;
    const dim = vectors[0].length;

    const mean = Array(dim).fill(0).map((_, i) =>
      vectors.reduce((s, v) => s + v[i], 0) / n
    );
    const centered = vectors.map(v => v.map((val, i) => val - mean[i]));

    // 协方差矩阵
    const cov: number[][] = Array(dim).fill(0).map((_, i) =>
      Array(dim).fill(0).map((_, j) =>
        centered.reduce((s, v) => s + v[i] * v[j], 0) / Math.max(n - 1, 1)
      )
    );

    // 幂迭代求最大特征向量
    const powerIterate = (mat: number[][], seed = 42) => {
      let v = Array(dim).fill(0).map((_, i) => Math.sin(seed + i)); // 确定性初始化
      for (let iter = 0; iter < 200; iter++) {
        const nv = mat.map(row => row.reduce((s, val, i) => s + val * v[i], 0));
        const norm = Math.sqrt(nv.reduce((s, val) => s + val * val, 0)) || 1;
        v = nv.map(val => val / norm);
      }
      return v;
    };

    const pc1 = powerIterate(cov, 42);
    // 收缩：去掉 pc1 方向的方差，求第二主成分
    const deflated = cov.map((row, i) =>
      row.map((val, j) => val - pc1[i] * pc1[j] * cov.reduce((s, _, k) => s + pc1[k] * pc1[k], 0))
    );
    const pc2 = powerIterate(deflated, 7);

    return centered.map(v => [
      v.reduce((s, val, i) => s + val * pc1[i], 0),
      v.reduce((s, val, i) => s + val * pc2[i], 0),
    ]);
  };

  // 计算团组基础数据（只在comments变化时重新计算）
  const baseGroupedIps = useMemo(() => {
    positionsRef.current = {}; // 清除缓存，重新计算所有位置
    
    const postItem = { id: 'post', ip: POST_DATA.ip, user: POST_DATA.author, text: POST_DATA.title, isPost: true, actionKey: 'hug' };
    let parents = [postItem, ...comments];

    // 为每个团组生成语义向量
    const itemsWithVectors = parents.map(item => ({
      ...item,
      vector: generateSemanticVector(item.text || '')
    }));

    // 使用PCA降维到二维
    const vectors = itemsWithVectors.map(item => item.vector);
    const reducedVectors = pcaReduce(vectors);

    // 将降维后的向量映射到画布坐标
    const minX = Math.min(...reducedVectors.map(v => v[0]));
    const maxX = Math.max(...reducedVectors.map(v => v[0]));
    const minY = Math.min(...reducedVectors.map(v => v[1]));
    const maxY = Math.max(...reducedVectors.map(v => v[1]));

    // 归一化到 0-100 的范围，并添加边距（团组分布在 700x700px 内）
    const margin = 5; // 减小边距，确保团组有足够空间
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;

    // 计算每个团组的大小（半径）
    const calculateGroupSize = (parent: any) => {
      // 基于回复数量计算大小
      const replyCount = parent.replies ? parent.replies.length : 0;
      return 30 + (replyCount * 3); // 减小基础大小，确保更多团组能显示
    };

    // 碰撞检测函数
    // 视觉有效半径 = 云朵不透明区域（约为包围盒的50%）+ IP轨道（约125px）+ 最小间距（30px）
    const visualRadius = (size: number) => {
      const cloudOpaqueRadius = (size + 50) * 0.5;
      const ipOrbitExtent = 70; // IP 轨道缩小后最远约70px
      const minGap = 80; // 云朵之间保留80px空白
      return (Math.max(cloudOpaqueRadius, ipOrbitExtent) + minGap) / 8.5;
    };

    const checkCollision = (newX: number, newY: number, newSize: number, existingGroups: any[]) => {
      for (const group of existingGroups) {
        const dx = newX - group.x;
        const dy = newY - group.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = visualRadius(newSize) + visualRadius(group.size);
        if (distance < minDistance) {
          return true;
        }
      }
      return false;
    };

    const result: any[] = [];
    
    itemsWithVectors.forEach((parent: any, i: number) => {
      if (!positionsRef.current[parent.id]) {
        const [x, y] = reducedVectors[i];
        let normalizedX = margin + ((x - minX) / rangeX) * (100 - 2 * margin);
        let normalizedY = margin + ((y - minY) / rangeY) * (100 - 2 * margin);
        const groupSize = calculateGroupSize(parent);

        // 限制团组大小，确保所有团组能在视口中显示
        const maxGroupSize = 60; // 限制最大团组大小
        const clampedSize = Math.min(groupSize, maxGroupSize);

        // 初始位置边界检查
        const r = visualRadius(clampedSize);
        normalizedX = Math.max(margin + r, Math.min(100 - margin - r, normalizedX));
        normalizedY = Math.max(margin + r, Math.min(100 - margin - r, normalizedY));

        // 碰撞检测和位置调整
        let attempts = 0;
        const maxAttempts = 300;
        let collision = true;

        const rng = makeRng(hashStr(parent.id || String(i)));
        while (collision && attempts < maxAttempts) {
          collision = checkCollision(normalizedX, normalizedY, clampedSize, result);
          if (collision) {
            const angle = rng() * Math.PI * 2;
            const step = r * 0.8;
            normalizedX += Math.cos(angle) * step;
            normalizedY += Math.sin(angle) * step;
            normalizedX = Math.max(margin + r, Math.min(100 - margin - r, normalizedX));
            normalizedY = Math.max(margin + r, Math.min(100 - margin - r, normalizedY));
            
            attempts++;
          }
        }

        positionsRef.current[parent.id] = {
          x: normalizedX,
          y: normalizedY,
          size: clampedSize
        };
      }
      
      result.push({ ...parent, ...positionsRef.current[parent.id] });
    });

    console.log('🎨 最终团组位置:', result.map((g: any) => ({ id: g.id, x: g.x, y: g.y, size: g.size })));

    return result;
  }, [comments, forceRefresh]);

  // 根据缩放级别计算最终的团组数据
  const groupedIps = useMemo(() => {
    // 根据缩放级别决定显示的IP数量
    const getVisibleReplyCount = () => {
      if (scale < 0.7) return 1; // 最小状态，只显示1个IP
      if (scale < 1.0) return 2; // 缩小状态，显示2个IP
      if (scale < 1.3) return 3; // 正常状态，显示3个IP
      if (scale < 1.6) return 4; // 放大状态，显示4个IP
      if (scale < 2.0) return 6; // 更大放大，显示6个IP
      return 10; // 最大放大状态，显示10个IP
    };

    const visibleCount = getVisibleReplyCount();
    console.log('🎯 缩放级别:', scale, '显示IP数量:', visibleCount);
    console.log('🎯 团组数量:', baseGroupedIps.length);
    console.log('🎯 第一个团组数据:', baseGroupedIps[0]);
    console.log('🎯 团组数据:', baseGroupedIps.map((g: any) => ({ id: g.id, replies: g.replies?.length || 0, children: g.children?.length || 0 })));

    return baseGroupedIps.map((parent: any) => {
      // 根据缩放级别限制每个团组的IP数量
      const limitedReplies = parent.replies ? parent.replies.slice(0, visibleCount) : [];
      
      console.log(`📝 团组 ${parent.id}: 原始回复数 ${parent.replies?.length || 0}, 限制后 ${limitedReplies.length}`);
      
      // Fibonacci 黄金角螺旋：IP 从中心向外错落散布在云面上
      const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ≈137.5°
      const maxR = Math.min(parent.size + 10, 42); // 收紧范围
      const children = limitedReplies.map((child: any, index: number) => {
        const n = limitedReplies.length;
        const r = Math.sqrt((index + 0.5) / n) * maxR + 6;
        const angle = index * goldenAngle;
        // 纵向略压扁（×0.8），让IP更贴合椭圆形的云
        return { ...child, angle, radiusX: r, radiusY: r * 0.8 };
      });

      return { ...parent, children };
    });
  }, [baseGroupedIps, scale]);

  // 调试日志：查看最终的 groupedIps 数据
  console.log('🔍 最终 groupedIps 数据:', groupedIps.map((g: any) => ({ id: g.id, childrenCount: g.children?.length || 0 })));

  // 计算所有 IP 的得分，取第 3 高的分值作为「前三保底」阈值
  const topThreeMinScore = useMemo(() => {
    const allIps = groupedIps.flatMap((p: any) => [p, ...(p.children || [])]);
    const scores = allIps
      .map((ip: any) => computeIpScore(ip, interactionCounts[ip.id] || 0))
      .sort((a: number, b: number) => b - a);
    return scores[2] ?? scores[0] ?? 0;
  }, [groupedIps, interactionCounts]);

  useImperativeHandle(ref, () => ({
    triggerGroupMessage: (parentId: string, actionKey: string, text: string, ipIcon: string) => {
      const parent = groupedIps.find((p: any) => p.id === parentId);
      if (!parent) return;

      const ipActions = ipCustomActions[parent.id] || initialActions;
      const action = ipActions[actionKey as keyof typeof ipActions] || initialActions.hug;
      
      const allNodes = [parent, ...parent.children];
      const allIds = allNodes.map((n: any) => n.id);
      setInteractingIds(prev => [...prev, ...allIds]);
      
      const targetIps = allNodes.map((child: any) => customImages?.[child.id] || child.ip);
      handleGroupReplay(ipIcon, targetIps, action);

      setTimeout(() => {
        setInteractingIds(prev => prev.filter(id => !allIds.includes(id)));
      }, 1500);

      setTimeout(() => {
        handleAddReplyFromAction(parentId, actionKey, true, text, ipIcon);
      }, 1500);
    }
  }));

  const [activeGifId, setActiveGifId] = useState<string | null>(null);
  const gifTimerRef = useRef<any>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [activeClusterCardId, setActiveClusterCardId] = useState<string | null>(null);
  const [theaterMode, setTheaterMode] = useState<string | null>(null);
  const [theaterGroupIndex, setTheaterGroupIndex] = useState(0);
  const [theaterRevealCount, setTheaterRevealCount] = useState(0);
  const [ipTheaterMode, setIpTheaterMode] = useState<{id: string; text: string; gif: string} | null>(null);
  const [ipTheaterTextVisible, setIpTheaterTextVisible] = useState(false);
  const [selectedArcIpId, setSelectedArcIpId] = useState<string | null>(null);
  const [theaterUserComments, setTheaterUserComments] = useState<Array<{id: string; text: string; gif: string; left: string; top: string; groupIndex: number}>>([]);
  const [ipTheaterUserComments, setIpTheaterUserComments] = useState<Array<{id: string; text: string; gif: string; left: string; top: string}>>([]);
  const [worldUserComments, setWorldUserComments] = useState<Array<{id: string; gif: string; text: string; x: string; y: string}>>([]);
  const theaterSwipeStartX = useRef<number | null>(null);
  const [activeBubbleId, setActiveBubbleId] = useState<string | null>(null);
  const clusterCardTimerRef = useRef<any>(null);
  const theaterRevealTimerRef = useRef<any>(null);

  useEffect(() => {
    onTheaterActiveChange?.(!!theaterMode || !!ipTheaterMode);
  }, [theaterMode, ipTheaterMode]);

  useEffect(() => {
    if (!theaterMode) { setSelectedArcIpId(null); setTheaterUserComments([]); }
  }, [theaterMode]);

  useEffect(() => {
    if (!ipTheaterMode) { setSelectedArcIpId(null); setIpTheaterUserComments([]); }
  }, [ipTheaterMode]);

  // 分组辅助：将评论分成若干组（每组 3~4 条）
  const groupComments = (nodes: any[]) => {
    const result: any[][] = [];
    const sizes = [3, 4, 3, 4];
    let i = 0, gi = 0;
    while (i < nodes.length) {
      const size = sizes[gi % sizes.length];
      result.push(nodes.slice(i, i + size));
      i += size; gi++;
    }
    return result;
  };

  // 剧场模式：切换分组时逐条揭示评论
  useEffect(() => {
    if (!theaterMode) { setTheaterGroupIndex(0); setTheaterRevealCount(0); return; }
    clearInterval(theaterRevealTimerRef.current);
    setTheaterRevealCount(0);
    let count = 0;
    const parent = groupedIps.find((p: any) => p.id === theaterMode);
    if (!parent) return;
    const allNodes = [parent, ...(parent.children || [])].filter((n: any) => n.text);
    const groups = groupComments(allNodes);
    const currentGroup = groups[theaterGroupIndex] || [];
    theaterRevealTimerRef.current = setInterval(() => {
      count++;
      setTheaterRevealCount(count);
      if (count >= currentGroup.length) clearInterval(theaterRevealTimerRef.current);
    }, 700);
    return () => clearInterval(theaterRevealTimerRef.current);
  }, [theaterMode, theaterGroupIndex, groupedIps]);

  useEffect(() => {
    if (activeClusterCardId) {
      if (clusterCardTimerRef.current) clearTimeout(clusterCardTimerRef.current);
      clusterCardTimerRef.current = setTimeout(() => {
        setActiveClusterCardId(null);
      }, 2000);
    }
    return () => {
      if (clusterCardTimerRef.current) clearTimeout(clusterCardTimerRef.current);
    };
  }, [activeClusterCardId]);
  const [interactingIds, setInteractingIds] = useState<string[]>([]);
  const [randomVisibleIds, setRandomVisibleIds] = useState<string[]>([]);
  const [tappedVisibleIds, setTappedVisibleIds] = useState<string[]>([]);
  const [draggingBottomIp, setDraggingBottomIp] = useState<string | null>(null);
  const [dragOverParentId, setDragOverParentId] = useState<string | null>(null);
  const [dragOverBubble, setDragOverBubble] = useState(false);
  const [dragClonePosition, setDragClonePosition] = useState<{ x: number; y: number } | null>(null);
  const bottomIpDragRef = useRef<{ startX: number; startY: number; ipId: string; gif: string; overParentId: string | null; overBubble: boolean } | null>(null);
  
  // 交互动画状态
  const [groupInteractionActive, setGroupInteractionActive] = useState(false);
  const [groupInteractionData, setGroupInteractionData] = useState<{sourceIp: string, targetIps: string[], action: any} | null>(null);
  
  // 评论动态显示状态
  const [activeComments, setActiveComments] = useState<Array<{id: string, text: string, user: string, avatar: string}>>([]);
  const commentTimerRef = useRef<any>(null);

  const handleBottomIpDragStart = (e: React.PointerEvent, ipId: string, gif: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    bottomIpDragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      ipId,
      gif,
      overParentId: null,
      overBubble: false
    };
    setDraggingBottomIp(ipId);
    setDragClonePosition({ x: e.clientX, y: e.clientY });
    
    window.addEventListener('pointermove', handleBottomIpDragMove);
    window.addEventListener('pointerup', handleBottomIpDragEnd);
  };

  const handleBottomIpDragMove = (e: PointerEvent) => {
    if (!bottomIpDragRef.current) return;
    
    setDragClonePosition({ x: e.clientX, y: e.clientY });
    
    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    let foundParent: string | null = null;
    let foundBubble = false;
    
    for (const el of elements) {
      const parentId = el.getAttribute('data-parent-id');
      if (parentId) {
        foundParent = parentId;
        const parentEl = el.closest('[data-parent-id]');
        if (parentEl) {
          const rect = parentEl.getBoundingClientRect();
          const bubbleCenterY = rect.top - 36;
          const bubbleRadius = 50;
          
          if (
            e.clientY >= bubbleCenterY - bubbleRadius &&
            e.clientY <= bubbleCenterY + bubbleRadius &&
            e.clientX >= rect.left + rect.width / 2 - bubbleRadius &&
            e.clientX <= rect.left + rect.width / 2 + bubbleRadius
          ) {
            foundBubble = true;
          }
        }
        break;
      }
      if (el.getAttribute('data-comment-bubble')) {
        foundBubble = true;
        const parentEl = el.closest('[data-parent-id]');
        if (parentEl) {
          foundParent = parentEl.getAttribute('data-parent-id');
        }
        break;
      }
    }
    
    if (bottomIpDragRef.current) {
      bottomIpDragRef.current.overParentId = foundParent;
      bottomIpDragRef.current.overBubble = foundBubble;
    }
    setDragOverParentId(foundParent);
    setDragOverBubble(foundBubble);
    
    console.log('Drag move data:', { foundParent, foundBubble, clientX: e.clientX, clientY: e.clientY });
  };

  const handleBottomIpDragEnd = (e: PointerEvent) => {
    window.removeEventListener('pointermove', handleBottomIpDragMove);
    window.removeEventListener('pointerup', handleBottomIpDragEnd);
    
    console.log('handleBottomIpDragEnd', { 
      draggingBottomIp, 
      dragOverParentId, 
      dragOverBubble,
      bottomIpDragRef: bottomIpDragRef.current 
    });
    
    if (bottomIpDragRef.current) {
      const { startX, startY, gif, overParentId, overBubble } = bottomIpDragRef.current;
      
      // 计算是否有真正的拖拽（移动超过10px才算拖拽）
      const dragDistance = Math.sqrt(Math.pow(e.clientX - startX, 2) + Math.pow(e.clientY - startY, 2));
      const isRealDrag = dragDistance > 10;
      
      console.log('Drag end data:', { overParentId, overBubble, gif, dragDistance, isRealDrag });
      
      // 只有真正拖拽时才执行操作
      if (isRealDrag) {
        if (overParentId) {
          const parent = groupedIps.find((p: any) => p.id === overParentId);
          
          console.log('Found parent:', parent);
          
          if (parent) {
            // 如果是直接拖到团体上（不是气泡），先播放交互动画
            if (!overBubble) {
              const ipActions = ipCustomActions[parent.id] || initialActions;
              const action = ipActions['hug'];
              const allNodes = [parent, ...(parent.children || [])];
              const allIds = allNodes.map((n: any) => n.id);
              const targetIps = allNodes.map((child: any) => customImages?.[child.id] || child.ip);
              
              // 播放交互动画
              setGroupInteractionData({
                sourceIp: gif,
                targetIps,
                action
              });
              setGroupInteractionActive(true);
              setInteractingIds(prev => [...prev, ...allIds]);
              
              // 3秒后关闭动画并添加回复
              setTimeout(() => {
                setGroupInteractionActive(false);
                setGroupInteractionData(null);
                setInteractingIds(prev => prev.filter(id => !allIds.includes(id)));
                handleAddReplyFromAction(overParentId, 'hug', true, '', gif);
              }, 3000);
            } else {
              // 拖到气泡上，直接弹出键盘
              setTimeout(() => {
                handleReply(overParentId, true, gif);
              }, 0);
            }
          }
        }
      }
    }
    
    setDraggingBottomIp(null);
    setDragOverParentId(null);
    setDragOverBubble(false);
    setDragClonePosition(null);
    bottomIpDragRef.current = null;
  };

  const [bottomIpIds, setBottomIpIds] = useState<string[]>([]);
  const [bottomIpInitialized, setBottomIpInitialized] = useState(false);

  useEffect(() => {
    const allNodesWithText = groupedIps.flatMap((p: any) => [
      ...(p.text ? [p] : []),
      ...(p.children || []).filter((c: any) => c.text)
    ]);
    
    if (allNodesWithText.length === 0) return;

    const interval = setInterval(() => {
      const count = Math.floor(Math.random() * 3) + 1;
      const shuffled = [...allNodesWithText].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count).map(n => n.id);
      
      setRandomVisibleIds(selected);
      
      setTimeout(() => {
        setRandomVisibleIds([]);
      }, 3500);
      
    }, 6000);
    
    return () => clearInterval(interval);
  }, [groupedIps]);

  useEffect(() => {
    if (bottomIpInitialized) return;
    const allNodes = groupedIps.flatMap((p: any) => [p, ...(p.children || [])]);
    if (allNodes.length === 0) return;
    
    const shuffled = [...allNodes].sort(() => 0.5 - Math.random());
    // 选择更多IP（最多15个），但屏幕上只显示5个，可以左右滑动浏览
    const selectedCount = Math.min(15, allNodes.length);
    const selected = shuffled.slice(0, selectedCount).map(n => n.id);
    setBottomIpIds(selected);
    setBottomIpInitialized(true);
  }, [groupedIps, bottomIpInitialized]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (activeMenuId && activeMenuId.endsWith('_field')) {
        const parentId = activeMenuId.replace('_field', '');
        const parent = groupedIps.find((p: any) => p.id === parentId);
        if (parent) {
          const el = document.getElementById(`ip-node-${parent.id}`);
          if (el) {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2));
            const baseRadius = 40 + (parent.children.length > 5 ? 10 : 0) + 20;
            if (distance > baseRadius * 1.5) {
              setActiveMenuId(null);
            }
          }
        }
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [activeMenuId, groupedIps]);

  // 处理拖拽开始
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  // 处理拖拽移动
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      const containerW = containerRef.current?.clientWidth ?? 750;
      const containerH = containerRef.current?.clientHeight ?? 750;
      const maxOffsetX = Math.max(0, (850 * scale - containerW) / 2);
      const maxOffsetY = Math.max(0, (850 * scale - containerH) / 2);

      const clampedX = Math.max(-maxOffsetX, Math.min(maxOffsetX, newX));
      const clampedY = Math.max(-maxOffsetY, Math.min(maxOffsetY, newY));

      setPosition({ x: clampedX, y: clampedY });
    }
  };

  // 处理拖拽结束
  const handleMouseUp = () => {
    setIsDragging(false);
  };


  const handleWheel = (_e: React.WheelEvent) => {
    // 缩放逻辑已移至原生非 passive 监听器，此处仅占位
  };

  const timerRef = useRef<any>(null);
  const isLongPress = useRef(false);
  const [menuOffset, setMenuOffset] = useState(0);
  const bubbleTimerRef = useRef<any>(null);
  const onPointerDown = (e: any, item: any, count: number) => {
    isLongPress.current = false;
    // 记录初始位置
    const startX = e.clientX;
    const startY = e.clientY;
    
    timerRef.current = setTimeout(() => {
      // 检查是否有移动（如果移动超过5px，认为是拖动，不触发长按）
      const currentX = e.clientX;
      const currentY = e.clientY;
      const distance = Math.sqrt(Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2));
      
      if (distance < 5 && item.user !== '我') {
        isLongPress.current = true;
        handleReply(item.id, false);
      }
    }, 500);
  };

  const onPointerUp = (e: any, item: any, count: number) => {
    clearTimeout(timerRef.current);
  };

  const onClick = (e: any, item: any, count: number) => {
    if (item.user === '我') return;
    e.stopPropagation();
    if (!isLongPress.current) {
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
      setActiveBubbleId(prev => prev === item.id ? null : item.id);
      // 点击时播放 GIF，2.5s 后恢复 PNG
      setActiveGifId(item.id);
      clearTimeout(gifTimerRef.current);
      gifTimerRef.current = setTimeout(() => setActiveGifId(null), 2500);
    }
  };

  // 处理云朵点击事件 - 进入世界模式
  const handleCloudClick = (parent: any) => {
    // 进入世界模式
    setViewMode('world');
    // 同时进入剧场模式
    setTimeout(() => {
      setTheaterMode(parent.id);
    }, 100);
  };

  // 处理评论动态显示
  const startDynamicComments = () => {
    // 清除之前的定时器
    if (commentTimerRef.current) {
      clearInterval(commentTimerRef.current);
    }

    // 从所有团组中随机选择一个
    if (groupedIps.length > 0) {
      const randomIndex = Math.floor(Math.random() * groupedIps.length);
      const selectedGroup = groupedIps[randomIndex];

      // 收集该团组的所有评论
      const allComments = [selectedGroup, ...(selectedGroup.children || [])];
      const commentsWithText = allComments.filter(comment => comment.text);

      if (commentsWithText.length > 0) {
        let currentIndex = 0;

        // 开始动态显示评论
        commentTimerRef.current = setInterval(() => {
          if (currentIndex < commentsWithText.length) {
            const comment = commentsWithText[currentIndex];
            
            // 添加到活跃评论列表
            setActiveComments(prev => [...prev, {
              id: comment.id,
              text: comment.text,
              user: comment.user,
              avatar: comment.avatar || 'https://neeko-copilot.bytedance.net/api/text2image?prompt=user%20avatar%20icon&size=64x64'
            }]);

            // 根据评论长度计算显示时间（2-3秒）
            const displayTime = Math.max(2000, Math.min(3000, comment.text.length * 50));

            // 一段时间后移除该评论
            setTimeout(() => {
              setActiveComments(prev => prev.filter(c => c.id !== comment.id));
            }, displayTime);

            currentIndex++;
          } else {
            // 循环显示
            currentIndex = 0;
          }
        }, 2500); // 每2.5秒显示一条新评论，与前一条有重叠
      }
    }
  };

  // 组件挂载时开始动态评论显示
  useEffect(() => {
    // 禁用动态评论系统，只使用气泡评论
    // startDynamicComments();
    
    return () => {
      if (commentTimerRef.current) {
        clearInterval(commentTimerRef.current);
      }
    };
  }, [groupedIps]);

  const onContextMenu = (e: any, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    clearTimeout(timerRef.current);
    handleImageContextMenu(e, item.id);
  };

  const triggerInteraction = (clientX: number, clientY: number, ipData: any, actionKey: string, shouldAddReply: boolean = false, skipAnimation: boolean = false) => {
    setActiveMenuId(null);
    setTappedVisibleIds(prev => prev.filter(id => id !== ipData.id));
    setInteractingIds([ipData.id]);
    
    setLastInteractions((prev: any) => ({ ...prev, [ipData.id]: actionKey }));
    setInteractionCounts((prev: any) => ({
      ...prev,
      [ipData.id]: (prev[ipData.id] || 0) + 1
    }));

    const ipActions = ipCustomActions[ipData.id] || initialActions;
    const action = ipActions[actionKey as keyof typeof ipActions];
    
    if (!skipAnimation) {
      const customSourceIp = customInteractionGifs[actionKey] || action.icon;
      handleReplay(customSourceIp, customImages?.[ipData.id] || getRandomGif(), action, actionKey);
      
      if (shouldAddReply) {
        setTimeout(() => {
          handleAddReplyFromAction(ipData.id, actionKey);
        }, 3000);
      }
    } else {
      if (shouldAddReply) {
        handleAddReplyFromAction(ipData.id, actionKey);
      }
    }

    const newInteraction = {
      id: Date.now().toString(),
      x: clientX,
      y: clientY,
      type: action.complement
    };
    
    setTimeout(() => {
      setInteractingIds(prev => prev.filter(id => id !== ipData.id));
    }, 1500);
  };

  const triggerGroupInteraction = (clientX: number, clientY: number, parent: any, actionKey: string) => {
    setActiveMenuId(null);
    setActiveClusterCardId(null);
    
    const ipActions = ipCustomActions[parent.id] || initialActions;
    const action = ipActions[actionKey as keyof typeof ipActions];
    
    const allNodes = [parent, ...parent.children];
    const allIds = allNodes.map((n: any) => n.id);
    setInteractingIds(prev => [...prev, ...allIds]);
    
    const targetIps = allNodes.map((child: any) => customImages?.[child.id] || child.ip);
    
    handleGroupReplay(customUserIp || action.icon, targetIps, action);

    setTimeout(() => {
      setInteractingIds(prev => prev.filter(id => !allIds.includes(id)));
    }, 1500);

    setTimeout(() => {
      handleAddReplyFromAction(parent.id, actionKey, true);
    }, 1500);
  };

  const renderIpNode = (item: any, isParent: boolean) => {
    const count = interactionCounts[item.id] || 0;
    const visibility = getIpVisibility(item, count, scale, topThreeMinScore);
    const isHidden = visibility === 'hidden';
    const isSmall  = visibility === 'small';
    const isNormal = visibility === 'normal';

    const isInteracting = interactingIds.includes(item.id);
    const stateStyle = getIpStateStyle(count);
    const isRandomVisible = randomVisibleIds.includes(item.id);
    const isTappedVisible = tappedVisibleIds.includes(item.id);
    const isVisible = isRandomVisible || isTappedVisible;
    const basePng   = customImages?.[item.id] || getRandomGifForId(item.id);
    const randomGif = activeGifId === item.id ? toGifSrc(basePng) : basePng;

    // 计算当前缩放下 IP 的视觉大小系数（正常态 1×→1.5×，缩小态 ×0.33）
    const t = Math.max(0, Math.min(1, (scale - 0.88) / (3.0 - 0.88)));
    const sizeFactor = 1 + t * 0.5;
    const imageScale = (1 / scale) * sizeFactor * (isNormal ? 1 : 0.5);

    return (
      <div
        className={`flex flex-col items-center group ${isParent ? '' : 'absolute'} ${activeMenuId === item.id ? 'z-[60]' : (isVisible ? 'z-[50]' : 'z-10')} hover:z-[100]`}
        style={{
          ...(isParent ? {} : {
            left: `calc(50% + ${Math.cos(item.angle) * (item.radiusX || item.radius)}px)`,
            top: `calc(50% + ${Math.sin(item.angle) * (item.radiusY || item.radius)}px)`,
            transform: 'translate(-50%, -50%)'
          }),
          // 只有正常态可交互
          pointerEvents: isNormal ? 'auto' : 'none'
        }}
      >
        <motion.div
          id={`ip-node-${item.id}`}
          className="relative flex flex-col items-center"
          initial={item.isNew ? { opacity: 0 } : false}
          animate={{
            y: isInteracting ? [`0%`, `-20%`, `0%`] : 0,
            scale: isInteracting ? 1.2 : 1,
            opacity: isHidden ? 0 : (isSmall ? 0.5 : 1)
          }}
          transition={{
            duration: isInteracting ? 0.5 : 0.45,
            ease: 'easeInOut'
          }}
        >
          {/* 气泡评论：只有正常态显示 */}
          {item.text && isNormal && (
            <div
              className={`absolute w-max max-w-[160px] bg-white rounded-lg p-2.5 shadow-lg transition-opacity duration-500 pointer-events-auto flex flex-col items-start z-[120] ${(isVisible || activeBubbleId === item.id) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              style={{
                bottom: 'calc(100% - 20px)',
                transform: `scale(${1 / scale})`,
                transformOrigin: 'bottom center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15), 0 8px 40px rgba(0,0,0,0.1)'
              }}
            >
              <svg
                className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                style={{ bottom: '-7px', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.07))' }}
                width="14" height="8" viewBox="0 0 14 8"
              >
                <path d="M0 0 C3 0 5 8 7 8 C9 8 11 0 14 0Z" fill="white" />
              </svg>
              <div className="text-xs text-[#333333] leading-tight text-left">
                {item.text.length > 50 ? item.text.substring(0, 50) + '...' : item.text}
              </div>
              <button
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center z-10 border border-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  const gif = customImages?.[item.id] || getRandomGifForId(item.id);
                  setIpTheaterTextVisible(false);
                  setIpTheaterMode({ id: item.id, text: item.text || '', gif });
                  setTimeout(() => setIpTheaterTextVisible(true), 600);
                  handleReply(item.id, false, undefined, false);
                  requestAnimationFrame(() => requestAnimationFrame(() => setInputFocused(true)));
                }}
                title="回复"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="M12 3C7.03 3 3 6.58 3 11C3 13.24 4 15.26 5.63 16.71L5 21L9.07 19.44C10.02 19.8 11.01 20 12 20C16.97 20 21 16.42 21 11C21 5.58 16.97 3 12 3Z"/>
                </svg>
              </button>
            </div>
          )}

          <div
            className={`relative mt-1 flex items-center justify-center ${isNormal ? 'cursor-pointer' : ''}`}
            style={{
              width: isParent ? '80px' : '72px',
              height: isParent ? '80px' : '72px',
              transform: `scale(${imageScale})`,
              transformOrigin: 'center center',
              transition: 'transform 0.45s ease-in-out'
            }}
            onPointerDown={isNormal ? (e) => onPointerDown(e, item, count) : undefined}
            onPointerUp={isNormal ? (e) => onPointerUp(e, item, count) : undefined}
            onClick={isNormal ? (e) => onClick(e, item, count) : undefined}
            onContextMenu={isNormal ? (e) => onContextMenu(e, item) : undefined}
            onPointerLeave={isNormal ? () => clearTimeout(timerRef.current) : undefined}
          >
            <SafeIpImage
              src={randomGif}
              className="object-contain transition-all duration-300 pointer-events-none relative z-10"
              style={{
                filter: stateStyle.filter,
                width:  isPng(randomGif) ? '75%' : '100%',
                height: isPng(randomGif) ? '75%' : '100%',
              }}
              alt="IP"
            />
          </div>
        </motion.div>
      </div>
    );
  };

  const containerRef = useRef<HTMLDivElement>(null);

  // 用原生非 passive 监听器拦截触控板捏合，防止触发浏览器页面缩放
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      e.stopPropagation();
      const zoomIntensity = 0.01;
      const newScale = scale - e.deltaY * zoomIntensity;
      setIsWheeling(true);
      clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => setIsWheeling(false), 150);
      const containerW = el.clientWidth ?? 750;
      const containerH = el.clientHeight ?? 750;
      const minScale = Math.max(containerW, containerH) / 850;
      const clampedScale = Math.max(minScale, Math.min(3, newScale));
      setScale(clampedScale);
      const maxOffsetX = Math.max(0, (850 * clampedScale - containerW) / 2);
      const maxOffsetY = Math.max(0, (850 * clampedScale - containerH) / 2);
      setPosition((prev: { x: number; y: number }) => ({
        x: Math.max(-maxOffsetX, Math.min(maxOffsetX, prev.x)),
        y: Math.max(-maxOffsetY, Math.min(maxOffsetY, prev.y)),
      }));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [scale]);

  return (
  <>
    <div 
      ref={containerRef} 
      className="flex items-center justify-center bg-transparent relative z-10 w-full h-full overflow-hidden p-0"
      onWheel={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div 
        className="relative h-[750px] w-[750px]"
        onWheel={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
      </div>

      {/* 背景层 - 不随缩放变化，850x850px */}
      <div 
        className="absolute inset-0 z-[-1]"
        style={{ 
          backgroundImage: customBgImage ? `url(${customBgImage})` : 'radial-gradient(circle at 50% 50%, #F3F3F1 0%, #F3F3F1 80%, #FDF2E7 90%, #E5ECF0 95%, #F3F3F1 100%)',
          backgroundColor: customBgImage ? 'transparent' : '#F3F3F1',
          backgroundSize: '100% 100%',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          width: '850px',
          height: '850px',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
      
      {/* 交互层 - 随缩放和平移变化，850x850px */}
      <div 
        className="absolute cursor-grab active:cursor-grabbing z-0"
        style={{ 
          width: '850px',
          height: '850px',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'center center',
          transition: (isDragging || isWheeling) ? 'none' : 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={() => {
          setActiveMenuId(null);
          setActiveClusterCardId(null);
          setTappedVisibleIds([]);
          setActiveBubbleId(null);
          setInputFocused(false);
          if (bubbleTimerRef.current) {
            clearTimeout(bubbleTimerRef.current);
          }
        }}
        title="拖拽移动世界，滚轮缩放"
      >
        {!customBgImage && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* 运动的光晕 - 模仿参考图的梦幻感 */}
            <motion.div
              animate={{
                x: ['-10%', '5%', '-10%'],
                y: ['-5%', '10%', '-5%'],
                rotate: [0, 90, 0],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] bg-gradient-to-br from-[#ffb199] to-[#ff0844] rounded-full filter blur-[120px] opacity-30"
            />
            <motion.div
              animate={{
                x: ['10%', '-10%', '10%'],
                y: ['10%', '-5%', '10%'],
                rotate: [0, -90, 0],
              }}
              transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[10%] -right-[20%] w-[90%] h-[90%] bg-gradient-to-bl from-[#4facfe] to-[#00f2fe] rounded-full filter blur-[140px] opacity-30"
            />
            <motion.div
              animate={{
                x: ['-5%', '15%', '-5%'],
                y: ['15%', '-10%', '15%'],
                rotate: [0, 45, 0],
              }}
              transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-[30%] left-[10%] w-[100%] h-[80%] bg-gradient-to-tr from-[#f6d365] to-[#fda085] rounded-full filter blur-[130px] opacity-30"
            />
            {/* 中心高光 */}
            <motion.div
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-white rounded-full filter blur-[100px] opacity-80"
            />
          </div>
        )}
        
        {/* Render Cluster Aura BELOW IPs */}
        {clusterAuraEnabled && groupedIps.map((parent: any) => {
          const clusterAllHidden = [parent, ...(parent.children || [])].every(
            (ip: any) => getIpVisibility(ip, interactionCounts[ip.id] || 0, scale, topThreeMinScore) === 'hidden'
          );

          const allIps = [parent, ...(parent.children || [])];

          // ── 内容质量 → 三级云朵资产（点赞数主导）────────────────────────
          const totalLikes = allIps.reduce((s: number, ip: any) => s + (ip.likes || 0), 0);
          const likeTier: 1 | 2 | 3 = totalLikes >= 200 ? 3 : totalLikes >= 50 ? 2 : 1;
          const tierImagePath = getClusterAssetForTier(parent.id, likeTier);

          // ── 活跃程度 → 云朵大小（最近评论时间 + 回复数）────────────────
          const parseTimeToMinutes = (t: string): number => {
            if (!t) return 24 * 60;
            const minMatch = t.match(/(\d+)分钟前/);
            if (minMatch) return parseInt(minMatch[1]);
            const hourMatch = t.match(/(\d+)小时前/);
            if (hourMatch) return parseInt(hourMatch[1]) * 60;
            if (t.includes('昨天')) return 20 * 60;
            const dayMatch = t.match(/(\d+)天前/);
            if (dayMatch) return parseInt(dayMatch[1]) * 24 * 60;
            return 30 * 60;
          };
          const allReplies = parent.replies || [];
          const mostRecentMins = Math.min(
            parseTimeToMinutes(parent.time),
            ...allReplies.map((r: any) => parseTimeToMinutes(r.time))
          );
          const recencyScore = Math.max(0, 1 - mostRecentMins / (24 * 60));
          const replyScore = Math.min(allReplies.length / 10, 1);
          const activityMultiplier = 0.5 + (recencyScore * 0.6 + replyScore * 0.4) * 1.0;

          const cloudSize = (parent.size * 2 + 100) * activityMultiplier;

          return (
            <motion.div
              key={`aura-bg-${parent.id}`}
              className="absolute pointer-events-none z-[5]"
              animate={{ opacity: clusterAllHidden ? 0 : 1 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{
                left: `${parent.x}%`,
                top: `${parent.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* 云朵图片：三级资产 × 活跃度大小 */}
              <div
                className="absolute pointer-events-none"
                style={{
                  width: `${cloudSize}px`,
                  height: `${cloudSize}px`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  transition: 'width 0.6s ease-in-out, height 0.6s ease-in-out',
                }}
              >
                <img
                  src={tierImagePath}
                  alt={`cluster-tier-${likeTier}`}
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{ animation: 'none' }}
                  onError={(e) => { console.error('❌ 云朵资产加载失败:', tierImagePath, e); }}
                />
              </div>
            </motion.div>
          );
        })}

        {clusterParticlesEnabled && groupedIps.map((parent: any) => {
          if (!parent.children || parent.children.length === 0) return null;
          
          const particles = clusterParticles[parent.id] || [];

          return (
            <div
              key={`aura-particles-${parent.id}`}
              className="absolute pointer-events-none z-[60]"
              style={{ 
                left: `${parent.x}%`, 
                top: `${parent.y}%`, 
                transform: 'translate(-50%, -50%)', 
              }}
            >
              <div
                className="absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  width: `${(70 + (parent.children.length > 4 ? 10 : 0)) * 2 + 180}px`,
                  height: `${(70 + (parent.children.length > 4 ? 10 : 0)) * 2 + 180}px`,
                }}
              >
                {/* Random Slow Particles */}
                {particles.map((p: any, i: number) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: p.size * 1.5,
                      height: p.size * 1.5,
                      opacity: p.opacity * 1.5,
                      backgroundColor: p.color,
                      boxShadow: `0 0 8px ${p.color}`
                    }}
                    animate={{
                      x: [
                        Math.cos(p.angle) * p.radius * 1.2,
                        Math.cos(p.angle + Math.PI) * p.radius * 1.2,
                        Math.cos(p.angle + Math.PI * 2) * p.radius * 1.2
                      ],
                      y: [
                        Math.sin(p.angle) * p.radius * 1.2,
                        Math.sin(p.angle + Math.PI) * p.radius * 1.2,
                        Math.sin(p.angle + Math.PI * 2) * p.radius * 1.2
                      ]
                    }}
                    transition={{
                      duration: p.duration,
                      repeat: Infinity,
                      ease: "linear",
                      delay: p.delay
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {groupedIps.map((parent: any) => {
          const clusterAllHidden = [parent, ...(parent.children || [])].every(
            (ip: any) => getIpVisibility(ip, interactionCounts[ip.id] || 0, scale, topThreeMinScore) === 'hidden'
          );
          return (
        <motion.div
          key={parent.id}
          data-parent-id={parent.id}
          className="absolute cursor-pointer"
          animate={{ opacity: clusterAllHidden ? 0 : (theaterMode && parent.id !== theaterMode ? 0 : 1) }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{
            left: `${parent.x}%`,
            top: `${parent.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: activeMenuId === parent.id || activeMenuId === parent.id + '_field' || activeClusterCardId === parent.id || parent.children.some((c:any) => activeMenuId === c.id) ? 40 : 10,
            pointerEvents: clusterAllHidden ? 'none' : 'auto'
          }}
          onClick={() => { handleCloudClick(parent); }}
        >
          <div
            className="relative flex items-center justify-center"
          >

            {renderIpNode(parent, true)}
            
            {parent.children.map((child: any) => (
              <React.Fragment key={child.id}>
                {renderIpNode(child, false)}
              </React.Fragment>
            ))}


          </div>
        </motion.div>
          );
        })}

        {/* 世界模式用户发布的IP评论节点 */}
        {worldUserComments.map((wuc) => (
          <motion.div
            key={wuc.id}
            className="absolute pointer-events-none flex flex-col items-center gap-1 z-[50]"
            style={{ left: wuc.x, top: wuc.y, transform: 'translate(-50%, -50%)' }}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <img src={wuc.gif} alt="" className="w-14 h-14 object-contain drop-shadow-[0_2px_12px_rgba(255,255,255,0.7)]" />
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-2.5 py-1 text-gray-700 text-[10px] max-w-[100px] text-center leading-relaxed shadow-sm">
              {wuc.text}
            </div>
          </motion.div>
        ))}

    </div>

  </div>

  {/* 剧场模式 - 放在最外层，不受缩放影响，但限制在手机框内 */}
  <AnimatePresence>
    {theaterMode && (
      <>
        {/* 黑色遮罩 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm z-[200]"
          onClick={() => { setTheaterMode(null); setInputFocused(false); }}
        />
        
        {/* 高亮当前团组 - 全屏，IP固定，评论散布 */}
        {groupedIps.map((parent: any) => {
          if (parent.id !== theaterMode) return null;
          const allNodes = [parent, ...(parent.children || [])].filter((n: any) => n.text);
          const groups = groupComments(allNodes);
          const currentGroup = groups[theaterGroupIndex] || [];
          const groupGifKey = `theater_${parent.id}_g${theaterGroupIndex}`;
          const gifSrc = customImages?.[groupGifKey] || getRandomGifForId(`${parent.id}_g${theaterGroupIndex}`);

          // 评论散布位置：以IP为中心，向外辐射分布，限制在屏幕上半部分
          const getCommentPos = (gIdx: number, idx: number, total: number) => {
            const n = Math.max(total, 1);
            const baseAngle = (idx / n) * 2 * Math.PI - Math.PI / 2;
            const jitter = Math.sin(gIdx * 31 + idx * 17) * 0.45;
            const angle = baseAngle + jitter + gIdx * 1.1;
            const rSeed = Math.abs(Math.sin(gIdx * 7 + idx * 13));
            const rX = 22 + rSeed * 14; // 22-36% of width
            const rY = 12 + rSeed * 6;  // 12-18% of height
            const rawLeft = 50 + Math.cos(angle) * rX;
            const rawTop = 28 + Math.sin(angle) * rY;
            return {
              left: `${Math.max(10, Math.min(90, rawLeft))}%`,
              top: `${Math.max(8, Math.min(44, rawTop))}%`,
            };
          };

          return (
            <motion.div
              key={`theater-${parent.id}`}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: inputFocused ? -60 : 0 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.4 },
                y: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
              }}
              className="absolute inset-0 z-[210]"
              onPointerDown={(e) => {
                theaterSwipeStartX.current = e.clientX;
                try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
              }}
              onPointerUp={(e) => {
                if (theaterSwipeStartX.current === null) return;
                const dx = e.clientX - theaterSwipeStartX.current;
                theaterSwipeStartX.current = null;
                if (Math.abs(dx) < 50) return;
                if (dx < 0 && theaterGroupIndex < groups.length - 1) setTheaterGroupIndex(i => i + 1);
                if (dx > 0 && theaterGroupIndex > 0) setTheaterGroupIndex(i => i - 1);
              }}
            >
              {/* IP gif：固定在屏幕中心偏上，不随评论移动 */}
              <div
                className="absolute z-10 cursor-pointer"
                style={{ left: '50%', top: '28%', transform: 'translate(-50%, -50%)' }}
                onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); handleImageContextMenu(e, groupGifKey); }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`gif-${theaterGroupIndex}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.35 }}
                    style={{ width: '160px', height: '160px' }}
                  >
                    <SafeIpImage src={gifSrc} className="w-full h-full object-contain pointer-events-none" alt="IP" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 评论气泡：随机散布在IP周围，依次渐显不消失 */}
              {currentGroup.map((node: any, idx: number) => {
                if (idx >= theaterRevealCount) return null;
                const pos = getCommentPos(theaterGroupIndex, idx, currentGroup.length);
                return (
                  <motion.div
                    key={`${theaterGroupIndex}-${node.id}`}
                    className="absolute z-20 pointer-events-none"
                    style={{ left: pos.left, top: pos.top, transform: 'translate(-50%, -50%)' }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-3 py-1.5 text-white text-xs max-w-[140px] text-center leading-relaxed shadow-sm">
                      {node.text}
                    </div>
                  </motion.div>
                );
              })}

              {/* 用户发送的IP+文字评论（只显示当前场景的） */}
              {theaterUserComments.filter(uc => uc.groupIndex === theaterGroupIndex).map((uc) => (
                <motion.div
                  key={uc.id}
                  className="absolute z-[25] pointer-events-none flex flex-col items-center gap-1"
                  style={{ left: uc.left, top: uc.top, transform: 'translate(-50%, -50%)' }}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                >
                  <img src={uc.gif} alt="" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-3 py-1.5 text-white text-xs max-w-[120px] text-center leading-relaxed">
                    {uc.text}
                  </div>
                </motion.div>
              ))}

              {/* 左右切换按钮 + 指示点 */}
              {groups.length > 1 && (
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 z-20" style={{ top: '46%' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (theaterGroupIndex > 0) setTheaterGroupIndex(i => i - 1); }}
                    className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xs disabled:opacity-30 transition-opacity"
                    disabled={theaterGroupIndex === 0}
                  >‹</button>
                  <div className="flex gap-1.5">
                    {groups.map((_: any, gi: number) => (
                      <div key={gi} className={`w-1.5 h-1.5 rounded-full transition-all ${gi === theaterGroupIndex ? 'bg-white' : 'bg-white/30'}`} />
                    ))}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (theaterGroupIndex < groups.length - 1) setTheaterGroupIndex(i => i + 1); }}
                    className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xs disabled:opacity-30 transition-opacity"
                    disabled={theaterGroupIndex === groups.length - 1}
                  >›</button>
                </div>
              )}
            </motion.div>
          );
        })}
        
        {/* 返回按钮 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute top-4 left-4 z-[220]"
        >
          <button
            onClick={() => { setTheaterMode(null); setInputFocused(false); }}
            className="flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </motion.div>
        
      </>
    )}
  </AnimatePresence>

  {/* 团组剧场模式输入胶囊：始终挂载，随弧形同步升起 */}
  <div
    className="absolute left-1/2 -translate-x-1/2 z-[250]"
    style={{
      bottom: (theaterMode && inputFocused) ? '268px' : '8px',
      opacity: theaterMode ? 1 : 0,
      pointerEvents: theaterMode ? 'auto' : 'none',
      transform: `translateY(${theaterMode ? 0 : 30}px)`,
      transition: 'bottom 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.25s ease-out, transform 0.3s ease-out',
    }}
    onClick={(e) => e.stopPropagation()}
  >
    <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xl rounded-full px-3 py-1.5 shadow-2xl border border-white/50">
      <button className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors" onClick={(e) => e.stopPropagation()}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </button>
      <div className="bg-gray-100 rounded-full h-7 flex items-center px-2.5 min-w-[200px]">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="回复..."
          className="bg-transparent flex-1 text-xs outline-none text-gray-700 placeholder-gray-400"
          onFocus={() => setInputFocused(true)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (inputText.trim() && selectedArcIpId && theaterMode) {
            const gif = customImages?.[selectedArcIpId] || getRandomGifForId(selectedArcIpId);
            const slots = [
              { left: '22%', top: '10%' }, { left: '72%', top: '14%' },
              { left: '15%', top: '22%' }, { left: '65%', top: '8%'  },
              { left: '42%', top: '18%' }, { left: '80%', top: '22%' },
            ];
            const pos = slots[theaterUserComments.length % slots.length];
            setTheaterUserComments(prev => [...prev, { id: `u-${Date.now()}`, text: inputText, gif, left: pos.left, top: pos.top, groupIndex: theaterGroupIndex }]);
          }
          setInputFocused(false);
          setInputText('');
          setSelectedArcIpId(null);
        }}
        className="w-7 h-7 rounded-full flex items-center justify-center font-medium transition-all bg-gray-100 hover:bg-gray-200 text-gray-700"
      >
        <Send className="w-3.5 h-3.5 -rotate-45" />
      </button>
    </div>
  </div>

  {/* 世界模式常态输入胶囊：两种剧场模式均隐藏时显示 */}
  {!theaterMode && !ipTheaterMode && (
    <div
      className="absolute left-4 right-4 z-[250]"
      style={{
        bottom: inputFocused ? '272px' : '16px',
        transition: 'bottom 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        pointerEvents: 'auto',
      }}
      onClick={(e) => { e.stopPropagation(); setInputFocused(true); }}
    >
      <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xl rounded-full px-3 py-1.5 shadow-2xl border border-white/50">
        {/* 语音按钮 */}
        <button
          className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </button>
        {/* 输入框 */}
        <div className="bg-gray-100 rounded-full h-7 flex items-center px-2.5 flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="说点什么..."
            className="bg-transparent w-full text-xs outline-none text-gray-700 placeholder-gray-400"
            onFocus={() => setInputFocused(true)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        {/* 发送 / 表情按钮 */}
        {inputFocused ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (inputText.trim() && selectedArcIpId) {
                const gif = customImages?.[selectedArcIpId] || getRandomGifForId(selectedArcIpId);
                const x = `${15 + Math.random() * 70}%`;
                const y = `${15 + Math.random() * 55}%`;
                setWorldUserComments(prev => [...prev, { id: `w-${Date.now()}`, gif, text: inputText, x, y }]);
                setSelectedArcIpId(null);
              }
              setInputFocused(false);
              setInputText('');
            }}
            className="w-7 h-7 rounded-full flex items-center justify-center font-medium transition-all bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            <Send className="w-3.5 h-3.5 -rotate-45" />
          </button>
        ) : (
          <button
            className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )}

  {/* 单 IP 剧场模式：点击 IP 时显示，黑色遮罩 + IP 动图 + 评论文字 */}
  <AnimatePresence>
    {ipTheaterMode && (
      <>
        {/* 黑色遮罩 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm z-[200]"
          onClick={() => { setIpTheaterMode(null); setIpTheaterTextVisible(false); setActiveBubbleId(null); setInputFocused(false); setIpTheaterUserComments([]); setSelectedArcIpId(null); }}
        />
        {/* IP gif + 评论文字 + 用户发布的内容 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: inputFocused ? -200 : 0 }}
          animate={{ opacity: 1, scale: 1, y: inputFocused ? -200 : 0 }}
          exit={{ opacity: 0, scale: 0.88 }}
          transition={{
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
            y: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] },
          }}
          className="absolute inset-0 z-[210] flex flex-col items-center justify-center pointer-events-none"
        >
          {ipTheaterUserComments.map((uc) => (
            <motion.div
              key={uc.id}
              className="absolute pointer-events-none flex flex-col items-center gap-1"
              style={{ left: uc.left, top: uc.top, transform: 'translate(-50%, -50%)' }}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <img src={uc.gif} alt="" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-3 py-1.5 text-white text-xs max-w-[120px] text-center leading-relaxed">
                {uc.text}
              </div>
            </motion.div>
          ))}
          {ipTheaterMode.text && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: ipTheaterTextVisible ? 1 : 0, y: ipTheaterTextVisible ? 0 : 10 }}
              transition={{ duration: 0.5 }}
              className="mb-5 bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-2.5 text-white text-sm text-center max-w-[260px] leading-relaxed"
            >
              {ipTheaterMode.text}
            </motion.div>
          )}
          <div style={{ width: '180px', height: '180px' }}>
            <SafeIpImage src={ipTheaterMode.gif} className="w-full h-full object-contain" alt="IP" />
          </div>
        </motion.div>
        {/* 返回按钮 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-4 left-4 z-[220]"
        >
          <button
            className="flex items-center justify-center text-white/80 hover:text-white transition-colors"
            onClick={() => { setIpTheaterMode(null); setIpTheaterTextVisible(false); setActiveBubbleId(null); setInputFocused(false); setIpTheaterUserComments([]); setSelectedArcIpId(null); }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </motion.div>
      </>
    )}
  </AnimatePresence>

  {/* IP 剧场模式输入胶囊：始终挂载，CSS 控制位置，随弧形一起升起 */}
  <div
    className="absolute left-1/2 -translate-x-1/2 z-[250]"
    style={{
      bottom: (ipTheaterMode && inputFocused) ? '268px' : '8px',
      opacity: ipTheaterMode ? 1 : 0,
      pointerEvents: ipTheaterMode ? 'auto' : 'none',
      transition: 'bottom 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.2s ease-out',
    }}
    onClick={(e) => e.stopPropagation()}
  >
    <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xl rounded-full px-3 py-1.5 shadow-2xl border border-white/50">
      <button className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors" onClick={(e) => e.stopPropagation()}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      </button>
      <div className="bg-gray-100 rounded-full h-7 flex items-center px-2.5 min-w-[200px]">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="回复..."
          className="bg-transparent flex-1 text-xs outline-none text-gray-700 placeholder-gray-400"
          onFocus={() => setInputFocused(true)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (inputText.trim() && selectedArcIpId && ipTheaterMode) {
            const gif = customImages?.[selectedArcIpId] || getRandomGifForId(selectedArcIpId);
            const slots = [
              { left: '22%', top: '10%' }, { left: '72%', top: '14%' },
              { left: '15%', top: '22%' }, { left: '65%', top: '8%'  },
              { left: '42%', top: '18%' }, { left: '80%', top: '22%' },
            ];
            const pos = slots[ipTheaterUserComments.length % slots.length];
            setIpTheaterUserComments(prev => [...prev, { id: `u-${Date.now()}`, text: inputText, gif, left: pos.left, top: pos.top }]);
          }
          setInputFocused(false);
          setInputText('');
          setSelectedArcIpId(null);
        }}
        className="w-7 h-7 rounded-full flex items-center justify-center font-medium transition-all bg-gray-100 hover:bg-gray-200 text-gray-700"
      >
        <Send className="w-3.5 h-3.5 -rotate-45" />
      </button>
    </div>
  </div>

  <style>{`
    @keyframes arcIpPulse {
      0%, 100% { opacity: 0.7; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.15); }
    }
    @keyframes arcIpSpin {
      0% { transform: rotate(0deg) scale(1); border-color: rgba(255,220,80,0.85); }
      50% { transform: rotate(180deg) scale(1.05); border-color: rgba(255,160,40,0.6); }
      100% { transform: rotate(360deg) scale(1); border-color: rgba(255,220,80,0.85); }
    }
  `}</style>

  {/* 弧形 IP 展示：始终挂载在 DOM，避免 focus 时 DOM 变更导致键盘闪退 */}
  <div
    className="absolute bottom-0 left-0 right-0 z-[215]"
    style={{
      transform: `translateY(${(theaterMode || ipTheaterMode || inputFocused) ? (inputFocused ? -260 : 0) : 30}px)`,
      transition: 'transform 0.3s ease-out, opacity 0.25s ease-out',
      opacity: (theaterMode || ipTheaterMode || inputFocused) ? 1 : 0,
      pointerEvents: (theaterMode || ipTheaterMode || inputFocused) ? 'auto' : 'none',
    }}
  >
      <div className="relative w-full h-[110px] overflow-visible pointer-events-auto">
        {/* 弧形背景 */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: '120%', height: '110px',
            background: 'linear-gradient(180deg, #F3F3F1 0%, #FDF2E7 100%)',
            borderRadius: '50% 50% 0 0 / 70% 70% 0 0',
            boxShadow: '0 -12px 40px rgba(211,216,239,0.8), 0 -4px 16px rgba(253,242,231,0.6)'
          }}
        />
        {/* IP 沿弧线排布（绝对定位，根据椭圆公式计算纵向偏移） */}
        <div className="absolute inset-0 z-10">
          {(() => {
            const seenGifs = new Set<string>();
            const display = bottomIpIds.filter(ipId => {
              const gif = customImages?.[ipId] || getRandomGifForId(ipId);
              if (seenGifs.has(gif)) return false;
              seenGifs.add(gif);
              return true;
            }).slice(0, 5);
            return display.map((ipId, i) => {
              const n = display.length;
              const xFrac = n === 1 ? 0.5 : 0.15 + (i / (n - 1)) * 0.70;
              const norm = (xFrac - 0.5) / 0.5; // -1 … 1
              // 椭圆高度：弧顶 = 55px，弧边 = 0px（从容器底部量起）
              const arcBottom = 55 * Math.sqrt(Math.max(0, 1 - norm * norm));
              const node = groupedIps?.flatMap((p: any) => [p, ...(p.children || [])]).find((n: any) => n.id === ipId);
              if (!node) return null;
              const basePngArc = customImages?.[ipId] || getRandomGifForId(ipId);
              const isSelected = selectedArcIpId === ipId;
              const gif = activeGifId === ipId ? toGifSrc(basePngArc) : basePngArc;
              return (
                <motion.div
                  key={ipId}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${xFrac * 100}%`,
                    bottom: `${arcBottom + 4}px`,
                    transform: 'translateX(-50%)',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedArcIpId(prev => prev === ipId ? null : ipId);
                    setActiveGifId(ipId);
                    clearTimeout(gifTimerRef.current);
                    gifTimerRef.current = setTimeout(() => setActiveGifId(null), 2500);
                  }}
                >
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    {isSelected && (
                      <div style={{
                        position: 'absolute', inset: '-14px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,230,100,0.28) 0%, rgba(255,200,60,0.08) 55%, transparent 75%)',
                        animation: 'arcIpPulse 2s ease-in-out infinite',
                        pointerEvents: 'none',
                      }} />
                    )}
                    <img
                      src={gif} alt=""
                      className="object-contain"
                      style={{
                        width:  isPng(gif) ? 48 : 64,
                        height: isPng(gif) ? 48 : 64,
                        filter: isSelected
                          ? 'drop-shadow(0 0 6px rgba(255,210,50,0.35)) drop-shadow(0 0 2px rgba(255,255,200,0.3))'
                          : 'drop-shadow(0 0 10px rgba(255,255,255,0.8))',
                        transform: isSelected ? 'scale(1.35)' : 'scale(1)',
                        transition: 'transform 0.35s ease-out, filter 0.35s ease-out',
                      }}
                      onPointerDown={(e) => handleBottomIpDragStart(e, ipId, gif)}
                      draggable={false}
                    />
                  </div>
                </motion.div>
              );
            });
          })()}
        </div>
      </div>
    </div>

  {/* Dragging clone */}
  {draggingBottomIp && dragClonePosition && bottomIpDragRef.current && (
    <img 
      src={bottomIpDragRef.current.gif}
      alt=""
      className="w-12 h-12 object-contain pointer-events-none"
      style={{
        position: 'fixed',
        left: dragClonePosition.x - 24,
        top: dragClonePosition.y - 24,
        zIndex: 9999,
        opacity: 0.9
      }}
    />
  )}
  
  {/* 交互动画 */}
        <AnimatePresence>
          {groupInteractionActive && groupInteractionData && (
            <GroupMicroTheater 
              sourceIp={groupInteractionData.sourceIp}
              targetIps={groupInteractionData.targetIps}
              action={groupInteractionData.action} 
            />
          )}
        </AnimatePresence>


</>
  );
});
