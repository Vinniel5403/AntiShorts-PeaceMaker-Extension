// const blockedSites = ['instagram', 'facebook', 'youtube.com/shorts', 'tiktok', 'twitter', 'x.com'];
const blockedSites = ["youtube.com/shorts", "instagram.com/reels/"];
const allowedExceptions = [];

// Guards to prevent re-entry and duplicate listeners
let isRunning = false;
let clickListenerAdded = false;

function muteAllExceptIframes() {
  // Mute ทุก video/audio บนหน้า (ไม่ pause)
  document.querySelectorAll('video, audio').forEach(el => {
    el.muted = true;
    el.pause()
  });
}


function checkBlockedSites() {
  const url = window.location.href;
  if (blockedSites.some((site) => url.includes(site))) {
    console.log("รอให้ user click เพื่อเล่นวิดีโอ...");

    // Add click listener only once per page load
    if (!clickListenerAdded) {
      clickListenerAdded = true;

          // Prevent re-entry while sequence runs
          if (isRunning) {
            console.log("Sequence already running, ignoring click.");
            return;
          }
          isRunning = true;

          // Small delay before injecting hidden iframe
          setTimeout(() => {
            // สร้าง iframe ทันที แต่ซ่อนด้วย z-index ต่ำ
         
            const iframe = document.createElement("iframe");
            iframe.src =
              "https://www.youtube.com/embed/Om_VWBua0_M?start=40&autoplay=1&mute=0";
            iframe.width = screen.width * 1;
            iframe.height = screen.height * 1;
            iframe.style.position = "fixed";
            iframe.style.left = "50%";
            iframe.style.top = "50%";
            iframe.style.transform = "translate(-50%, -50%)";
            iframe.style.zIndex = "-9999"; // ซ่อนอยู่เบื้องหลัง
            iframe.allow = "autoplay; fullscreen";
            iframe.style.opacity = "0";
            document.body.appendChild(iframe);

            console.log("background iframe injected");
            
            // 5 วิหลัง click ปรับ z-index ให้เด่น
            setTimeout(() => {
              const iframe2 = document.createElement("iframe");
              iframe2.src =
                "https://www.youtube.com/embed/_74zkpM31yw?autoplay=1&mute=1";
              iframe2.width = screen.width * 1;
              iframe2.height = screen.height * 1;
              iframe2.style.position = "fixed";
              iframe2.style.left = "50%";
              iframe2.style.top = "50%";
              iframe2.style.transform = "translate(-50%, -50%)";
              iframe2.style.zIndex = "9999"; // bring to front
              iframe2.allow = "autoplay; fullscreen";
              iframe2.style.opacity = "1";
              document.body.appendChild(iframe2);
              console.log("foreground iframe injected");
               muteAllExceptIframes();
              // Sequence finished - reset running flag after a short safety delay
              setTimeout(() => {
                isRunning = false;
                console.log("sequence finished, ready for next run");
              }, 1000);
            }, 6500);
          }, 2000); // initial delay

        { once: true } // ฟังแค่ครั้งเดียว
      
    }

  }
}



// Listen for URL changes (for single-page applications)
let currentUrl = window.location.href;
new MutationObserver(() => {
  if (currentUrl !== window.location.href) {
    currentUrl = window.location.href;
    checkBlockedSites();
  }
}).observe(document, { subtree: true, childList: true });

// Listen for popstate events (back/forward navigation)
window.addEventListener('popstate', checkBlockedSites);

// Listen for pushstate/replacestate events
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function() {
  originalPushState.apply(history, arguments);
  checkBlockedSites();
};

history.replaceState = function() {
  originalReplaceState.apply(history, arguments);
  checkBlockedSites();
};