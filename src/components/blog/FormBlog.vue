<template>
  <q-input
    filled
    v-model="blog.title"
    label="Title"
    :error="!!errors.title"
  >
    <template v-slot:error>
      {{errors.title[0]}}
    </template>
  </q-input>

  <q-input
    filled
    v-model="blog.content"
    label="Content"
    type="textarea"
    :error="!!errors.content"
  >
    <template v-slot:error>
      {{errors.content[0]}}
    </template>
  </q-input>
  
  <div class="q-mt-none">
    <q-radio v-model="blog.status" :val="0" label="Block" />
    <q-radio v-model="blog.status" :val="1" label="Activate"/>
  </div>
</template>

<script setup lang="ts">
  import { defineEmits, defineProps, computed, ref } from 'vue';
  import { Blog } from 'src/models/blog';

  const emit = defineEmits(['update:modelValue']);
  const props = defineProps({
    modelValue: {
      type: Object as ()  => Blog ,
      default: {} as Blog
    },
    errors: {
      type: Object as ()  => Blog ,
      default: {} as Blog
    },
  })
  const isPassword = ref(true)

  const blog = computed({
          get: () => props.modelValue,
          set: value => emit('update:modelValue', value)
        });
</script>