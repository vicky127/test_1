odoo.define('bt_pos_posbox_bypass.pos_reprint', function (require) {
"use strict";
var gui = require('point_of_sale.gui');
var devices = require('point_of_sale.devices');
var screens = require('point_of_sale.screens');
var core = require('web.core');
var screens = require('point_of_sale.screens');
var Model = require('web.DataModel');
var QWeb = core.qweb;
var PosBaseWidget = require('point_of_sale.BaseWidget');
var _t = core._t;

var ReprintButtonByPassWidget = screens.ReceiptScreenWidget.extend({
    template: 'ReprintButtonByPassWidget',
    show: function(){
        this._super();
        var self = this;
        this.render_oldreceipt();
        this.handle_auto_print();
    },
    click_next: function(){
        this.gui.show_screen('products');
    },
    click_back: function(){
        this.gui.show_screen('products');
    },
    handle_auto_print: function() {
        if (this.should_auto_print()) {
            this.print();
            if (this.should_close_immediately()){
                this.click_next();
            }
        } else {
            this.lock_screen(false);
        }
    },
    should_auto_print: function() {
    	return false
    },
    should_close_immediately: function() {
        return this.pos.config.iface_print_via_proxy && this.pos.config.iface_print_skip_screen;
    },
    lock_screen: function(locked) {
        this._locked = locked;
        if (locked) {
            this.$('.next').removeClass('highlight');
        } else {
            this.$('.next').addClass('highlight');
        }
    },
    print_web: function() {
        window.print();
        this.pos.get_order()._printed = true;
    },
    print: function(){
    	this.lock_screen(true);
    	var self = this;
        setTimeout(function(){
            self.lock_screen(false);
        }, 1000);
        this.print_web();
    },
    
    get_session_startdate :function(session_datetime) {
    	var starttime = moment.utc(session_datetime, 'YYYY-MM-DD hh:mm:ss');
    	var local_datetime = starttime.local().format('MM/DD/YYYY,hh:mm:ss A')
        return local_datetime;
    },
    render_oldreceipt: function() {
        var order = this.pos.get_order();
        var self = this;
        if(self.pos.old_receipt_type == 'sale_details'){
        	new Model('report.point_of_sale.report_saledetails').call('get_sale_details').then(function(result){
		        self.$('.pos-reprint').html(QWeb.render('PosSaleDetailsBypass',self.pos.old_env));
	        });
        }
        if(self.pos.old_receipt_type == 'receipt'){
        	
        	this.$('.pos-receipt-container').html(QWeb.render('PosTicket',self.pos.old_env));
        }
        
    },
});

gui.define_screen({name:'reprint_bypass', widget: ReprintButtonByPassWidget});


var ReprintButtonByPass = screens.ActionButtonWidget.extend({
    template: 'ReprintButtonByPass',
    button_click: function() {
        if (this.pos.old_env) {
        	return this.gui.show_screen('reprint_bypass');
        } else {
            this.gui.show_popup('error', {
                'title': _t('Nothing to Print'),
                'body':  _t('There is no previous receipt to print.'),
            });
        }
    },
});



screens.ReceiptScreenWidget.include({
	render_receipt:function() {
		var self = this;
        this._super();
        var order = this.pos.get_order();
        self.pos.old_receipt_type = 'receipt'
        console.log('***************************',  self.pos.old_receipt_type)
        self.pos.old_env = {
        	 widget:this,
             order: order,
             receipt: order.export_for_printing(),
             orderlines: order.get_orderlines(),
             paymentlines: order.get_paymentlines()
        }
        
        console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^',self.pos.old_env)
        
	},
});
screens.define_action_button({
    'name': 'reprint_bypass',
    'widget': ReprintButtonByPass,
    'condition': function(){
        return this.pos.config.bypass_reprint;
    },
});
});