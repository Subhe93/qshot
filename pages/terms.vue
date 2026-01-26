<template>
  <div>
    <header class="header">
      <nuxt-link to="https://qshot.com/">
        <NuxtImg loading="lazy" class="Home-logo" src="/logo.svg" alt="Logo" />
      </nuxt-link>
    </header>

    <main class="content">
      <hr />
      <h1>Terms of Use</h1>
      <p>
        Welcome to Qshot, a mobile application for Bio & QR creator available on
        both Android and iOS platforms. The app, including its content,
        services, and features, is the property of Qshot Inc.
      </p>

      <h2>Acknowledgment and Acceptance of Terms</h2>
      <p>
        By accessing and using Qshot, you affirm that you are at least 18 years
        old or have reached the age of majority as defined in your country,
        consenting to these Terms of Use. Minors must obtain parental consent to
        use this app.
      </p>

      <p>Discontinuation of use is advised if you do not accept these terms.</p>

      <h2>1. Account Creation and Management</h2>
      <p>
        Users must register to access Qshot 's full features. Accurate personal
        information is required for account setup. Users are accountable for the
        security of their account information. Third-party account integrations
        are available for registration convenience.
      </p>

      <h2>2. Subscriptions and Payments</h2>
      <p>
        Various subscription options are offered, with the right to modify
        prices. Payments are securely processed, and it's the user's
        responsibility to provide correct billing details.
      </p>

      <h2>3. Usage License</h2>
      <p>
        Users are granted a non-exclusive, non-transferable license to use Qshot
        for personal, non-commercial purposes, adhering to these terms.
      </p>

      <h2>4. Usage Restrictions</h2>
      <p>
        Prohibits activities that could harm the app's functionality or infringe
        on others' rights.
      </p>

      <h2>5. Service Modification or Termination</h2>
      <p>
        Qshot reserves the right to change or cease its services at any time
        without liability.
      </p>

      <h2>6. External Links and Ads</h2>
      <p>
        Qshot may include third-party links and ads, but it is not responsible
        for their content or practices.
      </p>

      <h2>7. Warranty Disclaimer</h2>
      <p>
        The app is provided without warranties, guaranteeing no specific
        performance or error-free operation.
      </p>

      <h2>8. Liability Limitation</h2>
      <p>
        Qshot 's liability is limited under these terms, not covering indirect
        damages related to app use.
      </p>

      <h2>9. User Indemnification</h2>
      <p>
        Users agree to protect Qshot against any losses or damages incurred by
        their app usage or terms violation.
      </p>

      <h2>10. Intellectual Property Rights</h2>
      <p>
        Qshot holds all rights to its content and services. Users are prohibited
        from using the app's content unlawfully.
      </p>

      <h2>11. Electronic Communications Consent</h2>
      <p>
        Users agree to electronic delivery of all communications regarding
        Qshot.
      </p>

      <p>
        Contact us at info@Qshot.com for inquiries about these Terms of Use.
      </p>
      <br />
      <hr />
    </main>
  </div>
</template>

<script setup>
useHead({
  title: "Qshot: Terms of Use",
  titleTemplate: "Qshot: Terms of Use",
  link: [
    {
      rel: "stylesheet",
      href: `https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400&display=swap`,
    },
    {
      rel: "icon",
      type: "image/x-icon",
      href: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png",
    },
  ],
  style: [
    {
      children: `
            * {
              font-family: 'Inter', sans-serif !important;
            }
          `,
      type: "text/css",
    },
  ],
});

useSeoMeta({
  title: () => "Qshot: Terms of Use",
  description: () => "Review the terms of use for Qshot.",
  author: "Qshot",
  ogType: "website",
  ogTitle: "Qshot: Terms of Use",
  ogDescription: () => "Review the terms of use for Qshot.",
  ogLocale: () => "en",
  twitterTitle: "Qshot: Terms of Use",
  twitterDescription: () => "Review the terms of use for Qshot.",
  twitterCard: "summary_large_image",
  twitterSite: "Qshot: Terms of Use",
  twitterCreator: "Qshot",
  twitterImage: "/logo.svg",
});

defineOgImage({
  url: "/logo.svg",
  width: 1200,
  height: 630,
  alt: "Qshot: Terms of Use",
});
</script>
<style scoped>
.header {
  /* background-color: black; */
  padding: 20px;
  width: 100%;
  text-align: center !important;
}

.Home-logo {
  width: 150px;
  height: auto;
  text-align: center !important;
  margin: 0 auto;
}

.content {
  padding: 20px;
  max-width: 1200px;
}

h1,
h2 {
  color: #fff;
  font-size: 20px;
  margin-bottom: 15px;
  margin-top: 15px;
}

p {
  color: #b1b0b0;
  line-height: 1.6;
}
</style>
