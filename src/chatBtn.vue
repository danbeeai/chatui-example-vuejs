<template>
    <div id="frogue-container">
        <div class="frogue-chat" id="frogue-chat" :class="{ 'show' : frogueChatOpenFlag }">
            <div class="frogue-fullscreen-close" id="frogue-fullscreen-close" @click="frogueBtnElementClick()">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64.19 64.19" xml:space="preserve">
                    <defs>
                        <svg:style type="text/css">
                            .frogue-bg{fill:{{frogueBg}}}
                            .frogue-x{fill:none;stroke:#fff;stroke-linecap:round;stroke-miterlimit:10;stroke-width:2.73px;}
                        </svg:style>
                    </defs>
                    <title>close</title>
                    <g data-name="frogue-close">
                        <circle cx="32.1" cy="32.1" r="32.1" class="frogue-bg"></circle>
                        <line x1="41.58" x2="22.62" y1="22.28" y2="41.24" class="frogue-x"></line>
                        <line x1="41.58" x2="22.62" y1="41.24" y2="22.28" class="frogue-x"></line>
                    </g>
                </svg>
            </div>
            <chat-body></chat-body>
        </div>
        <div class="frogue-launcher" :class="{ 'active' : frogueChatOpenFlag }" id="frogue-launcher" v-show="frogueLauncherReadyFlag" @click="frogueBtnElementClick()">
            <div >
                <div class="frogue-launcher-close-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64.19 64.19" xml:space="preserve">
                        <defs>
                            <svg:style type="text/css">
                                .frogue-bg1{fill:{{frogueBg}}}
                                .frogue-x{fill:{{frogueSubBg}};stroke:{{frogueSubBg}};stroke-linecap:round;stroke-miterlimit:10;stroke-width:2.73px;}
                            </svg:style>
                        </defs>
                        <title>close</title>
                        <g data-name="frogue-close">
                            <circle cx="32.1" cy="32.1" r="32.1" class="frogue-bg1"></circle>
                            <line x1="41.58" x2="22.62" y1="22.28" y2="41.24" class="frogue-x"></line>
                            <line x1="41.58" x2="22.62" y1="41.24" y2="22.28" class="frogue-x"></line>
                            </g>
                        </svg>
                </div>
                <div class="frogue-launcher-open-icon" v-if="frogueIconImg == ''">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64.19 64.19" xml:space="preserve">
                        <defs>
                            <svg:style type="text/css">
                                .frogue-bg{fill:{{frogueBg}}}
                                .frogue-face-tail{fill:#fff;}
                                .frogue-face-lips{fill:none;stroke:#db391b;stroke-linecap:round;stroke-miterlimit:10;stroke-width:1.63px;}
                            </svg:style>
                        </defs>
                        <title>Frogue Luncher</title>
                        <g data-name="frogue-open">
                            <circle cx="32.1" cy="32.1" r="32.1" class="frogue-bg"></circle>
                            <polygon points="22.94 42.64 16.74 55.03 35.33 42.64 22.94 42.64" class="frogue-face-tail"></polygon>
                            <circle cx="32.1" cy="31.69" r="17.67" class="frogue-face-tail"></circle>
                            <path d="M42.34,30.12a9.36,9.36,0,1,1-18.27,4.11" class="frogue-face-lips"></path>
                        </g>
                    </svg>
                </div>
                <div class="frogue-launcher-open-icon" v-if="frogueIconImg != ''">
                    <img class="chatbot-icon-image" width="60px" height="60px" style="width:60px; height:60px;" :src="frogueIconImg" alt="chatbotIconImage" >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ChatBody from './chatBody.vue'

    export default {
        name: 'frogue-container',
        props: [
            'dataChatbot',
            'dataChatbotname',
            'dataServicename',
            'dataUser',
            'dataColor',
            'dataSubcolor',
            'dataIconurl'
        ],
        components: {
            ChatBody
        },
        data() {
            return {

                isContentOpen: true,
                frogueChatbotId: this.dataChatbot || '',
                frogueChatbotName: this.dataChatbotname || '단비Ai',
                frogueServicename: this.dataServicename || '단비Ai',
                frogueUserId: this.dataUser || '',
                frogueBg: this.dataColor || '#4d4e9f',
                frogueSubBg: this.dataSubcolor || '#ffffff',
                frogueIconImg: this.dataIconurl || '',

                frogueLauncherReadyFlag: false,
                frogueChatOpenFlag: false
            };
        },
        methods: {
            frogueBtnElementClick: function() {
                this.frogueChatOpenFlag = !this.frogueChatOpenFlag;
                var bodyElement = document.body;
                if (bodyElement.classList.contains('frogue-opened')) {
                    bodyElement.classList.remove('frogue-opened');
                } else {
                    bodyElement.classList.add('frogue-opened');
                }
            }
        },
        computed: {
        },
        beforeMount(){
        },
        updated(){
        },
        mounted(){
            setTimeout(()=> {
                this.frogueLauncherReadyFlag = true;
            }, 1000);
        },
    }
</script>

<style lang="scss">

</style>
