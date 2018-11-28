<template>
    <div class="selectInquiryTicket">
        <header1
            title="我的问诊劵"
            :right="{
                text:'兑换',
                click:exchange,
            }"
        />

        <section class="content">
            <pathTab
                :tabList="[
                    {
                        text:'可用',
                        path:'/user/myInquiryTicket',
                    },
                    {
                        text:'使用记录',
                        path:'/user/myInquiryTicket/usageRecord',
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

    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
            }
        },

        mounted(){

        },

        methods:{
            exchange(){
                vm.$emit('goExchange');
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