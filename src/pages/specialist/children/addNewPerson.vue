<template>
    <div class="addNewPerson">
        <header1
            title="添加问诊人"
            :right="{
                text:'保存',
                click:save,
            }"
        />

        <div class="content">
            <ul class="inforList">
                <li class="hideArrow">
                    <span>姓名</span>
                    <div class="rightContent">
                        <input v-model="params[0].name" type="text" placeholder="请输入" />
                        <i class="iconfont icon-jiantou"></i>
                    </div>
                </li>
                <li>
                    <span>证件类型</span>
                    <div class="rightContent">
                        <input
                            @click="showPapers=true"
                            :value="papersList[cIndex1].text"
                            readonly="true"
                            type="text"
                            placeholder="请选择"
                        />
                        <i class="iconfont icon-jiantou"></i>
                    </div>
                </li>
                <li class="hideArrow">
                    <span>证件号码</span>
                    <div class="rightContent">
                        <input
                            v-model="params[0].idCard"
                            type="text"
                            placeholder="请输入"
                            maxLength="18"
                            @input="autoInput"
                        />
                        <i class="iconfont icon-jiantou"></i>
                    </div>
                </li>
            </ul>
            <ul class="inforList">
                <li>
                    <span>性别</span>
                    <div class="rightContent">
                        <input
                            @click="showSex=true"
                            :value="sexList[cIndex2].text"
                            readonly="true"
                            type="text"
                            placeholder="请选择"
                        />
                        <i class="iconfont icon-jiantou"></i>
                    </div>
                </li>
                <li class="birthday">
                    <datetime
                        v-model="params[0].birthday"
                        :min-year="1900"
                        :max-year="new Date().getFullYear()"
                        title="选择出生日期"
                    />
                    <i class="iconfont icon-jiantou"></i>
                </li>
            </ul>
            <ul class="inforList">
                <li class="hideArrow">
                    <span>手机号码</span>
                    <div class="rightContent">
                        <input v-model="params[0].phone" type="number" placeholder="请输入" />
                        <i class="iconfont icon-jiantou"></i>
                    </div>
                </li>
            </ul>
        </div>

        <popup v-model="showPapers">
            <div class="papersWrap">
                <div class="title">
                    选择证件类型
                </div>
                <div class="main">
                    <ul class="papersList">
                        <li
                            v-for="(item,index) in papersList"
                            @click="cIndex1=index;showPapers=false;"
                            :class="{
                                active:cIndex1==index,
                            }"
                        >
                            {{item.text}}
                        </li>
                    </ul>
                </div>
                <div
                    @click="showPapers=false"
                    class="end"
                >
                    取消
                </div>
            </div>
        </popup>

        <popup v-model="showSex">
            <div class="papersWrap">
                <div class="title">
                    选择性别
                </div>
                <div class="main">
                    <ul class="papersList">
                        <li
                            v-for="(item,index) in sexList"
                            @click="cIndex2=index;showSex=false;"
                            :class="{
                                active:cIndex2==index,
                            }"
                        >
                            {{item.text}}
                        </li>
                    </ul>
                </div>
                <div
                    @click="showSex=false"
                    class="end"
                >
                    取消
                </div>
            </div>
        </popup>
    </div>
</template>

<script>
    import {Popup,Datetime} from 'src/VUX';
    import {alertss,lStore,sStore,regJson,alerts} from 'js/yydjs';
    import {addPatient} from 'services';

    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
                showPapers:false,
                papersList:[
                    {
                        text:'居民身份证',
                        idCardType:'01',
                    },
                    // {
                    //     text:'居民户口簿',
                    //     idCardType:'02',
                    // },
                    {
                        text:'护照',
                        idCardType:'03',
                    },
                    {
                        text:'军官证',
                        idCardType:'04',
                    },
                    // {
                    //     text:'驾驶证',
                    //     idCardType:'05',
                    // },
                    {
                        text:'港澳居民来往内地通行证',
                        idCardType:'06',
                    },
                    {
                        text:'台湾居民来往内地通行证',
                        idCardType:'07',
                    },
                    {
                        text:'出生证明',
                        idCardType:'11',
                    },
                    // {
                    //     text:'其他法定有效证件',
                    //     idCardType:'99',
                    // },
                ],
                cIndex1:0,
                showSex:false,
                sexList:[
                    {
                        text:'男',
                        sex:'1',
                    },
                    {
                        text:'女',
                        sex:'2',
                    },
                ],
                cIndex2:0,
                params:[{
                    "name":'', //名称
                    "idCardType":'01', //证件类型
                    "idCard":'', //证件号码
                    "sex":'', //性别
                    "birthday":'', //生日
                    "phone":lStore.get('mobile')||''//电话
                }],
            }
        },

        mounted(){

        },

        methods:{
            autoInput(){
                let {idCardType,idCard}=this.params[0];
                let reg=regJson.identity.reg;

                if(idCardType=='01'&&idCard&&reg.test(idCard)){
                    let birthday=idCard.substring(idCard.length-12,idCard.length-4);

                    birthday=birthday.substring(0,4)+'-'+birthday.substring(4,6)+'-'+birthday.substring(6,8);
                    this.params[0].birthday=birthday;
                    this.cIndex2=idCard.substring(idCard.length-2,idCard.length-1)%2!=0?0:1;
                }
            },
            save(){
                this.params[0].idCardType=this.papersList[this.cIndex1].idCardType;
                this.params[0].sex=this.sexList[this.cIndex2].sex;
                this.params[0].phone=this.params[0].phone+'';

                let {name,idCardType,idCard,sex,birthday,phone}=this.params[0];
                let arr=[
                    {
                        if:!name,
                        hint:'请输入姓名',
                    },
                    {
                        if:!idCard,
                        hint:'请输入证件号码',
                    },
                    {
                        if:idCardType=='01',
                        value:idCard,
                        type:'identity',
                    },
                    {
                        if:!birthday,
                        hint:'请选择出生日期',
                    },
                    {
                        if:!phone,
                        hint:'请输入手机号',
                    },
                    {
                        value:phone,
                        type:'mobile',
                    },
                ];

                alertss(arr,()=>{
                    addPatient(this.params,(res)=>{
                        alerts('添加问诊人成功');
                        sStore.set('thirdId',res.body.mpiId);
                        this.$router.go(-1);
                    });
                });
            },
        },

        components:{
            Popup,
            Datetime,
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .addNewPerson{
        .content{
            .inforList{
                background-color: #fff;
                margin-bottom: 10px;
                li{
                    display: flex;
                    justify-content: space-between;
                    padding: 7px $padding;
                    padding-left: 0;
                    margin-left: 10px;
                    height: $height1;
                    line-height: 30px;
                    border-bottom: $border1;
                    background-color: #fff;
                    >span{
                        color: #666;
                    }
                    .rightContent{
                        display: flex;
                        justify-content: flex-end;
                        flex: 1;
                        padding-left: $padding;
                        input{
                            width: 100%;
                            height: 100%;
                            border: none;
                            text-align: right;
                        }
                        i{
                            color: #ccc;
                        }
                    }
                    .icon-jiantou{
                        margin-left: 5px;
                        font-size: 12px;
                        color: #999;
                    }
                    &.hideArrow{
                        .rightContent{
                            i{
                                visibility: hidden;
                            }
                        }
                    }
                    &:last-of-type{
                        border-bottom: none;
                    }
                }
            }
        }
    }
</style>

<style lang="scss">
    @import '~css/public.scss';

    .addNewPerson{
        .papersWrap{
            background-color: $bg;
            text-align: center;
            .title,.end,.main .papersList li{
                height: $height1;
                line-height: $height1;
                border-bottom: $border1;
                background-color: #fff;
                color: #999;
            }
            .end{
                border-bottom: none;
            }
            .main{
                margin-bottom: 10px;
                .papersList{
                    li{
                        color: #333;
                        &.active{
                            color: $main;
                        }
                    }
                }
            }
        }

        .birthday{
            .vux-datetime{
                >div>p{
                    color: #666;
                }
                @include vuxDatetime;
            }
        }
    }
</style>