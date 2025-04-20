import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";

const express = require("express");
var cors = require("cors");
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post("/render", async (req, res) => {
  // TODO: Load this once
  const bundleLocation = await bundle({
    entryPoint: path.resolve("../src/index.ts"),
    // If you have a webpack override in remotion.config.ts, pass it here as well.
    webpackOverride: (config) => config,
  });
  const compositionId = "rhymedLyrics";

  console.log("req,", req.body);

  const inputProps = req.body;

  // Get the composition you want to render. Pass `inputProps` if you
  // want to customize the duration or other metadata.
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: compositionId,
    inputProps,
  });

  console.log("Composition selected:", composition);

  // Render the video. Pass the same `inputProps` again
  // if your video is parametrized with data.
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: `out/${compositionId}.mp4`,
    inputProps,
    onProgress: ({ progress }) => {
      console.log(`Rendering is ${progress * 100}% complete`);
    },
  });

  console.log("Render done");

  return res.status(200).json({
    success: true,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
