// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Get all toggle checkboxes
const toggles = {
    blockTextSelection: document.getElementById('blockTextSelection'),
    blockZoom: document.getElementById('blockZoom'),
    blockScroll: document.getElementById('blockScroll'),
    blockRightClick: document.getElementById('blockRightClick'),
    blockCopy: document.getElementById('blockCopy'),
    blockCut: document.getElementById('blockCut'),
    blockPaste: document.getElementById('blockPaste'),
    blockDrag: document.getElementById('blockDrag'),
    blockPrint: document.getElementById('blockPrint'),
    blockDevTools: document.getElementById('blockDevTools')
};

// Code output element
const codeOutput = document.getElementById('generatedCode');
const copyButton = document.getElementById('copyButton');
const successMessage = document.getElementById('successMessage');

// Function to generate code based on selected options
function generateCode() {
    let cssCode = '<style>\n';
    let jsCode = '<script>\n';
    
    const options = {
        blockTextSelection: toggles.blockTextSelection.checked,
        blockZoom: toggles.blockZoom.checked,
        blockScroll: toggles.blockScroll.checked,
        blockRightClick: toggles.blockRightClick.checked,
        blockCopy: toggles.blockCopy.checked,
        blockCut: toggles.blockCut.checked,
        blockPaste: toggles.blockPaste.checked,
        blockDrag: toggles.blockDrag.checked,
        blockPrint: toggles.blockPrint.checked,
        blockDevTools: toggles.blockDevTools.checked
    };

    // Text Selection CSS
    if (options.blockTextSelection) {
        cssCode += `    /* Block Text Selection */
    * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }\n\n`;
    }

    // Print CSS
    if (options.blockPrint) {
        cssCode += `    /* Block Print */
    @media print {
        body {
            display: none !important;
        }
    }\n\n`;
    }

    cssCode += '</style>\n\n';

    // Zoom meta tag
    if (options.blockZoom) {
        cssCode = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n\n' + cssCode;
    }

    // JavaScript for blocking
    jsCode += '    (function() {\n';
    jsCode += '        "use strict";\n\n';

    // Block Right Click
    if (options.blockRightClick) {
        jsCode += `        // Block Right Click
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });\n\n`;
    }

    // Block Copy
    if (options.blockCopy) {
        jsCode += `        // Block Copy
        document.addEventListener('copy', function(e) {
            e.preventDefault();
            return false;
        });\n\n`;
    }

    // Block Cut
    if (options.blockCut) {
        jsCode += `        // Block Cut
        document.addEventListener('cut', function(e) {
            e.preventDefault();
            return false;
        });\n\n`;
    }

    // Block Paste
    if (options.blockPaste) {
        jsCode += `        // Block Paste
        document.addEventListener('paste', function(e) {
            e.preventDefault();
            return false;
        });\n\n`;
    }

    // Block Drag
    if (options.blockDrag) {
        jsCode += `        // Block Drag & Drop
        document.addEventListener('dragstart', function(e) {
            e.preventDefault();
            return false;
        });\n\n`;
    }

    // Block Scroll
    if (options.blockScroll) {
        jsCode += `        // Block Scroll
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        
        document.addEventListener('wheel', function(e) {
            e.preventDefault();
        }, { passive: false });
        
        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });
        
        document.addEventListener('keydown', function(e) {
            // Block arrow keys, page up/down, home, end, space
            if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
                e.preventDefault();
                return false;
            }
        });\n\n`;
    }

    // Block Zoom with JavaScript
    if (options.blockZoom) {
        jsCode += `        // Block Zoom
        document.addEventListener('wheel', function(e) {
            if (e.ctrlKey) {
                e.preventDefault();
                return false;
            }
        }, { passive: false });
        
        document.addEventListener('keydown', function(e) {
            // Block Ctrl/Cmd + Plus/Minus/0
            if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0')) {
                e.preventDefault();
                return false;
            }
        });\n\n`;
    }

    // Block Print with JavaScript
    if (options.blockPrint) {
        jsCode += `        // Block Print
        window.addEventListener('beforeprint', function(e) {
            e.preventDefault();
            return false;
        });
        
        document.addEventListener('keydown', function(e) {
            // Block Ctrl/Cmd + P
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                return false;
            }
        });\n\n`;
    }

    // Block DevTools
    if (options.blockDevTools) {
        jsCode += `        // Block DevTools (Note: This is not 100% effective)
        document.addEventListener('keydown', function(e) {
            // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
            if (e.key === 'F12' || 
                ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                ((e.ctrlKey || e.metaKey) && e.key === 'u')) {
                e.preventDefault();
                return false;
            }
        });
        
        // Detect DevTools open
        const devtools = /./;
        devtools.toString = function() {
            this.opened = true;
        };
        setInterval(function() {
            devtools.opened = false;
            console.log('%c', devtools);
            if (devtools.opened) {
                window.location.reload();
            }
        }, 1000);\n\n`;
    }

    jsCode += '    })();\n';
    jsCode += '<\/script>';

    const fullCode = cssCode + jsCode;
    codeOutput.textContent = fullCode;
    
    // Highlight the code (simple syntax highlighting)
    highlightCode();
}

// Simple syntax highlighting
function highlightCode() {
    let code = codeOutput.textContent;
    
    // This is a simplified version - for production, use a library like Prism.js or highlight.js
    code = code
        .replace(/(&lt;[\w/]+&gt;)/g, '<span style="color: #e74c3c;">$1</span>')
        .replace(/(\/\/.*)/g, '<span style="color: #95a5a6;">$1</span>')
        .replace(/(".*?")/g, '<span style="color: #2ecc71;">$1</span>');
    
    // Keep as text for now to maintain functionality
}

// Copy to clipboard functionality
copyButton.addEventListener('click', async () => {
    const code = codeOutput.textContent;
    
    try {
        await navigator.clipboard.writeText(code);
        showSuccessMessage();
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        
        try {
            document.execCommand('copy');
            showSuccessMessage();
        } catch (err) {
            alert('Fehler beim Kopieren. Bitte manuell kopieren.');
        }
        
        document.body.removeChild(textArea);
    }
});

function showSuccessMessage() {
    successMessage.classList.add('show');
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

// Add event listeners to all toggles
Object.values(toggles).forEach(toggle => {
    toggle.addEventListener('change', generateCode);
});

// Generate initial code
generateCode();
