<script setup>
import { ref, onMounted } from "vue";
import init, { analyze_image } from "../wasm-analyzer/pkg/wasm_analyzer.js"; // Importando o WebAssembly

const selectedCategory = ref("");
const imagePreview = ref("");
const imageBytes = ref(null);
const analysisResult = ref("");

// 🔹 Inicializa o WebAssembly assim que o componente Vue for montado
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

    // 🔹 Criando um Blob URL para exibir no <img>
    const blob = new Blob([arrayBuffer], { type: file.type });
    imagePreview.value = URL.createObjectURL(blob);
  };

  reader.readAsArrayBuffer(file);
};

const analyzeImage = async () => {
  if (!imageBytes.value) {
    alert("Por favor, envie uma imagem válida.");
    return;
  }

  // Chamando o WebAssembly para processar a imagem
  analysisResult.value = await analyze_image(imageBytes.value);
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

      <el-upload
        class="upload-demo"
        drag
        action=""
        :auto-upload="false"
        :show-file-list="false"
        accept="image/*"
        @change="handleFileUpload"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">Arraste uma imagem ou <em>clique para selecionar</em></div>
      </el-upload>

      <div v-if="imagePreview" class="preview">
        <h3>Prévia da Imagem:</h3>
        <img :src="imagePreview" alt="Imagem carregada" class="preview-image" />
      </div>

      <el-button class="button" type="primary" :disabled="!selectedCategory || !imagePreview" @click="analyzeImage">
        Analisar Imagem
      </el-button>

      <div v-if="analysisResult">
        <h3>Resultado da Análise:</h3>
        <p>{{ analysisResult }}</p>
      </div>
    </el-card>
  </div>
</template>

<style>
.container {
    font-family: 'Helvetica Neue', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.box-card {
  width: 500px;
  padding: 20px;
  text-align: center;
}

.preview {
  margin-top: 20px;
}

.preview-image {
  max-width: 100%;
  border-radius: 10px;
}

.upload-demo {
  margin-top: 10px;
}

.button {
  margin-top: 10px;
}
</style>