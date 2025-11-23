from bs4 import BeautifulSoup
import requests
from csv import writer

url = 'http://127.0.0.1:5000/complaints'
result = requests.get(url)
soup = BeautifulSoup(result.text, 'html.parser')

#v1
#with open('quotes.csv', 'w', newline='', encoding='utf-8')as f:
#    thewriter = writer(f)
    #pegando os dados
#    for p in soup.find_all('p'):
#        texto = p.get_text()
#    for h5 in soup.find_all('h5'):
#        autor = h5.get_text()
#    formataçao = [ autor,  texto]
#   thewriter.writerow(formataçao)


#v2
with open('analise/quotes.csv', 'w', newline='', encoding='utf-8') as f:
    thewriter = writer(f)
    thewriter.writerow(['Autor', 'Texto'])  # cabeçalho

    # Coleta pares <h5> + <p> corretamente
    autores = soup.find_all('h5')
    textos = soup.find_all('p')

    # Faz o zip dos dois para juntar por posição
    for autor_tag, texto_tag in zip(autores, textos):
        autor = autor_tag.get_text(strip=True)
        texto = texto_tag.get_text(strip=True)
        thewriter.writerow([autor, texto])

