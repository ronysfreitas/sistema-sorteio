const WS = "http://localhost/projetos/cadastro/ws/pessoas.php"

var divPessoas = document.getElementById("add_pessoa")

function atualizar(sorteados = "") {
    const params = new URLSearchParams();
    if (sorteados != "") {
        params.append('sort', sorteados);
    }

    axios.post(WS, params).then(function (response) {
        divPessoas.innerHTML = "";
        if (response.data.pessoas.length > 0) {
            var nSorteios = 0;
            response.data.pessoas.forEach(pessoa => {
                nSorteios += parseInt(pessoa.sorteado)
                divPessoas.innerHTML += "<li "
                    + "ondblclick='deletar(" + pessoa.id + ")' "
                    + "class='itemPessoa' "
                    + ((pessoa.sorteado != 0) ? "style='background-color: #FFD70077;'" : "") + ">"
                    + pessoa.nome + " - " + ((pessoa.estudante == 1) ? "Estudante" : "Visitante")
                    + ((sorteados == "") ? (" - ##" + pessoa.telefone.substr(2, 5) + "#### </li>") : " - " + pessoa.sorteio + "</li>")
            });

            if (sorteados == "") {
                document.getElementById("presentes").innerText = response.data.pessoas.length
            }
            document.getElementById("present_k").innerText = nSorteios;

        } else {
            divPessoas.innerHTML = "<li>Sem pessoas cadastradas</li>"
        }
    })
}

function sortear() {
    const params = new URLSearchParams();
    params.append('sort', "0");
    axios.post(WS, params).then(function (response) {
        var qnt = response.data.pessoas.length
        if (qnt > 0) {
            var sorteado = gerarSorteio(0, qnt - 1)

            const params = new URLSearchParams();
            params.append('i', 0);
            params.append('id', response.data.pessoas[sorteado].id);
            params.append('sorteio', document.getElementById("sorteio").value);

            axios.post(WS, params).then(function (responseS) {
                if (responseS.data == 1) {
                    swal(
                        "Parabéns, " + response.data.pessoas[sorteado].nome + "!",
                        "Você acaba de ganhar um prêmio: " + document.getElementById("sorteio").value
                        , "success"
                    )
                } else {
                    swal(
                        "Erro ao realizar o sorteio",
                        "Por favor, tente novamente", "error"
                    )
                }
                atualizar(0)
            })

        } else {
            swal(
                "Sem participantes para sortear", "Cadastre e tente novamente", "error"
            )
        }
    })
}

function inserirPessoa() {

    const params = new URLSearchParams();
    params.append('i', 1);
    params.append('n', document.getElementById("nome").value);
    params.append('p', document.getElementById("profissao").value);
    params.append('t', document.getElementById("telefone").value);
    params.append('e', document.getElementById("est_visit").value);
    params.append('k', document.getElementById("kahoot").checked ? 1 : 0);

    axios.post(WS, params).then(function (response) {
        if (response.data == 1) {
            swal(
                "Participante cadastrado!", "Boa Sorte", "success"
            )
        } else {
            swal(
                "Participante não cadastrado!", "Por favor, tente novamente", "error"
            )
        }

        atualizar()
    })

}

function deletar(id) {
    swal({
        title: "Deseja remover este participante?",
        icon: "info",
        closeOnEsc: false,
        closeOnClickOutside: false,
        buttons: {
            cancel: {
                text: "Cancelar",
                visible: true,
                closeModal: true,
            },
            confirm: {
                text: "OK",
                closeModal: false
            }
        }

    })
        .then((willOk) => {
            if (willOk) {
                const params = new URLSearchParams();
                params.append('i', 2);
                params.append('id', id);

                axios.post(WS, params).then(function (response) {
                    if (response.data == 1) {
                        swal(
                            "Participante removido!", "", "success"
                        )
                    } else {
                        swal(
                            "Participante não remvido!", "Tente novamente", "error"
                        )
                    }
                    atualizar();
                })
            }
        })
}

window.onload = () => {
    atualizar();
}

document.getElementById("Inserir").addEventListener('click', function () {

    swal({
        title: "Cadastro de Participantes",
        closeOnEsc: false,
        closeOnClickOutside: false,
        buttons: {
            cancel: {
                text: "Cancelar",
                closeModal: true,
                visible: true
            },
            confirm: {
                text: "Cadastrar",
                closeModal: false
            }
        },
        content: document.getElementById("form")
    }).then((isOk) => {
        if (isOk) {
            inserirPessoa()
        }
    })

})

document.getElementById("Sortear").addEventListener("click", function () {
    swal({
        title: "Hora de Sortear",
        text: "Selecione um brinde e clique em sortear.",
        closeOnEsc: false,
        closeOnClickOutside: false,
        buttons: {
            cancel: {
                text: "Cancelar",
                closeModal: true,
                visible: true
            },
            confirm: {
                text: "Sortear",
            }
        },
        content: document.getElementById("formSorteio")
    }).then((isOk) => {
        if (isOk) {
            sortear()
        }
    })
})

document.getElementById("imgdojs").addEventListener("dblclick", function () {
    atualizar("1")
})

function gerarSorteio(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function cor(ele, onde) {
    if (onde == 'f') {
        document.body.style.backgroundColor = ele.value;
    } else if (onde == 'te') {
        var par = document.getElementsByClassName("text")
        for (var i = 0; i < par.length; i++) {
            par[i].style.color = ele.value;
        }
    } else if (onde == 'ti') {
        document.getElementById("titulo").style.color = ele.value;
    }
}

