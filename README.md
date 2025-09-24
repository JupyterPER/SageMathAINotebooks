# SageMath AI Notebooks

**SageMath AI Notebooks** are interactive HTML documents inspired by the [*nbplayer*](https://github.com/ingodahn/nbplayer), extended with richer functionality and improved interactivity.

* Brings the familiar computation experience of a Python‑based SageMath CAS, similar to Jupyter Notebooks.

* Standalone HTML notebooks open directly in any modern web browser, on any platform:

  * **No installation required**.
  * Computations are handled by a cloud‑based kernel via [*SageMathCell*](https://sagecell.sagemath.org/).
  * Only an Internet connection is needed.

***

## Features

* **Built‑in AI assistant:**

  * Provides code generation (`AI Complete`), code formatting and commenting (`AI Format`), and code explanations (`AI Explain`).
  * **Context‑aware**: the assistant sees code from previous cells.
  * Implemented via APIs from multiple providers. Requires an API key (both free and paid providers are supported).
  * Once an API key is provided and saved in the AI settings, assistant actions become available through the toolbar of each code cell.
  * The notebook works fully even without enabling the AI assistant.

* **Automatic execution of cells** (`Run All` or `Run All Up To`) with adjustable delay between executions.

* **Built in Import/Export**:

  * Convert between Jupyter Notebooks (`.ipynb`) and SageMath AI Notebooks (`.html`).
  * Works also with standardized human‑readable `.txt` notebook files (useful for further processing, backups, or as attachments for AI chatbot interactions).

* **Editable, dynamically rendered Markdown cells** with **LaTeX** and **HTML** support.

* **Cell actions**: add, remove, duplicate, reorder, and convert between code and Markdown cells. Controlled from a simple toolbar for each cell.

* **Data import**: upload Excel (`.xlsx`) files, automatically generating a code cell with a Pandas DataFrame.

* **Copy computation outputs** (text, tables, plots) from code cells into Markdown cells.

* **Dynamic, interactive Table of Contents** generated from Markdown headers.

***

## Deployment Scenarios

* Lightweight work on small or moderately demanding computational projects.
* Educational purposes and hobbyist usage.
* Publishing interactive SageMath computations on the web or some LMS platforms (e.g. LMS Canvas).

***

## Motivation

* The simple offline Windows installer for SageMath lost support.
  * Alternative installations can be resource‑intensive (large memory footprint) and may involve some tweaking.
* Cloud services for SageMath are either unstable for free usage or locked behind a paywall.

***

## Known Issues

### SageMathCell limitations

* The SageMathCell kernel automatically terminates after ~40 minutes (or ~20 minutes of inactivity).
  * Workaround: restart the notebook and re‑run cells, or save it and reopen later.
* Some Python/Sage libraries may not be available in SageMathCell.
  * In such cases, contact the SageMathCell maintainers.
* Internet access from SageMathCell is restricted for security reasons (GitHub repositories are accessible).

### SageMath AI Notebook limitations

* On the very first *“Run All”* execution, results from the first cell may appear in subsequent cells\
  (delay due to kernel initialization).
  * Recommended: manually execute the first cell, then use “Run All” or re-execute affected cell.

* Saving a notebook triggers a browser **download action**:

  * You cannot continue working on the currently open notebook after saving.
  * To continue, reopen the downloaded `.html` notebook.

* Outputs need to be recomputed after reopening (unless copied into Markdown via *“Copy output to Markdown”*).

* Undo/Redo (as of now) is not supported for cell actions (delete, reorder, etc.).
  * However, standard undo/redo shortcuts (Ctrl + Z and Ctrl + Shift + Z) still work when editing code or text inside a cell.

***
