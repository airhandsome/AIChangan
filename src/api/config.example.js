// 豆包AI图像生成API配置示例
// 复制此文件为 config.js 并填入你的实际配置

export const DOUBAO_API_CONFIG = {
  // 豆包API配置
  apiKey: '你的豆包API密钥', // 从火山引擎控制台获取
  model: 'doubao-seedream-4-5-251128', // 豆包模型名称
  baseURL: 'https://ark.cn-beijing.volces.com/api/v3/images/generations',
  
  // 默认生成参数
  defaultParams: {
    size: '2K', // 1K, 2K, 4K
    watermark: true, // 是否添加水印
    sequential_image_generation: 'disabled', // 是否启用序列生成
    response_format: 'url', // 返回格式：url 或 b64_json
    stream: false // 是否流式返回
  },

  // 图片上传配置
  imageUpload: {
    // 方案1: 使用base64 (适合小图片 < 2MB)
    useBase64: true,
    maxBase64Size: 2 * 1024 * 1024, // 2MB
    
    // 方案2: 上传到对象存储 (推荐生产环境)
    uploadEndpoint: '/api/upload-temp-image', // 你的图片上传接口
    storageService: 'tos', // tos(火山引擎), oss(阿里云), cos(腾讯云)
    
    // 火山引擎TOS配置示例
    tosConfig: {
      region: 'cn-beijing',
      bucket: 'your-bucket-name',
      accessKeyId: 'your-access-key-id',
      accessKeySecret: 'your-access-key-secret'
    }
  },

  // 质量与性能配置
  quality: {
    // 不同场景的推荐参数
    scenarios: {
      portrait: { size: '1K', watermark: false },
      landscape: { size: '4K', watermark: true },
      artistic: { size: '2K', watermark: false },
      high_quality: { size: '4K', watermark: false }
    }
  },

  // 错误处理配置
  errorHandling: {
    maxRetries: 3, // 最大重试次数
    retryDelay: 1000, // 重试延迟(毫秒)
    timeout: 60000 // 请求超时(毫秒)
  }
}

// 环境变量配置说明
export const ENV_VARIABLES = {
  // 在 .env 文件中设置以下变量：
  VITE_DOUBAO_API_KEY: '你的豆包API密钥',
  VITE_DOUBAO_MODEL: 'doubao-seedream-4-5-251128',
  VITE_MOCK_MODE: 'false', // 设置为 false 启用真实API调用
  
  // 可选配置
  VITE_UPLOAD_ENDPOINT: '/api/upload-temp-image',
  VITE_TOS_REGION: 'cn-beijing',
  VITE_TOS_BUCKET: 'your-bucket-name'
}

// 使用说明
export const USAGE_GUIDE = {
  setup: [
    '1. 在火山引擎控制台创建应用并获取API密钥',
    '2. 复制 config.example.js 为 config.js',
    '3. 在 .env 文件中设置 VITE_DOUBAO_API_KEY',
    '4. 如果使用对象存储，配置相应的上传服务',
    '5. 设置 VITE_MOCK_MODE=false 启用真实API'
  ],
  
  apiLimits: [
    '图片大小限制：最大10MB',
    '支持格式：JPEG, PNG, WebP',
    '生成尺寸：1K(1024x1024), 2K(2048x2048), 4K(4096x4096)',
    'API调用频率限制：请参考火山引擎文档'
  ],
  
  bestPractices: [
    '使用2K尺寸平衡质量和速度',
    '人像照片建议关闭水印',
    '大图片使用对象存储而非base64',
    '实现图片结果的持久化存储',
    '添加适当的错误处理和重试机制'
  ]
}

export default DOUBAO_API_CONFIG