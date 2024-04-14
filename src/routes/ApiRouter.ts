import express from "express";

import Api from "../models/Api.ts";

const ApiRouter = express.Router();
ApiRouter.get("/addApi", async (req, res) => {
    if (req.session.user) {
        res.render('addAPI');
    } else {
        return res.redirect('/login');
    }
});

ApiRouter.delete("/api/:routeName", async (req, res) => {
    const routeName:string = req.params.routeName;
    if (req.session.user) {
        const data = await Api.findOne({userId: req.session.user._id, routeName: routeName});
        if (data) {
            await Api.deleteOne({userId: req.session.user._id, routeName: routeName});
            res.send("Data deleted");
        } else {
            res.status(400).send("Data not found");
        }
    }else {
        return res.redirect('/login');

    }
});

ApiRouter.post("/addApi", async (req, res) => {
    if (req.session.user) {
        try {
            if (!req.body.routerName || !req.body.routeData) {
                return res.status(400).send("Invalid data");
            }

            const data = req.body;
            const gkApi = await Api.findOne({ userId: req.session.user._id, routeName: data.routerName });
            if (gkApi) {
                return res.status(400).json({ message: "Data in that route already exits" });
            }
            const ds = new Api({
                userId: req.session.user._id,
                routeName: data.routerName,
                routeData: data.routeData
            });
            await ds.save();
            res.send("Data saved");
        } catch (error) {
            console.error("Error saving data:", error);
            res.status(500).send("Error saving data");
        }
    } else {
        return res.redirect('/login');
    }
});
export default ApiRouter;