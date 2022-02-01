class Item {
    //atua como a função construtora do meu projeto
    constructor() {
        this.id = 1;
        this.listaDeItens = [];
        this.verificaId = null;
    }

    /* e aqui eu coloco dos os métodos que vão ser executados toda vez que 
    essa classe for executada */

    lerEntrada() {
        let item = {} //digo que essa variável agora é um objeto
        item.id = this.id

        /* pego o que o usuário digitou no campo input cujo id é 'nomeItem'
        e esse elemento tem que ser adicionado na minha variável item como uma propriedade do meu objeto */
        //item.nomeCliente = this.apiGet('https://randomuser.me/api/?inc=name');
        item.nome = document.getElementById('nomeItem').value;
        item.preco = document.getElementById('precoItem').value;

        return item;
    }

    async salvarItem() {
        /* toda vez que o usuário clicar para salvar um item, ele chama o método lerEntrada, pega os dados
        joga dentro do objeto item (dentro do método ler entrada, depois esse objeto é retornado para o 
        método salvarItem, que é armazenado no itemSalvo*/

        // no 'itemSalvo' está todos os atributos do meu objeto que foi lido acima
        let itemSalvo = this.lerEntrada();

        /* aqui eu passo os meus dados de entrada para minha função de validação, para checar os tipos de
        dados que o usuário está tentando salvar, se passar na validação eu salvo esses dados*/
        if (this.validaçãoDeEntrada(itemSalvo) == true) {
            // verifico se o id já existe, se não existir é pq o item está sendo adicionado
            // se o id existir, então o usuário está editando um item
            if (this.verificaId == null) {
                this.listaDeItens.push(itemSalvo);   // o push adiciona um elemento no final da lista.
                this.id++;
                
            } else {
                this.salvarItemEditado(this.verificaId, itemSalvo);
            }
        }

        await this.listarItens();
        this.limparCampos();

    }
    

    salvarItemEditado(id, item) {
        for (let i = 0; i < this.listaDeItens.length; i++) {
            if (this.listaDeItens[i].id == id) {
                this.listaDeItens[i].nome = item.nome;
                this.listaDeItens[i].preco = item.preco;
            }
        }
    }

    validaçãoDeEntrada() {
        let nome = document.getElementById('nomeItem').value;
        let preco = document.getElementById('precoItem').value;

        if (nome == '' || preco == '') {
            alert('Preencha todos os campos'); 
            return false;
        }

        else {
            return true
        }
    }

    async listarItens() {

        let corpoTabela = document.getElementById('corpoTabela');
        corpoTabela.innerText = '';

        // percorre todos os elementos do array e adiciona as linhas e colunas
        for (let i = 0; i < this.listaDeItens.length; i++) {
            let linha = corpoTabela.insertRow(); // insere uma linha na tabela

            let nomeCliente = await this.getCliente();
            let colunaNomeEmail = linha.insertCell(); // cria uma nova coluna
            let colunaId = linha.insertCell();
            let colunaItem = linha.insertCell();
            let colunaPreco = linha.insertCell();
            let colunaEditar = linha.insertCell();
            let colunaExcluir = linha.insertCell();

            colunaNomeEmail.classList.add('centralizar');
            colunaId.classList.add('centralizar');
            colunaItem.classList.add('centralizar');
            colunaPreco.classList.add('centralizar');
            colunaEditar.classList.add('centralizar');
            colunaExcluir.classList.add('centralizar');

          
            colunaNomeEmail.innerText = JSON.stringify(nomeCliente);
            colunaId.innerText = this.listaDeItens[i].id;
            colunaItem.innerText = this.listaDeItens[i].nome;
            colunaPreco.innerText = this.listaDeItens[i].preco;

            let iconEditar = document.createElement('img'); //crio o elemento para armazernar o ícone editar
            iconEditar.src = 'icons/editar.png' // passo o caminho do ícone  
            // aqui eu passo os dados convertidos com stringfy
            iconEditar.setAttribute("onclick", "item.editar(" + JSON.stringify(this.listaDeItens[i]) + ")");


            let iconExcluir = document.createElement('img');
            iconExcluir.src = 'icons/excluir.png';
            /**aqui eu uso o setAttribute no meu ícone excluir, que recebe como parâmetro um evento, e uma ação */
            iconExcluir.setAttribute("onclick", "item.excluir(" + this.listaDeItens[i].id + ")");

            // addicionando o ícone na coluna
            colunaEditar.appendChild(iconEditar); // o meu icon editar se torna "filho" da coluna editar
            colunaExcluir.appendChild(iconExcluir);
        }
    }

    async getCliente(){
        let nomeCliente = ''
        fetch(`https://randomuser.me/api/?results=1`)
                       .then((resp) => resp.json())
                       .then((response) => {
                      //o reduce executa a função de callback uma vez para cada elemento presente no array, a fim de 
                      //produzir um único resultado
                        return response.results.reduce(
                           (html, response) => html +  `Nome: ${response.name.first} ${response.name.last} - Email: ${response.email} `,''            
                  )
                  })
       
      }
      
      

    excluir(id) {

        let corpoTabela = document.getElementById('corpoTabela');

        if (confirm('Confirmar Exclusão')) {

            // aqui eu percorro a lista de itens, para ver se encontro um id igual o id que recebi por parâmetro
            for (let i = 0; i < this.listaDeItens.length; i++) {
                // se os ID's forem iguais aí eu deleto o item usando a função splice
                // que recebe como argumento a posição do item, e a quantidade de registro pra deletar
                if (this.listaDeItens[i].id == id) {
                    this.listaDeItens.splice(i, 1);
                    corpoTabela.deleteRow(i); // remove toda a linha com esse id
                }
            }
        }
    }

    excluirTodosOsItens() {

        if (confirm('Deseja excluir todos os itens?')) {
            let corpoTabela = document.getElementById('corpoTabela');
            $('#corpoTabela tr').remove();
            this.listaDeItens = [];
        }

    }

    editar(dadosDeEntrada) {
        // armazeno o id do item que quero editar dentro de virificaId, que vai ser pego dentro de salvarItem também
        this.verificaId = dadosDeEntrada.id
        //aqui eu pego os valores que já tenho na minha tabela e jogo pros campos de entrada novamente
        //para que seja possível a alteração dos dados
        document.getElementById('nomeItem').value = dadosDeEntrada.nome;
        document.getElementById('precoItem').value = dadosDeEntrada.preco;
    }

    limparCampos() {
        document.getElementById('nomeItem').value = '';
        document.getElementById('precoItem').value = '';

        this.verificaId = null;
    }

}

//aqui é criado um novo objeto do tipo item e atribuido a variável item.
let item = new Item();