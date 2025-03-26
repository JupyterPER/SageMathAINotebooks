import tkinter as tk
from tkinter import filedialog, ttk
import os
import json
import re
import glob
import subprocess

def parse_txt_text(lines):
    """
    Parses lines of the custom text format into a list of notebook cells.
    
    Returns a list of cell dictionaries suitable for inclusion in the
    nbformat=4 style Jupyter notebook JSON.
    """
    cells = []
    current_type = None   # 'markdown' or 'code'
    current_source = []
    
    # Helper to finalize the current cell (if any) and append to `cells`.
    def finalize_cell(cell_type, source_lines):
        if cell_type is None:
            return
        if cell_type == 'markdown':
            new_cell = {
                "cell_type": "markdown",
                "metadata": {},
                "source": source_lines
            }
        else:  # code
            new_cell = {
                "cell_type": "code",
                "metadata": {},
                "execution_count": None,
                "outputs": [],
                "source": source_lines
            }
        cells.append(new_cell)

    # A small regex to detect lines like "@Markdown[1]:" or "@In[2]:"
    cell_header_pattern = re.compile(r'^@(Markdown|In)\[\d+\]:\s*$')

    for line in lines:
        # Check if line indicates the start of a new cell
        if cell_header_pattern.match(line.strip()):
            # If we were in the middle of a cell, finalize it
            finalize_cell(current_type, current_source)
            # Reset and prepare for a new cell
            if line.strip().startswith('@Markdown'):
                current_type = 'markdown'
            else:
                current_type = 'code'
            current_source = []
        elif line.strip() == '@=================':
            # End of the current cell
            finalize_cell(current_type, current_source)
            current_type = None
            current_source = []
        else:
            # If we're inside a cell, store the line as part of the source
            if current_type is not None:
                # Keep the original line (including indentation)
                current_source.append(line)
            else:
                # We are outside any recognized cell, so ignore or handle as needed
                pass

    # If something remains in current_source, finalize it
    # (this covers the case where the file doesn't end with "@=================")
    finalize_cell(current_type, current_source)

    return cells

def build_notebook(cells):
    """
    Builds the full notebook structure (a dict) given a list of cell dicts.
    """
    notebook = {
        "nbformat": 4,
        "nbformat_minor": 4,
        "metadata": {
            "kernelspec": {
                "display_name": "SageMath",
                "language": "sage",
                "name": "sagemath"
            },
            "language_info": {
                "file_extension": ".sage",
                "mimetype": "text/x-sage",
                "name": "sage"
            }
        },
        "cells": cells
    }
    return notebook

def convert_ipynb_to_txt(notebook_path='', output_path=''):
    # If notebook path not specified, use current directory
    if not notebook_path:
        notebook_path = os.path.basename(notebook_path)
    
    # If output path not specified, create in current directory
    if not output_path:
        output_path = os.path.splitext(os.path.basename(notebook_path))[0] + '.txt'
    
    with open(notebook_path, 'r', encoding='utf-8') as file:
        notebook = json.load(file)

    converted_content = []
    markdown_count = 1
    code_count = 1
    last_cell_index = len(notebook['cells']) - 1

    for i, cell in enumerate(notebook['cells']):
        if cell['cell_type'] == 'markdown':
            converted_content.append(f"@Markdown[{markdown_count}]:")
            converted_content.append(''.join(cell['source']))
            if i != last_cell_index:
                converted_content.append('@=================')
            markdown_count += 1
        elif cell['cell_type'] == 'code':
            converted_content.append(f"@In[{code_count}]:")
            converted_content.append(''.join(cell['source']))
            if i != last_cell_index:
                converted_content.append('@=================')
            code_count += 1

    with open(output_path, 'w', newline='\n', encoding='utf-8') as file:
        file.write('\n'.join(converted_content))

def multiconvert_ipynb_to_txt(folder_path='', output_folder=''):
    # If folder path not specified, use current directory
    if not folder_path:
        folder_path = '.'
    
    # If output folder not specified, use current directory
    if not output_folder:
        output_folder = '.'
    
    # Ensure the output folder exists
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Scan for Jupyter notebooks
    notebook_files = glob.glob(os.path.join(folder_path, '*.ipynb'))
    converted_count = 0

    for notebook_path in notebook_files:
        # Define the output path for the converted notebook
        notebook_name = os.path.basename(notebook_path).replace('.ipynb', '.txt')
        output_path = os.path.join(output_folder, notebook_name)

        # Convert the notebook
        convert_ipynb_to_txt(notebook_path, output_path)
        converted_count += 1
        
    return converted_count

def convert_txt_to_ipynb(input_file='', output_file=''):
    # If input file not specified, use current directory
    if not input_file:
        input_file = os.path.basename(input_file)
    
    # If output file not specified, create in current directory
    if not output_file:
        output_file = os.path.splitext(os.path.basename(input_file))[0] + '.ipynb'
    
    # Read all lines from input
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Parse into notebook cells
    cells = parse_txt_text(lines)

    # Build the final notebook structure
    nb = build_notebook(cells)

    # Write as JSON
    with open(output_file, 'w', encoding='utf-8') as out:
        json.dump(nb, out, indent=2, ensure_ascii=False)

def multiconvert_txt_to_ipynb(folder_path='', output_folder=''):
    # If folder path not specified, use current directory
    if not folder_path:
        folder_path = '.'
    
    # If output folder not specified, use current directory
    if not output_folder:
        output_folder = '.'
    
    # Ensure the output folder exists
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Scan for txt files
    txt_files = glob.glob(os.path.join(folder_path, '*.txt'))
    converted_count = 0

    for txt_path in txt_files:
        # Define the output path for the converted file
        notebook_name = os.path.basename(txt_path).replace('.txt', '.ipynb')
        output_path = os.path.join(output_folder, notebook_name)

        # Convert the text file to notebook
        convert_txt_to_ipynb(txt_path, output_path)
        converted_count += 1
        
    return converted_count

def open_folder(path):
    """Opens given folder in system Explorer"""
    if not path:
        return
        
    folder_path = path
    if os.path.isfile(path):
        folder_path = os.path.dirname(path)
    
    if os.path.exists(folder_path):
        # Otvorenie priečinka na základe operačného systému
        if os.name == 'nt':  # Windows
            os.startfile(folder_path)
        elif os.name == 'posix':  # macOS a Linux
            try:
                # Skúsiť open pre macOS
                subprocess.call(['open', folder_path])
            except:
                try:
                    # Skúsiť xdg-open pre Linux
                    subprocess.call(['xdg-open', folder_path])
                except:
                    # Záložný variant pre Linux
                    subprocess.call(['nautilus', folder_path])

def create_gui():
    root = tk.Tk()
    root.title("Jupyter Notebook Converter")
    root.geometry("600x400")
    
    # Set application icon (optional)
    # root.iconbitmap("icon.ico")  # You would need to create and include an icon file
    
    # Style configuration
    style = ttk.Style()
    style.configure("TFrame", background="#f0f0f0")
    style.configure("TButton", font=("Arial", 10))
    style.configure("TLabel", font=("Arial", 10), background="#f0f0f0")
    
    notebook = ttk.Notebook(root)
    notebook.pack(fill='both', expand=True, padx=15, pady=15)
    
    # Single file conversion tab
    single_frame = ttk.Frame(notebook)
    notebook.add(single_frame, text="Single File Conversion")
    
    # Batch conversion tab
    batch_frame = ttk.Frame(notebook)
    notebook.add(batch_frame, text="Batch Conversion")
    
    # About tab
    about_frame = ttk.Frame(notebook)
    notebook.add(about_frame, text="About")
    
    # Single file conversion widgets
    header_label = ttk.Label(single_frame, text="Convert individual Jupyter notebooks or text files", font=("Arial", 12, "bold"))
    header_label.grid(row=0, column=0, columnspan=3, sticky="w", pady=(0, 15))
    
    input_path = tk.StringVar()
    output_path = tk.StringVar()
    
    ttk.Label(single_frame, text="Input file:").grid(row=1, column=0, sticky="w", pady=5)
    ttk.Entry(single_frame, textvariable=input_path, width=50).grid(row=1, column=1, padx=5, pady=5)
    ttk.Button(single_frame, text="Browse", command=lambda: input_path.set(filedialog.askopenfilename(
        filetypes=[("Jupyter Notebooks", "*.ipynb"), ("Text files", "*.txt"), ("All files", "*.*")]))).grid(row=1, column=2, padx=5)
    
    ttk.Label(single_frame, text="Output file:").grid(row=2, column=0, sticky="w", pady=5)
    ttk.Entry(single_frame, textvariable=output_path, width=50).grid(row=2, column=1, padx=5, pady=5)
    ttk.Button(single_frame, text="Browse", command=lambda: output_path.set(filedialog.asksaveasfilename(
        filetypes=[("Jupyter Notebooks", "*.ipynb"), ("Text files", "*.txt")]))).grid(row=2, column=2, padx=5)
    
    # Add conversion type selection for single file
    single_conversion_type = tk.StringVar(value="ipynb_to_txt")
    
    ttk.Radiobutton(single_frame, text="Convert Notebook to Text", variable=single_conversion_type, 
                   value="ipynb_to_txt").grid(row=3, column=0, sticky="w", pady=10)
    ttk.Radiobutton(single_frame, text="Convert Text to Notebook", variable=single_conversion_type, 
                   value="txt_to_ipynb").grid(row=3, column=1, sticky="w", pady=10)
    
    # Variable for storing the last successful conversion path
    last_successful_path = tk.StringVar()
    
    def convert_single_file():
        in_file = input_path.get()
        out_file = output_path.get()
        
        if not in_file:
            status_label.config(text="Error: Please select an input file")
            return
            
        try:
            # If no output path is specified, create it automatically in the same folder
            if not out_file:
                input_dir = os.path.dirname(in_file)
                input_name = os.path.basename(in_file)
                
                if single_conversion_type.get() == "ipynb_to_txt":
                    # Change the extension from .ipynb to .txt
                    output_name = os.path.splitext(input_name)[0] + ".txt"
                else:  # txt_to_ipynb
                    # Change the extension from from .txt to .ipynb
                    output_name = os.path.splitext(input_name)[0] + ".ipynb"
                    
                out_file = os.path.join(input_dir, output_name)
                output_path.set(out_file)
            else:
                # Check and, if necessary, add the correct file extension
                if single_conversion_type.get() == "ipynb_to_txt" and not out_file.lower().endswith('.txt'):
                    out_file += '.txt'
                    output_path.set(out_file)
                elif single_conversion_type.get() == "txt_to_ipynb" and not out_file.lower().endswith('.ipynb'):
                    out_file += '.ipynb'
                    output_path.set(out_file)
            
            if single_conversion_type.get() == "ipynb_to_txt":
                convert_ipynb_to_txt(in_file, out_file)
                status_label.config(text=f"Success: Converted notebook to text file")
            else:  # txt_to_ipynb
                convert_txt_to_ipynb(in_file, out_file)
                status_label.config(text=f"Success: Converted text file to notebook")
                
            # Store the path for a button to open the folder
            last_successful_path.set(out_file)
            # Activate the button to open the folder
            open_folder_button.config(state="normal")
            
        except Exception as e:
            status_label.config(text=f"Error: {str(e)}")
            open_folder_button.config(state="disabled")
    
    # Buttons for conversion and opening the folder should be placed within a button frame
    button_frame = ttk.Frame(single_frame)
    button_frame.grid(row=4, column=0, columnspan=3, pady=20)
    
    convert_button = ttk.Button(button_frame, text="Convert", command=convert_single_file)
    convert_button.pack(side=tk.LEFT, padx=5)
    
    open_folder_button = ttk.Button(button_frame, text="Open Destination Folder", 
                                   command=lambda: open_folder(last_successful_path.get()),
                                   state="disabled")
    open_folder_button.pack(side=tk.LEFT, padx=5)
    
    status_label = ttk.Label(single_frame, text="")
    status_label.grid(row=5, column=0, columnspan=3, pady=10)
    
    # Batch conversion widgets
    batch_header = ttk.Label(batch_frame, text="Convert multiple files at once", font=("Arial", 12, "bold"))
    batch_header.grid(row=0, column=0, columnspan=3, sticky="w", pady=(0, 15))
    
    input_dir = tk.StringVar()
    output_dir = tk.StringVar()
    
    ttk.Label(batch_frame, text="Input folder:").grid(row=1, column=0, sticky="w", pady=5)
    ttk.Entry(batch_frame, textvariable=input_dir, width=50).grid(row=1, column=1, padx=5, pady=5)
    ttk.Button(batch_frame, text="Browse", command=lambda: input_dir.set(filedialog.askdirectory())).grid(row=1, column=2, padx=5)
    
    ttk.Label(batch_frame, text="Output folder:").grid(row=2, column=0, sticky="w", pady=5)
    ttk.Entry(batch_frame, textvariable=output_dir, width=50).grid(row=2, column=1, padx=5, pady=5)
    ttk.Button(batch_frame, text="Browse", command=lambda: output_dir.set(filedialog.askdirectory())).grid(row=2, column=2, padx=5)
    
    conversion_type = tk.StringVar(value="ipynb_to_txt")
    
    ttk.Radiobutton(batch_frame, text="Convert Notebooks to Text", variable=conversion_type, 
                   value="ipynb_to_txt").grid(row=3, column=0, sticky="w", pady=10)
    ttk.Radiobutton(batch_frame, text="Convert Text to Notebooks", variable=conversion_type, 
                   value="txt_to_ipynb").grid(row=3, column=1, sticky="w", pady=10)
    
    # A variable should be created to store the output folder path for batch conversion
    batch_output_folder = tk.StringVar()
    
    def convert_batch():
        in_dir = input_dir.get()
        out_dir = output_dir.get()
        
        if not in_dir:
            batch_status.config(text="Error: Please select an input folder")
            return
            
        # If the output folder is not specified, use the input folder instead
        if not out_dir:
            out_dir = in_dir
            output_dir.set(out_dir)
            
        try:
            if conversion_type.get() == "ipynb_to_txt":
                count = multiconvert_ipynb_to_txt(in_dir, out_dir)
                batch_status.config(text=f"Success: Converted {count} notebook files to text format")
            else:
                count = multiconvert_txt_to_ipynb(in_dir, out_dir)
                batch_status.config(text=f"Success: Converted {count} text files to notebook format")
            
            # Saving the output folder for the open button
            batch_output_folder.set(out_dir)
            # Activating the button to open the folder
            batch_open_button.config(state="normal")
            
        except Exception as e:
            batch_status.config(text=f"Error: {str(e)}")
            batch_open_button.config(state="disabled")
    
    # Frame for buttons in batch conversion
    batch_button_frame = ttk.Frame(batch_frame)
    batch_button_frame.grid(row=4, column=0, columnspan=3, pady=20)
    
    batch_button = ttk.Button(batch_button_frame, text="Convert Batch", command=convert_batch)
    batch_button.pack(side=tk.LEFT, padx=5)
    
    batch_open_button = ttk.Button(batch_button_frame, text="Open Destination Folder", 
                                  command=lambda: open_folder(batch_output_folder.get()),
                                  state="disabled")
    batch_open_button.pack(side=tk.LEFT, padx=5)
    
    batch_status = ttk.Label(batch_frame, text="")
    batch_status.grid(row=5, column=0, columnspan=3, pady=10)
    
    # About tab content
    about_text = """
    Jupyter Notebook Converter v1.0
    
    This application converts between Jupyter notebooks (.ipynb) and 
    a custom text format (.txt) that preserves notebook structure.
    
    Features:
    - Single file conversion
    - Batch conversion of multiple files
    - Supports SageMath kernel configuration
    - Auto-set output path if not specified
    - Open destination folder in file explorer
    """
    
    about_label = ttk.Label(about_frame, text=about_text, justify="center", wraplength=500)
    about_label.pack(expand=True, pady=20)
    
    root.mainloop()

if __name__ == "__main__":
    create_gui()