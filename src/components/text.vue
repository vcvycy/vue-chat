<script>
import { actions } from '../store';

export default {
    vuex: {
        actions: actions
    },
    data () {
        return {
            content: ''
        };
    },
    methods: {
        onKeyup (e) {
            if (false && e.ctrlKey && e.keyCode === 13 && this.content.length) { 
                this.sendMessage(this.content);
                this.content = ''; 
            }
        }
    }
};
</script>

<template>
<div class="text">
    <textarea id="text" placeholder="按 Enter 发送;Ctrl+Enter换行" v-model="content" @keyup="onKeyup"></textarea>
</div>
</template>

<style lang="less" scoped>
.text {
    height: 160px;
    border-top: solid 1px #ddd;

    textarea {
        padding: 10px;
        height: 100%;
        width: 100%;
        border: none;
        outline: none;
        font-family: "Micrsofot Yahei";
        resize: none;
    }
}
</style>