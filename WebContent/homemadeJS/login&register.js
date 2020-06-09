$('#odjava').on('click', function(){
	event.preventDefault();
	$.get({
		url : 'rest/logout',
		success : function() {
			window.location = 'home.html' ;
		}
	});
})



$('#loginForma').submit(function(event) {
		event.preventDefault();
		let korIme = $('#korisnickoIme').val();
		let loz = $('#lozinka').val();
		
		if (!korIme || !loz){
			if(!korIme){
				$('#korisnickoIme').css('border-color','red');
				$('#korisnickoImeValidacija').css('visibility', 'visible');
				$('#korisnickoImeValidacija').css('display', 'block');
			}
			
			if(!loz){
				$('#lozinka').css('border-color','red');
				$('#lozinkaValidacija').css('visibility', 'visible');
				$('#lozinkaValidacija').css('display', 'block');
			}
			
			$('#sveukupnaValidacija').css('visibility', 'visible');
		    $('#sveukupnaValidacija').css('display', 'block');
		}
		else
		{
		
		$.post({
			url: 'rest/login',
			data: JSON.stringify({korisnickoIme: korIme, lozinka: loz}),
			contentType: 'application/json',
			success: function(data) {
				if (data != null)
				{
					if(data.uloga == "KUPAC"){
						window.location = 'kupac.html';
					}
					else if (data.uloga == "ADMIN"){
						window.location = 'admin.html';
					}
					else{
						window.location = 'prodavac.html';
					}
				}
				else{
					$('#sveukupnaValidacija').css('visibility', 'visible');
				    $('#sveukupnaValidacija').css('display', 'block');
				}
			},
			error: function() {
				$('#sveukupnaValidacija').css('visibility', 'visible');
			    $('#sveukupnaValidacija').css('display', 'block'); ;
			}
		});
				}
	});



var letters = /^[A-Za-zšđčćžŠĐČĆŽ]+$/;
var usernameRegex = /^[a-zA-Z0-9]+$/;
var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

$('#registerForma').submit(function(event){
	event.preventDefault() ;
	
	let ime = $('#ime').val() ;
	let prezime = $('#prezime').val() ;
	let korisnickoIme = $('#korisnickoImeR').val() ;
	let lozinka = $('#lozinkaR').val() ;
	let uloga = "KUPAC" ;
	let kontaktTelefon = $('#kontaktTelefon').val() ;
	let grad= $('#grad').val() ;
	let emailAdresa= $('#emailAdresa').val() ;
	let datum = new Date() ;
	let d = datum.getDate() + "/" + (datum.getMonth() + 1) + "/" + datum.getFullYear();
	

	
	if($('#ponovljenaLozinkaR').val().localeCompare($('#lozinkaR').val())==0)
	{
		$('#ponovljenaLozinkaR').css('border-color', '#CED4DA');
		$('#ponovljenaLozinkaRValidacija').css('visibility', 'hidden');
		$('#ponovljenaLozinkaRValidacija').css('display', 'none');
	}
	else{
		$('#ponovljenaLozinkaR').css('border-color', 'red');
		$('#ponovljenaLozinkaRValidacija').css('visibility', 'visible');
		$('#ponovljenaLozinkaRValidacija').css('display', 'block');
	}
	
	if($('#emailAdresa').val().match(mailformat))
	{
		$('#emailAdresa').css('border-color', '#CED4DA');
		$('#emailValidacija').css('visibility', 'hidden');
		$('#emailValidacija').css('display', 'none');
	}
	else{
		$('#emailAdresa').css('border-color', 'red');
		$('#emailValidacija').css('visibility', 'visible');
		$('#emailValidacija').css('display', 'block');
	}
	
	if(!ime.match(letters) || !prezime.match(letters) || !korisnickoIme.match(usernameRegex) || !lozinka.match(usernameRegex) || $('#ponovljenaLozinkaR').val().localeCompare($('#lozinkaR').val())!=0 || !$('#emailAdresa').val().match(mailformat))
	{
		if(!ime.match(letters)){
			$('#ime').css('border-color', 'red');
		}
		else{
			$('#ime').css('border-color', '#CED4DA');
		}
	
		if(!prezime.match(letters)){
			$('#prezime').css('border-color', 'red');
		}
		else{
			$('#prezime').css('border-color', '#CED4DA');
		}
	
		if(!korisnickoIme.match(usernameRegex)){
			$('#korisnickoImeR').css('border-color', 'red');
		}
		else{
			$('#korisnickoImeR').css('border-color', '#CED4DA');
		}
		
		if(!lozinka.match(usernameRegex)){
			$('#lozinkaR').css('border-color', 'red');
		}
		else{
			$('#lozinkaR').css('border-color', '#CED4DA');
		}
	
		if(!emailAdresa.match(mailformat)){
			$('#emailAdresa').css('border-color', 'red');
		}
		else{
			$('#emailAdresa').css('border-color', '#CED4DA');
		}
		
		$('#registracijaValidacija').css('visibility', 'visible');
		$('#registracijaValidacija').css('display', 'block');
	}
	else {
	
	$.post({
		url: 'rest/registracija',
		data: JSON.stringify({
			ime :ime,
			prezime :prezime,
			korisnickoIme: korisnickoIme, 
			lozinka: lozinka,
			uloga:uloga,
			kontaktTelefon:kontaktTelefon,
			grad:grad,
			emailAdresa:emailAdresa,
			datumRegistracije:d
		
		}),
		contentType: 'application/json',
		success: function(data) {
			if(data){
				alert("Uspešna registracija! Molimo Vas ulogujte se!");
				window.location = 'login.html' ;
			}
			else {
				$('#registracijaValidacija2').css('visibility', 'visible');
				$('#registracijaValidacija2').css('display', 'block');
				$('#korisnickoImeR').css('border-color', 'red');
			}
		},
		error: function() {
			alert("Nesto poslo po zlu prilikom registracije, hm pitam se sta?");
		}
	});
	}
	
});


$(document).ready(function(){
	
	$('#korisnickoIme').change(function(event){
		event.preventDefault();
		
		$('#sveukupnaValidacija').css('visibility', 'hidden');
	    $('#sveukupnaValidacija').css('display', 'none');
	    
		if($('#korisnickoIme').val()){
			$('#korisnickoIme').css('border-color', '#CED4DA');
			$('#korisnickoImeValidacija').css('visibility', 'hidden');
			$('#korisnickoImeValidacija').css('display', 'none');
		}
		else{
			$('#korisnickoIme').css('border-color', 'red');
			$('#korisnickoImeValidacija').css('visibility', 'visible');
			$('#korisnickoImeValidacija').css('display', 'block');
		}
	})

	$('#lozinka').change(function(event){
		event.preventDefault();
		
		$('#sveukupnaValidacija').css('visibility', 'hidden');
	    $('#sveukupnaValidacija').css('display', 'none');
	    
		if($('#lozinka').val()){
			$('#lozinka').css('border-color', '#CED4DA');
			$('#lozinkaValidacija').css('visibility', 'hidden');
			$('#lozinkaValidacija').css('display', 'none');
		}
		else{
			$('#lozinka').css('border-color', 'red');
			$('#lozinkaValidacija').css('visibility', 'visible');
			$('#lozinkaValidacija').css('display', 'block');
		}
	})
	
	$('#ime').change(function(event){
		event.preventDefault();
		if($('#ime').val().match(letters))
		{
			$('#ime').css('border-color', '#CED4DA');
		}
		else{
			$('#ime').css('border-color', 'red');
		}
	})

	$('#prezime').change(function(event){
		event.preventDefault();
		if($('#prezime').val().match(letters))
		{
			$('#prezime').css('border-color', '#CED4DA');
		}
		else{
			$('#prezime').css('border-color', 'red');
		}
	})

	$('#korisnickoImeR').change(function(event){
		event.preventDefault();
		
		if($('#korisnickoImeR').val().match(usernameRegex))
		{
			$('#korisnickoImeR').css('border-color', '#CED4DA');
		}
		else{
			$('#korisnickoImeR').css('border-color', 'red');
		}
	})

	$('#lozinkaR').change(function(event){
		event.preventDefault();
		if($('#lozinkaR').val().match(usernameRegex))
		{
			$('#lozinkaR').css('border-color', '#CED4DA');
		}
		else{
			$('#lozinkaR').css('border-color', 'red');
		}
	})

	$('#ponovljenaLozinkaR').change(function(event){
		event.preventDefault();
		if($('#ponovljenaLozinkaR').val().match(letters))
		{
			$('#ponovljenaLozinkaR').css('border-color', '#CED4DA');
		}
		else{
			$('#ponovljenaLozinkaR').css('border-color', 'red');
		}
	})

	$('#emailAdresa').change(function(event){
		event.preventDefault();
		let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if($('#emailAdresa').val().match(mailformat))
		{
			$('#emailAdresa').css('border-color', '#CED4DA');
			$('#emailValidacija').css('visibility', 'hidden');
			$('#emailValidacija').css('display', 'none');
		}
		else{
			$('#emailAdresa').css('border-color', 'red');
			$('#emailValidacija').css('visibility', 'visible');
			$('#emailValidacija').css('display', 'block');
		}
	})

	$('#ponovljenaLozinkaR').change(function(event){
		event.preventDefault();
		if($('#ponovljenaLozinkaR').val().localeCompare($('#lozinkaR').val())==0)
		{
			$('#ponovljenaLozinkaR').css('border-color', '#CED4DA');
			$('#ponovljenaLozinkaRValidacija').css('visibility', 'hidden');
			$('#ponovljenaLozinkaRValidacija').css('display', 'none');
		}
		else{
			$('#ponovljenaLozinkaR').css('border-color', 'red');
			$('#ponovljenaLozinkaRValidacija').css('visibility', 'visible');
			$('#ponovljenaLozinkaRValidacija').css('display', 'block');
		}
	})
})
