// --- SISTEMA DE LOGIN SIMPLES ---
const SENHA_SECRETA = "Ko35wa#23"; // Troque pela senha que você quiser

function verificarLogin() {
    let senhaDigitada = prompt("🔒 ACESSO RESTRITO: Digite a senha do sistema:");
    
    if (senhaDigitada !== SENHA_SECRETA) {
        alert("❌ Senha incorreta! Acesso negado.");
        document.body.innerHTML = "<h1 style='color:white; text-align:center; margin-top:50px;'>⛔ ACESSO NEGADO</h1>";
        document.body.style.backgroundColor = "black";
        throw new Error("Acesso negado"); // Para a execução do script
    }
}

// Chama a verificação assim que o site carrega
verificarLogin();

// --- ABAIXO COMEÇA O CÓDIGO DO JOGO ---
// (Mantenha o resto do seu código aqui: let xpTotal = ...)// Carrega dados
let xpTotal = Number(localStorage.getItem("xp")) || 0;
let nivel = Number(localStorage.getItem("nivel")) || 1;
let coins = Number(localStorage.getItem("coins")) || 0;
let ultimaData = localStorage.getItem("data") || new Date().toDateString();

const xpParaUpar = 100;

verificarPenalidade();
atualizarTela();

// 1. PENALIDADE DIÁRIA (AGORA GERA DÍVIDA)
function verificarPenalidade() {
  let hoje = new Date();
  let ultima = new Date(ultimaData);
  let diffTempo = hoje - ultima;
  let diffDias = Math.floor(diffTempo / (1000 * 60 * 60 * 24));

  if (diffDias > 1) {
    let xpPerdido = diffDias * 20;
    // REMOVIDO O BLOQUEIO DE ZERO. AGORA VAI NEGATIVO.
    xpTotal = xpTotal - xpPerdido;

    alert(
      `⚠️ Você sumiu por ${diffDias} dias! Dívida gerada: -${xpPerdido} XP.`
    );
  }
  localStorage.setItem("data", new Date().toDateString());
}

// 2. MISSÕES (PAGAR A DÍVIDA / GANHAR)
function completarMissao(botao, xpGanho, coinsGanho) {
  xpTotal += xpGanho;
  coins += coinsGanho;

  // Só sobe de nível se o saldo for POSITIVO e maior que 100
  if (xpTotal >= xpParaUpar) {
    nivel++;
    xpTotal -= xpParaUpar;
    alert(`🎉 RECUPERADO! Nível ${nivel} alcançado!`);
  }

  salvarDados();
  atualizarTela();

  // Visual do botão
  botao.innerText = "Feito ✅";
  botao.disabled = true;
  botao.style.background = "#2ecc71";
  botao.style.transform = "scale(0.95)";
}

// 3. LOJA (VOCÊ PODE COMPRAR FIADO E FICAR NEGATIVO NAS MOEDAS TAMBÉM?)
// Se você quiser permitir ficar negativo nas moedas também, use este código.
// Se quiser proibir compra sem saldo, avise que eu volto ao anterior.
// Por enquanto, mantive a proibição de compra na loja (só perde na penalidade),
// pois comprar recompensa estando em dívida é contra-intuitivo.
function comprarItem(custo) {
  if (coins >= custo) {
    let confirmacao = confirm(`Gastar ${custo} moedas?`);
    if (confirmacao) {
      coins -= custo;
      salvarDados();
      atualizarTela();
    }
  } else {
    alert(
      `❌ SALDO INSUFICIENTE!\nVocê tem ${coins}. Precisa de ${custo}.\nVá trabalhar para pagar suas contas!`
    );
  }
}

// 4. RECAÍDA (PUNIÇÃO MANUAL - GERA DÍVIDA INFINITA)
function recaida() {
  let confirmacao = confirm(
    "Assumir a culpa? Isso vai te jogar -50 XP no buraco."
  );
  if (confirmacao) {
    xpTotal -= 50; // Simplesmente subtrai, indo para negativo se precisar

    // Lógica de Rebaixamento de Nível (Opcional: se a dívida for muito grande, cai de nível)
    // Por enquanto, vamos deixar você acumular dívida no nível atual para doer mais visualmente.

    salvarDados();
    atualizarTela();
    alert("📉 Punição aplicada. Seu saldo sofreu.");
  }
}

function salvarDados() {
  localStorage.setItem("xp", xpTotal);
  localStorage.setItem("nivel", nivel);
  localStorage.setItem("coins", coins);
  localStorage.setItem("data", new Date().toDateString());
}

function atualizarTela() {
  // Atualiza Textos
  let xpElement = document.getElementById("xp-atual");
  let coinsElement = document.getElementById("coins-atual");

  xpElement.innerText = xpTotal;
  coinsElement.innerText = coins;
  document.getElementById("level").innerText = nivel;

  // LÓGICA VISUAL DA DÍVIDA (Fica Vermelho se negativo)
  if (xpTotal < 0) {
    xpElement.style.color = "#ff4757"; // Vermelho
    xpElement.innerText = `${xpTotal} (DÍVIDA)`;
  } else {
    xpElement.style.color = "#fff"; // Branco normal
  }

  // Barra de Progresso
  let porcentagem = (xpTotal / xpParaUpar) * 100;
  // Se for negativo, a barra fica em 0% (não quebra o layout)
  if (porcentagem < 0) porcentagem = 0;
  document.getElementById("xp-bar").style.width = porcentagem + "%";
}


