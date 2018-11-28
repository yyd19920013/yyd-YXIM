<template>
    <div class="toEvaluationWZ">
        <header1
            title="发表评价"
            :right="{
                text:'提交',
                click:submit,
            }"
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
                    <h3>{{query.doctorName}}</h3>
                </div>
                <div class="title">
                    为医生的服务打分
                </div>
                <div class="starWrap">
                    <i
                        v-for="(item,index) in 5"
                        :class="{
                            iconfont:true,
                            'icon-ic_star':true,
                            active:index<params[0].score,
                        }"
                        @click="params[0].score=index+1"
                    ></i>
                </div>
                <div class="labelWrap">
                    <span
                        v-for="(item,index) in commentTagCode"
                        :class="{
                            active:selectedArr.indexOf(item.key)!=-1,
                        }"
                    >
                        <em>
                            {{item.text}}
                            <label
                                :for="createId(index)"
                                class="labelFor"
                            >
                                <input v-model="selectedArr" :value="item.key" type="checkbox" :id="createId(index)" />
                            </label>
                        </em>
                    </span>
                </div>
                <div class="textareaWrap">
                    <textarea v-model="params[0].content" placeholder="对医生还有什么想说的？" maxlength="200"></textarea>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import vm from 'src/main';
    import {getImgUrl,alerts,lStore,nativeApi} from 'js/yydjs';
    import {addComment} from 'services';

    export default{
        data(){
            let query=this.$router.currentRoute.query;
            let {doctorId,doctorName,orderDetailId,itemCode,doctorOnlineExtraId,orgId}=query;

            return{
                query:this.$router.currentRoute.query,
                params:[{
                    doctorId, // 医生id
                    doctorName, // 医生姓名
                    orderDetailId, // 问诊订单id
                    itemCode, // 问诊项code，01 图文问诊 02 视频问诊 02 基层会诊
                    doctorOnlineExtraId, // 在线问诊医生id
                    orgId, // 机构id
                    score:5, // 评分
                    tagCodes:'', // 评价标签代码，多个逗号隔开
                    content:'', // 评价内容
                }],
                selectedArr:[],
                commentTagCode:this.dictionaries.commentTagCode,
                getImgUrl,
            }
        },

        created(){
            //更新字典
            vm.$on('dictionariesFinished',(dictionaries)=>{
                this.commentTagCode=dictionaries.commentTagCode;
            });
        },

        mounted(){

        },

        beforeDestroy(){
            vm.$off('dictionariesFinished');
        },

        methods:{
            submit(){
                let {orderDetailId,doctorAvatar}=this.query;

                this.params[0].tagCodes=this.selectedArr.join(',');
                addComment(this.params,(res)=>{
                    alerts('评价成功');
                    nativeApi.toEvaluation(this,orderDetailId);
                    this.$router.replace({
                        path:'/user/myInquiry/checkEvaluationWZ',
                        query:{
                            orderDetailId:orderDetailId,
                            doctorAvatar:doctorAvatar,
                        },
                    });
                });
            },
            createId(index){
                return `toEvaluationWZ${index}`;
            },
        },

        components:{

        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .toEvaluationWZ{
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
                .textareaWrap{
                    padding: 0 $padding;
                    textarea{
                        width: 100%;
                        padding: 10px;
                        height: 100px;
                        line-height: 20px;
                    }
                }
            }
        }
    }
</style>