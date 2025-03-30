// Tool State
const toolState = {
    currentTool: null,
    settings: {}
};

// Initialize Tools Page
function initTools() {
    setupEventListeners();
    loadToolSettings();
}

// Setup Event Listeners
function setupEventListeners() {
    // Modal Close Button
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', closeToolModal);
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('toolModal');
        if (e.target === modal) {
            closeToolModal();
        }
    });
}

// Open Tool
function openTool(toolType) {
    toolState.currentTool = toolType;
    const modal = document.getElementById('toolModal');
    const toolContainer = document.getElementById('toolContainer');
    
    // Load tool content based on type
    switch(toolType) {
        case 'binary-calculator':
            loadBinaryCalculator();
            break;
        case 'subnet-calculator':
            loadSubnetCalculator();
            break;
        case 'sql-formatter':
            loadSQLFormatter();
            break;
        case 'network-scanner':
            loadNetworkScanner();
            break;
        case 'password-generator':
            loadPasswordGenerator();
            break;
        case 'base64-converter':
            loadBase64Converter();
            break;
    }
    
    modal.style.display = 'block';
}

// Close Tool Modal
function closeToolModal() {
    const modal = document.getElementById('toolModal');
    const toolContainer = document.getElementById('toolContainer');
    
    modal.style.display = 'none';
    toolContainer.innerHTML = '';
    toolState.currentTool = null;
}

// Binary Calculator
function loadBinaryCalculator() {
    const toolContainer = document.getElementById('toolContainer');
    toolContainer.innerHTML = `
        <h2>Binär Rechner</h2>
        <div class="binary-calculator">
            <div class="input-group">
                <label for="binary-input">Binärzahl eingeben:</label>
                <input type="text" id="binary-input" class="binary-input" placeholder="z.B. 1010">
            </div>
            <div class="input-group">
                <label for="decimal-input">Dezimalzahl eingeben:</label>
                <input type="number" id="decimal-input" class="binary-input" placeholder="z.B. 10">
            </div>
            <button onclick="convertBinary()" class="tool-btn">Konvertieren</button>
            <div class="binary-result" id="binary-result"></div>
        </div>
    `;
}

function convertBinary() {
    const binaryInput = document.getElementById('binary-input').value;
    const decimalInput = document.getElementById('decimal-input').value;
    const result = document.getElementById('binary-result');

    if (binaryInput) {
        const decimal = parseInt(binaryInput, 2);
        if (!isNaN(decimal)) {
            result.textContent = `${binaryInput} (Binär) = ${decimal} (Dezimal)`;
        } else {
            result.textContent = 'Ungültige Binärzahl!';
        }
    } else if (decimalInput) {
        const binary = parseInt(decimalInput).toString(2);
        result.textContent = `${decimalInput} (Dezimal) = ${binary} (Binär)`;
    }
}

// Subnet Calculator
function loadSubnetCalculator() {
    const toolContainer = document.getElementById('toolContainer');
    toolContainer.innerHTML = `
        <h2>Subnet Rechner</h2>
        <div class="subnet-calculator">
            <div class="subnet-input">
                <div class="input-group">
                    <label for="ip-address">IP-Adresse:</label>
                    <input type="text" id="ip-address" class="binary-input" placeholder="z.B. 192.168.1.0">
                </div>
                <div class="input-group">
                    <label for="subnet-mask">Subnetzmaske:</label>
                    <input type="text" id="subnet-mask" class="binary-input" placeholder="z.B. 255.255.255.0">
                </div>
            </div>
            <button onclick="calculateSubnet()" class="tool-btn">Berechnen</button>
            <div class="subnet-result" id="subnet-result"></div>
        </div>
    `;
}

function calculateSubnet() {
    const ipAddress = document.getElementById('ip-address').value;
    const subnetMask = document.getElementById('subnet-mask').value;
    const result = document.getElementById('subnet-result');

    // Basic validation
    if (!isValidIP(ipAddress) || !isValidIP(subnetMask)) {
        result.textContent = 'Ungültige IP-Adresse oder Subnetzmaske!';
        return;
    }

    // Calculate network address
    const networkAddress = calculateNetworkAddress(ipAddress, subnetMask);
    const broadcastAddress = calculateBroadcastAddress(ipAddress, subnetMask);
    const usableHosts = calculateUsableHosts(subnetMask);

    result.innerHTML = `
        <h3>Ergebnisse:</h3>
        <p>Netzwerkadresse: ${networkAddress}</p>
        <p>Broadcast-Adresse: ${broadcastAddress}</p>
        <p>Verfügbare Hosts: ${usableHosts}</p>
    `;
}

// SQL Formatter
function loadSQLFormatter() {
    const toolContainer = document.getElementById('toolContainer');
    toolContainer.innerHTML = `
        <h2>SQL Formatter</h2>
        <div class="sql-formatter">
            <textarea id="sql-input" class="sql-input" placeholder="SQL-Abfrage eingeben..."></textarea>
            <button onclick="formatSQL()" class="tool-btn">Formatieren</button>
            <div class="sql-output" id="sql-output"></div>
        </div>
    `;
}

function formatSQL() {
    const input = document.getElementById('sql-input').value;
    const output = document.getElementById('sql-output');

    // Basic SQL formatting
    let formatted = input
        .replace(/\s+/g, ' ')
        .replace(/\s*([,()])\s*/g, '$1 ')
        .replace(/\s*([=<>!]+)\s*/g, ' $1 ')
        .replace(/\s*([+\-*/])\s*/g, ' $1 ')
        .replace(/\s*([;])\s*/g, '$1\n')
        .replace(/\s*([{])\s*/g, '$1\n')
        .replace(/\s*([}])\s*/g, '\n$1\n')
        .replace(/\s*([(])\s*/g, '$1\n')
        .replace(/\s*([)])\s*/g, '\n$1\n')
        .trim();

    output.textContent = formatted;
}

// Network Scanner
function loadNetworkScanner() {
    const toolContainer = document.getElementById('toolContainer');
    toolContainer.innerHTML = `
        <h2>Netzwerk Scanner</h2>
        <div class="network-scanner">
            <div class="scan-input">
                <div class="input-group">
                    <label for="network-range">Netzwerkbereich:</label>
                    <input type="text" id="network-range" class="binary-input" placeholder="z.B. 192.168.1.0/24">
                </div>
                <button onclick="scanNetwork()" class="tool-btn">Scannen</button>
            </div>
            <div class="scan-result" id="scan-result">
                <h3>Scan-Ergebnisse:</h3>
                <div id="scan-output"></div>
            </div>
        </div>
    `;
}

function scanNetwork() {
    const networkRange = document.getElementById('network-range').value;
    const output = document.getElementById('scan-output');

    // Simulate network scanning
    output.innerHTML = '<p>Scanning network...</p>';
    
    setTimeout(() => {
        output.innerHTML = `
            <p>Scan abgeschlossen!</p>
            <p>Gefundene Geräte:</p>
            <ul>
                <li>192.168.1.1 - Router</li>
                <li>192.168.1.2 - Desktop-PC</li>
                <li>192.168.1.3 - Laptop</li>
                <li>192.168.1.4 - Smartphone</li>
            </ul>
        `;
    }, 2000);
}

// Password Generator
function loadPasswordGenerator() {
    const toolContainer = document.getElementById('toolContainer');
    toolContainer.innerHTML = `
        <h2>Passwort Generator</h2>
        <div class="password-generator">
            <div class="password-options">
                <div class="input-group">
                    <label for="password-length">Länge:</label>
                    <input type="number" id="password-length" class="binary-input" value="12" min="8" max="32">
                </div>
                <div class="input-group">
                    <label>
                        <input type="checkbox" id="use-uppercase" checked> Großbuchstaben
                    </label>
                </div>
                <div class="input-group">
                    <label>
                        <input type="checkbox" id="use-lowercase" checked> Kleinbuchstaben
                    </label>
                </div>
                <div class="input-group">
                    <label>
                        <input type="checkbox" id="use-numbers" checked> Zahlen
                    </label>
                </div>
                <div class="input-group">
                    <label>
                        <input type="checkbox" id="use-special" checked> Sonderzeichen
                    </label>
                </div>
            </div>
            <button onclick="generatePassword()" class="tool-btn">Passwort generieren</button>
            <div class="password-result" id="password-result"></div>
        </div>
    `;
}

function generatePassword() {
    const length = document.getElementById('password-length').value;
    const useUppercase = document.getElementById('use-uppercase').checked;
    const useLowercase = document.getElementById('use-lowercase').checked;
    const useNumbers = document.getElementById('use-numbers').checked;
    const useSpecial = document.getElementById('use-special').checked;

    let chars = '';
    if (useUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useLowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useNumbers) chars += '0123456789';
    if (useSpecial) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    document.getElementById('password-result').textContent = password;
}

// Base64 Converter
function loadBase64Converter() {
    const toolContainer = document.getElementById('toolContainer');
    toolContainer.innerHTML = `
        <h2>Base64 Konverter</h2>
        <div class="base64-converter">
            <div class="input-group">
                <label for="base64-input">Text eingeben:</label>
                <textarea id="base64-input" class="base64-input" placeholder="Text zum Konvertieren..."></textarea>
            </div>
            <div class="button-group">
                <button onclick="encodeBase64()" class="tool-btn">Zu Base64</button>
                <button onclick="decodeBase64()" class="tool-btn">Von Base64</button>
            </div>
            <div class="base64-result" id="base64-result"></div>
        </div>
    `;
}

function encodeBase64() {
    const input = document.getElementById('base64-input').value;
    const result = document.getElementById('base64-result');
    
    try {
        const encoded = btoa(input);
        result.textContent = encoded;
    } catch (error) {
        result.textContent = 'Fehler beim Kodieren!';
    }
}

function decodeBase64() {
    const input = document.getElementById('base64-input').value;
    const result = document.getElementById('base64-result');
    
    try {
        const decoded = atob(input);
        result.textContent = decoded;
    } catch (error) {
        result.textContent = 'Fehler beim Dekodieren!';
    }
}

// Utility Functions
function isValidIP(ip) {
    const parts = ip.split('.');
    return parts.length === 4 && parts.every(part => {
        const num = parseInt(part);
        return num >= 0 && num <= 255;
    });
}

function calculateNetworkAddress(ip, mask) {
    const ipParts = ip.split('.').map(Number);
    const maskParts = mask.split('.').map(Number);
    
    return ipParts.map((part, i) => part & maskParts[i]).join('.');
}

function calculateBroadcastAddress(ip, mask) {
    const ipParts = ip.split('.').map(Number);
    const maskParts = mask.split('.').map(Number);
    
    return ipParts.map((part, i) => part | ~maskParts[i] & 255).join('.');
}

function calculateUsableHosts(mask) {
    const maskParts = mask.split('.').map(Number);
    const binaryMask = maskParts.map(part => part.toString(2).padStart(8, '0')).join('');
    const hostBits = binaryMask.split('0').length - 1;
    return Math.pow(2, hostBits) - 2;
}

// Load Tool Settings
function loadToolSettings() {
    const settings = localStorage.getItem('toolSettings');
    if (settings) {
        toolState.settings = JSON.parse(settings);
    }
}

// Save Tool Settings
function saveToolSettings() {
    localStorage.setItem('toolSettings', JSON.stringify(toolState.settings));
}

// Initialize tools when DOM is loaded
document.addEventListener('DOMContentLoaded', initTools); 