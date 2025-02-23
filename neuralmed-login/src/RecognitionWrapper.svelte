<!-- neuralmed-login/src/lib/RecognitionWrapper.svelte -->
<script>
  import { onMount } from 'svelte';
  import { onDestroy } from 'svelte';

  let container;

  onMount(async () => {
    try {
      // Importa o remoteEntry.js
      await import('http://localhost:3000/assets/remoteEntry.js');

      // Aguarda um pequeno intervalo para garantir que o módulo remoto esteja disponível
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Importa o componente exposto
      const remoteModule = await import('recognition/Recognition');
      const RecognitionComponent = remoteModule.default;

      // Cria uma instância do componente Vue
      const app = Vue.createApp(RecognitionComponent);
      app.mount(container);

      // Limpeza na desmontagem
      onDestroy(() => {
        app.unmount();
      });
    } catch (error) {
      console.error('Erro ao carregar o componente remoto:', error);
    }
  });
</script>

<div bind:this={container}></div>
