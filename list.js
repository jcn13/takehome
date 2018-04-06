'use strict'

const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.list = (event, context, callback) => {	
	const obj = {
		TableName: event.pathParameters.table
	}
	dynamoDb.scan(obj, (error, result) =>{
		if(error){
			console.error("Music not found. Error: ", JSON.stringify(error, null, 2))
			return
		}
		const response = {
			statusCode: 200,
			body: JSON.stringify(result.Items)
		}
		callback(null, response)
	})
}