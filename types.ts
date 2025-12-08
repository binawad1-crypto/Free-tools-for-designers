

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
  colorTheme: 'blue' | 'purple' | 'emerald' | 'orange' | 'indigo' | 'rose' | 'slate' | 'cyan' | 'red' | 'gold' | 'pink';
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
  | 'marketing_tool'
  | 'competitor_tool'
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
  | 'logo_brand_name'
  | 'logo_brand_placeholder'
  | 'logo_style_label'
  | 'logo_style_minimal'
  | 'logo_style_vintage'
  | 'logo_style_3d'
  | 'logo_style_abstract'
  | 'logo_style_mascot'
  | 'logo_generated_title'
  | 'marketing_type_insta'
  | 'marketing_type_ad'
  | 'marketing_type_headline'
  | 'marketing_type_offer'
  | 'marketing_input_product'
  | 'marketing_input_audience'
  | 'marketing_tone_enthusiastic'
  | 'marketing_tone_professional'
  | 'marketing_tone_urgent'
  | 'marketing_tone_friendly'
  | 'comp_input_url'
  | 'comp_input_desc'
  | 'comp_analyze_btn'
  | 'comp_section_strengths'
  | 'comp_section_weaknesses'
  | 'comp_section_marketing'
  | 'comp_section_audience'
  | 'comp_section_content'
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
  | 'studio_resolution'
  | 'studio_tool_upload'
  | 'studio_tool_img2vid'
  | 'studio_tool_txt2img'
  | 'studio_tool_audio'
  | 'studio_tool_character'
  | 'studio_section_pro'
  | 'studio_tool_remove_bg'
  | 'studio_tool_replace_bg'
  | 'studio_tool_product'
  | 'studio_tool_consistency'
  | 'studio_tool_faceswap'
  | 'studio_tool_3d'
  | 'studio_tool_upscale'
  | 'studio_drop_image'
  | 'studio_processing_image'
  | 'studio_result_image'
  | 'nav_special'
  | 'special_hub_title'
  | 'special_hub_desc'
  | 'tool_smart_chat'
  | 'tool_vision'
  | 'tool_audio'
  | 'tool_live'
  | 'tool_search'
  | 'tool_maps'
  | 'tool_thinking'
  | 'desc_smart_chat'
  | 'desc_vision'
  | 'desc_audio'
  | 'desc_live'
  | 'chat_mode_pro'
  | 'chat_mode_flash'
  | 'chat_mode_search'
  | 'chat_mode_maps'
  | 'chat_mode_think'
  | 'chat_input_placeholder'
  | 'chat_thinking'
  | 'chat_sources'
  | 'vision_tab_image'
  | 'vision_tab_video'
  | 'vision_analyze_btn'
  | 'vision_upload_label'
  | 'audio_tab_tts'
  | 'audio_tab_transcribe'
  | 'audio_input_text'
  | 'audio_btn_speak'
  | 'audio_btn_record'
  | 'audio_recording'
  | 'live_start'
  | 'live_listening'
  | 'live_end'
  | 'auth_login'
  | 'auth_logout'
  | 'auth_admin'
  | 'auth_guest'
  | 'auth_login_desc'
  | 'auth_email'
  | 'auth_password'
  | 'auth_signin_btn'
  | 'auth_error_generic'
  | 'auth_error_invalid'
  | 'auth_email_in_use'
  | 'auth_weak_password'
  | 'auth_remember'
  | 'auth_forgot_pass'
  | 'tool_img_code'
  | 'tool_icon_gen'
  | 'tool_prompt_enhancer'
  | 'tool_font_pairer'
  | 'tool_critique'
  | 'desc_img_code'
  | 'desc_icon_gen'
  | 'desc_prompt_enhancer'
  | 'desc_font_pairer'
  | 'desc_critique'
  | 'code_upload_label'
  | 'code_generate_btn'
  | 'code_preview_tab'
  | 'code_code_tab'
  | 'icon_prompt_placeholder'
  | 'icon_style_flat'
  | 'icon_style_outline'
  | 'icon_style_filled'
  | 'icon_style_gradient'
  | 'icon_generate_btn'
  | 'prompt_input_label'
  | 'prompt_enhance_btn'
  | 'prompt_result_label'
  | 'font_input_label'
  | 'font_pair_btn'
  | 'font_pair_title'
  | 'critique_upload_label'
  | 'critique_btn'
  | 'critique_result_title'
  // SETTINGS KEYS
  | 'settings_page_title'
  | 'settings_tab_general'
  | 'settings_tab_account'
  | 'settings_tab_security'
  | 'settings_tab_team'
  | 'settings_tab_billing'
  | 'settings_general_theme'
  | 'settings_general_lang'
  | 'settings_general_notifications'
  | 'settings_profile_header'
  | 'settings_profile_name'
  | 'settings_profile_email'
  | 'settings_profile_bio'
  | 'settings_security_password'
  | 'settings_security_2fa'
  | 'settings_security_sessions'
  | 'settings_team_header'
  | 'settings_team_invite'
  | 'settings_team_role'
  | 'settings_team_status'
  | 'settings_billing_plan'
  | 'settings_billing_usage'
  | 'settings_save_btn'
  | 'settings_cancel_btn'
  | 'settings_success_msg';

// CATEGORY A: Smart AI Tools (Powered by Gemini)
export const SMART_TOOLS_DATA: Tool[] = [
  {
    id: 'chat',
    icon: 'Bot',
    path: '/special/chat',
    titleEn: 'Super Chat',
    titleAr: 'الشات الخارق',
    descEn: 'Access Search, Maps, and Deep Thinking modes.',
    descAr: 'شات مدعوم ببحث جوجل، الخرائط، والتفكير العميق.',
    gradient: 'from-blue-600 to-indigo-600',
    colorTheme: 'indigo'
  },
  {
    id: 'img2code',
    icon: 'Code2',
    path: '/smart/img2code',
    titleEn: 'Screenshot to Code',
    titleAr: 'صورة إلى كود',
    descEn: 'Convert UI screenshots into clean HTML/Tailwind code.',
    descAr: 'حول صور التصاميم إلى كود HTML/Tailwind جاهز.',
    gradient: 'from-blue-500 to-cyan-500',
    colorTheme: 'cyan'
  },
  {
    id: 'icon_gen',
    icon: 'Shapes',
    path: '/smart/icons',
    titleEn: 'AI Icon Generator',
    titleAr: 'صانع الأيقونات',
    descEn: 'Generate custom vector SVG icons from text.',
    descAr: 'أنشئ أيقونات SVG فيكتور من خلال الوصف النصي.',
    gradient: 'from-violet-500 to-fuchsia-500',
    colorTheme: 'purple'
  },
  {
    id: 'vision',
    icon: 'ScanEye',
    path: '/special/vision',
    titleEn: 'Visual Analyst',
    titleAr: 'المحلل البصري',
    descEn: 'Deep understanding of images and videos using Gemini 3 Pro.',
    descAr: 'فهم وتحليل عميق للصور والفيديوهات.',
    gradient: 'from-amber-500 to-orange-600',
    colorTheme: 'gold'
  },
  {
    id: 'critique',
    icon: 'Glasses',
    path: '/smart/critique',
    titleEn: 'Design Critique',
    titleAr: 'مقيم التصاميم',
    descEn: 'Get AI feedback on your designs to improve UI/UX.',
    descAr: 'احصل على نقد بناء وملاحظات لتصاميمك لتحسينها.',
    gradient: 'from-red-500 to-rose-600',
    colorTheme: 'rose'
  },
  {
    id: 'marketing',
    icon: 'Megaphone',
    path: '/marketing',
    titleEn: 'Smart Marketing Creator',
    titleAr: 'صانع المحتوى التسويقي',
    descEn: 'Generate ready-to-publish ads, captions, and offers.',
    descAr: 'أنشئ نصوص إعلانية، بوستات إنستقرام، وعروض جاهزة للنشر.',
    gradient: 'from-pink-500 to-rose-500',
    colorTheme: 'pink'
  },
  {
    id: 'competitor',
    icon: 'Swords',
    path: '/competitor',
    titleEn: 'Competitor Analysis',
    titleAr: 'تحليل المنافسين',
    descEn: 'Analyze any competitor store or account instantly.',
    descAr: 'تحليل متكامل لأي متجر أو حساب منافس (نقاط القوة، الضعف، الجمهور).',
    gradient: 'from-violet-500 to-indigo-500',
    colorTheme: 'indigo'
  },
  {
    id: 'live',
    icon: 'AudioWaveform',
    path: '/special/live',
    titleEn: 'Live Conversation',
    titleAr: 'المحادثة الحية',
    descEn: 'Real-time voice interaction with Gemini 2.5.',
    descAr: 'تحدث مع الذكاء الاصطناعي صوتياً في الوقت الفعلي.',
    gradient: 'from-red-500 to-rose-600',
    colorTheme: 'red'
  },
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
    id: 'font',
    icon: 'Type',
    path: '/smart/fonts',
    titleEn: 'AI Font Pairer',
    titleAr: 'منسق الخطوط',
    descEn: 'Find the perfect Google Fonts combination for your project.',
    descAr: 'اكتشف أفضل ثنائيات الخطوط لمشروعك مع شرح الاستخدام.',
    gradient: 'from-emerald-500 to-teal-500',
    colorTheme: 'emerald'
  },
  {
    id: 'prompt',
    icon: 'Wand2',
    path: '/smart/prompt',
    titleEn: 'Prompt Enhancer',
    titleAr: 'محسن الأوامر',
    descEn: 'Turn simple text into professional prompts for Midjourney/DALL-E.',
    descAr: 'حول وصفك البسيط إلى أوامر احترافية لتوليد الصور.',
    gradient: 'from-blue-600 to-purple-600',
    colorTheme: 'purple'
  },
  {
    id: 'audio',
    icon: 'Mic2',
    path: '/special/audio',
    titleEn: 'Audio Lab',
    titleAr: 'مختبر الصوتيات',
    descEn: 'Professional Text-to-Speech and Audio Transcription.',
    descAr: 'تحويل النص إلى كلام وتفريغ التسجيلات الصوتية.',
    gradient: 'from-teal-500 to-emerald-600',
    colorTheme: 'emerald'
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
    id: 'pms',
    icon: 'Pipette',
    path: '/pms',
    titleEn: 'Pantone Converter',
    titleAr: 'محول بانتون',
    descEn: 'Find the closest matching PMS color for any hex code.',
    descAr: 'احصل على رقم Pantone المطابق لأي لون بدقة عالية.',
    gradient: 'from-orange-500 to-red-500',
    colorTheme: 'orange'
  }
];

// CATEGORY B: Special Utility Tools (Powered by Code/Libraries)
export const SPECIAL_TOOLS_DATA: Tool[] = [
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
    id: 'nutri',
    icon: 'ScrollText',
    path: '/nutrition',
    titleEn: 'Nutrition Label Maker',
    titleAr: 'صانع القيم الغذائية',
    descEn: 'Create professional FDA-style nutrition labels.',
    descAr: 'صمم ملصق الحقائق الغذائية الاحترافي لمنتجاتك بسهولة.',
    gradient: 'from-slate-600 to-teal-500',
    colorTheme: 'slate'
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
    id: 'social',
    icon: 'LayoutGrid',
    path: '/social-sizes',
    titleEn: 'Social Sizes',
    titleAr: 'مقاسات السوشيال ميديا',
    descEn: 'Ready-made templates for Instagram, TikTok, and more.',
    descAr: 'مقاسات جاهزة للتصاميم (Instagram, Story, TikTok).',
    gradient: 'from-teal-500 to-cyan-500',
    colorTheme: 'cyan'
  }
];