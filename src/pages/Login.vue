<template>
  <div class="row justify-center login">
    <q-card class="col-5">
      <q-card-section>
        <div class="text-h4 text-center">Login</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="onSubmit">
          <q-card-section class="col-12 col-sm-10">
            <q-input
              v-model="user.username"
              type="text"
              dense
              label=""
              placeholder="Email"
              class="q-mb-md"
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'The email field is required']"
            >
              <template v-slot:prepend>
                <app-icon name="user"/>
              </template>

              <template v-slot:label>
                <label>Email <span class="text-red">*</span></label>
              </template>
            </q-input>

            <q-input
              v-model="user.password"
              :type="isPassword ? 'password' : 'text'"
              dense
              label=""
              placeholder="Password"
              @keydown.space.prevent
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'The password field is required.']"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  size="16px"
                  @click="isPassword = !isPassword"
                />
              </template>
              <template v-slot:prepend>
                  <app-icon name="unlock"/>
              </template>
              <template v-slot:label>
                <label>Password <span class="text-red">*</span></label>
              </template>
            </q-input>
          </q-card-section>

          <q-card-actions class="col-12 col-sm-10 q-px-md card-action">
            <q-btn
              type="submit"
              unelevated
              color="primary"
              label="Đăng nhập"
              class="full-width"
              :loading="loading"
              :disable="loading"
            />
            <p class="text-bold text-right full-width font-quicksand q-mt-md">
              <router-link to="/forget-password" class="text-black">Quên mật khẩu?</router-link>
            </p>
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
  import {ref} from 'vue'
  import {Login, LoginRO} from 'src/models/login';
  import { useRouter } from 'vue-router';
  import {apiRequest} from 'src/services/apiRequest'
  import {useAuthStore} from 'src/stores/auth/authStore'
  import {pushNotify} from 'src/helper/notify'

    const user = ref({} as Login);
    const isPassword = ref(true);
    const router = useRouter();
    const loading = ref(false);
    const authStore = useAuthStore();

    const onSubmit = async () => {

      loading.value = true;
      try {
        const res = await apiRequest('api/auth/login', 'post', user.value);
        if(res.status === 200) {
          const data: LoginRO = res.data;
          authStore.setAccessToken(data.access_token);
          await router.push({name: 'Index'});
        } else if(res.status === 401) {
          pushNotify('danger', res.error_messages);
        } else {
          pushNotify('danger', 'Error!');
        }
      } catch(err) {
        //
      }
      loading.value = false;
    }
</script>

<style scoped>
.login {
  margin-top: 100px;
}
</style>

