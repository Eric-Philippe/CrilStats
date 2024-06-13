import nbformat
from nbformat.v4 import new_markdown_cell

def generate_toc(notebook_path):
    with open(notebook_path, 'r', encoding='utf-8') as f:
        nb = nbformat.read(f, as_version=4)

    toc = []
    for cell in nb.cells:
        if cell.cell_type == 'markdown':
            lines = cell.source.splitlines()
            for line in lines:
                if line.startswith('#'):
                    header_level = len(line) - len(line.lstrip('#'))
                    header_text = line.lstrip('#').strip()
                    # Génère un identifiant d'ancre compatible avec le markdown
                    header_link = header_text.lower().replace(' ', '-').replace('.', '').replace(',', '')
                    toc.append(f"{'  ' * (header_level - 1)}- [{header_text}](#{header_link})")

    toc_md = "# Table des matières\n" + '\n'.join(toc)

    # Ajoute la TOC au début du notebook
    toc_cell = new_markdown_cell(toc_md)
    nb.cells.insert(0, toc_cell)

    with open(notebook_path, 'w', encoding='utf-8') as f:
        nbformat.write(nb, f)
    print(f"Table des matières ajoutée au notebook : {notebook_path}")

# Utilisation du script
generate_toc('playbook.ipynb')
