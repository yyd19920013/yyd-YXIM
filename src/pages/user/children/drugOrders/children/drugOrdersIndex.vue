<template>
    <div class="drugOrdersIndex">
        <header1
            title="药品订单"
        />

        <section class="content">
            <ul class="orderList">
                <li v-for="(item,index) in orderList">
                    <div class="title">
                        <span>晞景儿科互联网医院合作药房</span>
                        <em>待付款</em>
                    </div>
                    <a
                        class="main"
                        @click="$router.push({path:'/user/drugOrders/drugOrdersDetail'})"
                    >
                        <ul class="drugList">
                            <li v-for="(item1,index1) in 2">
                                <span>甲钴胺片 0.5mg*20s</span>
                                <em>x1</em>
                            </li>
                        </ul>
                        <div class="count">
                            共2件药品 需付款：￥63.00
                        </div>
                    </a>
                    <div class="end">
                        <a class="pay">去支付</a>
                        <a class="delete">删除订单</a>
                        <a class="confirm">确认收货</a>
                        <a class="checkLogistics">查看物流</a>
                        <a
                            class="checkEvaluation"
                            @click="$router.push({path:'/user/drugOrders/checkEvaluation'})"
                        >
                            查看评价
                        </a>
                        <a
                            class="toEvaluation"
                            @click="$router.push({path:'/user/drugOrders/toEvaluation'})"
                        >
                            去评价
                        </a>
                    </div>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
                orderList:[1,2,3],
            }
        },

        mounted(){

        },

        methods:{

        },

        components:{

        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .drugOrdersIndex{
        .content{
            .orderList{
                >li{
                    background-color: #fff;
                    margin-bottom: 10px;
                    .title{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 12px $padding;
                        line-height: 20px;
                        span{
                            flex: 1;
                            padding-right: $padding;
                        }
                        em{
                            color: $orange;
                            &.active{
                                color: $main;
                            }
                        }
                    }
                    .main{
                        .drugList{
                            padding: 0 $padding;
                            >li{
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: $padding;
                                line-height: 20px;
                                background-color: $bg;
                                border-radius: 5px;
                                margin-bottom: 5px;
                                &:last-of-type{
                                    margin-bottom: 0;
                                }
                                span{
                                    flex: 1;
                                    padding-right: $padding;
                                }
                            }
                        }
                        .count{
                            padding: 12px $padding;
                            line-height: 19px;
                            text-align: right;
                            border-bottom: $border1;
                        }
                    }
                    .end{
                        @include handWrap;
                    }
                }
            }
        }
    }
</style>