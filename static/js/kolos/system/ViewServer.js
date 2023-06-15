/**
 * Инструмент загрузки view с сервера
 * @param url
 * @constructor
 */
kolos.ViewServer = function (url) {
    var Self = this;
    this._url = url;
    this._animateTagId = undefined;
    this._animateText = undefined;

    this._load = function (callback) {
        let animate;
        let animateElem;
        if (this._animateTagId !== false) {
            if (this._animateText === undefined) {
                this._animateText = kolos.Kolos.text('Загрузка') + '...';
            }
            animate = kolos.Animate.loaderDialog(this._animateText);
            if (this._animateTagId !== undefined) {
                animateElem = kolos.Animate.loader(this._animateTagId, this._animateText);
            }
        }
        kolos.Kolos.request(this._url)
            .method('GET')
            .error(function(msg) {
                if (Self._animateTagId !== false) {
                    animate.stop();
                    if (animateElem !== undefined) {
                        animateElem.stop();
                    }
                }
                kolos.Utils.error('(ViewServer) Ошибка загрузки формы: ' + Self._url + ', ' + msg, true, 'core');
            })
            .ready(function (data) {
                if (Self._animateTagId !== false) {
                    animate.stop();
                    if (animateElem !== undefined) {
                        animateElem.stop();
                    }
                }
                callback(data);
            });
    };

    /**
     * Задать tagId для отображения анимации загрузки. false - отключить анимацию
     * @param tagId тэг id в формате jquery
     * @returns {kolos.ViewServer}
     */
    this.animate = function (tagId) {
        this._animateTagId = tagId;
        return this;
    };

    /**
     * Задать текст анимации
     * @param tagId
     * @param text
     * @returns {kolos.ViewServer}
     */
    this.text = function (tagId, text) {
        this._animateText = text;
        return this;
    };

    this.toModal = function () {
        this._load(function (data) {
            kolos.Modal
                .content(data)
                //.onClickBack(undefined)
                .show();
        });
    };

    this.toContainer = function (tagId) {
        this._load(function (data) {
            $(tagId).html(data);
        });
    };

    this.toCallback = function (callback) {
        this._load(callback);
    };
};