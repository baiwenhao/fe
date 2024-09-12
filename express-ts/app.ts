
import Express from 'express'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
let app = Express();
let PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
    console.log(req)
    res.send('hello');
});

app.set('port', PORT);

app.listen(app.get('port'), function () {
    console.log('start');
});
