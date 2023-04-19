(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    isWebp();
    function addClassLoaded() {
        window.addEventListener("load", (function() {
            setTimeout((function() {
                document.documentElement.classList.add("loaded");
            }), 0);
        }));
    }
    addClassLoaded();
    document.addEventListener("click", (function(e) {
        const targetEl = e.target;
        if (targetEl.closest(".cookie__btn")) targetEl.closest(".cookie").classList.add("hidden");
    }));
    document.addEventListener("DOMContentLoaded", (function(e) {
        const form = document.querySelector(".form-connection");
        form.addEventListener("submit", formSend);
        function formSend(e) {
            let error = formValidate(form);
            if (error !== 0) e.preventDefault();
        }
        function formValidate(form) {
            let error = 0;
            let formReq = document.querySelectorAll("._req");
            for (let index = 0; index < formReq.length; index++) {
                const input = formReq[index];
                formRemoveError(input);
                if (input.classList.contains("_email")) {
                    if (emailTest(input)) {
                        formAddError(input);
                        error++;
                    }
                } else if (input.value === "") {
                    formAddError(input);
                    error++;
                }
            }
            return error;
        }
        function formAddError(input) {
            input.parentElement.classList.add("_error");
            input.classList.add("_error");
        }
        function formRemoveError(input) {
            input.parentElement.classList.remove("_error");
            input.classList.remove("_error");
        }
        function emailTest(input) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
        }
    }));
    const missionBlock = document.querySelector(".mission");
    if (missionBlock) {
        window.addEventListener("scroll", addToScroll);
        function addToScroll(e) {
            const missionBlockHeight = missionBlock.offsetHeight;
            const missionBlockOffset = offset(missionBlock).top;
            const start = 2;
            let missionBlockPoint = window.innerHeight - missionBlockHeight / start;
            if (missionBlockHeight > window.innerHeight) missionBlockPoint = window.innerHeight - window.innerHeight / start;
            if (pageYOffset > missionBlockOffset - missionBlockPoint && pageYOffset < missionBlockOffset + missionBlockHeight / 2) missionBlock.classList.add("_active"); else missionBlock.classList.remove("_active");
        }
        function offset(el) {
            const rect = el.getBoundingClientRect(), scrollLeft = window.pageXOffset || document.documentElement.scrollLeft, scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return {
                top: rect.top + scrollTop,
                left: rect.left + scrollLeft
            };
        }
        setTimeout((() => {
            addToScroll();
        }), 300);
    }
})();