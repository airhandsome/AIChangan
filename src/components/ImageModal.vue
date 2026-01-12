<template>
  <div v-if="visible" class="image-modal-overlay" @click="closeModal">
    <div class="image-modal" @click.stop>
      <!-- 关闭按钮 -->
      <button class="close-btn" @click="closeModal">
        <span>✕</span>
      </button>
      
      <!-- 图片容器 -->
      <div class="modal-image-container">
        <img 
          :src="imageUrl" 
          :alt="imageAlt" 
          class="modal-image"
          @load="onImageLoad"
          @error="onImageError"
        >
        
        <!-- 加载状态 -->
        <div v-if="loading" class="modal-loading">
          <div class="loading-spinner"></div>
          <p>正在加载图片...</p>
        </div>
        
        <!-- 错误状态 -->
        <div v-if="error" class="modal-error">
          <div class="error-icon">❌</div>
          <p>图片加载失败</p>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="modal-actions">
        <button @click="downloadImage" class="modal-btn primary">
          📥 下载图片
        </button>
        <button @click="openInNewTab" class="modal-btn secondary">
          🔗 新窗口打开
        </button>
        <button @click="shareImage" class="modal-btn secondary">
          📤 分享图片
        </button>
      </div>
      
      <!-- 图片信息 -->
      <div v-if="showInfo" class="modal-info">
        <h4>{{ imageTitle || '西安历史文化体验作品' }}</h4>
        <p v-if="imageDescription">{{ imageDescription }}</p>
        <div class="info-details">
          <span class="info-item">生成时间: {{ formatCurrentTime() }}</span>
          <span class="info-item">技术支持: 豆包AI图像生成</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'ImageModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    imageUrl: {
      type: String,
      required: true
    },
    imageAlt: {
      type: String,
      default: '图片预览'
    },
    imageTitle: {
      type: String,
      default: ''
    },
    imageDescription: {
      type: String,
      default: ''
    },
    showInfo: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const loading = ref(true)
    const error = ref(false)

    // 监听visible变化，重置状态
    watch(() => props.visible, (newVisible) => {
      if (newVisible) {
        loading.value = true
        error.value = false
      }
    })

    // 监听imageUrl变化，重置状态
    watch(() => props.imageUrl, () => {
      if (props.visible) {
        loading.value = true
        error.value = false
      }
    })

    const closeModal = () => {
      emit('close')
    }

    const onImageLoad = () => {
      loading.value = false
      error.value = false
    }

    const onImageError = () => {
      loading.value = false
      error.value = true
      console.error('图片加载失败:', props.imageUrl)
    }

    const downloadImage = () => {
      if (props.imageUrl) {
        const link = document.createElement('a')
        link.href = props.imageUrl
        link.download = `西安历史文化体验-${formatCurrentTime('file')}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }

    const openInNewTab = () => {
      if (props.imageUrl) {
        window.open(props.imageUrl, '_blank')
      }
    }

    const shareImage = async () => {
      const shareData = {
        title: props.imageTitle || '我的西安历史文化体验作品',
        text: '看看我的西安历史文化数字体验作品！',
        url: props.imageUrl
      }

      if (navigator.share) {
        try {
          await navigator.share(shareData)
        } catch (error) {
          console.log('分享失败，使用备用方案')
          fallbackShare(shareData)
        }
      } else {
        fallbackShare(shareData)
      }
    }

    const fallbackShare = (shareData) => {
      const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`
      
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
          alert('分享内容已复制到剪贴板！')
        })
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = shareText
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        alert('分享内容已复制到剪贴板！')
      }
    }

    const formatCurrentTime = (type = 'display') => {
      const now = new Date()
      if (type === 'file') {
        return now.toISOString().slice(0, 19).replace(/:/g, '-')
      }
      return now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // ESC键关闭模态框
    const handleKeydown = (event) => {
      if (event.key === 'Escape' && props.visible) {
        closeModal()
      }
    }

    // 添加键盘事件监听
    watch(() => props.visible, (newVisible) => {
      if (newVisible) {
        document.addEventListener('keydown', handleKeydown)
        // 防止背景滚动
        document.body.style.overflow = 'hidden'
      } else {
        document.removeEventListener('keydown', handleKeydown)
        // 恢复背景滚动
        document.body.style.overflow = ''
      }
    })

    return {
      loading,
      error,
      closeModal,
      onImageLoad,
      onImageError,
      downloadImage,
      openInNewTab,
      shareImage,
      formatCurrentTime
    }
  }
}
</script>

<style scoped>
.image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: overlayFadeIn 0.3s ease;
}

@keyframes overlayFadeIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(10px);
  }
}

.image-modal {
  position: relative;
  max-width: 95vw;
  max-height: 95vh;
  background: rgba(250, 248, 243, 0.98);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 3px solid var(--primary-gold);
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: modalSlideIn 0.4s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(50px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(139, 69, 19, 0.8);
  color: var(--text-light);
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s ease;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: var(--accent-red);
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(211, 47, 47, 0.4);
}

.modal-image-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  max-height: 60vh;
  overflow: hidden;
  border-radius: 15px;
  background: rgba(212, 175, 55, 0.1);
}

.modal-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(44, 24, 16, 0.3);
  border: 2px solid var(--primary-gold);
  transition: transform 0.3s ease;
}

.modal-image:hover {
  transform: scale(1.02);
}

.modal-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: var(--text-dark);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(212, 175, 55, 0.3);
  border-top: 4px solid var(--primary-gold);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.modal-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: var(--accent-red);
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.modal-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.modal-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.modal-btn.primary {
  background: linear-gradient(135deg, var(--primary-gold), var(--secondary-gold));
  color: var(--text-dark);
  box-shadow: 0 4px 15px var(--shadow-warm);
}

.modal-btn.secondary {
  background: linear-gradient(135deg, var(--bronze), var(--dark-bronze));
  color: var(--text-light);
  box-shadow: 0 4px 15px rgba(139, 69, 19, 0.4);
}

.modal-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.modal-info {
  text-align: center;
  padding: 20px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 12px;
  border: 1px solid var(--bronze);
}

.modal-info h4 {
  color: var(--text-dark);
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.modal-info p {
  color: var(--dark-bronze);
  margin: 0 0 15px 0;
  line-height: 1.4;
}

.info-details {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.info-item {
  color: var(--dark-bronze);
  font-size: 0.9rem;
  opacity: 0.8;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .image-modal {
    padding: 20px;
    margin: 10px;
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 20px);
  }
  
  .modal-image-container {
    max-height: 50vh;
    min-height: 200px;
  }
  
  .modal-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .modal-btn {
    width: 100%;
    max-width: 200px;
  }
  
  .info-details {
    flex-direction: column;
    gap: 10px;
  }
  
  .close-btn {
    top: 10px;
    right: 10px;
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .image-modal {
    padding: 15px;
  }
  
  .modal-info h4 {
    font-size: 1.1rem;
  }
  
  .modal-btn {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
}
</style>