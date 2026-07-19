import express from "express";
import Result from "../model/Result.js";

const router = express.Router();


// =============================
// GET ALL AVAILABLE SESSIONS
// =============================

router.get(
  "/sessions",
  async (req, res) => {

    try {

      const sessions =
        await Result.distinct("session");

      res.json(sessions);

    }

    catch (err) {

      res.status(500).json({
        message: err.message
      });

    }

  }
);



// =============================
// SEARCH RESULT
// =============================

router.get(
  "/:session/:registrationNo",
  async (req, res) => {

    try {

      const result =
        await Result.findOne({

          session:
            req.params.session,

          registrationNo:
            req.params.registrationNo

        });

      if (!result) {

        return res.status(404).json({
          message: "Result not found"
        });

      }

      res.json(result);

    }

    catch (err) {

      res.status(500).json({
        message: err.message
      });

    }

  }
);


export default router;