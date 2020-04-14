
# 환경구성 (Environment Configuration)
문서 모드 IE 10 일때는 css에서 var(--변수) 를 사용하지 못하여
그냥 셋팅하는 걸로 한다. 

## 노드 설치 (Install Node)
node.js : https://nodejs.org/ko/
( 6.x, 8.x, 10.x, 12.x )

아래처럼 명령어를 입력하여 설치를 확인.
In command, check node installed success
> node -v

## NPM 설치 (Install npm)
> npm install npm@latest -g

아래처럼 명령어를 입력하여 설치를 확인.
In command, check npm installed success
> npm -v

## 프로젝트 가져오기 (clone project)
다운로드 (Download) : https://github.com/danbeeai/chatui-example-vuejs
또는 (or) 
> git clone https://github.com/danbeeai/chat-example.git

## 패키지 설치 (Install package)
해당 경로로 이동
Go to project_path
> cd project_path

패키지 설치
Install package.
> npm install

## 개발서버 Run dev server
개발 서버 실행
Start development server
> npm run dev

## 빌드 Run build
배포 파일 만들기 ( 빌드 )
Build package ( make deploy file )
> npm run build


# 환경구성 도커 (Docker Environment Configuration)
docker push danbeeinc/danbeeai-frogue:latest
또는 (or)
참고 https://github.com/danbeeai/docker-frogue-local.git


# 사용방법 (챗봇 변경) How to change
index.html 에 챗봇아이디, 이름, 이미지 변경
Change the chatbot ID, Name, Image in the file ( index.html )    

# License
Example Conde is licensed under the Apache License, Version 2.0.
See [LICENSE](LICENSE) for full license text.

```
Copyright 2018 danbee Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```


