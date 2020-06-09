package beans;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.UUID;

@SuppressWarnings("serial")
public class Oglas implements Serializable{
	
	private String id;
	
	private String naziv;
	private int cena;
	private String opis;
	private int brojLajkova;
	private int brojDislajkova;
	private String stringSlike;
	private String datumPostavljanja;
	private String datumIsticanja;
	private String status;
	private ArrayList<Recenzija> listaRecenzija = new ArrayList<Recenzija>();	
	private String grad;
	
	private int brojListaOmiljenih;
	
	private String imeKategorije;
///////////////////////////////////////////////////////////////
	public String getImeKategorije() {
		return imeKategorije;
	}

	public void setImeKategorije(String imeKategorije) {
		this.imeKategorije = imeKategorije;
	}
////////////////////////////////////////////////////////////////
	private String korisnickoImeProdavca;
	
	
	public String getKorisnickoImeProdavca() {
		return korisnickoImeProdavca;
	}

	public void setKorisnickoImeProdavca(String korisnickoImeProdavca) {
		this.korisnickoImeProdavca = korisnickoImeProdavca;
	}
///////////////////////////////////////////////////
	
	private Boolean obrisan;
	
	public Boolean getObrisan() {
		return obrisan;
	}

	public void setObrisan(Boolean obrisan) {
		this.obrisan = obrisan;
	}

	public Oglas() {
		super();
		this.obrisan = false;
	}

	public Oglas(String naziv, int cena, String opis, int brojLajkova, int brojDislajkova, String stringSlike,
			String datumPostavljanja, String datumIsticanja, String status, ArrayList<Recenzija> listaRecenzija,
			String grad, int brojListaOmiljenih) {
		super();
		this.naziv = naziv;
		this.cena = cena;
		this.opis = opis;
		this.brojLajkova = brojLajkova;
		this.brojDislajkova = brojDislajkova;
		this.stringSlike = stringSlike;
		this.datumPostavljanja = datumPostavljanja;
		this.datumIsticanja = datumIsticanja;
		this.status = status;
		this.listaRecenzija = listaRecenzija;
		this.grad = grad;
		this.brojListaOmiljenih = brojListaOmiljenih;
		this.id = UUID.randomUUID().toString();
	}



	public String getNaziv() {
		return naziv;
	}

	public void setNaziv(String naziv) {
		this.naziv = naziv;
	}

	public int getCena() {
		return cena;
	}

	public void setCena(int cena) {
		this.cena = cena;
	}

	public String getOpis() {
		return opis;
	}

	public void setOpis(String opis) {
		this.opis = opis;
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

	public String getDatumPostavljanja() {
		return datumPostavljanja;
	}

	public void setDatumPostavljanja(String datumPostavljanja) {
		this.datumPostavljanja = datumPostavljanja;
	}

	public String getDatumIsticanja() {
		return datumIsticanja;
	}

	public void setDatumIsticanja(String datumIsticanja) {
		this.datumIsticanja = datumIsticanja;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public ArrayList<Recenzija> getListaRecenzija() {
		return listaRecenzija;
	}

	public void setListaRecenzija(ArrayList<Recenzija> listaRecenzija) {
		this.listaRecenzija = listaRecenzija;
	}

	public String getGrad() {
		return grad;
	}

	public void setGrad(String grad) {
		this.grad = grad;
	}

	public String getStringSlike() {
		return stringSlike;
	}

	public void setStringSlike(String stringSlike) {
		this.stringSlike = stringSlike;
	}

	public int getBrojListaOmiljenih() {
		return brojListaOmiljenih;
	}

	public void setBrojListaOmiljenih(int brojListaOmiljenih) {
		this.brojListaOmiljenih = brojListaOmiljenih;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@Override
	public String toString() {
		return "Oglas [id=" + id + ", naziv=" + naziv + ", cena=" + cena + ", opis=" + opis + ", brojLajkova="
				+ brojLajkova + ", brojDislajkova=" + brojDislajkova + ", stringSlike=" + stringSlike
				+ ", datumPostavljanja=" + datumPostavljanja + ", datumIsticanja=" + datumIsticanja + ", status="
				+ status + ", listaRecenzija=" + listaRecenzija + ", grad=" + grad + ", brojListaOmiljenih="
				+ brojListaOmiljenih + "]";
	}
	
	

}
