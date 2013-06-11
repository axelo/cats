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

public class CatVotingBooth extends UntypedActor {

	private static ActorRef defaultRoom = Akka.system().actorOf(new Props(CatVotingBooth.class));

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
		Vote voteMessage = new Vote(cat);
		defaultRoom.tell(voteMessage, null);
	}
	
	private List<WebSocket.Out<JsonNode>> voters = Lists.newArrayList();

	@Override
	public void onReceive(Object message) throws Exception {
		if (message instanceof Join) {
			Join join = (Join) message;

			voters.add(join.channel);
			
			getSender().tell("OK", getSelf());
		}
		else if (message instanceof Vote) {
			Vote vote = (Vote) message;
			JsonNode catJson = Json.toJson(vote.cat);
			
			for (Out<JsonNode> voteOut : voters) {
				voteOut.write(catJson);			
			}
		}
		else if (message instanceof Quit) {
			Quit quit = (Quit) message;
			
			voters.remove(quit);
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
	
	public static class Vote {
		public final Cat cat;
		
		public Vote(Cat cat) {
			this.cat = cat;
		}
	}

}
