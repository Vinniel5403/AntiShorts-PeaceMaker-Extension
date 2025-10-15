chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action === "close_chrome") {
    // ดึงหน้าต่างทั้งหมด
    chrome.windows.getAll({}, (windows) => {
      for (const win of windows) {
        chrome.windows.remove(win.id);
      }
    });
  }
});
