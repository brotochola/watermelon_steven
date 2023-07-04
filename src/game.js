///////// NOTAS: ///////////////////////////////////////////////////////////////
//los pisos deben tener su punto de registro X a la izq
//
//
//////////////////////////////////////////////////////////////////////////////
var movPiso = false; //con esto se activa el movimiento senoidal del piso
var rotacionStevenes = false; //con esto activo o desactivo la rotacion automatica de los st
var limiteStevenIzq = 60;
var limiteStevenDer = anchoStage * 0.66;

var distanciaParaQueSalten = 10;
var distanciaMouseXACtivado = false;
var lineaDeMuerte;
var valEscala;
var ganasteMC, perdisteMC;
//camara
var aceleracion = 4.7;
////
var valMinYGrid, valMaxYGrid, valMinYGrid_5, valMaxYGrid_5;
var cantGanadores;
var cuadradoNegro;
var anchoPiso;
var amatista;
var canvas, stage, exportRoot, pi;
var arrSteven = [];
var piso; //el piso tiene mc q son los cachos y cada uno tiene 2 layers
var perdiste = 1;
var ganaste = 0;
var numPisoGanador = 5; //esto tenia q ver con los layers de mas
var xPisoFinalGanador = 0; //en vez de contar la cantidad de pisos restantes, calculo la x del pedazo de piso final.
var gravedad = 3.6;
var cantStevenes = 50;
var salto = -45;
var pisoLento = 13;
var pisoRapido = 15;
var velPiso = pisoLento;
var rayo;
var curFrame = 0;
var gestoMC;
var cantFramesCurrentAnim = 0;
var musicas = [];
var ratio = 1;
var highScore = 0;
var score = 0;
var scoreMC;
var panTemp;
var cantEstrellas = 0;
var pausa = true;
var container; //con esto muevo la camara.
/////////////////// audios

musicaGameplay = "assets/audio/musica.mp3";
jump = "assets/audio/jump.mp3";
land = "assets/audio/land.mp3";
fall = "assets/audio/land.mp3";
endWin = "assets/audio/endWin.mp3";
endLose = "assets/audio/endLose.mp3";
campana1 = "assets/audio/campana1.mp3";
campana2 = "assets/audio/campana2.mp3";
campana3 = "assets/audio/campana3.mp3";

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

var Demo = {
  getViewport: function () {
    var viewPortWidth;
    var viewPortHeight;

    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    if (typeof window.innerWidth != "undefined") {
      (viewPortWidth = window.innerWidth),
        (viewPortHeight = window.innerHeight);
    }

    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
    else if (
      typeof document.documentElement != "undefined" &&
      typeof document.documentElement.clientWidth != "undefined" &&
      document.documentElement.clientWidth != 0
    ) {
      (viewPortWidth = document.documentElement.clientWidth),
        (viewPortHeight = document.documentElement.clientHeight);
    }

    // older versions of IE
    else {
      (viewPortWidth = document.getElementsByTagName("body")[0].clientWidth),
        (viewPortHeight =
          document.getElementsByTagName("body")[0].clientHeight);
    }
    return [viewPortWidth, viewPortHeight];
  },

  init: function () {
    console.log("init");
    var self = this;
    this.angle = 0;
    //this.cargarAudios();

    if (highScore == null || highScore == 0) {
      highScore = Math.floor(Math.random() * 200) * 100; //alca
    }

    //////////////////////////////////////////
    canvas = document.getElementById("canvas");
    //if(debugMode==1) 	canvas.addEventListener("click",fullscreen);

    $("html").keypress(function (e) {
      //	console.log(e.key)
      if (e.key == "p") {
        pausa = !pausa;
      }
    });

    images = images || {};

    var loader = new createjs.LoadQueue(false);

    loader.on("fileload", this.handleFileLoad, this);
    loader.on("complete", this.handleComplete, this);

    loader.loadManifest(lib.properties.manifest);
  },

  handleFileLoad: function (evt) {
    if (evt.item.type == "image") {
      images[evt.item.id] = evt.result;
    }
  },

  //file load
  handleComplete: function (evt) {
    console.log("handleComplete");

    // esto es la linea de tiempo principal:
    //	exportRoot = new lib.steven();

    stage = new createjs.Stage(canvas);
    //	stage.addChild(exportRoot);

    //stage.snapToPixel=false;
    createjs.Ticker.setFPS(lib.properties.fps);

    createjs.Ticker.addEventListener("tick", this.tick);
    /////////////////////////////////////////////
    stage.update();

    //createjs.Ticker.on("tick", this.exitHandler, this); //funcion clock

    //	document.getElementById('waitpage').style.display='none';
    Demo.setup();
  },

  establecerEstrellas: function () {
    if (score < 1000) cantEstrellas = 1;
    if (score >= 1000 && score <= 3000) cantEstrellas = 2;
    if (score > 3000) cantEstrellas = 3;
    console.log(
      "##### estrellas " + cantGanadores + " " + score + " " + cantEstrellas
    );
    mc.stars.gotoAndPlay(cantEstrellas * 20);
  },

  tick: function () {
    //sistema "inteligente" de dropeo de frames
    /*fps=createjs.Ticker.getMeasuredFPS();
        //if(curFrame%12==0) console.log("FPS:"+fps);
        if(fps>18 && fps<22) {
        	if(curFrame%2==0 || curFrame%3==0 || curFrame%5==0) stage.update(); //dropea 1,7
        }else if(fps>14 && fps<18) {
        	if(curFrame%2==0 || curFrame%3==0) stage.update(); //dropea 1,5,7
        }else if(fps<14) {
        	if(curFrame%2==0) stage.update(); //dropea 1,3,5,7
        }else if(fps>=22){
        	stage.update();
        }*/
    stage.update();
    Demo.exitHandler();
  },
  finDelJuego: function () {
    perdiste = 1;
    stage.removeChild(pastos);
    console.log("#############################");
    console.log("fin del juego");
    console.log("cant stevens: " + cantGanadores);
  },

  setup: function () {
    console.log("setup");

    score = 0;

    ganasteMC = new lib.ganaste();
    perdisteMC = new lib.perdiste();
    container = new createjs.Container();
    stage.removeAllChildren();
    pastos = new lib.pastos();

    fondo = new lib.fondo();
    piso = new lib.pisoGraf();
    //pisoGraf=new lib.pisoGraf();
    //console.log(piso.getNumChildren());

    amatista = new lib.amatista();

    stage.addChild(fondo);
    stage.addChild(amatista);

    //piso.alpha = 0;

    container.addChild(piso);

    container.addChild(cuadradoNegro);
    stage.addChild(container);

    //piso.stop();
    anchoPiso = piso.getBounds().width;

    stage.addChild(pastos); //agrego los pastos
    pastos.gotoAndStop(0);

    perdiste = 0;

    setTimeout(function () {
      try {
        amatista.children[0].x = -1000;
      } catch (e) {}

      container.removeChild(cuadradoNegro);
      //  piso.alpha = 1;
    }, 1);

    lineaDeMuerte = piso.nominalBounds.height;

    setTimeout(function () {
      piso2Grid(Demo.reStart); //esto es un callback
    }, 1000);
  },
  reStart: function () {
    console.log("restart");
    score = 0;
    Demo.playSound(musicaGameplay, true);
    amatista.children[0].x = -1000;
    perdiste = 0;
    pastos.gotoAndPlay(0);
    Demo.ponerStevens();
    piso.x = 0;
    perdisteMC.visible = ganasteMC.visible = false;
    Demo.camara();
    pausa = false;
  },
  ponerStevens: function () {
    for (i = 0; i < arrSteven.length; i++) {
      arrSteven[i].parent.removeChild(arrSteven[i]);
      arrSteven.splice(i, 1);
    }
    for (var i = 0; i < cantStevenes; i++) {
      arrSteven.push(new lib.steven1());
      st = arrSteven[i];
      st.snapToPixel = true; //hice pruebas y esto es mejor, aunq venga por default en true, lo dejo acá explicito :D
      st.velY = 0;
      posicionX = Math.random() * limiteStevenDer - limiteStevenIzq;
      //console.log(posicionX);
      st.x = Math.random() * limiteStevenDer;
      st.y = 450;
      container.addChild(st);
      st.regY -= (i * 30) / arrSteven.length; //esto es para simular que van por dif carriles del eje z
      st.veloc = Math.random() * 0.3 + 0.7;
      //console.log(st.veloc);
      st.gotoAndPlay(Math.floor(Math.random() * 15));
    }

    /*
        setTimeout(function() {
            for (var i = 0; i < arrSteven.length; i++) {
               // console.log(arrSteven[i])
                arrSteven[i].children[0].gotoAndPlay(Math.floor(Math.random() * 15));
            }
        }, 200);*/
  },
  ordenarStevenes: function () {
    yPanes = []; //array bidimensional q va a tener la data de los panes, para ordenarlos.
    for (i = 0; arrSteven.length > i; i++) {
      yPanes.push([Math.floor(arrSteven[i].y), arrSteven[i]]);
    }
    yPanes.sort(); //ordena el primer valor del array [este][esteNo]
    //yPanes.reverse();
    for (i = 0; yPanes.length > i; i++) {
      container.setChildIndex(yPanes[i][1], i + 1);
    }

    //console.log(yPanes);
  },
  endGame: function () {
    pausa = true;
    console.log("perdiste!!");
    if (isNaN(cantGanadores)) cantGanadores = 0;
    score = cantGanadores * 1000;
    this.stopMusic();
    perdiste = 1;
    stage.removeAllChildren();

    if (cantGanadores == 0) {
      perdisteMC.visible = true;
      Demo.playSound(endLose, false);
      stage.addChildAt(perdisteMC, 0);
      mc = perdisteMC;
    } else {
      Demo.playSound(endWin, false);
      ganasteMC.visible = true;
      stage.addChildAt(ganasteMC, 0);
      mc = ganasteMC;
    }

    if (score > highScore) highScore = score;
    mc.parteAbajo.score.text = score;
    mc.parteAbajo.highScore.text = highScore;

    //mc.stars.gotoAndPlay(0);

    if (escanearPiso != true) setTimeout(Demo.reStart, 3000); //una vez q perdes, dps de una seg restart, a menos q estes escaneando el piso
  },

  playSound: function (cual, loop) {
    //console.log("$$$$$ playSound: "+cual +"; "+loop);

    if (loop) {
      musicas[0] = new Audio(cual);
      musicas[0].loop = true;
      musicas[0].play();
    } else {
      var audio = new Audio(cual);
      audio.play();
    }
  },

  mouseDown: function (x, y) {
    var proporcion = canvas.width / getViewport()[0];
    x = x * proporcion;
    y = y * proporcion;
    //console.log(x, y);

    if (perdiste == 0) {
      //console.log("["+stage.mouseX, stage.mouseY+"]");
      //console.log("checkHit:"+this.checkHit(st.x, st.y), "recordarSaltar:"+st.recordarSaltar, "cualFr:"+st.cualFrSalto);
      //velPiso=pisoRapido; //cuando salta aumenta la velocidad del piso
      //console.log(stage.mouseX); stageX siempre me va a informar un toque anterior al q estoy.
      for (var i = 0; i < arrSteven.length; i++) {
        st = arrSteven[i];
        if (
          !distanciaMouseXACtivado ||
          modulo(st.x - x) < distanciaParaQueSalten
        ) {
          if (checkHitGrid(st.x, st.y) == true) {
            //si esta en una plataforma..
            this.saltaSteven(i);
          } else {
            //si esta en el aire
            if (st.recordarSaltar == 0) {
              //me fijo si ya estaba recordando, para no volverle a empezar la cuenta de frames q recuerda
              st.recordarSaltar = 1; //no va a saltar, pero va a recordar q tiene q hacerlo, poq a veces esta medio cayendo y medio no todo el tiempo
              st.cualFrSalto = curFrame;
            } else {
              //console.log(i+": ignorando recordar..");
            }
          } //if st checkhit
        } //fin distancia x
      } //for
    } //if perdiste==0
  },
  saltaSteven: function (i) {
    Demo.playSound(jump, false);
    st = arrSteven[i];
    st.recordarSaltar = 0;
    st.gotoAndStop("jump");
    val = Math.random() * 0.25 + 0.9;
    st.velY = salto * val;
  },
  //funcion clock:
  exitHandler: function (event) {
    if (pausa == true) return;
    if (movPiso == true) piso.rotation = 0.5 * Math.sin(curFrame / 15) - 0.1;
    var cuantoFaltaParaLlegar = anchoPiso + piso.x - anchoStage;
    var llegada = 0;
    var largada = anchoPiso - anchoStage;
    var deltaFondo = fondo.getBounds().width - anchoStage;
    var ratio = cuantoFaltaParaLlegar / largada;
    fondo.x = deltaFondo * 0.9 * ratio - deltaFondo;

    if (perdiste == 0) {
      curFrame++;
      //console.log(curFrame);
      //	console.log("st0"+arrSteven[0].x+"; "+arrSteven[0]._getObjectsUnderPoint());

      for (var i = 0; i < arrSteven.length; i++) {
        //console.log(i);
        st = arrSteven[i];

        valX =
          2 * st.veloc * st.veloc * Math.sin(curFrame / (80 * st.veloc)) +
          Math.random() -
          0.6; //leve tendencia hacia la izq de 0.1
        if (i % 2 == 0) {
          st.x += valX;
        } else {
          st.x -= valX;
        }

        if (st.x > limiteStevenDer && ganaste == 0) st.x = limiteStevenDer; //el ganaste, es porq se van hacia la derecha cuando ganan
        if (st.x < limiteStevenIzq) st.x = limiteStevenIzq;

        if (checkHitGrid(st.x, st.y) == true) {
          //si esta sobre una plataforma

          if (st.velY > 0) {
            //lo frena si viene cayendo, pero no si va saltando
            if (st.velY > gravedad * 6) {
              //console.log("velY="+st.velY+" aterrizando");
              st.gotoAndStop("land");
              Demo.playSound(land, false);
              //si esta tocando una plataforma, y su velocidad es menos a 6 veces la gravedad (viene cayendo durante 6 frames). lo frena
            }
            st.velY = 0;
          } else {
            //correccion de altura: (solo se calcula si esta en el piso)
            var deltaY = 0;
            hayPiso = checkHitGrid(st.x, st.y - tile);
            if (hayPiso == true || hayPiso > 0) {
              st.y -= tile + 1;
            }
            //se fija cuanto para arriba hay hitTest

            if (rotacionStevenes == true)
              st.rotation = this.anguloAdelante(st.x, st.y);
          }

          if (st.recordarSaltar == 1 && curFrame - st.cualFrSalto < 6) {
            //solo recuerda saltar por 6 frames
            //	console.log("Saltando Recordado! checkHit Actual:"+this.checkHit(st.x, st.y), " recordarSaltar:"+st.recordarSaltar, "cualFr:"+st.cualFrSalto);
            this.saltaSteven(i);
          } else {
            st.recordarSaltar = 0;
          }
        } else {
          //si esta en el aire
          st.velY += gravedad; //le suma la aceleracion a la velocidad
        } //IF si esta o no en caida

        //  checkHitGrid();

        //con esto pretendo fijarme que no vaya demasiado rapido como para saltearse algunos pisos
        /*	if(checkHitGrid(st.x+pisoRapido,st.y+st.velY/4)==true){
                		st.velY=0;
                		st.y=grid[coord2Tiles(st.x-piso.x)][coord2Tiles(st.y-piso.y)].y*tile; 
                		st.y+=st.velY/4
                		 


                	}else{*/

        st.y += st.velY; //primero se evalua cuanto sera lo q hay q sumarle o restarle a Y, y despues se aplica aca
        //  	}

        if (st.y > lineaDeMuerte || isNaN(st.y)) {
          //   console.log(arrSteven.length,i);
          arrSteven.splice(i, 1);
          container.removeChild(st);
          Demo.playSound(fall, false);
          if (arrSteven.length == 0) this.endGame();
        }
        //cuando ganas (cuando queda solo un piso)
        //los stevenes avanzan, y se detiene el piso
        if (ganaste == 1) {
          st.x += 10;
          //estos stevenes ganadores van a ir cayendo, y cuando queden 0
          //se va la pantalla
        }
      } //fin for stevens

      ////////////////////////////////////// PISOS
      //oculta los pisos q no estan en pantalla
      //y elimina los q pasaron
      for (var i = 0; i < piso.getNumChildren(); i++) {
        var child = piso.getChildAt(i);
        var xPiso = child.x + piso.x;
        var limiteDer = child.getBounds().width + xPiso;
        /* if (xPiso*valEscala > anchoStage * 1.3) { //ese 1.3 es changui
                     child.visible = false; //invisibilizo los pisos q no llegaron
                 } else {
                     child.visible = true;

                 }*/
        if (limiteDer < -anchoStage * 1.3) {
          piso.removeChild(child);
        }
      } //FIN FOR PISOS
      var xPisoFinal = piso.pisoFinal.x + piso.x;
      if (xPisoFinal < xPisoFinalGanador && ganaste == 0) {
        stage.removeChild(pastos);
        //al agregarle && ganaste==0, hago q esto se ejecute una sola vez
        pisoLento = 4;
        pisoRapido = 6;
        ganaste = 1;
        cantGanadores = 0;
        cantGanadores = arrSteven.length;
        console.log("ganastE!!!!! " + cantGanadores);
        setTimeout(function () {
          Demo.endGame();
        }, 2000); //ni bien ganas no espera a q se mueran los stevenes, sino q despues de 2s ganas
      }

      //	console.log("quedan: "+piso.getNumChildren()+" "+numPisoGanador+ " "+ganaste);

      amatista.x += 1.5;

      piso.x -= velPiso;
      piso.x -= velPiso;
      velPiso = velPiso * 0.993; //con este numero dura lo mismo q el salto promedio
      if (velPiso < pisoLento) velPiso = pisoLento;
      //console.log(velPiso);
      Demo.ordenarStevenes();
      Demo.camara();
    }
  }, //fin gameloop
  camara: function () {
    //la idea es que segun el nivel y los tipitos, se ajuste la escala del nivel, para llegar a ver todo.
    //es complejo determinar el punto de container.y (o container.regY)
    var minY = 99999;
    var maxY = 0;
    var maxX = 0;
    var minX = 99999;

    rta = this.valMinMaxPiso();
    valMinYGrid = rta.min;
    valMaxYGrid = rta.max;
    valMaxYGrid_5 = rta.max5;
    valMinYGrid_5 = rta.min5;

    for (var i = arrSteven.length - 1; i >= 0; i--) {
      s = arrSteven[i];
      if (s.x > maxX) maxX = s.x;
      if (s.y > maxY) maxY = s.y;
      if (s.x < minX) minX = s.x;
      if (s.y < minY) minY = s.y;
    }

    var anchoEstandar = limiteStevenDer - limiteStevenIzq;
    var anchoActual = maxX - minX + 200;
    var altoActual = maxY - minY + 200;

    escalaY = altoStage / altoActual;
    escalaX = anchoStage / anchoActual;

    valX = minX - limiteStevenIzq;
    container.regX = container.regX + (valX - container.regX) / aceleracion;

    //lo q este mas abajo: el tipito, el piso actual, o el piso de mas adelante
    if (valMaxYGrid > valMaxYGrid_5) vmx = valMaxYGrid;
    else vmx = valMaxYGrid_5;
    if (maxY + altoStage / 2 > vmx) vmx = maxY;

    if (valMinYGrid > valMinYGrid_5) vmn = valMinYGrid_5;
    else vmn = valMinYGrid_5;

    valEscala = altoStage / (vmx - vmn + altoStage);
    //  console.log(valEscala)
    if (valEscala < 0.25) valEscala = 0.25;
    if (valEscala > 1) valEscala = 1;
    if (isNaN(container.scaleX)) {
      container.scaleX = container.scaleY = valEscala;
    }
    container.scaleX = container.scaleY =
      container.scaleX + (valEscala - container.scaleX) / aceleracion;

    valY = vmx - altoStage / valEscala + altoStage / 8;

    //esto no se.. anda mejor asi parece
    //  if(altoStage/(valMaxYGrid+valY) >1.5) valY*=0.5

    if (isNaN(container.regY)) container.regY = valY;
    container.regY = container.regY + (valY - container.regY) / aceleracion;

    // console.log(
    //   vmx,
    //   Math.floor(maxY),
    //   Math.floor(valMaxYGrid),
    //   Math.floor(valMaxYGrid_5),
    //   valY,
    //   valEscala
    // );
    //console.log(altoStage-(valMaxYGrid+valY),altoStage/(valMaxYGrid+valY))
  },
  valMinMaxPiso: function () {
    var hayPiso = false;

    //max y minimos y del piso.
    for (var i = altoTiles - 1; i >= 0; i--) {
      try {
        hayPiso = grid[coord2Tiles(-limiteStevenIzq - piso.x)][i].muro;
      } catch (e) {
        hayPiso = false;
      }
      if (hayPiso == true) {
        valMaxYGrid = i * tile;
        break;
      }
    }
    for (var i = 0; i < altoTiles; i++) {
      try {
        hayPiso = grid[coord2Tiles(-limiteStevenIzq - piso.x)][i].muro;
      } catch (e) {
        hayPiso = false;
      }
      if (hayPiso == true) {
        valMinYGrid = i * tile;
        break;
      }
    }
    /////se fija 10 tiles adelante el max y min
    for (var i = altoTiles - 1; i >= 0; i--) {
      try {
        hayPiso =
          grid[coord2Tiles(-limiteStevenIzq - piso.x + tile * 10)][i].muro;
      } catch (e) {
        hayPiso = false;
      }
      if (hayPiso == true) {
        valMaxYGrid_5 = i * tile;
        break;
      }
    }
    for (var i = 0; i < altoTiles; i++) {
      try {
        hayPiso =
          grid[coord2Tiles(-limiteStevenIzq - piso.x + tile * 10)][i].muro;
      } catch (e) {
        hayPiso = false;
      }
      if (hayPiso == true) {
        valMinYGrid_5 = i * tile;
        break;
      }
    }
    return {
      min: valMinYGrid,
      max: valMaxYGrid,
      max5: valMaxYGrid_5,
      min5: valMinYGrid_5,
    };
  },
  anguloAdelante: function (x, y) {
    var nextY = y + 30; //arranco a chequear desde 10px por debajo del nivel actual
    var nextX = x + 50; //si la dif en x es 1, da angulos muy grandes
    while (checkHitGrid(nextX, nextY) == true) {
      //se fija cuanto para arriba hay hitTestdel siguiente punto
      nextY -= 2; //vamos de 2 en 2, para ahorrar procesamiento
    }
    //	console.log(Math.floor(x)+","+Math.floor(y)+"->"+Math.floor(nextX)+","+Math.floor(nextY));
    //console.log(this.calcularAngulo(x,y, x+1, difNextX));
    return this.calcularAngulo(x, y, nextX, nextY) / 2;
  },
  calcularAngulo: function (cx, cy, ex, ey) {
    return (Math.atan2(ey - cy, ex - cx) * 180) / Math.PI;
  },
  stopMusic: function () {
    // console.log('stopMusic');

    for (var m = 0; m < musicas.length; m++) {
      //console.log(">>> parando musica "+m +"; "+musicas[m]);
      musicas[m].pause();
      musicas[m].currentTime = 0;
    }
  },
};

$(document).ready(function () {
  console.log("doc ready!");
  Demo.init();
});

function modulo(n) {
  return Math.floor(Math.sqrt(n * n));
}

canvas = document.getElementById("canvas");
canvas.addEventListener(
  "touchstart",
  function (e) {
    e.preventDefault();
    Demo.mouseDown(e.touches[0].clientX, e.touches[0].clientY); //se lo paso y se arregla desde adentro de demo
  },
  false
);

function fullscreen() {
  var el = document.getElementById("canvas");

  if (el.webkitRequestFullScreen) {
    el.webkitRequestFullScreen();
  } else {
    el.mozRequestFullScreen();
  }
}

function debug() {
  perdiste = 1;
  for (i = 0; i < arrSteven.length; i++) {
    console.log(arrSteven[i].children[0].currentFrame);
  }
}

function cualPasto() {
  cant = Math.floor(10 * Math.random());

  // console.log(cant);

  //this.pastosDentro.gotoAndStop(cual);
}
