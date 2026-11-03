
// 1. 获取当前网页选中的文字
chrome.tabs.query(
    { active: true, currentWindow: true },
    function(tabs) {
        const tabId = tabs[0].id;

        chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => window.getSelection().toString()
        }).then((results) => {
            document.getElementById("selectedText").textContent =
                results[0].result;
        });
    }
);


// 2. 点击保存按钮，将文字保存到本地
document.getElementById("saveButton").addEventListener("click", async () => {
    const text = document.getElementById("selectedText").textContent;

    // 读取原有收藏
    const data = await chrome.storage.local.get({ clips: [] });

    // 添加新收藏
    data.clips.push(text);

    // 保存更新后的数组
    await chrome.storage.local.set({ clips: data.clips });

    alert("收藏成功！");

    // 刷新收藏列表
    await renderClips();
});


// 3. 展示收藏列表
async function renderClips() {
    // 读取本地数据
    const data = await chrome.storage.local.get({ clips: [] });

    // 找到列表元素
    const list = document.getElementById("clipsList");

    // 清空旧列表
    list.innerHTML = "";

    // 遍历收藏数组
    data.clips.forEach(function(clip) {
        const li = document.createElement("li");
        li.textContent = clip;
        list.appendChild(li);
    });
}


// 4. 插件打开时，自动展示收藏列表
renderClips();
