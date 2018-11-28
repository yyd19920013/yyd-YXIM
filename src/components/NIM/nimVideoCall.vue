<template>
    <div
        :class="{
            nimVideoCall:true,
            active:showNimVideoCall,
        }"
    >
        <div class="remoteContainer" ref="remoteContainer">
            <div class="container" ref="container"></div>
            <div class="handle">
                <div class="handleWrap">
                    <button
                        type="button"
                        @click="hangup"
                    >
                        挂断
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import vm from 'src/main';
    import {lStore,sStore,Type} from 'js/yydjs';
    import nimNetcallInit from './nimNetcallInit';

    export default{
        data(){
            return{
                nimChat:sStore.get('nimChat')||{},
                width:document.documentElement.clientWidth,
                height:document.documentElement.clientHeight,
                showNimVideoCall:false,
                netcallInited:false,
                signalInited:false,
                pushConfig:{
                    enable: true,
                    needBadge: true,
                    needPushNick: true,
                    pushContent: '',
                    custom: '测试自定义数据',
                    pushPayload: '',
                    sound: '',
                    forceKeepCalling: 0,
                },
                sessionConfig:{
                    videoQuality: Netcall.CHAT_VIDEO_QUALITY_HIGH,
                    videoFrameRate: Netcall.CHAT_VIDEO_FRAME_RATE_15,
                    videoBitrate: 0,
                    recordVideo: false,
                    recordAudio: false,
                    highAudio: false,
                    bypassRtmp: false,
                    rtmpUrl: '',
                    rtmpRecord: false,
                    splitMode: Netcall.LAYOUT_SPLITLATTICETILE,
                },
                netcallInfo:{
                    beCalling:false,//是否被叫中
                    type:null,//呼叫类型
                    beCalledInfo:null,//被叫信息
                    busy:false,//是否正忙
                },
                callTimer:null,
            }
        },

        /*

        */

        props:{

        },

        created(){

        },

        mounted(){
            vm.$on('nimOnConnect',this.netcallInit);
        },

        updated(){
            this.nimChat=sStore.get('nimChat')||{};
        },

        beforeDestroy(){
            clearTimeout(this.callTimer);
            vm.$off('nimOnConnect',this.netcallInit);
        },

        methods:{
            controlNimVideoCall(show){
                this.showNimVideoCall=show;
            },
            hangup(){
                this.controlNimVideoCall(false);

                netcall.hangup();
                this.resetWhenHangup();
            },
            resetWhenHangup(){
                this.controlNimVideoCall(false);

                // 停止本地视频预览
                netcall.stopLocalStream();

                // 停止对端视频预览
                netcall.stopRemoteStream();

                // 停止设备麦克风
                netcall.stopDevice(Netcall.DEVICE_TYPE_AUDIO_IN);

                // 停止设备摄像头
                netcall.stopDevice(Netcall.DEVICE_TYPE_VIDEO);

                // 停止播放本地音频
                netcall.stopDevice(Netcall.DEVICE_TYPE_AUDIO_OUT_LOCAL);

                // 停止播放对端音频
                netcall.stopDevice(Netcall.DEVICE_TYPE_AUDIO_OUT_CHAT);
            },
            netcallInit(endFn){
                nimNetcallInit(0,this.$refs.container,this.$refs.remoteContainer);
                this.netcallInited=true;

                //初始化信令
                this.signalInit(endFn);

                //被叫收到呼叫通知
                this.beCalling();

                //主叫收到被叫响应回调
                this.callResponse();
            },
            signalInit(endFn){
                //信令通道初始化完毕之后, 开发者可以启用音视频通话相关的 UI, 比如说展示呼叫别人的按钮
                //信令通道初始化失败的时候, 请展示错误并禁用所有音视频通话相关的 UI
                netcall.initSignal().then(()=>{
                    this.signalInited=true;
                    window.nimVideoCall=this;
                    window.showNimVideoCall=()=>{
                        this.controlNimVideoCall(true);
                    };
                    window.closeNimVideoCall=()=>{
                        this.controlNimVideoCall(false);
                    };

                    if(Type(endFn)=='function'){
                        endFn();
                    }
                }).catch((err)=>{
                    this.signalInited=false;
                    console.log(err);
                });

                //当信令通道断开时, 会触发 signalClosed 事件
                netcall.off('signalClosed');
                netcall.on('signalClosed',()=>{
                    this.signalInited=false;
                    this.hangup();
                });

                //初始化过程中会通过 devices 事件回传所有的设备列表
                netcall.off('devices');
                netcall.on('devices',(obj)=>{
                    //console.log('on devices',obj);
                });
            },
            beCalling(){
                netcall.off('beCalling');
                netcall.on('beCalling',(obj)=>{
                    const channelId=obj.channelId;

                    //被叫回应主叫自己已经收到了通话请求
                    netcall.control({
                        channelId,
                        command: WebRTC.NETCALL_CONTROL_COMMAND_START_NOTIFY_RECEIVED,
                    });

                    //只有在没有通话并且没有被叫的时候才记录被叫信息, 否则通知对方忙并拒绝通话
                    if(!netcall.calling&&!this.netcallInfo.beCalling){
                        this.netcallInfo.type=obj.type;
                        this.netcallInfo.beCalling=true;
                        this.netcallInfo.beCalledInfo=obj;
                    }else{
                        if(netcall.calling){
                            this.netcallInfo.busy=netcall.notCurrentChannelId(obj);
                        }else if(beCalling){
                            this.netcallInfo.busy=this.netcallInfo.beCalledInfo.channelId!==channelId;
                        }

                        if(this.netcallInfo.busy){
                            netcall.control({
                                channelId,
                                command:WebRTC.NETCALL_CONTROL_COMMAND_BUSY,
                            });

                            //拒绝通话
                            netcall.response({
                                accepted:false,
                                beCalledInfo:obj,
                            });
                        }
                    }
                });
            },
            callResponse(){
                //被叫拒绝的通知
                netcall.off('callRejected');
                netcall.on('callRejected',(obj)=>{
                    //取消呼叫倒计时
                    clearTimeout(this.callTimer);

                    //挂断
                    this.hangup();
                });

                //被叫接受的通知
                netcall.off('callAccepted');
                netcall.on('callAccepted',(obj)=>{
                    //缓存呼叫类型，后面开启音视频连接需要用到
                    this.netcallInfo.type=obj.type;

                    //取消呼叫倒计时
                    clearTimeout(this.callTimer);

                    //可以开启音视频连接操作。。。
                    this.videoLink();
                });

                netcall.off('hangup');
                netcall.on('hangup',(obj)=>{
                    let {beCalledInfo}=this.netcallInfo;

                    // 判断需要挂断的通话是否是当前正在进行中的通话
                    if(!beCalledInfo||beCalledInfo.channelId===obj.channelId){
                        // 清理工作
                        this.resetWhenHangup();
                    }
                });
            },
            videoLink(){
                let {scene,to}=this.nimChat;

                //开启麦克风
                netcall.startDevice({
                    type:Netcall.DEVICE_TYPE_AUDIO_IN,
                }).then(()=>{
                    //通知对方自己开启了麦克风
                    netcall.control({
                        command:Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_ON,
                    });
                }).catch(function(err){
                    console.log(err);
                });

                //开启摄像头
                netcall.startDevice({
                    type:Netcall.DEVICE_TYPE_VIDEO,
                    width:this.width,
                    height:this.height,
                }).then(()=>{
                    //通知对方自己开启了摄像头
                    netcall.control({
                        command:Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_VIDEO_ON,
                    });
                }).catch((err)=>{
                    //通知对方自己的摄像头不可用
                    netcall.control({
                        command:Netcall.NETCALL_CONTROL_COMMAND_SELF_CAMERA_INVALID,
                    });
                    console.log(err);
                })

                //开启本地视频预览
                netcall.startLocalStream();

                //开启远程视频预览
                netcall.startRemoteStream();

                //开启本地音频播放
                netcall.startDevice({
                    type:Netcall.DEVICE_TYPE_AUDIO_OUT_CHAT,
                }).catch((err)=>{
                    console.log(err);
                })

                //设置本地音量采集大小, 该API可以在通话过程中动态调用调整自己的音量采集大小
                netcall.setCaptureVolume(255);

                //设置本地音量播放大小, 该API可以在通话过程中动态调用调整自己的音量播放大小(即自己听对端的音量)
                netcall.setPlayVolume(255);

                //设置本地视频画面大小
                netcall.setVideoViewSize({
                    width: 100,
                    height: 100,
                    cut: true,
                });

                //设置远程视频画面大小
                netcall.setVideoViewRemoteSize({
                    account: to,
                    width:this.width,
                    height:this.height,
                    cut: true,
                });

                this.controlNimVideoCall(true);
            },
            call(){
                let {scene,to}=this.nimChat;
                let {pushConfig,sessionConfig}=this;

                this.netcallInit(()=>{
                    netcall.call({
                        type: Netcall.NETCALL_TYPE_VIDEO,
                        account: to,
                        pushConfig,
                        sessionConfig,
                        webrtcEnable: true
                    }).then(function(obj){
                        //成功发起呼叫
                        console.log('call success', obj);
                    }).catch(function(err){
                        console.log(err);
                        //被叫不在线
                        if(err.event&&err.event.code === 11001){
                            console.log('callee offline', err);
                        }
                    });

                    //设置超时计时器
                    this.callTimer=setTimeout(function() {
                      if (!netcall.callAccepted) {
                        this.hangup();
                      }
                    },1000*30);
                });
            },
            response(){
                let {sessionConfig}=this;
                let {beCalledInfo}=this.netcallInfo;

                netcall.response({
                    accepted:true,
                    beCalledInfo,
                    sessionConfig,
                }).catch((err)=>{
                    reject();
                    console.log('接听失败', err);
                });

                //拒绝
                //可以先通知对方自己忙, 拒绝的时候需要回传在 `beCalling` 事件里面接收到的对象
                this.netcallInfo.beCalledInfo=false;

                netcall.control({
                    channelId: beCalledInfo.channelId,
                    command: WebRTC.NETCALL_CONTROL_COMMAND_BUSY,
                });
                netcall.response({
                    accepted: false,
                    beCalledInfo,
                });
                this.netcallInfo.beCalledInfo=null;
                this.netcallInfo.beCalling=false;
            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .nimVideoCall{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1000;
        display: none;
        &.active{
            display: block;
        }
        .remoteContainer{
            width: 100%;
            height: 100%;
            background-color: #000;
            position: absolute;
            left: 0;
            top: 0;
            .container{
                width: 100px;
                height: 100px;
                position: absolute;
                right: 20px;
                top: 20px;
                z-index: 10;
            }
            .handle{
                width: 100%;
                padding: 20px;
                height: 70px;
                position: absolute;
                left: 0;
                bottom: 0;
                z-index: 10;
                .handleWrap{
                    margin: 0 auto;
                    text-align: center;
                    height: 100%;
                    button{
                        margin: 0 10px;
                        height: 100%;
                    }
                }
            }
        }
    }
</style>

<style lang="scss">
    .nimVideoCall{
        .remoteContainer{
            canvas{
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                margin: auto;
            }
        }
    }
</style>