# serverless-pdf

Based on my understanding, the general process works like this:

1. Creating a new serverless project.
2. Download the files from S3 to the /tmp folder. In this step, we need to create a function to receive a lists of filenames (possible PDF1, PDF2) that later 
we will later merge from the S3 bucket. Then, the function will retrieve each file and store in /tmp folder
3. Add a lambda layer using GhostScript. Then modify serverless.yml file to specify on the 
layers and handler of the created function. (detailed can be found in package-lock.json)
4. Merged the files to /tmp folder
5. Upload the result the S3 bucket. 
6. sls deploy

Side note: I used nodejs to run this so there are some packages need to be downloaded using npm install. I did not upload node-module to github because
there are too many files.
