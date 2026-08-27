// ============================================================
// SETTINGS MODAL  (collapsible: Appearance / AI / Notebook / File)
// ============================================================

function settingsSectionIsOpen(name, defaultOpen) {
    try {
        const v = sessionStorage.getItem('settingsSection_' + name);
        if (v === '1') return true;
        if (v === '0') return false;
    } catch (e) { /* ignore */ }
    return !!defaultOpen;
}

function toggleSettingsSection(name) {
    const section = document.getElementById('section-' + name);
    const body    = document.getElementById('body-' + name);
    if (!section || !body) return;

    const open = !section.classList.contains('open');
    section.classList.toggle('open', open);
    body.style.display = open ? 'block' : 'none';

    const caret = section.querySelector('.settings-caret');
    if (caret) caret.textContent = open ? '▾' : '▸';

    const header = section.querySelector('.settings-section-header');
    if (header) header.setAttribute('aria-expanded', open ? 'true' : 'false');

    try { sessionStorage.setItem('settingsSection_' + name, open ? '1' : '0'); } catch (e) {}

    if (open) scrollSettingsSectionIntoView(section);
}

// Brings an expanded section into the visible part of #settingsScrollArea.
function scrollSettingsSectionIntoView(section) {
    const area = document.getElementById('settingsScrollArea');
    if (!area || !section) return;

    requestAnimationFrame(() => {
        const a = area.getBoundingClientRect();
        const s = section.getBoundingClientRect();

        // Already fully visible -> do nothing.
        if (s.top >= a.top && s.bottom <= a.bottom) return;

        let target;
        if (s.height <= a.height) {
            // Fits: pull the whole section into view from the bottom.
            target = area.scrollTop + (s.bottom - a.bottom) + 12;
            if (s.top < a.top) target = area.scrollTop + (s.top - a.top) - 12;
        } else {
            // Taller than the viewport: align its header to the top.
            target = area.scrollTop + (s.top - a.top) - 8;
        }

        const max = area.scrollHeight - area.clientHeight;
        area.scrollTo({ top: Math.max(0, Math.min(target, max)), behavior: 'smooth' });
    });
}

function removeExistingModal() {
    document.getElementById('apiKeyModal')?.remove();
    document.getElementById('modalStyles')?.remove();
    document.body.classList.remove('settings-modal-open');   // <-- ADD
    if (window.__settingsEscHandler) {
        document.removeEventListener('keydown', window.__settingsEscHandler);
        window.__settingsEscHandler = null;
    }
}

function createAiSettingsModal() {

    const currentApiKey        = typeof API_KEY            !== 'undefined' ? API_KEY : '';
    const currentApiUrl        = typeof API_URL            !== 'undefined' ? API_URL : '';
    const currentModel         = typeof CURRENT_MODEL      !== 'undefined' ? CURRENT_MODEL : '';
    const currentLanguage      = typeof CURRENT_LANGUAGE   !== 'undefined' ? CURRENT_LANGUAGE : '';
    const currentCustomContext = typeof CUSTOM_CONTEXT     !== 'undefined' ? CUSTOM_CONTEXT : '';
    const currentSagecellUrl   = typeof SAGECELL_URL       !== 'undefined' ? SAGECELL_URL : 'https://sagecell.sagemath.org/';
    const currentCustomCSS     = typeof CUSTOM_CSS         !== 'undefined' ? CUSTOM_CSS : '';
    const currentSettingsPath  = typeof SETTINGS_PATH_NAME !== 'undefined' ? SETTINGS_PATH_NAME : 'settings.js';
    const currentRunDelay      = (typeof RUN_DELAY !== 'undefined' && Number(RUN_DELAY) > 0) ? Number(RUN_DELAY) : 1000;

    // Appearance / notebook toggles
    const evalHidden    = typeof toggleEvalBtnsState !== 'undefined' ? !!toggleEvalBtnsState : false;
    const fullWidth     = typeof isFullWidthState    !== 'undefined' ? !!isFullWidthState    : false;
    const inputHidden   = typeof isCodeInputHidden   === 'function'  ? isCodeInputHidden()   : false;
    const historyShown  = typeof isHistoryPanelVisible === 'function' ? isHistoryPanelVisible() : false;

    removeExistingModal();

    // ---------- styles ----------
    const styleElement = document.createElement('style');
    styleElement.id = 'modalStyles';
    styleElement.textContent = `
        /* ---- overlay ---- */
        .modal {
            display:flex; position:fixed; left:0; top:0; right:0; bottom:0;
            z-index:10000; width:100%; height:100%;
            align-items:flex-start; justify-content:center;
            padding:24px 16px; box-sizing:border-box;
            overflow-y:auto; -webkit-overflow-scrolling:touch;
            background-color:rgba(0,0,0,0.6);
            font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
        }

        /* generic dialog box (also used by the confirm dialog) */
        .modal-content {
            background-color:#fefefe; margin:0 auto; padding:28px 30px 30px 30px;
            border:1px solid #ccc; width:100%; max-width:640px; border-radius:8px;
            box-shadow:0 5px 15px rgba(0,0,0,0.2); position:relative;
            box-sizing:border-box; text-align:left;
        }

        /* ---- settings dialog: fixed header + scrollable body ---- */
        #apiKeyModal .modal-content {
            padding:0 !important;
            display:flex; flex-direction:column;
            min-height:0; overflow:hidden;              /* keeps rounded corners */
            max-height:calc(100vh - 48px);              /* = .modal padding * 2 */
            max-height:calc(100dvh - 48px);             /* mobile browser bars */
        }
        #apiKeyModal .modal-header {
            flex:0 0 auto; padding:22px 30px 14px 30px;
            border-bottom:1px solid #eee; background:#fefefe;
            border-radius:8px 8px 0 0;
        }
        #apiKeyModal .modal-body {
            flex:1 1 auto; min-height:0;
            overflow-y:auto; overflow-x:hidden;
            overscroll-behavior:contain;
            padding:18px 30px 26px 30px;
            scrollbar-width:thin;
            scrollbar-color:#c2c2c2 transparent;
        }
        #apiKeyModal .modal-body::-webkit-scrollbar { width:10px; }
        #apiKeyModal .modal-body::-webkit-scrollbar-track { background:transparent; }
        #apiKeyModal .modal-body::-webkit-scrollbar-thumb {
            background:#c8c8c8; border-radius:5px; border:2px solid #fefefe;
        }
        #apiKeyModal .modal-body::-webkit-scrollbar-thumb:hover { background:#a8a8a8; }

        /* keep the background page from scrolling behind the dialog */
        body.settings-modal-open { overflow:hidden !important; }

        .close {
            color:#aaa; position:absolute; top:12px; right:18px; font-size:32px;
            font-weight:bold; line-height:1; cursor:pointer; transition:color .2s;
            z-index:2;
        }
        .close:hover, .close:focus { color:#333; }
        .modal-content h3.modal-main-title {
            margin:0; color:#333; font-weight:600; text-align:center;
        }

        /* ---- collapsible sections ---- */
        .settings-section {
            border:1px solid #e0e0e0; border-radius:6px;
            margin-bottom:12px; background:#fff;
            overflow:visible;                 /* never clip expanded content */
        }
        .settings-section:last-child { margin-bottom:0; }
        .settings-section-header {
            display:flex; align-items:center; gap:10px; width:100%;
            padding:12px 16px !important; margin:0 !important;
            background:#f5f6f7 !important; color:#333 !important;
            border:none !important; border-radius:5px !important;
            font-size:1em !important; font-weight:600 !important;
            cursor:pointer; text-align:left !important;
            transition:background .15s;
        }
        .settings-section-header:hover {
            background:#ececee !important; opacity:1 !important; box-shadow:none !important;
        }
        .settings-section.open .settings-section-header {
            background:var(--main-color,#4CAF50) !important;
            color:var(--main-btn-icons,#fff) !important;
            border-radius:5px 5px 0 0 !important;
        }
        .settings-caret { font-size:.8em; width:12px; display:inline-block; }
        .settings-section-body {
            display:none; height:auto; overflow:visible;
            padding:18px 16px 14px 16px; border-top:1px solid #e8e8e8;
        }
        .settings-section-body > *:last-child { margin-bottom:0 !important; }
        .settings-subtitle {
            margin:20px 0 10px 0; font-size:.95em; font-weight:600; color:#444;
            border-bottom:1px solid #eee; padding-bottom:6px;
        }
        .settings-subtitle:first-child { margin-top:0; }

        /* short viewports: give the dialog the whole height */
        @media (max-height:640px) {
            .modal { padding:10px 8px; }
            #apiKeyModal .modal-content { max-height:calc(100vh - 20px); }
            #apiKeyModal .modal-header { padding:16px 22px 10px 22px; }
            #apiKeyModal .modal-body { padding:14px 22px 20px 22px; }
        }

        /* ---- form elements ---- */
        .input-group { margin-bottom:20px; text-align:left; }
        .input-group label { display:block; margin-bottom:8px; font-weight:500; color:#555; font-size:.95em; }
        .modal-content input[type="text"],
        .modal-content input[type="url"],
        .modal-content input[type="password"],
        .modal-content input[type="number"],
        .modal-content select {
            width:100%; padding:11px 14px; display:block; border:1px solid #ccc;
            border-radius:4px; box-sizing:border-box; font-size:1em;
            transition:border-color .2s; text-align:left;
        }
        .modal-content input:focus, .modal-content select:focus, .modal-content textarea:focus {
            border-color:var(--main-color,#4CAF50); outline:none;
        }
        .modal-content textarea {
            width:100%; padding:11px 14px; display:block; border:1px solid #ccc;
            border-radius:4px; box-sizing:border-box; font-size:.95em;
            font-family:inherit; line-height:1.4; resize:vertical; min-height:80px;
            transition:border-color .2s;
        }
        .modal-content textarea.css-textarea {
            font-family:Consolas,"Courier New",monospace; font-size:.85em;
            line-height:1.5; min-height:130px; tab-size:2;
        }
        .modal-content p { font-size:.88em; color:#666; line-height:1.5; margin-top:8px; }
        .modal-content a { color:var(--main-color,#4CAF50); text-decoration:none; }
        .modal-content a:hover { text-decoration:underline; }

        /* ---- tick boxes ---- */
        .toggle-row {
            display:flex; align-items:flex-start; gap:10px;
            padding:9px 10px; border-radius:4px; cursor:pointer;
            transition:background .15s; margin-bottom:4px;
        }
        .toggle-row:hover { background:#f6f7f8; }
        .toggle-row input[type="checkbox"] {
            width:17px; height:17px; min-width:17px; margin:2px 0 0 0;
            cursor:pointer; accent-color:var(--main-color,#4CAF50);
        }
        .toggle-row .toggle-text { font-size:.93em; color:#333; line-height:1.35; }
        .toggle-row .toggle-text small { display:block; color:#888; font-size:.85em; margin-top:2px; }

        /* ---- buttons ---- */
        .modal-content button {
            padding:10px 18px; cursor:pointer; border:none; border-radius:4px;
            font-size:.95em; font-weight:500; margin-top:5px;
            background-color:var(--main-color,#4CAF50); color:var(--main-btn-icons,#fff);
            transition:background-color .2s, box-shadow .2s, opacity .2s;
        }
        .modal-content button:hover { opacity:.88; box-shadow:0 2px 5px rgba(0,0,0,.15); }
        .update-button, .danger-btn, .default-server-btn, .full-width-btn {
            display:block !important; width:100% !important; padding:12px 18px !important;
            font-weight:700 !important; font-size:1em !important;
            margin:15px 0 5px 0 !important; text-align:center !important;
            background-color:var(--main-color,#4CAF50) !important;
            color:var(--main-btn-icons,#fff) !important; border:none !important; border-radius:4px !important;
        }
        .update-button:hover, .danger-btn:hover, .default-server-btn:hover, .full-width-btn:hover {
            background-color:var(--hover-color,#286090) !important;
        }
        .preset-buttons, .export-buttons { display:flex; flex-wrap:wrap; gap:6px; margin:6px 0; }
        .preset-btn {
            padding:5px 9px; font-size:.75em; white-space:nowrap; margin-top:0;
            background-color:var(--main-color,#4CAF50) !important;
            color:var(--main-btn-icons,#fff) !important; border:none !important;
            border-radius:3px; cursor:pointer; font-weight:500;
        }
        .preset-btn:hover { background-color:var(--hover-color,#286090) !important; }

        /* ---- password ---- */
        .password-input-container { position:relative; display:block; width:100%; }
        .password-input-container input {
            width:100%; padding:11px 45px 11px 14px; font-family:monospace;
            font-size:.95em; letter-spacing:.5px; box-sizing:border-box;
        }
        .toggle-password {
            position:absolute; right:8px; top:50%; transform:translateY(-50%);
            background:none !important; border:none !important; cursor:pointer;
            padding:6px; font-size:18px; color:#666 !important; margin:0 !important;
            box-shadow:none !important; width:auto !important; z-index:1;
        }
        .toggle-password:hover { color:var(--main-color,#4CAF50) !important; box-shadow:none !important; opacity:1 !important; }
        .eye-icon {
            display:inline-block; width:20px; height:20px; background:currentColor;
            mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -5 24 24'%3E%3Cpath d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/%3E%3C/svg%3E") no-repeat center;
            mask-size:contain;
        }

        /* ---- misc ---- */
        .warning-message {
            color:#856404; background-color:#fff3cd; border-left:5px solid #ffc107;
            padding:14px 18px; margin:20px 0 0 0; border-radius:4px; font-size:.9em;
        }
        .warning-message strong { display:block; margin-bottom:5px; font-weight:600; }
        .warning-message p { margin:0; color:inherit; font-size:1em; }
        .path-info-list { font-size:.88em; color:#666; line-height:1.6; margin:8px 0 0 0; padding-left:22px; }
        .path-info-list li { margin-bottom:6px; }
        .path-info-list code, .modal-content code { background:#eef; padding:1px 5px; border-radius:3px; font-size:.95em; }
        .danger-zone-text { font-size:.85em; color:#777; margin:8px 0 0 0; }
        .import-dropzone {
            display:block; border:2px dashed #ccc; border-radius:6px; padding:24px 15px;
            text-align:center; cursor:pointer; background:#fafbfc; margin-top:5px; transition:all .2s;
        }
        .import-dropzone:hover, .import-dropzone.dragover { border-color:var(--main-color,#4CAF50); background:#f0faf0; }
        .import-dropzone p { margin:4px 0; color:#666; font-size:.9em; text-align:center; }
        .confirm-modal-content h3 { color:#c0392b; }
        .confirm-modal-content ul { color:#555; line-height:1.7; padding-left:22px; }
        .confirm-modal-content .button-group { display:flex; gap:10px; justify-content:flex-end; margin-top:18px; }
        .confirm-modal-content .button-group button.cancel-btn { background:#e0e0e0 !important; color:#333 !important; }
        .confirm-modal-content .button-group button.confirm-btn { background:#c0392b !important; color:#fff !important; font-weight:700; }
        .confirm-modal-content { max-height:calc(100vh - 48px); overflow-y:auto; }
    `;
    document.head.appendChild(styleElement);

    // ---------- helpers for building sections ----------
    const openMap = {
        appearance: settingsSectionIsOpen('appearance', true),
        ai:         settingsSectionIsOpen('ai', false),
        notebook:   settingsSectionIsOpen('notebook', false),
        file:       settingsSectionIsOpen('file', false)
    };
    const sec = (name, title, inner) => `
        <div class="settings-section ${openMap[name] ? 'open' : ''}" id="section-${name}">
            <button type="button" class="settings-section-header"
                    aria-expanded="${openMap[name] ? 'true' : 'false'}"
                    onclick="toggleSettingsSection('${name}')">
                <span class="settings-caret">${openMap[name] ? '▾' : '▸'}</span>
                <span>${title}</span>
            </button>
            <div class="settings-section-body" id="body-${name}"
                 style="display:${openMap[name] ? 'block' : 'none'};">
                ${inner}
            </div>
        </div>`;

    const esc = (v) => escapeHtml(v == null ? '' : v);

    // ---------- section 1: APPEARANCE ----------
    const appearanceHtml = `
        <div class="settings-subtitle">Layout &amp; Cells</div>

        <label class="toggle-row">
            <input type="checkbox" id="fullWidthToggle" ${fullWidth ? 'checked' : ''}
                   onchange="setFullWidth(this.checked)">
            <span class="toggle-text">Full width layout
                <small>Expands the notebook body from 750&nbsp;px to 90% of the window width.</small>
            </span>
        </label>

        <label class="toggle-row">
            <input type="checkbox" id="hideEvalToggle" ${evalHidden ? 'checked' : ''}
                   onchange="setEvalButtonsHidden(this.checked)">
            <span class="toggle-text">Hide “▶ Run” buttons in code cells
                <small>Cells can still be executed with Shift+Enter or “Run All Cells”.</small>
            </span>
        </label>

        <label class="toggle-row">
            <input type="checkbox" id="hideInputToggle" ${inputHidden ? 'checked' : ''}
                   onchange="setCodeInputHidden(this.checked)">
            <span class="toggle-text">Hide code input (editors)
                <small>Hides the code editors of code cells; outputs stay visible.</small>
            </span>
        </label>

        <div class="settings-subtitle">Theme</div>

        <div class="input-group">
            <label for="cssThemeSelect">Theme preset:</label>
            <select id="cssThemeSelect" onchange="applyCssThemePreset(); applyCustomCSS(document.getElementById('customCssInput').value);"></select>
        </div>

        <div class="input-group">
            <label for="customCssInput">Custom stylesheet (optional):</label>
            <textarea id="customCssInput" class="css-textarea" rows="7"
                placeholder="body { background: #f0f0f0; }&#10;.nb-code-cell { border: 2px solid #ccc; }&#10;:root { --main-color: #e91e63; }">${esc(currentCustomCSS)}</textarea>
            <p>Injected into the page and applied immediately. Selecting a preset overwrites the
               text area; editing the text area switches the preset to “— Custom —”.
               The stylesheet is stored with the notebook when you save it.</p>
            <button class="update-button" onclick="updateAiSettings()">Apply &amp; Save Appearance</button>
        </div>`;

    // ---------- section 2: AI SETTINGS ----------
    const aiHtml = `
        <div class="input-group">
            <label for="apiUrlInput">API URL:</label>
            <input type="url" id="apiUrlInput" value="${esc(currentApiUrl)}"
                   placeholder="https://api.example.com/v1/chat/completions">
            <select id="providerSelect" onchange="if(this.value) setApiPreset(this.value)" style="margin-top:8px;">
				<option value="">— Select a provider to autofill URL —</option>
                <option value="openrouter">OpenRouter</option>
                <option value="openai">OpenAI</option>
                <option value="mistral">Mistral</option>
                <option value="poe">Poe</option>
                <option value="moonshotai">Moonshot AI</option>
                <option value="qwencloud">Qwen Cloud</option>
                <option value="deepseek">DeepSeek</option>
            </select>
            <p>Enter the API endpoint URL for your AI service.</p>
        </div>

        <div class="input-group">
            <label for="modelInput">Model name:</label>
            <input type="text" id="modelInput" value="${esc(currentModel)}"
                   placeholder="e.g., mistral-small-latest, gpt-4o, claude-3-sonnet">
            <p>Enter the exact model name as required by your API provider.</p>
        </div>

        <div class="input-group">
            <label for="languageInput">Response language:</label>
            <input type="text" id="languageInput" value="${esc(currentLanguage)}"
                   placeholder="e.g., English, Slovak, Spanish">
        </div>

        <div class="input-group">
            <label for="newKey">API key:</label>
            <div class="password-input-container">
                <input type="password" id="newKey" value="${esc(currentApiKey)}" placeholder="Enter your API key">
                <button type="button" class="toggle-password" onclick="togglePasswordVisibility()"
                        aria-label="Toggle password visibility">
                    <span id="toggleIcon" class="eye-icon"></span>
                </button>
            </div>
        </div>

        <div class="input-group">
            <label for="customContextInput">Custom context (optional):</label>
            <textarea id="customContextInput" rows="4"
                placeholder="Enter additional context or instructions for the AI...">${esc(currentCustomContext)}</textarea>
            <p>This context is included with every AI request. Use it for domain knowledge or style rules.</p>
            <button class="update-button" onclick="updateAiSettings()">Update AI Settings</button>
        </div>

        <p>For more details, see the
           <a title="AI assistant documentation"
              href="https://github.com/JupyterPER/SageMathAINotebooks/blob/main/docs/AI_assistant.md"
              target="_blank">AI assistant documentation</a>.</p>

        <div class="warning-message">
            <strong>⚠️ Security warning</strong>
            <p>The API key is stored inside this notebook file.</p>
            <p>Remove your API key before sharing the notebook, and never publish it.</p>
        </div>`;

    // ---------- section 3: NOTEBOOK SETTINGS ----------
    const notebookHtml = `
        <div class="settings-subtitle">Edit History</div>

        <label class="toggle-row">
            <input type="checkbox" id="showHistoryPanelToggle" ${historyShown ? 'checked' : ''}
                   onchange="setHistoryPanelVisible(this.checked)">
            <span class="toggle-text">Show edit-history panel
                <small>Docks a log of cell operations in the bottom-right corner.
                       Undo / Redo (Ctrl+Z / Ctrl+Shift+Z) work regardless of this setting.</small>
            </span>
        </label>

        <div class="settings-subtitle">Execution</div>

        <div class="input-group">
            <label for="runDelayInput">Delay between cell executions (milliseconds):</label>
            <input type="number" id="runDelayInput" min="100" step="100"
                   value="${currentRunDelay}" placeholder="900">
            <p>Used by “Run All Cells” and “Run all cells from beginning to this cell”.
               Increase this value if SageCell needs more time to initialize.</p>
            <button class="update-button" onclick="updateAiSettings()">Update Execution Settings</button>
        </div>

        <div class="settings-subtitle">SageCell Server</div>

        <div class="input-group">
            <label for="sagecellUrlInput">SageCell server URL:</label>
            <input type="url" id="sagecellUrlInput" value="${esc(currentSagecellUrl)}"
                   placeholder="https://sagecell.sagemath.org/">
            <button type="button" class="default-server-btn"
                onclick="document.getElementById('sagecellUrlInput').value='https://sagecell.sagemath.org/'">
                Default Server (sagecell.sagemath.org)
            </button>
            <p>Base URL of the SageCell server used for computation. It takes effect only after the
               notebook is saved and reopened.</p>
            <button type="button" class="update-button" onclick="updateSagecellService()">
                Update SageCell Server
            </button>
        </div>`;

    // ---------- section 4: SETTINGS FILE ----------
    const fileHtml = `
        <div class="input-group">
            <label for="settingsPathInput">Settings file path / name:</label>
            <input type="text" id="settingsPathInput" value="${esc(currentSettingsPath)}" placeholder="settings.js">
            <ul class="path-info-list">
                <li><strong>Default:</strong> <code>settings.js</code> — loaded relative to the saved HTML file.</li>
                <li><strong>Relative path:</strong> <code>./config/settings.js</code></li>
                <li><strong>Local file:</strong> <code>file:///C:/Users/Me/settings.js</code> or <code>file:///home/me/settings.js</code></li>
                <li><strong>Remote URL:</strong> <code>https://example.com/settings.js</code></li>
                <li><strong>PRELOAD cells:</strong> code cells marked with <code># PRELOAD</code> are exported and
                    re-inserted on import if missing.</li>
                <li><strong>Browser limitation:</strong> only the filename is used by the download dialog.</li>
            </ul>
        </div>

        <div class="input-group">
            <label>Export current settings:</label>
            <div class="export-buttons">
                <button type="button" class="preset-btn" onclick="exportSettingsAsJs()"><strong>Download .js</strong></button>
                <button type="button" class="preset-btn" onclick="exportSettingsAsJson()"><strong>Download .json</strong></button>
                <button type="button" class="preset-btn" onclick="exportSettingsAsZip()"><strong>Download .zip</strong></button>
            </div>
            <p>⚠️ Browsers may flag downloaded <code>.js</code> files as potentially harmful (false
               positive). Prefer the <strong>.zip</strong> option if that becomes annoying.</p>
        </div>

        <div class="input-group">
            <div id="importDropzone" class="import-dropzone">
                <div style="font-size:2em;">📥</div>
                <p><strong>Import settings:</strong> click to browse or drag &amp; drop a
                   <code>.js</code>, <code>.json</code> or <code>.zip</code> file here</p>
                <input type="file" id="importFileInput"
                       accept=".js,.json,.zip,application/javascript,application/json,application/zip"
                       style="display:none;">
            </div>
        </div>

        <div class="input-group">
            <label>Reset everything:</label>
            <p class="danger-zone-text">Resets API key, URL, model, language, custom context, theme,
               preload code and all appearance toggles. SageCell URL is restored to the default.</p>
            <button type="button" class="danger-btn" onclick="confirmClearSettings()">Clear All Settings</button>
        </div>`;

    // ---------- assemble ----------
    const modalDiv = document.createElement('div');
    modalDiv.id = 'apiKeyModal';
    modalDiv.className = 'modal';
    modalDiv.innerHTML = `
    <div class="modal-content">
        <span class="close" onclick="removeExistingModal()">&times;</span>
        <div class="modal-header">
            <h3 class="modal-main-title">Settings</h3>
        </div>
        <div class="modal-body" id="settingsScrollArea">
            ${sec('appearance', 'Appearance',        appearanceHtml)}
            ${sec('ai',         'AI Settings',       aiHtml)}
            ${sec('notebook',   'Notebook Settings', notebookHtml)}
            ${sec('file',       'Settings Export / Import / Clear', fileHtml)}
        </div>
    </div>`;

    document.body.appendChild(modalDiv);
    document.body.classList.add('settings-modal-open');

    document.body.appendChild(modalDiv);

    modalDiv.addEventListener('click', (event) => {
        if (event.target === modalDiv) removeExistingModal();
    });

    window.__settingsEscHandler = function (event) {
        if (event.key === 'Escape') removeExistingModal();
    };
    document.addEventListener('keydown', window.__settingsEscHandler);

    populateCssThemeDropdown();
    setupImportDropzone();

    // Live CSS preview + preset/custom sync
    const cssInput = document.getElementById('customCssInput');
    if (cssInput) {
        cssInput.addEventListener('input', function () {
            const select = document.getElementById('cssThemeSelect');
            if (select) {
                const matched = findMatchingTheme(this.value);
                select.value = matched || '__custom__';
            }
            applyCustomCSS(this.value);
        });
    }
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

    // ---- Notebook execution delay ----
    const delayInput = document.getElementById('runDelayInput');

    if (delayInput) {
        const parsedDelay = parseInt(delayInput.value, 10);

        // Must be a positive integer. Use 900 ms if invalid.
        RUN_DELAY = Number.isFinite(parsedDelay) && parsedDelay > 0
            ? parsedDelay
            : 900;

        // Show the final validated value in the modal.
        delayInput.value = RUN_DELAY;
    }

    // Persist settings file path
    const pathInput = document.getElementById('settingsPathInput');
    if (pathInput) {
        SETTINGS_PATH_NAME = pathInput.value.trim() || 'settings.js';
    }

    // SageCell URL with trailing slash validation
    let sagecellUrl = document.getElementById('sagecellUrlInput').value.trim();
    if (sagecellUrl && !sagecellUrl.endsWith('/')) {
        sagecellUrl += '/';
        document.getElementById('sagecellUrlInput').value = sagecellUrl;
    }
    SAGECELL_URL = sagecellUrl || 'https://sagecell.sagemath.org/';

    // Custom CSS
    const customCssValue = document.getElementById('customCssInput')
        ? document.getElementById('customCssInput').value
        : '';

    applyCustomCSS(customCssValue);

    // Update global variables
    API_KEY = newKey;
    API_URL = newApiUrl;
    CURRENT_MODEL = selectedModel;
    CURRENT_LANGUAGE = selectedLanguage;
    CUSTOM_CONTEXT = customContext;

    console.log(
        `Updated! API URL: ${API_URL}, ` +
        `Model: ${CURRENT_MODEL}, ` +
        `API Key: ${API_KEY ? '******' : 'Not Set'}, ` +
        `Language: ${CURRENT_LANGUAGE}, ` +
        `Run delay: ${RUN_DELAY} ms, ` +
        `SageCell: ${SAGECELL_URL}, ` +
        `Custom CSS: ${CUSTOM_CSS ? CUSTOM_CSS.length + ' chars' : 'None'}`
    );

    // Refresh control bars to reflect potential API key changes
    removeAllControlBars();
    initializeCells();

    alert("Settings updated successfully!");
}

function setApiPreset(provider) {
    const apiUrlInput = document.getElementById('apiUrlInput');
    const modelInput = document.getElementById('modelInput');

    const presets = {
        openrouter: {
            url: 'https://openrouter.ai/api/v1/chat/completions',
            model: 'minimax/minimax-m3:free' 
        },
        
        openai: {
            url: 'https://api.openai.com/v1/chat/completions',
            model: 'gpt-5.6-terra' 
        },
        mistral: {
            url: 'https://api.mistral.ai/v1/chat/completions',
            model: 'mistral-medium-latest'
        },
        poe: {
            url: 'https://api.poe.com/v1/chat/completions',
            model: 'Qwen3.7-Plus'
        },
        // anthropic: {
        //     url: 'https://api.anthropic.com/v1/messages',
        //     model: 'claude-3-sonnet-20240229'
        // },
        // groq: {
        //     url: 'https://api.groq.com/openai/v1/chat/completions',
        //     model: 'openai/gpt-oss-120b' 
        // },
        // github: {
        //     url: 'https://models.github.ai/inference/chat/completions',
        //     model: 'openai/gpt-5-mini' 
        // },
        deepseek: {
            url: 'https://api.deepseek.com/v1/chat/completions',
            model: 'deepseek-v4-flash'
        },
        moonshotai: {
            url: 'https://api.moonshot.ai/v1/chat/completions',
            model: 'kimi-k2.5'
        },
        qwencloud: {
            url: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions',
            model: 'qwen3.7-plus'
        },
        // cerebras: {
        //     url: 'https://api.cerebras.ai/v1/chat/completions',
        //     model: 'gpt-oss-120b'
        // },
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

    prompt += "FOCUS code cell:\n" + sanitizeIns(userCode) + "\n\n";

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
    const loadingCell = addMarkdownCell(cell, "below", '<div class="AIstatus">AI agent is working </div>');

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
    // 1. Decompress any minified lines so the AI sees real code, not base64.
    let sanitized = decompressMinifiedLines(text);

    // 2. Sanitize long data blocks.
    sanitized = sanitizeLongDataRawByLines(sanitized);

    // 3. Replace AI cell contents.
    const pattern = /# -START OF AI CELL-[\s\S]*?# -END OF AI CELL-/g;
    sanitized = sanitized.replace(pattern, "#");

    return sanitized;
}

// Walk the text line by line. Any line that is a standalone minified blob
// gets decoded back to source. Multiple consecutive minified lines are
// rejoined with the "# CODE BLOCK" delimiter so the AI sees the original
// structure. Non-minified lines are left untouched.
function decompressMinifiedLines(text) {
    const lines = text.split('\n');
    const out = [];
    let pendingDecoded = [];

    const flushPending = () => {
        if (pendingDecoded.length === 0) return;
        out.push(pendingDecoded.join('\n\n# CODE BLOCK\n\n'));
        pendingDecoded = [];
    };

    for (const line of lines) {
        const trimmed = line.trim().replace(/[\u200B\u200C\u200D\uFEFF]/g, '');
        // Re-test on cleaned trimmed string, but only treat as minified if the
        // original (post-cleanup) line contains nothing else.
        const cleanedFull = line.replace(/[\u200B\u200C\u200D\uFEFF]/g, '').trim();

        if (cleanedFull !== '' && MINIFIED_LINE_REGEX.test(cleanedFull)) {
            const decoded = decodeBase64Line(cleanedFull);
            if (decoded !== null) {
                pendingDecoded.push(decoded);
                continue;
            }
            // Decode failed — fall through and keep the original line.
        }

        flushPending();
        out.push(line);
    }
    flushPending();

    return out.join('\n');
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
    var loadingCell = addMarkdownCell(cell, "below", '<div class="AIstatus">AI agent is processing your image </div>');

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

// ============================================================
// EXPORT / IMPORT / CLEAR SETTINGS
// ============================================================

// ---- Lazy-load fflate (lightweight, supports both zip & unzip) ----
let _fflatePromise = null;
function loadFflate() {
    if (window.fflate) return Promise.resolve(window.fflate);
    if (_fflatePromise) return _fflatePromise;
    _fflatePromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/fflate@0.8.2/umd/index.js';
        script.onload  = () => window.fflate ? resolve(window.fflate)
                                             : reject(new Error('fflate failed to attach'));
        script.onerror = () => reject(new Error('Failed to load fflate from CDN'));
        document.head.appendChild(script);
    });
    return _fflatePromise;
}

// ---- Collect every value we want to persist ----
function getCurrentSettings() {
    let preload = '';
    if (typeof buildPreloadString === 'function') {
        try { preload = buildPreloadString() || ''; } catch (e) { preload = ''; }
    }
    if (!preload && typeof PRELOAD !== 'undefined') preload = PRELOAD || '';

    // Make sure the latest value from the input is captured before exporting.
    if (document.getElementById('settingsPathInput')) persistSettingsPath();

    return {
        toggleEvalBtnsState: typeof toggleEvalBtnsState !== 'undefined' ? !!toggleEvalBtnsState : false,
        isFullWidthState:    typeof isFullWidthState    !== 'undefined' ? !!isFullWidthState    : false,
        hideCodeInputState:  !!window.hideCodeInputState, 
        API_KEY:             typeof API_KEY             !== 'undefined' ? API_KEY             : '',
        API_URL:             typeof API_URL             !== 'undefined' ? API_URL             : '',
        CURRENT_MODEL:       typeof CURRENT_MODEL       !== 'undefined' ? CURRENT_MODEL       : '',
        CURRENT_LANGUAGE:    typeof CURRENT_LANGUAGE    !== 'undefined' ? CURRENT_LANGUAGE    : '',
        SAGECELL_URL:        typeof SAGECELL_URL        !== 'undefined' ? SAGECELL_URL        : 'https://sagecell.sagemath.org/',
        PRELOAD:             preload,
        CUSTOM_CONTEXT:      typeof CUSTOM_CONTEXT      !== 'undefined' ? CUSTOM_CONTEXT      : '',
        CUSTOM_CSS:          typeof CUSTOM_CSS          !== 'undefined' ? CUSTOM_CSS          : '',
        SETTINGS_PATH_NAME:  typeof SETTINGS_PATH_NAME  !== 'undefined' ? SETTINGS_PATH_NAME  : 'settings.js',
        aiEduMode:           typeof aiEduMode           !== "undefined" ? aiEduMode : false,
        aiCompleteMode:      typeof aiCompleteMode      !== "undefined" ? aiCompleteMode : true,
        aiLogs:              typeof aiLogs              !== "undefined" ? aiLogs : false,
    };
}

// ---- Build settings.js text from a settings object ----
function buildSettingsJs(s) {
    const tpl = (v) => '`' + String(v ?? '').replace(/\\/g, '\\\\')
                                            .replace(/`/g, '\\`')
                                            .replace(/\$\{/g, '\\${') + '`';

    return `// Overrides settings with new values
toggleEvalBtnsState = ${!!s.toggleEvalBtnsState};
isFullWidthState    = ${!!s.isFullWidthState};
window.hideCodeInputState = ${!!s.hideCodeInputState};
API_KEY            = ${JSON.stringify(s.API_KEY || '')};
API_URL            = ${JSON.stringify(s.API_URL || '')};
CURRENT_MODEL      = ${JSON.stringify(s.CURRENT_MODEL || '')};
CURRENT_LANGUAGE   = ${JSON.stringify(s.CURRENT_LANGUAGE || '')};
SAGECELL_URL       = ${JSON.stringify(s.SAGECELL_URL || 'https://sagecell.sagemath.org/')};
SETTINGS_PATH_NAME = ${JSON.stringify(s.SETTINGS_PATH_NAME || 'settings.js')};
PRELOAD            = ${tpl(s.PRELOAD)};
CUSTOM_CONTEXT     = ${JSON.stringify(s.CUSTOM_CONTEXT || '')};
CUSTOM_CSS         = ${tpl(s.CUSTOM_CSS)};

aiEduMode          = ${typeof s.aiEduMode !== "undefined" ? JSON.stringify(!!s.aiEduMode) : "false"}; // change to reveal/hide AI Educate button
aiCompleteMode     = ${typeof s.aiCompleteMode !== "undefined" ? JSON.stringify(!!s.aiCompleteMode) : "true"}; // change to reveal/hide AI Complete button
aiLogs             = ${typeof s.aiLogs !== "undefined" ? JSON.stringify(!!s.aiLogs) : "false"}; // change to enable/disable AI logs

// Apply custom CSS if provided
if (typeof CUSTOM_CSS !== 'undefined' && CUSTOM_CSS && typeof applyCustomCSS === 'function') {
    applyCustomCSS(CUSTOM_CSS);
}

// Restore UI with new settings
if (typeof restoreUIState   === 'function') restoreUIState();
if (typeof applyPreloadCells === 'function') applyPreloadCells();
`;
}

// ---- Generic blob download helper ----
function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// ---- Derive a clean filename from the user-supplied path field ----

// Read the path field, persist it to the global, and return the cleaned value.
function persistSettingsPath() {
    const input = document.getElementById('settingsPathInput');
    let raw = (input ? input.value : (typeof SETTINGS_PATH_NAME !== 'undefined' ? SETTINGS_PATH_NAME : 'settings.js')).trim();
    if (!raw) raw = 'settings.js';
    SETTINGS_PATH_NAME = raw;
    return raw;
}

// Derive a download-safe basename from whatever the user typed.
function getSettingsBasename() {
    let p = persistSettingsPath();
    p = p.replace(/^file:\/\//i, '').replace(/^https?:\/\/[^/]+\//i, '');
    let name = p.split(/[\\/]/).pop() || 'settings';
    name = name.replace(/\.(js|json|zip)$/i, '');
    return name || 'settings';
}

// ---- Export functions ----
function exportSettingsAsJs() {
    const blob = new Blob([buildSettingsJs(getCurrentSettings())],
                          { type: 'application/javascript' });
    downloadBlob(blob, getSettingsBasename() + '.js');
}

function exportSettingsAsJson() {
    const blob = new Blob([JSON.stringify(getCurrentSettings(), null, 2)],
                          { type: 'application/json' });
    downloadBlob(blob, getSettingsBasename() + '.json');
}

async function exportSettingsAsZip() {
    try {
        const fflate = await loadFflate();
        const s = getCurrentSettings();
        const base = getSettingsBasename();
        const files = {};
        files[base + '.js']   = fflate.strToU8(buildSettingsJs(s));
        files[base + '.json'] = fflate.strToU8(JSON.stringify(s, null, 2));

        fflate.zip(files, { level: 6 }, (err, data) => {
            if (err) { alert('Failed to create ZIP: ' + err.message); return; }
            downloadBlob(new Blob([data], { type: 'application/zip' }), base + '.zip');
        });
    } catch (e) {
        alert('Could not load ZIP library: ' + e.message);
    }
}

// ---- Apply a parsed settings object to globals + UI ----
function applyImportedSettings(s) {
    if (s == null || typeof s !== 'object') {
        throw new Error('Imported data is not a valid settings object.');
    }
    if ('toggleEvalBtnsState' in s) toggleEvalBtnsState = !!s.toggleEvalBtnsState;
    if ('isFullWidthState'    in s) isFullWidthState    = !!s.isFullWidthState;
    if ('API_KEY'             in s) API_KEY            = s.API_KEY            || '';
    if ('API_URL'             in s) API_URL            = s.API_URL            || '';
    if ('CURRENT_MODEL'       in s) CURRENT_MODEL      = s.CURRENT_MODEL      || '';
    if ('CURRENT_LANGUAGE'    in s) CURRENT_LANGUAGE   = s.CURRENT_LANGUAGE   || '';
    if ('SAGECELL_URL'        in s) SAGECELL_URL       = s.SAGECELL_URL       || 'https://sagecell.sagemath.org/';
    if ('SETTINGS_PATH_NAME'  in s) SETTINGS_PATH_NAME = s.SETTINGS_PATH_NAME || 'settings.js';
    if ('PRELOAD'             in s) PRELOAD            = s.PRELOAD            || '';
    if ('CUSTOM_CONTEXT'      in s) CUSTOM_CONTEXT     = s.CUSTOM_CONTEXT     || '';
    if ('CUSTOM_CSS'          in s) CUSTOM_CSS         = s.CUSTOM_CSS         || '';
    if ('hideCodeInputState' in s) window.hideCodeInputState = !!s.hideCodeInputState;

    if (typeof CUSTOM_CSS !== 'undefined' && typeof applyCustomCSS === 'function') {
        applyCustomCSS(CUSTOM_CSS || '');
    }
    if (typeof restoreUIState   === 'function') restoreUIState();
    if (typeof applyPreloadCells === 'function') applyPreloadCells();
}

// ---- Read a text file as string ----
function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload  = () => resolve(r.result);
        r.onerror = () => reject(r.error || new Error('File read error'));
        r.readAsText(file);
    });
}

// ---- Handle a dropped or picked file ----
async function handleImportFile(file) {
    if (!file) return;
    const name = (file.name || '').toLowerCase();
    try {
        if (name.endsWith('.json')) {
            const text = await readFileAsText(file);
            const obj  = JSON.parse(text);
            applyImportedSettings(obj);
            afterImportSuccess('JSON');

        } else if (name.endsWith('.js')) {
            const text = await readFileAsText(file);
            // Indirect eval runs in global scope, so bare assignments like
            //   API_KEY = "..."  become global, matching the file's design.
            (0, eval)(text);
            // Re-apply UI hooks in case the script didn't call them itself
            if (typeof CUSTOM_CSS !== 'undefined' && typeof applyCustomCSS === 'function') {
                applyCustomCSS(CUSTOM_CSS || '');
            }
            if (typeof restoreUIState   === 'function') restoreUIState();
            if (typeof applyPreloadCells === 'function') applyPreloadCells();
            afterImportSuccess('JS');

        } else if (name.endsWith('.zip')) {
            const fflate = await loadFflate();
            const buf = new Uint8Array(await file.arrayBuffer());
            fflate.unzip(buf, (err, entries) => {
                if (err) { alert('Failed to extract ZIP: ' + err.message); return; }
                const keys = Object.keys(entries);
                const jsonKey = keys.find(k => k.toLowerCase().endsWith('.json'));
                const jsKey   = keys.find(k => k.toLowerCase().endsWith('.js'));
                try {
                    if (jsonKey) {
                        const obj = JSON.parse(fflate.strFromU8(entries[jsonKey]));
                        applyImportedSettings(obj);
                    } else if (jsKey) {
                        const code = fflate.strFromU8(entries[jsKey]);
                        (0, eval)(code);
                        if (typeof CUSTOM_CSS !== 'undefined' && typeof applyCustomCSS === 'function') {
                            applyCustomCSS(CUSTOM_CSS || '');
                        }
                        if (typeof restoreUIState   === 'function') restoreUIState();
                        if (typeof applyPreloadCells === 'function') applyPreloadCells();
                    } else {
                        alert('ZIP does not contain a .json or .js settings file.');
                        return;
                    }
                    afterImportSuccess('ZIP');
                } catch (e) {
                    alert('Failed to apply settings from ZIP: ' + e.message);
                }
            });
        } else {
            alert('Unsupported file type. Please use .js, .json, or .zip.');
        }
    } catch (e) {
        console.error(e);
        alert('Failed to import settings: ' + e.message);
    }
}

function afterImportSuccess(kind) {
    // Refresh control bars (API key may have changed)
    if (typeof removeAllControlBars === 'function') removeAllControlBars();
    if (typeof initializeCells       === 'function') initializeCells();
    // Re-open the modal so the user sees the new values
    if (typeof createAiSettingsModal === 'function') {
        createAiSettingsModal();
    }
    alert('Settings imported successfully (' + kind + ').');
}

// ---- Setup drop-zone + file picker (called from createAiSettingsModal) ----
function setupImportDropzone() {
    const dropzone  = document.getElementById('importDropzone');
    const fileInput = document.getElementById('importFileInput');
    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            handleImportFile(e.target.files[0]);
            fileInput.value = '';
        }
    });

    ['dragenter', 'dragover'].forEach(evt =>
        dropzone.addEventListener(evt, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add('dragover');
        })
    );
    ['dragleave', 'dragend'].forEach(evt =>
        dropzone.addEventListener(evt, (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
        })
    );
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImportFile(e.dataTransfer.files[0]);
        }
    });
}

// ---- CLEAR settings (with custom confirmation modal) ----
function confirmClearSettings() {
    const existing = document.getElementById('clearConfirmModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'clearConfirmModal';
    modal.className = 'modal';
    modal.style.zIndex = '10001';
    modal.innerHTML = `
        <div class="modal-content confirm-modal-content" style="max-width:480px;">
            <h3>⚠️ Clear All Settings?</h3>
            <p>You are about to <strong>permanently clear all settings</strong>, including:</p>
            <ul>
                <li>API Key, API URL, Model name, Language</li>
                <li>Custom Context and Custom CSS</li>
                <li>Preload code (PRELOAD)</li>
                <li>UI state (toggle eval buttons, full width)</li>
            </ul>
            <p>The SageCell URL will be reset to its default
               (<code>https://sagecell.sagemath.org/</code>).</p>
            <p style="color:#c0392b;"><strong>This action cannot be undone.</strong></p>
            <div class="button-group">
                <button class="cancel-btn"  type="button"
                        onclick="document.getElementById('clearConfirmModal').remove()">Cancel</button>
                <button class="confirm-btn" type="button"
                        onclick="performClearSettings()">Yes, clear everything</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function performClearSettings() {
    toggleEvalBtnsState = false;
    isFullWidthState    = false;
    API_KEY             = '';
    API_URL             = '';
    CURRENT_MODEL       = '';
    CURRENT_LANGUAGE    = '';
    SAGECELL_URL        = 'https://sagecell.sagemath.org/';
    PRELOAD             = '';
    CUSTOM_CONTEXT      = '';
    CUSTOM_CSS          = '';
    SETTINGS_PATH_NAME = 'settings.js';

    if (typeof applyCustomCSS    === 'function') applyCustomCSS('');
    if (typeof restoreUIState    === 'function') restoreUIState();
    if (typeof removeAllControlBars === 'function') removeAllControlBars();
    if (typeof initializeCells   === 'function') initializeCells();

    document.getElementById('clearConfirmModal')?.remove();

    if (typeof createAiSettingsModal === 'function') {
        createAiSettingsModal();   // re-render to show cleared values
    }
    window.hideCodeInputState = false;
    window.historyPanelVisible = false;
    if (typeof setHistoryPanelVisible === 'function') setHistoryPanelVisible(false);

    alert('All settings have been cleared.');
}

// v20 SageCell server update

function normalizeSagecellUrl(url) {
    url = (url || '').trim();

    if (!url) {
        return 'https://sagecell.sagemath.org/';
    }

    if (!url.endsWith('/')) {
        url += '/';
    }

    return url;
}

function updateSagecellService() {
    const input = document.getElementById('sagecellUrlInput');

    if (!input) {
        return;
    }

    const newSagecellUrl = normalizeSagecellUrl(input.value);

    // Show the normalized value in the input field.
    input.value = newSagecellUrl;

    // Store the value immediately, regardless of the user's choice below.
    SAGECELL_URL = newSagecellUrl;

    showSagecellSaveConfirmation(newSagecellUrl);
}

function showSagecellSaveConfirmation(newSagecellUrl) {
    // Prevent duplicate confirmation dialogs.
    document.getElementById('sagecellSaveConfirmModal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'sagecellSaveConfirmModal';
    modal.className = 'modal';
    modal.style.zIndex = '10001';

    modal.innerHTML = `
        <div class="modal-content confirm-modal-content" style="max-width:480px;">
            <h3>SageCell Server Updated</h3>

            <p>
                The new SageCell server will take effect only after the notebook
                is saved and reopened.
            </p>

            <p>
                New server:
                <br>
                <code>${escapeHtml(newSagecellUrl)}</code>
            </p>

            <p><strong>Would you like to save the notebook now?</strong></p>

            <div class="button-group" style="display:flex; gap:10px; justify-content:flex-end;">
                <button class="cancel-btn" type="button"
                        onclick="cancelSagecellSave()">
                    Cancel
                </button>

                <button class="confirm-btn" type="button"
                        onclick="confirmSagecellSave()">
                    OK, Save Now
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Clicking outside the dialog behaves like Cancel:
    // the URL remains stored, but the notebook is not saved.
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            cancelSagecellSave();
        }
    });
}

function confirmSagecellSave() {
    const input = document.getElementById('sagecellUrlInput');

    // Explicitly apply the current normalized value before saving.
    if (input) {
        SAGECELL_URL = normalizeSagecellUrl(input.value);
        input.value = SAGECELL_URL;
    }

    document.getElementById('sagecellSaveConfirmModal')?.remove();
    document.getElementById('apiKeyModal')?.remove();
    
    saveHtml();
}

function cancelSagecellSave() {
    // SAGECELL_URL was already stored by updateSagecellService().
    // Therefore Cancel deliberately does not revert it.
    document.getElementById('sagecellSaveConfirmModal')?.remove();
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}