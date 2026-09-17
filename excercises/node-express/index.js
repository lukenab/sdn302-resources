import express from 'express'

const hostname = "localhost";
const port = 3000;

// Tạo ứng dụng express
const app = express();

app.use((req, res) => {
    console.log(req.headers);

    return res
    .status(200)
    .type("html")
    .send("<html><body><h1>This is an express application</h1></body></html>")
})


// Tạo http server

app.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}/`)
})