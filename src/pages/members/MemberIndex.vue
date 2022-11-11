<template>
  <div>
    <q-table
      title="Members"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :pagination.sync="{rowsPerPage: 15}"
      @row-click="openDialogEdit"
    >
      <template v-slot:top>
        <div class="q-table__title q-mr-md">Members</div>
        <q-btn label="New" no-caps color="positive" icon="add" @click="showDialogAdd = !showDialogAdd"></q-btn>
      </template>
      <template v-slot:body-cell-stt="scope">
        <td class="text-center">{{ scope.rowIndex + 1 }}</td>
      </template>
    </q-table>

    <common-dialog
      v-model="showDialogEdit"
      title="Edit member"
      :showBtnDelete="true"
      @onClickDelete="onDelete"
      @onClickSave="onSubmitEdit"
    > 
      <template v-slot:content>
        <q-avatar size="100px" @click="imageRef.pickFiles()" class="cursor-pointer q-mb-md">
          <img v-if="!!Object.values(user.avatar)[0] || !!urlImage" :src="urlImage || Object.values(user.avatar)[0].original_url"/>
          <img v-else src="../../assets/images/avatar.svg"/>
        </q-avatar>
        <q-file
          v-show="false"
          ref="imageRef"
          v-model="image"
          accept="image/*"
          clearable
        />
        <form-member v-model="user" :errors="errors"/>
      </template>
    </common-dialog>

    <common-dialog
      v-model="showDialogAdd"
      title="New member"
      @onClickSave="onSubmitNew"
    > 
      <template v-slot:content>
        <q-avatar size="100px" @click="imageRef.pickFiles()" class="cursor-pointer q-mb-md">
          <img v-if="!!urlImage" :src="urlImage || user.avatar"/>
          <img v-else src="../../assets/images/avatar.svg"/>
        </q-avatar>
        <q-file
          v-show="false"
          ref="imageRef"
          v-model="image"
          accept="image/*"
          clearable
        />
        <form-member v-model="user" :errors="errors"/>
      </template>
    </common-dialog>
  </div>
</template>

<script setup lang="ts">
  import {ref, onMounted, watch, Ref} from 'vue'
  import { apiRequest } from 'src/services/apiRequest';
  import { User } from 'src/models/user';
  import CommonDialog from 'src/components/CommonDialog.vue'
  import FormMember from 'src/components/member/FormMember.vue';
  import {pushNotify} from 'src/helper/notify'
  import { QUploader } from 'quasar';
  import { buildFormData } from 'src/services/apiRequest';

  const columns = [
    { name: 'stt', align: 'center', label: 'STT', field: 'stt' },
    { name: 'email', label: 'Email', field: 'email', align: 'center' },
    { name: 'name', label: 'Name', field: 'name', align: 'center' },
    { name: 'phone_number', label: 'Phone', field: 'phone_number', align: 'center' },
    { name: 'status', label: 'Status', align: 'center', field: (row: User) => row.status ? 'Activate' : 'Block' }
  ]
  const rows = ref([] as User[]);
  const showDialogEdit = ref(false);
  const showDialogAdd = ref(false);
  const user = ref({} as User);
  const errors = ref({})
  const urlImage = ref('')
  const image: Ref<File|null> = ref(null);
  const imageRef = ref<QUploader>();

  watch(() => image.value, () => {
    urlImage.value =URL.createObjectURL(image.value);
  })

  async function fetchData() {
    try {
      const res = await apiRequest('api/members');
      if(res.status == 200) {
        rows.value = [...res.data as User[]];
      }
    } catch(err) {
      //
      }
    }

  function openDialogEdit(evt, data: User) {
    showDialogEdit.value = true;
    user.value = {...data};
  }

  async function onSubmitNew() {
    try {
      if(!!image.value) user.value.avatar = image.value;
      const res = await apiRequest('api/members', 'post', buildFormData(user.value), true);
      if(res.status === 200) {
        await fetchData();
        pushNotify('success', 'Add member success!')
        showDialogAdd.value = false;
      } else if(res.status === 422) {
        errors.value = res.data;
      } else {
        pushNotify('danger', 'Add member fail!')
      }
    } catch (err) {
      //
    }
  }

  async function onSubmitEdit() {
    try {
      if(!!image.value) user.value.avatar = image.value;

      const data = {
        name: user.value.name,
        email: user.value.email,
        password: user.value.password,
        phone_number: user.value.phone_number,
        dob: user.value.dob,
        avatar: image.value
      }
      
      const res = await apiRequest(`api/members/${user.value.id}`, 'post', buildFormData(data), true);
      if(res.status === 200) {
        await fetchData();
        pushNotify('success', 'Edit member success!')
        showDialogEdit.value = false;
      } else if(res.status === 422) {
        errors.value = res.data;
      } else {
        pushNotify('danger', 'Edit member fail!')
      }
    } catch (err) {
      //
    }
  }

  async function onDelete() {
    try {
      const res = await apiRequest(`api/members/${user.value.id}`, 'delete');
      if(res.status === 200) {
        await fetchData();
        pushNotify('success', 'Delete member success!')
        showDialogEdit.value = false;                           
      } else {
        pushNotify('danger', 'Delete member fail!')
      }
    } catch (err) {
      //
    }
  }

  watch(() => showDialogAdd.value, (val)=> {
    user.value = {} as User;
    user.value.gender = 0;
    user.value.status = 1;
    urlImage.value = '';
  })
  watch(() => showDialogEdit.value, (val)=> {
    if(!val) {
      user.value = {} as User;
      urlImage.value = '';
    }
  })

  onMounted(async() => {
    await fetchData();
  })

</script>
