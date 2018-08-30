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
                div.innerHTML += "<br/><strong>Nenhum candidato localizado. Esse nome está certo mesmo?</strong><br/><br/>";
            } else {
                div.innerHTML = "";
                div.innerHTML += "<br/><strong>Candidato localizado!</strong><br/><br/>";
                div.innerHTML += myObj.dados[0].nome;
                div.innerHTML += "<br/>Partido: " + myObj.dados[0].siglaPartido;
                div.innerHTML += "<br/>Estado: " + myObj.dados[0].siglaUf;
                div.innerHTML += "<br/><br/><img src=\"" + myObj.dados[0].urlFoto + "\" alt=\"Smiley face\" height=\"auto\" width=\"auto\"><br/>";
                var id = myObj.dados[0].id;
                buscarDespesasCandidato(id);
                buscarPropostasCandidato(id);
                $("#notepaper1").removeClass();
                $("#notepaper1").addClass("wrap-collabsible");
                $('html,body').animate({
                    scrollTop: $("#footer").offset().top},'slow');
            }

        }
    };

    var nome = document.getElementById('inp').value;
    xhttp.open("GET", "https://dadosabertos.camara.leg.br/api/v2/deputados?nome=" + nome + "&ordem=ASC&ordenarPor=nome", true);
    xhttp.setRequestHeader("accept", "application/json");
    xhttp.send();
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


function buscarPropostasCandidato(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var divListaPropostas = document.getElementById('divListaPropostas');
            var titlePropostas = document.getElementById('titlePropostas');
            document.getElementById("divPropostas").classList.remove('invisible');
            document.getElementById("divPropostas").classList.add('wrap-collabsible');
            var myObj = JSON.parse(this.responseText);
            var totalGasto = 0;
            divListaPropostas.innerHTML = "";
            titlePropostas.innerHTML = "PROPOSTAS<br/>";
            for (var i = 0; i < myObj.dados.length; i++) {
                divListaPropostas.innerHTML += "<p>" + myObj.dados[i].siglaTipo + " " + myObj.dados[i].numero + "</p>";
                divListaPropostas.innerHTML += "<p>" + myObj.dados[i].ementa + "</p><br/>";
                buscarDetalhesPropostasCandidato(myObj.dados[i].id);
            }
        }
    };
    xhttp.open("GET", "https://dadosabertos.camara.leg.br/api/v2/proposicoes?idAutor=" + id + "&ordem=ASC&ordenarPor=id", true);
    xhttp.setRequestHeader("accept", "application/json");
    xhttp.send();
}

function buscarDetalhesPropostasCandidato(idProposta) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myObj = JSON.parse(this.responseText);
            var divListaPropostas = document.getElementById('divListaPropostas');
            for (var i = 0; i < myObj.dados.length; i++) {
                divListaPropostas.innerHTML += "<p>Temas relacionados: " + myObj.dados[i].keywords + "</p>";
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
        document.getElementById("inpLabel").classList.remove('invisible');
        document.getElementById("inpLabel").classList.add('inp');
        document.getElementById("btnBuscar").classList.remove('invisible');
        document.getElementById("btnBuscar").classList.add('btnBuscar');
    } else {
        this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';
    }

    var that = this;
    //var delta = 170 - Math.random() * 200;
    var delta = 5 - Math.random() * 200;

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