<template>
  <div>
    <q-table
      title="Messages"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :pagination.sync="{rowsPerPage: 15}"
    >
      <template v-slot:body-cell-stt="scope">
        <td class="text-center">{{ scope.rowIndex + 1 }}</td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
  import {ref, onMounted, watch} from 'vue'
  import { apiRequest } from 'src/services/apiRequest';
  import { Message } from 'src/models/message';

  const columns = [
    { name: 'stt', align: 'center', label: 'STT', field: 'stt' },
    { name: 'sender', label: 'Sender name', align: 'center', field: (row: Message) => row.sender.name},
    { name: 'receiver', label: 'Receiver name', align: 'center', field: (row: Message) => row.receiver.name },
    { name: 'content', label: 'Content', field: 'content', align: 'center' },
    { name: 'type', label: 'Type', field: 'type', align: 'center' },
    { name: 'created_at', label: 'Created at', field: 'created_at', align: 'center' },
    { name: 'has_seen', label: 'Status', align: 'center', field: (row: Message) => row.has_seen ? 'Has seen' : 'Not seen' }
  ]
  const rows = ref([] as Message[]);

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
