
let intervalId; // setIntervalのIDを格納
let sharedCount = 0; // 共有回数のカウント

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
    const lines = parseInt(document.getElementById('lines').value) || 1;
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

        dynamicMessage += '\n'.repeat(lines) + randomTag;
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

    const speed = parseInt(document.getElementById('speed').value);
    const countInput = document.getElementById('count').value.trim();
    const isInfinite = countInput.toUpperCase() === 'A';
    const maxCount = isInfinite ? Infinity : parseInt(countInput);

    if (!isInfinite && (isNaN(maxCount) || maxCount <= 0)) {
        alert('有効な共有回数を入力してください (例: 10 または A)。');
        return;
    }

    sharedCount = 0;

    const redirect = () => {
        if (sharedCount >= maxCount) {
            clearInterval(intervalId);
            intervalId = null;
            alert('指定された回数の共有が完了しました。');
            return;
        }

        const link = generateDynamicLink();
        if (link) {
            window.location.href = link; // リンクにリダイレクト
            sharedCount++;
        }
    };

    // 指定された速度でリンクを更新してリダイレクト
    intervalId = setInterval(redirect, speed);

    // 3分後に自動停止 (無限モード時のみ)
    if (isInfinite) {
        setTimeout(() => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
                alert('無限共有は3分経過したため自動停止しました。');
            }
        }, 180000); // 3分 = 180,000ミリ秒
    }
});

// 停止ボタンのクリックイベント
document.getElementById('stopButton').addEventListener('click', () => {
    if (intervalId) {
        clearInterval(intervalId); // 送信の停止
        intervalId = null;
        alert('送信を停止しました。');
    }
});
