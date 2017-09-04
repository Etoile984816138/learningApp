<template>
    <div id="page">
        <div class="container">
            <!--  src="https://cdn.mozilla.net/pdfjs/tracemonkey.pdf"-->
            <pdf :src="lessonData.url" :page="page" @numPages="numPages = $event"></pdf>
            <!-- <pdf src="https://cdn.mozilla.net/pdfjs/tracemonkey.pdf" :page="page" @numPages="numPages = $event"></pdf> -->
            <div class="function-wrapper">
                <mu-icon-button tooltip="上一页" icon="keyboard_arrow_left" @click="minusPage" />
                <input type="number" v-model.number="page" class="pdf_current_page">
                <span>/{{numPages}}</span>
                <mu-icon-button tooltip="下一页" icon="keyboard_arrow_right" @click="addPage" />
                <span class="margin">前往</span>
                <input type="number" v-model.number="goNum">
                <span>页</span>
                <mu-icon-button tooltip="前往" icon="trending_flat" @click="goPage" />
            </div>
        </div>
        <div class="courseF-button-wrapper">
            <button @click="toNext">下一课时</button>
            <button @click="open">划重点</button>
            <button @click="open">有疑问</button>
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
    </div>
</template>
<style lang="stylus">
@main-color: $theme.primary;
#page 
    width:100%
    height:15rem
    .container 
        width: 100%;
        height: 100%;
        overflow: auto;
        padding:0;
        margin:0;
        iframe 
            display: block;
            margin: 0 auto;
            width:100%
            height: 100%;
        
    
    .function-wrapper 
        position: absolute;
        top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background:rgba(0,0,0,0.5)
        color:#fff
        input 
            padding: 5px;
            margin: 0 10px;
            width: 48px;
            border: 1px solid #ccc;
            border-radius: 5px;
        
        span,
        input 
            display: inline-block;
            vertical-align: top;
        span
            // word-
        .mu-icon-button 
            padding: 0;
            color: @main-color;
        
        .margin 
            margin-left: 30px;
.courseF-button-wrapper
    display:flex
    justify-content:space-between
    margin-top:0.5rem
    padding:1rem
    padding-top:0
    button
        padding:0.2rem 0.4rem
        border:1px solid $theme.primary
        color:$theme.primary
        border-radius:2px   
.canvas-wrapper
    width:100%;
    height:10rem;
    overflow:hidden
    canvas
        width:100%
        height:100% 
        overflow:hidden
</style>
<!-- <script type="text/javascript" src="./flv.min.js"></script> -->
<!-- <script type="text/javascript" src="./DPlayer.min.js"></script> -->
<script>
import pdf from 'vue-pdf'
export default {
    data() {
        return {
            page: 1,
            numPages: 0,
            goNum: 1,
            lessonData: {},
            cid: 0,
            id: 0,
            setPointDialog: false,
            point_time: 0,
            cover: '',
            flag: "0",
            comment: '',
            discussType: 1
        }
    },
    mounted() {

    },
    created() {
        this.cid = this.$route.params.cid
        this.page = parseInt(this.$route.params.time)
        this.id = this.$route.params.id
        const _self = this;
        this.$http.get('/lesson/' + this.id).then((response) => {
            response = response.body
            if (response.failure.length === 0) {
                console.log(response)
                _self.discussData = response.success
                const point = this.time;
                if (typeof point != 'undefined') {
                    this.page = parseInt(point);
                }
            } else {
                alert(response.failure[0])
            }

        })


        window.onunload = function() {　
            _self.$http.post('/history/record', {
                lesson_id: _self.lessonData.id,
                point: _self.page
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
        addPage() {
            if (this.page < this.numPages) {
                this.page++;
            }
        },
        minusPage() {
            if (this.page > 0) {
                this.page--;
            }
        },
        goPage() {
            this.page = this.goNum;
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

                        window.location.pathname = '/player/' + this.cid + '/0/video/' + nextId
                    } else if (type === 1) {
                        window.location.pathname = '/player/' + this.cid + '/0/audio/' + nextId
                    } else {
                        window.location.pathname = '/player/' + this.cid + '/0/page/' + nextId
                    }
                } else {
                    alert(response.failure[0])
                }

            })
        },
        open() {
            const _self = this
            setTimeout(function() {
                let page = document.getElementById('page').getElementsByTagName('canvas')[0];
                console.log(page);
                console.log('-----')
                console.log(_self.$refs.canvas)
                _self.$refs.canvas.appendChild(page)
                _self.cover = page;
            }, 100)


            this.setPointDialog = true
        },
        close() {
            this.setPointDialog = false;
        },
        submitPoint() {
            this.point_time = this.page;

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
            this.$http.post('/discuss/note', { params: params }).then((response) => {
                response = response.body
                // console.log(response)
                if (response.failure.length === 0) {
                    console.log(response)
                    this.close();
                    this.comment = '';
                    alert('发送成功');
                    // this.lessonData = response.success
                } else {
                    alert(response.failure[0])
                }

            })
        }

    },
    components: {
        pdf
    }
}

</script>
