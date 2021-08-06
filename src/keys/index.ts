import * as fs from 'fs';
import * as path from 'path';
import * as NodeRSA from 'node-rsa';

const privateKeyFilePath = path.resolve(
  __dirname,
  '../../src/keys/private_key.pem',
);

const publicKeyFilePath = path.resolve(
  __dirname,
  '../../src/keys/public_key.pem',
);

let privateCert, publicCert;
try {
  privateCert = fs.readFileSync(privateKeyFilePath);
  publicCert = fs.readFileSync(publicKeyFilePath);
} catch (e) {
  const key = new NodeRSA();
  key.generateKeyPair();
  privateCert = key.exportKey('pkcs1-private-pem');
  publicCert = key.exportKey('pkcs8-public-pem');
  fs.writeFileSync(privateKeyFilePath, privateCert);
  fs.writeFileSync(publicKeyFilePath, publicCert);
}

export { privateCert, publicCert };
