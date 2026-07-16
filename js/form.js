// お問い合わせフォーム内容をSSGformへ送信
const form = document.getElementById('form');

form.addEventListener('submit', async(e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('user-name', document.getElementById('user-name').value);
    formData.append('email', document.getElementById('email').value);
    try {
        const responsev = await fetch('https://ssgform.com/s/A1w5gS2qPkuc', {
            method: 'POST',
            body: formData,
        });
        if(!response.ok) throw new Error('送信失敗');
            window.location.href = './thanks.html';
        } catch (e) {
            console.error(e);
        }
})