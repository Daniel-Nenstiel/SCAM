package controllers

import javax.inject._

import play.api.Logger
import play.api.libs.json._
import play.api.mvc._

import scala.concurrent.{ ExecutionContext, Future }

import play.modules.reactivemongo._

// Reactive Mongo imports
import reactivemongo.api.Cursor

// BSON-JSON conversions/collection
import reactivemongo.play.json._, collection._

@Singleton
class GeneralController @Inject()(
  cc: ControllerComponents,
  val reactiveMongoApi: ReactiveMongoApi
  ) extends AbstractController(cc) with MongoController with ReactiveMongoComponents{

  implicit def ec: ExecutionContext = cc.executionContext

  def getTest = Action {
    Ok(
      Json.obj(
        "primary" -> "This is not content",
        "secondary" -> "this is secondary",
        "tertiary" -> 1,
        "quaternary" -> JsNull,
        "quinary" -> JsObject( Seq( "5.1" -> JsNumber(51), "5.2" -> JsString("5.2.1") ) ),
        "senary" -> JsArray(
          IndexedSeq(
            JsObject( Seq ( "6.1"-> JsNumber(6) ) ),
            JsObject( Seq ("6.2"-> JsNumber(6.1) ) )
          )
        ),
        "septenary" -> Json.arr(
          Json.obj("7.1" -> 7),
          Json.obj("7.2" -> 7)
        )
      )
    )
  }

  def get( table: String, name: String, value: String ) = Action.async { 
    def newCollection: Future[JSONCollection] = database.map(
    _.collection[JSONCollection](table))
    
    // Do query
    val cursor: Future[Cursor[JsObject]] = newCollection.map {
      //Find from 'table' where name = value check if value is a number
      if(isNumeric(value)){
        _.find(Json.obj(name -> value.toInt)).
        cursor[JsObject]()        
      }
      else{
        _.find(Json.obj(name -> value)).
        cursor[JsObject]()
      }
    }

    // Get objects in a list
    val futureList: Future[List[JsObject]] = 
      cursor.flatMap(_.collect[List](-1, Cursor.FailOnError[List[JsObject]]()))

    // Make list into array
    val futureArray: Future[JsArray] = 
      futureList.map { list => Json.arr(list) }

    // Return array
    futureArray.map { list => 
      Ok(list)
    }
  }

  def getMultiple( table: String ) = Action.async {
    def newCollection: Future[JSONCollection] = database.map(
    _.collection[JSONCollection](table))

    val query = Json.obj("status" -> Json.obj("$gt" -> 0) )

    val cursor: Future[Cursor[JsObject]] = newCollection.map {
      _.find(query).cursor[JsObject]()
    }

    // Get objects in a list
    val futureList: Future[List[JsObject]] = 
      cursor.flatMap(_.collect[List](-1, Cursor.FailOnError[List[JsObject]]()))

    // Make list into array
    val futureArray: Future[JsArray] = 
      futureList.map { list => Json.arr(list) }

    // Return array
    futureArray.map { list => 
      Ok(list)
    }
  }

  def post( table: String ) = Action(parse.json) { request => 
    def newCollection: Future[JSONCollection] = database.map(
    _.collection[JSONCollection](table))
    
    val reqBody = convertDates(request.body.as[JsObject])

    newCollection.flatMap(_.insert.one(reqBody)).map { lastError =>
      Logger.debug(s"Successfully inserted with LastError: $lastError")
    }

    Created(Json.obj("message" -> "Document insert Success"))
  }

  def put( table: String ) = Action(parse.json) { request => 
    Ok(Json.obj("message"-> "made it"))
  }

  def isNumeric(input: String): Boolean = input.forall(_.isDigit)

  def convertDates( obj: JsObject ): JsObject = { 
    var obj2 = obj.as[JsObject]
    val dateKeys = obj.keys.filter(containsDate)
    dateKeys.foreach( key => {
      obj2 = obj2.as[JsObject] - key
      obj2 = obj2.as[JsObject] + (key -> Json.obj("$date" -> (obj \ key).get ))
      println(Json.prettyPrint(obj2))
    })
    return obj2
  }

  def containsDate( str: String): Boolean = {
    str contains "date"
  }
}


