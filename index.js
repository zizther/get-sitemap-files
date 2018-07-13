'use strict';

// Dependencies
var fs = require('fs'),
    fse = require('fs-extra'),
    defaults = require('lodash/defaults'),
    path = require('path'),
    parse = require('url-parse'),
    request = require('request'),
    parseXML = require('xml2js').parseString;

// Variables
var pluginName = 'get-sitemap-files';

/**
 * Get file name from path or URL
 * @param  {[string]} path the file path/URL
 * @return {[string]}      return the file name including extention
 */
function getFileName(path) {

    // Remove everything to the last slash in URL
    path = path.substr(1 + path.lastIndexOf('/'));

    // Break URL at ? and take first part (file name, extension)
    path = path.split('?')[0];

    // Sometimes URL doesn't have ? but #, so we should aslo do the same for #
    path = path.split('#')[0];

    // Now we have only extension
    return path;

}// END getFileName


module.exports = function(sitemapUrl, options){

    // Test if sitemap URL is provided
    if(!sitemapUrl) throw new Error(pluginName + ': sitemapUrl argument missing!');

    // Get options
    var config = defaults(options || {}, {
        folderName: 'pages',
        defaultFileName: 'index.html',
        fileTypes: ['.html','.xhtml','.xml','.json', '.csv', '.js', '.css'],
        headers: {
            'User-Agent': 'request'
        }
    });

    // Remove existing folder to start again
    fse.removeSync(config.folderName);

    // Request sitemap XML
    var sitemapOptions = {
        url: sitemapUrl,
        headers: config.headers
    };

    request(sitemapOptions, function (err, response, body) {

        if (err) {
            throw new Error(pluginName + ': ' + err);
            return;
        }

        // Get XML files and convert to a string
        var xml = body.toString();

        parseXML(xml, function(err, result) {

            if(err) {
                throw new Error(pluginName + ': ' + err);
                return;
            }

            result.urlset.url.forEach(function(url){
                var page = url.loc.toString(),
                    pageUrl = parse(page),
                    fileExt = getFileName(pageUrl.pathname).substr(getFileName(pageUrl.pathname).lastIndexOf('.'));

                // Test if file name already exists and matches those in the fileTypes option
                // else use default file name
                var filePath = fileExt.charAt(0) == '.' && config.fileTypes.indexOf(fileExt) != -1 ?
                    config.folderName + pageUrl.pathname + '/' + getFileName(pageUrl.pathname) :
                    filePath = config.folderName + pageUrl.pathname + '/' + config.defaultFileName;

                var pageOptions = {
                    url: page,
                    headers: config.headers
                };

                request(pageOptions, function(err, response, body) {

                    if (err) {
                        throw new Error(pluginName + ': ' + err);
                        return;
                    }

                    fse.outputFile(filePath, body, err => {
                        if(err) {
                            throw new Error(pluginName + ': ' + err);
                        }
                        else {
                            console.log(pageUrl + " file was saved!");
                        }
                    });

                });// END request

            });// END forEach

        });// END parseXML

    });// END request

};
