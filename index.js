'use strict'

var mongo = require('mongodb')

module.exports = function (obj) {
  var key, val
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) continue
    val = obj[key]
    switch (key) {
      case '$binary':
      case '$type':
        return new mongo.Binary(new Buffer(obj.$binary, 'base64').toString(), obj.$type)
      case '$date':
        return new Date(val)
      case '$timestamp':
        return new mongo.Timestamp(val.t, val.i)
      case '$regex':
      case '$options':
        return new RegExp(obj.$regex, obj.$options)
      case '$oid':
        return new mongo.ObjectID(val)
      case '$ref':
      case '$id':
      case '$db':
        var id = obj.$id._bsontype ? obj.$id : mongo.ObjectID(obj.$id.$oid)
        return new mongo.DBRef(obj.$ref, id, obj.$db)
      case '$undefined':
        return undefined
      case '$minKey':
        return new mongo.MinKey()
      case '$maxKey':
        return new mongo.MaxKey()
      case '$numberLong':
        return new mongo.Long.fromString(val) // eslint-disable-line new-cap
    }
    if (typeof val === 'object') {
      obj[key] = module.exports(val)
    }
  }
  return obj
}
