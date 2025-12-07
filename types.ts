
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
}

export type TranslationKey = 
  | 'app_title'
  | 'app_desc'
  | 'qr_tool'
  | 'color_tool'
  | 'text_tool'
  | 'pms_tool'
  | 'resize_tool'
  | 'contrast_tool'
  | 'unit_tool'
  | 'nutri_tool'
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
  | 'nutri_export_png';

export const TOOLS_DATA: Tool[] = [
  {
    id: 'qr',
    icon: 'QrCode',
    path: '/qr',
    titleEn: 'QR Code Generator',
    titleAr: 'منشئ الباركود (QR)',
    descEn: 'Create custom QR codes for your links instantly.',
    descAr: 'أنشئ رموز استجابة سريعة لروابطك بسهولة.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'color',
    icon: 'Palette',
    path: '/color',
    titleEn: 'AI Color Palette',
    titleAr: 'مستشار الألوان الذكي',
    descEn: 'Generate beautiful color schemes based on mood using AI.',
    descAr: 'ولد لوحات ألوان متناسقة بناءً على المزاج باستخدام الذكاء الاصطناعي.',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'text',
    icon: 'Type',
    path: '/text',
    titleEn: 'Smart Copywriter',
    titleAr: 'صانع النصوص العبقري',
    descEn: 'Generate professional copy for marketing and UX.',
    descAr: 'أنشئ نصوصاً احترافية للتسويق وواجهات المستخدم.',
    gradient: 'from-emerald-500 to-green-500'
  },
  {
    id: 'pms',
    icon: 'Pipette',
    path: '/pms',
    titleEn: 'Pantone Converter',
    titleAr: 'محول بانتون',
    descEn: 'Find the closest matching PMS color for any hex code.',
    descAr: 'احصل على رقم Pantone المطابق لأي لون بدقة عالية.',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    id: 'resize',
    icon: 'Scaling',
    path: '/resize',
    titleEn: 'Image Resizer',
    titleAr: 'تغيير مقاسات الصور',
    descEn: 'Resize up to 10 images at once with high quality.',
    descAr: 'غيّر مقاسات الصور بسهولة (حتى 10 صور) مع الحفاظ على الجودة.',
    gradient: 'from-indigo-500 to-violet-500'
  },
  {
    id: 'units',
    icon: 'Ruler',
    path: '/units',
    titleEn: 'Unit Converter',
    titleAr: 'محول المقاسات',
    descEn: 'Convert between pixels, rem, cm, and more.',
    descAr: 'حول بين جميع وحدات القياس بسهولة (طول، وزن، حجم، درجة حرارة).',
    gradient: 'from-rose-500 to-orange-400'
  },
  {
    id: 'nutri',
    icon: 'ScrollText',
    path: '/nutrition',
    titleEn: 'Nutrition Label Maker',
    titleAr: 'صانع القيم الغذائية',
    descEn: 'Create professional FDA-style nutrition labels.',
    descAr: 'صمم ملصق الحقائق الغذائية الاحترافي لمنتجاتك بسهولة.',
    gradient: 'from-slate-700 to-slate-500'
  }
];