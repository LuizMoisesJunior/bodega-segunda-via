let items = [];
let register = {};

//funções crud
async function findAll(filter = {}) {
    return fetch(`http://localhost:3000/clientes`)
        .then(res => res.json())
        .catch(err => {
            console.error('Erro ao buscar clientes:', err);
            return []; // evita undefined
        });
}


async function findById(id) {

    fetch(`http://localhost:3000/clientes/${id}`)
        .then(res => res.json())
        .catch(err => console.error('Erro:', err));

}

async function insert(document) {
    fetch(`http://localhost:3000/clientes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(document)
    })
        .then(res => res.json())
        .then(data => console.log('Registro cadastrado com sucesso:', data))
        .catch(err => console.error('Erro:', err));
}

async function update(document) {
    fetch(`http://localhost:3000/clientes/${document.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(document)
    })
        .then(res => res.json())
        .then(data => console.log('Registro atualizado com sucesso (PUT):', data))
        .catch(err => console.error('Erro:', err));

}

async function deleteByid(id) {

    fetch(`http://localhost:3000/clientes/${id}`, {
        method: 'DELETE'
    })
        .then(() => console.log(`Contato com ID ${id} deletado.`))
        .catch(err => console.error('Erro:', err));

}

//
function preencherTabela(clientes) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    // Preenche com os dados do JSON
    clientes.forEach(cliente => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
                    <td>${cliente.nome}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.telefone}</td>
                    <td><img src="${cliente.foto}" alt="Foto" width="50" class="rounded-circle"></td>
                    <td>${cliente.endereco}</td>
                    <td>
                        <a href="#" class="btn btn-warning btn-sm">Editar</a>
                        <a href="#" class="btn btn-danger btn-sm">Excluir</a>
                    </td>
                `;

        tbody.appendChild(tr);
    });
}

async function load() {
    try {
        items = await findAll();
        console.log('Clientes carregados:', items);

        // Aqui você pode exibir os clientes na tabela
        // Exemplo: preencherTabela(items);
        preencherTabela(items);

    } catch (err) {
        console.error('Erro ao carregar clientes:', err);
    }
}


function onClickAdd() {
    register = {
        id: null,
        nome: null,
        email: null,
        telefone: null,
        foto: null,
        endereco: null
    }
}

async function onClickEdit(id) {
    register = await this.findById(id);
    // chamar função que abre o formulario de cliente
}

async function onClickSave() {
    // Pega dados do form e preenche o objeto register
    register.nome = document.getElementById("nome").value;
    register.email = document.getElementById("email").value;
    register.telefone = document.getElementById("telefone").value;
    register.foto = document.getElementById("foto").value;
    register.endereco = document.getElementById("endereco").value;

    if (register.id) {
        await update(register);
    } else {
        await insert(register);
    }

    // Recarrega a lista de clientes
    await load();

    // Fecha o offcanvas
    const offcanvasEl = document.getElementById('cadastro');
    bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl).hide();

    // Limpa o formulário
    document.getElementById("form-cadastro").reset();
    register = {};
}



document.addEventListener('DOMContentLoaded', () => {
    load();

    const form = document.getElementById('form-cadastro');
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        await onClickSave();
    });
});

