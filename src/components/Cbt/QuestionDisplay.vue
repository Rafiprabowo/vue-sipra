<script setup>
defineProps({
  question: Object,
  currentIndex: Number,
  totalQuestions: Number,
});

const emit = defineEmits(['answer-selected']);

const selectAnswer = (option) => {
  emit('answer-selected', option);
};
</script>

<template>
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-lg font-bold mb-4">Soal {{ currentIndex + 1 }} dari {{ totalQuestions }}</h2>
    <p class="mb-4">{{ question.text }}</p>
    <ul class="space-y-2">
      <li
        v-for="(option, index) in question.options"
        :key="index"
        class="p-2 border rounded cursor-pointer hover:bg-blue-100"
        :class="{ 'bg-blue-200 border-blue-500': question.selectedAnswer === option }"
        @click="selectAnswer(option)"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>
