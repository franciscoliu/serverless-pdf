'use strict';

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Function is executed',
        input: event,
      },
      null,
      2
    ),
  };
};

const fs = require('fs');
const shell = require('shelljs');

const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();
//Specify on the region of AWS and handling credential problems
AWS.config.region = 'us-east-1';
var credentials = new AWS.SharedIniFileCredentials({profile: 'myspecial-profile'});
AWS.config.credentials = credentials;

//Actual function to merge pdf
const mergeFiles = async (s3Files) => {

    let filesToMerge = "";
    for(const file of s3Files) {
        const paramsFile = {
            //Not Done here
            Bucket: "<bucket-name>",
            Key: `${file}.pdf`
        };

        let readStream = await s3.getObject(paramsFile).promise();

        await fs.promises.writeFile(`/tmp/${file}.pdf`, readStream.Body);

        filesToMerge += `/tmp/${file}.pdf` + " ";
    }

    //Execute via ghostscript
    await shell.exec(`gs -dNOPAUSE -sDEVICE=pdfwrite -sOUTPUTFILE=/tmp/result.pdf -dBATCH ${filesToMerge}`);

    //Lambda function access to /tmp folder to merge files
    const fileContent = await fs.createReadStream(`/tmp/result.pdf`);

    const params = {
        //Not Done here
        Bucket: "<bucket-name>",
        Key: `results/result.pdf`,
        Body: fileContent,
        ContentType: "application/pdf"
    };
 
    const uploadResponse = await s3.upload(params).promise();
    return uploadResponse;
}

mergeFiles(["PDF_1", "PDF_2"]);
