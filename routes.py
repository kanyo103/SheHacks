from flask import render_template, request, jsonify, session, redirect, url_for, flash
from app import app
from models import data_store
import logging

@app.route('/')
def index():
    """Landing page with customer selection"""
    customers = data_store.get_all_customers()
    return render_template('index.html', customers=customers)

@app.route('/login', methods=['POST'])
def login():
    """Handle user login"""
    email = request.form.get('email', '').strip().lower()
    password = request.form.get('password', '')
    
    # Find customer by email
    customer = None
    for customer_data in data_store.get_all_customers():
        if customer_data['email'].lower() == email:
            customer = customer_data
            break
    
    if customer and password == 'demo123':  # Simple demo password
        session['customer_id'] = customer['id']
        return jsonify({
            'success': True,
            'message': f'Welcome back, {customer["name"]}!',
            'redirect': '/dashboard'
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Invalid email or password. Use demo123 as password for demo accounts.'
        })

@app.route('/select_customer/<customer_id>')
def select_customer(customer_id):
    """Legacy customer selection for backwards compatibility"""
    customer = data_store.get_customer(customer_id)
    if customer:
        session['customer_id'] = customer_id
        return redirect(url_for('dashboard'))
    else:
        flash('Customer not found', 'error')
        return redirect(url_for('index'))

@app.route('/dashboard')
def dashboard():
    """Customer dashboard showing points balance and overview"""
    customer_id = session.get('customer_id')
    if not customer_id:
        return redirect(url_for('index'))
    
    customer = data_store.get_customer(customer_id)
    if not customer:
        flash('Customer not found', 'error')
        return redirect(url_for('index'))
    
    recent_transactions = data_store.get_customer_transactions(customer_id)[-5:]  # Last 5 transactions
    total_transactions = len(data_store.get_customer_transactions(customer_id))
    
    return render_template('dashboard.html', 
                         customer=customer, 
                         recent_transactions=recent_transactions,
                         total_transactions=total_transactions)

@app.route('/send_money')
def send_money():
    """Send money page"""
    customer_id = session.get('customer_id')
    if not customer_id:
        return redirect(url_for('index'))
    
    customer = data_store.get_customer(customer_id)
    if not customer:
        flash('Customer not found', 'error')
        return redirect(url_for('index'))
    
    return render_template('send_money.html', customer=customer)

@app.route('/process_remittance', methods=['POST'])
def process_remittance():
    """Process remittance transaction and award points"""
    customer_id = session.get('customer_id')
    if not customer_id:
        return jsonify({'success': False, 'message': 'Not logged in'})
    
    try:
        amount = float(request.form.get('amount', 0))
        recipient = request.form.get('recipient', '').strip()
        destination_country = request.form.get('destination_country', '').strip()
        mukuru_card = request.form.get('mukuru_card', '').strip()
        id_number = request.form.get('id_number', '').strip()
        
        if amount <= 0:
            return jsonify({'success': False, 'message': 'Invalid amount'})
        
        if not recipient:
            return jsonify({'success': False, 'message': 'Recipient name is required'})
        
        if not destination_country:
            return jsonify({'success': False, 'message': 'Please select a destination country'})
        
        # Calculate points: 1 point per R100 sent
        points_earned = int(amount // 100)
        
        # Update customer points
        customer = data_store.update_customer_points(customer_id, points_earned)
        
        if not customer:
            return jsonify({'success': False, 'message': 'Customer not found'})
        
        # Get country information for display
        country_info = {
            'ZW': 'Zimbabwe', 'ZA': 'South Africa', 'KE': 'Kenya', 'ZM': 'Zambia',
            'MZ': 'Mozambique', 'UG': 'Uganda', 'TZ': 'Tanzania', 'MW': 'Malawi',
            'BW': 'Botswana', 'LS': 'Lesotho', 'AO': 'Angola', 'GH': 'Ghana',
            'ET': 'Ethiopia', 'BD': 'Bangladesh', 'CN': 'China', 'IN': 'India',
            'EU': 'European Union', 'UK': 'United Kingdom'
        }
        
        destination_name = country_info.get(destination_country, destination_country)
        
        # Add verification info
        verification_method = None
        verification_value = None
        if mukuru_card:
            verification_method = "mukuru_card"
            verification_value = mukuru_card
        elif id_number:
            verification_method = "id_number"
            verification_value = id_number

        # Add transaction record with destination country and verification
        transaction = data_store.add_transaction(customer_id, amount, recipient, points_earned, destination_country, verification_method, verification_value)
        
        return jsonify({
            'success': True, 
            'message': f'R{amount:.2f} sent successfully to {recipient} in {destination_name}! 🎉',
            'points_earned': points_earned,
            'new_balance': customer['points_balance'],
            'transaction_id': transaction['id']
        })
        
    except ValueError:
        return jsonify({'success': False, 'message': 'Invalid amount format'})
    except Exception as e:
        logging.error(f"Error processing remittance: {e}")
        return jsonify({'success': False, 'message': 'Transaction failed'})

@app.route('/rewards')
def rewards():
    """Rewards marketplace"""
    customer_id = session.get('customer_id')
    if not customer_id:
        return redirect(url_for('index'))
    
    customer = data_store.get_customer(customer_id)
    if not customer:
        flash('Customer not found', 'error')
        return redirect(url_for('index'))
    
    rewards = data_store.get_all_rewards()
    
    # Group rewards by category
    categories = {}
    for reward in rewards:
        category = reward['category']
        if category not in categories:
            categories[category] = []
        categories[category].append(reward)
    
    return render_template('rewards.html', 
                         customer=customer, 
                         categories=categories,
                         rewards=rewards)

@app.route('/redeem_reward', methods=['POST'])
def redeem_reward():
    """Redeem a reward using points"""
    customer_id = session.get('customer_id')
    if not customer_id:
        return jsonify({'success': False, 'message': 'Not logged in'})
    
    try:
        reward_id = request.form.get('reward_id')
        
        redemption, message = data_store.redeem_reward(customer_id, reward_id)
        
        if redemption:
            customer = data_store.get_customer(customer_id)
            if not customer:
                return jsonify({'success': False, 'message': 'Customer not found'})
            return jsonify({
                'success': True,
                'message': message,
                'new_balance': customer['points_balance'],
                'redemption_id': redemption['id']
            })
        else:
            return jsonify({'success': False, 'message': message})
            
    except Exception as e:
        logging.error(f"Error redeeming reward: {e}")
        return jsonify({'success': False, 'message': 'Redemption failed'})

@app.route('/transaction_history')
def transaction_history():
    """View complete transaction history"""
    customer_id = session.get('customer_id')
    if not customer_id:
        return redirect(url_for('index'))
    
    customer = data_store.get_customer(customer_id)
    if not customer:
        flash('Customer not found', 'error')
        return redirect(url_for('index'))
    
    transactions = data_store.get_customer_transactions(customer_id)
    # Sort by timestamp descending (newest first)
    transactions.sort(key=lambda x: x['timestamp'], reverse=True)
    
    return render_template('transaction_history.html', 
                         customer=customer, 
                         transactions=transactions)

@app.route('/demo')
def demo_presentation():
    """Demo presentation page"""
    return render_template('demo_presentation.html')

@app.route('/leaderboard')
def leaderboard():
    """Customer leaderboard showing top earners"""
    customers = data_store.get_all_customers()
    
    # Sort customers by points balance in descending order
    sorted_customers = sorted(customers, key=lambda x: x['points_balance'], reverse=True)
    
    # Add rank to each customer
    for i, customer in enumerate(sorted_customers):
        customer['rank'] = i + 1
    
    return render_template('leaderboard.html', customers=sorted_customers)

@app.route('/logout')
def logout():
    """Logout current customer"""
    customer_name = ''
    if 'customer_id' in session:
        customer = data_store.get_customer(session['customer_id'])
        customer_name = customer['name'] if customer else ''
    
    session.pop('customer_id', None)
    
    if customer_name:
        flash(f'Goodbye {customer_name}! You have been logged out successfully.', 'success')
    else:
        flash('Logged out successfully', 'success')
    
    return redirect(url_for('index'))

@app.errorhandler(404)
def not_found(error):
    return render_template('index.html'), 404

@app.route('/receive_collect')
def receive_collect():
    """Receive & Collect page for money collections and gift sending"""
    customer_id = session.get('customer_id')
    if not customer_id:
        return redirect(url_for('index'))
    
    customer = data_store.get_customer(customer_id)
    if not customer:
        flash('Customer not found', 'error')
        return redirect(url_for('index'))
    
    # Mock data for pending collections (in real app, this would come from database)
    pending_collections = [
        {
            'id': 'COL001',
            'sender_name': 'Alice Johnson',
            'amount': 'R 1,500.00',
            'date': '2 days ago',
            'reference': 'MUK-COL-001',
            'collection_method': 'Bank Transfer',
            'verification_method': 'mukuru_card'
        },
        {
            'id': 'COL002', 
            'sender_name': 'David Wilson',
            'amount': 'R 750.00',
            'date': '1 day ago',
            'reference': 'MUK-COL-002',
            'collection_method': 'Cash Pickup',
            'verification_method': 'id_number'
        }
    ]
    
    # Available gifts from rewards catalog
    available_gifts = [
        {'id': 'airtime50', 'name': 'R50 Airtime', 'description': 'Mobile airtime voucher', 'points_cost': 50, 'icon': 'fas fa-mobile-alt'},
        {'id': 'grocery100', 'name': 'R100 Grocery Voucher', 'description': 'Shoprite/Checkers voucher', 'points_cost': 100, 'icon': 'fas fa-shopping-cart'},
        {'id': 'fuel200', 'name': 'R200 Fuel Voucher', 'description': 'Shell/BP fuel voucher', 'points_cost': 200, 'icon': 'fas fa-gas-pump'},
        {'id': 'entertainment500', 'name': 'R500 Entertainment', 'description': 'Netflix/Showmax voucher', 'points_cost': 500, 'icon': 'fas fa-film'}
    ]
    
    # Recent gift activity (mock data)
    recent_gifts = [
        {'type': 'sent', 'reward_name': 'R50 Airtime', 'recipient_name': 'John Doe', 'date': '2 days ago'},
        {'type': 'received', 'reward_name': 'R100 Grocery Voucher', 'sender_name': 'Sarah Smith', 'date': '5 days ago'}
    ]
    
    return render_template('receive_collect.html', 
                         customer=customer, 
                         pending_collections=pending_collections,
                         available_gifts=available_gifts,
                         recent_gifts=recent_gifts)

@app.route('/collect_money', methods=['POST'])
def collect_money():
    """Handle money collection"""
    customer_id = session.get('customer_id')
    if not customer_id:
        return jsonify({'success': False, 'message': 'Not logged in'})
    
    collection_id = request.form.get('collection_id')
    
    if not collection_id:
        return jsonify({'success': False, 'message': 'Invalid collection ID'})
    
    # In real app, mark collection as completed in database
    return jsonify({
        'success': True,
        'message': f'Money collected successfully! Collection ID: {collection_id}'
    })

@app.route('/send_gift', methods=['POST'])
def send_gift():
    """Handle gift sending to Mukuru users"""
    customer_id = session.get('customer_id')
    if not customer_id:
        return jsonify({'success': False, 'message': 'Not logged in'})
    
    customer = data_store.get_customer(customer_id)
    if not customer:
        return jsonify({'success': False, 'message': 'Customer not found'})
    
    gift_id = request.form.get('gift_id')
    recipient = request.form.get('gift_recipient', '').strip()
    recipient_mukuru_id = request.form.get('recipient_mukuru_id', '').strip()
    message = request.form.get('gift_message', '').strip()
    
    if not all([gift_id, recipient, recipient_mukuru_id]):
        return jsonify({'success': False, 'message': 'All fields are required'})
    
    # Mock gift costs
    gift_costs = {
        'airtime50': 50,
        'grocery100': 100,
        'fuel200': 200,
        'entertainment500': 500
    }
    
    gift_cost = gift_costs.get(gift_id or '', 0)
    
    if gift_cost == 0:
        return jsonify({'success': False, 'message': 'Invalid gift selected'})
    
    if customer['points_balance'] < gift_cost:
        return jsonify({'success': False, 'message': 'Insufficient points for this gift'})
    
    # Deduct points
    data_store.customers[customer_id]['points_balance'] -= gift_cost
    
    # In real app, create gift transaction record and send notification to recipient
    
    return jsonify({
        'success': True,
        'message': f'Gift sent successfully to {recipient}! They will receive a notification.'
    })

@app.errorhandler(500)
def internal_error(error):
    return render_template('index.html'), 500
