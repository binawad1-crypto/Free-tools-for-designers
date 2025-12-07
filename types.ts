

export enum Language {
  EN = 'en',
  AR = 'ar'
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface ColorPalette {
  name: string;
  hex: string;
  description: string;
  role: 'primary' | 'secondary' | 'accent' | 'surface' | 'text';
}

export interface PantoneMatch {
  code: string;
  name: string;
  hex: string;
  cmyk: string;
  description: string;
}

export interface GeneratedContent {
  text: string;
}

export interface Tool {
  id: string;
  icon: string;
  path: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  gradient: string;
  colorTheme: 'blue' | 'purple' | 'emerald' | 'orange' | 'indigo' | 'rose' | 'slate' | 'cyan' | 'red' | 'gold';
}

export type TranslationKey = 
  | 'app_title'
  | 'app_desc'
  | 'hero_title'
  | 'hero_desc'
  | 'tokens_remaining'
  | 'qr_tool'
  | 'color_tool'
  | 'text_tool'
  | 'pms_tool'
  | 'resize_tool'
  | 'contrast_tool'
  | 'unit_tool'
  | 'nutri_tool'
  | 'pdf_tool'
  | 'social_tool'
  | 'logo_tool'
  | 'footer_text'
  | 'input_placeholder'
  | 'generate_btn'
  | 'download_btn'
  | 'copy_btn'
  | 'loading'
  | 'error'
  | 'qr_label'
  | 'color_prompt_label'
  | 'text_prompt_label'
  | 'result_label'
  | 'back_home'
  | 'qr_type_url'
  | 'qr_type_text'
  | 'qr_type_email'
  | 'qr_type_phone'
  | 'qr_type_sms'
  | 'qr_type_wifi'
  | 'qr_type_vcard'
  | 'qr_customize'
  | 'qr_color_fg'
  | 'qr_color_bg'
  | 'qr_input_url'
  | 'qr_input_text'
  | 'qr_input_email'
  | 'qr_input_subject'
  | 'qr_input_body'
  | 'qr_input_phone'
  | 'qr_input_ssid'
  | 'qr_input_password'
  | 'qr_input_name'
  | 'qr_input_org'
  | 'qr_track'
  | 'qr_no_watermark'
  | 'color_role_primary'
  | 'color_role_secondary'
  | 'color_role_accent'
  | 'color_role_surface'
  | 'color_role_text'
  | 'color_export_css'
  | 'color_export_json'
  | 'color_view_palette'
  | 'color_view_preview'
  | 'color_mood_corporate'
  | 'color_mood_playful'
  | 'color_mood_dark'
  | 'color_mood_nature'
  | 'color_mood_pastel'
  | 'text_template_free'
  | 'text_template_headline'
  | 'text_template_product'
  | 'text_template_social'
  | 'text_template_email'
  | 'text_template_ux'
  | 'text_tone_professional'
  | 'text_tone_friendly'
  | 'text_tone_luxury'
  | 'text_tone_witty'
  | 'text_tone_urgent'
  | 'text_label_template'
  | 'text_label_tone'
  | 'text_label_lang'
  | 'text_lang_ar'
  | 'text_lang_en'
  | 'pms_input_label'
  | 'pms_find_btn'
  | 'pms_match_title'
  | 'pms_closest_match'
  | 'pms_cmyk_values'
  | 'resize_drop_label'
  | 'resize_settings_title'
  | 'resize_width'
  | 'resize_height'
  | 'resize_percent'
  | 'resize_lock_ratio'
  | 'resize_format'
  | 'resize_quality'
  | 'resize_btn'
  | 'resize_clear_btn'
  | 'resize_status_pending'
  | 'resize_status_done'
  | 'resize_mode_dimensions'
  | 'resize_mode_percentage'
  | 'unit_cat_length'
  | 'unit_cat_typography'
  | 'unit_cat_digital'
  | 'unit_cat_mass'
  | 'unit_label_base'
  | 'unit_label_from'
  | 'unit_label_to'
  | 'unit_base_font_size'
  | 'nutri_title_facts'
  | 'nutri_serving_size'
  | 'nutri_servings_per'
  | 'nutri_amount_per'
  | 'nutri_calories'
  | 'nutri_daily_value'
  | 'nutri_total_fat'
  | 'nutri_sat_fat'
  | 'nutri_trans_fat'
  | 'nutri_cholesterol'
  | 'nutri_sodium'
  | 'nutri_total_carb'
  | 'nutri_fiber'
  | 'nutri_sugars'
  | 'nutri_added_sugars'
  | 'nutri_protein'
  | 'nutri_vit_d'
  | 'nutri_calcium'
  | 'nutri_iron'
  | 'nutri_potassium'
  | 'nutri_footnote'
  | 'nutri_settings'
  | 'nutri_label_lang'
  | 'nutri_input_values'
  | 'nutri_export_png'
  | 'pdf_tab_merge'
  | 'pdf_tab_img2pdf'
  | 'pdf_tab_split'
  | 'pdf_tab_compress'
  | 'pdf_drop_pdfs'
  | 'pdf_drop_imgs'
  | 'pdf_btn_merge'
  | 'pdf_btn_convert'
  | 'pdf_btn_split'
  | 'pdf_btn_compress'
  | 'pdf_files_count'
  | 'pdf_processing'
  | 'social_platform_insta'
  | 'social_platform_tiktok'
  | 'social_platform_twitter'
  | 'social_platform_fb'
  | 'social_platform_yt'
  | 'social_platform_linkedin'
  | 'social_platform_snap'
  | 'social_format_post'
  | 'social_format_story'
  | 'social_format_reel'
  | 'social_format_cover'
  | 'social_format_header'
  | 'social_format_thumbnail'
  | 'social_format_profile'
  | 'social_copy_dims'
  | 'logo_prompt_label'
  | 'logo_style_label'
  | 'logo_style_minimal'
  | 'logo_style_vintage'
  | 'logo_style_3d'
  | 'logo_style_abstract'
  | 'logo_style_mascot'
  | 'logo_generated_title'
  | 'nav_dashboard'
  | 'nav_tools'
  | 'nav_studio'
  | 'nav_settings'
  | 'nav_support'
  | 'dash_welcome'
  | 'dash_stats_title'
  | 'dash_recent_activity'
  | 'dash_stat_projects'
  | 'dash_stat_completed'
  | 'dash_stat_tokens'
  | 'dash_upgrade'
  | 'dash_plan_name'
  | 'dash_plan_pro'
  | 'studio_title'
  | 'studio_desc'
  | 'studio_prompt_label'
  | 'studio_btn_generate'
  | 'studio_select_key'
  | 'studio_key_required'
  | 'studio_generating'
  | 'studio_projects_title'
  | 'studio_no_projects'
  | 'studio_aspect_ratio'
  | 'studio_resolution';

export const TOOLS_DATA: Tool[] = [
  {
    id: 'logo',
    icon: 'Hexagon',
    path: '/logo',
    titleEn: 'AI Logo Maker',
    titleAr: 'صانع الشعارات',
    descEn: 'Design unique, professional logos instantly with AI.',
    descAr: 'صمم شعارات مميزة واحترافية فوراً باستخدام الذكاء الاصطناعي.',
    gradient: 'from-amber-400 to-yellow-600',
    colorTheme: 'gold'
  },
  {
    id: 'qr',
    icon: 'QrCode',
    path: '/qr',
    titleEn: 'QR Code Generator',
    titleAr: 'منشئ الباركود (QR)',
    descEn: 'Create custom QR codes for your links instantly.',
    descAr: 'أنشئ رموز استجابة سريعة لروابطك بسهولة.',
    gradient: 'from-blue-500 to-cyan-500',
    colorTheme: 'blue'
  },
  {
    id: 'color',
    icon: 'Palette',
    path: '/color',
    titleEn: 'AI Color Palette',
    titleAr: 'مستشار الألوان الذكي',
    descEn: 'Generate beautiful color schemes based on mood using AI.',
    descAr: 'ولد لوحات ألوان متناسقة بناءً على المزاج باستخدام الذكاء الاصطناعي.',
    gradient: 'from-purple-500 to-pink-500',
    colorTheme: 'purple'
  },
  {
    id: 'text',
    icon: 'Type',
    path: '/text',
    titleEn: 'Smart Copywriter',
    titleAr: 'صانع النصوص العبقري',
    descEn: 'Generate professional copy for marketing and UX.',
    descAr: 'أنشئ نصوصاً احترافية للتسويق وواجهات المستخدم.',
    gradient: 'from-emerald-500 to-green-500',
    colorTheme: 'emerald'
  },
  {
    id: 'social',
    icon: 'LayoutGrid',
    path: '/social-sizes',
    titleEn: 'Social Sizes',
    titleAr: 'مقاسات السوشيال ميديا',
    descEn: 'Ready-made templates for Instagram, TikTok, and more.',
    descAr: 'مقاسات جاهزة للتصاميم (Instagram, Story, TikTok).',
    gradient: 'from-teal-500 to-cyan-500',
    colorTheme: 'cyan'
  },
  {
    id: 'pms',
    icon: 'Pipette',
    path: '/pms',
    titleEn: 'Pantone Converter',
    titleAr: 'محول بانتون',
    descEn: 'Find the closest matching PMS color for any hex code.',
    descAr: 'احصل على رقم Pantone المطابق لأي لون بدقة عالية.',
    gradient: 'from-orange-500 to-red-500',
    colorTheme: 'orange'
  },
  {
    id: 'resize',
    icon: 'Scaling',
    path: '/resize',
    titleEn: 'Image Resizer',
    titleAr: 'تغيير مقاسات الصور',
    descEn: 'Resize up to 10 images at once with high quality.',
    descAr: 'غيّر مقاسات الصور بسهولة (حتى 10 صور) مع الحفاظ على الجودة.',
    gradient: 'from-indigo-500 to-violet-500',
    colorTheme: 'indigo'
  },
  {
    id: 'pdf',
    icon: 'FileStack',
    path: '/pdf',
    titleEn: 'PDF Manager',
    titleAr: 'مدير ملفات PDF',
    descEn: 'Merge, split, and convert images to PDF easily.',
    descAr: 'دمج، تقسيم، وتحويل الصور إلى ملفات PDF باحترافية.',
    gradient: 'from-red-500 to-rose-500',
    colorTheme: 'red'
  },
  {
    id: 'units',
    icon: 'Ruler',
    path: '/units',
    titleEn: 'Unit Converter',
    titleAr: 'محول المقاسات',
    descEn: 'Convert between pixels, rem, cm, and more.',
    descAr: 'حول بين جميع وحدات القياس بسهولة (طول، وزن، حجم، درجة حرارة).',
    gradient: 'from-rose-500 to-orange-400',
    colorTheme: 'rose'
  },
  {
    id: 'nutri',
    icon: 'ScrollText',
    path: '/nutrition',
    titleEn: 'Nutrition Label Maker',
    titleAr: 'صانع القيم الغذائية',
    descEn: 'Create professional FDA-style nutrition labels.',
    descAr: 'صمم ملصق الحقائق الغذائية الاحترافي لمنتجاتك بسهولة.',
    gradient: 'from-slate-600 to-teal-500',
    colorTheme: 'slate'
  }
];
