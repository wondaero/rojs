class SaltedText{
    constructor(){
        this.str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~!@#$%^&*()_+ ';
    }

    addSalt(txt){
        this.txt = txt;
        const pickedStr = this.str[txt.length % this.str.length];
        const pickedStr2 = this.str[this.str.length - (txt.length % this.str.length)];

        this.txt = pickedStr + pickedStr2 + this.txt + pickedStr2 + pickedStr;

        return this.txt;
    }

    getSaltedText(){
        return this.txt;
    }
}

class Treee{
    constructor(param){
        this.data = param.data;

        this.tmpl = `
            <ul>
                <li>
                    <div>
                        <span class="icon" draggable="true"></span>
                        <label>
                            <strong>name</strong>
                            <input type="text" />
                        <label>
                    </div>
                <li>
            <ul>
        `;

        this.treeDom;
        this.dragEl;
        this.dropEl;
        this.activeEl;

        return this;

    }

    makeTemplate(tmpl){
        if(tmpl) this.tmpl;
        return this.tmpl;
    }

    makeTree(target){
        (target || document.body).innerHTML = '';
        this.createTree();
    }

    createTree(target, d){
        // const tag = new DOMParser().parseFromString(this.tmpl, "text/xml");
        // console.log(tag.querySelectorAll(':scope > *'));

        const drag = (e) => {
            this.dragEl = e.target.closest('li');
            this.dragEl.classList.add('from-drag');
            e.dataTransfer.setData('myData', this.dragEl.innerHTML);
        }
        const drop = (e) => {
            let targetLi;
            
            targetLi = e.target.nodeName === 'LI' ? e.target : e.target.closest('li');
            this.dropEl = targetLi.querySelector(':scope > ul');

            if(!this.dropEl){
                const newUl = document.createElement('ul');
                targetLi.appendChild(newUl);
                this.dropEl = newUl;
            }


            try{
                this.dropEl.append(this.dragEl);
            }catch(e){
                alert('실패하였습니다.');
            }

            const hasClassTag = this.treeDom.querySelector('.target-li');
            if(hasClassTag) hasClassTag.classList.remove('target-li');
            this.dragEl.classList.remove('from-drag');
        }

        const dragover = (e) => {
            if(this.activeEl === (e.target.nodeName === 'LI' ? e.target : e.target.closest('li'))){
                e.preventDefault();
                return;
            };

            this.activeEl = e.target.nodeName === 'LI' ? e.target : e.target.closest('li');

            if(this.dragEl === this.activeEl) return;

            const hasClassTag = this.treeDom.querySelector('.target-li');
            if(hasClassTag) hasClassTag.classList.remove('target-li');

            this.activeEl.classList.add('target-li');

            e.preventDefault();
        }


        if(!this.treeDom){
            this.treeDom = document.createElement('ul');
            this.treeDom.ondrop = drop;
            this.treeDom.ondragover = dragover;
        }


        let li;
        (d || this.data).forEach((el, idx) => {
            li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <span class="icon" draggable="true"></span>
                    <label>
                        <strong>name</strong>
                        <input type="text" value="${el.name}" />
                    </label>
                </div>
            `;

            li.querySelector('[draggable]').ondragstart= drag;

            // this.treeDom.appendChild(li);
            
            if(target){
                const oldUl = target.querySelector(':scope > ul');
                if(oldUl){
                    oldUl.appendChild(li);
                }else{
                    const ul = document.createElement('ul');
                    ul.appendChild(li);
                    target.appendChild(ul);
                }
            }else{
                this.treeDom.appendChild(li);
            }

            // this.treeDom = ul;

            if(el.children && el.children.length){
                // console.log(li);
                this.createTree(li, el.children);
            }

        })

        // console.log(this.treeDom);

        // document.body.innerHTML = '';
        document.body.appendChild(this.treeDom);

    }
}

class UtilFnc{
    constructor(param){
        this.char = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    }
    getRandomNum(mn, mx){
        return Math.floor(Math.random() * (mx - mn + 1)) + mn;
    }

    getRdmTxt(len){
        let rdmTxt = '';
        for(let i = 0; i < len; i++){
            rdmTxt += this.char[this.getRandomNum(0, this.char.length - 1)];
        }

        return rdmTxt;
    }
}


class TextArea2 extends UtilFnc{
    constructor(param){
        super();
        this.target = param.target;
        this.target.classList.add('custom-textarea');
        this.files = [];
        this.editable = param.editable !== undefined ? param.editable : true;


        if(this.editable) this.createHeader();
        this.createBody();


        if(param.option){

        }

    }
    createHeader(){
        const header = document.createElement('header');
        const ul = document.createElement('ul');

        let li;
        for(let i = 0; i < 1; i++){
            li = document.createElement('li');
            li.textContent = '이미지';
            li.addEventListener('click', () => {
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.click();

                fileInput.addEventListener('change', (e) => {

                    const fileId = super.getRdmTxt(12);

                    e.target.files[0].fileId = fileId;

                    this.files.push(e.target.files[0]);

                    console.log(this.files);

                    this.previewImg(this.files[0]);


                })
            })
            ul.appendChild(li);
        }
        // const imgBtn = document.createElement('button');
        // imgBtn.textConent = '이미지';

        header.appendChild(ul);
        this.target.appendChild(header);
    }

    createBody(){
        this.body = document.createElement('div');
        this.body.classList.add('textarea');
        this.body.contentEditable = this.editable;

        this.target.append(this.body);
    }

    previewImg(file){
        const t = this;
        if(file){
            const reader = new FileReader();

            reader.onload = function (e) {

                const img = document.createElement('img');
                img.src = e.target.result;
                img.dataset.id = file.fileId;
                t.body.appendChild(img);
            }
               
            reader.readAsDataURL(file);
        }
    }

    text2obj(){
        const t = this;
        const validFiles = [];
        const tmpTag = document.createElement('div');
        tmpTag.innerHTML = this.body.innerHTML;

        let validFile;
        tmpTag.querySelectorAll('img').forEach((img, idx) => {
            validFile = t.files.filter(f => f.fileId === img.dataset.id)[0];

            if(validFile) validFiles.push(validFile);

            if(img.src.indexOf('data:image') === 0) img.src = '';
        })

        return {
            files: validFiles,
            content: tmpTag.innerHTML
        }
    }

    getContent(c){
        this.body.innerHTML = c;
    }

    setEditable(){
        this.editable = !this.editable;
    }
}