const express = require('express');

const router = express.Router();

const problemRouter = require('./problems');

router.get('/', (req, res) => {
    return res.json({
        message: 'This is API interface',
    });
});

router.use('/problems', problemRouter);

module.exports = router;
