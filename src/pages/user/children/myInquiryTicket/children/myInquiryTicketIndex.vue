<template>
    <div class="myInquiryTicketIndex">
        <ul
            v-if="ticketList&&ticketList.length>0"
            class="ticketList my"
        >
            <li
                v-for="(item,index) in ticketList"
            >
                <div class="main">
                    <div class="wrap">
                        <h3>免费问诊</h3>
                        <h4>有效期：{{item.validity}}</h4>
                        <h5>仅限{{item.itemCodeText}}使用</h5>
                    </div>

                    <div class="btWrap">
                        <a
                            @click="toUse(item,index)"
                        >
                            去使用
                        </a>
                        <a>已使用</a>
                    </div>
                </div>
                <div class="end">
                    注：{{item.sourceText}}
                </div>
            </li>
        </ul>
        <defaultImage
            :show="showDefaultImage"
            :showIndex="2"
        />
    </div>
</template>

<script>
    import defaultImage from 'components/common/defaultImage';
    import vm from 'src/main';
    import {searchMyVoucher} from 'services';

    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
                ticketList:[],
                selectTicket:'',
                showDefaultImage:false,
            }
        },

        created(){
            vm.$on('refreshMyInquiryTicketIndex',this.getMyVoucher);
        },

        mounted(){
            //获取可用问诊劵
            this.getMyVoucher();
        },

        beforeDestroy(){
            vm.$off('refreshMyInquiryTicketIndex');
        },

        methods:{
            getMyVoucher(){
                this.showDefaultImage=false;
                searchMyVoucher([],(res)=>{
                    this.ticketList=res.body;
                    if(this.ticketList&&this.ticketList.length==0){
                        this.showDefaultImage=true;
                    }
                });
            },
            toUse(item,index){
                this.$router.push({
                    path:'/findDoctor',
                    query:{
                        itemCode:item.itemCode,
                    },
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

    .myInquiryTicketIndex{
        .ticketList{
            @include ticketList;
        }
    }
</style>