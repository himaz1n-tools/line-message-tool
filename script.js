function generateRandomBinary(length) {
    return Array.from({ length }, () => Math.floor(Math.random() * 2)).join('');
}

function generateRandomHex(length) {
    const chars = '0123456789ABCDEF';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * 16)]).join('');
}

function generateMessageLink() {
    const message = document.getElementById('message').value.trim();
    const breaks = parseInt(document.getElementById('breaks').value) || 0;
    const format = document.getElementById('format').value;

    if (!message) {
        alert('メッセージを入力してください。');
        return '';
    }

    let formattedMessage = message;
    for (let i = 0; i < breaks; i++) {
        const randomTag = format === 'binary'
            ? '#' + generateRandomBinary(5)
            : '#' + generateRandomHex(5);
        formattedMessage += '\n' + randomTag;
    }

    const encodedMessage = encodeURIComponent(formattedMessage);
    return `line://share?text=${encodedMessage}`;
}

document.getElementById('sendButton').addEventListener('click', () => {
    const link = generateMessageLink();
    if (link) {
        // プログラム的にリンクを踏む（リダイレクト）
        window.location.href = link;
    }
});
