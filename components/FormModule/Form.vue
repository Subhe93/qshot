<template>
  <div class="form-div rounded-2xl p-5 relative">
    <div class="text-2xl text-center mb-1">{{ props.module.title }}</div>
    <div v-for="(input, index) in props.module.questions" :key="input">
      <div v-if="input.type === 'text'">
        <div class="questions-text pt-3 pb-3">
          <!-- <div class="text-lg">
            {{ input.data.question }} <span v-if="input.data.required">*</span>
          </div> -->
          <div class="text-white-new text-base bio_text mb-2">
            {{ input.data.description }}
          </div>
          <input
            type="text"
            :placeholder="input.data.question + (input.data.required ? '*' : '')"
            class="form-input w-full rounded-2xl px-4 py-3"
            :required="input.data.required"
            v-model="input.answer"
          />
          <div
            v-if="isFormSubmitted && input.data.required && !input.answer"
            class="text-red-500 text-sm mt-2"
          >
            This field is required.
          </div>
        </div>
      </div>
      <div v-if="input.type === 'paragraph'">
        <div class="questions-paragraph pt-3 pb-3">
          <!-- <div class="text-lg">
            {{ input.data.question }} <span v-if="input.data.required">*</span>
          </div> -->
          <div class="text-white-new text-base bio_text mb-2">
            {{ input.data.description }}
          </div>
          <textarea
            :placeholder="input.data.question + (input.data.required ? '*' : '')"
            class="form-input w-full rounded-2xl px-4 py-3"
            :required="input.data.required"
            v-model="input.answer"
          />
          <div
            v-if="isFormSubmitted && input.data.required && !input.answer"
            class="text-red-500 text-sm mt-2"
          >
            This field is required.
          </div>
        </div>
      </div>
      <div v-if="input.type === 'choices'">
        <div class="questions-choices pt-3 pb-3">
          <div class="text-lg">
            {{ input.data.question }} <span v-if="input.data.required">*</span>
          </div>
          <div class="text-white-new text-base bio_text mb-2">
            {{ input.data.description }}
          </div>
        </div>
        <div v-if="input.data.choices_type === 'single'">
          <div class="w-full" v-for="(q, k) in input.data.choices" :key="q">
            <div
              role="button"
              class="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
            >
              <label
                :for="'choices-' + k + index"
                class="flex w-full cursor-pointer items-center px-3 py-2"
              >
                <div class="inline-flex items-center">
                  <label
                    class="relative flex items-center cursor-pointer"
                    :for="'choices-' + k + index"
                  >
                    <input
                      :name="'choices-' + index"
                      type="radio"
                      class="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all"
                      :id="'choices-' + k + index"
                      :value="q"
                      v-model="input.answer"
                    />
                    <span
                      class="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    ></span>
                  </label>
                  <label
                    class="ml-2 cursor-pointer text-sm"
                    for="react-horizontal"
                  >
                    {{ q }}
                  </label>
                </div>
              </label>
            </div>
          </div>
          <div
            v-if="isFormSubmitted && input.data.required && !input.answer"
            class="text-red-500 text-sm mt-2"
          >
            This field is required.
          </div>
        </div>
        <div v-if="input.data.choices_type === 'multiple'">
          <div class="w-full" v-for="(q, k) in input.data.choices" :key="q">
            <div
              role="button"
              class="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
            >
              <label
                :for="'choices-' + k + index"
                class="flex w-full cursor-pointer items-center px-3 py-2"
              >
                <div class="inline-flex items-center">
                  <label
                    class="flex items-center cursor-pointer relative"
                    :for="'choices-' + k + index"
                  >
                    <input
                      type="checkbox"
                      class="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
                      :id="'choices-' + k + index"
                      :value="q"
                      @change="updateAnswer(input, q)"
                      :checked="input.answer?.includes(q)"
                    />
                    <span
                      class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        stroke="currentColor"
                        stroke-width="1"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  </label>
                  <label
                    class="cursor-pointer ml-2 text-sm"
                    for="check-vertical-list-group"
                  >
                    {{ q }}
                  </label>
                </div>
              </label>
            </div>
          </div>
          <div
            v-if="isFormSubmitted && input.data.required && !input.answer"
            class="text-red-500 text-sm mt-2"
          >
            This field is required.
          </div>
        </div>
      </div>
      <div v-if="input.type === 'rating'">
        <div class="questions-rating pt-3 pb-3">
          <div class="text-lg">
            {{ input.data.question }} <span v-if="input.data.required">*</span>
          </div>
          <div class="text-white-new text-base bio_text mb-2">
            {{ input.data.description }}
          </div>
          <ClientOnly>
            <star-rating
              class="form-rating"
              :show-rating="false"
              :star-size="35"
              :increment="1"
              :round-start-rating="true"
              :rounded-corners="true"
              :border-width="2"
              :rating="0"
              active-color="#000"
              :required="input.data.required"
              :max-rating="input.data.stars_number"
              v-model:rating="input.answer"
            ></star-rating>
          </ClientOnly>
        </div>
        <div
          v-if="isFormSubmitted && input.data.required && !input.answer"
          class="text-red-500 text-sm mt-2"
        >
          This field is required.
        </div>
      </div>
    </div>
    <div class="pt-5 pb-5 w-full text-center">
      <button @click="SendForm()" class="btn-form w-full rounded-full p-2">
        <span v-if="!loading">Submit</span>
        <span role="status" v-if="loading" class="inline">
          <svg
            aria-hidden="true"
            class="w-6 h-6 inline text-gray-200 animate-spin dark:text-white-600 fill-black-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="black"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </span>
      </button>
      <!-- Popup -->
      <div
        v-if="sendDone"
        class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
          <h3 class="text-xl font-semibold mb-4">Thank You!</h3>
          <p>
            Your message has been successfully sent. We'll get back to you
            shortly.
          </p>
          <button
            @click="sendDone = false"
            class="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
      <!-- <div class="text-center" v-if="sendDone">Successfully sent</div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import StarRating from "vue-star-rating";
interface Props {
  module: Array;
  subdomainName: any;
}
// const accountInfo = useState("accountInfo");
const props = defineProps<Props>();

onMounted(() => {
  // Add a default answer to each question
  props.module.questions.forEach((question) => {
    if (!question.answer) {
      question.answer = null;
    }
  });
});
function updateAnswer(input: any, value: any) {
  if (input.data.choices_type === "multiple") {
    if (!Array.isArray(input.answer)) {
      input.answer = [];
    }
    const index = input.answer?.indexOf(value);
    if (index === -1) {
      input.answer.push(value);
    } else {
      input.answer.splice(index, 1);
    }
  }
}
let row = {
  domain: props.subdomainName,
  info: props.module,
};
let isFormSubmitted = ref(false);
let loading = ref(false);
let sendDone = ref(false);
async function SendForm() {
  // Set the form submission flag to true
  loading.value = true;
  isFormSubmitted.value = true;
  sendDone.value = false;
  // Verify all required fields have answers
  let allRequiredFieldsAnswered = true;

  props.module.questions.forEach((question) => {
    if (
      question.data.required &&
      (question.answer === null ||
        question.answer === "" ||
        (Array.isArray(question.answer) && question.answer.length === 0))
    ) {
      allRequiredFieldsAnswered = false;
    }
  });

  if (!allRequiredFieldsAnswered) {
    loading.value = false;
    return;
  }

  const { data, error } = await useFetch(
    `https://qshot.radiolingo.app/q-profile/contact-form/store`,
    {
      body: JSON.stringify(row),
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  loading.value = false;
  if (data.value.success) {
    for (var d in props.module.questions) {
      props.module.questions[d].answer = "";
    }
    isFormSubmitted.value = false;
    sendDone.value = true;
  }
}
</script>

<style scoped>
.form-div {
  background: rgba(255, 255, 255, 0.098);
  /* color: #000; */
}
.form-div input , .form-div textarea{ 
  background-color: #ffffff30 !important;
   border: 0px solid #fff !important;
}
.btn-form {
  background: #000;
  color: #fff;
  transition: all 0.3s;
  border: 0px solid #fff !important;
  outline:0;
  width: 100%;
  padding: 15px;
}
.btn-form:hover {
  background: #fff;
  color: #000;
  border: 1px solid #000;
}
</style>
<style>
.form-rating .vue-star-rating {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}
</style>
