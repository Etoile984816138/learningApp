<template>
    <div id="home">
        <mu-tabs :value="activeTab" @change="handleTabChange">
            <mu-tab value="tab1" title="推荐" />
            <mu-tab value="tab2" title="前端" />
            <mu-tab value="tab3" title="后端" />
            <mu-tab value="tab4" title="前端" />
            <mu-tab value="tab5" title="后端" />
        </mu-tabs>
        <v-courseList :search_text="search_text" :d_id="d_id" :g_id="g_id" :s_id="s_id" :url="url"></v-courseList>
        <!-- <div class="content" id="content">
            <mu-row gutter v-for="(course,index) in list" class="row" :key="index">
                <mu-col width="40" tablet="40" desktop="40">
                    <div class="course-list-left">
                        <img :src="course.cover">
                    </div>
                </mu-col>
                <mu-col width="60" tablet="60" desktop="60" class="course-list-right">
                    <h1>{{course.title}}</h1>
                    <p class="introduction-text">{{course.description}}</p>
                </mu-col>
            </mu-row>
        </div>
        <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore" /> -->
    </div>
</template>
<script>
import { mapActions } from 'vuex';
import courseList from 'components/courseList.vue'
export default {
    name: 'home',
    data() {
        return {
            search_text: '',
            d_id: 0,
            g_id: 0,
            s_id: 0,
            url: '/course/commendations/1',
            activeTab: 'tab1'
        }
    },
    props: {

    },
    methods: {
        ...mapActions('appShell/appHeader', [
            'setAppHeader'
        ]),
        ...mapActions('appShell/appBottomNavigator', [
            'showBottomNav',
            'activateBottomNav'
        ]),
        handleTabChange(val) {
            this.activeTab = val
        },

    },
    created() {},
    async asyncData() {
        await new Promise((resolve, reject) => {
            setTimeout(resolve, 500);
        });

    },
    activated() {
        this.setAppHeader({
            show: true,
            title: '课程推荐',
            showMenu: true,
            showBack: false,
            showLogo: true,
            actions: [{
                icon: 'search',
                route: '/search'
            }]
        });
        this.activateBottomNav('home');
        this.showBottomNav();
    },
    components: {
        'v-courseList': courseList
    }
};

</script>
<style lang="stylus">
    .mu-tabs
        background:#fff
        .mu-tab-text
            color:#666
        .mu-tab-link.mu-tab-active
            .mu-tab-text
                color:#000

</style>
