// Create a configuration object for our Azure SQL connection parameters
var dbConfig = {
    server: process.env.DB_CONFIG_SERVER || "nagp-demo.database.windows.net", // Use your SQL server name
    database:  process.env.DB_DATABASE || "nagpdemo", // Database to connect to
    user: process.env.USER || "nagpdemo", // Use your username
    password: process.env.password || "mbuserPassw0rd", // Use your password
    port: 1433,
    // Since we're on Windows Azure, we need to set the following options
    options: {
        encrypt: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

module.exports = dbConfig;