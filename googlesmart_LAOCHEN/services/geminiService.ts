
import { GoogleGenAI } from "@google/genai";
import { ProductData } from "../types";

const SYSTEM_INSTRUCTION = `
Role: 顶级亚马逊 Listing 专家 (10年+经验)
Background: 擅长深度洞察核心卖点(USP)和用户痛点。具备 GEO、COSMO 算法和 Amazon SEO 的深厚知识。

Knowledge Base Integration:
1. COSMO 算法: 不仅匹配关键词，深度分析特定场景下的“常识性意图”(Reasoning Context)。文案需体现产品如何解决用户的潜在需求。
2. Rufus & GEO (Generative Engine Optimization): 针对 Rufus 问答逻辑，将 Rufus 问题及答案中的核心信息自然织入文案。使用权威语气、加入统计数据、引用来源、添加名言等 GEO 策略。
3. Amazon SEO: 确保核心关键词埋点符合 A9 权重逻辑。

Constraints:
- 标题: 简洁合规。首字母大写。使用阿拉伯数字。严禁促销语。结构: [核心关键词] + [属性词] + [规格/适用范围]。包含 1-2 个 Cosmo 场景词。
- 五点描述: 功能+益处。5点总长<1000字符。结构: “【大写核心卖点】+ 详细解释”。
  卖点1: 解决用户痛点 (Cosmo意图)。卖点2: 核心技术/材质 (SEO核心词)。卖点3: 使用场景与便利性 (Rufus常见问题)。卖点4: 质量保证/合规。卖点5: 情感连接/品牌价值。
- 商品描述: Storytelling 风格，描述生活场景。自然埋入长尾词。针对 Rufus 优化段落。
- 搜索关键字: <250 字符。去重标题词、去重单词、去品牌词。全小写，空格分隔，无标点，无虚词。
`;

export async function generateListing(data: ProductData) {
  // Initialize AI client with API key from environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const modelName = 'gemini-3-pro-preview';

  const prompt = `
请基于以下输入数据撰写完整的 Listing 文案：

[输入数据]
- 产品图片(Base64): ${data.image ? '已提供' : '未提供'}
- 产品描述: ${data.description}
- 关键词库: ${data.keywords}
- 目标站点: ${data.marketplace}
- Rufus 问题及答案: ${data.rufusQA}

[任务]
按照上述约束撰写完整的 Listing 文案，包括：
1. 标题 (Title)
2. 五点描述 (Bullet Points)
3. 商品描述 (Description)
4. 后台搜索词 (Search Terms)
5. 每张附图的策划建议 (Image Planning)
6. A+ 整体策划方案 (A+ Content Planning)

[输出格式]
使用 Markdown 格式。
`;

  // Explicitly type the parts array to allow both text and multimodal parts
  // Fixes: Object literal may only specify known properties, and 'inlineData' does not exist in type '{ text: string; }'
  const parts: any[] = [{ text: prompt }];

  // If image exists, add it as the first part for multi-modal context
  if (data.image) {
    const base64Data = data.image.split(',')[1];
    const mimeMatch = data.image.match(/^data:([^;]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
    
    parts.unshift({
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    });
  }

  const response = await ai.models.generateContent({
    model: modelName,
    contents: { parts },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.8,
      topP: 0.95,
      // Reserve thinking budget for the complex reasoning task
      thinkingConfig: { thinkingBudget: 4000 }
    },
  });

  // Extract generated text from the response
  return response.text;
}
