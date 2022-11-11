<template>
  <q-input
    filled
    v-model="user.name"
    label="Name"
    :error="!!errors.name"
  >
    <template v-slot:error>
      {{errors.name[0]}}
    </template>
  </q-input>

  <q-input
    filled
    v-model="user.email"
    label="Email"
    :error="!!errors.email"
  >
    <template v-slot:error>
      {{errors.email[0]}}
    </template>
  </q-input>

  <q-input
    filled
    v-model="user.password"
    :type="isPassword ? 'password' : 'text'"
    label="Password"
    :error="!!errors.password"
  >
    <template v-slot:append>
      <q-icon
        :name="isPassword ? 'visibility_off' : 'visibility'"
        class="cursor-pointer"
        size="16px"
        @click="isPassword = !isPassword"
      />
    </template>
    <template v-slot:error>
      {{errors.password[0]}}
    </template>
  </q-input>

  <div class="q-mt-none">
    <label for="">Gender: </label>
    <q-radio v-model="user.gender" :val="0" label="Female"/>
    <q-radio v-model="user.gender" :val="1" label="Male"/>
  </div>

  <q-input
    filled  
    v-model="user.phone_number"
    label="Phone"
    :error="!!errors.password"
  >
    <template v-slot:error>
      {{errors.password[0]}}
    </template>
  </q-input>

  <q-input filled v-model="user.dob" label="Dob" readonly :error="!!errors.dob">
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="user.dob" minimal mask="DD-MM-YYYY">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
    <template v-slot:error>
      {{errors.dob[0]}}
    </template>
  </q-input>

  <div class="q-mt-none">
    <label for="">Status: </label>
    <q-radio v-model="user.status" :val="0" label="Block" />
    <q-radio v-model="user.status" :val="1" label="Activate"/>
  </div>
</template>

<script setup lang="ts">
  import { defineEmits, defineProps, computed, ref, watch, Ref } from 'vue';
  import { User } from 'src/models/user';

  const emit = defineEmits(['update:modelValue']);
  const props = defineProps({
    modelValue: {
      type: Object as ()  => User ,
      default: {} as User
    },
    errors: {
      type: Object as ()  => User ,
      default: {} as User
    },
  })
  const isPassword = ref(true)

  const user = computed({
          get: () => props.modelValue,
          set: value => emit('update:modelValue', value)
        });
</script>