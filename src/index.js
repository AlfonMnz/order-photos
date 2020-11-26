require('dotenv').config();
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

function readFolder(folder) {
    let filesInFolder = [];
    fs.readdirSync(folder).forEach(file => {
        let fullPath = path.join(folder, file);
        filesInFolder.push({file: file, fullPath: fullPath});
    });
    return filesInFolder;
}

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/images', express.static(process.env.URL_FOLDER_READ));

app.listen(process.env.PORT || '3000', () => {
    console.log('Server [RUN]');
})

app.get('/', function (req, res) {
    let arrayFiles = readFolder(process.env.URL_FOLDER_READ);
    let arrayFolders = readFolder(process.env.URL_FOLDER_DEST)
    res.render('pages/index',{
        files: arrayFiles,
        folders: arrayFolders
    });
})

app.post('/changeFile', function (req, res){
    console.log(req.body)
    let name = req.body.img.split('\\').pop();
    fs.copyFileSync(req.body.img, `${req.body.path}/${name}`);
    res.json({status: 'OK'}).status(200)
})
