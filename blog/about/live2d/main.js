
var pageData;

$(document).ready(() => {
    var v = new Viewer('assets');
});


class Viewer {
    
    constructor (basePath) {
        this.l2d = new L2D(basePath);
        this.canvas = $(".Canvas");
        this.selectCharacter = $(".selectCharacter");
        this.selectAnimation = $(".selectAnimation");
        this.messageTimer = null;
        this.messageArray = "";

        if (screen.width >= 768) {
            this.l2d.load("lafei_4", this);
        }
        this.app = new PIXI.Application(1280, 720, {  backgroundColor: 0x282828 });
        this.canvas.html(this.app.view);
        this.app.ticker.add((deltaTime) => {
            if (!this.model) {
                return;
            }
            this.model.update(deltaTime);
            this.model.masks.update(this.app.renderer);
        });
        window.onresize = (event) => {
            if (event === void 0) { event = null; }
            let width = window.innerWidth / 2;
            let height = width;
            this.app.view.style.width = width + "px" ;
            this.app.view.style.height = height + "px";
            this.app.renderer.resize(width, height);

            if (this.model) {
                this.model.position = new PIXI.Point((width * 0.5), (height * 0.5));
                this.model.scale = new PIXI.Point((this.model.position.x * 0.09), (this.model.position.x * 0.09));
                this.model.masks.resize(this.app.view.width, this.app.view.height);
            }
        };
        this.isClick = false;
        this.app.view.addEventListener('mousedown', (event) => {
            this.isClick = true;
        });
        this.app.view.addEventListener('mousemove', (event) => {
            if (this.isClick) {
                this.isClick = false;
                if (this.model) {
                    this.model.inDrag = true;
                }
            }

            if (this.model) {
                let mouse_x = this.model.position.x - event.offsetX;
                let mouse_y = this.model.position.y - event.offsetY;
                this.model.pointerX = -mouse_x / this.app.view.height;
                this.model.pointerY = -mouse_y / this.app.view.width;
            }
        });
        

        
            
        fetch("live2d/waifu-tips.json")
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
        this.app.view.addEventListener('mouseup', (event) => {
            if (!this.model) {
                return;
            }
            if (this.isClick) {
                if (this.isHit('TouchHead', event.offsetX, event.offsetY)) {
                    var messageArray = ["嗯~~？", "嘤嘤嘤～"];
                    this.showMessage(this.randomSelection(messageArray), 6000, 9);
                    this.startAnimation("touch_head", "base");
                } else if (this.isHit('TouchSpecial', event.offsetX, event.offsetY)) {
                    var messageArray = ["那里~~不可以~", "干嘛啊！", "差不多得了！", "死肥宅真恶心！"];
                    this.showMessage(this.randomSelection(messageArray), 6000, 9);
                    this.startAnimation("touch_special", "base");
                } else {
                    var messageArray = ["有什么事吗~~？"];
                    this.showMessage(this.randomSelection(messageArray), 6000, 9);
                    const bodyMotions = ["touch_body", "main_1", "main_2", "main_3"];
                    let currentMotion = bodyMotions[Math.floor(Math.random()*bodyMotions.length)];
                    this.startAnimation(currentMotion, "base");
                }
            }

            this.isClick = false;
            this.model.inDrag = false;
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
    changeCanvas (model) {
        this.app.stage.removeChildren();

        this.selectAnimation.empty();
        model.motions.forEach((value, key) => {
            if (key != "effect") {
                let btn = document.createElement("button");
                let label = document.createTextNode(key);
                btn.appendChild(label);
                btn.className = "btn btn-secondary";
                btn.addEventListener("click", () => {
                    this.startAnimation(key, "base");
                });
                this.selectAnimation.append(btn);
            }
        });

        this.model = model;
        this.model.update = this.onUpdate; // HACK: use hacked update fn for drag support
        // console.log(this.model);
        this.model.animator.addLayer("base", LIVE2DCUBISMFRAMEWORK.BuiltinAnimationBlenders.OVERRIDE, 1);

        this.app.stage.addChild(this.model);
        this.app.stage.addChild(this.model.masks);

        window.onresize();
    }

    onUpdate (delta) {
        let deltaTime = 0.016 * delta;

        if (!this.animator.isPlaying) {
            let m = this.motions.get("idle");
            this.animator.getLayer("base").play(m);
        }
        this._animator.updateAndEvaluate(deltaTime);

        if (this.inDrag) {
            this.addParameterValueById("ParamAngleX", this.pointerX * 30);
            this.addParameterValueById("ParamAngleY", -this.pointerY * 30);
            this.addParameterValueById("ParamBodyAngleX", this.pointerX * 10);
            this.addParameterValueById("ParamBodyAngleY", -this.pointerY * 10);
            this.addParameterValueById("ParamEyeBallX", this.pointerX);
            this.addParameterValueById("ParamEyeBallY", -this.pointerY);
        }

        if (this._physicsRig) {
            this._physicsRig.updateAndEvaluate(deltaTime);
        }

        this._coreModel.update();

        let sort = false;
        for (let m = 0; m < this._meshes.length; ++m) {
            this._meshes[m].alpha = this._coreModel.drawables.opacities[m];
            this._meshes[m].visible = Live2DCubismCore.Utils.hasIsVisibleBit(this._coreModel.drawables.dynamicFlags[m]);
            if (Live2DCubismCore.Utils.hasVertexPositionsDidChangeBit(this._coreModel.drawables.dynamicFlags[m])) {
                this._meshes[m].vertices = this._coreModel.drawables.vertexPositions[m];
                this._meshes[m].dirtyVertex = true;
            }
            if (Live2DCubismCore.Utils.hasRenderOrderDidChangeBit(this._coreModel.drawables.dynamicFlags[m])) {
                sort = true;
            }
        }

        if (sort) {
            this.children.sort((a, b) => {
                let aIndex = this._meshes.indexOf(a);
                let bIndex = this._meshes.indexOf(b);
                let aRenderOrder = this._coreModel.drawables.renderOrders[aIndex];
                let bRenderOrder = this._coreModel.drawables.renderOrders[bIndex];

                return aRenderOrder - bRenderOrder;
            });
        }

        this._coreModel.drawables.resetDynamicFlags();
    }

    startAnimation (motionId, layerId) {
        if (!this.model) {
            return;
        }

        let m = this.model.motions.get(motionId);
        if (!m) {
            return;
        }

        let l = this.model.animator.getLayer(layerId);
        if (!l) {
            return;
        }

        l.play(m);
    }

    isHit (id, posX, posY) {
        if (!this.model) {
            return false;
        }

        let m = this.model.getModelMeshById(id);
        if (!m) {
            return false;
        }

        const vertexOffset = 0;
        const vertexStep = 2;
        const vertices = m.vertices;

        let left = vertices[0];
        let right = vertices[0];
        let top = vertices[1];
        let bottom = vertices[1];

        for (let i = 1; i < 4; ++i) {
            let x = vertices[vertexOffset + i * vertexStep];
            let y = vertices[vertexOffset + i * vertexStep + 1];

            if (x < left) {
                left = x;
            }
            if (x > right) {
                right = x;
            }
            if (y < top) {
                top = y;
            }
            if (y > bottom) {
                bottom = y;
            }
        }

        let mouse_x = m.worldTransform.tx - posX;
        let mouse_y = m.worldTransform.ty - posY;
        let tx = -mouse_x / m.worldTransform.a;
        let ty = -mouse_y / m.worldTransform.d;

        return ((left <= tx) && (tx <= right) && (top <= ty) && (ty <= bottom));
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
