<template>
    <div class="checkEvaluation">
        <header1
            title="评价详情"
        />

        <section class="content">
            <div class="evaluationWrap fullColor">
                <div class="title">
                    您对本次服务评价
                </div>
                <div class="starWrap">
                    <i
                        v-for="(item,index) in 5"
                        :class="{
                            iconfont:true,
                            'icon-ic_star':true,
                            active:index<count,
                        }"
                        @click="count=index+1"
                    ></i>
                </div>
                <div class="description">
                    周到，差劲，热情，细心良好，热情周到，亲切，亲力亲为，格尽职守
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
                count:5,
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

    .checkEvaluation{
        .content{
            .evaluationWrap{
                padding: $padding;
                text-align: center;
                background-color: #fafafa;
                outline-color: #fafafa;
                .title{
                    font-size: 16px;
                    padding: 10px 0;
                    line-height: 30px;
                }
                .starWrap{
                    padding-bottom: 30px;
                    i{
                        margin: 0 10px;
                        font-size: 20px;
                        color: $gray;
                        &.active{
                            color: $orange;
                        }
                    }
                }
                .description{
                    line-height: 24px;
                }
            }
        }
    }
</style>