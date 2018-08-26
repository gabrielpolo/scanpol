function buscarCandidato() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
             var div = document.getElementById('divResultado');
             var myObj = JSON.parse(this.responseText);
             
             div.innerHTML = "";
             div.innerHTML += "<br/><strong>Candidato localizado!</strong><br/><br/>";
             div.innerHTML += myObj.dados[0].nome;
             div.innerHTML += "<br/><br/><img src=\"" + myObj.dados[0].urlFoto + "\" alt=\"Smiley face\" height=\"auto\" width=\"auto\"><br/>";
             var id = myObj.dados[0].id;
             buscarDetalhesCandidato(id);
         }
    };

    var nome = document.getElementById('inp').value;
    xhttp.open("GET", "https://dadosabertos.camara.leg.br/api/v2/deputados?nome=" + nome + "&ordem=ASC&ordenarPor=nome", true);
    xhttp.setRequestHeader("accept", "application/json");
    xhttp.send();
}

function buscarDetalhesCandidato(id) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
             var div = document.getElementById('divResultado');
             var myObj = JSON.parse(this.responseText);
             var totalGasto = 0;
             div.innerHTML += "<br/><strong>Despesas no último ano:</strong><br/><br/>";
             for (var i = 0; i < myObj.dados.length; i++){
                 totalGasto += myObj.dados[i].valorLiquido;
                 div.innerHTML += myObj.dados[i].tipoDespesa.toLowerCase() + " (" + myObj.dados[i].dataDocumento  + ") - valor: R$" + myObj.dados[i].valorLiquido +"<br/>";         
             }
             div.innerHTML += "<br/><strong>Total gasto: R$" + totalGasto + "</strong><br/><br/>";
         }
    };

    var nome = document.getElementById('inp').value;
    xhttp.open("GET", "https://dadosabertos.camara.leg.br/api/v2/deputados/" + id + "/despesas?ano=2018&itens=1500&ordem=DESC&ordenarPor=ano", true);
    xhttp.setRequestHeader("accept", "application/json");
    xhttp.send();
}

var TxtType = function(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    };

    TxtType.prototype.tick = function() {
        var i = this.loopNum % this.toRotate.length;
        var fullTxt = this.toRotate[i];

        if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        if(this.loopNum > 2){ //put the size of the array data-type from html file
            var element = document.getElementById("typewrite1");
            element.parentNode.removeChild(element);
            document.getElementById("inpLabel").classList.remove('invisible');
            document.getElementById("inpLabel").classList.add('inp');
            document.getElementById("btnBuscar").classList.remove('invisible');
            document.getElementById("btnBuscar").classList.add('btnBuscar');
        } else {
            this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';
        }

        var that = this;
        var delta = 100 - Math.random() * 100;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
        }

        setTimeout(function() {
        that.tick();
        }, delta);
    };

    window.onload = function() {
        var elements = document.getElementsByClassName('typewrite');
        for (var i=0; i<elements.length; i++) {
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