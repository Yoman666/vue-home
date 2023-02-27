
// import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
// prodcutsModal 元件導入
import prodcutsModal from './prodcutsModal.js';

// prodcutsModal 內嵌時的用法
// const prodcutsModal = {
//     data(){
//         return{
//             modal:{},
//             tempproduct:{},
//         }
//     },
//     template: '#userProductModal',
//     mounted(){
//         // bootstrap modal 傳值
//         this.modal = new bootstrap.Modal(this.$refs.modal);
//     }
// };

// 步驟 3：定義規則
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

// 步驟 4：加入多國語系
loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
});

const apiUrl =  'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'yoyo123456';

Vue.createApp({
    data(){
    return {
        loadingStatus: {
            loadingItem: '',
        },
        products: [],
        product: {},
        form: {
            user: {
            name: '',
            email: '',
            tel: '',
            address: '',
            },
            message: '',
        },
        cart: {},
        };
    },
    // 區域元件定義
    // 表單步驟 2：註冊元件
    components: {
        VForm: Form,
        VField: Field,
        ErrorMessage: ErrorMessage,
        prodcutsModal,
    },

    methods: {
        getProducts(){
            const url = `${apiUrl}/api/${apiPath}/products`;
            axios.get(url).then((res)=>{
                console.log('取得產品列表',res);
                this.products = res.data.products;
            })
        },
        getProduct(id){
            const url = `${apiUrl}/api/${apiPath}/product/${id}`;
            this.loadingStatus.loadingItem = id;
            axios.get(url).then((res)=>{
                console.log('loading',this.loadingStatus.loadingItem);
                console.log('取得單一產品',res);
                
                this.loadingStatus.loadingItem = '';
                this.product = res.data.product;
                // 呼叫元件內的方法打開modal
                this.$refs.userProductModal.openModal();
            })
        },
        // 數量預設1
        addToCart(product_id, qty=1){
            const data = {
                product_id,
                qty
              }
            const url = `${apiUrl}/api/${apiPath}/cart`;
            this.loadingStatus.loadingItem = product_id;

            axios.post(url,{data}).then((res)=>{
                console.log("加入購物車",res.data);
                this.loadingStatus.loadingItem = '';

                // 加入購物車後自動關掉
                this.$refs.userProductModal.closeModal();

                // 點擊加入購物車也需要在呼叫一次
                this.getCarts();
            })
        },

        getCarts(){
            const url = `${apiUrl}/api/${apiPath}/cart`
            axios.get(url).then((res)=>{
                console.log("取得購物車表", res.data);
                // 注意資料取的來源要正確
                this.cart = res.data.data;
            })
        },

        updateCarts(item){
        this.loadingStatus.loadingItem = item.id;

            const data={
                    product_id: item.product.id,
                    qty: item.qty, 
            }

            const url = `${apiUrl}/api/${apiPath}/cart/${item.id}`
            axios.put(url,{data}).then((res)=>{
                this.loadingStatus.loadingItem = '';
                console.log("更新購物車", res.data);
                this.getCarts();
            }).catch((err) => {
                alert(err.response.data.message);
                this.loadingStatus.loadingItem = '';
              });

        },

        deleteitem(item){
            this.loadingStatus.loadingItem = item.id;
            const url = `${apiUrl}/api/${apiPath}/cart/${item.id}`
            axios.delete(url).then((res)=>{
                this.loadingStatus.loadingItem = '';
                console.log("刪除購物車", res.data);
                this.getCarts();
            })

        },
        deleteAllItem(){
            const url = `${apiUrl}/api/${apiPath}/carts`
            axios.delete(url).then((res)=>{
                console.log("刪除全部購物車", res.data);
                this.getCarts();
            })

        },
        createOrder() {
            const url = `${apiUrl}/api/${apiPath}/order`;
            const order = this.form;
            axios.post(url, { data: order }).then((response) => {
              alert(response.data.message);
            //resetForm=>target 內的表單重置
              this.$refs.form.resetForm();
              this.getCarts();
              console.log("送出訂單", response);
              console.log("ref",this.$refs.form)
            })
          },

    },

// 元件區域註冊,不能有兩個components沒有注意到難怪一直跳錯
    // components:{
    //     prodcutsModal,
    // },

    mounted() {
        this.getProducts();
        this.getCarts();   
    },
})
// app.component('VForm', VeeValidate.Form);
// app.component('VField', VeeValidate.Field);
// app.component('ErrorMessage', VeeValidate.ErrorMessage);
.mount("#app");

