'use strict';

const i18n = require('i18n');
const path = require('path');

const i18nConfiguration = () => {
    i18n.configure({
        locales: ['en', 'es'],
        directory: path.join(__dirname, '..', 'locales'),
        defaultLocale: 'en',
        autoReload: true,
        syncFiles: true,
        cookie: 'nodepop-lang'
    });

    return i18n;
}

module.exports = i18nConfiguration;