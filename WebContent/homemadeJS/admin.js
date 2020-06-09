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
		url:'rest/korisnici/listaPoruka',
		success : function(listaPoruka){
			$('#brojPoruka').html(listaPoruka.length);
		}
	})
	
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
////////////////////// LISTA KATEGORIJA KOD IZMENE OGLASA /////////////////
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
								
								imeKategorije = detaljanOglas.imeKategorije;
								popuniDijalogZaIzmenu();
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
	
	$('#pretragaDiv').css('visibility','visible');
	$('#pretragaDiv').css('display', 'block');
	
	$('#porukeDiv').css('visibility','hidden');
	$('#porukeDiv').css('display', 'none');
	
	$('#najpopularnijiOglasiDiv').css('visibility','hidden');
	$('#najpopularnijiOglasiDiv').css('display', 'none');
	
	$('#kategorijeDiv').css('visibility', 'hidden');
	$('#kategorijeDiv').css('display', 'none');
	
	$('#pretragaKorisnikaDiv').css('visibility', 'hidden');
	$('#pretragaKorisnikaDiv').css('display', 'none');
	
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
						imeKategorije = detaljanOglas.imeKategorije;
				}
				
			ucitajListuRecenzija();
			popuniDijalogZaIzmenu();
	
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


/////////////////// OSTALO ZA ADMINA ///////////////////////////////
///// IZMENI OGLAS /////////////////////////////////////////////////
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
			data : JSON.stringify({id : idOglasa, naziv : naziv, cena : cena, opis : opis, datumIsticanja : datumIsticanja, imeKategorije : imeKategorije, stringSlike : stringSlike}),
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



/// PRILIKOM OTVARANJE DETALJA DIJALOG ZA IZMENU //////////////////
function popuniDijalogZaIzmenu(){
	$('#nazivOglasaIzmeni').val($('#nazivOglasa').html());
	$('#cenaOglasaIzmeni').val($('#cenaOglasa').html());
	$('#opisOglasaIzmeni').val($('#opisOglasa').html());
	
	let datum = ($('#datum').html().split('-')[1]).split('/');
	let dan = datum[0];
	let mesec = datum[1];
	let godina = datum[2];
	
	$('#danIzmeni').val(dan);
	$('#mesecIzmeni').val(mesec);
	$('#godinaIzmeni').val(godina);
	$('.izabranaKategorija').html(imeKategorije);
	$('#slikaOglasaIzmeni').prop('src', $('#slikaOglasa').prop('src'));
	
	srcSlikaIzmeni = slikaOglasa;
}

///// BRISANJE OGLASA /////////////////////////////////////////////
$('#obrisiOglasAdmin').click(function(event){
	event.preventDefault();
	

	$.ajax({
	 	type: 'DELETE',
		url: 'rest/korisnici/obrisiOglas',
		data: JSON.stringify({id: idOglasa}),
		contentType: 'application/json',
		success: function(uspeo) {
			if(uspeo){
				alert("Oglas uspešno obrisan!");
			}
			else{
				alert("Možete obrisati samo aktivne oglase!");
			}
		},
		error: function(){
			alert("NISAM OBRISAO");
		}

 })
	
})

//// LISTA KORISNIKA ///////////////////////////////////////////////
var korIme = "";

$('#pretragaKorisnika').click(function(event){
	event.preventDefault();
	
	$('#pretragaKorisnikaDiv').css('visibility', 'visible');
	$('#pretragaKorisnikaDiv').css('display', 'block');
	
	$('#porukeDiv').css('visibility','hidden');
	$('#porukeDiv').css('display', 'none');
	
	$('#kategorijeDiv').css('visibility', 'hidden');
	$('#kategorijeDiv').css('display', 'none');
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
 				   						'<h2 class="h5 text-black"><a ';
					if(listaKorisnika[i].upozorenja > 3){
						korisniciString += 'style="color:red"';
					}
					korisniciString += ' class="linkDoDetaljaKorisnik" href="#" data-toggle="modal" data-target="#modalKorisnik" id="KD' + listaKorisnika[i].korisnickoIme + '">' + listaKorisnika[i].korisnickoIme + '</a></h2></td>' +
 				   						'<td>' + listaKorisnika[i].grad + '</td>' +
 				   						'<td>' + listaKorisnika[i].uloga + '</td>';
					if(listaKorisnika[i].uloga === "KUPAC"){
							korisniciString +=   '<td><a id="PK' + listaKorisnika[i].korisnickoIme + '" href="" class="buy-now btn btn-sm btn-primary" style="color:white">Postavi za prodavca</a></td>';
					}
					else{
						korisniciString +=   '<td><a id="PP' + listaKorisnika[i].korisnickoIme + '" href="" class="buy-now btn btn-sm btn-primary" style="color:white">Postavi za kupca</a></td>';
					}

					korisniciString += '</tr>';
				}
					
					$('#dodajUTabeluListaKorisnika').html($(korisniciString));
					
					$('.btn-primary').on("click", function(event){
						event.preventDefault();
						
						let staJe = event.target.id;
						let korisnickoIme = "";
						
						if(staJe.substring(0,2) == "PK" || staJe.substring(0,2) == "PP"){
							// KLIKNUO JE NA IZMENI TIP KUPCU
							korisnickoIme = staJe.substring(2, staJe.length);
							
							$.post({
								url:'rest/korisnici/izmeniTipKorisnika',
								data : JSON.stringify({korisnickoIme : korisnickoIme}),
								contentType : 'application/json',
								success: function(uspeo){
									if(uspeo){
										$('#pretragaKorisnika').trigger('click');
										alert("Uspešno promenjen tip korisnika!");
									}
									else{
										alert("Ne možete promeniti tip korisniku!")
									}
								},
								error: function(){
									alert("Nisam uspeo");
								}
							})

						}
					})
					
					/// OVDE DODATI KLIK NA LINK DO DETALJA O KORISNIKU
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
									let imePrezimeString = korisnik.ime + " " + korisnik.prezime;
									$('#korisnickoIme').html(korisnik.korisnickoIme);
									$('#imePrezime').html(imePrezimeString);
									$('#gradKorisnik').html(korisnik.grad);
									$('#uloga').html(korisnik.uloga);
									$('#emailAdresa').html(korisnik.emailAdresa);
									$('#kontaktTelefon').html(korisnik.kontaktTelefon);
									$('#datumRegistracije').html(korisnik.datumRegistracije);
									
									if(korisnik.upozorenja > 3){
										$('#skiniPrijavu').show();
									}
									else{
										$('#skiniPrijavu').hide();
									}
									
									$('#kreirajPoruku').show();
									
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


var staroImeKategorije = "";
/////////////// LISTA KATEGORIJA //////////////////////////////////
$('#tabelaKategorija').click(function(event){
	event.preventDefault();
	
	ponistiPretraguKorisnika();
	
	$('#kategorijeDiv').css('visibility', 'visible');
	$('#kategorijeDiv').css('display', 'block');
	
	$('#porukeDiv').css('visibility','hidden');
	$('#porukeDiv').css('display', 'none');
	
	$('#pretragaKorisnikaDiv').css('visibility', 'hidden');
	$('#pretragaKorisnikaDiv').css('display', 'none');
	$('#pretragaDiv').css('visibility', 'hidden');
	$('#pretragaDiv').css('display', 'none');
	$('#najpopularnijiOglasiDiv').css('visibility', 'hidden');
	$('#najpopularnijiOglasiDiv').css('display', 'none');
	
	$.get({
		url: 'rest/kategorije/sveKategorije',
		success : function(sveKategorije){
			if(sveKategorije){
				let sveKategorijeString = "";
				
				for(i = 0; i < sveKategorije.length; i++){
					sveKategorijeString += '<tr><td>' + sveKategorije[i].naziv + '</td>' +
 				   						'<td>' + sveKategorije[i].opis + '</td>';
										sveKategorijeString +=   '<td><p><a data-toggle="modal" data-target="#modalIzmeniKategoriju" id="IK' + sveKategorije[i].naziv + '" href="" class="buy-now btn btn-sm btn-primary" style="color:white">Izmeni</a></p>';
										sveKategorijeString +=   '<p><a id="OK' + sveKategorije[i].naziv + '" href="" class="buy-now btn btn-sm btn-primary" style="color:white">Obriši</a></p></td>';

										sveKategorijeString += '</tr>';
				}
					
					$('#dodajUTabeluListaKategorija').html($(sveKategorijeString));
					
					$('.btn-primary').on("click", function(event){
						event.preventDefault();
						
						let staJe = event.target.id;
						let imeKategorije = "";
						
						if(staJe.substring(0,2) == "IK"){
							// KLIKNUO JE NA IZMENI KATEGORIJU
							imeKategorije = staJe.substring(2, staJe.length);
							staroImeKategorije = imeKategorije;
							$.ajax({
								type : 'PUT',
								url : 'rest/kategorije/detaljiKategorije',
								data : JSON.stringify({naziv:imeKategorije}),
								contentType : 'application/json',
								success : function(kategorija){
									if(kategorija){
										$('#nazivKategorijeIzmeni').val(kategorija.naziv);
										$('#opisKategorijeIzmeni').val(kategorija.opis);
									}
								}
							})
						}
						else if(staJe.substring(0,2) == "OK"){
							// KLIKNUO JE NA OBRIŠI KATEGORIJU
							imeKategorije = staJe.substring(2, staJe.length);
							
							$.ajax({
								type : 'DELETE',
								url : 'rest/kategorije/obrisiKategoriju',
								data : JSON.stringify({naziv : imeKategorije}),
								contentType : 'application/json',
								success : function(uspeo){
									if(uspeo){
										alert("Kategorija uspešno obrisana!");
										$('#tabelaKategorija').trigger('click');
									}
									else{
										alert("Ne možete obrisati kategoriju koja sadrži oglase!");
									}
								},
								error : function(){
									alert("NISAM USPEO DA OBRISEM KAT");
								}
							})
						}
					})
			}
		}
	})

})

$('#izmeniKategoriju').click(function(event){
	event.preventDefault();
	
	let parametri = [staroImeKategorije];
	let naziv = $('#nazivKategorijeIzmeni').val();
	let opis = $('#opisKategorijeIzmeni').val();

	
	if(isEmptyOrSpaces(naziv)){
		$('#nazivKategorijeIzmeni').css('border-color','red');
	}
	else{
		$('#nazivKategorijeIzmeni').css('border-color', '#CED4DA');
	
		$.ajax({
			type : 'PUT',
			url : 'rest/kategorije/izmeniKategoriju',
			data : JSON.stringify({naziv : naziv, opis : opis, listaParametara : parametri}),
			contentType : 'application/json',
			success : function(uspeo){
				if(uspeo){
					alert("Kategorija uspešno izmenjena!");
					$('#zatvoriModalIzmeniKategoriju').trigger('click');
					$('#tabelaKategorija').trigger('click');
				}
				else{
					alert("Kategorija sa istim nazivom već postoji!");
				}
			}
		})
	}
	
})

$('#dodajKategoriju').click(function(event){
	event.preventDefault();
	
	let naziv = $('#nazivKategorijeDodaj').val();
	let opis = $('#opisKategorijeDodaj').val();
	
	if(isEmptyOrSpaces(naziv)){
		$('#nazivKategorijeDodaj').css('border-color','red');
	}
	else{
		$('#nazivKategorijeDodaj').css('border-color', '#CED4DA');
		$.post({
			url : 'rest/kategorije/dodajKategoriju',
			data : JSON.stringify({naziv : naziv, opis : opis}),
			contentType : 'application/json',
			success : function(uspeo){
				if(uspeo){
					alert("Uspešno dodata kategorija!");
					$('#zatvoriModalDodajKategoriju').trigger('click');
					$('#tabelaKategorija').trigger('click');
				}
				else{
					alert("Kategorija sa istim nazivom vec postoji!");
				}
			}
		})
	
	}
	
	
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
									    '<h2 class="h5 text-black"><a ';
										if(listaKorisnika[i].upozorenja > 3){
											korisniciString += 'style="color:red"';
										}
										korisniciString += ' class="linkDoDetaljaKorisnik" href="#" data-toggle="modal" data-target="#modalKorisnik" id="KD' + listaKorisnika[i].korisnickoIme + '">' + listaKorisnika[i].korisnickoIme + '</a></h2></td>' +
										'<td>' + listaKorisnika[i].grad + '</td>' +
										'<td>' + listaKorisnika[i].uloga + '</td>';
										if(listaKorisnika[i].uloga === "KUPAC"){
												korisniciString +=   '<td><a id="PK' + listaKorisnika[i].korisnickoIme + '" href="" class="buy-now btn btn-sm btn-primary" style="color:white">Postavi za prodavca</a></td>';
										}
										else{
											korisniciString +=   '<td><a id="PP' + listaKorisnika[i].korisnickoIme + '" href="" class="buy-now btn btn-sm btn-primary" style="color:white">Postavi za kupca</a></td>';
										}
					
										korisniciString += '</tr>';
				}
					
					$('#dodajUTabeluListaKorisnika').html($(korisniciString));
					
					$('.btn-primary').on("click", function(event){
						event.preventDefault();
						
						let staJe = event.target.id;
						let korisnickoIme = "";
						
						if(staJe.substring(0,2) == "PK" || staJe.substring(0,2) == "PP"){
							// KLIKNUO JE NA IZMENI TIP KUPCU
							korisnickoIme = staJe.substring(2, staJe.length);
							
							$.post({
								url:'rest/korisnici/izmeniTipKorisnika',
								data : JSON.stringify({korisnickoIme : korisnickoIme}),
								contentType : 'application/json',
								success: function(uspeo){
									if(uspeo){
										$('#pretragaKorisnika').trigger('click');
										alert("Uspešno promenjen tip korisnika!");
									}
									else{
										alert("Ne možete promeniti tip korisniku!")
									}
								},
								error: function(){
									alert("Nisam uspeo");
								}
							})

						}
					})
					
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
										
										if(korisnik.upozorenja > 3){
											$('#skiniPrijavu').show();
										}
										else{
											$('#skiniPrijavu').hide();
										}
										
										$('#kreirajPoruku').show();
										
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

$('#ponistiDodavanje').click(function(event){
	event.preventDefault();
	$('#nazivKategorijeDodaj').val("");
	$('#opisKategorijeDodaj').val("");
})

///// SKINI PRIJAVU ///////////////////////////////////
$('#skiniPrijavu').click(function(){
	$.ajax({
		type : 'PUT',
		url : 'rest/korisnici/skiniPrijavu',
		data : JSON.stringify({korisnickoIme : korIme}),
		contentType : 'application/json',
		success : function(uspeo){
			if(uspeo){
				alert("Uspešno ste skinuli korisniku zabranu!");
				$('#zatvoriModalKorisnik').trigger('click');
			}
		}
	
	})
})

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
	
	$('#kategorijeDiv').css('visibility', 'hidden');
	$('#kategorijeDiv').css('display', 'none');
	
	$('#pretragaKorisnikaDiv').css('visibility', 'hidden');
	$('#pretragaKorisnikaDiv').css('display', 'none');
	
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
											listaPorukaString +=   '<td><a id="OP' + listaPoruka[i].posiljalac + '" href="" data-toggle="modal" data-target="#modalPosaljiPoruku" class="buy-now btn btn-sm btn-primary" style="color:white">ODGOVORI</a></td>';
										}
										else{
											listaPorukaString +=   '<td></td>';
										}
										
										if(listaPoruka[i].posiljalac === "JA"){
											listaPorukaString +=   '<td><p><a id="IZ' + listaPoruka[i].id + '" data-toggle="modal" data-target="#modalPosaljiPoruku" href="" class="buy-now btn btn-sm btn-primary" style="color:white">IZMENI</a></p>';
											listaPorukaString +=   '<p><a id="OB' + listaPoruka[i].id + '" href="" class="buy-now btn btn-sm btn-primary" style="color:white">OBRIŠI</a></p></td>';
										}else{
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
