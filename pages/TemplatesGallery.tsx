
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  ShoppingBag, Building, Video, Megaphone, 
  Briefcase, Shirt, User, TrendingUp, Copy, Check, LayoutTemplate, Star 
} from 'lucide-react';

type Category = 'ecommerce' | 'architecture' | 'ugc' | 'brand' | 'business' | 'fashion' | 'personal' | 'viral';

interface Template {
  id: string;
  titleEn: string;
  titleAr: string;
  category: Category;
  promptEn: string;
  promptAr: string;
}

const TemplatesGallery: React.FC = () => {
  const { t, isRTL } = useApp();
  const [activeCategory, setActiveCategory] = useState<Category>('ecommerce');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: { id: Category; label: string; icon: React.ElementType }[] = [
    { id: 'ecommerce', label: 'cat_ecommerce', icon: ShoppingBag },
    { id: 'architecture', label: 'cat_architecture', icon: Building },
    { id: 'ugc', label: 'cat_ugc', icon: Video },
    { id: 'brand', label: 'cat_brand', icon: Megaphone },
    { id: 'business', label: 'cat_business', icon: Briefcase },
    { id: 'fashion', label: 'cat_fashion', icon: Shirt },
    { id: 'personal', label: 'cat_personal', icon: User },
    { id: 'viral', label: 'cat_viral', icon: TrendingUp },
  ];

  // POWERFUL BILINGUAL PROMPTS (Optimized for Midjourney/Gemini)
  const templates: Template[] = [
    // --- ECOMMERCE ---
    {
      id: 'ecom-1',
      titleEn: 'Luxury Perfume Shot',
      titleAr: 'تصوير عطر فاخر (مود)',
      category: 'ecommerce',
      promptEn: 'Professional product photography of a luxury crystal perfume bottle on a black reflective podium, dramatic rim lighting, gold flakes floating in the air, soft smoke, 8k resolution, macro details, depth of field, cinematic look.',
      promptAr: 'صورة استوديو احترافية لزجاجة عطر كريستالية فاخرة على منصة سوداء عاكسة، إضاءة حواف درامية (Rim Lighting)، رقائق ذهبية تتطاير في الهواء، دخان ناعم، دقة 8K، تفاصيل ماكرو دقيقة، عزل الخلفية، مظهر سينمائي.'
    },
    {
      id: 'ecom-2',
      titleEn: 'Saudi Coffee Packaging',
      titleAr: 'تغليف قهوة سعودية (هوية)',
      category: 'ecommerce',
      promptEn: 'Packaging design for premium Saudi Coffee, featuring traditional Sadu pattern elements, gold foil stamping on matte deep green texture, minimalist luxury style, 3d mockup rendering, studio lighting.',
      promptAr: 'تصميم تغليف لقهوة سعودية فاخرة، يتميز بعناصر نقوش السدو التراثية، طباعة ذهبية بارزة على خامة خضراء داكنة مطفية (Matte)، أسلوب فخم وبسيط، عرض مجسم ثلاثي الأبعاد (Mockup)، إضاءة استوديو.'
    },
    {
      id: 'ecom-3',
      titleEn: 'Honey Jar Splash',
      titleAr: 'دعاية عسل (حركة وسوائل)',
      category: 'ecommerce',
      promptEn: 'Commercial photography of a honey jar, dynamic liquid honey splash, floating honeycomb pieces, warm golden hour backlighting, sun rays, high speed shutter, sharp focus, fresh and organic vibe.',
      promptAr: 'تصوير تجاري لمرطبان عسل، طرطشة عسل سائلة ديناميكية، قطع شمع العسل تطفو، إضاءة خلفية دافئة (ساعة ذهبية)، أشعة الشمس، غالق سرعة عالية، تركيز حاد، طابع عضوي وطازج.'
    },

    // --- ARCHITECTURE ---
    {
      id: 'arch-1',
      titleEn: 'Modern Islamic Center',
      titleAr: 'مركز ثقافي إسلامي حديث',
      category: 'architecture',
      promptEn: 'Architectural visualization of a modern Islamic cultural center, white marble facade with intricate geometric parametric openings (Mashrabiya), soft warm interior glow, surrounded by palm trees and reflection pools, dusk lighting, photorealistic.',
      promptAr: 'تصور معماري لمركز ثقافي إسلامي حديث، واجهة رخامية بيضاء مع فتحات هندسية بارامترية دقيقة (مشربية)، وهج داخلي دافئ، محاط بأشجار النخيل وبرك مياه عاكسة، إضاءة وقت الغسق، واقعية مفرطة.'
    },
    {
      id: 'arch-2',
      titleEn: 'Luxury Desert Resort',
      titleAr: 'منتجع صحراوي فاخر (العلا)',
      category: 'architecture',
      promptEn: 'Luxury eco-resort nestled in the rock formations of Al-Ula desert, sandstone textures, infinity pool overlooking the canyon, warm lanterns, starry night sky, seamless integration with nature, 8k render, unreal engine 5.',
      promptAr: 'منتجع بيئي فاخر مدمج في التكوينات الصخرية لصحراء العلا، ملمس الحجر الرملي، مسبح لا نهائي يطل على الوادي، فوانيس دافئة، سماء ليلية مرصعة بالنجوم، اندماج سلس مع الطبيعة، ريندر 8K.'
    },
    {
      id: 'arch-3',
      titleEn: 'Neoclassical Interior',
      titleAr: 'تصميم داخلي نيوكلاسيك',
      category: 'architecture',
      promptEn: 'Interior design of a spacious living room, Neoclassical style with modern twist, wall moldings, velvet beige sofas, crystal chandelier, floor-to-ceiling windows with sheer curtains, bright airy atmosphere, interior design magazine style.',
      promptAr: 'تصميم داخلي لغرفة معيشة واسعة، طراز نيوكلاسيك مع لمسة عصرية، إطارات جدارية (بانوهات)، أرائك مخملية بيج، ثريا كريستال، نوافذ من الأرض للسقف مع ستائر شيفون، جو مشرق وجيد التهوية، أسلوب مجلات التصميم.'
    },

    // --- UGC & CONTENT ---
    {
      id: 'ugc-1',
      titleEn: 'Viral Hook Script',
      titleAr: 'جمل افتتاحية فيرال (Hooks)',
      category: 'ugc',
      promptEn: 'Write 5 viral hooks for a short video about [Topic] in Arabic. Hooks should be shocking, controversial, or trigger curiosity. E.g., "Stop doing [X] if you want [Y]".',
      promptAr: 'اكتب 5 جمل افتتاحية (Hooks) فيرال لفيديو قصير عن [الموضوع] باللغة العربية. يجب أن تكون الجمل صادمة أو تثير الفضول فوراً. مثال: "توقف عن فعل [X] إذا كنت تريد [Y]" أو "لن تصدق ما اكتشفته عن...".'
    },
    {
      id: 'ugc-2',
      titleEn: 'Product Review Script',
      titleAr: 'سيناريو مراجعة منتج (UGC)',
      category: 'ugc',
      promptEn: 'Write a 30-second UGC video script reviewing [Product]. Structure: 1. Problem identification. 2. Introducing the product as hero. 3. Demo/Benefit. 4. Strong Call to Action. Tone: Enthusiastic and authentic.',
      promptAr: 'اكتب سيناريو فيديو UGC مدته 30 ثانية لمراجعة [اسم المنتج]. الهيكل: 1. تحديد المشكلة. 2. تقديم المنتج كحل سحري. 3. تجربة سريعة/فائدة. 4. دعوة قوية للشراء. النبرة: حماسية وعفوية.'
    },

    // --- BRANDING ---
    {
      id: 'brand-1',
      titleEn: 'Brand Identity Prompt',
      titleAr: 'وصف هوية بصرية كاملة',
      category: 'brand',
      promptEn: 'Generate a comprehensive brand visual identity description for a [Industry] company called [Name]. Define: 1. Color Palette (Hex codes). 2. Typography style. 3. Logo concept (Symbolism). 4. Moodboard themes.',
      promptAr: 'ولد وصفاً شاملاً للهوية البصرية لشركة [المجال] باسم [الاسم]. حدد: 1. لوحة الألوان (أكواد Hex). 2. أسلوب الخطوط (Typography). 3. فكرة الشعار والرمزية. 4. محاور المود بورد (Moodboard).'
    },
    {
      id: 'brand-2',
      titleEn: 'Mission & Vision',
      titleAr: 'الرؤية والرسالة (شركات)',
      category: 'brand',
      promptEn: 'Draft a professional Mission and Vision statement for a [Company Type]. Mission should focus on [Core Value]. Vision should be ambitious and future-oriented. Language: Professional Arabic.',
      promptAr: 'صغ بيان الرؤية والرسالة لشركة [نوع الشركة] بأسلوب احترافي. الرسالة يجب أن تركز على [القيمة الأساسية]. الرؤية يجب أن تكون طموحة ومستقبلية. اللغة: عربية فصحى رسمية.'
    },

    // --- BUSINESS ---
    {
      id: 'bus-1',
      titleEn: 'Strategic Email',
      titleAr: 'بريد إلكتروني تفاوضي',
      category: 'business',
      promptEn: 'Write a negotiation email to a vendor asking for better pricing for [Service]. Use the "Sandwich Method" (Positive feedback, The Ask/Constraint, Hope for partnership). Tone: Professional yet firm.',
      promptAr: 'اكتب بريداً إلكترونياً للتفاوض مع مورد لطلب سعر أفضل لخدمة [الخدمة]. استخدم أسلوب "الساندويتش" (ثناء إيجابي، الطلب/المحددات المادية، التطلع لشراكة طويلة). النبرة: احترافية وحازمة بلطف.'
    },
    {
      id: 'bus-2',
      titleEn: 'LinkedIn Thought Leadership',
      titleAr: 'منشور قيادي (LinkedIn)',
      category: 'business',
      promptEn: 'Write a LinkedIn post about the future of [Industry]. Discuss 3 emerging trends. End with an engaging question to drive comments. Tone: Expert, visionary.',
      promptAr: 'اكتب منشوراً لمنصة LinkedIn حول مستقبل [الصناعة]. ناقش 3 اتجاهات ناشئة. اختتم بسؤال جذاب لتحفيز النقاش. النبرة: خبير، قيادي، وملهم.'
    },

    // --- FASHION ---
    {
      id: 'fash-1',
      titleEn: 'Modern Abaya',
      titleAr: 'عباية عصرية (موديل)',
      category: 'fashion',
      promptEn: 'Full body fashion shot of a model wearing a stylish modern black Abaya with gold embroidery, standing in a white minimalist architectural space, natural lighting, high fashion pose, detailed fabric texture, 8k.',
      promptAr: 'لقطة أزياء كاملة لعارضة ترتدي عباية سوداء عصرية بتطريز ذهبي، تقف في مساحة معمارية بيضاء بسيطة (مينيماليست)، إضاءة طبيعية، وضعية أزياء راقية، تفاصيل نسيج دقيقة، دقة 8K.'
    },
    {
      id: 'fash-2',
      titleEn: 'Streetwear Concept',
      titleAr: 'أزياء الشارع (Streetwear)',
      category: 'fashion',
      promptEn: 'Streetwear fashion photography, oversized hoodie with holographic print, urban night setting, neon lights reflecting on wet pavement, cyberpunk vibes, cinematic color grading.',
      promptAr: 'تصوير أزياء "ستريت وير"، هودي واسع (Oversized) بطبعة هولوغرافيك، أجواء ليلية حضرية، أضواء نيون تنعكس على الرصيف المبلل، طابع سايبر بانك، تلوين سينمائي.'
    },

    // --- PERSONAL ---
    {
      id: 'pers-1',
      titleEn: 'CV Bullet Points',
      titleAr: 'نقاط سيرة ذاتية قوية',
      category: 'personal',
      promptEn: 'Rewrite these resume bullet points for a [Job Role] to be result-oriented using Google\'s "XYZ formula" (Accomplished [X] as measured by [Y], by doing [Z]).',
      promptAr: 'أعد صياغة نقاط السيرة الذاتية هذه لوظيفة [المسمى الوظيفي] لتكون موجهة نحو النتائج باستخدام معادلة جوجل XYZ (أنجزت [X] مقاساً بـ [Y]، عن طريق فعل [Z]). اللغة: عربية مهنية.'
    },

    // --- VIRAL ---
    {
      id: 'vir-1',
      titleEn: 'YouTube Thumbnail Concept',
      titleAr: 'فكرة صورة مصغرة (يوتيوب)',
      category: 'viral',
      promptEn: 'Describe a high-CTR YouTube thumbnail for a video about [Topic]. Detail the facial expression, background color, text overlay (max 3 words), and visual elements that create curiosity and shock.',
      promptAr: 'صف فكرة صورة مصغرة (Thumbnail) لليوتيوب تضمن معدل نقر عالي (CTR) لفيديو عن [الموضوع]. صف تعبير الوجه، لون الخلفية، النص المكتوب (3 كلمات كحد أقصى)، والعناصر البصرية التي تثير الفضول والصدمة.'
    }
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTemplates = templates.filter(t => t.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
       
       {/* Header */}
       <div className="text-center space-y-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg">
                <LayoutTemplate size={32} />
            </div>
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-white dark:to-slate-300">
                {t('templates_title')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
                {t('templates_desc')}
            </p>
       </div>

       {/* Category Tabs */}
       <div className="flex flex-wrap justify-center gap-3 px-4">
           {categories.map((cat) => {
               const Icon = cat.icon;
               const isActive = activeCategory === cat.id;
               return (
                   <button
                       key={cat.id}
                       onClick={() => setActiveCategory(cat.id)}
                       className={`
                           flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200
                           ${isActive 
                               ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg transform scale-105' 
                               : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                           }
                       `}
                   >
                       <Icon size={18} />
                       {t(cat.label as any)}
                   </button>
               )
           })}
       </div>

       {/* Templates Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
           {filteredTemplates.map((template) => {
               const CategoryIcon = categories.find(c => c.id === template.category)?.icon;
               // Automatically select language based on App Direction (RTL = Arabic)
               const displayPrompt = isRTL ? template.promptAr : template.promptEn;
               const displayTitle = isRTL ? template.titleAr : template.titleEn;

               return (
               <div key={template.id} className="group bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                   <div className="flex items-start justify-between mb-4">
                       <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                           {CategoryIcon ? <CategoryIcon size={24} /> : <LayoutTemplate size={24} />}
                       </div>
                       <span className="text-xs font-bold px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 uppercase tracking-wide">
                           {t(`cat_${template.category}` as any)}
                       </span>
                   </div>
                   
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 min-h-[3.5rem] leading-tight">
                       {displayTitle}
                   </h3>
                   
                   <div className="flex-1 bg-slate-50 dark:bg-slate-950/50 rounded-xl p-4 mb-6 border border-slate-100 dark:border-slate-800/50 relative overflow-hidden group-hover:border-indigo-100 dark:group-hover:border-indigo-900/30 transition-colors">
                       <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium line-clamp-6" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                           "{displayPrompt}"
                       </p>
                   </div>

                   <button
                       onClick={() => handleCopy(displayPrompt, template.id)}
                       className={`
                           w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95
                           ${copiedId === template.id 
                               ? 'bg-green-500 text-white shadow-green-500/20' 
                               : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 shadow-lg'
                           }
                       `}
                   >
                       {copiedId === template.id ? <Check size={18} /> : <Copy size={18} />}
                       {copiedId === template.id ? t('tpl_btn_copied') : t('tpl_btn_copy')}
                   </button>
               </div>
           )})}
       </div>

    </div>
  );
};

export default TemplatesGallery;
