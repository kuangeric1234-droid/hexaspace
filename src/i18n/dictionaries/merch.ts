// ─────────────────────────────────────────────────────────────────────────────
// Merch page copy. Product visuals are AI-generated concept renders in
// /public/merch/ — swap for product photography when the range is produced.
// ─────────────────────────────────────────────────────────────────────────────
import type { Locale } from '@/i18n/config';

export type MerchProduct = {
  name: string;
  price: string;
  copy: string;
  image: string;
  tag?: string;
};

const en = {
  meta: {
    title: 'Merch — Hexa Space',
    description:
      'Hexa Space merchandise — apparel, accessories and stationery in the Hexa palette. The community, carried with you.',
  },
  hero: {
    kicker: 'Merch',
    title: 'Carry the',
    titleItalic: 'community.',
    intro:
      'A considered range of Hexa Space apparel, accessories and stationery — made in the brand palette, for members and friends of the house.',
    badge: 'First drop — coming soon',
  },
  grid: {
    eyebrow: 'The range',
    title: 'Designed like the space.',
    body: 'Black, white, and the Hexa green — quiet pieces that carry the mark without shouting it.',
    comingSoon: 'Coming soon',
  },
  products: [
    { name: 'The Hexa Tote', price: '$35', copy: 'Heavyweight natural canvas, printed with the Hexa mark.', image: '/merch/tote.svg' },
    { name: 'Member Cap', price: '$45', copy: 'Six-panel cap in Hexa green with an embroidered white mark.', image: '/merch/cap.svg' },
    { name: 'Studio Mug', price: '$29', copy: 'A generous ceramic mug for the long mornings.', image: '/merch/mug.svg' },
    { name: 'The Notebook', price: '$39', copy: 'Hardcover, blind-embossed, with a green elastic closure.', image: '/merch/notebook.svg' },
    { name: 'Member Tee', price: '$59', copy: 'Heavyweight cotton tee with a quiet chest mark.', image: '/merch/tee.svg' },
    { name: 'Insulated Bottle', price: '$49', copy: '750ml insulated steel in matte Hexa green.', image: '/merch/bottle.svg' },
    { name: 'Card Holder', price: '$25', copy: 'A slim holder in Hexa grey for cards and the essentials.', image: '/merch/cardholder.svg' },
    { name: 'Event Lanyard', price: '$15', copy: 'The green lanyard worn at every Hexa gathering.', image: '/merch/lanyard.svg' },
  ] as MerchProduct[],
  note: {
    label: 'A note on the imagery',
    body: 'These are AI-generated concept renders of the upcoming range — final products and materials may vary as each piece goes into production.',
  },
  cta: {
    eyebrow: 'Be first in line',
    title: 'Want the',
    titleItalic: 'first drop?',
    body: 'Register your interest and we’ll let you know when the range lands at reception — members receive first pick and member pricing.',
    primary: 'Register interest',
  },
};

export type MerchDict = typeof en;

const zh: MerchDict = {
  meta: {
    title: '品牌周边 — Hexa Space',
    description:
      'Hexa Space 品牌周边 — 以品牌色打造的服饰、配件与文具。让社区，随身相伴。',
  },
  hero: {
    kicker: '品牌周边',
    title: '让社区，',
    titleItalic: '随身相伴。',
    intro:
      '一系列精心设计的 Hexa Space 服饰、配件与文具 — 以品牌色调打造，献给会员与 Hexa 之友。',
    badge: '首批系列 — 即将发售',
  },
  grid: {
    eyebrow: '周边系列',
    title: '与空间一脉相承的设计。',
    body: '黑、白，与 Hexa 绿 — 低调的单品，让品牌印记不喧不闹地随行。',
    comingSoon: '即将发售',
  },
  products: [
    { name: 'Hexa 托特包', price: '$35', copy: '厚磅本色帆布，印有 Hexa 标识。', image: '/merch/tote.svg' },
    { name: '会员棒球帽', price: '$45', copy: 'Hexa 绿六片式棒球帽，白色刺绣标识。', image: '/merch/cap.svg' },
    { name: '工作室马克杯', price: '$29', copy: '一只大容量陶瓷马克杯，陪伴漫长的清晨。', image: '/merch/mug.svg' },
    { name: '精装笔记本', price: '$39', copy: '硬壳精装，压印标识，配绿色松紧带。', image: '/merch/notebook.svg' },
    { name: '会员 T 恤', price: '$59', copy: '厚磅纯棉 T 恤，胸前一枚低调的标识。', image: '/merch/tee.svg' },
    { name: '保温水瓶', price: '$49', copy: '750ml 不锈钢保温瓶，哑光 Hexa 绿。', image: '/merch/bottle.svg' },
    { name: '卡包', price: '$25', copy: 'Hexa 灰纤薄卡包，收纳卡片与随身要物。', image: '/merch/cardholder.svg' },
    { name: '活动挂绳', price: '$15', copy: '每一场 Hexa 聚会上的那条绿色挂绳。', image: '/merch/lanyard.svg' },
  ] as MerchProduct[],
  note: {
    label: '关于产品图片',
    body: '以上为即将推出系列的 AI 概念渲染图 — 实际产品与材质或将随投产略有调整。',
  },
  cta: {
    eyebrow: '抢先一步',
    title: '想要',
    titleItalic: '首批系列？',
    body: '登记您的意向，系列抵达前台时我们将第一时间通知您 — 会员享有优先选购与会员价格。',
    primary: '登记意向',
  },
};

export const MERCH: Record<Locale, MerchDict> = { en, zh };
