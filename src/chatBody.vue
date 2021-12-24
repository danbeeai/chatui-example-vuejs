<template>
    <div class="container">
        <div class="loading-page" v-show="!frogueChatViewFlag">
            <h4>Loading...</h4>
            <img :src="frogueChatLoadUrl" alt="단비가 내리면, 개구리가 운다! 단비Ai에서 제공하는 채팅창" width="300" height="300">
            <div v-if="adBuootnYn == 'true'">frogue by 단비Ai</div>
        </div>
        <div class="frogue-pond" v-show="frogueChatViewFlag" :style="cssProps" v-bind:class="{removeBanner: adBuootnYn != 'true', opened: isOpened}" >
            <div class="frogue-screen">
                <div id="chatBody" class="frogue-container">
                    <!-- chat start -->
                    <div class="frogue-content-wrapper" v-bind:class="{opened: isOpened}">
                        <!-- chat head start -->
                        <div class="frogue-header">
                            <div class="pull-left">
                                <div class="chatbot-profile-wrapper">
                                    <img width="40" height="40" :src="currentChatbot.chatbotImg" alt="챗봇 이미지" @click="startRecording()">
                                </div>
                                <span class="chatbot-name"> {{ currentChatbot.chatbotName }} </span>

                            </div>
                        </div>
                        <!-- chat head end -->
                        <!-- chat body start (scroll) -->
                        <div id="chattingPanel" class="chat-discussion">
                            <!-- chatList loop start -->
                            <div v-for="(chat, index) in chatList" :key="chat.index">
                                <!-- 사용자 말풍선 -->
                                <div v-if="chat.type=='question'" class="chat-message right">
                                    <div class="message">
                                        <span class="message-date">{{chat.timestamp}}</span>
                                        <div>
                                            <span class="message-content" v-html="chat.sentence">{{chat.sentence}}</span>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="chat.type=='imageUpload'" class="chat-message right">
                                    <div class="message">
                                        <span class="message-date">{{chat.timestamp}}</span>
                                        <div class="img-container">
                                            <a class="img-overlay" title="이미지 크게보기" v-bind:href="chat.sentence" target="_blank"><span>+</span></a>
                                            <img v-bind:src="chat.sentence" class="img-square"/>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="chat.type=='fileUpload'" class="chat-message right">
                                    <div class="message">
                                        <span class="message-date">{{chat.timestamp}}</span>
                                        <div>
                                    <span class="message-content">
                                        <a title="파일 다운로드" v-bind:href="chat.sentence" target="_blank" class="file-download-btn">
                                        <div class="file-icon-container">
                                            <svg class="btn-img" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 46.3 46.3" style="enable-background:new 0 0 46.3 46.3;" xml:space="preserve">
                                                <g>
                                                    <g>
                                                        <path class="svg-file-box" d="M24.9,13.6l5.7,6v13h-15v-19H24.9 M25,11.6h-9.7c-0.9,0-1.7,0.8-1.7,1.7v19.6c0,0.9,0.8,1.7,1.7,1.7H31
                                                            c0.9,0,1.7-0.8,1.7-1.7V19.5c0-0.4-0.2-0.9-0.5-1.2l-5.9-6.1C25.9,11.8,25.5,11.7,25,11.6z"></path>
                                                        <path class="svg-file-line" d="M23.9,12.6v7.1c0,0.5,0.4,0.9,0.9,0.9h6.8"></path>
                                                    </g>
                                                </g>
                                            </svg>
                                            </div>{{chat.sentence}}<!--파일명만 추출 String fileName = url.substring( url.lastIndexOf('/')+1, url.length() ); -->
                                        </a>
                                    </span>
                                        </div>
                                    </div>
                                </div>
                                <!-- 챗봇 말풍선 :: 정상 응답 -->
                                <div v-else-if="chat.type=='answer'" class="chat-message left">
                                    <!-- 챗봇 답변 형태에 따라 모양 달라짐 : carousel, one_carousel 이나 이미지가 있는 답변, askBack -->
                                    <!-- 1 :: 캐로셀일때 -->
                                    <div v-if="chat.nodeType == 'carousel'">
                                        <div class="message" v-if="chat.sentence != ''">
                                            <span class="message-date">{{chat.timestamp}}</span>
                                            <div class="message-content" v-html="chat.sentence">{{chat.sentence}}</div>
                                        </div>
                                        <div class="message message-carousel-container">
                                            <!-- <span class="message-date">{{chat.timestamp}}</span> -->
                                            <no-ssr placeholder="Loading...">
                                                <agile ref="carousel" :id="'carousel_' + index">
                                                    <div v-for="(carousel, carouselIdx) in chat.carouselList" :key="carousel.index" class="slide">
                                                        <div>
                                                            <div class="img-container">
                                                                <!-- <img v-bind:src="carousel.imgRoute" class="img-square"/> -->
                                                                <div class="img-square-bg" v-bind:style="{backgroundImage: 'url('+carousel.imgRoute+')'}"> </div>
                                                            </div>
                                                            <span class="db-carousel-title">{{carousel.cardTitle || ''}}</span>
                                                            <div v-if="carousel.imgRoute === '' && carousel.cardTitle" style="height:30px" ></div>
                                                            <div class="db-carousel-desc">{{carousel.subCardTitle || ''}}</div>
                                                            <div v-for="option in carousel.optionList" :key="option.id">
                                                                <button type="button" @click="optionClick(option, carouselIdx)" class="btn-option-list" :class="{'db-link-btn':(option.type != 'btn'), disabled: option.isDisabled, 'selected': option.isSelected, 'maintain' : (option.type == 'call') || (option.type == 'link') }">
                                                                    <div v-if="option.type=='btn'">
                                                                        <span class="db-answer-btn p-r-none">{{option.label}}</span>
                                                                    </div>
                                                                    <div v-else-if="option.type=='callFlow'">
                                                                        <span class="db-answer-btn p-r-none">{{option.label}}</span>
                                                                    </div>
                                                                    <div v-else-if="option.type=='call'" >
                                                                        <div class="btn-icon-type"> <i class="fa fa-phone" title="전화걸기"></i> </div>
                                                                        <div class="btn-option-text"> <span class="db-answer-btn">{{option.label}}</span> </div>
                                                                    </div>
                                                                    <div v-else-if="option.type=='outApp'" title="외부앱 링크">
                                                                        <div class="btn-icon-type"> <i class="fa fa-external-link" title="외부앱 링크"></i> </div>
                                                                        <div class="btn-option-text"> <span class="db-answer-btn">{{option.label}}</span> </div>
                                                                    </div>
                                                                    <div v-else-if="option.type=='inApp'" title="내부앱 링크">
                                                                        <div class="btn-icon-type"> <i class="fa fa-external-link-square" title="내부앱 링크"></i> </div>
                                                                        <div class="btn-option-text"> <span class="db-answer-btn">{{option.label}}</span> </div>
                                                                    </div>
                                                                    <div v-else-if="option.type=='link'" title="웹링크">
                                                                        <div class="btn-icon-type"> <i class="fa fa-link" title="웹링크"></i> </div>
                                                                        <div class="btn-option-text"> <span class="db-answer-btn">{{option.label}}</span> </div>
                                                                    </div>
                                                                    <div v-else-if="option.type=='action'" title="액션">
                                                                        <div class="btn-icon-type"> <i class="fa fa-bolt" title="액션"></i> </div>
                                                                        <div class="btn-option-text"> <span class="db-answer-btn">{{option.label}}</span> </div>
                                                                    </div>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </agile>
                                            </no-ssr>
                                        </div>
                                    </div>
                                    <!-- 2 :: 캐로셀이 아니고 노드타입이 설정되지 않았을 때  -->
                                    <div v-if="chat.nodeType == undefined || chat.nodeType != 'carousel'">
                                        <div class="message">
                                            <span class="message-date">{{chat.timestamp}}</span>
                                            <!-- 2-1 :: 캐로셀에 카드 한장일 때 -->
                                            <div v-if="chat.nodeType == 'one_carousel'" class="one-carousel">
                                                <div class="img-container">
                                                    <div class="img-square-bg" v-bind:style="{backgroundImage: 'url('+chat.imgRoute+')'}"></div>
                                                </div>
                                                <span class="db-carousel-title">{{chat.cardTitle || ''}}</span>
                                                <div v-if="chat.imgRoute == '' && chat.cardTitle" style="height:30px"></div>
                                                <div class="db-carousel-desc">{{chat.subCardTitle || ''}}</div>
                                            </div>
                                            <!-- 2-2 :: 이미지 있는 메시지 -->
                                            <div v-if="chat.nodeType != 'one_carousel'">
                                                <div v-show="chat.imgRoute != undefined && chat.imgRoute != ''" class="img-container">
                                                    <a class="img-overlay" title="이미지 크게보기" v-bind:href="chat.imgRoute" target="_blank"> <span>+</span> </a>
                                                    <img v-bind:src="chat.imgRoute" class="img-square" />
                                                    <!-- <div class="img-square" v-bind:style="{backgroundImage: 'url('+chat.imgRoute+')'}"> </div> -->
                                                </div>
                                            </div>
                                            <div class="message-content" v-html="chat.sentence">{{chat.sentence}}</div>
                                        </div>
                                        <div v-if="chat.optionList.length > 0" class="button-container">
                                            <div v-for="option in chat.optionList" :key="option.id">
                                                <div v-if="option.type!='quick'">
                                                    <button type="button" @click="optionClick(option)" class="btn-option-list" :class="{'db-link-btn':(option.type != 'btn'), 'disabled': option.isDisabled, 'selected': option.isSelected, 'maintain' : (option.type == 'call') || (option.type == 'link') }">
                                                        <div v-if="option.type=='btn'"> <span>{{option.label}}</span> </div>
                                                        <div v-else-if="option.type=='callFlow'"> <span>{{option.label}}</span> </div>
                                                        <div v-else-if="option.type=='call'">
                                                            <div class="btn-icon-type"> <i class="fa fa-phone"></i> </div>
                                                            <div class="btn-option-text"> <span class="db-answer-btn">{{option.label}}</span> </div>
                                                        </div>
                                                        <div v-else-if="option.type=='outApp'">
                                                            <div class="btn-icon-type"> <i class="fa fa-external-link"></i> </div>
                                                            <div class="btn-option-text"> <span class="db-answer-btn">{{option.label}}</span> </div>
                                                        </div>
                                                        <div v-else-if="option.type=='inApp'">
                                                            <div class="btn-icon-type"> <i class="fa fa-external-link-square"></i> </div>
                                                            <div class="btn-option-text"> <span class="db-answer-btn">{{option.label}}</span> </div>
                                                        </div>
                                                        <div v-else-if="option.type=='link'">
                                                            <div class="btn-icon-type"> <i class="fa fa-link"></i> </div>
                                                            <div class="btn-option-text"> <span class="db-answer-btn">{{option.label}}</span> </div>
                                                        </div>
                                                        <div v-else-if="option.type=='action'">
                                                            <div class="btn-icon-type"> <i class="fa fa-bolt"></i> </div>
                                                            <div class="btn-option-text"> <span class="db-answer-btn">{{option.label}}</span> </div>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- 챗봇 말풍선 :: 정상 응답 -->
                                <!-- 챗봇 말풍선 :: 예외처리 Reconfirm/Multi-Intent -->
                                <div v-else-if="chat.type=='askBack'">
                                    <div class="chat-message left">
                                        <div class="message">
                                            <span class="message-date">{{chat.timestamp}}</span>
                                            <span class="message-content" v-html="chat.sentence">{{chat.sentence}}</span>
                                        </div>
                                    </div>
                                    <div class="button-container">
                                        <div v-for="intent in chat.intentList" :key="intent.id">
                                            <button type="button" class="ui-sortable btn-option-list db-intent-answer" :class="{ disabled: intent.isDisabled, selected: intent.isSelected}" :disabled="intent.isDisabled || intent.isSelected" @click="intentClick(intent)" >
                                                <span>{{intent.intent_alias || intent.intent_name}}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- chatList loop end -->
                            <!-- sometimes show / hide area start -->
                            <div class="chatbot-typing-indicator" title="입력중..." v-if="chatbotTypingIndicatorFlag">
                                <span></span><span></span><span></span>
                            </div>
                            <div class="user-typing-indicator" title="입력중..." v-if="userTypingIndicatorFlag">
                                <span></span><span></span><span></span>
                            </div>
                            <div v-if="quickReplyBtnFlag" class="quick-button-space" v-bind:class="{opened: isOpened}"></div>
                            <!-- sometimes show / hide area end -->
                        </div>
                        <!-- chat body end (scroll) -->
                    </div>
                    <!-- chat end -->

                    <!-- quick reply start -->

                    <div v-if="quickReplyBtnFlag" class="quick-button-container" v-bind:class="{opened: isOpened}" >
                        <div class="scrollable" @wheel="setMouseWheel(index, $event)" ref="quickList" :id="'quickList_' + index" title="마우스 휠로 스크롤 됩니다.">
                    <span v-for="option in quickList" :key="option.id">
                        <button type="button" @click="optionClick(option)" class="btn-quick-list">
                            <div class="btn-option-text">
                                <span class="db-answer-btn">{{option.label}}</span>
                            </div>
                        </button>
                    </span>
                            <span class="gradient"></span>
                        </div>
                    </div>
                    <!-- quick reply end -->

                    <!-- user input area start -->
                    <div class="frogue-bottom-container animated" v-bind:class="{opened: isOpened}">
                        <!-- 열리면 클래스에 opened를 넣으면 됩니다. -->
                        <!-- 자주 묻는 질문(FAQ) 및 검색 -->
                        <div class="frogue-bottom-persistent_menu-wrap" :style="frogueFaqWrapperStyle">
                            <!-- 검색 결과 -->
                            <div class="frogue-search-wrap" v-show="!faqBtnActive && inputMessage">
                                <ul class="frogue-search-wrap-ul" v-show="faqListFilterByKeyword.length > 0">
                                    <li v-for="faqSearchResult in faqListFilterByKeyword" @click="sendFaqMessage(faqSearchResult)" v-html="faqSearchResultToHtml(faqSearchResult)"></li>
                                </ul>
                            </div>
                            <!-- 자주 묻는 질문(카테고리) -->
                            <div class="frogue-menu-wrap" v-show="faqBtnActive && faqPageActiveTab[0]" :style="faqMenuWrapStyle">
                                <i>카테고리를 선택해주세요.</i>
                                <button v-for="category in faqListTemp" :key="category.id" @click="selectFaqCategory(category)">{{ category.title }}</button>
                                <span class="prev" v-show="faqCategoryList.length > 6 && currentFaqPageIndex > 0" @click="moveFaqPage('prev')"></span>
                                <span class="next" v-show="faqCategoryList.length > 6 && currentFaqPageIndex < faqMenuLastIndex"  @click="moveFaqPage('next')"></span>
                            </div>
                            <!-- 자주 묻는 질문(카테고리 상세) -->
                            <div class="frogue-menu-detail-wrap" v-show="faqBtnActive && faqPageActiveTab[1]">
                                <div class="menu-list_tit">
                                    <button @click="selectFaqCategory()">← 이전</button>
                                    <p>{{ selectedFaqCategory }}</p>
                                </div>
                                <div class="menu-list_cont">
                                    <ul class="menu-list_cont-ul">
                                        <li v-show="faqListFilterByCategory.length > 0" v-for="faqSearchResult in faqListFilterByCategory" @click="sendFaqMessage(faqSearchResult)"> {{ faqSearchResult }}</li>
                                        <li v-show="faqListFilterByCategory.length === 0">조회된 결과가 없습니다.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="frogue-input-wrapper" v-bind:class="{'none-btn-extension': isBtnExtension != 'true'}" :style="frogueInputWrapperStyle">
                            <div class="toast-message" @click="toastingClose()" v-bind:class="{toasting: isToasting}">
                                <span v-text="toastingText"></span>
                            </div>
                            <button type="button" class="animated btn-extension" @click="openExtension()" v-if="isBtnExtension == 'true'">
                                <!-- <img src="~/assets/img/chatBtn/btn-extension.svg" class="btn-img" /> -->
                                <!-- extension 버튼 [+] 모양 -->
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 46.34 46.34" xml:space="preserve" class="btn-img">
                                    <defs>
                                        <svg:style type="text/css">
                                        </svg:style>
                                    </defs>
                                    <title>확장기능</title>
                                    <g id="Layer_2" data-name="Layer 2">
                                        <g id="Layer_2-2" data-name="Layer 2">
                                            <path class="svg-extension-circle"
                                                  d="M23.17,2A21.17,21.17,0,1,1,2,23.17,21.19,21.19,0,0,1,23.17,2m0-2A23.17,23.17,0,1,0,46.34,23.17,23.17,23.17,0,0,0,23.17,0Z">
                                            </path>
                                            <line class="svg-extension-line" x1="13.04" y1="23.17" x2="33.31" y2="23.17"></line>
                                            <line class="svg-extension-line" x1="23.17" y1="13.04" x2="23.17" y2="33.31"></line>
                                        </g>
                                    </g>
                                </svg>
                            </button>
                            <button class="animated btn-menu" :class="{'active': faqBtnActive }" :style="faqBtnStyle"  @click="toggleFaqBtn()"><i></i><i></i><i></i><i></i></button>
                            <div class="input-text-border">
                                <input @click="clickedInput()" type="text" class="input-text" ref="inputbox" v-model="inputMessage" @keyup.13="sendMessage('','')" />
                            </div>
                            <button type="button" id="sendBtn" ref="sendBtn" class="animated btn-send" @click="sendMessage('','')" >
                                <!-- <img src="~/assets/img/chatBtn/btn-send.svg" class="btn-img"> -->
                                <!-- 보내기 버튼 -->
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 26.05 26.05" xml:space="preserve" class="btn-img">
                                    <defs>
                                        <svg:style type="text/css">
                                        </svg:style>
                                    </defs>
                                    <title> 보내기 </title>
                                    <g data-name="Layer 2">
                                        <g data-name="Layer 2">
                                            <polygon points="0 8.53 9 17.53 22.5 13.03 0 8.53" class="svg-send-wing"></polygon>
                                            <path d="M0,.77V7.9a.77.77,0,0,0,.62.75l18.11,3.62a.77.77,0,0,1,0,1.51L.62,17.4a.77.77,0,0,0-.62.76v7.12A.77.77,0,0,0,1.11,26L25.63,13.71a.77.77,0,0,0,0-1.37L1.11.08A.77.77,0,0,0,0,.77Z" class="svg-send-body"></path>
                                        </g>
                                    </g>
                                </svg>
                            </button>
                        </div>
                        <div class="frogue-panel-extention" v-if="isBtnExtension == 'true'">
                            <div>
                                <div class="img-box" onclick="document.getElementById('frogueUploadImage').click();">
                                    <div>
                                        <svg class="btn-img" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 46.3 46.3" style="enable-background:new 0 0 46.3 46.3;" xml:space="preserve">
                                            <title>이미지 전송</title>
                                            <path class="svg-camera" d="M23.2,2c11.7,0,21.2,9.5,21.2,21.2s-9.5,21.2-21.2,21.2S2,34.9,2,23.2l0,0C2,11.5,11.5,2,23.2,2 M23.2,0
                                            C10.4,0,0,10.4,0,23.2s10.4,23.2,23.2,23.2S46.3,36,46.3,23.2S36,0,23.2,0L23.2,0z" ></path>
                                            <g>
                                                <g>
                                                    <g>
                                                        <path class="svg-camera" d="M26.1,12.4c0.5,0,0.9,0.4,0.9,0.9v0.2c0,1.3,1.1,2.4,2.4,2.4h0.1c2.5,0,4.6,2.1,4.6,4.6v6.7
                                                            c0,2.5-2.1,4.6-4.6,4.6H16.8c-2.5,0-4.6-2.1-4.6-4.6v-6.7c0-2.5,2.1-4.6,4.6-4.6h0.1c1.3,0,2.4-1.1,2.4-2.4v-0.2
                                                            c0-0.5,0.4-0.9,0.9-0.9L26.1,12.4 M26.1,10.4h-5.9c-1.6,0-2.9,1.3-2.9,2.9v0.2c0,0.2-0.2,0.4-0.4,0.4h-0.1c-3.6,0-6.6,3-6.6,6.6
                                                            v6.7c0,3.6,3,6.6,6.6,6.6h12.8c3.6,0,6.6-3,6.6-6.6v-6.7c0-3.6-3-6.6-6.6-6.6h-0.1c-0.2,0-0.4-0.2-0.4-0.4v-0.2
                                                            C29,11.7,27.7,10.4,26.1,10.4L26.1,10.4z"></path>
                                                    </g>
                                                </g>
                                                <g>
                                                    <path class="svg-camera" d="M23.2,19.6c2,0,3.5,1.6,3.5,3.5s-1.6,3.5-3.5,3.5s-3.5-1.6-3.5-3.5S21.2,19.6,23.2,19.6 M23.2,17.6
                                                        c-3.1,0-5.5,2.5-5.5,5.5s2.5,5.5,5.5,5.5s5.5-2.5,5.5-5.5S26.2,17.6,23.2,17.6L23.2,17.6z"></path>
                                                </g>
                                            </g>
                                        </svg>
                                        <div>이미지</div>
                                    </div>
                                </div>
                                <div class="img-box" onclick="document.getElementById('frogueUploadFile').click();">
                                    <div>
                                        <svg class="btn-img" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 46.3 46.3" style="enable-background:new 0 0 46.3 46.3;" xml:space="preserve">
                                            <path class="svg-file-circle" d="M23.2,2c11.7,0,21.2,9.5,21.2,21.2s-9.5,21.2-21.2,21.2S2,34.9,2,23.2l0,0C2,11.5,11.5,2,23.2,2 M23.2,0
                                                C10.4,0,0,10.4,0,23.2s10.4,23.2,23.2,23.2S46.3,36,46.3,23.2S36,0,23.2,0L23.2,0z"></path>
                                            <g>
                                                <g>
                                                    <path class="svg-file-box" d="M24.9,13.6l5.7,6v13h-15v-19H24.9 M25,11.6h-9.7c-0.9,0-1.7,0.8-1.7,1.7v19.6c0,0.9,0.8,1.7,1.7,1.7H31
                                                        c0.9,0,1.7-0.8,1.7-1.7V19.5c0-0.4-0.2-0.9-0.5-1.2l-5.9-6.1C25.9,11.8,25.5,11.7,25,11.6z"></path>
                                                    <path class="svg-file-line" d="M23.9,12.6v7.1c0,0.5,0.4,0.9,0.9,0.9h6.8"></path>
                                                </g>
                                            </g>
                                        </svg>
                                        <div>파일</div>
                                    </div>
                                </div>
                            </div>
                            <input type="file" id="frogueUploadImage" ref="frogueUploadImage" accept="image/*" v-on:change="handleFrogueImageUpload()" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0; " >
                            <input type="file" id="frogueUploadFile" ref="frogueUploadFile" v-on:change="handleFrogueFileUpload()" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0; " >
                        </div>
                    </div>
                    <!-- user input area end -->
                    <div class="frogue-footer" v-if="adBuootnYn == 'true'">
                        <a class="btn-banner" title="챗봇을 만드는 가장 쉬운 방법, 단비Ai 바로가기" href="https://danbee.ai" target="_blank"><strong>단비Ai</strong>로 만든 챗봇 :)</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import moment from 'moment';
    import _ from 'lodash';
    import cssVars from 'css-vars-ponyfill';

    export default {
        name: "chatBoby",
        components: {
        },
        props: [

        ],
        data() {
            var frogueUserId = '';
            if ( typeof chatbotuserId != 'undefined' && chatbotuserId  != null && chatbotuserId != '' ) {
                frogueUserId = chatbotuserId || 'frogueTestId';
            }
            return {
                frogueChatViewFlag: false,

                inputMessage: "",
                isContentOpen: false,

                chatMsgInfo: {
                    chatMsgTxt: "",
                    sessionId: "",
                    chatflowId: "",
                    chatInstance: "",
                    chatNodeId: "",
                    chatParamId: "",
                    chatIntentId: ""
                },
                chatList: [],
                selectableResult: {
                    list: [],
                    type: ""
                },
                isOpened: false,
                isToasting : false,
                toastingText: '',

                chatbotTypingIndicatorFlag: false,
                userTypingIndicatorFlag: false,
                quickReplyBtnFlag: false,
                quickList: [],

                frogueUploadImage: '',
                frogueUploadFile: '',

                lastOptionList: [],

                chatbotId: chatbotId || '5bbd93a3-00be-4054-b79a-03c4c50424bc',
                userId: frogueUserId,
                chatbotName: chatbotName || '단비Ai',
                description: '',
                imageUrl: chatbotImg || 'img/chatBtn/danbee_dew.png',
                chatbotImg: chatbotImg || 'img/chatBtn/danbee_dew.png',
                channelData: {},
                frogueChatLoadUrl: chatbotLoadUrl || '/img/loading/frogue.svg',

                serviceNames: '단비Ai',
                currentChatbot: {
                    chatbotImg: chatbotImg || 'img/chatBtn/danbee_dew.png',
                    chatbotName: chatbotName || '단비Ai',
                    chatbotId: chatbotId || '5bbd93a3-00be-4054-b79a-03c4c50424bc'
                },
                currentUser: {
                    userName: frogueUserId || ''
                },
                channelId: '0',
                initParams: {},

                demoBgImg: 'url(https:\/\/frogue.danbee.ai/img/chatBtn/bg_chat.png)',

                colorMain: '#555a9c', //메인색
                colorSub: '#ffffff', //서브색
                colorButtonText: '#0084ff', //버튼 글자색
                colorButtonBorder: '#c3c3c3', //버튼 라인색
                colorButtonBg: '#ffffff', //버튼 배경색
                colorBalloonChatbotBg: '#eef1f4', //챗봇 말풍선 배경색
                colorBalloonChatbotText: '#3d3d3d', //챗봇 말풍선 글자색
                colorBalloonUserBg: '#555a9c', //사용자 말풍선 배경색
                colorBalloonUserText: '#ffffff', //사용자 말풍선 글자색
                colorDateText: '#9b9b9b', //날짜 글자색
                colorHighlight: '#ddefff', // 마우스 오버 등 하이라이트 색상
                colorBg: '#7f8198', //ffrogue 전체 화면시 나오는 배경색상
                adBuootnYn: 'true',  // 하단 광고 보이기
                isBtnExtension: 'true', // 파일 처리 메뉴 보이기

                faqBtnActive: false, // 메뉴 오픈여부
                faqPageActiveTab: [true, false],
                faqCategoryList: [], // 메뉴 목록
                questions: [], // 전체 faq 예문 목록
                selectedFaqCategory: '', // 선택한 faq 메뉴
                currentFaqPageIndex: 0,
            };
        },
        methods: {
            clickedInput :function(){
                setTimeout(()=>{
                    this.scrollDown();
                },100);

                // 자주 묻는 질문 메뉴 초기화
                this.faqInit();
            },
            sendMessage: async function(chatbotMsg, viewSentence, parameters) {

                this.setQuickReplyBtnFlag(false, []);
                if (this.inputMessage === "" && viewSentence === "") {
                    return false;
                }

                //set chat message set for sending
                var chatMsg = {};

                if (chatbotMsg != "") {
                    //click event
                    chatMsg = chatbotMsg;
                } else {
                    //typing
                    if (!_.isEmpty(this.selectableResult.list)) {
                        //클릭 가능한 list가 있을때
                        var inputMsg = this.inputMessage;
                        if (this.selectableResult.type == "btn" || this.selectableResult.type == 'carousel' || this.selectableResult.type == 'one-carousel') {
                            //console.log(this.selectableResult);
                            var option = _.filter(this.selectableResult.list, function(option) {
                                return option.label == inputMsg;
                            });

                            if (!_.isEmpty(option)) {
                                if (this.selectableResult.type == "btn" || this.selectableResult.type == 'one-carousel' ){
                                    this.initSelectableResult();
                                    await this.optionClick(option[0]); //만약에 이름이 똑같아도 위에걸 보냄..
                                    return false;
                                } else{
                                    let carouselected = false;
                                    let carouselIdx = _.findIndex(this.lastOptionList, carousel =>{
                                        _.forEach(carousel.optionList, option => {
                                            if(option.label === inputMsg){
                                                carouselected = true;
                                            }
                                        });
                                        return carouselected;
                                    });

                                    this.initSelectableResult();
                                    await this.optionClick(option[0], carouselIdx); //만약에 이름이 똑같아도 위에걸 보냄..
                                    return false;
                                }
                            } else {
                                if (this.selectableResult.type == "btn" || this.selectableResult.type == 'one-carousel' ){
                                    _.forEach(this.lastOptionList, el => {
                                        el.isDisabled = true;
                                    });
                                } else{
                                    _.forEach(this.lastOptionList, (carousel, index) => {
                                        _.forEach(carousel.optionList, el  => {
                                            el.isDisabled = true;
                                        });
                                    });
                                }
                            }
                        } else {
                            //type == intent
                            var intent = _.filter(this.selectableResult.list, function(intent) {
                                return (
                                    intent.intent_name == inputMsg ||
                                    intent.intent_alias == inputMsg
                                );
                            });
                            if (!_.isEmpty(intent)) {
                                await this.intentClick(intent[0]);
                                return false;
                            } else {
                                // disabled
                                _.forEach(this.selectableResult.list, el => {
                                    el.isDisabled = true;
                                });
                            }
                        }
                    }

                    //일반 message 전송
                    chatMsg.session_id = this.chatMsgInfo.sessionId;
                    chatMsg.chatbot_id = this.currentChatbot.chatbotId;
                    chatMsg.user_id = this.currentUser.userName;
                    chatMsg.input_sentence = this.inputMessage;
                    chatMsg.ins_id = this.chatMsgInfo.chatInstance;
                    chatMsg.intent_id = this.chatMsgInfo.chatIntentId;
                    chatMsg.chatflow_id = this.chatMsgInfo.chatflowId;
                    chatMsg.node_id = this.chatMsgInfo.chatNodeId;
                    chatMsg.param_id = this.chatMsgInfo.chatParamId;
                }
                //user chat message push
                chatMsg.parameters = {};
                if (this.inputMessage != "FROGUE_IMAGE" && this.inputMessage != "FROGUE_FILE") {
                    var reqInput = {};
                    reqInput.type = "question";
                    // reqInput.timestamp = moment().format('YYYY-MM-DD, h:mm:ss a');
                    reqInput.timestamp = moment().format("a h:mm");

                    if (viewSentence === "") {
                        reqInput.sentence = this.inputMessage;
                    } else {
                        reqInput.sentence = viewSentence;
                    }

                    this.chatList.push(reqInput);
                    this.scrollDown();
                } else {
                    chatMsg.parameters = parameters;
                }
                Object.assign(chatMsg.parameters, this.initParams);

                // 0 : Native 로 셋팅 절대로 변경하면 안됨
                chatMsg.channel_id = this.channelId||'0';
                //message send
                this.setChatbotTypingIndicatorFlag(true);
                axios.post("https:\/\/danbee.ai/chatflow/engine.do", chatMsg).then( res => {
                        this.initChatMsgInfo();
                        this.initSelectableResult();

                        const result = res.data.responseSet.result;
                        const resultStatus = result.resultStatus || {};

                        this.chatMsgInfo.sessionId = result.session_id;
                        this.chatMsgInfo.chatflowId = result.chatflow_id;
                        this.chatMsgInfo.chatInstance = result.ins_id;
                        this.chatMsgInfo.chatNodeId = result.node_id;
                        this.chatMsgInfo.chatParamId = result.param_id;
                        this.chatMsgInfo.chatIntentId = result.intent_id;

                        if ( resultStatus.resultCode == "404" && resultStatus.resultCmt == "Not Found Chatbot" ) {
                            setTimeout(async () => {
                                await this.setChatList( moment().toDate().getTime(), resultStatus.resultCmt, [], "", [], [], true, '');
                            }, 1000);
                            return;
                        }
                        const mainResult = result.result;
                        if ( mainResult !== undefined && mainResult.length > 0 && (result.another_result === undefined || result.another_result.length == 0) ) {
                            //result만 있는 경우
                            mainResult.forEach((value, index) => {
                                // console.log(value);
                                if (index === mainResult.length - 1){
                                    setTimeout(async () => {
                                        await this.setChatList( value.timestamp, value.message, value.optionList, value.imgRoute, value.carouselList, value.quickList, true, value.actionData||'' );
                                    }, (index+1)*1000);
                                } else {
                                    setTimeout(async () => {
                                        await this.setChatList( value.timestamp, value.message, value.optionList, value.imgRoute, value.carouselList, value.quickList, false, value.actionData||'' );
                                    }, (index+1)*1000);
                                }
                            });
                        } else if ( result.another_result !== undefined && result.another_result.length > 0 ) {
                            // 애매한 경우 관련 메시지를 채팅창에 나열한다.
                            setTimeout(async () => {
                                await this.setAskBackMsg(result.another_result, result.result[0].message);
                            }, 2000);
                        }
                    },
                    error => {
                        //how to handle error?
                        console.log(error);
                    });
                this.inputMessage = "";
                this.faqInit();
            },
            getEventFlowMessge: function(eventName, sendParams) {

                this.setQuickReplyBtnFlag(false, []);
                this.setChatbotTypingIndicatorFlag(true);

                var chatMsg = {};
                chatMsg.session_id = this.chatMsgInfo.sessionId;
                chatMsg.chatbot_id = this.currentChatbot.chatbotId;
                chatMsg.user_id = this.currentUser.userName;
                chatMsg.input_sentence = this.inputMessage;
                chatMsg.ins_id = this.chatMsgInfo.chatInstance;
                chatMsg.intent_id = this.chatMsgInfo.chatIntentId;
                chatMsg.chatflow_id = this.chatMsgInfo.chatflowId;
                chatMsg.node_id = this.chatMsgInfo.chatNodeId;
                chatMsg.param_id = this.chatMsgInfo.chatParamId;
                chatMsg.channel_id = this.channelId||'0';
                chatMsg.parameters = sendParams || {};

                axios.post("https:\/\/danbee.ai/chatflow/searchEventFlow.do", {
                    chatbotId: this.chatbotId,
                    eventName: eventName || ''
                }).then(eventres => {
                        const eventCode = eventres.data.responseSet.code;
                        const eventResult = eventres.data.responseSet.result;
                        if ( eventCode !== 'success' ) {
                            //console.log('Not Found Event Name.');
                            return false;
                        }
                        var eventId = eventResult.eventId || '';
                        if ( !eventId ) {
                            //console.log('Not Found Event Id.');
                            return false;
                        }
                        axios.post("https:\/\/danbee.ai/chatflow/" + eventId + "/eventFlow.do", chatMsg).then(res => {
                                this.initChatMsgInfo();
                                this.initSelectableResult();

                                const result = res.data.responseSet.result;
                                const resultStatus = result.resultStatus || {};

                                this.chatMsgInfo.sessionId = result.session_id;
                                this.chatMsgInfo.chatflowId = result.chatflow_id;
                                this.chatMsgInfo.chatInstance = result.ins_id;
                                this.chatMsgInfo.chatNodeId = result.node_id;
                                this.chatMsgInfo.chatParamId = result.param_id;
                                this.chatMsgInfo.chatIntentId = result.intent_id;

                                if ( resultStatus.resultCode == "404" && resultStatus.resultCmt == "Not Found Chatbot" ) {
                                    setTimeout(async () => {
                                        await this.setChatList( moment().toDate().getTime(), resultStatus.resultCmt, [], "", [], [], true, '');
                                    }, 1000);
                                    return;
                                }
                                const mainResult = result.result;
                                if ( mainResult !== undefined && mainResult.length > 0 && (result.another_result === undefined || result.another_result.length == 0) ) {
                                    //result만 있는 경우

                                    mainResult.forEach((value, index) => {
                                        if (index === mainResult.length - 1){
                                            setTimeout(async () => {
                                                await this.setChatList( value.timestamp, value.message, value.optionList, value.imgRoute, value.carouselList, value.quickList, true, value.actionData||'' );
                                            }, (index+1)*1000);
                                        } else {
                                            setTimeout(async () => {
                                                await this.setChatList( value.timestamp, value.message, value.optionList, value.imgRoute, value.carouselList, value.quickList, false, value.actionData||'' );
                                            }, (index+1)*1000);
                                        }
                                    });
                                } else if ( result.another_result !== undefined && result.another_result.length > 0 ) {
                                    // 애매한 경우 관련 메시지를 채팅창에 나열한다.
                                    setTimeout(async () => {
                                        await this.setAskBackMsg(result.another_result, result.result[0].message);
                                    }, 2000);
                                }
                            },
                            error => {
                                //how to handle error?
                                console.log(error);
                            });
                    },
                    eventerror => {
                        //how to handle error?
                        console.log(eventerror );
                    });
            },
            getWelcomeMessage: async function() {

                this.setQuickReplyBtnFlag(false, []);
                this.setChatbotTypingIndicatorFlag(true);

                axios.post("https:\/\/danbee.ai/chatflow/welcome.do", {
                    chatbot_id: this.currentChatbot.chatbotId,
                    channel_id: this.channelId||'0',
                    user_id: this.currentUser.userName,
                    parameters: this.initParams
                }).then(res => {

                        const result = res.data.responseSet.result;
                        const resultStatus = result.resultStatus || {};

                        this.chatMsgInfo.sessionId = result.session_id;
                        this.chatMsgInfo.chatflowId = result.chatflow_id;
                        this.chatMsgInfo.chatInstance = result.ins_id;
                        this.chatMsgInfo.chatNodeId = result.node_id;
                        this.chatMsgInfo.chatParamId = result.param_id;
                        this.chatMsgInfo.chatIntentId = result.intent_id;

                        if ( resultStatus.resultCode == "404" && resultStatus.resultCmt == "Not Found Chatbot" ) {
                            setTimeout(async () => {
                                await this.setChatList( moment().toDate().getTime(), resultStatus.resultCmt, [], "", [], [], true, '');
                            }, 1000);
                            return;
                        }

                        result.result.forEach((value, index) => {
                            if (index === result.result.length - 1){
                                setTimeout(async () => {
                                    await this.setChatList( value.timestamp, value.message, value.optionList, value.imgRoute, value.carouselList, value.quickList, true, value.actionData||'' );
                                }, (index+1)*1000);
                            } else {
                                setTimeout(async () => {
                                    await this.setChatList( value.timestamp, value.message, value.optionList, value.imgRoute, value.carouselList, value.quickList, false, value.actionData||'' );
                                }, (index+1)*1000);
                            }
                        });
                    },
                    error => {
                        //how to handle error?
                        console.log(error);
                    });
            },
            optionClick: async function(option, carouselIdx) {

                if ( !_.isUndefined(carouselIdx) ) { // 캐러셀 카드 옵션 선택했을때

                    if(option.type !== 'link' ){
                        _.forEach(this.lastOptionList, (carousel, index) => {
                            if ( index === carouselIdx ) {
                                _.forEach(carousel.optionList, el  => {
                                    if(el.label === option.label){  // value로 체크해서 퀵리플라이랑 value가 같은게있으면 버튼이 selected됨.
                                        el.isSelected = true;
                                    } else {
                                        el.isDisabled = true;
                                    }
                                });
                            } else {
                                _.forEach(carousel.optionList, el  => {
                                    el.isDisabled = true;
                                });
                            }

                        });
                    }

                } else { // one-carousel, 일반 btn 옵션 선택했을때
                    if ( this.lastOptionList[0].cardTitle ){ // one-carousel
                        _.forEach(this.lastOptionList, carousel => {
                            _.forEach(carousel.optionList, el  => {
                                el.isDisabled = true;
                            });
                        });
                    } else { // 일반 btn 옵션
                        _.forEach(this.lastOptionList, el => {
                            if(el.label === option.label){
                                el.isSelected = true;
                            } else {
                                el.isDisabled = true;
                            }
                        });
                    }
                }
                // link일때 퀵리플라이 사라지지않게함
                if ( option.type == 'link' ) {

                } else {
                    this.setQuickReplyBtnFlag(false, []);
                }
                switch (option.type) {
                    case "btn":
                        var triggerCommand = option.value || option.label;
                        if ( triggerCommand.startsWith('javascript:') ) {
                            window.parent.postMessage({event:'frogue-trigger', data: triggerCommand.replace('javascript:','')},'*');
                        } else {
                            var chatMsg = {};
                            chatMsg.session_id = this.chatMsgInfo.sessionId;
                            chatMsg.chatbot_id = this.currentChatbot.chatbotId;
                            chatMsg.user_id = this.currentUser.userName;
                            chatMsg.input_sentence = option.value || option.label; //value가 비었으면 label을 넘김
                            chatMsg.ins_id = this.chatMsgInfo.chatInstance;
                            chatMsg.intent_id = this.chatMsgInfo.chatIntentId;
                            chatMsg.chatflow_id = this.chatMsgInfo.chatflowId;
                            chatMsg.node_id = this.chatMsgInfo.chatNodeId;
                            chatMsg.param_id = this.chatMsgInfo.chatParamId;

                            this.sendMessage(chatMsg, option.label, {});
                        }

                        if ( option.actionData ) {
                            var triggerCommand = option.actionData;
                            if ( triggerCommand.startsWith('parent:') ) {
                                window.parent.postMessage({event:'frogue-trigger', data: triggerCommand.replace('parent:','')},'*');
                            } else if ( triggerCommand.startsWith('this:') ) {
                                triggerCommand = triggerCommand.replace('this:','');
                                var triggerFunction = new Function(' "use strict"; '+triggerCommand+'; ');
                                var thisTriggerFunction = triggerFunction.bind(this);
                                thisTriggerFunction();
                            }
                        }

                        break;
                    case "callFlow":
                        var chatMsg = {};
                        chatMsg.session_id = this.chatMsgInfo.sessionId;
                        chatMsg.chatbot_id = this.currentChatbot.chatbotId;
                        chatMsg.user_id = this.currentUser.userName;
                        chatMsg.intent_id = option.value;
                        //chatMsg.chatflow_id = this.chatMsgInfo.chatflowId;
                        chatMsg.input_sentence = option.label;

                        this.sendMessage(chatMsg, option.label, {});

                        if ( option.actionData ) {
                            var triggerCommand = option.actionData;
                            if ( triggerCommand.startsWith('parent:') ) {
                                window.parent.postMessage({event:'frogue-trigger', data: triggerCommand.replace('parent:','')},'*');
                            } else if ( triggerCommand.startsWith('this:') ) {
                                triggerCommand = triggerCommand.replace('this:','');
                                var triggerFunction = new Function(' "use strict"; '+triggerCommand+'; ');
                                var thisTriggerFunction = triggerFunction.bind(this);
                                thisTriggerFunction();
                            }
                        }

                        break;
                    case "call": //임시
                        if (typeof window.orientation !== "undefined") {
                            var url = "tel:" + option.value;
                            var linkElement = document.createElement("a");
                            try {
                                linkElement.setAttribute("href", url);
                                var clickEvent = new MouseEvent("click", { view: window, bubbles: true, cancelable: false });
                                linkElement.dispatchEvent(clickEvent);
                            } catch (ex) {
                                var tempMessage = {};
                                tempMessage.type = "answer";
                                tempMessage.sentence = "여기로 전화해보세요 : " + option.value;
                                tempMessage.imgRoute = '';
                                tempMessage.optionList = [];
                                tempMessage.quickList = [];
                                tempMessage.timestamp = moment().format("a h:mm");

                                this.chatList.push(tempMessage);
                                this.inputMessage = "";
                                this.scrollDown();
                            }
                        } else {
                            var tempMessage = {};
                            tempMessage.type = "answer";
                            tempMessage.sentence = "여기로 전화해보세요 : " + option.value;
                            tempMessage.imgRoute = '';
                            tempMessage.optionList = [];
                            tempMessage.quickList = [];
                            tempMessage.timestamp = moment().format("a h:mm");

                            this.chatList.push(tempMessage);
                            this.inputMessage = "";
                            this.scrollDown();
                        }

                        if ( option.actionData ) {
                            var triggerCommand = option.actionData;
                            if ( triggerCommand.startsWith('parent:') ) {
                                window.parent.postMessage({event:'frogue-trigger', data: triggerCommand.replace('parent:','')},'*');
                            } else if ( triggerCommand.startsWith('this:') ) {
                                triggerCommand = triggerCommand.replace('this:','');
                                var triggerFunction = new Function(' "use strict"; '+triggerCommand+'; ');
                                var thisTriggerFunction = triggerFunction.bind(this);
                                thisTriggerFunction();
                            }
                        }

                        break;
                    case "quick":
                        var chatMsg = {};
                        chatMsg.session_id = this.chatMsgInfo.sessionId;
                        chatMsg.chatbot_id = this.currentChatbot.chatbotId;
                        chatMsg.user_id = this.currentUser.userName;
                        chatMsg.input_sentence = option.value || option.label; //value가 비었으면 label을 넘김
                        chatMsg.ins_id = this.chatMsgInfo.chatInstance;
                        chatMsg.intent_id = this.chatMsgInfo.chatIntentId;
                        chatMsg.chatflow_id = this.chatMsgInfo.chatflowId;
                        chatMsg.node_id = this.chatMsgInfo.chatNodeId;
                        chatMsg.param_id = this.chatMsgInfo.chatParamId;
                        this.sendMessage(chatMsg, option.label, {});

                        if ( option.actionData ) {
                            var triggerCommand = option.actionData;
                            if ( triggerCommand.startsWith('parent:') ) {
                                window.parent.postMessage({event:'frogue-trigger', data: triggerCommand.replace('parent:','')},'*');
                            } else if ( triggerCommand.startsWith('this:') ) {
                                triggerCommand = triggerCommand.replace('this:','');
                                var triggerFunction = new Function(' "use strict"; '+triggerCommand+'; ');
                                var thisTriggerFunction = triggerFunction.bind(this);
                                thisTriggerFunction();
                            }
                        }

                        break;
                    case "action":
                        var triggerCommand = option.actionData || option.value || option.label;

                        if ( triggerCommand.startsWith('parent:') ) {
                            window.parent.postMessage({event:'frogue-trigger', data: triggerCommand.replace('parent:','')},'*');
                        } else if ( triggerCommand.startsWith('this:') ) {
                            triggerCommand = triggerCommand.replace('this:','');
                            var triggerFunction = new Function(' "use strict"; '+triggerCommand+'; ');
                            var thisTriggerFunction = triggerFunction.bind(this);
                            thisTriggerFunction();
                        }
                        break;
                    default:
                        window.open(option.value, "_blank");
                        this.inputMessage = "";
                        break;
                }
            },
            intentClick: async function(intent) {
                this.setQuickReplyBtnFlag(false, []);
                var chatMsg = {};
                var viewSentence = intent.intent_alias || intent.intent_name;

                chatMsg.session_id = this.chatMsgInfo.sessionId;
                chatMsg.chatbot_id = this.currentChatbot.chatbotId;
                chatMsg.input_sentence = viewSentence; //intent.sentence;
                chatMsg.ins_id = this.chatMsgInfo.chatInstance;
                chatMsg.intent_id = intent.intent_id;
                chatMsg.chatflow_id = this.chatMsgInfo.chatflowId;
                chatMsg.node_id = this.chatMsgInfo.chatNodeId;
                chatMsg.param_id = this.chatMsgInfo.chatParamId;
                chatMsg.user_id = this.currentUser.userName;

                // disabled
                _.forEach(this.selectableResult.list, el => {
                    if( el.intent_id === intent.intent_id ) {
                        el.isSelected = true;
                    } else {
                        el.isDisabled = true;
                    }
                });

                this.initSelectableResult();
                this.sendMessage(chatMsg, viewSentence, {});
            },
            clearChatMsg: function() {
                //현재 사용하지 않음
                this.chatList = [];
                this.initChatMsgInfo();
                this.getWelcomeMessage();
            },
            shareChatURL: function() {
                //현재 사용하지 않음
                let sharedUrl = "https:\/\/frogue.danbee.ai/?chatbot_id=" + this.currentChatbot.chatbotId;
                this.$copyText(sharedUrl).then(function(e) {
                    alert("URL이 복사되었어요");
                    //console.log(e)
                }, function(e) {
                    alert("URL 복사를 할 수 없어요");
                    //console.log(e)
                });
            },
            setChatList: async function( messagetimestamp, message, optionList, imgRoute, carouselList, quickList, lastFlag, actionData ) {
                //empty message
                if ( message == "" && optionList.length == 0 && imgRoute == "" && carouselList.length == 0 ) {
                    this.setChatbotTypingIndicatorFlag(false);
                    return false;
                }
                var resultchatDetail = {};

                if (carouselList.length > 0) {
                    //carousel
                    this.selectableResult.type = "carousel";
                    carouselList.forEach(carousel => {
                        carousel.imgRoute = encodeURI(carousel.imgRoute);
                        this.selectableResult.list = this.selectableResult.list.concat(
                            carousel.optionList
                        );
                    });

                    resultchatDetail.type = "answer";
                    resultchatDetail.sentence = message;
                    resultchatDetail.timestamp = moment().format("a h:mm");

                    if (carouselList.length == 1) {
                        resultchatDetail.nodeType = "one_carousel";
                        resultchatDetail.cardTitle = carouselList[0].cardTitle;
                        resultchatDetail.subCardTitle = carouselList[0].subCardTitle;
                        resultchatDetail.imgRoute = carouselList[0].imgRoute;
                        resultchatDetail.optionList = carouselList[0].optionList;
                        resultchatDetail.quickList = quickList || [];

                        this.selectableResult.type = "one-carousel";
                        this.selectableResult.list = this.selectableResult.list.concat(resultchatDetail.quickList);
                    } else {
                        resultchatDetail.nodeType = "carousel";
                        resultchatDetail.carouselList = carouselList;
                        resultchatDetail.quickList = quickList || [];
                    }
                    if (resultchatDetail.quickList.length > 0) {
                        //console.log('one-carousel로 셋팅');
                        // this.selectableResult.type = "one-carousel";
                        // this.selectableResult.list = this.selectableResult.list.concat(resultchatDetail.quickList);

                        if ( lastFlag ) {
                            this.setQuickReplyBtnFlag(true, resultchatDetail.quickList);
                        }
                    }
                } else {
                    resultchatDetail.type = "answer";
                    resultchatDetail.sentence = message;
                    resultchatDetail.imgRoute = imgRoute;
                    resultchatDetail.optionList = optionList;
                    resultchatDetail.quickList =
                        _.filter(optionList, function(option) {
                            return option.type == "quick";
                        }) || [];

                    resultchatDetail.timestamp = moment().format("a h:mm");
                    // resultchatDetail.timestamp = moment().format('YYYY-MM-DD, h:mm:ss a');
                    if (optionList.length > 0) {
                        this.selectableResult.type = "btn";
                        this.selectableResult.list = this.selectableResult.list.concat(optionList);
                    }
                    if ( lastFlag && resultchatDetail.quickList.length > 0) {
                        this.setQuickReplyBtnFlag(true, resultchatDetail.quickList);
                    }
                }
                if ( lastFlag ) {
                    this.setChatbotTypingIndicatorFlag(false);

                    if (carouselList.length > 1 ) {
                        this.lastOptionList = carouselList;
                    } else {
                        this.lastOptionList = resultchatDetail.optionList;
                    }

                } else {
                    if (carouselList.length > 1 ) {
                        _.forEach(carouselList, carousel => {
                            _.forEach(carousel.optionList, option => {
                                option.isDisabled = true;
                            });
                        });

                    } else {
                        _.forEach(resultchatDetail.optionList, option => {
                            option.isDisabled = true;
                        });
                    }
                }
                if ( actionData ) {
                    if ( actionData.startsWith('parent:') ) {
                        window.parent.postMessage({event:'frogue-trigger', data: actionData.replace('parent:','')},'*');
                    } else if ( actionData.startsWith('this:') ) {
                        actionData = actionData.replace('this:','');
                        var actionDataFunction = new Function(' "use strict"; '+actionData+'; ');
                        var thisActionDataFunction = actionDataFunction.bind(this);
                        thisActionDataFunction();
                    }
                }
                this.chatList.push(resultchatDetail);
                this.scrollDown();

            },
            setAskBackMsg: async function(anotherResult, message) {
                this.setQuickReplyBtnFlag(false, []);
                var timeId = moment();
                this.selectableResult.type = "intent";
                this.selectableResult.list = anotherResult;

                var resInput = {
                    type: "askBack",
                    sentence: message,
                    timestamp: moment().format("a h:mm"),
                    timeId: timeId,
                    intentList: anotherResult
                };

                this.setChatbotTypingIndicatorFlag(false);
                this.chatList.push(resInput);

                this.scrollDown();
            },
            initChatMsgInfo: function() {
                this.chatMsgInfo.chatMsgTxt = "";
                this.chatMsgInfo.sessionId = "";
                this.chatMsgInfo.chatflowId = "";
                this.chatMsgInfo.chatInstance = "";
                this.chatMsgInfo.chatNodeId = "";
                this.chatMsgInfo.chatParamId = "";
                this.chatMsgInfo.chatIntentId = "";
            },
            scrollDown: function() {
                //image 늦게 뜰때 끝까지 안내려가는 문제 추후 수정 필요
                setTimeout(() => {
                    let chattingPanel = document.querySelector("#chattingPanel");
                    chattingPanel.scrollTop = chattingPanel.scrollHeight;
                    this.changeHeightOnePx();
                }, 200);
            },
            initSelectableResult: function() {
                this.selectableResult.list = [];
                this.selectableResult.type = "";
            },
            changeHeightOnePx: function() {
                let carouselNodes = this.$refs.carousel;
                if (carouselNodes && carouselNodes.length > 0) {
                    let carouselNode = carouselNodes[carouselNodes.length - 1];
                    let agileGetWidth = carouselNode.getWidth;
                    let agileReload = carouselNode.reload;
                    setTimeout(() => {
                        agileGetWidth();
                        agileReload();
                    }, 1);
                    agileGetWidth();
                    agileReload();
                }
            },
            openExtension: function() {
                this.isOpened = !this.isOpened;
            },
            toastingOpen: function(toastingText) {
                this.toastingText = toastingText;
                this.isToasting = true;
                setTimeout(() => {
                    this.toastingClose();
                }, 3000);
            },
            toastingClose: function() {
                this.toastingText = '';
                this.isToasting = false;
            },
            setChatbotTypingIndicatorFlag: function(flag) {
                this.chatbotTypingIndicatorFlag = flag;
                this.scrollDown();
            },
            setUserTypingIndicatorFlag: function(flag) {
                this.userTypingIndicatorFlag = flag;
                this.scrollDown();
            },
            setQuickReplyBtnFlag: function(flag, quickList) {
                if ( flag ) {
                    setTimeout(()=>{
                        this.quickReplyBtnFlag = flag;
                        this.quickList = quickList;
                        this.scrollDown();
                    }, 500);
                } else {
                    this.quickReplyBtnFlag = flag;
                    this.quickList = quickList;
                    this.scrollDown();
                }
            },
            setMouseWheel: function(index, event) {
                event = window.event || event;
                var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
                document.getElementById('quickList_'+index).scrollLeft -= (delta * 40);
            },
            handleFrogueImageUpload: function() {

                this.frogueUploadImage = this.$refs.frogueUploadImage.files[0];

                if ( this.frogueUploadImage && this.frogueUploadImage != '' ) {

                    this.isOpened = false;
                    this.setUserTypingIndicatorFlag(true);

                    let formData = new FormData();
                    formData.append("image", this.frogueUploadImage);

                    alert('image upload');
                    this.setUserTypingIndicatorFlag(false);
                    /*
                    axios.post("파일업로드 주소", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }).then( res => {
                        //console.log(res);
                        this.frogueUploadImage = '';
                        this.$refs.frogueUploadImage.value = '';
                        this.setUserTypingIndicatorFlag(false);
                        let frogueImageUploadUrl = res.data.location || "";
                        frogueImageUploadUrl = ''; // 이미지 셋팅해서 보여주기
                        //console.log(frogueImageUploadUrl);
                        var reqImageInput = {};
                        reqImageInput.type = "imageUpload";
                        reqImageInput.timestamp = moment().format("a h:mm");
                        reqImageInput.sentence = frogueImageUploadUrl;
                        this.chatList.push(reqImageInput);
                        this.scrollDown();

                        this.inputMessage = "FROGUE_IMAGE";  // 프로그 이미지로 말걸기
                        this.sendMessage("", "", {FROGUE_IMAGE: frogueImageUploadUrl || ""});
                    }, error => {
                        //console.log('FAILURE!!');
                        console.log(error);
                        this.frogueUploadImage = "";
                        this.$refs.frogueUploadImage.value = '';
                        this.setUserTypingIndicatorFlag(false);
                        this.toastingOpen('이미지만 업로드가 가능합니다.');
                    });
                    */
                }
            },
            handleFrogueFileUpload: function() {

                this.frogueUploadFile = this.$refs.frogueUploadFile.files[0];

                if (this.frogueUploadFile && this.frogueUploadFile != '') {

                    this.isOpened = false;
                    this.setUserTypingIndicatorFlag(true);

                    let formData = new FormData();
                    formData.append("file", this.frogueUploadFile);

                    alert('file upload');
                    this.setUserTypingIndicatorFlag(false);

                    /*
                    axios.post("파일업로드 주소", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }).then(res => {
                        //console.log(res);
                        this.frogueUploadFile = '';
                        this.$refs.frogueUploadFile.value = '';
                        this.setUserTypingIndicatorFlag(false);
                        let frogueFileUploadUrl = res.data.location || "";
                        frogueFileUploadUrl = ''; // 파일 셋팅해서 보여주기
                        //console.log(frogueImageUploadUrl);
                        var reqFileInput = {};
                        reqFileInput.type = "fileUpload";
                        reqFileInput.timestamp = moment().format("a h:mm");
                        reqFileInput.sentence = frogueFileUploadUrl;
                        this.chatList.push(reqFileInput);
                        this.scrollDown();

                        this.inputMessage = "FROGUE_FILE";  // 프로그 파일로 말걸기
                        this.sendMessage("", "", {FROGUE_FILE: frogueFileUploadUrl || ""});
                    }, error => {
                        //console.log('FAILURE!!');
                        console.log(error);
                        this.frogueUploadFile = "";
                        this.$refs.frogueUploadFile.value = '';
                        this.setUserTypingIndicatorFlag(false);
                        this.toastingOpen('파일업로드를 실패하였습니다..');
                    });
                    */
                }
            },

            // s: 자주묻는질문(FAQ)
            faqInit() {
                this.faqBtnActive = false;
                this.faqPageActiveTab = [true, false];
                this.selectedFaqCategory = '';
                this.currentFaqPageIndex = 0;
            },
            toggleFaqBtn() {
                this.faqBtnActive = !this.faqBtnActive;
            },
            selectFaqCategory(category) {
                if(category) {
                    if(category.title) {
                        this.faqPageActiveTab = [false, true];
                        this.selectedFaqCategory = category.title;
                    }
                } else {
                    this.faqPageActiveTab = [true, false];
                    this.selectedFaqCategory = '';
                }
            },
            moveFaqPage(direction) {
                if(direction === 'prev') {
                    if(this.currentFaqPageIndex !== 0) {
                        this.currentFaqPageIndex--;
                    }
                } else {
                    if(this.currentFaqPageIndex < this.faqMenuLastIndex) {
                        this.currentFaqPageIndex++;
                    }
                }
            },
            sendFaqMessage(famMsg){
                if(famMsg) {
                    this.inputMessage = famMsg;
                    this.sendMessage('', '');
                }
            },
            faqSearchResultToHtml(str) { // 검색단어 글자색 적용
                let temp = str.split(this.inputMessage);
                if(temp.length === 2) {
                    return temp[0] + '<span style="color:yellow;">' + this.inputMessage + '</span>' + temp[1];
                } else {
                    return str;
                }
            },
            // e: 자주묻는질문(FAQ)


            capitalize(s) {
                if (s.length < 1) {
                    return s;
                }
                return s.charAt(0).toUpperCase() + s.slice(1);
            },
            danbee_sleep(n) {

                const date = Date.now();
                let currentDate = null;
                do {
                    currentDate = Date.now();
                } while (currentDate - date < n);

            }
        },
        created() {
        },
        beforeDestroy() {
        },
        beforeMount() {
            this.getWelcomeMessage();
        },
        computed: {
            cssProps() {
                return {
                    "--color-main": this.colorMain,
                    "--color-sub": this.colorSub,
                    "--color-button-text": this.colorButtonText,
                    "--color-button-border": this.colorButtonBorder,
                    "--color-button-bg": this.colorButtonBg,
                    "--color-balloon-chatbot-bg": this.colorBalloonChatbotBg,
                    "--color-balloon-chatbot-text": this.colorBalloonChatbotText,
                    "--color-balloon-user-bg": this.colorBalloonUserBg,
                    "--color-balloon-user-text": this.colorBalloonUserText,
                    "--color-date-text": this.colorDateText,
                    "--color-highlight": this.colorHighlight,
                    "--color-bg": this.colorBg,
                    "--demo-bg-img": this.demoBgImg
                };
            },
            faqMenuLastIndex() {
                return Math.ceil(this.faqCategoryList.length/6)-1;
            },
            faqListTemp() {
                return this.faqCategoryList.slice(this.currentFaqPageIndex*6, (this.currentFaqPageIndex*6)+6);
            },
            faqListFilterByKeyword() { // 자주묻는질문(메뉴) 검색 결과
                if(this.inputMessage && this.inputMessage.length > 1) {
                    return _.filter(this.totalQuestions, (res)=> {
                        return res.replace(/\s/g, "").indexOf(this.inputMessage.replace(/\s/g, "")) > -1;
                    })
                } else {
                    return [];
                }
            },
            faqListFilterByCategory() { // 선택된 faqMenu에 따른 결과
                let questions = [];
                let category = _.find(this.faqCategoryList, {'title': this.selectedFaqCategory });
                if(category) {
                    questions = category.questions;
                }
                return questions;
            },
            frogueFaqWrapperStyle() {
                let rtnObj = {};
                let bottomVal = 50;
                if(!this.faqBtnActive) {
                    rtnObj['border'] = 'none';
                }
                if(this.adBuootnYn === 'true') {
                    bottomVal += 38;
                } else {
                    bottomVal += 8;
                }
                if(this.isOpened) {
                    bottomVal += 80;
                }
                // console.log(bottomVal);
                rtnObj['bottom'] = bottomVal + 'px';
                return rtnObj;
            },
            faqMenuWrapStyle(){
                if(this.faqCategoryList.length > 3) {
                    return { 'height': '140px' };
                } else {
                    return { 'height': '70px'};
                }
            },
            frogueInputWrapperStyle() {
                if(this.isBtnExtension === 'true') {
                    return { 'padding-left': '94px' };
                } else {
                    return { 'padding-left': '52px' };
                }
            },
            faqBtnStyle(){
                if(this.isBtnExtension === 'true') {
                    return { 'left': '52px' };
                } else {
                    return { 'left': '12px' };
                }
            },
        },
        mounted() {

            cssVars({
                variables: {
                    "color-main": this.colorMain,
                    "color-sub": this.colorSub,
                    "color-button-text": this.colorButtonText,
                    "color-button-border": this.colorButtonBorder,
                    "color-button-bg": this.colorButtonBg,
                    "color-balloon-chatbot-bg": this.colorBalloonChatbotBg,
                    "color-balloon-chatbot-text": this.colorBalloonChatbotText,
                    "color-balloon-user-bg": this.colorBalloonUserBg,
                    "color-balloon-user-text": this.colorBalloonUserText,
                    "color-date-text": this.colorDateText,
                    "color-highlight": this.colorHighlight,
                    "color-bg": this.colorBg,
                    "demo-bg-img": this.demoBgImg
                }
            });

            setTimeout(() => {
                this.frogueChatViewFlag = true;
            }, 2000);



            this.totalQuestions = [
                '자주 묻는 질문 01', '자주 묻는 질문 02',
                '자주 묻는 질문 03', '자주 묻는 질문 04',
                '자주 묻는 질문 05', '자주 묻는 질문 06',
                '자주 묻는 질문 07', '자주 묻는 질문 08',
                '자주 묻는 질문 09', '자주 묻는 질문 10',
                '자주 묻는 질문 11', '자주 묻는 질문 12',
                '자주 묻는 질문 13', '자주 묻는 질문 14',
                '자주 묻는 질문 15', '자주 묻는 질문 16',
                '자주 묻는 질문 17', '자주 묻는 질문 18',
                '자주 묻는 질문 19', '자주 묻는 질문 20',
                '자주 묻는 질문 21', '자주 묻는 질문 22',
                '자주 묻는 질문 23', '자주 묻는 질문 24',
            ];

            this.faqCategoryList = [
                { id:0, title: '카테고리 01', questions: ['자주 묻는 질문 01', '자주 묻는 질문 02'] },
                { id:1, title: '카테고리 02', questions: ['자주 묻는 질문 03', '자주 묻는 질문 04'] },
                { id:2, title: '카테고리 03', questions: ['자주 묻는 질문 05', '자주 묻는 질문 06'] },
                { id:3, title: '카테고리 04', questions: ['자주 묻는 질문 07', '자주 묻는 질문 08'] },
                { id:4, title: '카테고리 05', questions: ['자주 묻는 질문 09', '자주 묻는 질문 10'] },
                { id:5, title: '카테고리 06', questions: ['자주 묻는 질문 11', '자주 묻는 질문 12'] },
                { id:6, title: '카테고리 07', questions: ['자주 묻는 질문 13', '자주 묻는 질문 14'] },
                { id:7, title: '카테고리 08', questions: ['자주 묻는 질문 15', '자주 묻는 질문 16'] },
                { id:8, title: '카테고리 09', questions: ['자주 묻는 질문 17', '자주 묻는 질문 18'] },
                { id:9, title: '카테고리 10', questions: ['자주 묻는 질문 19', '자주 묻는 질문 20'] },
                { id:10, title: '카테고리 11', questions: ['자주 묻는 질문 21', '자주 묻는 질문 22'] },
                { id:11, title: '카테고리 12', questions: ['자주 묻는 질문 23', '자주 묻는 질문 24'] },
            ];

        },
        directives: {
            focus: {
                // 디렉티브 정의
                inserted: function(el) {
                    // Focus the element
                    el.focus();
                }
            }
        }
    }





</script>

<style lang="scss">
    /* global styles :: 캐로셀 관련된 것만 글로벌로 잡아놨음 */
    $frogue-color-main: var(--color-main); //메인색
    $frogue-color-sub: var(--color-sub); //서브색
    $frogue-color-button-text: var(--color-button-text); //버튼 글자색
    $frogue-color-button-border: var(--color-button-border); //버튼 라인색
    $frogue-color-button-bg: var(--color-button-bg); //버튼 배경색
    $frogue-color-balloon-chatbot-bg: var(--color-balloon-chatbot-bg ); //챗봇 말풍선 배경색
    $frogue-color-balloon-chatbot-text: var(--color-balloon-chatbot-text); //챗봇 말풍선 글자색
    $frogue-color-balloon-user-bg: var(--color-balloon-user-bg); //사용자 말풍선 배경색
    $frogue-color-balloon-user-text: var(--color-balloon-user-text); //사용자 말풍선 글자색
    $frogue-color-date-text: var(--color-date-text); //날짜 글자색
    $frogue-color-highlight: var(--color-highlight); // 마우스 오버 등 하이라이트 색상
    $frogue-color-bg: var(--color-bg); //frogue 전체 화면시 나오는 배경색상
    $frogue-chat-demo-bg: var(--demo-bg-img);
    /*
    $frogue-color-main: #0a1e5a; //메인색
    $frogue-color-sub: #ffffff; //서브색
    $frogue-color-button-text: #fa002e; //버튼 글자색
    $frogue-color-button-border: #fa002e; //버튼 라인색
    $frogue-color-button-bg: #ffffff; //버튼 배경색
    $frogue-color-balloon-chatbot-bg: #fce5e8; //챗봇 말풍선 배경색
    $frogue-color-balloon-chatbot-text: #5b5854; //챗봇 말풍선 글자색
    $frogue-color-balloon-user-bg: #87827d; //사용자 말풍선 배경색
    $frogue-color-balloon-user-text: #ffffff; //사용자 말풍선 글자색
    $frogue-color-date-text: #9b9b9b; //날짜 글자색
    $frogue-color-highlight: #ddefff; // 마우스 오버 등 하이라이트 색상
    $frogue-color-bg: #7d8282; //frogue 전체 화면시 나오는 배경색상
    $frogue-chat-demo-bg: url(https://frogue.danbee.ai/img/chatBtn/bg_chat.png);
    //"chatbotIconimg":"https://danbee.ai/platformfile/f90748fe-1f25-4192-ab8c-94c77444b136/20200319141024-bot_icon_mod.gif",
    //"chatbotLoadimg":"https://danbee.ai/platformfile/f90748fe-1f25-4192-ab8c-94c77444b136/20200317154950-bot_loading.gif",
    */
    .slide {
        color: #fff;
        position: relative;

        &--1 {
            background-color: #f1c40f;
        }
    }
    .agile {
        .db-carousel-title {
            display: block;
            text-align: left;
            font-weight: bold;
            color: $frogue-color-balloon-chatbot-text;
            margin-top: 4px;
        }
        .db-carousel-desc {
            color: $frogue-color-balloon-chatbot-text;
            margin-top: 4px;
        }
    }
    .agile__arrow {
        background: none;
    }
    .agile__dots {
        position: absolute;
        top: 220px;
        right: 0;
        left:0;
        -ms-flex-align: center;
        align-items: center;
        display: block;
        list-style: none;
        padding: 0;
        white-space: nowrap;
        text-align: center;
        margin: 10px 0;
    }
    .agile__dot {
        margin: 0 3px;
        display: inline-block;
        button {
            background-color: rgba(255, 255, 255, 0.3);
            border: 1px solid rgba(0, 0, 0, 0.4);
            border-radius: 50%;
            cursor: pointer;
            display: block;
            height: 13px;
            font-size: 0px;
            line-height: 0;
            margin: 0;
            transition-duration: 0.3s;
            width: 4px;
        }
    }
    .agile__dot--current {
        button {
            background-color: rgba(70, 70, 70, 1);
        }
    }
    .agile__dot:hover button {
        background-color: rgba(0, 0, 0, 0.3);
    }
    .agile__arrow {
        background: $frogue-color-button-bg;
        border: 1px solid $frogue-color-button-border;
        top: 110px;
        margin: 0;
        padding: 3px 0 0 0;
        position: absolute;
        transition-duration: 0.3s;
        width: 20px;
        svg {
            fill: $frogue-color-button-text;
            opacity: 0.5;
        }
        #arrow-svg {
            fill: #888;
            height: 20px;
            transition-duration: 0.3s;
        }
        &:hover {
            background: $frogue-color-highlight;
            cursor: pointer;
            svg {
                opacity: 1;
            }
        }
    }
    .agile__arrow--prev {
        left: 0;
        border-left: 0;
        border-radius: 0 6px 6px 0;
    }
    .agile__arrow--next {
        right: 0;
        border-right: 0;
        border-radius: 6px 0 0 6px;
    }

    @media all and (-ms-high-contrast:none)
    {
        .agile__arrow { height:28px; padding-top:0;} /* IE10 */
        *::-ms-backdrop, .agile__arrow { height:28px;padding-top:0;} /* IE11 */

        .agile__dot button {height:18px;} /* IE10 */
        *::-ms-backdrop, .agile__dot button { height:18px;} /* IE11 */
    }

    svg:not(:root) {
        overflow: hidden;
    }
</style>

<style lang="scss" scoped>

    // Frogue 채팅창 전반에 대한 SCSS
    //@import url(https://fonts.googleapis.com/earlyaccess/notosanskr.css);
    @import url(/css/NotoSansKR-Hestia.css);
    // colorMain = '#555a9c'; //메인색
    // colorSub = '#ffffff'; //서브색
    // colorButtonText = '#0084ff'; //버튼 글자색
    // colorButtonBorder = '#c3c3c3'; //버튼 라인색
    // colorButtonBg = '#ffffff'; //버튼 배경색
    // colorBalloonChatbotBg = '#eef1f4'; //챗봇 말풍선 배경색
    // colorBalloonChatbotText = '#3d3d3d'; //챗봇 말풍선 글자색
    // colorBalloonUserBg = '#555a9c'; //사용자 말풍선 배경색
    // colorBalloonUserText = '#ffffff'; //사용자 말풍선 글자색
    // colorDateText = '#9b9b9b'; //날짜 글자색
    // colorHighlight = '#ddefff'; // 마우스 오버 등 하이라이트 색상
    // colorBg = '#7f8198'; //frogue 전체 화면시 나오는 배경색상

    $frogue-color-main: var(--color-main); //메인색
    $frogue-color-sub: var(--color-sub); //서브색
    $frogue-color-button-text: var(--color-button-text); //버튼 글자색
    $frogue-color-button-border: var(--color-button-border); //버튼 라인색
    $frogue-color-button-bg: var(--color-button-bg); //버튼 배경색
    $frogue-color-balloon-chatbot-bg: var(--color-balloon-chatbot-bg ); //챗봇 말풍선 배경색
    $frogue-color-balloon-chatbot-text: var(--color-balloon-chatbot-text); //챗봇 말풍선 글자색
    $frogue-color-balloon-user-bg: var(--color-balloon-user-bg); //사용자 말풍선 배경색
    $frogue-color-balloon-user-text: var(--color-balloon-user-text); //사용자 말풍선 글자색
    $frogue-color-date-text: var(--color-date-text); //날짜 글자색
    $frogue-color-highlight: var(--color-highlight); // 마우스 오버 등 하이라이트 색상
    $frogue-color-bg: var(--color-bg); //frogue 전체 화면시 나오는 배경색상
    $frogue-chat-demo-bg: var(--demo-bg-img);
    /*
    $frogue-color-main: #0a1e5a; //메인색
    $frogue-color-sub: #ffffff; //서브색
    $frogue-color-button-text: #fa002e; //버튼 글자색
    $frogue-color-button-border: #fa002e; //버튼 라인색
    $frogue-color-button-bg: #ffffff; //버튼 배경색
    $frogue-color-balloon-chatbot-bg: #fce5e8; //챗봇 말풍선 배경색
    $frogue-color-balloon-chatbot-text: #5b5854; //챗봇 말풍선 글자색
    $frogue-color-balloon-user-bg: #87827d; //사용자 말풍선 배경색
    $frogue-color-balloon-user-text: #ffffff; //사용자 말풍선 글자색
    $frogue-color-date-text: #9b9b9b; //날짜 글자색
    $frogue-color-highlight: #ddefff; // 마우스 오버 등 하이라이트 색상
    $frogue-color-bg: #7d8282; //frogue 전체 화면시 나오는 배경색상
    $frogue-chat-demo-bg: url(https://frogue.danbee.ai/img/chatBtn/bg_chat.png);
    //"chatbotIconimg":"https://danbee.ai/platformfile/f90748fe-1f25-4192-ab8c-94c77444b136/20200319141024-bot_icon_mod.gif",
    //"chatbotLoadimg":"https://danbee.ai/platformfile/f90748fe-1f25-4192-ab8c-94c77444b136/20200317154950-bot_loading.gif",
    */
    *,
    body,
    html {
        font-size: 14px;
        letter-spacing: -0.08px;
        padding: 0;
        margin: 0;
        word-break: keep-all;
        word-wrap: break-word;
        white-space: pre-line;
        text-align: left;
    }
    body,
    html {
        font-family: "Noto Sans KR", sans-serif;
    }
    body{
        position:relative;
        overflow:hidden;
    }
    button:focus,
    input:focus {
        /* 클릭 영역에 박스 생기는 현상 제거 */
        outline: none;
    }

    input[type=button], button {
        min-width: 24px !important;
    }

    .container{
        background: radial-gradient( #fff, #c4c4c4 );
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        height: 100% !important;
    }
    .loading-page{
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -120px;
        margin-left: -50px;
        h4{
            margin: 20px auto 0 auto;
            font-weight: bold;
            font-size: 14px;
            color: #3d3d3d;
        }
        div{
            margin: 8px;
            font-size: 12px;
        }
        img{
            margin-top: 10px;
            width: 100px;
            height: 100px;
        }
    }

    .svg-extension-circle {
        fill: $frogue-color-main;
    }
    .svg-extension-line {
        fill: none;
        stroke: $frogue-color-main;
        stroke-miterlimit: 10;
        stroke-width: 2.4px;
    }
    .svg-send-wing{fill: $frogue-color-main;}
    .svg-send-body{fill: $frogue-color-main;opacity:0.8;}
    .svg-camera{fill: $frogue-color-main}
    .svg-file-circle{fill: $frogue-color-main}
    .svg-file-box{fill: $frogue-color-main}
    .svg-file-line{fill:none; stroke:$frogue-color-main; stroke-width:2; stroke-linejoin:round;}

    /*frogue가 노는 연못 (배경)*/
    .frogue-pond {
        background: $frogue-chat-demo-bg;
        //background-size:cover;
        //background-position:center center;
        // background-image : url("~/assets/img/chatBtn/bg_chat.png");
        background-color: $frogue-color-bg;
        text-align: center;
        height: 100% !important;
        overflow: hidden;
    }

    /*-- frogue-screen, 전체 스크린 레이아웃 --*/
    .frogue-screen {
        height: 100%;
        width: 100%;
        max-width: 540px;
        position: relative;
        text-align: center;
        display: inline-block;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
    .frogue-container {
        /*전체 컨테이너 */
        background-color: $frogue-color-sub;
        height: 60vh;
        min-height: 100%;
        border: none;
        box-shadow: none;
        .frogue-content-wrapper {
            /* 대화 콘텐츠 영역 레아이웃(사이징) */
            height: 95%;
            height: unquote("-webkit-calc(100% - 118px)");
            height: unquote("-moz-calc(100% - 118px)");
            height: unquote("calc(100% - 118px)");
            /*닫히는 애니메이션*/
            -webkit-transition: all 0.4s ease-in;
            -moz-transition: all 0.4s ease-in;
            -ms-transition: all 0.4s ease-in;
            -o-transition: all 0.4s ease-in;
            transition: all 0.4s ease-in;
            &.opened {
                height: 90%;
                height: unquote("-webkit-calc(100% - 256px)");
                height: unquote("-moz-calc(100% - 256px)");
                height: unquote("calc(100% - 256px)");
                /*열리는 애니메이션*/
                -webkit-transition: all 0.4s ease-out;
                -moz-transition: all 0.4s ease-out;
                -ms-transition: all 0.4s ease-out;
                -o-transition: all 0.4s ease-out;
                transition: all 0.4s ease-out;
            }
            &.quick-button-mode {
                /*퀵버튼이 있을 때 사이즈*/
                height: 97%;
                height: unquote("-webkit-calc(100% - 196px)");
                height: unquote("-moz-calc(100% - 196px)");
                height: unquote("calc(100% - 196px)");
                /*닫히는 애니메이션*/
                -webkit-transition: all 0.4s ease-in;
                -moz-transition: all 0.4s ease-in;
                -ms-transition: all 0.4s ease-in;
                -o-transition: all 0.4s ease-in;
                transition: all 0.4s ease-in;
            }
        }

        .frogue-header {
            /* 헤더 영역 */
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            overflow:hidden;
            padding: 0 10px 0 10px;
            background: $frogue-color-main;
            z-index: 2000;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
            .pull-left {
                float: left;
                .chatbot-profile-wrapper {
                    position: relative;
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    margin-top: 10px;
                    text-align: center;
                    -webkit-box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
                    margin-right: 7px;
                    img {
                        position: absolute;
                        border-radius: 50%;
                        height: 40px;
                        left: 50%;
                        margin-left: -20px;
                        top: 50%;
                        margin-top: -20px;
                    }
                }
                .chatbot-name {
                    position: relative;
                    top: -13px;
                    font-size: 16px;
                    font-weight: 400;
                    color: $frogue-color-sub;
                    display: inline-block;
                    white-space: nowrap;
                    width: 10%;
                }
            }
            button {
                float: right;
                width: 40px;
                height: 40px;
                margin-top: 10px;
                background: transparent;
                border: none;
                font-size: 18px;
                color: #bbb;
                text-align: center;
            }
            &:after {
                content: "";
                display: block;
                clear: both;
            }
        }

        /* 토스트 메시지 */
        .toast-message{
            background-color:$frogue-color-main;
            color:$frogue-color-sub;
            opacity:0;
            position:absolute;
            border-radius:30px;
            height:30px;
            vertical-align:middle;
            text-align:center;
            line-height:24px;
            font-size:24px;
            width:82%;
            left:9%;
            z-index:1;
            top:-30px;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
            visibility: hidden;
            -webkit-transition: opacity 0.2s;
            transition: opacity 0.2s;
            span{
                font-size:16px;
                font-weight:400;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width:95%;
                height:20px;
                display:inline-block;
            }
            &.toasting{
                top:-30px;
                opacity:0.95;
                visibility: visible;
                -webkit-transition:opacity 0.2s, visibility 0s;
                transition:opacity 0.2s, visibility 0s;
            }
        }
        .chat-discussion {
            /*대화 내용 표시*/
            background-color: $frogue-color-sub;
            background-size: contain;
            padding: 64px 10px 20px 10px;
            overflow-x: hidden;
            height: calc(100% - 64px);
            min-height: calc(100% - 64px);
            /* 아이폰 사파리에서 스크롤 부드럽게 바꾸는 코드 has to be scroll, not auto */
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
            &::-webkit-scrollbar {
                /*스크롤바 사이즈*/
                width: 8px;
                height: 5px;
            }
            &::-webkit-scrollbar-track {
                /*스크롤바 배경색*/
                background-color: #ddd;
            }
            &::-webkit-scrollbar-thumb {
                /*스크롤바 잡는 부분 색*/
                background-color: #aaa;
                &:hover {
                    background-color: #888; /*스크롤바 잡는 부분 마우스 오버시 색*/
                }
            }
            .chat-message {
                /*메시지 공통영역*/
                margin-top: 4px;
                &:after {
                    /*float현상 캔슬링*/
                    content: "";
                    display: block;
                    clear: both;
                }
                .message {
                    position: relative;
                    max-width: 64.5%;
                    padding: 8px 10px 8px 10px;
                    .message-content {
                        word-break: keep-all;
                        white-space: pre-line;
                    }
                    .message-date {
                        position: absolute;
                        bottom: 0;
                        font-size: 10px;
                        color: $frogue-color-date-text;
                        letter-spacing: 0;
                    }
                    .img-container {
                        position:relative;
                        .img-overlay{
                            width: 100%;
                            height: 100%;
                            background: rgba(0,0,0,0.5);
                            position: absolute;
                            left: 0;
                            right: 0;
                            top: 0;
                            bottom: 0;
                            color:#fff;
                            text-align:center;
                            display:none;
                            border-radius:4px;
                            span{
                                font-size: 48px;
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                display: inline-block;
                                margin-top: -24px;
                                margin-left: -24px;
                                background: rgba(0,0,0,0.5);
                                width: 48px;
                                height: 48px;
                                padding: 0;
                                padding-bottom: 2px;
                                line-height: 48px;
                                text-align: center;
                                border: 3px solid #fff;
                                border-radius: 50%;
                            }
                        }
                        &:hover{
                            .img-overlay{
                                display:block;
                                cursor:pointer;
                            }
                        }
                        .img-square {
                            width: 100%;
                            height:auto;
                            border-radius:4px;
                        }
                    }
                    .file-download-btn{
                        position:relative;
                        display:inline-block;
                        padding:4px 8px 4px 36px;
                        border-radius:4px;
                        background: $frogue-color-button-bg;
                        color: $frogue-color-button-text;
                        text-decoration:none;
                        .file-icon-container{
                            width:36px;
                            position: absolute;
                            left:0px;
                            top:50%;
                            margin-top:-18px;
                        }
                        &:hover{
                            background: $frogue-color-highlight;
                            cursor: pointer;
                        }
                    }
                }
                &.left {
                    /*챗봇 말풍선 모양 */

                    .chatbot-profile-wrapper {
                        display: none;
                    }
                    .message {
                        float: left;
                        border-radius: 0 8px 8px 8px;
                        background-color: $frogue-color-balloon-chatbot-bg;
                        color: $frogue-color-balloon-chatbot-text;
                        .message-author {
                            display: none;
                        }
                        .message-date {
                            right: -44px;
                        }
                        .message-content {
                            // margin-bottom:5px;
                        }
                    }
                }
                &.right {
                    /*사용자 말풍선 모양 */
                    margin: 14px 0;
                    .message {
                        float: right;
                        background: $frogue-color-balloon-user-bg;
                        color: $frogue-color-balloon-user-text;
                        border: none;
                        border-radius: 8px 0 8px 8px;
                        max-width: 75%;
                        .message-date {
                            left: -44px;
                        }
                    }
                }

                .one-carousel{
                    .img-container {
                        width:260px;
                        height:260px;
                        overflow:hidden;
                        vertical-align:middle;
                        border-radius:4px;
                        .img-overlay{
                            span{
                            }
                        }
                        .img-square-bg {
                            width:260px;
                            height:260px;
                            background-size: cover;
                            background-repeat: no-repeat;
                            background-position: center;
                        }
                    }
                }
                .message.message-carousel-container {
                    /*캐로셀 메시지 박스 스타일*/
                    display: block;
                    clear: both;
                    margin-top: 3px;
                    float: left;
                    width: 100%;
                    max-width: 260px;
                    padding: 8px 8px;
                    background-color: $frogue-color-sub;
                    color: $frogue-color-balloon-chatbot-text;
                    border: 1px solid $frogue-color-button-border;

                    .img-container {
                        width:260px;
                        height:260px;
                        overflow:hidden;
                        vertical-align:middle;
                        border-radius:4px;
                        .img-overlay{
                            span{
                            }
                        }
                        .img-square-bg {
                            width:260px;
                            height:260px;
                            background-size: cover;
                            background-repeat: no-repeat;
                            background-position: center;
                        }
                    }

                    .disabled {
                        border: 1px solid #999999;
                        background-color: #cccccc;
                        color: #666666;
                        display:none;
                    }
                    .selected {
                        border: 2px solid #333;
                        background-color: #2fcc71;
                        color: #ffffff;
                        display:none;
                        &:after{
                            content: "\2713";
                            color:white;
                            text-align: center;
                            font-size:25px;
                            line-height: 13px;
                            z-index: 999;
                            position: absolute;
                            top: 5px;
                            right: 5px;
                        }
                    }

                }
            }
            /*챗봇이 던지는 버튼 스타일*/
            .button-container {
                padding-top: 1px;
                width: 70%;
                max-width: 260px;
                margin-bottom: 6px;
                display: block;
                clear: both;
                .quick-btn {
                    float: right;
                    width: auto;
                    display: inline-block;
                    position: absolute;
                    bottom: 0;
                }
                .maintain{
                    display:block !important;
                    &.disabled{
                        border: 1px solid $frogue-color-button-border;
                        background-color: $frogue-color-button-bg;
                        color: $frogue-color-button-text;
                        cursor:pointer;
                        &:hover{
                            background: $frogue-color-highlight;
                        }
                    }
                }
                .disabled {
                    border: 1px solid #999999;
                    background-color: #cccccc;
                    color: #666666;
                    display:none;
                }
                .selected {
                    border: 2px solid #333;
                    background-color: #2fcc71;
                    color: #ffffff;
                    display:none;

                    &:after{
                        content: "\2713";
                        color:white;
                        text-align: center;
                        font-size:25px;
                        line-height: 13px;
                        z-index: 999;
                        position: absolute;
                        top: 5px;
                        right: 5px;
                    }
                }
            }
            .btn-option-list {
                position: relative;
                display: block;
                width: 100%;
                margin-top: 3px;
                padding: 6px 10px;
                background: $frogue-color-button-bg;
                color: $frogue-color-button-text;
                border: 1px solid $frogue-color-button-border;
                border-radius: 4px;
                font-size: 14px;
                font-weight:500;
                cursor: not-allowed;
                i {
                    font-size: 12px;
                    color: $frogue-color-button-text;
                }
                .btn-icon-type {
                    /* 버튼타엡에 따라 표시하는 아이콘 위치 잡는 코드임*/
                    position: absolute;
                    right: 8px;
                    display: inline-block;
                    top: 50%;
                    margin-top: -8px;
                    opacity: 0.8;
                }
                &:hover:not(.disabled):not(.selected) {
                    cursor: pointer;
                    background: $frogue-color-highlight;
                    .btn-icon-type {
                        opacity: 1;
                    }
                }
            }

            /* 챗봇이 던지는 캐로셀 버튼 스타일 */
            .agile .btn-option-list {
                .btn-option-list {
                    text-align: center;

                }
            }
        }
        /* 입력중 표시, Typing indicator */
        .chatbot-typing-indicator {
            background-color: $frogue-color-balloon-chatbot-bg;
            will-change: transform;
            width: auto;
            border-radius: 0 8px 8px 8px;
            padding: 10px;
            display: table;
            position: relative;
            margin-top: 4px;
            span {
                height: 8px;
                width: 8px;
                float: left;
                margin: 0 2px;
                background-color: $frogue-color-balloon-chatbot-text;
                display: block;
                border-radius: 50%;
                opacity: 0.2;
                @for $i from 1 through 3 {
                    &:nth-of-type(#{$i}) {
                        animation: 1s blink infinite ($i * 0.3333s);
                    }
                }
            }
        }
        .user-typing-indicator {
            background-color: $frogue-color-balloon-user-bg;
            will-change: transform;
            width: auto;
            border-radius: 8px 0 8px 8px;
            float: right;
            padding: 10px;
            display: table;
            position: relative;
            margin-top: 4px;
            span {
                height: 8px;
                width: 8px;
                float: left;
                margin: 0 2px;
                background-color: $frogue-color-balloon-user-text;
                display: block;
                border-radius: 50%;
                opacity: 0.2;
                @for $i from 1 through 3 {
                    &:nth-of-type(#{$i}) {
                        animation: 1s blink infinite ($i * 0.3333s);
                    }
                }
            }
        }
        @keyframes blink {
            50% {
                opacity: 0.6;
                transform: scale(1.05);
            }
        }


        /* 퀵버튼 스타일 */
        .quick-button-space {
            height: 12px;
            &.opened {
                height: 0;
            }
        }

        .quick-button-container {
            background: $frogue-color-sub;
            position: absolute;
            bottom: 84px;
            left: 5px;
            right: 0px;
            padding: 2px 10px 2px 10px;
            height: 28px;
            white-space: nowrap;
            word-break: keep-all;
            overflow:hidden;
            z-index: 100;
            -webkit-transition: opacity 0.6s ease-in;
            -moz-transition: opacity 0.6s ease-in;
            -ms-transition: opacity 0.6s ease-in;
            -o-transition: opacity 0.6s ease-in;
            transition: opacity 0.6s ease-in;
            .scrollable{
                width:100%;
                height: 100%;
                position:absolute;
                left:0;
                text-align:center;
                white-space: nowrap;
                word-break: keep-all;
                overflow-x: auto;
                overflow-y: hidden;
                -webkit-box-sizing: content-box;
                -ms-overflow-style: none;
                box-sizing: content-box;

                &::-webkit-scrollbar {
                    background: transparent;
                    width: 1px !important;
                    height: 0px !important;
                }

                >span{
                    white-space: nowrap;
                }
            }
            .btn-quick-list {
                display: inline-block;
                padding: 4px 10px;
                margin-right: 4px;
                margin-bottom:6px;
                background: $frogue-color-button-bg;
                color: $frogue-color-button-text;
                border: 1px solid $frogue-color-button-border;
                border-radius: 4px;
                font-size: 14px;
                height: 30px;
                vertical-align: top;
                cursor: pointer;
                &:hover {
                    background: $frogue-color-highlight;
                }
            }
            &.opened,
            &.no-quick-btns {
                bottom: 200px;
                height: 0;
                opacity: 0;
                overflow: hidden;
                -webkit-transition: all 0.2s ease-out;
                -moz-transition: all 0.2s ease-out;
                -ms-transition: all 0.2s ease-out;
                -o-transition: all 0.2s ease-out;
                transition: all 0.2s ease-out;
            }
        }


        .frogue-bottom-persistent_menu-wrap {
            position: absolute;
            bottom: 88px;
            width: 100%;
            border-top: 1px solid var(--color-main);
            border-bottom: 1px solid var(--color-main);
            color: #fff;
            -webkit-transition: all 0.2s ease-out;
            -moz-transition: all 0.2s ease-out;
            -ms-transition: all 0.2s ease-out;
            -o-transition: all 0.2s ease-out;
            transition: all 0.2s ease-out;
            z-index: 101;
            &:before {
                content: "";
                position: absolute;
                width: 100%;
                height: 100%;
                background: var(--color-main);
                opacity: 0.8;
            }
            & > div {
                position: relative;
                z-index: 1;
            }
            ul {
                list-style: none;
                padding: 6px;
                height: 72px;
                overflow-y: auto;
                &::-webkit-scrollbar {
                    /*스크롤바 사이즈*/
                    width: 8px;
                    height: 5px;
                }
                &::-webkit-scrollbar-track {
                    /*스크롤바 배경색*/
                    background-color: #c4c4c4;
                    border-left: 1px solid rgba(0,0,0,0.2);
                }
                &::-webkit-scrollbar-thumb {
                    /*스크롤바 잡는 부분 색*/
                    background-color: var(--color-main);
                    border: 1px solid rgba(0,0,0,0.2);
                    &:hover {
                        background-color: rgba(0,0,0,6); /*스크롤바 잡는 부분 마우스 오버시 색*/
                    }
                }
                li {
                    line-height: 22px !important;
                    margin-bottom: 16px;
                    cursor: pointer;
                }
            }
            .frogue-search-wrap {
                ul {
                    li {
                        line-height: 1.2em !important;
                        margin-bottom: 8px;
                        span {
                            color: #f5d019;
                            font-weight: bold;
                        }
                    }
                }
            }

            .frogue-menu-wrap {
                overflow: auto;
                padding: 10px 30px 0 40px;
                i {
                    font-style: normal;
                    position: absolute;
                    top: -38px;
                    left: 10px;
                    background: var(--color-main);
                    border-radius: 6px;
                    padding: 2px 6px 3px;
                    &:before {
                        content: "";
                        position: absolute;
                        left: 12px;
                        bottom: -6px;
                        width: 0;
                        height: 0;
                        border-left: 6px solid transparent;
                        border-right: 6px solid transparent;
                        border-top: 6px solid var(--color-main);
                    }
                }
                button {
                    float: left;
                    width: calc(100% / 3 - 10px);
                    background: #ffffff;
                    color: var(--color-main);
                    text-align: center;
                    height: 60px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 1.2em;
                    border-radius: 6px;
                    border: 1px solid var(--color-main);
                    margin: 0 10px 10px 0;
                    &:hover {
                        background: var(--color-highlight);
                    }
                }

                span {
                    position: absolute;
                    top: 0;
                    display: block;
                    width: 32px;
                    height: 100%;
                    &:before {
                        content: "";
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        border: solid #fff;
                        border-width: 0 3px 3px 0;
                        display: inline-block;
                        padding: 6px;
                        cursor: pointer;

                    }
                    &.prev {
                        left: 0;
                        &:before {
                            left: 15px;
                            transform: rotate(135deg);
                            -webkit-transform: rotate(135deg);
                        }
                    }
                    &.next {
                        right: 0;
                        &:before {
                            right: 15px;
                            transform: rotate(-45deg);
                            -webkit-transform: rotate(-45deg);
                        }
                    }
                }
                /*span {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 0;
                    height: 0;
                    border-top: 20px solid transparent;
                    border-bottom: 20px solid transparent;
                    cursor: pointer;
                    border-radius: 6px;
                    &.prev {
                        left: 4px;
                        border-right:10px solid #fff;
                    }
                    &.next {
                        right: 4px;
                        border-left: 10px solid #fff;
                    }
                }*/
            }
            .frogue-menu-detail-wrap {
                .menu-list_tit {
                    position: relative;
                    border-bottom: 1px solid #fff;
                    padding: 16px 0;
                    margin: 0 20px;
                    button {
                        position: absolute;
                        top: 12px;
                        border: 1px solid #fff;
                        border-radius: 20px;
                        background: #fff;
                        cursor: pointer;
                        padding: 1px 6px 2px;
                        &:hover {
                            background: var(--color-highlight);
                        }
                    }
                    p {
                        text-align: center;
                        font-size: 1.2em;
                        line-height: 1.1em;
                        color: #fff;
                        letter-spacing: 2px;
                        width: calc(100% - 120px);
                        margin: auto;
                    }
                }
                .menu-list_cont {
                    ul {
                        max-height: 121px;
                        height: 100%;
                        li {
                            font-size: 1.2em;
                            text-align: center;
                            line-height: 1.4em;
                            font-weight: bold;
                            padding: 0 20px;
                        }
                    }
                }
            }
        }

        .frogue-input-wrapper {
            // position: relative;
            padding: 0 16px 10px 90px;
            font-size: 14px;
            position: absolute;
            bottom: 0;
            right: 0;
            left: 0;
            height: 78px;
            background:$frogue-color-sub;

            /*패널 닫히는 애니메이션 : Input box*/
            -webkit-transition: all 0.4s ease-out;
            -moz-transition: all 0.4s ease-out;
            -ms-transition: all 0.4s ease-out;
            -o-transition: all 0.4s ease-out;
            transition: all 0.4s ease-out;
            &.none-btn-extension {
                padding: 0 16px 10px 16px;
            }
            .input-text-border {
                background: $frogue-color-sub;
                border-bottom: 1.2px solid $frogue-color-main;
                //border-radius: 10px 0 10px 10px;
                padding-left: 4px;
                display: block;
                margin: 0 auto;
                width: 100%;
                height: 44px;
            }
            input.input-text {
                font-size: 16px;
                color: $frogue-color-main;
                border: none;
                background:none;
                height: 40px;
                position: relative;
                top: 10px;
                width: unquote("-webkit-calc(100% - 40px)");
                width: unquote("-moz-calc(100% - 40px)");
                width: unquote("calc(100% - 40px)");
                &::-ms-clear {
                    display: none;
                }
            }
            .btn-extension {
                position: absolute;
                top: 8px;
                left: 8px;
                width: 36px;
                height: 36px;
                border: none;
                box-sizing: border-box;
                -moz-box-sizing: border-box;
                -webkit-box-sizing: border-box;
                border-radius: 50%;
                background: $frogue-color-button-bg;
                transition: all 0.4s ease-out;
                transform: rotate(0deg);
                .btn-img {
                    width: 36px;
                    height: 36px;
                }
                &:hover {
                    background: $frogue-color-highlight;
                    cursor: pointer;
                }
            }
            .btn-menu {
                position: absolute;
                top: 8px;
                left: 52px;
                width: 36px;
                height: 36px;
                border: 0;
                background: transparent;
                cursor: pointer;
                i {
                    float: left;
                    display: block;
                    width: 12px;
                    height: 12px;
                    background: $frogue-color-button-bg;
                    border: 2px solid var(--color-main);
                    border-radius: 2px;
                    margin: 0 1px 1px 0;
                }
                &.active {
                    i {
                        background: var(--color-main);
                    }
                }
                &:hover {
                    background: $frogue-color-highlight;
                }
            }
            .btn-send {
                position: absolute;
                bottom: 46px;
                right: 8px;
                width: 32px;
                height: 32px;
                cursor: pointer;
                border: none;
                background: none;
                -webkit-transition: all 0.4s ease-out;
                -moz-transition: all 0.4s ease-out;
                -ms-transition: all 0.4s ease-out;
                -o-transition: all 0.4s ease-out;
                transition: all 0.4s ease-out;
                > .btn-img {
                    width: 24px;
                    height: 24px;
                    opacity: 0.8;
                }
                &:hover {
                    > .btn-img {
                        opacity: 1;
                    }
                }
                &:active,
                &:focus {
                    > .btn-img {
                        opacity: 1;
                    }
                }
            }
        }
        .frogue-panel-extention {
            display: block;
            text-align: center;
            background: $frogue-color-sub;
            color: $frogue-color-main;
            border-bottom:1px solid $frogue-color-main;
            position: absolute;
            bottom: 40px;
            left: 0px;
            width: 100%;
            margin: 0 auto 0 auto;
            padding-top: 8px;

            /*패널 닫히는 애니메이션*/
            -webkit-transition: all 0.2s ease-out;
            -moz-transition: all 0.2s ease-out;
            -ms-transition: all 0.2s ease-out;
            -o-transition: all 0.2s ease-out;
            transition: all 0.2s ease-out;
            max-height: 0;
            opacity: 0;
            overflow: hidden;

            div {
                display:inline-block;
                text-align:center;
                .btn-img {
                    box-sizing: border-box;
                    -moz-box-sizing: border-box;
                    -webkit-box-sizing: border-box;
                    border-radius: 50%;
                    width: 48px;
                    height: 48px;
                    background: $frogue-color-button-bg;
                    display:block;
                    margin:0 5px;
                    &:hover {
                        cursor: pointer;
                        background: $frogue-color-highlight;
                    }
                }
            }
        }
        .frogue-footer {
            bottom: 0px;
            left: 0;
            width: 100%;
            position: absolute;
            .btn-banner {
                color: $frogue-color-main;
                background: $frogue-color-sub;
                width: 100%;
                border: none;
                padding: 7px 0 12px;
                margin: 0 auto 0 auto;
                display: block;
                text-align: center;
                text-decoration: none;
                cursor: pointer;
                &:hover {
                    text-decoration: underline;
                    opacity: 0.9;
                }
            }
        }
        .frogue-bottom-container.opened {
            /* Extention 열렸을때 디자인 적용 */
            .frogue-input-wrapper {
                /*패널 열리는 애니메이션 : Input Box 이동*/
                -webkit-transition: all 0.2s ease-out;
                -moz-transition: all 0.2s ease-out;
                -ms-transition: all 0.2s ease-out;
                -o-transition: all 0.2s ease-out;
                transition: all 0.2s ease-out;
                bottom: 80px;
                .btn-extension {
                    -webkit-transition: all 0.2s ease-out;
                    -moz-transition: all 0.2s ease-out;
                    -ms-transition: all 0.2s ease-out;
                    -o-transition: all 0.2s ease-out;
                    transition: all 0.2s ease-out;
                    transform: rotate(45deg);
                }
                .btn-send {
                }
            }
            .frogue-panel-extention {
                /*패널 열리는 애니메이션*/
                -webkit-transition: max-height 0.4s, opacity 0.4s ease-out;
                -moz-transition: max-height 0.4s, opacity 0.4s ease-out;
                -ms-transition: max-height 0.4s, opacity 0.4s ease-out;
                -o-transition: max-height 0.4s, opacity 0.4s ease-out;
                transition: max-height 0.4s, opacity 0.4s ease-out;
                max-height: 84px;
                opacity: 1;
                button {
                    background: none;
                    border: none;
                    text-align: center;
                    label {
                        text-align: center;
                        color: $frogue-color-main;
                        position: relative;
                        bottom: 2px;
                        display:block;
                    }
                    .img-box {
                        background: $frogue-color-sub;
                        position: relative;
                        top: 4px;
                        cursor: pointer;
                    }
                }
            }
        }
    }

    /*아이폰 브라우저 툴바 사이즈 변동성 생기는 부분 해결*/
    @media only screen and (max-device-width: 667px), screen and (max-width: 450px){
        body{
            overflow:hidden;
            position: fixed;
        }
        .frogue-screen{
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            -ms-flex-direction: column;
            flex-direction: column;
            -webkit-box-pack: start;
            -ms-flex-pack: start;
            justify-content: flex-start;
            position: absolute;
            top: 0 !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            height: 100% !important;
            border-radius: 0 !important;
            max-height:100% !important;
        }
    }
    /* 가랑비 이상에 banner제거 하는 사용자를 위한 스타일 */
    .frogue-pond.removeBanner {
        .frogue-container {
            .frogue-content-wrapper {
                height: calc(100% - 80px);
            }
            .quick-button-container {
                bottom: 54px;
            }
            .frogue-bottom-container {
                &.opened {
                    .frogue-panel-extention {
                        bottom: -1px;
                    }
                }
            }
            .frogue-input-wrapper {
                height: 44px;
                .btn-send {
                    bottom: 12px;
                }
            }
        }
        .frogue-footer {
            display: none;
        }
    }

    .frogue-pond.removeBanner.opened {
        .frogue-container {
            .frogue-content-wrapper {
                height: calc(100% - 174px);
            }
        }
    }

</style>
