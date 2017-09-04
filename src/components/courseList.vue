<template>
    <div id="courseList">
        <div class="content" id="content">
        <div v-for="(course,index) in list" :key="index" @click="toDetail(course.id)">
            <mu-row gutter class="row">
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
        </div>
        <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore" />
    </div>
</template>
<script>
import EventBus from '@/event-bus'
export default {
    name: 'courseList',
    data() {
        return {
            list: [],
            num: 10,
            loading: false,
            scroller: null,
            pageSize: 20,
            pageNum: 1
        }
    },
    props: {
        coursesUrl: {
            type: String
        },
        search_text: {
            type: String
        },
        d_id: {
            type: Number
        },
        g_id: {
            type: Number
        },
        s_id: {
            type: Number
        },
        url: {
            type: String
        }
    },
    mounted() {
        this.scroller = this.$el
    },
    methods: {
        loadMore() {
            const _self = this
            this.loading = true
            setTimeout(() => {
                _self.getCourse()
                this.loading = false
            }, 2000)
        },
        getCourse(data) {
            const _self = this

            let params = {
                    pageNum: _self.pageNum,
                    s_id: data.s_id,
                    pageSize: _self.pageSize,
                    g_id: data.g_id,
                    d_id: data.d_id,
                    title: data.search_text
                }
            if(typeof data.search_text === 'undefined'){
                params.title = ''
            }
            console.log(params)
            this.$http.get(data.url, {
                params: params
            }).then((response) => {
                response = response.body
                if (response.failure.length === 0) {
                    if (this.list.length === 0) {
                        this.list = response.success
                    } else {
                        this.list = this.list.concat(response.success)
                    }
                    if (parseInt(_self.pageNum) < parseInt(response.total)) {
                        _self.pageNum++
                    }

                }
            })
        },
        toDetail(cid){
            window.location.href = '/CourseDetail/'+cid
        }
    },
    created() {
        const _self = this
        this.getCourse({
            s_id: _self.s_id,
            g_id: _self.g_id,
            d_id: _self.d_id,
            title: _self.search_text,
            url: _self.url
        });

        console.log('---')
        EventBus.$on("seacrch-course", function(msg) {
            console.log(msg)
            _self.getCourse({
                s_id: msg.s_id,
                g_id: msg.g_id,
                d_id: msg.d_id,
                title: msg.query,
                url: msg.url
            });
        })
    },
    async asyncData() {

    },
    activated() {

    }
};

</script>
<style lang="stylus" scoped>
#courseList 
    .row
        padding:2rem 1rem
        border-bottom:1px solid #ddd
        .course-list-left 
            // position: relative;
            width: 100%
            height: 8rem
            cursor: pointer
            img 
                width: 100%
                height: 100%
        .course-list-right
            text-align:left
            h1
                padding:0
                margin:0
                font-size:1.5rem
                line-height:1.5
                font-weight:700
            p
                position: relative
                line-height: 20px
                max-height: 5rem
                font-size:1.1rem
                line-height:1.5
                overflow: hidden
                font-weight:400
                &.introduction-text
                    color:#b2b2b2
                // &::after
                //     content: "..."
                //     position: absolute
                //     bottom: 0
                //     right: 0
                //     padding-left: 3rem
                //     background: -webkit-linear-gradient(left, transparent, #fff 55%)
                //     background: -o-linear-gradient(right, transparent, #fff 55%)
                //     background: -moz-linear-gradient(right, transparent, #fff 55%)
                //     background: linear-gradient(to right, transparent, #fff 55%)
                //     color:#666
        .total-time 
            position: absolute
            line-height: 1
            padding: 0
            margin: 0
            right: 5px
            bottom: 5px
            color: #fff
        
        .current-time 
            position: absolute
            padding: 2px
            margin: 0
            background: rgba(0, 0, 0, 0.7)
            color: #fff
            bottom: 0
            width: 100%
            text-align: center
.demo-infinite-container
    width: 256px
    height: 300px
    overflow: auto
    -webkit-overflow-scrolling: touch
    border: 1px solid #d9d9d9
           
    

</style>
