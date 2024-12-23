let intervalId; // setInterval の ID を格納

// ランダムな二進数を生成
function generateRandomBinary(length) {
    return Array.from({ length }, () => Math.floor(Math.random() * 2)).join('');
}

// ランダムな十六進数を生成
function generateRandomHex(length) {
    const chars = '0123456789ABCDEF';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * 16)]).join('');
}

// メッセージを生成
function generateDynamicMessage() {
    const message = document.getElementById('message').value.trim();
    const breaks = parseInt(document.getElementById('breaks').value) || 0;
    const format = document.getElementById('format').value;

    if (!message) {
        alert('メッセージを入力してください。');
        return '';
    }

    let dynamicMessage = message;
    for (let i = 0; i < breaks; i++) {
        const randomTag = format === 'binary'
            ? '#' + generateRandomBinary(5)
            : '#' + generateRandomHex(5);
        dynamicMessage += '\n' + randomTag;
    }

    return encodeURIComponent(dynamicMessage);
}

// 動的リンクを生成
function generateDynamicLink() {
    const dynamicMessage = generateDynamicMessage();
    if (!dynamicMessage) return '';
    return `line://share?text=${dynamicMessage}`;
}

// 送信ボタンのクリックイベント
document.getElementById('sendButton').addEventListener('click', () => {
    // 既存のリダイレクトがあれば停止
    if (intervalId) clearInterval(intervalId);

    const redirect = () => {
        const link = generateDynamicLink();
        if (link) {
            window.location.href = link; // リンクにリダイレクト
        }
    };

    // 1秒ごとにリンクを更新してリダイレクト
    intervalId = setInterval(redirect, 1000);
});

// 停止ボタンのクリックイベント
document.getElementById('stopButton').addEventListener('click', () => {
    if (intervalId) {
        clearInterval(intervalId); // 送信の停止
        intervalId = null;
        alert('送信を停止しました。');
    }
});

