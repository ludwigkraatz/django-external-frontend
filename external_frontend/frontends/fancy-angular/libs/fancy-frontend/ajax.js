
define(['fancyPlugin!jquery', 'fancyPlugin!hawk', 'json', 'fancyPlugin!fancyFrontendConfig'], function($, Hawk, JSON2, config){
    /*
     * this feature helps you sending ajay requests prioritzed
     */
    var jQuery = $;
    /* the base of the queued_ajax */
    function FrontendAjax() {
        this.init.apply(this, arguments);
    };

    /* prototype extension */
    $.extend(FrontendAjax.prototype, {
        /* Class name added to elements to indicate already configured with max length. */

        frontendCore: null,

        counter:0,
        max_priority:4,
        at_once:5,
        active:0,
        additional_headers: [],
        default_headers: [],
        priotirized_requests:{
                0:[],
                1:[],
                2:[],
                3:[],
                4:[]
        },
        queue : {},
        dependencies : {},
        is_active : {},
        lockedOutQueue: [],

        locked: false,
        running: false,
        csrftoken: null,

        clientTimestamp: +new Date()/1000,
        backendTimestamp: +new Date()/1000,


        debug_level: 1,

        getCorrectTimestamp: function(){
            return Math.round(+new Date()/1000) - this.clientTimestamp + this.backendTimestamp;
        },

        setLanguage: function(languageCode){
            this.default_headers['Accept-Language'] = languageCode;
        },

        signRequest: function(settings, auth){
            // Generate Authorization request header
            var data = {};
            var payload = {};
            //delete settings.data;

            var data_values = new Array();

            for (key in settings.data) {
                data_values.push(key);
            }

            if (data_values.length > 0) {
                data_values.sort();

                for (key in data_values) {
                    data[data_values[key]] = settings.data[data_values[key]]
                }

                $.extend(payload, data);
            }else{
                data = null;
            }

            settings.data = data;
            var options = {
                credentials: auth.auth_callback ? auth.auth_callback() : {
                    id: auth.accessId,
                    key: auth.accessSecret,
                    algorithm: auth.accessAlgorithm
                },
                //ext: 'some-app-data',
                contentType: settings.dataType,
                timestamp: this.getCorrectTimestamp(),
            };
            if (data && true) {
                options.payload= JSON2.stringify(payload);
            }
            var result = hawk.client.header(
                settings.url,
                settings.type,
                options
                );
            if (result.field && result.artifacts) {
                settings.headers.Authorization = result.field;
                auth.artifacts = result.artifacts;
            }else{
                //throw Error, 'error encrpyting' //todo make global error handler catch this
            }


            return settings;
        },


        checkResponse: function(xhr, auth, response){

            // Check Server Response
            var artifacts = auth.artifacts;
            delete auth.artifacts;
            var credentials= auth.auth_callback ? auth.auth_callback() : {
                    id: auth.accessId,
                    key: auth.accessSecret,
                    algorithm: auth.accessAlgorithm
                };
            var options = {
                payload: xhr.responseText ? xhr.responseText : ""
                };

            return hawk.client.authenticate(
                xhr, credentials, artifacts, options
                );

        },

        /*
         * wrapper for ajax function of jquery
         */
        _ajax: function( settings, ajax_settings){
            var $this = this;
            var ajax = {
                "global": false,
                "headers": {}
            };


            $.extend(ajax.headers, this.default_headers);
            $.extend(ajax, settings);
            $.extend(ajax.headers, this.additional_headers);

            if (ajax_settings.addCsrfHeader) { // todo: ajax_settings.internalRequest == true &&
                $.extend(ajax.headers, {
                    "X-CSRFToken": this.csrftoken
                    });
            }

            if (ajax_settings.internalRequest == true) {
                // signing the request
                ajax_settings.auth._needsAuthentication = true;
                ajax = this.signRequest(ajax, ajax_settings.auth);
            }else{
                ajax_settings.auth._needsAuthentication = false;
            }

            if (this.debug_level > 0)
                console.log(ajax);
            var jqxhr = $.ajax(ajax);

            if (ajax_settings.internalRequest == true) {
                jqxhr.done(function(response, status, xhr){
                    ajax_settings.auth._isAuthenticatedResponse = $this.checkResponse(xhr, ajax_settings.auth, response);
                })
            }


            return jqxhr;
        },

        lock: function(){
            this.locked = true;
        },

        unlock: function(){
            this.locked = false;
        },


        init: function(settings){
            cookie  = this.getCookie('csrftoken')
            if (cookie == undefined){
                // TODO
                //alert("NO COOKIES FOUND");// $this.frontendCore.popup('no_cookies_found')
                this.lock();
            }else{
                this.csrftoken = cookie;
            }
        },

        /*
         * If one is not logged in but authorized for a specific action, the
         * authorization token needs to be transmitted. it can be set with this
         * function.
         */
        setHeader: function(header,token){
            var entry       =   {};
            entry[header]   =   token;
            $.extend(this.additional_headers,entry);
        },


        getCookie: function(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        },

        /*
         * add urgent means with priority 0
         */
        add_urgent: function(request, settings, id){
            if (!settings)
                settings={}
            $.extend(settings,{'priority':0});
            return this.add(request,settings);
        },

        /*
         * specify an $.ajax(request), an id of this request for the queue and settings about what to do on adding an request with same id e.g.
         * settings:
         *      dependency: helps to not execute requests, after a third object had been abortet or updated
         *      priority:   from 0-max_priority
         */
        add: function (request, settings, id){
            this.counter+=1;
            if (id==undefined){
                id= request.id || "counted_"+this.counter
            }
            if (settings){
                var priority=settings['priority']
                if (settings['dependency'])
                    {
                        if (!this.dependencies[settings['dependency']])
                            this.dependencies[settings['dependency']]=[]
                        this.dependencies[settings['dependency']].push(id)
                    }
            }else{
                settings={}
            }
            if (request.addCsrfHeader != undefined) {
                settings.addCsrfHeader = request.addCsrfHeader
                delete request.addCsrfHeader
            }
            if (request.done != undefined) {
                settings.done = request.done
                delete request.done
            }
            if (request.ignoreLock != undefined) {
                settings.ignoreLock = request.ignoreLock
                delete request.ignoreLock
            }
            if (request.fail != undefined) {
                settings.fail = request.fail
                delete request.fail
            }
            if (this.dependencies[id]){
                this.handleDependencies(id)
            }
            if (priority==undefined)
                priority=this.max_priority

            if (this.queue[id]!=undefined){
                if (this.queue[id].priority<priority)
                    delete this.priotirized_requests[priority][$.inArray(id,this.priotirized_requests[priority])]
            }
            this.queue[id]={
                'settings':settings,
                'request':request
            }

            /*
            if (this.active<this.at_once){
                this.start(id);
            }else{
                if (!this.priotirized_requests[priority])
                    alert(priority)
                this.priotirized_requests[priority].push(id)
            }
            */
            if (this.active<this.at_once && priority == 0 && (
                                            this.locked == false
                                        ||  settings.ignoreLock
                                        )) {
                this.start(id);
            }else{
                if (!this.priotirized_requests[priority])
                    throw new Error(str(priority) + 'is not a valid priority')
                this.priotirized_requests[priority].push(id)

                if (this.active<this.at_once)
                    setTimeout(this.next(), 10);
            }

            return id;
           },

        /*
         * start next highest request
         */
        next:function (){
            for (var i=0;i<this.max_priority;i++){
                while (this.active<=this.at_once && this.priotirized_requests[i].length>0){
                    cur = this.priotirized_requests[i][this.priotirized_requests[i].length-1]
                    if (this.locked == false || this.queue[cur].settings.ignoreLock) {
                        this.start(this.priotirized_requests[i].pop())
                    }
                }
                if (this.priotirized_requests[i].length>0)
                    break;
            }

        },

        /*
         * aborts dependend requests on e.g. abortion of the related request
         */
        handleDependencies: function (id){
            var queued_ajax=this
            $.each(this.dependencies[id],function(key,value){
                queued_ajax.abort(value)
            })
            this.dependencies[id].length=0
        },

        /*
         * aborts request defined by id
         *      aborts dependencies afterwards if existend if specified in settings or
         *      lowers the priority of related requests - used e.g. if it needs to be loaded in every case but its not so urgent any more
         */
        abort: function (id){
            if (!this.queue[id])
                return false;
            if (this.queue[id].settings.removeOnAbort)
            {
                if (this.queue[id].jqXHR)
                    this.queue[id].jqXHR.abort()
                else{
                    var priority=this.queue[id].settings.priority
                    delete this.priotirized_requests[priority][$.inArray(id,this.priotirized_requests[priority])]

                    //if (this.dependencies[id])
                    //    this.handleDependencies(id)

                    delete this.queue[id]
                }
            }else if(this.queue[id].settings.lowerOnAbort){
                var settings=$.extend(true,{},this.queue[id].settings,{priority:undefined})
                this.start(this.queue[id],id,settings)
            }
            return true;
        },
        /*
         * really starts an ajax request
         */
        start:function (id){

            // if id has been removed from entry meanwhile, start next
            if (!this.queue[id])
                return this.next()

            this.active+=1;

            //var request=$.extend(true,{},this.queue[id]["request"],)

            var $ajax = this._ajax(this.queue[id]["request"], this.queue[id]["settings"]);
            this.queue[id]["jqXHR"]=$ajax;

            $ajax.then(
                this._get_done_handler(id),
                this._get_fail_handler(id)
            )

            return $ajax
        },

        get_queue:function(){
            return this.queue
        },

        /*
         * function that is a wrapper to do some organizational stuff for queued_ajax and afterwards the complete function of the ajax request
         */
        _complete: function(id){
            var $this=this;
                $this.active-=1;

                delete $this.queue[id]

                $this.next()
        },

        _get_done_handler: function(id){
            var $this = this;
            return function(response, statusText, jqXHR){
                if ($this.queue[id].settings.auth._needsAuthentication != true ||
                    $this.queue[id].settings.auth._isAuthenticatedResponse) {

                    var method = $this.queue[id].settings.done;
                    if (method != undefined){
                        method(response, statusText, jqXHR)
                    }
                    method = $this.queue[id].settings.always;
                    if (method != undefined){
                        method(response, statusText, jqXHR)
                    }
                    return $this._complete(id);
                }else{
                    var method = $this.queue[id].settings.fail;
                    if (method != undefined){
                        method(jqXHR, "Response not valid", 0); // todo: valid status etc.
                    }
                    method = $this.queue[id].settings.always;
                    if (method != undefined){
                        method(response, statusText, jqXHR)
                    }
                    return $this._complete(id);
                }
            };
        },

        translateResponse_toJSON: function(jqXHR){
            try {
                return jqXHR.responseText ? JSON.parse(jqXHR.responseText) : {};
            } catch(e) {
                responseHTML = jqXHR.responseText ? $(jqXHR.responseText) : null;
                responseJSON = {};
                if (responseHTML != null && responseHTML.hasClass(config.frontend_generateClassName('error'))) {
                    responseJSON.msg = responseHTML.find(config.frontend_generateSelector('msg')).html();
                    responseJSON[config.frontend_generateResponseAttributeName('error-code')] = responseHTML.find(config.frontend_generateSelector('error-code')).html();
                    responseJSON.detail = responseHTML.find(config.frontend_generateSelector('detail')).html();
                    responseJSON.html = jqXHR.responseText;
                }
                return responseJSON
            }
            return {}

        },

        _get_fail_handler: function(id){

            var $this = this;
            return function(jqXHR, statusText, error){

                function handleResponse() {
                    var method = $this.queue[id].settings.fail;
                    if (method != undefined){
                        method(jqXHR, statusText, error)
                    }
                    method = $this.queue[id].settings.always;
                    if (method != undefined){
                        method(error, statusText, jqXHR)
                    }
                    return $this._complete(id);
                };

                function get_handleTOSResponse(result){
                    if (result.accepted_tos == true) {
                        if ($this.debug_level > 0) {
                            console.log('unlocked');
                        }
                        $this.unlock();
                        $this.handleLockedOutRequests();
                    }else{
                        if ($this.debug_level > 0) {
                            console.log('unlocked');
                        }
                        $this.unlock(); // todo: really?
                        handleResponse();
                    }
                };

                function get_handleAuthResponse(result){
                    if (result.auth == true) {
                        if ($this.debug_level > 0) {
                            console.log('unlocked');
                        }
                        $this.unlock();
                        $this.handleLockedOutRequests();
                    }else{
                        // dont unlock, because no credentials available
                        handleResponse();
                    }
                };

                responseJSON = $this.translateResponse_toJSON(jqXHR);

                if (
                        jqXHR.status == 503
                    ){
                    retryAfter = jqXHR.getResponseHeader('Retry-After');
                    if (responseJSON[config.frontend_generateResponseAttributeName('error-code')] == config.frontend_generateErrorCode('task-incomplete')) {
                        // not yet executed
                        setTimeout($this.start, parseInt(retryAfter)*1000, id);
                    }else if (responseJSON[config.frontend_generateResponseAttributeName('error-code')] == config.frontend_generateErrorCode('maintenance')){
                        // maintenance
                        $this.frontendCore.showMaintenance()
                    }
                }else if (
                        jqXHR.status == 403
                    &&  responseJSON[config.frontend_generateResponseAttributeName('error-code')] == config.frontend_generateErrorCode('tos-missing')
                    ){
                    if (!$this.locked) {
                        if ($this.debug_level > 0) {
                            console.log('locked, because of TOS');
                        }
                        $this.lock();
                        $this.frontendCore.openPopupFromResponse(
                            responseJSON[config.frontend_generateResponseAttributeName('error-code')],
                            responseJSON,
                            get_handleTOSResponse
                        )
                    }

                    $this.lockedOutQueue.push(id)
                }else if (
                          jqXHR.status == 401
                    ){
                    if (responseJSON[config.frontend_generateResponseAttributeName('error-code')] == config.frontend_generateErrorCode('auth-missing')) {
                        // /api/credentials
                        // no session auth
                        if (!$this.locked) {
                            if ($this.debug_level > 0) {
                                console.log('locked, because not authenticated');
                            }
                            $this.lock();
                            $this.frontendCore.openPopupFromResponse(
                                responseJSON[config.frontend_generateResponseAttributeName('error-code')],
                                responseJSON,
                                get_handleAuthResponse
                            )
                        }

                        $this.lockedOutQueue.push(id)
                    }else{
                        // /api/../..
                        // no valid HAWK auth
                        if (!$this.locked) {
                            if ($this.debug_level > 0) {
                                console.log('locked, because not authenticated');
                            }
                            $this.lock();
                            $this.frontendCore.refreshCredentials({
                                callback: get_handleAuthResponse,
                                expectsResult: true,
                                forceRefresh: true
                            });
                        }

                        $this.lockedOutQueue.push(id)
                    }

                }else{
                    handleResponse();
                }
            };
        },

        handleLockedOutRequests: function(){
            while (this.lockedOutQueue.length>0){
                this.start(this.lockedOutQueue.pop())
            }
        }
    });


    var frontend_ajax = new FrontendAjax();


    /* the base of the queued_ajax */
    function EndpointAjax() {
        this.init.apply(this, arguments);
    }

    /* prototype extension */
    $.extend(EndpointAjax.prototype, {
        /* Class name added to elements to indicate already configured with max length. */

        frontendCore: null,

        additional_headers: {},

        debug_level: 0,

        endpoint: null,
        endpoint_type: null,

        accessAlgorithm: 'sha256',
        accessId: null,
        accessSecret: null,

        translateResponse_toJSON: function(jqXHR){
            return frontend_ajax.translateResponse_toJSON(jqXHR)
        },

        setLanguage: function(language_code){
            return frontend_ajax.setLanguage(language_code);
        },

        /*
         * wrapper for get function of jquery
         */
        get: function( settings, ajax_settings ){
            var ajax_req = {
                type: 'GET',
            }
            $.extend(ajax_req, settings);

            return this.ajax(ajax_req, ajax_settings);
        },

        /*
         * wrapper for post function of jquery
         */
        post: function( settings, ajax_settings ){
            var ajax_req = {
                type: 'POST',
            }
            $.extend(ajax_req, settings);

            return this.ajax(ajax_req, ajax_settings);
        },

        /*
         * wrapper for delete function of jquery
         */
        delete: function( settings, ajax_settings ){
            var ajax_req = {
                type: 'DELETE',
            }
            $.extend(ajax_req, settings);

            return this.ajax(ajax_req, ajax_settings);
        },

        /*
         * wrapper for put function of jquery
         */
        put: function( settings, ajax_settings ){
            var ajax_req = {
                type: 'PUT',
            }
            $.extend(ajax_req, settings);

            return this.ajax(ajax_req, ajax_settings);
        },

        /*
         * wrapper for head function of jquery
         */
        head: function( settings, ajax_settings ){
            var ajax_req = {
                type: 'HEAD',
            }
            $.extend(ajax_req, settings);

            return this.ajax(ajax_req, ajax_settings);
        },

        getUrl: function(url){
            var ret = '';
            if (this.endpoint) {
                ret += this.endpoint + '/';
            }
            if (this.isFrontendEndpoint()) {
                if (this.endpoint_type) {
                    ret += this.endpoint_type + '/';
                }
            }
            return ret + url
        },

        getAuthExtension: function(auth){
            var $this = this;
            return {
                auth_callback: function(){
                    return {
                        id: auth.accessId || $this.accessId,
                        key: auth.accessSecret || $this.accessSecret,
                        algorithm: auth.accessAlgorithm || $this.accessAlgorithm
                    }
                }
                }
        },

        /*
         * wrapper for ajax function of jquery
         */
        ajax: function( settings, ajax_settings){
            if (ajax_settings == undefined) {
                ajax_settings = {};
            }
            var isUrgent = ajax_settings.priority == undefined ? true : (settings.lowPriority == 0);

            var ajax = {
                "url": this.getUrl(settings.url),
                "dataType": this.endpoint_type == 'widgets' ? 'html' : 'json',
                "data": null,
                "cache": true,
                "crossDomain": this.crossDomain,
                "global": false
            };
            delete settings["url"];

            $.extend(ajax, settings);
            $.extend(ajax.headers, this.additional_headers);

            if (ajax.fail != undefined){
                ajax_settings.fail = ajax.fail;
                delete ajax.fail;
            }else{
                ajax_settings.fail = this.frontendCore.get_failed_ajax_handler();
            }

            ajax_settings.internalRequest = this.isFrontendEndpoint() ? true : false;
            if (ajax_settings.internalRequest) {


                if (ajax_settings.auth) {
                    ajax_settings.auth = this.getAuthExtension(auth);
                }else{
                    ajax_settings.auth = this.getAuthExtension({});
                }

            }else{
                ajax_settings.auth = {};
            };

            if (isUrgent == true) {
                return this._add_urgent(ajax, ajax_settings);
            }else{
                return this._add(ajax, ajax_settings);
            }

            //frontend_ajax.ajax(settings);
        },

        isFrontendEndpoint: function(){
            return typeof this.endpoint == 'string' && typeof this.endpoint_type == 'string' && !this.external_endpoint;
        },

        init: function(frontendCore, settings){
            this.frontendCore = frontendCore;
            frontend_ajax.frontendCore = frontendCore;

            this.external_endpoint = settings ? settings.external : null;
            this.endpoint = settings ? settings.endpoint : null;
            this.endpoint_type = settings ? settings.type : null;
            this.crossDomain = settings ? settings.crossDomain : null;
            this.accessId = settings ? settings.accessId : null;
            this.accessSecret = settings ? settings.accessSecret : null;
            this.accessAlgorithm = settings ?
                                    settings.accessAlgorithm || this.accessAlgorithm :
                                    this.accessAlgorithm;

        },

        setAlgorithm: function(accessAlgorithm){
            this.accessAlgorithm = accessAlgorithm;
        },

        setCredentials: function(accessId, accessSecret){
            this.accessId = accessId;
            this.accessSecret = accessSecret;
        },

        /*
         * If one is not logged in but authorized for a specific action, the
         * authorization token needs to be transmitted. it can be set with this
         * function.
         */
        setHeader: function(header,token){
            var entry       =   {};
            entry[header]   =   token;
            $.extend(this.additional_headers,entry);
        },

        /*
         * wrapper
         */
        _add_urgent: function(settings, ajax_settings){
            return frontend_ajax.add_urgent(settings, ajax_settings);
        },

        /*
         * wrapper
         */
        _add: function (settings, ajax_settings){
            return frontend_ajax.add(settings, ajax_settings);
           },

        /*
         * wrapper
         */
        abort: function (){
            frontend_ajax.abort.apply(arguments);
        },

    });

    return EndpointAjax;
});