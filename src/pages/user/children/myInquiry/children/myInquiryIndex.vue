<template>
    <div class="myInquiryIndex">
        <header1
            title=""
        >
            <div
                slot="title"
                :class="{
                    selectTitle:true,
                    active:showSelectTitle,
                }"
            >
                <span
                    v-show="totalList[cIndex]"
                    @click="showSelectTitle=!showSelectTitle"
                >
                    {{totalList[cIndex]&&totalList[cIndex].itemTitle}}({{totalList[cIndex]&&totalList[cIndex].itemCount}})
                    <i class="iconfont icon-zelvxuanzefeiyongdaosanjiaoxingfandui"></i>
                </span>
                <div
                    :class="{
                        mask:true,
                        active:showSelectTitle,
                    }"
                    :style="{
                        top:(44+statusBarHeight) + 'px',
                    }"
                    @click="maskClose($event)"
                >
                    <ol ref="maskOl">
                        <li
                            v-for="(item,index) in totalList"
                            :class="{
                                active:cIndex==index,
                            }"
                            @click="selectTitleFn(item,index)"
                        >
                            {{item.itemTitle}}({{item.itemCount}})
                        </li>
                    </ol>
                </div>
            </div>
        </header1>

        <section
            v-if="onOff"
            class="content"
        >
            <transition-group
                tag="ul"
                name="list1"
                class="inquiryList"
            >
                <li
                    v-for="(item,index) in inquiryList"
                    :key="(`inquiryList${index}`)"
                >
                    <a
                        @click="toDetail(item,index)"
                    >
                        <div class="title">
                            <div class="left">
                                <div
                                    class="portrait"
                                    :style="{
                                        backgroundImage:item.doctorAvatar?'url('+getImgUrl()+item.doctorAvatar+')':'',
                                    }"
                                ></div>
                                <span>{{item.doctorName}}</span>
                                <em>{{item.deptName}}</em>
                            </div>
                            <div
                                class="right"
                                :style="{
                                    color:statusJson[item.conStatus]?statusJson[item.conStatus].color:'#333',
                                }"
                            >
                                {{statusJson[item.conStatus]?statusJson[item.conStatus].text:''}}
                            </div>
                        </div>
                        <div class="main">
                            <div class="description multiLine">
                                <span>{{item.patientMember.name}} </span>
                                <span>{{item.patientMember.sex==1?'男':'女'}} </span>
                                <span>{{item.patientMember.age}}岁 </span>
                                <span>
                                    基本健康信息：
                                    {{!item.medicalAllergy&&!item.foodAllergy&&!item.familyDiseaseHistory&&!item.operationOrTrauma?'暂无':''}}
                                </span>
                                <span v-if="item.medicalAllergy">药物过敏，{{item.medicalAllergy}}；</span>
                                <span v-if="item.foodAllergy">食物/接触物过敏，{{item.foodAllergy}}；</span>
                                <span v-if="item.familyDiseaseHistory">家族病史，{{item.familyDiseaseHistory}}；</span>
                                <span v-if="item.operationOrTrauma">手术或外伤，{{item.operationOrTrauma}}；</span>
                            </div>
                        </div>
                    </a>
                    <div class="end">
                        <div class="left">
                            <i :class="item.itemCode=='01'?'tu':'shi'"></i>
                            <span>{{item.createAt|date('yyyy-MM-dd hh:mm')}}</span>
                        </div>
                        <div class="right">
                            <a
                                v-show="item.conStatus==11"
                                class="pay"
                                @click="toPay(item,index)"
                            >
                                去支付
                            </a>
                            <!-- <a
                                v-show="item.conStatus==11"
                                class="cancel"
                                @click="cancelOrder(item,index)"
                            >
                                取消订单
                            </a> -->
                            <a
                                v-show="item.conStatus==53&&item.commentStatus==0"
                                class="toEvaluation"
                                @click="toEvaluation(item,index)"
                            >
                                去评价
                            </a>
                            <a
                                v-show="item.conStatus==53&&item.commentStatus>0"
                                class="evaluated"
                                @click="evaluated(item,index)"
                            >
                                已评价
                            </a>
                        </div>
                    </div>
                </li>
            </transition-group>

            <defaultImage
                :show="showDefaultImage"
            />

            <loadMore
                :parent="this"
                :dataListName="'inquiryList'"
                :api="askListPage"
                :params="params"
                :getListFromRes="getListFromRes"
                :firstLoad="firstLoadFn"
            />
        </section>
    </div>
</template>

<script>
    import loadMore from 'components/common/loadMore';
    import defaultImage from 'components/common/defaultImage';
    import vm from 'src/main';
    import {getImgUrl,alerts,lStore,nativeApi} from 'js/yydjs';
    import {askListPage,itemAndCount,cancelConsultOrder} from 'services';

    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
                statusJson:this.dictionaries.statusJson,
                onOff:true,
                showSelectTitle:false,
                inquiryList:[],
                params:[{
                    "userId":'',
                    "tenantId":'',
                    "itemCode":'',
                    "pageNo":1,
                    "pageSize":10,
                }],
                totalList:[],
                cIndex:0,
                showDefaultImage:false,
                askListPage,
                getImgUrl,
            }
        },

        watch:{
            inquiryList(newValue,oldValue){
                for(let i=0;i<newValue.length;i++){
                    if(!newValue[i].patientMember)newValue[i].patientMember={};

                    newValue[i].medicalAllergy=this.getHealthinfoName(newValue[i],'medicalAllergy');
                    newValue[i].foodAllergy=this.getHealthinfoName(newValue[i],'foodAllergy');
                    newValue[i].familyDiseaseHistory=this.getHealthinfoName(newValue[i],'familyDiseaseHistory');
                    newValue[i].operationOrTrauma=this.getHealthinfoName(newValue[i],'operationOrTrauma');
                }
            },
        },

        created(){
            //更新字典
            vm.$on('dictionariesFinished',(dictionaries)=>{
                this.statusJson=dictionaries.statusJson;
            });
        },

        mounted(){
            //获取问诊类型及类型下问诊数量
            this.getTotalList();
        },

        beforeDestroy(){
            vm.$off('dictionariesFinished');
        },

        methods:{
            getListFromRes(res){
                return res.body.data;
            },
            firstLoadFn(res){
                if(this.inquiryList&&this.inquiryList.length==0){
                    this.showDefaultImage=true;
                }
            },
            getHealthinfoName(item,key){
                let str='';

                if(item.healthinfo){
                    let keyValue=item.healthinfo[key];

                    if(keyValue){
                        str+=keyValue.split('|').join('、');
                    }
                }
                return str;
            },
            getTotalList(){
                itemAndCount([],(res)=>{
                    this.totalList=res.body;
                });
            },
            toDetail(item,index){
                let {orderDetailId,itemCode,conStatus}=item;

                nativeApi.toOrderDetail(this,orderDetailId,itemCode,conStatus);
            },
            selectTitleFn(item,index){
                this.cIndex=index;
                this.showSelectTitle=false;
                this.params[0].pageNo=1;
                this.params[0].itemCode=item.itemCode;
                this.inquiryList=[];
                this.onOff=false;
                setTimeout(()=>{
                    this.onOff=true;
                },300);
            },
            maskClose(ev){
                if(!this.$refs.maskOl.contains(ev.target)){
                    this.showSelectTitle=false;
                }
            },
            toPay(item,index){
                let {orderDetailId,itemCode}=item;

                this.$router.push({
                    path:'/payment',
                    query:{
                        orderDetailId,
                        goodsCode:itemCode,
                    },
                });
            },
            cancelOrder(item,index){
                cancelConsultOrder([item.orderNo],(res)=>{
                    alerts('取消订单成功');
                    this.getInquiryList();
                });
            },
            toEvaluation(item,index){
                let {doctorId,doctorName,orderDetailId,itemCode,doctorOnlineExtraId,orgId,doctorAvatar}=item;

                this.$router.push({
                    path:'/user/myInquiry/toEvaluationWZ',
                    query:{
                        doctorId, // 医生id
                        doctorName, // 医生姓名
                        orderDetailId, // 问诊订单id
                        itemCode, // 问诊项code，01 图文问诊 02 视频问诊 02 基层会诊
                        doctorOnlineExtraId, // 在线问诊医生id
                        orgId, // 机构id
                        doctorAvatar,// 头像id
                    },
                });
            },
            evaluated(item,index){
                let {orderDetailId,doctorAvatar}=item;

                this.$router.push({
                    path:'/user/myInquiry/checkEvaluationWZ',
                    query:{
                        orderDetailId,
                        doctorAvatar,
                    },
                });
            },
        },

        components:{
            defaultImage,
            loadMore,
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .myInquiryIndex{
        .selectTitle{
            text-align: center;
            position: relative;
            span{
                display: inline-block;
                font-size: 16px;
                color: #fff;
                i{
                    display: inline-block;
                    margin: 0 5px;
                    font-size: 12px;
                    transition: transform .3s linear;
                    -webkit-transition: -webkit-transform .3s linear;
                }
            }
            &.active{
                span{
                    i{
                        transform: rotate3d(0,0,1,-180deg);
                    }
                }
            }
            .mask{
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,.6);
                position: fixed;
                left: 0;
                top: $height1;
                z-index: 1000;
                display: none;
                &.active{
                    display: block;
                }
                >ol{
                    background-color: #fff;
                    >li{
                        height: $height1;
                        line-height: $height1;
                        border-bottom: $border1;
                        text-align: center;
                        &:last-of-type{
                            border-bottom: none;
                        }
                        &.active{
                            color: $main;
                        }
                    }
                }
            }
        }

        .content{
            .inquiryList{
                >li{
                    background-color: #fff;
                    margin-bottom: 10px;
                    &:last-of-type{
                        margin-bottom: 0;
                    }
                    .title{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 10px $padding;
                        line-height: 40px;
                        .left{
                            display: flex;
                            .portrait{
                                width: 40px;
                                margin-right: 10px;
                                height: 40px;
                                border: $border1;
                                border-radius: 50%;
                                background: url('../../../../../images/portrait.png') no-repeat center center;
                                background-size: cover;
                            }
                            span{
                                margin-right: 10px;
                            }
                            em{
                                color: #999;
                            }
                        }
                        .right{

                        }
                    }
                    .main{
                        padding: $padding;
                        padding-top: 0;
                        border-bottom: $border1;
                        .description{
                            padding: 5px $padding;
                            background-color: $bg;
                            border-radius: 5px;
                            word-break: break-all;
                        }
                    }
                    .end{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding-left: $padding;
                        .left{
                            display: flex;
                            color: #999;
                            i{
                                @include tuAndShi('../../../../../');
                                margin-right: 5px;
                            }
                        }
                        .right{
                            @include handWrap;
                        }
                    }
                }
            }
        }
    }
</style>