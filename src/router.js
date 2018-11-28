import App from 'src/App'

//定义组件
//测试
const test=()=>import('pages/test/test');

//首页
const home=()=>import('pages/home/home');

//搜索医生
const searchDoctor=()=>import('pages/searchDoctor/searchDoctor');

//找医生
const findDoctor=()=>import('pages/findDoctor/findDoctor');


//专家问诊
const specialist=()=>import('pages/specialist/specialist');

//专家问诊首页
const specialistIndex=()=>import('pages/specialist/children/specialistIndex');

//医生简介
const doctorIntroduction=()=>import('pages/specialist/children/doctorIntroduction');

//选择问诊人
const selectPerson=()=>import('pages/specialist/children/selectPerson');

//新增问诊人
const selectPersonAdd=()=>import('pages/specialist/children/selectPersonAdd');

//添加新问诊人
const addNewPerson=()=>import('pages/specialist/children/addNewPerson');

//添加新问诊人
const basicHealthInfo=()=>import('pages/specialist/children/basicHealthInfo');

//患者评价
const patientEvaluation=()=>import('pages/specialist/children/patientEvaluation');


//支付
const payment=()=>import('pages/payment/payment');

//支付首页
const paymentIndex=()=>import('pages/payment/children/paymentIndex');

//选择问诊劵
const selectInquiryTicket=()=>import('pages/payment/children/selectInquiryTicket/selectInquiryTicket');

//可用问诊劵
const selectInquiryTicketIndex=()=>import('pages/payment/children/selectInquiryTicket/children/selectInquiryTicketIndex');

//不可用问诊劵
const disableInquiryTicket=()=>import('pages/payment/children/selectInquiryTicket/children/disableInquiryTicket');


//用户中心
const user=()=>import('pages/user/user');

//用户中心首页
const userIndex=()=>import('pages/user/children/userIndex');

//我的问诊劵
const myInquiryTicket=()=>import('pages/user/children/myInquiryTicket/myInquiryTicket');

//我的问诊劵首页
const myInquiryTicketIndex=()=>import('pages/user/children/myInquiryTicket/children/myInquiryTicketIndex');

//使用记录
const usageRecord=()=>import('pages/user/children/myInquiryTicket/children/usageRecord');

//药品订单
const drugOrders=()=>import('pages/user/children/drugOrders/drugOrders');

//药品订单列表
const drugOrdersIndex=()=>import('pages/user/children/drugOrders/children/drugOrdersIndex');

//药品订单详情
const drugOrdersDetail=()=>import('pages/user/children/drugOrders/children/drugOrdersDetail');

//物流信息
const logisticsInfo=()=>import('pages/user/children/drugOrders/children/logisticsInfo');

//去评价
const toEvaluation=()=>import('pages/user/children/drugOrders/children/toEvaluation');

//查看评价
const checkEvaluation=()=>import('pages/user/children/drugOrders/children/checkEvaluation');

//我的问诊
const myInquiry=()=>import('pages/user/children/myInquiry/myInquiry');

//我的问诊首页
const myInquiryIndex=()=>import('pages/user/children/myInquiry/children/myInquiryIndex');

//我的问诊详情
const myInquiryDetail=()=>import('pages/user/children/myInquiry/children/myInquiryDetail');

//取消问诊
const cancelInquiry=()=>import('pages/user/children/myInquiry/children/cancelInquiry');

//在线配药
const dispenseMedicines=()=>import('pages/user/children/myInquiry/children/dispenseMedicines');

//去评价问诊
const toEvaluationWZ=()=>import('pages/user/children/myInquiry/children/toEvaluationWZ');

//查看评价问诊
const checkEvaluationWZ=()=>import('pages/user/children/myInquiry/children/checkEvaluationWZ');

//地址管理
const addressAdmin=()=>import('pages/user/children/addressAdmin/addressAdmin');

//地址管理首页
const addressAdminIndex=()=>import('pages/user/children/addressAdmin/children/addressAdminIndex');


//404页面
const page404=()=>import('pages/page404/page404');


//配置路由规则
export default[{
    path:'/',
    component:App, //顶层路由，对应index.html
    children:[ //二级路由。对应App.vue
        {
            path:'',
            redirect:'/home',
        },
        //测试页面
        {
            path:'/test',
            component:test,
            meta:{
                noLogin:true,
                keepPos:true,
            },
        },
        //首页
        {
            path:'/home',
            component:home,
        },
        //搜索医生
        {
            path:'/searchDoctor',
            component:searchDoctor,
        },
        //找医生
        {
            path:'/findDoctor',
            component:findDoctor,
        },
        //专家问诊
        {
            path:'/specialist',
            component:specialist,
            children:[
                {
                    path:'',//专家问诊首页
                    component:specialistIndex,
                },
                {
                    path:'doctorIntroduction',//医生简介
                    component:doctorIntroduction,
                },
                {
                    path:'selectPerson',//选择问诊人
                    component:selectPerson,
                },
                {
                    path:'selectPersonAdd',//新增问诊人
                    component:selectPersonAdd,
                },
                {
                    path:'addNewPerson',//添加新问诊人
                    component:addNewPerson,
                },
                {
                    path:'basicHealthInfo',//基本健康信息
                    component:basicHealthInfo,
                },
                {
                    path:'patientEvaluation',//患者评价
                    component:patientEvaluation,
                },
            ],
        },
        //支付方式
        {
            path:'/payment',
            component:payment,
            children:[
                {
                    path:'',//支付方式首页
                    component:paymentIndex,
                },
                {
                    path:'selectInquiryTicket',//选择问诊劵
                    component:selectInquiryTicket,
                    children:[
                        {
                            path:'',//可用问诊劵
                            component:selectInquiryTicketIndex,
                        },
                        {
                            path:'disableInquiryTicket',//不可用问诊劵
                            component:disableInquiryTicket,
                        },
                    ],
                },
            ],
        },
        //用户中心
        {
            path:'/user',
            component:user,
            children:[
                {
                    path:'',//用户中心首页
                    component:userIndex,
                },
                {
                    path:'myInquiryTicket',//我的问诊劵
                    component:myInquiryTicket,
                    children:[
                        {
                            path:'',//可用问诊劵
                            component:myInquiryTicketIndex,
                        },
                        {
                            path:'usageRecord',//使用记录
                            component:usageRecord,
                        },
                    ],
                },
                {
                    path:'drugOrders',//药品订单
                    component:drugOrders,
                    children:[
                        {
                            path:'',//药品订单列表
                            component:drugOrdersIndex,
                        },
                        {
                            path:'drugOrdersDetail',//药品订单详情
                            component:drugOrdersDetail,
                        },
                        {
                            path:'logisticsInfo',//物流信息
                            component:logisticsInfo,
                        },
                        {
                            path:'toEvaluation',//去评价
                            component:toEvaluation,
                        },
                        {
                            path:'checkEvaluation',//查看评价
                            component:checkEvaluation,
                        },
                    ],
                },
                {
                    path:'myInquiry',//我的问诊
                    component:myInquiry,
                    children:[
                        {
                            path:'',//我的问诊首页
                            component:myInquiryIndex,
                        },
                        {
                            path:'myInquiryDetail',//我的问诊详情
                            component:myInquiryDetail,
                        },
                        {
                            path:'cancelInquiry',//取消问诊
                            component:cancelInquiry,
                        },
                        {
                            path:'dispenseMedicines',//在线配药
                            component:dispenseMedicines,
                        },
                        {
                            path:'toEvaluationWZ',//去评价问诊
                            component:toEvaluationWZ,
                        },
                        {
                            path:'checkEvaluationWZ',//查看评价问诊
                            component:checkEvaluationWZ,
                        },
                    ],
                },
                {
                    path:'addressAdmin',//地址管理
                    component:addressAdmin,
                    children:[
                        {
                            path:'',//地址管理首页
                            component:addressAdminIndex,
                        },
                    ],
                },
            ],
        },
        //404页面
        {
            path:'*',
            component:page404,
        },
    ]
}]