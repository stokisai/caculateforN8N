export interface ProductInfo {
    targetCountry: string;
    description: string;
    images: string[]; // Base64 strings
}

export interface KeywordItem {
    [key: string]: any; // Allows keeping original Excel data
    keyword: string;
    analysisCategory?: string;
    analysisDetail?: string;
    isDeleted?: boolean;
}

export interface AnalysisResult {
    keyword: string;
    status: 'passed' | 'removed';
    category: string;
    detail: string;
}

export interface BatchProcessingState {
    current: number;
    total: number;
    isProcessing: boolean;
}

export enum AnalysisLayer {
    LEGAL = '法律与合规过滤',
    FACTUAL = '事实与属性核对',
    SEO = 'SEO强相关筛选'
}
