# get-sitemap-files

A [Gulp](https://github.com/gulpjs/gulp) plugin to get files listed in a sitemap.

## Installation
```js
npm install gulp-sitemap-files
```

## Usage
```js
sitemapFiles('http://www.example.com/sitemap.xml');
```

```js
var gulp = require('gulp');
var getSitemapFiles = require('gulp-get-sitemap-files');

gulp.task('default', function() {
    sitemapFiles('http://www.example.com/');
});
```

## Arguments

- `sitemapUrl` - string - The URL of the sitemap to read from
- `options` - object - The URL of the sitemap to read from
    - `folderName` - string - The folder name which the collected files will go into. Default `pages`
    - `defaultFileName` - string - The default name of any file saved. If the file has a name and extension, this will be used. Default `index.html`
    - `fileTypes` - array - The file extensions which to read. Default `['.html','.xhtml','.xml','.json', '.csv', '.js', '.css']`
    - `headers` - object -  The header detail used in conjection with [request](https://www.npmjs.com/package/request). Default `{ 'User-Agent': 'request' }`

[npm-url]: https://npmjs.org/package/get-sitemap-files
[npm-image]: http://img.shields.io/npm/v/get-sitemap-files.svg?style=flat
