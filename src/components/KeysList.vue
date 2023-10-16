<template>
    <div class="flex flex-wrap gap-1 justify-start ">
        <span v-for="key in JSON.parse(keys)" :key="key" :class="key == '-' ? 'tag-' : 'tag'">
            {{ renderKey(key) }}
            <button type="button"
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
import { defineProps, onMounted } from "vue";

const props = defineProps({
    keys: Object | String,
})

onMounted(() => {
    console.log(props.keys);
})

const renderKey = (key) => {
    if (key === "-") return `⏱️`
    return key;
}

</script>