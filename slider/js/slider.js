"use strict";

const sliderSlides = document.querySelectorAll('.slider-slide');
const sliderWrapper = document.querySelector('.slider-wrapper');
const sliderDots = document.querySelectorAll('.slider-dot');
const sliderBtnNext = document.querySelector('.slider-button-next');
const sliderBtnPrev = document.querySelector('.slider-button-prev');

const timeAnimSlide = 800;
const searchOptimalPath = false;
let activeButtons = true;

let slideCount = sliderSlides.length;

let slider = [];
let imgWidth = document.querySelector('.slider-slide').offsetWidth;

for (let i = 0; i < sliderSlides.length; i++) {
	slider[i] = sliderSlides[i].src;
	sliderSlides[i].remove();
}

let currentImgIndex = 0;

function createImg(step) {
	let img = document.createElement('img');
	img.src = slider[step];
	img.classList.add('slider-slide');
	return img;
}

const frameTime = 50;

// функция сдвига слайдов
function shiftSlides(slidesInfo, shiftDistnace, onFinishAnimate) {
	const start = Date.now();
	var timer = setInterval(function () {
		const timePassed = Date.now() - start;
		if (timePassed >= timeAnimSlide) {
			// конечное состояние анимации
			slidesInfo.forEach(slideInfo => drawSlide(slideInfo.slide, slideInfo.pos, shiftDistnace));
			clearInterval(timer);
			if (onFinishAnimate) {
				onFinishAnimate();
			}
			return;
		}
		// промежуточное состояние анимации
		slidesInfo.forEach(slideInfo => drawSlide(slideInfo.slide, slideInfo.pos, shiftDistnace * timePassed / timeAnimSlide));
	}, frameTime);
}

function drawSlide(slide, fromSlideIdx, shiftDistnace) {
	slide.style.left = imgWidth * (fromSlideIdx + shiftDistnace) + 'px';
}

function showLeft(step, fromSlideIdx = 0) {
	let img = createImg(step);
	drawSlide(img, fromSlideIdx, -1);
	let slides = document.querySelectorAll('.slider-slide');
	if (slides.length > 0)
		sliderWrapper.insertBefore(img, slides[0]);
	else
		sliderWrapper.appendChild(img);
}

function showRight(step, fromSlideIdx = 0) {
	let img = createImg(step);
	drawSlide(img, fromSlideIdx, 1);
	let slides = document.querySelectorAll('.slider-slide');
	sliderWrapper.appendChild(img, slides[0]);
}

function show(step, fromSlideIdx) {
	let img = createImg(step);
	drawSlide(img, fromSlideIdx, 0);
	sliderWrapper.appendChild(img);
}

// отображение предыдущего слайда слева
show(decrementIndex(0), -1);
// отображение центрального слайда
show(0, 0);
// отображение следующего слайда справа
show(incrementIndex(0), 1);

function incrementIndex(index) {
	let i = index + 1;
	if (i > slideCount - 1) {
		i = 0;
	}
	return i;
}

function decrementIndex(index) {
	let i = index - 1;
	if (i < 0) {
		i = slideCount - 1;
	}
	return i;
}

function shiftLeft(callbackMove) {
	const targetSlideIndex = incrementIndex(currentImgIndex);
	const nextSlideIndex = incrementIndex(targetSlideIndex);
	let slides = document.querySelectorAll('.slider-slide');
	slides[0].remove();

	const onFinishAnimate = () => {
		currentImgIndex = targetSlideIndex;
		thisSlide(currentImgIndex);
		showRight(nextSlideIndex);
		if (callbackMove) {
			callbackMove();
		}
	};

	const slidesInfo = [];
	for (let i = 1; i < slides.length; i++) {
		slidesInfo.push({ slide: slides[i], pos: i - 1 });
	}

	shiftSlides(slidesInfo, -1, onFinishAnimate);
}

function safeLeft() {
	if (!activeButtons) {
		return;
	}
	activeButtons = false;
	shiftLeft(() => { activeButtons = true; });
}

function shiftRight(callbackMove) {
	const targetSlideIndex = decrementIndex(currentImgIndex);
	const nextSlideIndex = decrementIndex(targetSlideIndex);
	let slides = document.querySelectorAll('.slider-slide');
	slides[slides.length - 1].remove();

	const onFinishAnimate = () => {
		currentImgIndex = targetSlideIndex;
		thisSlide(currentImgIndex);
		showLeft(nextSlideIndex);
		if (callbackMove) {
			callbackMove();
		}
	};

	const slidesInfo = [];
	for (let i = 0; i < slides.length - 1; i++) {
		slidesInfo.push({ slide: slides[i], pos: i - 1 });
	}

	shiftSlides(slidesInfo, 1, onFinishAnimate);
}

function safeRight() {
	if (!activeButtons) {
		return;
	}
	activeButtons = false;
	shiftRight(() => { activeButtons = true; });
}

function getHowMove(index) {
	let stepsCount = index - currentImgIndex;

	if (stepsCount > 0) {
		return { move: shiftLeft, stepsCount };
	} else {
		return { move: shiftRight, stepsCount: Math.abs(stepsCount) };
	}
}

function getHowOptimalMove(index) {
	// кол-во шагов вправо
	let leftStepsCount;
	// кол-во шагов влево
	let rightStepsCount;
	let move;
	let stepsCount = index - currentImgIndex;

	if (stepsCount > 0) {
		rightStepsCount = stepsCount;
		leftStepsCount = slideCount - rightStepsCount;
	}
	else {
		leftStepsCount = Math.abs(stepsCount);
		rightStepsCount = slideCount - leftStepsCount;
	}

	if (rightStepsCount <= leftStepsCount) {
		move = shiftLeft;
		stepsCount = rightStepsCount;
	} else {
		move = shiftRight;
		stepsCount = leftStepsCount;
	}
	return { move, stepsCount };
}

function moveTo(index) {
	if (!activeButtons) {
		return;
	}
	activeButtons = false;
	// текущий шаг смещения слайда
	let i = 0;
	let howMove;

	if (searchOptimalPath) {
		howMove = getHowOptimalMove(index);
	} else {
		howMove = getHowMove(index);
	}

	// перемещение след.слайда начнется после перемещения текущего
	function moveNext() {
		if (i < howMove.stepsCount) {
			howMove.move(moveNext);
			i++;
			return;
		}
		activeButtons = true;
	}
	howMove.move(moveNext);
	i++;
}

if (slideCount > 1) {
	sliderBtnNext.onclick = safeLeft;
	sliderBtnPrev.onclick = safeRight;
}

function thisSlide(index) {
	sliderDots.forEach(sliderDot => {
		sliderDot.classList.remove('active')
	});
	sliderDots[index].classList.add('active')
}

sliderDots.forEach((dot, index) => {
	dot.addEventListener('click', function () {
		if (index === currentImgIndex) {
			return;
		}
		moveTo(index);
	});
});
