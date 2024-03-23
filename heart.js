let currentTheme = 'light';

function darkMode() {
    let element = document.body;
    element.className = "dark-mode";
    currentTheme = 'dark';
    draw(); // Redraw canvas with new theme colors
}

function lightMode() {
    let element = document.body;
    element.className = "light-mode";
    currentTheme = 'light';
    draw(); // Redraw canvas with new theme colors
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('shapeCanvas');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    let t = 0; 
    
    function draw() {
        ctx.clearRect(0, 0, width, height); 
        let depthBuffer = new Float32Array(100 * 40);
        let maxDepth = -Infinity; 

        let cosTheta = Math.cos(t);
        let sinTheta = Math.sin(t);

        for (let posY = -0.5; posY <= 0.5; posY += 0.01) {
            let radius = 0.4 + 0.05 * Math.pow(0.5 + 0.5 * Math.sin(t * 6 + posY * 2), 8);
            for (let posX = -0.5; posX <= 0.5; posX += 0.01) {
                let z = -posX * posX - Math.pow(1.2 * posY - Math.abs(posX) * 2 / 3, 2) + radius * radius;
                if (z < 0) continue;
                z = Math.sqrt(z) / (2 - posY);
                for (let tempDepth = -z; tempDepth <= z; tempDepth += z / 6) {
                    let rotatedX = posX * cosTheta - tempDepth * sinTheta;
                    let projectedZ = posX * sinTheta + tempDepth * cosTheta;
                    let perspective = 1 + projectedZ / 2;
                    let viewportX = Math.round((rotatedX * perspective + 0.5) * 80 + 10);
                    let viewportY = Math.round((-posY * perspective + 0.5) * 39 + 2);
                    let bufferIndex = viewportX + viewportY * 100;
                    if (depthBuffer[bufferIndex] <= projectedZ) {
                        depthBuffer[bufferIndex] = projectedZ;
                        if (maxDepth <= projectedZ)
                            maxDepth = projectedZ;
                    }
                }
            }
        }

        let chars = " .,-~:;=!*&B@@"; 
        ctx.font = "10px monospace";
        let textColor = currentTheme === 'light' ? 'black' : '#E95793'; 
        ctx.fillStyle = textColor;

        for (let i = 0; i < depthBuffer.length; i++) {
            let x = i % 100;
            let y = Math.floor(i / 100);
            if (maxDepth > 0) {
                let charIndex = Math.floor((depthBuffer[i] / maxDepth) * (chars.length - 1));
                let character = chars[charIndex];
                ctx.fillText(character, x * 8, y * 12);
            }
        }

        t += 0.003;
        requestAnimationFrame(draw); 
    }
    
    draw(); 
});
