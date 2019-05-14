<template>
    <div class="nimChat">
        <nimHeader
            :parent="parent"
            :controlPageName="'nimChat'"
            :title="nimChat.to"
        />

        <section
            class="content scrollContainer"
            ref="content"
        >
            <ul class="msgList">
                <li v-for="(item,index) in msgList">
                    <div class="title">
                        {{dateFormat0(item.time,'yyyy-MM-dd hh:mm')}}
                    </div>
                    <div class="main">
                        <div
                            :class="{
                                msgWrap:true,
                                other:lStore.get('nimAccount')!=item.from,
                            }"
                        >
                            <div class="nickName">
                                {{item.fromNick}}
                            </div>
                            <div
                                v-if="item.type=='text'"
                                class="msg"
                            >
                                {{item.text}}
                            </div>
                            <div
                                v-if="item.type=='custom'"
                                class="custom"
                            >
                                <div
                                    v-if="item.content.type=='order'"
                                    class="order"
                                >
                                    <a :href="item.content.link">
                                        <div class="title">
                                            {{item.content.title}}
                                        </div>
                                        <div class="main">
                                            {{item.content.main}}
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div class="file">
                                <img
                                    v-if="item.type=='image'"
                                    :src="item.file.url"
                                    alt="图片"
                                />
                                <audio
                                    v-if="item.type=='audio'"
                                    :src="item.file.url"
                                    controls
                                ></audio>
                                <video
                                    v-if="item.type=='video'"
                                    :src="item.file.url"
                                    controls
                                ></video>
                                <a v-if="item.type=='file'" :href="item.file.url" download="true" class="download">
                                    <h3 class="multiLine-2">{{item.file.name}}</h3>
                                </a>
                            </div>
                            <div v-if="item.attach">
                                {{netcallMsgJson[item.attach.type]}}
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </section>

        <footer class="footer">
            <div class="footerWrap">
                <div class="left">
                    <input v-model="msg" placeholder="输入要发送的内容" type="text" />
                </div>
                <button
                    type="button"
                    @click="sendText"
                >
                    发送
                </button>
            </div>
        </footer>
        <footer class="footer1">
            <div class="footerWrap1">
                <button
                    type="button"
                    @click="sendCustomMsg"
                >
                    发送自定义
                </button>
                <button
                    type="button"
                >
                    <input
                        class="file"
                        type="file"
                        @change="sendFile('image',$event.currentTarget)"
                    />
                    发送图片
                </button>
                <button
                    type="button"
                >
                    <input
                        class="file"
                        type="file"
                        @change="sendFile('audio',$event.currentTarget)"
                    />
                    发送音频
                </button>
                <button
                    type="button"
                >
                    <input
                        class="file"
                        type="file"
                        @change="sendFile('video',$event.currentTarget)"
                    />
                    发送视频
                </button>
                <button
                    type="button"
                    @click="call"
                >
                    呼叫
                </button>
                <button
                    type="button"
                    @click="hangup"
                >
                    拒绝
                </button>
                <button
                    type="button"
                    @click="response"
                >
                    接听
                </button>
            </div>
        </footer>
    </div>
</template>

<script>
    import nimHeader from './nimHeader';
    import vm from 'src/main';
    import {lStore,sStore,dateFormat0,resetFile,fileType} from 'js/yydjs';

    export default{
        data(){
            return{
                nimChat:sStore.get('nimChat')||{},
                msgList:[],
                msg:'',
                dateFormat0,
                lStore,
                netcallMsgJson:{
                    netcallBill:'通话已结束',
                    netcallRejected:'呼叫被拒绝',
                    cancelNetcallBeforeAccept:'通话已取消',
                },
            }
        },

        /*

        */

        props:{
            parent:{
                required:true,
                type:Object,
                default:null,
            },
        },

        created(){
            vm.$on('componentsUpdate',this.componentsUpdate);
            vm.$on('nimOnConnect',this.getHistoryMsgs);
            vm.$on('nimOnMsg',this.getMsgs);
            vm.$on('nimVideoCallSuccess',this.nimVideoCallSuccess);
        },

        mounted(){

        },

        beforeDestroy(){
            vm.$off('componentsUpdate',this.componentsUpdate);
            vm.$off('nimOnConnect',this.getHistoryMsgs);
            vm.$off('nimOnMsg',this.getMsgs);
            vm.$off('nimVideoCallSuccess',this.nimVideoCallSuccess);
        },

        methods:{
            componentsUpdate(controlName){
                if(controlName!='nimChat')return;
                this.nimChat=sStore.get('nimChat')||{};
                this.msgList=[];
                this.getHistoryMsgs();
                this.scrollBottom();
            },
            nimVideoCallSuccess(obj){
                window.showNimVideoCall(true);
            },
            call(){
                console.log(window.nimVideoCall);
                if(window.nimVideoCall){
                    window.nimVideoCall.call();
                }
            },
            response(){
                console.log(window.nimVideoCall);
                if(window.nimVideoCall){
                    window.nimVideoCall.response();
                }
            },
            hangup(){
                console.log(window.nimVideoCall);
                if(window.nimVideoCall){
                    window.nimVideoCall.hangup();
                }
            },
            scrollBottom(){
                setTimeout(()=>{
                    let oContent=this.$refs.content;
                    let {scene,to}=this.nimChat;

                    oContent.scrollTop=oContent.scrollHeight;
                    nim.resetSessionUnread(scene+'-'+to);
                },300);
            },
            getHistoryMsgs(){
                let {scene,to}=this.nimChat;

                nim.getHistoryMsgs({
                    scene,
                    to,
                    limit: 20,
                    asc: true,
                    done: (error, msg)=>{
                        if(!error){
                            let {msgs}=msg;

                            msgs=msgs.map((item,index)=>{
                                if(item.type=='custom'){
                                    item.content=JSON.parse(item.content);
                                }
                                return item;
                            });
                            console.log(msgs);
                            this.msgList=[].concat(msgs);
                            this.scrollBottom();
                        }
                    },
                });
            },
            getMsgs(res){
                console.log(res);
                let msgArr=[];
                let {scene,to}=this.nimChat;

                for(let attr in res){
                    if(attr.replace(`${scene}-`,'')==to){
                        this.msgList=[].concat(this.msgList,res[attr]);
                    }
                }

                this.scrollBottom();
            },
            sendText(){
                let {scene,to}=this.nimChat;

                nim.sendText({
                    scene,
                    to,
                    text: this.msg,
                    done: (error, msg)=>{
                        this.msg='';
                        if(!error){
                            this.msgList=[].concat(this.msgList,[msg]);

                            this.scrollBottom();
                        }
                    },
                });
            },
            sendCustomMsg(){
                let {scene,to}=this.nimChat;

                nim.sendCustomMsg({
                    scene,
                    to,
                    content:JSON.stringify({
                        type:'order',
                        title:'药品订单',
                        main:'这是一条自定义消息',
                        link:'//www.baidu.com',
                    }),
                    done: (error, msg)=>{
                        this.msg='';
                        if(!error){
                            msg.content=JSON.parse(msg.content);
                            this.msgList=[].concat(this.msgList,[msg]);

                            this.scrollBottom();
                        }
                    },
                });
            },
            sendFile(type,fileInput){
                let {scene,to}=this.nimChat;

                nim.previewFile({
                    type,
                    fileInput,
                    uploadprogress: (obj)=>{
                        // console.log('文件总大小: ' + obj.total + 'bytes');
                        // console.log('已经上传的大小: ' + obj.loaded + 'bytes');
                        // console.log('上传进度: ' + obj.percentage);
                        // console.log('上传进度文本: ' + obj.percentageText);
                    },
                    done: (error, file)=>{
                        if(!error){
                            let type=fileType(file.ext);

                            nim.sendFile({
                                scene,
                                to,
                                type,
                                fileInput,
                                done: (error1, msg1)=>{
                                    if(!error){
                                        this.msgList=[].concat(this.msgList,[msg1]);

                                        resetFile(fileInput);
                                        this.scrollBottom();
                                    }
                                },
                            });
                        }else{
                            alert(error);
                        }
                    }
                });
            },
        },

        components:{
            nimHeader,
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .nimChat{
        .content{
            border-top: 40px solid transparent;
            border-bottom: 150px solid transparent;
            .msgList{
                li{
                    padding: 20px 0;
                    >.title{
                        line-height: 30px;
                        text-align: center;
                        font-size: 12px;
                        color: #999;
                    }
                    >.main{
                        overflow: hidden;
                        .msgWrap{
                            float: right;
                            width: 70%;
                            text-align: right;
                            .nickName{
                                color: #00ffff;
                                float: right;
                                border: 1px solid #00ffff;
                            }
                            .msg{
                                float: right;
                                margin: 0 10px;
                            }
                            .custom{
                                .order{
                                    float: right;
                                    margin: 0 10px;
                                    border: 1px solid #ddd;
                                    border-radius: 5px;
                                    text-align: left;
                                    .title{
                                        padding: 5px 10px;
                                        line-height: 20px;
                                        border-bottom: 1px solid #ddd;
                                    }
                                    .main{
                                        padding: 10px;
                                        font-size: 12px;
                                    }
                                }
                            }
                            .file{
                                img,audio,video{
                                    max-width: 100%;
                                }
                            }
                            &.other{
                                float: left;
                                text-align: left;
                                .nickName{
                                    color: #ff0000;
                                    float: left;
                                    border: 1px solid #ff0000;
                                }
                                .msg,.order{
                                    float: left;
                                }
                            }
                        }
                    }
                }
            }
        }

        .footer{
            height: 50px;
            .footerWrap{
                width: 100%;
                padding: 10px 20px;
                height: 50px;
                border-top: 1px solid #ddd;
                background-color: #fff;
                position: absolute;
                left: 0;
                bottom: 100px;
                z-index: 1000;
                .left{
                    width: 100%;
                    height: 100%;
                    padding-right: 70px;
                    input{
                        width: 100%;
                        height: 100%;
                        border-radius: 5px;
                    }
                }
                button{
                    width: 50px;
                    margin: 10px 20px;
                    height: 30px;
                    position: absolute;
                    right: 0;
                    top: 0;
                }
            }
        }
        .footer1{
            height: 100px;
            .footerWrap1{
                width: 100%;
                padding: 10px 20px;
                height: 100px;
                border-top: 1px solid #ddd;
                background-color: #fff;
                position: absolute;
                left: 0;
                bottom: 0;
                z-index: 1000;
                button{
                    float: left;
                    margin-right: 10px;
                    margin-bottom: 10px;
                    height: 30px;
                    position: relative;
                    .file{
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        left: 0;
                        top: 0;
                        z-index: 10;
                        opacity: 0;
                    }
                }
            }
        }
    }
</style>