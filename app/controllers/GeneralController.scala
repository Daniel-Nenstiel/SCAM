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

  def get(
    table: String, name: String, value: String,
    offset: Int = 0, limit: Int = 0
    ) = Action.async { implicit request =>

    def newCollection: Future[JSONCollection] = database.map(
    _.collection[JSONCollection](table))

    var query = Json.obj(name -> value)
    if(isNumeric(value)){
      query = query.as[JsObject] - name 
      query = Json.obj(name -> value.toInt )
    }

    // Do query
    val cursor: Future[Cursor[JsObject]] = newCollection.map {
      //Find from 'table' where name = value check if value is a number
      _.find(query).
      cursor[JsObject]()
    }

    // Get objects in a list
    val futureList: Future[List[JsObject]] = 
      cursor.flatMap(_.collect[List](-1, Cursor.FailOnError[List[JsObject]]()))

    // Make list into array
    val futureArray: Future[JsArray] = 
      futureList.map { list => 
      if( offset == 0 && limit == 0 ) {
        Json.arr(list) 
      }
      else if( offset == 0 ) {
        Json.arr(list.take(limit))
      }
      else if( limit == 0 ) {
        Json.arr(list.drop(offset))
      }
      else {
        Json.arr(list.drop(offset).take(limit))
      }
    }

    // Return array
    futureArray.map { arr => 
      Ok(arr)
    }
  }

  def getMultiple( 
    table: String,
    offset: Int = 0, limit: Int = 0 
    ) = Action.async {
    def newCollection: Future[JSONCollection] = database.map(
    _.collection[JSONCollection](table))

    val query = Json.obj("status" -> Json.obj("$gt" -> 0) )
    // val options = new QueryOpts(offset, limit)

    val cursor: Future[Cursor[JsObject]] = newCollection.map {
      _.find(query).cursor[JsObject]()
    }

    // Get objects in a list
    val futureList: Future[List[JsObject]] = 
      cursor.flatMap(_.collect[List](-1, Cursor.FailOnError[List[JsObject]]()))

    // Make list into array
    val futureArray: Future[JsArray] = 
      futureList.map { list => 
      if( offset == 0 && limit == 0 ) {
        Json.arr(list) 
      }
      else if( offset == 0 ) {
        Json.arr(list.take(limit))
      }
      else if( limit == 0 ) {
        Json.arr(list.drop(offset))
      }
      else {
        Json.arr(list.drop(offset).take(limit))
      }
    } 

    // Return array
    futureArray.map { arr => 
      Ok(arr)
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

  def put( table: String, id: String ) = Action(parse.json) { request => 
    def newCollection: Future[JSONCollection] = database.map(
    _.collection[JSONCollection](table))
    
    var reqBody = convertDates(request.body.as[JsObject])
    
    val selector = Json.obj("_id" -> Json.obj("$oid" -> id))

    newCollection.flatMap(_.update(ordered = false).one(selector , reqBody).map { lastError =>
      Logger.debug(s"Successfully inserted with LastError: $lastError")
    })

    Ok(Json.obj("Updated"-> "Object created properly"))
  }

  def isNumeric(input: String): Boolean = input.forall(_.isDigit)

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

/* Not used right now
request.queryString.map { case (k,v) => k -> v.mkString }
*/
  def buildQueryOptions( queryMap: Map[String, String] ) = {
    if( queryMap isEmpty ) { println("empty") }
    else {
      var jsonQuery = Json.obj("placeholder" -> JsNull)
      queryMap foreach{ 
        case ("offset", value)  => 
          jsonQuery = jsonQuery.as[JsObject] ++ Json.obj("offset" -> value.toInt)
        case ("limit", value)   => 
          jsonQuery = jsonQuery.as[JsObject] ++ Json.obj("limit" -> value.toInt)
        case ("checksum", value)   => 
          jsonQuery = jsonQuery.as[JsObject] ++ Json.obj("checksum" -> value.toInt)
        case ("lock", value)   => 
          jsonQuery = jsonQuery.as[JsObject] ++ Json.obj("lock" -> value.toInt)
        case ("force_null", value)   => 
          jsonQuery = jsonQuery.as[JsObject] ++ Json.obj("force_null" -> value.toInt)
      }

      // println(Json.prettyPrint(jsonQuery))
    }
  }
}
