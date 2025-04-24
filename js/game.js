class Game {
    constructor() {
        this.player = new Character();
        this.gameContainer = document.querySelector('.game-container');
        this.dialogBox = document.getElementById('dialog');
        this.dialogText = document.getElementById('dialog-text');
        this.init();

        this.stroy;
    }

    init() {
        document.getElementById('start-button').addEventListener('click', () => {
            this.startGame();
        });

        // 添加周活动按钮事件监听
        document.getElementById('message-btn').addEventListener('click', () => {
            this.handleMessageBtn();
        });
        
        document.getElementById('social-btn').addEventListener('click', () => {
            this.handleSocialBtn();
        });
        
        document.getElementById('activity-btn').addEventListener('click', () => {
            this.handleActivityBtn();
        });
    }

    startGame() {
        const startButton = document.getElementById('start-button');
        if(startButton){
            startButton.remove();
            this.opening();
        }

    }

    opening(){
        const self = this;
        self.dialog("某日，你在社媒平台刷到一则「搭子招募」的帖子。",() =>{
            self.dialog("“搭子”这个概念，第一次闯入了你的生活。", () =>{
                self.newWeek();
            })
        })

    }

    dialog(text, action, button) {
        // 清除对话框内容并设置新内容
        this.dialogText.textContent = text;     
        // 保存this引用
        const self = this;
        
        // 如果提供了按钮文本和动作
        if (button && typeof action === 'function') {
            // 创建按钮元素
            let buttonElement = document.getElementById('dialog-btn');  
            buttonElement.style.display = 'block'; // 显示按钮          
            buttonElement.onclick = () => {
                this.dialogBox.style.display = 'none';
                action();
            };      
            // 为对话框添加点击事件（只针对非按钮区域）
            this.dialogBox.onclick = function(e) {
                if (e.target !== buttonElement && !buttonElement.contains(e.target)) {
                    self.dialogBox.style.display = 'none';
                }
            };


        } else {
            // 如果没有按钮，隐藏按钮元素
            let buttonElement = document.getElementById('dialog-btn');
            buttonElement.style.display = 'none'; // 隐藏按钮
            this.dialogBox.onclick = function() {
                self.dialogBox.style.display = 'none';
                action();
            };
        }
        
        // 显示对话框
        this.dialogBox.style.display = 'block';
    }


    newWeek() {
        // 检测三个数值是否达到触发特殊事件的条件
        const triggerType = this.checkPlayerValues();
        
        if(this.player.week >= 8){
            this.endGame();
        }
        else if (triggerType) {
            // 如果有值达到了15的倍数，触发特殊事件
            this.exEvent(triggerType);
        } else {
            // 否则正常进入下一周
            this.nextWeek();
        }
    }
    
    checkPlayerValues() {
        // 记录触发的类型
        let triggerType = null;
        
        // 检查朋友值
        if (this.player.朋友值 >= this.player.上次朋友值触发 + 15) {
            this.player.上次朋友值触发 = Math.floor(this.player.朋友值 / 15) * 15;
            triggerType = '朋友';
        }
        // 检查搭子值
        else if (this.player.搭子值 >= this.player.上次搭子值触发 + 15) {
            this.player.上次搭子值触发 = Math.floor(this.player.搭子值 / 15) * 15;
            triggerType = '搭子';
        }
        // 检查个人值
        else if (this.player.个人值 >= this.player.上次个人值触发 + 15) {
            this.player.上次个人值触发 = Math.floor(this.player.个人值 / 15) * 15;
            triggerType = '个人';
        }
        
        return triggerType;
    }
    
    nextWeek() {
        this.player.week += 1;
        this.stroy = storyEvent.find(event => event.id === `week${this.player.week}`);
        const weekTransition = document.getElementById('week-transition');
        const weekAction = document.getElementById('week-action');
        this.updatePlayerValues();
        this.changeBackground("主背景.png");
        this.showPhoneMain();
        
        // 更新周数图片（如果需要）
        const weekImage = weekTransition.querySelector('#week-img');
        if (weekImage) {
            weekImage.src = `/images/周次过渡/第${this.player.week}周.png`;
        }
        
        // 显示过渡界面
        weekTransition.style.display = 'block';
        weekAction.style.display = 'none';
        
        // 第一步动画：显示周次过渡
        anime({
            targets: '#week-transition',
            opacity: [0, 1],
            duration: 500,
            easing: 'easeInOutQuad',
            complete: () => {
                // 显示一段时间后开始淡出
                setTimeout(() => {
                    // 第二步动画：周次过渡淡出
                    anime({
                        targets: '#week-transition',
                        opacity: [1, 0],
                        duration: 500,
                        easing: 'easeInOutQuad',
                        complete: () => {
                            weekTransition.style.display = 'none';
                            weekAction.style.display = 'block';
                            
                            // 第三步动画：周活动内容淡入
                            anime({
                                targets: '#week-action',
                                opacity: [0, 1],
                                duration: 800,
                                easing: 'easeInOutQuad'
                            });
                        }
                    });
                }, 1000); // 显示周次过渡的时间
            }
        });
    }

    hidePhone() {
        const phone = document.getElementById('week-action');
        if (phone) {
            phone.style.display = 'none'; // 隐藏手机
        }
    }
    

    showPhoneMain() {
        const phone = document.getElementById('week-action');
        if (phone) {
            phone.style.display = 'block'; // 显示手机
        }
        //action-btns的显示和隐藏
        const actionBtns = document.getElementById('action-btn');
        if (actionBtns) {
            actionBtns.style.display = 'flex'; // 显示按钮
        }
        
        // 隐藏消息列表
        const actionMessage = document.getElementById('action-message');
        if (actionMessage) {
            actionMessage.style.display = 'none';
        }
    }

    showPhoneMsg() {
        const actionBtns = document.getElementById('action-btn');
        actionBtns.style.display = 'none'; // 隐藏按钮
        let self = this;
        
        // 获取未触发过的故事
        let availableStories = [];
        for (let i = 0; i < friendStory.length; i++) {
            if (!this.player.isStoryTriggered('朋友', i)) {
                availableStories.push({index: i, story: friendStory[i]});
            }
        }
        
        // 如果所有故事都已触发，则重置
        if (availableStories.length === 0) {
            this.player.已触发朋友故事 = [];
            for (let i = 0; i < friendStory.length; i++) {
                availableStories.push({index: i, story: friendStory[i]});
            }
        }
        
        // 随机选择一条未触发的故事
        const randomIndex = Math.floor(Math.random() * availableStories.length);
        const selectedStory = availableStories[randomIndex];
        const message = selectedStory.story;
        
        //action-message的显示和隐藏
        const actionMessage = document.getElementById('action-message');
        if (actionMessage) {
            // 更新消息标题和内容
            const titleElement = actionMessage.querySelector('.title');
            const msgElement = actionMessage.querySelector('.msg');
            
            if (titleElement) titleElement.textContent = message.title;
            if (msgElement) msgElement.textContent = message.msg;
            
            actionMessage.style.display = 'block'; // 显示消息列表
        }
        
        // 添加返回按钮的点击事件
        const returnBtn = document.getElementById('msg-btn');
        if (returnBtn) {
            returnBtn.onclick = () => self.showPhoneMain();
        }
        
        // 添加确定按钮的点击事件
        const confirmBtn = document.getElementById('msg-close-btn');
        if (confirmBtn) {
            confirmBtn.onclick = () => {
                // 标记该故事已被触发
                self.player.markStoryTriggered('朋友', selectedStory.index);
                
                self.hidePhone();
                self.changeBackground("朋友活动背景.png");
                
                // 这里可以处理用户确认参加活动的逻辑
                self.dialog(message.event, () => {
                    self.player.朋友值 += 5; // 增加朋友值
                    self.newWeek(); // 进入下一周
                });
            }
        }
    }

    changeBackground(image) {
        console.log(this)
        this.gameContainer.style.backgroundImage = `url('/images/${image}')`;
    }

    // 消息列表按钮事件处理
    handleMessageBtn() {
        this.showPhoneMsg();
    }   

    // 社媒平台按钮事件处理
    handleSocialBtn() {
        console.log('社媒平台按钮被点击');
        this.dialog("要招募搭子吗？", this.startSocialActivity.bind(this), true);

    }

    startSocialActivity() {
        // 获取未触发过的故事
        let availableStories = [];
        let directStory = null;
        
        // 如果搭子值达到15，检查是否有可以直接触发的老搭子故事
        if (this.player.搭子值 >= 15 && oldStory.length > 0) {
            // 遍历已触发的新搭子故事，查看是否有对应的老搭子故事可以触发
            for (let i = 0; i < this.player.已触发搭子故事.length; i++) {
                let netIndex = this.player.已触发搭子故事[i];
                // 确保索引有效并且对应的老搭子故事未被触发
                if (netIndex < oldStory.length && !this.player.isStoryTriggered('老搭子', netIndex)) {
                    // 直接选择对应的老搭子故事
                    directStory = {type: '老搭子', index: netIndex, story: oldStory[netIndex]};
                    break;
                }
            }
        }
        
        // 如果没有找到可以直接触发的老搭子故事，则按原来的逻辑继续
        if (!directStory) {
            // 添加未触发的老搭子故事（如果搭子值足够）
            if (this.player.搭子值 >= 15 && oldStory.length > 0) {
                for (let i = 0; i < oldStory.length; i++) {
                    if (!this.player.isStoryTriggered('老搭子', i)) {
                        availableStories.push({type: '老搭子', index: i, story: oldStory[i]});
                    }
                }
            }
            
            // 添加未触发的新搭子故事
            for (let i = 0; i < netStory.length; i++) {
                if (!this.player.isStoryTriggered('搭子', i)) {
                    availableStories.push({type: '搭子', index: i, story: netStory[i]});
                }
            }
            
            // 如果所有故事都已触发，则重置
            if (availableStories.length === 0) {
                this.player.已触发搭子故事 = [];
                this.player.已触发老搭子故事 = [];
                
                if (this.player.搭子值 >= 15 && oldStory.length > 0) {
                    for (let i = 0; i < oldStory.length; i++) {
                        availableStories.push({type: '老搭子', index: i, story: oldStory[i]});
                    }
                }
                
                for (let i = 0; i < netStory.length; i++) {
                    availableStories.push({type: '搭子', index: i, story: netStory[i]});
                }
            }
            
            // 随机选择一个故事
            const randomIndex = Math.floor(Math.random() * availableStories.length);
            directStory = availableStories[randomIndex];
        }
        
        // 现在directStory一定有值，使用它进行后续操作
        const activity = directStory.story;
        
        // 标记该故事已被触发
        this.player.markStoryTriggered(directStory.type, directStory.index);
        
        const self = this;
        let currentStep = 0;
        this.player.搭子值 += 5;

        this.changeBackground("搭子活动背景.png");
        this.hidePhone();
        
        const showNextDialog = () => {
            if (currentStep < activity.length) {
                // 第一个元素作为标题显示
                let text = currentStep === 0 ? `【${activity[currentStep]}】` : activity[currentStep];
                self.dialog(text, showNextDialog);
                currentStep++;
            } else {
                // 所有对话完成后进入下一周
                self.newWeek();
            }
        };
        
        // 开始显示对话
        showNextDialog();
    }

    // 个人活动按钮事件处理
    handleActivityBtn() {
        // 从singleStory中随机选择一个活动
        this.dialog("要自主活动吗？", this.startSingleActivity.bind(this), true);
    }

    updatePlayerValues() {
        let ele = document.getElementById('player-state');
        if (ele) {
            ele.innerHTML = `搭子值：${this.player.搭子值} 朋友值：${this.player.朋友值} 个人值：${this.player.个人值}`;
        }
    }

    startSingleActivity() {
        // 获取未触发过的故事
        let availableStories = [];
        for (let i = 0; i < singleStory.length; i++) {
            if (!this.player.isStoryTriggered('个人', i)) {
                availableStories.push({index: i, story: singleStory[i]});
            }
        }
        
        // 如果所有故事都已触发，则重置
        if (availableStories.length === 0) {
            this.player.已触发个人故事 = [];
            for (let i = 0; i < singleStory.length; i++) {
                availableStories.push({index: i, story: singleStory[i]});
            }
        }
        
        // 随机选择一个故事
        const randomIndex = Math.floor(Math.random() * availableStories.length);
        const selectedStory = availableStories[randomIndex];
        const activity = selectedStory.story;
        
        // 标记该故事已被触发
        this.player.markStoryTriggered('个人', selectedStory.index);
        
        const self = this;
        let currentStep = 0;
        this.player.个人值 += 5;

        this.changeBackground("个人活动背景.png");
        this.hidePhone();
        
        const showNextDialog = () => {
            if (currentStep < activity.length) {
                // 第一个元素作为标题显示
                let text = currentStep === 0 ? `【${activity[currentStep]}】` : activity[currentStep];
                self.dialog(text, showNextDialog);
                currentStep++;
            } else {
                // 所有对话完成后进入下一周
                self.newWeek();
            }
        };
        
        // 开始显示对话
        showNextDialog();
    }
    
    phoneDialog(text, action, isLast = false) {
        let self = this;
        const phone = document.getElementById('week-action');
        if (phone) {
            phone.style.display = 'block'; // 显示手机
        }
        const actionBtns = document.getElementById('action-btn');
        actionBtns.style.display = 'none'; // 隐藏按钮
        const actionMessage = document.getElementById('action-message');
        actionMessage.style.display = 'block'; // 显示消息列表（修正注释）
        const titleElement = actionMessage.querySelector('.title');
        const msgElement = actionMessage.querySelector('.msg');
        if (titleElement) titleElement.textContent = "";
        if (msgElement) msgElement.textContent = text;
        
        // 返回按钮处理
        const backBtn = document.getElementById('msg-btn');
        backBtn.style.opacity = '0'; // 初始隐藏返回按钮
        
        // 清除可能存在的旧事件监听器
        const confirmBtn = document.getElementById('msg-close-btn');
        const oldConfirmClone = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(oldConfirmClone, confirmBtn);
        
        // 重新获取按钮引用并添加新事件监听器
        const newConfirmBtn = document.getElementById('msg-close-btn');
        newConfirmBtn.onclick = function() {
            if (isLast) {
                // 如果是最后一个对话，显示返回按钮
                backBtn.style.opacity = '1';
            }
            // 执行传入的回调函数
            action();
        };
    }

    exEvent(type){
        console.log(type)
        if(type == "朋友"){
            this.phoneDialog("逛街的时候看到这个，猜你喜欢，送给你！", () => {
                let gifts = [
                    "复古胶片相机",
                    "限定盲盒",
                    "零食礼包",
                    "游戏周边",
                    "香薰礼盒"
                ];
                let randomIndex = Math.floor(Math.random() * gifts.length);
                let gift = gifts[randomIndex];
                this.phoneDialog("收到了" + gift, () => {
                    this.player.朋友值 += 5; // 增加朋友值
                    this.newWeek(); // 进入下一周
                }, true); // 标记为最后一个对话
            });
        }
        else {
            this.phoneDialog("最近在忙吗？总是约不到你", () => {
                this.player.朋友值 -= 5; // 增加朋友值
                this.newWeek(); // 进入下一周
            }, true); // 标记为最后一个对话
        }
    }

    endGame(){
        let endType;
        let bgType;
        let endTitle;
        let endContext;

        let v2 = this.player.搭子值 - this.player.朋友值;
        
        // 根据玩家数值决定结局类型
        if(this.player.搭子值 >= 30 && this.player.朋友值 < 20 && this.player.个人值 < 20) {
            // 搭子世界结局
            endType = end.end1;
            bgType = "结局1背景.png";
        } else if(v2 <= 10 &&  this.player.个人值 <= 15) {
            // 充实的关系网结局
            endType = end.end2;
            bgType = "结局2背景.png";
        } else {
            // 独自世界结局
            endType = end.end3;
            bgType = "结局3背景.png";
        }
        
        // 随机选择一个具体结局场景
        const randomIndex = Math.floor(Math.random() * endType.length);
        endTitle = endType[randomIndex].title;
        endContext = endType[randomIndex].context;
        
        // 隐藏手机界面
        this.hidePhone();
        this.changeBackground(bgType);
        
        // 显示结局标题和内容
        const self = this;
        self.dialog(`【${endTitle}】`, () => {
            self.dialog(endContext, () => {

            });
        });
    }
}

// 启动游戏
window.onload = function() {
    window.game = new Game();
};
