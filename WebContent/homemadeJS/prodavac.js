///////////////////////////// SVE VEZANO ZA KATEGORIJE I PRETRAGU ///////////////////////////////////////////////////

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
var ulogovanKorisnikIme = " ";
var ulogovanKorisnikPrijave = 0;

$(document).ready(function(){
	
	$.get({
		url: 'rest/ulogovanKorisnik',
		success : function(ulogovanKorisnik){
			ulogovanKorisnikIme = ulogovanKorisnik.korisnickoIme;
			ulogovanKorisnikPrijave = ulogovanKorisnik.upozorenja;
			$('#imeKorisnika').html(ulogovanKorisnik.korisnickoIme);
		}
	})
	
	$.get({
					url:'rest/korisnici/listaPoruka',
					success : function(listaPoruka){
						$('#brojPoruka').html(listaPoruka.length);
					}
	})
	
	updateLajkDislajk();
	
	imeKategorije = "Najpopularniji oglasi"; // OVDE SETUJEM JER NA POCETNOJ TOP10 MORA ZNATI VREDNOST PARAMETRA
	ucitajTop10();
	
	$('.izabranaKategorija').html("Ostalo");
	
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
////////////////////// LISTA KATEGORIJA KOD DODAVANJA OGLASA /////////////////
$(".sveKategorije").hover( function(event){
		event.preventDefault();
		
		$.get({
			url: 'rest/kategorije/sveKategorije',
			success : function(sveK){
				if(sveK != null){
					let sveKategorijeString = "";
					for(i = 0; i < sveK.length; i++){
						sveKategorijeString += '<li data-value="' + sveK[i].naziv + 
									  '" ><a class="dropdown-item" href="">' + sveK[i].naziv + '</a></li>';
					}
					$('.listaKategorijaIzbor').html($(sveKategorijeString));
				}
			}
			
		});
})

$('.listaKategorijaIzbor').on("click", "a", function(event){
	 event.preventDefault();
	 
	 let imeKategorijeString = "";
	 
	 var $this = $(this).parent();
	 $this.addClass("select").siblings().removeClass("select");
	 imeKategorijeString += $this.data("value");
	 
	 $('.izabranaKategorija').html(imeKategorijeString);
})

/////////////////////////////////////////////////////////////////////////

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
								$('#status').html(detaljanOglas.status);
								$('#korisnickoImeProdavca').html(detaljanOglas.korisnickoImeProdavca);
								
								ucitajListuRecenzija();
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
	
	ponistiFiltraciju();
	
	resetujPretragu();
	
	$('#pretragaDiv').css('visibility','visible');
	$('#pretragaDiv').css('display', 'block');
	
	$('#porukeDiv').css('visibility','hidden');
	$('#porukeDiv').css('display', 'none');
	
	$('#najpopularnijiOglasiDiv').css('visibility','hidden');
	$('#najpopularnijiOglasiDiv').css('display', 'none');
	$('#pretragaKorisnikaDiv').css('visibility', 'hidden');
	$('#pretragaKorisnikaDiv').css('display', 'none');
	$('#listaMojihOglasaDiv').css('visibility', 'hidden');
	$('#listaMojihOglasaDiv').css('display', 'none');
	$('#listaRecenzijaDiv').css('visibility', 'hidden');
	$('#listaRecenzijaDiv').css('display', 'none');
	
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
			        			 '<h3><a class="linkDoDetaljaLista" href="#" data-toggle="modal" data-target="#modalLoginForm" id="L' + listaOglasaZaKategoriju[i].id + '" > ' + listaOglasaZaKategoriju[i].naziv + '</a></h3>' +
			        			 '<p class="mb-0">' + listaOglasaZaKategoriju[i].opis + '</p>' +
			        			 '<p class="text-primary font-weight-bold">' + listaOglasaZaKategoriju[i].cena + ' DIN </p>' +
		        				 '</div></div></div> ';
	}
	$('#mestoZaOglase').html($(listaOglasaString));
	
	$('.linkDoDetaljaLista').on("click",function(event){
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
						$('#status').html(detaljanOglas.status);
						$('#korisnickoImeProdavca').html(detaljanOglas.korisnickoImeProdavca);
				}
				
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

function ucitajListuRecenzija(){
	
	 $.post({
			url: 'rest/recenzije/listaRecenzija',
			data: JSON.stringify({id: idOglasa}),
			contentType: 'application/json',
			success: function(sveRecenzije) {
				let sveRecenzijeString = "";
				
				for(i = 0;  i < sveRecenzije.length; i++){
					sveRecenzijeString += '<div class="row"><div class="col-md-6">' +
										  '<img alt="Image" class="img-fluid" src="' + sveRecenzije[i].stringSlike  + '"></div>' +
										  '<div class="col-md-6">' +
										  '<h2 class="text-black">' + sveRecenzije[i].naslovRecenzije + '</h2>' +
										  '<p>' + sveRecenzije[i].sadrzajRecenzije  + '</p>' +
										  '<p> Opis iz oglasa tačan : ' + sveRecenzije[i].opisIzOglasaTacan +  '</p>' +
										  '<p> Ispoštovan dogovor : ' + sveRecenzije[i].ispostovanDogovor +   '</p>' +
										  '<p class="korIme"> Recenzent : ' + sveRecenzije[i].korisnickoImeRecenzenta + '</p>';
										  sveRecenzijeString += '</div>' + 
											  					'</div><p><br></p>';
										  
				}
				
				$('#mestoZaRecenzije').html($(sveRecenzijeString));
				
			},
			error:function(){
				alert("FAIL kod ucitavanja liste recenzija");
			}
	 });
}

////// SVE OSTALO ZA PRODAVCA ///////////////////////////////
///// SETOVANJE BROJA LAJKOVA I DISLAJKOVA NALOGA ////////
function updateLajkDislajk(){
	
	$.get({
		url:'rest/korisnici/sviLajkoviDislajkovi',
		success: function(lajkdislajk){
			$('#brojLajkovaNaloga').html(lajkdislajk[0]);
			$('#brojDislajkovaNaloga').html(lajkdislajk[1]);
		},
		error: function(){
			alert("nisam uspeo da uzmem sve lajkove i dislajkove prodavca");
		}
		
	});
	
	
}
///// LISTA RECENZIJA ////////////////////////////////////
$('#listaRecenzija').click(function(event){
	event.preventDefault();
	
	ponistiFiltraciju();
	
	$('#listaRecenzijaDiv').css('visibility', 'visible');
	$('#listaRecenzijaDiv').css('display', 'block');
	
	$('#porukeDiv').css('visibility','hidden');
	$('#porukeDiv').css('display', 'none');
	$('#pretragaKorisnikaDiv').css('visibility', 'hidden');
	$('#pretragaKorisnikaDiv').css('display', 'none');
	$('#listaMojihOglasaDiv').css('visibility', 'hidden');
	$('#listaMojihOglasaDiv').css('display', 'none');
	$('#pretragaDiv').css('visibility', 'hidden');
	$('#pretragaDiv').css('display', 'none');
	$('#najpopularnijiOglasiDiv').css('visibility', 'hidden');
	$('#najpopularnijiOglasiDiv').css('display', 'none');
	
	$.get({
		url : 'rest/korisnici/getProdavacListaRecenzija',
		success : function(listaRecenzija){
			if(listaRecenzija){
				let listaRecenzijaString = "";
				
				for(i = 0; i < listaRecenzija.length; i++){
					listaRecenzijaString +=  '<tr><td class="product-thumbnail">' +
		                				   '<img src="' + listaRecenzija[i].stringSlike + '" alt="" class="img-fluid">' +
		                				   '</td><td class="product-name">' +
		                				   '<h2 class="h5 text-black">' + listaRecenzija[i].naslovRecenzije + '</h2></td>' +
		                				   '<td>' + listaRecenzija[i].sadrzajRecenzije + '</td>' +
		                				   '<td>' + listaRecenzija[i].opisIzOglasaTacan + '</td>' + 
		                				   '<td>' + listaRecenzija[i].ispostovanDogovor + '</td>' +
		                				   '<td>' + listaRecenzija[i].nazivOglasa + '</td>' +
		                				   '<td>' +  listaRecenzija[i].korisnickoImeRecenzenta  + '</td></tr>';

				}
				
				$('#dodajUTabeluListaRecenzija').html($(listaRecenzijaString));
				
				
			}
		},
		error : function(){
			alert("Nisam uspeo da preuzmem listu recenzija prodavca");
		}
	})
	
})

var idOglasaZaIzmenu = "";
///// LISTA MOJIH OGLASA /////////////////////////////////
$('#listaMojihOglasa').click(function(event){
	event.preventDefault();
	$('#listaMojihOglasaDiv').css('visibility', 'visible');
	$('#listaMojihOglasaDiv').css('display', 'block');
	
	$('#porukeDiv').css('visibility','hidden');
	$('#porukeDiv').css('display', 'none');
	
	$('#pretragaKorisnikaDiv').css('visibility', 'hidden');
	$('#pretragaKorisnikaDiv').css('display', 'none');
	$('#listaRecenzijaDiv').css('visibility', 'hidden');
	$('#listaRecenzijaDiv').css('display', 'none');
	$('#pretragaDiv').css('visibility', 'hidden');
	$('#pretragaDiv').css('display', 'none');
	$('#najpopularnijiOglasiDiv').css('visibility', 'hidden');
	$('#najpopularnijiOglasiDiv').css('display', 'none');
	
	$.get({
		url : 'rest/korisnici/listaMojihOglasa',
		success : function(mojiOglasi){
			if(mojiOglasi){
				let mojiOglasiString = "";
				
				for(i = 0; i < mojiOglasi.length; i++){
					mojiOglasiString +=  '<tr><td class="product-thumbnail">' +
		                				   '<img src="' + mojiOglasi[i].stringSlike + '" alt="" class="img-fluid">' +
		                				   '</td><td class="product-name">' +
		                				   '<h2 class="h5 text-black"><a class="linkDoDetaljaMoji" href="#" data-toggle="modal" data-target="#modalLoginForm" id="DDO' + mojiOglasi[i].id + '">' + mojiOglasi[i].naziv + '</a></h2></td>' +
		                				   '<td>' + mojiOglasi[i].cena + '</td>' +
		                				   '<td>' + mojiOglasi[i].opis + '</td>' + 
		                				   '<td>' + mojiOglasi[i].status + '</td>';
					if(mojiOglasi[i].status === "AKTIVAN"){
						mojiOglasiString +=   '<td><p><a id="IO' + mojiOglasi[i].id + '" href="" data-toggle="modal" data-target="#modalIzmeniOglas" class="buy-now btn btn-sm btn-primary" style="color:white">Izmeni</a></p> ' +
     				   						   '<p><a id="OO' + mojiOglasi[i].id + '" href="" class="buy-now btn btn-sm btn-primary" style="color:white">Obriši</a></p> </td>';
					}
					else{
						mojiOglasiString += '<td></td>'
					}
					
					mojiOglasiString += '</tr>';
		                				 
				}
				
				$('#dodajUTabeluListaMojihOglasa').html($(mojiOglasiString));
/////////////////////////////////////////////////////////////////////////
///////// IZMENA I BRISANJE OGLASA //////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
				// IZMENA I BRISANJE OGLASA !
				$('.btn-primary').on("click", function(event){
					event.preventDefault();
					
					let staJe = event.target.id;
					
					if(staJe.substring(0,2) == "IO"){
						// KLIKNUO JE NA IZMENI OGLAS
						idOglasaZaIzmenu = staJe.substring(2, staJe.length);
						
						$.post({
							url:'rest/oglasi/detaljiOglasa',
							data : JSON.stringify({id : idOglasaZaIzmenu}),
							contentType : 'application/json',
							success: function(oglas){
								if(oglas){
									$('#nazivOglasaIzmeni').val(oglas.naziv);
									$('#cenaOglasaIzmeni').val(oglas.cena);
									$('#opisOglasaIzmeni').val(oglas.opis);
									
									let datum = oglas.datumIsticanja.split('/');
									let dan = datum[0];
									let mesec = datum[1];
									let godina = datum[2];
									
									$('#danIzmeni').val(dan);
									$('#mesecIzmeni').val(mesec);
									$('#godinaIzmeni').val(godina);
									$('.izabranaKategorija').html(oglas.imeKategorije);
									$('#slikaOglasaIzmeni').prop('src', oglas.stringSlike);
									
									srcSlikaIzmeni = oglas.stringSlike;
								}
							}
						})
						
						
						
						
					}
					else if (staJe.substring(0,2) == "OO"){
						// KLIKNUO JE NA OBRIŠI OGLAS
						idOglasaZaBrisanje = staJe.substring(2, staJe.length);
						
						$.ajax({
						 	type: 'DELETE',
							url: 'rest/korisnici/obrisiOglas',
							data: JSON.stringify({id: idOglasaZaBrisanje}),
							contentType: 'application/json',
							success: function(uspeo) {
								if(uspeo){
									alert("Oglas uspešno obrisan!");
									$('#listaMojihOglasa').trigger('click');
								}
								else{
									alert("Možete obrisati samo aktivne oglase!");
								}
							},
							error: function(){
								alert("NISAM OBRISAO");
							}

					 })
					}
				})
				
				$('.linkDoDetaljaMoji').on("click",function(event){
					event.preventDefault();
					idOglasa = event.target.id;
					idOglasa = idOglasa.substring(3, idOglasa.length);
										
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
									
									ucitajListuRecenzija();
							}
						},
						error: function() {
						
						}
					});
					
				});
				
			}
		}
	})
})

/// SETOVANJE SLIKE KOD DODAVANJA

var srcSlika = "";

$('#slikaOglasaBrowse').change(function(event){
		event.preventDefault();
	    var input = this;
	    var url = $(this).val();
	    var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
	    if (input.files && input.files[0]&& (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) 
	     {
	        var reader = new FileReader();

	        reader.onload = function (e) {
	           $('#slikaOglasaDodata').attr('src', e.target.result);
    
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

var srcSlikaIzmeni = "";

$('#slikaOglasaIzmeniBrowse').change(function(event){
		event.preventDefault();
	    var input = this;
	    var url = $(this).val();
	    var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
	    if (input.files && input.files[0]&& (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) 
	     {
	        var reader = new FileReader();

	        reader.onload = function (e) {
	           $('#slikaOglasaIzmeni').attr('src', e.target.result);
    
	           srcSlikaIzmeni = e.target.result;
	           
	        }
	       reader.readAsDataURL(input.files[0]);
	    }
	    else
	    {
	      alert("Niste izabrali sliku!");
	      srcSlikaIzmeni = "";
	    }
});

///////////// DODAVANJE OGLASA /////////////////////////

$('#dodajOglas').click(function(event){
	event.preventDefault();
	
	let nazivOglasa = $('#nazivOglasaDodaj').val();
	let cenaOglasa = parseInt($('#cenaOglasaDodaj').val());
	let opisOglasa = $('#opisOglasaDodaj').val();
	let slikaOglasa = srcSlika;
	let dan = $('#dan').val();
	let mesec = $('#mesec').val() ;
	let godina = $('#godina').val() ;
	
	let imeKategorije = $('.izabranaKategorija').html();
	
	if(isEmptyOrSpaces($('#dan').val())){
		dan = "32";
	}
	
	if(isEmptyOrSpaces($('#mesec').val())){
		mesec = "13"
	}
	
	if(isEmptyOrSpaces($('#godina').val())){
		godina = "2018";
	}
	
	let datumIsticanja = dan + '/' + mesec + '/' + godina;
	
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();

	today = dd + '/' + mm + '/' + yyyy;
	
	$.get({
		url: 'rest/ulogovanKorisnik',
		success : function(ulogovanKorisnik){
			ulogovanKorisnikPrijave = ulogovanKorisnik.upozorenja;
		}
	})
	
	if(ulogovanKorisnikPrijave < 4){
		if(validacijaDodavanjaIzmene(nazivOglasa, opisOglasa, datumIsticanja, today, cenaOglasa, slikaOglasa)){
			$.post({
				url: 'rest/korisnici/dodajNoviOglas',
				data: JSON.stringify({naziv : nazivOglasa, cena : cenaOglasa, opis : opisOglasa, stringSlike : slikaOglasa, datumIsticanja : datumIsticanja, imeKategorije : imeKategorije}),
				contentType: 'application/json',
				success: function(uspeo) {
					if(uspeo){
						$('#zatvoriModalOglas').trigger('click');
						$('#listaMojihOglasa').trigger('click');
						alert("Oglas uspešno objavljen!");
					}
				},
				error : function(){
					alert("Nisam uspeo da dodam");
				}
			})
		}
	}
	else{
		alert("Vas nalog je markiran zbog sumnjivih aktivnosti. Kontaktirajte administratora za vise informacija.");
	}
})

$('#zatvoriModalOglas').click(function(){
	resetujDodavanje();
})

function resetujDodavanje(){
	$('#nazivOglasaDodaj').val("");
	$('#cenaOglasaDodaj').val("");
	$('#opisOglasaDodaj').val("");
	srcSlika = "";
	$('#dan').val("");
	$('#mesec').val("");
	$('#godina').val("");
	$('.izabranaKategorija').html("Ostalo");
	$('#slikaOglasaDodata').prop('src', "");
}

/////////////////////////////////////////////////////////////////////////
///////// IZMENA OGLASA /////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
$('#izmeniOglas').click(function(event){
	event.preventDefault();
	
	let naziv = $('#nazivOglasaIzmeni').val();
	let cena = parseInt($('#cenaOglasaIzmeni').val());
	let opis = $('#opisOglasaIzmeni').val();
	let dan = $('#danIzmeni').val();
	let mesec = $('#mesecIzmeni').val();
	let godina = $('#godinaIzmeni').val();
	let imeKategorije = $('.izabranaKategorija').html();
	let stringSlike = $('#slikaOglasaIzmeni').prop('src');
	
	if(isEmptyOrSpaces($('#danIzmeni').val())){
		dan = "32";
	}
	
	if(isEmptyOrSpaces($('#mesecIzmeni').val())){
		mesec = "13"
	}
	
	if(isEmptyOrSpaces($('#godinaIzmeni').val())){
		godina = "2018";
	}
	
	let datumIsticanja = dan + '/' + mesec + '/' + godina;
	
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();

	today = dd + '/' + mm + '/' + yyyy;
	
	if(validacijaIzmene(naziv, opis, datumIsticanja, today, cena, stringSlike)){
		$.ajax({
			type : 'PUT',
			url : 'rest/oglasi/izmeniOglas',
			data : JSON.stringify({id : idOglasaZaIzmenu, naziv : naziv, cena : cena, opis : opis, datumIsticanja : datumIsticanja, imeKategorije : imeKategorije, stringSlike : stringSlike}),
			contentType : 'application/json',
			success : function(uspeo){
				if(uspeo){
					alert("Oglas uspešno izmenjen!");
					$('#zatvoriModalIzmeniOglas').trigger('click');
					$('#listaMojihOglasa').trigger('click');
				}
			},
			error : function(){
				alert("NISAM USPEO")
			}
		})
	}

})

function resetujIzmenu(){
	$('#nazivOglasaIzmeni').val("");
	$('#cenaOglasaIzmeni').val("");
	$('#opisOglasaIzmeni').val("");
	srcSlikaIzmeni = "";
	$('#danIzmeni').val("");
	$('#mesecIzmeni').val("");
	$('#godinaIzmeni').val("");
	$('.izabranaKategorija').html("Ostalo");
	$('#slikaOglasaIzmeni').prop('src', "");
}

$('#zatvoriModalIzmeniOglas').click(function(){
	resetujIzmenu();
})

////////////// FILTRACIJA PO STATUSU ////////////////////////////////////
$('#pretraziListaMojih').on("click", function(event){
	event.preventDefault();
	
	let status;
	
	if($('#aktivanListaMojih').prop('checked')) {
	    status = "1";
	} else {
	    status = "0";
	}
	
	if($('#uRealizacijiListaMojih').prop('checked')) {
	    status += "1";
	} else {
	    status += "0";
	}
	
	if($('#dostavljenListaMojih').prop('checked')) {
	    status += "1";
	} else {
	    status += "0";
	}
	
	$.ajax({
		type : 'PUT',
		url : 'rest/oglasi/filtracijaPoStatusu',
		data : JSON.stringify({naziv : status}),
		contentType : 'application/json',
		success : function(mojiOglasi){
			if(mojiOglasi){
							let mojiOglasiString = "";
							for(i = 0; i < mojiOglasi.length; i++){
								mojiOglasiString +=  '<tr><td class="product-thumbnail">' +
					                				   '<img src="' + mojiOglasi[i].stringSlike + '" alt="" class="img-fluid">' +
					                				   '</td><td class="product-name">' +
					                				   '<h2 class="h5 text-black"><a class="linkDoDetaljaMoji" href="#" data-toggle="modal" data-target="#modalLoginForm" id="DDO' + mojiOglasi[i].id + '">' + mojiOglasi[i].naziv + '</a></h2></td>' +
					                				   '<td>' + mojiOglasi[i].cena + '</td>' +
					                				   '<td>' + mojiOglasi[i].opis + '</td>' + 
					                				   '<td>' + mojiOglasi[i].status + '</td>';
								if(mojiOglasi[i].status === "AKTIVAN"){
									mojiOglasiString +=   '<td><p><a id="IO' + mojiOglasi[i].id + '" href="" data-toggle="modal" data-target="#modalIzmeniOglas" class="buy-now btn btn-sm btn-primary" style="color:white">Izmeni</a></p> ' +
			     				   						   '<p><a id="OO' + mojiOglasi[i].id + '" href="" class="buy-now btn btn-sm btn-primary" style="color:white">Obriši</a></p> </td>';
								}
								else{
									mojiOglasiString += '<td></td>'
								}
								
								mojiOglasiString += '</tr>';
					                				 
							}
							
							$('#dodajUTabeluListaMojihOglasa').html($(mojiOglasiString));
			/////////////////////////////////////////////////////////////////////////
			///////// IZMENA I BRISANJE OGLASA //////////////////////////////////////
			/////////////////////////////////////////////////////////////////////////
							// IZMENA I BRISANJE OGLASA !
							$('.btn-primary').on("click", function(event){
								event.preventDefault();
								
								let staJe = event.target.id;
								
								if(staJe.substring(0,2) == "IO"){
									// KLIKNUO JE NA IZMENI OGLAS
									idOglasaZaIzmenu = staJe.substring(2, staJe.length);
									
									$.post({
										url:'rest/oglasi/detaljiOglasa',
										data : JSON.stringify({id : idOglasaZaIzmenu}),
										contentType : 'application/json',
										success: function(oglas){
											if(oglas){
												$('#nazivOglasaIzmeni').val(oglas.naziv);
												$('#cenaOglasaIzmeni').val(oglas.cena);
												$('#opisOglasaIzmeni').val(oglas.opis);
												
												let datum = oglas.datumIsticanja.split('/');
												let dan = datum[0];
												let mesec = datum[1];
												let godina = datum[2];
												
												$('#danIzmeni').val(dan);
												$('#mesecIzmeni').val(mesec);
												$('#godinaIzmeni').val(godina);
												$('.izabranaKategorija').html(oglas.imeKategorije);
												$('#slikaOglasaIzmeni').prop('src', oglas.stringSlike);
												
												srcSlikaIzmeni = oglas.stringSlike;
											}
										}
									})
									
									
									
									
								}
								else if (staJe.substring(0,2) == "OO"){
									// KLIKNUO JE NA OBRIŠI OGLAS
									idOglasaZaBrisanje = staJe.substring(2, staJe.length);
									
									$.ajax({
									 	type: 'DELETE',
										url: 'rest/korisnici/obrisiOglas',
										data: JSON.stringify({id: idOglasaZaBrisanje}),
										contentType: 'application/json',
										success: function(uspeo) {
											if(uspeo){
												alert("Oglas uspešno obrisan!");
												$('#pretraziListaMojih').trigger('click');
												
											}
											else{
												alert("Možete obrisati samo aktivne oglase!");
											}
										},
										error: function(){
											alert("NISAM OBRISAO");
										}

								 })
								}
							})
							
							$('.linkDoDetaljaMoji').on("click",function(event){
								event.preventDefault();
								idOglasa = event.target.id;
								idOglasa = idOglasa.substring(3, idOglasa.length);
													
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
												
												ucitajListuRecenzija();
										}
									},
									error: function() {
									
									}
								});
								
							});
							
			}
		},
		error : function(){
			alert("NISAM USPEO DA FILTRIRAM");
		}
	});
	
})

$('#ponistiListaMojih').on("click", function(event){
	event.preventDefault();
	
	ponistiFiltraciju();
	
	$('#pretraziListaMojih').trigger('click');
})

function ponistiFiltraciju(){
	$('#aktivanListaMojih').prop('checked', false);
	$('#uRealizacijiListaMojih').prop('checked', false);
	$('#dostavljenListaMojih').prop('checked', false);	
}

function validacijaIzmene(naziv, opis, datum, danas, cena, slika){
let tacnost = 0;
	
	if(!dobar(datum, danas)){
		$('#danIzmeni').css('border-color', 'red');
		$('#mesecIzmeni').css('border-color', 'red');
		$('#godinaIzmeni').css('border-color', 'red');
		tacnost++;
	}
	else{
		$('#danIzmeni').css('border-color', '#CED4DA');
		$('#mesecIzmeni').css('border-color', '#CED4DA');
		$('#godinaIzmeni').css('border-color', '#CED4DA');
	}
	
	if(!naziv || isEmptyOrSpaces(naziv)){
		$('#nazivOglasaIzmeni').css('border-color', 'red');
		tacnost++;
	}
	else{
		$('#nazivOglasaIzmeni').css('border-color', '#CED4DA');	
	}
	
	if(!opis || isEmptyOrSpaces(opis)){
		$('#opisOglasaIzmeni').css('border-color', 'red');
		tacnost++;
	}
	else{
		$('#opisOglasaIzmeni').css('border-color', '#CED4DA');	
	}
	
	if(isNaN(cena)){
		$('#cenaOglasaIzmeni').css('border-color', 'red');
		tacnost++;
	}else{
		$('#cenaOglasaIzmeni').css('border-color', '#CED4DA');	
	}
	
	if(slika == ""){
		$('#slikaObaveznaIzmeni').css('visibility', 'visible');
		$('#slikaObaveznaIzmeni').css('display', 'block');
		tacnost++;
	}else{
		$('#slikaObaveznaIzmeni').css('visibility', 'hidden');
		$('#slikaObaveznaIzmeni').css('display', 'none');
	}
	
	if(tacnost > 0){
		return false;
	}
	else{
		return true;
	}
}

function validacijaDodavanjaIzmene(naziv, opis, datum, danas, cena, slika){
	
	let tacnost = 0;
	
	if(!dobar(datum, danas)){
		$('#dan').css('border-color', 'red');
		$('#mesec').css('border-color', 'red');
		$('#godina').css('border-color', 'red');
		tacnost++;
	}
	else{
		$('#dan').css('border-color', '#CED4DA');
		$('#mesec').css('border-color', '#CED4DA');
		$('#godina').css('border-color', '#CED4DA');
	}
	
	if(!naziv || isEmptyOrSpaces(naziv)){
		$('#nazivOglasaDodaj').css('border-color', 'red');
		tacnost++;
	}
	else{
		$('#nazivOglasaDodaj').css('border-color', '#CED4DA');	
	}
	
	if(!opis || isEmptyOrSpaces(opis)){
		$('#opisOglasaDodaj').css('border-color', 'red');
		tacnost++;
	}
	else{
		$('#opisOglasaDodaj').css('border-color', '#CED4DA');	
	}
	
	if(isNaN(cena)){
		$('#cenaOglasaDodaj').css('border-color', 'red');
		tacnost++;
	}else{
		$('#cenaOglasaDodaj').css('border-color', '#CED4DA');	
	}
	
	if(slika == ""){
		$('#slikaObavezna').css('visibility', 'visible');
		$('#slikaObavezna').css('display', 'block');
		tacnost++;
	}else{
		$('#slikaObavezna').css('visibility', 'hidden');
		$('#slikaObavezna').css('display', 'none');
	}
	
	if(tacnost > 0){
		return false;
	}
	else{
		return true;
	}
}

function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

function dobar(dateString, danas){
 	var parts = dateString.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);
    
    var datum1 = stringToDatum(dateString, "dd/mm/yyyy", "/");
    var datum2 = stringToDatum(danas, "dd/mm/yyyy", "/");
    
    if(datum1 < datum2){
    	return false;
    }
      
    // Check the ranges of month and year
    if(year < 2019 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
}


function stringToDatum(_date,_format,_delimiter)
{
            var formatLowerCase=_format.toLowerCase();
            var formatItems=formatLowerCase.split(_delimiter);
            var dateItems=_date.split(_delimiter);
            var monthIndex=formatItems.indexOf("mm");
            var dayIndex=formatItems.indexOf("dd");
            var yearIndex=formatItems.indexOf("yyyy");
            var month=parseInt(dateItems[monthIndex]);
            month-=1;
            var formatedDate = new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
            return formatedDate;
}

////LISTA KORISNIKA ///////////////////////////////////////////////

$('#pretragaKorisnika').click(function(event){
	event.preventDefault();
	
	$('#pretragaKorisnikaDiv').css('visibility', 'visible');
	$('#pretragaKorisnikaDiv').css('display', 'block');
	
	$('#porukeDiv').css('visibility','hidden');
	$('#porukeDiv').css('display', 'none');
	
	$('#listaMojihOglasaDiv').css('visibility', 'hidden');
	$('#listaMojihOglasaDiv').css('display', 'none');
	$('#listaRecenzijaDiv').css('visibility', 'hidden');
	$('#listaRecenzijaDiv').css('display', 'none');
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

										if(korisnik.uloga != "ADMIN"){

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
										if(korisnik.uloga != "ADMIN"){

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
	$('#najpopularnijiOglasiDiv').css('visibility','hidden');
	$('#najpopularnijiOglasiDiv').css('display', 'none');
	$('#pretragaKorisnikaDiv').css('visibility', 'hidden');
	$('#pretragaKorisnikaDiv').css('display', 'none');
	$('#listaMojihOglasaDiv').css('visibility', 'hidden');
	$('#listaMojihOglasaDiv').css('display', 'none');
	$('#listaRecenzijaDiv').css('visibility', 'hidden');
	$('#listaRecenzijaDiv').css('display', 'none');
	
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
											listaPorukaString +=   '<p><a id="OB' + listaPoruka[i].id + '" href="" class="buy-now btn btn-sm btn-primary" style="color:white">OBRIŠI</a></p></td>';
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