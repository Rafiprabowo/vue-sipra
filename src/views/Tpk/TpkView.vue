<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import ButtonDefault from '@/components/Buttons/ButtonDefault.vue'

const dataSoalTpk = ref([])

// Fungsi untuk mengambil data soal
const fetchDataSoalTpk = async () => {
  try {
    const response = await axios.get('http://sipra-event.test/api/questions/tpk')
    // Menyimpan data dari API ke dataSoalTpk
    dataSoalTpk.value = response.data.data // Menggunakan response.data.data sesuai format JSON
    console.log(response.data.data) // Untuk debugging
  } catch (error) {
    console.log('Failed to fetch data soal tpk: ', error)
  }
}

// Panggil fetch data saat komponen dimuat
onMounted(() => {
  fetchDataSoalTpk()
})
</script>

<template>
  <DefaultLayout>
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
      <div class="max-w-full overflow-x-auto">
        <table class="w-full table-auto">
          <thead>
            <tr class="bg-gray-2 text-left dark:bg-meta-4">
              <th class="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">No</th>
              <th class="py-4 px-4 font-medium text-black dark:text-white">Pertanyaan</th>
              <th class="py-4 px-4 font-medium text-black dark:text-white">Tingkat Kesulitan</th>
              <th class="py-4 px-4 font-medium text-black dark:text-white">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <!-- Tampilkan data soal -->
            <tr v-for="(soal, index) in dataSoalTpk" :key="soal.id" class="border-b dark:border-strokedark">
              <td class="py-4 px-4 text-black dark:text-white">{{ index + 1 }}</td>
              <td class="py-4 px-4 text-black dark:text-white">{{ soal.question_text }}</td>
              <td class="py-4 px-4 text-black dark:text-white">{{ soal.difficulty }}</td>
              <td class="py-4 px-4 text-black dark:text-white">
                <button class="text-primary hover:underline" @click="editSoal(soal.id)">Edit</button>
                |
                <button class="text-danger hover:underline" @click="deleteSoal(soal.id)">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </DefaultLayout>
</template>

<script>
const editSoal = (id) => {
  // Arahkan ke halaman edit soal dengan ID
  window.location.href = `/tpk/edit/${id}`;
};

const deleteSoal = (id) => {
  if (confirm("Apakah Anda yakin ingin menghapus soal ini?")) {
    axios
      .delete(`http://sipra-event.test/api/questions/tpk/${id}`)
      .then(() => {
        alert("Soal berhasil dihapus");
        fetchDataSoalTpk(); // Refresh data setelah dihapus
      })
      .catch((error) => {
        console.error("Failed to delete soal:", error);
        alert("Terjadi kesalahan saat menghapus soal.");
      });
  }
};
</script>
