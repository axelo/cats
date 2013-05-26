package models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import play.db.ebean.Model;

@Entity
@Table(name = "cat")
public class Cat extends Model{
	private static final long serialVersionUID = 1L;


	@Id
	public Long id;
	
	public String name;
	
	public String comment;
	
	public int score;
	
	public String pictureUrl;
	
	public static Finder<Long, Cat> find = new Finder<Long, Cat>(Long.class, Cat.class);
	
}
