package beans;

import java.io.Serializable;
import java.util.ArrayList;

@SuppressWarnings("serial")
public class Kategorija implements Serializable{
	
	private String naziv;
	private String opis;
	private ArrayList<Oglas> listaOglasa = new ArrayList<Oglas>();
	
	private ArrayList<String> listaParametara = new ArrayList<String>();
	
	private Boolean obrisana;
	
	public Kategorija() {
		super();
		this.setObrisana(false);
	}

	public Kategorija(String naziv, String opis, ArrayList<Oglas> listaOglasa) {
		super();
		this.naziv = naziv;
		this.opis = opis;
		this.listaOglasa = listaOglasa;
		this.setObrisana(false);
	}

	public String getNaziv() {
		return naziv;
	}

	public void setNaziv(String naziv) {
		this.naziv = naziv;
	}

	public String getOpis() {
		return opis;
	}

	public void setOpis(String opis) {
		this.opis = opis;
	}

	public ArrayList<Oglas> getListaOglasa() {
		return listaOglasa;
	}

	public void setListaOglasa(ArrayList<Oglas> listaOglasa) {
		this.listaOglasa = listaOglasa;
	}

	@Override
	public String toString() {
		return "Kategorija [naziv=" + naziv + ", opis=" + opis + ", listaOglasa=" + listaOglasa + "]";
	}

	public ArrayList<String> getListaParametara() {
		return listaParametara;
	}

	public void setListaParametara(ArrayList<String> listaParametara) {
		this.listaParametara = listaParametara;
	}

	public Boolean getObrisana() {
		return obrisana;
	}

	public void setObrisana(Boolean obrisana) {
		this.obrisana = obrisana;
	}

}
