/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
*/

var Q     = require('q'),
    path  = require('path'),
    utils = require('./utils');

function MSBuildTools (version, path) {
    this.version = version;
    this.path = path;
}

MSBuildTools.prototype.buildProject = function(projFile, buildType, buildarch) {
    console.log('\nBuilding project: ' + projFile);
    console.log('\tConfiguration : ' + buildType);
    console.log('\tPlatform      : ' + buildarch);

    var args = ['/clp:NoSummary;NoItemAndPropertyList;Verbosity=minimal', '/nologo',
    '/p:Configuration=' + buildType,
    '/p:Platform=' + buildarch];

    return utils.spawn(path.join(this.path, 'msbuild'), [projFile].concat(args));
};

// returns full path to msbuild tools required to build the project and tools version
module.exports.findAvailableVersion = function (searchFor32Bit) {
    var versions = ['14.0', '12.0', '4.0'];

    return Q.all(versions.map(function (version) {
        return checkMSBuildVersion(version, searchFor32Bit);
    }))
    .then(function (versions) {
        // select first msbuild version available, and resolve promise with it
        var msbuildTools = versions[0] || versions[1] || versions[2];
        return msbuildTools ? Q.resolve(msbuildTools) : Q.reject('MSBuild tools not found');
    });
};

function checkMSBuildVersion(version, searchFor32Bit) {
    var deferred = Q.defer();

    var regRoot = searchFor32Bit ? 'HKLM\\SOFTWARE\\Wow6432Node' : 'HKLM\\SOFTWARE';

    utils.exec('reg query ' + regRoot + '\\Microsoft\\MSBuild\\ToolsVersions\\' + version + ' /v MSBuildToolsPath')
    .then(function(output) {
        // fetch msbuild path from 'reg' output
        var path = /MSBuildToolsPath\s+REG_SZ\s+(.*)/i.exec(output);
        if (path) {
            deferred.resolve(new MSBuildTools(version, path[1]));
            return;
        }
        deferred.resolve(null); // not found
    }, function () {
        deferred.resolve(null);
    });
    return deferred.promise;
}