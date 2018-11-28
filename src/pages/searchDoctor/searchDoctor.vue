<template>
    <div class="searchDoctor">
        <div
            class="searchHeader"
            :style="{
                height:(44+statusBarHeight) + 'px',
            }"
        >
            <div
                class="search"
                :style="{
                    height:(44+statusBarHeight) + 'px',
                    paddingTop:statusBarHeight + 'px',
                }"
            >
                <div class="wrap">
                    <router-link to="/searchDoctor" class="searchWrap">
                        <a class="iconfont icon-ic_search"></a>
                        <input
                            placeholder="搜索医生"
                            type="text"
                            v-model.trim="searchInfo"
                            @input="searchReset"
                        />
                        <a
                            v-show="searchInfo"
                            class="iconfont icon-ic_search_del close"
                            @click="searchInfo='';doctorList=[];"
                        ></a>
                    </router-link>
                    <a
                        @click="()=>{
                            this.$router.go(-1);
                        }"
                        class="cancel"
                    >
                        取消
                    </a>
                </div>
            </div>
        </div>

        <section class="content">
            <div class="history">
                <div
                    class="title"
                    v-show="!searchInfo&&doctorList.length==0&&searchDoctorHistory&&searchDoctorHistory.length"
                >
                    <span>历史搜索</span>
                    <a
                        @click="clearHistory"
                        class="iconfont icon-ic_history_delete"
                    ></a>
                </div>

                <div class="main">
                    <div class="resultList">
                        <router-link
                            v-show="searchInfo&&doctorList.length==0"
                            :to="{
                                path:'/findDoctor',
                                query:{
                                    id:'000',
                                },
                            }"
                        >
                            {{searchInfo}}
                        </router-link>

                        <a
                            v-show="!searchInfo&&doctorList.length==0"
                            v-for="(item,index) in searchDoctorHistory"
                            @click="searchDoctorHistoryFn(item)"
                        >
                            {{item}}
                        </a>

                        <a
                            v-for="(item,index) in doctorList"
                            @click="goResultPage(item,index)"
                        >
                            {{item.doctorName}}
                        </a>
                    </div>
                    <a
                        :class="{
                            viewMore:true,
                            active:showViewMore,
                        }"
                        @click="viewMore"
                    >
                        查看更多
                    </a>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import {antiShake,lStore} from 'js/yydjs';
    import {searchDoctor} from 'services';

    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
                searchDoctorHistory:lStore.get('searchDoctorHistory')||[],
                searchInfo:'',
                searchAntiShake:this.searchFn(),
                params:[
                    '',
                    1,
                    10,
                ],
                doctorList:[],
                showViewMore:false,
                reset:false,
            }
        },

        mounted(){

        },

        methods:{
            searchFn(){
                return antiShake(()=>{
                    let value=this.searchInfo;

                    this.params[0]=value;
                    if(this.reset)this.params[1]=1;

                    if(value){
                        searchDoctor(this.params,(res)=>{
                            this.doctorList=this.reset?res.body.data:[].concat(this.doctorList,res.body.data);
                            this.showViewMore=this.doctorList.length<res.body.total?true:false;

                            if(this.searchDoctorHistory.indexOf(value)==-1){
                                this.searchDoctorHistory.unshift(value);
                                if(this.searchDoctorHistory.length>50){
                                    this.searchDoctorHistory.splice(50,this.searchDoctorHistory.length);
                                }
                                lStore.set('searchDoctorHistory',this.searchDoctorHistory);
                            }
                        });
                    }else{
                        this.doctorList=[];
                    }
                },1000);
            },
            searchReset(){
                this.reset=true;
                this.searchAntiShake();
            },
            goResultPage(item,index){
                this.$router.push({
                    path:'/findDoctor',
                    query:{
                        id:item.id,
                    },
                });
            },
            viewMore(){
                this.reset=false;
                this.params[1]++;
                this.showViewMore=false;
                this.searchAntiShake();
            },
            searchDoctorHistoryFn(item){
                this.searchInfo=item;
                this.searchReset();
            },
            clearHistory(){
                let This=this;

                this.$vux.confirm.show({
                    title:'提示',
                    content:'确定清除搜索历史吗？',
                    onConfirm(){
                        This.searchDoctorHistory=[];
                        lStore.set('searchDoctorHistory',[]);
                    },
                });
            },
        },

        components:{

        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .searchDoctor{
        .searchHeader{
            height: $height1;
            .search{
                width: 100%;
                height: $height1;
                position: fixed;
                left: 0;
                top: 0;
                z-index: 100;
                background-color: $main;
                .wrap{
                    @include searchDoctor;
                    display: flex;
                    justify-content: space-between;
                    background-color: $main;
                    position: relative;
                    .searchWrap{
                        flex: 1;
                        background-color: #fff;
                    }
                    .cancel{
                        width: 40px;
                        height: 100%;
                        line-height: 30px;
                        color: #fff;
                        text-align: right;
                    }
                }
            }
        }

        .content{
            position: relative;
            .history{
                width: 100%;
                position: absolute;
                background-color: #fff;
                outline: 9999px solid #fff;
                clip: rect(0 9999px 9999px 0);
                .title{
                    display: flex;
                    justify-content: space-between;
                    height: 50px;
                    line-height: 49px;
                    padding: 0 $padding;
                    border-bottom: $border1;
                    color: #999;
                    span{
                        font-size: 12px;
                    }
                    a{
                        font-size: 20px;
                    }
                }
                .main{
                    .resultList{
                        a{
                            display: block;
                            padding: 0 $padding;
                            height: 50px;
                            line-height: 49px;
                            border-bottom: $border1;
                            color: #666;
                        }
                    }
                    .viewMore{
                        height: 50px;
                        line-height: 49px;
                        text-align: center;
                        border-bottom: $border1;
                        color: $main;
                        display: none;
                        &.active{
                            display: block;
                        }
                    }
                }
            }
        }
    }
</style>