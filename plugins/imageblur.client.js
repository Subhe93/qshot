export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("blur-on-load", {
    mounted(el) {
      // Handle both IMG and CANVAS elements
      const img = el.tagName === "IMG" ? el : el.querySelector("img");
      const canvas = el.tagName === "CANVAS" ? el : el.querySelector("canvas");

      if (img) {
        handleImageBlur(img);
      } else if (canvas) {
        handleCanvasBlur(canvas);
      }
    },
  });

  function handleImageBlur(img) {
    applyBlur(img);
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (img.complete && img.naturalHeight !== 0) {
            removeBlur(img);
          } else {
            img.addEventListener("load", () => {
              removeBlur(img);
            });
          }
          obs.disconnect();
        }
      });
    });

    observer.observe(img);
  }

  function handleCanvasBlur(canvas) {
    applyBlur(canvas);

    // Create a MutationObserver to watch for canvas content changes
    const observer = new MutationObserver(() => {
      // Check if canvas has been drawn on (has content)
      if (hasCanvasContent(canvas)) {
        removeBlur(canvas);
        observer.disconnect();
      }
    });

    // Also use IntersectionObserver for viewport detection
    const intersectionObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Start watching for canvas content changes
          observer.observe(canvas, {
            attributes: true,
            childList: true,
            subtree: true,
          });

          // Also check immediately in case canvas is already drawn
          setTimeout(() => {
            if (hasCanvasContent(canvas)) {
              removeBlur(canvas);
              observer.disconnect();
            }
          }, 100);

          obs.disconnect();
        }
      });
    });

    intersectionObserver.observe(canvas);
  }

  function hasCanvasContent(canvas) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    // Check if canvas has any non-transparent pixels
    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Check for any non-transparent pixel
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 0) {
          // Alpha channel > 0
          return true;
        }
      }
      return false;
    } catch (e) {
      // If we can't read canvas data (CORS), assume it has content after a delay
      return canvas.width > 0 && canvas.height > 0;
    }
  }

  function applyBlur(element) {
    element.style.filter = "blur(10px)";
    element.style.transition = "filter 0.8s ease, opacity 0.8s ease";
    element.style.opacity = "0.7";
  }

  function removeBlur(element) {
    element.style.filter = "blur(0)";
    element.style.opacity = "1";
  }
});

// export default defineNuxtPlugin((nuxtApp) => {
//   nuxtApp.vueApp.directive("blur-on-load", {
//     mounted(el) {
//       const img = el.tagName === "IMG" ? el : el.querySelector("img");
//       if (img) {
//         applyBlur(img);
//         img.addEventListener("load", () => {
//           removeBlur(img);
//         });
//       }
//     },
//   });

//   function applyBlur(img) {
//     img.style.filter = "blur(10px)";
//     img.style.transition = "filter 0.8s ease, opacity 0.8s ease";
//     img.style.opacity = "0.7";
//   }

//   function removeBlur(img) {
//     img.style.filter = "blur(0)";
//     img.style.opacity = "1";
//   }
// });
