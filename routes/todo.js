var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET todo listing. */
router.get('/list', function (req, res, next) {
  if (fs.existsSync('./todo_list.json')) {
    fs.readFile('./todo_list.json', {
      encoding: 'utf-8'
    }, function (err, list) {
      console.log(err);
      console.log(list);
      res.json(list);
    });
  } else {
    fs.writeFile('./todo_list.json', JSON.stringify({'list': []}), function (err) {
      res.json(list);
    });
  }
});

router.post('/add', function (req, res, next) {
  var todo = {
    'contents': '',
    'complete': false
  }

  todo.contents = req.body.contents;

  fs.readFile('./todo_list.json', {
    encoding: 'utf-8'
  }, function (err, data) {
    data = JSON.parse(data);
    data.list.push(todo);

    fs.writeFile('./todo_list.json', JSON.stringify(data), function (err) {
      res.json(true);
    });
  });
});

router.post('/complete', function (req, res, next) {
  fs.readFile('./todo_list.json', {
    encoding: 'utf-8'
  }, function (err, data) {
    data = JSON.parse(data);
    data.list[req.body.index].complete = true;

    fs.writeFile('./todo_list.json', JSON.stringify(data), function (err) {
      res.json(true);
    });
  });
});

router.post('/del', function (req, res, next) {
  fs.readFile('./todo_list.json', {
    encoding: 'utf-8'
  }, function (err, data) {
    data = JSON.parse(data);
    data.list[req.body.index] = null;
    data.list = data.list.filter(Boolean);

    fs.writeFile('./todo_list.json', JSON.stringify(data), function (err) {
      res.json(true);
    });
  });
});

module.exports = router;
