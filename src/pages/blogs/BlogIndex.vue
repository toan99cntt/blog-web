<template>
  <div>
    <q-table
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
      :pagination.sync="{rowsPerPage: 15}"
      @row-click="openDialogEdit"
    >
      <template v-slot:top>
        <div class="col-6">
          <span class="q-table__title q-mr-md">Blogs</span>
          <q-btn label="New" no-caps color="positive" icon="add" @click="showDialogAdd = !showDialogAdd"></q-btn>
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

    <common-dialog
      v-model="showDialogEdit"
      title="Edit blog"
      :showBtnDelete="true"
      @onClickSave="onSubmitEdit"
      @onClickDelete="onDelete"
    >
      <template v-slot:content>
        <div size="100px" @click="imageRef.pickFiles()" class="cursor-pointer q-mb-md">
          <q-img
            v-if="blog.image.length || !!urlImage" :src="urlImage || blog.image[0].url"
            :ratio="16/9"
          />
          <q-img
            v-else
            src="../../assets/images/image-asset.jpeg"
            :ratio="16/9"
          >
          <q-icon class="absolute all-pointer-events" size="32px" name="edit" color="red" style="top: 8px; left: 8px">
            <q-tooltip>
              Change image
            </q-tooltip>
          </q-icon>
          </q-img>
        </div>
        <q-file
          v-show="false"
          ref="imageRef"
          v-model="image"
          accept="image/*"
          clearable
        />
        <form-blog v-model="blog" :errors="errors"/>
      </template>
    </common-dialog>

    <common-dialog
      v-model="showDialogAdd"
      title="New Blog"
      @onClickSave="onSubmitNew"
    >
      <template v-slot:content>
        <div size="100px" @click="imageRef.pickFiles()" class="cursor-pointer q-mb-md">
          <q-img
            v-if="!!urlImage" :src="urlImage"
            :ratio="16/9"
          />
          <q-img
            v-else
            src="../../assets/images/image-asset.jpeg"
            :ratio="16/9"
          >
          <q-icon class="absolute all-pointer-events" size="32px" name="edit" color="red" style="top: 8px; left: 8px">
            <q-tooltip>
              Change image
            </q-tooltip>
          </q-icon>
          </q-img>
        </div>
        <q-file
          v-show="false"
          ref="imageRef"
          v-model="image"
          accept="image/*"
          clearable
        />
        <form-blog v-model="blog" :errors="errors"/>
      </template>
    </common-dialog>
  </div>
</template>

<script setup lang="ts">
  import {ref, onMounted, watch, Ref} from 'vue'
  import { apiRequest } from 'src/services/apiRequest';
  import { Blog } from 'src/models/blog';
  import CommonDialog from 'src/components/CommonDialog.vue'
  import FormBlog from 'src/components/blog/FormBlog.vue';
  import {pushNotify} from 'src/helper/notify'
  import { QUploader } from 'quasar';
  import { buildFormData } from 'src/services/apiRequest';

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
  const image: Ref<File|null> = ref(null);
  const imageRef = ref<QUploader>();
  const urlImage = ref('')
  const filter = ref('')

  watch(() => image.value, (val) => {
    if(val) urlImage.value =URL.createObjectURL(image.value);
  })

  async function fetchData() {
    try {
      const res = await apiRequest('api/blogs/all');
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
      const data = {
        _title: blog.value.title,
        _content: blog.value.content,
        _image: !!image.value ? image.value : null,
        _status: blog.value.status ? '1' : '0'
      }
      const res = await apiRequest('api/blogs', 'post', buildFormData(data), true);
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
      const data = {
        _title: blog.value.title,
        _content: blog.value.content,
        _status: blog.value.status ? '1' : '0'
      }
      if(!!image.value) data._image = image.value;
      const res = await apiRequest(`api/blogs/${blog.value.id}`, 'post', buildFormData(data), true);
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
    image.value = null;
  })
  watch(() => showDialogEdit.value, (val)=> {
    if(!val) blog.value = {} as Blog;
    image.value = null;
  })

  onMounted(async() => {
    await fetchData();
  })

</script>
