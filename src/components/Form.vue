<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'
const db = useFirestore()

import draggable from 'vuedraggable'
import { get } from 'firebase/database';

const keys = ref(JSON.parse('["L2","L1","Square","-","L2","L1","Triangle","-","L2","L1","Square"]'));
const delay = ref(1);
const name = ref('')
const link = ref('')
const open = ref(true)
const drag = ref(false)
const debug = ref(false)
const convert = ref(false)
const sharing = ref(false)
const stringToJson = ref("L1 + Square, L2 + L1 + Triangle, L1 + Square")

let keysArray = ["Triangle", "Circle", "Cross", "Square", "L1", "L2", "R2"];
const divider = "-";

// computed delay convert to ms
const delayMs = computed(() => {
  return delay.value * 1000;
});

// editable computed keys
const computedKeys = computed({
  get: () => {
    return JSON.stringify(keys.value);
  },
  set: (value) => {
    keys.value = JSON.parse(value);
  }
});

const displayElementsWithDelay = () => {
  let jsonArray = keys.value;
  let elementGroups = [[]];
  for (const element of jsonArray) {
    if (element === divider) {
      elementGroups.push([]);
      continue;
    }
    elementGroups[elementGroups.length - 1].push(element);
  }

  // Display each set of elements with the "pressed" class
  let delay = 0;
  for (const elements of elementGroups) {
    setTimeout(() => {
      elements.forEach(element => {
        add(element);
      });
    }, delay);

    delay += delayMs.value;
    setTimeout(() => {
      elements.forEach(element => {
        rm(element);
      });
    }, delay);
  }

}

const add = (element) => {
  let elementSelector = document.querySelector(`[data-key='${element}']`);
  elementSelector.classList.add("pressed");
}

const rm = (element) => {
  document.querySelectorAll(".pressed").forEach(element => {
    element.classList.remove("pressed")
  });
}

const share = async () => {

  // check if name is not empty
  sharing.value = true;
  if (name.value === '') {
    alert("Name is required");
    return;
  }
  // check if key is not empty
  if (keys.value.length === 0) {
    alert("Keys is required");
    return;
  }

  // add to database
  // assing id automatically

  const docRef = doc(collection(db, "combo"));
  const payload = {
    name: name.value,
    link: link.value,
    keys: keys.value,
    delay: delay.value
  }
  // get id
  await setDoc(docRef, payload);
  const { id } = docRef;
  let url = `${location.origin}${location.pathname}?combo=${id}`

  prompt("Copy to clipboard: Ctrl+C, Enter", `${url}`);
}

const convertToJson = () => {
  const keysValue = stringToJson.value;
  const keysArray = keysValue.split(", ").flatMap(keyCombo => {
    const keys = keyCombo.split(" + ");
    let result = [];
    keys.concat(divider).forEach(key => result.push(key));

    return result;
  });

  keys.value = keysArray.pop() === divider ? keysArray : keysArray.concat(divider);
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
  rm();
  displayElementsWithDelay()
}

const addKey = (key) => {
  keys.value.push(key);
}

const removeKey = (index) => {
  const keysArray = keys.value;
  keysArray.splice(index, 1);
}

const renderKey = (key) => {
  if (key === "-") return `⏱️`
  return key;
}

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('combo');

  if (id) {
    // read data from combo
    const docRef = doc(db, "combo", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      name.value = docSnap.data().name;
      link.value = docSnap.data().link;
      keys.value = docSnap.data().keys ?? null;
      delay.value = docSnap.data().delay;
      // change page title
      document.title = name.value;
    } else {
      alert("No such combo!");
    }
  }
})


</script>

<template>
  <div>
    <div class="controller active ds4">

      <div class="triggers">
        <span class="trigger left" @click="addKey('L2')" data-key="L2" data-name="button-left-shoulder-bottom"></span>
        <span class="trigger right" @click="addKey('R2')" data-key="R2" data-name="button-right-shoulder-bottom"></span>
        <span class="trigger-button left" data-name="button-left-shoulder-bottom-digital"></span>
        <span class="trigger-button right" data-name="button-right-shoulder-bottom-digital"></span>
        <span class="clear"></span>
      </div>
      <div class="bumpers">
        <span class="bumper left" @click="addKey('R1')" data-key="L1" data-name="button-left-shoulder-top"></span>
        <span class="bumper right" @click="addKey('R1')" data-key="R1" data-name="button-right-shoulder-top"></span>
        <span class="clear"></span>
      </div>
      <div class="touchpad" data-name="touch-pad"></div>
      <div class="quadrant p0"></div>
      <div class="meta" data-name="button-meta"></div>
      <div class="arrows">
        <span class="back" data-name="button-select"></span>
        <span class="start" data-name="button-start"></span>
        <span class="clear"></span>
      </div>
      <div class="abxy">
        <span class="button a Cross" @click="addKey('Cross')" data-key="Cross" data-name="button-1"></span>
        <span class="button b Circle " @click="addKey('Circle')" data-key="Circle" data-name="button-2"></span>
        <span class="button x Square" @click="addKey('Square')" data-key="Square" data-name="button-3"></span>
        <span class="button y Triangle" @click="addKey('Triangle')" data-key="Triangle" data-name="button-4"></span>
      </div>
      <div class="sticks">
        <span class="stick left" data-name="stick-1"
          style="margin-left: 0px; margin-top: 0px; transform: rotateX(0deg) rotateY(0deg);"></span>
        <span class="stick right" data-name="stick-2"
          style="margin-left: 0px; margin-top: 0px; transform: rotateX(0deg) rotateY(0deg);"></span>
      </div>
      <div class="wheels">
        <span class="wheel left" data-name="stick-1-wheel" style="transform: rotate(0deg);"></span>
        <span class="wheel right" data-name="stick-2-wheel" style="transform: rotate(0deg);"></span>
      </div>
      <div class="dpad">
        <span class="face up" data-name="button-dpad-top"></span>
        <span class="face down" data-name="button-dpad-bottom"></span>
        <span class="face left" data-name="button-dpad-left"></span>
        <span class="face right" data-name="button-dpad-right"></span>
      </div>
      <div class="fstick" data-name="arcade-stick"></div>
    </div>

    <form class="bg-gray-200 dark:bg-slate-700 p-2 absolute rounded m-2 max-h-full overflow-auto">

      <div class="flex gap-3">
        <button data-collapse-toggle="navbar-hamburger" type="button" @click="open = !open"
          class="inline-flex items-center mr-auto outline-none justify-center p-2 w-10 h-10 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-hamburger" aria-expanded="false">
          <span class="sr-only">Open main menu</span>
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M1 1h15M1 7h15M1 13h15" />
          </svg>
        </button>
        <button type="button" @click="sendKeys()"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">

          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 459 459" fill="currentColor"
            xml:space="preserve">
            <path
              d="M229.5 0C102.751 0 0 102.751 0 229.5S102.751 459 229.5 459 459 356.249 459 229.5 356.249 0 229.5 0zm80.792 239.651-111.764 76.084a12.281 12.281 0 0 1-19.19-10.151V153.416a12.281 12.281 0 0 1 19.19-10.151l111.764 76.084a12.28 12.28 0 0 1 0 20.302z" />
          </svg>
          <span class="sr-only">Send</span>
        </button>
        <button type="button" @click="share()"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <!-- share svg -->
          <svg class="w-5 h-5" version="1.1" fill="currentColor" viewBox="0 0 458.62 458.62" xml:space="preserve"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="m339.59 314.53c-14.215 0-27.456 4.133-38.621 11.239l-112.68-78.67c1.809-6.315 2.798-12.976 2.798-19.871 0-6.896-0.989-13.557-2.798-19.871l109.64-76.547c11.764 8.356 26.133 13.286 41.662 13.286 39.79 0 72.047-32.257 72.047-72.047s-32.256-72.048-72.046-72.048-72.047 32.257-72.047 72.047c0 5.255 0.578 10.373 1.646 15.308l-112.42 78.491c-10.974-6.759-23.892-10.666-37.727-10.666-39.79 0-72.047 32.257-72.047 72.047s32.256 72.047 72.047 72.047c13.834 0 26.753-3.907 37.727-10.666l113.29 79.097c-1.629 6.017-2.514 12.34-2.514 18.872 0 39.79 32.257 72.047 72.047 72.047s72.047-32.257 72.047-72.047-32.257-72.048-72.047-72.048z" />
          </svg>
          <span class="sr-only">Share</span>
        </button>
      </div>
      <div class="flex flex-col gap-2 w-96" :class="open ? '' : 'hidden'">

        <div>
          <h1 class="text-xl heading-normal font-bold text-gray-900 dark:text-white py-2">{{ name }}</h1>
          <!-- video or image -->
          <div class="aspect-w-16 aspect-h-9">
            <img :src="link" alt="">
          </div>
        </div>
        <div>
          <!-- show keys as tags -->

          <draggable v-model="keys" group="keys" class="flex flex-wrap gap-1 justify-start " @start="drag = true"
            @end="drag = false" item-key="id">
            <template #item="{ element, index }">

              <span :class="element == '-' ? 'tag-' : 'tag'">
                {{ renderKey(element) }}
                <button type="button" @click="removeKey(index)"
                  class="inline-flex items-center p-1 text-sm text-green-400 bg-transparent rounded-sm hover:bg-green-200 hover:text-green-900 dark:hover:bg-green-800 dark:hover:text-green-300"
                  data-dismiss-target="#badge-dismiss-default" aria-label="Remove">
                  <svg class="w-2 h-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                  </svg>
                  <span class="sr-only">Remove badge</span>
                </button>
              </span>
            </template>
          </draggable>


          <button @click="addKey('-')" type="button"
            class="inline-flex mt-2 ml-auto items-center p-1 text-sm text-white bg-transparent rounded-sm hover:bg-yellow-200 bg-yellow-600 hover:text-yellow-700 dark:hover:bg-yellow-700 dark:hover:text-yellow-300">Add
            {{
              renderKey("-") }}</button>

        </div>
        <div class="bg-white/10 rounded p-1.5">
          <label @click="debug = !debug" for="message" class="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
            COMBINATIONS <em class="font-normal text-gray-100">{{ debug ? 'hide' : 'show' }}</em>
          </label>
          <textarea id="message" v-model="computedKeys" rows="2" :class="debug ? '' : 'hidden'"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg outline-none border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your thoughts here..."></textarea>
        </div>

        <div class="bg-white/10 rounded p-1.5">
          <label for="convert" @click="convert = !convert"
            class="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
            CONVERT <em class="font-normal text-gray-100">{{ convert ? 'hide' : 'show' }}</em>
          </label>
          <textarea id="convert" v-model="stringToJson" rows="2" :class="convert ? '' : 'hidden'"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg outline-none border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write your thoughts here..."></textarea>
          <button @click="convertToJson()" :class="convert ? '' : 'hidden'"
            class="inline-flex mt-2 ml-auto items-center p-1 text-sm text-white bg-transparent rounded-sm hover:bg-yellow-200 bg-yellow-600 hover:text-yellow-700 dark:hover:bg-yellow-700 dark:hover:text-yellow-300"
            type="button">Convert To JSON</button>
        </div>

        <div class="bg-white/10 rounded p-1.5 space-y-2">
          <label class="block mb-2 text-sm font-bold text-gray-900 dark:text-white" @click="sharing = !sharing">SHARE <em
              class="font-normal text-gray-100">{{ sharing ? 'hide' : 'show' }}</em></label>
          <div :class="sharing ? '' : 'hidden'">
            <!-- input name -->
            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Name
            </label>
            <input id="name" v-model="name" type="text"
              class="block p-2.5 w-full text-sm outline-none text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write your thoughts here...">

          </div>

          <div :class="sharing ? '' : 'hidden'">
            <label for="link" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Video or Image
            </label>
            <input id="link" v-model="link" type="text"
              class="block p-2.5 w-full text-sm outline-none text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write your thoughts here...">

          </div>
          <div :class="sharing ? '' : 'hidden'">
            <button type="button" @click="share()"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-2 px-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <!-- share svg -->
              <svg class="w-5 h-5" version="1.1" fill="currentColor" viewBox="0 0 458.62 458.62" xml:space="preserve"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="m339.59 314.53c-14.215 0-27.456 4.133-38.621 11.239l-112.68-78.67c1.809-6.315 2.798-12.976 2.798-19.871 0-6.896-0.989-13.557-2.798-19.871l109.64-76.547c11.764 8.356 26.133 13.286 41.662 13.286 39.79 0 72.047-32.257 72.047-72.047s-32.256-72.048-72.046-72.048-72.047 32.257-72.047 72.047c0 5.255 0.578 10.373 1.646 15.308l-112.42 78.491c-10.974-6.759-23.892-10.666-37.727-10.666-39.79 0-72.047 32.257-72.047 72.047s32.256 72.047 72.047 72.047c13.834 0 26.753-3.907 37.727-10.666l113.29 79.097c-1.629 6.017-2.514 12.34-2.514 18.872 0 39.79 32.257 72.047 72.047 72.047s72.047-32.257 72.047-72.047-32.257-72.048-72.047-72.048z" />
              </svg>
              <span class="ml-2">Share</span>
            </button>
          </div>

        </div>

        <div class="flex justify-between">
          <div>
            <label for="large-range" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Time
              {{ delay }}s</label>
            <input type="range" v-model="delay" min="0.5" max="5" step="0.5"
              class="appearance-none bg-transparent [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-black/25 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[20px] [&::-webkit-slider-thumb]:w-[20px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500" />


          </div>

        </div>

      </div>
    </form>
  </div>
</template>

