import unittest
from flask import Flask
from app import *

class TestAppConfig(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.client = self.app.test_client()

    def test_app_exists(self):
        self.assertIsInstance(self.app, Flask)

    def test_secret_key_set(self):
        self.assertTrue(self.app.secret_key)
        self.assertNotEqual(self.app.secret_key, "")

    def test_cors_enabled(self):
        # CORS headers should be present in a response
        response = self.client.get("/")
        self.assertIn("Access-Control-Allow-Origin", response.headers)

    def test_index_route(self):
        # Assumes there is an index route ('/')
        response = self.client.get("/")
        self.assertIn(response.status_code, [200, 302, 404])  # Accepts 404 if no route defined

if __name__ == "__main__":
    unittest.main()