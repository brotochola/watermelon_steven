var grid = [];
var anchoTiles
var altoTiles
var visibleTiles = false;
var escanearPiso = false;
var dibujarGridEnConsola = false
var verAreaCaminable = false;
var anchoStage = 1136;
var altoStage = 640;
var tile = 17;




function Spot(x, y, muro) {
    this.x = x;
    this.y = y;
    this.muro = muro;


}

function parsearGridCargada(g) {
    try { g = JSON.parse(g); } catch (e) { console.log(e) }
    arr = new Array(anchoTiles);
    for (i = 0; i < g.length; i++) {
        arr[i] = new Array(altoTiles);
        for (j = 0; j < g[0].length; j++) {

            if (g[i][j] == 1) arr[i][j] = new Spot(i, j, true);
            else arr[i][j] = new Spot(i, j, false);
        }
    }
    return arr;
}

function simplificarGrid() {
    arr = new Array(anchoTiles);
    for (i = 0; i < anchoTiles; i++) {
        arr[i] = new Array(altoTiles);
        for (j = 0; j < altoTiles; j++) {

            if (grid[i][j].muro == true) arr[i][j] = 1;
            else arr[i][j] = 0;
        }
    }
    return arr;

}

function downloadJSON(que) {

    var atag = document.createElement("a");
    var file = new Blob([JSON.stringify(que, null, 2)], { type: 'text/plain' });
    atag.href = URL.createObjectURL(file);
    atag.download = "grid.json";
    atag.click();
}
function bajarGridTxt() {
 drawGrid = new Array();
 grstr="";
 g=grid
    for (x = 0; x < g.length; x++) {

        for (y = 0; y < g[1].length; y++) {
            try {
                if (g[x][y].muro == true || g[x][y].muro == 1) drawGrid[y] += "#";
                else drawGrid[y] += "-";
            } catch (e) { drawGrid[y] += "-"; }
        }
    }

    for (var i = 0; i < drawGrid.length; i++) {
        num = i;
        if (i < 10) num = "0" + i;
       grstr+=num + ". " + drawGrid[i]+"\n";
    }
    var atag = document.createElement("a");
    var file = new Blob([grstr], { type: 'text/plain' });
    atag.href = URL.createObjectURL(file);
    atag.download = "grid.txt";
    atag.click();
}
function bajarGrid() {
    downloadJSON(simplificarGrid());
}



function checkHit(x, y) { //esta funcion chequea colisiones
    var l = piso.getNumChildren();

    for (var i = 0; i < l; i++) {

        try {
            //piso.children[3].children[4].getName()
            for (var j = 0; j < piso.getChildAt(i).children.length; j++) {
                var child = piso.getChildAt(i).getChildAt(j);
              //  console.log(i,j,child.getName())
                if (child.getName() == "shape") { //me cual es el shape, y eso escaneo
                    
                    var pt = child.globalToLocal(x, y);
                    if (child.hitTest(pt.x, pt.y)) {
                    		//console.log(child)
                    	return i;
                    }else{
                    	//console.log("no "+i)
                    }
                    
                }

            }
        } catch (e) {

            console.log(child)
            console.log(piso.getChildAt(i))
            console.log(i)
            return -1;
        }

    }
    return -1;
}

function borrarTodosLosShapesPisos() {
    for (var i = 0; i < piso.getNumChildren(); i++) {

        for (var j = 0; j < piso.getChildAt(i).getNumChildren(); j++) {
            var child = piso.getChildAt(i).getChildAt(j);
            //console.log(piso.getChildAt(i).getName(),i,j,child.getName())
            if (child.getName() == "shape") piso.getChildAt(i).removeChild(child)
        }
    }
}

function piso2Grid(cb) {
    console.log("piso 2 grid");

    if (verAreaCaminable == true) {
        var l = piso.getNumChildren();
        for (var i = 1; i < l; i++) {
            //piso.children[3].children[4].getName()
            for (var j = 0; j < piso.getChildAt(i).children.length; j++) {
                var child = piso.getChildAt(i).getChildAt(j);
                if (child.getName() == "shape") { //me cual es el shape, y eso escaneo
                    child.alpha = 0.5;
                }
            }
        }

    } //if areacamianble

    anchoTiles = Math.floor(piso.nominalBounds.width / tile);
    altoTiles = Math.floor(piso.nominalBounds.height / tile);
    	console.log(anchoTiles,altoTiles)
    if (escanearPiso) {
        console.log("ESCANEANDO PISO... esto puede tardar")       
        for (n = 0; n <= anchoTiles; n++) {
            grid[n] = new Array(altoTiles);
            for (m = 0; m <= altoTiles; m++) {
                grid[n][m] = new Spot(n, m);

                grid[n][m].muro = checkHit(n * tile + tile / 2, m * tile + tile / 2);
                if (grid[n][m].muro > -1) {
                    grid[n][m].muro = true;

                } else {
                	 grid[n][m].muro = false;
                  }


            
                // if(grid[n][m].muro!=-1)alert(1)
                if (visibleTiles) { //puedo hacer visibles los tiles
                    grid_el = new createjs.Shape();
                    grid_el.graphics.setStrokeStyle(2, "square").beginStroke("#000000");
                    if (grid[n][m].muro == true) grid_el.graphics.beginFill("#70FF85");
                    else grid_el.graphics.beginFill("#aaaaaa");
                    grid_el.graphics.rect(n * tile, m * tile, tile, tile);
                    grid_el.x_pos = n * tile;
                    grid_el.y_pos = m * tile;
                    grid_el.alpha = 0.3;
                    grid_el.addEventListener("click", function(e) {
                        alert(n, m)
                    })
                    container.addChild(grid_el);
                } //if visibleTiles

            } //m


        } //n
        if (dibujarGridEnConsola) dibujarGrid(grid);

        bajarGrid(); //baja la grilla en json
    } else {
        console.log("CARGANDO GRID DE grid.json...")
        //si no se escanea el piso, se carga la grid q alguna vez guarde
        //q sale de haber escaneado el piso anteriormente
        //cuando el nivel este listo, ya no escaneo mas la grid y queda como data.
        $.ajax({
            url: "grid.json",
            crossDomain: true,
            success: function(data) {
                //console.log(data);
                console.log("grid cargada del archivo");
                gridCargada = data;
                grid = parsearGridCargada(data);
                 setTimeout(cb,500);//callback
                if (dibujarGridEnConsola) dibujarGrid(grid);
            }
        });
    }

    	borrarTodosLosShapesPisos();
    //nivel.escenario.removeChild(nivel.escenario.caminable);
    //pa q no joda, dps de escanear donde se puede caminar y donde no, borro el obj
   
   


} //piso2grid

function checkHitGrid(x, y) {
    try {
        return grid[coord2Tiles(x - piso.x)][coord2Tiles(y - piso.y)].muro;

    } catch (e) {
        return false;
    }
}

function coord2Tiles(num) {
    return Math.floor(num / tile);
}

function dibujarGrid(g) {
    drawGrid = new Array();
    for (x = 0; x < g.length; x++) {

        for (y = 0; y < g[1].length; y++) {
            try {
                if (g[x][y].muro == true || g[x][y].muro == 1) drawGrid[y] += "#";
                else drawGrid[y] += "-";
            } catch (e) { drawGrid[y] += "-"; }
        }
    }

    for (var i = 0; i < drawGrid.length; i++) {
        num = i;
        if (i < 10) num = "0" + i;
        console.log(num + ". " + drawGrid[i]);
    }
}


//extiendo createjs
createjs.DisplayObject.prototype.getName = function() {
    if (!this.nameCache) {
        var parent = this.parent;
        var keys = Object.keys(parent);
        var len = keys.length;
        while (--len) {
            if (parent[keys[len]] === this) {
                this.nameCache = keys[len];
                break;
            }
        }
    }
    return this.nameCache;
}