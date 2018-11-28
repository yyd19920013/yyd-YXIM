<template>
    <div class="paymentIndex">
        <header1
            title="支付方式"
            :click="returnHint"
        />

        <section class="content">
            <div
                v-show="countDown>0"
                class="orangeHint"
            >
                请在{{countDown|fSecond('minute')}}分{{countDown|fSecond}}秒内完成支付，超时订单自动取消
            </div>

            <div class="payInfo">
                <div class="left">
                    <span>{{orderDetail.itemCodeText}}</span>
                    <em>{{orderDetail.patientMember.name}}</em>
                </div>
                <div class="right">
                    ￥{{orderDetail.orderAmount|toFixed}}
                </div>
            </div>

            <div class="paymentMode">
                <div class="title">
                    请选择支付方式
                </div>
                <ul class="paymentList">
                    <li
                        :class="{
                            active:params[0].payChannel=='02',
                        }"
                    >
                        <span>支付宝</span>
                        <label for="zfb" class="labelFor">
                            <input v-model="params[0].payChannel" value="02" type="radio" id="zfb" />
                        </label>
                    </li>
                    <li
                        :class="{
                            active:params[0].payChannel=='03',
                        }"
                    >
                        <span>微信支付</span>
                        <label for="wx" class="labelFor">
                            <input v-model="params[0].payChannel" value="03" type="radio" id="wx" />
                        </label>
                    </li>
                </ul>
            </div>

            <a
                @click="$router.push({
                    path:'payment/selectInquiryTicket',
                    query,
                })"
                class="inquiryTicket"
            >
                <span>问诊券</span>
                <em>
                    <b v-if="!query.voucherNo&&!ticketListTotal" class="unusable">无可用</b>
                    <b v-if="!query.voucherNo&&ticketListTotal" class="usable">{{ticketListTotal}}张可用</b>
                    <b v-if="query.voucherNo" class="selected">免费问诊券</b>
                    <i class="iconfont icon-jiantou"></i>
                </em>
            </a>
        </section>

        <footer2
            text="实际支付"
            :price="payAmount"
            :button="{
                text:payAmount!=0?'立即支付':'开始问诊',
                style:{
                    backgroundColor:payAmount!=0?'':'#33adff',
                },
                click:toPay,
            }"
        />
    </div>
</template>

<script>
    import {normalDate,lStore,alerts,nativeApi} from 'js/yydjs';
    import {payOrder,getVoucherCount,askDetail,cancelLockOrder,notifyPayResult} from 'services';

    export default{
        data(){
            let query=this.$router.currentRoute.query;
            let {voucherNo}=query;

            return{
                query:this.$router.currentRoute.query,
                payJson:{
                    '02':'type_ali_pay',
                    '03':'type_weixin_pay',
                },
                params:[{
                    orderNo:'', //必传，订单号orderNo
                    payAmount:'', //必传，支付金额
                    goodsCategory:'', //必传，商品分类：30图文问诊 40视频问诊
                    payChannel:'02', //必传，支付渠道：02支付宝 03微信
                    voucherNo, //问诊券码编号
                }],
                orderDetail:{
                    patientMember:{},
                },
                countDown:0,
                timer:null,
                ticketListTotal:0,
            }
        },

        computed:{
            payAmount(){
                return (this.query.voucherNo||!this.orderDetail.orderAmount)?0:+(this.orderDetail.orderAmount||0);
            },
        },

        mounted(){
            //获取我的问诊订单详情
            this.getInquiryDetail();

            //获取问诊券数量
            this.getEnableList();
        },

        beforeDestroy(){
            clearInterval(this.timer);
        },

        methods:{
            getTimeDiff(){
                let timeDiff=Math.ceil((normalDate(this.orderDetail.serverTime)-normalDate(this.orderDetail.createAt))/1000);

                timeDiff=15*60-(timeDiff<0?0:timeDiff);
                return timeDiff;
            },
            returnHint(){
                let timeDiff=this.getTimeDiff();
                let This=this;
                let {doctorOnlineExtraId}=this.orderDetail;

                if(timeDiff<=0){
                    return;
                }

                this.$vux.confirm.show({
                    title:'提示',
                    content:'你的订单已生成，请在15分钟内完成支付，否则系统将为你自动取消订单',
                    confirmText:'继续支付',
                    cancelText:'确定离开',
                    onCancel(){
                        This.$router.go(-1);
                    },
                });
            },
            getInquiryDetail(){
                askDetail([this.query.orderDetailId],(res)=>{
                    this.orderDetail=res.body;

                    let This=this;
                    let timeDiff=this.getTimeDiff();
                    let {orderNo,orderAmount,orderDetailId,itemCode,conStatus}=res.body;

                    this.params[0].orderNo=orderNo;
                    this.params[0].payAmount=orderAmount;
                    this.params[0].goodsCategory=this.dictionaries.goodsJson[itemCode];

                    if(!this.orderDetail.patientMember){
                        this.orderDetail.patientMember={};
                    }

                    switch(conStatus){
                        case '11':
                                this.countDownFn(timeDiff);
                                break;
                        case '15':
                                this.$vux.alert.show({
                                    title:'提示',
                                    content:'订单已经超时',
                                    buttonText:'知道了',
                                    onHide(){
                                        nativeApi.toOrderDetail(This,orderDetailId,itemCode,conStatus,null,true);
                                    }
                                });
                            break;
                    }

                    if(conStatus>=51){
                        this.$vux.alert.show({
                            title:'提示',
                            content:'订单已经支付，不允许重复支付',
                            buttonText:'知道了',
                            onHide(){
                                nativeApi.toOrderDetail(This,orderDetailId,itemCode,conStatus,null,true);
                            }
                        });
                    }

                    //暴露全局支付回调方法
                    window.payresult=this.payresult();
                });
            },
            getEnableList(){
                getVoucherCount([this.query.goodsCode],(res)=>{
                    this.ticketListTotal=res.body.enable;
                });
            },
            payresult(){
                let {orderDetailId,itemCode,conStatus,orderNo,doctorOnlineExtraId}=this.orderDetail;

                return (result)=>{
                    result=result+'';
                    let codeJson={
                        '01':'picInquiry',
                        '02':'videoInquiry',
                    };
                    let This=this;
                    const notifyPayResultFn=()=>{
                        notifyPayResult([orderNo],(res)=>{
                            if(res.body==3){
                                this.orderDetail.conStatus=conStatus==11?52:conStatus;
                                nativeApi.toOrderDetail(this,orderDetailId,itemCode,this.orderDetail.conStatus,doctorOnlineExtraId,true);
                            }else{
                                this.$vux.confirm.show({
                                    title:'提示',
                                    content:'未获取到你的支付结果，你可以选择刷新结果或关闭此弹框等待支付结果。',
                                    confirmText:'刷新结果',
                                    cancelText:'关闭',
                                    onConfirm(){
                                        notifyPayResultFn();
                                    },
                                });
                            }
                        });
                    }

                    switch(result){
                        case '0':
                                alerts('支付成功，正在处理中...',5000);
                                this.countDown=0;
                                setTimeout(()=>{
                                    notifyPayResultFn();
                                },5000);
                            break;
                        case '1':
                                alerts('支付失败');
                            break;
                        case '2':
                        case 'error':
                                cancelLockOrder([orderNo],(res)=>{
                                    alerts('已取消支付');
                                });
                            break;
                    }
                };
            },
            countDownFn(timeDiff){
                if(timeDiff<=0){
                    return;
                }

                this.countDown=timeDiff;
                clearInterval(this.timer);
                this.timer=setInterval(()=>{
                    this.countDown--;
                    if(this.countDown<=0){
                        clearInterval(this.timer);
                    }
                },1000);
            },
            toPay(){
                this.params[0].payAmount=this.payAmount;
                payOrder(this.params,(res)=>{
                    let {body}=res;

                    if(body&&this.payAmount!=0){
                        nativeApi.toPay(this,this.payJson[this.params[0].payChannel],body);
                    }else{
                        if(this.payAmount==0){
                            payresult(0);
                        }
                    }
                },(res)=>{
                    let {orderDetailId,itemCode,conStatus,orderNo,doctorOnlineExtraId}=this.orderDetail;

                    if(res.code==1001||res.code==1002){
                        nativeApi.toOrderDetail(this,orderDetailId,itemCode,conStatus,doctorOnlineExtraId,true);
                    }
                });
            },
        },

        components:{

        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .paymentIndex{
        .content{
            .orangeHint{
                @include orangeHint;
            }
            .payInfo{
                display: flex;
                justify-content: space-between;
                padding: 0 $padding;
                margin-bottom: 10px;
                height: 50px;
                line-height: 50px;
                background-color: #fff;
                .left{
                    display: flex;
                    color: #666;
                    span{
                        margin-right: 5px;
                    }
                }
                .right{
                    color: $orange;
                    font-size: 16px;
                }
            }
            .paymentMode{
                background-color: #fff;
                margin-bottom: 10px;
                .title{
                    padding: 0 $padding;
                    height: 35px;
                    line-height: 34px;
                    border-bottom: $border1;
                    font-size: 12px;
                    color: #999;
                }
            }
            .paymentMode{
                li{
                    padding: $padding 0;
                    padding-right: $padding;
                    margin-left: $padding;
                    height: 60px;
                    line-height: 30px;
                    border-bottom: $border1;
                    position: relative;
                    &:last-of-type{
                        border-bottom: none;
                    }
                    label{
                        background: url('../../../images/icon/ic_checkbox_nor.png') no-repeat right center;
                        background-size: 24px;
                        border-right: $padding solid transparent;
                        input{
                            display: none;
                        }
                    }
                    span{
                        float: left;
                        padding-left: 50px;
                        background: url('../../../images/icon/logo-zhifubao.png') no-repeat left center;
                        background-size: 30px;
                    }
                    &:nth-of-type(2){
                        span{
                            background-image: url('../../../images/icon/logo-weixin.png');
                        }
                    }
                    &.active{
                        label{
                            background-image: url('../../../images/icon/ic_checkbox_sel.png');
                        }
                    }
                }
            }
            .inquiryTicket{
                display: flex;
                justify-content: space-between;
                padding: 0 $padding;
                height: $height1;
                line-height: $height1;
                background-color: #fff;
                em{
                    .unusable{
                        color: #999;
                    }
                    .usable{
                        color: $main;
                    }
                    .selected{
                        color: $main;
                    }
                    i{
                        margin-left: 5px;
                        font-size: 12px;
                    }
                }
                &.active{
                    em{
                        color: $main;
                    }
                }
            }
        }
    }
</style>