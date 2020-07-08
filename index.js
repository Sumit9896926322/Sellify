const express = require('express');
const app = express();
const path = require('path');
const bodyparser = require('body-parser');

const axios = require('axios');
const hbs = require('handlebars');
const mysql = require('mysql');

const multer = require('multer');

const mysqlconn  = require('./config/sqlconn');
const port = 5000 || process.env.port;
const user = require('./routes/user');
const posts = require('./routes/posts');

const dirPath = path.join(__dirname,'public');

const viewsPath = path.join(__dirname,'views');

//setting body parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname+Date.now())
    }
  })
  
const upload = multer({ storage: storage })

mysqlconn.connect((err)=>{
    if(err)
        return console.log(err);
    console.log('DB connected succesfully');
});

app.get('/',(req,res)=>{
    res.render('addpost');
})

//setting views path and view engine
app.set('views',viewsPath);
app.set('view engine','hbs');
app.use(express.static(dirPath));
//setting default template for whole application
app.set('view options', { layout: 'layouts/main' });




//Using middleware router
app.use('/user',user);
app.use('/posts',posts);

app.listen(port);