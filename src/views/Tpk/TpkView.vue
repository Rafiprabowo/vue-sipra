<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ButtonDefault from '@/components/Buttons/ButtonDefault.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'

const dataSoalTpk = ref([]) // Menyimpan data soal yang diterima dari API
const dashboard = ref('Dashboard')
const isLoading = ref(false) // Menambahkan state loading untuk import
const uploadLoading = ref(false) // State loading khusus untuk proses upload
const uploadedFiles = ref([])

// Fungsi untuk mengambil data soal dari API
const fetchDataSoalTpk = async () => {
  isLoading.value = true
  try {
    const response = await axios.get('http://sipra-event.test/api/questions/tpk')
    dataSoalTpk.value = response.data.data
  } catch (error) {
    console.error('Failed to fetch data soal tpk: ', error)
  } finally {
    isLoading.value = false
  }
}
// Panggil fetch data saat komponen dimuat
onMounted(() => {
  fetchDataSoalTpk()
})

const uploadFile = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (uploadedFiles.value.includes(file.name)) {
    alert('File ini sudah pernah diupload!')
    event.target.value = null
    return
  }

  // Aktifkan loading saat proses upload dimulai
  uploadLoading.value = true

  let formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axios.post('http://sipra-event.test/api/file-excel', formData)
    console.log('File berhasil diupload', response.data)

    // Tampilkan alert setelah file berhasil diupload
    alert('Data berhasil diimpor')
    // Segarkan data setelah upload
    fetchDataSoalTpk()
    uploadedFiles.value.push(file.name)
    // Reset input file setelah berhasil diupload
    event.target.value = null
  } catch (error) {
    console.log('Terjadi kesalahan saat mengupload file', error)
    alert('Terjadi kesalahan saat mengimpor data.')
  } finally {
    // Matikan loading setelah proses selesai
    uploadLoading.value = false
  }
}

// Fungsi untuk edit dan delete soal
const editSoal = (id) => {
  window.location.href = `/tpk/edit/${id}`
}

const deleteSoal = (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus soal ini?')) {
    axios
      .delete(`http://sipra-event.test/api/questions/tpk/${id}`)
      .then(() => {
        alert('Soal berhasil dihapus')
        fetchDataSoalTpk() // Refresh data setelah dihapus
      })
      .catch((error) => {
        console.error('Failed to delete soal:', error)
        alert('Terjadi kesalahan saat menghapus soal.')
      })
  }
}
</script>
<template>
  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="dashboard" />

    <!-- Tombol Tambah Soal -->
    <div class="flex justify-between items-center">
      <ButtonDefault
        label="Tambah Soal"
        route="/tpk/tambah"
        custom-classes="bg-primary text-white mb-4 font-semibold py-3 px-6 rounded-md transition duration-300 ease-in-out hover:bg-blue-600"
      />

      <div>
        <label
          for="file-input"
          class="cursor-pointer bg-secondary text-white font-semibold py-3 px-6 rounded-md transition duration-300 ease-in-out hover:bg-blue-600"
        >
          Import File Excel
        </label>
        <input id="file-input" type="file" @change="uploadFile" class="hidden" />

        <!-- Indikator Loading saat Upload -->
        <div v-if="uploadLoading" class="text-center py-4 mt-2">
          <p class="text-primary font-medium">Sedang mengimpor data, harap tunggu...</p>
        </div>
      </div>
    </div>

    <!-- Tabel Data Soal -->
    <div
      class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
    >
      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-4">
        <p class="text-primary font-medium">Memuat data, harap tunggu...</p>
      </div>

      <!-- Tabel -->
      <div v-else class="max-w-full overflow-x-auto">
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-2 text-left dark:bg-meta-4">
              <th class="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">No</th>
              <th class="py-4 px-4 font-medium text-black dark:text-white">Pertanyaan</th>
              <th class="py-4 px-4 font-medium text-black dark:text-white">Gambar</th>
              <th class="py-4 px-4 font-medium text-black dark:text-white">Tingkat Kesulitan</th>
              <th class="py-4 px-4 font-medium text-black dark:text-white">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(soal, index) in dataSoalTpk"
              :key="soal.id"
              class="border-b dark:border-strokedark"
            >
              <td class="py-4 px-4 text-black dark:text-white">{{ index + 1 }}</td>
              <td class="py-4 px-4 text-black dark:text-white">{{ soal.question_text }}</td>
              <td class="py-4 px-4 text-black dark:text-white">
                <div v-if="soal.image_url">
                  <img :src="soal.image_url" alt="Soal Gambar" class="w-32 h-32 object-cover" />
                </div>
                <div v-else>
                  <p>Tidak ada gambar untuk soal ini.</p>
                </div>
              </td>
              <td class="py-4 px-4 text-black dark:text-white" v-if="soal.difficulty == 'low'">
                Mudah
              </td>
              <td
                v-else-if="soal.difficulty == 'intermediate'"
                class="py-4 px-4 text-black dark:text-white"
              >
                Menengah
              </td>
              <td v-else class="py-4 px-4 text-black dark:text-white">Sulit</td>
              <td class="py-4 px-4 text-black dark:text-white space-x-4">
                <!-- Tombol Edit -->
                <button
                  @click="editSoal(soal.id)"
                  class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                  Edit
                </button>

                <!-- Tombol Hapus -->
                <button
                  @click="deleteSoal(soal.id)"
                  class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </DefaultLayout>
</template>
