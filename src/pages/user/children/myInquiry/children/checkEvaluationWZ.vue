<template>
    <div class="checkEvaluationWZ">
        <header1
            title="评价详情"
        />

        <section class="content">
            <div class="evaluationWrap fullColor">
                <div class="personInfo">
                    <div
                        class="portrait"
                        :style="{
                            backgroundImage:query.doctorAvatar?'url('+getImgUrl()+query.doctorAvatar+')':'',
                        }"
                    ></div>
                    <h3>{{evaluationDetail.doctorName}}</h3>
                </div>
                <div class="title">
                    我对医生的评价
                </div>
                <div class="starWrap">
                    <i
                        v-for="(item,index) in 5"
                        :class="{
                            iconfont:true,
                            'icon-ic_star':true,
                            active:index<evaluationDetail.score,
                        }"
                    ></i>
                </div>
                <div
                    v-if="evaluationDetail.tagsContext&&evaluationDetail.tagsContext.length"
                    class="labelWrap"
                >
                    <span
                        v-for="(item,index) in evaluationDetail.tagsContext"
                        class="active"
                    >
                        <em>{{item}}</em>
                    </span>
                </div>
                <div class="description">
                    {{evaluationDetail.content}}
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import {getImgUrl} from 'js/yydjs';
    import {getByOrderDetailId} from 'services';

    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
                evaluationDetail:{},
                getImgUrl,
            }
        },

        mounted(){
            //获取评论详情
            this.getEvaluationDetail();
        },

        methods:{
            getEvaluationDetail(){
                getByOrderDetailId([this.query.orderDetailId],(res)=>{
                    this.evaluationDetail=res.body;
                });
            },
        },

        components:{

        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .checkEvaluationWZ{
        .content{
            .evaluationWrap{
                text-align: center;
                background-color: #fff;
                outline-color: #fff;
                .personInfo{
                    padding-top: 30px;
                    .portrait{
                        display: inline-block;
                        @include portrait('../../../../../');
                    }
                    h3{
                        line-height: 30px;
                        font-size: 16px;
                    }
                }
                .title{
                    padding: 10px 0;
                    line-height: 30px;
                    color: #999;
                }
                .starWrap{
                    padding-bottom: 20px;
                    i{
                        margin: 0 10px;
                        font-size: 20px;
                        color: $gray;
                        &.active{
                            color: $orange;
                        }
                    }
                }
                .labelWrap{
                    @include selectLabel1;
                    padding: 0 10px;
                    padding-bottom: 10px;
                }
                .description{
                    padding: 0 $padding;
                    text-align: center;
                    line-height: 24px;
                    color: #666;
                }
            }
        }
    }
</style>