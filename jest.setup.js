// Establish global mocks for tests, particularly config objects
process.env.JWT_SECRET = 'test_secret_key';
process.env.JWT_EXPIRES_IN = '1h';
process.env.MONGO_URI = 'mongodb://localhost:27017/kestrel_test';
process.env.PORT = '3002';
process.env.PINECONE_API_KEY = 'test_pinecone_key';
process.env.PINECONE_HOST = 'test_pinecone_host';
process.env.PINECONE_INDEX_NAME = 'test_index_name';
process.env.OPENAI_API_KEY = 'test_openai_key';
