package controllers

import javax.inject._

import play.api.Logger
import play.api.libs.json._
import play.api.mvc._

import scala.concurrent.{ ExecutionContext, Future }

import play.modules.reactivemongo._

// Reactive Mongo imports
import reactivemongo.api.{Cursor, QueryOpts}

// BSON-JSON conversions/collection
import reactivemongo.play.json._, collection._

// Encryption Library
import org.mindrot.jbcrypt.BCrypt

@Singleton
class SpecialController @Inject()(
  cc: ControllerComponents,
  val reactiveMongoApi: ReactiveMongoApi
  ) extends AbstractController(cc) with MongoController with ReactiveMongoComponents{

  implicit def ec: ExecutionContext = cc.executionContext

  /*
   1 Get User matching username from DB
   2 Test input password vs hashed password using BCrypt
   */
  def login() = Action(parse.json).async { request => 
    def newCollection: Future[JSONCollection] = database.map(
    _.collection[JSONCollection]("users"))

    val reqBody = request.body.as[JsObject]
    var query = Json.obj("username" -> (reqBody \ "username").as[String])
    
    // Step 1
    val cursor = newCollection.map {
      _.find(query)
      .cursor[JsObject]()
    }

    cursor
    .flatMap(_.collect[List](-1, Cursor.FailOnError[List[JsObject]]()))
    .map { list => 
      list length match {
        // Step 2
        case 1 => checkPassword(list head, (reqBody \ "password").as[String]) match {
          case true  => Ok(Json.obj("success" -> "Login Successful"))
          case false => Ok(Json.obj("denied" -> "Username and Password do not match"))
        }
        case _ => BadRequest(Json.obj("error" -> "An error is errored"))
      }
    }
  }

  def checkPassword(user: JsObject, inputPassword: String): Boolean = {
    return BCrypt.checkpw(inputPassword, user.\("password").as[JsString].value)
  }

  def createUser() = Action(parse.json).async { request => 
    def newCollection: Future[JSONCollection] = database.map(
    _.collection[JSONCollection]("users"))

    var reqBody = convertDates(request.body.as[JsObject])
    var query = Json.obj("username" -> (reqBody \ "username").as[String])
    val hashedPw = BCrypt.hashpw(
      (reqBody \ "password").as[String],
      BCrypt.gensalt()
    );
    reqBody = reqBody ++ Json.obj("password" -> hashedPw)

    val cursor = newCollection.map {
      _.find(query)
      .cursor[JsObject]()
    }

    cursor
    .flatMap(_.collect[List](-1, Cursor.FailOnError[List[JsObject]]()))
    .map { list => 
      list length match {
        case 0 => {
          newCollection.flatMap(_.insert.one(reqBody)).map { lastError =>
            Logger.debug(s"Successfully inserted with LastError: $lastError")
          }
          Created(Json.obj("message" -> "Document insert Success"))
        }
        case _ => {
          BadRequest(Json.obj("message" -> "Username already exists"))
        }
      }
    }
  }

  def convertDates( obj: JsObject ): JsObject = { 
    var obj2 = obj.as[JsObject]
    val dateKeys = obj.keys.filter(containsDate)
    dateKeys.foreach( key => {
      obj2 = obj2.as[JsObject] - key
      obj2 = obj2.as[JsObject] + (key -> Json.obj("$date" -> (obj \ key).get ))
    })
    return obj2
  }

  def containsDate( str: String): Boolean = {
    str contains "date"
  }
}




// println(Json.prettyPrint(query));