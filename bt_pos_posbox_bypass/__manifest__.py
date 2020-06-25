# -*- coding: utf-8 -*----
##############################################################################
#
#    OpenERP, Open Source Management Solution
#    Copyright (C) 2018 Business IT Systems Pte Ltd (BiTS)
#    (<https://bitsbi.com>).
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################

{
    'name': 'POSBox Bypass',
    'version': '1.0',
    'category': 'Point Of Sale',
    'license': 'AGPL-3',
    'summary': 'POS Sale Details Report bypassing POSBox',
    'description': """

=======================

Pos box print bypass

""",
    'images': ['static/description/banner.jpg'],
    'author' : 'BroadTech IT Solutions Pvt Ltd',
    'website' : 'http://www.broadtech-innovations.com',
    'depends': ['point_of_sale'],
    'data': [
        'views/pos_config_view.xml',
        'views/pos_template.xml',
    ],
    'qweb': ['static/src/xml/pos_sale_details_template.xml'],   
    'installable': True,
    'auto_install': False,
    'application': True,
    
}


# vim:expandtab:smartindent:tabstop=2:softtabstop=2:shiftwidth=2:
