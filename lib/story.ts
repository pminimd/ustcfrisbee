/** 温暖日记风单页：文案与结构（图片文件名与 assets/ 一致） */

export const SITE_TITLE = "USTC校学生极限飞盘协会十周年纪念品";

export const HERO = {
  kicker: "设计纪实 · 我们一起走过",
  titleLines: ["USTC校学生极限飞盘协会", "十周年纪念品"],
  lead:
    "如果把那些一起练盘、一起赶路、一起在场上笑到喘不过气的日子，做成一件可以带在身边的东西——会是什么样子？",
  sub:
    "下面是我们慢慢改出来的过程：不太成熟的初稿、安静的修改，还有最后愿意拿出来给大家看的那版。",
  heroFile: "front_v3.png",
  heroImageAlt: "定稿纪念品正面效果图",
} as const;

export const STORY_SECTION = {
  eyebrow: "笔记本里的一页",
  title: "设计背后的故事",
  intro:
    "这件衣服想同时递出两份心意：上场时经得起细看的专业，脱下来后仍然说得清的回忆。",
  dualTheme: {
    label: "设计主张",
    professional: "一份专业",
    memory: "一份回忆",
    bridge: "场上的功能性，场外的校园回忆。",
  },
  footerNote: "—— 这一章，我们还在一起写",
} as const;

export type StoryImage = {
  file: string;
  alt: string;
};

export type StoryBlock = {
  id: string;
  heading: string;
  body: string;
  bullets?: readonly string[];
  imageSide: "left" | "right";
} & (
  | { imageKind: "remote"; image: string; imageAlt: string }
  | { imageKind: "asset"; images: readonly StoryImage[] }
);

export const STORY_BLOCKS: StoryBlock[] = [
  {
    id: "dual",
    heading: "为什么既要「专业」，也要「回忆」",
    body:
      "我们希望它既能站上正式赛场，也能在多年后从衣柜里拿出来，仍然一眼知道：那是我们的十年。",
    imageKind: "asset",
    images: [{ file: "final_version.png", alt: "十周年纪念衫定稿整体效果" }],
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
    images: [
      { file: "outline.png", alt: "科大经典建筑线稿纹饰" },
      { file: "胸口队徽.JPG", alt: "胸口队徽" },
      { file: "手臂纪念徽章.JPG", alt: "手臂十周年纪念徽章" },
    ],
    imageSide: "left",
  },
  {
    id: "function",
    heading: "四面都有号码：把功能性写进结构里",
    body:
      "我们在四面都保留了号码位与相应的专业布局——不是为了好看而画满，而是让这件衣服在实战里仍可辨、可管理。",
    bullets: [
      "前后左右四面均可布置号码信息",
      "布局为场上识别与执裁习惯留出空间",
      "纪念元素与功能分区并行，而不是互相挤占",
    ],
    imageKind: "asset",
    images: [{ file: "back_v2.png", alt: "背面定稿：功能布局与图形关系" }],
    imageSide: "right",
  },
  {
    id: "memory",
    heading: "回忆落在细节而不是口号",
    body:
      "回忆是温度。线稿、徽章、队徽，还有一起改稿的那些夜晚——它们让所有的纪念品不只是「十周年周边」，而是「我们曾一起走过」。",
    imageKind: "asset",
    images: [{ file: "moments.png", alt: "队友在暖光下相聚" }],
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
  sectionTitle: "它是怎么一点点长大的",
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
        "袖子一定会出现在照片里————定稿里，十周年纪念徽章放在外侧，号码功能也留足了位置。",
      steps: [
        {
          file: "xiuzi_v1.png",
          title: "袖子定稿",
          note: "第一版就是最终正稿：简洁明了。",
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
  sleeveFile: "feiduichen_xiuzi.png",
} as const;

export const RESERVATION_PRODUCTS = [
  {
    key: "suits_white",
    file: "products/suits_white.png",
    label: "白金",
    price: "¥100/件",
    note: "经典白底十周年款",
  },
  {
    key: "suits_black",
    file: "products/suits_black.png",
    label: "黑金",
    price: "¥100/件",
    note: "深色主场气质款",
  },
  {
    key: "suits_white_xiuzi",
    file: "products/suits_white_xiuzi.png",
    label: "白金 · 非对称袖子",
    price: "¥100/件",
    note: "左袖科大线稿彩蛋款",
  },
  {
    key: "frisbee_a",
    file: "products/frisbee_A.PNG",
    label: "纪念飞盘 A款",
    price: "¥69/片",
    note: "十周年飞盘款式一",
  },
  {
    key: "frisbee_b",
    file: "products/frisbee_B.PNG",
    label: "纪念飞盘 B款",
    price: "¥69/片",
    note: "十周年飞盘款式二",
  },
] as const;

export type ReservationProductKey = (typeof RESERVATION_PRODUCTS)[number]["key"];

export const RESERVATION = {
  eyebrow: "开放预定",
  title: "登记你的纪念品预定",
  window: "预定期：5 月 18 日 — 5 月 23 日",
  body:
    "纪念品开放预定。我们将在 6 月 15 日活动现场发放；若无法到场，请勾选下方信息表中的邮寄选项并填写您的收件地址，我们会尽量安排在 6 月 10 日前寄出。",
  note: "提交后数据会同步到协会统计表格，便于核对类别、印字与邮寄。",
  pricingTitle: "折扣优惠",
  pricing: [
    { key: "student_member", label: "在校学生（协会成员）", discount: "7折" },
    { key: "student_non_member", label: "在校学生（非协会成员）", discount: "8折" },
    { key: "alumni", label: "校友及家属", discount: "9折" },
  ] as const,
  /** 预定通道（含无折扣档位，仅用于表单） */
  channels: [
    { key: "student_member", label: "在校学生（协会成员）", discount: "7折" },
    { key: "student_non_member", label: "在校学生（非协会成员）", discount: "8折" },
    { key: "alumni", label: "校友及家属", discount: "9折" },
    { key: "other_friend", label: "其他", discount: null },
  ] as const,
  rules: [
    "科大校友、家属及在校同学可预定专属 NickName 与背部号码。",
  ] as const,
  form: {
    products: "预定可以帮助我们更好地准备纪念品，所有经费将用于提供科大学生更好的飞盘环境",
    productsHint: "可勾选多项",
    productsRequired: "请至少选择一种纪念品",
    category: "预定通道",
    categoryRequired: "请选择预定通道",
    standardJerseyTitle: "标准款印字",
    standardJerseyBody: "00 号 +「Baby」（其他专属标准款，无需填写下方 NickName 与号码）",
    name: "姓名",
    namePlaceholder: "与证件一致",
    studentId: "学号",
    studentIdOptional: "学号（选填）",
    studentIdPlaceholder: "USTC 学号",
    studentIdAlumniPlaceholder: "校友填本人学号；家属可填关联校友学号或留空",
    phone: "手机号",
    phonePlaceholder: "11 位手机号码",
    email: "邮箱",
    emailPlaceholder: "用于订单确认与联系",
    size: "衣服尺码",
    sizePlaceholder: "请选择尺码",
    sizeRequired: "请选择衣服尺码",
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
  imageAlt: "定稿纪念品正面",
} as const;
