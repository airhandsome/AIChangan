// AI图像生成API服务
// 基于火山引擎豆包大模型的图生图服务

class ImageGenerationAPI {
  constructor() {
    this.baseURL = 'https://ark.cn-beijing.volces.com/api/v3/images/generations'
    this.apiKey = import.meta.env.VITE_DOUBAO_API_KEY || '63f37f51-0b5c-4c62-abe5-2d30af2fccb5'
    this.model = import.meta.env.VITE_DOUBAO_MODEL || 'doubao-seedream-4-5-251128'
    this.mockMode = import.meta.env.VITE_MOCK_MODE === 'true' || false // 默认关闭模拟模式
  }

  /**
   * 生成历史文化图像 - 使用火山引擎豆包大模型
   * @param {File} sourceImage - 用户上传的人像图片
   * @param {string} prompt - 完整的提示词
   * @param {Object} options - 生成选项
   * @returns {Promise<Object>} 生成结果
   */
  async generateImage(sourceImage, prompt, options = {}) {
    if (this.mockMode) {
      return this.mockGenerateImage(sourceImage, prompt, options)
    }

    try {
      // 首先处理图片
      console.log('开始处理图片文件:', {
        name: sourceImage.name,
        size: Math.round(sourceImage.size / 1024) + 'KB',
        type: sourceImage.type
      })
      
      const imageUrl = await this.uploadImageToTempStorage(sourceImage)
      
      // 构建请求体
      const requestBody = {
        model: this.model,
        prompt: prompt,
        image: imageUrl,
        sequential_image_generation: "disabled",
        response_format: "url",
        size: options.size || "2K",
        stream: false,
        watermark: options.watermark !== false
      }

      console.log('发送请求到豆包API:', {
        url: this.baseURL,
        model: this.model,
        prompt: prompt.substring(0, 100) + '...',
        size: requestBody.size,
        watermark: requestBody.watermark,
        imageSize: Math.round(imageUrl.length / 1024) + 'KB'
      })

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      })

      console.log('豆包API响应状态:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('豆包API错误响应:', errorText)
        
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        try {
          const errorData = JSON.parse(errorText)
          if (errorData.error?.message) {
            errorMessage = errorData.error.message
          } else if (errorData.message) {
            errorMessage = errorData.message
          }
        } catch (e) {
          // 如果不是JSON格式，使用原始错误文本
          if (errorText) {
            errorMessage = errorText
          }
        }
        
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log('豆包API响应结果:', {
        hasData: !!result.data,
        dataLength: result.data?.length || 0,
        firstImageUrl: result.data?.[0]?.url ? '已获取' : '未获取'
      })
      
      // 豆包API返回格式处理
      if (result.data && result.data.length > 0) {
        const imageData = result.data[0]
        const finalResult = {
          imageUrl: imageData.url,
          resultId: this.generateResultId(),
          prompt: prompt,
          options: options,
          timestamp: Date.now(),
          model: this.model,
          size: requestBody.size
        }
        
        console.log('图像生成成功:', {
          resultId: finalResult.resultId,
          imageUrl: finalResult.imageUrl ? '已获取URL' : '未获取URL',
          model: finalResult.model,
          size: finalResult.size
        })
        
        return finalResult
      } else {
        console.error('API返回数据格式异常:', result)
        throw new Error('API返回数据格式异常，未找到生成的图片')
      }

    } catch (error) {
      console.error('豆包API调用详细错误:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      
      // 根据错误类型提供更友好的错误信息
      let friendlyMessage = error.message
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        friendlyMessage = '网络连接失败，请检查网络连接后重试'
      } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        friendlyMessage = 'API密钥无效，请检查配置'
      } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
        friendlyMessage = 'API访问被拒绝，请检查权限配置'
      } else if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
        friendlyMessage = 'API调用频率过高，请稍后重试'
      } else if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
        friendlyMessage = '服务器内部错误，请稍后重试'
      }
      
      throw new Error(friendlyMessage)
    }
  }

  /**
   * 上传图片到临时存储或转换为可访问的URL
   * 豆包API需要图片URL，这里我们转换为base64格式
   */
  async uploadImageToTempStorage(file) {
    try {
      // 对于豆包API，我们直接使用base64格式
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result
          console.log('图片转换为base64成功，大小:', Math.round(result.length / 1024), 'KB')
          resolve(result)
        }
        reader.onerror = (error) => {
          console.error('图片读取失败:', error)
          reject(new Error('图片读取失败'))
        }
        reader.readAsDataURL(file)
      })
    } catch (error) {
      console.error('图片处理失败:', error)
      throw new Error('图片处理失败: ' + error.message)
    }
  }

  /**
   * 生成结果ID
   */
  generateResultId() {
    return `doubao_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 模拟图像生成（开发模式）
   */
  async mockGenerateImage(sourceImage, prompt, options = {}) {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000))

    // 随机选择一个模拟结果图片 - 更符合西安文化主题
    const mockImages = [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1024&q=80', // 兵马俑风格
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=1024&q=80', // 古建筑
      'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1024&q=80', // 古典人物
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=1024&q=80', // 历史场景
      'https://images.unsplash.com/photo-1576020799627-aeac74d58064?w=1024&q=80', // 古代建筑
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1024&q=80'  // 文化遗产
    ]

    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)]
    const resultId = this.generateResultId()

    // 模拟偶尔的失败
    if (Math.random() < 0.05) { // 降低失败率到5%
      throw new Error('模拟API错误：服务暂时不可用，请稍后重试')
    }

    console.log('模拟豆包API响应:', {
      resultId,
      prompt: prompt.substring(0, 50) + '...',
      size: options.size || '2K'
    })

    return {
      imageUrl: randomImage,
      resultId: resultId,
      prompt: prompt,
      options: options,
      timestamp: Date.now(),
      model: this.model,
      size: options.size || '2K'
    }
  }

  /**
   * 获取生成历史
   */
  async getGenerationHistory(limit = 10) {
    if (this.mockMode) {
      return this.mockGetHistory(limit)
    }

    try {
      const response = await fetch(`${this.baseURL}/history?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('获取历史记录失败:', error)
      return []
    }
  }

  /**
   * 模拟获取历史记录
   */
  mockGetHistory(limit = 10) {
    const mockHistory = []
    for (let i = 0; i < Math.min(limit, 5); i++) {
      mockHistory.push({
        resultId: `mock_${Date.now() - i * 60000}_${Math.random().toString(36).substr(2, 9)}`,
        imageUrl: `https://images.unsplash.com/photo-${1578662996442 + i}?w=400&q=80`,
        prompt: `模拟历史记录 ${i + 1}`,
        timestamp: Date.now() - i * 60000,
        options: {
          artStyle: 'realistic',
          lighting: 'golden_hour',
          season: 'autumn'
        }
      })
    }
    return mockHistory
  }

  /**
   * 根据结果ID获取图片
   */
  async getImageByResultId(resultId) {
    if (this.mockMode) {
      return this.mockGetImageById(resultId)
    }

    try {
      const response = await fetch(`${this.baseURL}/result/${resultId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result.imageUrl
    } catch (error) {
      console.error('获取图片失败:', error)
      return null
    }
  }

  /**
   * 模拟根据ID获取图片
   */
  mockGetImageById(resultId) {
    if (resultId && resultId.startsWith('mock_')) {
      return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1024&q=80'
    }
    return null
  }

  /**
   * 检查豆包API服务状态
   */
  async checkServiceStatus() {
    if (this.mockMode) {
      return {
        status: 'ok',
        provider: 'doubao-mock',
        model: this.model,
        message: '模拟模式运行中'
      }
    }

    try {
      // 豆包API没有专门的状态检查端点，我们可以发送一个简单的测试请求
      const testRequestBody = {
        model: this.model,
        prompt: "test prompt",
        image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", // 1x1像素透明图片
        size: "1K",
        stream: false
      }

      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(testRequestBody)
      })

      if (response.ok) {
        return {
          status: 'ok',
          provider: 'doubao',
          model: this.model,
          message: '豆包API服务正常'
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        return {
          status: 'error',
          provider: 'doubao',
          model: this.model,
          message: errorData.error?.message || `HTTP ${response.status}`
        }
      }
    } catch (error) {
      console.error('豆包API状态检查失败:', error)
      return {
        status: 'error',
        provider: 'doubao',
        model: this.model,
        message: error.message
      }
    }
  }

  /**
   * 获取推荐的生成参数 - 豆包API专用
   */
  getRecommendedParams(scenario = 'default') {
    const params = {
      default: {
        size: '2K',
        watermark: true,
        sequential_image_generation: 'disabled'
      },
      portrait: {
        size: '1K', // 人像推荐较小尺寸
        watermark: false, // 人像照片不加水印
        sequential_image_generation: 'disabled'
      },
      landscape: {
        size: '4K', // 风景推荐大尺寸
        watermark: true,
        sequential_image_generation: 'disabled'
      },
      artistic: {
        size: '2K',
        watermark: false, // 艺术作品不加水印
        sequential_image_generation: 'disabled'
      },
      high_quality: {
        size: '4K', // 最高质量
        watermark: false,
        sequential_image_generation: 'disabled'
      }
    }

    return params[scenario] || params.default
  }

  /**
   * 获取支持的豆包模型列表
   */
  getSupportedModels() {
    return [
      {
        id: 'doubao-seedream-4-5-251128',
        name: '豆包 SeedDream 4.5',
        description: '火山引擎最新图像生成模型，支持图生图',
        features: ['高质量图像', '图生图', '中文理解优秀', '快速生成']
      }
    ]
  }

  /**
   * 获取支持的图片尺寸
   */
  getSupportedSizes() {
    return [
      { id: '1K', name: '1K (1024x1024)', description: '标准尺寸，生成速度快' },
      { id: '2K', name: '2K (2048x2048)', description: '高清尺寸，推荐使用' },
      { id: '4K', name: '4K (4096x4096)', description: '超高清尺寸，细节丰富' }
    ]
  }
}

// 创建单例实例
export const imageGenerationAPI = new ImageGenerationAPI()

// 兼容性导出（保持原有的faceFusionAPI名称）
export const faceFusionAPI = imageGenerationAPI

// 默认导出
export default imageGenerationAPI

// 工具函数：验证图片文件
export function validateImageFile(file) {
  const errors = []
  
  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    errors.push('不支持的文件格式，请使用 JPG、PNG 或 WebP 格式')
  }
  
  // 检查文件大小（5MB限制）
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    errors.push('文件过大，请选择小于5MB的图片')
  }
  
  // 检查文件名
  if (!file.name || file.name.length > 100) {
    errors.push('文件名无效或过长')
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  }
}

// 工具函数：压缩图片
export function compressImage(file, maxWidth = 1024, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // 计算新尺寸
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      canvas.width = width
      canvas.height = height
      
      // 绘制并压缩
      ctx.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            reject(new Error('图片压缩失败'))
          }
        },
        'image/jpeg',
        quality
      )
    }
    
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = URL.createObjectURL(file)
  })
}

// 工具函数：生成缩略图
export function generateThumbnail(file, size = 200) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = size
      canvas.height = size
      
      // 计算裁剪区域（居中裁剪）
      const { width, height } = img
      const minDimension = Math.min(width, height)
      const x = (width - minDimension) / 2
      const y = (height - minDimension) / 2
      
      ctx.drawImage(img, x, y, minDimension, minDimension, 0, 0, size, size)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob))
          } else {
            reject(new Error('缩略图生成失败'))
          }
        },
        'image/jpeg',
        0.7
      )
    }
    
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = URL.createObjectURL(file)
  })
}