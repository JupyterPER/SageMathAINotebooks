function createAiSettingsModal() {

    const currentApiKey = typeof API_KEY !== 'undefined' ? API_KEY : '';
    const currentApiUrl = typeof API_URL !== 'undefined' ? API_URL : '';
    const currentModel = typeof CURRENT_MODEL !== 'undefined' ? CURRENT_MODEL : '';
    const currentLanguage = typeof CURRENT_LANGUAGE !== 'undefined' ? CURRENT_LANGUAGE : '';
    const currentCustomContext = typeof CUSTOM_CONTEXT !== 'undefined' ? CUSTOM_CONTEXT : '';
    const currentSagecellUrl = typeof SAGECELL_URL !== 'undefined' ? SAGECELL_URL : 'https://sagecell.sagemath.org/';
    const currentCustomCSS = typeof CUSTOM_CSS !== 'undefined' ? CUSTOM_CSS : '';

    removeExistingModal();

    // Enhanced CSS Styles (keeping existing styles)
    const styleElement = document.createElement('style');
    styleElement.id = 'modalStyles';
    styleElement.textContent = `
        .modal {
            display: block;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.6);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .modal-content {
            background-color: #fefefe;
            margin: 5% auto;
            padding: 30px;
            border: 1px solid #ccc;
            width: 90%;
            max-width: 600px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            position: relative;
            box-sizing: border-box;
        }
        .close {
            color: #aaa;
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 32px;
            font-weight: bold;
            line-height: 1;
            cursor: pointer;
            transition: color 0.2s ease;
        }
        .close:hover,
        .close:focus {
            color: #333;
            text-decoration: none;
        }
        .modal-content h3 {
            margin-top: 0;
            margin-bottom: 25px;
            color: #333;
            font-weight: 600;
            text-align: center;
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
        }
        .input-group {
            margin-bottom: 20px;
        }
        .input-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #555;
            font-size: 0.95em;
        }
        .modal-content input[type="text"],
        .modal-content input[type="url"],
        .modal-content select {
            width: 100%;
            padding: 10px 12px;
            display: inline-block;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 1em;
            transition: border-color 0.2s ease;
        }
        .modal-content input[type="text"]:focus,
        .modal-content input[type="url"]:focus,
        .modal-content select:focus {
            border-color: var(--main-color, #4CAF50);
            outline: none;
        }
        .modal-content p {
            font-size: 0.9em;
            color: #666;
            line-height: 1.5;
            margin-top: 8px;
        }
        .modal-content a {
            color: var(--main-color, #4CAF50);
            text-decoration: none;
        }
        .modal-content a:hover {
            text-decoration: underline;
        }
        .modal-content button {
            padding: 10px 18px;
            cursor: pointer;
            border: none;
            border-radius: 4px;
            font-size: 0.95em;
            font-weight: 500;
            transition: background-color 0.2s ease, box-shadow 0.2s ease;
            margin-top: 5px;
            margin-right: 8px;
        }
        .modal-content button:last-child {
            margin-right: 0;
        }
        .update-button {
             background-color: var(--main-color, #4CAF50);
             color: var(--main-btn-icons, #fff);
             font-weight: 700;
        }
        .update-button:hover {
             background-color: #45a049;
             box-shadow: 0 2px 5px rgba(0,0,0,0.15);
         }
        .modal-section {
            margin-top: 25px;
            padding-top: 20px;
            border-top: 1px solid #e5e5e5;
        }
        .modal-section h4 {
            margin-top: 0;
            margin-bottom: 15px;
            color: #444;
            font-weight: 600;
            font-size: 1.1em;
        }
         .checkbox-label {
             display: flex;
             align-items: center;
             cursor: pointer;
             margin-bottom: 10px;
             font-size: 0.95em;
             color: #333;
         }
         .checkbox-label input[type="checkbox"] {
             width: auto;
             margin-right: 10px;
             margin-top: 0;
             margin-bottom: 0;
             height: 16px;
             width: 16px;
             cursor: pointer;
         }
        .danger-zone-text {
             font-size: 0.85em;
             color: #777;
             margin-top: 8px;
             margin-bottom: 0;
        }
        .warning-message {
            color: #856404;
            background-color: #fff3cd;
            border-left: 5px solid #ffc107;
            padding: 15px 20px;
            margin: 25px 0 0 0;
            border-radius: 4px;
            font-size: 0.9em;
        }
        .warning-message strong {
            font-weight: 600;
            display: block;
            margin-bottom: 5px;
        }
         .warning-message p {
            margin: 0;
            color: inherit;
            font-size: 1em;
         }
         .button-group {
            margin-top: 20px;
            text-align: right;
         }
         .button-group button {
            margin-left: 10px;
            margin-right: 0;
         }
         .preset-buttons {
            display: flex;
            gap: 8px;
            margin-top: 8px;
            flex-wrap: wrap;
         }
        .preset-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 2px;
            margin-top: 2px;
        }
        .preset-btn {
            padding: 2px 2px;
            font-size: 0.75em;
            white-space: nowrap;
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 3px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .preset-btn:hover {
            background-color: #e9ecef;
        }
        .modal-content input[type="text"],
        .modal-content input[type="url"],
        .modal-content input[type="password"],
        .modal-content select {
            width: 100%;
            padding: 12px 15px;
            display: block;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 1em;
            transition: border-color 0.2s ease;
        }

        .password-input-container {
            position: relative;
            display: block;
            width: 77%;
            top: 10%;
            left: 10px;
        }

        .password-input-container input {
            width: 100%;
            padding: 12px 15px 12px 15px;
            font-family: monospace;
            font-size: 0.95em;
            letter-spacing: 0.5px;
            box-sizing: border-box;
        }

        .toggle-password {
            position: absolute;
            right: -15%;
            top: 40%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            font-size: 18px;
            color: #666;
            transition: color 0.2s ease;
            margin: 0;
            height: auto;
            min-height: auto;
            z-index: 1;
        }
        .eye-icon {
            display: inline-block;
            bottom: -50%;
            width: 20px;
            height: 20px;
            background: currentColor;
            mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -5 24 24'%3E%3Cpath d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/%3E%3C/svg%3E") no-repeat center;
            mask-size: contain;
        }
        .modal-content textarea {
            width: 100%;
            padding: 12px 15px;
            display: block;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 0.95em;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.4;
            resize: vertical;
            min-height: 80px;
            transition: border-color 0.2s ease;
        }

        .modal-content textarea:focus {
            border-color: var(--main-color, #4CAF50);
            outline: none;
        }

        .modal-content textarea::placeholder {
            color: #999;
            font-style: italic;
        }
        .modal-content select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 1em;
            background-color: #fff;
            cursor: pointer;
        }

        .modal-content select:focus {
            border-color: var(--main-color, #4CAF50);
            outline: none;
        }
        .modal-content textarea.css-textarea {
            font-family: Consolas, "Courier New", monospace;
            font-size: 0.85em;
            line-height: 1.5;
            min-height: 120px;
            tab-size: 2;
        }
    `;
    document.head.appendChild(styleElement);
    const modalDiv = document.createElement('div');
    modalDiv.id = 'apiKeyModal';
    modalDiv.className = 'modal';
    modalDiv.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="removeExistingModal()">&times;</span>
            <h3>AI Settings</h3>

            <div class="input-group">
                <label for="apiUrlInput">API URL:</label>
                <input type="url" id="apiUrlInput" value="${currentApiUrl}" placeholder="https://api.example.com/v1/chat/completions">
                <select id="providerSelect" onchange="if(this.value) setApiPreset(this.value)" style="margin-top: 8px; width: 100%;">
                    <option value="">— Select a provider to autofill URL —</option>
                    <option value="openai">OpenAI</option>
                    <option value="mistral">Mistral</option>
                    <option value="anthropic">Anthropic</option>
                    <option value="deepseek">DeepSeek</option>
                    <option value="poe">Poe</option>
                    <option value="openrouter">OpenRouter</option>
                    <option value="groq">Groq</option>
                    <option value="cerebras">Cerebras</option>
                    <option value="github">GitHub</option>
                </select>
                <p>Enter the API endpoint URL for your AI service.</p>
            </div>

            <div class="input-group">
                <label for="modelInput">Model Name:</label>
                <input type="text" id="modelInput" value="${currentModel}" placeholder="e.g., mistral-small-latest, gpt-4o, claude-3-sonnet">
                <p>Enter the exact model name as required by your API provider.</p>
            </div>

            
            <div class="input-group">
                <label for="languageInput">Response Language:</label>
                <input type="text" id="languageInput" value="${currentLanguage}" placeholder="e.g., English, Spanish, Chinese">
            </div>
            

            <div class="input-group">
                <label for="newKey">API Key:</label>
                <div class="password-input-container">
                    <input type="password" id="newKey" value="${currentApiKey}" placeholder="Enter your API key">
                    <button type="button" class="toggle-password" onclick="togglePasswordVisibility()" aria-label="Toggle password visibility">
                        <span id="toggleIcon" class="eye-icon"></span>
                    </button>
                </div>
                <p>Enter your API key for the selected provider.</p>
            </div>

            <div class="input-group">
                <label for="customContextInput">Custom Context (Optional):</label>
                <textarea id="customContextInput" placeholder="Enter additional context or instructions for the AI..." rows="4">${typeof CUSTOM_CONTEXT !== 'undefined' ? CUSTOM_CONTEXT : ''}</textarea>
                <p>This context will be included with every AI request. Use it for specific domain knowledge or instructions.</p>
            </div>
            <p>For more details, see the <a title="AI assistant documentation" href="https://github.com/JupyterPER/SageMathAINotebooks/blob/main/docs/AI_assistant.md" target="_blank">AI assistant documentation</a></p>
            
            <button class="update-button" onclick="updateAiSettings()">Update AI Settings</button>


            <div class="warning-message">
                <strong>⚠️ Security Warning</strong>
                <p>API key is stored within this notebook.</p>
                <p>Remember to remove your API key before sharing this notebook.</p>
                <p>Never share your API key publicly.</p>
            </div>

            <div class="modal-section">
            
            <h3>SageCell Service</h3>
            <div class="input-group">
                    <label for="sagecellUrlInput">SageCell Server URL:</label>
                    <input type="url" id="sagecellUrlInput" value="${currentSagecellUrl}" placeholder="https://sagecell.sagemath.org/">
                    <div class="preset-buttons">
                        <button type="button" class="preset-btn" onclick="document.getElementById('sagecellUrlInput').value='https://sagecell.sagemath.org/'">Default (sagecell.sagemath.org)</button>
                    </div>
                    <p>Base URL of the SageCell server used for computation. This is applied after save.</p>
                </div>
            </div>

            <div class="modal-section">
                <h3>Custom CSS</h3>
                <div style="margin-bottom:10px;">
                    <label for="cssThemeSelect"><strong>CSS Theme Preset:</strong></label><br>
                    <select id="cssThemeSelect" onchange="applyCssThemePreset()" style="width:100%; padding:6px; margin-top:4px;">
                    </select>
                </div>
                <div class="input-group">
                    <label for="customCssInput">Custom Stylesheet (Optional):</label>
                    <textarea id="customCssInput" class="css-textarea" placeholder="Paste custom CSS here, e.g.:&#10;&#10;body { background: #f0f0f0; }&#10;.nb-code-cell { border: 2px solid #ccc; }&#10;:root { --main-color: #e91e63; }" rows="6">${currentCustomCSS.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
                    <p>This CSS will be injected into the page and applied immediately. Use it to customize colors, fonts, spacing, or any visual aspect of the notebook. Changes persist when you save the notebook.</p>
                </div>
            </div>
            
            <button class="update-button" onclick="updateAiSettings()">Update Settings</button>

        </div>
    `;

    document.body.appendChild(modalDiv);

    modalDiv.addEventListener('click', function(event) {
        if (event.target === modalDiv) {
            removeExistingModal();
        }
    });
    // Close modal with ESC key
    function handleKey(event) {
        if (event.key === "Escape") {
            removeExistingModal();
        }
    }
    document.addEventListener('keydown', handleKey);
    populateCssThemeDropdown();
    document.getElementById('customCssInput').addEventListener('input', function () {
        const select = document.getElementById('cssThemeSelect');
        if (!select) return;
        const matchedTheme = findMatchingTheme(this.value);
        select.value = matchedTheme || '__custom__';
    });
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('newKey');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}


function updateAiSettings() {
    const newKey = document.getElementById('newKey').value.trim();
    const newApiUrl = document.getElementById('apiUrlInput').value.trim();
    const selectedModel = document.getElementById('modelInput').value.trim();
    const selectedLanguage = document.getElementById('languageInput').value.trim();
    const customContext = document.getElementById('customContextInput').value.trim();

    // SageCell URL with trailing slash validation
    let sagecellUrl = document.getElementById('sagecellUrlInput').value.trim();
    if (sagecellUrl && !sagecellUrl.endsWith('/')) {
        sagecellUrl += '/';
        document.getElementById('sagecellUrlInput').value = sagecellUrl;
    }
    SAGECELL_URL = sagecellUrl || 'https://sagecell.sagemath.org/';

    // Custom CSS
    const customCssValue = document.getElementById('customCssInput') ? document.getElementById('customCssInput').value : '';
    applyCustomCSS(customCssValue);

    // Update global variables
    API_KEY = newKey;
    API_URL = newApiUrl;
    CURRENT_MODEL = selectedModel;
    CURRENT_LANGUAGE = selectedLanguage;
    CUSTOM_CONTEXT = customContext;

    console.log(`Updated! API URL: ${API_URL}, Model: ${CURRENT_MODEL}, API Key: ${API_KEY ? '******' : 'Not Set'}, Language: ${CURRENT_LANGUAGE}, SageCell: ${SAGECELL_URL}, Custom CSS: ${CUSTOM_CSS ? CUSTOM_CSS.length + ' chars' : 'None'}`);

    // Refresh control bars to reflect potential API key changes
    removeAllControlBars();
    initializeCells();

    alert("Settings updated successfully!");
}

function removeExistingModal() {
    // Remove existing modal if present
    const existingModal = document.getElementById('apiKeyModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Remove existing styles if present
    const existingStyles = document.getElementById('modalStyles');
    if (existingStyles) {
        existingStyles.remove();
    }
    
}



function setApiPreset(provider) {
    const apiUrlInput = document.getElementById('apiUrlInput');
    const modelInput = document.getElementById('modelInput');

    const presets = {
        openai: {
            url: 'https://api.openai.com/v1/chat/completions',
            model: 'gpt-5-mini' 
        },
        mistral: {
            url: 'https://api.mistral.ai/v1/chat/completions',
            model: 'mistral-medium-latest'
        },
        anthropic: {
            url: 'https://api.anthropic.com/v1/messages',
            model: 'claude-3-sonnet-20240229'
        },
        poe: {
            url: 'https://api.poe.com/v1/chat/completions',
            model: 'Assistant'
        },
        openrouter: {
            url: 'https://openrouter.ai/api/v1/chat/completions',
            model: 'openai/gpt-oss-120b' 
        },
        groq: {
            url: 'https://api.groq.com/openai/v1/chat/completions',
            model: 'openai/gpt-oss-120b' 
        },
        cerebras: {
            url: 'https://api.cerebras.ai/v1/chat/completions',
            model: 'gpt-oss-120b'
        },
        github: {
            url: 'https://models.github.ai/inference/chat/completions',
            model: 'openai/gpt-5-mini' 
        },
        deepseek: {
            url: 'https://api.deepseek.com/v1/chat/completions',
            model: 'deepseek-chat'
        }
    };

    if (presets[provider]) {
        apiUrlInput.value = presets[provider].url;
        modelInput.value = presets[provider].model;
    }
}

async function callAiApi(apiUrl, model, prompt, aiCommand, documentation, context, apiKey) {
    // Determine the API format based on URL
    const isAnthropic = apiUrl.includes('anthropic.com');
    const systemPrompt = primingAiAssistant[aiCommand] + `\n\n` + documentation +  `\n\n# Custom context or instructions provided by user:\n\n` + context;
    
    let requestBody;
    let headers = {
        "Content-Type": "application/json"
    };

    if (isAnthropic) {
        // Anthropic Claude API format
        headers["x-api-key"] = apiKey;
        headers["anthropic-version"] = "2023-06-01";
        requestBody = {
            model: model,
            max_tokens: 4000,
            messages: [
                { role: "system", content: systemPrompt},
                { role: "user", content: prompt }
            ]
        };
    } else {
        // OpenAI-compatible format (OpenAI, Mistral etc.)
        if (apiKey) {
            headers["Authorization"] = `Bearer ${apiKey}`;
        }
        requestBody = {
            model: model,
            messages: [
                { role: "system", content: systemPrompt},
                { role: "user", content: prompt}
            ]
        };
        
    }

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error (${response.status}): ${errorText}`);
        }

        const data = await response.json();

        // Extract response based on API format
        if (isAnthropic) {
            return data.content?.[0]?.text || "";
        } else {
            return data.choices?.[0]?.message?.content || "";
        }
    } catch (error) {
        console.error('AI API call failed:', error);
        throw new Error(`AI API call failed: ${error.message}`);
    }
}

function preparePrompt(context, userCode, currentLanguage) {
    let prompt = "";

    if (context && context.trim()) {
        prompt += "Previous code cells:\n" + context + "\n\n";
    }

    prompt += "FOCUS code cell:\n" + userCode + "\n\n";

    if (currentLanguage && currentLanguage.trim()) {
        prompt += `IMPORTANT: Respond in ${currentLanguage}.`;
    }

    return prompt;
}




function sanitizeAiOutput(text, aiCommand) {
    if (!text) return "";

    // iba pre complete a format
    if (aiCommand === "AI_complete" || aiCommand === "AI_format") {
        return text
            .split("\n")
            .filter(line => !line.trim().startsWith("```"))
            .join("\n")
            .trim();
    }

    return text.trim();
}

async function formatAndLoadCodeIntoCell(cell, aiCommand, currentModel, apiKey, currentLanguage, currentCustomContext) {
    const cm = cell.querySelector(".CodeMirror")?.CodeMirror;
    if (!cm) return;

    // Check if we have the required settings
    if (!API_URL || !currentModel || !apiKey) {
        alert('Please configure AI settings first (API URL, Model, and API Key are required).');
        return;
    }

    const userCode = cm.getValue();
    const contextRaw = loadPreviousCodeCells(cell);
    const context = sanitizeIns(contextRaw);
    const prompt = preparePrompt(context, userCode, currentLanguage);

    // Create temporary loading cell
    const loadingCell = addMarkdownCell(cell, "below", "*AI is working...*");

    try {
        let aiText = await callAiApi(API_URL, currentModel, prompt, aiCommand, aiSageDocs, currentCustomContext, apiKey);
        aiText = sanitizeAiOutput(aiText, aiCommand);

        let newCell;
        if (aiCommand === "AI_explain") {
            // Result goes to markdown cell
            newCell = addMarkdownCell(loadingCell, "below", aiText);
            loadingCell.parentNode.removeChild(loadingCell);
        } else {
            // Result goes to code cell
            newCell = createCodeCell(`${aiText}`);
            loadingCell.parentNode.replaceChild(newCell, loadingCell);
            addControlBar(newCell);
            reprocessNotebook();
        }
    } catch (err) {
        console.error(err);
        loadingCell.querySelector(".markdown-preview").textContent =
            `⚠️ Error: ${err.message}`;
    }
}

function sanitizeLongDataRawByLines(text, lineThreshold = 20, headLines = 20, tailLines = 20) {
    const pattern = /^(data_raw\s*=\s*r""")(.*?)("""\s*)$/gms;

    return text.replace(pattern, (match, prefix, content, suffix) => {
        const lines = content.split(/\r?\n/);
        if (lines.length > lineThreshold) {
            const newContent = [
                ...lines.slice(0, headLines),
                ".\n.\n.\n.",
                ...lines.slice(-tailLines)
            ].join("\n");
            return prefix + newContent + suffix;
        } else {
            return match;
        }
    });
}

function sanitizeIns(text) {
    // First sanitize long data blocks
    let sanitized = sanitizeLongDataRawByLines(text);

    // Then replace AI cell contents
    const pattern = /# -START OF AI CELL-[\s\S]*?# -END OF AI CELL-/g;
    sanitized = sanitized.replace(pattern, "#");
    return sanitized;
}

// =================== AI VISION ===================

const visionState = {
    images: [],
    drawCtx: null,
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    penColor: '#000',
    isEraser: false,
    currentCell: null,
    canvasInitialized: false
};

function removeExistingVisionModal() {
    const existing = document.getElementById('aiVisionModal');
    if (existing) existing.remove();
    const existingStyles = document.getElementById('visionModalStyles');
    if (existingStyles) existingStyles.remove();
    document.removeEventListener('paste', visionPasteHandler);
    document.removeEventListener('keydown', visionEscHandler);
    visionState.images = [];
    visionState.drawCtx = null;
    visionState.canvasInitialized = false;
}

function visionPasteHandler(e) {
    if (!document.getElementById('aiVisionModal')) return;
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
        if (item.type.startsWith('image/')) {
            e.preventDefault();
            const blob = item.getAsFile();
            const reader = new FileReader();
            reader.onload = function(ev) {
                visionState.images.push({
                    name: 'clipboard-' + Date.now() + '.png',
                    dataUrl: ev.target.result
                });
                visionRenderPreviews();
            };
            reader.readAsDataURL(blob);
            return;
        }
    }
}

function visionEscHandler(e) {
    if (e.key === 'Escape') removeExistingVisionModal();
    if (e.key === 'Enter' && document.activeElement?.id !== 'visionInstructions') {
        e.preventDefault();
        submitVisionRequest();
    }
}

function createAiVisionModal(cell) {
    removeExistingVisionModal();
    visionState.currentCell = cell;
    visionState.images = [];

    var style = document.createElement('style');
    style.id = 'visionModalStyles';
    style.textContent = '\
#aiVisionModal {\
    display:block; position:fixed; z-index:10000;\
    left:0; top:0; width:100%; height:100%; overflow:auto;\
    background-color:rgba(0,0,0,0.6);\
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;\
}\
#aiVisionModal .vm-content {\
    background:#fefefe; margin:3% auto; padding:25px;\
    border:1px solid #ccc; width:92%; max-width:720px;\
    border-radius:8px; box-shadow:0 5px 15px rgba(0,0,0,0.2);\
    position:relative; box-sizing:border-box;\
    max-height:90vh; overflow-y:auto;\
}\
#aiVisionModal .vm-close {\
    color:#aaa; position:absolute; top:12px; right:18px;\
    font-size:30px; font-weight:bold; cursor:pointer; line-height:1;\
}\
#aiVisionModal .vm-close:hover { color:#333; }\
#aiVisionModal .vm-title {\
    margin:0 0 20px 0; text-align:center;\
    font-weight:600; color:#333; border-bottom:1px solid #eee; padding-bottom:12px;\
}\
#aiVisionModal .vm-tabs {\
    display:flex; gap:0; margin-bottom:15px; border-bottom:2px solid #e0e0e0;\
}\
#aiVisionModal .vm-tab {\
    padding:8px 18px; border:none; background:transparent;\
    font-size:0.92em; font-weight:500; color:#666;\
    cursor:pointer; border-bottom:2px solid transparent;\
    margin-bottom:-2px; transition:all 0.15s;\
}\
#aiVisionModal .vm-tab:hover { color:#333; background:#f8f8f8; }\
#aiVisionModal .vm-tab.active {\
    color:var(--main-color, #4CAF50); border-bottom-color:var(--main-color, #4CAF50); font-weight:600;\
}\
#aiVisionModal .vm-panel { display:none; }\
#aiVisionModal .vm-panel.active { display:block; }\
#aiVisionModal .vm-dropzone {\
    border:2px dashed #ccc; border-radius:6px; padding:30px 20px;\
    text-align:center; cursor:pointer; transition:all 0.2s;\
    background:#fafbfc; margin-bottom:10px;\
}\
#aiVisionModal .vm-dropzone:hover,\
#aiVisionModal .vm-dropzone.dragover {\
    border-color:var(--main-color, #4CAF50); background:#f0faf0;\
}\
#aiVisionModal .vm-dropzone p { margin:4px 0; color:#666; font-size:0.9em; }\
#aiVisionModal .vm-dropzone .vm-drop-icon { font-size:2em; margin-bottom:6px; }\
#aiVisionModal .vm-draw-toolbar {\
    display:flex; gap:8px; align-items:center; flex-wrap:wrap;\
    margin-bottom:10px; padding:6px 0;\
}\
#aiVisionModal .vm-colors { display:flex; gap:5px; align-items:center; }\
#aiVisionModal .vm-color-btn {\
    width:28px; height:28px; min-width:28px; border-radius:50%;\
    border:3px solid #ddd; cursor:pointer; padding:0;\
    box-shadow:none; transition:border-color 0.15s;\
}\
#aiVisionModal .vm-color-btn.active {\
    border-color:#333; box-shadow:0 0 0 2px rgba(74,144,226,0.4);\
}\
#aiVisionModal .vm-tool-btn {\
    background:#f0f0f0; color:#333; border:2px solid #ddd;\
    border-radius:6px; padding:0; min-width:32px; height:32px;\
    font-size:15px; box-shadow:none; cursor:pointer;\
    display:flex; align-items:center; justify-content:center;\
    transition:all 0.15s;\
}\
#aiVisionModal .vm-tool-btn:hover { background:#e4e4e4; }\
#aiVisionModal .vm-tool-btn.active { border-color:var(--main-color, #4CAF50); background:#e0f2e0; }\
#aiVisionModal .vm-size-ctrl {\
    display:flex; align-items:center; gap:5px; font-size:0.82em; color:#555;\
}\
#aiVisionModal .vm-size-ctrl input[type="range"] {\
    width:70px; accent-color:var(--main-color, #4CAF50);\
}\
#aiVisionModal #visionCanvas {\
    max-width:100%; display:block; border:2px solid #e0e0e0;\
    border-radius:4px; cursor:crosshair; touch-action:none; background:#fff;\
}\
#aiVisionModal .vm-add-draw-btn {\
    margin-top:8px; padding:7px 16px; background:var(--main-color, #4CAF50);\
    color:#fff; border:none; border-radius:4px; font-size:0.88em;\
    font-weight:500; cursor:pointer; transition:background 0.2s;\
}\
#aiVisionModal .vm-add-draw-btn:hover { background:#45a049; }\
#aiVisionModal .vm-previews {\
    display:flex; flex-wrap:wrap; gap:8px; margin:12px 0;\
    min-height:40px; padding:8px; border:1px solid #eee;\
    border-radius:4px; background:#fafbfc;\
}\
#aiVisionModal .vm-no-images {\
    color:#aaa; font-size:0.85em; font-style:italic; width:100%;\
    text-align:center; margin:8px 0;\
}\
#aiVisionModal .vm-preview-item {\
    position:relative; border:1px solid #ddd; border-radius:4px;\
    overflow:hidden; width:80px; height:80px; flex-shrink:0;\
}\
#aiVisionModal .vm-preview-item img {\
    width:100%; height:100%; object-fit:cover;\
}\
#aiVisionModal .vm-preview-remove {\
    position:absolute; top:2px; right:2px; background:#e74c3c;\
    color:#fff; border:none; border-radius:50%; width:18px; height:18px;\
    font-size:10px; cursor:pointer; display:flex; align-items:center;\
    justify-content:center; padding:0; min-width:18px; box-shadow:none;\
    line-height:1;\
}\
#aiVisionModal .vm-preview-remove:hover { background:#c0392b; }\
#aiVisionModal .vm-modes { margin:14px 0; }\
#aiVisionModal .vm-modes h4 {\
    margin:0 0 8px 0; font-size:0.95em; color:#444; font-weight:600;\
}\
#aiVisionModal .vm-mode-label {\
    display:block; padding:7px 10px; margin:4px 0; border-radius:4px;\
    cursor:pointer; font-size:0.9em; color:#333; transition:background 0.15s;\
}\
#aiVisionModal .vm-mode-label:hover { background:#f4f4f4; }\
#aiVisionModal .vm-mode-label input[type="radio"] {\
    margin-right:8px; accent-color:var(--main-color, #4CAF50);\
}\
#aiVisionModal .vm-instructions-group { margin:10px 0; }\
#aiVisionModal .vm-instructions-group label {\
    display:block; margin-bottom:6px; font-weight:500;\
    color:#555; font-size:0.9em;\
}\
#aiVisionModal .vm-instructions-group textarea {\
    width:100%; padding:10px 12px; border:1px solid #ccc;\
    border-radius:4px; box-sizing:border-box; font-size:0.9em;\
    font-family:inherit; line-height:1.4; resize:vertical;\
    min-height:60px; transition:border-color 0.2s;\
}\
#aiVisionModal .vm-instructions-group textarea:focus {\
    border-color:var(--main-color, #4CAF50); outline:none;\
}\
#aiVisionModal .vm-submit-row {\
    margin-top:16px; text-align:right;\
}\
#aiVisionModal .vm-submit-btn {\
    padding:10px 22px; background:var(--main-color, #4CAF50); color:#fff;\
    border:none; border-radius:4px; font-size:0.95em;\
    font-weight:500; cursor:pointer; transition:all 0.2s;\
}\
#aiVisionModal .vm-submit-btn:hover {\
    background:#45a049; box-shadow:0 2px 5px rgba(0,0,0,0.15);\
}\
#aiVisionModal .vm-hint {\
    font-size:0.8em; color:#999; margin-top:4px;\
}\
';
    document.head.appendChild(style);

    var modal = document.createElement('div');
    modal.id = 'aiVisionModal';

    modal.innerHTML = '\
<div class="vm-content">\
    <span class="vm-close" onclick="removeExistingVisionModal()">&times;</span>\
    <h3 class="vm-title">AI Vision</h3>\
\
    <div class="vm-tabs">\
        <button class="vm-tab active" data-tab="upload" onclick="visionSwitchTab(\'upload\', this)"><strong>Upload</strong></button>\
        <button class="vm-tab" data-tab="draw" onclick="visionSwitchTab(\'draw\', this)"><strong>Draw</strong></button>\
    </div>\
\
    <div id="visionUploadPanel" class="vm-panel active">\
        <div class="vm-dropzone" id="visionDropzone">\
            <div class="vm-drop-icon">📁</div>\
            <p><strong>Click to browse</strong> or drag &amp; drop images here</p>\
            <p style="font-size:0.8em;color:#aaa;">You can also paste images from clipboard (Ctrl+V)</p>\
            <input type="file" id="visionFileInput" multiple accept="image/*" style="display:none;">\
        </div>\
    </div>\
\
    <div id="visionDrawPanel" class="vm-panel">\
        <div class="vm-draw-toolbar">\
            <div class="vm-colors">\
                <button class="vm-color-btn active" style="background:#000" onclick="visionSetDrawColor(\'#000\',this)" title="Black"></button>\
                <button class="vm-color-btn" style="background:#e74c3c" onclick="visionSetDrawColor(\'#e74c3c\',this)" title="Red"></button>\
                <button class="vm-color-btn" style="background:#2980b9" onclick="visionSetDrawColor(\'#2980b9\',this)" title="Blue"></button>\
                <button class="vm-color-btn" style="background:#27ae60" onclick="visionSetDrawColor(\'#27ae60\',this)" title="Green"></button>\
                <button class="vm-tool-btn" id="visionEraserBtn" onclick="visionToggleEraser()" title="Eraser">🧹</button>\
            </div>\
            <div class="vm-size-ctrl">\
                <span>Size:</span>\
                <input type="range" id="visionPenSize" min="1" max="16" value="3">\
            </div>\
            <button class="vm-tool-btn" onclick="visionClearCanvas()" title="Clear canvas">🗑️</button>\
        </div>\
        <canvas id="visionCanvas"></canvas>\
        <button class="vm-add-draw-btn" onclick="visionAddDrawing()">📎 Add Drawing to Attachments</button>\
    </div>\
\
    <div id="visionPreviews" class="vm-previews">\
        <span class="vm-no-images">No images attached yet</span>\
    </div>\
\
    <div class="vm-modes">\
        <h4>Action Mode:</h4>\
        <label class="vm-mode-label">\
            <input type="radio" name="visionMode" value="ocr" onchange="visionUpdateMode()">OCR to Markdown\
        </label>\
        <label class="vm-mode-label">\
            <input type="radio" name="visionMode" value="code" checked onchange="visionUpdateMode()">Convert to SageMath Code\
        </label>\
        <label class="vm-mode-label">\
            <input type="radio" name="visionMode" value="custom" onchange="visionUpdateMode()">Custom Query\
        </label>\
    </div>\
\
    <div class="vm-instructions-group">\
        <label for="visionInstructions">Instructions:</label>\
        <textarea id="visionInstructions" rows="3"\
            placeholder="Optional: additional instructions (e.g. \'focus on the equations\', \'this is handwritten\')"></textarea>\
        <div class="vm-hint">Optional for OCR &amp; Code modes. Required for Custom.</div>\
    </div>\
\
    <div class="vm-submit-row">\
        <button class="vm-submit-btn" onclick="submitVisionRequest()">Analyze</button>\
    </div>\
</div>';

    document.body.appendChild(modal);

    // Close on backdrop click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) removeExistingVisionModal();
    });

    // Escape key
    document.addEventListener('keydown', visionEscHandler);

    // Clipboard paste
    document.addEventListener('paste', visionPasteHandler);

    // File input
    var fileInput = document.getElementById('visionFileInput');
    fileInput.addEventListener('change', function(e) {
        visionHandleFiles(e.target.files);
        fileInput.value = '';
    });

    // Dropzone click
    var dropzone = document.getElementById('visionDropzone');
    dropzone.addEventListener('click', function() {
        fileInput.click();
    });

    // Drag & drop
    dropzone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', function() {
        dropzone.classList.remove('dragover');
    });
    dropzone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer && e.dataTransfer.files) {
            visionHandleFiles(e.dataTransfer.files);
        }
    });

    // Canvas events
    var canvas = document.getElementById('visionCanvas');
    canvas.addEventListener('mousedown', visionStartDraw);
    canvas.addEventListener('mousemove', visionDoDraw);
    canvas.addEventListener('mouseup', visionEndDraw);
    canvas.addEventListener('mouseleave', visionEndDraw);
    canvas.addEventListener('touchstart', visionStartDraw, { passive: false });
    canvas.addEventListener('touchmove', visionDoDraw, { passive: false });
    canvas.addEventListener('touchend', visionEndDraw);

    // Pen size change
    document.getElementById('visionPenSize').addEventListener('input', function() {
        if (visionState.drawCtx) visionState.drawCtx.lineWidth = parseInt(this.value);
    });
}

// Call this after the settings panel is created/opened
function populateCssThemeDropdown() {
    const select = document.getElementById('cssThemeSelect');
    if (!select) return;
    select.innerHTML = '';

    // "Custom" option for when the textarea content doesn't match any preset
    const customOption = document.createElement('option');
    customOption.value = '__custom__';
    customOption.textContent = '— Custom —';
    select.appendChild(customOption);

    for (const themeName of Object.keys(customCssThemes)) {
        const option = document.createElement('option');
        option.value = themeName;
        option.textContent = themeName;
        select.appendChild(option);
    }

    // Try to match the current CSS to a preset
    const textarea = document.getElementById('customCssInput');
    if (textarea) {
        textarea.value = CUSTOM_CSS || '';
        const matchedTheme = findMatchingTheme(textarea.value);
        select.value = matchedTheme || '__custom__';
    }
}

function findMatchingTheme(css) {
    const normalized = css.trim();
    for (const [name, value] of Object.entries(customCssThemes)) {
        if (value.trim() === normalized) return name;
    }
    return null;
}

function applyCssThemePreset() {
    const select = document.getElementById('cssThemeSelect');
    const textarea = document.getElementById('customCssInput');
    if (!select || !textarea) return;

    const themeName = select.value;
    if (themeName === '__custom__') return; // don't overwrite on "Custom"

    textarea.value = customCssThemes[themeName] || '';
}

// ---- Tab switching ----
function visionSwitchTab(tabName, btn) {
    document.querySelectorAll('#aiVisionModal .vm-tab').forEach(function(t) {
        t.classList.toggle('active', t.dataset.tab === tabName);
    });
    document.getElementById('visionUploadPanel').classList.toggle('active', tabName === 'upload');
    document.getElementById('visionDrawPanel').classList.toggle('active', tabName === 'draw');

    if (tabName === 'draw' && !visionState.canvasInitialized) {
        setTimeout(visionInitCanvas, 50);
    }
}

// ---- Mode update ----
function visionUpdateMode() {
    var mode = document.querySelector('input[name="visionMode"]:checked');
    if (!mode) return;
    var ta = document.getElementById('visionInstructions');
    var placeholders = {
        ocr: "Optional: e.g., 'focus on the equations', 'this is handwritten in German'",
        code: "Optional: e.g., 'solve the equations', 'plot the function', 'define the matrix'",
        custom: "Enter your instructions: e.g., 'explain this diagram', 'find the error', 'rewrite in SageMath'"
    };
    ta.placeholder = placeholders[mode.value] || '';
}

// ---- Image handling ----
function visionHandleFiles(files) {
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 20 * 1024 * 1024) {
            alert('File "' + file.name + '" is too large (max 20 MB).');
            continue;
        }
        (function(f) {
            var reader = new FileReader();
            reader.onload = function(ev) {
                visionState.images.push({
                    name: f.name,
                    dataUrl: ev.target.result
                });
                visionRenderPreviews();
            };
            reader.readAsDataURL(f);
        })(file);
    }
}

function visionRemoveImage(index) {
    visionState.images.splice(index, 1);
    visionRenderPreviews();
}

function visionRenderPreviews() {
    var container = document.getElementById('visionPreviews');
    if (!container) return;
    container.innerHTML = '';

    if (visionState.images.length === 0) {
        container.innerHTML = '<span class="vm-no-images">No images attached yet</span>';
        return;
    }

    visionState.images.forEach(function(img, idx) {
        var item = document.createElement('div');
        item.className = 'vm-preview-item';

        var imgEl = document.createElement('img');
        imgEl.src = img.dataUrl;
        imgEl.alt = img.name;
        imgEl.title = img.name;
        item.appendChild(imgEl);

        var removeBtn = document.createElement('button');
        removeBtn.className = 'vm-preview-remove';
        removeBtn.textContent = '✕';
        removeBtn.onclick = function() { visionRemoveImage(idx); };
        item.appendChild(removeBtn);

        container.appendChild(item);
    });
}

// ---- Drawing canvas ----
function visionGetCanvasPos(e) {
    var canvas = document.getElementById('visionCanvas');
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    if (e.touches && e.touches.length > 0) {
        return {
            x: (e.touches[0].clientX - rect.left) * scaleX,
            y: (e.touches[0].clientY - rect.top) * scaleY
        };
    }
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

function visionStartDraw(e) {
    e.preventDefault();
    visionState.isDrawing = true;
    var pos = visionGetCanvasPos(e);
    visionState.lastX = pos.x;
    visionState.lastY = pos.y;
    if (visionState.drawCtx) {
        visionState.drawCtx.beginPath();
        visionState.drawCtx.arc(pos.x, pos.y, visionState.drawCtx.lineWidth / 2, 0, Math.PI * 2);
        visionState.drawCtx.fillStyle = visionState.drawCtx.strokeStyle;
        visionState.drawCtx.fill();
    }
}

function visionDoDraw(e) {
    e.preventDefault();
    if (!visionState.isDrawing || !visionState.drawCtx) return;
    var pos = visionGetCanvasPos(e);
    visionState.drawCtx.beginPath();
    visionState.drawCtx.moveTo(visionState.lastX, visionState.lastY);
    visionState.drawCtx.lineTo(pos.x, pos.y);
    visionState.drawCtx.stroke();
    visionState.lastX = pos.x;
    visionState.lastY = pos.y;
}

function visionEndDraw() {
    visionState.isDrawing = false;
}

function visionInitCanvas() {
    var canvas = document.getElementById('visionCanvas');
    if (!canvas) return;
    var panel = document.getElementById('visionDrawPanel');
    var availWidth = panel.clientWidth - 10;
    var w = Math.min(Math.max(availWidth, 300), 700);
    var h = Math.min(Math.round(w * 0.5), 360);

    canvas.width = w;
    canvas.height = h;

    visionState.drawCtx = canvas.getContext('2d');
    visionState.drawCtx.fillStyle = '#ffffff';
    visionState.drawCtx.fillRect(0, 0, w, h);
    visionState.drawCtx.strokeStyle = visionState.penColor;
    visionState.drawCtx.lineWidth = parseInt(document.getElementById('visionPenSize').value) || 3;
    visionState.drawCtx.lineCap = 'round';
    visionState.drawCtx.lineJoin = 'round';
    visionState.canvasInitialized = true;
}

function visionClearCanvas() {
    if (!visionState.drawCtx) return;
    var canvas = document.getElementById('visionCanvas');
    visionState.drawCtx.fillStyle = '#ffffff';
    visionState.drawCtx.fillRect(0, 0, canvas.width, canvas.height);
}

function visionSetDrawColor(color, btn) {
    visionState.penColor = color;
    visionState.isEraser = false;
    if (visionState.drawCtx) visionState.drawCtx.strokeStyle = color;
    document.querySelectorAll('#aiVisionModal .vm-color-btn').forEach(function(b) {
        b.classList.remove('active');
    });
    btn.classList.add('active');
    document.getElementById('visionEraserBtn').classList.remove('active');
}

function visionToggleEraser() {
    visionState.isEraser = !visionState.isEraser;
    var eraserBtn = document.getElementById('visionEraserBtn');
    if (visionState.isEraser) {
        if (visionState.drawCtx) visionState.drawCtx.strokeStyle = '#ffffff';
        eraserBtn.classList.add('active');
        document.querySelectorAll('#aiVisionModal .vm-color-btn').forEach(function(b) {
            b.classList.remove('active');
        });
    } else {
        if (visionState.drawCtx) visionState.drawCtx.strokeStyle = visionState.penColor;
        eraserBtn.classList.remove('active');
    }
}

function visionAddDrawing() {
    var canvas = document.getElementById('visionCanvas');
    if (!canvas) return;
    var dataUrl = canvas.toDataURL('image/png');
    visionState.images.push({
        name: 'sketch-' + Date.now() + '.png',
        dataUrl: dataUrl
    });
    visionRenderPreviews();
    visionClearCanvas();
}

// ---- Vision API call ----
async function callAiVisionApi(apiUrl, model, systemPrompt, userPrompt, imageDataUrls, apiKey) {
    var isAnthropic = apiUrl.includes('anthropic.com');
    var headers = { "Content-Type": "application/json" };
    var requestBody;

    if (isAnthropic) {
        headers["x-api-key"] = apiKey;
        headers["anthropic-version"] = "2023-06-01";

        var contentParts = [];

        // Images first for Anthropic
        for (var i = 0; i < imageDataUrls.length; i++) {
            var match = imageDataUrls[i].match(/^data:(image\/[^;]+);base64,(.+)$/);
            if (match) {
                contentParts.push({
                    type: "image",
                    source: {
                        type: "base64",
                        media_type: match[1],
                        data: match[2]
                    }
                });
            }
        }

        contentParts.push({ type: "text", text: userPrompt });

        requestBody = {
            model: model,
            max_tokens: 4096,
            system: systemPrompt,
            messages: [{ role: "user", content: contentParts }]
        };
    } else {
        // OpenAI-compatible
        if (apiKey) headers["Authorization"] = "Bearer " + apiKey;

        var contentParts = [{ type: "text", text: userPrompt }];

        for (var i = 0; i < imageDataUrls.length; i++) {
            contentParts.push({
                type: "image_url",
                image_url: { url: imageDataUrls[i] }
            });
        }

        requestBody = {
            model: model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: contentParts }
            ]
        };
    }

    try {
        var response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            var errorText = await response.text();
            throw new Error("API error (" + response.status + "): " + errorText);
        }

        var data = await response.json();

        if (isAnthropic) {
            return (data.content && data.content[0] && data.content[0].text) || "";
        } else {
            return (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";
        }
    } catch (error) {
        console.error('AI Vision API call failed:', error);
        throw new Error("AI Vision API call failed: " + error.message);
    }
}

// ---- Submit vision request ----
async function submitVisionRequest() {
    var cell = visionState.currentCell;
    if (!cell) {
        alert('No cell reference found. Please try again.');
        return;
    }

    var modeRadio = document.querySelector('input[name="visionMode"]:checked');
    var mode = modeRadio ? modeRadio.value : 'ocr';
    var customInstructions = (document.getElementById('visionInstructions')?.value || '').trim();

    if (visionState.images.length === 0) {
        alert('Please attach at least one image or drawing.');
        return;
    }

    if (!API_URL || !CURRENT_MODEL || !API_KEY) {
        alert('Please configure AI settings first (API URL, Model, and API Key are required).');
        return;
    }

    if (mode === 'custom' && !customInstructions) {
        alert('Please enter instructions for the custom query.');
        return;
    }

    // Collect data before closing modal
    var imageDataUrls = visionState.images.map(function(img) { return img.dataUrl; });

    // Close modal
    removeExistingVisionModal();

    // Build system prompt
    var aiCommand = 'AI_vision_' + mode;
    var primingText = (primingAiAssistant[aiCommand] || '');
    var docsText = (mode === 'code') ? aiSageDocs : '';
    var contextText = (typeof CUSTOM_CONTEXT !== 'undefined' && CUSTOM_CONTEXT) ? CUSTOM_CONTEXT : '';
    var systemPrompt = primingText;
    if (docsText) systemPrompt += '\n\n' + docsText;
    if (contextText) systemPrompt += '\n\n# Custom context:\n' + contextText;

    // Build user prompt
    var userPrompt = '';

    // Include previous code cells as context (useful for code mode)
    if (mode === 'code') {
        var contextRaw = loadPreviousCodeCells(cell);
        var context = sanitizeIns(contextRaw);
        if (context && context.trim()) {
            userPrompt += 'Previous code cells:\n' + context + '\n\n';
        }

        var cm = cell.querySelector(".CodeMirror");
        if (cm && cm.CodeMirror) {
            var currentCode = cm.CodeMirror.getValue();
            if (currentCode.trim()) {
                userPrompt += 'Current code cell:\n' + currentCode + '\n\n';
            }
        }
    }

    if (customInstructions) {
        userPrompt += 'User instructions: ' + customInstructions + '\n\n';
    }

    userPrompt += 'Please analyze the attached image(s) and respond according to your role.';

    var currentLanguage = (typeof CURRENT_LANGUAGE !== 'undefined') ? CURRENT_LANGUAGE : '';
    if (currentLanguage && currentLanguage.trim()) {
        if (mode === 'ocr') {
            userPrompt += '\n\nIMPORTANT: If you add any notes or descriptions (not the transcribed text itself), write them in ' + currentLanguage + '.';
        } else {
            userPrompt += '\n\nIMPORTANT: Respond in ' + currentLanguage + '.';
        }
    }

    // Show loading cell
    var loadingCell = addMarkdownCell(cell, "below", "*AI Vision is processing the image...*");

    try {
        var aiText = await callAiVisionApi(API_URL, CURRENT_MODEL, systemPrompt, userPrompt, imageDataUrls, API_KEY);

        if (mode === 'code') {
            // Clean code output
            aiText = sanitizeAiOutput(aiText, 'AI_complete');
            var newCell = createCodeCell(aiText);
            loadingCell.parentNode.replaceChild(newCell, loadingCell);
            addControlBar(newCell);
            reprocessNotebook();
        } else {
            // OCR or Custom -> markdown cell
            var newCell = addMarkdownCell(loadingCell, "below", aiText);
            loadingCell.parentNode.removeChild(loadingCell);
        }
    } catch (err) {
        console.error(err);
        var preview = loadingCell.querySelector(".markdown-preview");
        if (preview) {
            preview.textContent = '⚠️ Vision Error: ' + err.message;
        }
    }
}