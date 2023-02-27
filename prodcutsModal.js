export default{
    props:['addToCart','product'],
    
    // props:{
    //     product:{},
    // },

    data(){
        return{
            modal:{},
            tempproduct:{},
            qty: 1 ,
        }
    },
    template: '#userProductModal',
    methods: {
        openModal(){
            this.modal.show();
        },
        closeModal(){
            this.modal.hide();
        }
    },
    mounted(){
        // bootstrap modal 傳值
        this.modal = new bootstrap.Modal(this.$refs.modal);
    }
}