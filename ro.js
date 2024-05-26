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

    outputContent(){
        return this.body.innerHTML;
    }

    getContent(c){
        this.body.innerHTML = c;
    }

    setEditable(){
        this.editable = !this.editable;
    }
}

class Probability extends UtilFnc{
    constructor(param){
        super();

        this.param = param;

        let val;
        let others = [];
        let tmpNum = 0;
        for(let key in param){
            val = param[key];

            if(typeof val === 'boolean' && val === true){
                others.push({key: val});
            }

            if(!isNaN(val)){

            }
        }

    }

    initData(param){
        this.param = param;
    }

    getItem(param){
        const rdmNum = Math.random();
        console.log(rdmNum);
        const finalTable = {};
        
        let val;
        let others = [];
        let tmpNum = 0;
        for(let key in this.param){
            val = this.param[key];
            if(typeof val === 'boolean' && val === true){
                others.push(key);
            }else if(!isNaN(val) && val !== false){
                finalTable[key] = val;
                tmpNum += val;
            }
        }

        others.forEach(o => {
            finalTable[o] = ((100 - tmpNum) / others.length);
        })
        
        tmpNum = 0;
        let rtnVal = {};
        for(let key in finalTable){
            val = finalTable[key];

            tmpNum += val;
            if(rdmNum < tmpNum * 0.01){
                // rtnVal = {[key]: val};
                rtnVal = {
                    name: key,
                    per: val + '%'
                };
                break;
            }
        }

        console.log(rtnVal);

        if(param && param.gui === true){
            const ul = document.createElement('ul');
            ul.style.cssText = `
                list-style: none;
                margin: 0;
                padding: 0;
                padding-top: 20px;
                display: flex;
                align-items: center;
                width: 100%;
                position: relative;
            `;
            let li;
            for(let key in finalTable){
                val = finalTable[key];
                li = document.createElement('li');
                li.textContent = key;
                li.dataset.name = key;
                li.style.cssText = `
                    width: ${val}%;
                    border: 1px solid #ddd;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px;
                    transition: background 0s .5s;
                    box-sizing: border-box;
                `;

                ul.appendChild(li);
            }

            li = document.createElement('li');
            li.style.cssText = `
                position: absolute;
                top: 0;
                left: -15px;
                width: 30px;
                height: 30px;
                border: 15px solid transparent;
                border-top: 15px solid #f00;
                padding: 0;
                box-sizing: border-box;
                transition: left .5s linear;
            `;

            ul.appendChild(li);
            (param.target || document.body).innerHTML = '';
            (param.target || document.body).appendChild(ul);

            setTimeout(() => {
                li.style.left = `calc(${rdmNum * 100}% - 15px)`;
                ul.querySelector('li[data-name="' + rtnVal.name + '"]').style.background = 'gold';
            })
        }

        return rtnVal;
    }
}

class Compresss{
    //짧은것만 되는듯...
    com(str){
        console.log(window.btoa(unescape(encodeURIComponent(str))));
        console.log(window.btoa(str));
        return window.btoa(unescape(encodeURIComponent(str)));
    }
    
    decom(){
        return window.atob(str);

    }
}

class Pie extends UtilFnc{
    constructor(param){
        super();
        const t = this;
        t.target = param.target;
        t.listTarget = param.listTarget;

        t.data = param.data || undefined;
    }

    getRdmColor(opc = 1){
        const mn = 80;
        const mx = 255;
        const r = super.getRandomNum(mn, mx);
        const g = super.getRandomNum(mn, mx);
        const b = super.getRandomNum(mn, mx);

        return `rgba(${r}, ${g}, ${b}, ${opc})`;
    }

    setUI(){
        const t = this;

        let percentVal = 0;

        t.target.classList.add('pie');

        let li, wrapper, item, item2, val, color;

        for(let key in t.data){
            val = t.data[key];

            color = t.getRdmColor();

            li = document.createElement('li');
            li.dataset.name = key;
            li.dataset.val = val;
            li.style.transform = `rotate(${percentVal}deg)`;

            wrapper = document.createElement('div');
            wrapper.classList.add('wrapper');

            item = document.createElement('div');
            
            item.style.transform = `rotate(${t.calcDeg(val)}deg)`;
            item.style.cssText = `
                transform: rotate(${t.calcDeg(val)}deg);
                background: ${color};
            `;
            percentVal += t.calcDeg(val);
            

            if(+val === 100){
                li.classList.add('eq100');
            }else if(+val > 50){
                li.classList.add('over50');
                item.style.transform = 'rotate(0)';
                item.style.cssText = `
                    transform: rotate(0);
                    width: 50%;
                    left: 50%;
                    background: ${color};
                `;

                item2 = document.createElement('div');

                item2.style.cssText = `
                    width: 50%;
                    transform: rotate(${t.calcDeg(val)}deg);
                    background: ${color};
                `;

                wrapper.appendChild(item2);
            }
            
            li.appendChild(wrapper);
            wrapper.appendChild(item);
            

            t.target.appendChild(li);

            li = document.createElement('li');
            li.dataset.name = key;
            li.innerHTML = `
                <span></span><strong>${key}</strong>
            `;
            li.style.cssText = `
                display: flex;
                margin-bottom: 5px;
                align-items: center;
                cursor: pointer;
            `;
            li.querySelector('span').style.cssText = `
                margin-right: 5px;
                background: ${color};
                width: 30px;
                height: 30px;
            `;

            li.onmouseover = (e) => {
                const trg = e.target.nodeName === 'LI' ? e.target : e.target.closest('li');
                t.target.querySelector('li[data-name="' + trg.dataset.name + '"]').style.scale = (1.2);
            }
            li.onmouseout = (e) => {
                const trg = e.target.nodeName === 'LI' ? e.target : e.target.closest('li');
                t.target.querySelector('li[data-name="' + trg.dataset.name + '"]').style.scale = (1);
            }
            this.listTarget.append(li);
        }

    }

    calcDeg(val){
        return 360 / (100 / val);
    }

    setData(d){
        t.data = d;
    }
}