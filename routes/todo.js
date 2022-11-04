const express = require('express');
const router = express.Router();
const fs = require('fs');

const redis = require('redis');
const redis_client = redis.createClient(6379);

redis_client.on('error', (err) => console.log('Redis Client Error', err));

/* GET todo listing. */
router.get('/list', async (req, res, next) => {
  await redis_client.connect();
  const todo_list = await redis_client.LRANGE('todo', 0, 10);
  res.json(todo_list);
  await redis_client.disconnect();
});

router.post('/add', async (req, res, next) => {
  const todo = {
    'contents': '',
    'complete': false
  }
  todo.contents = req.body.contents;

  await redis_client.connect();
  await redis_client.LPUSH('todo', JSON.stringify(todo));
  res.json(true);
  await redis_client.disconnect();
});

router.post('/complete', async (req, res, next) => {
  await redis_client.connect();
  let completed_todo = await redis_client.LINDEX('todo', req.body.index);
  console.log(completed_todo);
  completed_todo = JSON.parse(completed_todo);
  completed_todo.complete = true;
  await redis_client.LSET('todo', req.body.index, JSON.stringify(completed_todo));
  res.json(true);
  await redis_client.disconnect();
});

router.post('/del', async (req, res, next) => {
  await redis_client.connect();
  await redis_client.LSET('todo', req.body.index, "DELETE");
  await redis_client.LREM('todo', 1, "DELETE");
  res.json(true);
  await redis_client.disconnect();
});

module.exports = router;
