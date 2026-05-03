import { Router, type IRouter } from "express";
import healthRouter from "./health";
import critiqueRouter from "./critique";
import ttsRouter from "./tts";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(critiqueRouter);
router.use(ttsRouter);
router.use(adminRouter);

export default router;
