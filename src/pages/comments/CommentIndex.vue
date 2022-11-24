<template>
  <div>
    <q-table
      title="Comments"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
      :pagination.sync="{rowsPerPage: 15}"
    >
      <template v-slot:top>
        <div class="col-6">
          <span class="q-table__title q-mr-md">Comments</span>
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
    </q-table>
  </div>
</template>

<script setup lang="ts">
  import {ref, onMounted} from 'vue'
  import { apiRequest } from 'src/services/apiRequest';
  import { Comment } from 'src/models/comment';

  const columns = [
    { name: 'stt', align: 'center', label: 'STT', field: 'stt' },
    { name: 'name', label: 'Commentator', align: 'center', field: (row: Comment) => row.member.name},
    { name: 'blog', label: 'Title blog', align: 'center', field: (row: Comment) => row.blog.title },
    { name: 'content', label: 'Content', field: 'content', align: 'center' },
    { name: 'like_count', label: 'Like', field: 'like_count', align: 'center' },
    { name: 'created_at', label: 'Created at', field: 'created_at', align: 'center' },
  ]
  const rows = ref([] as Comment[]);
  const filter = ref('')

  async function fetchData() {
    try {
      const res = await apiRequest('api/comments');
      if(res.status == 200) {
        rows.value = [...res.data as Comment[]];
      }
    } catch(err) {
      //
      }
    }

  onMounted(async() => {
    await fetchData();
  })

</script>
