import express, { Router, Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  app.get("/filteredimage/", (req: Request, res: Response) => {
    let { image_url } = req.query;

    //    1. validate the image_url query
    if (!image_url) {
      return res.status(400).send(`image_url is required`);
    }

    const imageUrlRegex = /(http(s?):)(.)*\.(?:jpg|gif|png)/;
    const isImageUrl = imageUrlRegex.test(image_url);

    if (!isImageUrl) {
      return res.status(400).send(`url must be for an image`);
    }

    //    2. call filterImageFromURL(image_url) to filter the image
    const filteredPathPromise: Promise<string> = filterImageFromURL(image_url);

    filteredPathPromise.then(filteredPath => {
      //    4. deletes any files on the server on finish of the response
      res.on("finish", function() {
        deleteLocalFiles([filteredPath]);
      });
      //    3. send the resulting file in the response
      return res.status(200).sendFile(filteredPath);
    });
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
