const express = require('express');
const bodyParser = require('body-parser');
const { RouterOSClient } = require('node-routeros');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const routers = [
    { name: "Router1", host: "149.71.39.44", user: "Tanzeel", password: "@Tanzeel1122" },
    { name: "Router2", host: "MIKROTIK_IP_2", user: "admin", password: "PASSWORD2" },
    { name: "Router3", host: "MIKROTIK_IP_3", user: "admin", password: "PASSWORD3" }
];

app.post('/action', async (req, res) => {
    const { router, voucher, action } = req.body;

    const selectedRouter = routers.find(r => r.name === router);
    if (!selectedRouter) return res.send("Router not found");

    const conn = new RouterOSClient({
        host: selectedRouter.host,
        user: selectedRouter.user,
        password: selectedRouter.password,
        port: 8728 // important
    });

    try {
        await conn.connect();

        if (action === 'enable') {
            await conn.write('/ip/hotspot/user/enable', [
                '=numbers=' + voucher
            ]);
        } 
        else if (action === 'disable') {
            await conn.write('/ip/hotspot/user/disable', [
                '=numbers=' + voucher
            ]);
        } 
        else if (action === 'reset') {
            await conn.write('/ip/hotspot/user/reset-counters', [
                '=numbers=' + voucher
            ]);
        } 
        else if (action === 'search') {
            const result = await conn.write('/ip/hotspot/user/print', [
                '?name=' + voucher
            ]);
            await conn.close();
            return res.send(JSON.stringify(result));
        }

        await conn.close();
        res.send(`Action ${action} done on ${voucher}`);
    } catch (err) {
        console.log(err);
        res.send("Error: " + err.message);
    }
});
