
var polygonSides = 0;
var circles = {};
var longitud = 0;

var letras = ["A", "B", "C", "D"];

var cargaActuar = "";

var cargasDatos = [];

function setup()
{
    createCanvas(windowWidth, windowHeight);
    noLoop();
}

function draw()
{
    clear();
    var polygonRadius = 200;
    polygon(windowWidth/2 + 150, windowHeight/2, polygonRadius, polygonSides);
}

function polygon(x, y, radius, npoints) {
    var angle = TWO_PI / npoints;
    noFill();
    beginShape();
    var cont = 0;
    circles = {};
    if (npoints == 2) {
        for (var a = 0; a < TWO_PI; a += angle) {
            var sx = x + cos(a) * radius;
            var sy = y + sin(a) * radius;
            vertex(sx, sy);
            circles[letras[cont]] = [sx, sy];
            cont++;
        }
    } else if (npoints == 3){
        for (var a = PI + HALF_PI; a < TWO_PI + PI; a += angle) {
            var sx = x + cos(a) * radius;
            var sy = y + sin(a) * radius;
            vertex(sx, sy);
            circles[letras[cont]] = [sx, sy];
            cont++;
        }
    } else if (npoints == 4) {
        push();
        rotate(HALF_PI);
        for (var a = PI + HALF_PI; a < TWO_PI + PI + HALF_PI; a += angle) {
                var sx = x + cos(a) * radius;
                var sy = y + sin(a) * radius;
                vertex(sx, sy);
                circles[letras[cont]] = [sx, sy];
                cont++;
        }
        pop();
    }
    
    cont = 0;
    endShape(CLOSE);
    push();
        for (circle in circles) {
            fill(0, 255, 255);
            ellipse(circles[circle][0], circles[circle][1], 30);
            textSize(18);
            fill(0, 0, 0);
            text(letras[cont], circles[circle][0] - 5, circles[circle][1] + 7);
            cont++;
        }
        text("Carga seleccionada para calcular fuerza: " + cargaActuar, 330, windowHeight - 60);
        text("Longitud de los lados: " + longitud + " mts", 330, windowHeight - 30);
    pop();
    //console.log(circles);
}

function agregarInputs() {
    $("#camposIngresoCargas").empty();
    for (circle in circles) {
        var texto = `
            <input type="text" class="inputsP inputsCargas" placeholder="Carga en micro Coulombs de ` + circle + `...">
        `;
        $("#camposIngresoCargas").append(texto);
    }
    var btnAceptarCargas = `
        <div id="btnAceptarCargas" class="btnAceptarCargas">Continuar</div>
    `;
    $("#camposIngresoCargas").append(btnAceptarCargas);
}

$("#btnAceptar").on({
    click: function () {
        if ($("#inputNumLados").val() != "" && parseInt($("#inputNumLados").val()) < 4 && parseInt($("#inputNumLados").val()) > 1)  {
            if (parseInt($("#inputLongitud").val()) > 0) {
                polygonSides = parseInt($("#inputNumLados").val());
                longitud = parseInt($("#inputLongitud").val());
                cargasDatos = [];
                redraw();
                agregarInputs();
            }
        }
    }
});

$(document).on('click', '#btnAceptarCargas', function() {
    inputsOptenidos = $( "#camposIngresoCargas" ).children();
    for (var inputObt = 0; inputObt < inputsOptenidos.length - 1; inputObt++) {
        cargasDatos.push(parseFloat(inputsOptenidos[inputObt].value));
    }
    $("#camposIngresoCargas").empty();
    var texto = `
        <input type="text" class="inputsP inputsCargas" placeholder="Carga sobre la cual calcular la fuerza...">
        <div id="btnAceptarCF" class="btnAceptarCargas">Continuar</div>
    `;
    $("#camposIngresoCargas").append(texto);
    redraw();
});

$(document).on('click', '#btnAceptarCF', function() {
    inputsOptenidos = $( "#camposIngresoCargas" ).children();
    letra = (inputsOptenidos[0].value).toUpperCase();
    $("#camposIngresoCargas").empty();
    cargaActuar = letra;
    redraw();
    obtenerDatos();
});

function obtenerDatos() {
    var fuerzas = [];
    var angleObtenido = 0;
    var resultadoTotal = 0;

    for (var i = 0; i < polygonSides; i++) {
        //console.log("Con i=" + i + "tengo que: " + letras.indexOf(cargaActuar));
        if (letras.indexOf(cargaActuar) != i) {
            /*console.log(9*pow(10,9));
            console.log(abs(cargasDatos[i]*pow(10,-6)));
            console.log(abs(cargasDatos[letras.indexOf(cargaActuar)]*pow(10,-6)));
            console.log(longitud*longitud);*/
            var resultado = 
                (
                    (9*pow(10,9)) * abs(cargasDatos[i]*pow(10,-6)) * abs(cargasDatos[letras.indexOf(cargaActuar)]*pow(10,-6))
                ) / (longitud*longitud);
            
            resultado = parseFloat(resultado.toFixed(4));

            if (polygonSides == 2) {
                resultadoTotal = resultado;
                if (cargaActuar == "A") {
                    if ((cargasDatos[letras.indexOf(cargaActuar)] > 0 && (cargasDatos[i] > 0)) ||
                        (cargasDatos[letras.indexOf(cargaActuar)] < 0 && (cargasDatos[i] < 0)))  {
                        angleObtenido = 0;
                    } else if ((cargasDatos[letras.indexOf(cargaActuar)] < 0 && (cargasDatos[i] > 0)) ||
                        (cargasDatos[letras.indexOf(cargaActuar)] > 0 && (cargasDatos[i] < 0)))  {
                        angleObtenido = 180;
                    }
                } else {
                    if ((cargasDatos[letras.indexOf(cargaActuar)] > 0 && (cargasDatos[i] > 0)) ||
                        (cargasDatos[letras.indexOf(cargaActuar)] < 0 && (cargasDatos[i] < 0)))  {
                        angleObtenido = 180;
                    } else if ((cargasDatos[letras.indexOf(cargaActuar)] < 0 && (cargasDatos[i] > 0)) ||
                        (cargasDatos[letras.indexOf(cargaActuar)] > 0 && (cargasDatos[i] < 0)))  {
                        angleObtenido = 0;
                    }
                }
            }
            if (polygonSides == 3) {
                fuerzas.push(resultado);
            }

            var texto = `
                <p style="color: white;">F<small>(` + letras[i] + cargaActuar + `)</small> = ` + resultado + ` N</p>
            `;
            $("#camposIngresoCargas").append(texto);
        }
    }

    if (polygonSides == 3) {
        if (cargaActuar == "A") {
            push();
            angleMode(DEGREES);
            sumaX = -fuerzas[1]*cos(60) + fuerzas[0]*cos(60);
            sumaY = -fuerzas[1]*sin(60) - fuerzas[0]*sin(60);
            sumaX = parseFloat(sumaX.toFixed(4));
            sumaY = parseFloat(sumaY.toFixed(4));
            resultadoTotal = Math.sqrt(pow(sumaX, 2) + pow(sumaY, 2));
            resultadoTotal = parseFloat(resultadoTotal.toFixed(4));
            angleObtenido = atan(sumaY/sumaX);
            angleObtenido = parseFloat(angleObtenido.toFixed(4));
            var texto = `
                <p style="color: white;">EFx = ` + sumaX + `</p>
                <p style="color: white;">EFy = ` + sumaY + `</p>
            `;
            $("#camposIngresoCargas").append(texto);
            pop();
        } else if (cargaActuar == "B") {
            push();
            angleMode(DEGREES);
            sumaX = -fuerzas[0]*cos(60) - fuerzas[1];
            sumaY = fuerzas[0]*sin(60);
            sumaX = parseFloat(sumaX.toFixed(4));
            sumaY = parseFloat(sumaY.toFixed(4));
            resultadoTotal = Math.sqrt(pow(sumaX, 2) + pow(sumaY, 2));
            resultadoTotal = parseFloat(resultadoTotal.toFixed(4));
            angleObtenido = atan(sumaY/sumaX);
            angleObtenido = parseFloat(angleObtenido.toFixed(4));
            var texto = `
                <p style="color: white;">EFx = ` + sumaX + `</p>
                <p style="color: white;">EFy = ` + sumaY + `</p>
            `;
            $("#camposIngresoCargas").append(texto);
            pop();
        } else {
            push();
            angleMode(DEGREES);
            sumaX = fuerzas[1] + fuerzas[0]*cos(60);
            sumaY = fuerzas[0]*sin(60);
            sumaX = parseFloat(sumaX.toFixed(4));
            sumaY = parseFloat(sumaY.toFixed(4));
            resultadoTotal = Math.sqrt(pow(sumaX, 2) + pow(sumaY, 2));
            resultadoTotal = parseFloat(resultadoTotal.toFixed(4));
            angleObtenido = atan(sumaY/sumaX);
            angleObtenido = parseFloat(angleObtenido.toFixed(4));
            var texto = `
                <p style="color: white;">EFx = ` + sumaX + `</p>
                <p style="color: white;">EFy = ` + sumaY + `</p>
            `;
            $("#camposIngresoCargas").append(texto);
            pop();
        }
    }

    var texto = `
            <p style="color: white;">F = ` + resultadoTotal + ` N</p>
            <p style="color: white;">Ángulo = ` + angleObtenido + `°</p>
        `;
    $("#camposIngresoCargas").append(texto);
}
