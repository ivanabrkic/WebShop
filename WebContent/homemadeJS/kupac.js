///////////////// TOP 10 & KATEGORIJE /////////////////////////////////////////////////////////////////////////////////////

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

var oglasSvaPolja;
var omiljeniOglasi;
var imeKategorije;
var idOglasa;

var brojOglasaUKorpi = 0;

var ulogovanKorisnikIme = " ";

$(document).ready(function(){
		
	$.get({
		url: 'rest/ulogovanKorisnik',
		success : function(ulogovanKorisnik){
			ulogovanKorisnikIme = ulogovanKorisnik.korisnickoIme;
			$('#imeKorisnika').html(ulogovanKorisnik.korisnickoIme);
			
		}
	})
	
	
	imeKategorije = "Najpopularniji oglasi"; // OVDE SETUJEM JER NA POCETNOJ TOP10 MORA ZNATI VREDNOST PARAMETRA
	ucitajTop10();
	
	$.get({
		url: 'rest/korisnici/listaPorucenih',
		success : function(listaPorucenih){
			brojOglasaUKorpi = listaPorucenih.length;
			$('#brojOglasaUKorpi').html(brojOglasaUKorpi);
		}
	})
	
	$.get({
		url:'rest/korisnici/listaPoruka',
		success : function(listaPoruka){
			$('#brojPoruka').html(listaPoruka.length);
		}
	})
	
	/// GRADOVI PRETRAGE KORISNIKA
	$("#izabranoOdGradovaKorisnik").hover( function(event){
		event.preventDefault();
		let listaGradova = "";
		
		$.get({
			url: 'rest/oglasi/listaGradova',
			success : function(listaGradova){
				if(listaGradova != null){
					let sviGradovi = '<li data-value="Svi gradovi" ><a class="dropdown-item" href="">Svi gradovi</a></li>';
					for(i = 0; i < listaGradova.length; i++){
						sviGradovi += '<li data-value="' + listaGradova[i] + 
									  '" ><a class="dropdown-item" href="">' + listaGradova[i] + '</a></li>';
					}
					$('#listaGradovaKorisnik').html($(sviGradovi));
				}
			}
			
		});
	})

})

function ucitajTop10(){
	$.get({
		url : 'rest/oglasi/omiljeniOglasi',
		success : function(omiljeni) {
			if(omiljeni != null){
				omiljeniOglasi = omiljeni;
				let omiljeniString = "";
					for (i = 0; i < omiljeni.length; i++) { 
							omiljeniString += '<div class="owl-item" style="width: 320px; margin-right: 20px;"><div class="item"> \n' + 
			                '<div class="block-4 text-center"> \n' + 
			                  '<figure class="block-4-image"> \n' + 
			                    '<img src="' + omiljeni[i].stringSlike + '" ' + ' alt="Image placeholder" class="img-fluid"> \n' +
			                  '</figure>\n<div class="block-4-text p-4"> \n' + 
			                    '<h3>\n<a class="linkDoDetalja" href="#" data-toggle="modal" data-target="#modalLoginForm" ' + ' id="' + omiljeni[i].id + '" > ' + omiljeni[i].naziv + '</a>\n</h3> ' + 
			                    '<p class="mb-0"> \n' + omiljeni[i].opis + '</p> \n' + 
			                    '<p class="text-primary font-weight-bold"> \n' + omiljeni[i].cena + " DIN" + '</p> \n' +
			                  '</div>\n</div>\n</div> \n</div>'
							;
				}
				$('.owl-stage').html($(omiljeniString));
				
			}
			
			$('.linkDoDetalja').on("click",function(event){
				event.preventDefault();
				idOglasa = event.target.id;
				
			    $.post({
					url: 'rest/oglasi/detaljiOglasa',
					data: JSON.stringify({id: idOglasa}),
					contentType: 'application/json',
					success: function(detaljanOglas) {
						if(detaljanOglas != null){
							oglasSvaPolja = detaljanOglas;
							if (oglasSvaPolja != null){
								$('#slikaOglasa').attr("src", oglasSvaPolja.stringSlike);
								$('#nazivOglasa').html(oglasSvaPolja.naziv);
								$('#opisOglasa').html(oglasSvaPolja.opis);
								$('#cenaOglasa').html(oglasSvaPolja.cena);
								$('#brojLajkova').html(detaljanOglas.brojLajkova + "       ");
								$('#brojDislajkova').html(detaljanOglas.brojDislajkova);
								$('#datum').html(detaljanOglas.datumPostavljanja + " - " + detaljanOglas.datumIsticanja);
								$('#grad').html(detaljanOglas.grad);
								$('#brojListaOmiljenih').html(detaljanOglas.brojListaOmiljenih + "       ");
								$('#poruci').show();
								$('#dodajUListuOmiljenih').show();
								$('#korisnickoImeProdavca').html(detaljanOglas.korisnickoImeProdavca);

								$('#status').html(detaljanOglas.status);
								
								$.post({
									url: 'rest/korisnici/promeniSlicicuDetalja',
									data: JSON.stringify({id: idOglasa}),
									contentType: 'application/json',
									success : function(parametri){
										if(parametri){
											if(parametri[0] == 1){
												$('#brojListaOmiljenih').attr('class', 'icon-heart');
											}
											else{
												$('#brojListaOmiljenih').attr('class', 'icon-heart-o');
											}
											
											if(parametri[1] == 1){
												$('#brojLajkova').attr('class', 'icon-thumbs-up');
											}
											else{
												$('#brojLajkova').attr('class', 'icon-thumbs-o-up');
											}
											
											if(parametri[2] == 1){
												$('#brojDislajkova').attr('class', 'icon-thumbs-down');
											}
											else{
												$('#brojDislajkova').attr('class', 'icon-thumbs-o-down');
											}
										}
									}
									
								});
							}
						}
					},
					error: function() {
					
					}
				});
			})

		}
	});
}

var listaOglasaZaKategoriju;
var omiljeniOglasi;
var minCena = 0;
var maxCena = 100;
var minLajk = 0;
var maxLajk = 100;


$("#listaKategorija").on("click", "a", function(e){
	
	event.preventDefault();
	ponistiPretraguKorisnika();
	resetujPretragu();
	
	$.get({
		url: 'rest/korisnici/listaPorucenih',
		success : function(listaPorucenih){
			brojOglasaUKorpi = listaPorucenih.length;
			$('#brojOglasaUKorpi').html(brojOglasaUKorpi);
		}
	})
	
	$('#pretragaDiv').css('visibility','visible');
	$('#pretragaDiv').css('display', 'block');
	
	$('#porukeDiv').css('visibility','hidden');
	$('#porukeDiv').css('display', 'none');
	
	$('#pretragaKorisnikaDiv').css('visibility', 'hidden');
	$('#pretragaKorisnikaDiv').css('display', 'none');
	$('#dostavljeniDiv').css('visibility','hidden');
	$('#dostavljeniDiv').css('display', 'none');
	$('#korpaDiv').css('visibility','hidden');
	$('#korpaDiv').css('display', 'none');
	$('#omiljeniDiv').css('visibility','hidden');
	$('#omiljeniDiv').css('display', 'none');
	$('#najpopularnijiOglasiDiv').css('visibility','hidden');
	$('#najpopularnijiOglasiDiv').css('display', 'none');
	
	var $this = $(this).parent();
    $this.addClass("select").siblings().removeClass("select");
    imeKategorije = $this.data("value");
	
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
	
					}
				},
				error: function() {
					
				}
		});
	 }
	 else{
		listaOglasaZaKategoriju = omiljeniOglasi;
		ucitajListuOglasa(omiljeniOglasi);	
     }
})

$('#listaKategorija').mouseleave(function(event){
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
		idOglasa = event.target.id;
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

						$('#status').html(detaljanOglas.status);
						
						if(detaljanOglas.status === "AKTIVAN"){
							$('#poruci').show();
							$('#dodajUListuOmiljenih').show();
						}
						else{
							$('#poruci').hide();
							$('#dodajUListuOmiljenih').hide();
						}
				}
				
				$.post({
					url: 'rest/korisnici/promeniSlicicuDetalja',
					data: JSON.stringify({id: idOglasa}),
					contentType: 'application/json',
					success : function(parametri){
						if(parametri){
							if(parametri[0] == 1){
								$('#brojListaOmiljenih').attr('class', 'icon-heart');
							}
							else{
								$('#brojListaOmiljenih').attr('class', 'icon-heart-o');
							}
							
							if(parametri[1] == 1){
								$('#brojLajkova').attr('class', 'icon-thumbs-up');
							}
							else{
								$('#brojLajkova').attr('class', 'icon-thumbs-o-up');
							}
							
							if(parametri[2] == 1){
								$('#brojDislajkova').attr('class', 'icon-thumbs-down');
							}
							else{
								$('#brojDislajkova').attr('class', 'icon-thumbs-o-down');
							}
						}
					}
					
				});
			ucitajListuRecenzija();
	
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

///////LAJK - DISLAJK - OMILJENO ////////////////////////////////////////////////////////////////////////////////////////////

$('#dodajUListuOmiljenih').click(function(){
	event.preventDefault();
	
	let broj = parseInt($('#brojListaOmiljenih').html());
	
	if($('#brojListaOmiljenih').attr('class') == "icon-heart"){
		$('#brojListaOmiljenih').attr('class','icon-heart-o');
		$('#brojListaOmiljenih').html(broj - 1);
	}
	else{
		$('#brojListaOmiljenih').attr('class','icon-heart');
		$('#brojListaOmiljenih').html(broj + 1);
	}
	
	//POZIV SERVERU DA DODA/OBRISE U/IZ KORISNIKOVU LISTU OMILJENIH//
	
	 $.ajax({
		 	type: 'PUT',
			url: 'rest/korisnici/dodajUOmiljene',
			data: JSON.stringify({id: idOglasa, imeKategorije : imeKategorije}), // Saljem oglas da ga doda u listu omiljenih
			contentType: 'application/json',
			success: function(uspeo) {
				if(uspeo){
					
				}
			},
			error: function() {
				alert("FAIL");
			}
     });
})


$('#lajk').click(function(){
	event.preventDefault();
	
	if($('#brojDislajkova').attr('class') == "icon-thumbs-down"){
		$('#dislajk').trigger("click");
	}
	
	if($('#brojDislajkova').attr('class') == "icon-thumbs-o-down"){
		let broj = parseInt($('#brojLajkova').html());
		
		if($('#brojLajkova').attr('class') == "icon-thumbs-up"){
			$('#brojLajkova').attr('class','icon-thumbs-o-up');
			$('#brojLajkova').html(broj - 1);
		}
		else{
			$('#brojLajkova').attr('class','icon-thumbs-up')
			$('#brojLajkova').html(broj + 1);
		}
		
		$.ajax({
		 	type: 'PUT',
			url: 'rest/korisnici/dodajULajkovane',
			data: JSON.stringify({id: idOglasa, imeKategorije : imeKategorije}), // Saljem oglas da ga doda u listu omiljenih
			contentType: 'application/json',
			success: function(uspeo) {
				if(uspeo){
				}
			},
			error: function() {
				alert("FAIL");
			}
		});
	}
	
})

$('#dislajk').click(function(){
	event.preventDefault();
	
	if($('#brojLajkova').attr('class') == "icon-thumbs-up"){
		$('#lajk').trigger("click");
	}
	
	if($('#brojLajkova').attr('class') == "icon-thumbs-o-up"){
		let broj = parseInt($('#brojDislajkova').html());
		
		if($('#brojDislajkova').attr('class') == "icon-thumbs-down"){
			$('#brojDislajkova').attr('class','icon-thumbs-o-down');
			$('#brojDislajkova').html(broj - 1);
		}
		else{
			$('#brojDislajkova').attr('class','icon-thumbs-down');
			$('#brojDislajkova').html(broj + 1);
		}
		
		$.ajax({
		 	type: 'PUT',
			url: 'rest/korisnici/dodajUDislajkovane',
			data: JSON.stringify({id: idOglasa, imeKategorije : imeKategorije}), // Saljem oglas da ga doda u listu omiljenih
			contentType: 'application/json',
			success: function(uspeo) {
				if(uspeo){
				}
			},
			error: function() {
				alert("FAIL");
			}
		});
	}

})

//// OTVORI LISTU OMILJENIH OGLASA ////////////////////////////////////////////////////

$('#omiljeni').click(function(){
	event.preventDefault();
	ponistiPretraguKorisnika();
	resetujPretragu();
	
	$.get({
		url: 'rest/korisnici/listaPorucenih',
		success : function(listaPorucenih){
			brojOglasaUKorpi = listaPorucenih.length;
			$('#brojOglasaUKorpi').html(brojOglasaUKorpi);
		}
	})
	
	$('#naslovTabeleOmiljeni').html("Lista omiljenih oglasa");
		
	$('#omiljeniDiv').css('visibility','visible');
	$('#omiljeniDiv').css('display', 'block');
	
	$('#porukeDiv').css('visibility','hidden');
	$('#porukeDiv').css('display', 'none');
	
	$('#pretragaKorisnikaDiv').css('visibility', 'hidden');
	$('#pretragaKorisnikaDiv').css('display', 'none');
	$('#dostavljeniDiv').css('visibility','hidden');
	$('#dostavljeniDiv').css('display', 'none');
	$('#korpaDiv').css('visibility','hidden');
	$('#korpaDiv').css('display', 'none');
	$('#pretragaDiv').css('visibility','hidden');
	$('#pretragaDiv').css('display', 'none');
	$('#najpopularnijiOglasiDiv').css('visibility','hidden');
	$('#najpopularnijiOglasiDiv').css('display', 'none');
	
	$.get({
		url : 'rest/korisnici/listaOmiljenih',
		success : function(omiljeni) {
			let omiljeniString = "";
			
			for(i = 0; i < omiljeni.length; i++){
				
				if(omiljeni[i].status === "AKTIVAN"){
					omiljeniString +=  '<tr><td class="product-thumbnail">' +
	                				   '<img src="' + omiljeni[i].stringSlike + '" alt="" class="img-fluid">' +
	                				   '</td><td class="product-name">' +
	                				   '<h2 class="h5 text-black">' +
	                				   '<a class="linkDoDetalja" href="#" data-toggle="modal" data-target="#modalLoginForm" id="T' + omiljeni[i].id + '">' 
	                				   + omiljeni[i].naziv + '</a></h2></td>' +
	                				   '<td>' + omiljeni[i].cena + ' DIN </td>' +
	                				   '<td>' + omiljeni[i].opis + '</td></tr>';
				}
			}
			
			
			$('#dodajUTabeluOmiljeni').html($(omiljeniString));
			
			$('.linkDoDetalja').on("click",function(event){
				event.preventDefault();
				idOglasa = event.target.id;
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
								$('#poruci').show();
								$('#dodajUListuOmiljenih').show();
								$('#korisnickoImeProdavca').html(detaljanOglas.korisnickoImeProdavca);

								$('#status').html(detaljanOglas.status);
						}
						
						$.post({
							url: 'rest/korisnici/promeniSlicicuDetalja',
							data: JSON.stringify({id: idOglasa}),
							contentType: 'application/json',
							success : function(parametri){
								if(parametri){
									if(parametri[0] == 1){
										$('#brojListaOmiljenih').attr('class', 'icon-heart');
									}
									else{
										$('#brojListaOmiljenih').attr('class', 'icon-heart-o');
									}
									
									if(parametri[1] == 1){
										$('#brojLajkova').attr('class', 'icon-thumbs-up');
									}
									else{
										$('#brojLajkova').attr('class', 'icon-thumbs-o-up');
									}
									
									if(parametri[2] == 1){
										$('#brojDislajkova').attr('class', 'icon-thumbs-down');
									}
									else{
										$('#brojDislajkova').attr('class', 'icon-thumbs-o-down');
									}
								}
							}
							
						});
						
			
					},
					error: function() {
					
					}
				});
				
			});
		}
	});
	
})

///////////////////////// LISTA PORUCENIH /////////////////////////////////////////////////////////
///// APDEJT TABELE + NA DUGME PORUCI AKCIJA //////////////////////////////////////////////////////
///// TREBA I UKLONITI SA SAJTA KAO DOSTUPAN OGLAS //////////////////////////////////////////////// 

$('#poruci').click(function(event){
	event.preventDefault();
	
	$.ajax({
	 	type: 'PUT',
		url: 'rest/korisnici/dodajUPorucene',
		data: JSON.stringify({id: idOglasa, imeKategorije : imeKategorije}), // Saljem oglas da ga doda u listu 
		contentType: 'application/json',
		success: function(uspeo) {
		 	if(uspeo){
				ucitajTop10();
				$('#zatvoriModal').trigger("click");
				
				$.get({
					url: 'rest/korisnici/listaPorucenih',
					success : function(listaPorucenih){
						brojOglasaUKorpi = listaPorucenih.length;
						$('#brojOglasaUKorpi').html(brojOglasaUKorpi);
					}
				})
				
				alert("Uspešno poručen proizvod!");
			}
		},
		error: function() {
			alert("FAIL");
		}
	});
	
})

$('#korpa').click(function(event){
	event.preventDefault();
	ponistiPretraguKorisnika()
	resetujPretragu();
	
	$.get({
		url: 'rest/korisnici/listaPorucenih',
		success : function(listaPorucenih){
			brojOglasaUKorpi = listaPorucenih.length;
			$('#brojOglasaUKorpi').html(brojOglasaUKorpi);
		}
	})
	
	$('#naslovTabeleKorpa').html("Lista poručenih oglasa");
	
	$('#korpaDiv').css('visibility','visible');
	$('#korpaDiv').css('display', 'block');
	
	$('#porukeDiv').css('visibility','hidden');
	$('#porukeDiv').css('display', 'none');
	
	$('#pretragaKorisnikaDiv').css('visibility', 'hidden');
	$('#pretragaKorisnikaDiv').css('display', 'none');
	$('#dostavljeniDiv').css('visibility','hidden');
	$('#dostavljeniDiv').css('display', 'none');
	$('#omiljeniDiv').css('visibility','hidden');
	$('#omiljeniDiv').css('display', 'none');
	$('#pretragaDiv').css('visibility','hidden');
	$('#pretragaDiv').css('display', 'none');
	$('#najpopularnijiOglasiDiv').css('visibility','hidden');
	$('#najpopularnijiOglasiDiv').css('display', 'none');
	
	$.get({
		url: 'rest/korisnici/listaPorucenih',
		success: function(listaPorucenih) {
			if(listaPorucenih){				
				let listaPorucenihString = "";
					for(i = 0; i < listaPorucenih.length; i++){
							listaPorucenihString +=  '<tr><td class="product-thumbnail">' +
			                				   '<img src="' + listaPorucenih[i].stringSlike + '" alt="" class="img-fluid">' +
			                				   '</td><td class="product-name">' +
			                				   '<h2 class="h5 text-black">' +
			                				   '<a class="linkDoDetaljaKorpa" href="#" data-toggle="modal" data-target="#modalLoginForm" id="P' + listaPorucenih[i].id + '">' 
			                				   + listaPorucenih[i].naziv + '</a></h2></td>' +
			                				   '<td>' + listaPorucenih[i].cena + ' DIN </td>' +
			                				   '<td>' + listaPorucenih[i].opis + '</td>' + 
			                				   '<td><a id="D' + listaPorucenih[i].id + '" href="" class="btn btn-primary btn-sm">DOSTAVLJEN</a></td></tr>';
				}
				
				$('#dodajUTabeluKorpa').html($(listaPorucenihString));
				
				$('.btn-primary').on("click", function(event){
					event.preventDefault();
					
					let staJe = event.target.id;
					
					if(staJe.substring(0,1) == "D"){
						// KLIKNUO JE NA DOSTAVLJEN
						idDostavljen = staJe.substring(1, staJe.length);
						
						$.ajax({
						 	type: 'PUT',
							url: 'rest/korisnici/dodajUDostavljene',
							data: JSON.stringify({id: idDostavljen}), // Saljem oglas da ga doda u listu omiljenih
							contentType: 'application/json',
							success: function(uspeo) {
								if(uspeo){
										$('#istorija').trigger("click");
								}
							},
							error: function() {
								alert("FAIL");
							}
				     });
						
						$.get({
							url: 'rest/korisnici/listaPorucenih',
							success : function(listaPorucenih){
								brojOglasaUKorpi = listaPorucenih.length;
								$('#brojOglasaUKorpi').html(brojOglasaUKorpi);
							}
						})
					}
				})
				
				$('.linkDoDetaljaKorpa').on("click",function(event){
					event.preventDefault();
					idOglasa = event.target.id;
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
									$('#poruci').hide();
									$('#dodajUListuOmiljenih').hide();
									$('#korisnickoImeProdavca').html(detaljanOglas.korisnickoImeProdavca);

									$('#status').html(detaljanOglas.status);
							}
							
							$.post({
								url: 'rest/korisnici/promeniSlicicuDetalja',
								data: JSON.stringify({id: idOglasa}),
								contentType: 'application/json',
								success : function(parametri){
									if(parametri){
										if(parametri[0] == 1){
											$('#brojListaOmiljenih').attr('class', 'icon-heart');
										}
										else{
											$('#brojListaOmiljenih').attr('class', 'icon-heart-o');
										}
										
										if(parametri[1] == 1){
											$('#brojLajkova').attr('class', 'icon-thumbs-up');
										}
										else{
											$('#brojLajkova').attr('class', 'icon-thumbs-o-up');
										}
										
										if(parametri[2] == 1){
											$('#brojDislajkova').attr('class', 'icon-thumbs-down');
										}
										else{
											$('#brojDislajkova').attr('class', 'icon-thumbs-o-down');
										}
									}
								}
								
							});
							
				
						},
						error: function() {
						
						}
					});
					
				});
			}
		},
		error: function() {
			alert("FAIL");
		}
	});
	
	
})

var idDostavljen;
var idRecenziranogOglasa = " ";
////// LISTA DOSTAVLJENIH ///////////////////////////////////////////////////////////////////

$('#istorija').click(function(event){
	event.preventDefault();
	ponistiPretraguKorisnika();
	resetujPretragu();
	
	$.get({
		url: 'rest/korisnici/listaPorucenih',
		success : function(listaPorucenih){
			brojOglasaUKorpi = listaPorucenih.length;
			$('#brojOglasaUKorpi').html(brojOglasaUKorpi);
		}
	})
	
	$('#dostavljeniDiv').css('visibility', 'visible');
	$('#dostavljeniDiv').css('display','block');
	
	$('#porukeDiv').css('visibility','hidden');
	$('#porukeDiv').css('display', 'none');

	$('#pretragaKorisnikaDiv').css('visibility', 'hidden');
	$('#pretragaKorisnikaDiv').css('display', 'none');
	$('#korpaDiv').css('visibility','hidden');
	$('#korpaDiv').css('display', 'none');
	$('#omiljeniDiv').css('visibility','hidden');
	$('#omiljeniDiv').css('display', 'none');
	$('#pretragaDiv').css('visibility','hidden');
	$('#pretragaDiv').css('display', 'none');
	$('#najpopularnijiOglasiDiv').css('visibility','hidden');
	$('#najpopularnijiOglasiDiv').css('display', 'none');
	
	var listaDostavljenihString = "";
	var listaPrijavljenihString = "";
	var finalni = "";
	
	$.get({
		url: 'rest/korisnici/listaDostavljenih',
		success: function(listaDostavljenih) {
			if(listaDostavljenih){								
				for(i = 0; i < listaDostavljenih.length; i++){
					listaDostavljenihString +=  '<tr><td class="product-thumbnail">' +
		                				   '<img src="' + listaDostavljenih[i].stringSlike + '" alt="" class="img-fluid">' +
		                				   '</td><td class="product-name">' +
		                				   '<h2 class="h5 text-black">' +
		                				   '<a class="linkDoDetaljaIstorija" href="#" data-toggle="modal" data-target="#modalLoginForm" id="I' + listaDostavljenih[i].id + '">' 
		                				   + listaDostavljenih[i].naziv + '</a></h2></td>' +
		                				   '<td>' + listaDostavljenih[i].cena + ' DIN </td>' +
		                				   '<td>' + listaDostavljenih[i].opis + '</td>' + 
		                				   '<td> DOSTAVLJEN </td>' + 
		                				   '<td><a id="R' + listaDostavljenih[i].id + '" href="" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modalRecenzija">DODAJ RECENZIJU</a></td>'
		                				   + '<td><a class="btn btn-primary btn-sm"  id="PO' +  listaDostavljenih[i].id  + '" href=""> <span style="font-size:24px" class="icon icon-warning"> </span></a></td>'
		                				   + '</tr>';
					
				}
				
				$.get({
					url: 'rest/korisnici/listaPrijavljenih',
					success: function(listaPrijavljenih) {
						if(listaPrijavljenih){				
							for(i = 0; i < listaPrijavljenih.length; i++){
								listaPrijavljenihString +=  '<tr><td class="product-thumbnail">' +
					                				   '<img src="' + listaPrijavljenih[i].stringSlike + '" alt="" class="img-fluid">' +
					                				   '</td><td class="product-name">' +
					                				   '<h2 class="h5 text-black">' +
					                				   '<a class="linkDoDetaljaIstorija" href="#" data-toggle="modal" data-target="#modalLoginForm" id="I' + listaPrijavljenih[i].id + '">' 
					                				   + listaPrijavljenih[i].naziv + '</a></h2></td>' +
					                				   '<td>' + listaPrijavljenih[i].cena + ' DIN </td>' +
					                				   '<td>' + listaPrijavljenih[i].opis + '</td>' + 
					                				   '<td> DOSTAVLJEN </td>' + 
					                				   '<td><a id="R' + listaPrijavljenih[i].id + '" href="" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#modalRecenzija">DODAJ RECENZIJU</a></td><td></td></tr>';
							}
							$('#dodajUTabeluDostavljeni').html($(listaPrijavljenihString + listaDostavljenihString));
							
							$('.btn-primary').on("click", function(event){
								event.preventDefault();
								
								let staJe = event.target.id;
								
								if(staJe.substring(0,1) == "R"){
									// KLIKNUO JE NA DODAJ RECENZIJU
									idRecenziranogOglasa = staJe.substring(1, staJe.length);
									$('#naslovRecenzije').val("");
									$('#sadrzajRecenzije').val("");
									$('#slikaRecenzije').prop('src', "");
									$('#tacan').prop('checked', false);
									$('#ispostovan').prop('checked', false);
								}
								else if (staJe.substring(0,2) == "PO"){
									//// PRIJAVI OGLAS
									idPrijavljenogOglasa = staJe.substring(2, staJe.length);
									$.ajax({
										type : 'PUT',
										url : 'rest/korisnici/prijaviOglas',
										data : JSON.stringify({id : idPrijavljenogOglasa}),
										contentType : 'application/json',
										success : function(uspeo){
											if(uspeo){
												alert("Oglas uspešno prijavljen! Korisnik će dobiti upozorenje.");
												$('#istorija').trigger('click');
											}
										}
									})
								}
							})
							
							$('.linkDoDetaljaIstorija').on("click",function(event){
								event.preventDefault();
								idOglasa = event.target.id;
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
												$('#poruci').hide();
												$('#dodajUListuOmiljenih').hide();
												$('#korisnickoImeProdavca').html(detaljanOglas.korisnickoImeProdavca);

												$('#status').html(detaljanOglas.status);
										}
										
										$.post({
											url: 'rest/korisnici/promeniSlicicuDetalja',
											data: JSON.stringify({id: idOglasa}),
											contentType: 'application/json',
											success : function(parametri){
												if(parametri){
													if(parametri[0] == 1){
														$('#brojListaOmiljenih').attr('class', 'icon-heart');
													}
													else{
														$('#brojListaOmiljenih').attr('class', 'icon-heart-o');
													}
													
													if(parametri[1] == 1){
														$('#brojLajkova').attr('class', 'icon-thumbs-up');
													}
													else{
														$('#brojLajkova').attr('class', 'icon-thumbs-o-up');
													}
													
													if(parametri[2] == 1){
														$('#brojDislajkova').attr('class', 'icon-thumbs-down');
													}
													else{
														$('#brojDislajkova').attr('class', 'icon-thumbs-o-down');
													}
												}
											}
											
										});
										
							
									},
									error: function() {
									
									}
								});
								
							});
						}
					},
					error: function() {
						alert("FAIL");
					}
				});
				
				
			}
		},
		error: function() {
			alert("FAIL");
		}
	});
	
})

var srcSlika = "";

/////////////////////////////// RECENZIJE ////////////////////////////////////////////////////////////////

$('#slikaRecenzijeBrowse').change(function(){
	    var input = this;
	    var url = $(this).val();
	    var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
	    if (input.files && input.files[0]&& (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) 
	     {
	        var reader = new FileReader();

	        reader.onload = function (e) {
	           $('#slikaRecenzije').attr('src', e.target.result);
	           
	           srcSlika = e.target.result;
	           
	        }
	       reader.readAsDataURL(input.files[0]);
	    }
	    else
	    {
	      alert("Niste izabrali sliku!");
	      srcSlika = "";
	    }
});

$('#slikaRecenzijeIzmenaBrowse').change(function(){
    var input = this;
    var url = $(this).val();
    var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
    if (input.files && input.files[0]&& (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) 
     {
        var reader = new FileReader();

        reader.onload = function (e) {
           $('#slikaRecenzijeIzmena').attr('src', e.target.result);
           
           srcSlika = e.target.result;
           
        }
       reader.readAsDataURL(input.files[0]);
    }
    else
    {
      alert("Niste izabrali sliku!");
      srcSlika = "";
    }
});

$('#postavi').click(function(event){
	event.preventDefault();
	
	let naslovRecenzije = $('#naslovRecenzije').val();
	let sadrzajRecenzije = $('#sadrzajRecenzije').val();
	
	let tacan = $('#tacan').prop('checked');
	let ispostovan = $('#ispostovan').prop('checked');
	
	if(tacan){
		tacan = "DA";
	}
	else{
		tacan = "NE";
	}
	
	if(ispostovan){
		ispostovan = "DA";
	}
	else{
		ispostovan = "NE";
	}
	
	if(validacijaDodavanjaRecenzije(naslovRecenzije, sadrzajRecenzije)){
	
		$('#zatvoriModalRecenzija').trigger('click');
	
		$.post({
			url: 'rest/recenzije/dodajRecenziju/'+idRecenziranogOglasa,
			data: JSON.stringify({naslovRecenzije : naslovRecenzije, sadrzajRecenzije : sadrzajRecenzije, stringSlike : srcSlika, opisIzOglasaTacan : tacan, ispostovanDogovor : ispostovan}),
			contentType: 'application/json',
			success : function(uspeo){
					if(uspeo){
						alert("Uspešno dodata recenzija!");
						$('#naslovRecenzije').val("");
						$('#sadrzajRecenzije').val("");
						$('#slikaRecenzije').prop('src', "");
						$('#tacan').prop('checked', false);
						$('#ispostovan').prop('checked', false);
						srcSlika = "";
					}
			},
			error : function(){
				alert("Nisam uspeo da dodam recenziju!");
			}
		})
	}
	else{
		alert("Recenzija nije prosla validaciju?");
	}
})

var idIzmenaRecenzije ="";

function ucitajListuRecenzija(){
	
	 $.post({
			url: 'rest/recenzije/listaRecenzija',
			data: JSON.stringify({id: idOglasa}),
			contentType: 'application/json',
			success: function(sveRecenzije) {
				let sveRecenzijeString = "";
				
				for(i = 0;  i < sveRecenzije.length; i++){
					sveRecenzijeString += '<div class="row"><div class="col-md-6">' +
										  '<img onerror="this.style.display=\'none\'" alt="Image" class="img-fluid" src="' + sveRecenzije[i].stringSlike  + '"></div>' +
										  '<div class="col-md-6">' +
										  '<h2 class="text-black">' + sveRecenzije[i].naslovRecenzije + '</h2>' +
										  '<p>' + sveRecenzije[i].sadrzajRecenzije  + '</p>' +
										  '<p> Opis iz oglasa tačan : ' + sveRecenzije[i].opisIzOglasaTacan +  '</p>' +
										  '<p> Ispoštovan dogovor : ' + sveRecenzije[i].ispostovanDogovor +   '</p>' +
										  '<p class="korIme"> Recenzent : ' + sveRecenzije[i].korisnickoImeRecenzenta + '</p>';
										  if (ulogovanKorisnikIme === sveRecenzije[i].korisnickoImeRecenzenta){
											  sveRecenzijeString += '<p><span><a id="IR' + sveRecenzije[i].id  + '" href="" data-toggle="modal" data-target="#modalIzmenaRecenzije" class="buy-now btn btn-sm btn-primary" style="color:white">Izmeni</a>' +
											  						'&nbsp;' +
											  						'<a id="OR' + sveRecenzije[i].id  + '" href="" class="buy-now btn btn-sm btn-primary" style="color:white">Obriši</a></span></p>';
										  
										  }
										  sveRecenzijeString += '</div>' + 
											  					'</div><p><br></p>';
										  
				}
				
				$('#mestoZaRecenzije').html($(sveRecenzijeString));
				
				$('.btn-primary').on("click", function(event){
					event.preventDefault();
					
					let staJe = event.target.id;
					
					if(staJe.substring(0,2) == "IR"){
						// KLIKNUO JE NA IZMENI RECENZIJE
						
						$('#modalLoginForm').trigger('click');
						
						idIzmenaRecenzije = staJe.substring(2, staJe.length);
						
						 $.get({
								url: 'rest/recenzije/podaciRecenzije/'+idOglasa+'/'+idIzmenaRecenzije,
								success: function(recenzija) {
									if(recenzija){
										$('#naslovRecenzijeIzmena').val(recenzija.naslovRecenzije);
										$('#sadrzajRecenzijeIzmena').val(recenzija.sadrzajRecenzije);
										$('#slikaRecenzijeIzmena').prop('src', recenzija.stringSlike);
										$('#tacanIzmena').prop('checked', recenzija.opisIzOglasaTacan === "DA");
										$('#ispostovanIzmena').val('checked', recenzija.ispostovanDogovor === "DA");
									}
							},
							error: function() {
								alert("NISAM USPEO DA POKUPIM PODATKE O REC");
							}
						});
					}
					else if(staJe.substring(0,2) == "OR"){
						let idObrisiRecenziju = staJe.substring(2, staJe.length);
						
						 $.ajax({
							 	type: 'DELETE',
								url: 'rest/recenzije/obrisiRecenziju/'+idOglasa+'/'+idObrisiRecenziju,
								dataType:"JSON",
								success: function(uspeo) {
									if(uspeo){
										alert("Uspešno obrisana recenzija!");
										ucitajListuRecenzija();
									}
								},
								error: function(){
									alert("NISAM OBRISAO");
								}

						 })
					}
				});
				
			},
			error:function(){
				alert("FAIL kod ucitavanja liste recenzija");
			}
	 });
}

$('#izmeni').click(function(){
	event.preventDefault();
	let naslovRecenzije = $('#naslovRecenzijeIzmena').val();
	let sadrzajRecenzije = $('#sadrzajRecenzijeIzmena').val();
	let srcSlika = $('#slikaRecenzijeIzmena').prop('src');
	
	let tacan = $('#tacanIzmena').prop('checked');
	let ispostovan = $('#ispostovanIzmena').val('checked');
	
	if(tacan){
		tacan = "DA";
	}
	else{
		tacan = "NE";
	}
	
	if(ispostovan){
		ispostovan = "DA";
	}
	else{
		ispostovan = "NE";
	}
	
	if(validacijaRecenzijeIzmena(naslovRecenzije, sadrzajRecenzije)){
	
		$.ajax({
			type: 'PUT',
			url: 'rest/recenzije/izmeniRecenziju/' + idOglasa + '/' + idIzmenaRecenzije,
			data: JSON.stringify({naslovRecenzije : naslovRecenzije, sadrzajRecenzije : sadrzajRecenzije, stringSlike : srcSlika, opisIzOglasaTacan : tacan, ispostovanDogovor : ispostovan}), // Saljem oglas da ga doda u listu omiljenih
			contentType: 'application/json',
			success: function(uspeo) {
				if(uspeo){
					alert("Recenzija uspešno izmenjena!");
					$('#modalZatvoriIzmenu').trigger('click');
				}
			},
			error: function() {
				alert("FAIL izmena recenzije");
			}
			
		});
	}
	
})

//// LISTA KORISNIKA ///////////////////////////////////////////////

$('#pretragaKorisnika').click(function(event){
	event.preventDefault();
	
	$('#pretragaKorisnikaDiv').css('visibility', 'visible');
	$('#pretragaKorisnikaDiv').css('display', 'block');
	
	$('#porukeDiv').css('visibility','hidden');
	$('#porukeDiv').css('display', 'none');
	
	$('#dostavljeniDiv').css('visibility', 'hidden');
	$('#dostavljeniDiv').css('display', 'none');
	$('#korpaDiv').css('visibility', 'hidden');
	$('#korpaDiv').css('display', 'none');
	$('#omiljeniDiv').css('visibility', 'hidden');
	$('#omiljeniDiv').css('display', 'none');
	$('#pretragaDiv').css('visibility', 'hidden');
	$('#pretragaDiv').css('display', 'none');
	$('#najpopularnijiOglasiDiv').css('visibility', 'hidden');
	$('#najpopularnijiOglasiDiv').css('display', 'none');
	
	$.get({
		url: 'rest/korisnici/listaKorisnika',
		success : function(listaKorisnika){
			if(listaKorisnika){
				let korisniciString = "";
				
				for(i = 0; i < listaKorisnika.length; i++){
					korisniciString += '<tr><td class="product-name">' +
 				   						'<h2 class="h5 text-black"><a class="linkDoDetaljaKorisnik" href="#" data-toggle="modal" data-target="#modalKorisnik" id="KD' + listaKorisnika[i].korisnickoIme + '">' + listaKorisnika[i].korisnickoIme + '</a></h2></td>' +
 				   						'<td>' + listaKorisnika[i].grad + '</td>' +
 				   						'<td>' + listaKorisnika[i].uloga + '</td>';
					korisniciString += '</tr>';
				}
					
					$('#dodajUTabeluListaKorisnika').html($(korisniciString));
					
					/// OVDE DODATI KLIK NA LINK DO DETALJA O KORISNIKU
					$('.linkDoDetaljaKorisnik').on("click",function(event){
						event.preventDefault();
						korIme = event.target.id;
						korIme = korIme.substring(2, korIme.length);
											
					    $.ajax({
					    	type : 'PUT',
							url: 'rest/korisnici/detaljiKorisnika',
							data: JSON.stringify({korisnickoIme: korIme}),
							contentType: 'application/json',
							success: function(korisnik) {
								if(korisnik != null){
										$('#korisnickoIme').html(korisnik.korisnickoIme);
										$('#imePrezime').html($(korisnik.ime + ' ' + korisnik.prezime));
										$('#gradKorisnik').html(korisnik.grad);
										$('#uloga').html(korisnik.uloga);
										$('#emailAdresa').html(korisnik.emailAdresa);
										$('#kontaktTelefon').html(korisnik.kontaktTelefon);
										$('#datumRegistracije').html(korisnik.datumRegistracije);
										
										if(korisnik.uloga != "PRODAVAC"){
											$('#kreirajPoruku').hide();
										}
										else{
											$('#kreirajPoruku').show();
										}
										$('#izmeniPoruku').hide();
										$('#odgovoriNaPoruku').hide();
										$('#posaljiPoruku').show();
								}
							},
							error: function() {
								alert("nisam uspeo");
							}
						});
						
					});
			}
		}
	})
	
})

/////////////////// PRETRAGA KORISNIKA ////////////////////////////
$('#pretraziListuKorisnika').click(function(event){
	event.preventDefault();
	
	let korisnickoIme = $('#korisnickoImePretraga').val();
	let grad = $('#izabraniGradKorisnik').html();
	
	$.ajax({
		type : 'PUT',
		url : 'rest/korisnici/pretragaKorisnika',
		data : JSON.stringify({korisnickoIme : korisnickoIme, grad : grad}),
		contentType : 'application/json',
		success : function(listaKorisnika){
			if(listaKorisnika){
				let korisniciString = "";
				
				for(i = 0; i < listaKorisnika.length; i++){
					korisniciString += '<tr><td class="product-name">' +
 				   						'<h2 class="h5 text-black"><a class="linkDoDetaljaKorisnik" href="#" data-toggle="modal" data-target="#modalKorisnik" id="KD' + listaKorisnika[i].korisnickoIme + '">' + listaKorisnika[i].korisnickoIme + '</a></h2></td>' +
 				   						'<td>' + listaKorisnika[i].grad + '</td>' +
 				   						'<td>' + listaKorisnika[i].uloga + '</td>';
					korisniciString += '</tr>';
				}
					
					$('#dodajUTabeluListaKorisnika').html($(korisniciString));
					
					/// OVDE DODATI KLIK NA LINK DO DETALJA O KORISNIKU
					$('.linkDoDetaljaKorisnik').on("click",function(event){
						event.preventDefault();
						korIme = event.target.id;
						korIme = korIme.substring(2, korIme.length);
											
					    $.ajax({
					    	type : 'PUT',
							url: 'rest/korisnici/detaljiKorisnika',
							data: JSON.stringify({korisnickoIme: korIme}),
							contentType: 'application/json',
							success: function(korisnik) {
								if(korisnik != null){
										$('#korisnickoIme').html(korisnik.korisnickoIme);
										$('#imePrezime').html($(korisnik.ime + ' ' + korisnik.prezime));
										$('#gradKorisnik').html(korisnik.grad);
										$('#uloga').html(korisnik.uloga);
										$('#emailAdresa').html(korisnik.emailAdresa);
										$('#kontaktTelefon').html(korisnik.kontaktTelefon);
										$('#datumRegistracije').html(korisnik.datumRegistracije);
								
										if(korisnik.uloga != "PRODAVAC"){
											$('#kreirajPoruku').hide();
										}
										else{
											$('#kreirajPoruku').show();
										}
										
										$('#izmeniPoruku').hide();
										$('#odgovoriNaPoruku').hide();
										$('#posaljiPoruku').show();
								}
							},
							error: function() {
								alert("nisam uspeo");
							}
						});
						
					});
			}
		}
	})
})

$('#listaGradovaKorisnik').on("click", "a", function(event){
	 event.preventDefault();
	 
	 let imeGradaString = "";
	 
	 var $this = $(this).parent();
	 $this.addClass("select").siblings().removeClass("select");
	 imeGradaString += $this.data("value");
	 
	 $('#izabraniGradKorisnik').html(imeGradaString);
})


$('#ponistiListuKorisnika').click(function(event){
	event.preventDefault();

	$('#korisnickoImePretraga').val("");
	$('#izabraniGradKorisnik').html("Svi gradovi");
	
	$('#pretraziListuKorisnika').trigger('click');
	
	
})

/// PONISTI PRETRAGU KORISNIKA
function ponistiPretraguKorisnika(){
	$('#ponistiListuKorisnika').trigger('click');
}

////////////////////////////////////////

function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

function validacijaRecenzijeIzmena(naslovRecenzije, sadrzajRecenzije){
	
	let lose = 0;
	
	if(isEmptyOrSpaces(naslovRecenzije)){
		$('#naslovRecenzijeIzmena').css('border-color','red');
		lose++;
	}
	else{
		$('#naslovRecenzijeIzmena').css('border-color','#CED4DA');
	}
	
	if(isEmptyOrSpaces(sadrzajRecenzije)){
		$('#sadrzajRecenzijeIzmena').css('border-color','red');
		lose++;
	}else{
		$('#sadrzajRecenzijeIzmena').css('border-color','#CED4DA');
	}
	
	if(lose > 0){
		return false;
	}
	else{
		return true;
	}
}

function validacijaDodavanjaRecenzije(naslovRecenzije, sadrzajRecenzije){
	let lose = 0;
	
	if(isEmptyOrSpaces(naslovRecenzije)){
		$('#naslovRecenzije').css('border-color','red');
		lose++;
	}
	else{
		$('#naslovRecenzije').css('border-color','#CED4DA');
	}
	
	if(isEmptyOrSpaces(sadrzajRecenzije)){
		$('#sadrzajRecenzije').css('border-color','red');
		lose++;
	}else{
		$('#sadrzajRecenzije').css('border-color','#CED4DA');
	}
	
	if(lose > 0){
		return false;
	}
	else{
		return true;
	}
}

////////////////////////////////////////////////////////////////////////////////////
$('#profil').click(function(event){
	event.preventDefault();
	 $.ajax({
	    	type : 'PUT',
			url: 'rest/korisnici/detaljiKorisnika',
			data: JSON.stringify({korisnickoIme: ulogovanKorisnikIme}),
			contentType: 'application/json',
			success: function(korisnik) {
				if(korisnik != null){
						$('#korisnickoIme').html(korisnik.korisnickoIme);
						$('#imePrezime').html($(korisnik.ime + ' ' + korisnik.prezime));
						$('#gradKorisnik').html(korisnik.grad);
						$('#uloga').html(korisnik.uloga);
						$('#emailAdresa').html(korisnik.emailAdresa);
						$('#kontaktTelefon').html(korisnik.kontaktTelefon);
						$('#datumRegistracije').html(korisnik.datumRegistracije);
						
						$('#kreirajPoruku').hide();
						$('#skiniPrijavu').hide();
				}
			},
			error: function() {
				alert("nisam uspeo");
			}
	 });
		
})
var idOdgovora;
//////////////////// PORUKE ///////////////////////////////////
$('#inbox').click(function(event){
	event.preventDefault();
	
	$('#porukeDiv').css('visibility','visible');
	$('#porukeDiv').css('display', 'block');
	
	
	$('#pretragaDiv').css('visibility','hidden');
	$('#pretragaDiv').css('display', 'none');
	$('#pretragaKorisnikaDiv').css('visibility', 'hidden');
	$('#pretragaKorisnikaDiv').css('display', 'none');
	$('#dostavljeniDiv').css('visibility','hidden');
	$('#dostavljeniDiv').css('display', 'none');
	$('#korpaDiv').css('visibility','hidden');
	$('#korpaDiv').css('display', 'none');
	$('#omiljeniDiv').css('visibility','hidden');
	$('#omiljeniDiv').css('display', 'none');
	$('#najpopularnijiOglasiDiv').css('visibility','hidden');
	$('#najpopularnijiOglasiDiv').css('display', 'none');
	
	$.get({
		url:'rest/korisnici/listaPoruka',
		success : function(listaPoruka){
			if(listaPoruka){
				let listaPorukaString = "";
				
				for(i = 0; i < listaPoruka.length; i++){
					listaPorukaString += '<tr><td class="product-name">' +
									    '<h2 class="h5 text-black">' + listaPoruka[i].posiljalac + '</a></h2></td>' +
										'<td>' + listaPoruka[i].naslovPoruke + '</td>' +
										'<td>' + listaPoruka[i].sadrzajPoruke + '</td>' +
										'<td>' + listaPoruka[i].datumVremePoruke + '</td>';
										if(listaPoruka[i].mozeDaOdgovori){
											listaPorukaString +=   '<td><a id="OP' + listaPoruka[i].posiljalac + '" data-toggle="modal" data-target="#modalPosaljiPoruku" href="" class="buy-now btn btn-sm btn-primary" style="color:white">ODGOVORI</a></td>';
										}
										else{
											listaPorukaString +=   '<td></td>';
										}
										
										if(listaPoruka[i].posiljalac === "JA"){
											listaPorukaString +=   '<td><p><a id="IZ' + listaPoruka[i].id + '" data-toggle="modal" data-target="#modalPosaljiPoruku" href="" class="buy-now btn btn-sm btn-primary" style="color:white">IZMENI</a></p>';
											listaPorukaString +=   '<p><a id="OB' + listaPoruka[i].id + '"  href="" class="buy-now btn btn-sm btn-primary" style="color:white">OBRIŠI</a></p></td>';
										}
										else{
											listaPorukaString +=   '<td><a id="OB' + listaPoruka[i].id + '" href="" class="buy-now btn btn-sm btn-primary" style="color:white">OBRIŠI</a></td>';
										}
					
										listaPorukaString += '</tr>';
				}
					
					$('#dodajUTabeluPoruke').html($(listaPorukaString));
					$('.btn-primary').on("click", function(event){
						event.preventDefault();
						idOdgovora = event.target.id;
						 if(idOdgovora.substring(0,2) == "OP"){
							 idOdgovora = idOdgovora.substring(2, idOdgovora.length);
							 $('#posaljiPoruku').hide();
							 $('#izmeniPoruku').hide();
							 $('#odgovoriNaPoruku').show();
						 }
						 else if(idOdgovora.substring(0,2) == "IZ"){
							 idOdgovora = idOdgovora.substring(2, idOdgovora.length);
							 $('#posaljiPoruku').hide();
							 $('#izmeniPoruku').show();
							 $('#odgovoriNaPoruku').hide();
							 
							 $.get({
								 url:'rest/korisnici/detaljiPoruke/'+idOdgovora,
								 success: function(poruka){
									 if(poruka){
										 $('#naslovPorukePosalji').val(poruka.naslovPoruke);
										 $('#sadrzajPorukePosalji').val(poruka.sadrzajPoruke);
									 }
								 }
							 })
						 }
						 else if(idOdgovora.substring(0,2) == "OB"){
							 idOdgovora = idOdgovora.substring(2, idOdgovora.length);
							 
							 $.ajax({
								 	type: 'DELETE',
									url:'rest/korisnici/obrisiPoruku',
									data: JSON.stringify({id : idOdgovora}),
									contentType: 'application/json',
									success: function(uspeo){
										if(uspeo){
											alert("Poruka uspešno obrisana!");
											$('#inbox').trigger('click');
											$.get({
												url:'rest/korisnici/listaPoruka',
												success : function(listaPoruka){
													$('#brojPoruka').html(listaPoruka.length);
												}
											})
										}
									},
									error: function(){
										alert("FAIL");
									}
							 })
						 }
					})
			}
		}
	})
})

$('#posaljiPoruku').click(function(event){
	event.preventDefault();
	
	let naslovPoruke = $('#naslovPorukePosalji').val();
	let sadrzajPoruke = $('#sadrzajPorukePosalji').val();
	
	if(validacijaPoruke(naslovPoruke, sadrzajPoruke)){
		$.post({
			url: 'rest/korisnici/posaljiPoruku',
			data : JSON.stringify({id : korIme, naslovPoruke : naslovPoruke, sadrzajPoruke : sadrzajPoruke}),
			contentType : 'application/json',
			success : function(poslato){
				if(poslato){
					alert("Poruka uspešno poslata!");
					$('#zatvoriModalPosaljiPoruku').trigger('click');
					$('#naslovPorukePosalji').val("");
					$('#sadrzajPorukePosalji').val("");
					
					$.get({
						url:'rest/korisnici/listaPoruka',
						success : function(listaPoruka){
							$('#brojPoruka').html(listaPoruka.length);
						}
					})
					
				}
			},
			error : function(){
				alert("Nije uspelo slanje poruke!");
			}
		})
	}
	
})

$('#odgovoriNaPoruku').click(function(event){
	event.preventDefault();
	
	let naslovPoruke = $('#naslovPorukePosalji').val();
	let sadrzajPoruke = $('#sadrzajPorukePosalji').val();
	
	if(validacijaPoruke(naslovPoruke, sadrzajPoruke)){
		$.post({
			url: 'rest/korisnici/odgovoriNaPoruku',
			data : JSON.stringify({id : idOdgovora, naslovPoruke : naslovPoruke, sadrzajPoruke : sadrzajPoruke}),
			contentType : 'application/json',
			success : function(poslato){
				if(poslato){
					alert("Odgovor na poruku uspešno poslat!");
					$('#zatvoriModalPosaljiPoruku').trigger('click');
					$('#naslovPorukePosalji').val("");
					$('#sadrzajPorukePosalji').val("");
					$('#inbox').trigger('click');
					
					$.get({
						url:'rest/korisnici/listaPoruka',
						success : function(listaPoruka){
							$('#brojPoruka').html(listaPoruka.length);
						}
					})
	
				}
			},
			error : function(){
				alert("Nije uspelo slanje poruke!");
			}
		})
	}
	
})

$('#izmeniPoruku').click(function(event){
	event.preventDefault();
	
	let naslovPoruke = $('#naslovPorukePosalji').val();
	let sadrzajPoruke = $('#sadrzajPorukePosalji').val();
	
	if(validacijaPoruke(naslovPoruke, sadrzajPoruke)){
		 $.ajax({
			 	type: 'PUT',
				url:'rest/korisnici/izmeniPoruku',
				data: JSON.stringify({id : idOdgovora, naslovPoruke : naslovPoruke, sadrzajPoruke : sadrzajPoruke}),
				contentType: 'application/json',
				success: function(uspeo){
					if(uspeo){
						alert("Poruka uspešno izmenjena!");
						$('#zatvoriModalPosaljiPoruku').trigger('click');
						$('#naslovPorukePosalji').val("");
						$('#sadrzajPorukePosalji').val("");
						$('#inbox').trigger('click');
						
					}
				},
				error: function(){
					alert("FAIL");
				}
		 })
	}
})

function validacijaPoruke(naslov, sadrzaj){
	let tacnost = 0;
	
	if(!naslov || isEmptyOrSpaces(naslov)){
		$('#naslovPorukePosalji').css('border-color', 'red');
		tacnost++;
	}
	else{
		$('#naslovPorukePosalji').css('border-color', '#CED4DA');	
	}
	
	if(!sadrzaj || isEmptyOrSpaces(sadrzaj)){
		$('#sadrzajPorukePosalji').css('border-color', 'red');
		tacnost++;
	}
	else{
		$('#sadrzajPorukePosalji').css('border-color', '#CED4DA');	
	}
	
	if(tacnost > 0){
		return false;
	}
	else{
		return true;
	}
}