<script>
  import { onMount } from "svelte";
  import RecognitionWrapper from "./RecognitionWrapper.svelte";

  let userId = localStorage.getItem("userId") || "";
  let username = localStorage.getItem("username") || "";
  let isLoggedIn = !!userId && !!username;
  let showRecognition = false;

  async function registerUser() {
    username = document.getElementById("username").value;
    if (!username) {
      alert("Por favor, insira seu nome.");
      return;
    }

    if (!window.PublicKeyCredential) {
      alert("Seu navegador não suporta WebAuthn.");
      return;
    }

    try {
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: { name: "NeuralMED" },
          user: {
            id: new Uint8Array(16).map(() => Math.floor(Math.random() * 256)),
            name: username,
            displayName: username
          },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
          authenticatorSelection: { authenticatorAttachment: "platform" },
          timeout: 60000,
          attestation: "direct"
        }
      });

      userId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);

      console.log(`✅ Usuário registrado: ${username} (ID: ${userId})`);
      alert(`Registro bem-sucedido! Bem-vindo, ${username}`);

      isLoggedIn = true;
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      alert("Falha ao registrar. Tente novamente.");
    }
  }

  async function handleLogin() {
    if (!window.PublicKeyCredential || !userId) {
      alert("Nenhum usuário registrado. Registre-se primeiro.");
      return;
    }

    try {
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          allowCredentials: [{ type: "public-key", id: Uint8Array.from(atob(userId), c => c.charCodeAt(0)) }]
        }
      });

      isLoggedIn = true;
      console.log(`✅ Login bem-sucedido! Usuário: ${username} (ID: ${userId})`);
      alert(`Autenticado com sucesso! Bem-vindo, ${username}`);
    } catch (error) {
      console.error("Erro ao autenticar:", error);
      alert("Falha ao autenticar. Tente novamente.");
    }
  }

  function enterSystem() {
    showRecognition = true; // 🔹 Atualiza corretamente a variável reativa
  }
</script>

<main class="container">
  <div class="auth-container">
    <div class="logo-container">
      <img src="https://static.vecteezy.com/system/resources/previews/017/177/954/non_2x/round-medical-cross-symbol-on-transparent-background-free-png.png" alt="Logo do NeuralMED" class="logo" />
    </div>

    <div class="form-container">
      <h1>NeuralMED</h1>
      <p class="description">{isLoggedIn ? `Olá, ${username}!` : "Crie sua conta para ter acesso rápido e seguro."}</p>

      {#if isLoggedIn}
        <button on:click={() => showRecognition = true}>Entrar no Sistema</button> <!-- 🔹 Ajuste aqui -->
      {:else}
        <input id="username" type="text" placeholder="Nome do usuário" class="input" />
        <div class="buttons">
          <button class="primary" on:click={registerUser}>Registrar</button>
          <button class="secondary" on:click={handleLogin}>Entrar com Windows Hello</button>
        </div>
      {/if}
    </div>
  </div>

  {#if showRecognition}
  asd
    <RecognitionWrapper />
  {/if}
</main>
