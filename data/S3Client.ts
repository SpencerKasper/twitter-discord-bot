import AWS from 'aws-sdk';
import * as fs from 'fs';

export class S3Client {
    private static s3 = new AWS.S3({ apiVersion: '2006-03-01' });

    static upload(username, jsonString) {
        // Set the region 
        AWS.config.update({ region: 'us-east-2' });

        // call S3 to retrieve upload file to specified bucket
        var uploadParams = { Bucket: "gamble-bot", Key: `${username}`, Body: jsonString };
        var file = process.argv[3];

        // Configure the file stream and obtain the upload parameters
        var fileStream = fs.createReadStream(file);
        fileStream.on('error', function(err) {
            console.log('File Error', err);
        });
        uploadParams.Body = fileStream;
        var path = require('path');
        uploadParams.Key = path.basename(file);

        // call S3 to retrieve upload file to specified bucket
        this.s3.upload(uploadParams, function(err, data) {
            if (err) {
                console.log("Error", err);
            }
            if (data) {
                console.log("Upload Success", data.Location);
            }
        });
    }
}