<template>
    <div class="selectInquiryTicketIndex">
        <ul
            v-if="ticketList&&ticketList.length>0"
            class="ticketList"
        >
            <li
                v-for="(item,index) in ticketList"
                :class="{
                    active:selectTicket==item.voucherNo,
                }"
                @click="selectTicketFn(item,index)"
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
                    <input v-model="selectTicket" :value="item.voucherNo" :id="createId(index)" type="radio" />
                </label>
            </li>
        </ul>
        <defaultImage
            :show="showDefaultImage"
            :showIndex="2"
        />

        <footer
            class="footer"
            @click="selectTicketFn('',-1)"
        >
            不使用问诊券
            <label for="unusableTicket" class="labelFor">
                <input v-model="selectTicket" value="unusableTicket" id="unusableTicket" type="radio" />
            </label>
        </footer>
    </div>
</template>

<script>
    import defaultImage from 'components/common/defaultImage';
    import vm from 'src/main';
    import {getEnableVoucherList} from 'services';

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

        created(){
            this.selectTicket=this.query.voucherNo;
            vm.$on('refreshSelectInquiryTicketIndex',this.getEnableList);
        },

        mounted(){
            //获取可用问诊劵
            this.getEnableList();
        },

        beforeDestroy(){
            vm.$off('refreshSelectInquiryTicketIndex');
        },

        methods:{
            getEnableList(){
                this.showDefaultImage=false;
                getEnableVoucherList(this.params,(res)=>{
                    this.ticketList=res.body;
                    if(this.ticketList&&this.ticketList.length==0){
                        this.showDefaultImage=true;
                    }
                });
            },
            selectTicketFn(item,index){
                this.$router.push({
                    path:'/payment',
                    query:Object.assign(this.query,{
                        voucherNo:item.voucherNo,
                    }),
                });
            },
            createId(index){
                return `selectInquiryTicketIndex${index}`;
            },
        },

        components:{
            defaultImage,
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .selectInquiryTicketIndex{
        .ticketList{
            @include ticketList;
        }
        .footer{
            width: 100%;
            height: $height1;
            line-height: $height1;
            text-align: center;
            border-top: $border1;
            background-color: #fff;
            position: fixed;
            left: 0;
            bottom: 0;
            z-index: 1000
        }
    }
</style>