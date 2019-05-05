<template>
    <div class="nimMessageList">
        <div class="content scrollContainer">
            <ul class="messageList">
                <li
                    v-if="item.lastMsg.from!=item.lastMsg.to"
                    v-for="(item,index) in sessionList"
                >
                    <div
                        class="left"
                        @click="toChat(item.scene,item.lastMsg.target)"
                    >
                        <h3>
                            <span>{{item.lastMsg.target}}</span>
                            <em>{{dateFormat0(item.lastMsg.time,'yyyy-MM-dd hh:mm')}}</em>
                        </h3>
                        <h4>
                            <span
                                v-if="item.lastMsg.type=='text'"
                                class="overflow"
                            >
                                {{item.lastMsg.text}}
                            </span>
                            <span
                                v-if="item.lastMsg.type=='custom'"
                                class="overflow"
                            >
                                [自定义消息]
                            </span>
                            <span
                                v-if="item.lastMsg.type=='file'"
                                class="overflow"
                            >
                                [文件]
                            </span>
                            <em v-show="item.unread>0">{{item.unread}}</em>
                        </h4>
                    </div>
                    <a
                        class="delete"
                        @click="deleteSession(item.scene,item.lastMsg.target)"
                    >
                        删除
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import vm from 'src/main';
    import {dateFormat0,sStore} from 'js/yydjs';

    export default{
        data(){
            return{
                sessionList:[],
                dateFormat0,
            }
        },

        /*

        */

        props:{

        },

        created(){
            vm.$on('nimOnSessionsAll',this.getSessionList);
        },

        beforeDestroy(){
            vm.$off('nimOnSessionsAll',this.getSessionList);
        },

        methods:{
            getSessionList(res){
                this.sessionList=res;
            },
            toChat(scene,to){
                sStore.set('nimChat',{
                    scene,
                    to,
                });
                window.controlPage('nimChat',true);
            },
            deleteSession(scene,to){
                nim.deleteSession({
                    scene,
                    to,
                    done(error,obj){
                        if(!error){
                            alert('删除会话成功');
                        }else{
                            alert(error);
                        }
                    },
                });
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .nimMessageList{
        .content{
            padding: 0;
            .messageList{
                li{
                    padding: 10px 20px;
                    line-height: 20px;
                    border-bottom: 1px solid #ddd;
                    position: relative;
                    .left{
                        padding-right: 50px;
                        h3{
                            overflow: hidden;
                            em{
                                float: right;
                                color: #999;
                                font-size: 12px;
                            }
                        }
                        h4{
                            padding-right: 30px;
                            position: relative;
                            span{
                                display: block;
                            }
                            em{
                                width: 20px;
                                height: 20px;
                                line-height: 20px;
                                text-align: center;
                                border-radius: 50%;
                                background-color: #ff0000;
                                color: #fff;
                                font-size: 12px;
                                position: absolute;
                                right: 0;
                                top: 0;
                            }
                        }
                    }
                    .delete{
                        width: 60px;
                        height: 100%;
                        line-height: 60px;
                        border-left: 1px solid #ddd;
                        text-align: center;
                        color: #ff0000;
                        position: absolute;
                        right: 0;
                        top: 0;
                    }
                }
            }
        }
    }
</style>