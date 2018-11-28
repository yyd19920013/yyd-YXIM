<template>
    <div class="disableInquiryTicket">
        <ul
            v-if="ticketList&&ticketList.length>0"
            class="ticketList disabled"
        >
            <li
                v-for="(item,index) in ticketList"
                :class="{
                    active:selectTicket==index,
                }"
            >
                <div class="main">
                    <div class="wrap">
                        <h3>免费问诊</h3>
                        <h4>有效期：{{item.validity}}</h4>
                        <h5>仅限{{item.itemCodeText}}使用</h5>
                    </div>
                </div>
                <div class="end">
                    注：{{item.sourceText}}
                </div>
                <label :for="createId(index)" class="labelFor">
                    <input v-model="selectTicket" :value="index" :id="createId(index)" type="radio" />
                </label>
            </li>
        </ul>
        <defaultImage
            :show="showDefaultImage"
        />
    </div>
</template>

<script>
    import defaultImage from 'components/common/defaultImage';
    import {getDisableVoucherList} from 'services';

    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
                ticketList:[],
                selectTicket:'',
                showDefaultImage:false,
                params:[
                    this.$router.currentRoute.query.goodsCode,
                    1,
                    1000,
                ],
            }
        },

        mounted(){
            //获取不可用问诊劵
            this.getDisableList();
        },

        methods:{
            createId(index){
                return `disableInquiryTicket${index}`;
            },
            getDisableList(){
                this.showDefaultImage=false;
                getDisableVoucherList(this.params,(res)=>{
                    this.ticketList=res.body;
                    if(this.ticketList&&this.ticketList.length==0){
                        this.showDefaultImage=true;
                    }
                });
            },
        },

        components:{
            defaultImage,
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .disableInquiryTicket{
        .ticketList{
            @include ticketList;
        }
    }
</style>