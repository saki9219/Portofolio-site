const btnPagetop = document.querySelector('.btn-pagetop');
const observeTarget = document.querySelector('.mv');
const options = {
    threshold: 0,
    rootMargin: '0px',
};

const observer = new IntersectionObserver((entries) => {
    if(entries[0].isIntersecting) {
        btnPagetop.classList.remove('is-shown');
    } else {
        btnPagetop.classList.add('is-shown');
    }
}, options);

// 監視を始めてください
observer.observe(observeTarget);

// トップに戻る処理
btnPagetop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
});