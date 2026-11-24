export class CustomPrompt {

    constructor(container = document.body, promptText = 'Enter Details') {
        this.container = container;
        this.promptText = promptText;
        this.prompt_ = null;
    }

    injectCustomPrompt() {
        const _prompt = document.createElement('div');
        _prompt.className = "prompt_container";
        _prompt.innerHTML = `
            <div class="prompt_content">
                <div class="prompt_header"><span>Edit Details</span></div>
                <div class="prompt_body">
                <span> ${this.promptText} </span>
                <input type="text" id="textContent" class="textContent">
                </div>
                <div>
                <button class="btn-ok">Ok</button>
                <button class="btn-cancel">Cancel</button>
                </div>
            </div>`;

        this.container.appendChild(_prompt);
        this.prompt_ = _prompt;
        // _prompt.querySelector(".btn-ok").addEventListener("click", this.editContent);

        // _prompt.querySelector(".btn-ok").addEventListener("click", () => {
        //     document.querySelector(".prompt_container").classList.remove("show");

                // return new Promise(resolve => {
                //     resolve(document.querySelector(".textContent").value);
                // });
        //     //return document.querySelector(".textContent").value;
        // });
        // _prompt.querySelector(".btn-cancel").addEventListener("click", this.closePrompt);
    }

    showPrompt(content = '') {
        
        this.prompt_ = document.querySelector(".prompt_container");
        const btnOk = document.querySelector(".btn-ok");
        const btnCancel = document.querySelector(".btn-cancel");
        document.querySelector(".prompt_container").classList.add('show');
        document.querySelector(".textContent").value = content;

        return new Promise(resolve => {
        console.log("Within showprompt method");    
            const cleanup = () => {
                btnOk.removeEventListener("click", onOk);
                btnCancel.removeEventListener("click", onCancel);
                this.prompt_.classList.remove("show");
            };

            const onOk = () => {
                const value = this.prompt_.querySelector(".textContent").value;
                resolve(value);
                cleanup();
            };
            
            const onCancel = () => {
                const value = this.prompt_.querySelector(".textContent").value;
                resolve(null);
                cleanup();
            };

            document.querySelector(".btn-ok").addEventListener("click", onOk);
            document.querySelector(".btn-cancel").addEventListener("click", onCancel);
        });
        


        // console.log(document.querySelector(".textContent").value);
        //console.log("Check in showPrompt ", document.querySelector(".textContent").value, " ", document.querySelector(".prompt_container"));
        // document.querySelector(".btn-ok").addEventListener("click", () => {
        //     document.querySelector(".prompt_container").classList.remove("show");
        //     return document.querySelector(".textContent").value;
        // });
        // document.querySelector(".btn-cancel").addEventListener("click", () => {
        //     document.querySelector(".prompt_container").classList.remove("show");
        // });
    }

    // editContent() {
    //     document.querySelector(".prompt_container").classList.remove("show");
    //     return document.querySelector(".textContent").value;
    // }

    // closePrompt() {
    //     document.querySelector(".prompt_container").classList.remove("show");
    //     // return new Promise(resolve => {
    //     //         resolve(null);
    //     //     });
    // }
}
