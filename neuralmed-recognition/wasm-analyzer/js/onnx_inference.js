import * as ort from 'onnxruntime-web';

async function preprocessImage(imageData) {
    // Criar um canvas temporário para redimensionar a imagem
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');

    // Criar uma imagem a partir dos dados
    const img = new Image();
    return new Promise((resolve, reject) => {
        img.onload = () => {
            // Desenhar a imagem redimensionada no canvas
            ctx.drawImage(img, 0, 0, 640, 640);
            
            // Obter os dados do pixel
            const imageData = ctx.getImageData(0, 0, 640, 640);
            
            // Criar array para o tensor (1, 3, 640, 640)
            const tensor = new Float32Array(1 * 3 * 640 * 640);
            
            // Normalizar e reorganizar os dados
            for (let y = 0; y < 640; y++) {
                for (let x = 0; x < 640; x++) {
                    const pixelIndex = (y * 640 + x) * 4;
                    
                    // RGB channels - normalize to [0, 1]
                    tensor[y * 640 + x] = imageData.data[pixelIndex] / 255.0;                     // R
                    tensor[640 * 640 + y * 640 + x] = imageData.data[pixelIndex + 1] / 255.0;    // G
                    tensor[2 * 640 * 640 + y * 640 + x] = imageData.data[pixelIndex + 2] / 255.0;// B
                }
            }
            
            resolve(tensor);
        };
        img.onerror = reject;
        
        // Criar Blob URL a partir dos dados da imagem
        const blob = new Blob([imageData], { type: 'image/jpeg' });
        img.src = URL.createObjectURL(blob);
    });
}

export async function run_onnx_inference(imageData) {
    try {
        console.log("📂 Carregando modelo ONNX...");
        
        if (!imageData || imageData.length === 0) {
            throw new Error("Dados da imagem inválidos");
        }
        
        console.log("Status do ONNX:", ort.env);
        
        const sessionOptions = {
            executionProviders: ['wasm'],
            graphOptimizationLevel: 'all',
            enableCpuMemArena: true,
            enableMemPattern: true,
            executionMode: 'sequential'
        };

        const session = await ort.InferenceSession.create(
            "yolov7-p6-bonefracture.onnx",
            sessionOptions
        );

        console.log("✅ Modelo carregado!");

        // Pré-processar a imagem
        const processedData = await preprocessImage(imageData);
        console.log("Dimensões do tensor:", [1, 3, 640, 640]);
        console.log("Tamanho dos dados processados:", processedData.length);

        // Criar tensor com os dados processados
        const tensor = new ort.Tensor(
            'float32',
            processedData,
            [1, 3, 640, 640]
        );

        console.log("🔹 Executando inferência...");
        const results = await session.run({ images: tensor });
        
        // Processar os resultados
        const detections = results.detections.cpuData;
        const confidence = detections[4] * 100; // Convertendo para percentagem
        const classId = Math.floor(detections[5]);
        
        // Verificar se a confiança é suficiente (por exemplo, acima de 15%)
        if (confidence > 15) {
            return `Fratura detectada com ${confidence.toFixed(1)}% de confiança`;
        } else {
            return "Nenhuma fratura detectada com confiança suficiente";
        }

    } catch (error) {
        console.error("Erro detalhado durante a inferência:", error);
        console.error("Stack trace:", error.stack);
        throw error;
    }
}