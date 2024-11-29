<script setup>
import { ref } from 'vue';
import QuestionDisplay from '@/components/Cbt/QuestionDisplay.vue';
import QuestionNavigator from '@/components/Cbt/QuestionNavigator.vue';

const questions = ref([
  {
    id: 1,
    text: 'Siapa nabi terakhir dalam Islam?',
    options: ['Nabi Isa', 'Nabi Musa', 'Nabi Muhammad', 'Nabi Ibrahim'],
    selectedAnswer: null,
  },
  {
    id: 2,
    text: 'Apa kitab suci umat Islam?',
    options: ['Taurat', 'Zabur', 'Injil', 'Al-Qur\'an'],
    selectedAnswer: null,
  },
  {
    id: 3,
    text: 'Apa nama bulan puasa dalam Islam?',
    options: ['Rajab', 'Ramadhan', 'Syawal', 'Dzulhijjah'],
    selectedAnswer: null,
  },
]);

const currentIndex = ref(0);

const handleAnswerSelected = (answer) => {
  questions.value[currentIndex.value].selectedAnswer = answer;
};

const navigateQuestion = (index) => {
  currentIndex.value = index;
};

const endQuiz = () => {
  alert('Ujian telah selesai. Terima kasih!');
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Question Display -->
      <div class="flex-1">
        <QuestionDisplay
          :question="questions[currentIndex]"
          :currentIndex="currentIndex"
          :totalQuestions="questions.length"
          @answer-selected="handleAnswerSelected"
        />
      </div>

      <!-- Question Navigator -->
      <div class="w-full md:w-1/3">
        <QuestionNavigator
          :questions="questions"
          :currentIndex="currentIndex"
          @navigate-question="navigateQuestion"
          @end-quiz="endQuiz"
        />
      </div>
    </div>
  </div>
</template>
