package beans;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

@SuppressWarnings("serial")
public class Recenzija implements Serializable{
	
	private String id;
	
	Oglas oglas;
	Korisnik recenzent;
	String naslovRecenzije;
	String sadrzajRecenzije;
	
	String stringSlike;
	
	String opisIzOglasaTacan;
	String ispostovanDogovor;
	
	Boolean obrisana;
	
	String korisnickoImeRecenzenta;
	
	String nazivOglasa;

	public String getNazivOglasa() {
		return nazivOglasa;
	}

	public void setNazivOglasa(String nazivOglasa) {
		this.nazivOglasa = nazivOglasa;
	}

	public String getKorisnickoImeRecenzenta() {
		return korisnickoImeRecenzenta;
	}

	public void setKorisnickoImeRecenzenta(String korisnickoImeRecenzenta) {
		this.korisnickoImeRecenzenta = korisnickoImeRecenzenta;
	}

	public Recenzija() {
		super();
	}

	public Recenzija(String id, Oglas oglas, Korisnik recenzent, String naslovRecenzije, String sadrzajRecenzije, String stringSlike, String opisIzOglasaTacan, String ispostovanDogovor) {
		super();
		this.id = id;
		this.oglas = oglas;
		this.recenzent = recenzent;
		this.naslovRecenzije = naslovRecenzije;
		this.sadrzajRecenzije = sadrzajRecenzije;
		this.stringSlike = stringSlike;
		this.opisIzOglasaTacan = opisIzOglasaTacan;
		this.ispostovanDogovor = ispostovanDogovor;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	@JsonIgnore
	public Oglas getOglas() {
		return oglas;
	}

	@JsonProperty
	public void setOglas(Oglas oglas) {
		this.oglas = oglas;
	}

	@JsonIgnore
	public Korisnik getRecenzent() {
		return recenzent;
	}

	@JsonProperty
	public void setRecenzent(Korisnik recenzent) {
		this.recenzent = recenzent;
	}

	public String getNaslovRecenzije() {
		return naslovRecenzije;
	}

	public void setNaslovRecenzije(String naslovRecenzije) {
		this.naslovRecenzije = naslovRecenzije;
	}

	public String getSadrzajRecenzije() {
		return sadrzajRecenzije;
	}

	public void setSadrzajRecenzije(String sadrzajRecenzije) {
		this.sadrzajRecenzije = sadrzajRecenzije;
	}

	public String getStringSlike() {
		return stringSlike;
	}

	public void setStringSlike(String stringSlike) {
		this.stringSlike = stringSlike;
	}

	public String getOpisIzOglasaTacan() {
		return opisIzOglasaTacan;
	}

	public void setOpisIzOglasaTacan(String opisIzOglasaTacan) {
		this.opisIzOglasaTacan = opisIzOglasaTacan;
	}

	public String getIspostovanDogovor() {
		return ispostovanDogovor;
	}

	public void setIspostovanDogovor(String ispostovanDogovor) {
		this.ispostovanDogovor = ispostovanDogovor;
	}

	public Boolean getObrisana() {
		return obrisana;
	}

	public void setObrisana(Boolean obrisana) {
		this.obrisana = obrisana;
	}

	@Override
	public String toString() {
		return "Recenzija [id=" + id + ", oglas=" + oglas + ", recenzent=" + recenzent + ", naslovRecenzije="
				+ naslovRecenzije + ", sadržajRecenzije=" + sadrzajRecenzije + ", stringSlike="
				+ stringSlike + ", opisIzOglasaTacan=" + opisIzOglasaTacan + ", ispostovanDogovor=" + ispostovanDogovor
				+ ", obrisana=" + obrisana + "]";
	}

}
