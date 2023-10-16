<script setup>
import { ref, computed, onMounted } from 'vue'

defineProps({
  msg: String,
})

const keys = ref('["L2","L1","Square","-","L2","L1","Triangle","-","L2","L1","Square"]');
const delay = ref(1);
const name = ref('')
const link = ref('')

const divider = "-";

// computed delay convert to ms
const delayMs = computed(() => {
  return delay.value * 1000;
});


const displayElementsWithDelay = () => {

  let jsonArray = JSON.parse(keys.value);
  let elementsBeforeDivider = [];
  let elementsAfterDivider = [];
  let showElements = elementsBeforeDivider;
  for (const element of jsonArray) {
    if (element === divider) {
      showElements = elementsAfterDivider;
      continue;
    }

    showElements.push(element);
  }

  // Display the first set of elements with the "pressed" class
  elementsBeforeDivider.forEach(element => {
    console.log(element);
    add(element);
  });

  // Wait for 1000ms and then remove the "pressed" class from the first set of elements
  setTimeout(() => {
    elementsBeforeDivider.forEach(element => {
      rm(element);
    });


  }, delayMs.value);
  setTimeout(() => {
    // Display the second set of elements with the "pressed" class
    elementsAfterDivider.forEach(element => {
      console.log(element);
      add(element);

    });
  }, delayMs.value * 1.5);

}

const add = (element) => {
  if (["Triangle", "Circle", "Cross", "Square", "L1", "L2","R2"].includes(element)) {
    let elementSelector = document.querySelector(`[data-key='${element}']`);
    elementSelector.classList.add("pressed");
  } 
}

const rm = (element) => {
  // remove all pressed class

  document.querySelectorAll(".pressed").forEach(element => {
    element.classList.remove("pressed")
  });

  // // if element in array Triangle Circle Cross Square 
  // if (["Triangle", "Circle", "Cross", "Square", "L1", "L2","R2"].includes(element)) {
  //   let elementSelector = document.querySelector(`[data-key='${element}']`);
  //   elementSelector.classList.remove("pressed");
  // }
}

function setHashStr() {
  let hesh = JSON.parse(keys.value).map(item => item);
  hesh = btoa(`${hesh}|${delay.value}|${name.value}|${link.value}`);

  console.log(hesh);

  location.hash = hesh
}

function reverse(inputString) {

  let [keysString, delayString, nameString, linkString] = atob(inputString).split("|");

  let keysArray = keysString.split(",").map(item => {
    if (item === "-") {
      return item;
    } else {
      return item.trim();
    }
  });

  delay.value = parseFloat(delayString);

  name.value = nameString;

  link.value = linkString;

  keys.value = keysArray;
  console.log(keys.value);
  return keysArray;
}

const sendKeys = () => {
  console.log("Sending keys");

  document.querySelectorAll(".pressed").forEach(element => {
    element.classList.remove("pressed")
  });

  displayElementsWithDelay()
}

onMounted(() => {
  if (location.hash) {
    console.log(location.hash);
    keys.value = JSON.stringify(reverse(location.hash.slice(1)));
  }
})

const count = ref(0)
</script>

<template>
  <form class="w-96 bg-gray-200 dark:bg-slate-700 p-2 absolute rounded m-2">
    <div class="flex flex-col gap-2">

      <div>
        <h1 class="text-xl heading-normal font-bold text-gray-900 dark:text-white">{{ name }}</h1>
        <!-- video or image -->
        <div class="aspect-w-16 aspect-h-9">
          <img :src="link" alt="">
        </div>
      </div>
      <div>
        <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Keys
        </label>
        <textarea id="message" v-model="keys" rows="2"
          class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your thoughts here..."></textarea>
      </div>
      <div>
        <!-- input name -->
        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Name
        </label>
        <input id="name" v-model="name" type="text"
          class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your thoughts here...">

      </div>
      <div>
        <label for="link" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Video or Image
        </label>
        <input id="link" v-model="link" type="text"
          class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your thoughts here...">

      </div>

      <div class="flex justify-between">
        <div>
          <label for="large-range" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Time
            {{ delay }}s</label>
          <input type="range" v-model="delay" min="0.5" max="5" step="0.5"
            class="appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-black/25 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[20px] [&::-webkit-slider-thumb]:w-[20px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500" />


        </div>
        <div>
          <button type="button" @click="sendKeys()"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">

            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 459 459" fill="currentColor"
              xml:space="preserve">
              <path
                d="M229.5 0C102.751 0 0 102.751 0 229.5S102.751 459 229.5 459 459 356.249 459 229.5 356.249 0 229.5 0zm80.792 239.651-111.764 76.084a12.281 12.281 0 0 1-19.19-10.151V153.416a12.281 12.281 0 0 1 19.19-10.151l111.764 76.084a12.28 12.28 0 0 1 0 20.302z" />
            </svg>
            <span class="sr-only">Send</span>
          </button>
          <button type="button" @click="setHashStr()"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            <!-- share svg -->
            <svg class="w-5 h-5" version="1.1" fill="currentColor" viewBox="0 0 458.62 458.62" xml:space="preserve"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="m339.59 314.53c-14.215 0-27.456 4.133-38.621 11.239l-112.68-78.67c1.809-6.315 2.798-12.976 2.798-19.871 0-6.896-0.989-13.557-2.798-19.871l109.64-76.547c11.764 8.356 26.133 13.286 41.662 13.286 39.79 0 72.047-32.257 72.047-72.047s-32.256-72.048-72.046-72.048-72.047 32.257-72.047 72.047c0 5.255 0.578 10.373 1.646 15.308l-112.42 78.491c-10.974-6.759-23.892-10.666-37.727-10.666-39.79 0-72.047 32.257-72.047 72.047s32.256 72.047 72.047 72.047c13.834 0 26.753-3.907 37.727-10.666l113.29 79.097c-1.629 6.017-2.514 12.34-2.514 18.872 0 39.79 32.257 72.047 72.047 72.047s72.047-32.257 72.047-72.047-32.257-72.048-72.047-72.048z" />
            </svg>
            <span class="sr-only">Share</span>
          </button>
        </div>
      </div>

    </div>
  </form>
</template>
