<template>
    <div class="findDoctor">
        <header1
            title="找医生"
        />

        <section class="content">
            <conditionSelecter
                :dataList="conditionList"
                :currentIndex="sIndex"
                :click="clickFn"
            />

            <departmentPicker
                v-if="showDepartmentPickerOnce"
                :parent="this"
                :showName="'showDepartmentPicker'"
                :close="closeFn"
            />

            <sortPicker
                :parent="this"
                :showName="'showSortPicker'"
                :close="closeFn"
            />

            <filterPicker
                :parent="this"
                :showName="'showfilterPicker'"
                :close="closeFn"
                :cIndex="+params[0].onlineType||0"
            />

            <doctorList
                v-if="onOff"
                :api="this.findDoctors"
                :params="params"
                :getListFromRes="getListFromRes"
            />
        </section>
    </div>
</template>

<script>
    import doctorList from 'components/common/doctorList';
    import conditionSelecter from 'components/common/conditionSelecter';
    import departmentPicker from 'components/common/departmentPicker';
    import sortPicker from 'components/common/sortPicker';
    import filterPicker from 'components/common/filterPicker';
    import vm from 'src/main';
    import {findDoctors} from 'services';

    export default{
        data(){
            let query=this.$router.currentRoute.query;
            let {id,standardDeptId,itemCode}=query;

            if(itemCode=='99')itemCode='';

            return{
                query:this.$router.currentRoute.query,
                onOff:true,
                params:[
                    {
                        "id":id||'',
                        "standardDeptId":standardDeptId||'',
                        "onlineType":itemCode||'',  // 01  图文问诊 02 视频问诊
                        "doctorLevel":'',
                        "sortType":'', // 排序类型  默认按职称排序，  1为接诊量
                        "page":1,
                        "limit":10,
                    },
                ],
                conditionList:['全部科室','综合排序','筛选'],
                sIndex:-1,
                showDepartmentPicker:false,
                showDepartmentPickerOnce:false,
                showSortPicker:false,
                showfilterPicker:false,
                findDoctors,
            }
        },

        mounted(){
            //如果已经选择科室，则选中
            if(this.query.alias){
                this.changeConditionList(0,this.query.alias);
            }

            //如果存在图文或者视频过滤
            if(this.query.itemCode){
                let itemCodeJson={
                    '01':'图文',
                    '02':'视频',
                    '99':'不限',
                };
                let changeItemCodeText=itemCodeJson[this.query.itemCode];

                if(changeItemCodeText){
                    this.changeConditionList(2,changeItemCodeText);
                }
            }
        },

        methods:{
            clickFn(item,index){
                this.sIndex=index;

                const closePicker=(exclude)=>{
                    let arr=['showDepartmentPicker','showSortPicker','showfilterPicker'];

                    if(exclude)arr.splice(arr.indexOf(exclude),1);

                    for(let item of arr){
                        this[item]=false;
                    }
                };

                switch(index){
                    case 0:
                            closePicker('showDepartmentPicker');
                            this.showDepartmentPicker=!this.showDepartmentPicker?true:false;
                            if(this.showDepartmentPicker&&!this.showDepartmentPickerOnce)this.showDepartmentPickerOnce=true;
                        break;
                    case 1:
                            closePicker('showSortPicker');
                            this.showSortPicker=!this.showSortPicker?true:false;
                        break;
                    case 2:
                            closePicker('showfilterPicker');
                            this.showfilterPicker=!this.showfilterPicker?true:false;
                        break;
                }

                if(!this.showDepartmentPicker&&!this.showSortPicker&&!this.showfilterPicker){
                    this.sIndex=-1;
                }
            },
            closeFn(isSelect,data,data1,changeParams,flag){
                if(isSelect){
                    let str=(data&&data1)?(data+data1):data;

                    this.changeConditionList(this.sIndex,str);
                    for(let attr in changeParams){
                        this.params[0][attr]=changeParams[attr];
                    }

                    this.params[0].id='';
                    this.params[0].page=1;

                    this.onOff=false;
                    setTimeout(()=>{
                        this.onOff=true;
                    },300);
                }
                this.sIndex=-1;
            },
            changeConditionList(index,str){
                let conditionList=[].concat(this.conditionList);

                conditionList[index]=str;
                this.conditionList=conditionList;
            },
            getListFromRes(res){
                return res.body;
            },
        },

        components:{
            doctorList,
            conditionSelecter,
            departmentPicker,
            sortPicker,
            filterPicker,
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .findDoctor{
        .content{

        }
    }
</style>

<style lang="scss">
    .findDoctor{
        .content{
            .doctorList li .tel{
                display: none;
            }
        }
    }
</style>