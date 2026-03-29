from flask import render_template
from . import products

@products.route('/')
def index():
    # Placeholder for product listing
    return render_template('products/index.html')

@products.route('/product/<int:product_id>')
def product_detail(product_id):
    # Placeholder for product detail
    return render_template('products/detail.html', product_id=product_id)
