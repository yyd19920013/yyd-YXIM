<template>
    <div class="nimHome">
        <div class="tab">
            <ol class="tabWrap">
                <li v-for="(item,index) in ['消息','联系人']" :class="{
                        active:tabIndex==index,
                    }" @click="tabControl(index)">
                    {{item}}
                </li>
            </ol>
            <a class="logout" @click="logout">登出</a>
        </div>
        <div class="nimMessageListWrap wrapContainer" v-show="pageControl.nimMessageList">
            <nimMessageList :parent="this" />
        </div>
        <div class="nimAddressListWrap wrapContainer" v-show="pageControl.nimAddressList">
            <nimAddressList :parent="this" />
        </div>
        <div class="nimChatWrap wrapContainer" v-show="pageControl.nimChat">
            <nimChat :parent="this" />
        </div>
        <div class="nimSearchFriendWrap wrapContainer" v-show="pageControl.nimSearchFriend">
            <nimSearchFriend :parent="this" />
        </div>
        <div class="nimCreateTeamWrap wrapContainer" v-show="pageControl.nimCreateTeam">
            <nimCreateTeam :parent="this" />
        </div>
        <div class="nimLoginWrap wrapContainer" v-show="pageControl.nimLogin">
            <nimLogin :parent="this" />
        </div>
        <nimVideoCall :parent="this" />
    </div>
</template>
<script>
import nimLogin from './nimLogin';
import nimMessageList from './nimMessageList';
import nimAddressList from './nimAddressList';
import nimChat from './nimChat';
import nimSearchFriend from './nimSearchFriend';
import nimCreateTeam from './nimCreateTeam';
import nimVideoCall from './nimVideoCall';
import nimInit from './nimInit';
import vm from 'src/main';
import { bind, unbind, lStore, sStore } from 'js/yydjs';

export default {
    data() {
        let pageControl = sStore.get('pageControl');

        if (!pageControl) {
            pageControl = {};
            pageControl.nimLogin = false;
            pageControl.nimMessageList = true;
            pageControl.nimAddressList = false;
            pageControl.nimChat = false;
            pageControl.nimSearchFriend = false;
            pageControl.nimCreateTeam = false;
        }

        return {
            pageControl: {
                nimLogin: pageControl.nimLogin,
                nimMessageList: pageControl.nimMessageList,
                nimAddressList: pageControl.nimAddressList,
                nimChat: pageControl.nimChat,
                nimSearchFriend: pageControl.nimSearchFriend,
                nimCreateTeam: pageControl.nimCreateTeam,
            },
            tabIndex: pageControl.nimMessageList ? 0 : 1,
        }
    },

    /*

    */

    props: {

    },

    created() {
        bind(window, 'unload', this.savePageStatus);
    },

    mounted() {
        //判断im是否需要登录
        this.judgeLogin();

        //挂载控制页面关闭的方法在window下
        window.controlPage = this.controlPage;
    },

    beforeDestroy() {
        //保存页面显示的状态
        this.savePageStatus();
    },

    methods: {
        savePageStatus() {
            sStore.set('pageControl', this.pageControl);
        },
        controlPage(controlName, show) {
            this.pageControl[controlName] = show;

            if (lStore.get('nimAccount') && lStore.get('nimToken')) {
                vm.$emit('componentsUpdate', controlName);
            }
        },
        judgeLogin() {
            if (!lStore.get('nimAccount') || !lStore.get('nimToken')) {
                alert('请先登录');
                this.controlPage('nimLogin', true);
            } else {
                nimInit();
            }
        },
        tabControl(index) {
            this.tabIndex = index;

            switch (index) {
                case 0:
                    this.controlPage('nimAddressList', false);
                    this.controlPage('nimMessageList', true);
                    break;
                case 1:
                    this.controlPage('nimMessageList', false);
                    this.controlPage('nimAddressList', true);
                    break;
            }
        },
        logout() {
            lStore.remove('nimAccount');
            lStore.remove('nimToken');
            alert('登出成功');
            this.controlPage('nimLogin', 'nimLoginWrap', true);
        },
    },

    components: {
        nimLogin,
        nimMessageList,
        nimAddressList,
        nimChat,
        nimSearchFriend,
        nimCreateTeam,
        nimVideoCall,
    },
}

</script>
<style lang="scss">
@import '~css/public.scss';

.nimHome {
    height: 100vh;
    border-top: 40px solid transparent;
    background-color: #fff;
    position: relative;
    overflow: hidden;
    .scrollContainer {
        width: 100%;
        height: 100%;
        background-color: #fff;
        position: absolute;
        left: 0;
        top: 0;
        overflow: hidden;
    }
    .wrapContainer {
        width: 100%;
        height: 100%;
        background-color: #fff;
        position: absolute;
        left: 0;
        top: 0;
    }
    .content {
        padding: 0 20px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }

    .tab {
        display: flex;
        width: 100%;
        height: 40px;
        line-height: 40px;
        background-color: #fff;
        border-bottom: 1px solid #ddd;
        text-align: center;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 100;
        .tabWrap {
            flex: 1;
            li {
                float: left;
                width: 50%;
                border-right: 1px solid #ddd;
                &:last-of-type {
                    border-right: none;
                }
                &.active {
                    background-color: #33adff;
                    color: #fff;
                }
            }
        }
        .logout {
            width: 80px;
            border-left: 1px solid #ddd;
        }
    }
}

</style>
