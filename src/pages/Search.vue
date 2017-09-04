<template>
    <div id="search">
        <div class="container-wrapper">
            <div class="left-container-wrapper">
                <mu-paper class="sider-menu">
                    <mu-menu :value="activeMenu" @change="handleMenuChange">
                        <mu-menu-item title="全部" :value="zero" @click="choiseDirection(0,'全部类别')" />
                        <mu-menu-item :title="item.name" v-for="(item,index) in directions" :key="index" @click="choiseDirection(item.d_id,item.name)" :value="item.d_id"/>
                    </mu-menu>
                </mu-paper>
            </div>
            <div class="right-container-wrapper">
                <mu-sub-header>{{subtitle}}</mu-sub-header>
                <mu-chip class="generic-chip" v-for="(item,index) in generics" :key="index" @click="toCourse(item.g_id)">
                    {{item.name}}
                </mu-chip>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex';

export default {
    name: 'search',
    data() {
        return {
            query: '',
            loading: false,
            data: [],
            directions: [],
            direction_id: 1,
            generics: [],
            subtitle:"全部类别",
            activeMenu:0,
            g_id:0,
            zero:0
        };
    },
    methods: {
        ...mapActions('appShell/appHeader', [
            'setAppHeader'
        ]),
        ...mapActions('appShell/appBottomNavigator', [
            'showBottomNav',
            'activateBottomNav'
        ]),
        choiseDirection(val,name) {
            this.direction_id = val;
            this.activeMenu = val;
            this.subtitle = name;
            
        },
        handleMenuChange(){
            const _self = this;
            this.$http.get('/direction/' + _self.direction_id).then((response) => {
                response = response.body
                // console.log(response)
                if (response.failure.length === 0) {
                    console.log(response.success)
                    _self.generics = response.success

                } else {
                    alert(response.failure[0])
                }

            })
        },
        toCourse(id){
            window.location.href = '/searchResult/'+ this.direction_id +'/'+id     
        }
    },
    activated() {
        const _self = this;
        this.setAppHeader({
            show: true,
            title: '课程检索',
            showMenu: true,
            showBack: false,
            showLogo: true,
            actions: [{
                icon: 'search',
                route: '/searchResult/'+ _self.direction_id +'/'+_self.g_id
            }]
        });
        this.activateBottomNav('course');
        this.showBottomNav();
    },
    created() {
        this.$http.get('/direction').then((response) => {
                response = response.body
                // console.log(response)
                if (response.failure.length === 0) {
                    console.log('success')
                    this.directions = response.success
                } else {
                    alert(response.failure[0])
                }

            }),
            this.$http.get('/generic').then((response) => {
                response = response.body
                // console.log(response)
                if (response.failure.length === 0) {
                    console.log('success')
                    this.generics = response.success
                    console.log(this.generics)
                } else {
                    alert(response.failure[0])
                }

            })
    }
};

</script>
<style lang="stylus" scoped>
#search
    header
        display flex
        align-items center
        height 52px
        border-bottom:1px solid #ddd;
        // box-shadow 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px rgba(0,0,0,.14), 0 1px 10px rgba(0,0,0,.12)

    form
        flex 1

    .search-input
        width 100%
        outline none
        font-size 16px
        height 50px

    .search-btn
        color #959595

    .search-loading
        margin-top 30%
        display flex
        justify-content center

    .search-content
        margin-top 20px

    li
        list-style-type none
    .container-wrapper
        display:flex
        // margin-top:0.5rem
        .left-container-wrapper
            background:#fcfcfc
            .mu-menu
                background:#f2f2f2
                border:none
        .right-container-wrapper
            padding:1rem
            font-size:0.8rem
            text-align:left
            .mu-chip
                background:#fff
                color:#666
                border:1px solid #ccc
                line-height:2
                margin:0.8rem 0.3rem
                // padding:0 0.5rem
                &.active 
                    background:$theme.primary
                    color:#fff
                    border:none
</style>
