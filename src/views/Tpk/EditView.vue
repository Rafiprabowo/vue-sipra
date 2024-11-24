<script setup>
import axios from 'axios'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import DefaultCard from '@/components/Forms/DefaultCard.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import ButtonDefault from '@/components/Buttons/ButtonDefault.vue'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Mendapatkan route dan parameter id
const route = useRoute()
const router = useRouter()
const questionId = route.params.id

// Data yang akan digunakan dalam form
const questionData = ref({
  id: null,
  question_text: '',
  question_image: null,
  difficulty: '',
  options: [],
  is_correct: null,
})

// Status untuk loading
const isLoading = ref(true)
const errorMessage = ref('')
const successMessage = ref('')

// Fetch data berdasarkan ID dari API
const fetchQuestionData = async () => {
  try {
    const response = await axios.get(`http://sipra-event.test/api/questions/tpk/${questionId}`)
    const data = response.data.data
    console.log(data)
    // Assign data ke questionData
    questionData.value = {
      id: data.id,
      question_text: data.question_text,
      question_image: data.question_image,
      difficulty: data.difficulty,
      options: data.options,
      is_correct: data.is_correct,
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan saat mengambil data.'
  } finally {
    isLoading.value = false
  }
}

// Fungsi untuk mengirim data update ke API
const updateQuestion = async () => {
  // Buat FormData untuk mengirim data
  const formData = new FormData()

  // Mengirimkan question_text, difficulty, dan is_correct
  formData.append('question_text', questionData.value.question_text)
  formData.append('difficulty', questionData.value.difficulty)
  formData.append('is_correct', questionData.value.is_correct)

  // Mengirimkan opsi jawaban dengan nama opsix
  formData.append('opsi1', questionData.value.options[0])
  formData.append('opsi2', questionData.value.options[1])
  formData.append('opsi3', questionData.value.options[2])
  formData.append('opsi4', questionData.value.options[3])
  formData.append('opsi5', questionData.value.options[4])

  // Mengirimkan gambar soal jika ada
  if (questionData.value.question_image instanceof File) {
    formData.append('question_image', questionData.value.question_image)
  }

  // Debugging: Log data yang akan dikirim
  console.log('Data yang akan dikirim ke endpoint:')
  console.log(`http://sipra-event.test/api/questions/tpk/${questionId}`)
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value)
  }

  try {
    const response = await axios.post(
      `http://sipra-event.test/api/questions/tpk/${questionId}`,
      formData,
    )

    // Tampilkan pesan sukses
    successMessage.value = 'Data berhasil diperbarui.'
    console.log('Response API:', response.data)

    // Redirect setelah berhasil
    setTimeout(() => {
      router.push('/tpk')
    }, 2000)
  } catch (error) {
    console.error('Error saat mengirim data:', error.response?.data)
    errorMessage.value = error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.'
  }
}

// Fetch data saat komponen dimuat
onMounted(() => {
  fetchQuestionData()
})
</script>

<template>
  <DefaultLayout>
    <BreadcrumbDefault :page-title="'Edit Soal'" />
    <ButtonDefault label="Kembali" route="/tpk" custom-classes="bg-primary text-white mb-4" />
    <DefaultCard card-title="Form Edit">
      <!-- Jika sedang loading -->
      <div v-if="isLoading" class="text-center py-4">Memuat data...</div>

      <!-- Jika ada error -->
      <div v-else-if="errorMessage" class="text-red-500 text-center py-4">{{ errorMessage }}</div>

      <!-- Jika berhasil -->
      <div v-if="successMessage" class="text-green-500 text-center py-4">{{ successMessage }}</div>

      <!-- Form Edit -->
      <form v-else @submit.prevent="updateQuestion">
        <div class="p-6.5 space-y-4.5">
          <!-- Input Soal Teks -->
          <div>
            <label class="mb-2.5 block text-black dark:text-white">Soal berbentuk teks</label>
            <textarea
              v-model="questionData.question_text"
              rows="6"
              placeholder="Masukkan soal"
              class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            ></textarea>
          </div>

          <!-- Input Soal Gambar -->
          <div>
            <label class="mb-3 block text-sm font-medium text-black dark:text-white">
              Soal berbentuk gambar
            </label>
            <input
              type="file"
              @change="(e) => (questionData.question_image = e.target.files[0])"
              class="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
            />
            <!-- Jika ada gambar -->
            <div
              v-if="questionData.question_image && typeof questionData.question_image !== 'object'"
              class="mt-3"
            >
              <img
                :src="questionData.question_image"
                alt="Soal gambar"
                class="w-32 h-32 object-cover"
              />
            </div>
          </div>

          <!-- Input Tingkat Kesulitan -->
          <div>
            <label class="mb-2.5 block text-black dark:text-white">Tingkat Kesulitan</label>
            <select
              v-model="questionData.difficulty"
              class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            >
              <option value="" disabled>Pilih</option>
              <option value="low">Mudah</option>
              <option value="intermediate">Menengah</option>
              <option value="advance">Sulit</option>
            </select>
          </div>

          <!-- Input Opsi Jawaban -->
          <div v-for="(option, index) in questionData.options" :key="index">
            <label :for="'option-' + index" class="mb-2.5 block text-black dark:text-white">
              Opsi Jawaban {{ index + 1 }}
            </label>
            <input
              :id="'option-' + index"
              v-model="questionData.options[index]"
              type="text"
              placeholder="Masukkan opsi jawaban"
              class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <!-- Input Kunci Jawaban -->
          <div>
            <label class="mb-2.5 block text-black dark:text-white">Kunci Jawaban</label>
            <select
              v-model="questionData.is_correct"
              class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            >
              <option value="" disabled>Pilih Kunci Jawaban</option>
              <option
                v-for="(option, index) in questionData.options"
                :key="'correct-' + index"
                :value="index"
              >
                {{ option }}
              </option>
            </select>
          </div>

          <!-- Tombol Simpan -->
          <button
            class="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
            type="submit"
          >
            Simpan
          </button>
        </div>
      </form>
    </DefaultCard>
  </DefaultLayout>
</template>
