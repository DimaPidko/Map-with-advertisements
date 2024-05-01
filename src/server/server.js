const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();
    server.use(bodyParser.json());
    server.use(express.static('public'));

    server.get('/data', (req, res) => {
        fs.readFile('data.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.json(JSON.parse(data));
        });
    });

    server.post('/marker', (req, res) => {
        fs.readFile('data.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
            }

            const markers = JSON.parse(data);
            const newMarker = req.body;

            markers.push(newMarker);

            fs.writeFile('data.json', JSON.stringify(markers, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                res.status(200).send('Marker added successfully');
            });
        });
    });

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
});
