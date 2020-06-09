package beans;

import java.io.Serializable;
import java.util.ArrayList;

@SuppressWarnings("serial")
public class Korisnik implements Serializable{
	
	private String korisnickoIme;
	private String lozinka;
	private String ime;
	private String prezime;
	private String uloga;
	private String kontaktTelefon;
	private String grad;
	private String emailAdresa;
	private String datumRegistracije;
	
	// KUPAC //
	private ArrayList<Oglas> listaPorucenih = new ArrayList<Oglas>();
	private ArrayList<Oglas> listaDostavljenih = new ArrayList<Oglas>();
	private ArrayList<Oglas> listaOmiljenih = new ArrayList<Oglas>();
	
	private ArrayList<Oglas> listaLajkovanih = new ArrayList<Oglas>();
	private ArrayList<Oglas> listaDislajkovanih = new ArrayList<Oglas>();
	//////////////////////////////////////////////////////////////////////////
	public ArrayList<Oglas> getListaLajkovanih() {
		return listaLajkovanih;
	}


	public void setListaLajkovanih(ArrayList<Oglas> listaLajkovanih) {
		this.listaLajkovanih = listaLajkovanih;
	}


	public ArrayList<Oglas> getListaDislajkovanih() {
		return listaDislajkovanih;
	}


	public void setListaDislajkovanih(ArrayList<Oglas> listaDislajkovanih) {
		this.listaDislajkovanih = listaDislajkovanih;
	}
	///////////////////////////////////////////////////////////////////////////////
	// PRODAVAC //

	private ArrayList<Oglas> listaObjavljenih = new ArrayList<Oglas>();
	private ArrayList<Oglas> listaIsporucenih = new ArrayList<Oglas>();
	private ArrayList<Poruka> listaPoruka = new ArrayList<Poruka>();
	private int brojLajkova;
	private int brojDislajkova;
	
	private int upozorenja;
	
	private ArrayList<Oglas> listaPrijavljenih = new ArrayList<Oglas>();
	
	public Korisnik() {
		super();
	}


	public Korisnik(String korisnickoIme, String lozinka, String ime, String prezime, String uloga,
			String kontaktTelefon, String grad, String emailAdresa, String datumRegistracije,
			ArrayList<Oglas> listaPorucenih, ArrayList<Oglas> listaDostavljenih, ArrayList<Oglas> listaOmiljenih) {
		super();
		this.korisnickoIme = korisnickoIme;
		this.lozinka = lozinka;
		this.ime = ime;
		this.prezime = prezime;
		this.uloga = uloga;
		this.kontaktTelefon = kontaktTelefon;
		this.grad = grad;
		this.emailAdresa = emailAdresa;
		this.datumRegistracije = datumRegistracije;
		this.listaPorucenih = listaPorucenih;
		this.listaDostavljenih = listaDostavljenih;
		this.listaOmiljenih = listaOmiljenih;
		
	}


	public Korisnik(String korisnickoIme, String lozinka, String ime, String prezime, String uloga,
			String kontaktTelefon, String grad, String emailAdresa, String datumRegistracije,
			ArrayList<Oglas> listaObjavljenih, ArrayList<Oglas> listaIsporucenih, ArrayList<Poruka> listaPoruka,
			int brojLajkova, int brojDislajkova) {
		super();
		this.korisnickoIme = korisnickoIme;
		this.lozinka = lozinka;
		this.ime = ime;
		this.prezime = prezime;
		this.uloga = uloga;
		this.kontaktTelefon = kontaktTelefon;
		this.grad = grad;
		this.emailAdresa = emailAdresa;
		this.datumRegistracije = datumRegistracije;
		this.listaObjavljenih = listaObjavljenih;
		this.listaIsporucenih = listaIsporucenih;
		this.listaPoruka = listaPoruka;
		this.brojLajkova = brojLajkova;
		this.brojDislajkova = brojDislajkova;
	}


	public String getKorisnickoIme() {
		return korisnickoIme;
	}


	public void setKorisnickoIme(String korisnickoIme) {
		this.korisnickoIme = korisnickoIme;
	}


	public String getLozinka() {
		return lozinka;
	}


	public void setLozinka(String lozinka) {
		this.lozinka = lozinka;
	}


	public String getIme() {
		return ime;
	}


	public void setIme(String ime) {
		this.ime = ime;
	}


	public String getPrezime() {
		return prezime;
	}


	public void setPrezime(String prezime) {
		this.prezime = prezime;
	}


	public String getUloga() {
		return uloga;
	}


	public void setUloga(String uloga) {
		this.uloga = uloga;
	}


	public String getKontaktTelefon() {
		return kontaktTelefon;
	}


	public void setKontaktTelefon(String kontaktTelefon) {
		this.kontaktTelefon = kontaktTelefon;
	}


	public String getGrad() {
		return grad;
	}


	public void setGrad(String grad) {
		this.grad = grad;
	}


	public String getEmailAdresa() {
		return emailAdresa;
	}


	public void setEmailAdresa(String emailAdresa) {
		this.emailAdresa = emailAdresa;
	}


	public String getDatumRegistracije() {
		return datumRegistracije;
	}


	public void setDatumRegistracije(String datumRegistracije) {
		this.datumRegistracije = datumRegistracije;
	}


	public ArrayList<Oglas> getListaPorucenih() {
		return listaPorucenih;
	}


	public void setListaPorucenih(ArrayList<Oglas> listaPorucenih) {
		this.listaPorucenih = listaPorucenih;
	}


	public ArrayList<Oglas> getListaDostavljenih() {
		return listaDostavljenih;
	}


	public void setListaDostavljenih(ArrayList<Oglas> listaDostavljenih) {
		this.listaDostavljenih = listaDostavljenih;
	}


	public ArrayList<Oglas> getListaOmiljenih() {
		return listaOmiljenih;
	}


	public void setListaOmiljenih(ArrayList<Oglas> listaOmiljenih) {
		this.listaOmiljenih = listaOmiljenih;
	}


	public ArrayList<Oglas> getListaObjavljenih() {
		return listaObjavljenih;
	}


	public void setListaObjavljenih(ArrayList<Oglas> listaObjavljenih) {
		this.listaObjavljenih = listaObjavljenih;
	}


	public ArrayList<Oglas> getListaIsporucenih() {
		return listaIsporucenih;
	}


	public void setListaIsporucenih(ArrayList<Oglas> listaIsporucenih) {
		this.listaIsporucenih = listaIsporucenih;
	}


	public ArrayList<Poruka> getListaPoruka() {
		return listaPoruka;
	}


	public void setListaPoruka(ArrayList<Poruka> listaPoruka) {
		this.listaPoruka = listaPoruka;
	}


	public int getBrojLajkova() {
		return brojLajkova;
	}


	public void setBrojLajkova(int brojLajkova) {
		this.brojLajkova = brojLajkova;
	}


	public int getBrojDislajkova() {
		return brojDislajkova;
	}


	public void setBrojDislajkova(int brojDislajkova) {
		this.brojDislajkova = brojDislajkova;
	}


	public int getUpozorenja() {
		return upozorenja;
	}


	public void setUpozorenja(int upozorenja) {
		this.upozorenja = upozorenja;
	}


	public ArrayList<Oglas> getListaPrijavljenih() {
		return listaPrijavljenih;
	}


	public void setListaPrijavljenih(ArrayList<Oglas> listaPrijavljenih) {
		this.listaPrijavljenih = listaPrijavljenih;
	}
	
}
