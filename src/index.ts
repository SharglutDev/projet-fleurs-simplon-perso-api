import express from "express";
import * as dotenv from "dotenv";
import * as path from "path";
import { AppDataSource } from "./data-source";
import plantRouter from "./routes/PlantRoute";
import cors from "cors";

dotenv.config({ path: ".env.local" });

AppDataSource.initialize()
  .then(async () => {
    // ***** Init Express *****
    const app = express();
    const port = process.env.PORT || 8080;

    // ***** cors config *****
    const corsOptions = {
      origin: "http://localhost:3000",
      methods: "GET, POST, OPTIONS, PUT, PATCH, DELETE",
      allowedHeaders: "X-Requested-With,content-type",
    };
    app.use(cors(corsOptions));

    // ***** json parser *****
    app.use(express.json());

    // ***** static assets folder
    app.use(
      "/assets",
      express.static(path.join(__dirname, "../public/assets"))
    );

    // ***** Data Routes *****
    app.use("/api/v1/plants", plantRouter);

    // **** Port config
    app.listen(port, () => {
      console.log(
        `Server running on port ${port}, Open http://localhost:${port} to see results`
      );
    });
  })
  .catch((error) => console.log(error));
