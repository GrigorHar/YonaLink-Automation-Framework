const { spawn } = require('child_process');
const { exec } = require('child_process');

// Function to find an available port
function findAvailablePort(startPort = 9323) {
  return new Promise((resolve) => {
    const net = require('net');
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
    
    server.on('error', () => {
      findAvailablePort(startPort + 1).then(resolve);
    });
  });
}

// Function to open browser
function openBrowser(url) {
  const start = process.platform === 'darwin' ? 'open' : 
                process.platform === 'win32' ? 'start' : 'xdg-open';
  
  exec(`${start} ${url}`, (error) => {
    if (error) {
      console.log(`Please open your browser and go to: ${url}`);
    }
  });
}

// Main function
async function main() {
  try {
    const port = await findAvailablePort();
    const url = `http://localhost:${port}`;
    
    console.log(`🚀 Starting Playwright report server on ${url}`);
    console.log('📊 Report will open automatically in your browser...');
    
    // Start the report server
    const reportProcess = spawn('npx', ['playwright', 'show-report', '--host', 'localhost', '--port', port.toString()], {
      stdio: 'inherit',
      shell: true
    });
    
    // Wait a moment for server to start, then open browser
    setTimeout(() => {
      openBrowser(url);
    }, 2000);
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down report server...');
      reportProcess.kill();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Error starting report server:', error.message);
    process.exit(1);
  }
}

main();
