<script setup>
import { ref } from "vue";

const selectedCategory = ref("");
const imagePreview = ref("");

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const analyzeImage = () => {
  alert(`Analisando imagem na categoria: ${selectedCategory.value}`);
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

      <el-upload class="upload-demo" drag action="" :auto-upload="false" :show-file-list="false" accept="image/*" @change="handleFileUpload">
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
    </el-card>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const selectedCategory = ref("");
    const imagePreview = ref("");

    const handleFileUpload = (file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        imagePreview.value = event.target.result;
      };
      reader.readAsDataURL(file.raw);
    };

    const analyzeImage = () => {
      alert(`Analisando imagem na categoria: ${selectedCategory.value}`);
    };

    return {
      selectedCategory,
      imagePreview,
      handleFileUpload,
      analyzeImage,
    };
  },
};
</script>

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

.upload-demo{
  margin-top: 10px;
}

.button{
  margin-top: 10px;
}
</style>
