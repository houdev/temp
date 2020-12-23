'use strict'

const mongodb = use('mongodb')
const fs = use('fs');
//const url = 'mongodb://localhost:27017';
const url = 'mongodb+srv://adonis:adonis@cluster0.xc9zp.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'test';

class MongodbController {
  index({ request, response }){

    // Create a new MongoClient
    const client = new mongodb.MongoClient(url);

    // Use connect method to connect to the Server
    client.connect(function(err) {
      console.log(err)
      console.log("Connected successfully to server");

      const db = client.db(dbName);

      let bucket = new mongodb.GridFSBucket(db);

      fs.createReadStream('./sky.jpeg').
      pipe(bucket.openUploadStream('sky.jpeg')).
      on('error', function(error) {
        console.log(error)
        response.json({
          error
        })
      }).
      on('finish', function() {
        console.log('done!');
        response.json({
          msg: 'done!'
        })
      });
    });

  }


  async getFile({ request, response }){
    response.header("accept-ranges", "bytes");

    // Create a new MongoClient
    const client = new mongodb.MongoClient(url);

    // Use connect method to connect to the Server
    await client.connect(async function(err) {

      console.log(err)
      console.log("Connected successfully to server");

      const db = client.db(dbName);

      let bucket = new mongodb.GridFSBucket(db);

      bucket.openDownloadStreamByName('sky.jpeg').
      pipe(fs.createWriteStream('./output.jpeg')).
      on('error', function(error) {
        console.log(error)
      }).
      on('end', function() {
        console.log('done!');
      });

      // let downloadStream = bucket.openDownloadStream('5fe33ba8cedaa00624e66886')
      //
      //
      // let data = []
      //  await downloadStream.on("data", chunk => {
      //    console.log(chunk)
      //   data[data.length].push(chunk)
      // })
      //
      // downloadStream.on("error", () => {
      //   response.status(404)
      // })
      //
      // downloadStream.on("end", () => {
      //   response.send(data)
      // })

    })
    }
}

module.exports = MongodbController
