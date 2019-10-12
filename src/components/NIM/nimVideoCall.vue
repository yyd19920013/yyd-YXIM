<template>
    <div
        :class="{
            nimVideoCall:true,
            active:showNimVideoCall,
        }"
    >
        <div class="remoteContainer" ref="remoteContainer"></div>
        <div
            class="container"
            ref="container"
            @click="changeContainer"
        ></div>
        <div class="handle">
            <div class="handleWrap">
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
        </div>
    </div>
</template>

<script>
    import vm from 'src/main';
    import {lStore,sStore,Type,alerts} from 'js/yydjs';
    import nimInit from './nimInit';
    import nimNetcallInit from './nimNetcallInit';

    export default{
        data(){
            return{
                nimChat:sStore.get('nimChat')||{},
                netcallType:1,
                agentDownloadUrl:'https://yx-web-nosdn.netease.im/package/1543999612/WebAgent_Setup_V2.9.0.1204.zip?download=WebAgent_Setup_V2.9.0.1204.zip',
                width:320,
                height:366,
                showNimVideoCall:false,
                netcallInited:false,
                signalInited:false,
                pushConfig:{
                    enable: true,
                    needBadge: true,
                    needPushNick: true,
                    pushContent: '',
                    custom: '',
                    pushPayload: '',
                    sound: '',
                    forceKeepCalling: 0,
                },
                sessionConfig:{
                    videoQuality: Netcall.CHAT_VIDEO_QUALITY_HIGH,
                    videoFrameRate: Netcall.CHAT_VIDEO_FRAME_RATE_15,
                    videoBitrate: 0,
                    recordVideo: true,
                    recordAudio: true,
                    recordType: 1,
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
                callDoneTimer:null,
                callDone:true,
                isRemote:true,
                microphoneValue:50,
                voiceValue:50,
            }
        },

        computed:{
            captureVolume(){
                let {microphoneValue}=this;

                return Math.floor(microphoneValue/100*255);
            },
            playVolume(){
                let {voiceValue}=this;

                return Math.floor(voiceValue/100*255);
            },
        },

        /*

        */

        props:{

        },

        created(){
            vm.$on('componentsUpdate',this.componentsUpdate);
//          vm.$on('nimOnConnect',this.netcallInit);

            window.nimVideoCall=this;
            window.showNimVideoCall=()=>{
                this.controlNimVideoCall(true);
            };
            window.closeNimVideoCall=()=>{
                this.controlNimVideoCall(false);
            };
        },

        mounted(){

        },

        beforeDestroy(){
            vm.$off('componentsUpdate',this.componentsUpdate);
            vm.$off('nimOnConnect',this.netcallInit);
            clearTimeout(this.callTimer);
            this.appendContainerTo(true);
            this.hangup();
        },

        methods:{
            componentsUpdate(controlName){
                if(controlName!='nimChat')return;
                this.nimChat=sStore.get('nimChat')||{};
                this.showNimVideoCall=false;
                this.netcallInited=false;
                this.signalInited=false;
            },
            //nim音视频
            checkPlatform(endFn){
                const checkBrowser1=()=>{
                    //判断是否是Chrome, Edge, IE 11
                    if(/Chrome/gi.test(platform.name)||platform.name=='Microsoft Edge'||(platform.name=='IE'&&platform.version=='11.0')){
                        endFn&&endFn();
                    }else{
                        alert('当前浏览器不支持音视频功能，请使用 Chrome、IE 11 或者 Edge 浏览器');
                    }
                };
                const checkBrowser2=()=>{
                    //判断是否是Chrome, Firefox, Safari
                    if(/Chrome/gi.test(platform.name)||/Firefox/gi.test(platform.name)||/Safari/gi.test(platform.name)){
                        endFn&&endFn();
                    }else{
                        alert('当前浏览器不支持音视频功能，请使用 Chrome、Firefox 或者 Safari 浏览器');
                    }
                };

                if(this.netcallType==0){
                    //判断是否是win7或win10
                    if (~platform.os.family.indexOf("Windows")&&(platform.os.version=='7'||platform.os.version=='10')){
                        checkBrowser1();
                    }else{
                        alert('当前系统不支持音视频功能，请使用win7、win10系统');
                    }
                }else{
                    checkBrowser2();
                }
            },
            controlNimVideoCall(show){
                this.showNimVideoCall=show;
            },
            hangup(){
                if(!window.netcall)return;
                this.controlNimVideoCall(false);

                netcall.hangup();
                this.resetWhenHangup();
            },
            resetWhenHangup(){
                this.controlNimVideoCall(false);

                //停止本地视频预览
                netcall.stopLocalStream();

                //停止对端视频预览
                netcall.stopRemoteStream();

                //停止设备麦克风
                netcall.stopDevice(Netcall.DEVICE_TYPE_AUDIO_IN);

                //停止设备摄像头
                netcall.stopDevice(Netcall.DEVICE_TYPE_VIDEO);

                //停止播放本地音频
                netcall.stopDevice(Netcall.DEVICE_TYPE_AUDIO_OUT_LOCAL);

                //停止播放对端音频
                netcall.stopDevice(Netcall.DEVICE_TYPE_AUDIO_OUT_CHAT);

                if(this.netcallType==0){//PCAgent
                    //停止信令通道
                    netcall.stopSignal();
                }

                this.netcallInited=false;
                this.signalInited=false;
                this.callDone=true;
            },
            createContainer(){
                let nimContainer=document.getElementById('nimContainer');
                let nimRemoteContainer=document.getElementById('nimRemoteContainer');

                if(!nimContainer||!nimRemoteContainer){
                    nimContainer=document.createElement('div');
                    nimRemoteContainer=document.createElement('div');

                    nimContainer.id='nimContainer';
                    nimRemoteContainer.id='nimRemoteContainer';

                    document.body.appendChild(nimContainer);
                    document.body.appendChild(nimRemoteContainer);
                }

                return {nimContainer,nimRemoteContainer};
            },
            appendContainerTo(body){
                let nimContainer=document.getElementById('nimContainer');
                let nimRemoteContainer=document.getElementById('nimRemoteContainer');
                let {container,remoteContainer}=this.$refs;

                if(nimContainer&&nimRemoteContainer){
                    if(body){
                        document.body.appendChild(nimContainer);
                        document.body.appendChild(nimRemoteContainer);
                    }else{
                        container.appendChild(nimContainer);
                        remoteContainer.appendChild(nimRemoteContainer);
                    }
                }
            },
            changeContainer(){
                let nimContainer=document.getElementById('nimContainer');
                let nimRemoteContainer=document.getElementById('nimRemoteContainer');
                let {container,remoteContainer}=this.$refs;

                this.isRemote=!this.isRemote;
                if(!this.isRemote){
                    container.appendChild(nimRemoteContainer);
                    remoteContainer.appendChild(nimContainer);
                }else{
                    container.appendChild(nimContainer);
                    remoteContainer.appendChild(nimRemoteContainer);
                }
            },
            netcallInit(endFn){
                let {nimContainer,nimRemoteContainer}=this.createContainer();

                nimNetcallInit(this.netcallType,nimContainer,nimRemoteContainer);
                this.appendContainerTo(false);
                this.netcallInited=true;

                //初始化信令
                this.signalInit(endFn);

                //被叫收到呼叫通知
                this.beCalling();

                //主叫收到被叫响应回调
                this.callResponse();
            },
            signalInit(endFn){
                //先检查系统和浏览器是否支持pcAgent
                this.checkPlatform(()=>{
                    //信令通道初始化完毕之后, 开发者可以启用音视频通话相关的 UI, 比如说展示呼叫别人的按钮
                    //信令通道初始化失败的时候, 请展示错误并禁用所有音视频通话相关的 UI
                    netcall.initSignal().then(()=>{
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

                        this.signalInited=true;

                        if(Type(endFn)=='function'){
                            endFn();
                        }
                    }).catch((err)=>{
                        console.log(err);
                        this.signalInited=false;
                        if(err.code=='noPC'){
                            if(confirm('请安装PC Agent，方可使用音视频功能')){
                                window.open(this.agentDownloadUrl);
                                alert('下载完成后，需手动安装插件');
                            }
                        }
                    });
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
                        this.controlNimVideoCall(true);
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

                //被叫正忙的通知
                netcall.off('control');
                netcall.on('control',(obj)=>{
                    let {type}=obj;

                    if(type==9){
                        alerts('对方正忙，请稍后再试');

                        //取消呼叫倒计时
                        clearTimeout(this.callTimer);

                        //挂断
                        this.hangup(true);
                    }
                });

                //收到挂断通知
                netcall.off('hangup');
                netcall.on('hangup',(obj)=>{
                    let {beCalledInfo}=this.netcallInfo;

                    // 判断需要挂断的通话是否是当前正在进行中的通话
                    if(!beCalledInfo||beCalledInfo.channelId===obj.channelId){
                        // 清理工作
                        this.resetWhenHangup();
                    }
                });

                //其他端已处理的通知
                netcall.on('callerAckSync', function(obj) {
                    console.log('其他端已经做了处理', obj);
                });

                //sdk内部消息通知
                netcall.on('error',function(obj){
                    console.log('sdk反馈错误信息',obj);
                    if(obj.code){
                        if(obj.code==509){
                            console.warn('你被提出房间了');
                        }else if(obj.code==500){
                            console.warn('你的web不支持H264视频编码，无法进行呼叫，请检测浏览器的H264插件是否正常');
                        }
                    }
                });
            },
            videoLink(){
                let {scene,to}=this.nimChat;
                let {nimContainer,nimRemoteContainer}=this.createContainer();
                const videoLinkFn=()=>{
                    //开启麦克风
                    return netcall.startDevice({
                        type:Netcall.DEVICE_TYPE_AUDIO_IN,
                    }).then(()=>{
                        //通知对方自己开启了麦克风
                        netcall.control({
                            command:Netcall.NETCALL_CONTROL_COMMAND_NOTIFY_AUDIO_ON,
                        });

                        //设置本地音量采集大小, 该API可以在通话过程中动态调用调整自己的音量采集大小
                        netcall.setCaptureVolume(this.captureVolume);

                        //设置本地音量播放大小, 该API可以在通话过程中动态调用调整自己的音量播放大小(即自己听对端的音量)
                        netcall.setPlayVolume(this.playVolume);

                        //开启本地音频播放
                        netcall.startDevice({
                            type:Netcall.DEVICE_TYPE_AUDIO_OUT_CHAT,
                        }).catch((err)=>{
                            console.log(err);
                        });

                        //开启摄像头
                        return netcall.startDevice({
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
                        });
                    }).then(()=>{
                        //开启本地视频预览
                        netcall.startLocalStream();

                        //开启远程视频预览
                        netcall.startRemoteStream({
                            account:to,
                        });

                        //设置本地视频画面大小
                        netcall.setVideoViewSize({
                            width:this.width,
                            height:this.height,
                            cut:true,
                        });

                        //设置远程视频画面大小
                        netcall.setVideoViewRemoteSize({
                            account:to,
                            width:this.width,
                            height:this.height,
                            cut:true,
                        });

                        this.controlNimVideoCall(true);
                    }).catch((err)=>{
                        console.log(err);
                    });
                };

                if(this.netcallType==0){//开启PCAgent连接
                    videoLinkFn();
                }else{//开启WebRTC连接
                    netcall.startRtc().then(()=>{
                        console.log('webrtc连接成功');
                        return videoLinkFn();
                    }).catch(function(err){
                        console.log('发生错误, 结束会话', err);
                        netcall.leaveChannel();
                    });
                }
            },
            call(){
                if(!this.callDone)return alert('请不要频繁发起');
                let {scene,to}=this.nimChat;
                let {pushConfig,sessionConfig}=this;
                const netcallCall=()=>{
                    netcall.call({
                        type: Netcall.NETCALL_TYPE_VIDEO,
                        account: to,
                        pushConfig,
                        sessionConfig,
                        webrtcEnable: true
                    }).then((obj)=>{
                        //成功发起呼叫
                        vm.$emit('nimVideoCallSuccess',obj);
                        console.log('call success', obj);
                    }).catch((err)=>{
                        console.log(err);
                        //被叫不在线
                        vm.$emit('nimVideoCallFail',err);
                        if(err.event&&err.event.code === 11001||err.event&&err.event.event&&err.event.event.code === 11001){
                            console.log('callee offline');
                            this.hangup();
                            vm.$emit('nimVideoCallcalleeOffline',err);
                        }

                        //防止频繁发起
                        clearTimeout(this.callDoneTimer);
                        this.callDoneTimer=setTimeout(()=>{
                            this.callDone=true;
                        },3000);
                    });

                    //设置超时计时器
                    clearTimeout(this.callTimer);
                    this.callTimer=setTimeout(()=>{
                        if(!netcall.callAccepted){
                            this.hangup();
                        }
                    },1000*30);
                };

                this.callDone=false;
                this.netcallInit(netcallCall);
            },
            response(){
                let {sessionConfig,netcallInfo}=this;
                let {beCalledInfo}=netcallInfo;

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
            /deep/ div{
                width: 100%!important;
                height: 100%!important;
                max-width: 100%;
                max-height: 100%;
            }
        }
        .container{
            width: 80px;
            height: 92px;
            background-color: #000;
            position: absolute;
            right: 20px;
            top: 20px;
            z-index: 10;
            /deep/ div{
                width: 100%!important;
                height: 100%!important;
                max-width: 100%;
                max-height: 100%;
            }
        }
        /deep/ #nimRemoteContainer,/deep/ #nimContainer,/deep/ canvas{
            width: 100%;
            height: 100%;
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
</style>