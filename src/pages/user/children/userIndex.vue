<template>
    <div class="userIndex">
        <header1
            title="我的订单"
        />

        <section class="content">
            <div class="navList">
                <router-link to="/user/myInquiry">
                    <span>我的问诊</span>
                    <i class="iconfont icon-jiantou"></i>
                </router-link>
                <router-link style="display:none;" to="/user/drugOrders">
                    <span>药品订单</span>
                    <i class="iconfont icon-jiantou"></i>
                </router-link>
                <router-link to="/user/myInquiryTicket">
                    <span>我的问诊劵</span>
                    <i class="iconfont icon-jiantou"></i>
                </router-link>
            </div>
        </section>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
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

    .userIndex{
        .content{
            .navList{
                padding: 0 $padding;
                padding-top: $padding;
                >a{
                    display: flex;
                    justify-content: space-between;
                    height: 80px;
                    line-height: 78px;
                    padding-left: 90px;
                    padding-right: $padding;
                    margin-bottom: 10px;
                    background: #fff url('../../../images/icon/img_myorder_inquiry.png') no-repeat left center;
                    background-size: auto 100%;
                    border: $border1;
                    border-radius: 5px;
                    &:nth-of-type(2){
                        background-image: url('../../../images/icon/img_myorder_order.png');
                    }
                    &:nth-of-type(3){
                        background-image: url('../../../images/icon/img_myorder_ticket.png');
                    }
                    i{
                        font-size: 20px;
                        color: #999;
                    }
                }
            }
        }
    }
</style>