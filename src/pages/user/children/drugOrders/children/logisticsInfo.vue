<template>
    <div class="logisticsInfo">
        <header1
            title="物流信息"
        />

        <section class="content">
            <ul class="basicInfo">
                <li>
                    <span>订单编号</span>
                    <em>20180816121212123</em>
                </li>
                <li>
                    <span>快递配送</span>
                    <em>申通快递</em>
                </li>
                <li>
                    <span>快递单号</span>
                    <b>33129084759505</b>
                </li>
            </ul>

            <ul class="basicInfo">
                <li>
                    <span>发货时间</span>
                    <em>2018-08-15 12:12:15</em>
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

    .logisticsInfo{
        .content{
            .basicInfo{
                padding: 12px 0;
                margin-bottom: 10px;
                background-color: #fff;
                >li{
                    padding: 0 $padding;
                    line-height: 30px;
                    span{
                        padding-right: 10px;
                        color: #999;
                    }
                    b{
                        color: $main;
                    }
                }
            }
        }
    }
</style>