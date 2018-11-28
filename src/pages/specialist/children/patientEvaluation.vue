<template>
    <div class="patientEvaluation">
        <header1
            :title="`患者评价(${query.commentTotal})`"
        />

        <section class="content">
            <evaluationList
                :api="getComments"
                :params="params"
            />
        </section>
    </div>
</template>

<script>
    import evaluationList from 'components/common/evaluationList';
    import {getComments} from 'services';
    import {getImgUrl} from 'js/yydjs';

    export default{
        data(){
            return{
                query:this.$router.currentRoute.query,
                params:[
                    this.$router.currentRoute.query.id,
                    1,
                    20,
                ],
                count:0,
                getComments,
            }
        },

        mounted(){

        },

        methods:{

        },

        components:{
            evaluationList,
        },
    }
</script>

<style lang="scss" scoped>
    @import '~css/public.scss';

    .patientEvaluation{

    }
</style>