var queryModule = {};

var createQuery = `IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'billing')
BEGIN
CREATE TABLE billing (
    id INT IDENTITY(1,1) PRIMARY KEY,   
    firstname VARCHAR(100) NOT NULL default '',       
    lastname VARCHAR(100)  NOT NULL default '',     
    amount INT NULL,     
) 
END `;

queryModule.prepareGetQuery = function () {
    var selectQuery = 'select * from billing';
    return `${createQuery}${selectQuery}`;
}

queryModule.prepareBulkQuery = function (count) {

    var temp = [];

    for (var i = 1; i <= count; i++) {
        var str = `('firstname-${i}' , 'lastname-${i}' , ${i * 100})`;
        temp.push(str);
    }

    var joinStr = temp.join(',');

    var selectQuery = `INSERT INTO billing ( firstname, lastname , amount ) VALUES ${joinStr};`;
    return `${createQuery}${selectQuery}`;
}

module.exports = queryModule;