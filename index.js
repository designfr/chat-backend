const fs = require('fs');
const express = require('express');
const app = express();

const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/carrega-sala', (req, res) => {
    fs.readFile('dados.json', (e, r) => {
        if(e) {
            res.end({status: `erro ${e}`});
            throw e;
        } else {
            res.json(JSON.parse(r));
        }
    })
});

app.post('/salva-dados-sala', (req, res) => {
    const d = req.body.dados;
    if(d !== "" || d !== undefined) {
        fs.writeFile('dados1.json', JSON.stringify(d), (e, r) => {
            if(e) {
                res.end({status: `erro ${e}`});
                throw e;
            } else {
                res.sendStatus(200);
            }
        })
    } else {
        res.end({"erro": "dado esta vazio"})
    }
    
    
});

app.listen(port, () => console.log(`Listening on ${ port }`));