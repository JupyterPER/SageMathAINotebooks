# SageMath AI Notebooks

**SageMath AI Notebooks** are interactive HTML documents inspired by the *nbplayer* project by Ingo Dahn, extended with richer functionality and improved interactivity.

* Brings the familiar computation experience of a Python‑based SageMath CAS, similar to Jupyter Notebooks.

* Standalone HTML notebooks open directly in any modern web browser, on any platform:

  * **No installation required**.
  * Computations are handled by a cloud‑based kernel provided by **SageMathCell**.
  * Only an Internet connection is needed.

***

## Extended Features

* **Built‑in AI assistant** (via APIs from multiple providers):

  * Provides code generation (`AI Complete`), code formatting and commenting (`AI Format`), and code explanations (`AI Explain`).
  * **Context‑aware**: the assistant sees code from previous cells.
  * Requires an API key (both free and paid providers are supported).
  * The notebook works fully even without enabling the AI assistant.

* **Automatic execution of cells** (`Run All` or `Run All Up To`) with adjustable delay between executions.

* **Import/Export**:

  * Convert between Jupyter Notebooks (`.ipynb`) and SageMath AI Notebooks.
  * Work with standardized human‑readable `.txt` notebook files (useful for conversions, backup, or AI chatbot interactions).
  * Automatic backup of the current notebook.

* **Editable, dynamically rendered Markdown cells** with full **LaTeX** and **HTML** support.

* **Cell actions**: add, remove, duplicate, reorder, and convert between code and Markdown cells. Controlled from a simple toolbar for each cell.

* **Data import**: upload Excel (`.xlsx`) files, automatically generating a code cell with a Pandas DataFrame.

* **Copy computation outputs** (text, tables, plots) from code cells into Markdown cells.

* **Dynamic, interactive Table of Contents** generated from Markdown headers.

***

## Deployment Scenarios

* Lightweight work on small or moderately demanding computational projects.
* Educational purposes and hobbyist usage.
* Publishing interactive SageMath computations on the web or LMS platforms.
* Try out the [demo](https://poe.com/chat/v7v05ffkmprl9j7i7o#) (link to be added) or download a **blank template** – that’s all you need to get started.

***

## Motivation

* The simple offline Windows installer for SageMath lost support.
  * Alternative installations can be resource‑intensive (large memory footprint).
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

* On the very first “Run All” execution, results from the first cell may appear only in subsequent cells\
  (delay due to kernel initialization).
  * Recommended: manually run the first cell, then use “Run All.”

* Saving a notebook triggers a browser **download action**:

  * You cannot continue working on the currently open notebook after saving.
  * To continue, reopen the downloaded `.html` notebook.

* Outputs need to be recomputed after reopening (unless copied into Markdown via “Copy output to Markdown”).

* Undo/Redo is **not supported** for cell actions (delete, reorder, etc.).
  * However, standard undo/redo shortcuts still work when editing code or text inside a cell.

***


