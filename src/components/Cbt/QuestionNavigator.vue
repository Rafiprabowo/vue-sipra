<script setup>
defineProps({
  questions: Array,
  currentIndex: Number,
});

const emit = defineEmits(['navigate-question', 'end-quiz']);

const navigateTo = (index) => {
  emit('navigate-question', index);
};
</script>

<template>
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-lg font-bold mb-4">Navigasi Soal</h2>
    <ul class="space-y-2">
      <li
        v-for="(question, index) in questions"
        :key="question.id"
        class="p-2 border rounded cursor-pointer hover:bg-blue-100"
        :class="{ 'bg-blue-200 border-blue-500': index === currentIndex }"
        @click="navigateTo(index)"
      >
        Soal {{ index + 1 }}
      </li>
    </ul>
    <button
      class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      @click="$emit('end-quiz')"
    >
      Akhiri Ujian
    </button>
  </div>
</template>
