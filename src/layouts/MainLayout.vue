<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Manager
        </q-toolbar-title>
        <q-btn color="white" :label="userProfile.name" icon="person" flat dense >
          <q-menu>
            <div class=" q-pa-md">
              <div class="">
                <div class="text-lg text-bold q-mb-md">Profile <q-btn class="q-px-sm" icon="edit" size="11px" flat @click="showDialog"></q-btn></div>
                <div><span class="text-bold">Name: </span> {{userProfile.name}}</div>
                <div><span class="text-bold">Email: </span> {{userProfile.email}}</div>
                <div><span class="text-bold">Phone: </span> {{!!userProfile.phone_number ? userProfile.phone_number : '-'}}</div>
                <div><span class="text-bold">Dob: </span> {{!!userProfile.dob ? user.dob : '-'}}</div>
                <q-btn
                  flat
                  dense
                  no-caps
                  color="red"
                  label="Logout"
                  class="float-right"
                  icon-right="logout"
                  @click="logout"
                />
              </div>
            </div>
          </q-menu>
        </q-btn>
        
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
        Management
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <common-dialog 
      v-model="showDialogEditUser"
      title="Edit Profile"
      @onClickSave="editInfoUser"
    >
      <template v-slot:content>
        <form-member v-model="user" :errors="errors"/>
      </template>
    </common-dialog>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import {useAuthStore} from 'src/stores/auth/authStore'
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia'
import CommonDialog from 'src/components/CommonDialog.vue';
import FormMember from 'src/components/member/FormMember.vue';
import { User } from 'src/models/user';
import {pushNotify} from 'src/helper/notify'
import { apiRequest } from 'src/services/apiRequest';

const essentialLinks = [
  {
    title: 'Members ',
    icon: 'person',
    route: 'MemberIndex'
  },
  {
    title: 'Blogs',
    icon: 'article',
    route: 'BlogIndex'
  },
  {
    title: 'Message',
    icon: 'chat',
    route: 'MessageIndex'
  },
  {
    title: 'Comment',
    icon: 'feedback',
    route: 'CommentIndex'
  },

];

const authStore = useAuthStore();
const router = useRouter();
const {userProfile} = storeToRefs(authStore);
const leftDrawerOpen = ref(false)
const showDialogEditUser = ref(false)
const errors = ref({});
const user = ref({} as User);

function logout() {
  authStore.logout();
  router.push({name: 'Login'});
}

async function editInfoUser() {
  try {
    const res = await apiRequest(`api/members/${user.value.id}`, 'post', user.value);
    if(res.status === 200) {
      await authStore.checkAuth();
      pushNotify('success', 'Edit member success!')
      showDialogEditUser.value = false;
    } else if(res.status === 422) {
      errors.value = res.data;
    } else {
      pushNotify('danger', 'Edit member fail!')
    }
  } catch (err) {
    //
  }
}

function showDialog() {
  user.value = {...userProfile.value};
  showDialogEditUser.value = true;
}

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style>
.q-menu {
  top: 52px !important;
  max-width: 300px !important;
  min-width: 150px !important;
}
</style>
