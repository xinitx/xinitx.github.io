
var pageData;

$(document).ready(() => {
    var v = new Viewer('assets');
});


class Viewer {
    
    constructor (basePath) {
        

        fetch("tips/tips.json")
        .then(response => response.json())
        .then(result => {
            window.addEventListener("mouseover", event => {
                for (let { selector, text } of result.mouseover) {
                    if (!event.target.matches(selector)) continue;
                    text = this.randomSelection(text);
                    text = text.replace("{text}", event.target.innerText);
                    this.showMessage(text, 4000, 10);
                    return;
                }
            });
            window.addEventListener("click", event => {
                for (let { selector, text } of result.click) {
                    if (!event.target.matches(selector)) continue;
                    text = this.randomSelection(text);
                    text = text.replace("{text}", event.target.innerText);
                    this.showMessage(text, 4000, 8);
                    return;
                }
            });
            result.seasons.forEach(({ date, text }) => {
                const now = new Date(),
                    after = date.split("-")[0],
                    before = date.split("-")[1] || after;
                if ((after.split("/")[0] <= now.getMonth() + 1 && now.getMonth() + 1 <= before.split("/")[0]) && (after.split("/")[1] <= now.getDate() && now.getDate() <= before.split("/")[1])) {
                    text = this.randomSelection(text);
                    text = text.replace("{year}", now.getFullYear());
                    //showMessage(text, 7000, true);
                    messageArray.push(text);
                }
            });
        });
            
        
        setInterval(()=>{
            if(
                window.outerWidth - window.innerWidth > 20 || window.outerHeight - window.innerHeight > 100){
                    console.log("哈哈，你打开了控制台，是想要看看我的小秘密吗？");
            }
        }, 5000);

		window.addEventListener("copy", () => {
			this.showMessage("你都复制了些什么呀，转载要记得加上出处哦！", 6000, 9);
		});
		window.addEventListener("visibilitychange", () => {
			if (!document.hidden) this.showMessage("哇，你终于回来了～", 6000, 9);
		});
        
        this.welcomeMessage();

    }
    welcomeMessage(){
        let text;
        if (location.pathname === "/blog/about/") { // 如果是主页
            const now = new Date().getHours();
            if (now > 5 && now <= 7) text = "早上好！一日之计在于晨，美好的一天就要开始了。";
            else if (now > 7 && now <= 11) text = "上午好！工作顺利嘛，不要久坐，多起来走动走动哦！";
            else if (now > 11 && now <= 13) text = "中午了，工作了一个上午，现在是午餐时间！";
            else if (now > 13 && now <= 17) text = "午后很容易犯困呢，今天的运动目标完成了吗？";
            else if (now > 17 && now <= 19) text = "傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红～";
            else if (now > 19 && now <= 21) text = "晚上好，今天过得怎么样？";
            else if (now > 21 && now <= 23) text = ["已经这么晚了呀，早点休息吧，晚安～", "深夜时要爱护眼睛呀！"];
            else text = "你是夜猫子呀？这么晚还不睡觉，明天起的来嘛？";
        } else if (document.referrer !== "") {
            const referrer = new URL(document.referrer),
                domain = referrer.hostname.split(".")[1];
            if (location.hostname === referrer.hostname) text = `欢迎阅读<span>「${document.title.split(" - ")[0]}」</span>`;
            else if (domain === "baidu") text = `Hello！来自 百度搜索 的朋友<br>你是搜索 <span>${referrer.search.split("&wd=")[1].split("&")[0]}</span> 找到的我吗？`;
            else if (domain === "so") text = `Hello！来自 360搜索 的朋友<br>你是搜索 <span>${referrer.search.split("&q=")[1].split("&")[0]}</span> 找到的我吗？`;
            else if (domain === "google") text = `Hello！来自 谷歌搜索 的朋友<br>欢迎阅读<span>「${document.title.split(" - ")[0]}」</span>`;
            else text = `Hello！来自 <span>${referrer.hostname}</span> 的朋友`;
        } else {
            text = `欢迎阅读<span>「${document.title.split(" - ")[0]}」</span>`;
        }
        this.showMessage(text, 7000, 8);


    };
    randomSelection(obj) {
        return Array.isArray(obj) ? obj[Math.floor(Math.random() * obj.length)] : obj;
    }

  
    showMessage(text, timeout, priority) {
		if (!text || (sessionStorage.getItem("cute-text") && sessionStorage.getItem("cute-text") > priority)) return;
		if (this.messageTimer) {
			clearTimeout(this.messageTimer);
			this.messageTimer = null;
		}
        sessionStorage.setItem("cute-text", priority);
		const tips = document.getElementById("cute-tips");
		tips.innerHTML = text;
        tips.classList.add("cute-tips-active");
		this.messageTimer = setTimeout(() => {
            sessionStorage.removeItem("cute-text");
			tips.classList.remove("cutes-tips-active");
		}, timeout);
	}
}
