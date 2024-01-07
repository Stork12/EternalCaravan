const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// キャラシートの保存処理
app.post('/save-charasheet', (req, res) => {
    const data = req.body;
    const filePath = `./CharaS/${data.name}.json`;

    // キャラシートのJSONファイルを保存
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving the charasheet');
        }
        res.send('Charasheet saved successfully');
    });
});

// キャラシートの編集処理
app.post('/edit-charasheet', (req, res) => {
    const data = req.body;
    const filePath = `./CharaS/${data.name}.json`;

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Charasheet not found');
    }

    fs.readFile(filePath, 'utf8', (err, fileData) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading the charasheet');
        }
        const existingData = JSON.parse(fileData);
        if (data.password !== existingData.password) {
            return res.status(401).send('Unauthorized: Incorrect password');
        }

        delete data.password; // パスワードは保存しない
        fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error updating the charasheet');
            }
            res.send('Charasheet updated successfully');
        });
    });
});

// サーバーの起動
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
