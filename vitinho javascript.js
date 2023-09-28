// Armazenar informações das pastas
var pastas = [];

function criarNovaPasta() {
    var nomePasta = document.getElementById("nomePasta").value;

    if (nomePasta.trim() !== "") {
        var pasta = {
            nome: nomePasta,
            flashcards: []
        };

        pastas.push(pasta);
        atualizarSeletorPasta();
        atualizarPastasContainer();
        fecharPopup();
    }
}

function atualizarSeletorPasta() {
    var seletor = document.getElementById("seletorPasta");
    seletor.innerHTML = "";

    for (var i = 0; i < pastas.length; i++) {
        var pasta = pastas[i];
        var option = document.createElement("option");
        option.value = i;
        option.textContent = pasta.nome;
        seletor.appendChild(option);
    }
}

function criarNovoFlashcard() {
    var pergunta = document.getElementById("perguntaFlashcard").value;
    var resposta = document.getElementById("respostaFlashcard").value;
    var pastaSelecionadaIndex = document.getElementById("seletorPasta").value;

    if (pergunta.trim() !== "" && resposta.trim() !== "") {
        var flashcard = {
            pergunta: pergunta,
            resposta: resposta
        };

        pastas[pastaSelecionadaIndex].flashcards.push(flashcard);
        atualizarPastasContainer();
        fecharPopup();
    }
}

function criarNovoFlashcardComDias() {
    var pergunta = document.getElementById("perguntaFlashcard").value;
    var resposta = document.getElementById("respostaFlashcard").value;
    var pastaSelecionadaIndex = document.getElementById("seletorPasta").value;
    var diasParaRevisao = parseInt(document.getElementById("diasParaRevisao").value);

    if (pergunta.trim() !== "" && resposta.trim() !== "") {
        if (diasParaRevisao >= 0) { // Verifica se diasParaRevisao é um número não negativo
            var flashcard = {
                pergunta: pergunta,
                resposta: resposta,
                diasParaRevisao: diasParaRevisao
            };

            pastas[pastaSelecionadaIndex].flashcards.push(flashcard);
            atualizarPastasContainer();
            fecharPopup();

            // Se o número de dias para revisão for 0, carregue o flashcard na barra lateral
            if (diasParaRevisao === 0) {
                carregarFlashcard(flashcard);
            }
        } else {
            alert("Por favor, insira um número de dias válido (não negativo).");
        }
    } else {
        alert("Por favor, preencha todos os campos corretamente.");
    }
}

function abrirPopup() {
    var popup = document.getElementById("createFolderPopup");
    popup.style.display = "block";
}

function abrirFlashcardPopup() {
    var popup = document.getElementById("createFlashcardPopup");
    popup.style.display = "block";
    
    // Redefinir os valores dos campos de input
    document.getElementById("perguntaFlashcard").value = "";
    document.getElementById("respostaFlashcard").value = "";
    document.getElementById("diasParaRevisao").value = "";
}

function fecharPopup() {
    var popups = document.querySelectorAll(".popup");
    popups.forEach(function(popup) {
        popup.style.display = "none";
    });
}

function criarPastaElement(pasta) {
    var pastaDiv = document.createElement("div");
    pastaDiv.className = "pasta";
    pastaDiv.id = pasta.nome;
    pastaDiv.innerHTML = "<h3>" + pasta.nome + "</h3>";

    var botaoCliqueAqui = document.createElement("button");
    botaoCliqueAqui.textContent = "Clique aqui";
    botaoCliqueAqui.onclick = function() {
        abrirPopupFlashcards(pasta);
    };

    pastaDiv.appendChild(botaoCliqueAqui);

    return pastaDiv;
}

function abrirPopupFlashcards(pasta) {
    var popup = document.getElementById("flashcardsPopup");
    var popupContent = document.getElementById("flashcardsPopupContent");

    popupContent.innerHTML = "";

    for (var i = 0; i < pasta.flashcards.length; i++) {
        var flashcard = pasta.flashcards[i];
        var flashcardDiv = document.createElement("div");
        flashcardDiv.className = "flashcard";
        flashcardDiv.innerHTML = "<h4>Pergunta: " + flashcard.pergunta + "</h4><p>Resposta: " + flashcard.resposta + "</p>";
        popupContent.appendChild(flashcardDiv);
    }

    popup.style.display = "block";
}

function atualizarPastasContainer() {
    var pastasContainer = document.getElementById("pastasContainer");
    pastasContainer.innerHTML = "";

    for (var i = 0; i < pastas.length; i++) {
        var pasta = pastas[i];
        var pastaDiv = criarPastaElement(pasta);
        pastasContainer.appendChild(pastaDiv);
    }
}



function verificarResposta(flashcard, respostaUsuario) {
    var pastaSelecionadaIndex = document.getElementById("seletorPasta").value;
    var pastaSelecionada = pastas[pastaSelecionadaIndex];
    
    if (respostaUsuario === flashcard.resposta) {
        var diasParaRevisao = parseInt(prompt("Resposta correta! Quantos dias para revisão?"));
        
        if (!isNaN(diasParaRevisao) && diasParaRevisao >= 0) {
            // Verifique se os dias para revisão são zero ou não
            if (diasParaRevisao === 0) {
                // Se os dias para revisão forem zero, mantenha o flashcard na tela de revisão
                atualizarPastasContainer();
                alert("Flashcard definido para revisão.");
            } else {
                // Caso contrário, retorne o flashcard para sua pasta de origem
                pastaSelecionada.flashcards.push(flashcard);
                atualizarPastasContainer();
                alert("Flashcard definido para revisão em " + diasParaRevisao + " dias.");
            }
        } else {
            alert("Por favor, insira um número de dias válido (não negativo).");
        }
    } else {
        alert("Resposta incorreta. Tente novamente.");
    }
    
    // Limpa a barra de input após verificar a resposta
    document.getElementById("inputResposta").value = "";
}

// Função para exibir os flashcards disponíveis para revisão
function exibirFlashcardsParaRevisao() {
    // Limpa o conteúdo anterior da área de pastas
    var pastasContainer = document.getElementById("pastasContainer");
    pastasContainer.innerHTML = "";

    // Filtra os flashcards disponíveis para revisão
    var flashcardsParaRevisao = pastas.reduce(function (result, pasta) {
        return result.concat(
            pasta.flashcards.filter(function (flashcard) {
                return flashcard.diasParaRevisao === 0;
            }).map(function (flashcard) {
                // Adicione a pasta de origem ao flashcard
                flashcard.origem = pasta;
                return flashcard;
            })
        );
    }, []);

    // Exibe os flashcards disponíveis para revisão
    if (flashcardsParaRevisao.length > 0) {
        flashcardsParaRevisao.forEach(function (flashcard) {
            var flashcardDiv = document.createElement("div");
            flashcardDiv.className = "flashcard";
            flashcardDiv.innerHTML = "<h4>Pergunta: " + flashcard.pergunta + "</h4>";
            
            // Adicione uma barra de input
            var respostaInput = document.createElement("input");
            respostaInput.type = "text";
            respostaInput.id = "inputResposta";
            
            // Adicione um botão "Verificar Resposta" para cada flashcard
            var verificarRespostaButton = document.createElement("button");
            verificarRespostaButton.textContent = "Verificar Resposta";
            verificarRespostaButton.onclick = function () {
                verificarResposta(flashcard, respostaInput.value);
            };
            
            flashcardDiv.appendChild(respostaInput);
            flashcardDiv.appendChild(verificarRespostaButton);
            
            // Exiba a pasta de origem do flashcard
            var origemPasta = document.createElement("p");
            origemPasta.textContent = "Origem: " + flashcard.origem.nome;
            flashcardDiv.appendChild(origemPasta);
            
            pastasContainer.appendChild(flashcardDiv);
        });
    } else {
        var mensagem = document.createElement("p");
        mensagem.textContent = "Nenhum flashcard disponível para revisão no momento.";
        pastasContainer.appendChild(mensagem);
    }
}
// Chame esta função para atualizar as pastas iniciais no seletor
atualizarSeletorPasta();