
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  ShoppingBag, Building, Video, Megaphone, 
  Briefcase, Shirt, User, TrendingUp, Copy, Check, LayoutTemplate 
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

  // POWERFUL BILINGUAL PROMPTS
  const templates: Template[] = [
    // --- ECOMMERCE ---
    {
      id: 'ecom-1',
      titleEn: 'Luxury Product Shot',
      titleAr: 'تصوير منتج فاخر',
      category: 'ecommerce',
      promptEn: 'A high-end studio photography shot of [Product Name] centered on a polished marble podium, soft cinematic lighting from the left, neutral beige background, gold accents, 8k resolution, ultra-realistic, sharp focus.',
      promptAr: 'صورة استوديو احترافية عالية الدقة لمنتج [اسم المنتج] يتوسط منصة رخامية لامعة، إضاءة سينمائية ناعمة من اليسار، خلفية بيج محايدة مع لمسات ذهبية، دقة 8K، واقعية جداً وتركيز حاد.'
    },
    {
      id: 'ecom-2',
      titleEn: 'Arabic Packaging Design',
      titleAr: 'تغليف بهوية عربية',
      category: 'ecommerce',
      promptEn: 'Minimalist eco-friendly packaging design for [Product Name] featuring elegant Arabic calligraphy logo, textured cardboard material, soft floating composition, studio lighting, 3d render, award-winning design.',
      promptAr: 'تصميم تغليف بسيط وصديق للبيئة لمنتج [اسم المنتج] يتميز بشعار خط عربي أنيق، خامة كرتونية ذات ملمس بارز، تكوين عائم ناعم، إضاءة استوديو، ريندر ثلاثي الأبعاد بجودة عالمية.'
    },
    {
      id: 'ecom-3',
      titleEn: 'Lifestyle Action Shot',
      titleAr: 'صورة نمط حياة (لايف ستايل)',
      category: 'ecommerce',
      promptEn: 'A candid lifestyle shot of a happy person using [Product Name] in a sunlit modern living room, authentic emotions, bokeh effect background, high dynamic range, commercial photography style.',
      promptAr: 'صورة عفوية "لايف ستايل" لشخص سعيد يستخدم [اسم المنتج] في غرفة معيشة عصرية مضاءة بنور الشمس، مشاعر حقيقية، خلفية معزولة (بوكيه)، نطاق ديناميكي عالي، أسلوب تصوير إعلاني.'
    },

    // --- ARCHITECTURE ---
    {
      id: 'arch-1',
      titleEn: 'Modern Islamic Villa',
      titleAr: 'فيلا عصرية بطابع إسلامي',
      category: 'architecture',
      promptEn: 'A futuristic sustainable villa design fusing modern architecture with traditional Islamic geometric patterns, mashrabiya screens, floor-to-ceiling glass, warm interior lighting, twilight desert atmosphere, photorealistic architectural visualization.',
      promptAr: 'تصميم فيلا مستقبلية مستدامة تدمج العمارة الحديثة مع الزخارف الهندسية الإسلامية التقليدية، نوافذ مشربية، زجاج من الأرض للسقف، إضاءة داخلية دافئة، أجواء صحراوية وقت الغروب، إظهار معماري واقعي.'
    },
    {
      id: 'arch-2',
      titleEn: 'Luxury Majlis Interior',
      titleAr: 'تصميم مجلس فاخر',
      category: 'architecture',
      promptEn: 'Luxury minimalist interior design of a modern Majlis, Japandi style mixed with Arabian heritage, low seating furniture, neutral earth tones, large abstract art, indoor palm plants, natural sunlight, 8k render.',
      promptAr: 'تصميم داخلي فاخر ومينيماليست لمجلس حديث، يمزج بين طراز الجاباندي والتراث العربي، جلسات أرضية منخفضة، ألوان ترابية محايدة، لوحات تجريدية ضخمة، نباتات نخيل داخلية، ضوء شمس طبيعي، ريندر 8K.'
    },

    // --- UGC & CONTENT ---
    {
      id: 'ugc-1',
      titleEn: 'TikTok Hook Script',
      titleAr: 'جمل افتتاحية قوية (Hooks)',
      category: 'ugc',
      promptEn: 'Write 5 viral hooks for a short video about [Topic]. The hooks should be shocking, controversial, or trigger immediate curiosity. Format: "Stop doing [X] if you want [Y]".',
      promptAr: 'اكتب 5 جمل افتتاحية (Hooks) فيرال لفيديو قصير عن [الموضوع] باللغة العربية. يجب أن تكون الجمل صادمة أو مثيرة للجدل أو تثير الفضول فوراً. على سبيل المثال: "توقف عن فعل [X] إذا كنت تريد [Y]" أو "لن تصدق ما اكتشفته عن...".'
    },
    {
      id: 'ugc-2',
      titleEn: 'Unboxing Script',
      titleAr: 'سيناريو فتح صندوق (Unboxing)',
      category: 'ugc',
      promptEn: 'Write an enthusiastic unboxing video script for [Product]. Include: 1. Visual hook (showing the package). 2. Sensory description (texture, smell, look). 3. Problem/Solution demonstration. 4. Strong Call to Action.',
      promptAr: 'اكتب سيناريو فيديو "فتح صندوق" حماسي لمنتج [اسم المنتج] باللغة العربية. تضمن: 1. لقطة افتتاحية بصرية (عرض العبوة). 2. وصف حسي (الملمس، الرائحة، الشكل). 3. عرض المشكلة والحل. 4. دعوة قوية لاتخاذ إجراء (CTA) في النهاية.'
    },

    // --- BRANDING ---
    {
      id: 'brand-1',
      titleEn: 'Slogan Generator',
      titleAr: 'ابتكار شعارات لفظية (Slogans)',
      category: 'brand',
      promptEn: 'Generate 10 catchy, memorable, and short slogans for a new [Brand Type] brand. The tone should be [Tone: e.g., Luxurious, Playful]. Focus on value proposition and rhyme if possible.',
      promptAr: 'ابتكر 10 شعارات لفظية (Slogans) جذابة وسهلة التذكر وقصيرة لعلامة تجارية جديدة في مجال [نوع العلامة التجارية] باللغة العربية. النبرة يجب أن تكون [النبرة: مثلاً فاخرة، مرحة]. ركز على القيمة المقترحة واستخدم السجع إن أمكن.'
    },
    {
      id: 'brand-2',
      titleEn: 'Brand Story',
      titleAr: 'قصة العلامة التجارية',
      category: 'brand',
      promptEn: 'Write a compelling "About Us" brand story for [Company Name]. We sell [Product] and our mission is [Mission]. The tone should be inspiring, authentic, and customer-centric.',
      promptAr: 'اكتب قصة علامة تجارية "من نحن" ملهمة لشركة [اسم الشركة] باللغة العربية. نحن نبيع [المنتج] ومهمتنا هي [المهمة]. النبرة يجب أن تكون ملهمة، صادقة، وتركز على العميل وتشعره بالانتماء.'
    },

    // --- BUSINESS ---
    {
      id: 'bus-1',
      titleEn: 'Professional LinkedIn Post',
      titleAr: 'منشور احترافي LinkedIn',
      category: 'business',
      promptEn: 'Act as a thought leader. Write a LinkedIn post about the future of [Industry]. Use a professional yet engaging tone, include 3 bullet points on upcoming trends, and end with a question to drive comments.',
      promptAr: 'تقمص دور خبير وقيادي في المجال. اكتب منشوراً لمنصة LinkedIn باللغة العربية حول مستقبل [الصناعة]. استخدم نبرة احترافية وجذابة، وقم بتضمين 3 نقاط رئيسية حول الاتجاهات القادمة، واختتم بسؤال ذكي لتحفيز النقاش في التعليقات.'
    },
    {
      id: 'bus-2',
      titleEn: 'Cold Email Sales',
      titleAr: 'رسالة بريد باردة (مبيعات)',
      category: 'business',
      promptEn: 'Draft a short, personalized cold email to a potential client offering [Service]. Focus on their pain points and your unique value proposition. Keep it under 150 words and include a clear meeting request.',
      promptAr: 'صغ رسالة بريد إلكتروني باردة (Cold Email) قصيرة ومخصصة لعميل محتمل تعرض عليه [الخدمة] باللغة العربية. ركز على نقاط الألم لديهم وقيمتك المقترحة الفريدة. اجعلها أقل من 150 كلمة وتضمن طلباً واضحاً لعقد اجتماع.'
    },

    // --- FASHION ---
    {
      id: 'fash-1',
      titleEn: 'Streetwear Editorial',
      titleAr: 'جلسة تصوير أزياء الشارع',
      category: 'fashion',
      promptEn: 'Full body shot of a model wearing [Clothing Item], urban street background, neon signs, rainy cyberpunk atmosphere, dramatic lighting, high fashion photography, detailed fabric texture.',
      promptAr: 'لقطة كاملة لعارض يرتدي [قطعة الملابس]، خلفية شارع حضري، لافتات نيون، أجواء ممطرة بأسلوب السايبر بانك، إضاءة درامية، تصوير أزياء راقي، تفاصيل نسيج دقيقة وواضحة.'
    },
    {
      id: 'fash-2',
      titleEn: 'Fabric Macro Detail',
      titleAr: 'تصوير تفاصيل القماش (ماكرو)',
      category: 'fashion',
      promptEn: 'Extreme close-up macro shot of [Fabric Type] texture, showing intricate weaving details, golden threads, soft folds, luxury quality, warm golden hour lighting.',
      promptAr: 'لقطة ماكرو قريبة جداً لتفاصيل نسيج [نوع القماش]، تظهر تفاصيل الحياكة الدقيقة، خيوط ذهبية متداخلة، طيات ناعمة، جودة فاخرة، إضاءة الساعة الذهبية الدافئة.'
    },

    // --- PERSONAL ---
    {
      id: 'pers-1',
      titleEn: 'CV/Resume Enhancement',
      titleAr: 'تحسين نقاط السيرة الذاتية',
      category: 'personal',
      promptEn: 'Rewrite these resume bullet points to be more impact-driven and results-oriented for a [Job Title] role. Use strong action verbs and quantify results where possible: [Paste Points].',
      promptAr: 'أعد صياغة نقاط السيرة الذاتية هذه لتكون أكثر تأثيراً وتوجهاً نحو النتائج لوظيفة [المسمى الوظيفي] باللغة العربية. استخدم أفعال قوية (Action Verbs) وقم بإضافة أرقام ونتائج ملموسة حيثما أمكن: [الصق النقاط هنا].'
    },
    {
      id: 'pers-2',
      titleEn: 'Social Media Bio',
      titleAr: 'نبذة شخصية احترافية (Bio)',
      category: 'personal',
      promptEn: 'Write 3 variations of a creative and professional bio for a [Profession] based on these interests: [Interests]. Suitable for Instagram, Twitter, and LinkedIn.',
      promptAr: 'اكتب 3 تنويعات لنبذة شخصية (Bio) إبداعية واحترافية لـ [المهنة] بناءً على هذه الاهتمامات: [الاهتمامات]. باللغة العربية، مناسبة لمنصات إنستقرام، تويتر، ولينكد إن.'
    },

    // --- VIRAL ---
    {
      id: 'vir-1',
      titleEn: 'Controversial Opinion Post',
      titleAr: 'منشور رأي جدلي',
      category: 'viral',
      promptEn: 'Write a "Hot Take" post about [Topic] that challenges common assumptions. Keep it respectful but provocative to encourage debate and high engagement.',
      promptAr: 'اكتب منشور "رأي ساخن" (Hot Take) حول [الموضوع] باللغة العربية يتحدى الافتراضات الشائعة. اجعله محترماً ولكن مستفزاً للفكر لتشجيع النقاش والتفاعل العالي.'
    },
    {
      id: 'vir-2',
      titleEn: 'YouTube Thumbnail Idea',
      titleAr: 'وصف صورة مصغرة لليوتيوب',
      category: 'viral',
      promptEn: 'Describe a high-click-through rate (CTR) YouTube thumbnail for a video about [Topic]. Include facial expression, background color, text overlay, and visual elements that create curiosity.',
      promptAr: 'صف فكرة صورة مصغرة (Thumbnail) لليوتيوب تضمن معدل نقر عالي (CTR) لفيديو عن [الموضوع]. صف تعبير الوجه، لون الخلفية، النص المكتوب على الصورة، والعناصر البصرية التي تثير الفضول.'
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
                   
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 min-h-[3rem]">
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
