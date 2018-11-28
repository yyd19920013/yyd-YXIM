<template>
    <div class="dispenseMedicines">
        <header1
            title="在线配药"
        />

        <section class="content">
            <a class="shippingAddress">
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
                        @click="dispenseMedicinesNotice"
                    >
                        <i class="iconfont icon-wenhao1"></i>
                        配药须知
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
                </div>
            </div>
            <ul class="infoList">
                <li>
                    <span>运费</span>
                    <b>￥63.00</b>
                </li>
                <li>
                    <span
                        @click="invoiceNotice"
                    >
                        开具发票
                        <i class="iconfont icon-wenhao1"></i>
                    </span>
                    <label
                        for="invoice"
                        :class="{
                            'yyd-checkSwitch':true,
                            active:invoice,
                        }"
                    >
                        <input v-model="invoice" value="invoice" type="checkbox" id="invoice" />
                    </label>
                </li>
                <li>
                    <span>发票形式</span>
                    <em>纸质发票</em>
                </li>
                <li>
                    <span>开具类型</span>
                    <em>普通发票</em>
                </li>
                <li>
                    <span>开具抬头</span>
                    <em>个人</em>
                </li>
                <li>
                    <span>发票内容</span>
                    <em>商品名称</em>
                </li>
            </ul>
        </section>

        <footer2
            text="药费合计"
            :price="100.00"
            :button="{
                text:'立即支付',
                click:payFn,
            }"
        />
    </div>
</template>

<script>
    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
                invoice:'',
            }
        },

        mounted(){

        },

        methods:{
            payFn(){
                console.log('立即支付');
            },
            dispenseMedicinesNotice(){
                this.$vux.alert.show({
                    title:'配药须知',
                    content:'配药须知配药须知配药须知配药须知',
                    buttonText:'我知道了',
                });
            },
            invoiceNotice(){
                this.$vux.alert.show({
                    title:'开具发票须知',
                    content:'开具发票须知开具发票须知开具发票须知',
                    buttonText:'我知道了',
                });
            },
        },

        components:{

        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .dispenseMedicines{
        .content{
            .shippingAddress{
                @include shippingAddress('../../../../../');
            }
            .orderInfo{
                @include orderInfo('../../../../../');
                .title{
                    a{
                        padding-left: 0;
                        background-image: none;
                        i{
                            color: $main;
                        }
                    }
                }
                .main{
                    border-bottom: 0;
                    padding-bottom: 10px;
                }
            }
            .infoList{
                background-color: #fff;
                >li{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 $padding;
                    height: $height1;
                    line-height: $height1;
                    border-bottom: $border1;
                    &:last-of-type{
                        border-bottom: none;
                    }
                    span{
                        i{
                            color: $main;
                        }
                    }
                    em{
                        color: #999;
                    }
                    b{
                        color: $orange;
                    }
                    .yyd-checkSwitch{
                        background-color: $main;
                        border-color: $gray;
                    }
                }
            }
        }
    }
</style>