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
    if(!selectedRouter) return res.send("Router not found");

    const conn = new RouterOSClient({
        host: selectedRouter.host,
        user: selectedRouter.user,
        password: selectedRouter.password
    });

    try {
        await conn.connect();

        // Replace with real API commands
        if(action === 'enable'){
            // await conn.menu('/tool/user-manager/user/add').call({username: voucher});
        } else if(action === 'disable'){
            // await conn.menu('/tool/user-manager/user/disable').call({numbers: voucher});
        } else if(action === 'reset'){
            // await conn.menu('/tool/user-manager/user/reset-counters').call({numbers: voucher});
        } else if(action === 'search'){
            // Search command placeholder
        }

        await conn.close();
        res.send(`Action '${action}' executed for voucher '${voucher}' on ${router}`);
    } catch(err) {
        console.log(err);
        res.send("Error: " + err);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port " + port));
