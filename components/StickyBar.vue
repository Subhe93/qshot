<template>
  <div v-if="accountInfo.data.plan === 'free'">
    <div
      v-show="showLogo"
      v-if="showLogo2"
      @click="redirectToStore"
      class="fixed cursor-pointer main-static-bar bottom-2 w-full p-3 pb-5 left-1/2 -translate-x-1/2 z-[999] transition-opacity duration-500"
    >
      <div class="flex flex-nowrap justify-between static-bar pl-2 pr-2">
        <div class="flex flex-nowrap items-center justify-center gap-2 " >
          <div class="items-center">
            <svg
              width="8"
              height="16"
              viewBox="0 0 8 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="8"
                height="16"
                rx="2"
                fill="url(#paint0_linear_663_56)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_663_56"
                  x1="0.64"
                  y1="2.048"
                  x2="13.0269"
                  y2="8.77327"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#C389FF" />
                  <stop offset="1" stop-color="#4488FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div class="items-center">
            <svg
              style="margin-top: 3px"
              width="58"
              height="12"
              viewBox="0 0 58 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.43185 0.00242918C9.99769 0.00242918 10.9672 0.922793 10.9672 3.37376V5.35344C10.9672 7.49763 10.2142 8.46904 8.31155 8.68554L9.81901 10.8311C9.88235 10.9195 9.88235 11.1119 9.69138 11.1119H8.37632C8.31703 11.1203 8.25659 11.1113 8.20225 11.0862C8.14791 11.061 8.10199 11.0207 8.07 10.9701L6.55073 8.72287H3.53677C0.970935 8.72287 0 7.80394 0 5.35297V3.37329C0 0.922317 0.970935 0.00195312 3.53677 0.00195312L7.43185 0.00242918ZM1.58356 5.23811C1.58356 6.78385 2.06855 7.28113 3.58735 7.28113H7.36898C8.90055 7.28113 9.37278 6.78385 9.37278 5.23811V3.4891C9.37278 1.94477 8.90007 1.45648 7.36898 1.45648H3.58735C2.06855 1.45648 1.58356 1.94241 1.58356 3.4891V5.23811Z"
                fill="#1F1F26"
              />
              <path
                d="M22.2115 0.00179577C22.2427 -0.00251556 22.2745 0.000464511 22.3044 0.0105089C22.3343 0.0205534 22.3615 0.0373857 22.3838 0.0596864C22.4061 0.0819871 22.4229 0.109161 22.433 0.139057C22.443 0.168953 22.446 0.200761 22.4417 0.232002V1.2157C22.4417 1.3802 22.3646 1.45726 22.2115 1.45726H15.6745C15.06 1.45726 14.8316 1.80138 14.8316 2.35114V2.88766C14.8316 3.47523 15.0874 3.78154 15.6745 3.78154H20.653C22.0579 3.78154 22.7731 4.53455 22.7731 5.87561V6.92265C22.7731 8.12285 22.1226 8.94063 20.6275 8.94063H13.4896C13.4584 8.94498 13.4266 8.94202 13.3968 8.93198C13.3669 8.92193 13.3398 8.90507 13.3175 8.88274C13.2953 8.86041 13.2786 8.83323 13.2686 8.80333C13.2587 8.77342 13.2559 8.74161 13.2604 8.71042V7.72956C13.2604 7.56269 13.3365 7.4866 13.4896 7.4866H20.3353C20.9498 7.4866 21.1772 7.14104 21.1772 6.59271V5.95361C21.1772 5.36746 20.9215 5.06115 20.3481 5.06115H15.3682C13.9633 5.06115 13.249 4.30482 13.249 2.96612V2.03443C13.249 0.821946 13.8995 0.00179577 15.3809 0.00179577H22.2115Z"
                fill="#1F1F26"
              />
              <path
                d="M25.664 0.00182545C25.6952 -0.00252476 25.727 0.000435239 25.7569 0.0104809C25.7867 0.0205266 25.8139 0.0373896 25.8361 0.0597161C25.8583 0.0820426 25.8751 0.109224 25.885 0.13913C25.8949 0.169037 25.8977 0.200842 25.8933 0.232032V3.75651H32.4818V0.232032C32.4773 0.200842 32.4802 0.169037 32.4901 0.13913C32.5 0.109224 32.5168 0.0820426 32.539 0.0597161C32.5612 0.0373896 32.5884 0.0205266 32.6182 0.0104809C32.6481 0.000435239 32.6799 -0.00252476 32.7111 0.00182545H33.8352C34.0011 0.00182545 34.0781 0.078876 34.0781 0.232032V8.70998C34.0781 8.86313 34.0011 8.94018 33.8352 8.94018H32.7111C32.6799 8.94454 32.6481 8.94158 32.6182 8.93153C32.5884 8.92148 32.5612 8.90464 32.539 8.88231C32.5168 8.85998 32.5 8.83279 32.4901 8.80288C32.4802 8.77297 32.4773 8.74117 32.4818 8.70998V5.10987H25.8928V8.70998C25.8973 8.74117 25.8944 8.77297 25.8845 8.80288C25.8746 8.83279 25.8579 8.85998 25.8356 8.88231C25.8134 8.90464 25.7863 8.92148 25.7564 8.93153C25.7265 8.94158 25.6947 8.94454 25.6635 8.94018H24.5399C24.5087 8.94454 24.4769 8.94158 24.4471 8.93153C24.4172 8.92148 24.3901 8.90464 24.3678 8.88231C24.3456 8.85998 24.3289 8.83279 24.3189 8.80288C24.309 8.77297 24.3062 8.74117 24.3107 8.70998V0.232032C24.3062 0.200842 24.309 0.169037 24.3189 0.13913C24.3289 0.109224 24.3456 0.0820426 24.3678 0.0597161C24.3901 0.0373896 24.4172 0.0205266 24.4471 0.0104809C24.4769 0.000435239 24.5087 -0.00252476 24.5399 0.00182545H25.664Z"
                fill="#1F1F26"
              />
              <path
                d="M43.1613 0.0032959C45.7272 0.0032959 46.6967 0.921286 46.6967 3.3732V5.56938C46.6967 8.02035 45.7272 8.9407 43.1613 8.9407H39.2663C36.7004 8.9407 35.7295 8.02035 35.7295 5.56938V3.3732C35.7295 0.921286 36.7004 0.0032959 39.2663 0.0032959H43.1613ZM37.3131 5.45405C37.3131 6.99979 37.798 7.48337 39.3168 7.48337H43.0985C44.63 7.48337 45.1023 6.99979 45.1023 5.45405V3.48807C45.1023 1.94517 44.6296 1.45544 43.0985 1.45544H39.3168C37.798 1.45544 37.3131 1.9428 37.3131 3.48807V5.45405Z"
                fill="#1F1F26"
              />
              <path
                d="M57.7586 0.00174215C57.9245 0.00174215 58.0002 0.0787927 58.0002 0.231949V1.25347C58.0002 1.40662 57.9241 1.48272 57.7586 1.48272H53.5714V8.70989C53.5757 8.74114 53.5727 8.77296 53.5627 8.80285C53.5527 8.83275 53.5358 8.85991 53.5135 8.88221C53.4912 8.90451 53.4641 8.92134 53.4342 8.93139C53.4043 8.94143 53.3724 8.94441 53.3412 8.9401H52.2171C52.0512 8.9401 51.9756 8.86305 51.9756 8.70989V1.48272H47.7869C47.7558 1.48714 47.7241 1.48426 47.6942 1.4743C47.6644 1.46434 47.6373 1.44757 47.6151 1.42534C47.5928 1.4031 47.5761 1.376 47.5661 1.34617C47.5561 1.31634 47.5533 1.2846 47.5577 1.25347V0.231949C47.5533 0.200778 47.5562 0.169022 47.5662 0.139162C47.5761 0.109302 47.5929 0.0821525 47.6151 0.0598492C47.6373 0.0375459 47.6644 0.0206952 47.6942 0.010614C47.724 0.000532827 47.7557 -0.00250755 47.7869 0.00174215H57.7586Z"
                fill="#1F1F26"
              />
            </svg>
          </div>
        </div>
        <div class="flex flex-nowrap items-center justify-center gap-2">
          <div
            class="static-bar-text mr-2 cursor-pointer"
          >
            Create your website
          </div>
          <div class="pr-2 relative cursor-pointer z-[9991]" @click.stop @click="showLogo2 = !showLogo2">
            <div class="close-sticky-bar">
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.64472 0.232175C8.95495 -0.0780427 9.45851 -0.0780427 9.76874 0.232175C10.0787 0.542326 10.0787 1.04504 9.76874 1.35522L6.12421 4.99975L9.76874 8.64428C10.0788 8.95442 10.0787 9.45714 9.76874 9.76733C9.45851 10.0775 8.95495 10.0775 8.64472 9.76733L5.00019 6.1228L1.35566 9.76733C1.04543 10.0775 0.542835 10.0775 0.23261 9.76733C-0.07749 9.4571 -0.0775767 8.95446 0.23261 8.64428L3.87714 4.99975L0.23261 1.35522C-0.0775112 1.045 -0.0775625 0.542361 0.23261 0.232175C0.542799 -0.0780012 1.04542 -0.0779184 1.35566 0.232175L5.00019 3.87671L8.64472 0.232175Z"
                  fill="#1F1F26"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
const showLogo = ref(false);
const showLogo2 = ref(true);
const accountInfo = useState("accountInfo");
onMounted(() => {
  const footer = document.querySelector("footer");

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const footerTop = footer?.getBoundingClientRect().top + scrollY || Infinity;

    const triggerPoint = documentHeight / 12;

    if (scrollY > triggerPoint && scrollY + windowHeight < footerTop) {
      showLogo.value = true;
    } else {
      showLogo.value = false;
    }
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
  });
});

function redirectToStore() {
  // Ensure this code runs on the client-side
  if (process.client) {
    const userAgent = navigator.userAgent;

    // Detect if the user is on an iPhone or Android device
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);

    if (isIOS) {
      window.location.href =
        "https://apps.apple.com/eg/app/qshot-bio-qr-creator/id6587578534";
      // window.location.href =
      //   "https://apps.apple.com/app/qshot-com/id6587578534";
    } else if (isAndroid) {
      window.location.href =
        "https://play.google.com/store/apps/details?id=linkinbio.qshot.com";
    } else {
      // Optional: Redirect to a default page or show an alert
      alert("This app is only available on iOS and Android devices.");
    }
  }
}
</script>
<style scoped>
.static-bar {
  /* Rectangle 19615 */

  box-sizing: border-box;
  width: 100%;
  height: 32px;
  left: 16px;
  top: 872px;

  background: #ffffff;
  border-top: 0.5px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0px 8px 21px #1f1f26;
  border-radius: 7px;
}
.static-bar-text {
  font-family: "Poppins" !important;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  /* identical to box height */
  display: flex;
  align-items: center;

  /* Primary 100 */
  color: #1f1f26 !important;
}
.close-sticky-bar{
/* Primary 10 */
background: rgba(31, 31, 38, 0.1);
border-radius: 3px;
padding: 3px;

}
@media (min-width: 991px) {
  .main-static-bar {
    display: none;
  }
}
</style>
