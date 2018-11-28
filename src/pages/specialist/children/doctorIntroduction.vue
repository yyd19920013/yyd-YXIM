<template>
    <div class="doctorIntroduction">
        <header1
            title=""
        />

        <section class="content">
            <div class="doctorInfo">
                <div class="basic">
                    <a>
                        <div
                            class="portrait"
                            :style="{
                                backgroundImage:doctorInfo.avatarFileId?'url('+getImgUrl()+doctorInfo.avatarFileId+')':'',
                            }"
                        ></div>
                        <div class="rightContent">
                            <h3>
                                <span>{{doctorInfo.doctorName}}</span>
                                <em>{{doctorInfo.doctorLevelText}}</em>
                            </h3>
                            <h4>
                                <span>{{doctorInfo.orgFullName}}</span>
                                <em>{{doctorInfo.deptName}}</em>
                            </h4>
                        </div>
                    </a>
                </div>
            </div>

            <div class="introduction fullColor">
                <ul>
                    <li>
                        <div class="title">
                            执业点
                        </div>
                        <div class="main">
                            {{doctorInfo.orgFullName}}
                        </div>
                    </li>
                    <li>
                        <div class="title">
                            擅长
                        </div>
                        <div class="main">
                            {{doctorInfo.speciality}}
                        </div>
                    </li>
                    <li>
                        <div class="title">
                            简介
                        </div>
                        <div class="main">
                            {{doctorInfo.introduce}}
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    </div>
</template>

<script>
    import {getDoctorInfo} from 'services';
    import {getImgUrl} from 'js/yydjs';

    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
                doctorInfo:{},
                getImgUrl,
            }
        },

        mounted(){
            //获取医生详情
            this.getDoctorInfoFn();
        },

        methods:{
            getDoctorInfoFn(){
                getDoctorInfo([this.query.id],(res)=>{
                    this.doctorInfo=res.body;
                });
            },
        },

        components:{

        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .doctorIntroduction{
        .content{
            .doctorInfo{
                @include doctorInfo;
            }
            .introduction{
                padding-left: 45px;
                background-color: #fff;
                ul{
                    padding-top: 30px;
                    padding-right: $padding;
                    border-left: 1px solid #99D6FF;
                    li{
                        padding-bottom: 30px;
                        padding-left: 25px;
                        .title{
                            line-height: 30xp;
                            font-size: 16px;
                            position: relative;
                            &:before{
                                content: "";
                                width: 20px;
                                height: 20px;
                                background-color: $main;
                                border: 5px solid #addeff;
                                border-radius: 50%;
                                position: absolute;
                                left: -25px;
                                top: 50%;
                                transform: translate3d(-50%,-50%,0);
                            }
                        }
                        .main{
                            font-size: 12px;
                            color: #999;
                        }
                    }
                }
            }
        }
    }
</style>
