<template>
  <div class="download-page">
    <div class="download-container">
      <div class="header">
        <h1>🎭 文化遗产体验下载</h1>
        <p class="subtitle">您的专属文化纪念照</p>
      </div>

      <div v-if="loading" class="loading-section">
        <div class="loading-spinner"></div>
        <p>正在准备您的图片...</p>
      </div>

      <div v-else-if="imageData" class="image-section">
        <div class="image-container">
          <img :src="imageData" alt="文化遗产体验照片" class="result-image">
        </div>
        
        <div class="download-actions">
          <button @click="downloadImage" class="download-btn primary">
            📥 下载高清图片
          </button>
          <button @click="shareImage" class="download-btn secondary">
            📤 分享到社交媒体
          </button>
        </div>

        <div class="info-section">
          <h3>📋 图片信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">生成时间:</span>
              <span class="value">{{ formatDate(new Date()) }}</span>
            </div>
            <div class="info-item">
              <span class="label">图片尺寸:</span>
              <span class="value">800 × 800 像素</span>
            </div>
            <div class="info-item">
              <span class="label">文件格式:</span>
              <span class="value">JPEG 高质量</span>
            </div>
            <div class="info-item">
              <span class="label">体验类型:</span>
              <span class="value">文化遗产数字融合</span>
            </div>
          </div>
        </div>

        <div class="tips-section">
          <h3>💡 使用提示</h3>
          <ul>
            <li>图片已优化，适合打印和分享</li>
            <li>建议保存到相册作为珍贵纪念</li>
            <li>可用于制作个性化文创产品</li>
            <li>请尊重文化遗产，合理使用图片</li>
          </ul>
        </div>
      </div>

      <div v-else class="error-section">
        <div class="error-icon">❌</div>
        <h3>图片未找到</h3>
        <p>抱歉，无法找到您要下载的图片。可能的原因：</p>
        <ul>
          <li>链接已过期（图片保存期限为24小时）</li>
          <li>链接地址不正确</li>
          <li>图片正在处理中，请稍后再试</li>
        </ul>
        <button @click="goBack" class="download-btn secondary">
          🔙 返回体验页面
        </button>
      </div>

      <div class="footer">
        <p>© 文化遗产数字体验馆 - 让历史文化在数字时代重新焕发光彩</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { imageGenerationAPI } from '../api/faceFusion.js'

export default {
  name: 'DownloadPage',
  setup() {
    const loading = ref(true)
    const imageData = ref(null)
    const resultId = ref(null)

    onMounted(() => {
      // 从URL参数获取结果ID
      const urlParams = new URLSearchParams(window.location.search)
      const id = urlParams.get('id') || window.location.pathname.split('/').pop()
      
      if (id && id !== 'download') {
        resultId.value = id
        loadImage(id)
      } else {
        loading.value = false
      }
    })

    const loadImage = (id) => {
      try {
        const data = imageGenerationAPI.getImageByResultId(id)
        if (data) {
          imageData.value = data
        }
      } catch (error) {
        console.error('加载图片失败:', error)
      } finally {
        loading.value = false
      }
    }

    const downloadImage = () => {
      if (imageData.value) {
        const link = document.createElement('a')
        link.href = imageData.value
        link.download = `文化遗产体验-${formatDate(new Date(), 'file')}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }

    const shareImage = async () => {
      if (navigator.share && imageData.value) {
        try {
          // 将base64转换为blob
          const response = await fetch(imageData.value)
          const blob = await response.blob()
          const file = new File([blob], '文化遗产体验.jpg', { type: 'image/jpeg' })
          
          await navigator.share({
            title: '我的文化遗产体验',
            text: '看看我与历史文物的奇妙融合！',
            files: [file]
          })
        } catch (error) {
          console.log('分享失败，使用备用方案')
          fallbackShare()
        }
      } else {
        fallbackShare()
      }
    }

    const fallbackShare = () => {
      // 备用分享方案：复制链接
      const shareUrl = window.location.href
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert('链接已复制到剪贴板，您可以分享给朋友！')
        })
      } else {
        // 更老的浏览器备用方案
        const textArea = document.createElement('textarea')
        textArea.value = shareUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        alert('链接已复制到剪贴板！')
      }
    }

    const goBack = () => {
      window.history.back() || (window.location.href = '/')
    }

    const formatDate = (date, type = 'display') => {
      if (type === 'file') {
        return date.toISOString().slice(0, 19).replace(/:/g, '-')
      }
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    return {
      loading,
      imageData,
      downloadImage,
      shareImage,
      goBack,
      formatDate
    }
  }
}
</script>

<style scoped>
.download-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #2c1810 0%, #8b4513 50%, #d2691e 100%);
  background-attachment: fixed;
  padding: 20px;
}

.download-container {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(250, 248, 243, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(44, 24, 16, 0.5);
  border: 2px solid #d4af37;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  color: #2c1810;
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.subtitle {
  color: #8b4513;
  font-size: 1.2rem;
  opacity: 0.8;
}

.loading-section {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(212, 175, 55, 0.3);
  border-top: 4px solid #d4af37;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.image-section {
  text-align: center;
}

.image-container {
  margin-bottom: 30px;
}

.result-image {
  max-width: 100%;
  max-height: 500px;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(44, 24, 16, 0.3);
  border: 4px solid #d4af37;
}

.download-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.download-btn {
  padding: 15px 30px;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 180px;
}

.download-btn.primary {
  background: linear-gradient(135deg, #d4af37, #b8860b);
  color: #2c1810;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
}

.download-btn.secondary {
  background: linear-gradient(135deg, #cd7f32, #8b4513);
  color: #f5f5dc;
  box-shadow: 0 4px 15px rgba(139, 69, 19, 0.4);
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.info-section, .tips-section {
  text-align: left;
  margin-bottom: 30px;
  padding: 25px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 12px;
  border: 1px solid #d4af37;
}

.info-section h3, .tips-section h3 {
  color: #2c1810;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(212, 175, 55, 0.3);
}

.label {
  font-weight: 600;
  color: #8b4513;
}

.value {
  color: #2c1810;
}

.tips-section ul {
  list-style: none;
  padding: 0;
}

.tips-section li {
  padding: 8px 0;
  padding-left: 25px;
  position: relative;
  color: #2c1810;
}

.tips-section li::before {
  content: '✨';
  position: absolute;
  left: 0;
}

.error-section {
  text-align: center;
  padding: 40px 20px;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.error-section h3 {
  color: #d32f2f;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.error-section p {
  color: #2c1810;
  margin-bottom: 15px;
}

.error-section ul {
  text-align: left;
  max-width: 400px;
  margin: 0 auto 30px;
  color: #8b4513;
}

.footer {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(212, 175, 55, 0.3);
  color: #8b4513;
  font-size: 0.9rem;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .download-container {
    padding: 20px;
    margin: 10px;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .download-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>