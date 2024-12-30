let intervalId;
let sharedCount = 0;

function switchTool(tool) {
    document.querySelectorAll('.tool').forEach(t => t.classList.add('hidden'));
    document.getElementById(tool).classList.remove('hidden');
    document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${tool}Button`).classList.add('active');
}

// ランダムな数字を生成
function generateRandomNumber(length) {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

// ランダムなUnicode文字列を生成
function generateRandomUnicode(length) {
    return Array.from({ length }, () => String.fromCharCode(Math.floor(Math.random() * (0xD7FF - 0x0020) + 0x0020))).join('');
}

// メッセージを生成
function generateDynamicMessage() {
    const activeTool = document.querySelector('.tool:not(.hidden)').id;
    if (activeTool === 'textTool') {
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
                ? '#' + Array.from({ length: 5 }, () => Math.floor(Math.random() * 2)).join('')
                : '#' + Array.from({ length: 5 }, () => '0123456789ABCDEF'[Math.floor(Math.random() * 16)]).join('');
            dynamicMessage += '\n'.repeat(lines) + randomTag;
        }
        return encodeURIComponent(dynamicMessage);
    } else if (activeTool === 'numberTool') {
        const digitCount = parseInt(document.getElementById('digitCount').value) || 5;
        return encodeURIComponent(generateRandomNumber(digitCount));
    } else if (activeTool === 'unicodeTool') {
        const unicodeLength = parseInt(document.getElementById('unicodeLength').value) || 5;
        return encodeURIComponent(generateRandomUnicode(unicodeLength));
    }
    return '';
}

// 動的リンクを生成
function generateDynamicLink() {
    const dynamicMessage = generateDynamicMessage();
    if (!dynamicMessage) return '';
    return `line://share?text=${dynamicMessage}`;
}

// 暗号化機能
function encryptText() {
    const text = document.getElementById('textInput').value;
    const cipher = parseInt(document.getElementById('cipherValue').value);
    const encryptedText = caesarCipher(text, cipher);
    const unicodeText = convertToUnicode(encryptedText, cipher);
    document.getElementById('resultText').innerText = unicodeText;
}

function translateUnicode() {
    const unicodeInput = document.getElementById('textInput').value;
    const decodedText = convertFromUnicode(unicodeInput);
    const cipher = parseInt(document.getElementById('cipherValue').value);
    const decryptedText = caesarCipher(decodedText, -cipher);
    document.getElementById('resultText').innerText = decryptedText;
}

// Caesar暗号化（文字ごとにシフトを変える）
function caesarCipher(str, shift) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        let char = str[i];

        if (char.match(/[a-zA-Z]/)) {
            const shiftValue = (i + shift) % 26;
            const charCode = str.charCodeAt(i);
            const base = char.match(/[a-z]/) ? 97 : 65;
            result += String.fromCharCode(((charCode - base + shiftValue) % 26 + 26) % 26 + base);
        } else {
            result += char;
        }
    }
    return result;
}

// Unicode形式に変換
function convertToUnicode(str, cipher) {
    return Array.from(str)
        .map(char => {
            const unicode = '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
            const modifiedUnicode = unicode.replace('\\u', '\\x');
            const number = parseInt(modifiedUnicode.replace('\\x', ''), 16);
            const newNumber = number * cipher;
            const newUnicode = '\\u' + newNumber.toString(16).padStart(4, '0');
            return newUnicode.replace('\\u', '\\x');
        })
        .join('/');
}

// Unicode形式から文字列に戻す
function convertFromUnicode(unicodeStr) {
    return unicodeStr.split('/')
        .map(code => {
            const unicodeCode = code.replace('\\x', '\\u');
            const number = parseInt(unicodeCode.replace('\\u', ''), 16);
            const cipher = parseInt(document.getElementById('cipherValue').value);
            const newNumber = number / cipher;
            const newUnicode = '\\u' + Math.round(newNumber).toString(16).padStart(4, '0');
            return String.fromCharCode(parseInt(newUnicode.replace('\\u', ''), 16));
        })
        .join('');
}

// コピー機能
function copyToClipboard() {
    const resultText = document.getElementById('resultText').innerText;
    const textToCopy = resultText;
    const textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('結果をコピーしました!');
}

// イベントリスナー
document.getElementById('sendButton').addEventListener('click', () => {
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
            alert('指定した回数だけ共有しました。');
            return;
        }
        const dynamicLink = generateDynamicLink();
        if (dynamicLink) {
            sharedCount++;
            window.location.href = dynamicLink;
        }
    };
    intervalId = setInterval(redirect, speed);
});
