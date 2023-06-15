kolos.page.Main = function() {
    // base properties -->>
    let Self = this;
    /** @type {kolos.ComponentContext} */
    this.context = undefined;
    this.element = {
        textContainer: undefined,
    };
    this.component = {
        /** @type {kolos.component.Hint} */
        hint: undefined,
    }
    this.param = {};
    this.attr = {};
    //--

    this.index = function() {
        $(this.element.textContainer).html('METHOD INDEX');
    }

    this.test = function() {
        $(this.element.textContainer).html('METHOD TEST');
    }


    this.testHint = function() {
        this.component.hint.info('asdf');
    }

    this.testHintGlobal = function(type) {
        switch (type) {
            case 'info' :
                kolos.app.hint.info('asdf');
                break;
            case 'success' :
                kolos.app.hint.success('asdf');
                break;
            case 'warning' :
                kolos.app.hint.warning('asdf');
                break;
            case 'error' :
                kolos.app.hint.error('asdf');
                break;
        }

    }

    this.onReady = function() {
        //
    }

    this.onDestroy = function() {
        //
    }

}

