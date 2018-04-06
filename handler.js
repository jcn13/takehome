'use strict';

const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.create = (event, context, callback) => { 
  const bucket = event['Records'][0]['s3']['bucket']['name']
  const filename = event['Records'][0]['s3']['object']['key']
  const ts = event['Records'][0]['eventTime']
  const timestamp = new Date().getTime()
  const obj = {
    TableName: 'musics',
    Item: {
      fileId: timestamp.toString(),
      name: filename,
      date: ts
    }  
  }
  dynamoDb.put(obj, (error) =>{
    if(error){
      console.error(error)
      callback(null, { statusCode: 400, body: JSON.stringify(error) })
      return
    }
    const response = {
      statusCode: 200,
      body: JSON.stringify(obj.Item)
    }
    callback(null, response)
  })
}
module.exports.scan = (event, context, callback) => {
  const obj = {
    TableName: 'musics',
    ExpressionAttributeValues:{
      ":name": event.pathParameters.name
    },
    ExpressionAttributeNames:{
      "#name":"name"
    },
    FilterExpression: 'contains(#name, :name)'
  }
  dynamoDb.scan(obj, (error, result) =>{
    if(error){
      console.error("Music not found. Error: ", JSON.stringify(error, null, 2))
      return
    }
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: result
      })
    }
    callback(null, response)
  })
}
module.exports.playlist = (event, context, callback) => {
  const data = JSON.parse(event.body)
  const timestamp = new Date().getTime()
  if(typeof data.musics !== 'string'){
    console.error('Validation Failed')
    callback(new Error('Couldn\'t create the playlist.'))
    return
  }
  const obj = {
    TableName: 'playlists',
    Item: {
      fileId: timestamp.toString(),
      name: event.pathParameters.name,
      musics: data.musics
    }  
  }
  dynamoDb.put(obj, (error) =>{
    if(error){
      console.error(error)
      callback(null, { statusCode: 400, body: JSON.stringify(error) })
      return
    }
    const response = {
      statusCode: 200,
      body: JSON.stringify(obj.Item)
    }
    callback(null, response)
  })
}