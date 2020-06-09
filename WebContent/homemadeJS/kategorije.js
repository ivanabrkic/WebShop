var imeKategorije;
var listaOglasaZaKategoriju;
var omiljeniOglasi;
var minCena = 0;
var maxCena = 100;
var minLajk = 0;
var maxLajk = 100;

$(document).ready(function(){
	
	
	$.get({
		url: 'rest/kategorije/getKliknutaKategorija',
		success : function(kat){
			if(kat.naziv){
				imeKategorije = kat.naziv;
				$('#imeKategorijeNaslov').html("Kategorija : " + imeKategorije);
				
				if(imeKategorije != "Najpopularniji oglasi"){					
					
					$.post({
							url: 'rest/kategorije/kategorisaniOglasi',
							data: JSON.stringify({naziv: imeKategorije}),
							contentType: 'application/json',
							success: function(data) {
								if (data != null)
								{
									listaOglasaZaKategoriju = data;
									ucitajListuOglasa(listaOglasaZaKategoriju);	
									promeniSlajder();
				
								}
							},
							error: function() {
							}
					});
				 }
				else{
					$.get({
						url : 'rest/oglasi/omiljeniOglasi',
						success : function(omiljeni) {
							if(omiljeni != null){
								omiljeniOglasi = omiljeni;
								listaOglasaZaKategoriju = omiljeni;
								ucitajListuOglasa(omiljeniOglasi);	
								promeniSlajder();
							}
						}
					});
			   }
			}
		},
		error: function(){
	
		}
		
	});
})

$("#kategorije").hover(function(event){
	event.preventDefault();
	
	$.get({
		url: 'rest/kategorije/sveKategorije',
		success : function(sveK){
			if(sveK != null){
				let sveKategorijeString = '<li data-value="Najpopularniji oglasi"><a href="">Najpopularniji oglasi</a></li>';
				for(i = 0; i < sveK.length; i++){
					if(sveK[i].naziv != "Najpopularniji oglasi"){
						sveKategorijeString += '<li data-value="' 
												+ sveK[i].naziv 
												+ '" > <a href="">' 
												+ sveK[i].naziv 
												+ '</a></li>';
					}
				}
				$('#listaKategorija').html($(sveKategorijeString));
			}
		}
		
	});
	
})

$("#listaKategorija").on("click", "a", function(e){
	
	event.preventDefault();
	
	var $this = $(this).parent();
    $this.addClass("select").siblings().removeClass("select");
    imeKategorije = $this.data("value");
    
    $.post({
    	url: 'rest/kategorije/kliknutaKategorija',
    	data: JSON.stringify({naziv: imeKategorije}),
    	contentType: 'application/json',
    	success: function(uspeh){
    		if(uspeh){
	    		window.location = "kategorije.html";
    		}
    	},
    	error: function(){
    	}
    })
	
	$('#imeKategorijeNaslov').html("Kategorija : " + imeKategorije);
	    
	if(imeKategorije != "Najpopularniji oglasi"){
		$.post({
				url: 'rest/kategorije/kategorisaniOglasi',
				data: JSON.stringify({naziv: imeKategorije}),
				contentType: 'application/json',
				success: function(data) {
					if (data != null)
					{
						listaOglasaZaKategoriju = data;
						ucitajListuOglasa(listaOglasaZaKategoriju);
						promeniSlajder();
	
					}
				},
				error: function() {
					
				}
		});
	 }
	 else{
		$.get({
			url : 'rest/oglasi/omiljeniOglasi',
			success : function(omiljeni) {
				if(omiljeni != null){
					omiljeniOglasi = omiljeni;
					listaOglasaZaKategoriju = omiljeni
					ucitajListuOglasa(omiljeniOglasi);	
					promeniSlajder();
				}
			}
		});
     }
})

$('#listaKategorija').mouseleave(function(event){
	event.preventDefault();
	promeniSlajder();
})

function promeniSlajder(){
	if(listaOglasaZaKategoriju != null){
    	$.post({
		url: 'rest/kategorije/podaciZaSlajder',
		data: JSON.stringify({listaOglasa: listaOglasaZaKategoriju}),
		contentType: 'application/json',
		success: function(podaciZaSlajder) {
			if (podaciZaSlajder != null)
			{
				minCena = podaciZaSlajder[0];
				maxCena = podaciZaSlajder[1];
				minLajk = podaciZaSlajder[2];
				maxLajk = podaciZaSlajder[3];
				
		    	$( "#slider-range" ).slider({
		    	      range: true,
		    	      min: minCena,
		    	      max: maxCena,
		    	      values: [ minCena, maxCena],
		    	      slide: function( event, ui ) {
		    	        $( "#amount" ).val( ui.values[ 0 ] + " DIN" + " - " + ui.values[ 1 ] + " DIN" );
		    	      }
		    	    });
		    	    $( "#amount" ).val(  $( "#slider-range" ).slider( "values", 0 ) +
		    	            " DIN - " + $( "#slider-range" ).slider( "values", 1 ) + " DIN");
		    	    
		    	    $( "#slider-range2" ).slider({
		    	        range: true,
		    	        min: minLajk,
		    	        max: maxLajk,
		    	        values: [ minLajk, maxLajk],
		    	        slide: function( event, ui ) {
		    	          $( "#amount2" ).val(  ui.values[ 0 ] + " LAJK" + " - " + ui.values[ 1 ] + " LAJK"  );
		    	        }
		    	      });
		    	      $( "#amount2" ).val( $( "#slider-range2" ).slider( "values", 0 ) +
		    	        " LAJK - " + $( "#slider-range2" ).slider( "values", 1 ) + " LAJK");
		    	      
		    	      if(minCena === maxCena){
			    	    	 $('#slider-range').children().eq(0).css('width','100%');
			    	    	 $('#slider-range').children().eq(0).css('left','0%');
			    	    	 
			    	    	 $('#slider-range').children().eq(1).css('left', '0%');
			    	    	 $('#slider-range').children().eq(2).css('left', '100%');
			    	     }
			    	     
			    	     
			    	     if(minLajk === maxLajk){
			    	    	 $('#slider-range2').children().eq(0).css('width','100%');
			    	    	 $('#slider-range2').children().eq(0).css('left','0%');
			    	    	 
			    	    	 $('#slider-range2').children().eq(1).css('left', '0%');
			    	    	 $('#slider-range2').children().eq(2).css('left', '100%');
			    	     }
			}
		},
		error: function() {
			
		}
    	});
	
	}

}

window.ucitajListuOglasa=function(listaOglasaZaKategoriju){
	let listaOglasaString = "";
	for(i=0; i < listaOglasaZaKategoriju.length; i++){
			listaOglasaString += '<div class="col-sm-6 col-lg-4 mb-4" data-aos="fade-up"><div class="block-4 text-center border"><figure class="block-4-image">' +
	        					 '<img src="' + listaOglasaZaKategoriju[i].stringSlike + '" alt="Image placeholder" class="img-fluid">' +
	        					 '</figure><div class="block-4-text p-4">' +
			        			 '<h3><a class="linkDoDetalja" href="#" data-toggle="modal" data-target="#modalLoginForm" id="L' + listaOglasaZaKategoriju[i].id + '" > ' + listaOglasaZaKategoriju[i].naziv + '</a></h3>' +
			        			 '<p class="mb-0">' + listaOglasaZaKategoriju[i].opis + '</p>' +
			        			 '<p class="text-primary font-weight-bold">' + listaOglasaZaKategoriju[i].cena + ' DIN </p>' +
		        				 '</div></div></div> ';
	}
	$('#mestoZaOglase').html($(listaOglasaString));
	
	$('.linkDoDetalja').on("click",function(event){
		event.preventDefault();
		let idOglasa = event.target.id;
		idOglasa = idOglasa.substring(1, idOglasa.length);
	    $.post({
			url: 'rest/oglasi/detaljiOglasa',
			data: JSON.stringify({id: idOglasa}),
			contentType: 'application/json',
			success: function(detaljanOglas) {
				if(detaljanOglas != null){
						$('#slikaOglasa').attr("src", detaljanOglas.stringSlike);
						$('#nazivOglasa').html(detaljanOglas.naziv);
						$('#opisOglasa').html(detaljanOglas.opis);
						$('#cenaOglasa').html(detaljanOglas.cena);
						$('#brojLajkova').html(detaljanOglas.brojLajkova + "       ");
						$('#brojDislajkova').html(detaljanOglas.brojDislajkova);
						$('#datum').html(detaljanOglas.datumPostavljanja + " - " + detaljanOglas.datumIsticanja);
						$('#grad').html(detaljanOglas.grad);
						$('#brojListaOmiljenih').html(detaljanOglas.brojListaOmiljenih + "       ");
						$('#korisnickoImeProdavca').html(detaljanOglas.korisnickoImeProdavca);
				}
			},
			error: function() {
			
			}
		});
	})
}

window.resetujPretragu = function(){
	$('#pretragaNaziv').val("");
	
	$('#datumOdDan').css('border-color', '#CED4DA');
	$('#datumOdMesec').css('border-color', '#CED4DA');
	$('#datumOdGodina').css('border-color', '#CED4DA');
	$('#datumDoDan').css('border-color', '#CED4DA');
	$('#datumDoMesec').css('border-color', '#CED4DA');
	$('#datumDoGodina').css('border-color', '#CED4DA');	
	
	$('#datumOdDan').val("");
	$('#datumOdMesec').val("");
	$('#datumOdGodina').val("");
	$('#datumDoDan').val("");
	$('#datumDoMesec').val("");
	$('#datumDoGodina').val("");
	
	$('#izabraniGrad').html("Svi gradovi");
}