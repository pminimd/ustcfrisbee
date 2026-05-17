/** 温暖日记风单页：文案与结构（图片文件名与 assets/ 一致） */

export const SITE_TITLE = "USTC校学生极限飞盘协会十周年纪念衫";

export const HERO = {
  kicker: "设计纪实 · 我们一起走过",
  titleLines: ["USTC校学生极限飞盘协会", "十周年纪念衫"],
  lead:
    "如果把那些一起练盘、一起赶路、一起在场上笑到喘不过气的日子，做成一件可以穿在身上的东西——会是什么样子？",
  sub:
    "下面是我们慢慢改出来的过程：不太成熟的初稿、安静的修改，还有最后愿意拿出来给大家看的那版。",
  heroFile: "front_v3.png",
  heroImageAlt: "定稿纪念衫正面效果图",
} as const;

export const STORY_SECTION = {
  eyebrow: "笔记本里的一页",
  title: "针脚背后的故事",
  intro:
    "这件衣服想同时递出两份心意：上场时经得起细看的专业，脱下来后仍然说得清的回忆。",
  dualTheme: {
    label: "设计主张",
    professional: "一份专业",
    memory: "一份回忆",
    bridge: "场上认得出功能，场下读得出我们。",
  },
  footerNote: "—— 这一章，我们还在一起写",
} as const;

export type StoryBlock = {
  id: string;
  heading: string;
  body: string;
  bullets?: readonly string[];
  imageSide: "left" | "right";
  imageAlt: string;
} & (
  | { imageKind: "remote"; image: string }
  | { imageKind: "asset"; file: string }
);

export const STORY_BLOCKS: StoryBlock[] = [
  {
    id: "dual",
    heading: "为什么既要「专业」，也要「回忆」",
    body:
      "纪念衫如果只好看，像海报；如果只像比赛服，又像在办一场必须赢下的订货会。我们希望它既能站上正式赛场，也能在多年后从衣柜里拿出来，仍然一眼知道：那是我们的十年。",
    imageKind: "asset",
    file: "final_version.png",
    imageAlt: "十周年纪念衫定稿整体效果",
    imageSide: "right",
  },
  {
    id: "symbols",
    heading: "穿在身上，能读出的符号",
    body:
      "视觉不是堆满，而是把几样真正属于我们的东西放在一起——让队友靠近时能看懂，让校友远看也能认出。",
    bullets: [
      "队徽：协会身份的第一眼锚点",
      "十周年纪念徽章：把「十年」说清楚，而不是含糊的一句口号",
      "科大经典建筑线稿：把校园记忆缝进衣身，安静、克制，不抢主视觉",
    ],
    imageKind: "asset",
    file: "outline.png",
    imageAlt: "科大经典建筑线稿纹饰",
    imageSide: "left",
  },
  {
    id: "function",
    heading: "四面都有号码：把「能上场」写进结构里",
    body:
      "飞盘服首先是功能装备。我们在四面都保留了号码位与相应的专业布局——不是为了好看而画满，而是让这件衣服在实战里仍然顺手、可辨、可管理。",
    bullets: [
      "前后左右四面均可布置号码信息",
      "布局为场上识别与执裁习惯留出空间",
      "纪念元素与功能分区并行，而不是互相挤占",
    ],
    imageKind: "asset",
    file: "back_v2.png",
    imageAlt: "背面定稿：功能布局与图形关系",
    imageSide: "right",
  },
  {
    id: "memory",
    heading: "回忆落在细节里，而不是口号里",
    body:
      "专业是底线，回忆是温度。线稿、徽章、队徽，还有一起改稿的那些夜晚——它们让这件衣服不只是「十周年周边」，而是「我们确实一起走过」的证据。",
    imageKind: "remote",
    image:
      "https://images.unsplash.com/photo-1529156069898-499463e9bda4?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "队友在暖光下相聚",
    imageSide: "left",
  },
];

export type EvolutionStep = {
  file: string;
  title: string;
  note: string;
};

export type EvolutionChapter = {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  steps: EvolutionStep[];
};

/** 设计演进：正面 → 背面 → 袖子（对应 assets 文件名） */
export const DESIGN_EVOLUTION = {
  sectionEyebrow: "设计演进",
  sectionTitle: "它是怎么一点点长出来的",
  sectionIntro:
    "我们把正面、背面和袖子分开记录——像翻三本小册子，每一本都只讲一件事。",
  chapters: [
    {
      id: "front",
      eyebrow: "正面",
      title: "正面的演进过程",
      intro: "从第一稿的留白，到越来越丰富、越来越像「持续成长」的我们。",
      steps: [
        {
          file: "front_v1.png",
          title: "正面 V1",
          note: "确定十周年纪念徽章放置于袖子外侧，同时保证号码展示的基础功能。",
        },
        {
          file: "front_v2.png",
          title: "正面 V2",
          note: "底部添加科大经典建筑线稿纹饰，让纪念衫开始“呼吸”",
        },
        {
          file: "front_v3.png",
          title: "正面 V3 · 定稿",
          note: "将新版队徽置于胸口，纪念徽章，经典建筑线稿，号码功能各就其位。",
        },
      ],
    },
    {
      id: "back",
      eyebrow: "背面",
      title: "背面的演进过程",
      intro: "背面不必抢戏，但要接得住正面的情绪，远处也要认得出来。",
      steps: [
        {
          file: "back_v1.png",
          title: "背面 V1",
          note: "基础功能：清晰的名字 和 背号。",
        },
        {
          file: "back_v2.png",
          title: "背面 V2 · 定稿",
          note: "回应正面的设计，我们也在背面的底部添加科大经典建筑线稿纹饰",
        },
      ],
    },
    {
      id: "sleeve",
      eyebrow: "袖子",
      title: "袖子 · 定稿",
      intro:
        "袖子是抬手才看见的舞台——定稿里，十周年纪念徽章放在外侧，号码功能也留足了位置。",
      steps: [
        {
          file: "xiuzi_v1.png",
          title: "袖子定稿",
          note: "第一版就是最终正稿：不打扰挥盘动作，抬臂时仍然利落，场边才看得见的那点细节。",
        },
      ],
    },
  ] satisfies EvolutionChapter[],
} as const;

export const EASTER_EGG = {
  eyebrow: "一点小秘密",
  title: "藏在边角的细节",
  teaser:
    "袖口的不对称设计是一个隐秘的彩蛋，是对规训的一种挑战",
  buttonOpen: "轻轻掀开 →",
  buttonClose: "先收回去",
  revealTitle: "折进去的那一页",
  revealBody:
    "还是那套基础线稿，替换了左袖的图案，与右边形成视觉冲突。山本耀司说不对称才是人性——但我们更爱的是：站成一排合照时，所有冲突拼成了有序。是个体的叛逆，也是队伍的默契。",
  sleeveAlt: "定稿袖子细节",
  patternAlt: "纹饰线稿",
  patternFile: "outline.png",
  sleeveFile: "xiuzi_v3.png",
} as const;

export const RESERVATION = {
  eyebrow: "开放预定",
  title: "登记你的纪念衫预定",
  window: "预定期：5 月 18 日 — 5 月 23 日",
  body:
    "纪念衫开放预定。我们将在 6 月 15 日活动现场发放；若无法到场，请填写下方信息表，我们会尽量安排在 6 月 10 日前寄出。",
  note: "提交后数据会同步到协会统计表格，便于核对类别、印字与邮寄。",
  pricingTitle: "价格",
  pricing: [
    { key: "student_member", label: "在校学生（协会成员）", price: 69 },
    { key: "student_non_member", label: "在校学生（非协会成员）", price: 79 },
    { key: "alumni", label: "校友及家属", price: 99 },
    { key: "other_friend", label: "其他朋友", price: 109 },
  ] as const,
  rules: [
    "科大校友、家属及在校同学可预定专属 NickName 与背部号码。",
    "其他朋友预定标准款：00 号 +「Baby」。",
    "希望左臂非对称袖子（科大建筑线稿）的同学，请在表单中勾选对应选项。",
  ] as const,
  form: {
    category: "预定通道",
    categoryRequired: "请选择预定通道",
    asymmetricSleeve: "非对称袖子设计",
    asymmetricSleeveHint: "勾选后采用左臂环绕科大经典建筑线稿的非对称定稿袖子。",
    standardJerseyTitle: "标准款印字",
    standardJerseyBody: "00 号 +「Baby」（其他朋友专属标准款，无需填写下方 NickName 与号码）",
    name: "姓名",
    namePlaceholder: "与证件一致",
    studentId: "学号",
    studentIdOptional: "学号（选填）",
    studentIdPlaceholder: "USTC 学号",
    studentIdAlumniPlaceholder: "校友填本人学号；家属可填关联校友学号或留空",
    phone: "手机号",
    phonePlaceholder: "11 位手机号码",
    size: "衣服尺码",
    sizePlaceholder: "请选择尺码",
    frisbeeNickname: "飞盘 NickName",
    frisbeeNicknamePlaceholder: "印在球衣上的昵称",
    backNumber: "背部号码",
    backNumberPlaceholder: "例如 7、23",
    fulfillment: "领取方式",
    pickup: "6.15 现场领取",
    mail: "邮寄（我们尽量保证 6.10 前送达）",
    mailingAddress: "邮寄地址",
    mailingPlaceholder: "收件人、电话、省市区、详细地址、邮编",
    submit: "提交预定",
    submitting: "提交中…",
    successTitle: "已收到你的预定",
    successBody:
      "感谢填写。我们会按类别与印字信息核对订单，并按你选择的领取方式安排发放或邮寄。如有疑问请联系协会同学。",
    submitAnother: "再填一份",
    configError: "表单服务尚未配置，请联系管理员完成 Google 表格对接。",
    networkError: "提交失败，请检查网络后重试。",
  },
} as const;

export const CLOSING = {
  line: "有些比赛，结束在很多年以前。",
  line2: "但不知怎么，我们身上还都带着一点点它们往前走。",
  signoff: "—— 用心做的，你们的队伍",
  imageFile: "front_v3.png",
  imageAlt: "定稿纪念衫正面",
} as const;
