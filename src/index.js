import * as dotenv from 'dotenv'
import express from "express";
import axios from "axios";

dotenv.config()
const PORT = process.env.PORT || 3000;
const app = express();


app.get('/:uri.json', async (req,res)=>{
    const resp = await axios({
        method: "post",
        url: process.env.LBRYNET,
        data: {
            method: "get",
            "params": {
                "uri": req.params.uri,
            }
        }
    });
    res.json(resp.data)
})

app.get('/:uri', async (req,res)=>{
    const resp = await axios({
        method: "post",
        url: process.env.LBRYNET,
        data: {
            method: "get",
            "params": {
                "uri": req.params.uri,
            }
        }
    });
    res.send(`
        <video width="1280" height="720" autoplay controls>
            <source src="${"/stream/" + resp.data.result.sd_hash}" type="video/mp4">
            Your browser does not support the video tag.
        </video>`)
})

app.get('/stream/:hash', async (req,res)=>{
    let blob = await axios({
        method: "post",
        url: process.env.LBRYNET,
        data: {
            method: "blob_get",
            "params": {
                "blob_hash": req.params.hash,
            }
        }
    });

    blob = blob.data.result.split(' ')[2]
    console.log(blob)

    //apiProxy(req,res)
    res.redirect(process.env.LBRYNET_STREAM + "stream/" + blob);
});

app.listen(PORT, (err)=>{
    console.log(err||"Started")
})