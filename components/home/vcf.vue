<template>
  <div style="text-align: center">
    <button
      class="social-item bg-black p-3 rounded-md transition-all duration-300 hover:text-main"
      @click="downloadVCard"
      :disabled="loading"
    >
      <span class="inline" v-if="!loading"> Save Contact </span>

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
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VCard from "vcf";
const { ImageServer } = useAppConfig();

// Define types of social media platforms
const PlatformTypes = {
  FACEBOOK: "facebook",
  INSTAGRAM: "instagram",
  LINKEDIN: "linkedin",
  TIKTOK: "tiktok",
  SNAPCHAT: "snapchat",
  WHATSAPP: "whatsapp",
  TWITTER: "twitter",
  YOUTUBE: "youtube",
  PINTEREST: "pinterest",
  TWITCH: "twitch",
  BEHANCE: "behance",
  PHONE: "phone",
  EMAIL: "email",
  WEBSITE: "website",
  VIMEO: "vimeo",
  WECHAT: "wechat",
  LOCATION: "location",
  LINK: "link",
  CUSTOM: "custom",
};

// Define configurations for each platform
const configurations = {
  facebook: {
    domain: "https://www.facebook.com/",
  },
  instagram: {
    domain: "https://www.instagram.com/",
  },
  linkedin: {
    domain: "https://www.linkedin.com/in/",
  },
  tiktok: {
    domain: "https://www.tiktok.com/@",
  },
  snapchat: {
    domain: "https://www.snapchat.com/add/",
  },
  whatsapp: {
    domain: "https://wa.me/",
  },
  twitter: {
    domain: "https://twitter.com/",
  },
  youtube: {
    domain: "https://www.youtube.com/",
  },
  pinterest: {
    domain: "https://www.pinterest.com/",
  },
  twitch: {
    domain: "https://www.twitch.tv/",
  },
  behance: {
    domain: "https://www.behance.net/",
  },
  email: {
    domain: "",
  },
  phone: {
    domain: "",
  },
  link: {
    domain: "",
  },
  location: {
    domain: "",
  },
  vimeo: {
    domain: "https://www.vimeo.com/",
  },
  wechat: {
    domain: "https://www.wechat.com/",
  },
  website: {
    domain: "",
  },
  custom: {
    domain: "",
  },
};

// Regex patterns
const regexPatterns = {
  facebook:
    /^https:\/\/www\.facebook\.com\/profile\.php\?id=(?<id>\d+).*$|^(?:(?:https?:\/\/)?(?:www\.)?facebook\.com\/)?(?<username>[A-Za-z0-9.]+)\/?(?:\?.*)?$/,
  instagram:
    /^(?:(?:https:\/\/)?(?:www\.)?instagram\.com\/)?(?<username>[A-Za-z0-9._]+).*$/,
  linkedin:
    /^(?:(?:https:\/\/)?(?:www\.)?linkedin\.com\/in\/)?(?<username>[A-Za-z0-9-]+).*$/,
  tiktok:
    /^(?:(?:(?:https:\/\/)?(?:www\.)?tiktok\.com\/)?@)?(?<username>[\w.-]+).*$/,
  snapchat:
    /^(?:(?:https:\/\/)?(?:www\.)?snapchat\.com\/(?:add|t)\/)?(?<username>[A-Za-z0-9._-]+).*$/,
  whatsapp: /^(?:(?:https:\/\/)?wa\.me\/)?(?<username>\+?\d{7,15})$/,
  twitter:
    /^(?:(?:https:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/@?)?(?<username>[A-Za-z0-9_]+).*$/,
  youtube:
    /^(?:(?:(?:https:\/\/)?(?:www\.)?youtube\.com\/)?@)?(?<username>[\w.-]+).*$/,
  pinterest:
    /^(?:(?:https:\/\/)?(?:www\.)?(?:pinterest\.com|pin\.it)\/)?(?<username>[A-Za-z0-9._-]+).*$/,
  twitch:
    /^(?:(?:https:\/\/)?(?:www\.|m\.)?twitch\.tv\/)?(?<username>[A-Za-z0-9_]+).*$/,
  behance:
    /^(?:(?:https:\/\/)?(?:www\.)?behance\.net\/)?(?<username>[A-Za-z0-9_-]+).*$/,
  vimeo:
    /^(?:(?:https:\/\/)?(?:www\.)?vimeo\.com\/)?(?<username>[A-Za-z0-9_-]+).*$/,
  wechat:
    /^(?:(?:https:\/\/)?(?:www\.)?(?:weixin\.qq\.com|wechat\.com)\/)?(?<username>[A-Za-z0-9._-]+).*$/,
  phone: /^\+?\d{7,15}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  link: /^.*$/,
  location: /^.*$/,
  website: /^.*$/,
  custom: /^.*$/,
};

// Function to check if the input is a valid social media platform
function isValidPlatform(platform) {
  return Object.values(PlatformTypes).includes(platform);
}

// Function to validate and format social media link
function formatSocialMediaLink(platform, input) {
  // Check if the platform is valid
  if (!isValidPlatform(platform)) {
    throw new Error("Invalid platform type");
  }

  // Get the configuration for the specified platform
  const config = configurations[platform];
  if (!config) {
    throw new Error("Platform configuration not found");
  }

  // Get the regex pattern for the specified platform
  const pattern = regexPatterns[platform];
  if (!pattern) {
    throw new Error("Platform regex pattern not found");
  }

  // Validate the input using the regex pattern
  const match = input.match(pattern);
  if (!match) {
    throw new Error(`Invalid ${platform} input format`);
  }

  if (platform === "facebook") {
    if (match.groups.id) {
      config.domain = config.domain + "profile.php?id=";
      return `${config.domain}${match.groups.id}`;
    }
  }

  // Handle special cases for email and phone
  if (
    platform === "email" ||
    platform === "phone" ||
    platform === "link" ||
    platform === "website" ||
    platform === "custom" ||
    platform === "location"
  ) {
    return `${config.domain}${input}`;
  }

  // Ensure the username group is present for platforms that require it
  if (!match.groups?.username) {
    throw new Error(`Invalid ${platform} input format`);
  }

  // Return the formatted link
  return `${config.domain}${match.groups.username}`;
}

interface UserTemplateProfile {
  info?: {
    username?: string;
    bio?: string;
    social_links?: {
      links: Array<{ type: string; link: string; hidden: boolean }>;
    };
    settings?: {
      show_profile_picture: boolean;
    };
    image?: string;
    modules?: Array<{
      type: string;
      links?: Array<{ type: string; link: string; hidden: boolean }>;
    }>;
  };
  settings: {
    name?: {
      text: string;
    };
    bio?: string;
    profile_picture?: {
      image_url: string;
    };
  };
  name?: string;
}

export default defineComponent({
  props: {
    userTemplateProfile: {
      type: Object as () => UserTemplateProfile,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    extractSocialLink(type: string): string {
      // Try to get links from info.social_links first (old structure)
      let links: Array<{ type: string; link: string; hidden: boolean }> = [];
      
      if (this.userTemplateProfile.info?.social_links?.links) {
        links = this.userTemplateProfile.info.social_links.links;
      } else if (this.userTemplateProfile.info?.modules) {
        // Try to get links from modules (new structure)
        const socialLinksModule = this.userTemplateProfile.info.modules.find(
          (module) => module.type === "social_links"
        );
        if (socialLinksModule?.links) {
          links = socialLinksModule.links;
        }
      }
      
      const linkObject = links.find(
        (link) => link.type === type && !link.hidden
      );
      if (!linkObject) {
        return "";
      }
      try {
        return formatSocialMediaLink(type, linkObject.link);
      } catch (error) {
        console.error(error);
        return linkObject.link; // Return the original link if formatting fails
      }
    },
    extractPhoneNumber(input: string): string {
      // Check if the input is a URL and contains "https://wa.me/"
      const linkMatch = input.match(/https:\/\/wa\.me\/(\+?\d+)/);
      // If it's a link, extract the phone number from it; otherwise, use the input directly
      let phoneNumber = linkMatch ? linkMatch[1] : input;

      // Remove any leading "+" sign if present
      phoneNumber = phoneNumber.replace(/^\+/, "");

      // If the number starts with "00", keep it as is
      if (phoneNumber.startsWith("00")) {
        return phoneNumber; // Keep the number as is with "00"
      }

      // If the number does not start with "+", prepend "+"
      if (!phoneNumber.startsWith("+")) {
        return "+" + phoneNumber;
      }

      return phoneNumber;
    },
    // https://api.qshot.com/q-profile/image/convert-to-base64
    async getImageBase64(imageUrl: string): Promise<string> {
      try {
        const { data: fetchedData } = await useFetch(
          "https://api.qshot.com/q-profile/image/convert-to-base64",
          {
            method: "POST",
            body: {
              url: "https://qshottest.s3.us-east-2.amazonaws.com/" + imageUrl,
            },
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        let base64String = fetchedData.value;
        if (base64String.startsWith("data:application/octet-stream;base64,")) {
          base64String = base64String.replace(
            "data:application/octet-stream;base64,",
            ""
          );
        }

        return base64String;
      } catch (error) {
        console.error("Error fetching image:", error);
        throw error;
      }
    },
    fallbackDownload(vCardData: string) {
      // Fallback method using data URI (works in Instagram browser)
      try {
        const dataUri =
          "data:text/vcard;charset=utf-8," + encodeURIComponent(vCardData);
        const link = document.createElement("a");
        link.href = dataUri;
        link.download = "contact.vcf";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("All download methods failed:", error);
        // Last resort: open in new window
        const dataUri =
          "data:text/vcard;charset=utf-8," + encodeURIComponent(vCardData);
        window.open(dataUri, "_blank");
      }
    },
    async downloadVCard() {
      this.loading = true;
      try {
        const userName = this.userTemplateProfile.settings?.name?.text || 
                        this.userTemplateProfile.info?.username || 
                        this.userTemplateProfile.name || '';
        // bio is now an object with text and hide properties
        const userBio = typeof this.userTemplateProfile.settings?.bio === 'string'
          ? this.userTemplateProfile.settings.bio
          : (this.userTemplateProfile.settings?.bio?.text || this.userTemplateProfile.info?.bio || '');
        const userImage = this.userTemplateProfile.settings?.profile_picture?.image_url || 
                         this.userTemplateProfile.info?.image || '';
        
        const vCard = new VCard();

        // Try to get image, but don't fail if it doesn't work
        let imageBase64 = null;
        try {
          if (userImage) {
            imageBase64 = await this.getImageBase64(userImage);
          }
        } catch (imageError) {
          console.log("Failed to load image, continuing without it:", imageError);
        }

        if (imageBase64) {
          vCard.add("photo", imageBase64, { encoding: "b", type: "JPEG" });
        }
      // Add fields only if they are not empty
      if (userName) {
        vCard.add("n", userName);
        vCard.add("fn", userName);
      }
      if (userBio) {
        vCard.add("org", userBio);
      }

      // Iterate over all social links and add them to vCard if they are not empty
      const socialPlatforms = Object.keys(PlatformTypes).map((p) =>
        p.toLowerCase()
      );
      for (const platform of socialPlatforms) {
        const link = this.extractSocialLink(platform);
        if (link) {
          // Add social links as URL fields
          vCard.add("url", link, { type: platform });
        }
      }

      // Handle phone numbers
      const phone = this.extractSocialLink("phone");
      if (phone) {
        vCard.add("tel", phone, { type: "work" });
      }
      if (this.extractSocialLink("whatsapp")) {
        const whatsapp = this.extractPhoneNumber(
          this.extractSocialLink("whatsapp")
        );

        if (whatsapp) {
          vCard.add("tel", whatsapp, { type: "cell" });
        }
      }

      // Handle email
      const email = this.extractSocialLink("email");
      if (email) {
        vCard.add("email", email, { type: "internet" });
      }

      // Generate and download the vCard file
      const vCardData = vCard.toString("3.0");
      const blob = new Blob([vCardData], { type: "text/vcard" });

      // Detect Instagram browser or mobile browsers
      const isInstagramBrowser = /Instagram/i.test(navigator.userAgent);
      const isMobileBrowser = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      // For Instagram browser, use Web Share API directly (it doesn't support traditional download)
      if (isInstagramBrowser && navigator.share && navigator.canShare) {
        try {
          const file = new File([vCardData], "contact.vcf", {
            type: "text/vcard",
          });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file] });
            this.loading = false;
            return;
          }
        } catch (shareError) {
          console.log("Web Share API failed in Instagram, trying data URI:", shareError);
          this.fallbackDownload(vCardData);
          this.loading = false;
          return;
        }
      }

      // For other browsers, try traditional download method first
      let downloadSuccess = false;
      try {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "contact.vcf";
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        downloadSuccess = true;
      } catch (error) {
        console.log("Traditional download method failed:", error);
        downloadSuccess = false;
      }

      // If traditional method didn't work, try Web Share API for mobile browsers
      if (!downloadSuccess && isMobileBrowser && navigator.share && navigator.canShare) {
        try {
          const file = new File([vCardData], "contact.vcf", {
            type: "text/vcard",
          });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file] });
            this.loading = false;
            return;
          }
        } catch (shareError) {
          console.log("Web Share API failed, using data URI fallback:", shareError);
        }
      }

      // If all methods failed, use data URI fallback
      if (!downloadSuccess) {
        this.fallbackDownload(vCardData);
      }

      this.loading = false;
      } catch (error) {
        console.error("Error in downloadVCard:", error);
        this.loading = false;
        // Show user-friendly error message
        alert("حدث خطأ أثناء تحميل جهة الاتصال. يرجى المحاولة مرة أخرى.");
      }
    },
  },
});
</script>

<style scoped>
.social-item {
  background-color: #fff !important;
  color: black !important;
  font-size: 20px;
  font-weight: 800;
  border-radius: 30px;
  min-width: 215px;
  margin-bottom: 15px;
}
</style>
