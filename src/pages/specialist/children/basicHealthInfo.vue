<template>
    <div
        :class="{
            basicHealthInfo:true,
            active:show,
        }"
    >
        <header1
            title="基本健康信息"
            :click="saveHint"
            :right="{
                text:'保存',
                click:save,
            }"
        />

        <section class="content">
            <div class="orangeHint">信息仅供主治医生查看，请认真填写</div>

            <ul class="basicInfo">
                <li>
                    <div class="title">
                        药物过敏
                    </div>
                    <div class="main">
                        <span
                            v-for="(item,index) in medicalAllergy"
                            :class="{
                                active:indexArr1.indexOf(item.key)!=-1,
                            }"
                        >
                            {{item.text}}
                            <label :for="createId(1,index)" class="labelFor">
                                <input v-model="indexArr1" :value="item.key" type="checkbox" :id="createId(1,index)" />
                            </label>
                        </span>
                    </div>
                    <div class="end">
                        <textarea :readOnly="indexArr1.indexOf('暂无')!=-1" v-model="params[0].medicalAllergyInput" placeholder="可以补充你的药物过敏" maxlength="200"></textarea>
                    </div>
                </li>
                <li>
                    <div class="title">
                        食物/接触物过敏
                    </div>
                    <div class="main">
                        <span
                            v-for="(item,index) in foodAllergy"
                            :class="{
                                active:indexArr2.indexOf(item.key)!=-1,
                            }"
                        >
                            {{item.text}}
                            <label :for="createId(2,index)" class="labelFor">
                                <input v-model="indexArr2" :value="item.key" type="checkbox" :id="createId(2,index)" />
                            </label>
                        </span>
                    </div>
                    <div class="end">
                        <textarea :readOnly="indexArr2.indexOf('暂无')!=-1" v-model="params[0].foodAllergyInput" placeholder="可以补充你的食物或接触物过敏" maxlength="200"></textarea>
                    </div>
                </li>
                <li>
                    <div class="title">
                        家族病史
                    </div>
                    <div class="main">
                        <span
                            v-for="(item,index) in familyDiseaseHistory"
                            :class="{
                                active:indexArr3.indexOf(item.key)!=-1,
                            }"
                        >
                            {{item.text}}
                            <label :for="createId(3,index)" class="labelFor">
                                <input v-model="indexArr3" :value="item.key" type="checkbox" :id="createId(3,index)" />
                            </label>
                        </span>
                    </div>
                    <div class="end">
                        <textarea :readOnly="indexArr3.indexOf('暂无')!=-1" v-model="params[0].familyDiseaseHistoryInput" placeholder="可以补充你的家族病史" maxlength="200"></textarea>
                    </div>
                </li>
                <li>
                    <div class="title">
                        手术或外伤
                    </div>
                    <div class="main">
                        <span
                            v-for="(item,index) in operationOrTrauma"
                            :class="{
                                active:indexArr4.indexOf(item.key)!=-1,
                            }"
                        >
                            {{item.text}}
                            <label :for="createId(4,index)" class="labelFor">
                                <input v-model="indexArr4" :value="item.key" type="checkbox" :id="createId(4,index)" />
                            </label>
                        </span>
                    </div>
                    <div class="end">
                        <textarea :readOnly="indexArr4.indexOf('暂无')!=-1" v-model="params[0].operationOrTraumaInput" placeholder="可以补充你的手术或外伤" maxlength="200"></textarea>
                    </div>
                </li>
            </ul>
        </section>
    </div>
</template>

<script>
    import vm from 'src/main';
    import {lStore,alerts,Json} from 'js/yydjs';
    import {findDic,getHealthinfoByThirdpartyId,saveOrUpdate} from 'services';

    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
                oldThirdId:'',
                oldHealthInfo:'',
                indexArr1:[],
                indexArr2:[],
                indexArr3:[],
                indexArr4:[],
                params:[{
                    "id": '', //id 修改的时候传
                    "mpiId":'', //内部的就有mpiId outId 和mpiId传一个就行
                    "outId":'', //外部就诊人就有outId
                    "medicalAllergy": '', //药物过敏的补充
                    "foodAllergy": '',  //食物/接触物过敏的补充
                    "familyDiseaseHistory": '',  //家族病史的补充
                    "operationOrTrauma": '',  //手术或外伤的补充
                    "medicalAllergyCodes":'',  //食物/接触物过敏 多个|隔开 对应字典
                    "foodAllergyCodes":'',  //食物/接触物过敏 多个|隔开  对应字典
                    "familyDiseaseHistoryCodes":'',  //食物/接触物过敏 多个|隔开 对应字典
                    "operationOrTraumaCodes":'',  //食物/接触物过敏 多个|隔开 对应字典
                    "medicalAllergyInput": '',  //药物过敏的输入
                    "foodAllergyInput": '',  //食物/接触物过敏的输入
                    "familyDiseaseHistoryInput": '',  //家族病史的输入
                    "operationOrTraumaInput": '',  //手术或外伤的输入
                }],
                medicalAllergy:this.dictionaries.medicalAllergy,
                foodAllergy:this.dictionaries.foodAllergy,
                familyDiseaseHistory:this.dictionaries.familyDiseaseHistory,
                operationOrTrauma:this.dictionaries.operationOrTrauma,
                createId(index,index1){
                    return `basicHealthInfo${index}-${index1}`;
                },
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
            mpiId:{//病人id
                type:String,
                default:'',
            },
            outId:{//外部id
                type:String,
                default:'',
            },
            healthInfo:{//病人健康信息
                default:'',
            },
        },

        created(){
            //更新字典
            vm.$on('dictionariesFinished',(dictionaries)=>{
                this.medicalAllergy=dictionaries.medicalAllergy;
                this.foodAllergy=dictionaries.foodAllergy;
                this.familyDiseaseHistory=dictionaries.familyDiseaseHistory;
                this.operationOrTrauma=dictionaries.operationOrTrauma;
            });
        },

        mounted(){
            //获取健康信息
            this.getHealthInfo();
        },

        updated(){
            //获取健康信息
            this.getHealthInfo();
        },

        beforeDestroy(){
            vm.$off('dictionariesFinished');
        },

        watch:{
            healthInfo(){
                //获取健康信息
                this.getHealthInfo();
            },
            indexArr1(newVal,oldVal){
                this.clearLabel('indexArr1',newVal,oldVal,'medicalAllergyInput');
            },
            indexArr2(newVal,oldVal){
                this.clearLabel('indexArr2',newVal,oldVal,'foodAllergyInput');
            },
            indexArr3(newVal,oldVal){
                this.clearLabel('indexArr3',newVal,oldVal,'familyDiseaseHistoryInput');
            },
            indexArr4(newVal,oldVal){
                this.clearLabel('indexArr4',newVal,oldVal,'operationOrTraumaInput');
            },
        },

        methods:{
            getOldHealthInfo(){
                let str='';
                let arr=[this.params,this.indexArr1,this.indexArr2,this.indexArr3,this.indexArr4];

                for(let item of arr){
                    str+=JSON.stringify(item);
                }
                return str;
            },
            getHealthInfo(){
                let {mpiId,outId}=this;
                let thirdId=mpiId||outId;

                if(thirdId&&this.oldThirdId!=thirdId){
                    this.oldThirdId=thirdId;
                    this.params[0].mpiId=this.mpiId;
                    this.params[0].outId=this.outId;

                    let {id,medicalAllergyCodes,foodAllergyCodes,familyDiseaseHistoryCodes,operationOrTraumaCodes,medicalAllergyInput,foodAllergyInput,familyDiseaseHistoryInput,operationOrTraumaInput}=this.healthInfo||{};

                    this.params[0].id=id;

                    this.indexArr1=medicalAllergyCodes?medicalAllergyCodes.split('|'):[];
                    this.indexArr2=foodAllergyCodes?foodAllergyCodes.split('|'):[];
                    this.indexArr3=familyDiseaseHistoryCodes?familyDiseaseHistoryCodes.split('|'):[];
                    this.indexArr4=operationOrTraumaCodes?operationOrTraumaCodes.split('|'):[];

                    this.params[0].medicalAllergyInput=medicalAllergyInput;
                    this.params[0].foodAllergyInput=foodAllergyInput;
                    this.params[0].familyDiseaseHistoryInput=familyDiseaseHistoryInput;
                    this.params[0].operationOrTraumaInput=operationOrTraumaInput;

                    this.oldHealthInfo=this.getOldHealthInfo();
                }
            },
            clearLabel(arrName,newVal,oldVal,descName){
                if(newVal.length>0){
                    let index=newVal.indexOf('99');

                    if(index!=-1){
                        this[arrName]=newVal;
                        if(oldVal.length||this.params[0][descName]){
                            newVal.splice(index,1);
                        }
                    }
                }
            },
            save(hint){
                const This=this;
                const filterLabelArr=(key,labelArr,indexArr,addLabel)=>{
                    let arr=[];

                    arr=labelArr.filter((item,index)=>{
                        return indexArr.indexOf(item.key)!=-1;
                    }).map((item1,index1)=>item1[key]);

                    if(addLabel){
                        arr.push(addLabel);
                    }
                    return arr.join('|');
                };
                const saveInfo=()=>{
                    let {medicalAllergy,foodAllergy,familyDiseaseHistory,operationOrTrauma}=This.dictionaries;
                    let {medicalAllergyInput,foodAllergyInput,familyDiseaseHistoryInput,operationOrTraumaInput}=This.params[0];

                    This.params[0].medicalAllergyCodes=filterLabelArr('key',medicalAllergy,This.indexArr1);
                    This.params[0].foodAllergyCodes=filterLabelArr('key',foodAllergy,This.indexArr2);
                    This.params[0].familyDiseaseHistoryCodes=filterLabelArr('key',familyDiseaseHistory,This.indexArr3);
                    This.params[0].operationOrTraumaCodes=filterLabelArr('key',operationOrTrauma,This.indexArr4);

                    This.params[0].medicalAllergy=filterLabelArr('text',medicalAllergy,This.indexArr1,medicalAllergyInput);
                    This.params[0].foodAllergy=filterLabelArr('text',foodAllergy,This.indexArr2,foodAllergyInput);
                    This.params[0].familyDiseaseHistory=filterLabelArr('text',familyDiseaseHistory,This.indexArr3,familyDiseaseHistoryInput);
                    This.params[0].operationOrTrauma=filterLabelArr('text',operationOrTrauma,This.indexArr4,operationOrTraumaInput);

                    saveOrUpdate(This.params,(res)=>{
                        alerts('保存更新成功');
                        This.closeFn();
                        This.close&&This.close(This.params[0]);
                        This.oldHealthInfo=This.getOldHealthInfo();
                    });
                };

                if(hint){
                    this.$vux.confirm.show({
                        title:'提示',
                        content:'是否保存更新信息？',
                        cancelText:'放弃',
                        confirmText:'保存',
                        onConfirm(){
                            saveInfo();
                        },
                        onCancel(){
                            This.closeFn();
                            This.parent.ifBasicHealthInfo=false;
                            setTimeout(()=>{
                                This.parent.ifBasicHealthInfo=true;
                            },300);
                        },
                    });
                }else{
                    saveInfo();
                }
            },
            saveHint(){
                if(this.oldHealthInfo!=this.getOldHealthInfo()){
                    this.save(true);
                }else{
                    this.closeFn();
                }
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

    .basicHealthInfo{
        display: none;
        &.active{
            display: block;
        }
        .content{
            .orangeHint{
                @include orangeHint;
            }

            .basicInfo{
                li{
                    background-color: #fff;
                    padding: $padding;
                    margin-bottom: 10px;
                    .title{
                        line-height: 30px;
                    }
                    .main{
                        @include selectLabel;
                    }
                    .end{
                        textarea{
                            width: 100%;
                            padding: 10px;
                            height: 60px;
                            line-height: 20px;
                            border: $border1;
                            border-radius: 2px;
                        }
                    }
                }
            }
        }
    }
</style>