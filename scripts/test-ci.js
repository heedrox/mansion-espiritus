#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Configuration for CI environment
const CI_TIMEOUT = process.env.timeout || 60000; // 1 minute default
const OPEN_AI_KEY = process.env.OPEN_AI_KEY;

console.log('🚀 Starting CI test suite...');
console.log(`⏱️  Timeout configured: ${CI_TIMEOUT}ms`);
console.log(`🔑 OpenAI Key available: ${OPEN_AI_KEY ? 'Yes' : 'No'}`);

// Function to run tests with timeout
function runTests(testPattern = '', options = {}) {
    return new Promise((resolve, reject) => {
        const args = [
            'test',
            '--require', './test/common.js',
            '--require', 'source-map-support/register',
            'test/**/*.spec.js'
        ];

        if (testPattern && !options.invert) {
            args.push('--grep', testPattern);
        }

        if (options.invert) {
            args.push('--grep', testPattern, '--invert');
        }

        const testProcess = spawn('npm', args, {
            stdio: 'inherit',
            env: {
                ...process.env,
                MOCHA_TIMEOUT: Math.min(CI_TIMEOUT, 60000).toString(),
                NODE_OPTIONS: '--max-old-space-size=4096'
            }
        });

        const timeout = setTimeout(() => {
            console.log('⏰ Test timeout reached, terminating...');
            testProcess.kill('SIGTERM');
            reject(new Error('Test timeout'));
        }, Math.min(CI_TIMEOUT + 10000, 2147483647)); // Max 32-bit signed integer

        testProcess.on('close', (code) => {
            clearTimeout(timeout);
            if (code === 0) {
                console.log('✅ Tests completed successfully');
                resolve();
            } else {
                console.log(`❌ Tests failed with code ${code}`);
                reject(new Error(`Tests failed with code ${code}`));
            }
        });

        testProcess.on('error', (error) => {
            clearTimeout(timeout);
            console.log('❌ Test process error:', error.message);
            reject(error);
        });
    });
}

// Main execution
async function main() {
    try {
        // Run non-AI tests first
        console.log('\n📋 Running non-AI tests...');
        await runTests('DroneResponseGenerator', { invert: true });
        
        // Run AI tests if API key is available
        if (OPEN_AI_KEY) {
            console.log('\n🤖 Running AI tests...');
            await runTests('DroneResponseGenerator.*Dron Johnson');
        } else {
            console.log('\n⚠️  Skipping AI tests (no API key)');
        }
        
        console.log('\n🎉 All tests completed!');
        process.exit(0);
    } catch (error) {
        console.error('\n💥 Test suite failed:', error.message);
        process.exit(1);
    }
}

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, cleaning up...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, cleaning up...');
    process.exit(0);
});

main(); 