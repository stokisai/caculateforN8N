
export interface ProductData {
  image?: string;
  description: string;
  keywords: string;
  marketplace: string;
  rufusQA: string;
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
  { label: '美国 (US)', value: 'US' },
  { label: '英国 (UK)', value: 'UK' },
  { label: '德国 (DE)', value: 'DE' },
  { label: '日本 (JP)', value: 'JP' },
  { label: '法国 (FR)', value: 'FR' },
  { label: '意大利 (IT)', value: 'IT' },
  { label: '西班牙 (ES)', value: 'ES' },
  { label: '加拿大 (CA)', value: 'CA' },
  { label: '澳大利亚 (AU)', value: 'AU' }
];
