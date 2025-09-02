from datetime import datetime
import uuid

# In-memory storage for the application
class DataStore:
    def __init__(self):
        self.customers = {}
        self.transactions = {}
        self.rewards = {}
        self.redemptions = {}
        self._init_sample_data()
    
    def _init_sample_data(self):
        # Initialize sample customers
        self.customers = {
            "1": {
                "id": "1",
                "name": "John Doe",
                "email": "john.doe@email.com",
                "phone": "+27123456789",
                "points_balance": 0,
                "tier": "Bronze",
                "joined_date": datetime.now().isoformat()
            },
            "2": {
                "id": "2",
                "name": "Sarah Smith",
                "email": "sarah.smith@email.com",
                "phone": "+27987654321",
                "points_balance": 0,
                "tier": "Bronze",
                "joined_date": datetime.now().isoformat()
            },
            "3": {
                "id": "3",
                "name": "Michael Johnson",
                "email": "michael.j@email.com",
                "phone": "+27555666777",
                "points_balance": 0,
                "tier": "Bronze",
                "joined_date": datetime.now().isoformat()
            }
        }
        
        # Initialize rewards catalog
        self.rewards = {
            "1": {
                "id": "1",
                "name": "R50 Airtime Voucher",
                "description": "Top up your phone with R50 airtime",
                "points_cost": 50,
                "category": "Airtime",
                "image_url": "https://pixabay.com/get/g771e5a88046d7b4af608a63d7c3536fd00207e983f2c4b83fd8a989b53e0a944bd47c37cddbea986a7976b2358fc536633fc736dccff55db344aa41b4d33dc18_1280.jpg",
                "available": True
            },
            "2": {
                "id": "2",
                "name": "R100 Grocery Voucher",
                "description": "Shop for groceries with this R100 voucher",
                "points_cost": 100,
                "category": "Grocery",
                "image_url": "https://pixabay.com/get/gb3be1765ddc3a29af2788f60782f804bfb810a81b3921037a0242797981f34c445814e39ebc0149dfae4bc5f3d0dfbbeb746ce8992ce30ac694cef79d05264ea_1280.jpg",
                "available": True
            },
            "3": {
                "id": "3",
                "name": "R200 Fuel Voucher",
                "description": "Fill up your tank with this R200 fuel voucher",
                "points_cost": 200,
                "category": "Fuel",
                "image_url": "https://pixabay.com/get/g0d06557dec40d414105b334be76d2b0e1099078bd7011acb8490560095640ea8aaf66ea84b1ead729e4cbeb3e185864ac84f5e4b9c24b1751ac1858deb23f1e9_1280.jpg",
                "available": True
            },
            "4": {
                "id": "4",
                "name": "Movie Tickets (2x)",
                "description": "Enjoy a night out with 2 movie tickets",
                "points_cost": 150,
                "category": "Entertainment",
                "image_url": "https://pixabay.com/get/g0721e2ce8d1c301fafdd58d4631d04b9e639ef008f24fdd32b3dc67207197aed0fc6da0a2ca091228a7691f9be26b4189fdf7d70652b82c6ff85e8325a384953_1280.jpg",
                "available": True
            },
            "5": {
                "id": "5",
                "name": "R500 Shopping Voucher",
                "description": "Premium shopping voucher for your favorite stores",
                "points_cost": 500,
                "category": "Shopping",
                "image_url": "https://pixabay.com/get/g54ae655bd70006c6d4181e0fc066c3475e54f52cdbeb030799aaea67cf901ba942c561a4c0afa150aca9c83ee0f2016a9a908c024641a918bf783a80065ea02f_1280.jpg",
                "available": True
            },
            "6": {
                "id": "6",
                "name": "Weekend Getaway Voucher",
                "description": "R1000 voucher for a weekend getaway",
                "points_cost": 1000,
                "category": "Travel",
                "image_url": "https://pixabay.com/get/g06178f99c0b77ead5d41935dff253d5bddad10910c29bb970f49d8171340945511312bbd89b9dee00fc7e87e77298c90dd056cd3fcdc2e1f7417ed9452844900_1280.jpg",
                "available": True
            }
        }
    
    def get_customer(self, customer_id):
        return self.customers.get(customer_id)
    
    def get_all_customers(self):
        return list(self.customers.values())
    
    def update_customer_points(self, customer_id, points_to_add):
        # normalize and guard
        try:
            points_to_add = int(points_to_add)
        except Exception:
            points_to_add = 0
        if points_to_add < 0:
            points_to_add = 0
        if customer_id in self.customers:
            self.customers[customer_id]["points_balance"] += points_to_add
            # Update tier based on points
            self._update_customer_tier(customer_id)
            return self.customers[customer_id]
        return None
    
    def _update_customer_tier(self, customer_id):
        if customer_id in self.customers:
            points = self.customers[customer_id]["points_balance"]
            if points >= 1000:
                self.customers[customer_id]["tier"] = "Gold"
            elif points >= 500:
                self.customers[customer_id]["tier"] = "Silver"
            else:
                self.customers[customer_id]["tier"] = "Bronze"
    
    def add_transaction(self, customer_id, amount, recipient, points_earned, destination_country=None, verification_method=None, verification_value=None):
        transaction_id = str(uuid.uuid4())
        transaction = {
            "id": transaction_id,
            "customer_id": customer_id,
            "amount": amount,
            "recipient": recipient,
            "points_earned": points_earned,
            "destination_country": destination_country,
            "verification_method": verification_method,
            "verification_value": verification_value,
            "timestamp": datetime.now().isoformat(),
            "type": "remittance"
        }
        self.transactions[transaction_id] = transaction
        return transaction
    
    def get_customer_transactions(self, customer_id):
        return [t for t in self.transactions.values() if t["customer_id"] == customer_id]
    
    def get_all_rewards(self):
        return list(self.rewards.values())
    
    def get_reward(self, reward_id):
        return self.rewards.get(reward_id)
    
    def redeem_reward(self, customer_id, reward_id):
        customer = self.get_customer(customer_id)
        reward = self.get_reward(reward_id)
        
        if not customer or not reward:
            return None, "Customer or reward not found"
        
        if customer["points_balance"] < reward["points_cost"]:
            return None, "Insufficient points"
        
        # Deduct points
        self.customers[customer_id]["points_balance"] -= reward["points_cost"]
        
        # Create redemption record
        redemption_id = str(uuid.uuid4())
        redemption = {
            "id": redemption_id,
            "customer_id": customer_id,
            "reward_id": reward_id,
            "points_used": reward["points_cost"],
            "timestamp": datetime.now().isoformat(),
            "status": "completed"
        }
        self.redemptions[redemption_id] = redemption
        
        return redemption, "Reward redeemed successfully"

# Global data store instance
data_store = DataStore()
