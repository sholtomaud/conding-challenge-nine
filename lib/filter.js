'use strict'

const { Transform } = require('stream');

class Filter extends Transform {
  constructor(options){
    super({
      writableObjectMode:true,
      readableObjectMode:true
    })
    this.buf = Buffer.from(options);
    this.filterProps = options;
  }

  _transform(chunk, encoding, callback) {
    var self = this;
    var ret = {};

    ret.response = chunk
      .filter(item => ((item.hasOwnProperty('drm') && item.hasOwnProperty('episodeCount')) && item.drm && item.episodeCount > 0))
      .map((item)=>{
        return Object.keys(item)
          .filter(key => self.filterProps.includes(key))
          .reduce((obj, key) => {
            obj[key] = (key === 'image') ? item[key].showImage : item[key];
            return obj;
          }, {});
      })

    this.push(JSON.stringify(ret, null, 2));
    callback();
  }

  _flush(callback) {
    process.stdout.write("Filter processed.\n");
    callback();
  }
}

module.exports = Filter;
