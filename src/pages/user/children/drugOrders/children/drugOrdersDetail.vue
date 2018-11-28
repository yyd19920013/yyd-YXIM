<template>
    <div class="drugOrdersDetail">
        <header1
            title="订单详情"
        />

        <section class="content">
            <div class="payStatus">
                <span>等待付款</span>
                <em>剩余：23小时11分钟</em>
            </div>
            <a
                class="shippingAddress"
                @click="$router.push({path:'/user/addressAdmin'})"
            >
                <h3>
                    <span>收货人：吴彦祖</span>
                    <em>18296138539</em>
                </h3>
                <h4>收货地址：浙江省杭州市滨江区长河街道越达巷92号</h4>
            </a>
            <div class="orderInfo">
                <div class="title">
                    <span>晞景儿科互联网医院合作药房</span>
                    <a
                        @click="callService(18296138539)"
                    >
                        联系客服
                    </a>
                </div>
                <div class="main">
                    <ul class="drugList">
                        <li v-for="(item1,index1) in 2">
                            <div class="left">
                                <h3>甲钴胺片 0.5mg*20s</h3>
                                <h4>用法用量：每天3次，每次0.5mg，口服</h4>
                            </div>
                            <div class="right">
                                <h3>￥26.00</h3>
                                <h4>x1</h4>
                            </div>
                        </li>
                    </ul>
                    <div class="count">
                        <h3>
                            <span>订单金额</span>
                            <em>￥58.00</em>
                        </h3>
                         <h4>
                            <span>运费</span>
                            <em>￥5.00</em>
                        </h4>
                         <h5>
                            <span>实付款</span>
                            <em>￥63.00</em>
                        </h5>
                    </div>
                </div>
                <div class="end">
                    <span>电子处方</span>
                </div>
            </div>

            <ul
                :class="{
                    supplementInfo:true,
                    selfPickUp:true,
                }"
            >
                <li>
                    <h3>订单编号：yp20180816121212123</h3>
                    <h3>下单时间：2018-08-16 12:12:12</h3>
                </li>
                <li>
                    <h3>支付方式：支付宝</h3>
                    <h3>支付时间：2018-08-16 12:12:12</h3>
                </li>
                <li>
                    <h3>配送方式：药店自提</h3>
                    <h3>取药日期：2018-08-21</h3>
                </li>
                <li>
                    <h3>发票信息：没有发票</h3>
                    <h3>开具类型：纸质普通发票</h3>
                    <h3>开具抬头：个人</h3>
                    <h3>发票内容：商品名称</h3>
                </li>
            </ul>
        </section>

        <footer3
            :buttonList="[
                {
                    text:'删除订单',
                    click:()=>{showCauses=true},
                },
                {
                    text:'去支付',
                    style:{
                        borderColor:'#ff7955',
                        color:'#ff7955',
                    },
                    click:goPay,
                },
                {
                    text:'查看物流',
                    click:checkLogistics,
                },
                {
                    text:'确认收货',
                    style:{
                        borderColor:'#33adff',
                        color:'#33adff',
                    },
                    click:confirmReceipt,
                },
            ]"
        />

        <popup v-model="showCauses">
            <div class="causesWrap">
                <div class="title">
                    <a
                        class="cancel"
                        @click="showCauses=false;"
                    >
                        取消
                    </a>
                    <span>取消原因</span>
                    <a
                        class="confirm"
                        @click="deleteOrder"
                    >确定</a>
                </div>
                <div class="main">
                    <ul class="causesList">
                        <li
                            v-for="(item,index) in causesList"
                            @click="cIndex1=index;"
                            :class="{
                                active:cIndex1==index,
                            }"
                        >
                            {{item}}
                        </li>
                    </ul>
                </div>
            </div>
        </popup>
    </div>
</template>

<script>
    import {Popup} from 'src/VUX';

    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
                showCauses:false,
                causesList:['误购','价格太贵','需要修改配送地址','其它原因'],
                cIndex1:0,
            }
        },

        mounted(){

        },

        methods:{
            callService(mobileNum){
                this.$vux.confirm.show({
                    title:'提示',
                    content:'是否拨打在线客服电话？',
                    onConfirm(){
                        window.location.href=`tel:${mobileNum}`;
                    },
                });
            },
            deleteOrder(){
                console.log('删除订单');
                this.showCauses=false;
            },
            goPay(){
                console.log('去支付');
            },
            checkLogistics(){
                console.log('查看物流');
                this.$router.push({path:'/user/drugOrders/logisticsInfo'});
            },
            confirmReceipt(){
                this.$vux.confirm.show({
                    title:'提示',
                    content:'请收到货后，再确认收货！否则您可能钱货两空哦',
                    cancelText:'未收到货',
                    confirmText:'已收到货',
                    onConfirm(){
                        console.log('确认收货');
                    },
                });
            },
        },

        components:{
            Popup,
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .drugOrdersDetail{
        .content{
            .payStatus{
                display: flex;
                justify-content: space-between;
                padding: 20px $padding;
                height: 60px;
                line-height: 20px;
                background-color: $lightBlue;
                color: $main;
                span{
                    padding-left: 30px;
                    font-size: 16px;
                    background: url('../../../../../images/icon/ic_order_wait.png') no-repeat left center;
                    background-size: auto 100%;
                }
                em{
                    font-size: 12px;
                }
            }
            .shippingAddress{
                @include shippingAddress('../../../../../');
            }
            .orderInfo{
                @include orderInfo('../../../../../');
                .main{
                    .count{
                        padding: 5px $padding;
                        h3,h4,h5{
                            display: flex;
                            justify-content: space-between;
                            line-height: 24px;
                        }
                        h5{
                            color: $orange;
                        }
                    }
                }
                .end{
                    display: flex;
                    justify-content: flex-end;
                    height: $height1;
                    padding: 7px $padding;
                    span{
                        width: 80px;
                        height: 30px;
                        line-height: 28px;
                        text-align: center;
                        border: 1px solid $main;
                        border-radius: 2px;
                        color: $main;
                    }
                }
            }
            .supplementInfo{
                li{
                    padding: 10px $padding;
                    line-height: 24px;
                    background-color: #fff;
                    color: #666;
                    border-bottom: $border1;
                    font-size: 12px;
                    display: none;
                    &:last-of-type{
                        border-bottom: none;
                    }
                    &:first-of-type{
                        display: block;
                        border-bottom: none;
                    }
                }
                &.selfPickUp{
                    li{
                        &:first-of-type{
                            border-bottom: $border1;
                        }
                        display: block;
                    }
                }
            }
        }

        .causesWrap{
            background-color: #fff;
            .title{
                display: flex;
                height: 50px;
                line-height: 49px;
                border-bottom: $border1;
                a,span{
                    flex: 1;
                }
                .cancel{
                    text-align: left;
                    padding-left: $padding;
                }
                .confirm{
                    text-align: right;
                    padding-right: $padding;
                    color: $main;
                }
                span{
                    font-size: 16px;
                    text-align: center;
                }
            }
            .main{
                .causesList{
                    li{
                        height: $height1;
                        line-height: $height1;
                        border-bottom: $border1;
                        text-align: center;
                        color: #999;
                        &:last-of-type{
                            border-bottom: none;
                        }
                        &.active{
                            color: $main;
                        }
                    }
                }
            }
        }
    }
</style>