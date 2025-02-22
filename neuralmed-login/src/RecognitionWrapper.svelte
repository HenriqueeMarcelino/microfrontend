<script>
  import { onMount } from "svelte";

  let RecognitionLoaded = false;

  async function loadRecognition() {
    try {
      await import("http://172.29.156.167:3000/assets/remoteEntry.js"); // Importa o Microfrontend Vue
      RecognitionLoaded = true;
      console.log("✅ Microfrontend Vue carregado!");
    } catch (error) {
      console.error("Erro ao carregar Vue:", error);
    }
  }

  onMount(() => {
    loadRecognition();
  });
</script>

{#if RecognitionLoaded}
  <recognition-element></recognition-element>
{:else}
  <p>Carregando o microfrontend de reconhecimento...</p>
{/if}
