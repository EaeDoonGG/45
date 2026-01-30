<template>
  <div class="min-h-screen bg-[#0f0a1e] text-white p-8 font-sans">
    <div class="max-w-4xl mx-auto">
      <div class="bg-[#1a142e] border border-purple-500/30 rounded-2xl p-8 mb-6 shadow-2xl">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-3xl font-bold italic">Shindo WebSocket Status</h1>
          <span class="bg-green-500/20 text-green-400 px-4 py-1 rounded-full text-sm border border-green-500/50">
            ● Operational
          </span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div class="bg-[#251b40] p-6 rounded-xl border border-white/5">
            <p class="text-gray-400 text-sm uppercase">Active Sessions</p>
            <p class="text-4xl font-mono mt-2">{{ stats.activeSessions }}</p>
          </div>
          <div class="bg-[#251b40] p-6 rounded-xl border border-white/5">
            <p class="text-gray-400 text-sm uppercase">Latency</p>
            <p class="text-4xl font-mono mt-2 text-purple-400">358 ms</p>
          </div>
          <div class="bg-[#251b40] p-6 rounded-xl border border-white/5">
            <p class="text-gray-400 text-sm uppercase">Uptime</p>
            <p class="text-xl font-mono mt-2">64d 09h</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const stats = ref({ activeSessions: 0, players: [] });

onMounted(() => {
  // Substitua pela URL do seu servidor Node.js (ex: Railway)
  const socket = new WebSocket('wss://seu-backend.railway.app');

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'status_update') {
      stats.value.activeSessions = data.activeSessions;
      stats.value.players = data.players;
    }
  };
});
</script>