function createAiSettingsModal() {

    const currentApiKey = typeof API_KEY !== 'undefined' ? API_KEY : '';
    const currentApiUrl = typeof API_URL !== 'undefined' ? API_URL : '';
    const currentModel = typeof CURRENT_MODEL !== 'undefined' ? CURRENT_MODEL : '';
    const currentLanguage = typeof CURRENT_LANGUAGE !== 'undefined' ? CURRENT_LANGUAGE : '';
    const currentCustomContext = typeof CUSTOM_CONTEXT !== 'undefined' ? CUSTOM_CONTEXT : '';
    const currentSagecellUrl = typeof SAGECELL_URL !== 'undefined' ? SAGECELL_URL : 'https://sagecell.sagemath.org/';

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
            border-color: #4CAF50;
            outline: none;
        }
        .modal-content p {
            font-size: 0.9em;
            color: #666;
            line-height: 1.5;
            margin-top: 8px;
        }
        .modal-content a {
            color: #4CAF50;
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
             background-color: #4CAF50;
             color: white;
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
            padding: 2px 2px;       /* smaller padding */
            font-size: 0.75em;      /* smaller text */
            white-space: nowrap;    /* prevents breaking inside button */
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
            padding: 12px 15px; /* Increased padding for better appearance */
            display: block; /* Changed from inline-block to block */
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            font-size: 1em;
            transition: border-color 0.2s ease;
        }

        .password-input-container {
            position: relative;
            display: block; /* Changed from flex to block */
            width: 77%;
            top: 10%;
            left: 10px;
        }

        .password-input-container input {
            width: 100%;
            padding: 12px 15px 12px 15px; /* More padding on right for button, more on left for comfort */
            font-family: monospace;
            font-size: 0.95em;
            letter-spacing: 0.5px;
            box-sizing: border-box;
        }

        .toggle-password {
            position: absolute;
            right: -15%;
            top: 25%;
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
            border-color: #4CAF50;
            outline: none;
        }

        .modal-content textarea::placeholder {
            color: #999;
            font-style: italic;
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
                <div class="preset-buttons">
                    <button type="button" class="preset-btn" onclick="setApiPreset('openai')">OpenAI</button>
                    <button type="button" class="preset-btn" onclick="setApiPreset('mistral')">Mistral</button>
                    <button type="button" class="preset-btn" onclick="setApiPreset('anthropic')">Anthropic</button>
                    <button type="button" class="preset-btn" onclick="setApiPreset('deepseek')">DeepSeek</button>
                    <button type="button" class="preset-btn" onclick="setApiPreset('poe')">Poe</button>
                    <button type="button" class="preset-btn" onclick="setApiPreset('openrouter')">OpenRouter</button>
                    <button type="button" class="preset-btn" onclick="setApiPreset('groq')">Groq</button>
                    <button type="button" class="preset-btn" onclick="setApiPreset('cerebras')">Cerebras</button>
                    <button type="button" class="preset-btn" onclick="setApiPreset('github')">GitHub</button>
                </div>
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
            
            <h4>SageCell Service</h4>
            <div class="input-group">
                    <label for="sagecellUrlInput">SageCell Server URL:</label>
                    <input type="url" id="sagecellUrlInput" value="${currentSagecellUrl}" placeholder="https://sagecell.sagemath.org/">
                    <div class="preset-buttons">
                        <button type="button" class="preset-btn" onclick="document.getElementById('sagecellUrlInput').value='https://sagecell.sagemath.org/'">Default (sagecell.sagemath.org)</button>
                    </div>
                    <p>Base URL of the SageCell server used for computation. This is applied after save.</p>
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

    // Update global variables
    API_KEY = newKey;
    API_URL = newApiUrl;
    CURRENT_MODEL = selectedModel;
    CURRENT_LANGUAGE = selectedLanguage;
    CUSTOM_CONTEXT = customContext;

    console.log(`Updated! API URL: ${API_URL}, Model: ${CURRENT_MODEL}, API Key: ${API_KEY ? '******' : 'Not Set'}, Language: ${CURRENT_LANGUAGE}, SageCell: ${SAGECELL_URL}`);

    // Refresh control bars to reflect potential API key changes
    removeAllControlBars();
    initializeCells();

    alert("AI settings updated successfully!");
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
            model: 'openrouter/aurora-alpha' 
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