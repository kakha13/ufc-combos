<template>
    <div class="flex flex-wrap gap-1 justify-start ">
        <span v-for="(key,index) in data" :key="index" :class="key == '-' ? 'tag-' : 'tag'">
            {{ renderKey(key) }}
            <button type="button" @click="removeKey(index)"
                class="inline-flex items-center p-1 text-sm text-green-400 bg-transparent rounded-sm hover:bg-green-200 hover:text-green-900 dark:hover:bg-green-800 dark:hover:text-green-300"
                data-dismiss-target="#badge-dismiss-default" aria-label="Remove">
                <svg class="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                </svg>
                <span class="sr-only">Remove badge</span>
            </button>
        </span>
    </div>
</template>

<script setup>
import { defineProps, onMounted, ref,defineEmits } from "vue";

const props = defineProps(["keys"])

const data = ref(props.keys)

const emit = defineEmits(['updateData']);

onMounted(() => {
    console.log(data.value);
})

const renderKey = (key) => {
    if (key === "-") return `⏱️`
    return key;
}

const removeKey = (index) => {
    const keysArray = data.value;
    keysArray.splice(index, 1);

}


</script>