<template>
    <div class="nimHome">
        <div class="tab">
            <ol class="tabWrap">
                <li
                    v-for="(item,index) in ['消息','联系人']"
                    :class="{
                        active:tabIndex==index,
                    }"
                    @click="tabControl(index)"
                >
                    {{item}}
                </li>
            </ol>
        </div>

        <div
            class="nimMessageListWrap wrapContainer"
            ref="nimMessageListWrap"
            v-show="pageControl.nimMessageList"
        >
            <nimMessageList
                :parent="this"
            />
        </div>

        <div
            class="nimAddressListWrap wrapContainer"
            ref="nimAddressListWrap"
            v-show="pageControl.nimAddressList"
        >
            <nimAddressList
                :parent="this"
            />
        </div>

        <div
            class="nimChatWrap wrapContainer"
            ref="nimChatWrap"
            v-show="pageControl.nimChat"
        >
            <nimChat
                :parent="this"
            />
        </div>

        <div
            class="nimSearchFriendWrap wrapContainer"
            ref="nimSearchFriendWrap"
            v-show="pageControl.nimSearchFriend"
        >
            <nimSearchFriend
                :parent="this"
            />
        </div>

        <div
            class="nimCreateTeamWrap wrapContainer"
            ref="nimCreateTeamWrap"
            v-show="pageControl.nimCreateTeam"
        >
            <nimCreateTeam
                :parent="this"
            />
        </div>

        <div
            class="nimLoginWrap wrapContainer"
            ref="nimLoginWrap"
            v-show="pageControl.nimLogin"
        >
            <nimLogin
                :parent="this"
            />
        </div>

        <nimVideoCall
            :parent="this"
        />
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
    import {bind,unbind,lStore,sStore} from 'js/yydjs';

    export default{
        data(){
            let pageControl=sStore.get('pageControl');

            if(!pageControl){
                pageControl={};
                pageControl.nimLogin=false;
                pageControl.nimMessageList=true;
                pageControl.nimAddressList=false;
                pageControl.nimChat=false;
                pageControl.nimSearchFriend=false;
                pageControl.nimCreateTeam=false;
            }

            return{
                pageControl:{
                    nimLogin:pageControl.nimLogin,
                    nimMessageList:pageControl.nimMessageList,
                    nimAddressList:!pageControl.nimMessageList,
                    nimChat:pageControl.nimChat,
                    nimSearchFriend:pageControl.nimSearchFriend,
                    nimCreateTeam:pageControl.nimCreateTeam,
                },
                zIndex:0,
                tabIndex:pageControl.nimMessageList?0:1,
            }
        },

        /*

        */

        props:{

        },

        created(){
            bind(window,'unload',this.savePageStatus);
        },

        mounted(){
            //判断im是否需要登录
            this.judgeLogin();

            //挂载控制页面关闭的方法在window下
            window.controlPage=this.controlPage;
        },

        beforeDestroy(){
            //保存页面显示的状态
            this.savePageStatus();
        },

        methods:{
            savePageStatus(){
                sStore.set('pageControl',this.pageControl);
            },
            controlPage(controlName,refName,show){
                this.pageControl[controlName]=show;

                let oPage=this.$refs[refName];

                if(oPage&&show){
                    this.zIndex++;
                    oPage.style.zIndex=this.zIndex;
                }
            },
            judgeLogin(){
                if(!lStore.get('account')||!lStore.get('token')){
                    alert('请先登录');
                    this.controlPage('nimLogin','nimLoginWrap',true);
                }else{
                    nimInit();
                }
            },
            tabControl(index){
                this.tabIndex=index;

                switch(index){
                    case 0:
                            controlPage('nimAddressList','nimAddressListWrap',false);
                            controlPage('nimMessageList','nimMessageListWrap',true);
                            break;
                    case 1:
                            controlPage('nimMessageList','nimMessageListWrap',false);
                            controlPage('nimAddressList','nimAddressListWrap',true);
                            break;
                }
            },
        },

        components:{
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

    .nimHome{
        height: 100vh;
        background-color: #fff;
        position: relative;
        overflow: hidden;
        .scrollContainer{
            width: 100%;
            height: 100%;
            background-color: #fff;
            position: absolute;
            left: 0;
            top: 0;
            overflow: hidden;
        }
        .wrapContainer{
            width: 100%;
            height: 100%;
            background-color: #fff;
            position: absolute;
            left: 0;
            top: 0;
        }
        .content{
            padding: 0 20px;
            overflow-y: auto;
            -webkit-overflow-scrolling:touch;
        }

        .tab{
            height: 40px;
            .tabWrap{
                width: 100%;
                height: 40px;
                line-height: 40px;
                border-bottom: 1px solid #ddd;
                text-align: center;
                position: absolute;
                left: 0;
                top: 0;
                li{
                    float: left;
                    width: 50%;
                    border-right: 1px solid #ddd;
                    &:last-of-type{
                        border-right: none;
                    }
                    &.active{
                        background-color: #33adff;
                        color: #fff;
                    }
                }
            }
        }
        .nimMessageListWrap,.nimAddressListWrap{
            top: 40px;
            .scrollContainer{
                border-bottom: 40px solid transparent;
            }
        }
    }
</style>