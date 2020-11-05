import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import { exception } from 'console';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req, res) => {
    const { image_url } = req.query

    // 1. validate the image_url query
    if (!image_url) {
      res.status(400).send('Please, send a valid url')
    }

    try {

      // 2. call filterImageFromURL(image_url) to filter the image
      var imageFiltered = await filterImageFromURL(image_url);

      // 3. send the resulting file in the response
      res.status(200).sendFile(imageFiltered);

      res.on('finish', function () {
        // 4. deletes any files on the server on finish of the response
        deleteLocalFiles([imageFiltered])

      });

    } catch (err) {
      res.status(422).send('Processing failed, please try again')
    }

  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();