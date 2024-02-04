const blessed = require('blessed');
const chalk = require('chalk');
const { spawn } = require('child_process');
const os = require('os');
const moment = require('moment');
const figlet = require('figlet');

// Create a screen object.
const screen = blessed.screen({
  smartCSR: true,
  title: 'Rukiree'
});

// Create a box that fills the entire screen.
const box = blessed.box({
  top: 0,
  left: 0,
  width: '80%',
  height: '100%-1',
  content: '',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: '#FFFFFF'
    },
  }
});

// Create a console box at the top right.
const consoleBox = blessed.log({
  top: 0,
  right: 0,
  width: '20%',
  height: '100%-1',
  content: '{underline}Console:{/underline}',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: '#FFFFFF'
    },
  }
});

// Append our boxes to the screen.
screen.append(box);
screen.append(consoleBox);

let bot = null;
let botStartTime = null;
let lastButtonUsed = null;
let botStatus = 'Offline';
let botUsername = 'Rukiree#7157'; // Replace with your bot's username


let prefix = "/"; // Replace with your bots prefix Default prefix.

// Function to start the Discord bot.
function startBot() {
  if (bot) {
    writeToConsole(chalk.red('Bot is already running. Please stop the bot first.'));
    return;
  }

  // Modify this line to start your bot with the correct command and arguments
  bot = spawn('node', ['src/index.js'], {
    stdio: ['pipe', 'pipe', 'pipe', 'pipe', 'pipe', 'pipe', process.stderr],
    env: { ...process.env, PREFIX: prefix } // Set the PREFIX environment variable to the prefix value
  });

  botStartTime = moment();
  botStatus = 'Online';

  updateStats(); // Update the box content with system and bot stats
  lastButtonUsed = 'S';

  bot.on('error', (err) => {
    writeToConsole(chalk.red(`Error starting bot: ${err.message}`));
  });

  // Pipe the bot's stdout and stderr to the console
  bot.stdout.on('data', (data) => {
    writeToConsole(data.toString());
  });

  bot.stderr.on('data', (data) => {
    writeToConsole(chalk.red(data.toString()));
  });
}

// Function to stop the Discord bot.
function stopBot() {
  if (!bot) {
    writeToConsole(chalk.red('Bot is not running. Please start the bot first.'));
    return;
  }

  writeToConsole(chalk.red('Stopping bot...'));

  bot.kill();
  bot = null;
  botStatus = 'Offline';
  lastButtonUsed = 'X';

  botStartTime = null; // Reset the bot's start time

  setTimeout(() => {
    updateStats(); // Update the box content with system and bot stats after stopping the bot
  }, 1000);
}

// Function to restart the Discord bot.
function restartBot() {
  stopBot();

  setTimeout(() => {
    startBot();
    writeToConsole(chalk.green('Bot restarted successfully.'));
  }, 2000);
}


// Function to write to the console.
function writeToConsole(data) {
  consoleBox.log(chalk.green(data));
  screen.render();
}

// Function to update the box content with system and bot stats
function updateStats() {
  const systemUptime = serverUptime(os.uptime()); // Get the operating system's uptime

  const uptime = botStartTime ? moment().diff(botStartTime, 'seconds') : 0;
  const systemStats = `${chalk.magenta('System Stats')}\n` +
    `Platform: ${os.platform()}\n` +
    `CPU: ${os.cpus()[0].model}\n` +
    `Memory: ${Math.round(os.totalmem() / (1024 * 1024 * 1024))} GB\n` +
    `Uptime: ${systemUptime}\n\n`;

  const botMemoryUsage = process.memoryUsage().heapUsed / (1024 * 1024); // Bot's RAM usage in MB

  const prefixDisplay = botStatus === 'Online' ? prefix : 'No prefix';

  box.setContent(`${title}\n\n` +
    `${chalk.rgb(255,255,255)('Bot Status:')} ${botStatus === 'Online' ? chalk.green(botStatus) : chalk.red(botStatus)}\n\n` +
    `${chalk.rgb(255,255,255)('Bot Prefix:')} ${chalk.rgb(255,255,255)(prefixDisplay)}\n` +
    `${chalk.rgb(255,255,255)('Bot Username:')} ${chalk.rgb(255,255,255)(botUsername)}\n\n` +
    `${chalk.rgb(255,255,255)('Server Uptime:')} ${chalk.green(systemUptime)}\n` +
    `${chalk.rgb(255,255,255)('Total Memory:')} ${chalk.green(`${Math.round(os.totalmem() / (1024 * 1024 * 1024))} GB`)}\n` +
    `${chalk.rgb(255,255,255)('Bot Uptime:')} ${chalk.green(serverUptime(uptime))}\n` +
    `${chalk.rgb(255,255,255)('Bot Memory Usage:')} ${chalk.red(`${botMemoryUsage.toFixed(2)} MB`)}\n` +
    `${chalk.rgb(255,255,255)('CPU Cores:')} ${chalk.rgb(255,255,255)(os.cpus().length)}\n` +
    `${chalk.rgb(255,255,255)('OS Info:')} ${chalk.rgb(255,255,255)(`${os.platform()} (${os.release()})`)}\n\n` +
    `${chalk.green('Commands:')}\n` +
    `${chalk.rgb(255,255,255)('S')} - ${chalk.rgb(255,255,255)('Start Bot')}\n` +
    `${chalk.rgb(255,255,255)('X')} - ${chalk.rgb(255,255,255)('Stop Bot')}\n` +
    `${chalk.rgb(255,255,255)('R')} - ${chalk.rgb(255,255,255)('Restart Bot')}\n` +
    `${chalk.rgb(255,255,255)('L')} - ${chalk.rgb(255,255,255)('Refresh Console')}\n` +
    `${chalk.rgb(255,255,255)('Last Button Used:')} ${chalk.red(lastButtonUsed || 'None')}\n\n` +
    `${chalk.rgb(255,255,255)('Press')} ${chalk.green('Ctrl+C')} ${chalk.rgb(255,255,255)('to exit.')}`
  );
  screen.render();
}

// Function to format server uptime in human-readable format
function serverUptime(uptime) {
  const duration = moment.duration(uptime, 'seconds');
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  return uptimeString;
}

// Generate the ASCII art title
const title = chalk.rgb(255,255,255)(figlet.textSync('Rukiree', { font: 'Standard', horizontalLayout: 'default' }));

// Handle key events
screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0);
});

screen.key(['s'], function (ch, key) {
  startBot();
});

screen.key(['x'], function (ch, key) {
  stopBot();
});

screen.key(['r'], function (ch, key) {
  restartBot();
});

screen.key(['l'], function (ch, key) {
  consoleBox.setContent('{underline}Console{/underline}');
  screen.render();
});

// Set layout and positioning of boxes
screen.append(box);
box.position.width = '80%';

screen.append(consoleBox);
consoleBox.position.width = '20%';
consoleBox.position.right = 0;

// Initial rendering
box.setContent(title);
updateStats();

// Render the screen
screen.render();

// Enable the mouse for the screen
screen.enableMouse();

// Enable input for the screen
screen.key(['escape', 'q', 'C-c'], function (ch, key) {
  return process.exit(0);
});

// Auto-update stats every second
setInterval(() => {
  updateStats();
}, 1000);
