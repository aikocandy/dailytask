const crypto = require('crypto');
const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const readlineSync = require('readline-sync');

const inputFilePath = '/Users/admin/Desktop/testwallet/wallet.csv'; // 입력 CSV 파일 경로
const outputFilePath = '/Users/admin/Desktop/testwallet/wallet.csv'; //  출력 CSV 파일 경로
const columnIndex = 'privateKey'; // 암호화가 필요한 컬럼의 컬럼명

// 암호화 기능
function encrypt(text, secretKey) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}


function getKeyFromUser() {
    const key = readlineSync.question('请输入密码: ', {
        hideEchoBack: true,
    });
    return crypto.createHash('sha256').update(String(key)).digest('base64').substr(0, 32);
}

function encryptColumnInCsv(inputFilePath, outputFilePath, privateKey) {
    const secretKey = getKeyFromUser();
    const results = [];

    fs.createReadStream(inputFilePath)
        .pipe(csv())
        .on('data', (row) => {
            if (row[privateKey]) {
                row[privateKey] = encrypt(row[privateKey], secretKey);
            }
            results.push(row);
        })
        .on('end', () => {
            const csvWriter = createCsvWriter({
                path: outputFilePath,
                header: Object.keys(results[0]).map((key) => ({ id: key, title: key })),
            });
            csvWriter.writeRecords(results)
                .then(() => {
                    console.log('文档加密完成');
                });
        });
}


encryptColumnInCsv(inputFilePath, outputFilePath, columnIndex);
