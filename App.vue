<template>
  <div class="min-h-screen bg-[#0b081a] text-white font-sans p-6">
    <div class="max-w-5xl mx-auto">
      
      <div class="bg-[#151129] border border-purple-500/20 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 p-4">
          <span class="bg-green-500/10 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs">
            ● Operational
          </span>
        </div>

        <h1 class="text-4xl font-bold mb-2">Shindo WebSocket Status</h1>
        <p class="text-gray-400 max-w-md mb-8">
          Monitorando autenticação, presença e cargos em tempo real com latência ativa.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-[#1c1635] p-6 rounded-2xl border border-white/5">
            <h2 class="text-sm uppercase tracking-widest text-gray-500 mb-4 font-bold">Live Snapshot</h2>
            <div class="space-y-4">
              <div class="flex justify-between border-b border-white/5 pb-2">
                <span class="text-gray-300">Active Sessions</span>
                <span class="font-mono text-xl">{{ stats.activeSessions }}</span>
              </div>
              <div class="flex justify-between border-b border-white/5 pb-2">
                <span class="text-gray-300">Latency</span>
                <span class="font-mono text-purple-400">12 ms</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-300">Health</span>
                <span class="text-green-400 font-bold uppercase text-sm">Stable</span>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-[#251b4b] to-[#151129] p-6 rounded-2xl flex flex-col justify-center items-center">
             <div class="text-6xl font-black text-purple-500 opacity-50">{{ stats.activeSessions }}</div>
             <div class="text-xs uppercase text-gray-400 mt-2">Players Online Agora</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const stats = ref({ activeSessions: 0 });

onMounted(() => {
  // Substitua pela URL do seu servidor no Railway
  const socket = new WebSocket('wss://seu-projeto-railway.up.railway.app');

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'status_update') {
      stats.value.activeSessions = data.activeSessions;
    }
  };
});
</script>

<style>
body { background-color: #0b081a; }
</style>
