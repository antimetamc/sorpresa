app.get("/request", (req, res) => {
    const id = req.query.id || "UNKNOWN";

    const ip =
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress;

    let db = [];
    if (fs.existsSync("requests.json")) {
        db = JSON.parse(fs.readFileSync("requests.json"));
    }

    db.push({
        id,
        ip,
        userAgent: req.headers["user-agent"],
        time: new Date().toISOString()
    });

    fs.writeFileSync("requests.json", JSON.stringify(db, null, 2));

    res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Security Node</title>
<style>
body { background:black; color:#00ff88; font-family:monospace; text-align:center; padding-top:80px; }
.box { border:1px solid #00ff88; display:inline-block; padding:20px; box-shadow:0 0 15px #00ff88; }
</style>
</head>
<body>
<div class="box">
<h1>SECURITY NODE</h1>
<p>REQUEST ID: ${id}</p>
<p>IP LOGGED SUCCESSFULLY</p>
</div>
</body>
</html>
    `);
});
