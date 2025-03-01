const express = require('express');
const PORT = 3000;

const app = express();
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

app.use('/test', (req, res) => {
    res.send('hello from the server');
});
