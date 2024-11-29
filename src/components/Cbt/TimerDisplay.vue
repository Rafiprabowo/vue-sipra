<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  initialTime: { type: Number, required: true }, // Waktu dalam detik
})

const emit = defineEmits(['time-up'])

const timeLeft = ref(props.initialTime)

onMounted(() => {
  const interval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      emit('time-up') // Emit event jika waktu habis
      clearInterval(interval)
    }
  }, 1000)
})
</script>

<template>
  <div class="text-lg font-semibold text-red-500">
    Sisa waktu: {{ Math.floor(timeLeft / 60) }}:{{ (timeLeft % 60).toString().padStart(2, '0') }}
  </div>
</template>
