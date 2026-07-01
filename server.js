const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// PAGE
app.get("/request", (req, res) => {
    const id = req.query.id || "UNKNOWN";

    res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Security Node</title>
<style>
body {
    background: black;
    color: #00ff88;
    font-family: monospace;
    text-align: center;
    padding-top: 80px;
}

.box {
    border: 1px solid #00ff88;
    display: inline-block;
    padding: 20px;
    box-shadow: 0 0 15px #00ff88;
}

h1 {
    text-shadow: 0 0 10px #00ff88;
}
</style>
</head>
<body>

<div class="box">
    <h1>IP REQUEST SYSTEM</h1>
    <p>REQUEST ID: <b>${id}</b></p>
    <p>STATUS: CONNECTING...</p>
</div>

<script>
fetch("/log?id=${id}");
</script>

</body>
</html>
    `);
});

// LOG SYSTEM
app.get("/log", (req, res) => {
    const id = req.query.id;

    const ip =
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress;

    const entry = {
        id,
        ip,
        userAgent: req.headers["user-agent"],
        time: new Date().toISOString()
    };

    let db = [];
    if (fs.existsSync("requests.json")) {
        db = JSON.parse(fs.readFileSync("requests.json"));
    }

    db.push(entry);

    fs.writeFileSync("requests.json", JSON.stringify(db, null, 2));

    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log("IP Request System running on port " + PORT);
});
