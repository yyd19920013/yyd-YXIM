<template>
    <div
        :class="{
            selectPersonAdd:true,
            active:show,
        }"
    >
        <header1
            title="选择问诊人"
            :click="closeFn"
            :right="{
                text:'新增',
                click:newAdd,
            }"
        />

        <div class="content">
            <ul class="personList">
                <li
                    v-for="(item,index) in patientList"
                    @click="selectFn(item,index)"
                    :class="{
                        active:cIndex==index,
                    }"
                >
                    <span>{{item.personName}}</span>
                    <i class="iconfont icon-iconfontcheck"></i>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {sStore} from 'js/yydjs';
    import {getPatientList} from 'services';

    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
                cIndex:-1,
                patientList:[],
            }
        },

        props:{
            parent:{//父组件的this
                required:true,
                type:Object,
                default:null,
            },
            showName:{//父组件控制该组件显示隐藏的名字
                required:true,
                type:String,
                default:'',
            },
            show:{//是否显示该页面
                type:Boolean,
                default:false,
            },
            close:{//关闭页面时的回调函数
                type:Function,
                default:null,
            },
        },

        mounted(){
            //获取问诊人列表
            this.getPatientListFn();
        },

        methods:{
            newAdd(){
                this.$router.push({path:'/specialist/addNewPerson'});
            },
            selectFn(item,index){
                this.cIndex=index;
                setTimeout(()=>{
                    this.parent[this.showName]=false;
                    this.close&&this.close(item,index);
                });
            },
            getPatientListFn(){
                getPatientList([],(res)=>{
                    this.patientList=res.body;
                    if(this.patientList&&this.patientList.length>0){
                        let thirdId=sStore.get('thirdId');

                        this.cIndex=0;
                        if(thirdId){
                            for(let i=0;i<this.patientList.length;i++){
                                if(thirdId==this.patientList[i].mpiId||thirdId==this.patientList[i].outId){
                                    this.cIndex=i;
                                    sStore.set('thirdId','');
                                    break;
                                }
                            }
                        }
                        this.close&&this.close(this.patientList[this.cIndex],this.cIndex);
                    }else{
                        this.newAdd();
                    }
                });
            },
            closeFn(){
                this.parent[this.showName]=false;
            },
        },

        components:{

        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .selectPersonAdd{
        display: none;
        &.active{
            display: block;
        }
        .content{
            .personList{
                li{
                    display: flex;
                    justify-content: space-between;
                    padding: 0 $padding;
                    height: $height1;
                    line-height: $height1;
                    border-bottom: $border1;
                    background-color: #fff;
                    i{
                        font-size: 20px;
                        color: $main;
                        display: none;
                    }
                    &.active{
                        i{
                            display: inline-block;
                        }
                    }
                }
            }
        }
    }
</style>