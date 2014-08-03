define(['fancyPlugin!jquery-ui', 'fancyPlugin!fancyFrontendConfig', 'json'], function($, config, json){
    $(function() {

        /* config */
        //var config = load_config();
        // config is now loaded via requirejs

        var coreWidget_name = '',
            coreWidget_selector = '';

        var widgetConfig = {};

        // config data
            /* names */

            /* ->events */
            widgetConfig.name_event_close = config.frontend_generateEventName('close');
            widgetConfig.name_event_closed = config.frontend_generateEventName('closed');
            widgetConfig.name_event_preSave = config.frontend_generateEventName('pre-save');
            widgetConfig.name_event_save = config.frontend_generateEventName('save');
            widgetConfig.name_event_initiateSave = config.frontend_generateEventName('initiate-save');
            widgetConfig.name_event_postSave = config.frontend_generateEventName('post-save');
            widgetConfig.name_event_saveFailed = config.frontend_generateEventName('safe-failed');
            widgetConfig.name_event_notification = config.frontend_generateEventName('notification');
            widgetConfig.name_event_loading = config.frontend_generateEventName('loading');
            widgetConfig.name_event_loadingStart = config.frontend_generateEventName('start-loading');
            widgetConfig.name_event_loadingFinished = config.frontend_generateEventName('end-loading');
            widgetConfig.name_event_loadingFailed = config.frontend_generateEventName('loading-failed');
            widgetConfig.name_event_moved = config.frontend_generateEventName('moved');
            widgetConfig.name_event_reload = config.frontend_generateEventName('reload');
            widgetConfig.name_event_zoom = config.frontend_generateEventName('zoom');
            widgetConfig.name_event_unzoom = config.frontend_generateEventName('unzoom');
            widgetConfig.name_event_remove = config.frontend_generateEventName('remove');
            widgetConfig.name_event_tosDenied = config.frontend_generateEventName('tos-denied');
            widgetConfig.name_event_init = config.frontend_generateEventName('init');
            widgetConfig.name_event_warning = config.frontend_generateEventName('warning');
            widgetConfig.name_event_error = config.frontend_generateEventName('error');
            widgetConfig.name_event_checkInput = config.frontend_generateEventName('check-input');

            /* ->widgets */
            widgetConfig.name_widgets_core = config.frontend_generateName(config.widgets.defaults.core.name);
            widgetConfig.name_widgets_editor = config.frontend_generateName(config.widgets.defaults.editor.name);
            widgetConfig.name_widgets_form = config.frontend_generateName(config.widgets.defaults.form.name);
            widgetConfig.name_widgets_list = config.frontend_generateName(config.widgets.defaults.list.name);
            widgetConfig.name_widgets_popup = config.frontend_generateName(config.widgets.defaults.popup.name);

            /* ->classes */
            widgetConfig.name_classes_modalMask = config.frontend_generateClassName('modal-mask');
            widgetConfig.name_classes_content = config.frontend_generateClassName('content');
            widgetConfig.name_classes_close = config.frontend_generateClassName('close');
            widgetConfig.name_classes_accept = config.frontend_generateClassName('accept');
            widgetConfig.name_classes_add = config.frontend_generateClassName('add');
            widgetConfig.name_classes_cancel = config.frontend_generateClassName('cancel');
            widgetConfig.name_classes_save = config.frontend_generateClassName('save');
            widgetConfig.name_classes_edit = config.frontend_generateClassName('edit');
            widgetConfig.name_classes_right = config.frontend_generateClassName('right');
            widgetConfig.name_classes_left = config.frontend_generateClassName('left');
            widgetConfig.name_classes_icon =  config.frontend_generateClassName('icon');
            widgetConfig.name_classes_light = config.frontend_generateClassName('ui:icon-light');
            widgetConfig.name_classes_closeThick = config.frontend_generateClassName('ui:icon-closethick');
            widgetConfig.name_classes_header = config.frontend_generateClassName('header');
            widgetConfig.name_classes_footer = config.frontend_generateClassName('footer');
            widgetConfig.name_classes_pagination = config.frontend_generateClassName('pagination');
            widgetConfig.name_classes_preview = config.frontend_generateClassName('preview');
            widgetConfig.name_classes_previewContent = widgetConfig.name_classes_content + ' ' + widgetConfig.name_classes_preview;
            widgetConfig.name_classes_active = config.frontend_generateClassName('active');
            widgetConfig.name_classes_loading = config.frontend_generateClassName('loading');
            widgetConfig.name_classes_loadingPlaceholder = config.frontend_generateClassName('loading-placeholder');
            widgetConfig.name_classes_invalid = config.frontend_generateClassName('invalid');
            widgetConfig.name_classes_descriptive = config.frontend_generateClassName('descriptive');
            widgetConfig.name_classes_deactivated = config.frontend_generateClassName('deactivated');


            /* -->widgets */
            widgetConfig.name_classes_widgets_core = config.frontend_generateClassName(config.widgets.defaults.core.css);
            widgetConfig.name_classes_widgets_editor = config.frontend_generateClassName(config.widgets.defaults.editor.css);
            widgetConfig.name_classes_widgets_form = config.frontend_generateClassName(config.widgets.defaults.form.css);
            widgetConfig.name_classes_widgets_list = config.frontend_generateClassName(config.widgets.defaults.list.css);
            widgetConfig.name_classes_widgets_popup = config.frontend_generateClassName(config.widgets.defaults.popup.css);

            /* selectors */

            /* ->widgets */
            widgetConfig.selector_widgets_core = '.' + widgetConfig.name_classes_widgets_core;
            widgetConfig.selector_widgets_editor = '.' + widgetConfig.name_classes_widgets_editor;
            widgetConfig.selector_widgets_form = '.' + widgetConfig.name_classes_widgets_form;
            widgetConfig.selector_widgets_list = '.' + widgetConfig.name_classes_widgets_list;
            widgetConfig.selector_widgets_popup = '.' + widgetConfig.name_classes_widgets_popup;

            /* ->elements */

            widgetConfig.selector_elements_previewContent = '.' + widgetConfig.name_classes_preview + '.' + widgetConfig.name_classes_content;
            widgetConfig.selector_elements_header = '.' + widgetConfig.name_classes_header;
            widgetConfig.selector_elements_footer = '.' + widgetConfig.name_classes_footer;
            widgetConfig.selector_elements_pagination = '.' + widgetConfig.name_classes_pagination;
            widgetConfig.selector_elements_loading = '.' + widgetConfig.name_classes_loading;
            widgetConfig.selector_elements_save = '.' + widgetConfig.name_classes_save;
            widgetConfig.selector_elements_hideForLoading = '.' + config.frontend_generateClassName('hide-for-loading');

            /* -->form */
            widgetConfig.selector_elements_form = '';

            /* -->icons */
            widgetConfig.selector_elements_accept = '.' + widgetConfig.name_classes_accept;
            widgetConfig.selector_elements_edit = '.' + widgetConfig.name_classes_edit;
            widgetConfig.selector_elements_add = '.' + widgetConfig.name_classes_add;
            widgetConfig.selector_elements_cancel = '.' + widgetConfig.name_classes_cancel;
            widgetConfig.selector_elements_close = '.' + widgetConfig.name_classes_close;

        /* widgets */
        if (widgetConfig.name_widgets_editor !== undefined) {
            if (config.debug_level > 0) {
                console.log('register "' + config.widgets.defaults_namespace + '.' + widgetConfig.name_widgets_editor +'"')
            };
            $.widget( config.widgets.defaults_namespace + '.' + widgetConfig.name_widgets_editor,{
                    options: {
                        preview_emptyValue: false,
                        delete_onEmptyPut: false,
                        checkIfDataSet: undefined,
                        backendUrl: undefined,
                        backendEndpoint: undefined,
                        updateEditField: undefined,
                        updatePreview: undefined
                    },

                    _create: function(){

                        /* define vars */
                        this.$form = this.element.find(widgetConfig.selector_elements_form);
                        this.$preview = this.element.find(widgetConfig.selector_elements_previewContent);
                        var widgetCore = this.options.widgetCore;

                        /* remove all listeners for the editor widget */
                        this.element.off(widgetConfig.selector_widgets_editor);

                        /* install listeners */
                            /* click on add*/
                        //this.element.find(selector_icon_add).
                        //  on('click' + selector_widgets + widgetConfig.selector_widgets_editor,
                        //      this.get_add_handler(this)
                        //  );
                            /* click on accept*/
                        this.element.find(selector_icon_accept).
                            on('click' + widgetConfig.selector_widgets_core + widgetConfig.selector_widgets_editor,
                               this.get_accept_handler(this)
                            );
                            /* click on edit */
                        this.element.find(selector_icon_edit).
                            on('click' + widgetConfig.selector_widgets_core + widgetConfig.selector_widgets_editor,
                               this.get_edit_handler(this)
                            );
                            /* click on cancel */
                        this.element.find(selector_icon_cancel).
                            on('click' + widgetConfig.selector_widgets_core + widgetConfig.selector_widgets_editor,
                              this.get_cancel_handler(this)
                            );
                            /* save event */
                        this.element.
                            on(widgetConfig.name_event_save + widgetConfig.selector_widgets_core + widgetConfig.selector_widgets_editor,
                               this.get_save_handler(this)
                            );
                            /* notification event */
                        this.element.
                            on(widgetConfig.name_event_notification + widgetConfig.selector_widgets_core + widgetConfig.selector_widgets_editor,
                               widgetCore.get_notification_handler(this)
                            );
                            /* form post-save event */
                        this.$form.
                            on(widgetConfig.name_event_postSave + widgetConfig.selector_elements_form,
                               this.get_postSave_handler(this)
                        );

                        /* init */
                        $[config.widgets.defaults_namespace][widgetConfig.name_widgets_form](
                            {
                                resetOn_postSave: false
                            },
                            this.$form);



                    },

                    get_save_handler: function($this){
                        return function(event){
                            var data = {};
                            var data_set = false;
                            var widgetCore = this.options.widgetCore;
                            $this.$form.find('input, textarea, select').each(function(index, elem){
                                var $elem = $(elem);
                                var val = $elem.val();
                                data[$elem.attr(config.frontend_generateAttributeName('backend-attr'))] = val || null;
                                data_set = data_set || ( $this.options.checkIfDataSet ? $this.options.checkIfDataSet($elem) : /[a-zA-Z0-9]+/.test(val) );
                            });
                            $this.element.closest(widgetConfig.selector_widgets_core).triggerHandler(widgetConfig.name_event_loadingStart);
                            if (data_set) {
                                $this.$preview.attr(config.frontend_generateAttributeName('empty-preview'), "false");
                            }else{
                                $this.$preview.attr(config.frontend_generateAttributeName('empty-preview'), "true");
                            }
                            if (data_set || (!$this.options.delete_onEmptyPut)) {
                                $this.options.backendEndpoint.put({
                                    url: $this.options.backendUrl,
                                    data: data,
                                    done: function(response, status, jqXHR){
                                        $this.element.closest(widgetConfig.selector_widgets_core).triggerHandler(widgetConfig.name_event_loadingFinished);
                                        $(event.target).triggerHandler(widgetConfig.name_event_postSave, [response, status, jqXHR]);

                                    },
                                    fail: widgetCore.get_failed_xhr_form_handler($this.$form, config.dialog_generateWording('widgets:' + config.widgets.defaults.editor.name + ':action:save'), $this.element.closest(widgetConfig.selector_widgets_core)),
                                });
                            }else{
                                var done=function(){
                                        $this.element.closest(widgetConfig.selector_widgets_core).triggerHandler(widgetConfig.name_event_loadingFinished);
                                        $(event.target).triggerHandler(widgetConfig.name_event_postSave);
                                    }
                                $this.options.backendEndpoint.delete({
                                    url: $this.options.backendUrl,
                                    done: done,
                                    fail: function(jqXHR, status, error){
                                        if (jqXHR.status == 404) {
                                            done();
                                        }else{
                                            widgetCore.get_failed_xhr_form_handler($this.$form, config.dialog_generateWording('widgets:' + config.widgets.defaults.editor.name + ':action:delete'), $this.element.closest(widgetConfig.selector_widgets_core))(jqXHR, status, error);
                                        }
                                    },
                                });
                            }

                        }
                    },


                    goToPreview: function(){
                        if ((this.$preview.attr(config.frontend_generateAttributeName('empty-preview')) == "false") || this.options.preview_emptyValue) {
                            this.element.removeClass(widgetConfig.name_classes_widgets_editor + "-edit").addClass(widgetConfig.name_classes_widgets_editor + "-preview");
                        }

                    },

                    goToEdit: function(){
                        this.element.removeClass(widgetConfig.name_classes_widgets_editor + "-preview").addClass(widgetConfig.name_classes_widgets_editor + "-edit");

                    },

                    get_cancel_handler: function($this){
                        return function(event){
                            $this.goToPreview();
                        }

                    },

                    get_accept_handler: function($this){
                        return function(event){
                            $this.$form.triggerHandler(widgetConfig.name_event_initiateSave)
                        }

                    },

                    get_edit_handler: function($this){
                        return function(event){
                            $this.goToEdit();
                        }

                    },

                    get_postSave_handler: function($this){
                        return function(event, response, status, jqXHR){
                            var updateEditField = $this.options.updateEditField;
                            var updatePreview = $this.options.updatePreview;

                            if (response) {
                                $this.$form.find('input, textarea, select').each(function(index, elem){
                                    var $elem = $(elem);
                                    var target = $elem.attr(config.frontend_generateAttributeName("preview-target"));
                                    var response_attr = response[$elem.attr(config.frontend_generateAttributeName("backend-attr"))];
                                    if (updateEditField) {
                                        updateEditField($elem, response_attr)
                                    }else{
                                        $elem.val(response_attr);
                                    }

                                    if (target) {
                                        if (updatePreview) {
                                            updatePreview($this.$preview.find('#'+target), response_attr)
                                        }else{
                                            $this.$preview.find('#'+target).html(response_attr)
                                        }

                                    }

                                });
                            }
                            $this.goToPreview();
                        }
                    }

                    /* TODO: is this junk? -- change class name to config.generate...
                    get_add_handler: function($this){
                        return function(event){
                            event.stopPropagation();
                            var $icon = $(event.target)
                            if ($icon.hasClass('icon-add')) {
                                $icon.closest(".settings-bar").addClass('editor-active')
                                $icon.removeClass("icon-add").addClass("icon-cancel")
                                $this.$content.hide();
                                $this.$editor.show();
                            }else if ($icon.hasClass('icon-cancel')) {
                                $icon.closest(".settings-bar").removeClass('editor-active')
                                $icon.removeClass("icon-cancel").addClass("icon-add")
                                $this.$content.show();
                                $this.$editor.hide();
                                //$this.$form.reset(); todo
                            }

                        }
                    }*/

            });
        }

        if (widgetConfig.name_widgets_popup !== undefined) {
            if (config.debug_level > 0) {
                console.log('register "' + config.widgets.defaults_namespace + '.' + widgetConfig.name_widgets_popup +'"')
            };
            $.widget( config.widgets.defaults_namespace + '.' + widgetConfig.name_widgets_popup,{
                    options: {
                        widget_url: null,
                        iframe_url: null,
                        ignoreLock: false
                    },

                    _create: function(){

                        if (! this.element.hasClass(widgetConfig.name_classes_widgets_popup)) {
                            throw new Error('the target for "' + widgetConfig.name_widgets_popup + '" widget needs to have a "'+ widgetConfig.name_classes_widgets_popup +'" class');
                        }
                        if (this.options.widget_url == null && this.options.iframe_url == null) {
                            throw new Error('the "' + widgetConfig.name_widgets_popup + '" needs a widget_url or iframe_url option');
                        }

                        this.element.off(widgetConfig.selector_widgets_popup);
                        var widgetCore = this.options.widgetCore;

                        var $this = this;
                        var $popup = this.element;

                        var $mask  =   $('<div class="'+ widgetConfig.name_classes_modalMask +'">&nbsp;</div>');
                        $mask.insertAfter($popup);
                        this.$mask = $mask;

                        var $content = $('<div class="' + widgetConfig.name_classes_content +'"></div>');
                        $popup.prepend($content);
                        this.$content = $content;


                        $popup.prepend('<div class="'+ widgetConfig.name_classes_close +' '+ widgetConfig.name_classes_right +' '+ widgetConfig.name_classes_light +' '+ widgetConfig.name_classes_closeThick +'" style="margin-right:13px;margin-top: 7px;"></div>');
                        $popup.find(widgetConfig.selector_elements_close).click(function(){
                                $popup.triggerHandler(widgetConfig.name_event_close);
                            }
                        )

                        $(document).resize(function(event){
                            $popup.trigger(widgetConfig.name_event_moved);
                        });
                        $(window).resize(function(event){
                            $popup.trigger(widgetConfig.name_event_moved);
                        });

                        $popup.on(widgetConfig.name_event_moved + widgetConfig.selector_widgets_core + widgetConfig.selector_widgets_popup,
                                  function(event){
                            event.stopPropagation();

                            var maskHeight = $(document).outerHeight();
                            var maskWidth = $(window).outerWidth();

                            //Set height and width to mask to fill up the whole screen
                            $mask.css({'width':maskWidth,'height':maskHeight});

                            var winH = $(window).height();
                            var winW = $(window).width();
                            var top =  winH/2-$popup.height()/2;
                            var left =  winW/2-$popup.width()/2;

                            //Set the popup window to center
                            $popup.css('top',  top);
                            $popup.css('left', left);
                        });

                        $popup.
                            on(widgetConfig.name_event_notification + widgetConfig.selector_widgets_core + widgetConfig.selector_widgets_popup,
                               widgetCore.get_notification_handler(this));

                        $popup.
                            on(widgetConfig.name_event_close + widgetConfig.selector_widgets_core + widgetConfig.selector_widgets_popup,
                               function(event){
                            event.stopPropagation();
                            $mask.hide();
                            $popup.hide();
                            $popup.triggerHandler(widgetConfig.name_event_closed);
                            $popup.remove();
                            $mask.remove();
                        });

                        if (this.options.widget_url) {
                            widgetCore.widgets.get({
                                "url": this.options.widget_url + '/',
                                "done": this.getInitPopupHandler(this),
                                "fail": function(jqXHR, status, statusText){
                                                $this.element.trigger(
                                                    widgetConfig.name_event_loadingFailed, [
                                                        jqXHR, status, statusText
                                                    ]
                                                );
                                        },
                                "ignoreLock": $this.options.ignoreLock
                            });
                        }else if (this.options.iframe_url){
                            var response = '<div><iframe style="height:150px;width:550px;margin-top:-40px;" src="'+this.options.iframe_url+'"/></div>';
                            this.getInitPopupHandler(this)(response)
                        }

                    },

                    getInitPopupHandler: function($this){
                        return function(response, text, xhr){

                            var $popup = $this.element;
                            var $mask = $this.$mask;
                            var $content = $this.$content;

                            $content.html(response);

                            $this.element.trigger(widgetConfig.name_event_init, [
                                    response, text, xhr
                                ]
                            );

                            $popup.triggerHandler(widgetConfig.name_event_moved);

                            //modal_mask effect
                            $mask.fadeIn(500);
                            $mask.fadeTo("slow", 0.8);

                            //transition effect
                            $popup.fadeIn(1000);
                        }
                    }
            });
        };


        if (widgetConfig.name_widgets_list !== undefined) {
            if (config.debug_level > 0) {
                console.log('register "' + config.widgets.defaults_namespace + '.' + widgetConfig.name_widgets_list +'"')
            };
            $.widget( config.widgets.defaults_namespace + '.' + widgetConfig.name_widgets_list,{
                    options: {
                        width: '100%',
                        pagination_asAlphabet: false,
                        pagination_asPages: false,
                    },
                    /*
                     *
                     *<div id="order_by" class="" style="display:inline-block!important;">&nbsp;</div>
                        ui-icon2 ui-icon-triangle-1-n*/

                    /*
                     **/

                    _create: function() {

                        //if (! this.element.hasClass(widgetConfig.name_classes_widgets_list)) {
                        //    throw new Error('the target for "' + widgetConfig.name_widgets_list + '" widget needs to have a "'+ widgetConfig.name_classes_widgets_list +'" class');
                        //}

                        /*if (this.options.endpoint == undefined) {
                            throw new Error('"' + widgetConfig.name_widgets_list + '" needs to have an endpoint option');
                        }

                        if (this.options.list_url == undefined) {
                            throw new Error('"' + widgetConfig.name_widgets_list + '" needs to have a list_url option');
                        }*/
                        var widgetCore = this.options.widgetCore;

                        //this.element.data('current_page', 1);
                        //this.updatePagination(1, this.get_lastPage())
                        // TODO: clone children as template
                        this.element.children().remove();

                        this.element.off(widgetConfig.selector_widgets_list, this.get_reload_handler(this));

                        this.element.
                            on(widgetConfig.name_event_reload + widgetConfig.selector_widgets_core + widgetConfig.selector_widgets_list,
                               this.get_reload_handler(this));
                        this.element.
                            on(widgetConfig.name_event_zoom + widgetConfig.selector_widgets_core + widgetConfig.selector_widgets_list,
                               this.get_zoomEntry_handler(this));
                        this.element.
                            on(widgetConfig.name_event_remove + widgetConfig.selector_widgets_core + widgetConfig.selector_widgets_list,
                               this.get_removeEntry_handler(this));
                        this.element.
                            on(widgetConfig.name_event_unzoom + widgetConfig.selector_widgets_core + widgetConfig.selector_widgets_list,
                               this.get_unzoomEntry_handler(this));
                        this.element.
                            on(widgetConfig.name_event_notification + widgetConfig.selector_widgets_core + widgetConfig.selector_widgets_list,
                               widgetCore.get_notification_handler(this));


                        this.buildHeader();
                        this.buildFooter();

                        this.goToPage(1);

                    },

                    buildHeader: function(){

                        this.$header = this.element.children(widgetConfig.selector_elements_header);
                        if (this.$header.size() <= 0) {
                            this.element.prepend('<div class="'+ widgetConfig.name_classes_header +'"></div>');
                            this.$header = this.element.children(widgetConfig.selector_elements_header);
                        }

                        var sortable_headers = this.$header.find(widgetConfig.selector_widgets_list + '-entry-header-sortable')

                        if (sortable_headers.size() > 0) {

                            sortable_headers.wrapInner("<span/>");
                            sortable_headers.append('<span class="'+ widgetConfig.name_classes_icon +'"/>')
                            sortable_headers.
                                on("click" + widgetConfig.selector_widgets_core + widgetConfig.selector_widgets_list,
                                   this.get_sortableHeaderClick_handler(this));

                            var sorted = this.$header.find(widgetConfig.selector_widgets_list +'-entry-header-sorted-asc, '+ widgetConfig.selector_widgets_list +'-entry-header-sorted-desc');

                            if (sorted.size() > 1) {
                                throw Error("just one sorted header field allowed");
                            }else if (sorted.size() == 0) {
                                sorted = sortable_headers.find(':first');
                                sorted.addClass(widgetConfig.name_classes_widgets_list +'-entry-header-sorted-asc');
                            }

                            if (sorted.hasClass(widgetConfig.name_classes_widgets_list +'-entry-header-sorted-asc')) {
                                this.element.data('sorted-by', {
                                    'method': 'asc',
                                    'sorted-by': sorted.attr(config.frontend_generateAttributeName('sort-by-identifier'))
                                });
                            }else{
                                this.element.data('sorted-by', {
                                    'method': 'desc',
                                    'sorted-by': sorted.attr(config.frontend_generateAttributeName('sort-by-identifier'))
                                });
                            }
                        };

                        if (this.$header.html() == "") {
                            this.$header.remove();
                        }

                    },

                    get_sortableHeaderClick_handler: function($this){
                        return function(event){
                            event.stopImmediatePropagation();

                            var $target = $(event.target).closest(widgetConfig.selector_widgets_list +'-entry-header-sortable');
                            var order_desc;


                            if ($target.hasClass(widgetConfig.name_classes_widgets_list +'-entry-header-sorted-asc')) {
                                order_desc = true;
                            }else{
                                order_desc = false;
                            }

                            var sorted = $this.$header.find(widgetConfig.selector_widgets_list +'-entry-header-sorted-asc, '+ widgetConfig.selector_widgets_list +'-entry-header-sorted-desc');

                            sorted.removeClass(widgetConfig.name_classes_widgets_list + '-entry-header-sorted-asc').removeClass(widgetConfig.name_classes_widgets_list + '-entry-header-sorted-desc');

                            if (order_desc) {
                                $target.addClass(widgetConfig.name_classes_widgets_list + '-entry-header-sorted-desc');
                                $this.element.data('sorted-by',{
                                    'method': 'desc',
                                    'sorted-by': $target.attr('data-sort-by-identifier')
                                });
                            }else{
                                $target.addClass(widgetConfig.name_classes_widgets_list + '-entry-header-sorted-asc');
                                $this.element.data('sorted-by', {
                                    'method': 'asc',
                                    'sorted-by': $target.attr('data-sort-by-identifier')
                                });
                            }

                            $this.reload();

                        }
                    },

                    buildFooter: function(){

                        this.$footer = this.element.children(widgetConfig.selector_elements_footer);
                        if (this.$footer.size() <= 0) {
                            this.element.append('<div class="'+ widgetConfig.name_classes_footer +'"></div>');
                            this.$footer = this.element.children(widgetConfig.selector_elements_footer);
                        }
                        // TODO: chnage <spac class="icon"></span> to get class name from config (to include namespace)
                        this.$footer.append('<div class="'+ widgetConfig.name_classes_pagination +'">\
                    <div class="'+ widgetConfig.name_classes_left +' '+ widgetConfig.name_classes_pagination +'-pages">\
                        <span class="'+ widgetConfig.name_classes_pagination +'-link-topage-template" '+ config.frontend_generateAttributeName('goto-page') +'="0">\
                            <span style="display:none;">\
                                <strong></strong>\
                            </span>\
                            <a href=""></a>\
                        </span>\
                    </div>\
                    <div class="'+ widgetConfig.name_classes_right +' '+ widgetConfig.name_classes_pagination +'-browse">\
                        <div class="'+ widgetConfig.name_classes_left +' '+ widgetConfig.name_classes_pagination +'-link-left" style="display:none;">\
                            <a href="">\
                                <span class="'+ widgetConfig.name_classes_icon +'"></span> \
                                '+ config.frontend_generateWording('widget:list:pagination:recent_page') +'\
                            </a>\
                        </div>\
                        <div class="'+ widgetConfig.name_classes_right +' '+ widgetConfig.name_classes_pagination +'-link-right" style="display:none;">\
                            <a href="?page=2" '+ config.frontend_generateAttributeName('goto-page') +'="2">\
                                '+ config.frontend_generateWording('widget:list:pagination:next_page') +'\
                                <span class="icon"></span>\
                            </a>\
                        </div>\
                <div class="'+ widgetConfig.name_classes_right +' '+ widgetConfig.name_classes_pagination +'-link-seperator">|</div>\
                        <div class="clearer">&nbsp;</div>\
                    </div>\
            <div class="clearer">&nbsp;</div>\
            </div>');

                        if (this.$footer.html() == "") {
                            this.$footer.remove();
                        }
                    },

                    get_zoomEntry_handler: function($this){
                        return function(event, attr_name, attr_value){
                            var $widget = $this.element;
                            $widget.find(widgetConfig.selector_widgets_list +'-entry:not([' + config.frontend_generateAttributeName(attr_name) + '="' + attr_value + '"])').slideUp();
                            $widget.find(widgetConfig.selector_elements_pagination).slideUp();
                        }
                    },

                    get_removeEntry_handler: function($this){
                        return function(event, attr_name, attr_value){
                            var $widget = $this.element;
                            $widget.find(widgetConfig.selector_widgets_list +'-entry[' + config.frontend_generateAttributeName(attr_name) + '="' + attr_value + '"]').remove();
                            $widget.data(attr_name, undefined);
                            $this.reload();
                        }
                    },

                    get_unzoomEntry_handler: function($this){
                        return function(event, attr_name, attr_value){
                            var $widget = $this.element;
                            $widget.find(widgetConfig.selector_widgets_list +'-entry:not([' + config.frontend_generateAttributeName(attr_name) + '="' + attr_value + '"])').slideDown();
                            $widget.find(widgetConfig.selector_elements_pagination).slideDown();
                        }
                    },

                    get_lastPage: function(){
                        if (this.element.find(widgetConfig.selector_elements_pagination +'-link-topage:last').size()) {
                            return this.element.find(widgetConfig.selector_elements_pagination +'-link-topage:last').attr(config.frontend_generateAttributeName('goto-page'))
                        }
                        return 1 // no pages at all

                    },

                    get_clickOnPaginationLink_handler: function($this){
                        return function(event){
                            event.stopImmediatePropagation();
                            event.preventDefault();

                            $this.goToPage($(event.target).attr(config.frontend_generateAttributeName('goto-page')), $(event.target).attr(config.frontend_generateAttributeName('filter-letter')));

                            return false;
                        }
                    },

                    goToPage: function(page, letter){
                        var page_nr = parseInt(page);
                        var widgetCore = this.options.widgetCore;

                        var data = {
                            'page': page_nr
                        }

                        if (this.element.attr(config.frontend_generateAttributeName('sorted-by')) != undefined) {
                            data['sort-method'] = this.element.attr(config.frontend_generateAttributeName('sorted-by'))['method']; // asc|desc
                            data['sort-by'] = this.element.attr(config.frontend_generateAttributeName('sorted-by'))['sorted-by']; // identifier
                            if (letter && letter != "undefined") {
                                data['startswith']= letter;
                            }
                        }

                        this.element.attr(config.frontend_generateAttributeName('current-page'), page);
                        this.element.attr(config.frontend_generateAttributeName('current-letter'), letter);
                        this.element.triggerHandler(widgetConfig.name_event_loadingStart);
                        /*this.options.endpoint.get({
                            url: this.options.list_url,
                            done: this.get_showList_handler(this, page_nr, letter),
                            data: data,
                            fail: widgetCore.get_failed_xhr_handler(config.dialog_generateWording('widget:list_inquiries:action:load_inquiries'), this),
                            //cache: false
                        })*/ // TODO: FIX
                    },

                    get_reload_handler: function($this){
                        return $this.reload;
                    },

                    reload: function(event){
                        if (event) {
                            event.stopImmediatePropagation();
                        }

                        this.goToPage(
                                        this.element.attr(config.frontend_generateAttributeName('current-page')),
                                        this.element.attr(config.frontend_generateAttributeName('current-letter'))
                                    );
                    },

                    pagination_showLeft: function(number_left, letter){
                        this.element.find(widgetConfig.selector_elements_pagination +'-link-left').show()
                        this.element.find(widgetConfig.selector_elements_pagination +'-link-left').find(
                            'a'
                            ).attr(
                                   config.frontend_generateAttributeName('goto-page'), number_left
                            ).attr(
                                   config.frontend_generateAttributeName('filter-letter'), letter
                            ).attr(
                                   'href', '?'+(letter?('letter='+letter+'&'):'')+'page='+number_left
                            );
                        this.element.find(widgetConfig.selector_elements_pagination +'-link-right').hide()
                        this.element.find(widgetConfig.selector_elements_pagination +'-link-seperator').hide()
                    },

                    pagination_showRight: function(number_right, letter){
                        this.element.find(widgetConfig.selector_elements_pagination +'-link-left').hide()
                        this.element.find(widgetConfig.selector_elements_pagination +'-link-right').show()
                        this.element.find(widgetConfig.selector_elements_pagination +'-link-right').find(
                            'a'
                            ).attr(
                                   config.frontend_generateAttributeName('goto-page'), number_right
                            ).attr(
                                   config.frontend_generateAttributeName('filter-letter'), letter
                            ).attr(
                                   'href','?'+(letter?('letter='+letter+'&'):'')+'page='+number_right
                            );
                        this.element.find(widgetConfig.selector_elements_pagination +'-link-seperator').hide()
                    },

                    pagination_showNone: function(){
                        this.element.find(widgetConfig.selector_elements_pagination +'-link-left').hide()
                        this.element.find(widgetConfig.selector_elements_pagination +'-link-right').hide()
                        this.element.find(widgetConfig.selector_elements_pagination +'-link-seperator').hide()
                    },

                    pagination_showBoth: function(number_right, number_left, letter){
                        this.element.find(widgetConfig.selector_elements_pagination +'-link-left').show()
                        this.element.find(widgetConfig.selector_elements_pagination +'-link-left').find(
                            'a'
                            ).attr(
                                   config.frontend_generateAttributeName('goto-page'), number_left
                            ).attr(
                                   config.frontend_generateAttributeName('filter-letter'), letter
                            ).attr(
                                   'href', '?'+(letter?('letter='+letter+'&'):'')+'page='+number_left
                            );
                        this.element.find(widgetConfig.selector_elements_pagination +'-link-right').show()
                        this.element.find(widgetConfig.selector_elements_pagination +'-link-right').find(
                            'a'
                            ).attr(
                                   config.frontend_generateAttributeName('goto-page'), number_right
                            ).attr(
                                   config.frontend_generateAttributeName('filter-letter'), letter
                            ).attr(
                                   'href', '?'+(letter?('letter='+letter+'&'):'')+'page='+number_right
                            );
                        this.element.find(widgetConfig.selector_elements_pagination +'-link-seperator').show()
                    },

                    buildEntry: function(elem, content){
                        var ret = '<div class="'+ widgetConfig.name_classes_widgets_list +'-entry '+ widgetConfig.name_classes_widgets_core +'" '+ config.frontend_generateAttributeName('widget-name') +'="'+this.options.element_widgetName+'" '+ config.frontend_generateAttributeName('uuid') +'="' + elem.id + '">'
                        if (content != undefined)
                            ret += content;
                        ret += '</div>'
                        return ret
                    },

                    scheduleContentFilling: function($entry_container, elem){
                        // todo: delete. not used
                        function fill_content(data, status, jqXHR){
                            $entry_container.html(data)
                            //update_bindings($entry_container)
                            $entry_container.children().show_inquiry({load_content:false})
                        }
                        var widgetCore = this.options.widgetCore;
                        var data = {};
                        data[this.options.entry_kwarg]=elem;
                        this.element.triggerHandler(widgetConfig.name_event_loadingStart);
                        this.options.entry_entpoint.get({
                            url: this.options.entry_url,
                            done: fill_content,
                            data: data,
                            fail: widgetCore.get_failed_xhr_handler(config.dialog_generateWording('widget:list_inquiries:action:load_inquiry_content'), this),
                        })
                    },

                    get_showList_handler: function($this, page, letter){
                        var widgetCore = this.options.widgetCore;
                        return function(data, status, jqXHR){
                            $this.element.find(widgetConfig.selector_widgets_list +'-container').find(widgetConfig.selector_widgets_list +'-entry').each(function(index, elem){
                                var $elem = $(elem);
                                var content = $elem.html();//.get(0);
                                //content = content.outerHTML || new XMLSerializer().serializeToString(content);
                                $this.element.attr(config.frontend_generateAttributeName('entry-' + $elem.attr(config.frontend_generateAttributeName('uuid'))), content);
                                $elem.remove();
                            })
                            var output = [];
                            $.each(data, function(index, elem){
                                if ($this.element.data('entry-' + elem.id) != undefined) {
                                    output.push($this.buildEntry(elem, $this.element.attr(config.frontend_generateAttributeName('entry-' + elem.id))));
                                }else{
                                    output.push($this.buildEntry(elem));
                                }
                            });
                            var $container = $this.element.find(widgetConfig.selector_widgets_list +'-container');
                            $container.prepend(output.join(""));
                            $.each(data, function(index, elem){
                                var entry = $container.find(widgetConfig.selector_widgets_list +'-entry['+ config.frontend_generateAttributeName('uuid') +'="'+ elem.id +'"]');
                                $this.options.entryCallback(entry, {
                                    // update but show the inquiry if its in store
                                    load_content: $this.element.attr(config.frontend_generateAttributeName('entry-' + elem.id)) == undefined
                                    });
                            });
                            var links = widgetCore.parseLinkHeader(jqXHR.getResponseHeader('Link'));
                            var last_page = 1
                            if (links.last != undefined) {
                                last_page = parseInt( links.last.split('page=')[1].split("&")[0] )
                            }
                            $this.updatePagination(page, last_page, letter);
                            $this.element.triggerHandler(widgetConfig.name_event_loadingFinished);
                        };
                    },


                    updatePagination: function(number, numbers, letter){
                        // create / delete the links as needed for maximum possible pages
                        var $number = this.element.find(widgetConfig.selector_elements_pagination +'-link-topage-template');
                        var output = new Array();
                        if (this.options.pagination_asPages) {
                            var number_tmp = 1;
                            var $number_tmp = this.element.find(widgetConfig.selector_elements_pagination +'-link-topage['+ config.frontend_generateAttributeName('goto-page') +'="'+number_tmp+'"]');
                            while (number_tmp <= numbers || $number_tmp.get(0) != undefined){
                                if (number_tmp > numbers){
                                    $number_tmp.hide();
                                }else if ($number_tmp.get(0) != undefined){
                                    $number_tmp.show();
                                }else{
                                    $number.clone().insertBefore($number).after(" ");
                                    var insert = this.element.find(widgetConfig.selector_elements_pagination +'-link-topage-template['+ config.frontend_generateAttributeName('goto-page') +'="0"]:first');
                                    insert.attr(config.frontend_generateAttributeName('goto-page'), number_tmp).find('a').attr('href', '?page='+number_tmp).attr(config.frontend_generateAttributeName('goto-page'), number_tmp).html(number_tmp);
                                    insert.find('span>strong').html(number_tmp);
                                    insert.show();
                                    insert.addClass(widgetConfig.name_classes_pagination +'-link-topage').removeClass(widgetConfig.name_classes_pagination +'-link-topage-template');
                                    //alert(insert);
                                }
                                number_tmp += 1;
                                $number_tmp = this.element.find(widgetConfig.selector_elements_pagination +'-link-topage['+ config.frontend_generateAttributeName('goto-page') +'="'+number_tmp+'"]');
                            }

                            if (numbers > 10){
                                var number_tmp=4;
                                while (number_tmp < numbers-3){
                                    var $number_tmp = this.element.find(widgetConfig.selector_elements_pagination +'-link-topage['+ config.frontend_generateAttributeName('goto-page') +'="'+number_tmp+'"]');
                                    if ((number_tmp < 4) || (number_tmp > numbers -4) || ((number_tmp > number - 3) && (number_tmp < number + 3))){
                                        $number_tmp.show()
                                    }else{
                                        $number_tmp.hide()
                                        if (number_tmp == number -3 || number_tmp == number + 3 ){
                                            $number_tmp.before('<span class="'+ widgetConfig.name_classes_pagination +'-link-topage-seperator"> . . . </span>');
                                        }
                                    }
                                    number_tmp += 1;
                                }
                            }
                            var $numbers = this.element.find(widgetConfig.selector_elements_pagination +'-link-topage');
                            $numbers.find('span').hide()
                            $numbers.find('a').show()

                            var $number = this.element.find(widgetConfig.selector_elements_pagination +'-link-topage['+ config.frontend_generateAttributeName('goto-page') +'="'+number+'"]');
                            $number.find('span').show()
                            $number.find('a').hide()

                        }else if (this.options.pagination_asAlphabet) {

                            // styling needs 'undefined' to be string
                            // further processing needs the undefined object instead
                            if (letter == undefined) {
                                letter = 'undefined'
                            }

                            var list_alphabet = ['-', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                            var number_tmp = 1;
                            var $this = this;
                            $.each(list_alphabet, function(index, elem){
                                var $letter_tmp = $this.element.find(widgetConfig.selector_elements_pagination +'-link-topage['+ config.frontend_generateAttributeName('filter-letter') +'="'+((elem!=list_alphabet[0])?elem:'undefined')+'"]');
                                if ($letter_tmp.get(0) != undefined){
                                    $letter_tmp.show();
                                }else{
                                    $number.clone().insertBefore($number).after(" ");
                                    var insert = $this.element.find(widgetConfig.selector_elements_pagination +'-link-topage-template['+ config.frontend_generateAttributeName('goto-page') +'="0"]:first');
                                    insert.attr(
                                                config.frontend_generateAttributeName('goto-page'), number_tmp
                                            ).attr(
                                                   config.frontend_generateAttributeName('filter-letter'), (elem!=list_alphabet[0])?elem:'undefined'
                                            ).find(
                                            'a'
                                            ).attr(
                                                   'href', '?'+((elem!=list_alphabet[0])?('letter='+elem+'&'):'')+'page='+number_tmp
                                            ).attr(
                                                   config.frontend_generateAttributeName('goto-page'), number_tmp
                                            ).attr(
                                                   config.frontend_generateAttributeName('filter-letter'), (elem!=list_alphabet[0])?elem:'undefined'
                                            ).html(elem);
                                    insert.find('span>strong').html(elem);
                                    insert.show();
                                    insert.addClass(widgetConfig.name_classes_pagination +'-link-topage').removeClass(widgetConfig.name_classes_pagination +'-link-topage-template');
                                    //alert(insert);
                                }
                            });
                            var $numbers = this.element.find(widgetConfig.selector_elements_pagination +'-link-topage');
                            $numbers.find('span').hide()
                            $numbers.find('a').show()

                            var $number = this.element.find(widgetConfig.selector_elements_pagination +'-link-topage[data-filter-letter="'+letter+'"]');
                            $number.find('span').show()
                            $number.find('a').hide()
                        }


                        // styling needs 'undefined' to be string
                        // further processing needs the undefined object instead
                        if (letter == 'undefined') {
                            letter = undefined
                        }

                        this.element.find(widgetConfig.selector_elements_pagination +' a').
                            off(widgetConfig.selector_elements_pagination);
                        this.element.find(widgetConfig.selector_elements_pagination +' a').
                            on('click' + widgetConfig.selector_widgets_core + widgetConfig.selector_widgets_list + widgetConfig.selector_elements_pagination,
                               this.get_clickOnPaginationLink_handler(this))

                        // show as for current page
                        this.element.find(widgetConfig.selector_elements_pagination +'-link-topage-seperator').remove();


                        if (number == 1 && numbers > number){
                            this.pagination_showRight(number+1);
                        }else if (number == numbers && numbers > 1){
                            this.pagination_showLeft(number-1);
                        }else if (numbers == 1){
                            this.pagination_showNone();
                        }else{
                            this.pagination_showBoth(number+1, number-1);
                        }
                    },
            });
        };


        if (widgetConfig.name_widgets_core !== undefined) {
            if (config.debug_level > 0) {
                console.log('register "' + config.widgets.defaults_namespace + '.' + widgetConfig.name_widgets_core +'"')
            };
            $.widget( config.widgets.defaults_namespace + '.' + widgetConfig.name_widgets_core,{
                    options: {
                        width: '100%',
                        load_content: false,
                        update_content: false
                    },

                    _create: function() {

                        /*if (! this.element.hasClass(widgetConfig.name_classes_widgets_core)) {
                            throw new Error('the target for "' + widgetConfig.name_widgets_core + '" widget needs to have a "'+ widgetConfig.name_classes_widgets_core +'" class');
                        }*/

                        /*if (this.options.load_content  && this.options.widget_url == undefined) {
                            throw new Error('"' + widgetConfig.name_widgets_core + '" needs to be initialized with an "widget_url" attribute');
                        }*/

                        if (this.element.css('position') == 'static'){
                            this.element.css('position', "relative")
                        }

                        this.element.data('__initialized', true); // otherwise widgetCore.scan() would initialize it again

                        this.apply = function($target){
                            //if (!$target.data('__initialized')) {
                                return this.options.apply_method.apply(this, arguments)
                            //}
                        }
                        if (this.options.content) {
                            this.element.html(this.options.content)
                        }

                        this.element.off(widgetConfig.selector_widgets_core);
                        this.element.on(widgetConfig.name_event_loadingFailed + widgetConfig.selector_widgets_core, this.get_initFailed_handler(this));
                        this.element.on(widgetConfig.name_event_loading + widgetConfig.selector_widgets_core, this.get_loadingWidget_handler(this));
                        this.element.on(widgetConfig.name_event_init + widgetConfig.selector_widgets_core, this.get_initWidgetDone_handler(this));
                        this.element.on(widgetConfig.name_event_tosDenied + widgetConfig.selector_widgets_core, this.get_ToSDenied_handler(this));
                        var widgetCore = this.options.widgetCore;
                        if (widgetCore) {
                            this.element.on(widgetConfig.name_event_notification + widgetConfig.selector_widgets_core, widgetCore.get_notification_handler(this));
                        }

                        // css widget stylesheet activation by adding widget specific class
                        /*var className = this.element.attr(config.frontend_generateAttributeName('widget-name'));
                        if (className === undefined){
                            console.log(this.element);
                            throw Error('attribute "'+config.frontend_generateAttributeName('widget-name')+'" was not set');
                        };
                        this.element.addClass(config.frontend_generateClassName(className));*/
                        this.$loading = null;
                        this.$loading_toggle = null;

                        // start loading
                        var $this = this;

                        if (this.options.load_content || this.options.update_content) {

                            if (! this.options.update_content) {
                                this.element.trigger(widgetConfig.name_event_loading);
                            }

                            var data = {}

                            if (this.options.widget_data) {
                                $.extend(data, this.options.widget_data);
                            }

                            this.element.triggerHandler(widgetConfig.name_event_loadingStart);
                            // load and initialize it
                            widgetCore.widgets.get({
                                "url": this.options.widget_url + '/',
                                "data": data,
                                "done": function(response, text, xhr){
                                                $this.element.trigger(widgetConfig.name_event_init, [
                                                        response, text, xhr
                                                    ]
                                                );
                                                $this.element.triggerHandler(widgetConfig.name_event_loadingFinished);
                                        },
                                "fail": function(jqXHR, status, statusText){
                                                $this.element.trigger(
                                                    widgetConfig.name_event_loadingFailed, [
                                                        jqXHR, status, statusText
                                                    ]
                                                );
                                                $this.element.triggerHandler(widgetConfig.name_event_loadingFinished);

                                        }
                            });
                        }else{
                            $this.element.trigger(widgetConfig.name_event_init);
                        }

                    },

                    get_startLoading_handler: function($this){
                        return function(event){
                            event.stopPropagation();
                            if ($this.$loading == null) {
                                return
                            }
                            if (!$this.$loading.hasClass(widgetConfig.name_classes_active)){
                                $this.$loading.addClass(widgetConfig.name_classes_active);
                                $this.$loading_toggle.hide()
                            }
                            $this.$loading.attr(config.frontend_generateClassName('activity-counter'), $this.$loading.attr(config.frontend_generateClassName('activity-counter')) + 1);
                        }
                    },

                    get_endLoading_handler: function($this){
                        return function(event){
                            event.stopPropagation();
                            if ($this.$loading == null) {
                                return
                            }
                            if ($this.$loading.hasClass(widgetConfig.name_classes_active)){
                                var counter = $this.$loading.attr(config.frontend_generateClassName('activity-counter'));
                                if (counter == 0) {
                                    return;
                                }else if (counter == 1) {
                                    $this.$loading.removeClass(widgetConfig.name_classes_active);
                                    $this.$loading_toggle.show()
                                };
                                $this.$loading.attr(config.frontend_generateClassName('activity-counter'), counter - 1);
                            }
                        }
                    },


                    get_initFailed_handler: function($this){
                        var widgetCore = this.options.widgetCore;
                        return function (event, jqXHR, status, statusText){
                            event.stopPropagation();
                            error = widgetCore.ajax.translateResponse_toJSON(jqXHR);
                            $this.element.html(error.html || jqXHR.responseText ? "error loading" : "server unavailable"); // todo
                            widgetCore.get_failed_xhr_handler(config.dialog_generateWording('widget:load_widget'), $this.element)(jqXHR, status, statusText);
                        }
                    },

                    get_loadingWidget_handler: function($this){
                        return function(event){
                            event.stopPropagation();
                            $this.element.html('<div class="'+ widgetConfig.name_classes_loadingPlaceholder +'"/>'); //todo
                        }
                    },

                    get_initWidgetDone_handler: function($this){
                        return function(event){
                            // loading init
                            $this.$loading = $this.element.find(widgetConfig.selector_elements_loading +':first');
                            $this.$loading.attr(config.frontend_generateClassName('activity-counter'), 0);
                            $this.$loading_toggle = $this.$loading.parent().children(widgetConfig.selector_elements_hideForLoading);

                            $this.element.
                                on(widgetConfig.name_event_loadingStart + widgetConfig.selector_widgets_core,
                                   $this.get_startLoading_handler($this));
                            $this.element.
                                on(widgetConfig.name_event_loadingFinished + widgetConfig.selector_widgets_core,
                                   $this.get_endLoading_handler($this));

                            event.stopPropagation();
                            //todo
                        }
                    },

                    get_ToSDenied_handler: function($this){
                        return function(event){
                            $this.html('T.o.S.') // TODO: implement
                        }
                    }
            });
        }

        if (widgetConfig.name_widgets_form !== undefined) {
            if (config.debug_level > 0) {
                console.log('register "' + config.widgets.defaults_namespace + '.' + widgetConfig.name_widgets_form +'"')
            };
            $.widget( config.widgets.defaults_namespace + '.' + widgetConfig.name_widgets_form,{
                    options:{
                        resetOn_postSave: true
                    },

                    _create: function() {

                        if (! this.element.hasClass(widgetConfig.name_classes_widgets_form)) {
                            throw new Error('the target for "' + widgetConfig.name_widgets_form + '" widget needs to have a "'+ widgetConfig.name_classes_widgets_form +'" class');
                        }
                        var widgetCore = this.options.widgetCore;

                        this.init_inputs();

                        this.element.
                            on(widgetConfig.name_event_preSave + widgetConfig.selector_widgets_form,
                               this.get_preSave_handler(this));
                        this.element.
                            on(widgetConfig.name_event_postSave + widgetConfig.selector_widgets_form,
                               this.get_postSave_handler(this));
                        this.element.find(widgetConfig.selector_elements_save).
                            on('click'+ widgetConfig.selector_widgets_form,
                               this.get_checkBeforeSave_handler(this));
                        this.element.
                            on(widgetConfig.name_event_initiateSave + widgetConfig.selector_widgets_form,
                               this.get_checkBeforeSave_handler(this));
                        this.element.
                            on(widgetConfig.name_event_saveFailed + widgetConfig.selector_widgets_form,
                               this.get_submitFailed_handler(this));
                        this.element.
                            on(widgetConfig.name_event_notification + widgetConfig.selector_widgets_core + widgetConfig.selector_widgets_form,
                               widgetCore.get_notification_handler(this));
                        this.element.
                            on(widgetConfig.name_event_error + widgetConfig.selector_widgets_core + widgetConfig.selector_widgets_form,
                               this.get_error_handler(this));

                    },

                    get_error_handler: function($this){
                        return function(event, action, error_data, jqXHR){
                            if (jqXHR && jqXHR.status == 400) {
                                $.each(error_data, function(index, err){
                                    $this.element.find('input, textarea, select').each(function(index, elem){
                                        var $elem = $(elem);
                                        if (err[$elem.attr(config.frontend_generateClassName('backend-attr'))]) {
                                            event.stopImmediatePropagation();
                                            var msg = err[$elem.attr(config.frontend_generateClassName('backend-attr'))];
                                            $elem.addClass(widgetConfig.name_classes_invalid);
                                            alert(msg);
                                            $elem.removeClass(widgetConfig.name_classes_invalid);
                                        }
                                    });
                                })
                                if (event.isImmediatePropagationStopped()) {
                                    $this.element.closest(widgetConfig.selector_widgets_core).triggerHandler(widgetConfig.name_event_loadingFinished);
                                }

                            }
                        }
                    },

                    get_checkBeforeSave_handler: function($this){
                        return function(event){
                            // no form submit shall be handled
                            event.preventDefault();

                            // no customer specific, global, handlers should be alarmed
                            event.stopPropagation();

                            var $form = $this.element;

                            // do pre_save actions
                            $form.triggerHandler(widgetConfig.name_event_preSave)

                            // this is filled with data by form_validation mehtods
                            var check_form_result = {
                                form_is_valid: true,
                                errors: new Array(),
                                warnings: new Array()
                                };

                            // handlerResult is undefined if no handler was executed
                            // might be helpfull if this someday is relevant
                            var handlerResult = $form.triggerHandler(widgetConfig.name_event_checkInput, [check_form_result])

                            var fakeXHR = {status: 400} // Bad Request: HTTP 400

                            if (check_form_result.form_is_valid){
                                    $form.trigger('save'); // TODO generate event name with config (to include namespace)
                                }else{
                                    if (handlerResult != undefined) {
                                        if (check_form_result.errors.length)
                                            $form.trigger(
                                                widgetConfig.name_event_error, [
                                                    config.dialog_generateWording('widget:new_inquiry:action:input:validation'),
                                                    check_form_result.errors,
                                                    fakeXHR
                                                ]
                                            );
                                        if (check_form_result.warnings.length)
                                            $form.trigger(
                                                widgetConfig.name_event_warning, [
                                                    config.dialog_generateWording('widget:new_inquiry:action:input:validation'),
                                                    check_form_result.warnings,
                                                    fakeXHR
                                                ]
                                            );
                                    }else{
                                        if (check_form_result.errors.length)
                                            $form.trigger(
                                                widgetConfig.name_event_error, [
                                                    config.dialog_generateWording('widget:new_inquiry:action:input:validation'),
                                                    new Array({
                                                        'elem': $form,
                                                        'msg': config.dialog_generateWording('widget:new_inquiry:action:input:validation:not_existing')
                                                    }),
                                                    fakeXHR
                                                ]
                                            );
                                    }

                                    $form.triggerHandler(widgetConfig.name_event_saveFailed);
                                };
                        };
                    },

                    get_inputFocus_handler: function($this){
                        return function(event){
                            var $input = $(event.target);
                            event.stopPropagation();

                            if($input.val() == $input.attr(config.frontend_generateClassName('descriptive-value'))){
                                $input.val('');
                            }
                            $input.removeClass(widgetConfig.name_classes_descriptive);
                        };
                    },

                    get_inputBlur_handler: function($this){
                        return function(event){
                            var $input = $(event.target);
                            event.stopPropagation();

                            if(!$input.val()){
                                $input.val($input.attr(config.frontend_generateClassName('descriptive-value')));
                                $input.addClass(widgetConfig.name_classes_descriptive);
                            }
                        };
                    },

                    get_preSave_handler: function($this){
                        return function(event){
                            var $form = $this.element;

                            // deactivate save button
                            $this.deactivate_formButtons();

                            // reset default values
                            $.each($form.find('input, textarea'), function(index, elem){
                                var $elem = $(elem);
                                if ($elem.attr(config.frontend_generateClassName('descriptive-value')) == $elem.val()){
                                    $elem.val('');
                                }
                            });
                        };
                    },

                    init_inputs: function(){
                        var $form = this.element;
                        var $this = this

                        // reset default values
                        $.each($form.find('input, textarea, select'), function(index, elem){
                            var $elem = $(elem);

                            if ($elem.attr(config.frontend_generateClassName('descriptive-value')) != undefined){
                                if (!$elem.val()) {
                                    // set value
                                    $elem.val($elem.attr(config.frontend_generateClassName('descriptive-value')));
                                    $elem.addClass(widgetConfig.name_classes_descriptive);
                                }

                                // set handlers
                                $elem.
                                    off(widgetConfig.selector_widgets_form +'-descriptive-value');

                                $elem.
                                    on('focus'+ widgetConfig.selector_widgets_form +'-descriptive-value',
                                       $this.get_inputFocus_handler($this));
                                $elem.
                                    on('blur'+ widgetConfig.selector_widgets_form +'-descriptive-value',
                                       $this.get_inputBlur_handler($this));
                            }
                        });
                    },

                    get_postSave_handler: function($this){
                        return function(event){
                            var $form = $this.element;

                            if ($this.option('resetOn_postSave'))
                                $this.reset()

                            $this.init_inputs()

                            // activate save button
                            $this.activate_formButtons();
                        };
                    },

                    reset: function(){

                        this.element.each(function(index, form){
                            var $form = $(form);
                            $form.get(0).reset();
                        });

                    },

                    get_submitFailed_handler: function($this){
                        return function(event){
                            var $form = $this.element;

                            // activate save button
                            $this.activate_formButtons();
                        }
                    },

                    deactivate_formButtons: function(){
                        var $save_button =  this.element.find(widgetConfig.selector_elements_save);
                        $save_button.prop("disabled", true);
                        $save_button.addClass(widgetConfig.name_classes_deactivated);
                    },

                    activate_formButtons: function(){
                        var $save_button =  this.element.find(widgetConfig.selector_elements_save);
                        $save_button.prop("disabled", false);
                        $save_button.removeClass(widgetConfig.name_classes_deactivated);
                    }


            });
        };
        $[config.widgets.defaults_namespace]._widgetConfig = widgetConfig

    });

    if (require.defined('customFancyWidgetCore')){
        console.log('custom widgets loaded');
    }
    return $;
});