# serverless-pdf

Based on my understanding, the general process works like this:

1. Download the files from S3 to the /tmp folder. In this step, we need to create a function to receive a lists of filenames (possible PDF1, PDF2) that later 
we will merge from the S3 bucket. 
2. execute the lambda function to merge files. Add a lambda layer using GhostScript. Then modify serverless.yml file to specify on the 
layers and handler of the created function. (detailed can be found in package-lock.json)
3. Stored the files to /tmp folder
4. upload the result the S3 bucket. 
5. sls deploy

Side note: I used nodejs to run this so there are some packages need to be downloaded using npm install. 
