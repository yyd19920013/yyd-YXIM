<template>
    <div class="toEvaluation">
        <header1
            title="发表评价"
            :right="{
                text:'提交',
                click:submit,
            }"
        />

        <section class="content">
            <div class="evaluationWrap fullColor">
                <div class="title">
                    请对本次服务评价
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
                <textarea placeholder="本次服务你还有什么想说的吗？请评价我们的服务，促进我们提升服务质量"></textarea>
            </div>
        </section>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
                count:0,
            }
        },

        mounted(){

        },

        methods:{
            submit(){
                console.log('提交');
            },
        },

        components:{

        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .toEvaluation{
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
                textarea{
                    width: 100%;
                    padding: 10px;
                    height: 100px;
                    line-height: 20px;
                }
            }
        }
    }
</style>