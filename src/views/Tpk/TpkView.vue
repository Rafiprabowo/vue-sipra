<template>
  <DefaultLayout>
    <BreadcrumbDefault :pageTitle="dashboard" />
    <!-- Tombol Tambah Soal -->
    <ButtonDefault
      label="Tambah Soal"
      route="/tpk/tambah"
      custom-classes="bg-primary text-white mb-4"
    />

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
            <!-- Tampilkan data soal -->
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
                class="py-4 px-4 text-black dark:text-white"
                v-else-if="soal.difficulty == 'intermediate'"
              >
                Menengah
              </td>
              <td class="py-4 px-4 text-black dark:text-white" v-else>Sulit</td>
              <td class="py-4 px-4 text-black dark:text-white space-x-4">
                <!-- Tombol Edit -->
                <ButtonDefault
                  label="Edit"
                  custom-classes="bg-black text-white rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out transform hover:bg-gray-800 hover:scale-105 shadow-lg hover:shadow-xl"
                  :route="`/tpk/edit/${soal.id}`"
                  @click="editSoal(soal.id)"
                />
                <!-- Tombol Hapus -->
                <ButtonDefault
                  label="Hapus"
                  custom-classes="bg-red-600 text-white rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out transform hover:bg-red-500 hover:scale-105 shadow-lg hover:shadow-xl"
                  @click="deleteSoal(soal.id)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ButtonDefault from '@/components/Buttons/ButtonDefault.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'

const dataSoalTpk = ref([])
const dashboard = ref('Dashboard')
const isLoading = ref(true) // Tambahkan state untuk loading

// Fungsi untuk mengambil data soal
const fetchDataSoalTpk = async () => {
  isLoading.value = true // Set loading menjadi true saat mulai fetch data
  try {
    const response = await axios.get('http://sipra-event.test/api/questions/tpk')
    // Menyimpan data dari API ke dataSoalTpk
    dataSoalTpk.value = response.data.data // Menggunakan response.data.data sesuai format JSON
    console.log(response.data.data) // Untuk debugging
  } catch (error) {
    console.error('Failed to fetch data soal tpk: ', error)
  } finally {
    isLoading.value = false // Set loading menjadi false setelah fetch selesai
  }
}

// Panggil fetch data saat komponen dimuat
onMounted(() => {
  fetchDataSoalTpk()
})

// Fungsi Edit dan Delete
const editSoal = (id) => {
  // Arahkan ke halaman edit soal dengan ID
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
