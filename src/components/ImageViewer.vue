<template>
  <div class="image-viewer">
    <div class="viewer-container">
      <div class="header">
        <h1>🖼️ 西安历史文化体验作品</h1>
        <button @click="goBack" class="back-btn">
          🔙 返回
        </button>
      </div>

      <div v-if="loading" class="loading-section">
        <div class="loading-spinner"></div>
        <p>正在加载图片...</p>
      </div>

      <div v-else-if="imageUrl" class="image-section">
        <div class="image-container">
          <img :src="imageUrl" alt="西安历史文化体验作品" class="full-image" @load="onImageLoad" @error="onImageError">
        </div>
        
        <div class="image-actions">
          <button @click="downloadImage" class="action-btn primary">
            📥 下载图片
          </button>
          <button @click="shareImage" class="action-btn secondary">
            📤 分享图片
          </button>
          <button @click="viewOriginalSize" class="action-btn secondary">
            🔍 查看原图
          </button>
        </div>

        <div class="image-info">
          <h3>📋 作品信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">生成时间:</span>
              <span class="value">{{ formatDate(new Date()) }}</span>
            </div>
            <div class="info-item">
              <span class="label">作品类型:</span>
              <span class="value">西安历史文化数字体验</span>
            </div>
            <div class="info-item">
              <span class="label">技术支持:</span>
              <span class="value">豆包AI图像生成</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="error-section">
        <div class="error-icon">❌</div>
        <h3>图片加载失败</h3>
        <p>抱歉，无法加载您要查看的图片。可能的原因：</p>
        <ul>
          <li>图片链接已失效</li>
          <li>网络连接问题</li>
          <li>图片文件损坏</li>
        </ul>
        <button @click="goBack" class="action-btn secondary">
          🔙 返回主页
        </button>
      </div>

      <div class="footer">
        <p>© 西安历史文化数字体验馆 - 让历史文化在数字时代重新焕发光彩</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'ImageViewer',
  setup() {
    const loading = ref(true)
    const imageUrl = ref(null)
    const imageLoaded = ref(false)

    onMounted(() => {
      // 从URL参数获取图片地址
      const urlParams = new URLSearchParams(window.location.search)
      const imgParam = urlParams.get('img')
      
      if (imgParam) {
        imageUrl.value = decodeURIComponent(imgParam)
        loading.value = false
      } else {
        loading.value = false
      }
    })

    const onImageLoad = () => {
      imageLoaded.value = true
    }

    const onImageError = () => {
      console.error('图片加载失败:', imageUrl.value)
    }

    const downloadImage = () => {
      if (imageUrl.value) {
        const link = document.createElement('a')
        link.href = imageUrl.value
        link.download = `西安历史文化体验-${formatDate(new Date(), 'file')}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }

    const shareImage = async () => {
      if (navigator.share && imageUrl.value) {
        try {
          await navigator.share({
            title: '我的西安历史文化体验作品',
            text: '看看我的西安历史文化数字体验作品！',
            url: window.location.href
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
      const shareUrl = window.location.href
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert('链接已复制到剪贴板，您可以分享给朋友！')
        })
      }
    }

    const viewOriginalSize = () => {
      if (imageUrl.value) {
        window.open(imageUrl.value, '_blank')
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
      imageUrl,
      imageLoaded,
      onImageLoad,
      onImageError,
      downloadImage,
      shareImage,
      viewOriginalSize,
      goBack,
      formatDate
    }
  }
}
</script>

<style scoped>
.image-viewer {
  min-height: 100vh;
  background: linear-gradient(135deg, #2c1810 0%, #8b4513 50%, #d2691e 100%);
  background-attachment: fixed;
  padding: 20px;
}

.viewer-container {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(250, 248, 243, 0.95);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(44, 24, 16, 0.5);
  border: 2px solid #d4af37;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
}

.header h1 {
  color: #2c1810;
  font-size: 2rem;
  margin: 0;
  font-weight: 700;
}

.back-btn {
  background: linear-gradient(135deg, #cd7f32, #8b4513);
  color: #f5f5dc;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(139, 69, 19, 0.4);
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
  display: flex;
  justify-content: center;
}

.full-image {
  max-width: 100%;
  max-height: 70vh;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(44, 24, 16, 0.3);
  border: 4px solid #d4af37;
}

.image-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 15px 30px;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
}

.action-btn.primary {
  background: linear-gradient(135deg, #d4af37, #b8860b);
  color: #2c1810;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
}

.action-btn.secondary {
  background: linear-gradient(135deg, #cd7f32, #8b4513);
  color: #f5f5dc;
  box-shadow: 0 4px 15px rgba(139, 69, 19, 0.4);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.image-info {
  text-align: left;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 12px;
  padding: 25px;
  border: 1px solid #d4af37;
}

.image-info h3 {
  color: #2c1810;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
  .viewer-container {
    padding: 20px;
    margin: 10px;
  }
  
  .header h1 {
    font-size: 1.5rem;
  }
  
  .header {
    flex-direction: column;
    text-align: center;
  }
  
  .image-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>