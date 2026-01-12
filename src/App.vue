<template>
  <!-- 主页面 -->
  <div v-if="isHomePage" class="container">
    <!-- 西安文化馆标题区域 -->
    <header class="header">
      <h1>西安历史文化数字体验</h1>
      <p class="subtitle">穿越千年古都，重现盛世长安</p>
      <p class="description">
        通过先进的AI生图技术，将您的形象融入西安历史文化场景，
        体验从秦汉到盛唐的千年文明，感受古都长安的历史魅力。
      </p>
      <div class="cultural-badge">
        <span>🏛️</span>
        <span>西安历史文化数字传承</span>
      </div>
    </header>

    <!-- 上传区域 -->
    <div class="upload-section">
      <!-- 人像照片上传 -->
      <div class="upload-card">
        <h3>
          <span>👤</span>
          上传您的人像照片
        </h3>
        <div 
          class="upload-area"
          :class="{ dragover: isDragging }"
          @click="triggerFileInput"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <input 
            ref="fileInput" 
            type="file" 
            accept="image/*" 
            style="display: none"
            @change="handleFileSelect"
          >
          <div v-if="!sourceImage">
            <div class="upload-icon">📸</div>
            <p class="upload-text">点击或拖拽上传您的人像照片</p>
            <p class="upload-hint">请确保照片中人脸清晰可见</p>
            <p class="upload-hint">支持 JPG、PNG 格式，建议尺寸不超过5MB</p>
          </div>
          <div v-else>
            <img :src="sourceImage" alt="您的照片" class="preview-image">
            <p style="margin-top: 15px; color: var(--dark-bronze); font-weight: 500;">
              点击重新选择照片
            </p>
          </div>
        </div>
      </div>

    </div>

    <!-- 自定义选项 -->
    <div class="advanced-options">
      <h3>
        <span>⚙️</span>
        自定义选项
        <button class="toggle-btn" @click="showAdvanced = !showAdvanced">
          {{ showAdvanced ? '收起' : '展开' }}
        </button>
      </h3>
      
      <div v-show="showAdvanced" class="options-grid">
        <!-- 人像保留度 -->
        <div class="option-group">
          <label>人像保留度（关键）</label>
          <select v-model="customOptions.preservation">
            <option v-for="option in availableOptions.preservation" :key="option.id" :value="option.id">
              {{ option.name }} - {{ option.description }}
            </option>
          </select>
          <small class="option-hint">{{ getPreservationHint(customOptions.preservation) }}</small>
        </div>

        <!-- 人物身份 -->
        <div class="option-group">
          <label>人物身份</label>
          <select v-model="customOptions.identity">
            <option v-for="identity in availableOptions.identity" :key="identity.id" :value="identity.id">
              {{ identity.name }} - {{ identity.description }}
            </option>
          </select>
        </div>

        <!-- 西安名胜背景 -->
        <div class="option-group">
          <label>西安名胜背景</label>
          <select v-model="customOptions.landmark">
            <option v-for="landmark in availableOptions.landmarks" :key="landmark.id" :value="landmark.id">
              {{ landmark.name }} - {{ landmark.description }}
            </option>
          </select>
        </div>

        <!-- 古风服饰搭配 -->
        <div class="option-group">
          <label>古风服饰搭配</label>
          <select v-model="customOptions.costume">
            <option v-for="costume in availableOptions.costumes" :key="costume.id" :value="costume.id">
              {{ costume.name }} - {{ costume.description }}
            </option>
          </select>
        </div>

        <!-- 历史风格氛围 -->
        <div class="option-group">
          <label>历史风格氛围</label>
          <select v-model="customOptions.style">
            <option v-for="style in availableOptions.styles" :key="style.id" :value="style.id">
              {{ style.name }} - {{ style.description }}
            </option>
          </select>
        </div>

        <!-- 光影与色彩 -->
        <div class="option-group">
          <label>光影与色彩</label>
          <select v-model="customOptions.lighting">
            <option v-for="lighting in availableOptions.lighting" :key="lighting.id" :value="lighting.id">
              {{ lighting.name }} - {{ lighting.description }}
            </option>
          </select>
        </div>

        <!-- 画质设置 -->
        <div class="option-group">
          <label>画质设置</label>
          <select v-model="customOptions.quality">
            <option v-for="quality in availableOptions.quality" :key="quality.id" :value="quality.id">
              {{ quality.name }} - {{ quality.description }}
            </option>
          </select>
        </div>

        <!-- 构图方式 -->
        <div class="option-group">
          <label>构图方式</label>
          <select v-model="customOptions.composition">
            <option v-for="comp in availableOptions.composition" :key="comp.id" :value="comp.id">
              {{ comp.name }} - {{ comp.description }}
            </option>
          </select>
        </div>

        <!-- 自定义提示词 -->
        <div class="option-group full-width">
          <label>自定义描述（可选）</label>
          <textarea 
            v-model="customOptions.customPrompt" 
            placeholder="添加您希望的特殊效果或细节描述..."
            rows="3"
          ></textarea>
        </div>
      </div>

      <!-- 智能推荐 -->
      <div class="smart-recommendations">
        <h4>💡 智能推荐组合</h4>
        <div class="recommendation-grid">
          <button 
            v-for="(combo, key) in SMART_COMBINATIONS" 
            :key="key"
            :class="['recommendation-btn', { selected: selectedRecommendation === combo }]"
            @click="applySmartCombination(combo)"
          >
            <strong>{{ combo.name }}</strong>
            <span>{{ combo.description }}</span>
          </button>
        </div>
      </div>

      <!-- 影视剧系列模板 -->
      <div class="tv-series-templates">
        <div class="section-header">
          <div class="section-title">
            <span>🎬</span>
            <span>影视剧系列模板</span>
          </div>
          <button class="collapse-btn" @click="showTvTemplates = !showTvTemplates">
            <span class="btn-icon">{{ showTvTemplates ? '📁' : '📂' }}</span>
            <span class="btn-text">{{ showTvTemplates ? '收起' : '展开' }}</span>
          </button>
        </div>
        
        <!-- 收起状态的模板预览标签 -->
        <div v-if="!showTvTemplates" class="collapsed-preview">
          <div class="template-tags">
            <span 
              v-for="(template, key) in TV_SERIES_TEMPLATES" 
              :key="key"
              :class="['template-tag', { active: selectedTvTemplate === key }]"
              @click="selectTvTemplate(key, template); showTvTemplates = true"
            >
              {{ template.poster }} {{ template.name }}
            </span>
          </div>
        </div>
        
        <p v-show="showTvTemplates" class="template-description">基于热门古装剧的专业提示词，独立生成，不受自定义选项影响</p>
        
        <div v-show="showTvTemplates">
          <!-- 性别选择 -->
          <div class="gender-selection">
            <label class="gender-label">选择性别：</label>
            <div class="gender-buttons">
              <button 
                :class="['gender-btn', { active: selectedGender === 'male' }]"
                @click="selectedGender = 'male'"
              >
                👨 男性
              </button>
              <button 
                :class="['gender-btn', { active: selectedGender === 'female' }]"
                @click="selectedGender = 'female'"
              >
                👩 女性
              </button>
            </div>
          </div>

          <div class="template-grid">
            <div 
              v-for="(template, key) in TV_SERIES_TEMPLATES" 
              :key="key"
              :class="['template-card', { selected: selectedTvTemplate === key }]"
            >
              <div class="template-header">
                <span class="template-poster">{{ template.poster }}</span>
                <div class="template-info">
                  <h5>{{ template.name }}</h5>
                  <p>{{ template.description }}</p>
                </div>
                <button 
                  class="select-template-btn"
                  @click="selectTvTemplate(key, template)"
                >
                  {{ selectedTvTemplate === key ? '已选择' : '选择' }}
                </button>
              </div>
              
              <div class="template-prompt">
                <div class="prompt-preview">
                  <strong>{{ selectedGender === 'male' ? '男性' : '女性' }}版提示词预览：</strong>
                  <p>{{ getTemplatePrompt(key, selectedGender).substring(0, 100) }}...</p>
                </div>
                
                <div class="prompt-actions">
                  <button 
                    class="edit-prompt-btn"
                    @click="editTemplate(key)"
                  >
                    ✏️ 编辑提示词
                  </button>
                  <button 
                    class="reset-prompt-btn"
                    @click="resetTemplate(key)"
                    v-if="customTemplatePrompts[key + '_' + selectedGender]"
                  >
                    🔄 重置
                  </button>
                </div>
              </div>

              <!-- 编辑提示词区域 -->
              <div v-if="editingTemplate === key" class="prompt-editor">
                <div class="editor-header">
                  <strong>编辑 {{ selectedGender === 'male' ? '男性' : '女性' }} 版提示词：</strong>
                </div>
                <textarea 
                  v-model="customTemplatePrompts[key + '_' + selectedGender]"
                  :placeholder="template[selectedGender].prompt"
                  rows="6"
                  class="prompt-textarea"
                ></textarea>
                <div class="editor-actions">
                  <button @click="saveTemplate(key)" class="save-btn">保存</button>
                  <button @click="cancelEdit()" class="cancel-btn">取消</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 陶俑艺术风格模板 -->
      <div class="ceramic-art-templates">
        <div class="section-header">
          <div class="section-title">
            <span>🏺</span>
            <span>陶俑艺术风格模板</span>
          </div>
          <button class="collapse-btn ceramic-collapse" @click="showCeramicTemplates = !showCeramicTemplates">
            <span class="btn-icon">{{ showCeramicTemplates ? '📁' : '📂' }}</span>
            <span class="btn-text">{{ showCeramicTemplates ? '收起' : '展开' }}</span>
          </button>
        </div>
        
        <!-- 收起状态的模板预览标签 -->
        <div v-if="!showCeramicTemplates" class="collapsed-preview">
          <div class="template-tags">
            <span 
              v-for="(template, key) in CERAMIC_ART_TEMPLATES" 
              :key="key"
              :class="['template-tag ceramic-tag', { active: selectedCeramicTemplate === key }]"
              @click="selectCeramicTemplate(key, template); showCeramicTemplates = true"
            >
              {{ template.poster }} {{ template.name }}
            </span>
          </div>
        </div>
        
        <p v-show="showCeramicTemplates" class="template-description">将您的人像转换为中国传统陶瓷艺术风格，体验千年陶艺之美</p>
        
        <div v-show="showCeramicTemplates">
          <!-- 性别选择 -->
          <div class="gender-selection">
            <label class="gender-label">选择性别：</label>
            <div class="gender-buttons">
              <button 
                :class="['gender-btn', { active: selectedGender === 'male' }]"
                @click="selectedGender = 'male'"
              >
                👨 男性
              </button>
              <button 
                :class="['gender-btn', { active: selectedGender === 'female' }]"
                @click="selectedGender = 'female'"
              >
                👩 女性
              </button>
            </div>
          </div>

          <div class="template-grid">
            <div 
              v-for="(template, key) in CERAMIC_ART_TEMPLATES" 
              :key="key"
              :class="['template-card ceramic-card', { selected: selectedCeramicTemplate === key }]"
            >
              <div class="template-header">
                <span class="template-poster">{{ template.poster }}</span>
                <div class="template-info">
                  <h5>{{ template.name }}</h5>
                  <p>{{ template.description }}</p>
                </div>
                <button 
                  class="select-template-btn ceramic-btn"
                  @click="selectCeramicTemplate(key, template)"
                >
                  {{ selectedCeramicTemplate === key ? '已选择' : '选择' }}
                </button>
              </div>
              
              <div class="template-prompt">
                <div class="prompt-preview">
                  <strong>{{ selectedGender === 'male' ? '男性' : '女性' }}版提示词预览：</strong>
                  <p>{{ getCeramicTemplatePrompt(key, selectedGender).substring(0, 100) }}...</p>
                </div>
                
                <div class="prompt-actions">
                  <button 
                    class="edit-prompt-btn"
                    @click="editCeramicTemplate(key)"
                  >
                    ✏️ 编辑提示词
                  </button>
                  <button 
                    class="reset-prompt-btn"
                    @click="resetCeramicTemplate(key)"
                    v-if="customTemplatePrompts['ceramic_' + key + '_' + selectedGender]"
                  >
                    🔄 重置
                  </button>
                </div>
              </div>

              <!-- 编辑提示词区域 -->
              <div v-if="editingTemplate === 'ceramic_' + key" class="prompt-editor">
                <div class="editor-header">
                  <strong>编辑 {{ template.name }} {{ selectedGender === 'male' ? '男性' : '女性' }} 版提示词：</strong>
                </div>
                <textarea 
                  v-model="customTemplatePrompts['ceramic_' + key + '_' + selectedGender]"
                  :placeholder="template[selectedGender].prompt"
                  rows="6"
                  class="prompt-textarea"
                ></textarea>
                <div class="editor-actions">
                  <button @click="saveCeramicTemplate(key)" class="save-btn">保存</button>
                  <button @click="cancelEdit()" class="cancel-btn">取消</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 生成按钮 -->
    <div class="action-section">
      <button 
        class="generate-btn" 
        :disabled="!canGenerate || isGenerating"
        @click="generateHistoricalImage"
      >
        <span v-if="isGenerating" class="loading-spinner"></span>
        {{ isGenerating ? '正在创造历史奇迹...' : '开始穿越时空' }}
      </button>
      <p v-if="canGenerate && !isGenerating" style="margin-top: 15px; color: var(--text-light); opacity: 0.8;">
        点击按钮，见证您与西安历史文化的奇妙融合
      </p>
      
      <!-- 生成进度提示 -->
      <div v-if="isGenerating" class="generation-progress">
        <div class="progress-steps">
          <div class="step active">📸 处理人像图片</div>
          <div class="step active">🎨 构建文化场景</div>
          <div class="step active">🤖 AI智能生成中...</div>
          <div class="step">✨ 即将完成</div>
        </div>
        <p class="progress-tip">预计需要30-60秒，请耐心等待...</p>
      </div>
    </div>

    <!-- 结果展示区域 -->
    <div v-if="resultImage" class="result-section">
      <h3>🎭 您的西安历史文化体验</h3>
      <div class="result-container">
        <div class="result-image-container">
          <img :src="resultImage" alt="历史文化体验结果" class="result-image">
        </div>
        
        <div class="result-info">
          <!-- 二维码区域 -->
          <div v-if="qrCodeUrl" class="qr-section">
            <div class="qr-container">
              <img :src="qrCodeUrl" alt="扫码直接下载" class="qr-code">
              <p class="qr-text">扫码直接下载</p>
            </div>
          </div>
          
          <div class="experience-details">
            <h4>📋 体验详情</h4>
            <div class="detail-item">
              <span class="label">人物身份:</span>
              <span class="value">{{ getIdentityName(customOptions.identity) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">历史背景:</span>
              <span class="value">{{ getLandmarkName(customOptions.landmark) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">服饰风格:</span>
              <span class="value">{{ getCostumeName(customOptions.costume) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">生成时间:</span>
              <span class="value">{{ formatCurrentTime() }}</span>
            </div>
            <div class="detail-item">
              <span class="label">图片尺寸:</span>
              <span class="value">{{ getDisplaySize(customOptions.quality) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">生成模型:</span>
              <span class="value">豆包 SeedDream 4.5</span>
            </div>
            <div class="detail-item">
              <span class="label">人像保留:</span>
              <span class="value">{{ getPreservationName(customOptions.preservation) }}</span>
            </div>
          </div>
          
          <div class="download-options">
            <button class="download-btn primary" @click="downloadResult">
              📥 下载高清图片
            </button>
            <button class="download-btn secondary" @click="shareToSocial">
              📤 分享体验
            </button>
            <button class="download-btn secondary" @click="regenerateImage">
              🔄 重新生成
            </button>
          </div>
        </div>
      </div>
      
      <div class="experience-footer">
        <p>* 此图片为AI生成的历史文化体验作品，仅供文化传承和教育使用</p>
        <p>* 图片将保存24小时，请及时下载保存</p>
      </div>
    </div>


    <!-- 错误提示 -->
    <div v-if="errorMessage" class="error-message">
      <strong>⚠️ 处理遇到问题</strong><br>
      {{ errorMessage }}
      <br><small>请检查图片格式或稍后重试</small>
    </div>
  </div>

  <!-- 下载页面 -->
  <DownloadPage v-else-if="isDownloadPage" />
  
  <!-- 图片查看页面 -->
  <ImageViewer v-else-if="isViewPage" />
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { imageGenerationAPI } from './api/faceFusion.js'
import { currentRoute, matchRoute } from './router.js'
import { MUSEUM_CONFIG } from './config/museum.js'
import { generateXianCulturalPrompt, generateCeramicArtPrompt, getAvailableOptions, SMART_COMBINATIONS, getRecommendedOptionsForIdentity, TV_SERIES_TEMPLATES, CERAMIC_ART_TEMPLATES } from './config/prompts.js'
import DownloadPage from './components/DownloadPage.vue'
import ImageViewer from './components/ImageViewer.vue'

export default {
  name: 'XianCulturalApp',
  components: {
    DownloadPage,
    ImageViewer
  },
  setup() {
    const sourceImage = ref(null)
    const resultImage = ref(null)
    const qrCodeUrl = ref(null)
    const sourceFile = ref(null)
    const isDragging = ref(false)
    const isGenerating = ref(false)
    const errorMessage = ref('')
    const showAdvanced = ref(false)
    const showTvTemplates = ref(false)
    const showCeramicTemplates = ref(false)
    const selectedRecommendation = ref(null)
    const selectedTvTemplate = ref(null)
    const selectedCeramicTemplate = ref(null)
    const selectedGender = ref('male') // 默认选择男性
    const editingTemplate = ref(null)
    const customTemplatePrompts = ref({})
    
    const fileInput = ref(null)

    // 自定义选项
    const customOptions = ref({
      preservation: 'balanced_blend',
      identity: 'scholar',
      landmark: 'big_wild_goose_pagoda',
      costume: 'tang',
      style: 'ancient_realistic',
      lighting: 'warm_sunset_backlight',
      quality: 'ultra_hd_8k',
      composition: 'centered_portrait',
      customPrompt: ''
    })

    // 可用选项
    const availableOptions = ref(getAvailableOptions())

    // 监听角色变化，自动推荐服饰
    watch(() => customOptions.value.identity, (newIdentity) => {
      const recommended = getRecommendedOptionsForIdentity(newIdentity)
      if (recommended.costume) {
        customOptions.value.costume = recommended.costume
      }
      if (recommended.lighting) {
        customOptions.value.lighting = recommended.lighting
      }
    })

    // 路由计算属性
    const isHomePage = computed(() => matchRoute('/'))
    const isDownloadPage = computed(() => matchRoute('/download'))
    const isViewPage = computed(() => matchRoute('/view'))

    const canGenerate = computed(() => {
      return sourceImage.value && !isGenerating.value
    })

    const triggerFileInput = () => {
      fileInput.value.click()
    }

    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (file) {
        processFile(file)
      }
    }

    const handleDrop = (event) => {
      isDragging.value = false
      const file = event.dataTransfer.files[0]
      if (file && file.type.startsWith('image/')) {
        processFile(file)
      }
    }

    const processFile = (file) => {
      // 检查文件大小（5MB限制）
      if (file.size > 5 * 1024 * 1024) {
        errorMessage.value = '图片文件过大，请选择小于5MB的图片'
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        sourceImage.value = e.target.result
        sourceFile.value = file
        errorMessage.value = ''
      }
      reader.onerror = () => {
        errorMessage.value = '图片读取失败，请重新选择'
      }
      reader.readAsDataURL(file)
    }

    const getPreservationHint = (preservationType) => {
      const hints = {
        'high_fidelity': '适用场景：想要人像辨识度高的用户',
        'costume_background_only': '适用场景：想要更融入古风场景的用户',
        'balanced_blend': '适用场景：追求自然融合效果的用户'
      }
      return hints[preservationType] || ''
    }

    const applySmartCombination = (combination) => {
      customOptions.value = {
        ...combination.config,
        customPrompt: customOptions.value.customPrompt // 保留用户的自定义提示词
      }
      
      // 清除所有模板选择
      selectedTvTemplate.value = null
      selectedCeramicTemplate.value = null
      
      // 设置当前选中的推荐组合
      selectedRecommendation.value = combination
      
      // 3秒后清除选中状态（仅视觉反馈）
      setTimeout(() => {
        selectedRecommendation.value = null
      }, 3000)
    }

    // 影视剧模板相关方法
    const selectTvTemplate = (key, template) => {
      selectedTvTemplate.value = key
      selectedCeramicTemplate.value = null // 清除陶俑模板选择
      selectedRecommendation.value = null // 清除智能推荐选择
      
      // 视觉反馈：3秒后清除选中动画状态，但保持选择
      setTimeout(() => {
        // 这里不清除选择，只是为了视觉反馈
      }, 3000)
    }

    // 陶俑模板相关方法
    const selectCeramicTemplate = (key, template) => {
      selectedCeramicTemplate.value = key
      selectedTvTemplate.value = null // 清除影视剧模板选择
      selectedRecommendation.value = null // 清除智能推荐选择
      
      console.log('选择陶俑模板:', key, '当前选中:', selectedCeramicTemplate.value)
      
      // 视觉反馈：3秒后清除选中动画状态，但保持选择
      setTimeout(() => {
        // 这里不清除选择，只是为了视觉反馈
        console.log('3秒后，陶俑模板仍然选中:', selectedCeramicTemplate.value)
      }, 3000)
    }

    const editTemplate = (key) => {
      editingTemplate.value = key
      const templateKey = key + '_' + selectedGender.value
      if (!customTemplatePrompts.value[templateKey]) {
        customTemplatePrompts.value[templateKey] = TV_SERIES_TEMPLATES[key][selectedGender.value].prompt
      }
    }

    const editCeramicTemplate = (key) => {
      editingTemplate.value = 'ceramic_' + key
      const templateKey = 'ceramic_' + key + '_' + selectedGender.value
      if (!customTemplatePrompts.value[templateKey]) {
        customTemplatePrompts.value[templateKey] = CERAMIC_ART_TEMPLATES[key][selectedGender.value].prompt
      }
    }

    const saveTemplate = (key) => {
      editingTemplate.value = null
    }

    const saveCeramicTemplate = (key) => {
      editingTemplate.value = null
    }

    const cancelEdit = () => {
      editingTemplate.value = null
    }

    const resetTemplate = (key) => {
      const templateKey = key + '_' + selectedGender.value
      delete customTemplatePrompts.value[templateKey]
      editingTemplate.value = null
    }

    const resetCeramicTemplate = (key) => {
      const templateKey = 'ceramic_' + key + '_' + selectedGender.value
      delete customTemplatePrompts.value[templateKey]
      editingTemplate.value = null
    }

    const getTemplatePrompt = (key, gender = null) => {
      const genderToUse = gender || selectedGender.value
      const templateKey = key + '_' + genderToUse
      return customTemplatePrompts.value[templateKey] || TV_SERIES_TEMPLATES[key][genderToUse].prompt
    }

    const getCeramicTemplatePrompt = (key, gender = null) => {
      const genderToUse = gender || selectedGender.value
      const templateKey = 'ceramic_' + key + '_' + genderToUse
      return customTemplatePrompts.value[templateKey] || CERAMIC_ART_TEMPLATES[key][genderToUse].prompt
    }

    const generateHistoricalImage = async () => {
      if (!sourceFile.value) {
        errorMessage.value = '请上传人像照片'
        return
      }
      
      isGenerating.value = true
      errorMessage.value = ''
      
      try {
        let fullPrompt = ''
        
        // 检查是否选择了影视剧模板
        if (selectedTvTemplate.value) {
          // 使用影视剧模板的独立提示词
          fullPrompt = getTemplatePrompt(selectedTvTemplate.value, selectedGender.value)
          console.log('使用影视剧模板:', selectedTvTemplate.value, '性别:', selectedGender.value, fullPrompt.substring(0, 150) + '...')
        } else if (selectedCeramicTemplate.value) {
          // 使用陶俑艺术模板的专门提示词生成函数
          fullPrompt = generateCeramicArtPrompt(selectedCeramicTemplate.value, selectedGender.value, customTemplatePrompts.value)
          console.log('使用陶俑艺术模板:', selectedCeramicTemplate.value, '性别:', selectedGender.value, fullPrompt.substring(0, 150) + '...')
        } else {
          // 使用自定义选项生成提示词
          const promptOptions = {
            preservation: customOptions.value.preservation,
            identity: customOptions.value.identity,
            landmark: customOptions.value.landmark,
            costume: customOptions.value.costume,
            style: customOptions.value.style,
            lighting: customOptions.value.lighting,
            quality: customOptions.value.quality,
            composition: customOptions.value.composition,
            customPrompt: customOptions.value.customPrompt
          }
          
          console.log('用户选择的选项:', promptOptions)
          
          // 生成完整的提示词
          fullPrompt = generateXianCulturalPrompt(promptOptions)
          
          console.log('生成的完整提示词:', fullPrompt.substring(0, 150) + '...')
        }
        
        console.log('开始生成图像:', {
          isTemplate: !!(selectedTvTemplate.value || selectedCeramicTemplate.value),
          templateKey: selectedTvTemplate.value || selectedCeramicTemplate.value,
          templateType: selectedTvTemplate.value ? 'tv_series' : (selectedCeramicTemplate.value ? 'ceramic_art' : 'custom'),
          prompt: fullPrompt.substring(0, 150) + '...',
          fullPromptLength: fullPrompt.length
        })
        
        // 构建豆包API参数
        const apiOptions = {
          size: (selectedTvTemplate.value || selectedCeramicTemplate.value) ? '4K' : getImageSize(customOptions.value.quality),
          watermark: (selectedTvTemplate.value || selectedCeramicTemplate.value) ? false : shouldAddWatermark(customOptions.value),
          preservation: (selectedTvTemplate.value || selectedCeramicTemplate.value) ? 'balanced_blend' : customOptions.value.preservation,
          style: (selectedTvTemplate.value || selectedCeramicTemplate.value) ? 'cinematic_epic' : customOptions.value.style
        }
        
        // 调用豆包API生成图像
        const result = await imageGenerationAPI.generateImage(
          sourceFile.value, 
          fullPrompt, 
          apiOptions
        )
        
        // 设置生成结果
        resultImage.value = result.imageUrl
        
        // 生成二维码URL（用于直接下载）
        generateQRCode(result.imageUrl)
        
        console.log('图像生成成功:', {
          resultId: result.resultId,
          imageUrl: result.imageUrl ? '已获取' : '未获取',
          model: result.model,
          size: result.size
        })
        
        // 滚动到结果区域
        setTimeout(() => {
          const resultSection = document.querySelector('.result-section')
          if (resultSection) {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
        
      } catch (error) {
        console.error('图片生成失败:', error)
        
        // 根据错误类型提供更具体的错误信息
        let errorMsg = '历史文化体验创建失败，请重试'
        
        if (error.message.includes('API key')) {
          errorMsg = 'API密钥配置错误，请检查配置'
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMsg = '网络连接失败，请检查网络后重试'
        } else if (error.message.includes('timeout')) {
          errorMsg = '生成超时，请稍后重试'
        } else if (error.message.includes('size') || error.message.includes('format')) {
          errorMsg = '图片格式或大小不符合要求，请重新选择'
        } else if (error.message) {
          errorMsg = error.message
        }
        
        errorMessage.value = errorMsg
      } finally {
        isGenerating.value = false
      }
    }

    // 辅助函数：根据质量设置获取图像尺寸
    const getImageSize = (quality) => {
      const sizeMap = {
        'ultra_hd_8k': '4K',
        'high_detail': '2K', 
        'texture_clear': '2K'
      }
      return sizeMap[quality] || '2K'
    }

    // 辅助函数：判断是否添加水印
    const shouldAddWatermark = (options) => {
      // 人像保留度高的情况下不添加水印
      if (options.preservation === 'high_fidelity') {
        return false
      }
      // 艺术风格的不添加水印
      if (options.style === 'tang_gongbi' || options.style === 'qin_han_ink') {
        return false
      }
      return true // 默认添加水印
    }

    // 辅助函数：获取显示尺寸
    const getDisplaySize = (quality) => {
      const sizeMap = {
        'ultra_hd_8k': '4096 × 4096 像素 (4K)',
        'high_detail': '2048 × 2048 像素 (2K)', 
        'texture_clear': '2048 × 2048 像素 (2K)'
      }
      return sizeMap[quality] || '2048 × 2048 像素 (2K)'
    }

    // 辅助函数：获取人像保留度名称
    const getPreservationName = (preservation) => {
      const nameMap = {
        'high_fidelity': '高度还原',
        'costume_background_only': '服饰背景替换',
        'balanced_blend': '平衡融合'
      }
      return nameMap[preservation] || '平衡融合'
    }

    // 辅助函数：获取人物身份名称
    const getIdentityName = (identity) => {
      const identityOptions = availableOptions.value.identity
      const option = identityOptions.find(opt => opt.id === identity)
      return option ? option.name : '文人学者'
    }

    // 辅助函数：获取地标名称
    const getLandmarkName = (landmark) => {
      const landmarkOptions = availableOptions.value.landmarks
      const option = landmarkOptions.find(opt => opt.id === landmark)
      return option ? option.name : '大雁塔'
    }

    // 生成二维码
    const generateQRCode = (imageUrl) => {
      // 使用更可靠的二维码生成服务
      // 方案1: 使用 qr-server.com (更稳定)
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&format=png&data=${encodeURIComponent(imageUrl)}`
      
      // 方案2: 如果上面不行，可以尝试这个
      // const qrApiUrl = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(imageUrl)}`
      
      qrCodeUrl.value = qrApiUrl
      
      console.log('二维码生成成功，扫码可直接下载:', imageUrl)
      console.log('二维码URL:', qrApiUrl)
      
      // 测试二维码是否可以正常加载
      const testImg = new Image()
      testImg.onload = () => {
        console.log('✅ 二维码图片加载成功')
      }
      testImg.onerror = () => {
        console.error('❌ 二维码图片加载失败，尝试备用方案')
        // 备用方案：使用Google Charts API
        const backupQrUrl = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(imageUrl)}`
        qrCodeUrl.value = backupQrUrl
      }
      testImg.src = qrApiUrl
    }

    // 辅助函数：获取服饰名称
    const getCostumeName = (costume) => {
      const costumeOptions = availableOptions.value.costumes
      const option = costumeOptions.find(opt => opt.id === costume)
      return option ? option.name : '唐代服饰'
    }

    const downloadResult = () => {
      if (resultImage.value) {
        const link = document.createElement('a')
        link.href = resultImage.value
        link.download = `西安历史文化体验-${new Date().toLocaleDateString()}.jpg`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    }

    const shareToSocial = async () => {
      const shareData = {
        title: '我的西安历史文化体验',
        text: '看看我的西安历史文化数字体验！穿越千年古都，感受盛世长安的历史魅力。',
        url: window.location.href
      }

      if (navigator.share) {
        try {
          await navigator.share(shareData)
        } catch (error) {
          console.log('分享取消或失败')
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

    const regenerateImage = () => {
      if (canGenerate.value) {
        generateHistoricalImage()
      }
    }

    const formatCurrentTime = () => {
      return new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // 初始化
    onMounted(() => {
      console.log('✅ 豆包API已配置，可以开始生成图像')
    })

    return {
      sourceImage,
      resultImage,
      qrCodeUrl,
      isDragging,
      isGenerating,
      errorMessage,
      showAdvanced,
      showTvTemplates,
      showCeramicTemplates,
      selectedRecommendation,
      selectedTvTemplate,
      selectedCeramicTemplate,
      selectedGender,
      editingTemplate,
      customTemplatePrompts,
      customOptions,
      availableOptions,
      canGenerate,
      isHomePage,
      isDownloadPage,
      isViewPage,
      fileInput,
      SMART_COMBINATIONS,
      TV_SERIES_TEMPLATES,
      CERAMIC_ART_TEMPLATES,
      triggerFileInput,
      handleFileSelect,
      handleDrop,
      generateHistoricalImage,
      downloadResult,
      shareToSocial,
      regenerateImage,
      formatCurrentTime,
      getPreservationHint,
      applySmartCombination,
      selectTvTemplate,
      selectCeramicTemplate,
      editTemplate,
      editCeramicTemplate,
      saveTemplate,
      saveCeramicTemplate,
      cancelEdit,
      resetTemplate,
      resetCeramicTemplate,
      getTemplatePrompt,
      getCeramicTemplatePrompt,
      getImageSize,
      shouldAddWatermark,
      getDisplaySize,
      getPreservationName,
      getIdentityName,
      getLandmarkName,
      getCostumeName,
      generateQRCode
    }
  }
}
</script>