<template>
  <q-dialog v-model="open">
    <q-card style="width: 480px">
        <q-card-section>
          <div class="text-h6">{{title}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <slot name="content" ></slot>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Save" color="primary" @click="$emit('onClickSave')" no-caps/>
          <q-btn v-show="showBtnDelete" label="Delete" color="red" @click="secondDialog = !secondDialog"  no-caps/>
          <q-btn label="Close" type="reset" color="primary" flat class="q-ml-sm" v-close-popup  no-caps/>
        </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-if="showBtnDelete" v-model="secondDialog">
      <q-card style="width: 300px">
        <q-card-section>
          <div class="text-h6">Are you sure?</div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup @click="$emit('onClickDelete')"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
  import {defineProps, computed, defineEmits, ref} from 'vue'

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    showBtnDelete: {
      type: Boolean,
      default: false
    },
  })

  const secondDialog = ref(false)

  const emit= defineEmits(['update:modelValue', 'onClickSave'])

  const open = computed({
          get: () => props.modelValue,
          set: value => emit('update:modelValue', value)
        });
</script>
