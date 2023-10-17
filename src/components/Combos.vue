<template>
    <div class="absolute top-0 right-0 bg-gray-200 dark:bg-slate-700 p-2 rounded m-2">
        <!-- title and toggle button -->
        <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Combos</h3>

            <label class="relative inline-flex items-center cursor-pointer ml-2">
                <input type="checkbox" v-model="showCombos" class="sr-only peer" checked>
                <div
                    class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
                </div>
                <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
            </label>
        </div>
        <ul :class="showCombos ? '' : 'hidden'"
            class="max-w-md divide-y divide-gray-200 dark:divide-gray-700 max-h-full overflow-auto">
            <li class="pb-1 sm:pb-2" v-for="combo in list" :key="combo.id">
                <a :href="`?combo=${combo.id}`">
                    <div class="flex items-center space-x-4">
                        <div class="flex-shrink-0">
                            <img class="w-8 h-8 object-cover" v-if="combo.link" :src="combo.link" :alt="combo.name">
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                {{ combo.name }}
                            </p>
                        </div>
                    </div>
                </a>
            </li>
        </ul>

    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCollection, useFirestore } from 'vuefire'
import { collection } from 'firebase/firestore'
const db = useFirestore()
const showCombos = ref(true)

const list = useCollection(collection(db, 'combo'))
</script>