
		function getViewport() {

 var viewPortWidth;
 var viewPortHeight;

 // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
 if (typeof window.innerWidth != 'undefined') {
   viewPortWidth = window.innerWidth,
   viewPortHeight = window.innerHeight
 }

// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
 else if (typeof document.documentElement != 'undefined'
 && typeof document.documentElement.clientWidth !=
 'undefined' && document.documentElement.clientWidth != 0) {
    viewPortWidth = document.documentElement.clientWidth,
    viewPortHeight = document.documentElement.clientHeight
 }

 // older versions of IE
 else {
   viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
   viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
 }
 return [viewPortWidth, viewPortHeight];
}


	 function posicionamientoEncuadre(){
			console.log('>> posicionamientoEncuadre');
			var alto=getViewport()[1];
			var ancho =getViewport()[0];
			canvas.width=ancho;
			canvas.height=alto;
			console.log("ancho:"+ancho+"; alto:"+alto);
			var ratio=ancho/alto;		
			
			if(ratio>=1.775){	
				var escala = ancho/1136;				
				stage.scaleX=stage.scaleY=escala;					
				var nuevoAlto=640*escala;
				var difAlto = nuevoAlto - alto;
							stage.y=-difAlto/2;

			}else{
				//si es mas angosto que 1.775 ( es decir iphone4, ipad, etc)
				var escala = alto/640; //escala
				stage.scaleX=stage.scaleY=escala;		
					
				var nuevoAncho=1136*escala;
				var difAncho = nuevoAncho - ancho;
				stage.x=-difAncho/2;

			}//cierra else ratio
		console.log('>> fin posicionamientoEncuadre');
}
	
