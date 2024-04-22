class SaltedText{
    constructor(){
        this.str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789~!@#$%^&*()_+ ';
    }

    addSalt(txt){
        this.txt = txt;
        const pickedStr = this.str[txt.length % this.str.length];
        const pickedStr2 = this.str[this.str.length - (txt.length % this.str.length)];

        this.txt = pickedStr + pickedStr2 +  this.txt + pickedStr2 + pickedStr;

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

        // const drag = (e) => {
        //     this.dragEl = e.target;
        //     console.log(this.dragEl);
        //     e.dataTransfer.setData('myData', this.dragEl.innerHTML);
        // }
        // const drop = (e) => {
        //     console.log(e.target);
        //     this.dropEl = e.target;
        //     this.dropEl.append(this.dragEl);
        // }
        // const preventDflt = (e) => {
        //     e.preventDefault();
        // }
        // param.root.ondrop = drop;
        // param.root.ondragover = preventDflt;
        // param.item.forEach(itm => {
        //     itm.draggable = true;
        //     itm.ondragstart = drag;
        // })
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
