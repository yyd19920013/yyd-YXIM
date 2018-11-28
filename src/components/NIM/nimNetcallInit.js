import SDK from './SDKs/NIM_Web_SDK_v5.7.0';
import Netcall from './SDKs/NIM_Web_Netcall_v5.7.0';
import WebRTC from './SDKs/NIM_Web_WebRTC_v5.7.0';
import vm from 'src/main';
import {lStore} from 'js/yydjs';

const nimNetcallInit=(type,container,remoteContainer)=>{
    reconnection();
    function reconnection(){
        if(window.netcall){
            window.netcall.destroy({
                done:function(err){
                    window.netcall=nimNetcallInitFn(type,container,remoteContainer);
                }
            });
        }else{
            window.netcall=nimNetcallInitFn(type,container,remoteContainer);
        }
    };

    function nimNetcallInitFn(type,container,remoteContainer){
        if(type==0){
            SDK.NIM.use(Netcall);
            return Netcall.getInstance({
                kickLast:false,
                nim:window.nim,
                container,
                remoteContainer,
                mirror:true,
                mirrorRemote:true,
            });
        }else{
            SDK.NIM.use(WebRTC);
            return WebRTC.getInstance({
                nim:window.nim,
                container,
                remoteContainer,
                chromeId:'',
                debug:false,
            });
        }
    };
};

export default nimNetcallInit;