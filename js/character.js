class Character {
    constructor() {
        // 基础属性
        this.week = 0;
        
        // 状态值
        this.朋友值 = 0;
        this.搭子值 = 0;
        this.个人值 = 0;
        
        // 记录上次触发的数值
        this.上次朋友值触发 = 0;
        this.上次搭子值触发 = 0;
        this.上次个人值触发 = 0;
        
        // 记录已触发的故事索引
        this.已触发朋友故事 = [];
        this.已触发搭子故事 = [];
        this.已触发个人故事 = [];
        this.已触发老搭子故事 = [];
    }
    
    getStatus() {
        return {
            week: this.week,
            朋友值: this.朋友值,
            搭子值: this.搭子值,
            个人值: this.个人值
        };
    }
    
    // 检查某个故事是否已经触发过
    isStoryTriggered(type, index) {
        switch(type) {
            case '朋友':
                return this.已触发朋友故事.includes(index);
            case '搭子':
                return this.已触发搭子故事.includes(index);
            case '个人':
                return this.已触发个人故事.includes(index);
            case '老搭子':
                return this.已触发老搭子故事.includes(index);
            default:
                return false;
        }
    }
    
    // 记录已触发的故事
    markStoryTriggered(type, index) {
        switch(type) {
            case '朋友':
                if (!this.已触发朋友故事.includes(index))
                    this.已触发朋友故事.push(index);
                break;
            case '搭子':
                if (!this.已触发搭子故事.includes(index))
                    this.已触发搭子故事.push(index);
                break;
            case '个人':
                if (!this.已触发个人故事.includes(index))
                    this.已触发个人故事.push(index);
                break;
            case '老搭子':
                if (!this.已触发老搭子故事.includes(index))
                    this.已触发老搭子故事.push(index);
                break;
        }
    }
}
