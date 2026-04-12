const customCssThemes = {
"Default": "",

"Orange": `
/* Simple Orange*/
/* here you can simply change the color UI elements color keywords or Hex values*/
:root {
--main-color: orangered;   
--hover-color: green;
--navbar-background: bisque;
}`,

"Minimalist Light": `
/* 🎨 Minimalist Light */
:root {
  --main-color: #6b7280;
  --hover-color: #4b5563;
  --main-btn-icons: #ffffff;
  --hover-btn-icons: #ffffff;
  --focus-btn-icons: #ffffff;
  --navbar-background: #f9fafb;
  --body-background: #ffffff;
  --text-color: #111827;
  --sagecell-number-color: #6b7280;
}
`,

"Deep Ocean": `
/* Deep Ocean - Rich blue underwater theme */
:root {
--main-color: #0891b2;           /* Cyan blue */
--hover-color: #f59e0b;          /* Amber accent */
--main-btn-icons: #083344;       /* Deep ocean blue */
--hover-btn-icons: #ecfeff;      /* Ice blue */
--focus-btn-icons: #0891b2;      /* Cyan blue */
--navbar-background: #155e75;    /* Deep teal */
--body-background: #ecfeff;      /* Light cyan */
--text-color: #083344;           /* Deep ocean blue */
--sagecell-number-color: #0891b2; /* Cyan blue */
}
`,

"Eucalyptus": `
/* Eucalyptus - Fresh minty green theme */
:root {
--main-color: #10b981;           /* Emerald green */
--hover-color: #8b5cf6;          /* Purple accent */
--main-btn-icons: #064e3b;       /* Dark forest green */
--hover-btn-icons: #f0fdf4;      /* Mint white */
--focus-btn-icons: #10b981;      /* Emerald green */
--navbar-background: #6ee7b7;    /* Soft mint */
--body-background: #f0fdf4;      /* Pale mint */
--text-color: #064e3b;           /* Dark forest green */
--sagecell-number-color: #10b981; /* Emerald green */
}
`,

"Lavender Fields": `
/* Lavender Fields - Soft purple theme */
:root {
--main-color: #8b5cf6;           /* Purple */
--hover-color: #f59e0b;          /* Amber accent */
--main-btn-icons: #4c1d95;       /* Deep purple */
--hover-btn-icons: #faf5ff;      /* Lavender white */
--focus-btn-icons: #8b5cf6;      /* Purple */
--navbar-background: #c4b5fd;    /* Soft lavender */
--body-background: #faf5ff;      /* Pale lavender */
--text-color: #4c1d95;           /* Deep purple */
--sagecell-number-color: #8b5cf6; /* Purple */
}
`,

"Sunset Coral": `
/* Sunset Coral - Warm coral pink theme */
:root {
--main-color: #f43f5e;           /* Rose pink */
--hover-color: #06b6d4;          /* Cyan accent */
--main-btn-icons: #881337;       /* Deep rose */
--hover-btn-icons: #fff1f2;      /* Soft pink white */
--focus-btn-icons: #f43f5e;      /* Rose pink */
--navbar-background: #fda4af;    /* Light coral */
--body-background: #fff1f2;      /* Pale rose */
--text-color: #881337;           /* Deep rose */
--sagecell-number-color: #f43f5e; /* Rose pink */
}
`,

"Forest Moss": `
/* Forest Moss - Earthy olive green theme */
:root {
--main-color: #84cc16;           /* Lime green */
--hover-color: #dc2626;          /* Red accent */
--main-btn-icons: #365314;       /* Dark olive */
--hover-btn-icons: #f7fee7;      /* Pale lime */
--focus-btn-icons: #84cc16;      /* Lime green */
--navbar-background: #bef264;    /* Light lime */
--body-background: #f7fee7;      /* Soft lime white */
--text-color: #365314;           /* Dark olive */
--sagecell-number-color: #84cc16; /* Lime green */
}
`,

"Arctic Frost": `
/* Arctic Frost - Cool icy blue theme */
:root {
--main-color: #06b6d4;           /* Cyan */
--hover-color: #f97316;          /* Orange accent */
--main-btn-icons: #164e63;       /* Deep cyan */
--hover-btn-icons: #ecfeff;      /* Ice white */
--focus-btn-icons: #06b6d4;      /* Cyan */
--navbar-background: #a5f3fc;    /* Sky blue */
--body-background: #ecfeff;      /* Pale cyan */
--text-color: #164e63;           /* Deep cyan */
--sagecell-number-color: #06b6d4; /* Cyan */
}
`,

"Ink & Paper": `
/* Ink & Paper - Classic newspaper style */
:root {
--main-color: #fffdfd;           /* Ink black */
--hover-color: #525252;          /* Gray */
--main-btn-icons: #000000;       /* Pure black */
--hover-btn-icons: #f5f5f5;      /* Light gray */
--focus-btn-icons: #1a1a1a;      /* Ink black */
--navbar-background: #e5e5e5;    /* Newsprint gray */
--body-background: #fafafa;      /* Off white */
--text-color: #000000;           /* Pure black */
--sagecell-number-color: #1a1a1a; /* Ink black */
}
`,

"Light Honey Glow": `
/* Honey Glow - Sweet yellowish theme */
:root {
--main-color: #d97706;           /* Orange-yellow */
--hover-color: #059669;          /* Emerald green */
--main-btn-icons: #451a03;       /* Very dark brown */
--hover-btn-icons: #fffbeb;      /* Off-white */
--focus-btn-icons: #d97706;      /* Orange-yellow */
--navbar-background: #fde68a;    /* Golden yellow */
--body-background: #fffbeb;      /* Warm cream */
--text-color: #451a03;           /* Very dark brown */
--sagecell-number-color: #d97706; /* Orange-yellow */
}
`,

"Charcoal Steel": `
/* Charcoal Steel - Dark industrial theme */
:root {
--main-color: #64748b;           /* Slate gray */
--hover-color: #f59e0b;          /* Amber accent */
--main-btn-icons: #0f172a;       /* Almost black */
--hover-btn-icons: #f1f5f9;      /* Light gray */
--focus-btn-icons: #64748b;      /* Slate gray */
--navbar-background: #334155;    /* Dark slate */
--body-background: #f1f5f9;      /* Cool white */
--text-color: #0f172a;           /* Almost black */
--sagecell-number-color: #64748b; /* Slate gray */
}
`,

"Military Green": `
/* Military Green - Tactical olive theme */
:root {
--main-color: #65a30d;           /* Army green */
--hover-color: #d97706;          /* Bronze accent */
--main-btn-icons: #1a2e05;       /* Deep olive */
--hover-btn-icons: #f7fee7;      /* Light olive */
--focus-btn-icons: #65a30d;      /* Army green */
--navbar-background: #4d7c0f;    /* Dark military green */
--body-background: #fefce8;      /* Sand beige */
--text-color: #1a2e05;           /* Deep olive */
--sagecell-number-color: #65a30d; /* Army green */
}
`,

"Iron Oxide": `
/* Iron Oxide - Rusted metal theme */
:root {
--main-color: #b91c1c;           /* Deep red */
--hover-color: #475569;          /* Slate accent */
--main-btn-icons: #450a0a;       /* Dark burgundy */
--hover-btn-icons: #fef2f2;      /* Pale red */
--focus-btn-icons: #b91c1c;      /* Deep red */
--navbar-background: #7f1d1d;    /* Dark red */
--body-background: #fef2f2;      /* Light red tint */
--text-color: #450a0a;           /* Dark burgundy */
--sagecell-number-color: #b91c1c; /* Deep red */
}
`,


"Dark Cobalt": `
:root {
--main-color: #0088ff;           /* Cobalt blue */
--hover-color: #ff9d00;          /* Cobalt orange */
--main-btn-icons: #ffffff;       /* White foreground */
--hover-btn-icons: #ffffff;      /* White */
--focus-btn-icons: #ffffff;      /* White foreground */
--navbar-background: #002240;    /* Cobalt background */
--body-background: #001b33;      /* Cobalt darker shade */
--text-color: #ffffff;           /* White foreground */
--sagecell-number-color: #ff628c; /* Cobalt pink */
}

/* -------------------------------------------------
CodeMirror – default (Cobalt‑style) theme
------------------------------------------------- */

/* ---------- Base editor & gutter ---------- */
.cm-s-default .CodeMirror-gutters,
.cm-s-default.CodeMirror {
background-color: #002240 !important;   /* dark blue background */
color: #ffffff !important;              /* white text */
border: none;
}
.cm-s-default .CodeMirror-gutters { color: #002240; }
.cm-s-default .CodeMirror-cursor { border-left: solid thin #ffffff; }
.cm-s-default .CodeMirror-linenumber { color: #0088ff; }

/* ---------- Selection ---------- */
.cm-s-default .CodeMirror-selected { background: #0050a4 !important; }
.cm-s-default .CodeMirror-line::selection,
.cm-s-default .CodeMirror-line > span::selection,
.cm-s-default .CodeMirror-line > span > span::selection {
background: #0050a4 !important;
}
.cm-s-default .CodeMirror-line::-moz-selection,
.cm-s-default .CodeMirror-line > span::-moz-selection,
.cm-s-default .CodeMirror-line > span > span::-moz-selection {
background: #0050a4 !important;
}

/* ---------- Syntax highlighting (generic) ---------- */
.cm-s-default span.cm-comment   { color: #0088ff; font-style: italic; }
.cm-s-default span.cm-string,
.cm-s-default span.cm-string-2  { color: #3ad900; }
.cm-s-default span.cm-number   { color: #ff628c; }
.cm-s-default span.cm-variable,
.cm-s-default span.cm-def,
.cm-s-default span.cm-attribute,
.cm-s-default span.cm-qualifier,
.cm-s-default span.cm-builtin   { color: #ffffff; }
.cm-s-default span.cm-variable-2 { color: #ffffff; }
.cm-s-default span.cm-operator,
.cm-s-default span.cm-keyword,
.cm-s-default span.cm-tag      { color: #ff9d00; }
.cm-s-default span.cm-atom     { color: #ff628c; }
.cm-s-default span.cm-meta     { color: #ffffff; }
.cm-s-default span.cm-property { color: #ffffff; }
.cm-s-default span.cm-type,
.cm-s-default span.cm-variable-3 { color: #ffee80; }

/* ---------- Markdown‑specific token classes ---------- */
.cm-s-default span.cm-header        { color: #ff9d00; font-weight: bold; }      /* #, ##, ### … */
.cm-s-default span.cm-quote         { color: #3ad900; font-style: italic; }     /* > blockquote */
.cm-s-default span.cm-strong        { color: #ffee80; font-weight: bold; }      /* **bold**   */
.cm-s-default span.cm-em            { color: #ffee80; font-style: italic; }     /* *italic*   */
.cm-s-default span.cm-link          { color: #0088ff; text-decoration: underline; } /* [text] */
.cm-s-default span.cm-url           { color: #0088ff; }                         /* http://…   */
.cm-s-default span.cm-strikethrough { color: #0088ff; text-decoration: line-through; }
.cm-s-default span.cm-code          { color: #3ad900; background: rgba(0, 34, 64, 0.5); font-family: monospace; }
.cm-s-default span.cm-hr            { color: #0088ff; }                         /* --- line   */
.cm-s-default span.cm-list          { color: #ff9d00; }                         /* -, *, +    */

/* ---------- Active line & matching bracket ---------- */
.cm-s-default .CodeMirror-activeline-background { background: rgba(0, 80, 164, 0.3); }
.cm-s-default .CodeMirror-matchingbracket      { text-decoration: underline; color: #fff !important; }


/* ---------- UI Button - Cobalt theme ---------- */
.ui-button {
background-color: #002240;      /* Cobalt background */
color: #ffffff;                 /* White foreground */
border: 1px solid #0050a4;      /* Cobalt blue border */
}

.ui-button:hover {
background-color: #0050a4;      /* Cobalt selection */
color: #ffffff;                 /* White on hover */
border-color: #0088ff;          /* Lighter border on hover */
}

.ui-button:focus,
.ui-button:active {
background-color: #0050a4;
color: #ffffff;
border-color: #0088ff;          /* Blue accent for focus */
outline: none;
}

.ui-button:disabled {
background-color: #001b33;      /* Darker background */
color: #0088ff;                 /* Muted text */
border-color: #0050a4;
opacity: 0.6;
cursor: not-allowed;
}


/* ---------- Control Bar - Cobalt theme ---------- */
.control-bar {
background-color: #002240;      /* Cobalt background */
color: #ffffff;                 /* White foreground */
border: 2px solid #0050a4;      /* Cobalt blue */
border-radius: 8px;
}

.control-bar button,
.control-bar .button {
background-color: #0050a4;      /* Cobalt selection */
color: #ffffff;                 /* White foreground */
border: 1px solid #0088ff;      /* Cobalt blue (lighter) */
border-radius: 6px;
}

.control-bar button:hover,
.control-bar .button:hover {
background-color: #0088ff;      /* Lighter Cobalt blue */
color: #ffffff;                 /* White */
border-color: #ff9d00;          /* Orange accent */
}

.control-bar input,
.control-bar select,
.control-bar textarea {
background-color: #001b33;      /* Darker Cobalt shade */
color: #ffffff;                 /* White foreground */
border: 1px solid #0050a4;      /* Cobalt blue */
}

.control-bar input:focus,
.control-bar select:focus,
.control-bar textarea:focus {
background-color: #002240;      /* Cobalt background */
border-color: #0088ff;          /* Blue accent */
outline: none;
}

.control-bar .icon,
.control-bar svg {
color: #0088ff;                 /* Blue accent */
fill: #0088ff;
}

.control-bar .icon:hover,
.control-bar svg:hover {
color: #ff9d00;                 /* Orange accent on hover */
fill: #ff9d00;
}

.control-bar .active,
.control-bar .selected {
background-color: #0088ff;      /* Blue accent */
color: #002240;                 /* Dark text for contrast */
border-color: #0088ff;
}


/* ---------- Control AI Bar - Cobalt theme ---------- */
.control-ai-bar {
background-color: #002240;      /* Cobalt background */
color: #ffffff;                 /* White foreground */
border: 2px solid #0050a4;      /* Cobalt blue */
border-radius: 8px;
}

.control-ai-bar button,
.control-ai-bar .button {
background-color: #0050a4;      /* Cobalt selection */
color: #ffffff;                 /* White foreground */
border: 1px solid #0088ff;      /* Cobalt blue (lighter) */
border-radius: 6px;
}

.control-ai-bar button:hover,
.control-ai-bar .button:hover {
background-color: #0088ff;      /* Lighter Cobalt blue */
color: #ffffff;                 /* White */
border-color: #ff9d00;          /* Orange accent */
}

.control-ai-bar input,
.control-ai-bar select,
.control-ai-bar textarea {
background-color: #001b33;      /* Darker Cobalt shade */
color: #ffffff;                 /* White foreground */
border: 1px solid #0050a4;      /* Cobalt blue */
}

.control-ai-bar input:focus,
.control-ai-bar select:focus,
.control-ai-bar textarea:focus {
background-color: #002240;      /* Cobalt background */
border-color: #0088ff;          /* Blue accent */
outline: none;
}

.control-ai-bar .icon,
.control-ai-bar svg {
color: #0088ff;                 /* Blue accent */
fill: #0088ff;
}

.control-ai-bar .icon:hover,
.control-ai-bar svg:hover {
color: #ff9d00;                 /* Orange accent on hover */
fill: #ff9d00;
}

.control-ai-bar .active,
.control-ai-bar .selected {
background-color: #0088ff;      /* Blue accent */
color: #002240;                 /* Dark text for contrast */
border-color: #0088ff;
} `,

"Dark Dracula": `
:root {
--main-color: #bd93f9;           /* Dracula purple */
--hover-color: #ff79c6;          /* Dracula pink */
--main-btn-icons: #f8f8f2;       /* Dracula foreground */
--hover-btn-icons: #ffffff;      /* White */
--focus-btn-icons: #f8f8f2;      /* Dracula foreground */
--navbar-background: #282a36;    /* Dracula background */
--body-background: #21222c;      /* Dracula current line (darker shade) */
--text-color: #f8f8f2;           /* Dracula foreground */
--sagecell-number-color: #bd93f9; /* Dracula purple */
}

/* -------------------------------------------------
CodeMirror – default (Dracula‑style) theme
------------------------------------------------- */

/* ---------- Base editor & gutter ---------- */
.cm-s-default .CodeMirror-gutters,
.cm-s-default.CodeMirror {
background-color: #282a36 !important;   /* dark background */
color: #f8f8f2 !important;              /* light text */
border: none;
}
.cm-s-default .CodeMirror-gutters { color: #282a36; }
.cm-s-default .CodeMirror-cursor { border-left: solid thin #f8f8f0; }
.cm-s-default .CodeMirror-linenumber { color: #6272a4; }

/* ---------- Selection ---------- */
.cm-s-default .CodeMirror-selected { background: rgba(255,255,255,.1); }
.cm-s-default .CodeMirror-line::selection,
.cm-s-default .CodeMirror-line > span::selection,
.cm-s-default .CodeMirror-line > span > span::selection,
.cm-s-default .CodeMirror-line::-moz-selection,
.cm-s-default .CodeMirror-line > span::-moz-selection,
.cm-s-default .CodeMirror-line > span > span::-moz-selection {
background: rgba(255,255,255,.1);
}

/* ---------- Syntax highlighting (generic) ---------- */
.cm-s-default span.cm-comment   { color: #6272a4; }
.cm-s-default span.cm-string,
.cm-s-default span.cm-string-2  { color: #f1fa8c; }
.cm-s-default span.cm-number   { color: #bd93f9; }
.cm-s-default span.cm-variable,
.cm-s-default span.cm-def,
.cm-s-default span.cm-attribute,
.cm-s-default span.cm-qualifier,
.cm-s-default span.cm-builtin   { color: #50fa7b; }
.cm-s-default span.cm-variable-2 { color: #fff; }
.cm-s-default span.cm-operator,
.cm-s-default span.cm-keyword,
.cm-s-default span.cm-tag      { color: #ff79c6; }
.cm-s-default span.cm-atom     { color: #bd93f9; }
.cm-s-default span.cm-meta     { color: #f8f8f2; }
.cm-s-default span.cm-property { color: #66d9ef; }
.cm-s-default span.cm-type,
.cm-s-default span.cm-variable-3 { color: #ffb86c; }

/* ---------- Markdown‑specific token classes ---------- */
.cm-s-default span.cm-header        { color: #ff79c6; font-weight: bold; }      /* #, ##, ### … */
.cm-s-default span.cm-quote         { color: #50fa7b; font-style: italic; }     /* > blockquote */
.cm-s-default span.cm-strong        { color: #ffb86c; font-weight: bold; }      /* **bold**   */
.cm-s-default span.cm-em            { color: #ffb86c; font-style: italic; }     /* *italic*   */
.cm-s-default span.cm-link          { color: #8be9fd; text-decoration: underline; } /* [text] */
.cm-s-default span.cm-url           { color: #8be9fd; }                         /* http://…   */
.cm-s-default span.cm-strikethrough { color: #6272a4; text-decoration: line-through; }
.cm-s-default span.cm-code          { color: #f1fa8c; background: rgba(68, 71, 90, 0.5); font-family: monospace; }
.cm-s-default span.cm-hr            { color: #6272a4; }                         /* --- line   */
.cm-s-default span.cm-list          { color: #ff79c6; }                         /* -, *, +    */

/* ---------- Active line & matching bracket ---------- */
.cm-s-default .CodeMirror-activeline-background { background: rgba(255,255,255,.1); }
.cm-s-default .CodeMirror-matchingbracket      { text-decoration: underline; color: #fff !important; }


/* ---------- UI Button - Dracula theme ---------- */
.ui-button {
background-color: #282a36;      /* Dracula background */
color: #f8f8f2;                 /* Dracula foreground */
border: 1px solid #44475a;      /* Dracula comment (subtle border) */
}

.ui-button:hover {
background-color: #44475a;      /* Dracula selection/comment */
color: #ffffff;                 /* Brighter white on hover */
border-color: #6272a4;          /* Lighter border on hover */
}

.ui-button:focus,
.ui-button:active {
background-color: #44475a;
color: #f8f8f2;
border-color: #bd93f9;          /* Purple accent for focus */
outline: none;
}

.ui-button:disabled {
background-color: #21222c;      /* Darker background */
color: #6272a4;                 /* Muted text */
border-color: #44475a;
opacity: 0.6;
cursor: not-allowed;
}


/* ---------- Control Bar - Dracula theme ---------- */
.control-bar {
background-color: #282a36;      /* Dracula background */
color: #f8f8f2;                 /* Dracula foreground */
border: 2px solid #44475a;      /* Dracula comment */
border-radius: 8px;
}

.control-bar button,
.control-bar .button {
background-color: #44475a;      /* Dracula selection */
color: #f8f8f2;                 /* Dracula foreground */
border: 1px solid #6272a4;      /* Dracula comment (lighter) */
border-radius: 6px;
}

.control-bar button:hover,
.control-bar .button:hover {
background-color: #6272a4;      /* Lighter Dracula comment */
color: #ffffff;                 /* Brighter white */
border-color: #bd93f9;          /* Purple accent */
}

.control-bar input,
.control-bar select,
.control-bar textarea {
background-color: #21222c;      /* Darker Dracula shade */
color: #f8f8f2;                 /* Dracula foreground */
border: 1px solid #44475a;      /* Dracula comment */
}

.control-bar input:focus,
.control-bar select:focus,
.control-bar textarea:focus {
background-color: #282a36;      /* Dracula background */
border-color: #bd93f9;          /* Purple accent */
outline: none;
}

.control-bar .icon,
.control-bar svg {
color: #bd93f9;                 /* Purple accent */
fill: #bd93f9;
}

.control-bar .icon:hover,
.control-bar svg:hover {
color: #ff79c6;                 /* Pink accent on hover */
fill: #ff79c6;
}

.control-bar .active,
.control-bar .selected {
background-color: #bd93f9;      /* Purple accent */
color: #282a36;                 /* Dark text for contrast */
border-color: #bd93f9;
}


/* ---------- Control AI Bar - Dracula theme ---------- */
.control-ai-bar {
background-color: #282a36;      /* Dracula background */
color: #f8f8f2;                 /* Dracula foreground */
border: 2px solid #44475a;      /* Dracula comment */
border-radius: 8px;
}

.control-ai-bar button,
.control-ai-bar .button {
background-color: #44475a;      /* Dracula selection */
color: #f8f8f2;                 /* Dracula foreground */
border: 1px solid #6272a4;      /* Dracula comment (lighter) */
border-radius: 6px;
}

.control-ai-bar button:hover,
.control-ai-bar .button:hover {
background-color: #6272a4;      /* Lighter Dracula comment */
color: #ffffff;                 /* Brighter white */
border-color: #bd93f9;          /* Purple accent */
}

.control-ai-bar input,
.control-ai-bar select,
.control-ai-bar textarea {
background-color: #21222c;      /* Darker Dracula shade */
color: #f8f8f2;                 /* Dracula foreground */
border: 1px solid #44475a;      /* Dracula comment */
}

.control-ai-bar input:focus,
.control-ai-bar select:focus,
.control-ai-bar textarea:focus {
background-color: #282a36;      /* Dracula background */
border-color: #bd93f9;          /* Purple accent */
outline: none;
}

.control-ai-bar .icon,
.control-ai-bar svg {
color: #bd93f9;                 /* Purple accent */
fill: #bd93f9;
}

.control-ai-bar .icon:hover,
.control-ai-bar svg:hover {
color: #ff79c6;                 /* Pink accent on hover */
fill: #ff79c6;
}

.control-ai-bar .active,
.control-ai-bar .selected {
background-color: #bd93f9;      /* Purple accent */
color: #282a36;                 /* Dark text for contrast */
border-color: #bd93f9;
}`,

"Dark Monokai": `
:root {
--main-color: #a6e22e;           /* Monokai green */
--hover-color: #f92672;          /* Monokai pink */
--main-btn-icons: #f8f8f2;       /* Monokai foreground */
--hover-btn-icons: #ffffff;      /* White */
--focus-btn-icons: #f8f8f2;      /* Monokai foreground */
--navbar-background: #272822;    /* Monokai background */
--body-background: #1e1f1c;      /* Monokai darker shade */
--text-color: #f8f8f2;           /* Monokai foreground */
--sagecell-number-color: #ae81ff; /* Monokai purple */
}

/* -------------------------------------------------
CodeMirror – default (Monokai‑style) theme
------------------------------------------------- */

/* ---------- Base editor & gutter ---------- */
.cm-s-default .CodeMirror-gutters,
.cm-s-default.CodeMirror {
background-color: #272822 !important;   /* dark background */
color: #f8f8f2 !important;              /* light text */
border: none;
}
.cm-s-default .CodeMirror-gutters { color: #272822; }
.cm-s-default .CodeMirror-cursor { border-left: solid thin #ffff00; }
.cm-s-default .CodeMirror-linenumber { color: #75715e; }

/* ---------- Selection ---------- */
.cm-s-default .CodeMirror-selected { background: #49483e !important; }
.cm-s-default .CodeMirror-line::selection,
.cm-s-default .CodeMirror-line > span::selection,
.cm-s-default .CodeMirror-line > span > span::selection {
background: #49483e !important;
}
.cm-s-default .CodeMirror-line::-moz-selection,
.cm-s-default .CodeMirror-line > span::-moz-selection,
.cm-s-default .CodeMirror-line > span > span::-moz-selection {
background: #49483e !important;
}

/* ---------- Syntax highlighting (generic) ---------- */
.cm-s-default span.cm-comment   { color: #75715e; }
.cm-s-default span.cm-string,
.cm-s-default span.cm-string-2  { color: #e6db74; }
.cm-s-default span.cm-number   { color: #ae81ff; }
.cm-s-default span.cm-variable,
.cm-s-default span.cm-def,
.cm-s-default span.cm-attribute,
.cm-s-default span.cm-qualifier,
.cm-s-default span.cm-builtin   { color: #a6e22e; }
.cm-s-default span.cm-variable-2 { color: #fff; }
.cm-s-default span.cm-operator,
.cm-s-default span.cm-keyword,
.cm-s-default span.cm-tag      { color: #f92672; }
.cm-s-default span.cm-atom     { color: #ae81ff; }
.cm-s-default span.cm-meta     { color: #f8f8f2; }
.cm-s-default span.cm-property { color: #66d9ef; }
.cm-s-default span.cm-type,
.cm-s-default span.cm-variable-3 { color: #fd971f; }

/* ---------- Markdown‑specific token classes ---------- */
.cm-s-default span.cm-header        { color: #f92672; font-weight: bold; }      /* #, ##, ### … */
.cm-s-default span.cm-quote         { color: #a6e22e; font-style: italic; }     /* > blockquote */
.cm-s-default span.cm-strong        { color: #fd971f; font-weight: bold; }      /* **bold**   */
.cm-s-default span.cm-em            { color: #fd971f; font-style: italic; }     /* *italic*   */
.cm-s-default span.cm-link          { color: #66d9ef; text-decoration: underline; } /* [text] */
.cm-s-default span.cm-url           { color: #66d9ef; }                         /* http://…   */
.cm-s-default span.cm-strikethrough { color: #75715e; text-decoration: line-through; }
.cm-s-default span.cm-code          { color: #e6db74; background: rgba(39, 40, 34, 0.5); font-family: monospace; }
.cm-s-default span.cm-hr            { color: #75715e; }                         /* --- line   */
.cm-s-default span.cm-list          { color: #f92672; }                         /* -, *, +    */

/* ---------- Active line & matching bracket ---------- */
.cm-s-default .CodeMirror-activeline-background { background: rgba(255,255,255,.1); }
.cm-s-default .CodeMirror-matchingbracket      { text-decoration: underline; color: #fff !important; }


/* ---------- UI Button - Monokai theme ---------- */
.ui-button {
background-color: #272822;      /* Monokai background */
color: #f8f8f2;                 /* Monokai foreground */
border: 1px solid #49483e;      /* Monokai comment (subtle border) */
}

.ui-button:hover {
background-color: #49483e;      /* Monokai selection/comment */
color: #ffffff;                 /* Brighter white on hover */
border-color: #75715e;          /* Lighter border on hover */
}

.ui-button:focus,
.ui-button:active {
background-color: #49483e;
color: #f8f8f2;
border-color: #66d9ef;          /* Cyan accent for focus */
outline: none;
}

.ui-button:disabled {
background-color: #1e1f1c;      /* Darker background */
color: #75715e;                 /* Muted text */
border-color: #49483e;
opacity: 0.6;
cursor: not-allowed;
}


/* ---------- Control Bar - Monokai theme ---------- */
.control-bar {
background-color: #272822;      /* Monokai background */
color: #f8f8f2;                 /* Monokai foreground */
border: 2px solid #49483e;      /* Monokai comment */
border-radius: 8px;
}

.control-bar button,
.control-bar .button {
background-color: #49483e;      /* Monokai selection */
color: #f8f8f2;                 /* Monokai foreground */
border: 1px solid #75715e;      /* Monokai comment (lighter) */
border-radius: 6px;
}

.control-bar button:hover,
.control-bar .button:hover {
background-color: #75715e;      /* Lighter Monokai comment */
color: #ffffff;                 /* Brighter white */
border-color: #66d9ef;          /* Cyan accent */
}

.control-bar input,
.control-bar select,
.control-bar textarea {
background-color: #1e1f1c;      /* Darker Monokai shade */
color: #f8f8f2;                 /* Monokai foreground */
border: 1px solid #49483e;      /* Monokai comment */
}

.control-bar input:focus,
.control-bar select:focus,
.control-bar textarea:focus {
background-color: #272822;      /* Monokai background */
border-color: #66d9ef;          /* Cyan accent */
outline: none;
}

.control-bar .icon,
.control-bar svg {
color: #66d9ef;                 /* Cyan accent */
fill: #66d9ef;
}

.control-bar .icon:hover,
.control-bar svg:hover {
color: #f92672;                 /* Pink accent on hover */
fill: #f92672;
}

.control-bar .active,
.control-bar .selected {
background-color: #66d9ef;      /* Cyan accent */
color: #272822;                 /* Dark text for contrast */
border-color: #66d9ef;
}


/* ---------- Control AI Bar - Monokai theme ---------- */
.control-ai-bar {
background-color: #272822;      /* Monokai background */
color: #f8f8f2;                 /* Monokai foreground */
border: 2px solid #49483e;      /* Monokai comment */
border-radius: 8px;
}

.control-ai-bar button,
.control-ai-bar .button {
background-color: #49483e;      /* Monokai selection */
color: #f8f8f2;                 /* Monokai foreground */
border: 1px solid #75715e;      /* Monokai comment (lighter) */
border-radius: 6px;
}

.control-ai-bar button:hover,
.control-ai-bar .button:hover {
background-color: #75715e;      /* Lighter Monokai comment */
color: #ffffff;                 /* Brighter white */
border-color: #66d9ef;          /* Cyan accent */
}

.control-ai-bar input,
.control-ai-bar select,
.control-ai-bar textarea {
background-color: #1e1f1c;      /* Darker Monokai shade */
color: #f8f8f2;                 /* Monokai foreground */
border: 1px solid #49483e;      /* Monokai comment */
}

.control-ai-bar input:focus,
.control-ai-bar select:focus,
.control-ai-bar textarea:focus {
background-color: #272822;      /* Monokai background */
border-color: #66d9ef;          /* Cyan accent */
outline: none;
}

.control-ai-bar .icon,
.control-ai-bar svg {
color: #66d9ef;                 /* Cyan accent */
fill: #66d9ef;
}

.control-ai-bar .icon:hover,
.control-ai-bar svg:hover {
color: #f92672;                 /* Pink accent on hover */
fill: #f92672;
}

.control-ai-bar .active,
.control-ai-bar .selected {
background-color: #66d9ef;      /* Cyan accent */
color: #272822;                 /* Dark text for contrast */
border-color: #66d9ef;
}`,
"Dark Star Trek": `
:root {
/* Star Trek LCARS-inspired colors */
--main-color: #ff9966;           /* LCARS orange */
--hover-color: #cc99cc;          /* LCARS lavender */
--main-btn-icons: #ffffff;       /* Light peach */
--hover-btn-icons: #ffffff;      /* White */
--focus-btn-icons: #ffcc99;      /* Light peach */
--navbar-background: #000000;    /* Deep space black */
--body-background: #111111;      /* Darker space black */
--text-color: #ffcc99;           /* Warm text */
--sagecell-number-color: #9999ff; /* LCARS blue */
}

/* -------------------------------------------------
CodeMirror – Star Trek LCARS theme
------------------------------------------------- */

/* ---------- Base editor & gutter ---------- */
.cm-s-default .CodeMirror-gutters,
.cm-s-default.CodeMirror {
background-color: #000000 !important;   /* deep black */
color: #ffcc99 !important;              /* warm text */
border: none;
}
.cm-s-default .CodeMirror-gutters { color: #000000; }
.cm-s-default .CodeMirror-cursor { border-left: solid thin #ff9966; }
.cm-s-default .CodeMirror-linenumber { color: #9999ff; }

/* ---------- Selection ---------- */
.cm-s-default .CodeMirror-selected { background: rgba(255, 153, 102, 0.2) !important; }
.cm-s-default .CodeMirror-line::selection,
.cm-s-default .CodeMirror-line > span::selection,
.cm-s-default .CodeMirror-line > span > span::selection {
background: rgba(255, 153, 102, 0.2) !important;
}
.cm-s-default .CodeMirror-line::-moz-selection,
.cm-s-default .CodeMirror-line > span::-moz-selection,
.cm-s-default .CodeMirror-line > span > span::-moz-selection {
background: rgba(255, 153, 102, 0.2) !important;
}

/* ---------- Syntax highlighting (generic) ---------- */
.cm-s-default span.cm-comment   { color: #6699cc; }         /* Blue comments */
.cm-s-default span.cm-string,
.cm-s-default span.cm-string-2  { color: #ffcc66; }         /* Yellow strings */
.cm-s-default span.cm-number   { color: #9999ff; }          /* Light blue numbers */
.cm-s-default span.cm-variable,
.cm-s-default span.cm-def,
.cm-s-default span.cm-attribute,
.cm-s-default span.cm-qualifier,
.cm-s-default span.cm-builtin   { color: #99ccff; }         /* Cyan variables */
.cm-s-default span.cm-variable-2 { color: #ffcc99; }        /* Peach */
.cm-s-default span.cm-operator,
.cm-s-default span.cm-keyword,
.cm-s-default span.cm-tag      { color: #ff9966; }          /* LCARS orange */
.cm-s-default span.cm-atom     { color: #cc99cc; }          /* Lavender */
.cm-s-default span.cm-meta     { color: #ffcc99; }          /* Peach */
.cm-s-default span.cm-property { color: #66cccc; }          /* Teal */
.cm-s-default span.cm-type,
.cm-s-default span.cm-variable-3 { color: #cc99ff; }        /* Purple */

/* ---------- Markdown‑specific token classes ---------- */
.cm-s-default span.cm-header        { color: #ff9966; font-weight: bold; }      /* LCARS orange headers */
.cm-s-default span.cm-quote         { color: #9999ff; font-style: italic; }     /* Blue quotes */
.cm-s-default span.cm-strong        { color: #ffcc66; font-weight: bold; }      /* Yellow bold */
.cm-s-default span.cm-em            { color: #cc99cc; font-style: italic; }     /* Lavender italic */
.cm-s-default span.cm-link          { color: #66cccc; text-decoration: underline; } /* Teal links */
.cm-s-default span.cm-url           { color: #66cccc; }                         /* Teal URLs */
.cm-s-default span.cm-strikethrough { color: #999999; text-decoration: line-through; }
.cm-s-default span.cm-code          { color: #ffcc66; background: rgba(255, 153, 102, 0.2); font-family: monospace; }
.cm-s-default span.cm-hr            { color: #ff9966; }                         /* Orange line */
.cm-s-default span.cm-list          { color: #ff9966; }                         /* Orange bullets */

/* ---------- Active line & matching bracket ---------- */
.cm-s-default .CodeMirror-activeline-background { background: rgba(255, 153, 102, 0.1); }
.cm-s-default .CodeMirror-matchingbracket      { text-decoration: underline; color: #ff9966 !important; }

/* ---------- UI Button - Star Trek LCARS theme ---------- */
.ui-button {
background-color: #000000;      /* Deep black */
color: #ffcc99;                 /* Warm peach text */
border: 2px solid #ff9966;      /* LCARS orange border */
border-radius: 20px;            /* Rounded LCARS style */
}

.ui-button:hover {
background-color: #ff9966;      /* LCARS orange */
color: #000000;                 /* Black text on hover */
border: 2px solid #ff9966;      /* LCARS orange border */
border-color: #ffcc99;          /* Light border */
}

.ui-button:focus,
.ui-button:active {
background-color: #cc99cc;      /* Lavender active */
color: #000000;
border-color: #cc99cc;
outline: none;
}

.ui-button:disabled {
background-color: #111111;      /* Darker background */
color: #666666;                 /* Muted gray */
border-color: #333333;
opacity: 0.5;
cursor: not-allowed;
}

/* ---------- Control Bar - Star Trek LCARS theme ---------- */
.control-bar {
background-color: #000000;      /* Deep black */
color: #ffcc99;                 /* Warm text */
border: 2px solid #333333;      /* Dark gray border */
border-radius: 15px;
}

.control-bar button,
.control-bar .button {
background-color: #ff9966;      /* LCARS orange */
color: #000000;
border: 1px solid #ffcc99;
border-radius: 15px;
}

.control-bar button:hover,
.control-bar .button:hover {
background-color: #cc99cc;      /* Lavender hover */
color: #000000;
border-color: #cc99cc;
}

.control-bar input,
.control-bar select,
.control-bar textarea {
background-color: #111111;
color: #ffcc99;
border: 1px solid #333333;      /* Dark gray border */
}

.control-bar input:focus,
.control-bar select:focus,
.control-bar textarea:focus {
background-color: #1a1a1a;
border-color: #666666;          /* Medium gray on focus */
outline: none;
}

.control-bar .icon,
.control-bar svg {
color: #000000;
fill: #000000;
}

.control-bar .icon:hover,
.control-bar svg:hover {
color: #000000;
fill: #000000;
}

.control-bar .active,
.control-bar .selected {
background-color: #9999ff;
color: #000000;
border-color: #9999ff;
}

/* ---------- Control AI Bar - Star Trek LCARS theme ---------- */
.control-ai-bar {
background-color: #000000;      /* Deep black */
color: #ffcc99;                 /* Warm text */
border: 2px solid #333333;      /* Dark gray border */
border-radius: 15px;
}

.control-ai-bar button,
.control-ai-bar .button {
background-color: #ff9966;      /* LCARS orange */
color: #000000;
border: 1px solid #ffcc99;
border-radius: 15px;
}

.control-ai-bar button:hover,
.control-ai-bar .button:hover {
background-color: #cc99cc;      /* Lavender hover */
color: #000000;
border-color: #cc99cc;
}

.control-ai-bar input,
.control-ai-bar select,
.control-ai-bar textarea {
background-color: #111111;
color: #ffcc99;
border: 1px solid #333333;      /* Dark gray border */
}

.control-ai-bar input:focus,
.control-ai-bar select:focus,
.control-ai-bar textarea:focus {
background-color: #1a1a1a;
border-color: #666666;          /* Medium gray on focus */
outline: none;
}

.control-ai-bar .icon,
.control-ai-bar svg {
color: #000000;
fill: #000000;
}

.control-ai-bar .icon:hover,
.control-ai-bar svg:hover {
color: #000000;
fill: #000000;
}

.control-ai-bar .active,
.control-ai-bar .selected {
background-color: #9999ff;
color: #000000;
border-color: #9999ff;
}
`
};