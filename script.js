// ツールの表示切り替え
function switchTool(tool) {
    document.querySelectorAll('.tool').forEach(t => t.classList.add('hidden'));
    document.getElementById(tool).classList.remove('hidden');
    document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${tool}Button`).classList.add('active');
}

// メッセージ送信 (連投ツール)
function sendMessage() {
    const message = document.getElementById('message').value;
    alert("送信するメッセージ: " + message);
}

// 数字連投ツール (数字生成)
function generateNumber() {
    const digitCount = parseInt(document.getElementById('digitCount').value) || 5;
    alert("生成した数字: " + generateRandomNumber(digitCount));
}

// ランダムな数字を生成
function generateRandomNumber(length) {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

// Unicode連投ツール (Unicode生成)
function generateUnicode() {
    const unicodeLength = parseInt(document.getElementById('unicodeLength').value) || 5;
    alert("生成したUnicode: " + generateRandomUnicode(unicodeLength));
}

// ランダムなUnicode文字列を生成
function generateRandomUnicode(length) {
    return Array.from({ length }, () => String.fromCharCode(Math.floor(Math.random() * (0xD7FF - 0x0020) + 0x0020))).join('');
}

// 暗号化ツール (Caesar暗号)
function encryptText() {
    const text = document.getElementById('textInput').value;
    const cipher = parseInt(document.getElementById('cipherValue').value);
    const encryptedText = caesarCipher(text, cipher);
    document.getElementById('resultText').innerText = encryptedText;
}

// Caesar暗号
function caesarCipher(str, shift) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        if (char.match(/[a-zA-Z]/)) {
            const shiftValue = shift % 26;
            const charCode = str.charCodeAt(i);
            const base = char.match(/[a-z]/) ? 97 : 65;
            result += String.fromCharCode(((charCode - base + shiftValue) % 26 + 26) % 26 + base);
        } else {
            result += char;
        }
    }
    return result;
}

// イベントリスナー
document.getElementById('textToolButton').addEventListener('click', () => switchTool('textTool'));
document.getElementById('numberToolButton').addEventListener('click', () => switchTool('numberTool'));
document.getElementById('unicodeToolButton').addEventListener('click', () => switchTool('unicodeTool'));
document.getElementById('cipherToolButton').addEventListener('click', () => switchTool('cipherTool'));

// 初期表示
switchTool('textTool');
