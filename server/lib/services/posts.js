const {
  microsubError,
  validateResponse,
  request,
} = require('../microsub-helpers');

class PostsService {
  constructor() {}

  find(params) {
    return new Promise((resolve, reject) => {
      let microsubParams = {
        action: 'timeline',
      };
      if (params.query.channel) {
        microsubParams.channel = params.query.channel;
      }
      if (params.query.limit) {
        microsubParams.limit = params.query.limit;
      }
      if (params.query.after) {
        microsubParams.after = params.query.after;
      }
      if (params.query.before) {
        microsubParams.before = params.query.before;
      }
      request({
        endpoint: params.user.settings.microsubEndpoint,
        token: params.user.accessToken,
        method: 'GET',
        params: microsubParams,
      })
        .then(results => resolve(results))
        .catch(err => {
          console.log('Error getting timeline', err);
          reject(microsubError('Error getting timeline', null, err));
        });
    });
  }

  update(id, data, params) {
    return new Promise((resolve, reject) => {
      let microsubParams = {
        action: 'timeline',
        channel: data.channel,
      };

      if (data.method) {
        microsubParams.method = data.method;
      }
      if (id) {
        microsubParams.entry = id;
      } else if (id == null) {
        if (data.last_read_entry) {
          microsubParams.last_read_entry = data.last_read_entry;
        }
        if (data.entries) {
          microsubParams.entry = data.entries;
        }
      }

      // Support muting and blocking
      if ((data.mute || data.block) && data.channel) {
        microsubParams = {
          action: data.mute ? 'mute' : 'block',
          channel: data.channel,
          url: data.mute || data.block,
        };
      }

      request({
        endpoint: params.user.settings.microsubEndpoint,
        token: params.user.accessToken,
        method: 'POST',
        params: microsubParams,
      })
        .then(results => {
          results.channel = data.channel;
          resolve(results);
        })
        .catch(err => {
          console.log('Error updating timeline posts', err);
          reject(microsubError('Error updating', null, err));
        });
    });
  }
}

module.exports = new PostsService();
