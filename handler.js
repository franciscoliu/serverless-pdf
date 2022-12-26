'use strict';

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

const fs = require('fs');
const shell = require('shelljs');

const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();
AWS.config.region = 'us-east-1';
var credentials = new AWS.SharedIniFileCredentials({profile: 'myspecial-profile'});
AWS.config.credentials = credentials;

const mergeFiles = async (s3Files) => {

    let filesToMerge = "";
    for(const file of s3Files) {
        const paramsFile = {
            Bucket: "<bucket-name>",
            Key: `${file}.pdf`
        };

        let readStream = await s3.getObject(paramsFile).promise();

        await fs.promises.writeFile(`/tmp/${file}.pdf`, readStream.Body);

        filesToMerge += `/tmp/${file}.pdf` + " ";
    }


    await shell.exec(`gs -dNOPAUSE -sDEVICE=pdfwrite -sOUTPUTFILE=/tmp/result.pdf -dBATCH ${filesToMerge}`);

    const fileContent = await fs.createReadStream(`/tmp/result.pdf`);

    const params = {
        Bucket: "<bucket-name>",
        Key: `results/result.pdf`,
        Body: fileContent,
        ContentType: "application/pdf"
    };

    const uploadResponse = await s3.upload(params).promise();

    return uploadResponse;
}

mergeFiles(["PDF_1", "PDF_2"]);
