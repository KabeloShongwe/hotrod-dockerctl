var Docker = require('dockerode');
var Promise = require('promise');
var docker = new Docker();
var logger = require('hotrod-logger')(__filename);

function SaltService(dockerContainer) {
    this.container = dockerContainer;
}

SaltService.prototype.exec = function(/* arg1, ..., argN */) {
    var self = this;
    var cmd = Array.prototype.slice.call(arguments);
    return new Promise(function(resolve, reject) {
        var container = docker.getContainer(self.container);

        logger.trace('Executing in Docker: ', cmd);
        var dockerExecOptions = {
            AttachStdout: true,
            AttachStderr: true,
            AttachStdin: false,
            Tty: false,
            Cmd: cmd
        };
        container.exec(dockerExecOptions, function(err, exec) {
            if (err) {
                return reject(err);
            }

            exec.start(function(err, stream) {
                if (err) return;

                stream.setEncoding('hex');

                stream.on('readable', function() {
                    var returned = "";
                    var chunk;
                    while (null !== (chunk = stream.read())) {
                        logger.trace('got %d bytes of data', chunk.length);
                        returned = returned + chunk;
                    }
                    logger.trace('stream done');

                    function hex2a(hex)
                    {
                        var str = '';
                        for (var i = 0; i < hex.length; i += 2)
                            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
                        return str;
                    }

                    //FIXME: clear console issues
                    returned = returned.replace(/^.+(7b.+)/, "$1").replace(/^(7b.+7d).+/, "$1");
                    returned = hex2a(returned).replace(/\'/g,'"');

                    try {
                        var content = JSON.parse(returned);
                        resolve(content);
                    } catch (err) {
                        logger.error('Error parsing response:', err);
                        reject(err);
                    }
                });

                stream.once('close', function(){
                    logger.trace("stream close");
                });

                stream.once('end', function(){
                    logger.trace("stream end");
                });

                stream.once('error', function(err){
                    logger.error('Stream error', err);
                    reject(err);
                });
            });
        });
    });
};

module.exports = SaltService;