function getBrowserLanguage() {
    return (navigator.language || navigator.userLanguage).substring(0, 2)
}

function makeMenu() {
    var e = getBrowserLanguage();
    $("head").first().append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/JupyterPER/SageMathAINotebooks@main/css/nbplayer.css"'), $("body").first().append('<script src="custom.js"><\/script>');
    var t = "de" == e ? "Code ausblenden/einblenden" : "Show / Hide Code",
        n = "de" == e ? "Code-Zellen in der gegebenen Reihenfolge ausfĂĽhren!" : "Execute Cells in the Sequence Given!",
        a = "de" == e ? "Speichern" : "Save",
        s = '<a href="#" role="button" id="read-button" class="btn btn-primary" onclick="setView()">' + ("de" == e ? 'Lesen' : 'Read') + '</a>',
      o = '<a href="#" role="button" id="execute-button" class="btn btn-primary" onclick="setExecute()">' + ('de' == e ? 'AusfĂĽhren' : 'Execute') + '</a>',
      l = '<div id="navbar">' + ('Exec' == playerConfig.panes ? "" : s + o) + '<a href="#" role="button" class="btn btn-primary" onclick="toggleInput()">' + t + '</a>\n  <a href="#" role="button" class="btn btn-primary" onclick="saveHtml()">' + a + "</a>" + '\n  </div>';
    $("body").prepend(l), $("#main").addClass("belowMenu")
}

function scrollFunction() {
    var e = document.getElementById("navbar"),
        t = e.offsetTop;
    window.pageYOffset >= t ? e.classList.add("sticky") : e.classList.remove("sticky")
}

function saveHtml() {

    // Simplify all markdown cells to basic HTML form before saving
    simplifyMarkdownCellsForSaving();

    removeAllControlBars();

    saveAddSageCells(".nb-code-cell", ".sagecell_input,.sagecell_output");
    $("script").html().replace(/\u200B/g, "");

    const apikey = typeof API_KEY !== 'undefined' ? JSON.stringify(API_KEY) : JSON.stringify('');
    const currentmodel = typeof CURRENT_MODEL !== 'undefined' ? JSON.stringify(CURRENT_MODEL) : JSON.stringify('');
    const currentlanguage = typeof CURRENT_LANGUAGE !== 'undefined' ? JSON.stringify(CURRENT_LANGUAGE) : JSON.stringify('');
    const delayValue = document.getElementById('delay') ? parseInt(document.getElementById('delay').value) || RUN_DELAY : RUN_DELAY;
    var e = new Blob([
        "<!DOCTYPE html>\n<html>\n<head>" +
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
        '<script src="https://cdn.jsdelivr.net/gh/JupyterPER/SageMathAINotebooks@main/js/nbrunner4.js"></script>\n' +
        // '<script src="nbrunner4.js"></script>\n' +
        '<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>\n' +
        '<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/JupyterPER/SageMathAINotebooks@main/css/nbplayer.css">\n' +
        '<script>\n' +
        '  playerConfig=' + JSON.stringify(playerConfig) + ';\n' +
        '  playerMode=' + JSON.stringify(playerMode) + ';\n' +
        '  makeMenu();\n' +
        '  localize();\n' +
        '  loadStatus();\n' +
        '  makeSageCells(playerConfig);\n' +
        '  launchPlayer();\n' +
        '  addControlPanel();\n' +
        '  setupRunAllCells();\n' +
        '  window.onload = initializeMarkdownCells;\n' +
        '  let API_KEY=' + apikey + ';\n' +
        '  let CURRENT_MODEL=' + currentmodel + ';\n' +
        '  let CURRENT_LANGUAGE=' + currentlanguage + ';\n' +
        '</script>\n' +
        '</body>\n</html>'
    ], {
        type: "text/plain;charset=utf-8"
    });
    saveAs(e, playerConfig.name + ".html");
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
        
        executeButtons.forEach((button, index) => {
            setTimeout(() => {
                button.click();
            }, delay * (index + 1));
        });
    }

    document.getElementById('runAllCellsButton').addEventListener('click', runAllCells);
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
        editCellsButton.textContent = editMode ? 'View Mode' : 'Edit Mode';
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
    input.min = '1';
    input.value = RUN_DELAY;
    input.addEventListener('change', function() {
        RUN_DELAY = parseInt(this.value) || 1000;
    });

    const runButton = document.createElement('button');
    runButton.id = 'runAllCellsButton';
    runButton.textContent = 'Run All Cells';

    const toggleNavbarButton = document.createElement('button');
    toggleNavbarButton.id = 'toggleNavbar';
    toggleNavbarButton.textContent = 'Toggle Bar';
    toggleNavbarButton.onclick = toggleNavbar;

    const editCellsButton = document.createElement('button');
    editCellsButton.id = 'editCells';
    editCellsButton.textContent = editMode ? 'View Mode' : 'Edit Mode';
    editCellsButton.onclick = toggleEditMode;

    const exportButton = document.createElement('button');
    exportButton.id = 'exportCells';
    exportButton.textContent = 'Export';
    exportButton.onclick = downloadNotebookText;

    const importButton = document.createElement('button');
    importButton.id = 'importCells';
    importButton.textContent = 'Import';
    importButton.onclick =
      function() {
        // Create and trigger a file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.txt';
        fileInput.style.display = 'none';

        fileInput.onchange = function(event) {
            const file = event.target.files[0];
            if (file) {
                importNotebookFromFile(file);
            }
            document.body.removeChild(fileInput);
        };

        document.body.appendChild(fileInput);
        fileInput.click();
    };

    const aiSettingsButton = document.createElement('button');
    aiSettingsButton.id = 'aiSettings';
    aiSettingsButton.textContent = 'AI Settings';
    aiSettingsButton.onclick = createModalWindow;

    // Insert the new elements at the beginning of the navbar
    navbar.insertBefore(exportButton, navbar.firstChild);
    navbar.insertBefore(importButton, navbar.firstChild);
    navbar.insertBefore(aiSettingsButton, navbar.firstChild);
    navbar.insertBefore(editCellsButton, navbar.firstChild);
    navbar.insertBefore(input, navbar.firstChild);
    navbar.insertBefore(runButton, navbar.firstChild);

	
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
    markdownTips: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M10 1c3.11 0 5.63 2.52 5.63 5.62 0 1.84-2.03 4.58-2.03 4.58-.33.44-.6 1.25-.6 1.8v1c0 .55-.45 1-1 1H8c-.55 0-1-.45-1-1v-1c0-.55-.27-1.36-.6-1.8 0 0-2.02-2.74-2.02-4.58C4.38 3.52 6.89 1 10 1zM7 16.87V16h6v.87c0 .62-.13 1.13-.75 1.13H12c0 .62-.4 1-1.02 1h-2c-.61 0-.98-.38-.98-1h-.25c-.62 0-.75-.51-.75-1.13z" fill="#616161"/></svg>`
};


function generateNewCellUpButtonHTML() {
    const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M4.75 4.93066H6.625V6.80566C6.625 7.01191 6.79375 7.18066 7 7.18066C7.20625 7.18066 7.375 7.01191 7.375 6.80566V4.93066H9.25C9.45625 4.93066 9.625 4.76191 9.625 4.55566C9.625 4.34941 9.45625 4.18066 9.25 4.18066H7.375V2.30566C7.375 2.09941 7.20625 1.93066 7 1.93066C6.79375 1.93066 6.625 2.09941 6.625 2.30566V4.18066H4.75C4.54375 4.18066 4.375 4.34941 4.375 4.55566C4.375 4.76191 4.54375 4.93066 4.75 4.93066Z" fill="#616161"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 9.5V11.5H2.5V9.5H11.5ZM12 8C12.5523 8 13 8.44772 13 9V12C13 12.5523 12.5523 13 12 13H2C1.44772 13 1 12.5523 1 12V9C1 8.44772 1.44771 8 2 8H12Z" fill="#616161"/>
        </svg>
    `;

    return `
    <button class="new-cell-up-button" title="New Cell Up">
        ${svgIcon}
    </button>`;
}

function generateNewCellDownButtonHTML() {
    const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9.25 10.0693H7.375V8.19434C7.375 7.98809 7.20625 7.81934 7 7.81934C6.79375 7.81934 6.625 7.98809 6.625 8.19434V10.0693H4.75C4.54375 10.0693 4.375 10.2381 4.375 10.4443C4.375 10.6506 4.54375 10.8193 4.75 10.8193H6.625V12.6943C6.625 12.9006 6.79375 13.0693 7 13.0693C7.20625 13.0693 7.375 12.9006 7.375 12.6943V10.8193H9.25C9.45625 10.8193 9.625 10.6506 9.625 10.4443C9.625 10.2381 9.45625 10.0693 9.25 10.0693Z" fill="#616161"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M2.5 5.5V3.5H11.5V5.5H2.5ZM2 7C1.44772 7 1 6.55228 1 6V3C1 2.44772 1.44772 2 2 2H12C12.5523 2 13 2.44772 13 3V6C13 6.55229 12.5523 7 12 7H2Z" fill="#616161"/>
        </svg>
    `;

    return `
    <button class="new-cell-down-button" title="New Cell Down">
        ${svgIcon}
    </button>`;
}


function reprocessNotebook() {
  requestAnimationFrame(() => {
    // Standardize all cells, including newly created ones
    saveAddSageCells(".nb-code-cell", ".sagecell_input,.sagecell_output");
    
    // Remove zero-width spaces from all scripts
    $("script").each(function() {
        $(this).html($(this).html().replace(/\u200B/g, ""));
    });

    // Re-initialize the notebook

    makeSageCells(playerConfig);
	cleanupComputeDivs();
    launchPlayer();
    setupRunAllCells();
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
        const aiCompleteBtn = createButtonIco('AI Complete', () => formatAndLoadCodeIntoCell(cell, `AI_complete`, CURRENT_MODEL, API_KEY, CURRENT_LANGUAGE), 'aiComplete');
        const aiFormatBtn = createButtonIco('AI Format', () => formatAndLoadCodeIntoCell(cell, `AI_format`, CURRENT_MODEL, API_KEY, CURRENT_LANGUAGE), 'aiFormat');
        const aiExplainBtn = createButtonIco('AI Explain', () => formatAndLoadCodeIntoCell(cell, `AI_explain`, CURRENT_MODEL, API_KEY, CURRENT_LANGUAGE), 'aiExplain');
        const excelJsonBtn = createButtonIco('Import/Export Excel', () => openExcelImportExportDialog(cell), 'addEditExcel');

        controlBar.appendChild(convertToMarkdownBtn);
        controlAiBar.appendChild(aiCompleteBtn);
        controlAiBar.appendChild(aiFormatBtn);
        controlAiBar.appendChild(aiExplainBtn);
        controlBar.appendChild(excelJsonBtn);
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

function formatAndLoadCodeIntoCell(cell, aiCommand, currentModel, apiKey, currentLanguage) {
    const codeMirror = cell.querySelector('.CodeMirror').CodeMirror;
    if (!codeMirror) {
        console.error('CodeMirror instance was not founf');
        return;
    }
    let currentQuery = codeMirror.getValue();
    let previousCode = loadPreviousCodeCells(cell);
    // Ensure both currentQuery and previousCode are strings and replace all single quotes with double quotes
    currentQuery = String(currentQuery).replace(/'/g, '"');
    previousCode = String(previousCode).replace(/'/g, '"');

    const formattedCode = `# -START OF AI CELL-
current_query = r'''
${currentQuery}
'''
language = '${currentLanguage}'
model='${currentModel}'

url = 'https://raw.githubusercontent.com/JupyterPER/SageMathAINotebooks/refs/heads/main/AIcommandsMistral%20NB%20player.py'
load(url)

previous_code = r'''
${previousCode}
'''

AIanswer = ${aiCommand}(language=language, model=model, NBplayer_code=previous_code+f'In[FOCUS]: {current_query}', api_key='${apiKey}')
print(AIanswer)
# -END OF AI CELL-`;

    // Vlož nový kód do aktuálnej bunky
    codeMirror.setValue(formattedCode);

    // Nájdite a kliknite na prislúchajúce tlačidlo vykonania kódu
    const nearestExecuteButton = cell.querySelector('.sagecell_evalButton.ui-button.ui-corner-all.ui-widget');
    if (nearestExecuteButton) {
        nearestExecuteButton.click();
    } else {
        console.error('Tlačidlo vykonania sa nenašlo');
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
	reprocessNotebook();
	addControlBar(newCell);
}

function deleteCell(cell) {
    // Check if the cell is a code cell before removing it
    const isCodeCell = cell.classList.contains('nb-code-cell');

    // Remove the cell
    cell.remove();

    // Only reprocess the notebook if a code cell was deleted
    if (isCodeCell) {
        reprocessNotebook();
    }
}

function addFiveCells(referenceCell, position) {
    // Create array of 5 new cells
    const newCells = [];
    for (let i = 0; i < 5; i++) {
        newCells.push(createBlankSageCell());
    }

    if (position === 'above') {
        // Insert cells above in reverse order to maintain correct sequence
        for (let i = 4; i >= 0; i--) {
            referenceCell.parentNode.insertBefore(newCells[i], referenceCell);
        }
    } else {
        // Insert cells below in forward order
        for (let i = 0; i < 5; i++) {
            if (i === 0) {
                referenceCell.parentNode.insertBefore(newCells[i], referenceCell.nextSibling);
            } else {
                referenceCell.parentNode.insertBefore(newCells[i], newCells[i-1].nextSibling);
            }
        }
    }

    // Reprocess notebook once after all cells are added
    reprocessNotebook();

    // Add control bar to each new cell
    newCells.forEach(cell => {
        addControlBar(cell);
    });
}


function moveCell(cell, direction) {
    // Check if the cell is a code cell before moving it
    const isCodeCell = cell.classList.contains('nb-code-cell');

    const parent = cell.parentNode;

    // Store the original position to check if we actually moved the cell
    const originalIndex = Array.from(parent.children).indexOf(cell);

    if (direction === 'up' && cell.previousElementSibling) {
        parent.insertBefore(cell, cell.previousElementSibling);
    } else if (direction === 'down' && cell.nextElementSibling) {
        parent.insertBefore(cell.nextElementSibling, cell);
    }

    // Get new position to check if cell actually moved
    const newIndex = Array.from(parent.children).indexOf(cell);

    // Only reprocess the notebook if a code cell was moved AND it actually changed position
    if (isCodeCell && originalIndex !== newIndex) {
        reprocessNotebook();
    }
}

function duplicateCell(cell) {
    // Check if the cell is a code cell
    const isCodeCell = cell.classList.contains('nb-code-cell');

    // Special handling for markdown cells
    if (cell.classList.contains('nb-markdown-cell')) {
        // We need to create a new markdown cell properly instead of cloning

        // Get the content from the original cell
        let content = '';
        if (cell.cmEditor) {
            // Get content from CodeMirror instance
            content = cell.cmEditor.getValue();
        } else {
            // Fallback to textarea
            const textarea = cell.querySelector('textarea');
            if (textarea) {
                content = textarea.value || textarea.getAttribute('data-original') || '';
            }
        }

        // Create a new markdown cell with this content
        const editorId = 'md-editor-' + Date.now();
        const previewId = 'preview-' + Date.now();

        // Create the new cell
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

        // Get the textarea element
        const textarea = newCell.querySelector(`#${editorId}`);
        textarea.setAttribute('data-original', content);

        // Initialize CodeMirror for the new cell
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

        // Set the height to match original cell
        const originalHeight = cell.querySelector('.CodeMirror').getAttribute('data-original-height') || '150px';
        editor.setSize(null, parseInt(originalHeight, 10));
        newCell.querySelector('.CodeMirror').setAttribute('data-original-height', originalHeight);

        // Store the CM instance on the cell
        newCell.cmEditor = editor;

        // Set up event handlers for rendering
        editor.on('change', () => {
            const preview = newCell.querySelector('.markdown-preview');
            if (preview) {
                renderMarkdownWithCM(editor, preview);
            }
        });

        // Match the visibility state of the original cell
        const isInEditMode = cell.querySelector('.CodeMirror').style.display === 'block';
        newCell.querySelector('.CodeMirror').style.display = isInEditMode ? 'block' : 'none';
        newCell.querySelector('.markdown-preview').style.display = 'block';

        // Render the initial content
        const preview = newCell.querySelector('.markdown-preview');
        renderMarkdownWithCM(editor, preview);

        // Add control bar to the new cell
        addControlBar(newCell);

        // Update the edit/view button text to match the current state
        const editButton = newCell.querySelector('.control-bar button:first-child');
        if (editButton) {
            editButton.textContent = isInEditMode ? "View Cell" : "Edit Cell";
        }

        return; // Exit early as we've handled the markdown cell duplication
    }

    // For code cells, use the original cloning approach
    const newCell = cell.cloneNode(true);
    cell.parentNode.insertBefore(newCell, cell.nextSibling);

    // Only reprocess the notebook if a code cell was duplicated
    if (isCodeCell) {
        reprocessNotebook();
    }

    // Replace the control bar
    removeControlBar(newCell);
    addControlBar(newCell);
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



function createModalWindow() {
    const currentApiKey = API_KEY;
    // Remove any existing modal if present
    removeExistingModal();

    // Add styles
    const styleElement = document.createElement('style');
    styleElement.id = 'modalStyles';
    styleElement.textContent = `
        .modal {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
        }
        .modal-content {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-width: 500px;
            border-radius: 5px;
            position: relative;
        }
        .close {
            float: right;
            cursor: pointer;
            font-size: 28px;
            font-weight: bold;
        }
        .close:hover {
            color: #555;
        }
        .input-group {
            margin: 0px 0;
        }
        input, select {
            width: 100%;
            padding: 8px;
            margin: 8px 0;
            box-sizing: border-box;
        }
        button {
            padding: 8px 16px;
            cursor: pointer;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
        }
        button:hover {
            background-color: #45a049;
        }
    `;
    document.head.appendChild(styleElement);

    // Create modal HTML with new language select drop down
    const modalDiv = document.createElement('div');
    modalDiv.id = 'apiKeyModal';
    modalDiv.className = 'modal';
    modalDiv.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="removeExistingModal()">&times;</span>
            <h3>AI Settings</h3>
            <div class="input-group">
                <label for="modelSelect">Select Mistral Model:</label>
                <select id="modelSelect">
                    <option value="mistral-small-latest">small</option>
                    <option value="mistral-medium-latest">medium</option>
                    <option value="mistral-large-latest">large</option>
                </select>
            </div>
            <div class="input-group">
                <label for="languageSelect">Select Language:</label>
                <select id="languageSelect">
                    <option value="English">English</option>
                    <option value="Slovak">Slovak</option>
                </select>
            </div>
            <div class="input-group">
                <label for="newKey">API Key:</label>
                <input type="text" id="newKey" value="${currentApiKey}" placeholder="Enter API key">
            </div>
            <p>You can obtain a free Mistral API key from <a href="https://console.mistral.ai/api-keys" target="_blank" rel="noopener noreferrer">Mistral AI Platform</a></p>
            <div class="warning-message" style="color: #e74c3c; margin: 15px 0; padding: 10px; background: #fdecea; border-left: 4px solid #e74c3c;">
                <strong>⚠️ Security Warning:</strong>
                <p style="margin: 5px 0;">Remember to remove your API key before sharing this notebook with others. Never share your API key with untrusted persons. Also delete all cells generated after clicking one of the AI buttons that contain your API key.</p>
            </div>
            <button onclick="updateSettings()">Update</button>
        </div>
    `;

    document.body.appendChild(modalDiv);

    // Add click event listener to close modal when clicking outside
    modalDiv.addEventListener('click', function(event) {
        if (event.target === modalDiv) {
            removeExistingModal();
        }
    });
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

function updateSettings() {
    const newKey = document.getElementById('newKey').value;
    const selectedModel = document.getElementById('modelSelect').value;
    const selectedLanguage = document.getElementById('languageSelect').value; // New language option

    API_KEY = newKey;
    CURRENT_MODEL = selectedModel;
    CURRENT_LANGUAGE = selectedLanguage; // Store selected language in a global variable (or handle as needed)

    removeExistingModal();
    console.log(`Updated! Model: ${CURRENT_MODEL}, API Key: ${API_KEY}, Language: ${CURRENT_LANGUAGE}`);
    removeAllControlBars();
    initializeCells();
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

    // Create a Blob from the text
    const blob = new Blob([notebookContent], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);

    // Create a temporary link to automatically download the file
    const link = document.createElement('a');
    link.href = url;
    link.download = 'notebook_export_' + getFormattedDate() + '.txt'; // Set the desired filename
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
print(f"Columns in the DataFrame: {', '.join(map(str, globals()[dataframe_name].columns))}")`;

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

function initializeMarkdownCells() {
    console.log("Initializing markdown cells...");

    // Get all markdown cells
    const markdownCells = document.querySelectorAll('.nb-cell.nb-markdown-cell');
    const cellsToTransform = [];

    // First collect all cells and their content to avoid DOM modification issues during iteration
    markdownCells.forEach(cell => {
        let content = '';

        // Look for the content in this order of priority:
        // 1. textarea's data-original attribute
        const textarea = cell.querySelector('textarea');
        if (textarea && textarea.getAttribute('data-original')) {
            content = textarea.getAttribute('data-original');
            console.log("Found content in textarea data-original");
        }
        // 2. preview's data-original-markdown attribute
        else {
            const preview = cell.querySelector('.markdown-preview') || cell.querySelector('[id^="preview"]');
            if (preview && preview.getAttribute('data-original-markdown')) {
                content = preview.getAttribute('data-original-markdown');
                console.log("Found content in preview data-original-markdown");
            }
        }

        // If we still don't have content, try other sources as fallbacks
        if (!content) {
            // Try textarea value
            if (textarea && textarea.value) {
                content = textarea.value;
                console.log("Using textarea value as fallback");
            }
            // Try preview innerHTML as last resort
            else if (preview) {
                content = preview.innerHTML;
                console.log("Using preview HTML as fallback (last resort)");
            }
        }

        // Store cell and its content for transformation
        cellsToTransform.push({
            cell: cell,
            content: content
        });
    });

    // Now transform each cell
    cellsToTransform.forEach(item => {
        console.log("Transforming markdown cell with content:", item.content.substring(0, 30) + "...");

        // Create a new markdown cell with the extracted content
        const newCell = createMarkdownCell(item.content);

        // Replace the old cell with the new one
        if (item.cell.parentNode) {
            item.cell.parentNode.replaceChild(newCell, item.cell);
        }
    });

    // After a delay, ensure all CodeMirror instances are properly sized and buttons are labeled correctly
    setTimeout(() => {
        document.querySelectorAll('.nb-markdown-cell').forEach(cell => {
            // Set initial visibility based on global edit mode
            const cmElement = cell.querySelector('.CodeMirror');
            const preview = cell.querySelector('.markdown-preview');

            if (cmElement && preview) {
                if (typeof editMode !== 'undefined' && editMode) {
                    // Edit mode: show editor and preview
                    cmElement.style.display = 'block';
                    preview.style.display = 'block';
                } else {
                    // View mode: hide editor, show preview
                    cmElement.style.display = 'none';
                    preview.style.display = 'block';
                }

                // If there's a CodeMirror instance, make sure it's refreshed
                if (cell.cmEditor) {
                    cell.cmEditor.refresh();
                }
            }

            // Update edit/view button text
            const editButton = cell.querySelector('.control-bar button:first-child');
            if (editButton) {
                editButton.textContent = (typeof editMode !== 'undefined' && editMode) ? 'View' : 'Edit';
            }
        });
    }, 300);
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

function toggleSingleCellEditMode(cell) {
    const button = cell.querySelector('.control-bar button:first-child');
    const isCurrentlyInViewMode = button.textContent === 'Edit';

    if (cell.cmEditor) {
        // This is a CodeMirror-based markdown cell
        const cmElement = cell.querySelector('.CodeMirror');
        const preview = cell.querySelector('.markdown-preview');

        if (isCurrentlyInViewMode) {
            // Switch to edit mode
            cmElement.style.display = 'block';
            preview.style.display = 'block';
            cell.cmEditor.refresh(); // Important for CM to render correctly
            button.textContent = 'View';
        } else {
            // Switch to view mode
            cmElement.style.display = 'none';
            preview.style.display = 'block';

            // Update the preview with the latest content
            renderMarkdownWithCM(cell.cmEditor, preview);
            button.textContent = 'Edit';
        }
    } else {
        // Traditional textarea-based cell
        const input = cell.querySelector('[id^="mdinput"]');
        const preview = cell.querySelector('[id^="preview"]');

        if (isCurrentlyInViewMode) {
            // Switch to edit mode
            input.style.display = 'block';
            preview.style.display = 'block';
            button.textContent = 'View';
        } else {
            // Switch to view mode
            input.style.display = 'none';
            preview.style.display = 'block';

            // Update preview with current content
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

            button.textContent = 'Edit';
        }
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

function simplifyMarkdownCellsForSaving() {
    console.log("Simplifying markdown cells for saving...");

    // First, remove all control bars
    document.querySelectorAll('.control-bar, .control-ai-bar, .inline-markdown-tips').forEach(bar => {
        bar.remove();
    });

    // Handle all markdown cells
    document.querySelectorAll('.nb-markdown-cell').forEach(cell => {
        // 1. Get content from the cell (prioritizing CodeMirror)
        let content = '';

        // Always try to get content from CodeMirror first as it's most up-to-date
        if (cell.cmEditor) {
            content = cell.cmEditor.getValue();
            console.log("Got content from CodeMirror:", content.substring(0, 30) + "...");

            // Properly clean up the CodeMirror instance
            cell.cmEditor.toTextArea();
            cell.cmEditor = null;
        }

        // 2. Update textarea with the content
        const textarea = cell.querySelector('textarea');
        if (textarea) {
            if (content) {
                // Update textarea with CodeMirror content
                textarea.value = content;
            } else {
                // If no CodeMirror content was available, get it from the textarea
                content = textarea.value || textarea.getAttribute('data-original') || '';
                console.log("Got content from textarea:", content.substring(0, 30) + "...");
            }

            // Always update the data-original attribute
            textarea.setAttribute('data-original', content);

            // Hide the textarea but keep it in the DOM
            textarea.style.display = 'none';
        }

        // 3. Clean up any remaining CodeMirror elements
        cell.querySelectorAll('.CodeMirror').forEach(cm => {
            cm.remove();
            console.log("Removed CodeMirror element");
        });

        // 4. Update the preview with the latest content
        const preview = cell.querySelector('.markdown-preview');
        if (preview) {
            preview.style.display = 'block';

            // Store the original markdown in a data attribute
            preview.setAttribute('data-original-markdown', content);

            // Render the markdown if texme is available
            if (typeof texme !== 'undefined' && texme.render) {
                preview.innerHTML = texme.render(content);
                console.log("Updated preview with rendered markdown");
            } else {
                // Fallback if texme isn't available
                preview.textContent = content;
            }
        }
    });

    console.log("Markdown cells simplified for saving");
}

