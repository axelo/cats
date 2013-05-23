package models;

import javax.persistence.Id;

public class Cat {

	@Id
	public long id;
	
	public String name;
	
	public String comment;
	
	public int score;
	
	public String pictureUrl;
	
}
