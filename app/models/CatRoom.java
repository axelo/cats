package models;

import static akka.pattern.Patterns.ask;
import static java.util.concurrent.TimeUnit.SECONDS;

import java.util.List;

import org.codehaus.jackson.JsonNode;

import play.libs.Akka;
import play.libs.F.Callback0;
import play.libs.Json;
import play.mvc.WebSocket;
import play.mvc.WebSocket.Out;
import scala.concurrent.Await;
import scala.concurrent.Future;
import scala.concurrent.duration.Duration;
import akka.actor.ActorRef;
import akka.actor.Props;
import akka.actor.UntypedActor;

import com.google.common.collect.Lists;

public class CatRoom extends UntypedActor {

	static ActorRef defaultRoom = Akka.system().actorOf(new Props(CatRoom.class));

	public static void join(WebSocket.In<JsonNode> in, final WebSocket.Out<JsonNode> out) throws Exception {
		Join joinMessage = new Join(out);

		Future<Object> joinQuestion = ask(defaultRoom, joinMessage, 1000);

		String result = (String) Await.result(joinQuestion, Duration.create(1, SECONDS));

		if ("OK".equals(result)) {
			
			in.onClose(new Callback0() {
				@Override
				public void invoke() throws Throwable {
					Quit quitMessage = new Quit(out);
					
					defaultRoom.tell(quitMessage, null);
				}
			});

		} else {
			throw new IllegalArgumentException("Unexpected result: " + result);
		}
	}

	public static void notifyAll(Cat cat) throws Exception {
		Update updateMessage = new Update(cat);
		
		Future<Object> updateQuestion = ask(defaultRoom, updateMessage, 5000);
		
		Await.result(updateQuestion, Duration.create(5, SECONDS));
	}
	
	private List<WebSocket.Out<JsonNode>> members = Lists.newArrayList();

	@Override
	public void onReceive(Object message) throws Exception {
		if (message instanceof Join) {
			Join join = (Join) message;

			members.add(join.channel);
			
			getSender().tell("OK", getSelf());
		}
		else if (message instanceof Update) {
			Update update = (Update) message;
			JsonNode catJson = Json.toJson(update.cat);
			
			for (Out<JsonNode> memberOut : members) {
				memberOut.write(catJson);			
			}
			
			getSender().tell("OK", getSelf());
		}
		else if (message instanceof Quit) {
			Quit quit = (Quit) message;
			
			members.remove(quit);
		}
	}

	public static class Join {
		public final WebSocket.Out<JsonNode> channel;

		public Join(WebSocket.Out<JsonNode> channel) {
			this.channel = channel;
		}
	}

	public static class Quit {
		public final WebSocket.Out<JsonNode> channel;

		public Quit(WebSocket.Out<JsonNode> channel) {
			this.channel = channel;
		}
	}
	
	public static class Update {
		public final Cat cat;
		
		public Update(Cat cat) {
			this.cat = cat;
		}
	}

}
