use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;
use js_sys::Promise;
use web_sys::{console, Window};

#[wasm_bindgen(module = "/js/onnx_inference.js")]
extern "C" {
    fn run_onnx_inference(image_data: Vec<u8>) -> Promise;
}

#[wasm_bindgen]
pub async fn analyze_image(image_data: Vec<u8>) -> String {
    console_log("🔹 Iniciando análise da imagem...");
    
    // Logging do tamanho dos dados
    console_log(&format!("Tamanho dos dados da imagem: {} bytes", image_data.len()));

    match JsFuture::from(run_onnx_inference(image_data)).await {
        Ok(js_value) => {
            match js_value.as_string() {
                Some(result) => {
                    console_log(&format!("✅ Resultado: {}", result));
                    result
                }
                None => {
                    console_log("❌ Erro: Resultado não é uma string válida");
                    "Erro: Formato de resultado inválido".to_string()
                }
            }
        }
        Err(e) => {
            // Tentar obter mais informações sobre o erro
            console_log(&format!("❌ Erro detalhado: {:?}", e));
            "Erro na inferência".to_string()
        }
    }
}

fn console_log(msg: &str) {
    console::log_1(&msg.into());
}