<template>
    <div id="video">
        <div class="container">
            <!-- <p class="test">test</p> -->
            <div id="dplayer2"></div>
        </div>
        <div class="courseF-button-wrapper">
            <button @click="toNext">下一课时</button>
            <button @click="textOpen">字幕</button>
            <button>离线缓存</button>
        </div>
        <mu-dialog :open="setPointDialog" :title="discussType === 1?'划重点':'有疑问'" @close="close">
            <div class="canvas-wrapper" ref="canvas"></div>
            <mu-text-field :hintText="discussType === 1?'请输入重点':'请输入疑问'" multiLine :rows="3" :rowsMax="6" class="point-textarea" underlineFocusClass="point-focus-state" fullWidth v-model="comment" />
            <div class="dialog-checkbox-wrapper" v-show="discussType == 1">
                <mu-radio name="group" v-model="flag" nativeValue="0" label="所有人可见" class="demo-checkbox" />
                <br>
                <mu-radio name="group" v-model="flag" label="仅好友可见" class="demo-checkbox" nativeValue="1" />
                <br>
                <mu-radio name="group" v-model="flag" label="私密" class="demo-checkbox" nativeValue="2" />
            </div>
            <mu-flat-button slot="actions" @click="close" label="取消" class="point-cancel" color="#ccc" />
            <mu-flat-button slot="actions" class="point-submit" @click="submitPoint" label="确定" secondary/>
        </mu-dialog>
        <!-- <div class="subtitle">{{lessonData.subtitle}}</div> -->
        <mu-dialog :open="textDialog" title="音频字幕" @close="textClose">
            {{lessonData.subtitle}}
            <mu-flat-button slot="actions" class="point-submit" @click="textClose" label="确定" secondary/>
        </mu-dialog>
    </div>
</template>
<style type="text/css" src="components/DPlayer.min.css"></style>
<style lang="stylus">
#video
    height:100%
    overflow:hidden
    .point-focus-state
        color:$theme.primary
        background:$theme.primary
    .test
        top:0
        position:absolute
        z-index:999
        color:#fff
    #dplayer2
        &.dplayer
            width:100%
            height:100%
    .dplayer 
        &.dplayer-video-wrap 
            &.dplayer-video
                height:13rem
    // #dplayer2 
        // margin-top: 40px;
    .mu-text-field
        width:100%
    .point-textarea
        width:100%
    .subtitle 
        position: absolute;
        top: 0;
        padding: 30px;
        width: 100%;
        height: 200px;
        color: #fff;
        background: rgba(0, 0, 0, 0.7);
        text-align: center;
        overflow: auto;
    .mu-flat-button
        &.point-cancel
            .mu-flat-button-label
                color:$theme.primary
        &.point-submit
            .mu-flat-button-label
                color:$theme.primary
.canvas-wrapper
    width:100%;
    height:10rem;
    canvas
        width:100%
        height:100% 
        overflow:hidden
.dplayer-setpoint,.dplayer-question
    cursor: pointer
.courseF-button-wrapper
    display:flex
    justify-content:space-between
    padding:1rem
    padding-top:0
    button
        padding:0.2rem 0.4rem
        border:1px solid $theme.primary
        color:$theme.primary
        border-radius:2px    

</style>
<!-- <script type="text/javascript" src="./hls.min.js"></script> -->
<!-- <script type="text/javascript" src="./DPlayer.min.js"></script> -->
<script>
import DPlayer from 'DPlayer';
import EventBus from '@/event-bus';

export default {
    name: 'video',
    data() {
        return {
            dpi: null,
            discussData: [],
            discussType: 1,
            count: 0,
            end_time: 0,
            current: 0,
            lessonData: {},
            setPointDialog: false,
            textDialog:false,
            cid: 0,
            time: 0,
            id: 0,
            point_time: 0,
            cover: '',
            flag: "0",
            comment: ''
        }
    },
    props: {
        // lessonData: {
        //     type: Object
        // },
        autoContinue: {
            type: Boolean,
            default () {
                return true
            }
        },
        nextId: {
            type: Number,
            default () {
                return 2
            }
        }
    },
    created() {
        this.cid = this.$route.params.cid
        this.time = this.$route.params.time
        this.id = this.$route.params.id
        // alert(this.$route.params.cid)
        // alert(this.$route.params.time)
        // alert(this.$route.params.id)
        const _self = this;
        window.onunload = function() {　
            _self.$http.post('/history/record', {
                lesson_id: _self.lessonData.id,
                point: _self.current
            }).then((response) => {
                response = response.body
                if (response.failure.length === 0) {
                    console.log('success')
                } else {
                    alert(response.failure[0])
                }

            })
        }
    },
    methods: {
        getDiscussionByPoint(point_time) {
            const _self = this;
            this.$http.get('/discuss/' + this.$route.params.id + '/lesson/' + this.discussType, {
                params: {
                    point_time: point_time
                }
            }).then((response) => {
                response = response.body
                if (response.failure.length === 0) {
                    console.log(response)
                    _self.discussData = response.success
                    _self.count = point_time;
                    console.log('取数据时间点：' + _self.count)
                    _self.bus.$emit("getDiscuss", {
                        discuss: _self.discussData,
                        point_time: _self.count
                    });
                } else {
                    alert(response.failure[0])
                }

            })
        },
        handleUrl() {
            var url = window.location.hash; //获取url中"?"符后的字串
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr((url.indexOf("?") + 1));
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        },
        open() {
            const _self = this;
            setTimeout(function() {
            let element = document.getElementsByClassName('dplayer-video-current')[0];
            const canvas = document.createElement("canvas");
            
            canvas.getContext('2d').drawImage(element, 0, 0, canvas.width, canvas.height);
            console.log(_self.$refs.canvas)
                _self.$refs.canvas.appendChild(canvas)
                _self.cover = canvas;
            })
            
            this.setPointDialog = true
        },
        close() {
            this.setPointDialog = false;
            this.dpi.play();
        },
        textOpen(){
            this.textDialog = true
        },
        textClose(){
            this.textDialog = false
        },
        submitPoint() {
            this.point_time = document.getElementsByClassName('dplayer-ptime')[0].innerHTML;

            const _self = this;
            const params = {
                type: _self.discussType,
                flag: parseInt(_self.flag),
                content: _self.comment,
                lesson_id: parseInt(_self.id),
                point_time: _self.point_time,
                cover: JSON.stringify(_self.cover)
            }
            console.log('------------')
            console.log(params)
            this.$http.post('/discuss/note',  { params: params }).then((response) => {
                response = response.body
                // console.log(response)
                if (response.failure.length === 0) {
                    console.log(response)
                    this.close();
                    this.comment = '';
                    alert('发送成功');
                    this.dpi.play();
                    // this.lessonData = response.success
                } else {
                    alert(response.failure[0])
                }

            })
        },
        toNext() {
            // 请求，判断类型
            const nextId = this.lessonData.next
            this.$http.get('/lesson/' + nextId).then((response) => {
                response = response.body
                // console.log(response)
                if (response.failure.length === 0) {
                    let type = response.success.type
                    console.log(window.location)
                    if (type === 0) {

                        window.location.pathname = '/player/'+this.cid+'/0/video/' + nextId
                    } else if (type === 1) {
                        window.location.pathname = '/player/'+this.cid+'/0/audio/' + nextId
                    } else {
                        window.location.pathname = '/player/'+this.cid+'/0/page/' + nextId
                    }
                } else {
                    alert(response.failure[0])
                }

            })
        }
    },
    computed: {},
    beforeRouteEnter(to, from, next) {
        next(vm => {

            vm.$http.get('/lesson/' + to.params.id).then((response) => {
                response = response.body
                if (response.failure.length === 0) {
                    vm.lessonData = response.success
                    vm.dpi = new DPlayer({
                        element: document.getElementById('dplayer2'),
                        autoplay: false,
                        theme: '#FADFA3',
                        loop: false,
                        screenshot: true,
                        hotkey: true,
                        logo: '',
                        video: {
                            url: vm.lessonData.url,
                            pic: vm.lessonData.cover,
                            type: 'hls',
                        },
                        contextmenu: [{
                            text: '视频播放遇到问题？',
                            link: 'http://www.baidu.com'
                        }]
                    })
                    const point = vm.handleUrl()['point'];
                    if (typeof point != 'undefined') {
                        vm.dpi.video.current.currentTime = point
                        // vm.getDiscussionByPoint(point);
                    }

                    let current = 0,
                        end_count = 0;
                    try {
                        if (vm.end_time == 0 && vm.dpi.video) {
                            vm.end_time = vm.dpi.video.duration;
                        }
                        end_count = parseInt(vm.end_time / 60) * 60
                    } catch (e) {
                        console.log(e)
                    }
                    // 获取总时长
                    setInterval(function() {
                        try {
                            current = vm.dpi.video.current.currentTime;
                            vm.current = current;
                            // if (parseInt(current / 60) * 60 == vm.count) {} else if (vm.count <= end_count) {
                            //     // 时间点改变，请求数据
                            //     vm.getDiscussionByPoint(parseInt(current / 60) * 60)
                            // }

                            if (vm.autoContinue && Boolean(vm.end_time) && (current === vm.end_time)) {
                                console.log('播放结束')
                                vm.toNext();

                            }
                        } catch (e) {
                            console.log(e)
                        }
                    }, 1000)

                    // 划重点按钮
                    const setPoint = document.getElementsByClassName('dplayer-setpoint')[0]
                    // 有疑问按钮
                    const setQuestion = document.getElementsByClassName('dplayer-question')[0]
                    console.log(setPoint);
                    setPoint.onclick = function() {
                        vm.discussType = 1;
                        vm.open();
                        vm.dpi.pause()
                    }
                    setQuestion.onclick = function() {
                        vm.discussType = 2;
                        vm.open()
                        vm.dpi.pause()
                    }

                } else {
                    alert(response.failure[0])
                }

            })


        })

    }
}

</script>
