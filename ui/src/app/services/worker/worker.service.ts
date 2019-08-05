import { Injectable } from '@angular/core';
import { isObject } from 'util';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {

  constructor() { }

  convertFromDatabase(obj: Object): Object {
    let returnObj = {}
    let strArr: string[]
    let str: string = "str"
    Object.keys(obj).forEach( key  => {
      if(isObject(obj[key])){
        returnObj[this.generateCamelCase(key)] = this.convertFromDatabase(obj[key])
      }
      else {
        returnObj[this.generateCamelCase(key)] = obj[key]
      }
    });

    return returnObj;
  }

  convertToDatabase(obj: Object): Object {
    let returnObj = {}
    let strArr: string[]
    let str: string = "str"
    Object.keys(obj).forEach( key  => {
      if(isObject(obj[key])){
        returnObj[this.generateKebabCase(key)] = this.convertToDatabase(obj[key])
      }
      else {
        returnObj[this.generateKebabCase(key)] = obj[key]
      }
    });

    return returnObj;
  }

  private generateCamelCase(string) {
    let strArr = string.split('-')
    if( strArr.length > 1) {
      let newString = strArr.shift()
      strArr = strArr.map( member => {
        return member.charAt(0).toUpperCase() + member.slice(1)
      })        

      newString += strArr.join('')

      return newString;
    }
    else return string
  }

  private generateKebabCase(string) {
    let strArr = string.split(/(?=[A-Z])/);
    strArr = strArr.map(member => member.toLowerCase() )
    return strArr.join('-')
  }

  deleteEmptyAndNull(object: Object) {
    Object.keys(object).forEach( key => {
      if( typeof( object[key] ) === 'object' ) {
        this.deleteEmptyAndNull(object[key])
      }
      else {
        if( object[key] === null ) delete object[key];
        else if (object[key] === '' ) delete object[key];
      }
    })
  }
}
