// plugins/trackLink.client.js

export default defineNuxtPlugin((nuxtApp) => {
  const url = useRequestURL();

  function getSubdomain() {
    const host = url.hostname;
    // const parts = host.split(".");
    // return parts[0];
    return host;
  }

  const domain = getSubdomain();

  let deviceType = "Unknown OS";
  let browser = "Unknown Browser";
  let ipAddress = "Unknown IP";

  async function getDeviceTypeAndBrowser() {
    const userAgent = navigator.userAgent;

    if (/android/i.test(userAgent)) {
      deviceType = "Android";
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      deviceType = "iOS";
    } else if (/Windows NT 10.0/i.test(userAgent)) {
      deviceType = "Windows 10";
    } else if (/Windows NT 6.1/i.test(userAgent)) {
      deviceType = "Windows 7";
    } else if (/Mac OS X/i.test(userAgent)) {
      deviceType = "macOS";
    } else if (/CrOS/i.test(userAgent)) {
      deviceType = "Chrome OS";
    } else if (/Linux/i.test(userAgent)) {
      deviceType = "Linux";
    } else if (/Tizen/i.test(userAgent)) {
      deviceType = "Tizen OS";
    } else if (/HarmonyOS/i.test(userAgent)) {
      deviceType = "HarmonyOS";
    }

    if (/chrome|crios|crmo/i.test(userAgent) && !/edge|edg/i.test(userAgent)) {
      browser = "Chrome";
    } else if (
      /safari/i.test(userAgent) &&
      !/chrome|crios|crmo/i.test(userAgent)
    ) {
      browser = "Safari";
    } else if (/firefox|fxios/i.test(userAgent)) {
      browser = "Firefox";
    } else if (/edg/i.test(userAgent)) {
      browser = "Edge";
    } else if (/msie|trident/i.test(userAgent)) {
      browser = "Internet Explorer";
    } else if (/opera|opr/i.test(userAgent)) {
      browser = "Opera";
    } else if (/SamsungBrowser/i.test(userAgent)) {
      browser = "Samsung Internet";
    } else if (/UCBrowser/i.test(userAgent)) {
      browser = "UC Browser";
    }
  }

  // Function to fetch user's IP address
  //   async function getIPAddress() {
  //     try {
  //       const response = await fetch("https://api.ipify.org?format=json");
  //       const data = await response.json();
  //       ipAddress = data.ip;
  //     } catch (error) {
  //       console.error("Failed to fetch IP address:", error);
  //     }
  //   }

  async function getIPAddress() {
    try {
      const response = await fetch("/api/get-ip");
      const data = await response.json();
      return data.ip || "Unknown IP";
    } catch (error) {
      console.error("Failed to fetch IP address:", error);
      return "Unknown IP";
    }
  }

  async function SendData(moduleType, moduleName) {
    await fetch(
      "https://qshot.radiolingo.app/q-profile/detailed-statistics/store",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain,
          moduleType,
          moduleName,
          browser,
          deviceType,
          ip: ipAddress,
        }),
      }
    );
  }

  //first for count visit profile
  //   getDeviceTypeAndBrowser();
  //   //   SendData("profileView", "view");
  //   getIPAddress().then(() => {
  //     SendData("profileView", "view");
  //   });
  async function initializeData() {
    await getDeviceTypeAndBrowser();
    ipAddress = await getIPAddress();
    SendData("profileView", "view");
  }
  initializeData();
  //on click link
  nuxtApp.vueApp.directive("track-click", {
    mounted(el, binding) {
      el.addEventListener("click", async (event) => {
        event.preventDefault();

        const { moduleType, moduleName } = binding.value;
        await getDeviceTypeAndBrowser();
        // await SendData(moduleType, moduleName);
        SendData(moduleType, moduleName);
        if (el.getAttribute("href") === null) {
          return;
        }
        // window.location.href = el.getAttribute("href");
        window.open(el.getAttribute("href"), "_blank");
      });
    },
  });
});
