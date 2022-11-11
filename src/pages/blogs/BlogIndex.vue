<template>
  <div>
    <q-table
      title="Blogs"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :pagination.sync="{rowsPerPage: 15}"
      @row-click="openDialogEdit"
    >
      <template v-slot:top>
        <div class="q-table__title q-mr-md">Blogs</div>
        <q-btn label="New" no-caps color="positive" icon="add" @click="showDialogAdd = !showDialogAdd"></q-btn>
      </template>
      <template v-slot:body-cell-stt="scope">
        <td class="text-center">{{ scope.rowIndex + 1 }}</td>
      </template>
    </q-table>

    <common-dialog
      v-model="showDialogEdit"
      title="Edit blog"
      :showBtnDelete="true"
      @onClickSave="onSubmitEdit"
      @onClickDelete="onDelete"
    > 
      <template v-slot:content>
        <form-blog v-model="blog" :errors="errors"/>
      </template>
    </common-dialog>

    <common-dialog
      v-model="showDialogAdd"
      title="New Blog"
      @onClickSave="onSubmitNew"
    > 
      <template v-slot:content>
        <form-blog v-model="blog" :errors="errors"/>
      </template>
    </common-dialog>
  </div>
</template>

<script setup lang="ts">
  import {ref, onMounted, watch} from 'vue'
  import { apiRequest } from 'src/services/apiRequest';
  import { Blog } from 'src/models/blog';
  import CommonDialog from 'src/components/CommonDialog.vue'
  import FormBlog from 'src/components/blog/FormBlog.vue';
  import {pushNotify} from 'src/helper/notify'

  const columns = [
    { name: 'stt', align: 'center', label: 'STT', field: 'stt' },
    { name: 'author', label: 'Author', align: 'center',  field: (row: Blog) => row.member.name},
    { name: 'title', label: 'Title', field: 'title', align: 'center' },
    { name: 'like_count', label: 'Like', field: 'like_count', align: 'center' },
    { name: 'created_at', label: 'Created at', field: 'created_at', align: 'center' },
    { name: 'status', label: 'Status', align: 'center', field: (row: Blog) => row.status ? 'Show' : 'Hide' }
  ]
  const rows = ref([] as Blog[]);
  const showDialogEdit = ref(false);
  const showDialogAdd = ref(false);
  const blog = ref({} as Blog);
  const errors = ref({})
  async function fetchData() {
    try {
      const res = await apiRequest('api/blogs');
      if(res.status == 200) {
        rows.value = [...res.data as Blog[]];
      }
    } catch(err) {
      //
      }
    }

  function openDialogEdit(evt, data: Blog) {
    showDialogEdit.value = true;
    blog.value = {...data};
  }

  async function onSubmitNew() {
    try {
      const res = await apiRequest('api/blogs', 'post', blog.value);
      if(res.status === 200) {
        await fetchData();
        pushNotify('success', 'Add blog success!')
        showDialogAdd.value = false;
      } else if(res.status === 422) {
        errors.value = res.data;
      } else {
        pushNotify('danger', 'Add blog fail!')
      }
    } catch (err) {
      //
    }
  }

  async function onSubmitEdit() {
    try {
      const res = await apiRequest(`api/blogs/${blog.value.id}`, 'put', blog.value);
      if(res.status === 200) {
        await fetchData();
        pushNotify('success', 'Edit blog success!')
        showDialogEdit.value = false;
      } else if(res.status === 422) {
        errors.value = res.data;
      } else {
        pushNotify('danger', 'Edit blog fail!')
      }
    } catch (err) {
      //
    }
  }

  async function onDelete() {
    try {
      const res = await apiRequest(`api/blogs/${blog.value.id}`, 'delete');
      if(res.status === 200) {
        await fetchData();
        pushNotify('success', 'Delete blog success!')
        showDialogEdit.value = false;
      } else {
        pushNotify('danger', 'Delete blog fail!')
      }
    } catch (err) {
      //
    }
  }

  watch(() => showDialogAdd.value, (val)=> {
    blog.value = {} as Blog;
  })
  watch(() => showDialogEdit.value, (val)=> {
    if(!val) blog.value = {} as Blog;
  })

  onMounted(async() => {
    await fetchData();
  })

</script>
