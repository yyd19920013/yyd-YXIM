<template>
    <div class="specialistIndex">
        <header1
            title=""
        />

        <section class="content">
            <div class="doctorInfo">
                <div class="basic">
                    <router-link
                        :to="{
                            path:'/specialist/doctorIntroduction',
                            query:{
                                id:query.id,
                            },
                        }"
                    >
                        <div
                            class="portrait"
                            :style="{
                                backgroundImage:doctorInfo.avatarFileId?'url('+getImgUrl()+doctorInfo.avatarFileId+')':'',
                            }"
                        ></div>
                        <div class="rightContent">
                            <h3 class="multiLine">
                                <span>{{doctorInfo.doctorName}}</span>
                                <em>{{doctorInfo.doctorLevelText}}</em>
                            </h3>
                            <h4 class="multiLine">
                                <span>{{doctorInfo.orgFullName}}</span>
                                <em>{{doctorInfo.deptName}}</em>
                            </h4>
                            <i class="iconfont icon-jiantou"></i>
                        </div>
                    </router-link>
                </div>
                <ol class="count">
                    <li>
                        <h3>{{doctorInfo.consultNum?`${doctorInfo.consultNum}次`:'暂无'}}</h3>
                        <h4>问诊人次</h4>
                    </li>
                    <li>
                        <h3>{{doctorInfo.avgScore?`${doctorInfo.avgScore}分`:'暂无'}}</h3>
                        <h4>问诊评分</h4>
                    </li>
                </ol>
            </div>

            <div class="consult">
                <img :src="require('images/banner/banner1.png')" alt="图片" />
                <div class="mask">
                    <a @click="consultFn">
                        咨询医助
                    </a>
                </div>
            </div>

            <div class="inquiryServer">
                <div class="title">
                    <span>问诊服务</span>
                    <a
                        @click="showXDialog=true"
                    >须知</a>
                </div>

                <div class="main">
                    <a
                        v-if="doctorInfo.doctorOnlineJson['01']"
                        @click="scheduleHint(doctorInfo.doctorOnlineJson['01'].scheduleFlag,'/specialist/selectPerson',0)"
                        :class="{
                            active:!doctorInfo.doctorOnlineJson['01'].scheduleFlag,
                        }"
                    >
                        <img :src="require('images/icon/ic_wenzhen_img.png')" alt="图片" />
                        <div class="rightContent">
                            <h3>
                                <span>{{doctorInfo.doctorOnlineJson['01'].itemCodeText}}</span>
                                <em>{{doctorInfo.doctorOnlineJson['01'].price}}元/次</em>
                                <b>暂无排班</b>
                            </h3>
                            <h4>使用图文、语音与医生沟通</h4>
                        </div>
                    </a>
                    <a
                        v-if="doctorInfo.doctorOnlineJson['02']"
                        :class="{
                            active:!doctorInfo.doctorOnlineJson['02'].scheduleFlag,
                        }"
                        @click="scheduleHint(doctorInfo.doctorOnlineJson['02'].scheduleFlag,null,1)"
                    >
                        <img :src="require('images/icon/ic_wenzhen_video.png')" alt="图片" />
                        <div class="rightContent">
                            <h3>
                                <span>{{doctorInfo.doctorOnlineJson['02'].itemCodeText}}</span>
                                <em>{{doctorInfo.doctorOnlineJson['02'].price}}元/次</em>
                                <b>暂无排班</b>
                            </h3>
                            <h4>预约时间与医生进行视频问诊</h4>
                            <h5
                                v-if="appointmentList[cIndex1]"
                            >
                                <span>
                                    可预约时间：{{appointmentList[cIndex1].workDate|date('MM月dd日')}} {{appointmentList[cIndex1].workDate|week}} {{appointmentList[cIndex1].startTime|date('hh:mm')}}-{{appointmentList[cIndex1].endTime|date('hh:mm')}}
                                </span>
                            </h5>
                        </div>
                    </a>
                </div>
            </div>

            <div class="evaluationWrap">
                <router-link
                    :to="{
                        path:'/specialist/patientEvaluation',
                        query:{
                            id:this.params[0],
                            commentTotal:doctorInfo.commentTotal||0,
                        },
                    }"
                    class="title"
                >
                    <span>患者评价({{doctorInfo.commentTotal||0}})</span>
                    <i class="iconfont icon-jiantou"></i>
                </router-link>
                <div class="main">
                    <div
                        v-if="doctorInfo.commentTags&&doctorInfo.commentTags.length>0"
                        class="count"
                    >
                        <span v-for="(item,index) in doctorInfo.commentTags">
                            {{item.tagCodeText}}({{item.tagNum||0}})
                        </span>
                    </div>

                    <evaluationList
                        :api="getComments"
                        :params="params"
                    />
                </div>
            </div>
        </section>

        <div class="xDialogWrap">
            <x-dialog
                v-model="showXDialog"
                :hide-on-blur="false"
                :dialog-style="{backgroundColor:'transparent'}"
            >
                <div class="wrap">
                    <div class="title">
                        {{settingDetail.title}}
                    </div>
                    <div class="main">
                        {{settingDetail.value}}
                    </div>
                    <div
                        class="end"
                        @click="showXDialog=false;"
                    >
                        知道了
                    </div>
                </div>
            </x-dialog>
        </div>

        <popup v-model="showAppointment">
            <div class="appointmentWrap">
                <div class="title">
                    <a
                        @click="showAppointment=false"
                    >
                        取消
                    </a>
                    <h2>预约视频问诊开始时间</h2>
                </div>
                <div class="main">
                    <ul class="appointmentList">
                        <li
                            v-for="(item,index) in appointmentList"
                            @click="selectAppointment(item,index,1)"
                            :class="{
                                active:cIndex1==index,
                            }"
                        >
                            {{item.workDate|date('MM月dd日')}} {{item.workDate|week}} {{item.startTime|date('hh:mm')}}-{{item.endTime|date('hh:mm')}}
                        </li>
                    </ul>
                </div>
            </div>
        </popup>
    </div>
</template>

<script>
    import evaluationList from 'components/common/evaluationList';
    import {getOnlineConsultDoctorInfo,getDocScheduleList,getComments,getSetting} from 'services';
    import {XDialog,Popup} from 'src/VUX';
    import {getImgUrl,alerts,nativeApi} from 'js/yydjs';

    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
                showXDialog:false,
                params:[
                    this.$router.currentRoute.query.id,
                    1,
                    10,
                ],
                nextParams:{

                },
                doctorInfo:{
                    doctorOnlineItems:[],
                    doctorOnlineJson:{},
                    commentTags:[],
                },
                showAppointment:false,
                cIndex1:0,
                appointmentList:[],
                settingDetail:{},
                getImgUrl,
                getOnlineConsultDoctorInfo,
                getComments,
            }
        },

        mounted(){
            //获取医生信息
            this.getDoctorInfo();

            //获取预约时间列表
            this.getAppointmentList();

            //获取须知
            this.getSettingFn();
        },

        methods:{
            getDoctorInfo(){
                getOnlineConsultDoctorInfo(this.params,(res)=>{
                    let {doctorName,doctorId,orgId,deptId,id,doctorOnlineItems}=res.body;
                    let doctorInfo={};

                    this.nextParams.shopName=doctorName;
                    this.nextParams.shopId=doctorId;
                    this.nextParams.orgId=orgId;
                    this.nextParams.deptId=deptId;
                    this.nextParams.doctorOnlineExtraId=id;

                    doctorInfo=res.body;
                    doctorInfo.doctorOnlineJson={};

                    for(let item of doctorOnlineItems){
                        if(item.itemCode){
                            doctorInfo.doctorOnlineJson[item.itemCode]=item;
                        }
                    }

                    this.doctorInfo=doctorInfo;
                });
            },
            getAppointmentList(){
                getDocScheduleList([this.query.id],(res)=>{
                    this.appointmentList=res.body;
                });
            },
            getSettingFn(){
                getSetting(['04'],(res)=>{
                    this.settingDetail=res.body;
                });
            },
            consultFn(){
                this.$vux.confirm.show({
                    title:'提示',
                    content:'目前已开通电话助理，是否立即咨询？',
                    onConfirm(){
                        nativeApi.tel('010-84369221');
                    },
                });
            },
            scheduleHint(scheduleFlag,path,arrIndex){
                if(scheduleFlag){
                    if(arrIndex==0){
                        this.goSelectPerson(scheduleFlag,path,arrIndex);
                    }else{
                        this.showAppointment=true;
                    }
                }else{
                    alerts('暂无排班，无法进行问诊');
                }
            },
            selectAppointment(item,index,query){
                let {id,startTime,endTime}=item;

                this.nextParams.docScheduleId=id;
                this.nextParams.startTime=startTime;
                this.nextParams.endTime=endTime;

                this.cIndex1=index;
                this.showAppointment=false;

                setTimeout(()=>{
                    this.goSelectPerson(this.doctorInfo.doctorOnlineJson['02']&&this.doctorInfo.doctorOnlineJson['02'].scheduleFlag,'/specialist/selectPerson',query);
                });
            },
            goSelectPerson(scheduleFlag,path,arrIndex){
                let query=this.nextParams;
                let {id,itemCode,price,itemCodeText}=this.doctorInfo.doctorOnlineItems[arrIndex];

                query.goodsId=id;
                query.itemCode=itemCode;
                query.price=price;
                query.goodsName=itemCodeText;

                if(scheduleFlag){
                    this.$router.push({
                        path,
                        query,
                    });
                }
            },
        },

        components:{
            evaluationList,
            XDialog,
            Popup,
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .specialistIndex{
        .content{
            .doctorInfo{
                @include doctorInfo;
                .count{
                    display: flex;
                    padding: 10px 0;
                    height: 55px;
                    background-color: rgba(0,0,0,.1);
                    li{
                        flex: 1;
                        border-right: 1px solid #6db9ed;
                        text-align: center;
                        color: #fff;
                        &:last-of-type{
                            border-right-color: transparent;
                        }
                        h3{
                            line-height: 19px;
                            font-size: 16px;
                        }
                        h4{
                            line-height: 16px;
                            font-size: 12px;
                        }
                    }
                }
            }

            .consult{
                padding: 10px 0;
                position: relative;
                img{
                    width: 100%;
                }
                .mask{
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 10;
                    a{
                        width: 80px;
                        height: 30px;
                        line-height: 30px;
                        text-align: center;
                        background-color: $main;
                        color: #fff;
                        border-radius: 15px;
                        position: absolute;
                        right: $padding;
                        top: 50%;
                        margin-top: -15px;
                    }
                }
            }

            .inquiryServer{
                margin-bottom: 10px;
                background-color: #fff;
                .title{
                    display: flex;
                    justify-content: space-between;
                    padding: 0 $padding;
                    height: $height1;
                    line-height: $height1;
                    border-bottom: $border1;
                    span{
                        color: #999;
                    }
                    a{
                        color: $main;
                    }
                }
                .main{
                    margin-bottom: 10px;
                    >a{
                        display: flex;
                        padding: $padding;
                        border-bottom: $border1;
                        >img{
                            width: 50px;
                            height: 50px;
                        }
                        .rightContent{
                            flex: 1;
                            line-height: 25px;
                            padding-left: $padding;
                            h3{
                                display: flex;
                                justify-content: space-between;
                                font-size: 16px;
                                em{
                                    color: $orange;
                                }
                                b{
                                    color: #999;
                                    display: none;
                                }
                            }
                            h4{
                                font-size: 12px;
                                color: #999;
                            }
                            h5{
                                line-height: 25px;
                                span{
                                    padding: 0 5px;
                                    border: 1px solid $main;
                                    border-radius: 3px;
                                    color: $main;
                                    font-size: 12px;
                                }
                            }
                        }
                        &:last-of-type{
                            border-bottom: none;
                        }
                        &.active{
                            .rightContent{
                                h3{
                                    em{
                                        display: none;
                                    }
                                    b{
                                        display: inline-block;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            .evaluationWrap{
                width: 100%;
                background-color: #fff;
                .title{
                    display: flex;
                    justify-content: space-between;
                    padding: 0 $padding;
                    height: $height1;
                    line-height: $height1;
                    color: #999;
                    border-bottom: $border1;
                    i{
                        color: #ccc;
                    }
                }
                .main{
                    .count{
                        padding: $padding;
                        padding-bottom: 5px;
                        border-bottom: $border1;
                        overflow: hidden;
                        @include selectLabel;
                        span{
                            line-height: 28px;
                            border: $border1;
                        }
                    }


                }
            }
        }

        .xDialogWrap{
            .wrap{
                background-color: #fff;
                border-radius: 10px;
                .title{
                    padding: $padding;
                    line-height: 20px;
                    font-size: 20px;
                }
                .main{
                    text-align: left;
                    padding: $padding;
                    padding-top: 0;
                    line-height: 24px;
                    font-size: 12px;
                    color: #999;
                }
                .end{
                    height: 50px;
                    line-height: 49px;
                    border-top: $border1;
                    text-align: center;
                    color: $main;
                }
            }
        }

        .appointmentWrap{
            background-color: #fff;
            .title{
                padding: 0 50px;
                height: $height1;
                line-height: $height1;
                text-align: center;
                border-bottom: $border1;
                position: relative;
                a{
                    width: 50px;
                    height: 100%;
                    padding-left: $padding;
                    color: #999;
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 10;
                }
                h2{

                }
            }
            .main{
                .appointmentList{
                    padding: 20px 30px;
                    >li{
                        margin-bottom: 20px;
                        height: 30px;
                        line-height: 28px;
                        text-align: center;
                        border: $border1;
                        border-radius: 15px;
                        background-color: $bg;
                        color: #666;
                        &:last-of-type{
                            margin-bottom: 0;
                        }
                        &.active{
                            border-color: $main;
                            background-color: $lightBlue;
                            color: $main;
                        }
                    }
                }
            }
        }
    }
</style>
