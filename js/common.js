// ヘッダー用のコンポーネント
Vue.component('header-component', {
    props:{
        isNavOpen:Boolean,
    },
    template:`
    <header class="page-header" :class="{open:isNavOpen}">
        <a href="index.html"><img class="logo" src="./img/logo.png" alt="Saki Yanase Portfolio"></a>
            <nav>
                <ul class="main-nav">
                    <li><a href="index.html#works" @click="$emit('close-nav')">Works</a></li>
                    <li><a href="index.html#about" @click="$emit('close-nav')">About</a></li>
                    <li><a href="index.html#contact" @click="$emit('close-nav')">Contact</a></li>
                </ul>
            </nav>
            <button type="button" class="nav-btn" id="nav-btn" @click="$emit('toggle-nav')">
                <span class="nav-btn-line">
                    <span class="visually-hidden">メニュー開閉</span>
                </span>
            </button>
        </header>
    `,
});

// フッター用のコンポーネント
Vue.component('footer-component', {
    template:`
    <footer>
        <div class="footer-content">
            <div class="footer-nav">
                <ul class="footer">
                    <li class="footer-item"><a href="#works" class="btn_works">Works</a></li>
                    <li class="footer-item"><a href="#about" class="btn_about">About</a></li>
                    <li class="footer-item"><a href="#contact" class="btn_contact">Contact</a></li>
                </ul>
                <ul class="footer">
                    <li class="footer-item">
                    <i class="fa-brands fa-github"></i><a href="https://github.com/saki9219/" target="_blank">GitHub</a></li>
                </ul>
            </div>
            <small>&copy;2026 Saki Yanase</small>
        </div>
    </footer>
    `,
});

// モーダル用のコンポーネント
Vue.component('modal-component', {
    props:{
        item:Object,
        isOpen:Boolean,
    },
    template:`
        <dialog id="modal" @click.self="close" ref="dialog">
            <div v-if="item">
                <img id="modal-img" :src="'img/' + item.image" :alt="item.title">
                <p id="modal-name">{{item.title}}</p>
                <div class="works-tag">
                <span v-for="tag in item.tags" :key="tag"
                :class="{
                        'works-tag-html': tag === 'HTML / CSS',
                        'works-tag-js': tag === 'JavaScript',
                        'works-tag-vue': tag === 'Vue.js'
                        }"
                > {{ tag }}
                </span>
            </div>
                <p id="modal-text">{{item.text}}</p>
                <p id="modal-link">URL:<a href="#">{{item.link}}</a></p>
                <p id="modal-link">GitHub:<a href="#">{{item.github}}</a></p>
                <button class="btn-menu" id="modal-close" type="button" @click="close">×</button>
                </div>
        </dialog>
    `,
    methods:{
        close(){
            this.$emit('close');
        }
    },
    watch:{
        isOpen(val){
            const dialog = this.$refs.dialog;
            if(!dialog) return;
            if(val) {
                dialog.showModal();
                document.body.style.overflow = 'hidden';
            } else {
                dialog.close();
                document.body.style.overflow = '';
            }
        },
    },
});

// ワークカードのコンポーネント
Vue.component('work-card', {
    props:{
        item:Object,
    },
    template:`
    <div class="item" id="work-card" @click="$emit('show-detail', item)">
        <img
        :src="'img/' + item.image" 
        :alt="item.title"
        class="item-img">
        <p>{{item.title}}</p>

        <div class="works-tag">
            <span v-for="tag in item.tags" :key="tag"
            :class="{
                    'works-tag-html': tag === 'HTML / CSS',
                    'works-tag-js': tag === 'JavaScript',
                    'works-tag-vue': tag === 'Vue.js'
                    }"
            > {{ tag }}
            </span>
        </div>
    </div>
    `,
});

// ワークグリッドのコンポーネント
Vue.component('work-grid', {
    props:{
        items:Array,
    },
    template:`
    <div class="grid" id="work-grid">
        <work-card
        v-for="item in items"
        :key="item.id"
        :item="item"
        @show-detail="$emit('show-detail', item)"
        ></work-card>
    </div>
    `,
});

new Vue({
    el:'#app',
    data:{
        isNavOpen: false, // ナビゲーションの開閉状態
        worksList:[],  // 制作物の情報
        item:null,
        isModalOpen:false, // モーダルの開閉状態
        // お問い合わせフォームのバリデーションチェック
        userName: '',
        email: '',
        nameError: '',
        emailError:'',
    },
    methods:{
        toggleNav(){
            this.isNavOpen = !this.isNavOpen;
            if(this.isNavOpen){
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        },
        closeNav() {
            this.isNavOpen = false;
            document.body.style.overflow = '';
        },
        openModal(item){
            this.item = item;
            this.isModalOpen = true;
        },
        closeModal(){
            this.isModalOpen = false;
        },
        validateName() {
            let name = this.userName.trim();
            if(name === '') {
                this.nameError = 'お名前を入力してください。';
                return;
            }
            if(name.length < 2) {
                this.nameError = 'お名前は2文字以上で入力してください。';
                return;
            }
            this.nameError = '';
        },
        validateEmail() {
            let email = this.email.trim();
            if(email === '') {
                this.emailError = 'メールアドレスを入力してください。';
                return;
            }
            // @マークの有無
            if(!email.includes('@')) {
                this.emailError = 'メールアドレスの形式が正しくありません。';
                return;
            }
            const parts = email.split('@');
            if(parts.length !==2 || parts[0] === '' || !parts[1].includes('.')){
                this.emailError = 'メールアドレスの形式が正しくありません。';
                return;
            }
            this.emailError = '';
        },
    },
    async created() {
        try {
            const response = await fetch('./json/works.json');
            if(!response.ok){
                throw new Error('ワークデータの取得に失敗しました。');
            }
            this.worksList = await response.json();
            // console.log(this.worksList);
        }catch(e) {
            console.error(e);
        }
    },
    computed:{
        canSubmit() {
            // 必須項目
            const requiredFilled =
            this.userName.trim() !== '' &&
            this.email.trim() !== '';
            // エラーの有無
            const noErrors =
            !this.nameError &&
            !this.emailError;
            return requiredFilled && noErrors; 
        }
    }
});