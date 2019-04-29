<template>
    <div class="home">
        <header1
            title="晞景儿科互联网医院"
        />

        <pullDown
            :parent="this"
            :refName="'content'"
            :loading="loadFn"
        />

        <section class="content" ref="content">
            <div class="wrap" v-if="onOff">
                <div class="search">
                    <router-link to="/searchDoctor" class="searchWrap">
                        <a class="iconfont icon-ic_search"></a>
                        <input readonly="true" placeholder="搜索医生" />
                    </router-link>
                </div>

                <ol class="flow">
                    <li
                        v-for="(item,index) in ['选择医生','在线问诊','查看医嘱/处方','送药上门']"
                        :style="{
                            backgroundImage:'url('+require(`images/icon/series/img${index+1}.png`)+')',
                        }"
                    >
                        {{item}}
                    </li>
                </ol>

                <router-link
                    v-show="userId&&userId!='null'"
                    class="haveNoEndInquiry"
                    :to="{
                        path:'/user/myInquiry',
                    }"
                >
                    发现您有未结束的问诊，去看看~
                </router-link>

                <div
                    v-show="hotDept&&hotDept.length>0"
                    class="nav"
                >
                    <a
                        v-for="(item,index) in hotDept"
                        :style="{
                            backgroundImage:'url('+getImgUrl()+item.fileId+')',
                        }"
                        @click="$router.push({
                            path:'/findDoctor',
                            query:{
                                standardDeptId:item.deptId,
                                alias:item.alias,
                            }
                        })"
                    >
                        {{item.alias}}
                    </a>
                </div>

                <div class="hotDoctor">
                    <router-link to="/findDoctor" class="title">
                        <img :src="require('images/icon/img_doctor.png')" alt="图标" />
                        <span class="more">
                            更多
                            <i class="iconfont icon-jiantou"></i>
                        </span>
                    </router-link>

                    <div class="main">
                        <doctorList
                            :api="this.residentIndex"
                            :onceLoad="true"
                            :firstLoad="getHomeData"
                        />
                    </div>
                </div>

                <router-link
                    to="/user"
                    class="inquiry"
                ></router-link>
            </div>
        </section>
    </div>
</template>

<script>
    import {getImgUrl,lStore,nativeApi,webviewRefresh} from 'js/yydjs';
    import {residentIndex,findUnfinishConsult} from 'services';
    import doctorList from 'components/common/doctorList';
    import pullDown from 'components/common/pullDown';

    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
                hotDept:[],
                departmentsList:[],
                userId:'',
                onOff:true,
                residentIndex,
                getImgUrl,
            }
        },

        mounted(){
            //查询是否有未结束问诊
            this.unfinishFn();
        },

        methods:{
            getHomeData(res){
                this.hotDept=res.body.hotDept;
            },
            unfinishFn(){
                findUnfinishConsult([],(res)=>{
                    this.userId=res.body;
                });
            },
            loadFn(finished){
                this.onOff=false;
                setTimeout(()=>{
                    this.onOff=true;
                    finished();
                },300);
            },
        },

        components:{
            doctorList,
            pullDown,
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .home{
        .search{
            @include searchDoctor;
            border-bottom: $border1;
        }
        .flow{
            display: flex;
            margin-bottom: 10px;
            height: 70px;
            line-height: 20px;
            text-align: center;
            background-color: #fff;
            color: #999;
            li{
                flex: 1;
                padding-top: 40px;
                background: no-repeat center 10px;
                background-size: 30px;
                position: relative;
                &:before{
                    content: "";
                    width: 20%;
                    height: 2px;
                    background-image: linear-gradient(to right,#efeeef,#d1d3d9);
                    position: absolute;
                    right: 0;
                    top: 50px;
                    margin-top: -1px;
                    transform: translate3d(50%,0,0);
                }
                &:nth-of-type(3){
                    flex: 1.4;
                }
                &:last-of-type{
                    &:before{
                        display: none;
                    }
                }
            }
        }
        .haveNoEndInquiry{
            display: block;
            line-height: 20px;
            padding-bottom: 10px;
            text-align: center;
            background-color: $bg;
        }
        .nav{
            padding: 20px 0;
            padding-bottom: 10px;
            margin-bottom: 10px;
            background-color: #fff;
            overflow: hidden;
            a{
                float: left;
                width: 25%;
                padding-top: 50px;
                margin-bottom: 10px;
                background: no-repeat top center;
                background-size: auto 40px;
                line-height: 30px;
                text-align: center;
            }
        }
        .hotDoctor{
            .title{
                display: flex;
                justify-content: space-between;
                height: 40px;
                padding: 5px $padding;
                padding-left: 11px;
                line-height: 30px;
                border-bottom: $border1;
                background-color: #fff;
                img{
                    height: 100%;
                }
                .more{
                    color: #ccc;
                    i{
                        font-size: 14px;
                    }
                }
            }
            .main{

            }
        }
        .inquiry{
            width: 50px;
            height: 50px;
            line-height: 25px;
            text-align: center;
            border-radius: 50%;
            box-shadow: 0 0 6px 1px rgba(51,173,255,.4);
            background: #fff url('../../images/icon/ic_home_order.png') no-repeat center center;
            background-size: 24px;
            color: #999;
            position: fixed;
            right: 10px;
            bottom: 50px;
            z-index: 100;
        }
    }
</style>