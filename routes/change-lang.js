const express = require('express');
const router = express.Router();

router.get('/:locale', (req, res) => {

    const locale = req.params.locale;

    res.cookie('nodepop-lang', locale, { maxAge: 60 * 60 * 60 * 60 });

    res.redirect(req.get('referer'));
});

module.exports = router;