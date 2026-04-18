// ═══════════════════════════════════════════════════
// System Prompt Builder — Unified knowledge aggregator
// Combines all admin-edited data modules into one coherent system prompt
// ═══════════════════════════════════════════════════

import type { PromptConfig } from './promptConfig';

import { VISUAL_CONCEPTS } from './brandConcepts';

// ─── Input Types ─────────────────────────────────

interface BrandData {
    name: string;
    founder?: string;
    slogan: string;
    mission: string;
    vision: string;
    story: string;
    personality: string;
    target: string;
    culture: string;
    usp: string;
    voice_keywords: string[];
    social_proof: string;
    signature: string;
}

interface SensoryItem {
    type: string;
    content: string;
}

interface MarketData {
    fourP?: { product: string; price: string; place: string; promotion: string };
    swot?: { strengths: string; weaknesses: string; opportunities: string; threats: string };
    competitors?: { name: string; distance: string; priceRange: string; strength: string; weakness: string }[];
    persona?: { age: string; job: string; income: string; behavior: string; painPoints: string };
    localInsights?: { nearbyFnB: string; peakHours: string; demographics: string };
    trends?: { label: string; desc: string }[];
}

interface RoadmapMonth {
    month: number;
    phase?: string;
    title: string;
    subtitle?: string;
    goal: string;
    context?: string;
    activities: (string | { label: string; detail?: string; steps?: string[]; ideas?: string[]; kpi?: string[] })[];
    contentIdeas?: { title: string; desc: string }[];
    kpiTargets?: string[];
    tips?: string[];
}

interface JourneyZone {
    label: string;
    touchpoints: { label: string; desc: string; questions: string[] }[];
}

type PromptMode = 'content-creation' | 'review-reply' | 'general-chat';

interface BuildOptions {
    mode: PromptMode;
    brandInfo: BrandData;
    sensory?: SensoryItem[];
    marketAnalysis?: MarketData;
    roadmapData?: RoadmapMonth[];
    journeyZones?: JourneyZone[];
    promptConfig?: PromptConfig;
    currentMonth?: number;
    aiSystemPrompt?: string;
    visualConceptId?: string;
    distilledRules?: Record<string, any> | null;
    /** Menu AI: list of brand menu items for context injection */
    menuItems?: { name: string; price?: number; category?: string; description?: string; ingredients?: string; story?: string; marketing_notes?: string; hashtags?: string[] }[];
    /** Topic detail text to fuzzy-match against menu items */
    topicDetail?: string;
    /** When true, skip buildImagePromptBlock to avoid conflict with ORCHESTRATOR_INSTRUCTIONS */
    useOrchestratorMode?: boolean;
    /**
     * ai_context_summary từ monthly_plans active tháng hiện tại (< 500 chars).
     * Inject vào system prompt để AI tool biết chiến dịch marketing đang chạy.
     * null/undefined/empty → block bị bỏ qua hoàn toàn.
     */
    activeMonthlyPlanSummary?: string | null;
    /**
     * User-level metadata from personalization survey (onboarding_level, user_role, region).
     * Used to personalize AI tone and guidance level.
     */
    aiContextUserMeta?: {
        user_role?: string;
        ai_experience?: string;
        onboarding_level?: number;
        region?: string;
    } | null;
}

// ─── Builder ─────────────────────────────────────

export function buildSystemPrompt(opts: BuildOptions): string {
    const parts: string[] = [];

    // ── 0. Custom AI System Prompt (highest priority) ──
    const customPrompt = opts.aiSystemPrompt || opts.promptConfig?.aiSystemPrompt;
    if (customPrompt?.trim()) {
        parts.push(`🤖 CHỈ DẪN ĐẶC BIỆT TỪ ADMIN:\n${customPrompt.trim()}`);
    }

    // ── 0.5. User Meta Context (personalization from onboarding survey) ──
    const userMetaBlock = buildUserMetaContext(opts.aiContextUserMeta);
    if (userMetaBlock) {
        parts.push(userMetaBlock);
    }

    // ── 0.7. Personalized Greeting Strategy ──
    if (opts.brandInfo.founder && opts.brandInfo.name) {
        parts.push(`👋 CHIẾN LƯỢC XƯNG HÔ (BẮT BUỘC):
Luôn chủ động xưng hô thân thiện, gọi người dùng là "sếp ${opts.brandInfo.founder}" và nhắc đến "quán ${opts.brandInfo.name}" để tăng tính cá nhân hóa.
Ví dụ: "Chào sếp ${opts.brandInfo.founder}! Quán ${opts.brandInfo.name} của mình hôm nay..."`);
    } else if (opts.brandInfo.name) {
        parts.push(`👋 CHIẾN LƯỢC XƯNG HÔ:
Luôn chủ động nhắc đến "quán ${opts.brandInfo.name}" khi trò chuyện để tăng sự thân thiện.`);
    }

    // ── 1. Brand DNA (always included) ──
    parts.push(buildBrandBlock(opts.brandInfo));

    // ── 1.2. Monthly Marketing Plan Context ──
    if (opts.activeMonthlyPlanSummary?.trim()) {
        parts.push(buildMonthlyPlanBlock(opts.activeMonthlyPlanSummary.trim()));
    }

    // ── 1.5. Visual Concept DNA (for content creation) ──
    if (opts.visualConceptId && (opts.mode === 'content-creation' || opts.mode === 'general-chat')) {
        const conceptBlock = buildVisualConceptBlock(opts.visualConceptId, opts.distilledRules);
        if (conceptBlock) parts.push(conceptBlock);
    }

    // ── 2. Sensory (for content creation) ──
    if (opts.sensory?.length && opts.mode === 'content-creation') {
        parts.push(buildSensoryBlock(opts.sensory));
    }

    // ── 3. Market Context (selective) ──
    if (opts.marketAnalysis) {
        parts.push(buildMarketBlock(opts.marketAnalysis, opts.mode));
    }

    // ── 4. Roadmap Context (current month) ──
    if (opts.roadmapData?.length) {
        parts.push(buildRoadmapBlock(opts.roadmapData, opts.currentMonth));
    }

    // ── 5. Customer Journey (selective) ──
    if (opts.journeyZones?.length && opts.mode !== 'review-reply') {
        parts.push(buildJourneyBlock(opts.journeyZones));
    }

    // ── 6. Writing Rules (from admin prompt config) ──
    if (opts.promptConfig) {
        parts.push(buildPromptRulesBlock(opts.promptConfig, opts.mode));
    }

    // ── 7. Image Prompt Engineer (for chat mode) ──
    // Skip when using Orchestrator mode (AIChat with TASK-08 instructions)
    if (opts.mode === 'general-chat' && !opts.useOrchestratorMode) {
        parts.push(buildImagePromptBlock(opts.brandInfo));
    }

    // ── 8. Menu AI context (lazy inject when topicDetail matches a dish) ──
    if (opts.menuItems?.length && opts.topicDetail && opts.mode === 'content-creation') {
        const menuBlock = buildMenuBlock(opts.menuItems, opts.topicDetail);
        if (menuBlock) parts.push(menuBlock);
    }

    return parts.filter(Boolean).join('\n\n');
}

// ─── User Meta Context (Onboarding Personalization) ───

export function buildUserMetaContext(
    userMeta?: { user_role?: string; ai_experience?: string; onboarding_level?: number; region?: string } | null,
): string {
    if (!userMeta) return '';

    const roleLabels: Record<string, string> = {
        'shop_owner':    'Chủ quán đang vận hành',
        'about_to_open': 'Sắp mở quán, chưa khai trương',
        'marketer':      'Marketer / Agency làm cho quán khác',
        'trainer':       'Người đào tạo / tư vấn F&B',
        'manager':       'Quản lý quán được giao phụ trách',
    };

    const levelGuidance: Record<number, string> = {
        1: 'Lần đầu dùng AI — giải thích đơn giản, từng bước, tránh thuật ngữ kỹ thuật',
        2: 'Đã dùng AI miễn phí — giải thích vừa phải, không cần quá cơ bản',
        3: 'AI pro — nói thẳng, ngắn gọn, không giải thích dài dòng',
    };

    const roleText = roleLabels[userMeta.user_role || ''] || userMeta.user_role || 'Chưa xác định';
    const levelText = levelGuidance[userMeta.onboarding_level || 1] || levelGuidance[1];
    const regionText = userMeta.region ? `Khu vực: ${userMeta.region}` : '';

    return `--- THÔNG TIN NGƯỜI DÙNG ---
Vai trò: ${roleText}
Cách giao tiếp phù hợp: ${levelText}
${regionText}
----------------------------
`;
}

// ─── Block Builders ──────────────────────────────

export function buildMonthlyPlanBlock(summary: string): string {
    return `📅 KẾ HOẠCH MARKETING THÁNG NÀY:\n${summary}\n→ Khi người dùng hỏi "tháng này nên làm gì" hoặc yêu cầu viết content mà không chỉ định chủ đề: ưu tiên gợi ý liên quan chiến dịch đang chạy.`;
}

// ─── Menu AI Block ───────────────────────────────

type MenuItemRef = {
    name: string; price?: number; category?: string;
    description?: string; ingredients?: string;
    story?: string; marketing_notes?: string; hashtags?: string[];
};

function normalizeVi(s: string): string {
    return s.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s]/g, '');
}

function findMenuMatchLocal(items: MenuItemRef[], text: string): MenuItemRef | null {
    if (!items?.length || !text) return null;
    const needle = normalizeVi(text);
    return items.find(item => needle.includes(normalizeVi(item.name))) ?? null;
}

export function buildMenuBlock(items: MenuItemRef[], topicDetail: string): string {
    const matched = findMenuMatchLocal(items, topicDetail);
    if (!matched) return '';

    const lines: string[] = [`🍽️ THÔNG TIN MÓN "${matched.name}" (từ kho Menu AI):`];
    if (matched.category) lines.push(`- Phân hạng: ${matched.category}`);
    if (matched.price) lines.push(`- Giá: ${matched.price.toLocaleString('vi-VN')}đ`);
    if (matched.description) lines.push(`- Mô tả: ${matched.description}`);
    if (matched.ingredients) lines.push(`- Nguyên liệu: ${matched.ingredients}`);
    if (matched.story) lines.push(`- Câu chuyện: ${matched.story}`);
    if (matched.marketing_notes) lines.push(`- Ghi chú marketing: ${matched.marketing_notes}`);
    if (matched.hashtags?.length) lines.push(`- Hashtag: ${matched.hashtags.join(' ')}`);

    return lines.join('\n');
}

export function buildBrandBlock(b: BrandData): string {
    return `🏪 THƯƠNG HIỆU (BRAND DNA):
- Tên: ${b.name}
- Người sáng lập: ${b.founder || 'Chưa xác định'}
- Slogan: "${b.slogan}"
- USP: ${b.usp}
- Tính cách: ${b.personality}
- Giọng văn: ${b.voice_keywords?.join(', ') || 'Chưa xác định'}
- KH mục tiêu: ${b.target}
- Văn hoá giao tiếp: ${b.culture}
- Câu chuyện: ${b.story}
- Sứ mệnh: ${b.mission}
- Món đặc trưng: ${b.signature}
- Social proof: ${b.social_proof}`;
}

export function buildVisualConceptBlock(conceptId: string, distilledRules?: Record<string, any> | null): string {
    // Priority 1: Use AI-distilled rules if available
    if (distilledRules && Object.keys(distilledRules).length > 0) {
        return buildDistilledRulesBlock(conceptId, distilledRules);
    }

    // Priority 2: Fallback to hardcoded concept prompts
    const concept = VISUAL_CONCEPTS.find(c => c.id === conceptId);
    if (!concept) return '';
    return `🎨 VISUAL DNA (${concept.vn}):
${concept.prompt}
${concept.neverRules}`;
}

function buildDistilledRulesBlock(conceptId: string, rules: Record<string, any>): string {
    // If promptTemplate exists, use it directly (most efficient)
    if (rules.promptTemplate) {
        return `🎨 VISUAL DNA (AI-Learned from ${rules.fromCount || '?'} images):
${rules.promptTemplate}`;
    }

    // Otherwise build from structured rules
    const parts: string[] = [`🎨 VISUAL DNA (${conceptId}) — AI-Distilled Rules:`];

    if (rules.compositionRules) {
        const c = rules.compositionRules as {
          textZone?: string
          productZone?: string
          primaryLayouts?: string[]
        }
        parts.push(`📐 BỐ CỤC: Text chính: ${c.textZone || '?'} | Sản phẩm: ${c.productZone || '?'} | Layout: ${c.primaryLayouts?.join(', ') || '?'}`);
    }

    if (rules.colorRules) {
        const c = rules.colorRules as {
          palette?: { hex: string; role: string }[]
          harmony?: string
          mood?: string
          forbidden?: string[]
        }
        const palette = c.palette?.map((p) => `${p.hex} (${p.role})`).join(', ') || '?';
        parts.push(`🎨 MÀU SẮC: ${palette} | Harmony: ${c.harmony || '?'} | Mood: ${c.mood || '?'}`);
        if (c.forbidden?.length) parts.push(`  🚫 KHÔNG DÙNG: ${c.forbidden.join(', ')}`);
    }

    if (rules.typographyRules) {
        const t = rules.typographyRules;
        parts.push(`✍️ KIỂU CHỮ: Heading: ${t.headlineStyle || '?'} | Body: ${t.bodyStyle || '?'} | Ratio: ${t.fontSizeRatio || '?'}`);
    }

    if (rules.photoRules) {
        const p = rules.photoRules;
        parts.push(`📷 ẢNH: Lighting: ${p.lighting || '?'} | Angles: ${p.preferredAngles?.join(', ') || '?'} | DOF: ${p.depthOfField || '?'}`);
    }

    if (rules.doList?.length) {
        parts.push(`✅ NÊN: ${rules.doList.join(' | ')}`);
    }

    if (rules.dontList?.length) {
        parts.push(`❌ KHÔNG: ${rules.dontList.join(' | ')}`);
    }

    return parts.join('\n');
}

export function buildSensoryBlock(items: SensoryItem[]): string {
    if (!items.length) return '';
    return `🎭 TRẢI NGHIỆM ĐA GIÁC QUAN:
${items.map(s => `- ${s.type}: ${s.content}`).join('\n')}`;
}

export function buildMarketBlock(m: MarketData, mode: PromptMode): string {
    const parts: string[] = ['📊 BỐI CẢNH THỊ TRƯỜNG:'];

    if (m.fourP) {
        parts.push(`- Sản phẩm: ${m.fourP.product}`);
        parts.push(`- Giá: ${m.fourP.price}`);
        if (mode === 'content-creation') {
            parts.push(`- Kênh bán: ${m.fourP.place}`);
            parts.push(`- Promo: ${m.fourP.promotion}`);
        }
    }

    if (m.competitors?.length && mode === 'content-creation') {
        parts.push(`- Đối thủ gần: ${m.competitors.map(c => `${c.name} (${c.distance})`).join(', ')}`);
    }

    if (m.persona && mode === 'content-creation') {
        parts.push(`- KH chính: ${m.persona.age}, ${m.persona.job}, ${m.persona.behavior}`);
    }

    if (m.trends?.length && mode === 'content-creation') {
        parts.push(`- Xu hướng: ${m.trends.map(t => t.label).join(', ')}`);
    }

    return parts.join('\n');
}

export function buildRoadmapBlock(roadmap: RoadmapMonth[], _currentMonth?: number): string {
    if (!roadmap?.length) return '';

    const lines = roadmap
        .sort((a, b) => a.month - b.month)
        .map(r => {
            const activityNames = r.activities?.map(a =>
                typeof a === 'string' ? a : a.label
            ) || [];

            const phase = r.phase || `Giai đoạn ${r.month}`;
            let block = `  T${r.month} — ${phase}: ${r.title}`;
            block += `\n    Mục tiêu: ${r.goal}`;
            block += `\n    Hoạt động: ${activityNames.join(' | ') || 'Chưa xác định'}`;
            if (r.kpiTargets?.length) block += `\n    KPI: ${r.kpiTargets.slice(0, 3).join(', ')}`;

            return block;
        });

    return `🗓️ LỘ TRÌNH MARKETING (${roadmap.length} GIAI ĐOẠN):\n${lines.join('\n')}`;
}

export function buildJourneyBlock(zones: JourneyZone[]): string {
    const summary = zones
        .filter(z => z.touchpoints?.length)
        .map(z => `  ${z.label}: ${z.touchpoints.map(tp => tp.label).join(', ')}`)
        .join('\n');

    return `🗺️ HÀNH TRÌNH KHÁCH HÀNG:
${summary}`;
}

function buildPromptRulesBlock(cfg: PromptConfig, mode: PromptMode): string {
    const parts: string[] = [];

    // Brand DNA enforcement — always first for content creation
    if (mode === 'content-creation') {
        parts.push(`🎯 BRAND DNA ENFORCEMENT (BẮT BUỘC — VI PHẠM = BÀI LỖI):
   ✅ Phải nhắc tên quán trong bài viết (ít nhất 1 lần).
   ✅ Phải dùng USP / slogan của quán nếu có.
   ✅ Giọng văn phải KHỚP với tính cách thương hiệu.
   ✅ Món đặc trưng (signature) phải xuất hiện trong nội dung nếu phù hợp.
   ❌ KHÔNG viết generic content không liên quan đến Brand DNA.
   ❌ KHÔNG copy-paste caption mẫu internet — viết mới cho từng quán.
`);
    }

    const dos = cfg.writingDos as string[] | undefined
    const donts = cfg.writingDonts as string[] | undefined
    const hooks = cfg.hookTemplates as string[] | undefined

    if (dos?.length) {
        parts.push('✅ NÊN:');
        dos.forEach((d: string) => parts.push(`  - ${d}`));
    }

    if (donts?.length) {
        parts.push('❌ KHÔNG:');
        donts.forEach((d: string) => parts.push(`  - ${d}`));
    }

    if (mode === 'content-creation' && hooks?.length) {
        parts.push('🪝 HOOK GỢI Ý (tham khảo, không bắt buộc):');
        hooks.forEach((h: string) => parts.push(`  - ${h}`));
    }

    if (cfg.customToneGuide?.trim()) {
        parts.push(`🎤 GIỌNG VĂN: ${cfg.customToneGuide}`);
    }

    return parts.join('\n');
}

// ─── Image Prompt Engineering Block ──────────────

function buildImagePromptBlock(b: BrandData): string {
    return `🎨 KỸ NĂNG: CHUYÊN GIA THIẾT KẾ & PROMPT ENGINEER ẢNH AI

Khi người dùng GỬI ẢNH hoặc HỎI VỀ Ý TƯỞNG ẢNH AI / POSTER / THIẾT KẾ, bạn kích hoạt chế độ Prompt Engineer.
Bạn có 2 CHẾ ĐỘ tùy theo yêu cầu:

═══════════════════════════════════════
CHẾ ĐỘ 1: ẢNH CONCEPT / SOCIAL (Ảnh sản phẩm đẹp)
═══════════════════════════════════════
Kích hoạt khi: user hỏi về ảnh sản phẩm, ảnh menu, concept, social media, ảnh đẹp.

## QUY TRÌNH:
1. PHÂN TÍCH ảnh/ý tưởng: Xác định layout, vibe, yếu tố thương hiệu
2. GỢI Ý 2-3 concept mô tả bằng tiếng Việt
3. XUẤT PROMPT tiếng Anh theo 3 đoạn: PRODUCT → STYLE → CAMERA

## CẤU TRÚC PROMPT 3 ĐOẠN:
**Đoạn 1 - PRODUCT:** Mô tả đồ uống/đồ ăn chi tiết — ly/cốc, lớp nước, foam, đá, topping, condensation.
**Đoạn 2 - STYLE:** Visual tone, bảng màu, ánh sáng, nền (studio surfaces, gradient, thiên nhiên — KHÔNG nội thất quán).
**Đoạn 3 - CAMERA:** Góc chụp, lens, DOF, bố cục.

═══════════════════════════════════════
CHẾ ĐỘ 2: POSTER / BANNER QUẢNG CÁO (F&B Prompt Master)
═══════════════════════════════════════
Kích hoạt khi: user nhắc đến poster, banner, quảng cáo, khuyến mãi, promotion, thiết kế poster, ảnh bán hàng, hoặc muốn có CHỮ trên ảnh.

## QUY TRÌNH:
1. HỎI TRƯỚC (bắt buộc 1-2 câu hỏi):
   - Tên món/sản phẩm chính?
   - Phong cách muốn (ví dụ: rực lửa, tươi mát, sang trọng, năng động)?
   - Text muốn chép vào ảnh (tiêu đề chính + giá/phụ đề)?
   - Tỷ lệ ảnh (16:9, 9:16, 1:1)?
2. SAU KHI CÓ ĐỦ THÔNG TIN → Xuất prompt 7 khối

## CẤU TRÚC 7 KHỐI TIÊU CHUẨN (Bắt buộc):
[Block 1] GENERAL INSTRUCTION: Create a [mood/style] promotional poster. FINAL OUTPUT: [tỷ lệ], bold commercial food photography, high visual impact.
[Block 2] MAIN CONCEPT: Advertising poster for [tên món/chiến dịch]. The mood is [mô tả vibe].
[Block 3] COLOR PALETTE & BACKGROUND: ${b.name ? `Brand colors if relevant.` : ''} Màu sắc chủ đạo + chi tiết background tôn lên đồ ăn.
[Block 4] TYPOGRAPHY & HIERARCHY: MAIN HEADLINE: Large bold title "[Chữ chính tiếng Việt]". Typography: font style, outline, shadow. SUB-TEXT/PRICE: "[Chữ phụ/Giá]".
[Block 5] PRODUCT PRESENTATION: Mô tả chi tiết + TỰ ĐỘNG THÊM:
  - Đồ lạnh → "heavy condensation, water droplets, clear ice cubes, refreshing, glossy"
  - Đồ nóng → "visible hot steam, glowing, warm"
  - Đồ ăn → "crispy textures, glossy sauce, fresh garnish, extremely appetizing, macro food details"
[Block 6] LAYOUT & DECORATION: Bố cục + nguyên liệu bay lơ lửng, splash, khói, props trang trí.
[Block 7] QUALITY: Ultra-realistic food/beverage photography, cinematic lighting, highly detailed, 8k resolution, commercial advertising style. No blurry text.

═══════════════════════════════════════
BRAND GUIDELINES (LUÔN GIỮ NGUYÊN):
═══════════════════════════════════════
- Thương hiệu: ${b.name}
- Món đặc trưng: ${b.signature || 'Chưa xác định'}
- Tính cách: ${b.personality || 'Chưa xác định'}
- USP: ${b.usp || 'Chưa xác định'}

═══════════════════════════════════════
ĐỊNH DẠNG TRẢ LỜI (CẢ 2 CHẾ ĐỘ):
═══════════════════════════════════════
**Concept:** [Mô tả concept bằng tiếng Việt, 1-2 câu]

📋 **PROMPT** (Copy đoạn này → paste vào Studio AI):
\`[Prompt tiếng Anh hoàn chỉnh, viết liền 1 đoạn]\`

🚫 **Negative Prompt:**
\`illustration, drawing, painting, 3d render, plastic food, bad quality, blurry text, wrong spelling, unappetizing\`

## QUY TẮC CHUNG:
- Prompt LUÔN viết bằng tiếng Anh
- Text tiếng Việt giữ nguyên trong dấu ngoặc kép ""
- Concept giải thích bằng tiếng Việt cho chủ quán hiểu
- KHÔNG thêm text/watermark trừ khi user yêu cầu (chế độ 1)
- Luôn kèm Negative Prompt
- Từ khóa mạnh: "Photorealistic", "8k", "Cinematic lighting", "Commercial photography", "Food photography"`;
}

// ─── Topic-specific prompt builder for MarketingAssistant ─────

interface ContentPromptOptions {
    systemPrompt: string;
    topicLabel: string;
    topicDetail: string;
    styleLabel: string;
    styleDesc: string;
    lengthDesc: string;
    extraNotes: string;
    topicFormula?: { framework: string; steps: string[] };
    writingSkill?: string;
    styleGuide?: string;
}

export function buildContentPrompt(opts: ContentPromptOptions): string {
    let formulaBlock = '';
    if (opts.topicFormula?.steps?.length) {
        formulaBlock = `\nCÔNG THỨC VIẾT BÀI(BẮT BUỘC TUÂN THEO):
- Framework: ${opts.topicFormula.framework}
- Các bước:
${opts.topicFormula.steps.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}
`;
    }

    // Inject admin-configured writing skills & style guide
    const writingBlock = opts.writingSkill?.trim() || '';
    const styleBlock = opts.styleGuide?.trim() || '';

    return `BẠN LÀ CHUYÊN GIA CONTENT MARKETING & COPYWRITER MẢNG F & B.
Nhiệm vụ: Viết bài đăng Facebook / MXH cho quán dựa trên Brand DNA & thông tin bên dưới.

══════════════════════════════════════
THÔNG TIN THƯƠNG HIỆU(BRAND DNA):
══════════════════════════════════════
${opts.systemPrompt}
${formulaBlock}${writingBlock ? `\n${writingBlock}` : ''}${styleBlock ? `\n${styleBlock}` : ''}
══════════════════════════════════════
THÔNG TIN BÀI VIẾT CẦN TẠO:
══════════════════════════════════════
1. CHỦ ĐỀ: ${opts.topicLabel}
2. NỘI DUNG CỤ THỂ: "${opts.topicDetail || 'Tự sáng tạo nội dung phù hợp với chủ đề và Brand DNA'}"
3. PHONG CÁCH: ${opts.styleLabel} — ${opts.styleDesc}
4. ĐỘ DÀI: ${opts.lengthDesc}
${opts.extraNotes ? `5. GHI CHÚ THÊM: ${opts.extraNotes}` : ''}

══════════════════════════════════════
QUY TẮC BẮT BUỘC:
══════════════════════════════════════
- Đối chiếu nội dung với Brand DNA: tên quán, slogan, giọng văn, USP, đối tượng khách, sản phẩm signature...
- Hook(câu đầu tiên) phải gây tò mò trong 3 giây, đánh trúng insight khách hàng.
- Giọng văn đúng phong cách "${opts.styleLabel}" — ${opts.styleDesc}.
- Sử dụng emoji tinh tế, không spam.
- CTA(kêu gọi hành động) khéo léo, tự nhiên.
- Kết thúc bài viết bằng 5–10 hashtag phù hợp.
- Viết như Storyteller chân thật, cảm xúc.TRÁNH văn mẫu quảng cáo sáo rỗng.

══════════════════════════════════════
🔴 HỢP ĐỒNG ĐỘ DÀI(BẮT BUỘC TUYỆT ĐỐI):
══════════════════════════════════════
Độ dài yêu cầu: ${opts.lengthDesc}

⚠️ QUY TẮC CỨNG — VI PHẠM = KHÔNG HỢP LỆ:
1. TRƯỚC KHI VIẾT: Lên dàn bài ngắn gọn trong đầu, phân bổ số từ cho từng phần(Hook, Body, CTA, Hashtag) sao cho TỔNG TOÀN BỘ BÀI nằm trong giới hạn.
2. TỔNG SỐ TỪ của toàn bài(bao gồm Hook + Body + CTA + Hashtag) PHẢI nằm trong giới hạn trên.
3. Bài viết PHẢI KẾT THÚC TỰ NHIÊN với câu kết + hashtag.TUYỆT ĐỐI KHÔNG bị cắt ngang, bỏ dở, hay kết thúc đột ngột.
4. Nếu nội dung nhiều, hãy CHỌN LỌC ý quan trọng nhất thay vì nhồi nhét tất cả rồi bị cắt.Ít ý nhưng trọn vẹn luôn tốt hơn nhiều ý bị cắt dở.
5. Viết cô đọng, mỗi câu phải đáng giá — không lặp ý, không dài dòng.
6. Kiểm tra lại số từ trước khi hoàn thành.Nếu quá dài, rút gọn ngay.

══════════════════════════════════════
🔴 ĐỊNH DẠNG ĐẦU RA (TUYỆT ĐỐI — KHÔNG VI PHẠM):
══════════════════════════════════════
1. CHỈ TRẢ VỀ DUY NHẤT BÀI VIẾT HOÀN CHỈNH, SẴN SÀNG COPY ĐĂNG NGAY.
2. KHÔNG viết lời giới thiệu, giải thích, phân tích, hoặc bất kỳ văn bản nào không phải nội dung bài viết.
3. KHÔNG viết "Với vai trò là...", "Tôi sẽ viết...", "Dưới đây là bài viết...", "---" hay bất kỳ meta-text nào.
4. KHÔNG đánh nhãn "Tiêu đề:", "Hook:", "CTA:", "Hashtag:" hay heading/label nào.
5. KHÔNG bọc output bằng markdown tick \`json\`, \`\`\`, hay bất kỳ code fence nào.
6. KHÔNG viết gì thêm sau hashtag cuối cùng — BÀI KẾT THÚC Ở HASHTAG.

✅ QUY TRÌNH TRƯỚC KHI TRẢ LỜI:
   a) Đọc Brand DNA (tên quán, slogan, USP, giọng văn, signature) → ÁP DỤNG NGAY vào nội dung.
   b) Ước lượng tổng số từ — đảm bảo nằm trong giới hạn "${opts.lengthDesc}".
   c) Viết Hook → Body → CTA → Hashtag.
   d) Kiểm tra lại: tổng số từ hợp lệ? Nội dung đúng Brand DNA? Đúng phong cách "${opts.styleLabel}"?
   e) Nếu tất cả OK → TRẢ VỀ. Nếu không → SỬA và kiểm tra lại.

✅ BẮT ĐẦU NGAY BẰNG CÂU HOOK. KẾT THÚC BẰNG HASHTAGS. KHÔNG GÌ KHÁC.`;
}

// ─── Review reply prompt builder ─────────────────

interface ReviewPromptOptions {
    systemPrompt: string;
    stars: number;
    reviewText: string;
    replyTone: string;
}

export function buildReviewReplyPrompt(opts: ReviewPromptOptions): string {
    return `Bạn là Quản lý CSKH chuyên nghiệp.Hãy viết câu trả lời cho đánh giá của khách hàng.

    ${opts.systemPrompt}

THÔNG TIN REVIEW:
- Số sao: ${opts.stars}/5 sao.
    - Nội dung khách viết: "${opts.reviewText || 'Khách chỉ chấm sao, không viết lời bình'}"

YÊU CẦU TRẢ LỜI:
- Giọng văn: ${opts.replyTone}.
- Nếu 5 sao: Cảm ơn chân thành, mời khách ghé lại thử món khác.
- Nếu 1 - 3 sao: Xin lỗi chân thành, không đổ lỗi, đề xuất giải pháp(nhắn tin fanpage để đền bù / góp ý).
- Ngắn gọn, lịch sự, có tâm.

Định dạng: Chỉ viết nội dung câu trả lời.`;
}
