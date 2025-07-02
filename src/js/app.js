"use strict";

if (typeof Fancybox !== "undefined" && Fancybox !== null) {
    Fancybox.bind("[data-fancybox]", {
        dragToClose: false,
        closeButton: false
    });
}

document.addEventListener("DOMContentLoaded", () => {


    const isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (
                isMobile.Android() ||
                isMobile.BlackBerry() ||
                isMobile.iOS() ||
                isMobile.Opera() ||
                isMobile.Windows());
        },
    };

    function getNavigator() {
        if (isMobile.any() || window.innerWidth < 992) {
            document.body.classList.remove("_pc");
            document.body.classList.add("_touch");
        } else {
            document.body.classList.remove("_touch");
            document.body.classList.add("_pc");
        }
    }

    getNavigator();

    window.addEventListener('resize', () => {
        getNavigator()
    });


    var phoneInputs = document.querySelectorAll('input[type="tel"]');

    var getInputNumbersValue = function (input) {
        // Return stripped input value — just numbers
        return input.value.replace(/\D/g, '');
    }

    var onPhonePaste = function (e) {
        var input = e.target,
            inputNumbersValue = getInputNumbersValue(input);
        var pasted = e.clipboardData || window.clipboardData;
        if (pasted) {
            var pastedText = pasted.getData('Text');
            if (/\D/g.test(pastedText)) {
                // Attempt to paste non-numeric symbol — remove all non-numeric symbols,
                // formatting will be in onPhoneInput handler
                input.value = inputNumbersValue;
                return;
            }
        }
    }

    var onPhoneInput = function (e) {
        var input = e.target,
            inputNumbersValue = getInputNumbersValue(input),
            selectionStart = input.selectionStart,
            formattedInputValue = "";

        if (!inputNumbersValue) {
            return input.value = "";
        }

        if (input.value.length != selectionStart) {
            // Editing in the middle of input, not last symbol
            if (e.data && /\D/g.test(e.data)) {
                // Attempt to input non-numeric symbol
                input.value = inputNumbersValue;
            }
            return;
        }

        if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
            if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
            var firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
            formattedInputValue = input.value = firstSymbols + " ";
            if (inputNumbersValue.length > 1) {
                formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
            }
            if (inputNumbersValue.length >= 5) {
                formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
            }
            if (inputNumbersValue.length >= 8) {
                formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
            }
            if (inputNumbersValue.length >= 10) {
                formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
            }
        } else {
            formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
        }
        input.value = formattedInputValue;
    }

    var onPhoneKeyDown = function (e) {
        // Clear input after remove last symbol
        var inputValue = e.target.value.replace(/\D/g, '');
        if (e.keyCode == 8 && inputValue.length == 1) {
            e.target.value = "";
        }
    }

    for (var phoneInput of phoneInputs) {
        phoneInput.addEventListener('keydown', onPhoneKeyDown);
        phoneInput.addEventListener('input', onPhoneInput, false);
        phoneInput.addEventListener('paste', onPhonePaste, false);
    }


    // click handlers
    document.addEventListener('click', (e) => {
        const target = e.target;

        function closeAllMenus() {
            document.querySelectorAll('.submenu.open').forEach(menu => {
                menu.classList.remove('open');
                const button = menu.previousElementSibling;
                if (button && button.classList.contains('menu__arrow')) {
                    button.classList.remove('active');
                }
            });

            document.querySelectorAll('.header__services-menu.open').forEach(menu => {
                menu.classList.remove('open');
                const button = menu.previousElementSibling;
                if (button && button.classList.contains('header__services-btn')) {
                    button.classList.remove('active');
                }
            });
        }

        if (target.closest('.icon-menu') || target.classList.contains('menu__close')) {
            getMenu();
            // Если открывается основное меню, возможно, стоит закрыть все подменю
            // closeAllMenus(); 
        }

        if (target.classList.contains('menu__arrow')) {
            const subMenu = target.nextElementSibling;

            if (subMenu.classList.contains('open')) {
                subMenu.classList.remove('open');
                target.classList.remove('active');
            } else {

                closeAllMenus();
                subMenu.classList.add('open');
                target.classList.add('active');
            }
        }

        if (target.classList.contains('header__services-btn')) {
            const serviceMenu = target.nextElementSibling;


            if (serviceMenu.classList.contains('open')) {
                serviceMenu.classList.remove('open');
                target.classList.remove('active');
            } else {

                closeAllMenus();
                serviceMenu.classList.add('open');
                target.classList.add('active');
            }
        }

        if (!target.closest('.header__services-block') && !target.closest('.menu__arrow') && !target.classList.contains('menu__arrow')) {
            closeAllMenus();
        }
    });


    function getMenu() {
        document.querySelector('.header').classList.toggle('open-menu');
        toggleLocking();
    }

    function toggleLocking(lockClass) {

        const body = document.body;
        let className = lockClass ? lockClass : "lock";
        let pagePosition;

        if (body.classList.contains(className)) {
            pagePosition = parseInt(document.body.dataset.position, 10);
            body.dataset.position = pagePosition;
            body.style.top = -pagePosition + 'px';
        } else {
            pagePosition = window.scrollY;
            body.style.top = 'auto';
            window.scroll({ top: pagePosition, left: 0 });
            document.body.removeAttribute('data-position');
        }

        let lockPaddingValue = body.classList.contains(className)
            ? "0px"
            : window.innerWidth -
            document.querySelector(".wrapper").offsetWidth +
            "px";

        body.style.paddingRight = lockPaddingValue;
        body.classList.toggle(className);

    }

    // sliders

    if (document.querySelector('.promo__slider')) {
        new Swiper('.promo__slider', {
            effect: "fade",
            fadeEffect: {
                crossFade: true
            },

            navigation: {
                nextEl: '.promo__slider-next',
                prevEl: '.promo__slider-prev',
            },
        })
    }

    if (document.querySelector('.partners__slider')) {
        new Swiper('.partners__slider', {
            slidesPerView: 'auto',
            spaceBetween: 8,

            speed: 500,
            loop: true,
            navigation: {
                nextEl: '.partners__next',
                prevEl: '.partners__prev',
            },
            breakpoints: {
                1599.98: {
                    centeredSlides: true,
                },
            },
        })
    }




});


