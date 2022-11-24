<template>
  <div>
    <q-table
      title="Notifications"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
      :pagination.sync="{rowsPerPage: 15}"
    >
    <template v-slot:top-right>
      <q-input borderless dense debounce="300" v-model="filter" placeholder="Search" style="max-width: 200px">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
      <template v-slot:body-cell-stt="scope">
        <td class="text-center">{{ scope.rowIndex + 1 }}</td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
  import {ref, onMounted } from 'vue'
  import { apiRequest } from 'src/services/apiRequest';
  import { Notification } from 'src/models/notification';

  const columns = [
    { name: 'stt', align: 'center', label: 'STT', field: 'stt' },
    { name: 'sender_name', label: 'Sender name', align: 'center', field: (row: Notification) => row.sender.name },
    { name: 'receiver_name', label: 'Receiver name', align: 'center', field: (row: Notification) => row.receiver.name },
    { name: 'type', label: 'Type notification', field: 'type', align: 'center',  },
    { name: 'created_at', label: 'Created', field: 'created_at', align: 'center' },
  ]
  const rows = ref([] as Notification[]);
  const showDialogEdit = ref(false);
  const showDialogAdd = ref(false);
  const user = ref({} as Notification);
  const errors = ref({})
  const filter = ref('')

  async function fetchData() {
    try {
      const res = await apiRequest('api/notifications/all');
      if(res.status == 200) {
        rows.value = [...res.data as Notification[]];
      }
    } catch(err) {
      //
      }
    }

  onMounted(async() => {
    await fetchData();
  })

</script>
