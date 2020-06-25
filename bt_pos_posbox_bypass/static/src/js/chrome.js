odoo.define('bt_pos_posbox_bypass.chrome', function (require) {
"use strict";
var gui = require('point_of_sale.gui');
var ChromeByPass = require('point_of_sale.chrome');
var screens = require('point_of_sale.screens');
var Model = require('web.DataModel');
var core = require('web.core');
var PosBaseWidget = require('point_of_sale.BaseWidget');
var QWeb = core.qweb;
var _t = core._t;

var SaleDetailsWidget = screens.ReceiptScreenWidget.extend({
    template: 'SaleDetailsWidget',
    show: function(){
    	
    	console.log('DDDDDDDDDDDDDDDDDDDDD',this)
        this._super();
        var self = this;
        this.render_sale_details();
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
   
    	
    render_sale_details: function() {
        var order = this.pos.get_order();
        var self = this;
        new Model('report.point_of_sale.report_saledetails').call('get_sale_details').then(function(result){
		        self.$('.pos-receipt-container-sale').html(QWeb.render('PosSaleDetailsBypass',{
		        	widget: new PosBaseWidget(self),
		            company: self.pos.company,
		            pos: self.pos,
		            products: result.products,
		            payments: result.payments,
		            taxes: result.taxes,
		            total_paid: result.total_paid,
		            date: (new Date()).toLocaleString(),
		            date_start :self.get_session_startdate(self.pos.pos_session.start_at),
		            date_end: (new Date()).toLocaleString(),
	            }));
	        });
    },
});

gui.define_screen({name:'print_report', widget: SaleDetailsWidget});

var SaleDetailsButtonBypass = PosBaseWidget.extend({
    template: 'SaleDetailsButtonBypass',
    print_sale_details_bypass: function(){
    	return this.gui.show_screen('print_report');
    },
    start: function(){
        var self = this;
        this.$el.click(function(){
            self.print_sale_details_bypass();
        });
    },
});

ChromeByPass.Chrome.include({
    build_widgets: function(){
    	var widgets = this.widgets
    	
        if (this.pos.config.bypass_print_via_proxy) {
        	for (var i = 0; i < this.widgets.length; i++) {
        		var def = this.widgets[i];
        		if(def.name == 'sale_details'){
        			var index = i
        			widgets.splice(index,0,{
                	    'name': 'sale_button_bypass',
                	    'widget': SaleDetailsButtonBypass,
                	    'append':  '.pos-rightheader',
                	    'condition': function(){ return true; },
                	});
        			break;
        		}
        	}
        	if (this.pos.config.use_proxy) {
        		this.widgets = $.grep(widgets, function(e){ 
        		     return e.name != 'sale_details'; 
        		});
        	}
        }
    	this._super();
    },
});
});