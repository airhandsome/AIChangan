// 西安历史文化数字体验馆配置文件

export const MUSEUM_CONFIG = {
  // 基本信息配置
  info: {
    name: '西安历史文化数字体验馆',
    subtitle: '穿越千年古都，重现盛世长安',
    description: '通过先进的AI生图技术，将您的形象融入西安历史文化场景，体验从秦汉到盛唐的千年文明，感受古都长安的历史魅力。',
    logo: '/assets/xian-logo.png', // 可替换为实际logo路径
    website: 'https://xian-cultural-experience.com',
    contact: '029-xxx-xxxx'
  },

  // 主题配置
  theme: {
    primary: '#d4af37',      // 主色调-金色
    secondary: '#8b4513',    // 辅助色-古铜色
    accent: '#cd7f32',       // 强调色-青铜色
    background: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&q=80',
    fonts: {
      primary: '"Noto Serif SC", serif',
      secondary: '"Inter", sans-serif'
    }
  },

  // 西安文化体验场景配置
  experiences: [
    {
      id: 'tang_emperor',
      name: '盛唐天子',
      description: '体验唐代皇帝的威严华贵，感受盛世长安的辉煌',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80',
      category: '皇室体验',
      period: '唐朝 (618-907年)',
      location: '大明宫',
      featured: true,
      promptConfig: {
        preservation: 'balanced_blend',
        landmark: 'daming_palace',
        costume: 'tang',
        style: 'ancient_realistic',
        lighting: 'warm_sunset_backlight',
        quality: 'ultra_hd_8k',
        composition: 'centered_portrait'
      }
    },
    {
      id: 'terracotta_warrior',
      name: '兵马俑武士',
      description: '化身秦代武士，感受千军万马的震撼',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80',
      category: '军事体验',
      period: '秦朝 (公元前221-206年)',
      location: '兵马俑博物馆',
      featured: true,
      promptConfig: {
        preservation: 'costume_background_only',
        landmark: 'terracotta_warriors',
        costume: 'qin',
        style: 'documentary_quality',
        lighting: 'qin_earth_dark',
        quality: 'high_detail',
        composition: 'centered_portrait'
      }
    },
    {
      id: 'tang_noble_lady',
      name: '唐代贵妃',
      description: '重现盛唐美人的雍容华贵，体验宫廷生活',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80',
      category: '宫廷体验',
      period: '唐朝 (618-907年)',
      location: '华清池',
      featured: true,
      promptConfig: {
        preservation: 'high_fidelity',
        landmark: 'huaqing_palace',
        costume: 'tang',
        style: 'tang_gongbi',
        lighting: 'palace_lantern_night',
        quality: 'ultra_hd_8k',
        composition: 'rule_of_thirds'
      }
    },
    {
      id: 'tang_scholar',
      name: '文人雅士',
      description: '体验古代文人的儒雅风采，感受书香气息',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&q=80',
      category: '文化体验',
      period: '唐朝 (618-907年)',
      location: '书院门',
      featured: true,
      promptConfig: {
        preservation: 'high_fidelity',
        landmark: 'bell_drum_towers',
        costume: 'ming',
        style: 'changan_street_life',
        lighting: 'morning_mist_soft',
        quality: 'texture_clear',
        composition: 'background_blur'
      }
    },
    {
      id: 'buddhist_monk',
      name: '佛门弟子',
      description: '感受佛教文化的宁静祥和，体验禅意人生',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=80',
      category: '宗教体验',
      period: '唐朝 (618-907年)',
      location: '法门寺',
      featured: false,
      promptConfig: {
        preservation: 'balanced_blend',
        landmark: 'famen_temple',
        costume: 'tang',
        style: 'ancient_realistic',
        lighting: 'morning_mist_soft',
        quality: 'ultra_hd_8k',
        composition: 'background_blur'
      }
    },
    {
      id: 'han_emperor',
      name: '汉室天子',
      description: '体验汉代皇帝的文治武功，感受汉唐雄风',
      image: 'https://images.unsplash.com/photo-1576020799627-aeac74d58064?w=400&q=80',
      category: '皇室体验',
      period: '汉朝 (公元前206-220年)',
      location: '汉阳陵',
      featured: false,
      promptConfig: {
        preservation: 'balanced_blend',
        landmark: 'han_yang_ling',
        costume: 'han',
        style: 'documentary_quality',
        lighting: 'warm_sunset_backlight',
        quality: 'ultra_hd_8k',
        composition: 'wide_angle_panoramic'
      }
    }
  ],

  // 用户体验配置
  experience: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
    processingTimeout: 30000, // 30秒
    autoScrollToResult: true,
    showProcessingAnimation: true,
    enableSocialShare: true,
    enablePrint: true
  },

  // 展览模式配置
  exhibition: {
    kioskMode: false,           // 展览亭模式
    autoResetTimer: 300000,     // 5分钟自动重置
    showInstructions: true,     // 显示操作说明
    enableQueue: false,         // 排队功能
    maxConcurrentUsers: 1,      // 最大并发用户数
    screensaverTimeout: 60000,  // 屏保超时时间
    fullscreenMode: false       // 全屏模式
  },

  // 数据统计配置
  analytics: {
    enabled: true,
    trackUploads: true,
    trackDownloads: true,
    trackArtifactPopularity: true,
    trackUserDemographics: false, // 需要用户同意
    exportInterval: 'daily'       // daily, weekly, monthly
  },

  // 多语言配置
  i18n: {
    defaultLanguage: 'zh-CN',
    supportedLanguages: ['zh-CN', 'en-US', 'ja-JP', 'ko-KR'],
    autoDetect: true
  },

  // 安全和隐私配置
  privacy: {
    showPrivacyPolicy: true,
    requireConsent: true,
    autoDeleteImages: true,
    deleteAfterMinutes: 30,
    encryptTransmission: true,
    logAccess: true
  },

  // API配置 - 改为AI生图服务
  api: {
    provider: 'stable_diffusion', // stable_diffusion, midjourney, dalle, custom
    timeout: 60000, // 生图需要更长时间
    retryAttempts: 3,
    fallbackToMock: true, // 开发模式下回退到模拟API
    rateLimit: {
      enabled: true,
      maxRequests: 50, // 生图API调用限制更严格
      windowMs: 3600000 // 1小时
    },
    imageGeneration: {
      width: 1024,
      height: 1024,
      steps: 30,
      cfg_scale: 7.5,
      sampler: 'DPM++ 2M Karras'
    }
  },

  // 设备适配配置
  device: {
    touchOptimized: true,
    minScreenWidth: 1024,
    minScreenHeight: 768,
    supportMobile: true,
    supportTablet: true,
    preventZoom: true,
    disableContextMenu: true
  }
}

// 获取特色体验
export function getFeaturedExperiences() {
  return MUSEUM_CONFIG.experiences.filter(experience => experience.featured)
}

// 获取所有体验分类
export function getExperienceCategories() {
  const categories = [...new Set(MUSEUM_CONFIG.experiences.map(experience => experience.category))]
  return categories
}

// 根据ID获取体验信息
export function getExperienceById(id) {
  return MUSEUM_CONFIG.experiences.find(experience => experience.id === id)
}

// 获取主题样式
export function getThemeStyles() {
  const { theme } = MUSEUM_CONFIG
  return {
    '--primary-gold': theme.primary,
    '--secondary-gold': theme.secondary,
    '--bronze': theme.accent,
    '--background-image': `url(${theme.background})`,
    '--font-primary': theme.fonts.primary,
    '--font-secondary': theme.fonts.secondary
  }
}

// 检查设备兼容性
export function checkDeviceCompatibility() {
  const { device } = MUSEUM_CONFIG
  const screenWidth = window.screen.width
  const screenHeight = window.screen.height
  
  return {
    compatible: screenWidth >= device.minScreenWidth && screenHeight >= device.minScreenHeight,
    touchSupported: 'ontouchstart' in window,
    screenSize: { width: screenWidth, height: screenHeight },
    recommendations: screenWidth < device.minScreenWidth ? 
      ['建议使用更大的显示设备以获得最佳体验'] : []
  }
}

export default MUSEUM_CONFIG