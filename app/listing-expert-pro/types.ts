export interface ProductData {
  images: string[];
  description: string;
  keywords: string;
  marketplace: string;
  rufusQA: string;
  model: string;
  imageAnalysis?: string;
}

export interface ListingOutput {
  title: string;
  bulletPoints: string[];
  description: string;
  searchTerms: string;
  imagePlanning: string;
  aplusPlanning: string;
}

export enum AppStep {
  INPUT = 1,
  KNOWLEDGE = 2,
  GENERATION = 3
}

export const MARKETPLACES = [
  // Americas
  { label: '美国 (US)', value: 'US' },
  { label: '加拿大 (CA)', value: 'CA' },
  { label: '墨西哥 (MX)', value: 'MX' },
  { label: '巴西 (BR)', value: 'BR' },
  // Europe
  { label: '英国 (UK)', value: 'UK' },
  { label: '德国 (DE)', value: 'DE' },
  { label: '法国 (FR)', value: 'FR' },
  { label: '意大利 (IT)', value: 'IT' },
  { label: '西班牙 (ES)', value: 'ES' },
  { label: '荷兰 (NL)', value: 'NL' },
  { label: '瑞典 (SE)', value: 'SE' },
  { label: '波兰 (PL)', value: 'PL' },
  { label: '比利时 (BE)', value: 'BE' },
  { label: '土耳其 (TR)', value: 'TR' },
  // Asia Pacific
  { label: '日本 (JP)', value: 'JP' },
  { label: '澳大利亚 (AU)', value: 'AU' },
  { label: '新加坡 (SG)', value: 'SG' },
  { label: '印度 (IN)', value: 'IN' },
  // Middle East & Africa
  { label: '阿联酋 (AE)', value: 'AE' },
  { label: '沙特阿拉伯 (SA)', value: 'SA' },
  { label: '埃及 (EG)', value: 'EG' },
  { label: '南非 (ZA)', value: 'ZA' }
];

export const MODELS = [
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3 Pro',
    desc: '深度推理，适合高质量复杂文案',
    recommended: true
  },
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash',
    desc: '响应极速，适合批量基础生成',
    recommended: false
  }
];
