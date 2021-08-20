const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
const fs = require('fs');
const NodeCache = require("node-cache");
const templateCache = new NodeCache({ stdTTL: 60 * 5, checkperiod: 120 });
const account = process.env.DOCUMENTS_BLOB_ACCOUNT;
const containerName = process.env.CONTAINER_TEMPLATE;
const key = process.env.DOCUMENTS_BLOB_KEY;

module.exports = {
	get: async function(template, buffer){
		try {
	      var tmpl = templateCache.get(template);
	      
	      if (tmpl) {
	        return tmpl;
	      } else {
	        let downloaded = '';
	        if (process.env.NODE_ENV === "production") {
	          if (!account || !key || !containerName) {
	            console.log("Error en la configuracion de variables de entorno - Revisar ConfigMap y Secrets de Kubernetes");
	          }

	          const sharedKeyCredential = new StorageSharedKeyCredential(
	            account,
	            key
	          );

	          const blobServiceClient = new BlobServiceClient(
	            `https://${account}.blob.core.windows.net`,
	            sharedKeyCredential
	          );

	          const containerClient = blobServiceClient.getContainerClient(
	            containerName
	          );

	          if (await containerClient.exists(template)) {
	            const blobClient = containerClient.getBlobClient(template);

	            if (typeof buffer != 'undefined' && buffer) {
	              	downloaded = blobClient.downloadToBuffer();
	            } else {
	              	downloaded = (await blobClient.downloadToBuffer()).toString(
	                	"base64"
	              	);
	            }
	          }
	        } else {
	          var fileName = `${containerName}/${template}`;

	          if (fs.existsSync(fileName))
	          {
	            if (typeof buffer != 'undefined' && buffer) {
	              downloaded = fs.readFileSync(fileName);
	            } else {
	              downloaded = fs.readFileSync(fileName).toString("base64");
	            }
	          }
	          else {
	          	throw new Error('File does not exist');
	          }
	        }

	        this.set(template, downloaded);

	        return downloaded;
	      }
	    } catch (error) {
	    	let returnError = error;
	    	if(error.statusCode == 404)
	    	{
	    		returnError = new Error('File not found: '+ template);
	    	}
	      return returnError;
	    }
	}
}
