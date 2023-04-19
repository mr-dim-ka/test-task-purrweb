"use strict";

/* Проверка поддержки webp, добавление класса webp или no-webp для HTML */
function isWebp() {
	// Проверка поддержки webp
	function testWebP(callback) {
		let webP = new Image();
		webP.onload = webP.onerror = function () {
			callback(webP.height == 2);
		};
		webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	}
	// Добавление класса _webp или _no-webp для HTML
	testWebP(function (support) {
		let className = support === true ? 'webp' : 'no-webp';
		document.documentElement.classList.add(className);
	});
}
isWebp();

//==========================================================================================================================
// Функция добавления класса loaded к html при полной загрузке страницы
function addClassLoaded() {
	window.addEventListener("load", function () {
		setTimeout(function () {
			document.documentElement.classList.add('loaded');
		}, 0);
	});
}

addClassLoaded();
//==========================================================================================================================

/* const cookie = document.querySelector('.cookie');
const cookieBtn = document.querySelector('.cookie__btn'); */

document.addEventListener("click", function (e) {
	const targetEl = e.target;
	if (targetEl.closest('.cookie__btn')) {
		targetEl.closest('.cookie').classList.add('hidden');
	}
});

//==========================================================================================================================

document.addEventListener("DOMContentLoaded", function (e) {
	const form = document.querySelector('.form-connection');
	form.addEventListener("submit", formSend);

	// Функция отправки формы
	function formSend(e) {
		let error = formValidate(form);

		if (error !== 0) {
			// alert('Заполните поля');
			e.preventDefault();
		}
	}

	// Функция валидации формы
	function formValidate(form) {
		let error = 0;
		let formReq = document.querySelectorAll('._req');

		for (let index = 0; index < formReq.length; index++) {
			const input = formReq[index];
			formRemoveError(input);

			if (input.classList.contains('_email')) {
				if (emailTest(input)) {
					formAddError(input);
					error++;
				}
			} else {
				if (input.value === '') {
					formAddError(input);
					error++;
				}
			}
		}
		return error;
	}

	// Добавление класса к объекту и его родителю
	function formAddError(input) {
		input.parentElement.classList.add('_error');
		input.classList.add('_error');
	}

	// Удаление класса к объекту и его родителю
	function formRemoveError(input) {
		input.parentElement.classList.remove('_error');
		input.classList.remove('_error');
	}

	// Функция проверки email
	function emailTest(input) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
	}
});

//==========================================================================================================================

const missionBlock = document.querySelector('.mission');
if (missionBlock) {
	window.addEventListener("scroll", addToScroll);

	function addToScroll(e) {
		const missionBlockHeight = missionBlock.offsetHeight;
		const missionBlockOffset = offset(missionBlock).top;
		const start = 2;

		let missionBlockPoint = window.innerHeight - missionBlockHeight / start;

		if (missionBlockHeight > window.innerHeight) {
			missionBlockPoint = window.innerHeight - window.innerHeight / start;
		}

		if ((pageYOffset > missionBlockOffset - missionBlockPoint) && pageYOffset < (missionBlockOffset + missionBlockHeight / 2)) {
			missionBlock.classList.add('_active')
		} else {
			missionBlock.classList.remove('_active')
		}
	}
	// Функция позиции объекта относительно страницы
	function offset(el) {
		const rect = el.getBoundingClientRect(),
			scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
			scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
	}

	setTimeout(() => {
		addToScroll();
	}, 300);
}
