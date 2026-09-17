import app from './app.js'

const hostname = "localhost";
const port = 3000;

app.listen(3000, "localhost", () => {
    console.log(`Server is running at http://${hostname}:${port}`)
})