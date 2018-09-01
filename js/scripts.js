function buscarCandidato() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var div = document.getElementById('divResultado');
            var myObj = JSON.parse(this.responseText);

            if (!myObj.dados[0]) {
                div.innerHTML = "";
                $("#divDespesas").removeClass();
                $("#divDespesas").addClass("invisible");
                $("#divPropostas").removeClass();
                $("#divPropostas").addClass("invisible");
                div.innerHTML += "<br/><strong>Nenhum deputado localizado. Esse nome está certo mesmo?</strong><br/><br/>";
            } else {
                div.innerHTML = "";
                div.innerHTML += "<br/><strong>Deputado localizado!</strong><br/><br/>";
                div.innerHTML += myObj.dados[0].nome;
                div.innerHTML += "<br/>Partido: " + myObj.dados[0].siglaPartido;
                div.innerHTML += "<br/>Estado: " + myObj.dados[0].siglaUf;
                div.innerHTML += "<br/><br/><img src=\"" + myObj.dados[0].urlFoto + "\" alt=\"Smiley face\" height=\"auto\" width=\"auto\"><br/>";
                var id = myObj.dados[0].id;
                buscarDespesasCandidato(id);
                buscarPropostasCandidato(id);
                $("#labelBusca").empty();
                $("#labelBusca").append("Comparar com outro deputado:");
                $("#btnBuscar").html('Alterar 1º deputado');
                $("#btnComparar").addClass("btnBuscar");
                $("#notepaper1").removeClass();
                $("#notepaper1").addClass("wrap-collabsible");
                $('html,body').animate({
                    scrollTop: $("#footer").offset().top},'slow');
            }

        }
    };

    var nome = document.getElementById('inp').value;
    if(nome == ""){
        $("#divDespesas").removeClass();
        $("#divDespesas").addClass("invisible");
        $("#divPropostas").removeClass();
        $("#divPropostas").addClass("invisible");
        var div = document.getElementById('divResultado');
        div.innerHTML += "<br/><strong>Preencha com o nome de um deputado!</strong><br/><br/>";        
    } else{
        xhttp.open("GET", "https://dadosabertos.camara.leg.br/api/v2/deputados?nome=" + nome + "&ordem=ASC&ordenarPor=nome", true);
        xhttp.setRequestHeader("accept", "application/json");
        xhttp.send();
    }
}

function compararCandidato() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var div2 = document.getElementById('divResultado2');
            var myObj = JSON.parse(this.responseText);

            if (!myObj.dados[0]) {
                div2.innerHTML = "";
                $("#divDespesas").removeClass();
                $("#divDespesas").addClass("invisible");
                $("#divPropostas").removeClass();
                $("#divPropostas").addClass("invisible");
                $("#divDespesas2").removeClass();
                $("#divDespesas2").addClass("invisible");
                $("#divPropostas2").removeClass();
                $("#divPropostas2").addClass("invisible");
                div2.innerHTML += "<br/><strong>Nenhum deputado localizado. Esse nome está certo mesmo?</strong><br/><br/>";
            } else {
                $("#divResultado").addClass("sidebar");
                $("#divResultado2").addClass("page-wrap");
                $("#btnComparar").html('Alterar 2º deputado');
                div2.innerHTML = "";
                div2.innerHTML += "<br/><strong>Deputado localizado!</strong><br/><br/>";
                div2.innerHTML += myObj.dados[0].nome;
                div2.innerHTML += "<br/>Partido: " + myObj.dados[0].siglaPartido;
                div2.innerHTML += "<br/>Estado: " + myObj.dados[0].siglaUf;
                div2.innerHTML += "<br/><br/><img src=\"" + myObj.dados[0].urlFoto + "\" alt=\"Smiley face\" height=\"auto\" width=\"auto\"><br/>";
                var id = myObj.dados[0].id;
                $("#dados1").addClass("sidebar");
                $("#dados2").removeClass();
                $("#dados2").addClass("page-wrap");
                buscarDespesasCandidato2(id);
                buscarPropostasCandidato2(id);
                $('html,body').animate({
                    scrollTop: $("#footer").offset().top},'slow');
            }

        }
    };

    var nome = document.getElementById('inp').value;
    if(nome == ""){
        var div2 = document.getElementById('divResultado2');
        div2.innerHTML = "";
        $("#divDespesas").removeClass();
        $("#divDespesas").addClass("invisible");
        $("#divPropostas").removeClass();
        $("#divPropostas").addClass("invisible");
        $("#divDespesas2").removeClass();
        $("#divDespesas2").addClass("invisible");
        $("#divPropostas2").removeClass();
        $("#divPropostas2").addClass("invisible");
        div2.innerHTML += "<br/><strong>Preencha com o nome de um deputado!</strong><br/><br/>";        
    } else {
        xhttp.open("GET", "https://dadosabertos.camara.leg.br/api/v2/deputados?nome=" + nome + "&ordem=ASC&ordenarPor=nome", true);
        xhttp.setRequestHeader("accept", "application/json");
        xhttp.send();
    }
}

function buscarDespesasCandidato(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var divListaDespesas = document.getElementById('divListaDespesas');
            var titleDespesas = document.getElementById('titleDespesas');
            document.getElementById("divDespesas").classList.remove('invisible');
            document.getElementById("divDespesas").classList.add('wrap-collabsible');
            var myObj = JSON.parse(this.responseText);
            var totalGasto = 0;
            divListaDespesas.innerHTML = "";
            titleDespesas.innerHTML = "DESPESAS<br/>";
            titleDespesas.innerHTML += "Período analisado: " + calcularPeriodoDespesas(myObj) + "<br/>";
            for (var i = 0; i < myObj.dados.length; i++) {
                totalGasto += myObj.dados[i].valorLiquido;
                var gastoI = myObj.dados[i].tipoDespesa.toLowerCase() + " (" + myObj.dados[i].dataDocumento + ") - valor: R$" + myObj.dados[i].valorLiquido.toLocaleString('pt-BR');
                divListaDespesas.innerHTML += "<p>" + gastoI + "</p>";
            }
            titleDespesas.innerHTML += "Total gasto: R$" + totalGasto.toLocaleString('pt-BR') + "<br/>";
        }
    };

    var nome = document.getElementById('inp').value;
    xhttp.open("GET", "https://dadosabertos.camara.leg.br/api/v2/deputados/" + id + "/despesas?ano=2018&itens=1500&ordem=DESC&ordenarPor=valorLiquido", true);
    xhttp.setRequestHeader("accept", "application/json");
    xhttp.send();
}

function buscarDespesasCandidato2(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var divListaDespesas = document.getElementById('divListaDespesas2');
            var titleDespesas = document.getElementById('titleDespesas2');
            document.getElementById("divDespesas2").classList.remove('invisible');
            document.getElementById("divDespesas2").classList.add('wrap-collabsible');
            var myObj = JSON.parse(this.responseText);
            var totalGasto = 0;
            divListaDespesas.innerHTML = "";
            titleDespesas.innerHTML = "DESPESAS<br/>";
            titleDespesas.innerHTML += "Período analisado: " + calcularPeriodoDespesas(myObj) + "<br/>";
            for (var i = 0; i < myObj.dados.length; i++) {
                totalGasto += myObj.dados[i].valorLiquido;
                var gastoI = myObj.dados[i].tipoDespesa.toLowerCase() + " (" + myObj.dados[i].dataDocumento + ") - valor: R$" + myObj.dados[i].valorLiquido.toLocaleString('pt-BR');
                divListaDespesas.innerHTML += "<p>" + gastoI + "</p>";
            }
            titleDespesas.innerHTML += "Total gasto: R$" + totalGasto.toLocaleString('pt-BR') + "<br/>";
        }
    };

    var nome = document.getElementById('inp').value;
    xhttp.open("GET", "https://dadosabertos.camara.leg.br/api/v2/deputados/" + id + "/despesas?ano=2018&itens=1500&ordem=DESC&ordenarPor=valorLiquido", true);
    xhttp.setRequestHeader("accept", "application/json");
    xhttp.send();
}

function buscarPropostasCandidato(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var divListaPropostas = document.getElementById('divListaPropostas');
            var titlePropostas = document.getElementById('titlePropostas');
            document.getElementById("divPropostas").classList.remove('invisible');
            document.getElementById("divPropostas").classList.add('wrap-collabsible');
            var myObj = JSON.parse(this.responseText);
            divListaPropostas.innerHTML = "";
            titlePropostas.innerHTML = "PROPOSTAS<br/>";
            for (var i = 0; i < myObj.dados.length; i++) {
                divListaPropostas.innerHTML += "<p>" + myObj.dados[i].siglaTipo + " " + myObj.dados[i].numero + "</p>";
                divListaPropostas.innerHTML += "<p>" + myObj.dados[i].ementa + "</p><br/>";
                buscarDetalhesPropostasCandidato(myObj.dados[i].id, divListaPropostas);
            }
        }
    };
    xhttp.open("GET", "https://dadosabertos.camara.leg.br/api/v2/proposicoes?idAutor=" + id + "&ordem=ASC&ordenarPor=id", true);
    xhttp.setRequestHeader("accept", "application/json");
    xhttp.send();
}

function buscarPropostasCandidato2(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var divListaPropostas = document.getElementById('divListaPropostas2');
            var titlePropostas = document.getElementById('titlePropostas2');
            document.getElementById("divPropostas2").classList.remove('invisible');
            document.getElementById("divPropostas2").classList.add('wrap-collabsible');
            var myObj = JSON.parse(this.responseText);
            divListaPropostas.innerHTML = "";
            titlePropostas.innerHTML = "PROPOSTAS<br/>";
            for (var i = 0; i < myObj.dados.length; i++) {
                divListaPropostas.innerHTML += "<p>" + myObj.dados[i].siglaTipo + " " + myObj.dados[i].numero + "</p>";
                divListaPropostas.innerHTML += "<p>" + myObj.dados[i].ementa + "</p><br/>";
                buscarDetalhesPropostasCandidato(myObj.dados[i].id, divListaPropostas);
            }
        }
    };
    xhttp.open("GET", "https://dadosabertos.camara.leg.br/api/v2/proposicoes?idAutor=" + id + "&ordem=ASC&ordenarPor=id", true);
    xhttp.setRequestHeader("accept", "application/json");
    xhttp.send();
}

function buscarDetalhesPropostasCandidato(idProposta, divListaPropostas) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myObj2 = JSON.parse(this.responseText);
            for (var i = 0; i < myObj2.dados.length; i++) {
                divListaPropostas.innerHTML += "<p>Temas relacionados: " + myObj2.dados[i].keywords + "</p>";
            }
        }
    };
    xhttp.open("GET", "https://dadosabertos.camara.leg.br/api/v2/proposicoes/" + idProposta, true);
    xhttp.setRequestHeader("accept", "application/json");
    xhttp.send();
}

function calcularPeriodoDespesas(myObj) {
    dates = [];
    for (i = 0; i < myObj.dados.length; i++) { 
        if(myObj.dados[i].dataDocumento != null)
            dates.push(new Date(myObj.dados[i].dataDocumento));
    }
    var max = new Date(Math.max.apply(null,dates));
    var min = new Date(Math.min.apply(null,dates));

    return min.toLocaleString('pt-BR').substring(1, 10) + " à " + max.toLocaleString('pt-BR').substring(1, 10);
}

function pularIntroducao(){
    $('#pularIntroducao').remove();
    $("#typewrite1").removeClass();
    $("#typewrite1").addClass("invisible");
    document.getElementById("inpLabel").classList.remove('invisible');
    document.getElementById("inpLabel").classList.add('inp');
    document.getElementById("btnBuscar").classList.remove('invisible');
    document.getElementById("btnBuscar").classList.add('btnBuscar');
}

//scripts para o texto de introducao
var TxtType = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 150) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function () {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    if (this.loopNum > 7) { //put the size of the array data-type from html file
        $('#typewrite1').remove();
        $('#pularIntroducao').remove();
        document.getElementById("inpLabel").classList.remove('invisible');
        document.getElementById("inpLabel").classList.add('inp');
        document.getElementById("btnBuscar").classList.remove('invisible');
        document.getElementById("btnBuscar").classList.add('btnBuscar');
    } else {
        this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';
    }

    var that = this;
    var delta = 140 - Math.random() * 200;
    //var delta = 5 - Math.random() * 200;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 100;
    }

    setTimeout(function () {
        that.tick();
    }, delta);
};

window.onload = function () {
    var elements = document.getElementsByClassName('typewrite');
    for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);
};