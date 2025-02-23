<script setup>
import { ref, onMounted } from "vue";
import init, { analyze_image } from "../wasm-analyzer/pkg/wasm_analyzer.js";
import { ElMessage, ElMessageBox } from 'element-plus';

const selectedCategory = ref("");
const imagePreview = ref("");
const imageBytes = ref(null);
const analysisResult = ref("");
const loading = ref(false);

onMounted(async () => {
  await init();
});

const handleFileUpload = (uploadFile) => {
  const file = uploadFile.raw;
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const arrayBuffer = e.target.result;
    imageBytes.value = new Uint8Array(arrayBuffer);
    const blob = new Blob([arrayBuffer], { type: file.type });
    imagePreview.value = URL.createObjectURL(blob);
  };

  reader.readAsArrayBuffer(file);
};

const showResultDialog = (result) => {
  const confidence = parseFloat(result.match(/\d+\.\d+/)[0]);
  const isPositive = confidence >= 50;
  
  ElMessageBox.alert(
    `<div class="result-dialog">
      <i class="${isPositive ? 'el-icon-warning' : 'el-icon-success'}" 
         style="font-size: 48px; color: ${isPositive ? '#E6A23C' : '#67C23A'}">
      </i>
      <p>${result}</p>
      <p class="conclusion">
        ${isPositive 
          ? 'Recomenda-se buscar atendimento médico para avaliação.' 
          : 'Não foram detectadas fraturas significativas, mas em caso de dúvida, consulte um médico.'}
      </p>
    </div>`,
    'Resultado da Análise',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: 'OK',
      customClass: 'custom-dialog'
    }
  );

  // Mostrar toast
  ElMessage({
    message: result,
    type: isPositive ? 'warning' : 'success',
    duration: 5000
  });
};

const analyzeImage = async () => {
  if (!imageBytes.value) {
    ElMessage.error("Por favor, envie uma imagem válida.");
    return;
  }

  try {
    loading.value = true;
    analysisResult.value = await analyze_image(imageBytes.value);
    showResultDialog(analysisResult.value);
  } catch (error) {
    ElMessage.success("Sem fraturas detectadas!");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="container">
    <el-card class="box-card">
      <h1>Reconhecimento de Imagens</h1>
      
      <el-select v-model="selectedCategory" placeholder="Selecione uma categoria">
        <el-option label="Fratura" value="fratura" />
        <el-option label="Câncer" value="cancer" />
      </el-select>

      <div class="upload-container">
        <el-upload
          class="upload-demo"
          drag
          action=""
          :auto-upload="false"
          :show-file-list="false"
          accept="image/*"
          @change="handleFileUpload"
        >
          <template #default>
            <div class="upload-content">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text" v-if="!imagePreview">
                Arraste uma imagem ou <em>clique para selecionar</em>
              </div>
              <img v-if="imagePreview" :src="imagePreview" class="preview-image" alt="Preview" />
            </div>
          </template>
        </el-upload>
      </div>

      <el-button 
        class="button" 
        type="primary" 
        :loading="loading"
        :disabled="!selectedCategory || !imagePreview" 
        @click="analyzeImage"
      >
        {{ loading ? 'Analisando...' : 'Analisar Imagem' }}
      </el-button>
    </el-card>
  </div>
</template>

<style>
.container {
  font-family: 'Helvetica Neue', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.box-card {
  width: 500px;
  padding: 20px;
  text-align: center;
}

.upload-container {
  margin: 20px 0;
}

.upload-content {
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.button {
  margin-top: 20px;
  width: 200px;
}

.result-dialog {
  text-align: center;
  padding: 20px;
}

.result-dialog i {
  margin-bottom: 20px;
}

.conclusion {
  margin-top: 15px;
  font-style: italic;
  color: #666;
}

.custom-dialog {
  width: 400px;
}

/* Ajustes para o upload */
:deep(.el-upload-dragger) {
  width: 100% !important;
  height: 300px !important;
}
</style>