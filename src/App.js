import React, { useState,useEffect } from 'react';
import './App.css'
import { FaSearch } from "react-icons/fa";

function App() {

  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState({});
  const [lista, setLista] = useState([]);
  const [buscar_cep, setBuscarCep] = useState(''); 
  const [listaVisivel, setListaVisivel] = useState([]); //Torna a lista visivel para pesquisa

  function cadastrar(e) {
    e.preventDefault(); //previne recarregamento da página

    //atualiza a lista com um array de elementos
    //adiciona um novo objeto, com as propriedades nome, sobrenome e endereco
    //... copia todos os elementos da lista para o novo array
    setLista([...lista, { nome: nome, sobrenome: sobrenome, endereco: endereco, visivel: true }]);
    limpar();
    alert(`${nome} ${sobrenome} de CEP: ${cep} Cadastrado com Sucesso!`);
  }

  const buscarEndereco = async () => { // Define uma função assíncrona 

    if (!cep){
      return;
      // Se o valor de 'cep' não estiver definido (ou for vazio), não irá retornar nada
    } else if (cep.length !== 8 && cep.length !== 9 || (cep.length === 9 && cep.charAt(6)==='-')) {// Verifica se o comprimento do 'cep' é 8 ou 9 caracteres, e se tem um hífen no lugar errado.
      alert('CEP inválido! Informe o CEP corretamente');
      setCep('')
      return;
  }else  if (!nome || !sobrenome || !cep) {  // Verifica se os campos 'nome', 'sobrenome' ou 'cep' estão vazios.
    return alert(`Por favor, preencha todos os campos`);
  }

    try {
       // Tenta fazer uma requisição à API do ViaCEP usando o 'cep' fornecido, aguardando a resposta.
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const dadosEndereco = await response.json();
      // Converte a resposta da API para formato JSON.

      if (!dadosEndereco.erro) {
         // Se não houver erro na resposta da API, atualiza o estado 'endereco' com os dados retornados.
        setEndereco(dadosEndereco);
     }else{
        alert('CEP não encontrado');
      } 
    } catch (error) {
      // Se ocorrer um erro durante a requisição à API, exibe o erro no console.
      console.error(error)
    }

  };

  function limpar(){ //limpa os campos label
    setCep('')
    setEndereco({})
    setNome('');
    setSobrenome('');
  };

  function excluirPessoa(cep){  //exclui uma pessoa atrávez do cep
    //filtra a pessoa atravez do cep
    const novaLista = lista.filter(item => item.endereco.cep !== cep); 
    setLista(novaLista); //atualiza a lista
  }

  function limparLista(){
    //limpa a lista de cadastro
    setEndereco({});
    setLista([]);
  }

  //a lista será visivel enquanto estiver algum elemento na lista
  useEffect(() => {
    setListaVisivel(lista);
  }, [lista]);

  //encontrará uma pessoa atrávez do cep
  function pesquisar() {
    let procurar = buscar_cep.toLowerCase().replace("-","");// Remover todos os "-" do CEP
    const novaListaVisivel = lista.filter(item =>
      item.endereco.cep.replace("-", "").includes(procurar)
    );//vai filtrar o cep correspondente
    setListaVisivel(novaListaVisivel);
  }

  return (
    <div className='fundo'>
      <div className='pagina'> 
      <form>
        <h1>Cadastro de CEP</h1>
          <div className='card'>
            <label htmlFor="nome">Nome:</label>
            <br />
            <input
            placeholder='Nome'
            type='text'
            id='nome'
            value={nome}
            onChange={(e) => setNome(e.target.value)} />
            <br />
            <br />

            <label htmlFor="sobrenome">Sobrenome:</label>
            <br />
            <input
            placeholder='Sobrenome'
            type='text'
            id='sobrenome'
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)} />
            <br />
            <br />

            <label htmlFor="cep">CEP:</label>
              <br />
            <input
            placeholder='cep'
            type='text'
            id='cep'
            value={cep}
            onChange={(e) => setCep(e.target.value)} />
            <br />
            <div className='botoes_form'> 
              <button type="button" onClick={buscarEndereco}>Buscar</button>
              <button type="button" onClick={limpar}>Limpar</button>
            </div>
          </div>
      </form>
      <div className='card'>
        {endereco.cep && (
          <div className='enderecocad'>
            <h2>Endereço Completo</h2>
            <p>Logradouro: {endereco.logradouro}</p>
           <p>Bairro: {endereco.bairro}</p>
            <p>Localidade: {endereco.localidade}</p>
            <p>UF: {endereco.uf}</p>
            <p>CEP: {endereco.cep}</p>
            <div id='botao_cadastrar'>
            <button  type="button" onClick={cadastrar}>Cadastrar</button>
            </div>
          </div>
      )}
      </div>

      <div className='card'>
        {lista.length>0&& (
          <div className='cadastrados'>
            <h1>Pessoas Cadastradas</h1>

            <div className='search'>
            <label htmlFor='buscar_cep' ></label>
            <br />
            <div className='search_input'>
            <FaSearch className="search_icone"/>
              <input
              placeholder='Pesquisar pelo CEP'
              type='text'
              id='buscar_cep'
              value={buscar_cep}
              onKeyUp={pesquisar}
              onChange={(e) => setBuscarCep(e.target.value)}
              />
              </div>
            </div>
            <div>
            <ul className='lista_cadastros'>
              {listaVisivel.map(
                (item) => (
                  <li className='item_cadastro' key={item.endereco.cep}>
                    <strong>{item.nome.toUpperCase()} {item.sobrenome.toUpperCase()} </strong>
                    <br /> {item.endereco.logradouro}, {item.endereco.bairro}, {item.endereco.localidade} - {item.endereco.uf} <br /> CEP: {item.endereco.cep}
                    <br /><br />
                    <button type='button' onClick={() => excluirPessoa(item.endereco.cep)}>Excluir Cadastro</button>
                    </li>
                    )
                    )}
            </ul>
              <button type='button' onClick={limparLista}>Excluir Lista</button>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default App;