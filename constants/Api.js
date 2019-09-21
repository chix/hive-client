import Constants from 'expo-constants';

const apiHost = (typeof Constants.manifest.packagerOpts === 'object') && Constants.manifest.packagerOpts.dev
    ? 'http://'+Constants.manifest.debuggerHost.split(':').shift().concat(':3045')
    : 'https://hive.martinkuric.cz';

export default {
  host: apiHost
};
