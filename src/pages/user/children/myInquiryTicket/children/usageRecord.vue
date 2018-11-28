<template>
    <div class="usageRecord">
        <ul
            v-if="ticketList&&ticketList.length>0"
            class="ticketList my disabled"
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
                        <a>去使用</a>
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
        />
    </div>
</template>

<script>
    import defaultImage from 'components/common/defaultImage';
    import vm from 'src/main';
    import {searchMyVoucherUsed} from 'services';

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
            vm.$on('refreshUsageRecord',this.getMyVoucherUsed);
        },

        mounted(){
            //获取可用问诊劵
            this.getMyVoucherUsed();
        },

        beforeDestroy(){
            vm.$off('refreshUsageRecord');
        },

        methods:{
            getMyVoucherUsed(){
                this.showDefaultImage=false;
                searchMyVoucherUsed([],(res)=>{
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

    .usageRecord{
        .ticketList{
            @include ticketList;
        }
    }
</style>