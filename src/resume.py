import re
import random
import string
import pyperclip

# Ler o conteúdo do clipboard
file_contents = pyperclip.paste()

# Utilizar expressões regulares para apagar o conteúdo entre as tags
file_contents = re.sub(r"<h1>.*?</h1>", "", file_contents)
file_contents = re.sub(r"<h2>.*?</h2>", "", file_contents)
file_contents = re.sub(r"<h3>.*?</h3>", "", file_contents)
file_contents = re.sub(r"<h4>.*?</h4>", "", file_contents)
file_contents = re.sub(r"<p>.*?</p>", "", file_contents)
file_contents = re.sub(r"<h5>.*?</h5>", "", file_contents)
file_contents = re.sub(r"<ul>.*?</ul>", "", file_contents)
file_contents = re.sub(r"<li>.*?</li>", "", file_contents)
# Gerar um sufixo aleatório
random_suffix = ''.join(random.choices(string.ascii_letters + string.digits, k=5))

# Pedir o nome do arquivo para salvar
file_name = input("Insira o nome do arquivo a ser salvo (ex: file): ")

# Pedir a extensão do arquivo para salvar
file_ext = input("Insira a extensão do arquivo (ex: .html): ")

# Escrever o conteúdo modificado em um novo arquivo
with open(f"{file_name}_{random_suffix}{file_ext}", "w") as f:
    f.write(file_contents)
