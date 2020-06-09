package beans;

import java.io.Serializable;

@SuppressWarnings("serial")
public class Poruka implements Serializable{
	
	String id;
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	String nazivOglasa;
	String posiljalac;
	String primalac;
	
	String naslovPoruke;
	String sadrzajPoruke;
	String datumVremePoruke;
	
	Boolean obrisana;
	Boolean mozeDaOdgovori;
	
	public Poruka() {
		super();
	}

	public Poruka(String nazivOglasa, String posiljalac, String primalac, String naslovPoruke, String sadrzajPoruke,
			String datumVremePoruke, Boolean obrisana, Boolean mozeDaOdgovori) {
		super();
		this.nazivOglasa = nazivOglasa;
		this.posiljalac = posiljalac;
		this.primalac = primalac;
		this.naslovPoruke = naslovPoruke;
		this.sadrzajPoruke = sadrzajPoruke;
		this.datumVremePoruke = datumVremePoruke;
		this.obrisana = obrisana;
		this.mozeDaOdgovori = mozeDaOdgovori;
	}

	public String getNazivOglasa() {
		return nazivOglasa;
	}

	public void setNazivOglasa(String nazivOglasa) {
		this.nazivOglasa = nazivOglasa;
	}

	public String getPosiljalac() {
		return posiljalac;
	}

	public void setPosiljalac(String posiljalac) {
		this.posiljalac = posiljalac;
	}

	public String getPrimalac() {
		return primalac;
	}

	public void setPrimalac(String primalac) {
		this.primalac = primalac;
	}

	public String getNaslovPoruke() {
		return naslovPoruke;
	}

	public void setNaslovPoruke(String naslovPoruke) {
		this.naslovPoruke = naslovPoruke;
	}

	public String getSadrzajPoruke() {
		return sadrzajPoruke;
	}

	public void setSadrzajPoruke(String sadrzajPoruke) {
		this.sadrzajPoruke = sadrzajPoruke;
	}

	public String getDatumVremePoruke() {
		return datumVremePoruke;
	}

	public void setDatumVremePoruke(String datumVremePoruke) {
		this.datumVremePoruke = datumVremePoruke;
	}

	public Boolean getObrisana() {
		return obrisana;
	}

	public void setObrisana(Boolean obrisana) {
		this.obrisana = obrisana;
	}

	public Boolean getMozeDaOdgovori() {
		return mozeDaOdgovori;
	}

	public void setMozeDaOdgovori(Boolean mozeDaOdgovori) {
		this.mozeDaOdgovori = mozeDaOdgovori;
	}

	@Override
	public String toString() {
		return "Poruka [nazivOglasa=" + nazivOglasa + ", posiljalac=" + posiljalac + ", primalac=" + primalac
				+ ", naslovPoruke=" + naslovPoruke + ", sadrzajPoruke=" + sadrzajPoruke + ", datumVremePoruke="
				+ datumVremePoruke + ", obrisana=" + obrisana + ", mozeDaOdgovori=" + mozeDaOdgovori + "]";
	}
}
