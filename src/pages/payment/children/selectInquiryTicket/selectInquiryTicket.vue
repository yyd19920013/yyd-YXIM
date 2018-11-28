<template>
    <div class="selectInquiryTicket">
        <header1
            title="我的问诊券"
            :right="{
                text:'兑换',
                click:exchange,
            }"
        />

        <section class="content">
            <pathTab
                :tabList="[
                    {
                        text:`可用问诊券(${totalDetail.enable})`,
                        path:'/payment/selectInquiryTicket',
                        query,
                    },
                    {
                        text:`不可用问诊券(${totalDetail.disable})`,
                        path:'/payment/selectInquiryTicket/disableInquiryTicket',
                        query,
                    },
                ]"
            />

            <transition name="router-fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </section>
    </div>
</template>

<script>
    import pathTab from 'components/common/pathTab';
    import vm from 'src/main';
    import {getVoucherCount} from 'services';

    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
                totalDetail:{
                    enable:0,
                    disable:0,
                },
            }
        },

        created(){
            vm.$on('refreshTotalDetail',this.getTotalDetail);
        },

        mounted(){
            //获取问诊券统计
            this.getTotalDetail();
        },

        beforeDestroy(){
            vm.$off('refreshTotalDetail');
        },

        methods:{
            exchange(){
                vm.$emit('goExchange');
            },
            getTotalDetail(){
                getVoucherCount([this.query.goodsCode],(res)=>{
                    this.totalDetail=res.body;
                });
            },
        },

        components:{
            pathTab,
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .selectInquiryTicket{

    }
</style>