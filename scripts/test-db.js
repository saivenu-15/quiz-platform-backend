const mongoose = require('mongoose');
const dns = require('dns');
const { promisify } = require('util');
require('dotenv').config();

const resolveDns = promisify(dns.resolve);

async function diagnostic() {
    console.log('🔍 Starting Database Connectivity Diagnostic...\n');

    // 1. Check Env Variables
    console.log('--- Step 1: Environment Check ---');
    const uri = process.env.MONGO_URI;
    if (!uri) {
        console.error('❌ MONGO_URI is missing from .env file.');
        process.exit(1);
    }
    console.log('✅ MONGO_URI is present.');

    // 2. DNS Resolution Test
    console.log('\n--- Step 2: DNS Resolution Test ---');
    try {
        const url = new URL(uri.replace('mongodb+srv://', 'http://'));
        const hostname = url.hostname;
        console.log(`📡 Resolving hostname: ${hostname}`);
        const addresses = await resolveDns(hostname);
        console.log(`✅ Success! Resolved to: ${addresses.join(', ')}`);
    } catch (err) {
        console.error(`❌ DNS Resolution Failed: ${err.message}`);
        console.log('💡 Tip: This often happens on restricted networks (like universities) that block custom DNS or Atlas domains.');
    }

    // 3. Mongoose Connection Test
    console.log('\n--- Step 3: MongoDB Connection Test ---');
    console.log('⌛ Attempting to connect to Atlas (this may take up to 30s)...');
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout
        });
        console.log('✅ SUCCESS! Connected to MongoDB Atlas.');
    } catch (err) {
        console.error(`❌ Connection Failed: ${err.message}`);
        if (err.message.includes('MongooseServerSelectionError')) {
            console.log('\n🚨 DIAGNOSIS: Network Block Detected.');
            console.log('The server is reachable via DNS, but the firewall is blocking the MongoDB protocol (Port 27017).');
        } else {
            console.log(`\n🚨 DIAGNOSIS: ${err.name}`);
        }
    } finally {
        await mongoose.disconnect();
        console.log('\n--- Diagnostic Finished ---');
    }
}

diagnostic();
