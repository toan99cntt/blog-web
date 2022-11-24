<template>
  <div>
    <q-table
      title="Messages"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
      :pagination.sync="{rowsPerPage: 15}"
      @row-click="showImage"
    >
      <template v-slot:top>
        <div class="col-6">
          <span class="q-table__title q-mr-md">Members</span>
        </div>
        <div class="col-6" style="text-align: -webkit-right;">
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search" style="max-width: 200px">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </template>
      <template v-slot:body-cell-stt="scope">
        <td class="text-center">{{ scope.rowIndex + 1 }}</td>
      </template>
      <template v-slot:body-cell-image="scope">
        <td class="text-center">
          <div v-if="scope.row.attachments.length">
            <lightgallery
            :settings="{ speed: 500, plugins: plugins }"
          >
            <a
              v-for="(img, key) in scope.row.attachments"
              :key="key"
              className="gallery-item"
              :data-src="img.url"
            >
              <q-img
                :src="img.url"
                spinner-size="14px"
                spinner-color="white"
                class="q-mx-xs q-mb-sm img-responsive cursor-pointer"
                height="80px"
                width="80px"
                style="border-radius: 5px;"
              />
            </a>
          </lightgallery>
          </div>
        </td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
  import {ref, onMounted, watch} from 'vue'
  import { apiRequest } from 'src/services/apiRequest';
  import { Message } from 'src/models/message';
  import Lightgallery from 'lightgallery/vue';
  import lgThumbnail from 'lightgallery/plugins/thumbnail';
  import lgZoom from 'lightgallery/plugins/zoom';

  const columns = [
    { name: 'stt', align: 'center', label: 'STT', field: 'stt' },
    { name: 'sender', label: 'Sender name', align: 'center', field: (row: Message) => row.sender.name},
    { name: 'receiver', label: 'Receiver name', align: 'center', field: (row: Message) => row.receiver.name },
    { name: 'content', label: 'Content', field: 'content', align: 'center' },
    { name: 'image', label: 'Image', field: 'image', align: 'center' },
    { name: 'type', label: 'Type', field: 'type', align: 'center' },
    { name: 'created_at', label: 'Created at', field: 'created_at', align: 'center' },
    { name: 'has_seen', label: 'Status', align: 'center', field: (row: Message) => row.has_seen ? 'Not seen' : 'Has seen' }
  ]
  const rows = ref([] as Message[]);
  const filter = ref('');
  const plugins = [lgThumbnail, lgZoom];

  async function fetchData() {
    try {
      const res = await apiRequest('api/chat');
      if(res.status == 200) {
        rows.value = [...res.data as Message[]];
      }
    } catch(err) {
      //
      }
    }

  onMounted(async() => {
    await fetchData();
  })

</script>
<style scoped>
  @import 'lightgallery/css/lightgallery.css';
  @import 'lightgallery/css/lg-thumbnail.css';
  @import 'lightgallery/css/lg-zoom.css';
</style>
