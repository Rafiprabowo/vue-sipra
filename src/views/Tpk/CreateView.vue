<script setup>
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultCard from '@/components/Forms/DefaultCard.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ButtonDefault from '@/components/Buttons/ButtonDefault.vue'
import axios from 'axios'
import { ref } from 'vue'

const pageTitle = ref('Tambah Soal')

// Model untuk form
const formData = ref({
  question_text: '',
  question_image: null,
  difficulty: '',
  options: ['', '', '', '', ''],
  is_correct: '',
})

// State untuk alert dan loading
const alertMessage = ref('')
const showAlert = ref(false)
const isLoading = ref(false)

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) {
    formData.value.question_image = null
    return
  }

  const allowedTypes = ['image/jpeg', 'image/png']
  const maxSize = 2 * 1024 * 1024

  if (!allowedTypes.includes(file.type)) {
    alert('Format file tidak didukung. Harap unggah file gambar (jpeg, png).')
    return
  }

  if (file.size > maxSize) {
    alert('Ukuran file terlalu besar. Maksimal 2MB.')
    return
  }

  formData.value.question_image = file
}

const submitForm = async () => {
  isLoading.value = true // Tampilkan loading spinner
  const payload = new FormData()
  payload.append('question_text', formData.value.question_text || null)
  payload.append('question_image', formData.value.question_image || null)
  payload.append('difficulty', formData.value.difficulty)

  formData.value.options.forEach((option, index) => {
    payload.append(`opsi${index + 1}`, option)
  })

  payload.append('is_correct', formData.value.is_correct)

  try {
    const response = await axios.post('http://sipra-event.test/api/questions/tpk', payload)
    
    // Reset form setelah berhasil
    formData.value = {
      question_text: '',
      question_image: null,
      difficulty: '',
      options: ['', '', '', '', ''],
      is_correct: '',
    }

    // Tampilkan alert dengan pesan dari response
    alertMessage.value = response.data.message || 'Soal berhasil disimpan!'
    showAlert.value = true

    // Sembunyikan alert dan redirect setelah beberapa detik
    setTimeout(() => {
      showAlert.value = false
      window.location.href = '/tpk'
    }, 3000)
  } catch (error) {
    if (error.response && error.response.data) {
      console.log('Validation Errors:', error.response.data.errors)
    } else {
      console.log('Error:', error.message)
    }
  } finally {
    isLoading.value = false // Sembunyikan loading spinner
  }
}
</script>
<template>
  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <ButtonDefault
      label="Kembali"
      route="/tpk"
      custom-classes="bg-primary text-white mb-4"
    />

    <!-- Alert -->
    <div v-if="showAlert" class="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded">
      {{ alertMessage }}
    </div>

    <div class="grid grid-cols-1 gap-9">
      <div class="flex flex-col gap-9">
        <DefaultCard cardTitle="Form Pertanyaan">
          <form @submit.prevent="submitForm">
            <div class="p-6.5 space-y-4.5">
              <!-- Input Soal Teks -->
              <div>
                <label class="mb-2.5 block text-black dark:text-white">Soal berbentuk teks</label>
                <textarea
                  v-model="formData.question_text"
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
                  @change="handleFileUpload"
                  class="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                />
              </div>

              <!-- Input Tingkat Kesulitan -->
              <div>
                <label class="mb-2.5 block text-black dark:text-white">Tingkat Kesulitan</label>
                <select
                  v-model="formData.difficulty"
                  class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                >
                  <option value="" disabled selected>Pilih</option>
                  <option value="low">Mudah</option>
                  <option value="intermediate">Menengah</option>
                  <option value="advance">Sulit</option>
                </select>
              </div>

              <!-- Input Opsi Jawaban -->
              <div v-for="(option, index) in formData.options" :key="index">
                <label class="mb-2.5 block text-black dark:text-white">
                  Opsi Jawaban {{ index + 1 }}
                </label>
                <input
                  v-model="formData.options[index]"
                  type="text"
                  placeholder="Masukkan opsi jawaban"
                  class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>

              <!-- Input Kunci Jawaban -->
              <div>
                <label class="mb-2.5 block text-black dark:text-white">Kunci Jawaban</label>
                <select
                  v-model="formData.is_correct"
                  class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                >
                  <option value="" disabled>Pilih Kunci Jawaban</option>
                  <option v-for="(option, index) in formData.options" :key="index" :value="index">
                    {{ option }}
                  </option>
                </select>
              </div>

              <!-- Tombol Simpan dengan Loading -->
              <button
                class="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                type="submit"
                :disabled="isLoading"
              >
                <span v-if="isLoading">Menyimpan...</span>
                <span v-else>Simpan</span>
              </button>
            </div>
          </form>
        </DefaultCard>
      </div>
    </div>
  </DefaultLayout>
</template>
