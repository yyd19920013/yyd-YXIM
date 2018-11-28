<template>
    <div class="myInquiryDetail">
        <header1
            :title="`${inquiryDetail.doctorName?inquiryDetail.doctorName:''}医生`"
        />

        <section class="content">
            <div class="hint">
                <div class="hintWrap">
                    <span
                        :style="{
                            color:getDictionaries('color','#333'),
                        }"
                    >
                        {{getDictionaries('text')}}
                    </span>
                    <em v-show="countDown>0">
                        <b>{{countDown|fSecond('minute')}}分{{countDown|fSecond}}秒</b>
                        内未支付，问诊自动取消
                    </em>
                    <em v-if="inquiryDetail.conStatus==12">你已取消问诊</em>
                    <em v-if="inquiryDetail.conStatus==15">问诊超时未支付</em>
                    <em v-if="inquiryDetail.conStatus==45">你已取消问诊，费用将在3个工作日内退还</em>
                </div>
                <div class="detail">
                    <div class="dateTime">
                        <span>{{inquiryDetail.createAt|date('yyyy-MM-dd hh:mm')}}</span>
                    </div>
                    <div class="basicInfoWrap">
                        <div class="basicInfo">
                            <h3>{{inquiryDetail.patientMember.name}} {{inquiryDetail.patientMember.sex==1?'男':'女'}} {{inquiryDetail.patientMember.age}}岁</h3>
                            <h3>
                                基本健康信息：
                                {{!inquiryDetail.medicalAllergy&&!inquiryDetail.foodAllergy&&!inquiryDetail.familyDiseaseHistory&&!inquiryDetail.operationOrTrauma?'暂无':''}}
                            </h3>
                            <h3 v-if="inquiryDetail.medicalAllergy">药物过敏，{{getHealthinfoName('medicalAllergy')}}；</h3>
                            <h3 v-if="inquiryDetail.foodAllergy">食物/接触物过敏，{{getHealthinfoName('foodAllergy')}}；</h3>
                            <h3 v-if="inquiryDetail.familyDiseaseHistory">家族病史，{{getHealthinfoName('familyDiseaseHistory')}}；</h3>
                            <h3 v-if="inquiryDetail.operationOrTrauma">手术或外伤，{{getHealthinfoName('operationOrTrauma')}}；</h3>
                        </div>
                    </div>

                    <div
                        v-if="inquiryDetail.conStatus==12||inquiryDetail.conStatus==15||inquiryDetail.conStatus==45"
                        class="cancelInquiry"
                    >
                        <div class="dateTime">
                            <span>{{inquiryDetail.cancelTime|date('yyyy-MM-dd hh:mm')}}</span>
                        </div>
                        <div class="text">
                            <em></em>
                            <span>问诊已取消</span>
                            <em></em>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <footer2
            :text="`${inquiryDetail.itemCodeText}：`"
            :price="+inquiryDetail.orderAmount||0"
            :button="{
                text:getDictionaries('btText'),
                style:{
                    backgroundColor:getDictionaries('btBg'),
                },
                click:toPay,
            }"
        />
    </div>
</template>

<script>
    import vm from 'src/main';
    import {normalDate} from 'js/yydjs';
    import {askDetail} from 'services';

    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
                inquiryDetail:{
                    patientMember:{},
                    healthinfo:{},
                },
                statusJson:this.dictionaries.statusJson,
                countDown:0,
                timer:null,
            }
        },

        watch:{
            inquiryDetail(newValue,oldValue){
                newValue.medicalAllergy=this.getHealthinfoName('medicalAllergy');
                newValue.foodAllergy=this.getHealthinfoName('foodAllergy');
                newValue.familyDiseaseHistory=this.getHealthinfoName('familyDiseaseHistory');
                newValue.operationOrTrauma=this.getHealthinfoName('operationOrTrauma');
            },
        },

        created(){
            //更新字典
            vm.$on('dictionariesFinished',(dictionaries)=>{
                this.statusJson=dictionaries.statusJson;
            });
        },

        mounted(){
            //获取我的问诊订单详情
            this.getInquiryDetail();
        },

        beforeDestroy(){
            clearInterval(this.timer);
            vm.$off('dictionariesFinished');
        },

        methods:{
            getHealthinfoName(key){
                let {healthinfo}=this.inquiryDetail;
                let str='';

                if(healthinfo){
                    let keyValue=healthinfo[key];

                    if(keyValue){
                        str+=keyValue.split('|').join('、');
                    }
                }
                return str;
            },
            getDictionaries(key,defaultValue=''){
                return this.statusJson&&this.inquiryDetail.conStatus?this.statusJson[this.inquiryDetail.conStatus][key]:defaultValue;
            },
            getTimeDiff(){
                let timeDiff=Math.ceil((normalDate(this.inquiryDetail.serverTime)-normalDate(this.inquiryDetail.createAt))/1000);

                timeDiff=15*60-(timeDiff<0?0:timeDiff);
                return timeDiff;
            },
            getInquiryDetail(){
                askDetail([this.query.orderDetailId],(res)=>{
                    if(!res.body.patientMember){
                        res.body.patientMember={};
                    }
                    if(!res.body.healthinfo){
                        res.body.healthinfo={};
                    }
                    this.inquiryDetail=res.body;

                    let timeDiff=this.getTimeDiff();

                    if(res.body.conStatus==11){
                        this.countDownFn(timeDiff);
                    }
                });
            },
            countDownFn(timeDiff){
                if(timeDiff<=0){
                    return;
                }
                this.countDown=timeDiff;
                clearInterval(this.timer);
                this.timer=setInterval(()=>{
                    this.countDown--;
                    if(this.countDown<=0){
                        clearInterval(this.timer);
                        this.inquiryDetail.conStatus=15;
                    }
                },1000);
            },
            toPay(){
                let {orderDetailId,itemCode,conStatus}=this.inquiryDetail;

                switch(+conStatus){
                    case 11:
                            this.$router.push({
                                path:'/payment',
                                query:{
                                    orderDetailId,
                                    goodsCode:itemCode,
                                },
                            });
                        break;
                    case 15:
                            this.$router.push({
                                path:'/specialist',
                                query:{
                                    id:this.inquiryDetail.doctorOnlineExtraId,
                                },
                            });
                        break;
                }
            },
        },

        components:{

        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .myInquiryDetail{
        .content{
            .hint{
                .hintWrap{
                    display: flex;
                    justify-content: space-between;
                    padding: 0 $padding;
                    height: $height1;
                    line-height: $height1;
                    background-color: #fff;
                    span{

                    }
                    em{
                        b{
                            color: $orange;
                        }
                    }
                }
            }
            .detail{
                padding: 20px $padding;
                padding-top: 0;
                .dateTime{
                    padding: 20px 0;
                    text-align: center;
                    span{
                        display: inline-block;
                        padding: 0 10px;
                        height: 20px;
                        line-height: 20px;
                        background-color: rgba(0,0,0,.1);
                        color: #fff;
                        border-radius: 10px;
                        font-size: 12px;
                    }
                }
                .basicInfoWrap{
                    overflow: hidden;
                    padding-left: 30%;
                    padding-bottom: 10px;
                    .basicInfo{
                        float: right;
                        padding: 10px;
                        line-height: 24px;
                        background-color: $main;
                        color: #fff;
                        border-radius: 10px;
                        word-break: break-all;
                        position: relative;
                        &:before{
                            content: "";
                            border: 10px solid transparent;
                            border-top: 15px solid $main;
                            position: absolute;
                            top: 10px;
                            right: -10px;
                        }
                    }
                }
                .cancelInquiry{
                    .text{
                        display: flex;
                        span{
                            padding: 0 $padding;
                            text-align: center;
                            color: #999;
                            font-size: 12px;
                        }
                        em{
                            flex: 1;
                            position: relative;
                            &:before{
                                content: "";
                                width: 100%;
                                height: 1px;
                                background-color: #999;
                                position: absolute;
                                top: 50%;
                            }
                        }
                    }
                }
            }
        }
    }
</style>