package controllers;

import models.Cat;
import models.CatRoom;

import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.node.ObjectNode;

import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Result;
import play.mvc.WebSocket;

public class CatApi extends Controller {

	public static Result findAll() {
		return ok(Json.toJson(Cat.find.all()));
	}

	public static Result getCat(Long id) {
		Cat cat = Cat.find.byId(id);

		if (cat != null) {
			return ok(Json.toJson(cat));
		}

		return badRequest(getErrorJson("No cat found with id " + id)).as("application/json");
	}

	public static Result createCat() {
		JsonNode jsonCat = request().body().asJson();

		Cat cat = Json.fromJson(jsonCat, Cat.class);
		cat.id = null;
		cat.save();

		String url = routes.CatApi.createCat().absoluteURL(request());
		url += "/" + cat.id;

		response().setHeader(LOCATION, url);

		try {
			CatRoom.notifyAll(cat);
		} catch (Exception e) {
			return badRequest(e.getMessage());
		}
		
		return created(Json.toJson(cat));
	}

	public static Result update() {
		JsonNode jsonCat = request().body().asJson();

		Cat cat = Json.fromJson(jsonCat, Cat.class);
		cat.update();

		try {
			CatRoom.notifyAll(cat);
		} catch (Exception e) {
			return badRequest(e.getMessage());
		}

		return ok();
	}

	public static WebSocket<JsonNode> joinVoting() {
		return new WebSocket<JsonNode>() {
			@Override
			public void onReady(WebSocket.In<JsonNode> in, WebSocket.Out<JsonNode> out) {
				try {
					CatRoom.join(in, out);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		};
	}

	private static ObjectNode getErrorJson(String message) {
		ObjectNode error = Json.newObject();
		error.put("Error", message);

		return error;
	}
}
