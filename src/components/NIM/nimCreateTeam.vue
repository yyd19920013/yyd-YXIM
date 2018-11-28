<template>
    <div class="nimCreateTeam">
        <nimHeader
            :parent="parent"
            :controlPageName="'nimCreateTeam'"
            :title="'创建群'"
        />

        <div class="tab">
            <ol class="tabWrap">
                <li
                    v-for="(item,index) in ['普通群','高级群']"
                    :class="{
                        active:tabIndex==index,
                    }"
                    @click="tabControl(index)"
                >
                    {{item}}
                </li>
            </ol>
        </div>

        <section class="content scrollContainer">
            <ul class="createInfo">
                <li>
                    <span>群名称</span>
                    <div class="right">
                        <input v-model="name" type="text" placeholder="请输入群名称" />
                    </div>
                </li>
                <li v-show="tabIndex==1">
                    <span>群简介</span>
                    <div class="right">
                        <input v-model="intro" type="text" placeholder="请输入群简介" />
                    </div>
                </li>
                <li v-show="tabIndex==1">
                    <span>群公告</span>
                    <div class="right">
                        <input v-model="announcement" type="text" placeholder="请输入群公告" />
                    </div>
                </li>
            </ul>

            <ul class="friendsList">
                <li v-for="(item,index) in friendsList">
                    <input v-model="accounts" :id="createId(index)" :value="item.account" type="checkbox" />
                    <span>{{item.account}}</span>
                    <label :for="createId(index)"></label>
                </li>
            </ul>
            <div
                v-show="showNoData"
                class="noData"
            >
                暂无数据
            </div>

            <button
                class="createTeam"
                type="button"
                @click="createTeam"
            >
                创建群
            </button>
        </section>
    </div>
</template>

<script>
    import nimHeader from './nimHeader';
    import vm from 'src/main';

    export default{
        data(){
            return{
                tabIndex:0,
                friendsList:[],
                showNoData:false,
                name:'',
                intro:'',
                announcement:'',
                accounts:[],
            }
        },

        /*

        */

        props:{
            parent:{
                required:true,
                type:Object,
                default:null,
            },
        },

        created(){
            vm.$on('nimOnFriendsAll',this.getFriendsList);
        },

        beforeDestroy(){
            vm.$off('nimOnFriendsAll',this.getFriendsList);
        },

        methods:{
            createId(index){
                return `nimCreateTeam${index}`;
            },
            tabControl(index){
                this.tabIndex=index;
            },
            getFriendsList(res){
                this.friendsList=res;
                if(res.length==0){
                    this.showNoData=true;
                }
            },
            createTeam(){
                let {tabIndex,accounts,name,intro,announcement}=this;

                nim.createTeam({
                    type: tabIndex==0?'normal':'advanced',
                    name,
                    avatar: 'avatar',
                    accounts,
                    intro,
                    announcement,
                    ps: `我建了一个${tabIndex==0?'普通群':'高级群'}`,
                    done: (error, obj)=>{
                        if(!error){
                            alert('创建群成功');
                        }else{
                            alert(error);
                        }
                    },
                });
            },
        },

        components:{
            nimHeader,
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .nimCreateTeam{
        .tab{
            height: 40px;
            .tabWrap{
                width: 100%;
                height: 40px;
                line-height: 40px;
                border-bottom: 1px solid #ddd;
                text-align: center;
                position: absolute;
                left: 0;
                top: 40px;
                li{
                    float: left;
                    width: 50%;
                    border-right: 1px solid #ddd;
                    &:last-of-type{
                        border-right: none;
                    }
                    &.active{
                        background-color: #33adff;
                        color: #fff;
                    }
                }
            }
        }
        .content{
            top: 80px;
            border-bottom: 80px solid transparent;
            .createInfo{
                padding-top: 50px;
                li{
                    height: 30px;
                    line-height: 30px;
                    margin-bottom: 10px;
                    span{
                        float: left;
                        width: 50px;
                    }
                    .right{
                        overflow: hidden;
                        padding-left: 10px;
                        input{
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
            .friendsList{
                padding-top: 20px;
                li{
                    padding: 10px 0;
                    border-bottom: 1px solid #ddd;
                    line-height: 20px;
                    position: relative;
                    overflow: hidden;
                    span{
                        float: right;
                    }
                    label{
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        left: 0;
                        top: 0;
                        z-index: 10;
                    }
                }
            }
            .noData{
                height: 30px;
                line-height: 30px;
                text-align: center;
            }
            .createTeam{
                margin-top: 50px;
                width: 100%;
                height: 40px;
            }
        }
    }
</style>