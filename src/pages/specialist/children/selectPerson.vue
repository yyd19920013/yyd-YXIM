<template>
    <div class="selectPersonWrap">
        <div
            v-show="!showSelectPersonAdd&&!showBasicHealthInfo"
            class="selectPerson"
        >
            <header1
                title="选择问诊人"
                :right="{
                    text:'提交',
                    click:toPay,
                }"
            />

            <div class="content">
                <div class="inforList">
                    <a
                        @click="toSelectPersonAdd"
                    >
                        <span>问诊人</span>
                        <em>
                            <input v-model="personInfo.personName" readonly="true" type="text" placeholder="问诊人" />
                            <i class="iconfont icon-jiantou"></i>
                        </em>
                    </a>
                    <a
                        @click="toBasicHealthInfo"
                    >
                        <span>基本健康信息</span>
                        <em>
                            <input v-model="countHealthInfo" readonly="true" type="text" placeholder="请添加过敏史、病史等" />
                            <i class="iconfont icon-jiantou"></i>
                        </em>
                    </a>
                </div>
            </div>
        </div>

        <selectPersonAdd
            :parent="this"
            :showName="'showSelectPersonAdd'"
            :show="showSelectPersonAdd"
            :close="updatePerson"
        />

        <basicHealthInfo
            v-if="ifBasicHealthInfo"
            :parent="this"
            :showName="'showBasicHealthInfo'"
            :show="showBasicHealthInfo"
            :close="updateHealth"
            :mpiId="personInfo.mpiId"
            :outId="personInfo.outId"
            :healthInfo="healthInfo"
        />
    </div>
</template>

<script>
    import {alerts,alertss,regJson,Json,dateFormat0,Type} from 'js/yydjs';
    import {getPatientList,getHealthinfoByThirdpartyId,createConsultOrder} from 'services';
    import selectPersonAdd from './selectPersonAdd';
    import basicHealthInfo from './basicHealthInfo';

    export default{
        data(){
            let goodsJson={
                    '01':'30',
                    '02':'40',
                    '03':'50',
                };
            let query=this.$router.currentRoute.query;
            let {shopName,shopId,orgId,deptId,goodsId,goodsName,doctorOnlineExtraId,docScheduleId,itemCode,price,startTime,endTime}=query;

            return{
                query:this.$router.currentRoute.query,
                oldThirdId:'',
                ifBasicHealthInfo:true,
                showSelectPersonAdd:false,
                showBasicHealthInfo:false,
                personInfo:{},
                healthInfo:{
                    certificate:{},
                },
                params:[
                    {
                        "shopName":shopName, //必传，doctorName-医生姓名
                        "shopId":shopId, //必传，doctorId-医生id
                        "goodsCode":itemCode, //必传，问诊项目code,来自医生线上问诊接口
                        "goodsId":goodsId, //必传，问诊项目id，来自医生线上问诊接口主键
                        "goodsCategory":goodsJson[itemCode],   //必传，商品分类:30图文问诊 40视频问诊
                        "orderAmount":price||'0', //必传，订单金额(没有则传0，不能为空)
                        "price":price||'0', //价格，与orderAmount相同(没有则传0，不能为空)
                        "shippingAmount":'0', //必传，物流费用(没有则传0，不能为空)
                        "discAmount":'0', //必传，优惠金额(没有则传0，不能为空)
                        "goodsName":goodsName, //项目名称，图文问诊、视频问诊、远程会诊
                        "payChannel":'', //支付渠道：02支付宝 03微信
                        "userId":'', //下单人userId
                        "userName":'', //下单人姓名
                        "userPhone":'', //下单人手机号
                        "orderShipId":'', //订单物流主键，取自物流信息接口主键
                        "quantity":'', //数量-问诊固定：1
                        "remark":'', //备注
                        "postWay":'3', //邮寄方式 ，1 自取、 2  邮件、3 无(到店消费)
                        "ex":'', //扩展信息
                        "invoiceId":'', //发票编号,取自发票接口主键
                    },
                    {
                        "deptId":deptId, //必传，科室主键
                        "itemCode":itemCode, //必传，问诊项目：01图文问诊 02视频问诊
                        "orgId":orgId, //必传，机构id
                        "doctorOnlineExtraId":doctorOnlineExtraId, //必传，线上问诊医生主键
                        "healthId":'', //就诊人基本健康信息,引用healthInfo主键
                        "docScheduleId":docScheduleId, //视频问诊必传，医生排班主键
                        "startTime":startTime, //视频问诊必传，预约开始时间
                        "endTime":endTime, //视频问诊必传，预约结束时间
                        "descr":'', //不舒服描述
                        "remark":'', //备注信息
                    },
                    {
                        "name":'', //必传，就诊人姓名
                        "sex":'', //必传，性别
                        "dob":'', //必传，出生日期
                        "uniqueId":'', //必传，患者主索引，大C端->mpiId，晞景->outId
                        "phone":'', //手机号
                        "idCardType":'', //卡类型
                        "idCard":'', //卡号
                        "ex":'', //外部扩展信息
                    },
                ],
            }
        },

        computed:{
            countHealthInfo(){
                let str='';
                let {medicalAllergy,foodAllergy,familyDiseaseHistory,operationOrTrauma}=this.healthInfo||{};

                if(medicalAllergy)str+='药物过敏：'+this.computedHealthInfo(medicalAllergy)+'；';
                if(foodAllergy)str+='食物/接触物过敏：'+this.computedHealthInfo(foodAllergy)+'；';
                if(familyDiseaseHistory)str+='家族病史：'+this.computedHealthInfo(familyDiseaseHistory)+'；';
                if(operationOrTrauma)str+='手术或外伤：'+this.computedHealthInfo(operationOrTrauma)+'；';

                if(str&&str.length){
                    str=str.length>12?str.substring(0,12)+'...':str;
                }
                return str;
            },
        },

        mounted(){
            //获取健康信息
            this.getHealthInfo();
        },

        updated(){
            //获取健康信息
            this.getHealthInfo();
        },

        methods:{
            computedHealthInfo(value){
                let str='';

                if(value){
                    str+=value.split('|').join('、');
                }
                return str;
            },
            toSelectPersonAdd(){
                this.showSelectPersonAdd=true;
                this.showBasicHealthInfo=false;
            },
            toBasicHealthInfo(){
                let {mpiId,outId}=this.personInfo;
                let thirdId=mpiId||outId;

                if(thirdId){
                    this.showSelectPersonAdd=false;
                    this.showBasicHealthInfo=true;
                }else{
                    alerts('请选择问诊人');
                }
            },
            getHealthInfo(update){
                let {mpiId,outId,personName,sex,dob}=this.personInfo;
                let age=new Date().getFullYear()-dateFormat0(dob,'yyyy');
                let thirdId=mpiId||outId;

                if(update||(thirdId&&this.oldThirdId!=thirdId)){
                    this.oldThirdId=thirdId;
                    getHealthinfoByThirdpartyId([thirdId],(res)=>{
                        let {id,medicalAllergy,foodAllergy,familyDiseaseHistory,operationOrTrauma,medicalAllergyCodes,foodAllergyCodes,familyDiseaseHistoryCodes,operationOrTraumaCodes}=res.body||{};

                        this.params[1].healthId=id;

                        this.healthInfo=res.body||{};
                        if(!this.healthInfo.certificate)this.healthInfo.certificate={};
                    });
                }
            },
            updatePerson(personInfo){
                let {certificate={},personName,phoneNo,sex,dob,mpiId,outId}=personInfo;
                let {certificateType,certificateNo}=certificate;
                let reg=regJson.identity.reg;
                let sex1='';
                let dob1='';

                if(certificateType=='01'&&certificateNo&&reg.test(certificateNo)){
                    sex1=certificateNo.substring(certificateNo.length-2,certificateNo.length-1)%2!=0?0:1;
                    dob1=certificateNo.substring(certificateNo.length-12,certificateNo.length-4);
                    dob1=dob1.substring(0,4)+'-'+dob1.substring(4,6)+'-'+dob1.substring(6,8);
                }

                this.params[2].name=personName;
                this.params[2].phone=phoneNo;
                this.params[2].sex=sex||sex1;
                this.params[2].dob=dob||dob1;
                this.params[2].uniqueId=mpiId||outId;
                this.params[2].idCardType=certificateType;
                this.params[2].idCard=certificateNo;

                this.personInfo=personInfo;
            },
            updateHealth(healthInfo){
                this.getHealthInfo(true);
            },
            toPay(){
                let {mpiId,outId}=this.personInfo;
                let {id}=this.healthInfo;
                let thirdId=mpiId||outId;
                let arr=[
                    {
                        if:!thirdId,
                        hint:'请选择问诊人',
                    },
                ];

                alertss(arr,()=>{
                    alerts('已提交',1000);
                    createConsultOrder(this.params,(res)=>{
                        //console.log(res);
                        this.$router.replace({
                            path:'/payment',
                            query:{
                                orderDetailId:res.body.orderDetailId,
                                goodsCode:this.params[0].goodsCode,
                            },
                        });
                    });
                });
            },
        },

        components:{
            selectPersonAdd,
            basicHealthInfo,
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .selectPerson{
        .content{
            .inforList{
                >a{
                    display: flex;
                    justify-content: space-between;
                    padding: 7px $padding;
                    margin-bottom: 10px;
                    height: 44px;
                    line-height: 30px;
                    background-color: #fff;
                    span{
                        color: #666;
                    }
                    em{
                        flex: 1;
                        display: flex;
                        justify-content: flex-end;
                        padding-left: 10px;
                        input{
                            width: 100%;
                            height: 100%;
                            border: none;
                            text-align: right;
                        }
                        i{
                            margin-left: 5px;
                            font-size: 12px;
                        }
                    }
                }
            }
        }
    }
</style>