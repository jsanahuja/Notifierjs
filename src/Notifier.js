/*
 * Nofifier
 *
 * @version 1.1.2
 *
 * @author Javier Sanahuja Liebana <bannss1@gmail.com>
 *
 * https://github.com/jsanahuja/Notifierjs
 *
 */
(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
        root.InstagramFeed = factory();
    }
}(this, function() {
    var defaults = {
        container: null,
        default_time: 4500,
        vanish_time: 300,
        fps: 30,
        success: {
            classes: 'alert-success',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M6.41 0l-.69.72-2.78 2.78-.81-.78-.72-.72-1.41 1.41.72.72 1.5 1.5.69.72.72-.72 3.5-3.5.72-.72-1.44-1.41z" transform="translate(0 1)" /></svg>'
        },
        error: {
            classes: 'alert-danger',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M1.41 0l-1.41 1.41.72.72 1.78 1.81-1.78 1.78-.72.69 1.41 1.44.72-.72 1.81-1.81 1.78 1.81.69.72 1.44-1.44-.72-.69-1.81-1.78 1.81-1.81.72-.72-1.44-1.41-.69.72-1.78 1.78-1.81-1.78-.72-.72z" /></svg>'
        },
        warning: {
            classes: 'alert-warning',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M3.09 0c-.06 0-.1.04-.13.09l-2.94 6.81c-.02.05-.03.13-.03.19v.81c0 .05.04.09.09.09h6.81c.05 0 .09-.04.09-.09v-.81c0-.05-.01-.14-.03-.19l-2.94-6.81c-.02-.05-.07-.09-.13-.09h-.81zm-.09 3h1v2h-1v-2zm0 3h1v1h-1v-1z" /></svg>'
        },
        info: {
            classes: 'alert-info',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M3 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm-1.5 2.5c-.83 0-1.5.67-1.5 1.5h1c0-.28.22-.5.5-.5s.5.22.5.5-1 1.64-1 2.5c0 .86.67 1.5 1.5 1.5s1.5-.67 1.5-1.5h-1c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-.36 1-1.84 1-2.5 0-.81-.67-1.5-1.5-1.5z" transform="translate(2)"/></svg>'
        }
    };

    var Notification = function(container, msg, type, time, vanish, fps, callback) {
        this.pushed = false;

        // Notification
        this.element = document.createElement('div');
        this.element.className = 'notifyjs-notification ' + type.classes;
        this.element.innerHTML = "<div class='notifyjs-icon'>" + type.icon + '</div>' + msg;
        container.appendChild(this.element);

        // Notification progress
        var progress = document.createElement('p');
        progress.className = 'progress';
        this.element.appendChild(progress);

        // Callback
        this.callback = callback;

        var self = this;

        this.push = function() {
            if (self.pushed) return;
            self.pushed = true;

            var i = 0,
                lapse = 1000 / fps;

            self.element.style.display = "block";
            self.interval = setInterval(function() {
                i++;
                var percent = (1 - lapse * i / time) * 100;

                progress.style.right = percent + '%';

                if (percent <= 0) {
                    if (typeof callback === 'function') {
                        callback();
                    }
                    self.clear();
                }
            }, lapse);
        };

        this.clear = function() {
            if (!self.pushed) return;

            var lapse = 1000 / fps,
                cut = 1 / (vanish / lapse),
                opacity = 1;

            if (typeof self.interval !== 'undefined') {
                clearInterval(self.interval);
            }
            self.interval = setInterval(function() {
                opacity -= cut;
                self.element.style.opacity = opacity;

                if (opacity <= 0) {
                    clearInterval(self.interval);
                    self.destroy();
                }
            }, lapse);
        };

        this.destroy = function() {
            if (!self.pushed) return;
            self.pushed = false;

            if (typeof self.interval !== 'undefined') {
                clearInterval(self.interval);
            }
            container.removeChild(self.element);
        };
    };

    var Notifier = function(opts) {
        this.options = Object.assign({}, defaults);
        this.options = Object.assign(this.options, opts);

        if (this.options.container === null) {
            this.options.container = document.createElement('div');
            document.getElementsByTagName('body')[0].appendChild(this.options.container);
        }
        this.options.container.className += ' notifyjs-container';

        this.notify = function(type, msg, time, callback) {
            if (typeof this.options[type] === 'undefined') {
                console.error("Notify.js: Error, undefined '" + type + "' notification type");
                return;
            }
            if (typeof time === 'undefined') {
                time = this.options.default_time;
            }

            return new Notification(
                this.options.container,
                msg,
                this.options[type],
                time,
                this.options.vanish_time,
                this.options.fps,
                callback
            );
        };
    };

    return Notifier;
}));