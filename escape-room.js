// Spielzustand
let currentLevel = 1;
let hintsRemaining = 3;
let gameProgress = 0;
let timeRemaining = 1800; // 30 Minuten in Sekunden
let timerInterval;
let isGameOver = false;

// DOM Elemente
const codeInput = document.getElementById('code-input');
const outputContent = document.getElementById('output-content');
const avatarMessage = document.getElementById('avatar-message');
const currentLevelElement = document.getElementById('current-level');
const levelProgress = document.getElementById('level-progress');
const hintBtn = document.getElementById('hint-btn');
const submitBtn = document.getElementById('submit-btn');
const nextLevelBtn = document.getElementById('next-level-btn');
const inventoryItems = document.getElementById('inventory-items');

// Sound-Effekte
const sounds = {
    success: new Audio('sounds/success.mp3'),
    error: new Audio('sounds/error.mp3'),
    hint: new Audio('sounds/hint.mp3'),
    levelComplete: new Audio('sounds/level-complete.mp3'),
    background: new Audio('sounds/background.mp3')
};

// Level-Definitionen
const levels = [
    {
        id: 1,
        title: "HTML-Grundlagen",
        description: "Erstelle eine einfache HTML-Seite mit einem Titel und einem Absatz.",
        type: "html",
        template: "<!DOCTYPE html>\n<html>\n<head>\n    <title></title>\n</head>\n<body>\n    \n</body>\n</html>",
        solution: "<!DOCTYPE html>\n<html>\n<head>\n    <title>Meine erste Seite</title>\n</head>\n<body>\n    <h1>Willkommen!</h1>\n    <p>Dies ist mein erster HTML-Code.</p>\n</body>\n</html>",
        hints: [
            "Der Titel sollte zwischen den <title> Tags stehen",
            "Verwende <h1> für die Überschrift",
            "Verwende <p> für den Absatz"
        ],
        validate: (code) => {
            return code.includes("<title>Meine erste Seite</title>") &&
                   code.includes("<h1>Willkommen!</h1>") &&
                   code.includes("<p>Dies ist mein erster HTML-Code.</p>");
        }
    },
    {
        id: 2,
        title: "CSS-Design",
        description: "Gestalte die Seite mit CSS. Füge eine blaue Hintergrundfarbe und weiße Schrift hinzu.",
        type: "css",
        template: "body {\n    \n}",
        solution: "body {\n    background-color: blue;\n    color: white;\n}",
        hints: [
            "Verwende background-color für die Hintergrundfarbe",
            "Verwende color für die Schriftfarbe",
            "Die Werte sollten 'blue' und 'white' sein"
        ],
        validate: (code) => {
            return code.includes("background-color: blue") &&
                   code.includes("color: white");
        }
    },
    {
        id: 3,
        title: "Subnetting",
        description: "Berechne die Subnetzmaske für ein Netzwerk mit 4 Subnetzen.",
        type: "subnetting",
        template: "IP: 192.168.1.0\nSubnetze: 4\n\nBerechne:",
        solution: "255.255.255.192",
        hints: [
            "Für 4 Subnetze brauchst du 2 Bits",
            "Die Subnetzmaske wird in der vierten Oktette angepasst",
            "2 Bits = 192 in dezimal"
        ],
        validate: (code) => {
            return code.trim() === "255.255.255.192";
        }
    },
    {
        id: 4,
        title: "Binärsystem",
        description: "Konvertiere die Dezimalzahl 42 in Binär.",
        type: "binary",
        template: "Dezimal: 42\n\nBinär:",
        solution: "101010",
        hints: [
            "Teile die Zahl durch 2 und notiere den Rest",
            "Lies die Reste von unten nach oben",
            "42 = 101010 in Binär"
        ],
        validate: (code) => {
            return code.trim() === "101010";
        }
    },
    {
        id: 5,
        title: "SQL-Datenbanken",
        description: "Schreibe eine SQL-Abfrage, die alle Benutzer über 18 Jahre auswählt.",
        type: "sql",
        template: "SELECT * FROM users\nWHERE",
        solution: "SELECT * FROM users\nWHERE age > 18",
        hints: [
            "Verwende den Vergleichsoperator >",
            "Die Spalte heißt 'age'",
            "Der Wert ist 18"
        ],
        validate: (code) => {
            return code.toLowerCase().includes("where age > 18");
        }
    },
    {
        id: 6,
        title: 'JavaScript-Funktionen',
        description: 'Erstelle eine Funktion, die die Summe zweier Zahlen berechnet.',
        type: 'javascript',
        template: 'function add(a, b) {\n    \n}',
        solution: 'function add(a, b) {\n    return a + b;\n}',
        hints: [
            'Verwende den return-Operator',
            'Addiere die Parameter a und b',
            'Die Funktion sollte die Summe zurückgeben'
        ],
        validation: (code) => {
            try {
                const fn = new Function('return ' + code)();
                return fn(2, 3) === 5 && fn(-1, 1) === 0;
            } catch {
                return false;
            }
        },
        scene: 'javascript-scene'
    },
    {
        id: 7,
        title: 'Netzwerk-Protokolle',
        description: 'Ordne die Netzwerk-Protokolle den richtigen OSI-Schichten zu.',
        type: 'matching',
        template: '// Ordne die Protokolle zu:\n// HTTP, TCP, IP, Ethernet',
        solution: '// Anwendungsschicht: HTTP\n// Transportschicht: TCP\n// Internetschicht: IP\n// Netzzugangsschicht: Ethernet',
        hints: [
            'HTTP gehört zur Anwendungsschicht',
            'TCP ist ein Transportprotokoll',
            'IP ist ein Internetprotokoll',
            'Ethernet ist ein Netzzugangsprotokoll'
        ],
        validation: (code) => {
            return code.includes('HTTP') && code.includes('TCP') && 
                   code.includes('IP') && code.includes('Ethernet');
        },
        scene: 'protocol-scene'
    },
    {
        id: 8,
        title: 'Datenbank-Normalisierung',
        description: 'Normalisiere die Tabelle users in die 3. Normalform.',
        type: 'sql',
        template: 'CREATE TABLE users (\n    \n);',
        solution: 'CREATE TABLE users (\n    user_id INT PRIMARY KEY,\n    username VARCHAR(50),\n    email VARCHAR(100)\n);\n\nCREATE TABLE user_profiles (\n    profile_id INT PRIMARY KEY,\n    user_id INT,\n    full_name VARCHAR(100),\n    address TEXT,\n    FOREIGN KEY (user_id) REFERENCES users(user_id)\n);',
        hints: [
            'Trenne die Daten in zwei Tabellen',
            'Verwende Fremdschlüssel',
            'Entferne transitive Abhängigkeiten'
        ],
        validation: (code) => {
            return code.includes('CREATE TABLE') && 
                   code.includes('FOREIGN KEY') &&
                   code.includes('REFERENCES');
        },
        scene: 'database-scene'
    },
    {
        id: 9,
        title: 'Binäre Logik',
        description: 'Implementiere eine XOR-Gatter-Funktion.',
        type: 'javascript',
        template: 'function xor(a, b) {\n    \n}',
        solution: 'function xor(a, b) {\n    return (a || b) && !(a && b);\n}',
        hints: [
            'XOR ist wahr, wenn genau ein Eingang wahr ist',
            'Verwende logische Operatoren',
            'Die Funktion sollte einen booleschen Wert zurückgeben'
        ],
        validation: (code) => {
            try {
                const fn = new Function('return ' + code)();
                return fn(true, false) === true &&
                       fn(false, true) === true &&
                       fn(true, true) === false &&
                       fn(false, false) === false;
            } catch {
                return false;
            }
        },
        scene: 'logic-scene'
    },
    {
        id: 10,
        title: 'CSS-Animationen',
        description: 'Erstelle eine CSS-Animation für einen pulsierenden Kreis.',
        type: 'css',
        template: '@keyframes pulse {\n    \n}\n\n.circle {\n    \n}',
        solution: '@keyframes pulse {\n    0% { transform: scale(1); }\n    50% { transform: scale(1.2); }\n    100% { transform: scale(1); }\n}\n\n.circle {\n    width: 100px;\n    height: 100px;\n    background: blue;\n    border-radius: 50%;\n    animation: pulse 2s infinite;\n}',
        hints: [
            'Verwende @keyframes für die Animation',
            'Definiere die Skalierung in Prozent',
            'Setze die Animation auf infinite'
        ],
        validation: (code) => {
            return code.includes('@keyframes') &&
                   code.includes('animation:') &&
                   code.includes('infinite');
        },
        scene: 'animation-scene'
    }
];

// 3D-Szenen
const scenes = {
    'html-scene': {
        objects: [
            { type: 'box', position: { x: 0, y: 0, z: 0 }, color: 0x00ff9d },
            { type: 'sphere', position: { x: 2, y: 1, z: 1 }, color: 0x0066ff }
        ]
    },
    'css-scene': {
        objects: [
            { type: 'torus', position: { x: 0, y: 0, z: 0 }, color: 0xff009d },
            { type: 'cylinder', position: { x: -2, y: 1, z: 1 }, color: 0x00ff66 }
        ]
    },
    'network-scene': {
        objects: [
            { type: 'octahedron', position: { x: 0, y: 0, z: 0 }, color: 0xff6600 },
            { type: 'icosahedron', position: { x: 2, y: 1, z: 1 }, color: 0x00ff99 }
        ]
    },
    'binary-scene': {
        objects: [
            { type: 'dodecahedron', position: { x: 0, y: 0, z: 0 }, color: 0x9900ff },
            { type: 'tetrahedron', position: { x: -2, y: 1, z: 1 }, color: 0xff0099 }
        ]
    },
    'database-scene': {
        objects: [
            { type: 'cube', position: { x: 0, y: 0, z: 0 }, color: 0x00ffff },
            { type: 'sphere', position: { x: 2, y: 1, z: 1 }, color: 0xff00ff }
        ]
    },
    'javascript-scene': {
        objects: [
            { type: 'torus', position: { x: 0, y: 0, z: 0 }, color: 0xffff00 },
            { type: 'cylinder', position: { x: -2, y: 1, z: 1 }, color: 0x00ffff }
        ]
    },
    'protocol-scene': {
        objects: [
            { type: 'octahedron', position: { x: 0, y: 0, z: 0 }, color: 0xff6600 },
            { type: 'icosahedron', position: { x: 2, y: 1, z: 1 }, color: 0x00ff99 }
        ]
    },
    'logic-scene': {
        objects: [
            { type: 'dodecahedron', position: { x: 0, y: 0, z: 0 }, color: 0x9900ff },
            { type: 'tetrahedron', position: { x: -2, y: 1, z: 1 }, color: 0xff0099 }
        ]
    },
    'animation-scene': {
        objects: [
            { type: 'sphere', position: { x: 0, y: 0, z: 0 }, color: 0xff00ff },
            { type: 'cube', position: { x: 2, y: 1, z: 1 }, color: 0x00ffff }
        ]
    }
};

// Spiel-Initialisierung
function initGame() {
    loadLevel(currentLevel);
    updateUI();
    startTimer();
    setupEventListeners();
    init3DScene();
}

// Level laden
function loadLevel(levelNumber) {
    const level = levels[levelNumber - 1];
    if (!level) {
        gameOver();
        return;
    }

    currentLevelElement.textContent = `Level ${levelNumber}`;
    avatarMessage.textContent = level.description;
    codeInput.value = level.template;
    updateProgress();
}

// UI aktualisieren
function updateUI() {
    levelProgress.style.width = `${(currentLevel / levels.length) * 100}%`;
    hintBtn.disabled = hintsRemaining <= 0;
    nextLevelBtn.disabled = true;
}

// Event Listener einrichten
function setupEventListeners() {
    hintBtn.addEventListener('click', showHint);
    submitBtn.addEventListener('click', checkSolution);
    nextLevelBtn.addEventListener('click', nextLevel);
    
    // Sound-Einstellungen
    document.getElementById('sound-toggle').addEventListener('click', toggleSound);
    document.getElementById('music-toggle').addEventListener('click', toggleMusic);
}

// Sound-Funktionen
function playSound(soundName) {
    if (gameState.soundEnabled && sounds[soundName]) {
        sounds[soundName].currentTime = 0;
        sounds[soundName].play();
    }
}

function playBackgroundMusic() {
    if (gameState.musicEnabled) {
        sounds.background.loop = true;
        sounds.background.play();
    }
}

function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    document.getElementById('sound-toggle').classList.toggle('muted');
}

function toggleMusic() {
    gameState.musicEnabled = !gameState.musicEnabled;
    if (gameState.musicEnabled) {
        sounds.background.play();
    } else {
        sounds.background.pause();
    }
    document.getElementById('music-toggle').classList.toggle('muted');
}

// 3D-Szene
function init3DScene() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('scene-container').appendChild(renderer.domElement);

    // Beleuchtung
    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Objekte basierend auf aktuellem Level
    const currentScene = scenes[levels[currentLevel - 1].scene];
    currentScene.objects.forEach(obj => {
        let geometry;
        switch (obj.type) {
            case 'box':
                geometry = new THREE.BoxGeometry();
                break;
            case 'sphere':
                geometry = new THREE.SphereGeometry();
                break;
            case 'torus':
                geometry = new THREE.TorusGeometry();
                break;
            case 'cylinder':
                geometry = new THREE.CylinderGeometry();
                break;
            case 'octahedron':
                geometry = new THREE.OctahedronGeometry();
                break;
            case 'icosahedron':
                geometry = new THREE.IcosahedronGeometry();
                break;
            case 'dodecahedron':
                geometry = new THREE.DodecahedronGeometry();
                break;
            case 'tetrahedron':
                geometry = new THREE.TetrahedronGeometry();
                break;
        }
        const material = new THREE.MeshPhongMaterial({ color: obj.color });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
        scene.add(mesh);
    });

    camera.position.z = 5;

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        scene.children.forEach(child => {
            if (child instanceof THREE.Mesh) {
                child.rotation.x += 0.01;
                child.rotation.y += 0.01;
            }
        });
        renderer.render(scene, camera);
    }

    animate();

    // Responsive
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Timer
function startTimer() {
    timerInterval = setInterval(() => {
        if (timeRemaining > 0 && !isGameOver) {
            timeRemaining--;
            updateTimerDisplay();
        } else if (timeRemaining <= 0) {
            gameOver();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Spiel-Ende
function gameOver() {
    isGameOver = true;
    clearInterval(timerInterval);
    playSound('error');
    const gameOverScreen = document.createElement('div');
    gameOverScreen.className = 'game-over-screen';
    gameOverScreen.innerHTML = `
        <div class="game-over-content">
            <h2>Zeit abgelaufen!</h2>
            <p>Du hast ${gameState.completedLevels.size} von ${levels.length} Leveln geschafft.</p>
            <button onclick="restartGame()">Erneut spielen</button>
        </div>
    `;
    document.body.appendChild(gameOverScreen);
}

// Spiel neu starten
function restartGame() {
    currentLevel = 1;
    hintsRemaining = 3;
    timeRemaining = 1800;
    isGameOver = false;
    gameProgress = 0;
    localStorage.removeItem('escapeRoomState');
    location.reload();
}

// Spiel starten
document.addEventListener('DOMContentLoaded', initGame);

// Tipp anzeigen
function showHint() {
    if (hintsRemaining <= 0) return;
    
    const level = levels[currentLevel - 1];
    const hintIndex = 3 - hintsRemaining;
    const hint = level.hints[hintIndex];
    
    outputContent.innerHTML += `<div class="hint">💡 Tipp: ${hint}</div>`;
    hintsRemaining--;
    updateUI();
    
    // Scroll zum Ende
    outputContent.scrollTop = outputContent.scrollHeight;
}

// Lösung überprüfen
function checkSolution() {
    const level = levels[currentLevel - 1];
    const userCode = codeInput.value;
    
    if (level.validate(userCode)) {
        showSuccess();
        nextLevelBtn.disabled = false;
        addToInventory(level.id);
    } else {
        showError();
    }
}

// Nächstes Level
function nextLevel() {
    currentLevel++;
    if (currentLevel > levels.length) {
        gameOver();
    } else {
        loadLevel(currentLevel);
        updateUI();
        outputContent.innerHTML = '';
    }
}

// Fortschritt aktualisieren
function updateProgress() {
    gameProgress = (currentLevel / levels.length) * 100;
    levelProgress.style.width = `${gameProgress}%`;
}

// Inventar aktualisieren
function addToInventory(levelId) {
    const item = document.createElement('div');
    item.className = 'inventory-item';
    item.innerHTML = `<i class="fas fa-key"></i> Level ${levelId}`;
    inventoryItems.appendChild(item);
}

// Erfolgs-Animation
function showSuccess() {
    outputContent.innerHTML += '<div class="success">✅ Richtig! Gut gemacht!</div>';
    outputContent.scrollTop = outputContent.scrollHeight;
}

// Fehler-Animation
function showError() {
    outputContent.innerHTML += '<div class="error">❌ Leider falsch. Versuche es noch einmal!</div>';
    outputContent.scrollTop = outputContent.scrollHeight;
} 