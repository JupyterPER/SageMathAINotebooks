function getBrowserLanguage() {
    return (navigator.language || navigator.userLanguage).substring(0, 2)
}

function makeMenu() {
    var e = getBrowserLanguage();
    $("head").first().append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/JupyterPER/SageMathAINotebooks@main/css/nbplayer.css"'), $("body").first().append('<script src="custom.js"><\/script>');
    var t = "de" == e ? "Code ausblenden/einblenden" : "Show / Hide Code",
        n = "de" == e ? "Code-Zellen in der gegebenen Reihenfolge ausfĂĽhren!" : "Execute Cells in the Sequence Given!",
        a = "de" == e ? "Speichern" : "Save (Ctrl+S)",
        s = '<a href="#" role="button" id="read-button" class="btn btn-primary" onclick="setView()">' + ("de" == e ? 'Lesen' : 'Read') + '</a>',
        o = '<a href="#" role="button" id="execute-button" class="btn btn-primary" onclick="setExecute()">' + ('de' == e ? 'AusfĂĽhren' : 'Execute') + '</a>',
        l = '<div id="navbar">' + ('Exec' == playerConfig.panes ? "" : s + o) + '<a href="#" role="button" class="btn btn-primary" onclick="toggleInput()" title="Hide/Show Code">' + iconDictionaryNavbar["showHideCode"] + '</a>\n  <a href="#" role="button" class="btn btn-primary" onclick="saveHtml()" title="Save (Ctrl+P)">' + iconDictionaryNavbar["saveNotebook"] + "</a>" + '\n  </div>';
    $("body").prepend(l), $("#main").addClass("belowMenu")
}

function scrollFunction() {
    var e = document.getElementById("navbar"),
        t = e.offsetTop;
    window.pageYOffset >= t ? e.classList.add("sticky") : e.classList.remove("sticky")
}

function saveHtml() {
    removeTableOfContents();
    // Simplify all markdown cells to basic HTML form before saving
    simplifyMarkdownCellsForSaving();

    removeAllControlBars();

    removeSageCellNumbering();

    saveAddSageCells(".nb-code-cell", ".sagecell_input,.sagecell_output");
    
    // Better handling of zero-width characters in scripts
    document.querySelectorAll('script').forEach(script => {
        if (script.innerHTML) {
            script.innerHTML = script.innerHTML.replace(/[\u200B\u200C\u200D\uFEFF]/g, '');
        }
    });

    const apikey = typeof API_KEY !== 'undefined' ? JSON.stringify(API_KEY) : JSON.stringify('');
    const currentmodel = typeof CURRENT_MODEL !== 'undefined' ? JSON.stringify(CURRENT_MODEL) : JSON.stringify('');
    const currentlanguage = typeof CURRENT_LANGUAGE !== 'undefined' ? JSON.stringify(CURRENT_LANGUAGE) : JSON.stringify('');
    const currentApiUrl = typeof API_URL !== 'undefined' ? JSON.stringify(API_URL) : JSON.stringify('');
    const currentCustomContext = typeof CUSTOM_CONTEXT !== 'undefined' ? JSON.stringify(CUSTOM_CONTEXT) : JSON.stringify('');
    const delayValue = document.getElementById('delay') ? parseInt(document.getElementById('delay').value) || RUN_DELAY : RUN_DELAY;

    const extractedName = extractFilenameBaseFromH1();
    const filenameBase = extractedName || playerConfig.name; // Use extracted name or fallback to default

    const htmlContent = "<!DOCTYPE html>\n<html>\n<head>" +
        '<meta charset="UTF-8">\n' +
        '<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n' +
        $("head").html() +
        '</head>\n<body>\n' +
        '<script src="https://cdn.jsdelivr.net/npm/texme@1.2.2"></script>\n' +
        '<div id="main">' + $("#main").html() + '</div>\n' +
        '<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW" crossorigin="anonymous"></script>\n' +
        '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>\n' +
        '<script src="https://sagecell.sagemath.org/embedded_sagecell.js"></script>\n' +
        '<script src="' + playerConfig.playerPath + '/vendor/js/FileSaver.min.js"></script>\n' +
        '<script src="' + playerConfig.playerPath + '/nbplayerConfig.js"></script>\n' +

        '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css">\n' +
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js"></script>\n' +
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/markdown/markdown.min.js"></script>\n' +
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/edit/closebrackets.min.js"></script>\n' +
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/edit/matchbrackets.min.js"></script>\n' +
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/fold/foldcode.min.js"></script>\n' +
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/fold/foldgutter.min.js"></script>\n' +
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/fold/markdown-fold.min.js"></script>\n' +
        '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/fold/foldgutter.min.css">\n' +

        '<script>let RUN_DELAY = '+ RUN_DELAY +';</script>\n' +
        '<script src="https://cdn.jsdelivr.net/gh/JupyterPER/SageMathAINotebooks@main/js/nbrunner9.js"></script>\n' +
        '<script src="https://cdn.jsdelivr.net/gh/JupyterPER/SageMathAINotebooks@main/js/nbaiengine.js"></script>\n' +
        '<script src="https://cdn.jsdelivr.net/gh/JupyterPER/SageMathAINotebooks@main/js/nbaipriming.js"></script>\n' +
        // '<script src="nbrunner8.js"></script>\n' +
        // '<script src="nbaiengine.js"></script>\n' +
        // '<script src="nbaipriming.js"></script>\n' +
        '<script src="https://cdn.jsdelivr.net/gh/JupyterPER/SageMathAINotebooks@main/js/nbautocompletion.js"></script>\n' +
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>\n' +
        '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/JupyterPER/SageMathAINotebooks@main/css/nbplayer.css">\n' +
        '<script>\n' +
        '  playerConfig=' + JSON.stringify(playerConfig) + ';\n' +
        '  playerMode=' + JSON.stringify(playerMode) + ';\n' +
        '  let API_KEY=' + apikey + ';\n' +
        '  let API_URL=' + currentApiUrl + ';\n' +
        '  let CURRENT_MODEL=' + currentmodel + ';\n' +
        '  let CURRENT_LANGUAGE=' + currentlanguage + ';\n' +
        '  makeMenu();\n' +
        '  localize();\n' +
        '  loadStatus();\n' +
        '  makeSageCells(playerConfig);\n' +
        '  launchPlayer();\n' +
        '  addControlPanel();\n' +
        '  setupRunAllCells();\n' +
        '  addSageCellNumbering();\n' +
        '  enhanceSageCellsWithGlobalAutocomplete();\n' +
        '  window.onload = initializeMarkdownCells;\n' +
        '  let CUSTOM_CONTEXT=' + currentCustomContext + ';\n' +
        '</script>\n' +
        '</body>\n</html>';
    
    // Create a Blob with explicitly specified UTF-8 encoding
    var e = new Blob([htmlContent], {
        type: "text/html;charset=utf-8"
    });
    
    // Use the FileSaver library to save with proper encoding
    saveAs(e, filenameBase + ".html");
    
    let t = "Do NOT use this page anymore - open your saved copy or reload this page.";
    if (getBrowserLanguage() == "de") {
        t = "Bitte die Seite neu laden oder die gespeicherte Kopie öffnen.";
    }
    $("#navbar").html('<div class="save-warning">' + t + "</div>");
}

function makeSageCells(e) {
    sagecell.makeSagecell({
        inputLocation: "div.compute",
        languages: [e.lang],
        evalButtonText: "de" == getBrowserLanguage() ? "AusfĂĽhren" : "Execute",
        linked: e.linked,
        autoeval: e.eval,
        hide: e.hide
    })
}

function saveAddSageCells(e, t) {
    $(e).each((function() {
        $(this).append("\n  <div class='compute'>\n    <script type='text/x-sage'>1+1<\/script>\n  </div>");
        let e = getSageInput($(this));
        e = e.replace(/\u200B/g, ""), $(this).find(".compute script").text(e), t && $(this).find(t).remove(), $(this).find(".compute").hide()
    }))
}


window.onscroll = function() {
    scrollFunction()
};
let playerConfig = {
        panes: "ExecRead",
        lang: "sage",
        linked: !0,
        eval: !1,
        hide: ["fullScreen"],
        execute: !0,
        showRead: !0,
        collapsable: !1,
        playerPath: playerPath
    },
    cellInput = ".nb-input",
    cellOutput = ".nb-output",
    codeCell = ".nb-code-cell";

function getSageInput(e) {
    let t = "";
    return e.find(".CodeMirror-line").each((function() {
        t += $(this).text() + "\n"
    })), t
}
let playerMode = {
    showSage: !1,
    showNotebookInput: !0,
    showSageInput: !0
};

function launchPlayer() {
    playerMode.showSage ? setExecute() : setView()
}

function setView() {
    $(".compute").hide(), playerMode.showNotebookInput && $(cellInput).show(), $(cellOutput).show(), playerMode.showSage = !1, $("#evalWarning").hide()
}



function setExecute() {
    $(cellInput).hide(), $(cellOutput).hide(), $(".compute").show(), playerMode.showSageInput || $(".compute .sagecell_input").hide(), playerMode.showSage = !0, $("#evalWarning").show()
}

function toggleInput() {
    playerMode.showSage ? ($(".compute .sagecell_input").toggle(), playerMode.showSageInput = !playerMode.showSageInput) : ($(cellInput).toggle(), playerMode.showNotebookInput = !playerMode.showNotebookInput)
}

function makeTransferData() {
    $(".nbdataIn,.nbdataOut").parents(".nb-cell").each((function() {
        let e = $(this);
        e.before('<div class="transferData"></div>');
        let t = e.prev(),
            n = e.next();
        e.appendTo(t), n.appendTo(t);
        if (t.find(".nbdataOut").length) {
            t.attr("id", "transferDataOut");
            getBrowserLanguage();
            if (t.append('<br/><p><input type="button" role="button" class="btn btn-primary status2Clipboard" onclick="status2ClipBoard()" value="Copy status to clipboard" /></p>'), t.append('<p><input type="button" role="button" class="btn btn-primary status2Storage" onclick="status2Storage()" value="Save status" /></p>'), t.find(".successor").length) {
                t.find("ul").children("a").remove(), t.append('<p id="contMsg">Continue reading:</p>'), t.append("<ul></ul>");
                let e = t.children().last();
                t.find(".successor").each((function() {
                    let t = $(this).find("a").first().attr("href");
                    t = t.replace("ipynb", "html"), $(this).find("a").attr("href", t), $(this).appendTo(e), $(this).append(' <input type="button" role="button" class="btn btn-primary openWithStatus" onclick="openWithStatus(\'' + t + '?status=true\')" value="Open with current status" />')
                }))
            }
        } else t.attr("id", "transferDataIn")
    }))
}
const copyToClipboard = e => {
    const t = document.createElement("textarea");
    t.value = e, t.setAttribute("readonly", ""), t.style.position = "absolute", t.style.left = "-9999px", document.body.appendChild(t);
    const n = document.getSelection().rangeCount > 0 && document.getSelection().getRangeAt(0);
    t.select(), document.execCommand("copy"), document.body.removeChild(t), n && (document.getSelection().removeAllRanges(), document.getSelection().addRange(n))
};

function getStatus() {
    return $("#transferDataOut .sagecell_stdout").first().text()
}

function openWithStatus(e) {
    let t = getStatus();
    if (t.length) localStorage.setItem("mtStatus", t), window.open(e, "_blank");
    else {
        let e = "";
        e = "de" == getBrowserLanguage() ? "Fehler: Die Statusberechnung wurde noch nicht ausgefĂĽhrt" : "Error: Status cell not yet executed", alert(e)
    }
}

function status2ClipBoard() {
    let e = getStatus(),
        t = getBrowserLanguage(),
        n = "";
    e.length ? (n = "de" == t ? "Status in die Zwischenablage kopiert" : "Status copied to clipboard", copyToClipboard(e), alert(n)) : (n = "de" == t ? "Fehler: Die Statusberechnung wurde noch nicht ausgefĂĽhrt" : "Error: Status cell not yet executed", alert(n))
}

function status2Storage() {
    let e = GetURLParameterWithDefault("status", !1);
    e && "true" != e.toString() || (e = "mtStatus"), "true" == e.toString() && (e = "mtStatus");
    let t = getStatus(),
        n = getBrowserLanguage(),
        a = "";
    t.length ? (localStorage.setItem(e, t), a = "de" == n ? "Status gespeichert" : "Status saved", alert(a)) : (a = "de" == n ? "Fehler: Die Statusberechnung wurde noch nicht ausgefĂĽhrt" : "Error: Status cell not yet executed", alert(a))
}

function GetURLParameterWithDefault(e, t) {
    for (var n = window.location.search.substring(1).split("&"), a = 0; a < n.length; a++) {
        var s = n[a].split("=");
        if (s[0] == e) return decodeURIComponent(s[1])
    }
    return t
}

function loadStatus() {
    let e = GetURLParameterWithDefault("status", !1);
    if (e) {
        "true" == e.toString() && (e = "mtStatus");
        let t = localStorage.getItem(e);
        t && $(".transferData").each((function() {
            let e = $(this);
            e.find(".nbdataIn").length && e.find(".nb-code-cell script").html(t + '\nprint("Status restored")')
        }))
    }
}

function localize() {
    let e = {
            ".status2Clipboard": {
                type: "value",
                de: "Status  in die Zwischenablage kopieren",
                en: "Copy status to clipboard"
            },
            ".loadStatus": {
                type: "value",
                de: "Status laden",
                en: "Load status"
            },
            ".status2Storage": {
                type: "value",
                de: "Status speichern",
                en: "Save status"
            },
            "#contMsg": {
                type: "html",
                de: "Weiterlesen:",
                en: "Continue reading:"
            },
            ".openWithStatus": {
                type: "value",
                de: "Mit aktuellem Status Ă¶ffnen",
                en: "Open with current status"
            }
        },
        t = getBrowserLanguage(),
        n = Object.keys(e);
    for (let a = 0; a < n.length; a++) {
        let s = n[a];
        e[s][t] && ("html" == e[s].type ? $(s).html(e[s][t]) : $(s).attr(e[s].type, e[s][t]))
    }
}


function setupRunAllCells() {
    function runAllCells() {
        const delay = parseInt(document.getElementById('delay').value) || 900;
        const executeButtons = document.querySelectorAll('.sagecell_evalButton.ui-button.ui-corner-all.ui-widget');

        // Filter out buttons from cells containing AI marker
        const validButtons = Array.from(executeButtons).filter(button => {
            const cell = button.closest('.nb-code-cell');
            if (!cell) return true; // If not in a code cell, include it

            // Check if the cell contains the AI marker
            const cmEditor = cell.querySelector('.CodeMirror');
            if (cmEditor && cmEditor.CodeMirror) {
                const code = cmEditor.CodeMirror.getValue();
                return !code.includes("# -START OF AI CELL-");
            }
            return true; // If can't check content, include it
        });

        validButtons.forEach((button, index) => {
            setTimeout(() => {
                button.click();
            }, delay * (index + 1));
        });
    }

    document.getElementById('runAllCellsButton').addEventListener('click', runAllCells);
}

function runCellsUpTo(targetCell) {
    // Get all code cells in the notebook
    const allCodeCells = document.querySelectorAll('.nb-code-cell');
    const codeCellsArray = Array.from(allCodeCells);

    // Find the index of the target cell
    const targetIndex = codeCellsArray.indexOf(targetCell);

    if (targetIndex === -1) {
        console.error("Target cell not found in code cells array");
        return;
    }

    // Get cells to run (all cells up to and including target)
    const cellsToRun = codeCellsArray.slice(0, targetIndex + 1);

    // Get the delay value from the input field
    const delay = parseInt(document.getElementById('delay').value) || RUN_DELAY;

    // Filter out cells containing AI marker
    const validCellsToRun = cellsToRun.filter(cell => {
        const cmEditor = cell.querySelector('.CodeMirror');
        if (cmEditor && cmEditor.CodeMirror) {
            const code = cmEditor.CodeMirror.getValue();
            return !code.includes("# -START OF AI CELL-");
        }
        return true; // If can't check content, include it
    });

    // Run each valid cell with the specified delay
    validCellsToRun.forEach((cell, index) => {
        setTimeout(() => {
            const executeButton = cell.querySelector('.sagecell_evalButton.ui-button.ui-corner-all.ui-widget');
            if (executeButton) {
                executeButton.click();
                console.log(`Running cell ${index + 1} of ${validCellsToRun.length}`);
            }
        }, delay * index);
    });

    console.log(`Scheduled ${validCellsToRun.length} cells to run with ${delay}ms delay between them`);
}

function removeDuplicateStyles() {
    // Get all style elements
    const styles = document.getElementsByTagName('style');
    
    // Create a Set to store unique style contents
    const uniqueStyles = new Set();
    
    // Iterate through the styles in reverse order
    for (let i = styles.length - 1; i >= 0; i--) {
        const style = styles[i];
        const styleContent = style.textContent.trim();
        
        // Check if this style content has been seen before
        if (uniqueStyles.has(styleContent)) {
            // If it's a duplicate, remove it
            style.parentNode.removeChild(style);
        } else {
            // If it's unique, add it to the Set
            uniqueStyles.add(styleContent);
        }
    }
}

// Run the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', removeDuplicateStyles);



let editMode = false;

function toggleEditMode() {
    // First, determine what the new state should be (opposite of current)
    const newEditModeState = !editMode;
    console.log(`Toggling edit mode to: ${newEditModeState ? 'Edit' : 'View'}`);

    // Get all markdown cells
    const markdownCells = document.querySelectorAll('.nb-cell.nb-markdown-cell');

    markdownCells.forEach(cell => {
        // Check if this cell has multiple control bars
        const controlBars = cell.querySelectorAll('.control-bar');
        if (controlBars.length > 1) {
            // Keep only the first control bar and remove others
            console.log(`Found ${controlBars.length} control bars in cell, removing duplicates`);
            for (let i = 1; i < controlBars.length; i++) {
                controlBars[i].remove();
            }
        }

        // Get the Edit/View toggle button for this cell (from the first/only control bar)
        const toggleButton = cell.querySelector('.control-bar button:first-child');
        if (!toggleButton) {
            console.log("No toggle button found for cell");
            return; // Skip if no button found
        }

        // Handle CodeMirror cells
        if (cell.cmEditor) {
            const cmElement = cell.querySelector('.CodeMirror');
            const preview = cell.querySelector('.markdown-preview');

            if (!cmElement || !preview) {
                console.log("Missing CodeMirror or preview element");
                return; // Skip if elements not found
            }

            if (newEditModeState) {
                // Switch to edit mode
                cmElement.style.display = 'block';
                preview.style.display = 'block';
                cell.cmEditor.refresh(); // Important for CM to render correctly
                toggleButton.textContent = 'View';
            } else {
                // Switch to view mode
                cmElement.style.display = 'none';
                preview.style.display = 'block';

                // Update the preview with the latest content
                renderMarkdownWithCM(cell.cmEditor, preview);
                toggleButton.textContent = 'Edit';
            }
        } else {
            // Handle traditional cells
            const input = cell.querySelector('[id^="mdinput"]');
            const preview = cell.querySelector('[id^="preview"]');

            if (!input || !preview) {
                console.log("Missing input or preview element");
                return; // Skip if elements not found
            }

            if (newEditModeState) {
                // Switch to edit mode
                input.style.display = 'block';
                preview.style.display = 'block';
                toggleButton.textContent = 'View';
            } else {
                // Switch to view mode
                input.style.display = 'none';
                preview.style.display = 'block';

                // Update preview
                if (typeof renderMarkdown === 'function') {
                    renderMarkdown(input, preview);
                } else if (typeof texme !== 'undefined' && texme.render) {
                    preview.innerHTML = texme.render(input.value);

                    // Process math if available
                    if (window.MathJax) {
                        window.MathJax.texReset();
                        window.MathJax.typesetPromise([preview]);
                    }
                }
                toggleButton.textContent = 'Edit';
            }
        }
    });

    // Update the global edit mode state
    editMode = newEditModeState;

    // Optionally update the "Edit Cells" button text to reflect the current state
    const editCellsButton = document.getElementById('editCells');
    if (editCellsButton) {
        editCellsButton.innerHTML = iconDictionaryNavbar["editCells"];
        editCellsButton.title = 'Edit/View Mode (Ctrl+E)';
    }
}




function addControlPanel() {
    const controlPanel = document.createElement('div');
    controlPanel.id = 'controls';
    const navbar = document.getElementById('navbar');

    if (!navbar) {
        console.error("Navbar element not found");
        return;
    }

    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'delay';
    input.placeholder = 'Step (ms)';
    input.title = 'Time Between Cell Executions (ms)'
    input.min = '1';
    input.value = RUN_DELAY;
    input.addEventListener('change', function() {
        RUN_DELAY = parseInt(this.value) || 1000;
    });

    const runButton = document.createElement('button');
    runButton.id = 'runAllCellsButton';
    runButton.innerHTML = iconDictionaryNavbar["runAll"];
    runButton.title = 'Run All Cells (Ctrl+R)';

    const restartButton = document.createElement('button');
    restartButton.id = 'restartKernelButton';
    restartButton.innerHTML = iconDictionaryNavbar["restart"];
    restartButton.title = 'Restart Sage Kernel (Ctrl+K)';
    restartButton.onclick = function () {
        if (typeof restartNotebook === 'function') {
            // Uses defaults in restartNotebook (e.g., newKernel: true, reexecute: false)
            restartNotebook();
        } else {
            console.error('restartNotebook() is not defined.');
            alert('Restart function is not available.');
        }
    };

    const toggleNavbarButton = document.createElement('button');
    toggleNavbarButton.id = 'toggleNavbar';
    toggleNavbarButton.innerHTML = iconDictionaryNavbar["toggleNavBar"];
    toggleNavbarButton.title = 'Toggle Bar';
    toggleNavbarButton.onclick = toggleNavbar;

    const editCellsButton = document.createElement('button');
    editCellsButton.id = 'editCells';
    editCellsButton.innerHTML = iconDictionaryNavbar["editCells"];
    editCellsButton.title = 'Edit/View Mode (Ctrl+E)';
    editCellsButton.onclick = toggleEditMode;

    const exportButton = document.createElement('button');
    exportButton.id = 'exportCells';
    exportButton.innerHTML= iconDictionaryNavbar["exportCells"];
    exportButton.title = 'Export Notebook (Ctrl+P)';
    exportButton.onclick = function() {
        showFormatPopup('Export Format', [
            { label: 'TXT', action: downloadNotebookText },
            { label: 'IPYNB', action: downloadNotebookAsIPYNB }
        ]);
    };

    const importButton = document.createElement('button');
    importButton.id = 'importCells';
    importButton.innerHTML = iconDictionaryNavbar["importCells"];
    importButton.title = 'Import Notebook (Ctrl+I)';
    importButton.onclick = function() {
        showFormatPopup('Import Format', [
            { label: 'TXT', action: () => {
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = '.txt';
                fileInput.style.display = 'none';
                fileInput.onchange = function(event) {
                    const file = event.target.files[0];
                    if (file) importNotebookFromFile(file);
                    document.body.removeChild(fileInput);
                };
                document.body.appendChild(fileInput);
                fileInput.click();
            }},
            { label: 'IPYNB', action: () => {
                const fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = '.ipynb';
                fileInput.style.display = 'none';
                fileInput.onchange = function(event) {
                    const file = event.target.files[0];
                    if (file) importFromIPYNB(file);
                    document.body.removeChild(fileInput);
                };
                document.body.appendChild(fileInput);
                fileInput.click();
            }}
        ]);
    };

    function showFormatPopup(title, options) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.6)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '10000';
        overlay.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

        const popup = document.createElement('div');
        popup.style.backgroundColor = '#fefefe';
        popup.style.padding = '30px';
        popup.style.border = '1px solid #ccc';
        popup.style.borderRadius = '8px';
        popup.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        popup.style.minWidth = '250px';
        popup.style.maxWidth = '400px';
        popup.style.textAlign = 'center';
        popup.style.boxSizing = 'border-box';

        const heading = document.createElement('h3');
        heading.textContent = title;
        heading.style.marginTop = '0';
        heading.style.marginBottom = '20px';
        heading.style.color = '#333';
        heading.style.fontWeight = '600';
        heading.style.borderBottom = '1px solid #eee';
        heading.style.paddingBottom = '10px';
        popup.appendChild(heading);

        options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.textContent = opt.label;
            btn.style.display = 'block';
            btn.style.width = '100%';
            btn.style.padding = '10px';
            btn.style.margin = '8px 0';
            btn.style.border = 'none';
            btn.style.borderRadius = '4px';
            btn.style.backgroundColor = '#4CAF50';
            btn.style.color = 'white';
            btn.style.fontSize = '0.95em';
            btn.style.cursor = 'pointer';
            btn.style.transition = 'background-color 0.2s ease, box-shadow 0.2s ease';
            btn.onmouseover = () => { btn.style.backgroundColor = '#286090'; btn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.15)'; };
            btn.onmouseout = () => { btn.style.backgroundColor = '#4CAF50'; btn.style.boxShadow = 'none'; };
            btn.onclick = () => {
                document.body.removeChild(overlay);
                opt.action();
            };
            popup.appendChild(btn);
            // Focus the first button so user can press Enter immediately
            if (index === 0) {
                setTimeout(() => btn.focus(), 0);
            }
        });

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.display = 'block';
        cancelBtn.style.width = '100%';
        cancelBtn.style.padding = '10px';
        cancelBtn.style.marginTop = '12px';
        cancelBtn.style.border = 'none';
        cancelBtn.style.borderRadius = '4px';
        cancelBtn.style.backgroundColor = '#e74c3c';
        cancelBtn.style.color = 'white';
        cancelBtn.style.fontSize = '0.95em';
        cancelBtn.style.cursor = 'pointer';
        cancelBtn.style.transition = 'background-color 0.2s ease, box-shadow 0.2s ease';
        cancelBtn.onmouseover = () => { cancelBtn.style.backgroundColor = '#286090'; cancelBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.15)'; };
        cancelBtn.onmouseout = () => { cancelBtn.style.backgroundColor = '#e74c3c'; cancelBtn.style.boxShadow = 'none'; };
        cancelBtn.onclick = () => document.body.removeChild(overlay);
        popup.appendChild(cancelBtn);

        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        // Close popup when clicking outside
        overlay.addEventListener('click', function(event) {
            if (event.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        // Close popup when pressing Escape
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                document.body.removeChild(overlay);
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    const aiSettingsButton = document.createElement('button');
    aiSettingsButton.id = 'aiSettings';
    aiSettingsButton.innerHTML = iconDictionaryNavbar["settings"];
    aiSettingsButton.title = 'AI Settings';
    aiSettingsButton.onclick = createAiSettingsModal;

    // Insert the new elements at the beginning of the navbar
    // Help button
    const helpButton = document.createElement('button');
    helpButton.id = 'helpButton';
    helpButton.innerHTML = iconDictionaryNavbar["help"];
    helpButton.title = 'Help';
    helpButton.onclick = createHelpModal; 
    navbar.insertBefore(exportButton, navbar.firstChild);
    navbar.insertBefore(importButton, navbar.firstChild);
    navbar.insertBefore(aiSettingsButton, navbar.firstChild);
    // Disabled Toggle AI Cells Button
    // navbar.insertBefore(toggleAiButton, aiSettingsButton.nextSibling);
    navbar.insertBefore(editCellsButton, navbar.firstChild);
    navbar.insertBefore(input, navbar.firstChild);
    navbar.insertBefore(runButton, navbar.firstChild);
    // Place Restart Kernel right after Run All Cells
    navbar.insertBefore(restartButton, input.nextSibling);
    // Removed dedicated IPYNB export/import buttons in favor of unified format selection
    navbar.appendChild(helpButton);
    controlPanel.appendChild(toggleNavbarButton);
    document.body.insertBefore(controlPanel, main);

    const linkElement = document.querySelector('link[href="https://dahn-research.eu/nbplayer/css/nbplayer.css"]');
    if (linkElement) {
        linkElement.href = "https://cdn.jsdelivr.net/gh/JupyterPER/SageMathAINotebooks@main/css/nbplayer.css";
    }

    // Automatically click the Edit Cells button twice
    setTimeout(() => {
        editCellsButton.click();
        setTimeout(() => {
            editCellsButton.click();
        }, 100); // 100ms delay between clicks
    }, 100); // Wait 100ms after creation before first click
}


function toggleNavbar() {
    const navbar = document.getElementById('navbar');
    
    if (navbar.style.display === 'none') {
        navbar.style.display = '';
        navbar.style.visibility = 'visible';
        navbar.style.opacity = '1';
    } else {
        navbar.style.display = 'none';
        navbar.style.visibility = 'hidden';
        navbar.style.opacity = '0';
    }
}


const iconDictionaryNavbar = {
    help: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M10 8.484C10.5 7.494 11 7 12 7c1.246 0 2 .989 2 1.978s-.5 1.483-2 2.473V13m0 3.5v.5"/></svg>`,
    runAll: `<svg  xmlns="http://www.w3.org/2000/svg"  width="22" height="22"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-player-track-next"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M2 5v14c0 .86 1.012 1.318 1.659 .753l8 -7a1 1 0 0 0 0 -1.506l-8 -7c-.647 -.565 -1.659 -.106 -1.659 .753z" /><path d="M13 5v14c0 .86 1.012 1.318 1.659 .753l8 -7a1 1 0 0 0 0 -1.506l-8 -7c-.647 -.565 -1.659 -.106 -1.659 .753z" /></svg>`,
    restart: `<svg  xmlns="http://www.w3.org/2000/svg"  width="22" height="22"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-rotate"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M19.95 11a8 8 0 1 0 -.5 4m.5 5v-5h-5" /></svg>`,
    saveNotebook: `<svg  xmlns="http://www.w3.org/2000/svg"  width="22" height="22"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-device-floppy"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2" /><path d="M12 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M14 4l0 4l-6 0l0 -4" /></svg>`,
    toggleNavBar: `<svg  xmlns="http://www.w3.org/2000/svg"  width="22" height="22"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-menu-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6l16 0" /><path d="M4 12l16 0" /><path d="M4 18l16 0" /></svg>`,
    settings: `<svg  xmlns="http://www.w3.org/2000/svg"  width="22" height="22"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-settings"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14.647 4.081a.724 .724 0 0 0 1.08 .448c2.439 -1.485 5.23 1.305 3.745 3.744a.724 .724 0 0 0 .447 1.08c2.775 .673 2.775 4.62 0 5.294a.724 .724 0 0 0 -.448 1.08c1.485 2.439 -1.305 5.23 -3.744 3.745a.724 .724 0 0 0 -1.08 .447c-.673 2.775 -4.62 2.775 -5.294 0a.724 .724 0 0 0 -1.08 -.448c-2.439 1.485 -5.23 -1.305 -3.745 -3.744a.724 .724 0 0 0 -.447 -1.08c-2.775 -.673 -2.775 -4.62 0 -5.294a.724 .724 0 0 0 .448 -1.08c-1.485 -2.439 1.305 -5.23 3.744 -3.745a.722 .722 0 0 0 1.08 -.447c.673 -2.775 4.62 -2.775 5.294 0zm-2.647 4.919a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" /></svg>`,
    showHideCode: `<svg  xmlns="http://www.w3.org/2000/svg"  width="22" height="22"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eye-code"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M11.11 17.958c-3.209 -.307 -5.91 -2.293 -8.11 -5.958c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6c-.21 .352 -.427 .688 -.647 1.008" /><path d="M20 21l2 -2l-2 -2" /><path d="M17 17l-2 2l2 2" /></svg>`,
    editCells: `<svg  xmlns="http://www.w3.org/2000/svg"  width="22" height="22"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-markdown"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /><path d="M7 15v-6l2 2l2 -2v6" /><path d="M14 13l2 2l2 -2m-2 2v-6" /></svg>`,
    exportCells: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" stroke-width="2"><path fill="currentColor" d="M20.92 15.62a1.15 1.15 0 0 0-.21-.33l-3-3a1 1 0 0 0-1.42 1.42l1.3 1.29H12a1 1 0 0 0 0 2h5.59l-1.3 1.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l3-3a.93.93 0 0 0 .21-.33a1 1 0 0 0 0-.76M14 20H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5v3a3 3 0 0 0 3 3h4a1 1 0 0 0 .92-.62a1 1 0 0 0-.21-1.09l-6-6a1.07 1.07 0 0 0-.28-.19h-.09l-.28-.1H6a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h8a1 1 0 0 0 0-2M13 5.41L15.59 8H14a1 1 0 0 1-1-1Z"/></svg>`,
    importCells: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" stroke-width="2"><path fill="currentColor" d="M11 20H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5v3a3 3 0 0 0 3 3h3v2a1 1 0 0 0 2 0V8.94a1.31 1.31 0 0 0-.06-.27v-.09a1.32 1.32 0 0 0-.19-.29l-6-6a1.32 1.32 0 0 0-.29-.19a.32.32 0 0 0-.09 0l-.31-.1H6a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h5a1 1 0 0 0 0-2m2-14.59L15.59 8H14a1 1 0 0 1-1-1ZM19 15h-5.59l1.3-1.29a1 1 0 0 0-1.42-1.42l-3 3a1.15 1.15 0 0 0-.21.33a1 1 0 0 0 0 .76a.93.93 0 0 0 .21.33l3 3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42L13.41 17H19a1 1 0 0 0 0-2"/></svg>`,
}

const iconDictionary = {
    addBelow: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M9.25 10.0693H7.375V8.19434C7.375 7.98809 7.20625 7.81934 7 7.81934C6.79375 7.81934 6.625 7.98809 6.625 8.19434V10.0693H4.75C4.54375 10.0693 4.375 10.2381 4.375 10.4443C4.375 10.6506 4.54375 10.8193 4.75 10.8193H6.625V12.6943C6.625 12.9006 6.79375 13.0693 7 13.0693C7.20625 13.0693 7.375 12.9006 7.375 12.6943V10.8193H9.25C9.45625 10.8193 9.625 10.6506 9.625 10.4443C9.625 10.2381 9.45625 10.0693 9.25 10.0693Z" fill="#616161"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.5 5.5V3.5H11.5V5.5H2.5ZM2 7C1.44772 7 1 6.55228 1 6V3C1 2.44772 1.44772 2 2 2H12C12.5523 2 13 2.44772 13 3V6C13 6.55229 12.5523 7 12 7H2Z" fill="#616161"/>
    </svg>`,
    addAbove: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M9.25 3.93066H7.375V5.80566C7.375 6.01191 7.20625 6.18066 7 6.18066C6.79375 6.18066 6.625 6.01191 6.625 5.80566V3.93066H4.75C4.54375 3.93066 4.375 3.76191 4.375 3.55566C4.375 3.34941 4.54375 3.18066 4.75 3.18066H6.625V1.30566C6.625 1.09941 6.79375 0.930664 7 0.930664C7.20625 0.930664 7.375 1.09941 7.375 1.30566V3.18066H9.25C9.45625 3.18066 9.625 3.34941 9.625 3.55566C9.625 3.76191 9.45625 3.93066 9.25 3.93066Z" fill="#616161"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.5 8.5V10.5H11.5V8.5H2.5ZM2 7C1.44772 7 1 7.44772 1 8V11C1 11.5523 1.44772 12 2 12H12C12.5523 12 13 11.5523 13 11V8C13 7.44771 12.5523 7 12 7H2Z" fill="#616161"/></svg>`,
    moveDown: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" data-icon="ui-components:move-down" class=""><path xmlns="http://www.w3.org/2000/svg" class="jp-icon3" d="M12.471 7.52899C12.7632 7.23684 12.7632 6.76316 12.471 6.47101V6.47101C12.179 6.17905 11.7057 6.17884 11.4135 6.47054L7.75 10.1275V1.75C7.75 1.33579 7.41421 1 7 1V1C6.58579 1 6.25 1.33579 6.25 1.75V10.1275L2.59726 6.46822C2.30338 6.17381 1.82641 6.17359 1.53226 6.46774V6.46774C1.2383 6.7617 1.2383 7.2383 1.53226 7.53226L6.29289 12.2929C6.68342 12.6834 7.31658 12.6834 7.70711 12.2929L12.471 7.52899Z" fill="#616161"></path></svg>`,
    moveUp: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" data-icon="ui-components:move-up" class=""><path xmlns="http://www.w3.org/2000/svg" class="jp-icon3" d="M1.52899 6.47101C1.23684 6.76316 1.23684 7.23684 1.52899 7.52899V7.52899C1.82095 7.82095 2.29426 7.82116 2.58649 7.52946L6.25 3.8725V12.25C6.25 12.6642 6.58579 13 7 13V13C7.41421 13 7.75 12.6642 7.75 12.25V3.8725L11.4027 7.53178C11.6966 7.82619 12.1736 7.82641 12.4677 7.53226V7.53226C12.7617 7.2383 12.7617 6.7617 12.4677 6.46774L7.70711 1.70711C7.31658 1.31658 6.68342 1.31658 6.29289 1.70711L1.52899 6.47101Z" fill="#616161"></path></svg>`,
    bin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16px" height="16px" data-icon="ui-components:delete" class=""><path xmlns="http://www.w3.org/2000/svg" d="M0 0h24v24H0z" fill="none"></path><path xmlns="http://www.w3.org/2000/svg" class="jp-icon3" fill="#626262" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`,
    duplicate: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" data-icon="ui-components:duplicate" class=""><path xmlns="http://www.w3.org/2000/svg" class="jp-icon3" fill-rule="evenodd" clip-rule="evenodd" d="M2.79998 0.875H8.89582C9.20061 0.875 9.44998 1.13914 9.44998 1.46198C9.44998 1.78482 9.20061 2.04896 8.89582 2.04896H3.35415C3.04936 2.04896 2.79998 2.3131 2.79998 2.63594V9.67969C2.79998 10.0025 2.55061 10.2667 2.24582 10.2667C1.94103 10.2667 1.69165 10.0025 1.69165 9.67969V2.04896C1.69165 1.40328 2.1904 0.875 2.79998 0.875ZM5.36665 11.9V4.55H11.0833V11.9H5.36665ZM4.14165 4.14167C4.14165 3.69063 4.50728 3.325 4.95832 3.325H11.4917C11.9427 3.325 12.3083 3.69063 12.3083 4.14167V12.3083C12.3083 12.7594 11.9427 13.125 11.4917 13.125H4.95832C4.50728 13.125 4.14165 12.7594 4.14165 12.3083V4.14167Z" fill="#616161"></path><path xmlns="http://www.w3.org/2000/svg" class="jp-icon3" d="M9.43574 8.26507H8.36431V9.3365C8.36431 9.45435 8.26788 9.55078 8.15002 9.55078C8.03217 9.55078 7.93574 9.45435 7.93574 9.3365V8.26507H6.86431C6.74645 8.26507 6.65002 8.16864 6.65002 8.05078C6.65002 7.93292 6.74645 7.8365 6.86431 7.8365H7.93574V6.76507C7.93574 6.64721 8.03217 6.55078 8.15002 6.55078C8.26788 6.55078 8.36431 6.64721 8.36431 6.76507V7.8365H9.43574C9.5536 7.8365 9.65002 7.93292 9.65002 8.05078C9.65002 8.16864 9.5536 8.26507 9.43574 8.26507Z" fill="#616161" stroke="#616161" stroke-width="0.5"></path></svg>`,
    aiComplete: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" class="">
    <path class="jp-icon3" d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14" stroke="#616161" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>`,
    aiFormat: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" class=""><path class="jp-icon3" d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z" fill="#616161"></path></svg>`,
    aiExplain: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" class=""><path class="jp-icon3" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.008-3.018a1.502 1.502 0 0 1 2.522 1.159v.024a1.44 1.44 0 0 1-1.493 1.418 1 1 0 0 0-1.037.999V14a1 1 0 1 0 2 0v-.539a3.44 3.44 0 0 0 2.529-3.256 3.502 3.502 0 0 0-7-.255 1 1 0 0 0 2 .076c.014-.398.187-.774.48-1.044Zm.982 7.026a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2h-.01Z" fill="#616161"></path></svg>`,
    addEditExcel: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" class=""><path class="jp-icon3" stroke="#616161" stroke-width="2" d="M3 11h18M3 15h18m-9-4v8m-8 0h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"/></svg>`,
    markdownTips: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M10 1c3.11 0 5.63 2.52 5.63 5.62 0 1.84-2.03 4.58-2.03 4.58-.33.44-.6 1.25-.6 1.8v1c0 .55-.45 1-1 1H8c-.55 0-1-.45-1-1v-1c0-.55-.27-1.36-.6-1.8 0 0-2.02-2.74-2.02-4.58C4.38 3.52 6.89 1 10 1zM7 16.87V16h6v.87c0 .62-.13 1.13-.75 1.13H12c0 .62-.4 1-1.02 1h-2c-.61 0-.98-.38-.98-1h-.25c-.62 0-.75-.51-.75-1.13z" fill="#616161"/></svg>`,
    copyOutput: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" class="bi bi-clipboard2-fill" viewBox="0 0 16 16"><path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5z"/><path d="M3.5 1h.585A1.5 1.5 0 0 0 4 1.5V2a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 12 2v-.5q-.001-.264-.085-.5h.585A1.5 1.5 0 0 1 14 2.5v12a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 14.5v-12A1.5 1.5 0 0 1 3.5 1" fill="#616161"/></svg>`,
    runUpTo: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" fill="#616161"/></svg>`
};


// Initialize SageCell just for a single compute element, keeping linkKey/shared kernel
function initSageCellOnElement(computeEl) {
    if (!computeEl) return;

    const cfg = Object.assign({}, window.playerConfig || {});
    const isDe = (typeof getBrowserLanguage === 'function' && getBrowserLanguage() === 'de');
    const evalBtn = isDe ? 'Ausführen' : 'Execute';

    // Use the shared linkKey from your patch
    const linkKey = (playerConfig && playerConfig.linkKey) || window.SAGE_LINK_KEY;

    // Initialize only this compute element
    sagecell.makeSagecell({
        inputLocation: $(computeEl),          // jQuery object is accepted by SageCell
        languages: [cfg.lang || 'sage'],
        evalButtonText: evalBtn,
        linked: true,
        linkKey: linkKey,
        autoeval: !!cfg.eval,
        hide: cfg.hide || ["fullScreen"]
    });
}

// Ensure a code cell has exactly one compute/script prepared,
// but DO NOT delete any existing outputs. Returns the compute node to initialize, or null if already initialized.
function ensureComputeDivForCodeCell(cell) {
    if (!cell || !cell.classList.contains('nb-code-cell')) return null;

    // If already initialized (compute.sagecell exists), do nothing
    const existingInitialized = cell.querySelector('.compute.sagecell');
    if (existingInitialized) return null;

    // Use an existing compute if present, else create one
    let compute = cell.querySelector('.compute');
    if (!compute) {
        compute = document.createElement('div');
        compute.className = 'compute';
        cell.appendChild(compute);
    }

    // Ensure we have a script tag with sage code inside compute (do not remove outputs elsewhere)
    let script = compute.querySelector('script[type="text/x-sage"]');
    if (!script) {
        script = document.createElement('script');
        script.type = 'text/x-sage';
        compute.appendChild(script);
    }

    // Get current code text from the best available source
    let code = '';
    const cmEl = cell.querySelector('.CodeMirror');
    if (cmEl && cmEl.CodeMirror) {
        code = cmEl.CodeMirror.getValue();
    } else {
        // Fallbacks
        // 1) Our internal utility may include `In[n]:` prefix: strip it if present
        if (typeof getCodeFromCell === 'function') {
            code = getCodeFromCell(cell, 0).replace(/^In\[\d+\]:\s*\n?/, '');
        }
        // 2) If createCodeCell was used earlier, it may have left an <nb-input> tag with textContent
        if (!code) {
            const nbInput = cell.querySelector('nb-input');
            if (nbInput) code = nbInput.textContent || '';
        }
        // 3) Or a <pre> fallback
        if (!code) {
            const pre = cell.querySelector('pre');
            if (pre) code = pre.textContent || '';
        }
    }

    // Clean zero-width and BOM chars
    code = String(code).replace(/[\u200B\u200C\u200D\uFEFF]/g, '');

    // Update script content
    script.textContent = code;

    return compute;
}

function reprocessNotebook() {
    requestAnimationFrame(() => {
        // Only add/initialize missing compute elements. Do not touch existing outputs.
        const codeCells = document.querySelectorAll('.nb-code-cell');
        let initializedCount = 0;

        codeCells.forEach(cell => {
            // Clean zero-width characters from any script tags in this cell
            cell.querySelectorAll('script[type="text/x-sage"]').forEach(s => {
                s.textContent = (s.textContent || '').replace(/[\u200B\u200C\u200D\uFEFF]/g, '');
            });

            const computeToInit = ensureComputeDivForCodeCell(cell);
            if (computeToInit && !computeToInit.classList.contains('sagecell')) {
                initSageCellOnElement(computeToInit);
                initializedCount++;
            }
        });

        // Ensure only one compute.sagecell per code cell (keep last)
        cleanupComputeDivs();

        // Refresh numbering only (no global re-init)
        removeSageCellNumbering();
        addSageCellNumbering();

        console.log(`Initialized ${initializedCount} new Sage cell(s) without touching existing outputs`);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    navbar.style.display = '';
    navbar.style.visibility = 'visible';
    navbar.style.opacity = '1';
});

function addConvertToMarkdownButtons() {
    const codeCells = document.querySelectorAll('.nb-cell.nb-code-cell');
    
    codeCells.forEach(cell => {
        if (!cell.querySelector('.convert-button')) {
            const convertButton = document.createElement('button');
            convertButton.className = 'convert-button';
            convertButton.textContent = 'Convert to Markdown';
            
            convertButton.addEventListener('click', () => {
                convertToMarkdown(cell);
            });
            
            cell.appendChild(convertButton);
        }
    });
}


function getCode(codeCell) {
    if (!codeCell) {
        console.error('No code cell provided');
        return '';
    }

    // Extract all lines of text from the code cell
    const codeLines = codeCell.querySelectorAll(".CodeMirror-code > div > pre > span");
    
    if (codeLines.length === 0) {
        console.warn('No code lines found in the provided cell');
        return '';
    }

    const codeText = Array.from(codeLines)
        .map(line => line.textContent)
        .join('\n');

    return codeText;    
}


function showCode(codeCell) {
    const code = getCode(codeCell);
    if (code) {
        // Assuming you have an element to display the code in
        const displayElement = document.getElementById('codeDisplay');
        displayElement.textContent = code;
        displayElement.style.display = 'block';
    }
}

function initializeCells() {
	const cells = document.querySelectorAll('.nb-cell.nb-code-cell, .nb-cell.nb-markdown-cell');
	cells.forEach(addControlBar);
}

function addControlBar(cell) {
    const controlBar = document.createElement('div');
    const controlAiBar = document.createElement('div');
    controlBar.className = 'control-bar';
    controlAiBar.className = 'control-ai-bar';

    const addAboveBtn = createButtonIco('Add Above', () => addCell(cell, 'above'), 'addAbove');
    const addBelowBtn = createButtonIco('Add Below', () => addCell(cell, 'below'), 'addBelow');
    const addFiveBelowBtn = createButtonIco('Add 5 Below', () => addFiveCells(cell, 'below'), 'addBelow');
    // Custom styling for the 5x indicator
    addFiveBelowBtn.innerHTML = '<span style="font-size:1em;font-weight:bold;margin-right:2px;">5×</span>' + addFiveBelowBtn.innerHTML;

    const addMarkdownAboveBtn = createButtonIco('Add Markdown Above', () => addMarkdownCell(cell, 'above'), 'addAbove');
    addMarkdownAboveBtn.innerHTML = '<span style="font-size:1em;font-weight:bold;margin-right:2px;">MD</span>' + addMarkdownAboveBtn.innerHTML;
    const addMarkdownBelowBtn = createButtonIco('Add Markdown Below', () => addMarkdownCell(cell, 'below'), 'addBelow');
    addMarkdownBelowBtn.innerHTML = '<span style="font-size:1em;font-weight:bold;margin-right:2px;">MD</span>' + addMarkdownBelowBtn.innerHTML;

    const deleteBtn = createButtonIco('Delete', () => deleteCell(cell), 'bin');
    const moveUpBtn = createButtonIco('Move Up', () => moveCell(cell, 'up'), 'moveUp');
    const moveDownBtn = createButtonIco('Move Down', () => moveCell(cell, 'down'), 'moveDown');
    const duplicateBtn = createButtonIco('Duplicate', () => duplicateCell(cell), 'duplicate');

    if (cell.classList.contains('nb-code-cell')) {
        const convertToMarkdownBtn = createButton('Markdown', () => convertToMarkdown(cell));
        const aiCompleteBtn = createButtonIco('AI Complete', () => formatAndLoadCodeIntoCell(cell, `AI_complete`, CURRENT_MODEL, API_KEY, CURRENT_LANGUAGE, CUSTOM_CONTEXT), 'aiComplete');
        const aiFormatBtn = createButtonIco('AI Format', () => formatAndLoadCodeIntoCell(cell, `AI_format`, CURRENT_MODEL, API_KEY, CURRENT_LANGUAGE, CUSTOM_CONTEXT), 'aiFormat');
        const aiExplainBtn = createButtonIco('AI Explain', () => formatAndLoadCodeIntoCell(cell, `AI_explain`, CURRENT_MODEL, API_KEY, CURRENT_LANGUAGE, CUSTOM_CONTEXT), 'aiExplain');
        const excelJsonBtn = createButtonIco('Import/Export Excel', () => openExcelImportExportDialog(cell), 'addEditExcel');
        // Add the new "Copy Output to Markdown" button
        const copyOutputBtn = createButtonIco('Copy Output To Markdown', () => copyOutputToMarkdown(cell), 'copyOutput');
        const runUpToHereBtn = createButtonIco('Run Up To Here', () => runCellsUpTo(cell), 'runUpTo');
        runUpToHereBtn.title = 'Run all cells from beginning to this cell';

        controlBar.appendChild(convertToMarkdownBtn);
        controlBar.appendChild(runUpToHereBtn);
        controlAiBar.appendChild(aiCompleteBtn);
        controlAiBar.appendChild(aiFormatBtn);
        controlAiBar.appendChild(aiExplainBtn);
        controlBar.appendChild(excelJsonBtn);
        controlBar.appendChild(copyOutputBtn);
    } else if (cell.classList.contains('nb-markdown-cell')) {
        // Determine the current state of the markdown cell
        let isInEditMode = false;

        // For CodeMirror-based cells
        if (cell.cmEditor) {
            const cmElement = cell.querySelector('.CodeMirror');
            isInEditMode = cmElement && cmElement.style.display === 'block';
        } else {
            // For traditional cells
            const input = cell.querySelector('[id^="mdinput"]');
            isInEditMode = input && input.style.display === 'block';
        }

        // Set the appropriate button text based on the current state
        const buttonText = isInEditMode ? 'View' : 'Edit';
        const editToggleBtn = createButton(buttonText, () => toggleSingleCellEditMode(cell));
        editToggleBtn.id = 'edit-toggle-' + Date.now(); // Add unique ID for state tracking

        const convertToCodeBtn = createButton('Code', () => convertToCode(cell));
        const markdownTipsBtn = createButtonIco('Markdown Tips', () => toggleMarkdownTips(cell), 'markdownTips');

        controlBar.appendChild(editToggleBtn);
        controlBar.appendChild(convertToCodeBtn);
        controlBar.appendChild(markdownTipsBtn);
    }

    // Add the markdown cell creation buttons to all cells
    controlBar.appendChild(addMarkdownBelowBtn);
    controlBar.appendChild(addMarkdownAboveBtn);

    controlBar.appendChild(duplicateBtn);
    controlBar.appendChild(addFiveBelowBtn);
    controlBar.appendChild(addBelowBtn);
    controlBar.appendChild(addAboveBtn);
    controlBar.appendChild(moveDownBtn);
    controlBar.appendChild(moveUpBtn);
    controlBar.appendChild(deleteBtn);

    cell.insertBefore(controlBar, cell.firstChild);
    // Insert the control AI bar only if API_KEY is defined and not empty
    if (typeof API_KEY !== 'undefined' && API_KEY !== '') {
        cell.insertBefore(controlAiBar, controlBar.nextSibling);
    }
}


function loadPreviousCodeCells(focusedCell) {
    let allText = '';
    let currentCell = focusedCell.previousElementSibling;

    while (currentCell) {
        if (currentCell.classList.contains('nb-cell') && currentCell.classList.contains('nb-code-cell')) {
            const codeLines = currentCell.querySelectorAll(".CodeMirror-code > div > pre > span");
            const codeText = Array.from(codeLines)
                .map(line => line.textContent)
                .join('\n');

            allText = codeText + '\n\n' + allText;
        }
        currentCell = currentCell.previousElementSibling;
    }

    return allText.trim();
}


function removeAllControlBars() {
    const cells = document.querySelectorAll('.nb-cell');
    cells.forEach(removeControlBar);
}

function removeControlBar(cell) {
    const controlBar = cell.querySelector('.control-bar');
    const controlAiBar = cell.querySelector('.control-ai-bar');
    const mdTips = cell.querySelector('.inline-markdown-tips');
    if (controlBar) {
        controlBar.remove();
    }
    if (controlAiBar) {
        controlAiBar.remove();
    }
    if (mdTips) {
        mdTips.remove();
    }
}

function createButtonIco(text, onClick, iconType) {
  const button = document.createElement('button');
  button.innerHTML = iconDictionary[iconType];
  button.title = text;
  button.addEventListener('click', onClick);
  return button;
}

function createButton(text, onClick) {
	const button = document.createElement('button');
	button.textContent = text;
	button.addEventListener('click', onClick);
	return button;
}

function createBlankSageCell() {
	const codeCell = document.createElement('div');
	codeCell.className = 'nb-cell nb-code-cell';
	const content = document.createElement('div');
	content.className = 'cell-content';
	codeCell.appendChild(content);
	return codeCell;

}




function addCell(referenceCell, position) {
    const newCell = createBlankSageCell();

    if (position === 'above') {
        referenceCell.parentNode.insertBefore(newCell, referenceCell);
    } else {
        referenceCell.parentNode.insertBefore(newCell, referenceCell.nextSibling);
    }

    // Add control bar so the cell is functional
    addControlBar(newCell);

    // Initialize compute for just the new cell (preserving existing outputs)
    reprocessNotebook();
}


function deleteCell(cell) {
    const wasCodeCell = cell.classList.contains('nb-code-cell');

    cell.remove();

    // Only renumber after deletion. Do not re-initialize cells.
    if (wasCodeCell) {
        removeSageCellNumbering();
        addSageCellNumbering();
    }
}

function addFiveCells(referenceCell, position) {
    const newCells = [];
    for (let i = 0; i < 5; i++) newCells.push(createBlankSageCell());

    if (position === 'above') {
        for (let i = 4; i >= 0; i--) {
            referenceCell.parentNode.insertBefore(newCells[i], referenceCell);
        }
    } else {
        for (let i = 0; i < 5; i++) {
            if (i === 0) {
                referenceCell.parentNode.insertBefore(newCells[i], referenceCell.nextSibling);
            } else {
                referenceCell.parentNode.insertBefore(newCells[i], newCells[i-1].nextSibling);
            }
        }
    }

    newCells.forEach(addControlBar);

    // Initialize only the new cells
    reprocessNotebook();
}


function moveCell(cell, direction) {
    const parent = cell.parentNode;
    const originalIndex = Array.from(parent.children).indexOf(cell);

    if (direction === 'up' && cell.previousElementSibling) {
        parent.insertBefore(cell, cell.previousElementSibling);
    } else if (direction === 'down' && cell.nextElementSibling) {
        parent.insertBefore(cell.nextElementSibling, cell);
    }

    const newIndex = Array.from(parent.children).indexOf(cell);

    // If moved, just refresh numbering — do NOT reinitialize cells
    if (originalIndex !== newIndex) {
        removeSageCellNumbering();
        addSageCellNumbering();
    }
}

function duplicateCell(cell) {
    // 1) Markdown cells
    if (cell.classList.contains('nb-markdown-cell')) {
        // Get content from original cell
        let content = '';
        if (cell.cmEditor) {
            content = cell.cmEditor.getValue();
        } else {
            const textarea = cell.querySelector('textarea');
            if (textarea) {
                content = textarea.value || textarea.getAttribute('data-original') || '';
            }
        }

        // Create a new markdown cell with this content
        const editorId = 'md-editor-' + Date.now();
        const previewId = 'preview-' + Date.now();

        const newCell = document.createElement('div');
        newCell.className = 'nb-cell nb-markdown-cell';
        newCell.innerHTML = `
            <div class="editor-container">
                <textarea id="${editorId}" placeholder="Enter your Markdown or HTML here"
                          class="markdown-textarea"
                          data-original="">${content}</textarea>
            </div>
            <div id="${previewId}" class="markdown-preview"></div>
        `;

        // Insert the new cell after the original one
        cell.parentNode.insertBefore(newCell, cell.nextSibling);

        // Initialize CodeMirror for the new cell
        const textarea = newCell.querySelector('#' + editorId);
        textarea.setAttribute('data-original', content);

        const editor = CodeMirror.fromTextArea(textarea, {
            mode: 'markdown',
            lineNumbers: true,
            lineWrapping: true,
            theme: 'default',
            extraKeys: {"Ctrl-Space": "autocomplete"},
            autoCloseBrackets: true,
            matchBrackets: true,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
        });

        // Derive height/visibility from original cell if possible
        const origCM = cell.querySelector('.CodeMirror');
        const originalHeight = (origCM && origCM.getAttribute('data-original-height')) || '150px';
        editor.setSize(null, parseInt(originalHeight, 10));
        const newCM = newCell.querySelector('.CodeMirror');
        newCM.setAttribute('data-original-height', originalHeight);

        // Store the CM instance on the cell
        newCell.cmEditor = editor;

        // Live preview updates
        editor.on('change', () => {
            const preview = newCell.querySelector('.markdown-preview');
            if (preview) renderMarkdownWithCM(editor, preview);
        });

        // Match the original visibility state (edit/view)
        const isInEditMode = !!(origCM && origCM.style.display === 'block');
        newCM.style.display = isInEditMode ? 'block' : 'none';
        const preview = newCell.querySelector('.markdown-preview');
        preview.style.display = 'block';

        // Initial render
        renderMarkdownWithCM(editor, preview);

        // Add control bar
        addControlBar(newCell);

        // Update the edit/view toggle text to match existing convention
        const editButton = newCell.querySelector('.control-bar button:first-child');
        if (editButton) {
            editButton.textContent = isInEditMode ? 'View' : 'Edit';
        }

        return; // Done with markdown duplication
    }

    // 2) Code cells
    if (cell.classList.contains('nb-code-cell')) {
        // Extract current code
        let code = '';
        const cm = cell.querySelector('.CodeMirror');
        if (cm && cm.CodeMirror) {
            code = cm.CodeMirror.getValue();
        } else {
            const script = cell.querySelector('script[type="text/x-sage"]');
            if (script) {
                code = script.textContent || '';
            } else if (typeof getCodeFromCell === 'function') {
                // fallback; strip any In[n]: prefix
                code = getCodeFromCell(cell, 0).replace(/^In\[\d+\]:\s*\n?/, '');
            }
        }

        // Clean zero-width and BOM chars
        code = String(code).replace(/[\u200B\u200C\u200D\uFEFF]/g, '');

        // Build a fresh code cell with this code (no cloning of .sagecell DOM)
        const newCell = createCodeCell(code);
        cell.parentNode.insertBefore(newCell, cell.nextSibling);

        // Add controls
        addControlBar(newCell);

        // Initialize only the new cell (non-destructive reprocess)
        // If you implemented ensureComputeDivForCodeCell/initSageCellOnElement:
        // const compute = ensureComputeDivForCodeCell(newCell);
        // if (compute) initSageCellOnElement(compute);
        // Else use your safe reprocessNotebook:
        reprocessNotebook();

        // Renumber safely
        removeSageCellNumbering();
        addSageCellNumbering();

        return;
    }
}


function createCodeCell(content) {
    const codeCell = document.createElement('div');
    codeCell.className = 'nb-cell nb-code-cell';

    const computeDiv = document.createElement('div');
    computeDiv.className = 'compute';

    const script = document.createElement('nb-input');
    script.type = 'text/x-sage';
    script.textContent = content;

    computeDiv.appendChild(script);
    codeCell.appendChild(computeDiv);

    return codeCell;
}


function cleanupComputeDivs() {
    // Select all code cells
    const codeCells = document.querySelectorAll('.nb-code-cell');

    codeCells.forEach(cell => {
        // Find all compute divs within this cell
        const computeDivs = cell.querySelectorAll('.compute.sagecell');

        // If there's more than one compute div
        if (computeDivs.length > 1) {
            // Keep only the last one
            for (let i = 0; i < computeDivs.length - 1; i++) {
                computeDivs[i].remove();
            }
        }
    });
}

function loadPreviousCodeCells(focusedCell) {
    let currentCell = focusedCell;
    let cells = [];

    while (currentCell !== null) {
        currentCell = currentCell.previousElementSibling;
        if (!currentCell) break;
        if (currentCell.classList.contains('nb-code-cell')) {
            cells.unshift(currentCell);
        }
    }

    let allCode = cells
      .map((cell, index) => getCodeFromCell(cell, index))
      .join('\n\n')
      .replace(/'/g, '"');

    return allCode.trim();
}

function getCodeFromCell(codeCell, cellIndex) {
    let code = '';

    // First, try to get code from CodeMirror editor
    const cmEditor = codeCell.querySelector('.CodeMirror');
    if (cmEditor && cmEditor.CodeMirror) {
        code = cmEditor.CodeMirror.getValue();
    }
    // If CodeMirror is not available, try to get from textarea
    else {
        const textarea = codeCell.querySelector('textarea');
        if (textarea) {
            code = textarea.value;
        }
        // If neither is available, try to get from pre element
        else {
            const preElement = codeCell.querySelector('pre');
            if (preElement) {
                code = preElement.textContent;
            }
            else {
                console.warn('Could not find code in cell:', codeCell);
                return '';
            }
        }
    }

    // Add In[n] prefix
    return `In[${cellIndex + 1}]:\n${code}`;
}


function createHelpModal() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.6)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '10000';

    // Create modal content
    const modal = document.createElement('div');
    modal.style.backgroundColor = '#fff';
    modal.style.padding = '20px 20px 30px 20px';
    modal.style.borderRadius = '8px';
    modal.style.maxWidth = '500px';
    modal.style.width = '90%';
    modal.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    modal.style.fontFamily = 'Arial, sans-serif';
    modal.style.maxHeight = '80%';
    modal.style.position = 'relative';
    modal.style.overflowY = 'auto';

    // Close button (x)
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '15px';
    closeBtn.style.fontSize = '28px';
    closeBtn.style.fontWeight = 'bold';
    closeBtn.style.border = 'none';
    closeBtn.style.background = 'transparent';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.color = '#555';
    closeBtn.onmouseover = () => closeBtn.style.color = '#000';
    closeBtn.onmouseout = () => closeBtn.style.color = '#555';

    // Close function (reusable)
    function closeModal() {
        if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
            document.removeEventListener('keydown', handleKey);
        }
    }
    closeBtn.onclick = closeModal;

    // Title
    const title = document.createElement('h2');
    title.textContent = 'Help Resources';
    title.style.marginTop = '0';

    // Description
    const description = document.createElement('p');
    description.textContent = 'List of helpful materials in Slovak:';
    description.style.margin = '10px 0 20px 0';
    description.style.color = '#333';
    description.style.fontSize = '14px';

    // Links list
    const list = document.createElement('ul');
    list.style.paddingLeft = '20px';
    list.style.margin = '0';

    const links = [
        { text: 'Notebook User Manual', url: 'https://docs.google.com/document/d/e/2PACX-1vTKGQxS4MhGdYBFHGYsGAc16vJV0aL-DNEcwT5ETWUEN6ikGR4TtZHAy1aw7rNGTzFFPb9l91BasqSM/pub' },
        { text: 'SageMath: Mathematical Analysis Cheat Sheet', url: 'https://drive.google.com/file/d/1j3UV-MOOJNM_6CNXBJLTaB8dXMsVEdZx/preview' },
        { text: 'SageMath: Algebra Cheat Sheet', url: 'https://drive.google.com/file/d/1mPK3hbp1ZdHqapRiRwj3JQftBDbaWn03/preview' },
        { text: 'Markdown and LaTeX Cheat Sheet', url: 'https://drive.google.com/file/d/18iqgfQILf7h7LeRy4cxssYUMaSs2kmXy/preview' }
    ];

    links.forEach(linkData => {
        const li = document.createElement('li');
        li.style.margin = '10px 0';
        li.style.listStyleType = 'disc';
        const a = document.createElement('a');
        a.href = linkData.url;
        a.textContent = linkData.text;
        a.target = '_blank';
        a.style.color = '#007bff';
        a.style.textDecoration = 'none';
        a.onmouseover = () => a.style.textDecoration = 'underline';
        a.onmouseout = () => a.style.textDecoration = 'none';
        li.appendChild(a);
        list.appendChild(li);
    });

    // Attribution footer
    const footer = document.createElement('div');
    footer.style.marginTop = '20px';
    footer.style.paddingTop = '10px';
    footer.style.borderTop = '1px solid #ccc';
    footer.style.fontSize = '12px';
    footer.style.color = '#555';
    footer.style.textAlign = 'center';

    const footerText = document.createElement('p');
    footerText.innerHTML = `
        © 2025 Dominik Borovský & Jozef Hanč. Based on work by 
        <a href="https://github.com/ingodahn/nbplayer" target="_blank" style="color: #007bff; text-decoration: none;">Ingo Dahn</a>, 
        licensed under 
        <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" style="color: #007bff; text-decoration: none;">CC-BY-SA 4.0</a>. 
        Source code: 
        <a href="https://github.com/JupyterPER/SageMathAINotebooks" target="_blank" style="color: #007bff; text-decoration: none;">GitHub Repository</a>.
    `;
    footer.appendChild(footerText);

    modal.appendChild(closeBtn);
    modal.appendChild(title);
    modal.appendChild(description);
    modal.appendChild(list);
    modal.appendChild(footer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Close modal on overlay click
    overlay.addEventListener('click', function (event) {
        if (event.target === overlay) {
            closeModal();
        }
    });

    // Close modal with ESC key
    function handleKey(event) {
        if (event.key === "Escape") {
            closeModal();
        }
    }
    document.addEventListener('keydown', handleKey);
}


// Initialize cells when the page loads
window.addEventListener('load', initializeCells);

/**
 * Existing function to extract code from a code cell.
 * Assumes that codeCell is a DOM element representing a code cell.
 * cellIndex is the index of the cell in the notebook (0-based).
 */
function getCodeFromCell(codeCell, cellIndex) {
    let code = '';

    // First, try to get code from CodeMirror editor
    const cmEditor = codeCell.querySelector('.CodeMirror');
    if (cmEditor && cmEditor.CodeMirror) {
        code = cmEditor.CodeMirror.getValue();
    }
    // If CodeMirror is not available, try to get from textarea
    else {
        const textarea = codeCell.querySelector('textarea');
        if (textarea) {
            code = textarea.value;
        }
        // If neither is available, try to get from pre element
        else {
            const preElement = codeCell.querySelector('pre');
            if (preElement) {
                code = preElement.textContent;
            }
            else {
                console.warn('Could not find code in cell:', codeCell);
                return '';
            }
        }
    }

    // Add In[n] prefix
    return `In[${cellIndex + 1}]:\n${code}`;
}




function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;
}

function downloadNotebookText() {
    // Gather the text
    const notebookContent = collectNotebookText();

    const extractedNameBase = extractFilenameBaseFromH1(); // Use the reusable helper
    const filenameBase = extractedNameBase || 'SageMath_export'; // Default fallback name for text export
    const finalFilename = `${filenameBase}_${getFormattedDate()}.txt`; // Append timestamp and extension

    // Create a Blob from the text
    const blob = new Blob([notebookContent], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);

    // Create a temporary link to automatically download the file
    const link = document.createElement('a');
    link.href = url;
    link.download = finalFilename
    document.body.appendChild(link);
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
}



/**
 * Main function to read and import text file data, then re-create cells in order.
 * @param {File} file - The text file object (from an <input type="file">, etc.)
 */
function importNotebookFromFile(file) {
    const reader = new FileReader();
    reader.addEventListener('load', event => {
        const fileContent = event.target.result;
        restoreNotebookFromText(fileContent);
        // Delay before the first reprocessing
        setTimeout(() => {
            reprocessNotebook();
            // Delay before the second reprocessing
            setTimeout(() => {
                reprocessNotebook();
            }, 1000); // 1000 ms delay between the first and second reprocessing
        }, 1000); // 1000 ms delay before the first reprocessing
    });
    reader.readAsText(file);
}

/**
 * Parse the text content and restore cells into #notebook-container in sequence.
 * @param {string} text - The text of the notebook_export_current_date.txt file (beta version)
 */

function restoreNotebookFromText(text) {
    // Find the container for appending cells
    const container = document.querySelector('.nb-worksheet');
    if (!container) {
        console.error('Could not find #notebook-container');
        return;
    }

    // Ask the user if they want to wipe out all previous content
    const shouldWipe = confirm("Do you want to wipe out all the previous content before loading the notebook?");
    if (shouldWipe) {
        // Clear the container
        container.innerHTML = "";
    }

    // Split blocks by our separator:
    const cellBlocks = text.split('@=================\n');

    cellBlocks.forEach(block => {
        const lines = block.split('\n');
        // The first line should have either "@Markdown[x]:" or "@In[x]:"
        const header = lines[0] || '';
        // Everything after the first line is the cell's content
        const content = lines.slice(1).join('\n');

        if (header.startsWith('@Markdown[')) {
            // Rebuild a Markdown cell with CodeMirror
            const mdCell = createMarkdownCell(content);
            container.appendChild(mdCell);
        } else if (header.startsWith('@In[')) {
            // Rebuild a Code cell
            const codeCell = createCodeCell(content.replace(/[\u200B]/g, ''));
            container.appendChild(codeCell);
            addControlBar(codeCell);
        } else {
            console.warn(`Unrecognized cell header format: "${header}"`);
        }
    });
}


// New function to import an Excel file, convert it to JSON, and load it into the current code cell
function importExcelJsonToCell(cell) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    // Accept only Excel files
    fileInput.accept = '.xlsx,.xls';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = e.target.result;
            try {
                // Using SheetJS (XLSX) library to parse the file
                const workbook = XLSX.read(data, { type: 'binary' });
                // Get the first worksheet
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                // Convert the worksheet to JSON (array of arrays)
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                // Format and load the resulting JSON into the code cell
                formatAndLoadExcelJsonIntoCell(cell, jsonData);
            } catch (error) {
                console.error("Error converting Excel to JSON:", error);
                alert("Failed to convert Excel file to JSON.");
            }
        };
        reader.readAsBinaryString(file);
    });

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
}

// New function similar to formatAndLoadCodeIntoCell but for Excel JSON data
function formatAndLoadExcelJsonIntoCell(cell, jsonData) {
    const jsonString = JSON.stringify(jsonData, null, 2);
    const formattedCode = `# Specify the DataFrame name ('df' is for default)
dataframe_name = "df"  
import pandas as pd, json

data_raw = r'''
${jsonString}
'''
# Dynamically create the DataFrame with the specified name
data_json = json.loads(data_raw)
globals()[dataframe_name] = pd.DataFrame(data_json[1:], columns=data_json[0])

# Access the dynamically created DataFrame
print(f"The DataFrame '{dataframe_name}' has been created successfully.")
print(f"Shape of the DataFrame: {globals()[dataframe_name].shape}")
print("Columns in the DataFrame: " + ", ".join([f"'{col}'" for col in globals()[dataframe_name].columns]))`;

    const codeMirrorElem = cell.querySelector('.CodeMirror');
    if (codeMirrorElem && codeMirrorElem.CodeMirror) {
        const codeMirror = codeMirrorElem.CodeMirror;
        codeMirror.setValue(formattedCode);
        // Automatically click the execute button if available
        const executeButton = cell.querySelector('.sagecell_evalButton.ui-button.ui-corner-all.ui-widget');
        if (executeButton) {
            executeButton.click();
        } else {
            console.error('Execute button not found in cell.');
        }
    } else {
        console.error('CodeMirror instance not found in cell.');
    }
}
// NEW FUNCTION: Open a popup window that lets the user choose to Import, Export, or Edit Excel JSON data.
function openExcelImportExportDialog(cell) {
    // Create a modal overlay
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'excelImportExportModal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '10000';

    // Create modal content container
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '5px';
    modalContent.style.minWidth = '300px';
    modalContent.style.textAlign = 'center';

    // Title
    const title = document.createElement('h3');
    title.textContent = 'Data Options';
    modalContent.appendChild(title);

    // Instruction
    const instruction = document.createElement('p');
    instruction.textContent = 'Choose an action for data:';
    modalContent.appendChild(instruction);

    // Import button
    const importBtn = document.createElement('button');
    importBtn.textContent = 'Import Excel';
    importBtn.style.margin = '10px';
    importBtn.onclick = function () {
        document.body.removeChild(modal);
        importExcelJsonToCell(cell);
    };
    modalContent.appendChild(importBtn);

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit Data';
    editBtn.style.margin = '10px';
    editBtn.onclick = function () {
        document.body.removeChild(modal);
        openExcelEditorDialog(cell);
    };
    modalContent.appendChild(editBtn);

    // Export button
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export Excel';
    exportBtn.style.margin = '10px';
    exportBtn.onclick = function () {
        document.body.removeChild(modal);
        exportExcelJsonFromCell(cell);
    };
    modalContent.appendChild(exportBtn);

    // Cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.margin = '10px';
    cancelBtn.onclick = function () {
        document.body.removeChild(modal);
    };
    modalContent.appendChild(cancelBtn);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

// NEW FUNCTION: Open a modal editor to let the user edit Excel JSON data as a table.
// The user can add/delete rows and columns and then save changes back into the code cell.
function openExcelEditorDialog(cell) {
    // Try to extract JSON data from the cell.
    const codeMirrorElem = cell.querySelector('.CodeMirror');
    let codeContent = "";
    if (codeMirrorElem && codeMirrorElem.CodeMirror) {
        codeContent = codeMirrorElem.CodeMirror.getValue();
    } else {
        codeContent = cell.textContent;
    }
    const regex = /data_raw\s*=\s*r'''([\s\S]*?)'''/;
    let jsonData;
    const match = codeContent.match(regex);
    if (match && match[1]) {
        try {
            jsonData = JSON.parse(match[1]);
        } catch (error) {
            console.error("Error parsing JSON data from cell:", error);
            alert("Failed to parse existing JSON data. Starting with an empty table.");
            jsonData = [];
        }
    } else {
        // If no JSON found, initialize with a default header and one empty row.
        jsonData = [["Column1", "Column2"], ["", ""]];
    }

    // Create a modal overlay for the editor
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'excelEditorModal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '11000';

    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '5px';
    modalContent.style.minWidth = '400px';
    modalContent.style.textAlign = 'center';

    const title = document.createElement('h3');
    title.textContent = 'Edit Data';
    modalContent.appendChild(title);

    // Create a container for the editable table.
    const tableContainer = document.createElement('div');
    tableContainer.style.maxHeight = '400px';
    tableContainer.style.overflow = 'auto';
    tableContainer.style.marginBottom = '10px';

    // Function to render the table from jsonData (array of arrays)
    // Inside the openExcelEditorDialog function, update the renderTable function as follows:
    function renderTable() {
        tableContainer.innerHTML = "";
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginBottom = '10px';
        table.style.fontFamily = 'Arial, sans-serif';

        jsonData.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');
            // Apply zebra striping for non-header rows
            tr.style.backgroundColor =
                rowIndex === 0 ? '#4CAF50' : (rowIndex % 2 === 0 ? '#f9f9f9' : '#ffffff');

            row.forEach((cellValue, colIndex) => {
                const td = document.createElement('td');
                td.style.border = '1px solid #ddd';
                td.style.padding = '8px';
                // For the header row, update styling
                if (rowIndex === 0) {
                    td.style.color = '#fff';
                    td.style.textAlign = 'center';
                    td.style.fontWeight = 'bold';
                }
                const input = document.createElement('input');
                input.type = 'text';
                input.value = cellValue;
                input.style.width = '100%';
                input.style.boxSizing = 'border-box';
                input.style.border = 'none';
                input.style.outline = 'none';
                input.style.padding = '4px';
                input.style.fontFamily = 'inherit';
                // Update jsonData when the cell is edited
                input.onchange = function () {
                    jsonData[rowIndex][colIndex] = input.value;
                };
                td.appendChild(input);
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });
        tableContainer.appendChild(table);
    }
    renderTable();
    modalContent.appendChild(tableContainer);

    // Buttons for modifying rows/columns
    const rowControls = document.createElement('div');
    rowControls.style.margin = '10px 0';
    const addRowBtn = document.createElement('button');
    addRowBtn.textContent = 'Add Row';
    addRowBtn.style.margin = '0 5px';
    addRowBtn.onclick = function () {
        // Create an empty row with the same number of columns as header
        const numCols = jsonData[0] ? jsonData[0].length : 1;
        const newRow = Array(numCols).fill("");
        jsonData.push(newRow);
        renderTable();
    };
    const deleteRowBtn = document.createElement('button');
    deleteRowBtn.textContent = 'Delete Last Row';
    deleteRowBtn.style.margin = '0 5px';
    deleteRowBtn.onclick = function () {
        if (jsonData.length > 1) {
            jsonData.pop();
            renderTable();
        } else {
            alert("Cannot delete the header row.");
        }
    };
    rowControls.appendChild(addRowBtn);
    rowControls.appendChild(deleteRowBtn);
    modalContent.appendChild(rowControls);

    const colControls = document.createElement('div');
    colControls.style.margin = '10px 0';
    const addColBtn = document.createElement('button');
    addColBtn.textContent = 'Add Column';
    addColBtn.style.margin = '0 5px';
    addColBtn.onclick = function () {
        // Add an empty cell to each row
        jsonData.forEach((row, index) => {
            row.push(index === 0 ? "New Column" : "");
        });
        renderTable();
    };
    const deleteColBtn = document.createElement('button');
    deleteColBtn.textContent = 'Delete Last Column';
    deleteColBtn.style.margin = '0 5px';
    deleteColBtn.onclick = function () {
        if (jsonData[0] && jsonData[0].length > 1) {
            jsonData.forEach(row => row.pop());
            renderTable();
        } else {
            alert("Cannot delete all columns.");
        }
    };
    colControls.appendChild(addColBtn);
    colControls.appendChild(deleteColBtn);
    modalContent.appendChild(colControls);

    // Save and Cancel buttons for the editor
    const editorControls = document.createElement('div');
    editorControls.style.marginTop = '15px';
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save Changes';
    saveBtn.style.margin = '0 5px';
    saveBtn.onclick = function () {
        // Convert the updated jsonData to a formatted JSON string.
        const newJsonString = JSON.stringify(jsonData, null, 2);
        // Create the formatted code block with the updated JSON string.
        const formattedCode = `# Specify the DataFrame name ('df' is default)
dataframe_name = "df"  
import pandas as pd, json

data_raw = r'''
${newJsonString}
'''
# Dynamically create the DataFrame with the specified name
data_json = json.loads(data_raw)
globals()[dataframe_name] = pd.DataFrame(data_json[1:], columns=data_json[0])

# Access the dynamically created DataFrame
print(f"The DataFrame '{dataframe_name}' has been created successfully.")
print(f"Shape of the DataFrame: {globals()[dataframe_name].shape}")
print(f"Columns in the DataFrame: {', '.join(map(str, globals()[dataframe_name].columns))}")`;
        // Update the code cell via CodeMirror
        const cmElem = cell.querySelector('.CodeMirror');
        if (cmElem && cmElem.CodeMirror) {
            cmElem.CodeMirror.setValue(formattedCode);
            // Optionally trigger the execute button
            const executeButton = cell.querySelector('.sagecell_evalButton.ui-button.ui-corner-all.ui-widget');
            if (executeButton) {
                executeButton.click();
            }
        } else {
            console.error("CodeMirror instance not found in cell.");
        }
        document.body.removeChild(modal);
    };
    const cancelEditorBtn = document.createElement('button');
    cancelEditorBtn.textContent = 'Cancel';
    cancelEditorBtn.style.margin = '0 5px';
    cancelEditorBtn.onclick = function () {
        document.body.removeChild(modal);
    };
    editorControls.appendChild(saveBtn);
    editorControls.appendChild(cancelEditorBtn);
    modalContent.appendChild(editorControls);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}


function importExcelJsonToCell(cell) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    // Accept only Excel files
    fileInput.accept = '.xlsx,.xls';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = e.target.result;
            try {
                // Using SheetJS (XLSX) library to parse the file
                const workbook = XLSX.read(data, { type: 'binary' });
                // Get the first worksheet
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                // Convert the worksheet to JSON (array of arrays)
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                // Format and load the resulting JSON into the code cell
                formatAndLoadExcelJsonIntoCell(cell, jsonData);
            } catch (error) {
                console.error("Error converting Excel to JSON:", error);
                alert("Failed to convert Excel file to JSON.");
            }
        };
        reader.readAsBinaryString(file);
    });

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
}


function exportExcelJsonFromCell(cell) {
    const codeMirrorElem = cell.querySelector('.CodeMirror');
    let codeContent = "";
    if (codeMirrorElem && codeMirrorElem.CodeMirror) {
        codeContent = codeMirrorElem.CodeMirror.getValue();
    } else {
        codeContent = cell.textContent;
    }

    // Extract the JSON data from between r''' ... '''
    const regex = /data_raw\s*=\s*r'''([\s\S]*?)'''/;
    const match = codeContent.match(regex);
    if (match && match[1]) {
        const jsonString = match[1];
        try {
            const jsonData = JSON.parse(jsonString);
            // Create a new workbook and worksheet using SheetJS (XLSX)
            var wb = XLSX.utils.book_new();
            var ws = XLSX.utils.aoa_to_sheet(jsonData);
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
            // Write the workbook to a binary string
            var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
            // Helper function to convert a binary string to an ArrayBuffer
            function s2ab(s) {
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i = 0; i < s.length; i++) {
                    view[i] = s.charCodeAt(i) & 0xFF;
                }
                return buf;
            }
            // Use FileSaver to prompt a download of the workbook as an XLSX file
            saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "exported_data.xlsx");
        } catch (error) {
            console.error("Error parsing JSON data:", error);
            alert("Failed to parse JSON data from the cell.");
        }
    } else {
        alert("No Excel JSON data found in the selected cell.");
    }
}

function toggleMarkdownTips(cell) {
    let tipsPanel = cell.querySelector('.inline-markdown-tips');
    if (tipsPanel) {
        // Remove the tips panel if it exists
        tipsPanel.remove();
    } else {
        // Create the tips panel if it doesn't exist.
        tipsPanel = document.createElement('div');
        tipsPanel.className = 'inline-markdown-tips';
        tipsPanel.style.border = '1px solid #ccc';
        tipsPanel.style.backgroundColor = '#f9f9f9';
        tipsPanel.style.padding = '8px';
        tipsPanel.style.marginTop = '5px';
        tipsPanel.style.fontSize = '12px';
        tipsPanel.innerHTML = `
      <strong>Markdown Tips:</strong>
      <ul style="padding-left:16px; margin:5px 0;">
        <li>Use <code>*asterisks*</code> for <em>italics</em>.</li>
        <li>Use <code>**double asterisks**</code> for <strong>bold</strong> text.</li>
        <li>Start lines with <code>#</code> for headers (e.g. <code># Header1</code> or <code>## Header2</code>).</li>
        <li>Use <code>-</code> or <code>*</code> for list items.</li>
        <li>Insert <code>![alt text for figure](url or path to figure)</code> for inserting figures. Examples:</li>
        <ul style="padding-left:16px; margin:5px 0;">
            <li><code>![Figure 1](https://i.postimg.cc/jdThVHFH/elastic-pendulum.png)</code> for figures from online source.</li>
            <li><code>![Figure 2](elastic-pendulum.png)</code> for locally stored figures (in the same directory as this notebook).</li>
          </ul>
        <li>Use <code>\`code\`</code> for inline code.</li>
        <li>
          Use <code>$...$</code> for inline LaTeX formulas. Examples:
          <ul style="padding-left:16px; margin:5px 0;">
            <li><code>$x^2$</code>, <code>$x^{2+i}$</code>, <code>$x_1$</code>, <code>$x_{n+1}$</code> for superscripts and subscripts.</li>
            <li><code>$\\frac{a}{b}$</code>, <code>$\\dfrac{a}{b}$</code>, <code>$a \\cdot b$</code> for fractions and multiplications.</li>
            <li><code>$\\alpha \\beta \\gamma \\Gamma \\rho \\phi \\Phi \\varphi \\omega \\Omega$</code> for lowercase and uppercase greek letters.</li>
            <li><code>$\\sin \\cos \\tan \\exp \\ln$</code> for some elementary functions.</li>
            <li><code>$A \\! B \\, C \\:D \\; E \\ F \\quad G \\qquad H \\hspace{1cm} I ~ J$</code> for various types of spaces.</li>
            <li><code>$a=3~\\mathrm{m \\cdot s^{-2}}$</code> for physical quantities.</li>
          </ul>
        </li>
        <li>
          Use <code>$$...$$</code> for display math formulas.
        </li>
      </ul>
    `;
        // Insert the tips panel just after the control bar (assumed to be the first child).
        cell.insertBefore(tipsPanel, cell.children[1] || null);
    }
}

// Code Mirror
function convertToMarkdown(codeCell) {
    // Extract all lines of text from the code cell
    let codeText = '';

    // Try different ways to get the code content
    const codeMirrorInstance = codeCell.querySelector('.CodeMirror');
    if (codeMirrorInstance && codeMirrorInstance.CodeMirror) {
        // If there's a CodeMirror instance, get the value directly
        codeText = codeMirrorInstance.CodeMirror.getValue();
    } else {
        // Otherwise, try to extract from the DOM elements
        const codeLines = codeCell.querySelectorAll(".CodeMirror-code > div > pre > span");
        if (codeLines && codeLines.length > 0) {
            codeText = Array.from(codeLines)
                .map(line => line.textContent)
                .join('\n');
        } else {
            // Fallback method: try to get text from the input or a script element
            const input = codeCell.querySelector('.sagecell_input textarea');
            if (input) {
                codeText = input.value;
            } else {
                const scriptElem = codeCell.querySelector('script[type="text/x-sage"]');
                if (scriptElem) {
                    codeText = scriptElem.textContent;
                }
            }
        }
    }

    // Clean up zero-width spaces and other invisible characters
    codeText = codeText
        .replace(/[\u200B\u200C\u200D\uFEFF]/g, '') // Remove zero-width characters
        .replace(/\u00A0/g, ' '); // Replace non-breaking spaces with regular spaces

    // Create a unique ID for this editor
    const editorId = 'md-editor-' + Date.now();
    const previewId = 'preview-' + Date.now();

    // Create the markdown cell structure
    const markdownCell = document.createElement('div');
    markdownCell.className = 'nb-cell nb-markdown-cell';
    markdownCell.innerHTML = `
        <div class="editor-container" style="position: relative;">
            <textarea id="${editorId}" placeholder="Enter your Markdown or HTML here" 
                      style="width: 100%; height:150px; font-family: Consolas, 'Courier New', monospace;" 
                      data-original="">${codeText}</textarea>
        </div>
        <div id="${previewId}" class="markdown-preview"><p><em></em></p></div>
    `;

    // Replace the code cell with the new markdown cell
    codeCell.parentNode.replaceChild(markdownCell, codeCell);

    // Get the textarea element
    const textarea = markdownCell.querySelector(`#${editorId}`);

    // Update the data-original attribute
    textarea.setAttribute('data-original', codeText);

    // Initialize CodeMirror on the textarea
    const editor = CodeMirror.fromTextArea(textarea, {
        mode: 'markdown',
        lineNumbers: true,
        lineWrapping: true,
        theme: 'default',
        extraKeys: {"Ctrl-Space": "autocomplete"},
        autoCloseBrackets: true,
        matchBrackets: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
    });

    // Set initial height and save it to the element for reference
    editor.setSize(null, 150);
    markdownCell.querySelector('.CodeMirror').setAttribute('data-original-height', '150px');

    // Store the CodeMirror instance on the cell for later access
    markdownCell.cmEditor = editor;

    // Set up real-time preview updates
    editor.on('change', () => {
        renderMarkdownWithCM(editor, markdownCell.querySelector(`#${previewId}`));
    });

    // Trigger initial render
    renderMarkdownWithCM(editor, markdownCell.querySelector(`#${previewId}`));

    // Hide the editor initially (consistent with your existing functionality)
    markdownCell.querySelector('.CodeMirror').style.display = 'block';
    markdownCell.querySelector(`#${previewId}`).style.display = 'block';

    removeControlBar(markdownCell);
    // Add control bar
    addControlBar(markdownCell);
    reprocessNotebook();
}

// Ensure we have this helper function for rendering
function renderMarkdownWithCM(editor, previewElement) {
    // Get content and clean it of zero-width spaces
    const content = editor.getValue().replace(/[\u200B\u200C\u200D\uFEFF]/g, '');

    // Use texme if available, otherwise fallback to basic HTML
    if (typeof texme !== 'undefined' && texme.render) {
        previewElement.innerHTML = texme.render(content);
    } else if (typeof marked !== 'undefined') {
        previewElement.innerHTML = marked.parse(content);
    } else {
        previewElement.innerHTML = `<p>${content}</p>`;
    }

    // Ensure all hyperlinks in the preview open in a new tab
    previewElement.querySelectorAll('a').forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });

    // Render LaTeX if available
    if (typeof renderMathInElement !== 'undefined') {
        renderMathInElement(previewElement, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ],
            throwOnError: false
        });
    } else if (window.MathJax) {
        window.MathJax.texReset();
        window.MathJax.typesetPromise([previewElement]);
    }
}

function toggleMarkdownMode() {
    document.querySelectorAll('.nb-cell.nb-markdown-cell').forEach(cell => {
        // Handle CodeMirror cells
        if (cell.cmEditor) {
            const cmElement = cell.querySelector('.CodeMirror');
            const preview = cell.querySelector('.markdown-preview');

            if (editMode) {
                // Switch to edit mode
                cmElement.style.display = 'block';
                preview.style.display = 'block';
                cell.cmEditor.refresh(); // Important: CM needs a refresh when shown
            } else {
                // Switch to preview mode
                cmElement.style.display = 'none';
                preview.style.display = 'block';

                // Update the preview with the latest content
                renderMarkdownWithCM(cell.cmEditor, preview);
            }
            return;
        }

        // Handle traditional cells
        const input = cell.querySelector('[id^="mdinput"]');
        const preview = cell.querySelector('[id^="preview"]');

        if (input && preview) {
            if (editMode) {
                // Show input, hide preview
                input.value = input.getAttribute('data-original') || '';
                input.style.display = 'block';
                preview.style.display = 'block';
            } else {
                // Store original markdown
                input.setAttribute('data-original', input.value);

                // Render content
                if (typeof renderMarkdown === 'function') {
                    renderMarkdown(input, preview);
                } else if (typeof texme !== 'undefined' && texme.render) {
                    preview.innerHTML = texme.render(input.value);

                    // Process math if available
                    if (window.MathJax) {
                        window.MathJax.texReset();
                        window.MathJax.typesetPromise([preview]);
                    }
                }

                // Hide input, show preview
                input.style.display = 'none';
                preview.style.display = 'block';
            }
        }
    });

    // Toggle global edit mode
    editMode = !editMode;
}

function createMarkdownCell(content = '') {
    // Create a unique ID for this editor
    const editorId = 'md-editor-' + Date.now();
    const previewId = 'preview-' + Date.now();

    // If content is empty, set a default placeholder that will render nicely
    const initialContent = content
    const markdownCell = document.createElement('div');
    markdownCell.className = 'nb-cell nb-markdown-cell';
    markdownCell.innerHTML = `
        <div class="editor-container">
            <textarea id="${editorId}" placeholder="Enter your Markdown or HTML here" 
                      class="markdown-textarea"
                      data-original="">${initialContent}</textarea>
        </div>
        <div id="${previewId}" class="markdown-preview"></div>
    `;

    // Initialize CodeMirror after the element is in the DOM
    setTimeout(() => {
        const textarea = markdownCell.querySelector(`#${editorId}`);

        // Initialize CodeMirror on the textarea
        const editor = CodeMirror.fromTextArea(textarea, {
            mode: 'markdown',
            lineNumbers: true,
            lineWrapping: true,
            theme: 'default',
            extraKeys: {"Ctrl-Space": "autocomplete"},
            autoCloseBrackets: true,
            matchBrackets: true,
            foldGutter: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
        });

        // Set initial height
        editor.setSize(null, 150);
        markdownCell.querySelector('.CodeMirror').setAttribute('data-original-height', '150px');

        // Store the CodeMirror instance on the cell for later access
        markdownCell.cmEditor = editor;

        // Set up real-time preview updates
        editor.on('change', () => {
            renderMarkdownWithCM(editor, markdownCell.querySelector(`#${previewId}`));
        });

        // Initial render
        renderMarkdownWithCM(editor, markdownCell.querySelector(`#${previewId}`));

        // Set display based on global edit mode
        const cmElement = markdownCell.querySelector('.CodeMirror');
        const preview = markdownCell.querySelector(`#${previewId}`);

        if (typeof editMode !== 'undefined' && editMode) {
            // Edit mode: show both editor and preview
            cmElement.style.display = 'block';
            preview.style.display = 'block';
        } else {
            // View mode: hide editor, show preview
            cmElement.style.display = 'none';
            preview.style.display = 'block';

            // Add a special class to help style empty cell previews
            if (!content) {
                preview.classList.add('empty-markdown-preview');
            }
        }

        // Add control bar
        addControlBar(markdownCell);

        // Add click handler to easily edit empty cells by clicking on them
        if (!content) {
            preview.addEventListener('click', function(e) {
                if (preview.classList.contains('empty-markdown-preview')) {
                    toggleSingleCellEditMode(markdownCell);
                    e.preventDefault();
                    // Remove the empty class once it's been clicked
                    preview.classList.remove('empty-markdown-preview');
                }
            });
        }
    }, 0);

    return markdownCell;
}


function updateMarkdownPreview(cell) {
    // Check if this is a CodeMirror-based cell
    if (cell.cmEditor) {
        const preview = cell.querySelector('.markdown-preview');
        if (preview) {
            renderMarkdownWithCM(cell.cmEditor, preview);

            // Make sure preview is visible
            preview.style.display = 'block';
        }
        return;
    }

    // Fallback for traditional cells
    const input = cell.querySelector('[id^="mdinput"]');
    const preview = cell.querySelector('[id^="preview"]');

    if (!input || !preview) {
        console.error("Input or preview element not found in the cell.");
        return;
    }

    // Store original markdown
    input.setAttribute('data-original', input.value);

    // Render the markdown
    if (typeof renderMarkdown === 'function') {
        renderMarkdown(input, preview);
    } else if (typeof texme !== 'undefined' && texme.render) {
        preview.innerHTML = texme.render(input.value);

        // Process math if available
        if (window.MathJax) {
            window.MathJax.texReset();
            window.MathJax.typesetPromise([preview]);
        }
    }

    // Show both input and preview
    input.style.display = 'block';
    preview.style.display = 'block';
}

function toggleMarkdownMode() {
    document.querySelectorAll('.nb-cell.nb-markdown-cell').forEach(cell => {
        // Handle CodeMirror cells
        if (cell.cmEditor) {
            const cmElement = cell.querySelector('.CodeMirror');
            const preview = cell.querySelector('.markdown-preview');

            if (editMode) {
                // Switch to edit mode
                cmElement.style.display = 'block';
                preview.style.display = 'block';
                cell.cmEditor.refresh(); // Important: CM needs a refresh when shown
            } else {
                // Switch to preview mode
                cmElement.style.display = 'none';
                preview.style.display = 'block';

                // Update the preview with the latest content
                renderMarkdownWithCM(cell.cmEditor, preview);
            }
            return;
        }

        // Handle traditional cells
        const input = cell.querySelector('[id^="mdinput"]');
        const preview = cell.querySelector('[id^="preview"]');

        if (input && preview) {
            if (editMode) {
                // Show input, hide preview
                input.value = input.getAttribute('data-original') || '';
                input.style.display = 'block';
                preview.style.display = 'block';
            } else {
                // Store original markdown
                input.setAttribute('data-original', input.value);

                // Render content
                if (typeof renderMarkdown === 'function') {
                    renderMarkdown(input, preview);
                } else if (typeof texme !== 'undefined' && texme.render) {
                    preview.innerHTML = texme.render(input.value);

                    // Process math if available
                    if (window.MathJax) {
                        window.MathJax.texReset();
                        window.MathJax.typesetPromise([preview]);
                    }
                }

                // Hide input, show preview
                input.style.display = 'none';
                preview.style.display = 'block';
            }
        }
    });

    // Toggle global edit mode
    editMode = !editMode;
}

// 2) Inicializácia po načítaní stránky
function initializeMarkdownCells() {
    console.log("Initializing markdown cells...");
    document.querySelectorAll('.nb-cell.nb-markdown-cell').forEach(cell => {
        // získať pôvodný text
        let content = '';
        const textarea = cell.querySelector('textarea');
        if (textarea) {
            content = textarea.getAttribute('data-original') || textarea.value || '';
        } else {
            const preview = cell.querySelector('.markdown-preview');
            if (preview) content = preview.getAttribute('data-original-markdown') || preview.textContent;
        }

        // ak už má cell.cmEditor => preskoč
        if (cell.cmEditor) return;

        // nanovo vytvoriť CodeMirror
        setTimeout(() => {
            const editor = CodeMirror.fromTextArea(cell.querySelector('textarea'), {
                mode: 'markdown',
                lineNumbers: true,
                lineWrapping: true,
                theme: 'default',
                autoCloseBrackets: true,
                matchBrackets: true,
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
            });
            editor.setSize(null, 150);
            cell.cmEditor = editor;

            // live update preview
            editor.on('change', () => {
                renderMarkdownWithCM(editor, cell.querySelector('.markdown-preview'));
            });

            // prvotné vykreslenie
            renderMarkdownWithCM(editor, cell.querySelector('.markdown-preview'));

            // podľa global editMode buď zobraz Edit+Preview, alebo len Preview
            const cmEl = cell.querySelector('.CodeMirror');
            const preview = cell.querySelector('.markdown-preview');
            if (editMode) {
                cmEl.style.display = 'block';
                preview.style.display = 'block';
            } else {
                cmEl.style.display = 'none';
                preview.style.display = 'block';
            }
        }, 0);
    });
}

function convertToCode(markdownCell) {
    // Get content from the markdown cell
    let markdownText = '';

    if (markdownCell.cmEditor) {
        markdownText = markdownCell.cmEditor.getValue();
    } else {
        const textareas = markdownCell.querySelectorAll('textarea');
        if (textareas.length > 0) {
            // Use only the first textarea
            markdownText = textareas[0].value;
        } else {
            console.error('Could not find content in markdown cell');
            return;
        }
    }

    // Check if the content contains textarea tags and sanitize if needed
    if (markdownText.includes('<textarea')) {
        markdownText = markdownText.replace(/<textarea/g, '&lt;textarea');
    }

    // Clean content
    markdownText = markdownText.replace(/[\u200B]/g, '');

    // Use your existing createCodeCell function
    const codeCell = createCodeCell(markdownText);

    // Replace the markdown cell
    markdownCell.parentNode.replaceChild(codeCell, markdownCell);

    // Process notebook
    reprocessNotebook();

    // Add control bar after a delay and clean up any duplicate compute divs
    setTimeout(() => {
        addControlBar(codeCell);

        // Remove duplicate compute elements if any exist
        const computeDivs = codeCell.querySelectorAll('.compute');
        if (computeDivs.length > 1) {
            Array.from(computeDivs).slice(1).forEach(div => div.remove());
        }
    }, 300);
}

function collectNotebookText() {
    const cells = document.querySelectorAll('.nb-cell');
    const outputs = [];
    let codeCellCount = 1;

    cells.forEach((cell, index) => {
        let cellText = '';

        if (cell.classList.contains('nb-markdown-cell')) {
            let markdownContent = '';

            // Check if this is a CodeMirror cell
            if (cell.cmEditor) {
                markdownContent = cell.cmEditor.getValue().replace(/[\u200B]/g, '');
            } else {
                // Try to get text from the hidden textarea
                const textarea = cell.querySelector('textarea');
                if (textarea) {
                    markdownContent = textarea.value.replace(/[\u200B]/g, '');
                }
            }

            cellText = `@Markdown[${index + 1}]:\n${markdownContent}`;
        } else if (cell.classList.contains('nb-code-cell')) {
            // Use your existing function to extract code
            const codeText = getCodeFromCell(cell, codeCellCount - 1);
            cellText = `@${codeText}`;
            codeCellCount++;
        }

        if (cellText) {
            outputs.push(cellText);
        }
    });

    // Join each cell's content with the separator
    return outputs.join('\n@=================\n').trim();
}

// 3) Prepínanie pre jednotlivú bunku (len keď je CodeMirror prítomný)
function toggleSingleCellEditMode(cell) {
    const button = cell.querySelector('.control-bar button:first-child');
    if (!cell.cmEditor) {
        console.warn("toggleSingleCellEditMode: cell has no CodeMirror editor (likely after saving)");
        return;
    }

    const cmElement = cell.querySelector('.CodeMirror');
    const preview = cell.querySelector('.markdown-preview');
    const isCurrentlyView = button.textContent === 'Edit';

    if (isCurrentlyView) {
        cmElement.style.display = 'block';
        preview.style.display = 'block';
        cell.cmEditor.refresh();
        button.textContent = 'View';
    } else {
        cmElement.style.display = 'none';
        preview.style.display = 'block';
        renderMarkdownWithCM(cell.cmEditor, preview);
        button.textContent = 'Edit';
    }
}


function addMarkdownCell(referenceCell, position, initialContent = '') {
    const markdownCell = createMarkdownCell(initialContent);

    // Insert the new cell at the specified position
    if (position === 'above') {
        referenceCell.parentNode.insertBefore(markdownCell, referenceCell);
    } else {
        referenceCell.parentNode.insertBefore(markdownCell, referenceCell.nextSibling);
    }
    return markdownCell;
}

// 1) Zjednodušenie pred uložením
function simplifyMarkdownCellsForSaving() {
    console.log("Simplifying markdown cells for saving...");

    // odstráň všetky control bary
    document.querySelectorAll('.control-bar, .control-ai-bar, .inline-markdown-tips')
        .forEach(el => el.remove());

    document.querySelectorAll('.nb-markdown-cell').forEach(cell => {
        let content = '';

        if (cell.cmEditor) {
            content = cell.cmEditor.getValue().replace(/[\u200B\u200C\u200D\uFEFF]/g, '');
            // zrušíme CodeMirror
            cell.cmEditor.toTextArea();
            cell.cmEditor = null;
        } else {
            const textarea = cell.querySelector('textarea');
            if (textarea) content = textarea.value;
        }

        // textarea s obsahom ostáva
        const textarea = cell.querySelector('textarea');
        if (textarea) {
            textarea.value = content;
            textarea.setAttribute('data-original', content);
            textarea.style.display = 'none';
        }

        // preview s obsahom
        const preview = cell.querySelector('.markdown-preview');
        if (preview) {
            preview.setAttribute('data-original-markdown', content);
            preview.style.display = 'block';
            preview.innerHTML = (typeof texme !== 'undefined' && texme.render)
                ? texme.render(content)
                : content;
        }

        // odstráň DOM elementy codemirroru
        cell.querySelectorAll('.CodeMirror').forEach(cm => cm.remove());
    });
}

function copyOutputToMarkdown(cell) {
    // Check if this is an AI cell
    const isAICell = cell.querySelector('.CodeMirror') &&
        cell.querySelector('.CodeMirror').CodeMirror &&
        cell.querySelector('.CodeMirror').CodeMirror.getValue().includes('# -START OF AI CELL-');

    // Find all output elements
    const outputContainer = cell.querySelector('.sagecell_sessionOutput');

    if (!outputContainer) {
        console.log("No output container found to copy");
        return;
    }

    // Skip spinners
    const spinners = outputContainer.querySelectorAll('.sagecell_spinner');
    spinners.forEach(spinner => spinner.remove());

    let outputContent = '';
    let hasContent = false;

    // Set to track items we've already processed
    const processedItems = new Set();

    // Helper function to add content if it hasn't been added already
    function addUniqueContent(content, id) {
        if (!processedItems.has(id)) {
            outputContent += content;
            processedItems.add(id);
            hasContent = true;
            return true;
        }
        return false;
    }

    // Handle error outputs (sagecell_pyerr)
    const errorElements = outputContainer.querySelectorAll('.sagecell_pyerr');
    if (errorElements.length > 0) {
        // Use only the first error element if multiple exist
        const error = errorElements[0];
        addUniqueContent('<!-- sage output error -->\n' + error.outerHTML + '\n\n', 'error-' + error.textContent.substring(0, 50))
    }

    // Handle images (plots)
    const imageElements = outputContainer.querySelectorAll('img:not(.sagecell_spinner)');
    let images = Array.from(imageElements).filter(img =>
        img.src.includes('sagecell.sagemath.org/kernel') &&
        !img.classList.contains('sagecell_spinner')
    );

    // Deduplicate images based on src
    const uniqueImageUrls = new Set();
    images = images.filter(img => {
        if (uniqueImageUrls.has(img.src)) {
            return false;
        }
        uniqueImageUrls.add(img.src);
        return true;
    });

    // Handle plain text outputs
    const preElements = outputContainer.querySelectorAll('pre:not(.sagecell_stdout):not(.sagecell_pyerr)');
    if (preElements.length > 0) {
        // Use only the first pre element if they have the same content
        const uniquePreContents = new Map();

        preElements.forEach(pre => {
            const content = pre.textContent.trim();
            if (!uniquePreContents.has(content)) {
                uniquePreContents.set(content, pre);
                addUniqueContent('<!-- sage output text -->\n' + content + '\n\n', 'pre-' + content.substring(0, 50));
            }
        });
    }

    // Handle MathJax containers
    const mjxContainers = outputContainer.querySelectorAll('mjx-container');
    if (mjxContainers.length > 0) {
        // Track unique MathJax expressions
        const uniqueMathJax = new Set();

        mjxContainers.forEach(container => {
            // Generate a signature for this MathJax content
            const mathText = container.querySelector('mjx-assistive-mml')?.textContent || container.textContent;
            const mathSignature = 'mathjax-' + mathText.substring(0, 50);

            if (!uniqueMathJax.has(mathSignature)) {
                uniqueMathJax.add(mathSignature);

                // Find the parent div containing the MathJax
                let mjxParent = container.closest('div');
                if (mjxParent) {
                    addUniqueContent('<!-- sage output math -->\n' + mjxParent.outerHTML + '\n\n', mathSignature);
                }
            }
        });
    }

    // Handle stdout
    const stdoutElements = outputContainer.querySelectorAll('.sagecell_stdout');
    if (stdoutElements.length > 0) {
        // Use only the first stdout if multiple exist
        const stdout = stdoutElements[0];
        const stdoutContent = isAICell ?
            stdout.textContent.trim() + '\n\n' :
            stdout.outerHTML + '\n\n';

        addUniqueContent(stdoutContent, 'stdout-' + stdout.textContent.substring(0, 50));
    }

    // Handle dataframes
    const dataframeElements = outputContainer.querySelectorAll('.dataframe');
    if (dataframeElements.length > 0) {
        // Use only the first dataframe if multiple exist with same structure
        const dataframe = dataframeElements[0];

        // Get the parent container with all styles
        let tableParent = dataframe.closest('div');
        if (tableParent) {
            // Use number of rows and columns as signature
            const rowCount = dataframe.querySelectorAll('tr').length;
            const colCount = dataframe.querySelector('tr')?.querySelectorAll('th, td').length || 0;
            const dfSignature = `dataframe-${rowCount}x${colCount}`;

            addUniqueContent('<!-- sage output dataframe -->\n' + tableParent.outerHTML + '\n\n', dfSignature);
        } else {
            addUniqueContent('<!-- sage output dataframe -->\n' + dataframe.outerHTML + '\n\n', 'dataframe');
        }
    }

    // If we have no content yet but have images, we'll handle those later
    if (!hasContent && images.length === 0) {
        console.log("No valid output content found to copy");
        return;
    }

    // Create a new markdown cell below the current cell
    const newMarkdownCell = addMarkdownCell(cell, 'below', outputContent);

    // Process images if any exist
    if (images.length > 0) {
        // Show a loading indicator if we're waiting for images
        if (newMarkdownCell.cmEditor) {
            const loadingText = outputContent ?
                outputContent + "\n\n*Loading image(s)...*" :
                "*Loading image(s)...*";
            newMarkdownCell.cmEditor.setValue(loadingText);
        }

        // Try different methods to handle images
        processImagesWithFallbacks(images, 0, outputContent, newMarkdownCell);
    } else {
        // No images to process, just finalize the cell
        finalizeMarkdownCell(newMarkdownCell, outputContent);
    }
}

// Improved function to process images with multiple fallback methods
function processImagesWithFallbacks(images, index, currentContent, markdownCell) {
    if (index >= images.length) {
        // All images processed, finalize the cell
        finalizeMarkdownCell(markdownCell, currentContent);
        return;
    }

    const currentImage = images[index];

    // Only process images from sagecell
    if (currentImage.src.includes('sagecell.sagemath.org/kernel')) {
        // Method 1: Try using convertImageToBase64 first
        convertImageToBase64(currentImage.src)
            .then(base64String => {
                addImageToContent();

                // Helper to add image
                function addImageToContent() {
                    // Add a line break before images if needed
                    if (currentContent && !currentContent.endsWith('\n\n')) {
                        currentContent += '\n\n';
                    }

                    // Add the embedded image to our markdown
                    currentContent += `<!-- sage output image -->\n![Output Image ${index + 1}](${base64String})\n\n`;

                    // Update the cell with progress
                    if (markdownCell.cmEditor) {
                        markdownCell.cmEditor.setValue(currentContent);
                    }

                    // Process next image
                    processImagesWithFallbacks(images, index + 1, currentContent, markdownCell);
                }
            })
            .catch(error => {
                console.warn("Error with method 1, trying method 2:", error);

                // Method 2: Try using fetch API
                fetch(currentImage.src)
                    .then(response => response.blob())
                    .then(blob => {
                        return new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.onerror = reject;
                            reader.readAsDataURL(blob);
                        });
                    })
                    .then(dataUrl => {
                        // Add a line break before images if needed
                        if (currentContent && !currentContent.endsWith('\n\n')) {
                            currentContent += '\n\n';
                        }

                        // Add the embedded image to our markdown
                        currentContent += `<!-- sage output image -->\n![Output Image ${index + 1}](${dataUrl})\n\n`;

                        // Update the cell with progress
                        if (markdownCell.cmEditor) {
                            markdownCell.cmEditor.setValue(currentContent);
                        }

                        // Process next image
                        processImagesWithFallbacks(images, index + 1, currentContent, markdownCell);
                    })
                    .catch(fetchError => {
                        console.warn("All methods failed, using original URL:", fetchError);

                        // Fallback to original URL if all methods fail
                        if (currentContent && !currentContent.endsWith('\n\n')) {
                            currentContent += '\n\n';
                        }

                        // Add a direct link with warning
                        currentContent += `<!-- sage output image -->\n![Output Image ${index + 1}](${currentImage.src})\n\n`;
                        currentContent += "*Note: Could not convert image to embedded format. This URL may expire.*\n\n";

                        // Update the cell
                        if (markdownCell.cmEditor) {
                            markdownCell.cmEditor.setValue(currentContent);
                        }

                        processImagesWithFallbacks(images, index + 1, currentContent, markdownCell);
                    });
            });
    } else {
        // Skip non-sagecell images
        processImagesWithFallbacks(images, index + 1, currentContent, markdownCell);
    }
}

// Improved convertImageToBase64 function with better error handling
function convertImageToBase64(url) {
    return new Promise((resolve, reject) => {
        // Add a cache-busting parameter to avoid caching issues
        const cacheBustUrl = url.includes('?') ?
            `${url}&_=${new Date().getTime()}` :
            `${url}?_=${new Date().getTime()}`;

        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Try to handle CORS issues

        // Set timeout to prevent hanging
        const timeoutId = setTimeout(() => {
            reject(new Error('Image loading timed out'));
        }, 10000); // 10 second timeout

        img.onload = function() {
            clearTimeout(timeoutId);
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                // Get the data URL (base64 encoded image)
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            } catch (e) {
                reject(e);
            }
        };

        img.onerror = function(e) {
            clearTimeout(timeoutId);
            reject(new Error(`Failed to load image: ${e.message}`));
        };

        // Set src after setting up event handlers
        img.src = cacheBustUrl;

        // If the image is already loaded (from cache), manually trigger onload
        if (img.complete) {
            img.onload();
        }
    });
}

// Finalizes a markdown cell with the provided content and sets it to the specified view mode

function finalizeMarkdownCell(markdownCell, content, viewMode = 'view') {
    if (!markdownCell.cmEditor) {
        console.log("No editor found for markdown cell");
        return;
    }

    // Remove any loading indicators
    content = content.replace('*Loading image(s)...*', '');

    // Set final content
    markdownCell.cmEditor.setValue(content);

    // Force a refresh of the editor to make sure content is fully registered
    markdownCell.cmEditor.refresh();

    // Give the content time to fully render before setting view mode
    setTimeout(() => {
        // Determine the current mode
        const isCurrentlyEditing = markdownCell.classList.contains('edit-mode');
        const shouldToggle = (viewMode === 'view' && isCurrentlyEditing) ||
            (viewMode === 'edit' && !isCurrentlyEditing);

        // Toggle only if needed to reach the desired state
        if (shouldToggle) {
            toggleSingleCellEditMode(markdownCell);
        }

        // Another short delay before focusing to ensure any toggle is complete
        setTimeout(() => {
            // Process any MathJax content if MathJax is available and we're in view mode
            if (window.MathJax && viewMode === 'view') {
                window.MathJax.typeset();
            }

            // Focus on the cell
            if (markdownCell.cmEditor) {
                markdownCell.cmEditor.focus();
            }

            console.log(`Markdown cell finalized and set to ${viewMode} mode`);
        }, 100); // 100ms delay after any toggle
    }, 300); // 300ms delay before any toggle
}

// Add numbering to all SageCells
function addSageCellNumbering() {
    const codeCells = document.querySelectorAll('div.nb-code-cell');

    codeCells.forEach((cell, index) => {
        // Create the number label
        const numberLabel = document.createElement('div');
        numberLabel.className = 'sagecell-number';
        numberLabel.textContent = `[${index + 1}]`;

        // Add the label to the nb-code-cell div
        cell.appendChild(numberLabel);
    });

    // Add the CSS for numbering
    addSageCellNumberingCSS();
}

// Separate function for CSS
function addSageCellNumberingCSS() {
    // Check if the styles already exist
    if (!document.getElementById('sagecell-numbering-css')) {
        const style = document.createElement('style');
        style.id = 'sagecell-numbering-css';
        style.textContent = `
            div.nb-code-cell {
                position: relative;
            }
            .sagecell-number {
                position: absolute;
                left: -35px;
                top: 5px;
                font-family: consolas;
                color: blue;
                font-size: 14px;
                font-weight: normal;
                width: 30px;
                text-align: right;
            }
        `;
        document.head.appendChild(style);
    }
}

// Function to remove all cell numbering
function removeSageCellNumbering() {
    // Remove all number labels
    const numberLabels = document.querySelectorAll('.sagecell-number');
    numberLabels.forEach(label => {
        label.remove();
    });

    // Remove the CSS
    const styleElement = document.getElementById('sagecell-numbering-css');
    if (styleElement) {
        styleElement.remove();
    }
}

// Interactive elements

// Function to generate and display an interactive table of contents
function createTableOfContents() {
    // Check if TOC already exists
    if (document.getElementById('notebook-toc')) {
        toggleTableOfContents();
        return;
    }

    // Create TOC container - made smaller (width and spacing)
    const tocContainer = document.createElement('div');
    tocContainer.id = 'notebook-toc';
    tocContainer.className = 'notebook-toc';
    tocContainer.style.position = 'fixed';
    tocContainer.style.top = '60px';
    tocContainer.style.left = '0';
    tocContainer.style.width = '250px'; // Reduced from 280px
    tocContainer.style.maxHeight = 'calc(100vh - 80px)';
    tocContainer.style.backgroundColor = '#f8f9fa';
    tocContainer.style.boxShadow = '2px 0 5px rgba(0,0,0,0.1)';
    tocContainer.style.zIndex = '9990';
    tocContainer.style.borderRadius = '0 5px 5px 0';
    tocContainer.style.transition = 'transform 0.3s ease-in-out';
    tocContainer.style.transform = 'translateX(-250px)'; // Adjusted to match new width
    tocContainer.style.display = 'flex';
    tocContainer.style.flexDirection = 'column';
    tocContainer.style.overflowY = 'auto';
    tocContainer.style.fontSize = '13px'; // Smaller font size overall

    // Create header - made smaller
    const header = document.createElement('div');
    header.className = 'toc-header';
    header.style.padding = '8px 12px'; // Reduced padding
    header.style.borderBottom = '1px solid #dee2e6';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.backgroundColor = '#4CAF50';
    header.style.color = 'white';
    header.style.position = 'sticky';
    header.style.top = '0';
    header.style.zIndex = '1';

    const title = document.createElement('h3');
    title.textContent = 'Table of Contents';
    title.style.margin = '0';
    title.style.fontSize = '15px'; // Reduced from 16px

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '18px'; // Reduced from 20px
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.padding = '0 5px';
    closeBtn.onclick = toggleTableOfContents;

    header.appendChild(title);
    header.appendChild(closeBtn);
    tocContainer.appendChild(header);

    // Create content area for TOC items - adjusted padding
    const tocContent = document.createElement('div');
    tocContent.className = 'toc-content';
    tocContent.style.padding = '6px 0'; // Reduced from 10px
    tocContent.style.flex = '1';
    tocContent.style.overflowY = 'auto';
    tocContainer.appendChild(tocContent);

    // Add toolbar with options - smaller buttons and spacing
    const tocToolbar = document.createElement('div');
    tocToolbar.className = 'toc-toolbar';
    tocToolbar.style.padding = '6px 12px'; // Reduced from 8px 15px
    tocToolbar.style.borderTop = '1px solid #dee2e6';
    tocToolbar.style.display = 'flex';
    tocToolbar.style.justifyContent = 'space-between';
    tocToolbar.style.backgroundColor = '#f0f0f0';

    // Add refresh button - smaller
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = 'Refresh TOC';
    refreshBtn.style.padding = '4px 8px'; // Reduced from 5px 10px
    refreshBtn.style.backgroundColor = '#4CAF50';
    refreshBtn.style.color = 'white';
    refreshBtn.style.border = 'none';
    refreshBtn.style.borderRadius = '3px';
    refreshBtn.style.cursor = 'pointer';
    refreshBtn.style.fontSize = '11px'; // Reduced from 12px
    refreshBtn.onclick = updateTableOfContents;

    // Add collapse/expand all button - smaller
    const toggleAllBtn = document.createElement('button');
    toggleAllBtn.textContent = 'Collapse All';
    toggleAllBtn.dataset.state = 'expanded';
    toggleAllBtn.style.padding = '4px 8px'; // Reduced from 5px 10px
    toggleAllBtn.style.backgroundColor = '#607d8b';
    toggleAllBtn.style.color = 'white';
    toggleAllBtn.style.border = 'none';
    toggleAllBtn.style.borderRadius = '3px';
    toggleAllBtn.style.cursor = 'pointer';
    toggleAllBtn.style.fontSize = '11px'; // Reduced from 12px
    toggleAllBtn.onclick = function() {
        const tocItems = document.querySelectorAll('.toc-item');
        if (this.dataset.state === 'expanded') {
            // Collapse all
            tocItems.forEach(item => {
                const sublist = item.querySelector('ul');
                if (sublist) {
                    sublist.style.display = 'none';
                    item.classList.remove('expanded');
                    item.classList.add('collapsed');
                }
            });
            this.dataset.state = 'collapsed';
            this.textContent = 'Expand All';
        } else {
            // Expand all
            tocItems.forEach(item => {
                const sublist = item.querySelector('ul');
                if (sublist) {
                    sublist.style.display = 'block';
                    item.classList.remove('collapsed');
                    item.classList.add('expanded');
                }
            });
            this.dataset.state = 'expanded';
            this.textContent = 'Collapse All';
        }
    };

    tocToolbar.appendChild(refreshBtn);
    tocToolbar.appendChild(toggleAllBtn);
    tocContainer.appendChild(tocToolbar);

    // Create toggle button (visible when TOC is hidden)
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'toc-toggle-btn';
    toggleBtn.innerHTML = '📑';
    toggleBtn.title = 'Toggle Table of Contents';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.top = '70px';
    toggleBtn.style.left = '10px';
    toggleBtn.style.zIndex = '9989';
    toggleBtn.style.width = '36px'; // Reduced from 40px
    toggleBtn.style.height = '36px'; // Reduced from 40px
    toggleBtn.style.borderRadius = '50%';
    toggleBtn.style.backgroundColor = '#4CAF50';
    toggleBtn.style.color = 'white';
    toggleBtn.style.border = 'none';
    toggleBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.fontSize = '18px'; // Reduced from 20px
    toggleBtn.style.display = 'flex';
    toggleBtn.style.alignItems = 'center';
    toggleBtn.style.justifyContent = 'center';
    toggleBtn.onclick = toggleTableOfContents;

    // Add CSS for TOC - reduced spacing between items
    const style = document.createElement('style');
    style.textContent = `
        .toc-list {
            list-style-type: none;
            padding-left: 12px; /* Reduced from 15px */
            margin: 0;
        }
        .toc-list-root {
            padding-left: 0;
        }
        .toc-item {
            margin: 2px 0; /* Reduced from 5px */
            position: relative;
        }
        .toc-link {
            display: flex;
            align-items: center;
            text-decoration: none;
            color: #333;
            padding: 3px 8px; /* Reduced from 5px 10px */
            border-radius: 3px;
            font-size: 13px; /* Reduced from 14px */
            transition: background-color 0.2s;
            cursor: pointer;
        }
        .toc-link:hover {
            background-color: #e9ecef;
        }
        .toc-link.active {
            background-color: #d1e7dd;
            font-weight: bold;
            color: #0d6efd;
        }
        .toc-toggle {
            width: 16px; /* Reduced from 20px */
            height: 16px; /* Reduced from 20px */
            margin-right: 4px; /* Reduced from 5px */
            cursor: pointer;
            background: none;
            border: none;
            padding: 0;
            font-size: 10px; /* Reduced from 12px */
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #777;
        }
        .toc-icon {
            transition: transform 0.2s;
        }
        .toc-item.collapsed .toc-icon {
            transform: rotate(-90deg);
        }
        .toc-text {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .toc-item.h1 > .toc-link { font-weight: bold; font-size: 14px; } /* Reduced from 15px */
        .toc-item.h2 > .toc-link { padding-left: 12px; } /* Reduced from 15px */
        .toc-item.h3 > .toc-link { padding-left: 24px; font-size: 12px; } /* Reduced from 30px and 13px */
        .toc-item.h4 > .toc-link { padding-left: 36px; font-size: 11px; color: #555; } /* Reduced from 45px and 12px */
        .toc-item.h5 > .toc-link, .toc-item.h6 > .toc-link { 
            padding-left: 48px; /* Reduced from 60px */
            font-size: 11px; /* Reduced from 12px */
            font-style: italic;
            color: #777;
        }
        
        #notebook-toc::-webkit-scrollbar {
            width: 6px; /* Reduced from 8px */
        }
        #notebook-toc::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        #notebook-toc::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
        }
        #notebook-toc::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
    `;
    document.head.appendChild(style);

    // Add TOC and toggle button to body
    document.body.appendChild(tocContainer);
    document.body.appendChild(toggleBtn);

    // Generate TOC content
    updateTableOfContents();

    // Show the TOC
    toggleTableOfContents();
}

// Toggle TOC visibility - updated for the new width
function toggleTableOfContents() {
    const toc = document.getElementById('notebook-toc');
    const toggleBtn = document.getElementById('toc-toggle-btn');

    if (toc) {
        const isVisible = toc.style.transform === 'translateX(0px)';

        if (isVisible) {
            // Hide TOC
            toc.style.transform = 'translateX(-250px)'; // Updated to match new width
            toggleBtn.style.left = '10px';
        } else {
            // Show TOC
            toc.style.transform = 'translateX(0px)';
            toggleBtn.style.left = '260px'; // Updated to match new width
        }
    }
}

// Generate TOC from markdown content - unchanged
function updateTableOfContents() {
    const tocContent = document.querySelector('.toc-content');
    if (!tocContent) return;

    // Clear current TOC
    tocContent.innerHTML = '';

    // Create root list
    const rootList = document.createElement('ul');
    rootList.className = 'toc-list toc-list-root';
    tocContent.appendChild(rootList);

    // Process all markdown cells
    const markdownCells = document.querySelectorAll('.nb-cell.nb-markdown-cell');
    let headers = [];
    let currentCell = 0;

    markdownCells.forEach((cell, cellIndex) => {
        // Get all header elements from the cell
        const headerElements = cell.querySelectorAll('h1, h2, h3, h4, h5, h6');

        headerElements.forEach(header => {
            // Only process if the header has an ID or text
            if (header.id || header.textContent.trim()) {
                // Ensure header has an ID for linking
                if (!header.id) {
                    header.id = 'header-' + cellIndex + '-' + headers.length;
                }

                headers.push({
                    id: header.id,
                    text: header.textContent.trim(),
                    level: parseInt(header.tagName.substring(1)),
                    cellIndex: cellIndex,
                    element: header
                });
            }
        });
    });

    // If no headers were found in the markdown preview, try to parse from CodeMirror content
    if (headers.length === 0) {
        markdownCells.forEach((cell, cellIndex) => {
            if (cell.cmEditor) {
                const content = cell.cmEditor.getValue();
                const lines = content.split('\n');

                lines.forEach((line, lineIndex) => {
                    // Match markdown headers (e.g., # Header, ## Subheader)
                    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
                    if (headerMatch) {
                        const level = headerMatch[1].length;
                        const text = headerMatch[2].trim();
                        const id = 'header-' + cellIndex + '-' + lineIndex;

                        headers.push({
                            id: id,
                            text: text,
                            level: level,
                            cellIndex: cellIndex,
                            lineIndex: lineIndex
                        });
                    }
                });
            }
        });
    }

    // Build TOC structure
    if (headers.length > 0) {
        buildTocStructure(headers, rootList);
    } else {
        // No headers found
        const noHeaders = document.createElement('div');
        noHeaders.style.padding = '12px'; // Reduced from 15px
        noHeaders.style.color = '#777';
        noHeaders.style.fontStyle = 'italic';
        noHeaders.style.fontSize = '12px'; // Added smaller font
        noHeaders.textContent = 'No headers found in the notebook. Add markdown cells with # Header, ## Subheader, etc.';
        tocContent.appendChild(noHeaders);
    }
}

// Build nested TOC structure from headers - unchanged
function buildTocStructure(headers, rootList) {
    // Build a hierarchical structure based on header levels
    const rootLevel = Math.min(...headers.map(h => h.level));

    // First pass - create all TOC items at root level
    const tocItems = headers.map(header => {
        const item = document.createElement('li');
        item.className = `toc-item h${header.level}`;
        item.dataset.id = header.id;
        item.dataset.level = header.level;

        const link = document.createElement('div');
        link.className = 'toc-link';
        link.onclick = function() {
            scrollToHeader(header);
        };

        // Add toggle button for potential children
        const toggle = document.createElement('button');
        toggle.className = 'toc-toggle';
        toggle.innerHTML = '<span class="toc-icon">▼</span>';
        toggle.style.visibility = 'hidden'; // Hide initially, will show if has children
        toggle.onclick = function(e) {
            e.stopPropagation();
            toggleTocItem(item);
        };

        const text = document.createElement('span');
        text.className = 'toc-text';
        text.textContent = header.text;

        link.appendChild(toggle);
        link.appendChild(text);
        item.appendChild(link);

        return item;
    });

    // Add all root level items
    tocItems.forEach((item, index) => {
        const header = headers[index];
        if (header.level === rootLevel) {
            rootList.appendChild(item);
        }
    });

    // Second pass - nest items based on header levels
    for (let i = 0; i < headers.length; i++) {
        const currentHeader = headers[i];
        const currentItem = tocItems[i];

        if (currentHeader.level === rootLevel) continue; // Skip root level items

        // Find the parent for this item
        let parentIndex = -1;
        for (let j = i - 1; j >= 0; j--) {
            if (headers[j].level < currentHeader.level) {
                parentIndex = j;
                break;
            }
        }

        if (parentIndex !== -1) {
            const parentItem = tocItems[parentIndex];

            // Check if parent already has a sublist
            let sublist = parentItem.querySelector('ul');
            if (!sublist) {
                sublist = document.createElement('ul');
                sublist.className = 'toc-list';
                parentItem.appendChild(sublist);

                // Show the toggle button
                const toggle = parentItem.querySelector('.toc-toggle');
                if (toggle) {
                    toggle.style.visibility = 'visible';
                }
            }

            sublist.appendChild(currentItem);
        }
    }

    // Initially expand all
    document.querySelectorAll('.toc-item').forEach(item => {
        const sublist = item.querySelector('ul');
        if (sublist) {
            sublist.style.display = 'block';
            item.classList.add('expanded');
        }
    });
}

// Toggle TOC item expansion - unchanged
function toggleTocItem(item) {
    const sublist = item.querySelector('ul');
    if (sublist) {
        if (item.classList.contains('expanded')) {
            // Collapse
            sublist.style.display = 'none';
            item.classList.remove('expanded');
            item.classList.add('collapsed');
        } else {
            // Expand
            sublist.style.display = 'block';
            item.classList.remove('collapsed');
            item.classList.add('expanded');
        }
    }
}

// Scroll to header with custom positioning - unchanged
function scrollToHeader(header) {
    // Clear any existing active classes
    document.querySelectorAll('.toc-link').forEach(link => {
        link.classList.remove('active');
    });

    let targetElement;

    if (header.element) {
        // If we have a direct reference to the DOM element
        targetElement = header.element;

        // Set active class on the TOC item
        const tocItem = document.querySelector(`.toc-item[data-id="${header.id}"] .toc-link`);
        if (tocItem) {
            tocItem.classList.add('active');
        }
    } else {
        // If we have a cell index and line index (from CodeMirror parsing)
        const markdownCells = document.querySelectorAll('.nb-cell.nb-markdown-cell');
        if (markdownCells.length > header.cellIndex) {
            const cell = markdownCells[header.cellIndex];

            // If the cell is collapsed, expand it first
            const toggleButton = cell.querySelector('.control-bar button:first-child');
            if (toggleButton && toggleButton.textContent === 'Edit') {
                // Click the edit button to expand the cell
                toggleButton.click();

                // Give time for the cell to expand
                setTimeout(() => {
                    // Now try to focus on the right line
                    if (cell.cmEditor) {
                        cell.cmEditor.setCursor(header.lineIndex, 0);
                        cell.cmEditor.focus();
                    }

                    // Scroll the cell into view with custom positioning
                    customScrollToElement(cell);

                    // Set active class on the TOC item
                    const tocItem = document.querySelector(`.toc-item[data-id="${header.id}"] .toc-link`);
                    if (tocItem) {
                        tocItem.classList.add('active');
                    }
                }, 300);

                return;
            }

            // If already expanded, just scroll to the cell
            targetElement = cell;
        }
    }

    // Scroll to the target element with custom positioning
    if (targetElement) {
        customScrollToElement(targetElement);

        // Visual feedback - highlight the header
        const originalBg = targetElement.style.backgroundColor;
        targetElement.style.backgroundColor = 'rgba(255, 255, 150, 0.5)';
        setTimeout(() => {
            targetElement.style.backgroundColor = originalBg;
        }, 2000);
    }
}

// Custom scroll function to position element at 20% from the top - unchanged
function customScrollToElement(element) {
    const rect = element.getBoundingClientRect();
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Calculate position to place element at 20% of viewport height
    const viewportHeight = window.innerHeight;
    const targetScrollTop = currentScrollTop + rect.top - (viewportHeight * 0.2);

    // Smooth scroll to the calculated position
    window.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
    });
}

// Watch for changes in markdown cells to update TOC - unchanged
function setupTocUpdateWatchers() {
    // Update TOC whenever a markdown cell is edited
    const observer = new MutationObserver(mutations => {
        let shouldUpdate = false;

        for (const mutation of mutations) {
            // If markdown content was changed
            if (mutation.type === 'childList' ||
                (mutation.type === 'attributes' && mutation.attributeName === 'style')) {
                shouldUpdate = true;
                break;
            }
        }

        if (shouldUpdate && document.getElementById('notebook-toc')) {
            // Debounce updates to avoid excessive processing
            clearTimeout(window.tocUpdateTimer);
            window.tocUpdateTimer = setTimeout(updateTableOfContents, 500);
        }
    });

    // Observe all markdown cells for changes
    document.querySelectorAll('.nb-cell.nb-markdown-cell').forEach(cell => {
        observer.observe(cell, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style']
        });
    });

    // Also watch for new cells being added to the notebook
    const notebookObserver = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                // If new cells were added
                mutation.addedNodes.forEach(node => {
                    if (node.classList && node.classList.contains('nb-cell')) {
                        // Update TOC after a delay to let the cell render
                        clearTimeout(window.tocUpdateTimer);
                        window.tocUpdateTimer = setTimeout(() => {
                            updateTableOfContents();

                            // Also observe this new cell
                            if (node.classList.contains('nb-markdown-cell')) {
                                observer.observe(node, {
                                    childList: true,
                                    subtree: true,
                                    attributes: true,
                                    attributeFilter: ['style']
                                });
                            }
                        }, 500);
                    }
                });
            }
        }
    });

    // Observe the notebook container for new cells
    const notebook = document.querySelector('.nb-worksheet');
    if (notebook) {
        notebookObserver.observe(notebook, { childList: true });
    }
}

// Initialize TOC functionality - made toggle button smaller
function initializeTableOfContents() {
    // Create smaller toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'toc-toggle-btn';
    toggleBtn.innerHTML = '📑';
    toggleBtn.title = 'Table of Contents';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.top = '70px';
    toggleBtn.style.left = '10px';
    toggleBtn.style.zIndex = '9989';
    toggleBtn.style.width = '36px'; // Reduced from 40px
    toggleBtn.style.height = '36px'; // Reduced from 40px
    toggleBtn.style.borderRadius = '50%';
    toggleBtn.style.backgroundColor = '#4CAF50';
    toggleBtn.style.color = 'white';
    toggleBtn.style.border = 'none';
    toggleBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.fontSize = '18px'; // Reduced from 20px
    toggleBtn.style.display = 'flex';
    toggleBtn.style.alignItems = 'center';
    toggleBtn.style.justifyContent = 'center';
    toggleBtn.onclick = createTableOfContents;

    // Add button to the page
    document.body.appendChild(toggleBtn);

    // Setup watchers for markdown changes
    setupTocUpdateWatchers();
}

// Run initialization when the page is loaded
window.addEventListener('load', initializeTableOfContents);

// Function to remove the table of contents and clean up all related elements
function removeTableOfContents() {
    // Remove the TOC container if it exists
    const tocContainer = document.getElementById('notebook-toc');
    if (tocContainer) {
        tocContainer.parentNode.removeChild(tocContainer);
    }

    // Remove the toggle button if it exists
    const toggleBtn = document.getElementById('toc-toggle-btn');
    if (toggleBtn) {
        toggleBtn.parentNode.removeChild(toggleBtn);
    }

    // Remove any TOC-related styles
    const styleTags = document.head.getElementsByTagName('style');
    for (let i = styleTags.length - 1; i >= 0; i--) {
        const styleContent = styleTags[i].textContent;
        // Check if this style element contains TOC-related CSS
        if (styleContent.includes('.toc-') || styleContent.includes('#notebook-toc')) {
            styleTags[i].parentNode.removeChild(styleTags[i]);
        }
    }

    // Clean up event listeners and observers
    if (window.tocUpdateTimer) {
        clearTimeout(window.tocUpdateTimer);
    }

    // Clean up any global variables used by the TOC
    window.tocUpdateTimer = null;

    // Remove any active highlighting from headers
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(header => {
        if (header.style.backgroundColor === 'rgba(255, 255, 150, 0.5)') {
            header.style.backgroundColor = '';
        }
    });

    // Log confirmation
    console.log('Table of Contents has been completely removed');

    // Return true to indicate successful removal
    return true;
}



/**
 * Extracts a sanitized filename base from the first H1 header (# Header)
 * found in any markdown cell of the notebook.
 * Prioritizes CodeMirror content, then simplified attributes, then textarea.
 * @returns {string|null} - Sanitized filename base string or null if no suitable H1 is found.
 */
function extractFilenameBaseFromH1() {

    // pomocná funkcia: odstráni všetky HTML tagy
    function stripHtmlTags(html) {
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    const markdownCells = document.querySelectorAll('.nb-cell.nb-markdown-cell');
    for (const cell of markdownCells) {
        let content = '';

        if (cell.cmEditor) {
            content = cell.cmEditor.getValue();
        } else {
            const preview = cell.querySelector('.markdown-preview');
            if (preview && preview.getAttribute('data-original-markdown')) {
                content = preview.getAttribute('data-original-markdown');
            } else {
                const textarea = cell.querySelector('textarea');
                if (textarea) content = textarea.value;
            }
        }

        if (content) {
            const lines = content.split('\n');
            for (const line of lines) {
                const match = line.trim().match(/^#\s+(.+)/);
                if (match && match[1]) {
                    let headerText = match[1].trim();

                    // odstráni všetky HTML tagy (font, span, b, i, atď.)
                    headerText = stripHtmlTags(headerText);

                    // sanitizácia pre názov súboru
                    let sanitizedName = headerText
                        .replace(/\s+/g, '_')              // medzery na podčiarkovníky
                        .replace(/[\\/:*?"<>|#%&{}]/g, ''); // zakázané znaky

                    sanitizedName = sanitizedName.substring(0, 100); // limit 100 znakov

                    if (sanitizedName) {
                        console.log("Extracted filename base from H1:", sanitizedName);
                        return sanitizedName;
                    }
                }
            }
        }
    }
    console.log("No suitable H1 header found for filename extraction.");
    return null;
}



// NBRUNNER INTERNAL PATCH — shared linkKey for all Sage cells
(function setupSharedKernel() {
    // One random linkKey per tab/session (survives reloads in the same tab)
    function randomLinkKey() {
        if (window.crypto && window.crypto.getRandomValues) {
            const arr = new Uint32Array(4);
            crypto.getRandomValues(arr);
            return 'lk-' + Array.from(arr).map(x => x.toString(16).padStart(8, '0')).join('');
        }
        return 'lk-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    }

    const LINK_KEY = (() => {
        try {
            const existing = sessionStorage.getItem('sage_linkKey');
            if (existing) return existing;
            const k = randomLinkKey();
            sessionStorage.setItem('sage_linkKey', k);
            return k;
        } catch {
            return randomLinkKey();
        }
    })();

    // Ensure playerConfig exists and carries linkKey + linked
    window.playerConfig = window.playerConfig || {};
    playerConfig.linked = true;
    playerConfig.linkKey = playerConfig.linkKey || LINK_KEY;

    // Override makeSageCells to always pass the shared linkKey
    window.makeSageCells = function (cfg) {
        const e = Object.assign({}, playerConfig, cfg || {});
        const isDe = (typeof getBrowserLanguage === 'function' && getBrowserLanguage() === 'de');
        const evalBtn = isDe ? 'Ausführen' : 'Execute';

        return sagecell.makeSagecell({
            inputLocation: 'div.compute',
            languages: [e.lang],
            evalButtonText: evalBtn,
            linked: true,
            linkKey: e.linkKey || LINK_KEY,
            autoeval: e.eval,
            hide: e.hide
        });
    };

    // Expose for debugging if needed
    window.SAGE_LINK_KEY = LINK_KEY;
})();


// Always restart with a fresh kernel (new linkKey). No auto re-execution.
async function restartNotebook() {
    // Helper: generate a new shared linkKey
    function generateLinkKey() {
        if (window.crypto && window.crypto.getRandomValues) {
            const arr = new Uint32Array(4);
            crypto.getRandomValues(arr);
            return 'lk-' + Array.from(arr).map(x => x.toString(16).padStart(8, '0')).join('');
        }
        return 'lk-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    }

    // Helper: extract code from a code cell (prefers CodeMirror)
    function extractCodeFromCell(cell) {
        let code = '';
        const cmEl = cell.querySelector('.CodeMirror');
        if (cmEl && cmEl.CodeMirror) {
            code = cmEl.CodeMirror.getValue();
        } else {
            const script = cell.querySelector('script[type="text/x-sage"]');
            if (script) code = script.textContent || '';
            else if (typeof getCodeFromCell === 'function') {
                code = getCodeFromCell(cell, 0).replace(/^In\[\d+\]:\s*\n?/, '');
            }
        }
        return String(code || '').replace(/[\u200B\u200C\u200D\uFEFF]/g, '');
    }

    // 1) Always switch to a fresh kernel (new shared session)
    const k = generateLinkKey();
    window.playerConfig = window.playerConfig || {};
    playerConfig.linked = true;
    playerConfig.linkKey = k;
    window.SAGE_LINK_KEY = k;
    try { sessionStorage.setItem('sage_linkKey', k); } catch {}

    // 2) Rebuild every compute area from current code and clear outputs
    const codeCells = document.querySelectorAll('.nb-code-cell');
    codeCells.forEach(cell => {
        const code = extractCodeFromCell(cell);

        let compute = cell.querySelector('.compute');
        if (!compute) {
            compute = document.createElement('div');
            compute.className = 'compute';
            cell.appendChild(compute);
        }

        // Reset the container completely
        compute.className = 'compute'; // drop any .sagecell class from previous init
        compute.innerHTML = '';

        // Insert a fresh script tag with the code
        const script = document.createElement('script');
        script.type = 'text/x-sage';
        script.textContent = code;
        compute.appendChild(script);
    });

    // 3) Re-initialize ALL Sage cells honoring playerConfig (incl. hide)
    const initSelector = '.nb-code-cell .compute';
    if (typeof window.makeSageCells === 'function') {
        // Your override should merge playerConfig and accept a selector/element
        window.makeSageCells({ inputLocation: initSelector });
    } else if (window.sagecell && typeof window.sagecell.makeSagecell === 'function') {
        // Fallback direct init using playerConfig
        const computes = document.querySelectorAll(initSelector);
        const pc = window.playerConfig || {};
        const languages = Array.isArray(pc.languages) ? pc.languages.slice() : [pc.lang || 'sage'];
        const hide = Array.isArray(pc.hide) ? pc.hide.slice() : [];
        const isDe = (typeof getBrowserLanguage === 'function' && getBrowserLanguage() === 'de');
        const evalBtn = isDe ? 'Ausführen' : 'Execute';

        computes.forEach(c =>
            window.sagecell.makeSagecell({
                inputLocation: (window.jQuery ? window.jQuery(c) : c),
                languages,
                linked: true,
                linkKey: pc.linkKey,
                autoeval: !!pc.eval,
                replaceOutput: !!pc.replaceOutput,
                hide,
                evalButtonText: evalBtn
            })
        );
    } else {
        console.warn('SageCell is not available; re-initialization skipped.');
    }

    // 4) Refresh numbering if available
    try { if (typeof removeSageCellNumbering === 'function') removeSageCellNumbering(); } catch {}
    try { if (typeof addSageCellNumbering === 'function') addSageCellNumbering(); } catch {}

    // No auto re-execution here by design.
}


// Add to nbrunner6.js (e.g., near collectNotebookText())

// Updated: Collect notebook content in IPYNB JSON format (no outputs, with proper newlines)
function collectNotebookAsIPYNB() {
    const cells = document.querySelectorAll('.nb-cell');
    const ipynbCells = [];
    let codeCellCount = 1;

    cells.forEach(cell => {
        if (cell.classList.contains('nb-markdown-cell')) {
            let content = '';
            if (cell.cmEditor) {
                content = cell.cmEditor.getValue();
            } else {
                const textarea = cell.querySelector('textarea');
                if (textarea) {
                    content = textarea.value || textarea.getAttribute('data-original') || '';
                }
            }
            // Split into lines, remove trailing empty lines, then append '\n' to each except last
            let linesArr = content.split('\n');
            while (linesArr.length > 0 && linesArr[linesArr.length - 1].trim() === '') {
                linesArr.pop();
            }
            const lines = linesArr.map((line, idx) => idx < linesArr.length ? line + '\n' : line);
            ipynbCells.push({
                cell_type: 'markdown',
                metadata: {},
                source: lines
            });
        } else if (cell.classList.contains('nb-code-cell')) {
            let codeContent = getCodeFromCell(cell, codeCellCount - 1);
            // Remove "In[n]:" prefix if present
            const codeLines = codeContent.split('\n');
            codeContent = (codeLines.length > 1 ? codeLines.slice(1) : codeLines).join('\n');
            // Split into lines, remove trailing empty lines, then append '\n' to each except last
            let linesArr = codeContent.split('\n');
            while (linesArr.length > 0 && linesArr[linesArr.length - 1].trim() === '') {
                linesArr.pop();
            }
            const lines = linesArr.map((line, idx) => idx < linesArr.length ? line + '\n' : line);
            ipynbCells.push({
                cell_type: 'code',
                execution_count: codeCellCount++,
                metadata: {},
                source: lines,
                outputs: []  // Explicitly empty; no outputs exported
            });
        }
    });

    // Handle empty notebook gracefully
    if (ipynbCells.length === 0) {
        console.warn('No cells found to export.');
    }

    return {
        cells: ipynbCells,
        metadata: {
            kernelspec: {
                display_name: 'SageMath',
                language: 'sage',
                name: 'sagemath'
            },
            language_info: {
                name: 'sage'
            }
        },
        nbformat: 4,
        nbformat_minor: 5
    };
}

// Export function (unchanged from previous, but uses simplified collector)
function downloadNotebookAsIPYNB() {
    try {
        const ipynbContent = collectNotebookAsIPYNB();
        const jsonString = JSON.stringify(ipynbContent, null, 2);

        const extractedNameBase = extractFilenameBaseFromH1() || 'SageMath_notebook';
        const finalFilename = `${extractedNameBase}_${getFormattedDate()}.ipynb`;

        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = finalFilename;
        document.body.appendChild(link);
        link.click();

        URL.revokeObjectURL(url);
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error exporting to IPYNB:', error);
        alert('Failed to export to Jupyter notebook. Check console for details.');
    }
}



// Add to nbrunner6.js

// Updated: Import from IPYNB file (ignores outputs, fixes extra newlines)
function importFromIPYNB(file) {
    const reader = new FileReader();
    reader.onload = event => {
        try {
            const ipynbJson = JSON.parse(event.target.result);
            const container = document.querySelector('.nb-worksheet');
            if (!container) throw new Error('Notebook container not found');

            const shouldWipe = confirm("Wipe existing content before import?");
            if (shouldWipe) container.innerHTML = '';

            ipynbJson.cells.forEach(cellData => {
                // Join source array directly (no extra '\n') to preserve original line breaks
                let source = (cellData.source || []).join('');

                // Optional: Trim trailing whitespace/newlines from the entire source
                // This helps with IPYNB files that have inconsistent endings
                source = source.trim();

                // Optional: If you want to clean per-line (e.g., remove trailing spaces per line)
                // source = source.split('\n').map(line => line.trimEnd()).join('\n');

                if (cellData.cell_type === 'markdown') {
                    const mdCell = createMarkdownCell(source);
                    container.appendChild(mdCell);
                } else if (cellData.cell_type === 'code') {
                    const codeCell = createCodeCell(source);
                    container.appendChild(codeCell);
                    addControlBar(codeCell);
                    // Outputs are ignored—no processing needed
                } else {
                    console.warn(`Skipping unsupported cell type: ${cellData.cell_type}`);
                }
            });

            // Reprocess after import (with your existing delays for stability)
            setTimeout(reprocessNotebook, 500);
            setTimeout(reprocessNotebook, 1500);
        } catch (error) {
            console.error('Error importing IPYNB:', error);
            alert('Failed to import Jupyter notebook. Ensure it\'s a valid .ipynb file.');
        }
    };
    reader.readAsText(file);
}

// Keyboard shortcuts for navbar actions
document.addEventListener('keydown', function (event) {
    // Use Ctrl + <key>
    if (event.ctrlKey) {
        const key = event.key.toLowerCase();
        const actions = {
            r: () => document.getElementById('runAllCellsButton')?.click(),
            s: () => saveHtml(),
            e: () => document.getElementById('editCells')?.click(),
            b: () => toggleNavbar(),
            k: () => document.getElementById('restartKernelButton')?.click(),
            i: () => document.getElementById('importCells')?.click(),
            p: () => document.getElementById('exportCells')?.click(),
        };
        if (actions[key]) {
            event.preventDefault();
            actions[key]();
        }
    }
});

