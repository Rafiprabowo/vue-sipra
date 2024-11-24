<script setup>
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultCard from '@/components/Forms/DefaultCard.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ButtonDefault from '@/components/Buttons/ButtonDefault.vue'
import axios from 'axios'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute() // Untuk mendapatkan ID dari route
const id = route.params.id // ID dari pertanyaan yang akan diedit
const isEdit = ref(!!id)
const pageTitle = ref(isEdit.value ? 'Edit Soal' : 'Tambah Soal')

// Model untuk form
const dataSoalTpk = ref({
  question_text: '',
  question_image: null,
  difficulty: '',
  options: [],
  is_correct: null,
})

// Fungsi untuk mengambil data soal berdasarkan ID (saat mode edit)
const fetchQuestion = async () => {
  try {
    const response = await axios.get(`http://sipra-event.test/api/questions/tpk/${id}`)
    const data = response.data.data
    // Map response ke dataSoalTpk
    dataSoalTpk.value = {
      question_text: data.question_text,
      question_image: data.question_image || null, // Bisa berupa URL
      difficulty: data.difficulty, // Sudah diformat (mudah/menengah/sulit)
      options: data.options, // Sudah berupa array dari API
      is_correct: data.is_correct, // Indeks opsi yang benar
    }
  } catch (error) {
    console.error('Gagal mengambil data soal:', error)
  }
}

// Fungsi untuk mengunggah file
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) {
    dataSoalTpk.value.question_image = null
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

  dataSoalTpk.value.question_image = file
}

// Fungsi untuk submit form (tambah atau edit)
const submitForm = async () => {
  const payload = new FormData()
  payload.append('question_text', dataSoalTpk.value.question_text || null)
  payload.append('question_image', dataSoalTpk.value.question_image || null)
  payload.append('difficulty', dataSoalTpk.value.difficulty)

  // Kirim opsi jawaban dengan nama yang sesuai (opsi1, opsi2, dll)
  dataSoalTpk.value.options.forEach((option, index) => {
    payload.append(`opsi${index + 1}`, option) // Menggunakan opsi1, opsi2, dst.
  })

  payload.append('is_correct', dataSoalTpk.value.is_correct)

  try {
    const response = await axios.put(`http://sipra-event.test/api/questions/tpk/${id}`, payload)
    console.log('Soal berhasil diperbarui:', response.data)
  } catch (error) {
    if (error.response && error.response.data) {
      // Cek detail errors dari server
      console.log('Validation Errors:', error.response.data.errors)
      for (let field in error.response.data.errors) {
        console.log(`${field}:`, error.response.data.errors[field])
      }
    } else {
      console.log('Error:', error.message)
    }
  }
}

// Panggil `fetchQuestion` jika mode edit
onMounted(() => {
  fetchQuestion()
})
</script>

<template>
  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <ButtonDefault label="Kembali" route="/tpk" custom-classes="bg-primary text-white mb-4" />
    <div class="grid grid-cols-1 gap-9">
      <div class="flex flex-col gap-9">
        <DefaultCard :cardTitle="isEdit ? 'Edit Soal' : 'Tambah Soal'">
          <form @submit.prevent="submitForm">
            <div class="p-6.5 space-y-4.5">
              <div>
                <label class="mb-2.5 block text-black dark:text-white">Soal berbentuk teks</label>
                <textarea
                  v-model="dataSoalTpk.question_text"
                  rows="6"
                  placeholder="Masukkan soal"
                  class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:text-white dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                ></textarea>
              </div>

              <div>
                <label class="mb-3 block text-sm font-medium text-black dark:text-white">
                  Soal berbentuk gambar
                </label>
                <input
                  type="file"
                  @change="handleFileUpload"
                  class="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition"
                />
              </div>

              <div>
                <label class="mb-2.5 block text-black dark:text-white">Tingkat Kesulitan</label>
                <select
                  v-model="dataSoalTpk.difficulty"
                  class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition focus:border-primary active:border-primary dark:text-white dark:border-strokedark dark:bg-form-input dark:focus:border-primary"
                >
                  <option value="" disabled>Pilih</option>
                  <option value="low">Mudah</option>
                  <option value="intermediate">Menengah</option>
                  <option value="advance">Sulit</option>
                </select>
              </div>

              <div v-for="(option, index) in dataSoalTpk.options" :key="index">
                <label class="mb-2.5 block text-black dark:text-white"
                  >Opsi Jawaban {{ index + 1 }}</label
                >
                <input
                  v-model="dataSoalTpk.options[index]"
                  type="text"
                  placeholder="Masukkan opsi jawaban"
                  class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition"
                />
              </div>

              <div>
                <label class="mb-2.5 block text-black dark:text-white">Kunci Jawaban</label>
                <select
                  v-model="dataSoalTpk.is_correct"
                  class="w-full rounded border-[1.5px] text-black border-stroke bg-transparent py-3 px-5 font-normal outline-none transition"
                >
                  <option value="" disabled>Pilih Kunci Jawaban</option>
                  <option
                    v-for="(option, index) in dataSoalTpk.options"
                    :key="index"
                    :value="index"
                  >
                    {{ `Opsi Jawaban ${index + 1}` }}
                  </option>
                </select>
              </div>

              <button
                class="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                type="submit"
              >
                Simpan
              </button>
            </div>
          </form>
        </DefaultCard>
      </div>
    </div>
  </DefaultLayout>
</template>
